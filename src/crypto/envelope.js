/**
 * envelope — JWE 式加密信封的组装、结构校验与加解密
 * 对应 1.x：ScheduleCryptoTools IIFE 行 1295-1299（protected 头常量）、行 1453-1561（isEncryptedEnvelope/
 *           inspectEnvelope/encryptSchedule/decryptEnvelope）
 * 依赖：crypto/rsa（getCryptoApi、bytesToBase64Url、base64UrlToBytes、textEncoder、importPublicKey）、
 *       crypto/errors（cryptoError + INVALID_ENVELOPE/UNSUPPORTED_ENCRYPTION/FILE_TOO_LARGE/DECRYPT_FAILED）、
 *       schedule/index（normalize——encryptSchedule 在此处调）
 * 入口/被谁调用：crypto/parse（isEncryptedEnvelope/inspectEnvelope/decryptEnvelope）、
 *                crypto/index（re-export）、sites/*（B7 工具页导出调 encryptSchedule）
 *
 * 拆分依据见 docs/dev/architecture.md：1.x 这组函数在 IIFE 闭包内互引私有 helper
 * （getCryptoApi/bytesToBase64Url/base64UrlToBytes/textEncoder/importPublicKey）与外部 normalize。
 * 2.0 把这些 helper 上提到 crypto/rsa.js（共享），本文件保留信封常量 + 4 个信封操作函数。
 *
 * 关键不动量（C5 行为等价）：
 *  - protected 头两常量：typ=`better-nxu-schedule+jwe`、cty=`application/vnd.better-nxu.schedule+json`（1.x 行 1298-1299）。
 *  - 信封 5 字段：protected/encrypted_key/iv/ciphertext/tag，全部 Base64URL（1.x 行 1521-1527）。
 *  - 头字段集合严格 = {alg,enc,typ,cty,kid,bnxv}，alg=RSA-OAEP-256、enc=A256GCM、bnxv=1、kid 匹配
 *    `/^sha256-[A-Za-z0-9_-]{43}$/`（1.x 行 1477-1484）；inspectEnvelope 任何不符抛 UNSUPPORTED_ENCRYPTION。
 *  - AES-GCM：256-bit 随机生成、IV 12 字节随机、additionalData=protectedText（UTF-8）、tagLength 128；
 *    密文与 16 字节 tag 在输出时拆分、解密时重新拼接（1.x 行 1507-1527、1544-1552）——逐字保留，不可改 GCM 模式。
 *  - 大小上限：明文 ≤5MB（maxPlaintextBytes）、解密后 ≤5MB；加解密两侧都用 textEncoder/textDecoder(fatal)。
 *  - decryptEnvelope 失败：DECRYPT_FAILED 文案"解密密钥不匹配或加密文件已损坏"（1.x 行 1559），
 *    FILE_TOO_LARGE 透传不重包（1.x 行 1558）。
 */

import { getCryptoApi, textEncoder, bytesToBase64Url, base64UrlToBytes, importPublicKey } from './rsa.js';
import {
  cryptoError,
  INVALID_ENVELOPE,
  UNSUPPORTED_ENCRYPTION,
  FILE_TOO_LARGE,
  DECRYPT_FAILED,
} from './errors.js';
import { normalize } from '../schedule/index.js';

/** 明文课表 JSON 字节上限（5 MB，1.x 行 1296）。 */
export const maxPlaintextBytes = 5 * 1024 * 1024;
/** 加密信封整体字节上限（7 MB，1.x 行 1297）。 */
export const maxEnvelopeBytes = 7 * 1024 * 1024;
/** JWE protected 头 typ 字段值（1.x 行 1298）。 */
const protectedHeaderType = 'better-nxu-schedule+jwe';
/** JWE protected 头 cty 字段值（1.x 行 1299）。 */
const protectedContentType = 'application/vnd.better-nxu.schedule+json';
/** UTF-8 解码器（fatal，1.x 行 1301）。 */
const textDecoder = new TextDecoder('utf-8', { fatal: true });

/**
 * 判断对象是否为加密信封（含 protected/encrypted_key/iv/ciphertext/tag 任一字段即认定，1.x 行 1453-1457）。
 * 调用方据此在 parse.js 区分明文课表 / 加密课表分流。
 * @param {*} value
 * @returns {boolean}
 */
export function isEncryptedEnvelope(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  return ['protected', 'encrypted_key', 'iv', 'ciphertext', 'tag'].some((field) =>
    Object.prototype.hasOwnProperty.call(value, field)
  );
}

/**
 * 校验加密信封结构并解析 protected 头（1.x 行 1459-1486）。
 * 要求 5 字段齐全且均为非空字符串、字段集合精确匹配、protected 头内 6 字段集合与值全部校验通过。
 * @returns {{ header: object, protectedText: string }}
 */
export function inspectEnvelope(envelope) {
  if (!envelope || typeof envelope !== 'object' || Array.isArray(envelope)) {
    throw cryptoError(INVALID_ENVELOPE, '加密课表文件结构无效');
  }
  const requiredFields = ['protected', 'encrypted_key', 'iv', 'ciphertext', 'tag'];
  const fields = Object.keys(envelope).sort();
  if (
    fields.join('|') !== [...requiredFields].sort().join('|') ||
    requiredFields.some((field) => typeof envelope[field] !== 'string' || !envelope[field])
  ) {
    throw cryptoError(INVALID_ENVELOPE, '加密课表文件缺少必要字段');
  }
  const protectedBytes = base64UrlToBytes(envelope.protected, 'protected');
  if (protectedBytes.byteLength > 2048) throw cryptoError(INVALID_ENVELOPE, '加密课表文件头过大');
  let header;
  try {
    header = JSON.parse(textDecoder.decode(protectedBytes));
  } catch (error) {
    throw cryptoError(INVALID_ENVELOPE, '加密课表文件头无效', error);
  }
  const allowedHeaderFields = ['alg', 'bnxv', 'cty', 'enc', 'kid', 'typ'];
  if (
    !header ||
    typeof header !== 'object' ||
    Array.isArray(header) ||
    Object.keys(header).sort().join('|') !== allowedHeaderFields.sort().join('|') ||
    header.alg !== 'RSA-OAEP-256' ||
    header.enc !== 'A256GCM' ||
    header.typ !== protectedHeaderType ||
    header.cty !== protectedContentType ||
    header.bnxv !== 1 ||
    !/^sha256-[A-Za-z0-9_-]{43}$/.test(header.kid || '')
  ) {
    throw cryptoError(UNSUPPORTED_ENCRYPTION, '该文件使用了不受支持的课表加密格式');
  }
  return { header, protectedText: envelope.protected };
}

/**
 * 用接收方公钥加密课表，产出 JWE 式信封（RSA-OAEP-256 + AES-256-GCM，1.x 行 1488-1528）。
 * 流程：normalize→JSON→UTF-8 字节→大小校验→生成 AES-GCM 256 密钥→RSA 加密 raw AES 密钥 + AES-GCM 加密正文
 *      （additionalData=protectedText）→拆 ciphertext/tag→组装 Base64URL 字段。
 * @param {object} schedule - 课表对象（1.x 任意符合 normalize 输入的形态）
 * @param {string} publicKeyPem - 接收方公钥 PEM
 * @returns {Promise<{protected:string,encrypted_key:string,iv:string,ciphertext:string,tag:string}>}
 */
export async function encryptSchedule(schedule, publicKeyPem) {
  const { subtle } = getCryptoApi();
  const normalized = normalize(schedule);
  const plaintext = JSON.stringify(normalized);
  const plaintextBytes = textEncoder.encode(plaintext);
  if (plaintextBytes.byteLength > maxPlaintextBytes) {
    throw cryptoError(FILE_TOO_LARGE, '课表内容不能超过 5 MB');
  }
  const { cryptoKey: publicKey, keyId } = await importPublicKey(publicKeyPem);
  const header = {
    alg: 'RSA-OAEP-256',
    enc: 'A256GCM',
    typ: protectedHeaderType,
    cty: protectedContentType,
    kid: keyId,
    bnxv: 1,
  };
  const protectedText = bytesToBase64Url(textEncoder.encode(JSON.stringify(header)));
  const iv = getCryptoApi().getRandomValues(new Uint8Array(12));
  const aesKey = await subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt']);
  const rawAesKey = await subtle.exportKey('raw', aesKey);
  const [encryptedKey, encryptedContent] = await Promise.all([
    subtle.encrypt({ name: 'RSA-OAEP' }, publicKey, rawAesKey),
    subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
        additionalData: textEncoder.encode(protectedText),
        tagLength: 128,
      },
      aesKey,
      plaintextBytes
    ),
  ]);
  const contentBytes = new Uint8Array(encryptedContent);
  const tag = contentBytes.slice(contentBytes.length - 16);
  const ciphertext = contentBytes.slice(0, contentBytes.length - 16);
  return {
    protected: protectedText,
    encrypted_key: bytesToBase64Url(new Uint8Array(encryptedKey)),
    iv: bytesToBase64Url(iv),
    ciphertext: bytesToBase64Url(ciphertext),
    tag: bytesToBase64Url(tag),
  };
}

/**
 * 用私钥解密信封，返回 UTF-8 明文字符串（课表 JSON 文本，1.x 行 1530-1561）。
 * 流程：inspectEnvelope→解析加密 AES 密钥/IV/ciphertext/tag→拆分校验→RSA 解出 raw AES 密钥（须 32 字节）
 *      →importKey AES-GCM→ciphertext+tag 拼接→AES-GCM 解密（additionalData=protectedText）→大小校验→UTF-8 解码。
 * @param {object} envelope - isEncryptedEnvelope 为 true 的信封
 * @param {CryptoKey} privateKey - importPrivateKey 返回的私钥
 * @returns {Promise<string>}
 */
export async function decryptEnvelope(envelope, privateKey) {
  const { subtle } = getCryptoApi();
  const { protectedText } = inspectEnvelope(envelope);
  const encryptedKey = base64UrlToBytes(envelope.encrypted_key, 'encrypted_key');
  const iv = base64UrlToBytes(envelope.iv, 'iv');
  const ciphertext = base64UrlToBytes(envelope.ciphertext, 'ciphertext');
  const tag = base64UrlToBytes(envelope.tag, 'tag');
  if (iv.byteLength !== 12 || tag.byteLength !== 16 || !ciphertext.byteLength) {
    throw cryptoError(INVALID_ENVELOPE, '加密课表文件参数无效');
  }
  try {
    const rawAesKey = await subtle.decrypt({ name: 'RSA-OAEP' }, privateKey, encryptedKey);
    if (rawAesKey.byteLength !== 32) throw new Error('AES key length mismatch');
    const aesKey = await subtle.importKey('raw', rawAesKey, { name: 'AES-GCM' }, false, ['decrypt']);
    const encryptedContent = new Uint8Array(ciphertext.byteLength + tag.byteLength);
    encryptedContent.set(ciphertext);
    encryptedContent.set(tag, ciphertext.byteLength);
    const plaintext = await subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
        additionalData: textEncoder.encode(protectedText),
        tagLength: 128,
      },
      aesKey,
      encryptedContent
    );
    if (plaintext.byteLength > maxPlaintextBytes) {
      throw cryptoError(FILE_TOO_LARGE, '解密后的课表内容不能超过 5 MB');
    }
    return textDecoder.decode(plaintext);
  } catch (error) {
    if (error.code === FILE_TOO_LARGE) throw error;
    throw cryptoError(DECRYPT_FAILED, '解密密钥不匹配或加密文件已损坏', error);
  }
}
