/**
 * 鉴权表单填助共享（ids / jwgl 共用叶子件）
 * 对应 1.x：Better NXU.user.js 行 2210-2216（getAuthErrorText）、2218-2224（hasLegacyAuthCaptcha）、
 *          2138-2141 与 2624-2627 与 2749-2752（凭证缺失 → 转设置页 toast 文案）
 * 依赖：无 GM 依赖、无 UI 依赖（本模块只做纯 DOM 读取与 toast 文案构造；弹出 toast 的副作用归 composables）
 * 入口/被谁调用：sites/ids（routeAuthLogin/webvpnLogin）、sites/jwgl（jwglLogin）、
 *                composables/use-credentials-toast.js（凭证缺失 toast 文案来源）
 *
 * 抽取动机（01 §8.2-3 / §8.2-6）：
 *  1.x 在 webvpnLogin、jwglLogin、CheckUsernameAndSecret 三处各写一份"凭证缺失 → toast 带 '前往设置' 链接"HTML。
 *  2.0 把文案构造抽成纯函数，由 composables/use-credentials-toast 统一弹（副作用集中），文案与 1.x 一字不差。
 *  ids/jwgl 的"填用户名+密码+提交"主干相似但分支差异大（ids 走 waitForElement 异步 + 多提交分支 + 滑块提示，
 *  jwgl 走 getElementsByName 同步 + OCR 验证码 + 单一 click）——按 B2 风险"过粗难适配"，此处仅抽共享叶子件
 *  （错误文案、表单错误检测、遗留图形验证码判定），主干各仓库 sites 自行实现以与 1.x 行为逐字等价。
 *
 * 边界（02 §3）：utils 不 import composables/libraries/config。本模块不弹 toast（副作用留 composables），
 *  也不读 GM（凭证值读取归 sites/config）。只产字符串、做 DOM 只读判定。
 */

// 1.x 行 2255/2687 通用提示文案与跳转链接常量。escapeHtml 经 utils/file.js 统一入口。
import { escapeHtml } from './file.js';

/**
 * 读取统一认证页面已渲染的鉴权错误文本（多种 DOM 形态逐一尝试）。1.x 行 2210-2216 逐字迁移。
 * 供 webvpnLogin 判断"账号密码错误 → 转设置页"分支（1.x 行 2621-2632）。
 * @returns {string} 错误文本，无则空串
 */
export function getAuthErrorText() {
  for (const selector of ['span#msg.auth_error', '#showErrorTip span', '#showErrorTip', '.form-error']) {
    const text = document.querySelector(selector)?.textContent.trim();
    if (text) return text;
  }
  return '';
}

/**
 * 判定统一认证页是否使用旧式图形验证码（脚本不可代填、需用户手填即提前退出）。1.x 行 2218-2224 逐字迁移。
 * 三条件任一命中即视为遗留图形验证码：
 *  1) #captchaSwitch.value === "1"（开关显式启用）
 *  2) #cpatchaDiv（原文拼写）容器有可见文本（图形码已渲染）
 *  3) input#captchaResponse 存在且非 hidden 且有 offsetParent（可见）
 * @returns {boolean}
 */
export function hasLegacyAuthCaptcha() {
  if (document.querySelector('#captchaSwitch')?.value === '1') return true;
  const container = document.querySelector('p#cpatchaDiv, #cpatchaDiv');
  if (container?.textContent.trim()) return true;
  const input = document.querySelector('input#captchaResponse');
  return Boolean(input && input.type !== 'hidden' && input.offsetParent !== null);
}

/**
 * 判定一段鉴权错误文本是否属于"账号/密码凭证错误"类（需引导用户去设置页重新填凭证）。
 * 1.x webvpnLogin 行 2623 判定：同时匹配用户名/账号/密码 与 错误/有误/不存在/失败 才算凭证错误。
 * @param {string} errorText
 * @returns {boolean}
 */
export function isCredentialsErrorText(errorText) {
  return /用户名|账号|密码/.test(errorText) && /错误|有误|不存在|失败/.test(errorText);
}

/**
 * 构造"凭证缺失/凭证错误 → 前往设置页"的 toast HTML 文案。1.x webvpnLogin 行 2624-2627、
 * jwglLogin 行 2749-2752、CheckUsernameAndSecret 行 2138-2141 三处统一文案来源。
 *
 * 跳转入口二选一：
 *  - 'settingsPage'（默认）：普通链接打开增强设置页（webvpn/ids 用）
 *  - 'openConfig'：ujs onclick 调 CAT_userConfig()（jwgl 用，1.x 行 2751）
 *
 * 文案说明三态（与 1.x 三处文案对齐）：
 *  - missing=true（凭证未配置）：提示"账号密码未配置"（1.x 行 2139）
 *  - missing=false（凭证已配置但认证失败）：提示"账号密码配置错误"（1.x 行 2625/2750）
 *  commonDur 保留给调用方决定 toast 持续秒数（1.x missing 用 0/常驻、错误用 5）。
 *
 * @param {{missing?:boolean, opener?:'settingsPage'|'openConfig'}} [options]
 * @returns {string} 适合 createToast 入参的 HTML 字符串（含 <p> 与 <a>）
 */
export function buildCredentialsErrorToast(options = {}) {
  const { missing = true, opener = 'settingsPage' } = options;
  const headline = missing ? '账号密码未配置' : '账号密码配置错误';
  // 1.x 行 2139/2625/2750 副文案统一"请前往配置相关信息"。
  const link =
    opener === 'openConfig'
      ? '<a href="javascript:void(0)" onclick="CAT_userConfig()" style="font-weight:bold;font-size:small">> 前往配置 <</a>'
      : '<a href="https://sslvpn.nxu.edu.cn/h/settings" target="_blank" rel="noopener noreferrer" style="font-weight:bold;font-size:small">> 前往配置 <</a>';
  return [
    // 1.x 原文案用 htmlspecialchars 的 > < 形作左右箭头装饰（行 2626 是 > <，行 2751/2140 是直写 > <）。
    // 本函数产出 JS 字符串(print plain > <)，与 1.x 行 2140/2751 直写形一致；escapeHtml 仅用于动态 errorText，
    // 静态装饰字符在 HTML 内合法不须转义。保持与 1.x 视觉一致。
    `<p style="margin-bottom:0.5em;margin-top: 0">${escapeHtml(headline)}<br>请前往配置相关信息</p>`,
    link,
  ].join('');
}
