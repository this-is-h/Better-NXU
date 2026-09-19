/**
 * sites/webvpn/pages/knowledges-copy — 知网/万方 HTML 阅读页"自由复制"注入
 * 对应 1.x：Better NXU.user.js 行 2405-2415（webvpn host 分支 knowledges 命中）+ 行 3578-3622（webvpnCnkiHtml 函数体）
 * 依赖：libraries/notification（installNotification 装 toast 体系；1.x 路由命中前 Basic() 装 AddNotification，
 *         本 page 不再用 Basic——自调 installNotification，与 home.page.js 同模式）、
 *       libraries/notification.toast（1.x 行 3611 createToast；2.0 导出为 toast）、
 *       #gm（GM_setClipboard；1.x 行 3620 裸调）、utils/console
 * 入口/被谁调用：router 命中 webvpn 代理知网/万方阅读页后由 main 调本 page 的 register
 *
 * 与 1.x 等价点（C5）：
 *  - 使用标准 Selection API 读取当前选区文本；脚本不消费 HTML，无需克隆选区 DOM。
 *  - 行 3607-3609：若存在 h1.Chapter 则 user-select:auto 放开标题可选中（知网阅读页标题默认禁选）。逐字迁移。
 *  - 行 3611：createToast('success', '已开启复制，选中文字即可自动复制到粘贴板~', 3) → toast(...)。
 *  - 行 3613-3621：document mouseup 监听，选区非空则 GM_setClipboard(getCurrentSelect().text) 自动复制。逐字迁移。
 *
 * 路由判定（router JUDGE_TABLE 复刻 1.x 行 2405/2412）：
 *  - 知网：isWebVpnRealHost(ctx.vpnContext,'kns.cnki.net') || isWebVpnRealHost(ctx.vpnContext,'www.cnki.net')
 *    且 realPath 含 '/xmlRead/trialRead'（1.x 行 2405/2407，老阅读页）。
 *  - 知网新版：realHost 同上且 realPath 含 '/reader/xml'（2026-08-01 实测 webvpn 代理 kns 新阅读页路径
 *    落 /https/<token>/reader/xml，realPath=/reader/xml；1.x 未处理，2.0 起补此命中，自由复制逻辑通用）。
 *  - 万方：isWebVpnRealHost(ctx.vpnContext,'f.wanfangdata.com.cn') 且 realPath 含 '/online/pc/periodical_html'
 *    （1.x 行 2412）。两者同走 webvpnCnkiHtml（自由复制逻辑对知网/万方 HTML 阅读页通用）。
 *
 * 挂载形态：叠加注入——仅装 toast + 监听 mouseup，不清 body、不换 title，不调 mountAppPage。
 */
import { installNotification, toast } from '../../../libraries/notification.js';
import { GM_setClipboard } from '#gm';
import { MyConsole } from '../../../utils/console.js';

const console = MyConsole('[webvpn.knowledges-copy]');

/**
 * 知网/万方 HTML 阅读页自由复制注入。对应 1.x webvpnCnkiHtml()（行 3578-3622）。
 */
export async function register() {
  // 1.x 行 2408/2413 命中前 Basic() 装 AddNotification（toast 体系）；2.0 各 page 自调 installNotification。
  installNotification();

  // 1.x 行 3607-3609：放开知网阅读页标题可选（h1.Chapter 默认 user-select 禁用）。
  const chapterH1 = document.querySelector('h1.Chapter');
  if (chapterH1) chapterH1.setAttribute('style', 'user-select:auto;');

  console('文本选择监听已启用');
  // 1.x 行 3611：createToast('success','已开启复制...',3) → 2.0 toast(...)。
  toast('success', '已开启复制，选中文字即可自动复制到粘贴板~', 3);

  // 1.x 行 3613-3621：mouseup 监听，选区非空则 GM_setClipboard 自动复制。
  document.addEventListener('mouseup', () => {
    const text = window.getSelection()?.toString() || '';
    if (text === '') return;
    console('捕获当前选区并写入剪贴板', { length: text.length }, 'debug');
    GM_setClipboard?.(text);
  });
}
