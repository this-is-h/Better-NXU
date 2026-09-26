/**
 * h.notification.js Toast 接入助手
 * 对应 1.x：Better NXU.user.js 行 172-202（AddNotification / Basic / openTab）
 * 依赖：@require 的 h.notification.js 运行时全局（addToast / createToast / removeToast / ToastCss / CAT_userConfig）
 * 入口/被谁调用：composables/use-app-page.js（挂页时调 installNotification）、各 sites/pages（调 toast 等）
 *
 * 注入模型说明（02 §5 / §8）：
 *  h.notification.js 不是 npm 包，是 ScriptCat 自家库（https://scriptcat.org/lib/1405/1.0.7/h.notification.js），
 *  仍走头部手动 @require + sha384（保留 1.x 渠道）。它在脚本主体执行前先注入下列全局到页面真实 window
 *  （ScriptCat 默认 @inject-into page，unsafeWindow === window，见 §6.5）：
 *    - addToast()       初始化 Toast 容器/样式骨架（幂等）
 *    - createToast(type, message, duration)  弹一条提示，返回 toast 句柄
 *    - removeToast(handle)  移除指定 toast
 *    - ToastCss         Toast 基础样式字符串（const）
 *    - CAT_userConfig() ScriptCat 原生配置面板入口（由库提供）
 *
 * 命名避坑：本模块**不**用与 h.notification 全局同名的本地导出（避免闭包内裸 `createToast` 指向自身
 *  而非注入的全局）。导出用 `toast / removeToastHandle / installNotification` 等别名，内部一律经
 *  `unsafeWindow.<global>` 或 `globalThis.<global>` 取运行时注入的实现。
 *
 * 1.x 的页面全局回调已由模块调用和普通链接取代。只有 CAT_userConfig 没有 URL 入口，仍由 @require bridge 提供。
 * betterNXUVersionClick 原走 fetch 一言被沙箱同源策略拦，2.0 改走 GM.xmlHttpRequest + 已有 @connect v1.hitokoto.cn。
 *
 * 边界（02 §3）：本模块不得 import sites/；可 import utils（纯函数）。此处只用 unsafeWindow 全局与 GM_*；
 *  toastError 留到 composables（02 §6.3），本层不引。
 *
 * GM API 与 unsafeWindow 通过 vite-plugin-monkey 官方 ESM 客户端别名 #gm 导入。CAT_userConfig 是
 * ScriptCat 非标准 grant，由 vite.config.js 的 @require bridge 显式挂到真实 page window。
 */
import { GM, GM_addStyle, unsafeWindow } from '#gm';
import { installFontAwesome } from './fontawesome.js';
import { MyConsole } from '../utils/console.js';
import { escapeHtml } from '../utils/file.js';

const console = MyConsole('[notification]');

/** 取 h.notification.js 注入到页面真实 window 的全局（page 模型 unsafeWindow === window，见 §6.5）。 */
const global = unsafeWindow ?? window;

/** @private 幂等标志：installNotification 已执行过 ToastCss/FontAwesome 注入折叠。 */
let installed = false;

/**
 * 安装 h.notification Toast 体系到页面：仅做一次。
 * 对应 1.x 行 172-183（AddNotification）。
 *
 * 幂等：重复调用只重设回调，不重复 addToast（h.notification 的 addToast 内部幂等，但仍防重复 GM_addStyle ToastCss）。
 */
export function installNotification() {
  // === 1. Toast 容器/样式（1.x 行 174-178）===
  // addToast 由 h.notification.js 注入的全局提供（初始化 Toast DOM 骨架）。
  if (typeof global.addToast === 'function') {
    global.addToast();
  } else {
    // 头部 @require 失败或被 ScriptCat 因 sha 不符拒载时不致命：记日志，
    // 后续 toast 调用走兜底（见 toast 的实现），不再阻断页面脚本。
    console('h.notification.js 的 addToast 未就绪（@require 可能被 ScriptCat 拒载）', undefined, 'warn');
  }
  // ToastCss 同为 h.notification.js 注入的全局常量；存在则注入，缺则跳过（1.x 行 176）。
  // 防重复 GM_addStyle：installed 标志位第一次后才注入 ToastCss。
  if (!installed && typeof global.ToastCss === 'string') {
    GM_addStyle?.(global.ToastCss);
  }

  // === 2. FontAwesome 图标样式（1.x 行 178，与 AddNotification 同函数内注入）===
  //  h.notification 的 toast 图标用 FontAwesome class（FA 字体），FA 样式靠 @resource svg-logo 改写后注入。
  //  1.x AddNotification 行 178 内联注入，故所有 Basic() 调用点都自带 FA。2.0 拆出 fontawesome.js 后若不在
  //  installNotification 内调，登录页/ids 页等不走 mountAppPage 的页面会漏注入 FA → toast 图标变豆腐/不显示。
  //  故此处并入 installNotification（与 1.x 同函数等价），installFontAwesome 内置幂等且 svg-logo 未就绪时静默跳过。
  if (!installed) installFontAwesome();

  installed = true;
}

/**
 * 点击版本号弹一言——1.x 行 2901-2912 用 fetch 被沙箱拦；2.0 改用官方 Promise API GM.xmlHttpRequest。
 * 失败时 toast 兜底（1.x 行 2911 行为保留）。
 */
export function betterNXUVersionClick() {
  if (typeof GM?.xmlHttpRequest !== 'function') {
    toast('warning', '一言暂时不可用，请稍后重试', 3);
    return;
  }
  void GM.xmlHttpRequest({
    method: 'GET',
    url: 'https://v1.hitokoto.cn/',
    // @connect v1.hitokoto.cn 已在头部声明，沙箱下放行跨域。
  })
    .then((response) => {
      try {
        const json = JSON.parse(response.responseText);
        const text = json?.hitokoto ? `${json.hitokoto}\n——${json.from || ''}` : '之前点的太快啦，请稍后重试';
        toast('info', text, 3);
      } catch {
        toast('info', '之前点的太快啦，请稍后重试', 3);
      }
    })
    .catch(() => {
      toast('warning', '一言暂时不可用，请稍后重试', 3);
    });
}

/**
 * 包装 h.notification.js 的 createToast。若 @require 未就绪则降级 console.warn，不抛错（避免阻断页面逻辑）。
 * @param {string} type - 'info' | 'warning' | 'error' | 'success' 等（h.notification 约定）
 * @param {string} message - 提示文案
 * @param {number} [duration] - 显示秒数（0 表示不自动关闭，1.x 行 4467 用 0 做常驻 toast）
 * @returns {*} toast 句柄（供 removeToastHandle 使用）
 */
export function toast(type, message, duration) {
  return toastTrustedHtml(type, escapeHtml(String(message ?? '')), duration);
}

/** 仅用于项目静态构造的配置入口 HTML；文件名、接口响应和错误消息必须调用 toast。 */
export function toastTrustedHtml(type, message, duration) {
  const impl = global.createToast;
  if (typeof impl === 'function') return impl(type, message, duration);
  // 兜底：@require 未就绪时不阻断，记日志即可。
  console('createToast 全局未就绪，降级记日志', { type, message }, 'warn');
  return null;
}

/**
 * 包装 h.notification.js 的 removeToast。
 * @param {*} handle createToast 返回的句柄
 */
export function removeToastHandle(handle) {
  const impl = global.removeToast;
  if (typeof impl === 'function') impl(handle);
}
