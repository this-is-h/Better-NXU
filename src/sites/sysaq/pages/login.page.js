/**
 * sites/sysaq/pages/login — 实验室安全教育平台登录页（自动点"点击登录"跳认证页）
 * 对应 1.x：Better NXU.user.js 行 2545-2554（直连 sysaq case）与 行 2425-2434（webvpn 代理 sysaq 分支）
 *           的 "/lab-platform/" 登录子分支 + 行 3550-3563 的点击与跳转动作
 * 依赖：libraries/notification（installNotification 装 toast 体系；1.x 命中前 AddNotification）、utils/console
 * 入口/被谁调用：router 命中 sysaq（直连 sysaq.nxu.edu.cn 或 webvpn 代理 sysaq）且 path/realPath
 *                精确 '/lab-platform/' 后由 main 调本 page 的 register
 *
 * 与 1.x 等价点（C5）：
 *  - 1.x 行 2549-2550 / 2429-2430：命中后 AddNotification() 再执行登录动作。2.0 改 installNotification() 后内联执行。
 *  - 路由 path/realPath 精确为 '/lab-platform/'（行 2547 / 2427）才命登录页；含 '/lab-platform/login' 命认证页（见 auth.page.js）。
 *
 * 挂载形态：叠加注入——装 toast + 找按钮点跳，不清 body、不换 title。
 */
import { installNotification, toast } from '../../../libraries/notification.js';
import { MyConsole } from '../../../utils/console.js';

const console = MyConsole('[sysaq.login]');

/**
 * 实验室安全平台登录页注入。对应 1.x 登录动作（行 2550 / 2430）。
 */
export async function register() {
  installNotification();
  console('进入实验室安全教育平台登录页');

  const button = document.evaluate(
    "//button[.//span[contains(., '点击登录')]]",
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
  if (!button) return;

  toast('success', '自动登录…', 3);
  console('识别到"点击登录"按钮，自动跳转认证页');
  const url = new URL(window.location.href);
  url.pathname = url.pathname.replace(/\/$/, '') + '/login';
  window.location.href = url.toString();
}
