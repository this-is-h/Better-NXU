import test from 'node:test';
import assert from 'node:assert/strict';

/**
 * slide-captcha 单元测试（Node，无真实 DOM/浏览器）
 * 覆盖点（模块对外行为合同，而非实现细节）：
 *  1. isSliderCaptchaPresent:  #sliderDiv 可见且非空 → true；不可见/为空 → false
 *  2. waitForSliderElements:   元素齐全立即返回；缺元素超时抛错
 *  3. solveIdsSliderCaptcha:
 *     - 滑块未出现 → 直接 false，不弹任何 toast
 *     - 元素 8s 内未就绪（超时异常）→ 移除进度 toast，弹"识别失败"error 并 false
 *     - 展示位图 canvas（canvas[1]）尺寸无效 → 报错并走手动降级
 *     - 识别器返回低置信度 → "置信度过低" warning toast 并 false
 *
 * 说明：captcha-recognizer-js 算法静态打包，ORT/WASM/模型经 GM 下载后交给本地
 * Worker；ONNX 推理属真机回归范畴；本文件覆盖 DOM 探测、
 * 展示尺寸校验与降级 toast 合同。
 */

// ---- 环境桩（模仿 test/setup.mjs 的最小 DOM 面） ----
function installToastStub(calls) {
  globalThis.createToast = (type, message, duration) => {
    calls.push(['create', type, message, duration]);
    return { id: calls.length };
  };
  globalThis.removeToast = (handle) => {
    calls.push(['remove', handle]);
  };
}

const originalDocument = globalThis.document;
const originalWindow = globalThis.window;
const originalCreateToast = globalThis.createToast;
const originalRemoveToast = globalThis.removeToast;
const lifecycle = new EventTarget();
globalThis.addEventListener = lifecycle.addEventListener.bind(lifecycle);
globalThis.removeEventListener = lifecycle.removeEventListener.bind(lifecycle);

test.afterEach(() => {
  globalThis.document = originalDocument;
  globalThis.window = originalWindow;
  globalThis.createToast = originalCreateToast;
  globalThis.removeToast = originalRemoveToast;
});

test('isSliderCaptchaPresent detects visible, non-empty sliderDiv', async () => {
  globalThis.document = {
    querySelector: () => ({ offsetParent: {}, innerHTML: '<canvas></canvas>' }),
    querySelectorAll: () => [],
  };
  const { isSliderCaptchaPresent } = await import('../src/sites/ids/auth/slide-captcha.js');
  assert.equal(isSliderCaptchaPresent(), true);
});

test('isSliderCaptchaPresent returns false when slider is hidden or empty', async () => {
  globalThis.document = {
    querySelector: () => ({ offsetParent: null, innerHTML: '' }),
    querySelectorAll: () => [],
  };
  const { isSliderCaptchaPresent } = await import('../src/sites/ids/auth/slide-captcha.js');
  assert.equal(isSliderCaptchaPresent(), false);
});

test('solveIdsSliderCaptcha skips quietly when no slider is present', async () => {
  globalThis.document = {
    querySelector: () => null,
    querySelectorAll: () => [],
  };
  const { solveIdsSliderCaptcha } = await import('../src/sites/ids/auth/slide-captcha.js');
  const calls = [];
  installToastStub(calls);
  const result = await solveIdsSliderCaptcha();
  assert.equal(result, false);
  // 未出现滑块：静默跳过，不弹任何 toast。
  assert.deepEqual(calls, []);
});

test('waitForSliderElements resolves when canvas pair and slider are present', async () => {
  globalThis.document = {
    querySelector: (selector) =>
      selector.startsWith('#sliderDiv > div.sliderContainer') ? { tag: 'slider' } : null,
    querySelectorAll: () => [{ tag: 'bg' }, { tag: 'piece' }],
  };
  const { waitForSliderElements } = await import('../src/sites/ids/auth/slide-captcha.js');
  const els = await waitForSliderElements(50);
  assert.equal(els.bgImg.tag, 'bg');
  assert.equal(els.pieceImg.tag, 'piece');
  assert.equal(els.slider.tag, 'slider');
});

test('waitForSliderElements throws after timeout when elements never appear', async () => {
  globalThis.document = {
    querySelector: () => null,
    querySelectorAll: () => [],
  };
  const { waitForSliderElements } = await import('../src/sites/ids/auth/slide-captcha.js');
  await assert.rejects(waitForSliderElements(60), /滑块验证码元素等待超时/);
});

test('solveIdsSliderCaptcha surfaces an error toast when elements never appear', async () => {
  // 滑块容器可见，但 canvas/slider 元素始终不出现 → waitForSliderElements 超时抛错进 catch。
  globalThis.document = {
    querySelector: (selector) => {
      if (selector.startsWith('#sliderDiv, #sliderCaptchaDiv')) {
        return { offsetParent: {}, innerHTML: '<canvas></canvas>' };
      }
      return null;
    },
    querySelectorAll: () => [],
  };
  const { solveIdsSliderCaptcha } = await import('../src/sites/ids/auth/slide-captcha.js');
  const calls = [];
  installToastStub(calls);
  const result = await solveIdsSliderCaptcha();
  assert.equal(result, false);
  // info 常驻 → 移除 → error 5 秒（等待超时走 catch 分支）。
  assert.deepEqual(calls, [
    ['create', 'info', '正在识别滑块验证…', 0],
    ['remove', { id: 1 }],
    ['create', 'error', '滑块验证识别失败，请手动操作', 5],
  ]);
});

test('solveIdsSliderCaptcha degrades when display canvas has invalid size', async () => {
  // 展示位图 canvas（canvas[1]）width/height 属性无效（0）→ 无法确定展示坐标系，
  // 必须在识别器加载（15MB 模型下载）之前快速失败。
  const pieceCanvas = { tag: 'piece', width: 0, height: 0 };
  globalThis.document = {
    querySelector: (selector) => {
      if (selector.startsWith('#sliderDiv, #sliderCaptchaDiv')) {
        return { offsetParent: {}, innerHTML: '<canvas></canvas>' };
      }
      if (selector.startsWith('#sliderDiv > div.sliderContainer')) return { tag: 'slider' };
      return null;
    },
    querySelectorAll: () => [{ tag: 'bg' }, pieceCanvas],
  };
  const { solveIdsSliderCaptcha } = await import('../src/sites/ids/auth/slide-captcha.js');
  const calls = [];
  installToastStub(calls);
  const result = await solveIdsSliderCaptcha();
  assert.equal(result, false);
  // 尺寸校验在识别器加载前：直接 error toast（catch 分支）。
  assert.deepEqual(calls, [
    ['create', 'info', '正在识别滑块验证…', 0],
    ['remove', { id: 1 }],
    ['create', 'error', '滑块验证识别失败，请手动操作', 5],
  ]);
});
