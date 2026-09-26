/**
 * GM 配置存储读写 + 重置
 * 对应 1.x：Better NXU.user.js 行 254-284（getResettableSettingDefaults/resetFunctionSettingValues/
 *          getAllSettingDefaults/resetAllSettingValues）、286-295（getGMValue）
 * 依赖：config/gm-keys.js（GM_VALUE_DEFAULTS / SETTINGS_RESET_KEYS / cloneGMValue / hasLoginCredentials）
 * 入口/被谁调用：各 sites/pages 读配置 → getGMValue；设置页重置 → resetAllSettingValues/resetFunctionSettingValues
 *
 * 说明：1.x 无 set*Value 包装、无 setGMValue 包装，写都直接调 GM_setValue；2.0 按目录树（02 §2）
 * 增加 setGMValue 包装并同样做键注册校验，统一写入入口，便于以后加埋点/校验。
 * 配置变化通过 ConfigVersion 提示用户检查设置，已有显式存储值不覆盖。
 * GM API 通过 vite-plugin-monkey 的官方 ESM 客户端别名 #gm 导入，autoGrant 自动生成权限。
 * 写入优先使用 ScriptCat 官方 Promise API `GM.setValue(s)`，并保留旧式同步 API 兼容路径。
 */
import { GM, GM_getValue, GM_setValue, GM_setValues } from '#gm';
import { GM_VALUE_DEFAULTS, SETTINGS_RESET_KEYS, cloneGMValue, hasLoginCredentials } from './gm-keys.js';

async function setValues(values) {
  if (typeof GM?.setValues === 'function') {
    await GM.setValues(values);
    return;
  }
  if (typeof GM_setValues === 'function') {
    await GM_setValues(values);
    return;
  }
  await Promise.all(Object.entries(values).map(([name, value]) => GM_setValue(name, value)));
}

/**
 * 读取一个已注册的 GM 键值；未持久化时通过 GM_getValue 的默认值参数返回默认值，不产生写入副作用。
 * 未注册键直接抛错（拒绝拼写漂移）。1.x 行 286-295 逐字迁移。
 * @param {string} name - GM 键名（必须在 GM_VALUE_DEFAULTS 中）
 * @returns {*} 配置值（深拷贝副本）
 */
export function getGMValue(name) {
  if (!Object.prototype.hasOwnProperty.call(GM_VALUE_DEFAULTS, name)) {
    throw new Error(`未注册的 GM 存储键：${name}`);
  }
  const defaultValue = cloneGMValue(GM_VALUE_DEFAULTS[name]);
  return cloneGMValue(GM_getValue(name, defaultValue));
}

/**
 * 写入一个已注册的 GM 键值（2.0 新增包装，1.x 直接 GM_setValue）。
 * 同样做键注册校验，避免误写未注册键静默落入命名空间。
 * @param {string} name - GM 键名
 * @param {*} value - 待存值（无深拷贝，调用方注意引用风险）
 */
export async function setGMValue(name, value) {
  if (!Object.prototype.hasOwnProperty.call(GM_VALUE_DEFAULTS, name)) {
    throw new Error(`未注册的 GM 存储键：${name}`);
  }
  if (typeof GM?.setValue === 'function') {
    await GM.setValue(name, value);
    return;
  }
  await GM_setValue(name, value);
}

/** 取 SETTINGS_RESET_KEYS 对应的默认值集合（{name: default}）。1.x 行 254-259 逐字迁移。 */
export function getResettableSettingDefaults() {
  return Object.fromEntries(SETTINGS_RESET_KEYS.map((name) => [name, cloneGMValue(GM_VALUE_DEFAULTS[name])]));
}

/**
 * 仅重置"功能默认值"（SETTINGS_RESET_KEYS 范围，不含用户名/密码/首启/版本/密钥）。
 * 1.x 行 261-265 逐字迁移。返回写入后的默认集合。
 * @returns {Promise<Record<string,*>>}
 */
export async function resetFunctionSettingValues() {
  const defaults = getResettableSettingDefaults();
  await setValues(defaults);
  return defaults;
}

/**
 * 取全量默认值集合，并对缺凭证的 WebVPN/Jwgl 组把 autoLogin 默认置 false。
 * 由 1.x 行 267-278 迁移；当前 autoLogin 默认 false，无凭证时继续强制保持 false。
 * @returns {Record<string,*>}
 */
export function getAllSettingDefaults() {
  const defaults = Object.fromEntries(
    Object.entries(GM_VALUE_DEFAULTS).map(([name, value]) => [name, cloneGMValue(value)])
  );
  ['WebVPN', 'Jwgl'].forEach((group) => {
    if (!hasLoginCredentials(defaults[`${group}.username`], defaults[`${group}.password`])) {
      defaults[`${group}.autoLogin`] = false;
    }
  });
  return defaults;
}

/**
 * 重置全部配置为默认值（含用户名/密码清空、密钥清除等）。1.x 行 280-284 逐字迁移。
 * 设置页"恢复全部默认值"用此入口。返回写入后的默认集合。
 * @returns {Promise<Record<string,*>>}
 */
export async function resetAllSettingValues() {
  const defaults = getAllSettingDefaults();
  await setValues(defaults);
  return defaults;
}
