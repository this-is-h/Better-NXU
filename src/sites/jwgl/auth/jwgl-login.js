/**
 * jwgl/auth/jwgl-login — 教务登录页自动登录主干（填账号密码 + OCR 验证码 + 提交）
 * 对应 1.x：Better NXU.user.js 行 2738-2777（jwglLogin）
 * 依赖：config/gm-store（getGMValue Jwgl.autoLogin/username/password）、composables/use-credentials-toast
 *       （requireCredentials/notifyCredentialsProblem，后者 opener=openConfig 对应 CAT_userConfig）、
 *       utils/errors（JWGL_LOGIN_FORM_MISSING + scheduleOperationError）、
 *       sites/jwgl/components/login/captcha-reader（readJwglCaptcha = 1.x GetVerificationCode('Jwgl')）、
 *       libraries/notification（toast/removeToastHandle/installNotification）、utils/console
 * 入口/被谁调用：sites/jwgl/pages/login.page.js（启用 autoLogin 时调）
 *
 * 与 ids-login 主干差异（01 §8.2-6 / B2 决策"过粗不抽 fillAuthForm"）：jwglLogin 走 getElementsByName 同步取框 +
 *  OCR 识别 captcha + 单一 click 提交，无 waitForElement 异步等待、无滑块分支、无 rememberMe——故主干独立实现
 *  （与 ids-login 各自等价 1.x，B5/B6 验收 4"无重复代码"指共享叶子件 getAuthErrorText/hasLegacyAuthCaptcha 已在
 *  utils/auth-form，主干各异）。本模块即 jwgl 主干。
 *
 * 与 1.x 行为等价点（C5，逐字对齐行 2738-2777）：
 *  - autoLogin 关闭直接 return（1.x 行 2739-2741）
 *  - "自动登录..." info 3 秒 toast（1.x 行 2742）
 *  - requireCredentials('Jwgl') 缺凭证中止（1.x 行 2743-2745 CheckUsernameAndSecret）
 *  - 错误页 div#errors.message 文案为"密码错误"/"账户不存在" → notifyCredentialsProblem（1.x 行 2746-2755，
 *    toast 内 onclick=CAT_userConfig，对应 Jwgl opener=openConfig，见 utils/auth-form + use-credentials-toast）
 *  - "正在识别验证码，首次使用需下载识别模型..." info 0 秒常驻 toast（1.x 行 2757）
 *  - readJwglCaptcha（1.x GetVerificationCode('Jwgl')）+ 取 loginForm.name/password/captcha/loginSubmit
 *    缺则抛 JWGL_LOGIN_FORM_MISSING（1.x 行 2759-2766）
 *  - 填 username/password/captcha + submitButton.click()（1.x 行 2767-2770）
 *  - catch → "验证码识别失败，请手动输入后登录" error 5 秒 toast（1.x 行 2771-2773）
 *  - finally removeToast 识别 toast（1.x 行 2774-2776）
 */
import { getGMValue } from '../../../config/gm-store.js';
import { requireCredentials, notifyCredentialsProblem } from '../../../composables/use-credentials-toast.js';
import { JWGL_LOGIN_FORM_MISSING, scheduleOperationError } from '../../../utils/errors.js';
import { readJwglCaptcha } from '../components/login/captcha-reader.js';
import { toast, removeToastHandle, installNotification } from '../../../libraries/notification.js';
import { MyConsole } from '../../../utils/console.js';

const console = MyConsole('[教务登录]');

/**
 * 自动填账号密码 + 识别验证码 + 提交教务登录表单。对应 1.x jwglLogin 行 2738-2777。
 * 仅当 Jwgl.autoLogin 启用时执行；缺凭证/错误页已限/OCR 失败时停止并提示手动操作。
 * @returns {Promise<void>}
 */
export async function jwglLogin() {
  // 1.x 行 2739-2741：未启用自动登录直接返回。
  if (!getGMValue('Jwgl.autoLogin')) return;

  // 1.x 行 2742：装好后弹"自动登录..."提示（installNotification 保证 toast 容器就绪）。
  installNotification();
  toast('info', '自动登录...', 3);

  // 1.x 行 2743-2745：缺凭证弹 toast 转设置页并中止（1.x CheckUsernameAndSecret；Jwgl opener=openConfig）。
  if (!requireCredentials('Jwgl')) return;

  // 1.x 行 2746-2755：教务登录页错误信息容器 div#errors.message，命中"密码错误"/"账户不存在"弹凭证问题 toast。
  const errorEl = document.querySelector('div#errors.message');
  if (errorEl) {
    const errorText = errorEl.textContent.trim();
    if (errorText === '密码错误' || errorText === '账户不存在') {
      // notifyCredentialsProblem(host) 弹 buildCredentialsErrorToast，Jwgl opener=openConfig → onclick=CAT_userConfig。
      notifyCredentialsProblem('Jwgl', 0);
      return;
    }
  }

  // 1.x 行 2757：识别常驻 toast（首用时下载 OCR 模型提示）。
  const recognitionToast = toast('info', '正在识别验证码，首次使用需下载识别模型，请耐心等待...', 0);
  try {
    // 1.x 行 2759：OCR 识别验证码（GetVerificationCode('Jwgl') → readJwglCaptcha）。
    const verification = await readJwglCaptcha();
    // 1.x 行 2760-2763：同步取登录表单四字段（getElementsByName / #loginSubmit）。
    const usernameInput = document.getElementsByName('loginForm.name')[0];
    const passwordInput = document.getElementsByName('loginForm.password')[0];
    const captchaInput = document.getElementsByName('loginForm.captcha')[0];
    const submitButton = document.querySelector('input#loginSubmit');
    // 1.x 行 2764-2766：缺字段说明表单结构已变 → 抛 JWGL_LOGIN_FORM_MISSING（统一错误码入口）。
    if (!usernameInput || !passwordInput || !captchaInput || !submitButton) {
      throw scheduleOperationError(JWGL_LOGIN_FORM_MISSING, '教务登录表单结构已变化');
    }
    // 1.x 行 2767-2770：填值 + 提交。
    const fillInput = (input, value) => {
      input.value = value;
      // 教务登录页部分输入受框架受控：触发 input 事件确保框架拿到值（与 1.x 直赋等价，1.x 不触发事件亦能提交，
      // 因 loginForm 用原生表单提交而非框架双向绑定——保持直赋与 1.x 一致，不额外触发避免副作用）。
    };
    fillInput(usernameInput, getGMValue('Jwgl.username'));
    fillInput(passwordInput, getGMValue('Jwgl.password'));
    fillInput(captchaInput, verification);
    submitButton.click();
  } catch (error) {
    // 1.x 行 2771-2773：识别失败（OCR_* / 表单缺失 / 网络）→ 引导手动输入。
    console('自动填写失败', error, 'error');
    toast('error', '验证码识别失败，请手动输入后登录', 5);
  } finally {
    // 1.x 行 2774-2776：移除识别进度常驻 toast。
    removeToastHandle(recognitionToast);
  }
}
