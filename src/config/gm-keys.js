/**
 * GM 存储键注册表与默认值
 * 对应 1.x：Better NXU.user.js 行 205-227（GM_VALUE_DEFAULTS）、229-243（SETTINGS_RESET_KEYS）、
 *          245-248（cloneGMValue）、250-252（hasLoginCredentials）
 * 依赖：无
 * 入口/被谁调用：config/gm-store.js（getGMValue/重置逻辑）、各 sites（读配置）
 *
 * 兼容硬约束（C3）：所有 GM 键名保持 1.x 稳定，含 WebVPN / Jwgl / TuanWei 三组分组前缀
 * 与 firstSet/configVersion/icsId/Schedule.encryptionKeyPair。默认值可以在明确评估升级行为后调整；
 * 老用户 ScriptCat 命名空间 @storageName h.nxu 下已持久化的值仍优先于本表默认值。
 *
 * 完整配置与安全边界见 docs/dev/data-and-security.md。
 */

/**
 * 注册的 GM 键及其默认值。getGMValue 会拒绝未注册键（强校验，见 gm-store.js getGMValue）。
 * 由 1.x 行 205-227 迁移。Object.freeze 防运行时被改。
 *
 * 注意：
 *  - username/password 默认 undefined（用户首次配置前无值）。
 *  - 两组 autoLogin 默认 false；已有用户已持久化的 true/false 不会被覆盖。
 *  - customCard/customMenu/qualityJson 默认数组；旧值中的已下线卡片名称会被渲染层忽略但不强制删除。
 *  - firstSet=0 / configVersion=0（与 ConfigVersion=7 比对触发首启/升级引导，见 config-version.js）。
 *  - TuanWei.autoDownload*：1.x case 已注释、业务未消费（01 §4 备注），此处保留兼容（C3）。
 */
export const GM_VALUE_DEFAULTS = Object.freeze({
  'WebVPN.username': undefined,
  'WebVPN.password': undefined,
  'WebVPN.autoLogin': false,
  'WebVPN.autoReLogin': false,
  'WebVPN.autoClose': false,
  'WebVPN.courseGrab': true,
  'WebVPN.customTool': true,
  'WebVPN.customCard': ['教务管理', '学工系统', '信息门户', '中国知网', '万方数据'],
  // 大先生服务恢复后可改回：
  // 'WebVPN.customCard': ['教务管理', '学工系统', '信息门户', '中国知网', '万方数据', '大先生'],
  'WebVPN.qualityJson': [],
  'WebVPN.searchClose': true,
  'Jwgl.username': undefined,
  'Jwgl.password': undefined,
  'Jwgl.autoLogin': false,
  'Jwgl.courseBeautify': true,
  'Jwgl.customMenu': ['全部学期成绩'],
  'TuanWei.autoDownload': false,
  'TuanWei.autoDownloadClose': false,
  firstSet: 0,
  configVersion: 0,
  icsId: undefined,
  'Schedule.encryptionKeyPair': undefined,
});

/**
 * "恢复功能默认值"覆盖范围（13 项，仅功能开关，不含用户名/密码/首启/版本/密钥等私人数据）。
 * 1.x 行 229-243 逐字迁移，供 resetFunctionSettingValues 使用。
 */
export const SETTINGS_RESET_KEYS = Object.freeze([
  'WebVPN.autoLogin',
  'WebVPN.autoReLogin',
  'WebVPN.autoClose',
  'WebVPN.courseGrab',
  'WebVPN.customTool',
  'WebVPN.customCard',
  'WebVPN.qualityJson',
  'WebVPN.searchClose',
  'Jwgl.autoLogin',
  'Jwgl.courseBeautify',
  'Jwgl.customMenu',
  'TuanWei.autoDownload',
  'TuanWei.autoDownloadClose',
]);

/**
 * 深拷贝 GM 值（默认数组/对象不可被多调用间共享引用）。1.x 行 245-248 逐字迁移。
 * @param {*} value
 * @returns {*}
 */
export function cloneGMValue(value) {
  if (value === null || typeof value !== 'object') return value;
  return JSON.parse(JSON.stringify(value));
}

/**
 * 判断是否具备登录凭证（用户名与密码均非空白）。
 * 1.x 行 250-252 逐字迁移；用于 getAllSettingDefaults 在缺凭证时把 autoLogin 默认置 false。
 * @param {*} username
 * @param {*} password
 * @returns {boolean}
 */
export function hasLoginCredentials(username, password) {
  return String(username ?? '').trim() !== '' && String(password ?? '').trim() !== '';
}
