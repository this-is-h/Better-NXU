/**
 * ids/pages/callback.page — 微信回调修复 + ids 内嵌微信扫码代理分支
 * 对应 1.x：Better NXU.user.js 行 2720-2736（idsReLogin）+ 行 2705-2718（webvpnReLogin）+
 *           行 2514-2522（ids case 的扫码分支与 callback 分支）
 * 依赖：utils/context（getContext 取 query）、utils/webvpn-url（buildWebVpnUrl）、
 *       config/gm-store（autoReLogin 开关，仅扫码分支）、libraries/notification（toast/installNotification）、utils/console
 * 入口/被谁调用：router 命中 ids/callback.page.js → main.js 调 register()
 *   注：router 把 ids 上两类形态都命中本 page（见 router.js ids/callback entry 注释）——
 *       ① /authserver/callback → idsReLogin（重建 ids callback URL 跳回 WebVPN，仅当页面提示授权失败）
 *       ② URL 含 ...9269276d5966018.../connect/qrconnect → webvpnReLogin（重建 open.weixin URL 带 fast_login=1）
 *   02 §2 目录树注 callback.page.js "含 webvpn 代理内分支"即指形态 ②。

 * 1.x idsReLogin 行 2720-2736：
 *   const warning = document.querySelector("#welcome.warn");
 *   if (!warning || !warning.textContent.includes("授权失败")) return;
 *   createToast("info", `请稍候...`); createToast("info", `尝试跳转至正确页面`);
 *   const callback = new URL("https://ids.nxu.edu.cn/authserver/callback");
 *   callback.searchParams.set("code", GetQuery("code") || "");
 *   callback.searchParams.set("state", GetQuery("state") || "");
 *   const callbackUrl = buildWebVpnUrl(callback);
 *   if (!callbackUrl) { createToast("error","无法生成统一认证回调地址，请手动返回 WebVPN",5); return; }
 *   location.href = callbackUrl;
 *
 * 1.x webvpnReLogin 行 2705-2718：autoReLogin 门控 + 重建 open.weixin/connect/qrconnect 带 appid/redirect_uri/
 *   response_type=code/scope=snsapi_login/state/fast_login=1，location.href = target.href。
 *
 * 验收对齐（03 B5 验收 2）：ids 回调修复行为与 1.x 一致（仅当 "授权失败" 才重建跳转；失败时提示手动返回）。
 */
import { getContext } from '../../../context.js';
import { buildWebVpnUrl, WEBVPN_HOST_TOKENS } from '../../../utils/webvpn-url.js';
import { getGMValue } from '../../../config/gm-store.js';
import { installNotification, toast } from '../../../libraries/notification.js';
import { MyConsole } from '../../../utils/console.js';

const console = MyConsole('[ids.callback]');

/**
 * 重建 open.weixin 扫码授权 URL 并跳转（带 fast_login=1）。1.x webvpnReLogin 行 2705-2718 等价。
 * 仅 autoReLogin 启用时执行。query 取 appid/state（1.x GetQuery）。
 * @param {object} query - URLSearchParams 等价对象（getContext().query）
 */
function redirectToWeixinScan(query) {
  // 1.x 行 2706-2708：autoReLogin 关闭则不自动跳。
  if (!getGMValue('WebVPN.autoReLogin')) return;
  toast('info', '尝试自动登录...');
  const target = new URL('https://open.weixin.qq.com/connect/qrconnect');
  target.searchParams.set('appid', query.get('appid') || '');
  target.searchParams.set('redirect_uri', 'https://ids.nxu.edu.cn/authserver/callback');
  target.searchParams.set('response_type', 'code');
  target.searchParams.set('scope', 'snsapi_login');
  target.searchParams.set('state', query.get('state') || '');
  target.searchParams.set('fast_login', '1');
  location.href = target.href;
}

/**
 * 仅当页面提示"授权失败"时，重建统一认证 callback URL（带 code/state）跳回 WebVPN。
 * 1.x idsReLogin 行 2720-2736 等价。@param {object} query
 */
function redirectToFixedCallback(query) {
  // 1.x 行 2721-2724：无 "授权失败" 警告则不处理（成功走自然流）。
  const warning = document.querySelector('#welcome.warn');
  if (!warning || !warning.textContent.includes('授权失败')) return;
  toast('info', '请稍候...');
  toast('info', '尝试跳转至正确页面');
  const callback = new URL('https://ids.nxu.edu.cn/authserver/callback');
  callback.searchParams.set('code', query.get('code') || '');
  callback.searchParams.set('state', query.get('state') || '');
  // 1.x 行 2730-2734：buildWebVpnUrl 失败提示手动返回；否则跳转。
  const callbackUrl = buildWebVpnUrl(callback);
  if (!callbackUrl) {
    toast('error', '无法生成统一认证回调地址，请手动返回 WebVPN', 5);
    return;
  }
  location.href = callbackUrl;
}

/**
 * 回调页入口：按 URL 形态分流（扫码代理分支 vs callback 修复分支）。1.x ids case 行 2514-2522 等价。
 * router 命中 ids/callback.page.js 时携带 ctx；本函数从 ctx.url / ctx.host 判定形态。
 */
export async function register() {
  console('进入微信回调/扫码代理页');
  // 两分支均会弹 toast，装好 notification（1.x Basic({vant:false})，两分支都先 Basic）。
  installNotification();
  const ctx = getContext();

  // 形态 ②：URL 含 open.weixin 代理 token + /connect/qrconnect → 重建 open.weixin 扫码页跳转。
  // 1.x 行 2514 `Url.indexOf('/777264...ffe7449.../connect/qrconnect') != -1`。
  // open.weixin 的 webvpn token 单一来源：WEBVPN_HOST_TOKENS['open.weixin.qq.com']（B2 审计：原硬编码
  // 字面量与 router.js 用 token 表不一致，改单一来源防 token 变动时两处不同步）。
  if (ctx.url.indexOf(`/${WEBVPN_HOST_TOKENS['open.weixin.qq.com']}/connect/qrconnect`) !== -1) {
    console('进入微信扫码代理分支');
    redirectToWeixinScan(ctx.query);
    return;
  }

  // 形态 ①：Path == /authserver/callback → 重建 ids callback URL 跳回 WebVPN（仅授权失败时）。
  console('进入微信回调修复分支');
  redirectToFixedCallback(ctx.query);
}
