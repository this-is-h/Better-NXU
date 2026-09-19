/**
 * rsa — RSA-OAEP-256 密钥生成、导入、强度校验、PEM↔Base64 转换
 * 对应 1.x：ScheduleCryptoTools IIFE 行 1318-1451（byteLength/base64 双向、PEM 双向、getKeyId、
 *           assertRsaStrength、importPublicKey、importPrivateKey、generateKeyPair）
 * 依赖：crypto/errors（cryptoError + INVALID_KEY/CRYPTO_UNAVAILABLE）、schedule/schema（无；keyId 仅用 WebCrypto digest）
 * 入口/被谁调用：crypto/envelope（encryptSchedule/importPublicKey、decryptEnvelope/importPrivateKey）、
 *                crypto/index（re-export）、sites/*（B7 密钥管理 generateKeyPair/importPublicKey/importPrivateKey）
 *
 * 拆分依据见 docs/dev/architecture.md：1.x 这些是 IIFE 闭包内私有纯函数（除
 * generateKeyPair/importPublicKey/importPrivateKey 对外暴露外，byteLength/bytesToBase64/base64ToBytes/
 * pemToBytes/arrayBufferToPem/getKeyId/assertRsaStrength 均私有）。2.0 按 02 §4 目录树分组：
 *   - Base64/Base64URL/PEM 编解码、byteLength、getCryptoApi、密钥生成/导入/强度 = rsa.js（本文件）
 *   - 信封组装/校验/加解密正文 = envelope.js
 *   - 课表文件解析入口（明文/加密分流、密钥缓存）= parse.js
 * 函数体逐字保留，仅改为命名 export；私有辅助不再对外（不被 index 桶 re-export），保持 1.x 闭包私有语义。
 *
 * 关键不动量（C5 行为等价）：
 *  - WebCrypto 参数：RSA-OAEP + SHA-256 + modulusLength 3072 + publicExponent [1,0,1]，
 *    importKey spki/pkcs8 用途分别为 ["encrypt"]/["decrypt"]——逐字保留（1.x 行 1399-1440）。
 *  - assertRsaStrength：modulusLength<3072 或 hash≠SHA-256 或 publicExponent≠[1,0,1] 抛 INVALID_KEY，文案逐字（1.x 行 1385-1393）。
 *  - keyId 形态：`sha256-<Base64URL(SHA-256(spki))>`（1.x 行 1382）；envelope inspectEnvelope 校验 kid 正则
 *    `/^sha256-[A-Za-z0-9_-]{43}$/`（envelope.js）依赖此 43 字符 Base64URL 形态，不可偏。
 *  - PEM 行宽 64、label 用 "PUBLIC KEY"/"PRIVATE KEY"，逐字（1.x 行 1366-1367）。
 *  - base64ToBytes 对非法输入（非 Base64 字母表 / len%4===1）抛 INVALID_KEY；pemToBytes 失败文案按 label 区分公/私钥（1.x 行 1375）。
 */

import { cryptoError, INVALID_KEY, INVALID_ENVELOPE } from './errors.js';

/** 明文/密钥内容字节上限相关计算用：UTF-8 字节长度（1.x 行 1318-1320）。 */
const textEncoder = new TextEncoder();

/** 取页面 WebCrypto Subtle API；不可用抛 CRYPTO_UNAVAILABLE（1.x 行 1310-1316，envelope.js 与本文件共用）。 */
export function getCryptoApi() {
  const cryptoApi = globalThis.crypto;
  if (!cryptoApi?.subtle || typeof cryptoApi.getRandomValues !== 'function') {
    throw cryptoError('CRYPTO_UNAVAILABLE', '当前页面不支持安全加密，请使用 HTTPS 地址或更新浏览器后重试');
  }
  return cryptoApi;
}

/** 编码器共用实例（export 供 envelope.js 用同一 TextEncoder，保持 1.x 单实例语义）。 */
export { textEncoder };

/** 任意文本的 UTF-8 字节长度（1.x 行 1318-1320；envelope/parse 的大小校验用）。 */
export function byteLength(text) {
  return textEncoder.encode(String(text ?? '')).byteLength;
}

/** 字节序列 → 标准 Base64（分块 0x8000 避免 call 栈溢出，1.x 行 1322-1329）。 */
export function bytesToBase64(bytes) {
  const values = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = '';
  for (let index = 0; index < values.length; index += 0x8000) {
    binary += String.fromCharCode(...values.subarray(index, index + 0x8000));
  }
  return btoa(binary);
}

/** 标准 Base64 字符串 → Uint8Array；非法格式抛 INVALID_KEY（1.x 行 1331-1342）。 */
export function base64ToBytes(value, fieldName = '密钥') {
  const text = String(value || '').replace(/\s+/g, '');
  if (!text || !/^[A-Za-z0-9+/]+={0,2}$/.test(text) || text.length % 4 === 1) {
    throw cryptoError(INVALID_KEY, `${fieldName}格式不正确`);
  }
  try {
    const binary = atob(text);
    return Uint8Array.from(binary, (char) => char.charCodeAt(0));
  } catch (error) {
    throw cryptoError(INVALID_KEY, `${fieldName}格式不正确`, error);
  }
}

/** 字节序列 → Base64URL（去填充、+→-、/→_，1.x 行 1344-1346）。 */
export function bytesToBase64Url(bytes) {
  return bytesToBase64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

/** Base64URL 字符串 → Uint8Array；非法或非规范抛 INVALID_ENVELOPE（1.x 行 1348-1362）。 */
export function base64UrlToBytes(value, fieldName) {
  const text = String(value || '');
  if (!text || !/^[A-Za-z0-9_-]+$/.test(text) || text.length % 4 === 1) {
    throw cryptoError(INVALID_ENVELOPE, `加密文件的 ${fieldName} 字段无效`);
  }
  const padding = '='.repeat((4 - (text.length % 4)) % 4);
  try {
    const binary = atob(text.replace(/-/g, '+').replace(/_/g, '/') + padding);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    if (bytesToBase64Url(bytes) !== text) throw new Error('Non-canonical Base64URL');
    return bytes;
  } catch (error) {
    throw cryptoError(INVALID_ENVELOPE, `加密文件的 ${fieldName} 字段无效`, error);
  }
}

/** ArrayBuffer → PEM 文本（行宽 64，1.x 行 1364-1368）。 */
export function arrayBufferToPem(buffer, label) {
  const base64 = bytesToBase64(new Uint8Array(buffer));
  const lines = base64.match(/.{1,64}/g) || [];
  return `-----BEGIN ${label}-----\n${lines.join('\n')}\n-----END ${label}-----`;
}

/**
 * PEM 文本 → Uint8Array；label 不匹配或体内 Base64 非法抛 INVALID_KEY，文案按公/私钥区分（1.x 行 1370-1377）。
 * @param {string} pem
 * @param {'PUBLIC KEY'|'PRIVATE KEY'} label
 */
export function pemToBytes(pem, label) {
  const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = String(pem || '')
    .trim()
    .match(
      new RegExp(
        `^-----BEGIN ${escapedLabel}-----\\s+([A-Za-z0-9+/=\\s]+?)\\s+-----END ${escapedLabel}-----$`
      )
    );
  if (!match) {
    throw cryptoError(
      INVALID_KEY,
      `请输入完整的${label === 'PUBLIC KEY' ? '加密密钥（公钥）' : '解密密钥（私钥）'}`
    );
  }
  return base64ToBytes(match[1], label === 'PUBLIC KEY' ? '加密密钥' : '解密密钥');
}

/** 公钥 SPKI → keyId（SHA-256 摘要的 Base64URL，前缀 sha256-，1.x 行 1379-1383）。 */
export async function getKeyId(spkiBytes) {
  const { subtle } = getCryptoApi();
  const digest = await subtle.digest('SHA-256', spkiBytes);
  return `sha256-${bytesToBase64Url(new Uint8Array(digest))}`;
}

/** 校验导入密钥的 RSA 强度：3072-bit + SHA-256 + e=[1,0,1]，否则抛 INVALID_KEY（1.x 行 1385-1393）。 */
export function assertRsaStrength(key, keyName) {
  const publicExponent = Array.from(key?.algorithm?.publicExponent || []);
  if (Number(key?.algorithm?.modulusLength) < 3072 || key?.algorithm?.hash?.name !== 'SHA-256') {
    throw cryptoError(INVALID_KEY, `${keyName}不符合当前课表加密要求，请使用“课表密钥管理”生成的密钥`);
  }
  if (publicExponent.join(',') !== '1,0,1') {
    throw cryptoError(INVALID_KEY, `${keyName}使用了不受支持的参数，请使用“课表密钥管理”生成的密钥`);
  }
}

/**
 * 由 PEM 公钥导入 CryptoKey 并校验强度，返回 { cryptoKey, keyId }（1.x 行 1395-1412）。
 * keyId 供 envelope 头 kid 字段使用。
 * @returns {Promise<{ cryptoKey: CryptoKey, keyId: string }>}
 */
export async function importPublicKey(pem) {
  const { subtle } = getCryptoApi();
  const spki = pemToBytes(pem, 'PUBLIC KEY');
  try {
    const cryptoKey = await subtle.importKey('spki', spki, { name: 'RSA-OAEP', hash: 'SHA-256' }, false, [
      'encrypt',
    ]);
    assertRsaStrength(cryptoKey, '加密密钥');
    return { cryptoKey: cryptoKey, keyId: await getKeyId(spki) };
  } catch (error) {
    if (error.code) throw error;
    throw cryptoError(INVALID_KEY, '加密密钥无法识别，请粘贴完整的课表加密密钥', error);
  }
}

/** 由 PEM 私钥导入 CryptoKey 并校验强度（仅用于 decrypt，1.x 行 1414-1431）。 */
export async function importPrivateKey(pem) {
  const { subtle } = getCryptoApi();
  const pkcs8 = pemToBytes(pem, 'PRIVATE KEY');
  try {
    const cryptoKey = await subtle.importKey('pkcs8', pkcs8, { name: 'RSA-OAEP', hash: 'SHA-256' }, false, [
      'decrypt',
    ]);
    assertRsaStrength(cryptoKey, '解密密钥');
    return cryptoKey;
  } catch (error) {
    if (error.code) throw error;
    throw cryptoError(INVALID_KEY, '解密密钥无法识别，请粘贴完整的课表解密密钥', error);
  }
}

/**
 * 生成新 RSA-OAEP-256 3072-bit 密钥对并导出为 PEM，附 keyId 与 createdAt（1.x 行 1433-1451）。
 * createdAt 用 new Date().toISOString()——1.x 原样（B4 非工作流脚本，运行时取当前时间合法）。
 * @returns {Promise<{ publicKey: string, privateKey: string, keyId: string, createdAt: string }>}
 */
export async function generateKeyPair() {
  const { subtle } = getCryptoApi();
  const keyPair = await subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 3072,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['encrypt', 'decrypt']
  );
  const [spki, pkcs8] = await Promise.all([
    subtle.exportKey('spki', keyPair.publicKey),
    subtle.exportKey('pkcs8', keyPair.privateKey),
  ]);
  return {
    publicKey: arrayBufferToPem(spki, 'PUBLIC KEY'),
    privateKey: arrayBufferToPem(pkcs8, 'PRIVATE KEY'),
    keyId: await getKeyId(new Uint8Array(spki)),
    createdAt: new Date().toISOString(),
  };
}
