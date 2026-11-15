import { mountToaster, toast as dingToast } from '@yusufceng1z/ding';
import { GM, GM_addStyle } from '#gm';
import { getGMValue } from '../config/gm-store.js';
import { installFontAwesome } from './fontawesome.js';

const TOAST_CONFIG = {
  position: 'top-center',
  theme: 'system',
  sound: true,
  volume: 0.5,
};
const TOAST_STYLE = `
.tst-viewport .tst[data-type=success] { --fill: #15803d; --on: #fff; --c: #fff; }
.tst-viewport .tst[data-type=error] { --fill: #dc2626; --on: #fff; --c: #fff; }
.tst-viewport .tst[data-type=warning] { --fill: #b45309; --on: #fff; --c: #fff; }
.tst-viewport .tst[data-type=info] { --fill: #1d4ed8; --on: #fff; --c: #fff; }
.tst-viewport .tst[data-type=loading] { --fill: #374151; --on: #fff; --c: #fff; }
`;

let unmount;
let viewport;
let styleInstalled = false;

export function installNotification() {
  if (!document.body) return;
  if (viewport?.isConnected) return;
  dingToast.configure({ ...TOAST_CONFIG, sound: getGMValue('Script.toastSound') });
  unmount?.();
  if (!styleInstalled) {
    GM_addStyle?.(TOAST_STYLE);
    styleInstalled = true;
  }
  installFontAwesome();
  unmount = mountToaster({
    position: TOAST_CONFIG.position,
    theme: TOAST_CONFIG.theme,
    labels: { region: '通知', dismiss: '关闭通知' },
  });
  viewport = [...document.querySelectorAll('.tst-viewport')].at(-1);
}

export function setToastSound(enabled) {
  dingToast.configure({ sound: enabled });
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

/** duration 沿用调用方的秒数；options 使用 Ding 原生选项。 */
export function toast(type, message, duration = type === 'loading' ? 0 : 5, options = {}) {
  installNotification();
  return dingToast.show(type, String(message ?? ''), { ...options, duration: duration * 1000 });
}

/** patch 使用 Ding 原生格式，duration 的单位为毫秒。 */
export function updateToastHandle(handle, patch) {
  if (handle) dingToast.update(handle, patch);
}

export function removeToastHandle(handle) {
  if (handle) dingToast.dismiss(handle);
}

export function toastPromise(task, messages) {
  installNotification();
  return dingToast.promise(task, messages);
}
