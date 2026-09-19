/**
 * crypto/errors — 加密内核专属错误码与加密错误工厂
 * 对应 1.x：Better NXU.user.js 行 1303-1308 `cryptoError` 工厂 + 行内各 cryptoError("CODE", ...) 调用点的内联错误码
 * 依赖：无
 * 入口/被谁调用：crypto/rsa、crypto/envelope、crypto/parse、crypto/index；sites/*（B7 工具页密钥管理/导出/导入）经 crypto 桶间接消费
 *
 * 说明（见 docs/dev/data-and-security.md 的加密协议与错误边界）：
 * 1.x 加密内核内部用一个与 `scheduleOperationError` 平行的 `cryptoError(code, message, cause)`（行 1303-1308），
 * 多一个 `cause` 形参并把 `error.cause` 设上。本模块把它与加密专属错误码集中：
 *
 * 错误码取值对照（逐字取自 1.x ScheduleCryptoTools IIFE 内 cryptoError(...) 调用点，grep 已确认）：
 *  - CRYPTO_UNAVAILABLE      1.x 行 1313 `cryptoError("CRYPTO_UNAVAILABLE", ...)`（getCryptoApi，页面无 WebCrypto）
 *  - INVALID_KEY             1.x 行 1334/1340/1375/1388/1391/1410/1429（密钥 PEM/spki/pkcs8 解析/强度校验失败）
 *  - INVALID_ENVELOPE        1.x 行 1351/1360/1461/1467/1470/1475/1538（加密信封结构/字段/header 校验失败）
 *  - UNSUPPORTED_ENCRYPTION  1.x 行 1483 `cryptoError("UNSUPPORTED_ENCRYPTION", ...)`（header alg/enc/typ/cty/kid 不符）
 *  - FILE_TOO_LARGE          1.x 行 1494/1554 `cryptoError("FILE_TOO_LARGE", ...)`（明文 >5MB / 解密后 >5MB）
 *  - DECRYPT_FAILED          1.x 行 1559 `cryptoError("DECRYPT_FAILED", ...)`（RSA/AES 解密失败：密钥不匹配或文件损坏）
 *
 * 边界（与 utils/errors.js 划分，见 docs/dev/architecture.md 的依赖方向）：
 *  - 通用错误码（OCR_*、JWGL_LOGIN_FORM_MISSING、EXPORT_CANCELLED、WAIT_TIMEOUT、AUTH_SUBMIT_MISSING、
 *    MENU_TARGET_MISSING、WEBVPN_URL_BUILD_FAILED）与通用错误工厂 `scheduleOperationError` 在 **utils/errors.js**
 *    （B0 已落地；1.x 行 1579 `scheduleOperationError` 本就是通用全局函数，dom/OCR/export 全用它，不属加密内核）。
 *  - 加密相关 + schedule 文件解析相关（INVALID_JSON / INVALID_SCHEDULE / INVALID_DECRYPTED_SCHEDULE /
 *    KEY_REQUIRED）见 crypto/parse.js 的说明——其中 INVALID_JSON/INVALID_SCHEDULE/KEY_REQUIRED 在 1.x 是经
 *    `scheduleOperationError(...)` 产出（行 1807/1815/1826/1832/1877/1883），属"课表文件解析错误"而非"加密原语错误"，
 *    仍用 utils/errors.js 的 scheduleOperationError + 通用具名常量（见 crypto/parse.js）。
 *  - 本文件只放"加密原语"专属码 + cryptoError 工厂。`scheduleOperationError` 不在此（B0 已定于 utils/errors.js，
 *    schedule 模块不反向依赖 crypto——见 docs/dev/architecture.md 的依赖方向）。
 */

// === 加密原语专属错误码（2.0 集中具名常量，值与 1.x 调用点字符串一字不差）===
/** 页面不可用 WebCrypto Subtle API（1.x 行 1313）。 */
export const CRYPTO_UNAVAILABLE = 'CRYPTO_UNAVAILABLE';
/** 加密/解密密钥 PEM 或 SPKI/PKCS8 解析失败、强度不符（1.x 行 1334/1340/1375/1388/1391/1410/1429）。 */
export const INVALID_KEY = 'INVALID_KEY';
/** 加密信封结构/字段/header 校验失败（1.x 行 1351/1360/1461/1467/1470/1475/1538）。 */
export const INVALID_ENVELOPE = 'INVALID_ENVELOPE';
/** 加密信封 header 使用了不受支持的算法/格式（1.x 行 1483）。 */
export const UNSUPPORTED_ENCRYPTION = 'UNSUPPORTED_ENCRYPTION';
/** 课表明文或解密后内容超出大小上限（1.x 行 1494/1554）。 */
export const FILE_TOO_LARGE = 'FILE_TOO_LARGE';
/** RSA/AES 解密失败：密钥不匹配或文件已损坏（1.x 行 1559）。 */
export const DECRYPT_FAILED = 'DECRYPT_FAILED';

/**
 * 构造一个带 code（与可选 cause）属性的加密错误对象。
 * 与 1.x `cryptoError` 行 1303-1308 形态一致：相比 utils/errors.js 的 `scheduleOperationError` 多一个 cause 形参，
 * 用于在 catch 里把底层 DOMException 包进 `error.cause` 保留诊断信息（1.x decryptEnvelope/import* 多处传 error）。
 * @param {string} code - 错误码（建议用上面的具名常量）
 * @param {string} message - 人类可读描述（1.x 文案逐字保留给 UI toast）
 * @param {unknown} [cause] - 底层异常（1.x 调用点常传 catch 到的 error）
 * @returns {Error & { code: string, cause?: unknown }}
 */
export function cryptoError(code, message, cause) {
  const error = new Error(message);
  error.code = code;
  if (cause) error.cause = cause;
  return error;
}
