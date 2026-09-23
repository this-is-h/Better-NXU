/**
 * ids/auth/ids-login — 统一认证自动登录主干（ids 登录页自动填账号密码 + 识别验证码 + 提交）
 * 对应 1.x：Better NXU.user.js 行 2609-2695（webvpnLogin）
 * 依赖：config/gm-store（getGMValue 读 WebVPN 凭证与 autoLogin 开关）、utils/dom（waitForElement /
 *       fillControlledInput）、utils/auth-form（getAuthErrorText / hasLegacyAuthCaptcha + 文案判定）、
 *       composables/use-credentials-toast（requireCredentials / notifyCredentialsProblem）、
 *       utils/errors（AUTH_SUBMIT_MISSING + scheduleOperationError）、libraries/notification（toast）、utils/console、
 *       auth/slide-captcha（滑块自动识别，2.0 起）
 * 入口/被谁调用：sites/ids/pages/login.page.js（启用 autoLogin 时调）；将来 webvpn 代理 ids 登录页（B7）复用同形
 *
 * 抽取边界（02 §3 / 01 §8.2-6 与 B2 风险对策）：
 *  1.x 的 webvpnLogin 与 jwglLogin 主干"相似但分支差异大"——ids/webvpn 走 waitForElement 异步 + 多提交分支
 *  + 滑块提示 / 记住勾选，jwgl 走 getElementsByName 同步 + OCR + 单一 click（B6）。B2 评估"过粗难适配"，仅抽了
 *  共享叶子件（getAuthErrorText / hasLegacyAuthCaptcha / buildCredentialsErrorToast）到 utils/auth-form.js，
 *  主干各 site 自行实现以与 1.x 行为逐字等价。本模块即 ids/webvpn 主干（与 jwgl 主干不同，故不复用同一函数）。
 *
 * 与 1.x webvpnLogin 行为等价点（逐字对齐，C5）：
 *  - autoLogin 关闭 → 直接 return（1.x 行 2610-2612）
 *  - authLoginSubmitting 重入保护（1.x 行 2613-2616，模块级 let）
 *  - "正在填写统一认证登录信息…" info toast 3 秒（1.x 行 2617）
 *  - requireCredentials('WebVPN') 缺凭证弹 toast 并中止（1.x 行 2618-2620 等价 CheckUsernameAndSecret）
 *  - getAuthErrorText 命中：isCredentialsErrorText → notifyCredentialsProblem；否则 escapeHtml(authErrorText) toast 5 秒
 *    （1.x 行 2621-2632）
 *  - waitForElement username/password（12s 超时，1.x 行 2634-2641）
 *  - rememberMe 勾选（1.x 行 2646-2653）
 *  - hasLegacyAuthCaptcha → "账号已填入，请手动输入图形验证码后登录" warning 0 秒常驻（1.x 行 2654-2657）
 *  - 提交分支：unsafeWindow.startLogin(submitButton) > submitButton.click() > unsafeWindow.checkForm()+form.requestSubmit()
 *    > 否则抛 AUTH_SUBMIT_MISSING（1.x 行 2659-2680）
 *  - 800ms 后检测滑块：1.x 弹 "请手动完成滑块验证" warning 常驻（1.x 行 2682-2689）；
 *    2.0 起改为自动识别（ids/auth/slide-captcha.solveIdsSliderCaptcha，captcha-recognizer-js
 *    ONNX 缺口检测 + slider-drag 原生鼠标拖动，纯前端无服务端），失败仍回退手动提示
 *  - 错误兜底：authLoginSubmitting=false + "统一认证自动登录失败，请手动操作" error 5 秒（1.x 行 2690-2694）
 *
 * 1.x 直接调 createToast；2.0 经 libraries/notification.toast（page 模型 unsafeWindow===window，行为等价）。
 * 1.x 用 CheckUsernameAndSecret(读 GM+弹 toast)；2.0 用 composables/use-credentials-toast.requireCredentials
 * （文案与跳转入口经 utils/auth-form.buildCertificatesErrorToast + opener=resolveOpener('WebVPN')='openTab' 与 1.x 一致）。
 */
import { getGMValue } from '../../../config/gm-store.js';
import { waitForElement, fillControlledInput } from '../../../utils/dom.js';
import { getAuthErrorText, hasLegacyAuthCaptcha, isCredentialsErrorText } from '../../../utils/auth-form.js';
import { escapeHtml } from '../../../utils/file.js';
import { requireCredentials, notifyCredentialsProblem } from '../../../composables/use-credentials-toast.js';
import { solveIdsSliderCaptcha } from './slide-captcha.js';
import { AUTH_SUBMIT_MISSING, scheduleOperationError } from '../../../utils/errors.js';
import { toast, installNotification } from '../../../libraries/notification.js';
import { unsafeWindow as grantedUnsafeWindow } from '#gm';
import { getContext } from '../../../context.js';
import { isTrustedIdsContext } from '../../../utils/route-guards.js';
import { MyConsole } from '../../../utils/console.js';

const console = MyConsole('[统一认证]');
const pageWindow = grantedUnsafeWindow ?? window;

// 1.x 行 2254 模块级重入保护。ids 主干跨 page 共享同一标志位（与 1.x 单 IIFE 闭包内一致）。
let authLoginSubmitting = false;

/**
 * 自动填账号密码并提交统一认证登录表单。对应 1.x webvpnLogin 行 2609-2695。
 * 仅当已启用 WebVPN.autoLogin 且未在提交中时执行；缺凭证/已有错误页/遗留图形验证码时停止并提示手动操作。
 * @returns {Promise<void>}
 */
export async function idsLogin() {
  // 1.x 行 2610-2612：autoLogin 关闭则不自动登录。
  if (!getGMValue('WebVPN.autoLogin')) return;
  // 1.x 行 2613-2616：重入保护。
  if (authLoginSubmitting) {
    console('已触发登录，忽略重复调用', '', 'debug');
    return;
  }
  // 凭证填写的最后一道边界：即使路由表将来误命中，也不在非 IDS 页面读取或填写已保存凭证。
  if (!isTrustedIdsContext(getContext())) {
    console('拒绝在非统一认证页面执行自动登录', { href: window.location.href }, 'error');
    return;
  }
  toast('info', '正在填写统一认证登录信息…', 3);
  // 1.x 行 2618-2620：缺凭证弹 toast 并中止（等价 CheckUsernameAndSecret('WebVPN')）。
  if (!requireCredentials('WebVPN')) return;

  // 1.x 行 2621-2632：页面已渲染鉴权错误 → 引导去设置或回显错误文案。
  const authErrorText = getAuthErrorText();
  if (authErrorText) {
    if (isCredentialsErrorText(authErrorText)) {
      notifyCredentialsProblem('WebVPN', 0);
    } else {
      toast('error', `<p>${escapeHtml(authErrorText)}</p>`, 5);
    }
    return;
  }

  try {
    // 重入窗口保护（P3）：在异步 waitForElement 之前置位——原置位点（提交前）在 waitForElement 等待期间
    // 标志位仍为 false，并发/重入的第二次调用可穿透 1.x 行 2613-2616 的检查同时进入等待。提前置位后
    // 成功路径保持 true、错误路径 catch 重置；需提前退出路径（hasLegacyAuthCaptcha）显式重置（见下）。
    authLoginSubmitting = true;

    // 1.x 行 2634-2641：等待账号/密码输入框（12s 超时）。
    const usernameInput = await waitForElement(
      '#pwdFromId #username, .login-main .m-account #username, input#username',
      { timeout: 12000 }
    );
    const passwordInput = await waitForElement(
      '#pwdFromId #password, .login-main .m-account #password, input#password',
      { timeout: 12000 }
    );
    const username = String(getGMValue('WebVPN.username') || '');
    const password = String(getGMValue('WebVPN.password') || '');
    fillControlledInput(usernameInput, username);
    fillControlledInput(passwordInput, password);

    // 1.x 行 2646-2653：勾选"记住我"。
    const rememberInput = document.querySelector(
      'input#rememberMe, input#myRememberMe, input[name=rememberMe]'
    );
    if (rememberInput) {
      rememberInput.checked = true;
      rememberInput.value = 'true';
      rememberInput.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // 1.x 行 2654-2657：旧式图形验证码需用户手填 → 提前退出。
    if (hasLegacyAuthCaptcha()) {
      // 用户手填图形验证码路径：本次未提交，重置重入标志，允许后续重试（P3 提前置位后需在此复位）。
      authLoginSubmitting = false;
      toast('warning', '账号已填入，请手动输入图形验证码后登录', 0);
      return;
    }

    // 1.x 行 2659-2680：提交分支（startLogin → click → checkForm+requestSubmit → 抛错）。
    // pageWindow 是 vite-plugin-monkey 提供的真实页面 window，用于取页面的 startLogin/checkForm 函数。
    const submitButton = document.querySelector(
      'a#login_submit, #pwdFromId a.login-btn, button[type=submit], input[type=submit]'
    );
    if (typeof pageWindow.startLogin === 'function' && submitButton) {
      await Promise.resolve(pageWindow.startLogin(submitButton));
    } else if (submitButton) {
      submitButton.click();
    } else if (typeof pageWindow.checkForm === 'function') {
      const valid = await Promise.resolve(pageWindow.checkForm());
      if (valid === false) {
        authLoginSubmitting = false;
        return;
      }
      const form = document.querySelector('#pwdFromId, .login-main form');
      if (typeof form?.requestSubmit !== 'function') {
        throw scheduleOperationError(AUTH_SUBMIT_MISSING, '统一认证页面缺少安全提交入口');
      }
      form.requestSubmit();
    } else {
      throw scheduleOperationError(AUTH_SUBMIT_MISSING, '统一认证登录按钮尚未加载');
    }

    // 1.x 行 2682-2689：800ms 后若出现滑块 → 2.0 改为自动识别（feat/slider-captcha-autosolve）。
    // solveIdsSliderCaptcha 内部处理成功/失败 toast，不向外抛错（失败回退手动操作提示）。
    setTimeout(() => {
      solveIdsSliderCaptcha().catch((err) => {
        console('滑块自动识别流程异常', err, 'error');
      });
    }, 800);
  } catch (error) {
    // 1.x 行 2690-2694：错误兜底。
    authLoginSubmitting = false;
    console('自动登录失败', error, 'error');
    installNotification();
    toast('error', '统一认证自动登录失败，请手动操作', 5);
  }
}

export { authLoginSubmitting };
