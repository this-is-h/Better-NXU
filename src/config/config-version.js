/**
 * 配置版本常量与规范化
 * 对应 1.x：Better NXU.user.js 行 297-301（normalizeConfigVersion）、313（初始 ConfigVersion = 6）
 * 依赖：无
 * 入口/被谁调用：config 首启/版本引导（主页 VersionDialog 在 B7 实现）按本常量比对；
 *                gm-store 不直接依赖；首启引导逻辑读取 getGMValue('firstSet')/'configVersion' 后比对 ConfigVersion。
 *
 * 2.0 将自动登录默认值改为关闭，并移除已失效的“大先生”卡片选项，因此 ConfigVersion 升至 7，
 * 提示升级用户检查设置。旧存储中的显式值和已下线卡片名称不会被强制覆盖或删除。
 */

/**
 * UserConfig 结构版本号。每次新增或调整 UserConfig 项目时递增，用于提示用户查看配置页面。
 * 1.x 初始值为 6；2.0 的配置语义调整后升至 7。
 */
export const ConfigVersion = 7;

/**
 * 把任意来源的 configVersion 值规范化为非负安全整数，非法值回退为 0。
 * 1.x 行 297-301 逐字迁移（存储里可能被外部写成字符串等情况）。
 * @param {*} value
 * @returns {number}
 */
export function normalizeConfigVersion(value) {
  if (typeof value !== 'number' && typeof value !== 'string') return 0;
  const version = Number(value);
  return Number.isSafeInteger(version) && version >= 0 ? version : 0;
}
