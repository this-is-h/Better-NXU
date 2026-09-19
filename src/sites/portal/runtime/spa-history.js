/**
 * portal/runtime/spa-history — 门户 SPA history 补丁
 * 对应 1.x：Better NXU.user.js 行 2334-2351（originalPushState/ReplaceState 捕获 + potalSwitchToFunc）+
 *          行 2436-2456（WebVPN 代理 portal 分支内粘贴块）、行 2524-2543（portal 直连分支内粘贴块）
 * 依赖：无 GM 依赖（纯 history/popstate API 补丁）；调用方传入的 onNavigate 回调实现页面注入逻辑
 * 入口/被谁调用：sites/portal/pages/hall.page.js（直连与 WebVPN 代理 portal 的统一入口）——
 *                call patchPortalHistory({onNavigate}) 一次，杜绝 1.x 两处粘贴。
 *
 * 1.x 在直连 portal 与 WebVPN 代理 portal 两处各粘贴一份完全相同的 history.pushState/replaceState/popstate
 * 补丁块。2.0 由统一 portal page 安装一次并传入实时路径回调，避免重复实现和重复补丁。
 *
 * 幂等关键：模块级缓存首次捕获的原始 history 方法。若本函数被同一页面调两次，第二次不重新捕获，
 * 而是追加 onNavigate 到监听器集合，避免已补丁函数成为新的 original 后链式触发自身。
 */
import { MyConsole } from '../../../utils/console.js';

const console = MyConsole('[portal-spa]');

let capturedPushState = null;
let capturedReplaceState = null;
const navigateCallbacks = new Set();
let popstateHandler = null;

/**
 * 给 history API 打补丁：把 pushState/replaceState 改写为先调原始方法、再触发所有已注册 onNavigate；
 * 并绑 popstate 监听处理浏览器前进/后退。
 *
 * 幂等：重复调用只追加 onNavigate 到集合，不重复重写 history 方法。第一次调用才真正打补丁。
 * @param {{onNavigate:()=>void}} options - onNavigate：导航发生时（pushState/replaceState/popstate）触发的回调
 */
export function patchPortalHistory({ onNavigate } = {}) {
  if (typeof onNavigate === 'function') {
    navigateCallbacks.add(onNavigate);
  }
  if (capturedPushState !== null && capturedReplaceState !== null) return;

  capturedPushState = history.pushState;
  capturedReplaceState = history.replaceState;

  let navigating = false;
  let rerunRequested = false;
  const fireCallbacks = () => {
    if (navigating) {
      rerunRequested = true;
      return;
    }
    navigating = true;
    const tasks = [...navigateCallbacks].map((cb) =>
      Promise.resolve()
        .then(() => cb())
        .catch((error) => console('onNavigate 回调抛错', error, 'warn'))
    );
    void Promise.all(tasks).finally(() => {
      navigating = false;
      if (rerunRequested) {
        rerunRequested = false;
        fireCallbacks();
      }
    });
  };

  history.pushState = function (...args) {
    const result = capturedPushState.apply(this, args);
    fireCallbacks();
    return result;
  };
  history.replaceState = function (...args) {
    const result = capturedReplaceState.apply(this, args);
    fireCallbacks();
    return result;
  };
  popstateHandler = fireCallbacks;
  window.addEventListener('popstate', popstateHandler);
}

/**
 * 取已注册的 onNavigate 回调数（仅供测试/诊断）。
 * @returns {number}
 */
export function getNavigateCallbackCount() {
  return navigateCallbacks.size;
}

/**
 * 仅测试用：重置内部状态（清缓存与回调集，并恢复 history 原方法）。生产代码不应调用。
 */
export function _resetPortalSpaForTest() {
  if (capturedPushState !== null && capturedReplaceState !== null) {
    history.pushState = capturedPushState;
    history.replaceState = capturedReplaceState;
  }
  if (popstateHandler) window.removeEventListener('popstate', popstateHandler);
  capturedPushState = null;
  capturedReplaceState = null;
  popstateHandler = null;
  navigateCallbacks.clear();
}
