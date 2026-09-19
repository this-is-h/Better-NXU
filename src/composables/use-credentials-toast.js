/**
 * use-credentials-toast — 凭证缺失/错误统一 toast（替代 1.x 散点“错账号密码错误 toast”）
 * 对应 1.x：Better NXU.user.js 行 2133-2145（CheckUsernameAndSecret）、2138-2141 / 2624-2627 /
 *          2749-2752（三处“账号密码未配置/错误 → 前往设置”toast）
 * 依赖：config/gm-store（getGMValue 读凭证）、libraries/notification（toast 副作用）、utils/auth-form（文案构造）
 * 入口/被谁调用：sites/ids（login/re-auth）、sites/jwgl（login）：先 requireCredentials 后 notifyCredentialsProblem
 *
 * 抽取动机（01 §8.2-3）：
 *  1.x 的"凭证问题 toast"散在 CheckUsernameAndSecret、webvpnLogin、jwglLogin 三处，文案与跳转入口各写一份。
 * 2.0 合并到本 composable：requireCredentials 做读校验+弹 toast 兜底（等价 1.x
 *  CheckUsernameAndSecret），notifyCredentialsProblem 做纯弹 toast（供登录回显错误分支，1.x 行 2624/2749）。
 *  文案经 utils/auth-form.buildCredentialsErrorToast 构造，跳转入口按 host 选择增强设置页或原生配置面板。
 *
 * opener 选择（与 1.x 两处 onclick 一字不差对齐）：
 *  - 'Jwgl' → 'openConfig'（CAT_userConfig，1.x 行 2751；教务自定义 Menu/原生配置面板）
 *  - 'WebVPN' / ids → 'settingsPage'（普通链接打开增强设置页）
 *  host → opener 映射在 resolveOpener 集中：新增站点须在此补一条，避免误用。
 */
import { getGMValue } from '../config/gm-store.js';
import { toast, installNotification } from '../libraries/notification.js';
import { buildCredentialsErrorToast } from '../utils/auth-form.js';
import { MyConsole } from '../utils/console.js';

const console = MyConsole('[credentials]');

/**
 * 按 host 解析 toast 跳转入口形态。'Jwgl' 走 ScriptCat 原生 CAT_userConfig；其余使用设置页普通链接。
 * @param {string} host - 登录组前缀：'WebVPN' | 'Jwgl'
 * @returns {'settingsPage'|'openConfig'}
 */
function resolveOpener(host) {
  return host === 'Jwgl' ? 'openConfig' : 'settingsPage';
}

/**
 * 校验指定组是否已配置登录凭证；缺则弹"请前往配置"toast 并返回 false（等价 1.x 行 2133-2145 CheckUsernameAndSecret）。
 * 供 ids/jwgl 登录页在自动登录前调用：返回 false 应中止自动登录（与 1.x 行 2618/2743 的 if(!Check...) return 一致）。
 *
 * 幂等 toast：installNotification 一次性装好 toast 全局，本函数只 grid 弹单条。toast 持续秒数与 1.x 一致（0 = 常驻）。
 * @param {string} host - 'WebVPN' | 'Jwgl'
 * @returns {boolean} true=已配置可继续登录，false=缺失已弹 toast 应回退手动
 */
export function requireCredentials(host) {
  const username = getGMValue(`${host}.username`);
  const password = getGMValue(`${host}.password`);
  if (username && password) return true;
  console(`[${host}] 未配置登录账号或密码`, '请前往 Better NXU 设置页面补充', 'warn');
  installNotification();
  toast('error', buildCredentialsErrorToast({ missing: true, opener: resolveOpener(host) }), 0);
  return false;
}

/**
 * 仅弹一次"凭证配置错误 → 前往设置"toast（不读 GM、不校验，用于登录回显错误分支）。
 * 对应 1.x webvpnLogin 行 2624-2627（isCredentialsErrorText 命中后弹）、jwglLogin 行 2749-2752（密码错误/账户不存在）。
 * @param {string} host - 'WebVPN' | 'Jwgl'
 * @param {number} [duration=5] - toast 持续秒数（1.x 错误分支用 5）
 */
export function notifyCredentialsProblem(host, duration = 5) {
  installNotification();
  toast('error', buildCredentialsErrorToast({ missing: false, opener: resolveOpener(host) }), duration);
}
