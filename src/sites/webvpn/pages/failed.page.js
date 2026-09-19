/**
 * sites/webvpn/pages/failed — webvpn 未识别失败页处理（按 autoClose 配置自动关窗）
 * 对应 1.x：Better NXU.user.js 行 2416-2424（webvpn host 分支 '/wengine-vpn/failed' 命中）
 *           + 行 2458-2460（default 分支 404 页 errorHtml）+ 行 7206-7211（errorHtml 函数体）
 * 依赖：config/gm-store（getGMValue 读 WebVPN.autoClose 守卫）、utils/console
 * 入口/被谁调用：router 命中 webvpn '/wengine-vpn/failed'（非 tools 子分支）后由 main 调本 page 的 register
 *
 * 与 1.x 等价点（C5）：
 *  - 行 7207-7209：if (!getGMValue('WebVPN.autoClose')) return; —— 未开"全自动登录"则不关窗。
 *  - 行 7210 CloseWin()：2.0 统一使用 vite-plugin-monkey 官方 monkeyWindow.close 路径。
 *
 * 路由判定（router JUDGE_TABLE 复刻 1.x 行 2416-2424）：
 *  path === '/wengine-vpn/failed' 且 body 不含 '地址：/h/tools' —— 含 '地址：/h/tools' 走 tools page（1.x 行 2417）。
 *  另：1.x default 分支行 2458-2460 的 404 页也走 errorHtml，但其 host 落点不在 webvpn（default 是 host 全 switch
 *  的兜底，2.0 路由表未命中即跑空），故本 page 不承载 404——仅承载 webvpn 显式 failed 页。
 *
 * 挂载形态：纯行为注入（无 DOM/无 toast）——读配置后调原生 window 关闭 API。不清 body、不装 notification。
 */
import { getGMValue } from '../../../config/gm-store.js';
import { closeCurrentTab } from '../../../utils/file.js';
import { MyConsole } from '../../../utils/console.js';

const console = MyConsole('[webvpn.failed]');

/**
 * webvpn 未识别失败页处理。对应 1.x errorHtml()（行 7206-7211）。
 * 1.x 路由命中行 2423 "按错误页配置处理" 即调本逻辑。
 */
export async function register() {
  // 1.x 行 7207-7209：未开 WebVPN.autoClose 则不关窗，原样返回。
  if (!getGMValue('WebVPN.autoClose')) return;

  // 使用 vite-plugin-monkey 官方 monkeyWindow.close 路径关闭当前页。
  console('按 WebVPN.autoClose 配置自动关闭失败页');
  closeCurrentTab();
}
