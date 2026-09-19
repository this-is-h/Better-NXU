/**
 * sites/webvpn/components/tools/schedule-file — 课表文件内容解析（明文/加密信封自动识别 + 密钥协商解密）
 * 对应 1.x：Better NXU.user.js 行 1822-1895（IIFE 顶层 parseScheduleFileContent，
 *           B4 决定"导入侧解密留 B7"，本批随 tools 页一并迁出）
 * 依赖：crypto（byteLength/maxEnvelopeBytes/maxPlaintextBytes/isEncryptedEnvelope/inspectEnvelope/
 *       assertAvailable/decryptEnvelope/importPrivateKey/parseScheduleJson/FILE_TOO_LARGE）、
 *       schedule（schemaVersion/normalize）、utils/errors（scheduleOperationError + INVALID_JSON/KEY_REQUIRED）、
 *       config/gm-store（getGMValue 读 Schedule.encryptionKeyPair）、
 *       composables/use-schedule-export（requestScheduleKey——2.0 提前到 B6 落地的密钥协商弹窗）、
 *       libraries/notification（toast 兜底）、utils/console
 * 入口/被谁调用：sites/webvpn/components/tools/ToolsApp.vue（handlePersonalUpload 上传单文件 / readFile 多人添加）
 *
 * 与 1.x 等价点（C5，逐字对齐行 1822-1895）：
 *  - 外层 7MB 上限 → JSON.parse → schemaVersion 匹配明文 normalize / isEncryptedEnvelope 加密分支。
 *  - 加密分支：keyCache（kid→已导入私钥）优先 → 当前 GM keypair 私钥（keyId 匹配才试）→
 *    declinedKeyIds 跳过 → requestScheduleKey('private', {filename}) 循环尝试（DECRYPT_FAILED 才重试，
 *    其余错误透传）。keyCache/declinedKeyIds 由调用方经 options 传入（ToolsApp 的
 *    importedSchedulePrivateKeys 常驻 Map + 各次上传的 Set）。
 */
import {
  byteLength,
  maxEnvelopeBytes,
  maxPlaintextBytes,
  isEncryptedEnvelope,
  inspectEnvelope,
  assertAvailable,
  decryptEnvelope,
  importPrivateKey,
  parseScheduleJson,
  storageKey,
  FILE_TOO_LARGE,
} from '../../../../crypto/index.js';
import { schemaVersion, normalize } from '../../../../schedule/index.js';
import { scheduleOperationError, INVALID_JSON, KEY_REQUIRED } from '../../../../utils/errors.js';
import { getGMValue } from '../../../../config/gm-store.js';
import { requestScheduleKey } from '../../../../composables/use-schedule-export.js';
import { toast } from '../../../../libraries/notification.js';

/**
 * 解析课表文件内容：明文 JSON / 加密信封自动识别，加密走密钥协商。
 * 对应 1.x parseScheduleFileContent（行 1822-1895）。
 * @param {string} text 文件文本
 * @param {{filename?:string, keyCache?:Map, declinedKeyIds?:Set}} [options]
 * @returns {Promise<object>} normalize 后的课表对象；解析失败抛 scheduleOperationError
 */
export async function parseScheduleFileContent(text, options = {}) {
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
    return normalize(parsed);
  }
  if (!isEncryptedEnvelope(parsed)) {
    return normalize(parsed);
  }

  const { header } = inspectEnvelope(parsed);
  assertAvailable();
  const keyCache = options.keyCache || new Map();
  const declinedKeyIds = options.declinedKeyIds || new Set();
  const tryDecrypt = async (privateKey) => {
    const decrypted = await decryptEnvelope(parsed, privateKey);
    return parseScheduleJson(decrypted, true);
  };

  if (keyCache.has(header.kid)) {
    // 此密钥此前已成功解密相同 kid；当前文件解密失败即视为该文件损坏/被篡改，
    // 直接抛错（DECRYPT_FAILED 或其它），不删除缓存（保留供后续文件使用）。1.x 行 1874-1876 行为等价。
    return await tryDecrypt(keyCache.get(header.kid));
  }

  const currentKeyPair = getGMValue(storageKey);
  if (currentKeyPair?.privateKey && (!currentKeyPair.keyId || currentKeyPair.keyId === header.kid)) {
    try {
      const currentPrivateKey = await importPrivateKey(currentKeyPair.privateKey);
      const schedule = await tryDecrypt(currentPrivateKey);
      keyCache.set(header.kid, currentPrivateKey);
      return schedule;
    } catch (error) {
      if (error.code !== 'DECRYPT_FAILED' && error.code !== 'INVALID_KEY') throw error;
      // 当前解密密钥不匹配或文件已损坏，继续请求用户提供对应解密密钥。
    }
  }

  if (declinedKeyIds.has(header.kid)) {
    throw scheduleOperationError(KEY_REQUIRED, '未提供对应解密密钥，该文件已跳过');
  }
  while (true) {
    const provided = await requestScheduleKey('private', { filename: options.filename });
    if (!provided) {
      declinedKeyIds.add(header.kid);
      throw scheduleOperationError(KEY_REQUIRED, '未提供对应解密密钥，该文件已跳过');
    }
    try {
      const privateKey = provided.importedKey;
      const schedule = await tryDecrypt(privateKey);
      keyCache.set(header.kid, privateKey);
      return schedule;
    } catch (error) {
      if (error.code !== 'DECRYPT_FAILED') throw error;
      toast('error', error.message || '解密密钥不匹配或文件已损坏', 4);
    }
  }
}
