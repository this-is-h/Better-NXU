/**
 * 站点判定与分发路由
 * 对应 1.x：Better NXU.user.js 行 ~2352-2591 的 `switch (Host) {}` 巨型路由块
 * 依赖：各 site page 模块（静态 import）、utils/console、ctx（getContext）
 * 入口/被谁调用：main.js 调 resolveRoute()，返回命中的 register 函数或 null
 *
 * 加载模型：所有 page 使用静态 import，构建保持一个无需额外运行时的用户脚本文件。
 *
 * 须保留的 1.x 判定形态（当前路由约束见 docs/dev/architecture.md）：
 *  - `202.201.128.234` 使用精确 hostname，端口不影响匹配（B6 入表时）。
 *  - `open.weixin.qq.com` 须 URL 含 `nxu.edu` 守卫才命中（1.x 行 2354）。
 *  - `tuanwei.nxu.edu.cn` 仅附件下载端点启用验证码识别与下载。
 *  - `sslvpn.nxu.edu.cn`：/h/settings、/h/about 命中（设置/关于仅 sslvpn，需求4）；其它 path 不命中。
 *  - `webvpn.nxu.edu.cn`：/h/tools 或带工具标记的失败页 → tools；其它失败页 → failed；
 *    知网/万方阅读页；代理 sysaq/ids/weixin/portal 各按 realHost 命中；仅根路径 → home。
 */
import { MyConsole } from './utils/console.js';
import { getContext } from './context.js';
// 静态 import 各 site page 模块（见上"加载模型决策"）。page 统一 `export function register`（具名），故用具名 import。
import { register as registerIdsLogin } from './sites/ids/pages/login.page.js';
import { register as registerIdsReAuth } from './sites/ids/pages/re-auth.page.js';
import { register as registerIdsCallback } from './sites/ids/pages/callback.page.js';
import { register as registerWeixinFastLogin } from './sites/weixin/pages/fast-login.page.js';
import { register as registerSslvpnSettings } from './sites/sslvpn/pages/settings.page.js';
import { register as registerSslvpnAbout } from './sites/sslvpn/pages/about.page.js';
import { register as registerJwglLogin } from './sites/jwgl/pages/login.page.js';
import { register as registerJwglHome } from './sites/jwgl/pages/home.page.js';
import { register as registerJwglCourseTableContainer } from './sites/jwgl/pages/course-table-container.page.js';
import { register as registerJwglCourseTable } from './sites/jwgl/pages/course-table.page.js';
import { register as registerWebvpnHome } from './sites/webvpn/pages/home.page.js';
import { register as registerCnkiReader } from './sites/cnki/pages/reader.page.js';
import { register as registerWanfangReader } from './sites/wanfang/pages/reader.page.js';
import { register as registerWebvpnFailed } from './sites/webvpn/pages/failed.page.js';
import { register as registerWebvpnTools } from './sites/webvpn/pages/tools.page.js';
import { register as registerSysaqLogin } from './sites/sysaq/pages/login.page.js';
import { register as registerSysaqAuth } from './sites/sysaq/pages/auth.page.js';
import { register as registerPingjiaoNotify } from './sites/pingjiao/pages/notify.page.js';
import { register as registerTuanweiDownload } from './sites/tuanwei/pages/download.page.js';
import { register as registerPortalHall } from './sites/portal/pages/hall.page.js';
import { isWebVpnRealHost, WEBVPN_HOST_TOKENS } from './utils/webvpn-url.js';
import { LIBRARY_READER_PLATFORMS, resolveLibraryReader } from './utils/library-reader.js';
import { createLibraryReaderRegistration } from './composables/library-reader.js';
import {
  isWebVpnIdsLoginRoute,
  isWebVpnIdsReAuthRoute,
  isWebVpnToolsRoute,
  isWebVpnFailedRoute,
  isTuanweiDownloadRoute,
} from './utils/route-guards.js';

/**
 * 判当前是否为 jwgl 教务系统任意一种命中形态（直连 jwgl.nxu.edu.cn / IP 202.201.128.234 含端口变体 /
 * webvpn 代理 jwgl）。1.x 行 2366/2485/2570 三处分发共用同一段语义；2.0 统一供 jwgl 四 page 的 test 复用。
 * @returns {boolean}
 */
function isJwglSite(ctx) {
  // hostname 不含端口，教务域名和 IP 均精确比较。
  if (ctx.host === 'jwgl.nxu.edu.cn' || ctx.isJwglIp) return true;
  // webvpn 代理：realHost 为 jwgl.nxu.edu.cn 或 202.201.128.234（1.x 行 2366 isWebVpnRealHost 二选一）。
  if (
    ctx.isWebvpn &&
    (isWebVpnRealHost(ctx.vpnContext, 'jwgl.nxu.edu.cn') ||
      isWebVpnRealHost(ctx.vpnContext, '202.201.128.234'))
  ) {
    return true;
  }
  return false;
}

/**
 * 取当前页用于 jwgl 页面区分的"路径串"：webvpn 代理下用 realPath（被代理真实路径），直连/IP 用整 Url 子串
 * （1.x 直连分支行 2491/2495/2499 用 `Url.indexOf('cas.action')!= -1` 等整 URL 子串判定，故保持同形）。
 * @returns {string}
 */
function jwglPathOrUrl(ctx) {
  if (ctx.isWebvpn) return ctx.vpnContext?.realPath || '';
  return ctx.url;
}

const console = MyConsole('[路由]');
const readerRegistrations = new Map([
  ['cnki', registerCnkiReader],
  ['wanfang', registerWanfangReader],
]);

/**
 * 命中判定表：有序数组，每项 { site, page, module, test(ctx) }。
 * module 为已静态 import 的 page 模块（含 register）。顺序敏感——更具体的判定须排在更宽泛判定前。
 *
 * 已落地：sslvpn(settings/about)、jwgl(login/home/course-table-container/course-table)、
 *         weixin(fast-login)、ids(login/re-auth/callback)、webvpn(home/failed/tools)、cnki(reader)、wanfang(reader)、
 *         sysaq(login/auth 直连+代理)、pingjiao(notify)、tuanwei(download)、portal(hall 直连+代理)。
 *         sslvpn settings/about 为真实分发（B9 并入 sslvpn/pages，无 shared 转发层）。详见各 entry 注释。
 * webvpn 代理 ids/weixin 三分支（见下 webvpn-via-ids-* entry，2026-08-01 补）：1.x webvpn case 行 2386-2398
 *   原本就是 webvpn host 下复用 ids/weixin page 的登录/二次确认/扫码能力。2.0 此前漏建——webvpn 代理下访问
 *   资源跳到 `webvpn.nxu.edu.cn/https/<ids-token>/authserver/login` 时 ctx.host='webvpn.nxu.edu.cn'，
 *   只判 `host==='ids.nxu.edu.cn'` 的直连 entry 永不命中，落到 webvpn home → 自动登录实为不工作。此三 entry
 *   排在 webvpn home 之前抢命中（host 为 webvpn.nxu.edu.cn，与 ids/weixin 直连 entry 天然互斥）。
 *   注意：webvpn 代理 jwgl 已在本表命中（见 jwgl 各 entry 的 webvpn 分支，isJwglSite），webvpn default home
 *   须排在 jwgl entry 之后，避免代理 jwgl 被误判进 home。
 * 路由表覆盖校园站点与文献阅读页；高风险 IDS 代理路由另经 route-guards 做严格主机/路径校验。
 */
const JUDGE_TABLE = [
  // === sslvpn：仅承载 settings/about 两页的分发（需求4：设置/关于仅 sslvpn 命中）===
  {
    site: 'sslvpn',
    page: 'settings',
    register: registerSslvpnSettings,
    test: (c) => c.host === 'sslvpn.nxu.edu.cn' && c.path === '/h/settings',
  },
  {
    site: 'sslvpn',
    page: 'about',
    register: registerSslvpnAbout,
    test: (c) => c.host === 'sslvpn.nxu.edu.cn' && c.path === '/h/about',
  },

  // === jwgl：教务系统四种页面 × 三种命中形态（直连 jwgl.nxu.edu.cn / IP 202.201.128.234 含端口变体 /
  //   webvpn 代理 jwgl），共用同一组 page 模块（见 docs/dev/architecture.md）===
  // login：path/realPath 含 index.action 或 login.action，且精确为这两种之一（不命中 home/courseTable 的
  //  cas.action/home.action/courseTableForStd.action——但为与 1.x webvpn 行 2369 `realPath.indexOf` 同形，
  //  且与直连/IP 行 2487/2572 `Path == '/index.action'` 同形，混合用两种 mild 子串/严格匹配）。等价简写：
  //  webvpn 代理用 realPath 子串判 index/login.action；直连/IP 用 path 精确等于（含与 home/courseTable 互斥）。
  {
    site: 'jwgl',
    page: 'login',
    register: registerJwglLogin,
    test: (c) => {
      if (!isJwglSite(c)) return false;
      if (c.isWebvpn) {
        const p = c.vpnContext?.realPath || '';
        return p.indexOf('index.action') !== -1 || p.indexOf('login.action') !== -1;
      }
      return c.path === '/index.action' || c.path === '/login.action';
    },
  },
  // home：url/realPath 含 cas.action 或 home.action（1.x 行 2491/2576/2373）。
  {
    site: 'jwgl',
    page: 'home',
    register: registerJwglHome,
    test: (c) => {
      if (!isJwglSite(c)) return false;
      const p = jwglPathOrUrl(c);
      return p.indexOf('cas.action') !== -1 || p.indexOf('home.action') !== -1;
    },
  },
  // course-table-container：courseTableForStd.action & method=stdHome（1.x 行 2495/2580/2377）。
  {
    site: 'jwgl',
    page: 'course-table-container',
    register: registerJwglCourseTableContainer,
    test: (c) =>
      isJwglSite(c) &&
      c.url.indexOf('courseTableForStd.action') !== -1 &&
      c.query.get('method') === 'stdHome',
  },
  // course-table：courseTableForStd.action & method=courseTable（1.x 行 2499/2584/2381）。
  //  顺序：须在 course-table-container 后（二者 method 不同互斥，但保持 1.x 顺序特化在前）。
  {
    site: 'jwgl',
    page: 'course-table',
    register: registerJwglCourseTable,
    test: (c) =>
      isJwglSite(c) &&
      c.url.indexOf('courseTableForStd.action') !== -1 &&
      c.query.get('method') === 'courseTable',
  },

  // === weixin：open.weixin.qq.com 且 URL 含 nxu.edu 守卫（1.x 行 2353-2356）===
  {
    site: 'weixin',
    page: 'fast-login',
    register: registerWeixinFastLogin,
    test: (c) => c.host === 'open.weixin.qq.com' && c.url.indexOf('nxu.edu') !== -1,
  },

  // === ids：ids.nxu.edu.cn 统一认证三页（1.x 行 2505-2522）===
  // login：path 含 /authserver/login（1.x 行 2507）。须早于 re-auth/callback（互斥，保持 1.x 顺序）。
  {
    site: 'ids',
    page: 'login',
    register: registerIdsLogin,
    test: (c) => c.host === 'ids.nxu.edu.cn' && c.path.indexOf('/authserver/login') !== -1,
  },
  // re-auth：url 含 /authserver/reAuthCheck/（1.x 行 2510）。
  {
    site: 'ids',
    page: 're-auth',
    register: registerIdsReAuth,
    test: (c) => c.host === 'ids.nxu.edu.cn' && c.url.indexOf('/authserver/reAuthCheck/') !== -1,
  },
  // callback：两种形态同命中本 page（callback.page.js 内按 ctx 再分流，02 §2 "含 webvpn 代理内分支"）:
  //   ① path == /authserver/callback（1.x 行 2518 → idsReLogin）
  //   ② url 含 open.weixin 代理 token + /connect/qrconnect（1.x 行 2514 → webvpnReLogin）
  {
    site: 'ids',
    page: 'callback',
    register: registerIdsCallback,
    test: (c) =>
      c.host === 'ids.nxu.edu.cn' &&
      (c.path === '/authserver/callback' ||
        // 被代理 open.weixin.qq.com 的 webvpn token（单一来源：WEBVPN_HOST_TOKENS，避免 token 变动时 JSON 表与
        // 本处裸字面量两处不同步；1.x 行 2514 原为整串字面量，语义不变）。
        c.url.indexOf(`/${WEBVPN_HOST_TOKENS['open.weixin.qq.com']}/connect/qrconnect`) !== -1),
  },

  // === webvpn 代理 ids/weixin 三分支（1.x webvpn case 行 2386-2398 复用 ids/weixin page）===
  // webvpn host 下命中 ids 登录页/二次确认页/微信扫码页时，复用直连 ids/weixin 同一组 page（其内逻辑与代理/直连
  // 形态无关：idsLogin 填账号提交 / re-auth 调 reAuthByCombined / callback 内按 ctx 再分流扫码 vs 修复）。
  // 须排在 WebVPN 普通页面之前——代理 ids 登录页 host 为 webvpn.nxu.edu.cn，
  // 不抢在 home 前会被 isWebvpnHost 判定吞掉。与 ids 直连 entry（host==='ids.nxu.edu.cn'）天然互斥，序无歧义。
  //
  // ① webvpn-via-ids login：1.x 行 2386-2388 判定逐字。OR 四选一触发登录页判定：
  //   (代理ids && realPath 含 /authserver/login) || url 含 "service=https%3A%2F%2Fwebvpn.nxu.edu.cn%2Flogin%3Fcas_login%3Dtrue"
  //   || url 含 /authserver/login || url 含 'login'，且排除 nonlogin / connect/qrconnect / reAuthCheck /
  //   sysaq token '...e3ee529d.../' / caslogin token '...a1a70fcd.../#/pages/login/caslogin'  五项。
  //   命中复用 ids login page（installNotification + idsLogin/LoginFillButton）。
  {
    site: 'ids',
    page: 'login',
    register: registerIdsLogin,
    test: isWebVpnIdsLoginRoute,
  },
  // ② webvpn-via-ids re-auth：仅在代理真实主机为 ids.nxu.edu.cn 且真实路径为二次确认页时命中。
  //   不再用外层 URL 子串兜底，避免其它被代理站点构造同名路径后触发 IDS 页面逻辑。
  {
    site: 'ids',
    page: 're-auth',
    register: registerIdsReAuth,
    test: isWebVpnIdsReAuthRoute,
  },
  // ③ webvpn-via-weixin callback：1.x 行 2395-2398 微信扫码页。代理 open.weixin.qq.com 即命 ids callback page
  //   （其内 ctx.url 含 open.weixin token + /connect/qrconnect 即走 redirectToWeixinScan 重建扫码页跳转）。
  //   注意 1.x 此分支未做 url 含 qrconnect 守卫——靠 isWebVpnRealHost(open.weixin) 精确命中被代理的扫码页；
  //   ids callback page 内部再用 token 子串分流，避免误吞其它形态。
  {
    site: 'ids',
    page: 'callback',
    register: registerIdsCallback,
    test: (c) => c.isWebvpn && isWebVpnRealHost(c.vpnContext, 'open.weixin.qq.com'),
  },

  // === webvpn：主域 webvpn.nxu.edu.cn 各 page 分发（B7 增量接入）===
  // home：webvpn 主页。1.x 行 2399-2402 `Url == 'https://webvpn.nxu.edu.cn/' || Path == "/"`。
  //  须排在所有代理判定之后——代理 jwgl/ids/weixin 已在各自 site entry（host != webvpn.nxu.edu.cn，
  //  故与 jwgl 主域 entry 的 host 判定天然互斥；但放最后保持顺序安全，对齐注释"webvpn default home 须排
  //  jwgl entry 后避免代理 jwgl 被误判进 home"）。isWebvpnHost 即 host==='webvpn.nxu.edu.cn'（context 第49行）。
  // 仅根路径命中主页；工具、失败页、知识库和代理站点均由后续更具体的表项处理。
  {
    site: 'webvpn',
    page: 'home',
    register: registerWebvpnHome,
    test: (c) => c.isWebvpnHost && (c.url === 'https://webvpn.nxu.edu.cn/' || c.path === '/'),
  },
  // 直连、zylib 和 WebVPN 共用平台规则；新增复制平台自动获得路由。
  ...LIBRARY_READER_PLATFORMS.map(({ id }) => ({
    site: id,
    page: 'reader',
    register: readerRegistrations.get(id) || createLibraryReaderRegistration(id),
    test: (c) => resolveLibraryReader(c)?.id === id,
  })),
  // tools：直接 /h/tools，或带专用地址标记的旧失败页入口。
  //  须排在 failed 前——同 path、靠 body 标记互斥（failed test 含 `=== -1` 判定）。tools.page.js 为
  //  1.x 行 4774-7203 全量拆迁（教师查询/个人课表/多人空课表/密钥管理，SFC 化 + 共享 schedule/crypto/协商层）。
  {
    site: 'webvpn',
    page: 'tools',
    register: registerWebvpnTools,
    test: (c) => isWebVpnToolsRoute(c, document.body?.innerHTML || ''),
  },
  // failed：'/wengine-vpn/failed' 未识别失败页（1.x 行 2416-2424）。子分支：body 含 '地址：/h/tools' 走 tools
  //  page（见上 entry），不含则走本 failed page（errorHtml 自动关窗）。须在 home 后——path 为
  //  /wengine-vpn/failed，与 home 的 path==='/' 互斥；与文献阅读页（独立真实主机）亦互斥，序无歧义。
  {
    site: 'webvpn',
    page: 'failed',
    register: registerWebvpnFailed,
    test: (c) => isWebVpnFailedRoute(c, document.body?.innerHTML || ''),
  },

  // === webvpn 代理 sysaq：实验室安全教育平台（1.x 行 2425-2434）===
  // webvpn 代理 sysaq.nxu.edu.cn，命中后按 realPath 细分 login/auth（注入逻辑与直连 sysaq 同一组
  //  sites/sysaq/pages/{login,auth}.page.js，仅判定来源 path 不同）。
  //  须在 webvpn home 后——realHost=sysaq（非主域 webvpn.nxu.edu.cn），与 home 的 isWebvpnHost 判定互斥、
  //  与文献阅读页（真实主机为 cnki/wanfang）亦互斥，序无歧义。放 tools/failed 后：sysaq 页 path 非
  //  /wengine-vpn/failed，tools/failed 不命中，与本 entry 互斥；与 1.x webvpn 分支行序大体对应（cnki/wanfang/
  //  failed/sysaq/portal），实因各 agent entry host/path 互斥，顺序不构成正确性约束。
  // login：realPath 精确 '/lab-platform/'（1.x 行 2427）→ 点"点击登录"跳 /lab-platform/login。
  {
    site: 'sysaq',
    page: 'login',
    register: registerSysaqLogin,
    test: (c) =>
      c.isWebvpn &&
      isWebVpnRealHost(c.vpnContext, 'sysaq.nxu.edu.cn') &&
      (c.vpnContext?.realPath || '') === '/lab-platform/',
  },
  // auth：realPath 含 '/lab-platform/login'（1.x 行 2431 子串）→ 点"统一身份认证登录"跳统一认证。
  //  与 login 互斥：realPath 精确 '/lab-platform/' 不含 '/lab-platform/login' 子串；含 '/lab-platform/login'
  //  的 realPath 不等于 '/lab-platform/'。login entry 精确、auth entry 子串，顺序无关（互斥）。
  {
    site: 'sysaq',
    page: 'auth',
    register: registerSysaqAuth,
    test: (c) =>
      c.isWebvpn &&
      isWebVpnRealHost(c.vpnContext, 'sysaq.nxu.edu.cn') &&
      (c.vpnContext?.realPath || '').indexOf('/lab-platform/login') !== -1,
  },

  // === webvpn 代理 portal：新版信息门户应用中心（1.x 行 2436-2456）===
  // webvpn 代理 portal.nxu.edu.cn，与直连形态共用 sites/portal/pages/hall.page.js。无 path 细分——
  // 1.x 直连/代理 portal case 均全程 potalSwitchToFunc 判 #/hall，2.0 同（page 内 onNavigate 自判 hash）。须在 webvpn home 后——
  //  realHost=portal（非主域），与 home 的 isWebvpnHost 判定互斥，顺序无歧义。
  {
    site: 'portal',
    page: 'hall',
    register: registerPortalHall,
    test: (c) => c.isWebvpn && isWebVpnRealHost(c.vpnContext, 'portal.nxu.edu.cn'),
  },

  // === sysaq 直连：实验室安全教育平台（1.x 行 2545-2554）===
  // host='sysaq.nxu.edu.cn' 时按 path 细分（注入与代理形态共用同一组 auth 函数）。
  // login：path 精确 '/lab-platform/'（1.x 行 2547）。
  {
    site: 'sysaq',
    page: 'login',
    register: registerSysaqLogin,
    test: (c) => c.host === 'sysaq.nxu.edu.cn' && c.path === '/lab-platform/',
  },
  // auth：path 含 '/lab-platform/login'（1.x 行 2551 子串）。与 login 互斥（同代理形态推理）。
  {
    site: 'sysaq',
    page: 'auth',
    register: registerSysaqAuth,
    test: (c) => c.host === 'sysaq.nxu.edu.cn' && c.path.indexOf('/lab-platform/login') !== -1,
  },

  // === pingjiao：评教系统 jsfzyjxzlxt.nxu.edu.cn（1.x 行 2475-2483）===
  // 两个 path 同调 qualityUnavailable（toast 未实现提示），03 §2 B8 验收 3 仅 toast 不 throw。
  // 任务选择页：path 精确 '/quality/student/evaluate/item_tasks'（1.x 行 2477）。
  {
    site: 'pingjiao',
    page: 'notify',
    register: registerPingjiaoNotify,
    test: (c) => c.host === 'jsfzyjxzlxt.nxu.edu.cn' && c.path === '/quality/student/evaluate/item_tasks',
  },
  // 评价填写页：path 精确 '/quality/student/evaluate/item_tasks_text'（1.x 行 2480）。与任务页精确互斥。
  {
    site: 'pingjiao',
    page: 'notify',
    register: registerPingjiaoNotify,
    test: (c) =>
      c.host === 'jsfzyjxzlxt.nxu.edu.cn' && c.path === '/quality/student/evaluate/item_tasks_text',
  },

  // === portal 直连：新版信息门户 portal.nxu.edu.cn（1.x 行 2524-2544）===
  // 全站命中（无 path 细分，page 内 onNavigate 判 #/hall），与 WebVPN 代理形态共用同一个 page。
  {
    site: 'portal',
    page: 'hall',
    register: registerPortalHall,
    test: (c) => c.host === 'portal.nxu.edu.cn',
  },

  // 团委附件仅允许直连的精确下载路径与必要参数；普通文章页保持原样。
  {
    site: 'tuanwei',
    page: 'download',
    register: registerTuanweiDownload,
    test: isTuanweiDownloadRoute,
  },
];

/**
 * 顺序匹配命中表，返回首个命中的注册函数或 null。未命中仅日志（1.x 行为：未命中域名跑空）。
 * @returns {Function|null}
 */
export function resolveRoute() {
  const ctx = getContext();
  console('开始识别当前页面', { host: ctx.host, path: ctx.path, isWebvpn: ctx.isWebvpn }, 'debug');

  for (const entry of JUDGE_TABLE) {
    try {
      if (entry.test(ctx)) {
        console(`命中 ${entry.site}/${entry.page}`);
        return entry.register;
      }
    } catch (error) {
      console(`${entry.site}/${entry.page} 判定异常`, error, 'warn');
    }
  }

  console('未命中任何路由（当前页面 2.0 暂不处理）', { host: ctx.host, path: ctx.path }, 'info');
  return null;
}
