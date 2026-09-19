/**
 * parse — 课表文件内容解析（纯逻辑：JSON 解析、明文/加密分流、大小与结构校验）
 * 对应 1.x：Better NXU.user.js 行 1802-1820 `parseScheduleJson`、行 1822-1843 `parseScheduleFileContent` 的
 *           “纯逻辑前段”（外层大小校验 + JSON.parse + 明文/加密判定）；
 *           行 1704-1800 `requestScheduleKey`/`selectScheduleExportPublicKey`/`prepareScheduleExport`、
 *           行 1843-1895 `parseScheduleFileContent` 的“密钥协商后段”、行 1897+`extractIcsId`/`getStudentOwner`
 *           含 Vant 弹窗 / GM 读取 / createToast / fetch（WebVPN）副作用，属 UI 与网络层，不进 crypto 内核，
 *           留在 sites/webvpn 工具页（见 docs/dev/architecture.md：crypto 不得 import sites/composables）。
 * 依赖：crypto/envelope（isEncryptedEnvelope/inspectEnvelope/decryptEnvelope/maxPlaintextBytes/maxEnvelopeBytes）、
 *       crypto/rsa（byteLength）、crypto/errors（FILE_TOO_LARGE）、
 *       utils/errors（scheduleOperationError + 通用码 INVALID_JSON/INVALID_SCHEDULE/INVALID_DECRYPTED_SCHEDULE）、
 *       schedule/index（normalize 与 schemaVersion——明文识别用 schemaVersion 比对）
 * 入口/被谁调用：crypto/index（re-export）、sites/*（B7 工具页：仅取纯逻辑 helper，密钥协商在 site 层组合）
 *
 * 边界说明（B4 与 02 §3 依赖方向）：
 *  - 本文件不 import Vant/Vue、不读 GM、不弹 toast、不发 fetch——纯函数，可被 crypto 内部与 sites 层安全复用。
 *  - 1.x `parseScheduleFileContent` 是一个混合了纯逻辑与 UI/GM 协商的长函数；2.0 把它拆为：
 *      (A) 纯逻辑判定（本文件：parseScheduleJson + classifyScheduleFileContent）
 *      (B) 密钥协商 + 解密 + UI（B7 sites 层：调 (A) 的纯判定后再调 envelope.decryptEnvelope，按 1.x
 *          keyCache/declinedKeyIds 流程 + requestScheduleKey 弹窗）。
 *   两者在 B7 合并还原 1.x 行为；本文件只须保证 (A) 与 1.x 等价、并为 (B) 提供稳定 hook。
 *
 * 错误码归属（见 docs/dev/data-and-security.md）：
 *  - INVALID_JSON / INVALID_SCHEDULE / INVALID_DECRYPTED_SCHEDULE / KEY_REQUIRED：1.x 经 scheduleOperationError
 *    产出（行 1807/1815/1826/1832/1877/1883），属“课表文件解析错误”而非“加密原语错误”，归 utils/errors.js（通用）。
 *  - FILE_TOO_LARGE：1.x 既被 cryptoError（envelope 内行 1494/1554）也被 scheduleOperationError（parse 行 1826/1836）
 *    产出——为与 1.x 同名同值，crypto/errors.js 导出该具名常量，本文件就近从 crypto/errors import 用于纯判定段。
 */

import { isEncryptedEnvelope, inspectEnvelope, maxPlaintextBytes, maxEnvelopeBytes } from './envelope.js';
import { byteLength } from './rsa.js';
import { FILE_TOO_LARGE } from './errors.js';
import {
  scheduleOperationError,
  INVALID_JSON,
  INVALID_SCHEDULE,
  INVALID_DECRYPTED_SCHEDULE,
} from '../utils/errors.js';
import { normalize, schemaVersion } from '../schedule/index.js';

/**
 * 把一段文本解析为已 normalize 的课表对象（1.x 行 1802-1820）。
 * 先 JSON.parse（失败按 encrypted 标志报 INVALID_DECRYPTED_SCHEDULE / INVALID_JSON），再 normalize（失败按 encrypted 报
 * INVALID_DECRYPTED_SCHEDULE / INVALID_SCHEDULE 并附底层 error.message）。flag 仅供错误码区分，不影响 normalize 输入。
 * @param {string} text - 已解密或原始文件文本
 * @param {boolean} [encrypted=false] - 该文本是否来自上一步成功解密（true 时错误码用 *_DECRYPTED_SCHEDULE）
 * @returns {object} normalize 后的课表对象
 */
export function parseScheduleJson(text, encrypted = false) {
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw scheduleOperationError(
      encrypted ? INVALID_DECRYPTED_SCHEDULE : INVALID_JSON,
      encrypted ? '文件已解密，但其中不是有效的课表 JSON' : '文件不是有效的 JSON'
    );
  }
  try {
    return normalize(data);
  } catch (error) {
    throw scheduleOperationError(
      encrypted ? INVALID_DECRYPTED_SCHEDULE : INVALID_SCHEDULE,
      `${encrypted ? '文件已解密，但课表内容无效' : '课表文件无效'}：${error.message}`
    );
  }
}

/**
 * 对“课表文件原文”做纯逻辑分流判定（对应 1.x parseScheduleFileContent 行 1822-1842 的纯前段）。
 *  - 外层字节 >7MB：抛 FILE_TOO_LARGE（"课表文件不能超过 7 MB"，1.x 行 1825-1827）。
 *  - JSON.parse 失败：抛 INVALID_JSON（1.x 行 1828-1833）。
 *  - 明文课表（parsed.schemaVersion===schemaVersion）：内层再次 ≤5MB 校验后返回 {kind:'plain'}；
 *    1.x 行 1834-1839（明文且超 5MB 抛 FILE_TOO_LARGE "课表内容不能超过 5 MB"）。
 *  - 非加密信封（isEncryptedEnvelope=false）：返回 {kind:'plain'}（调 1.x normalize 由上层 parseScheduleJson 负责）。
 *  - 加密信封：返回 {kind:'encrypted', parsed, header}（header 经 inspectEnvelope 校验，1.x 行 1844）。
 *
 * 不做密钥读取/弹窗/解密——这些副作用由 sites 层 (B) 流程组合。返回 header 供 sites 层决定用哪把私钥。
 * @param {string} text 文件原文
 * @returns {{ kind: 'plain' } | { kind: 'encrypted', parsed: object, header: object }}
 */
export function classifyScheduleFileContent(text) {
  const content = String(text || '');
  const outerSize = byteLength(content);
  if (outerSize > maxEnvelopeBytes) {
    throw scheduleOperationError(FILE_TOO_LARGE, '课表文件不能超过 7 MB');
  }
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw scheduleOperationError(INVALID_JSON, '文件不是有效的 JSON');
  }
  if (parsed?.schemaVersion === schemaVersion) {
    if (outerSize > maxPlaintextBytes) {
      throw scheduleOperationError(FILE_TOO_LARGE, '课表内容不能超过 5 MB');
    }
    return { kind: 'plain' };
  }
  if (!isEncryptedEnvelope(parsed)) {
    return { kind: 'plain' };
  }
  const { header } = inspectEnvelope(parsed);
  // assertAvailable（getCryptoApi）与密钥协商属 UI/GM 副作用，留 sites 层在返回后按 1.x 行 1845 调用。
  return { kind: 'encrypted', parsed, header };
}
