/**
 * sites/portal/pages/hall — 新版信息门户应用中心（直连与 WebVPN 代理，#/hall）卡片注入
 * 对应 1.x：Better NXU.user.js 行 2436-2456（WebVPN 代理 portal）与行 2524-2544（直连 portal）：
 *           potalSwitchToFunc() 即时调用 + history.pushState/replaceState 猴补丁 + popstate 监听
 * 依赖：sites/portal/runtime/spa-history（patchPortalHistory 猴补丁 + onNavigate 集合，本 page 仅调一次传回调，
 *         不再粘贴 1.x 两处补丁块）、sites/portal/components/hall-injector（buildPortalOnNavigate + injectPortalHall）、
 *         utils/webvpn-url（实时解析代理 URL 的 realPath）、libraries/notification（installNotification 装 toast，
 *         injectPortalHall 错误分支用 toast）、utils/console
 * 入口/被谁调用：router 命中 portal.nxu.edu.cn 直连或 WebVPN 真实主机为 portal.nxu.edu.cn 后，
 *                均由 main 调本 page 的同一个 register
 *
 * 与 1.x 等价点（C5，03 §2 B8 验收 1）：
 *  - 两种形态均在 register 内立即触发一次 onNavigate，首屏已在 #/hall 时直接注入。
 *  - 两种形态共用同一份 patchPortalHistory，杜绝 1.x 两处 history 补丁粘贴。
 *  - 每次 SPA 导航实时解析 location.href：代理形态取 realPath，直连形态取 pathname；不依赖启动快照。
 *
 * 挂载形态：叠加注入——不清 body、不换 title（portal 自有页），仅向 iframe 内 div.city_sort 前插卡片 +
 *           打 history 猴补丁以对接门户 SPA 路由切换（切换不丢注入，03 §2 B8 验收 1）。
 */
import { installNotification } from '../../../libraries/notification.js';
import { patchPortalHistory } from '../runtime/spa-history.js';
import { parseWebVpnContext } from '../../../utils/webvpn-url.js';
import { buildPortalOnNavigate } from '../components/hall-injector.js';
import { MyConsole } from '../../../utils/console.js';

const console = MyConsole('[portal.hall]');

/**
 * 门户应用中心统一注入入口。对应 1.x WebVPN 代理与直连 portal 两处分支。
 * 装 toast → 打 history 猴补丁带 onNavigate（判定 #/hall 注卡片）→ 立即触发一次首屏判定（等价 1.x 即时 potalSwitchToFunc()）。
 */
export async function register() {
  installNotification();
  console('进入新版信息门户');

  // 每次导航读取实时 URL：WebVPN 代理取真实 realPath，直连取 pathname。不能使用启动时 context 快照。
  const onNavigate = buildPortalOnNavigate(() => {
    const current = parseWebVpnContext(window.location.href);
    return current?.realHost === 'portal.nxu.edu.cn' ? current.realPath : window.location.pathname;
  });
  // 两种入口共用同一份 pushState/replaceState/popstate 补丁。
  patchPortalHistory({ onNavigate });

  // 首屏先判定一次；否则待 SPA 切到 #/hall 时由 history 补丁触发。
  await onNavigate();
}
