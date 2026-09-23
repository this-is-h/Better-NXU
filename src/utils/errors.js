/**
 * 通用错误码常量 + 统一错误工厂
 * 对应 1.x：Better NXU.user.js 中散落在调用点的错误码字符串字面量（scheduleOperationError/cryptoError 第一参）
 * 依赖：无
 * 入口/被谁调用：utils/dom、schedule/*、crypto/*、各 sites/*
 *
 * 说明（维护边界见 docs/dev/architecture.md）：
 * 1.x 没有集中的错误码常量表——OCR_*、EXPORT_CANCELLED、JWGL_LOGIN_FORM_MISSING 等都是
 * `scheduleOperationError("<CODE>", msg)` / `cryptoError("<CODE>", msg)` 调用点上的内联字符串。
 * 本模块把这些字符串抽成具名常量，使其与 1.x "同名同值"，集中维护，避免散点拼写漂移。
 *
 * 错误码取值对照（逐字取自 1.x 调用点，grep 已确认）：
 *  - OCR_ENGINE_UNAVAILABLE  1.x 行 163/167 `scheduleOperationError("OCR_ENGINE_UNAVAILABLE", ...)`
 *  - OCR_EMPTY_RESULT         1.x 行 2069 `scheduleOperationError("OCR_EMPTY_RESULT", ...)`
 *  - JWGL_LOGIN_FORM_MISSING  1.x 行 2765 `scheduleOperationError("JWGL_LOGIN_FORM_MISSING", ...)`
 *  - EXPORT_CANCELLED         1.x 行 1774 `scheduleOperationError("EXPORT_CANCELLED", ...)`；行 3352/6544/6576 用 `error.code === "EXPORT_CANCELLED"` 判断
 *  - AUTH_SUBMIT_MISSING      1.x 行 2675/2679
 *  - MENU_TARGET_MISSING      1.x 行 3078
 *  - WAIT_TIMEOUT             1.x 行 2197（waitForElement）
 *  - WEBVPN_URL_BUILD_FAILED  1.x 无显式抛错（buildWebVpnUrl 仅返回 null）；2.0 新增此具名常量，
 *                             供 utils/webvpn-url.js 在调用点 build 失败时若需显式报错使用（取自然值）。
 *
 * 加密相关错误码（CRYPTO 系列 / INVALID_KEY / INVALID_ENVELOPE / UNSUPPORTED_ENCRYPTION /
 * FILE_TOO_LARGE / DECRYPT_FAILED 等）属于加密内核，本模块不放，
 * 留给 crypto/errors.js（加密协议见 docs/dev/data-and-security.md）。
 */

// === 通用错误码（2.0 集中具名常量，值与 1.x 调用点字符串一字不差）===
/** OCR 引擎资源不可用或加载失败（1.x 行 163/167）。 */
export const OCR_ENGINE_UNAVAILABLE = 'OCR_ENGINE_UNAVAILABLE';
/** OCR 验证码识别结果为空（1.x 行 2069）。 */
export const OCR_EMPTY_RESULT = 'OCR_EMPTY_RESULT';
/** 教务登录表单结构已变化、无法定位（1.x 行 2765）。 */
export const JWGL_LOGIN_FORM_MISSING = 'JWGL_LOGIN_FORM_MISSING';
/** 用户取消了加密课表导出（1.x 行 1774 抛、行 3352/6544/6576 捕获判断）。 */
export const EXPORT_CANCELLED = 'EXPORT_CANCELLED';
/** 统一认证页面缺少安全提交入口/登录按钮未加载（1.x 行 2675/2679）。 */
export const AUTH_SUBMIT_MISSING = 'AUTH_SUBMIT_MISSING';
/** 教务菜单结构已变化、未添加自定义入口（1.x 行 3078）。 */
export const MENU_TARGET_MISSING = 'MENU_TARGET_MISSING';
/** 等待页面元素超时（1.x 行 2197，waitForElement）。 */
export const WAIT_TIMEOUT = 'WAIT_TIMEOUT';
/** WebVPN 代理 URL 构建失败（1.x 无显式抛错，buildWebVpnUrl 仅返回 null；2.0 新增供调用点显式报错用）。 */
export const WEBVPN_URL_BUILD_FAILED = 'WEBVPN_URL_BUILD_FAILED';
/** IDS 滑块识别运行时（GM 下载的 ORT/WASM/模型及本地 Worker）加载失败。 */
export const SLIDER_RECOGNIZER_UNAVAILABLE = 'SLIDER_RECOGNIZER_UNAVAILABLE';

// === 课表文件解析错误码（1.x 经 scheduleOperationError 产出，属“文件解析”非“加密原语”，归此处而非 crypto/errors）===
/** 课表文件不是有效 JSON（1.x 行 1832 scheduleOperationError("INVALID_JSON", ...)）。 */
export const INVALID_JSON = 'INVALID_JSON';
/** 课表文件内容无效、normalize 失败（1.x 行 1815 scheduleOperationError("INVALID_SCHEDULE", ...)）。 */
export const INVALID_SCHEDULE = 'INVALID_SCHEDULE';
/** 已解密文本不是有效课表 JSON / 课表内容无效（1.x 行 1807/1815 scheduleOperationError("INVALID_DECRYPTED_SCHEDULE", ...)）。 */
export const INVALID_DECRYPTED_SCHEDULE = 'INVALID_DECRYPTED_SCHEDULE';
/** 未提供对应解密密钥、该文件已跳过（1.x 行 1877/1883 scheduleOperationError("KEY_REQUIRED", ...)）。 */
export const KEY_REQUIRED = 'KEY_REQUIRED';

/**
 * 构造一个带 code 属性的 Error（与 1.x scheduleOperationError 行 1579-1583 形态一致）。
 * 业务侧统一用它生成错误对象，再由 composables/use-wait-or-toast 等转 toast，避免散点 createToast。
 * @param {string} code - 错误码（建议用上面的具名常量）
 * @param {string} message - 可定位的人类可读描述
 * @returns {Error & { code: string }}
 */
export function scheduleOperationError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}
