/**
 * 单例运行上下文
 * 对应 1.x：主入口 IIFE 内的 Host/Url/Path/Origin（行 305-308）、vpnContext（行 2336）等稳态值
 * 依赖：utils/webvpn-url.js（parseWebVpnContext）
 * 入口/被谁调用：main.js 进入时调 initContext() 一次；router.js 及各 sites 通过 getContext() 取稳态值，
 *                避免每个模块各 parse 一遍 URL 造成不一致（02 §7.3）。
 *
 * 1.x 把这些值以 const 声明在 IIFE 顶层、靠闭包共享；2.0 拆模块后改为单例对象，导出 getContext()。
 * 暴露字段：Host / Url / Path / Origin / Query / vpnContext / isWebvpn / webvpnRealHost / info / version。
 *
 * GM_info 通过 vite-plugin-monkey 的官方 ESM 客户端别名 #gm 导入；开发服务器与生产构建的作用域差异
 * 由插件处理，@grant 则由 autoGrant 从静态导入自动生成。
 */
import { GM_info } from '#gm';
import { parseWebVpnContext } from './utils/webvpn-url.js';

let context = null;

/**
 * 一次性解析当前页面上下文。main.js 在 ScriptCat 的 document-idle 入口直接调用。
 * 幂等：重复调用不改写已解析的上下文（与 1.x const 单次取值语义一致）。
 * @returns {object} 解析后的上下文
 */
export function initContext() {
  if (context) return context;
  const Info = GM_info; // 1.x 行 304 Info = GM_info
  const Url = window.location.href;
  const Host = window.location.hostname;
  const Origin = window.location.origin;
  const Path = window.location.pathname;
  const vpnContext = parseWebVpnContext(Url);
  context = {
    info: Info, // 脚本元信息（含 version，1.x 行 304 Info = GM_info）
    version: Info?.script?.version, // 1.x 行 311 Version = Info.script.version
    url: Url,
    host: Host,
    origin: Origin,
    path: Path,
    query: new URLSearchParams(window.location.search), // 1.x GetQuery 基于此（行 2148-2157）
    vpnContext,
    // 通过 webvpn 代理的：isWebvpn=true 且 webvpnRealHost=被代理真实站点；直连两者为 false/host。
    isWebvpn: Boolean(vpnContext?.viaVpn),
    webvpnRealHost: vpnContext?.viaVpn ? vpnContext.realHost : null,
    // 便利标记：是否为 webvpn 主域（非代理，主页/工具/失败页等在此 host）。
    isWebvpnHost: Host === 'webvpn.nxu.edu.cn',
    // 1.x `Host.indexOf('202.201.128.234') != -1` 子串判定兜住 :8080~:8083 端口变体（02 §7.2）。
    isJwglIp: Host.indexOf('202.201.128.234') !== -1,
  };
  return context;
}

/**
 * 取已初始化的上下文。未初始化抛错（main.js 必须先调 initContext）。
 * @returns {object}
 */
export function getContext() {
  if (!context) throw new Error('context 尚未初始化：请在 main.js 中先调用 initContext()');
  return context;
}

/** 仅测试用：重置上下文以便重新解析。生产代码不应调用。 */
export function _resetContextForTest() {
  context = null;
}
