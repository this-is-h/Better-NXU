/**
 * crypto — 加密内核对外 API 桶文件
 * 对应 1.x：ScheduleCryptoTools IIFE return 行 1563-1576（对外导出面）
 * 依赖：内部各子模块（errors/rsa/envelope/parse）、schedule/index（normalize——envelope 内用）
 * 入口/被谁调用：sites/jwgl & webvpn-tools（B6/B7 课表加密导出/导入/密钥管理）、
 *                crypto/parse（本桶 re-export 的 envelope.* 复用）
 *
 * 对外面（保持与 1.x `ScheduleCryptoTools.*` 同名，便于 B6/B7 调用点逐字迁移
 * `import { foo } from '@/crypto'`——storageKey 为 GM 键名常量，B7 读 GM `Schedule.encryptionKeyPair` 用）：
 *   storageKey, maxPlaintextBytes, maxEnvelopeBytes,
 *   assertAvailable(=getCryptoApi), byteLength,
 *   generateKeyPair, importPublicKey, importPrivateKey,
 *   encryptSchedule, decryptEnvelope, isEncryptedEnvelope, inspectEnvelope,
 *   parseScheduleJson, classifyScheduleFileContent
 *
 * B4 拆分（02 §4 目录树）：
 *  - errors.js：加密原语专属错误码 + cryptoError 工厂（通用码/工厂仍在 utils/errors.js，见 03 §4 风险表）。
 *  - rsa.js：Base64/PEM 编解码、getCryptoApi、byteLength、密钥生成/导入/强度/keyId。
 *  - envelope.js：信封常量、isEncryptedEnvelope/inspectEnvelope/encryptSchedule/decryptEnvelope、max*Bytes。
 *  - parse.js：纯逻辑文件解析（parseScheduleJson + classifyScheduleFileContent）；
 *              1.x 中含 Vant/GM/弹窗/fetch 的 requestScheduleKey/selectScheduleExportPublicKey/
 *              prepareScheduleExport/parseScheduleFileContent 密钥协商后段及 extractIcsId/getStudentOwner
 *              属 UI 与网络层，留 B7 sites 层逐字迁移（02 §3：crypto 不得 import sites/composables）。
 */

/** GM 键名常量（1.x 行 1295；与 config/gm-keys.js 第 46 行 `'Schedule.encryptionKeyPair': undefined` 一致，C3 锁定）。 */
export const storageKey = 'Schedule.encryptionKeyPair';

export {
  maxPlaintextBytes,
  maxEnvelopeBytes,
  isEncryptedEnvelope,
  inspectEnvelope,
  encryptSchedule,
  decryptEnvelope,
} from './envelope.js';

export {
  getCryptoApi as assertAvailable,
  byteLength,
  generateKeyPair,
  importPublicKey,
  importPrivateKey,
} from './rsa.js';

export { parseScheduleJson, classifyScheduleFileContent } from './parse.js';

// cryptoError 与加密专属错误码供调用方按需 import（1.x 调用点常 catch 后读 error.code）。
export {
  cryptoError,
  CRYPTO_UNAVAILABLE,
  INVALID_KEY,
  INVALID_ENVELOPE,
  UNSUPPORTED_ENCRYPTION,
  FILE_TOO_LARGE,
  DECRYPT_FAILED,
} from './errors.js';
