/**
 * sites/sysaq/pages/auth — 实验室安全教育平台认证页（自动点"统一身份认证登录"链接）
 * 对应 1.x：Better NXU.user.js 行 2551-2554（直连 sysaq case）与 行 2431-2434（webvpn 代理 sysaq 分支）
 *           的 "/lab-platform/login" 认证子分支 + 行 3566-3575 的点击动作
 * 依赖：libraries/notification、utils/dom（simulateClick）、utils/console
 * 入口/被谁调用：router 命中 sysaq（直连或 webvpn 代理）且 path/realPath 含 '/lab-platform/login'
 *                后由 main 调本 page 的 register
 *
 * 与 1.x 等价点（C5）：
 *  - 1.x 行 2553-2554 / 2433-2434：命中后 AddNotification() 再执行认证动作。2.0 改 installNotification() 后内联执行。
 *  - 路由 path/realPath 含 '/lab-platform/login'（行 2551 / 2431 子串匹配）才命认证页；
 *    精确 '/lab-platform/' 命登录页（见 login.page.js）。两者互斥（精确 vs 含 'login' 子串），
 *    故 login entry 在 auth entry 之前判（精确命中优先）。
 *
 * 挂载形态：叠加注入——装 toast + 找链接点跳，不清 body、不换 title。
 */
import { installNotification, toast } from '../../../libraries/notification.js';
import { simulateClick } from '../../../utils/dom.js';
import { MyConsole } from '../../../utils/console.js';

const console = MyConsole('[sysaq.auth]');

/**
 * 实验室安全平台认证页注入。对应 1.x 认证动作（行 2554 / 2434）。
 */
export async function register() {
  installNotification();
  console('进入实验室安全教育平台认证页');

  const button = document.evaluate(
    ".//a[contains(., '统一身份认证登录')]",
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
  if (!button) return;

  toast('success', '自动登录…', 3);
  console('识别到"统一身份认证登录"链接，自动点击');
  simulateClick(button);
}
