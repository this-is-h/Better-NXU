/**
 * ids/pages/re-auth.page — 统一认证二次验证页（Basic({vant:false}) + 自动通过微信二次验证）
 * 对应 1.x：Better NXU.user.js 行 2697-2703（webvpnCheck）+ 行 2510-2513（ids case 二次确认分支）
 * 依赖：libraries/notification（installNotification = Basic({vant:false})）、config/gm-store（getGMValue autoReLogin）、
 *       #gm（unsafeWindow 取页面 reAuthByCombined）、libraries/notification（toast）、utils/console
 * 入口/被谁调用：router 命中 ids/re-auth.page.js → main.js 调 register()

 * 1.x webvpnCheck 行 2697-2703：
 *   if (!getGMValue("WebVPN.autoReLogin")) return;
 *   createToast("info", `尝试自动登录...`);
 *   unsafeWindow.reAuthByCombined('weixin')
 *
 * unsafeWindow 通过 vite-plugin-monkey 官方 ESM 客户端取得，用于访问页面脚本注入的 reAuthByCombined。
 *
 * 1.x ids case 二次确认分支（行 2510-2513）：Basic({vant:false}) + webvpnCheck()；本 register 等价同序。
 *
 * 验收对齐（03 B5 验收 2）：ids 二次验证 与 1.x 一致（autoReLogin 开关门控 + 调页面 reAuthByCombined('weixin')）。
 */
import { installNotification, toast } from '../../../libraries/notification.js';
import { getGMValue } from '../../../config/gm-store.js';
import { unsafeWindow as grantedUnsafeWindow } from '#gm';
import { getContext } from '../../../context.js';
import { isTrustedIdsContext } from '../../../utils/route-guards.js';
import { MyConsole } from '../../../utils/console.js';

const console = MyConsole('[ids.re-auth]');
const pageWindow = grantedUnsafeWindow ?? window;

/**
 * 二次验证页入口：自动通过微信二次验证（autoReLogin 开启时）。1.x webvpnCheck 行 2697-2703 等价。
 */
export async function register() {
  console('进入二次确认页');
  // 防御性边界：路由误命中时也不调用非 IDS 页面提供的同名函数。
  if (!isTrustedIdsContext(getContext())) {
    console('拒绝在非统一认证页面执行二次认证', { href: window.location.href }, 'error');
    return;
  }
  // 1.x 行 2512 Basic({vant:false})：装 notification，不引 Vant。
  installNotification();
  // 1.x 行 2698-2700：autoReLogin 关闭则不处理。
  if (!getGMValue('WebVPN.autoReLogin')) return;
  toast('info', '尝试自动登录...');
  // 1.x 行 2702：调用页面注入的 reAuthByCombined('weixin') 自动通过二次验证。
  if (typeof pageWindow.reAuthByCombined === 'function') {
    pageWindow.reAuthByCombined('weixin');
  } else {
    console('页面未提供 reAuthByCombined 函数，无法自动通过二次验证', undefined, 'warn');
  }
}
