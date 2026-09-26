/**
 * snapdom WebVPN 兼容层。
 *
 * WebVPN 会影响 ScriptCat @require 作用域中的 DOM/CSS 序列化：snapdom 无法生成计算样式类，且
 * XMLSerializer 会把大小写敏感的 SVG foreignObject 写成 foreignobject。代理环境下先从真实页面
 * window 分批读取截图所需的计算样式并临时内联，截图完成后恢复；直连环境保持 snapdom 原生路径。
 */

let webVpnCaptureTail = Promise.resolve();

const STYLE_BATCH_SIZE = 32;

// WebVPN 的 getComputedStyle 会暴露约 1272 项属性。截图只需布局和视觉相关属性，逐项复制全部属性
// 会让较大的课表长时间占用主线程。这里保留表格、Flex/Grid、排版、绘制和 SVG 所需的计算值。
const CAPTURE_STYLE_PROPERTIES = Object.freeze(
  `
  accent-color
  align-content align-items align-self
  alignment-baseline appearance aspect-ratio
  backdrop-filter backface-visibility baseline-shift
  background-attachment background-blend-mode background-clip background-color background-image
  background-origin background-position-x background-position-y background-repeat-x background-repeat-y background-size
  border-bottom-color border-bottom-left-radius border-bottom-right-radius border-bottom-style border-bottom-width
  border-collapse border-image-outset border-image-repeat border-image-slice border-image-source border-image-width
  border-left-color border-left-style border-left-width border-right-color border-right-style border-right-width border-spacing
  border-top-color border-top-left-radius border-top-right-radius border-top-style border-top-width
  bottom box-decoration-break box-shadow box-sizing
  caption-side caret-color clear clip clip-path clip-rule color color-interpolation color-rendering color-scheme
  column-count column-fill column-gap column-rule-color column-rule-style column-rule-width column-span column-width
  contain content-visibility counter-increment counter-reset counter-set cursor
  cx cy d direction display dominant-baseline empty-cells
  fill fill-opacity fill-rule filter flex-basis flex-direction flex-grow flex-shrink flex-wrap float
  flood-color flood-opacity
  font-family font-feature-settings font-kerning font-optical-sizing font-size font-size-adjust font-stretch font-style
  font-synthesis font-variant font-variant-caps font-variant-east-asian font-variant-ligatures font-variant-numeric
  font-variation-settings font-weight forced-color-adjust
  gap grid-auto-columns grid-auto-flow grid-auto-rows grid-column-end grid-column-start grid-row-end grid-row-start
  grid-template-areas grid-template-columns grid-template-rows
  height hyphens image-rendering isolation justify-content justify-items justify-self
  left letter-spacing lighting-color line-break line-height
  list-style-image list-style-position list-style-type
  margin-bottom margin-left margin-right margin-top
  marker-end marker-mid marker-start
  mask-clip mask-composite mask-image mask-mode mask-origin mask-position mask-repeat mask-size mask-type
  max-height max-width min-height min-width mix-blend-mode object-fit object-position opacity order orphans
  outline-color outline-offset outline-style outline-width
  overflow-wrap overflow-x overflow-y
  padding-bottom padding-left padding-right padding-top paint-order perspective perspective-origin pointer-events position
  quotes r resize right rotate row-gap rx ry scale scrollbar-color scrollbar-gutter scrollbar-width
  shape-rendering stop-color stop-opacity
  stroke stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width
  table-layout tab-size
  text-align text-align-last text-anchor text-decoration-color text-decoration-line text-decoration-skip-ink
  text-decoration-style text-decoration-thickness text-emphasis-color text-emphasis-position text-emphasis-style
  text-indent text-justify text-orientation text-overflow text-rendering text-shadow text-transform
  text-underline-offset text-underline-position text-wrap-mode text-wrap-style
  top touch-action transform transform-box transform-origin transform-style translate
  unicode-bidi user-select vector-effect vertical-align visibility
  white-space white-space-collapse widows width word-break word-spacing writing-mode x y z-index zoom
  -webkit-font-smoothing -webkit-line-clamp -webkit-text-fill-color -webkit-text-size-adjust
  -webkit-text-stroke-color -webkit-text-stroke-width -webkit-writing-mode
`
    .trim()
    .split(/\s+/)
);

function enqueueWebVpnCapture(task) {
  const result = webVpnCaptureTail.then(task, task);
  webVpnCaptureTail = result.catch(() => undefined);
  return result;
}

function serializeComputedStyle(element, pageWindow, buffer) {
  const computed = pageWindow.getComputedStyle.call(pageWindow, element);
  buffer.cssText = '';

  for (const property of CAPTURE_STYLE_PROPERTIES) {
    let value = computed.getPropertyValue(property);
    if (!value) continue;
    // 计算宽度的小数序列化后可能略小于真实布局宽度（如 68.015625 → 68.0156px）。
    // 再次布局时会向下量化；教室末尾因此换行，而已固定的单行高度会让它覆盖周次。
    // 向上取整像素宽度，避免多次复制样式累计缩窄；保留字体和原有换行规则。
    if (property === 'width' && /^\d+(?:\.\d+)?px$/.test(value)) {
      value = `${Math.ceil(Number.parseFloat(value))}px`;
    }
    try {
      buffer.setProperty(property, value);
    } catch {
      // 部分浏览器只读或实验属性无法写入行内样式，忽略即可。
    }
  }

  buffer.setProperty('animation', 'none', 'important');
  buffer.setProperty('transition', 'none', 'important');
  return buffer.cssText;
}

function yieldToMainThread(pageWindow) {
  return new Promise((resolve) => {
    if (typeof pageWindow?.setTimeout === 'function') {
      pageWindow.setTimeout(resolve, 0);
    } else {
      globalThis.setTimeout(resolve, 0);
    }
  });
}

async function collectComputedStyles(elements, pageWindow) {
  const computedStyles = new Array(elements.length);
  const buffer = elements[0].ownerDocument.createElement('div').style;

  // 先让浏览器绘制“正在生成”提示；之后分批让出主线程，避免大课表冻结页面。
  await yieldToMainThread(pageWindow);
  for (let index = 0; index < elements.length; index++) {
    computedStyles[index] = serializeComputedStyle(elements[index], pageWindow, buffer);
    const hasMoreElements = index + 1 < elements.length;
    if (hasMoreElements && (index + 1) % STYLE_BATCH_SIZE === 0) {
      await yieldToMainThread(pageWindow);
    }
  }
  return computedStyles;
}

async function downloadWithWebVpnFix({ snapdom, target, options, pageWindow }) {
  const elements = [target, ...target.querySelectorAll('*')];
  const originalStyles = elements.map((element) => element.getAttribute('style'));

  const Serializer = pageWindow.XMLSerializer ?? globalThis.XMLSerializer;
  const serializerPrototype = Serializer?.prototype;
  const originalSerialize = serializerPrototype?.serializeToString;

  if (typeof originalSerialize !== 'function') {
    throw new Error('当前浏览器不支持 XMLSerializer，无法导出图片');
  }

  const fixedSerialize = function (node) {
    return originalSerialize.call(this, node).replace(/<(\/?)foreignobject(?=[\s>])/g, '<$1foreignObject');
  };

  try {
    // 先读取全部计算样式，再统一行内化，避免父节点尺寸影响后续子节点。
    const computedStyles = await collectComputedStyles(elements, pageWindow);
    elements.forEach((element, index) => {
      element.style.cssText = computedStyles[index];
    });
    serializerPrototype.serializeToString = fixedSerialize;

    return await snapdom.download(target, {
      ...options,
      // 失败捕获可能已把空样式写入 snapdom 持久缓存，WebVPN 路径每次强制重新计算。
      cache: 'disabled',
      // v3 新增捕获结果复用；页面 CSS 经 WebVPN hook 后不能复用之前的渲染结果。
      invalidate: true,
    });
  } finally {
    elements.forEach((element, index) => {
      const originalStyle = originalStyles[index];
      if (originalStyle === null) element.removeAttribute('style');
      else element.setAttribute('style', originalStyle);
    });
    if (serializerPrototype.serializeToString === fixedSerialize) {
      serializerPrototype.serializeToString = originalSerialize;
    }
  }
}

/**
 * 下载 snapdom 图片。WebVPN 适配会串行执行，防止并发导出互相覆盖临时行内样式和序列化器。
 * @param {object} params
 * @param {{download: Function}} params.snapdom snapdom 运行时
 * @param {Element} params.target 捕获目标
 * @param {object} params.options snapdom.download 参数
 * @param {boolean} [params.fixWebVpn=false] 是否启用 WebVPN 兼容处理
 * @param {Window} [params.pageWindow=window] 真实页面 window（不能使用 @require sandbox window）
 */
export function downloadSnapdomImage({
  snapdom,
  target,
  options = {},
  fixWebVpn = false,
  pageWindow = window,
}) {
  if (typeof snapdom?.download !== 'function') {
    return Promise.reject(new Error('snapdom 未加载，无法导出图片'));
  }
  if (!target || typeof target.querySelectorAll !== 'function') {
    return Promise.reject(new Error('图片导出目标不存在'));
  }
  // v3 默认嵌入字体会新增远程请求；保持既有系统字体导出和加载成本，调用方可显式开启。
  const captureOptions = { embedFonts: false, ...options };
  if (!fixWebVpn) return snapdom.download(target, captureOptions);

  return enqueueWebVpnCapture(() =>
    downloadWithWebVpnFix({ snapdom, target, options: captureOptions, pageWindow })
  );
}
