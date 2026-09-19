/**
 * WebVPN 代理 URL 工具
 * 对应 1.x：Better NXU.user.js 行 314-393（WEBVPN_HOST / WEBVPN_BASE / WEBVPN_HOST_TOKENS /
 *          WEBVPN_TOKEN_HOSTS / parseWebVpnContext / buildWebVpnUrl / isWebVpnRealHost）
 * 依赖：无
 * 入口/被谁调用：context.js（解析当前页上下文）、sites/webvpn（构建代理链接与命中判定）、
 *                sites/ids（回调修复用 buildWebVpnUrl）、schedule/crypto（free）
 *
 * WebVPN 代理 URL 形如 `https://webvpn.nxu.edu.cn/<scheme>[-port]/<token>/<realPath>`；
 * host↔token 映射集中在 WEBVPN_HOST_TOKENS，新增站点须同步补此表与 @match/@connect（见 01 §9 P3）。
 */

const WEBVPN_HOST = 'webvpn.nxu.edu.cn';
const WEBVPN_BASE = `https://${WEBVPN_HOST}`;

/**
 * 被代理真实站点 host → webvpn token 映射表。逐字取自 1.x 行 316-329（含抢课备用内网 IP、知网/万方等）。
 * Object.freeze 防止运行时被改动。新增内网站点时在此补一行 token。
 */
export const WEBVPN_HOST_TOKENS = Object.freeze({
  'ids.nxu.edu.cn': '77726476706e69737468656265737421f9f352d229287d1e7b0c9ce29b5b',
  'jwgl.nxu.edu.cn': '77726476706e69737468656265737421fae04690693e7045300d8db9d6562d',
  '202.201.128.234': '77726476706e69737468656265737421a2a713d27560391e2f5ad1e2ca0677',
  'xsfw.nxu.edu.cn': '77726476706e69737468656265737421e8e4478b693e7045300d8db9d6562d',
  'eip.nxu.edu.cn': '77726476706e69737468656265737421f5fe51d229287d1e7b0c9ce29b5b',
  'www.cnki.net': '77726476706e69737468656265737421e7e056d2243e635930068cb8',
  'kns.cnki.net': '77726476706e69737468656265737421fbf952d2243e635930068cb8',
  'www.wanfangdata.com.cn': '77726476706e69737468656265737421e7e056d2303166567f068ea89941227bfcd3ca21bd0c',
  'f.wanfangdata.com.cn': '77726476706e69737468656265737421f6b9569d2936695e790c88b8991b203a6ed9f11f',
  'open.weixin.qq.com': '77726476706e69737468656265737421ffe7449269276d59660187e289446d36a8d6',
  'portal.nxu.edu.cn': '77726476706e69737468656265737421e0f85388263c265e661dc7a99c406d36de',
  'sysaq.nxu.edu.cn': '77726476706e69737468656265737421e3ee529d367e66486b468ca88d1b203b',
});

/** 反向：token → 被代理真实站点 host，供 parseWebVpnContext 还原真实 host。1.x 行 330-332。 */
export const WEBVPN_TOKEN_HOSTS = Object.freeze(
  Object.fromEntries(Object.entries(WEBVPN_HOST_TOKENS).map(([host, token]) => [token, host]))
);

export { WEBVPN_HOST, WEBVPN_BASE };

/**
 * 解析一个 URL，识别其是否为 webvpn 代理 URL，还原被代理真实站点/路径/scheme/port。
 * 非 webvpn URL 返回直连上下文（viaVpn:false）。1.x 行 334-368 逐字迁移。
 * @param {string|{href:string}} input
 * @returns {{
 *   viaVpn:boolean, outerHost:string, scheme:string, port:string, token:string|null,
 *   realHost:string, realPath:string, search:string, hash:string, url:string
 * }}
 */
export function parseWebVpnContext(input) {
  const href = typeof input === 'string' ? input : input?.href;
  let parsed;
  try {
    parsed = new URL(href);
  } catch {
    return null;
  }
  const outerHost = parsed.hostname.toLowerCase().replace(/\.$/, '');
  const directContext = {
    viaVpn: false,
    outerHost,
    scheme: parsed.protocol.replace(':', ''),
    port: parsed.port,
    token: null,
    realHost: outerHost,
    realPath: parsed.pathname,
    search: parsed.search,
    hash: parsed.hash,
    url: parsed.href,
  };
  if (outerHost !== WEBVPN_HOST) return directContext;
  const match = parsed.pathname.match(/^\/(https?)(?:-(\d+))?\/([0-9a-f]{40,})(\/.*)?$/i);
  if (!match) return directContext;
  const token = match[3].toLowerCase();
  return {
    ...directContext,
    viaVpn: true,
    scheme: match[1].toLowerCase(),
    port: match[2] || '',
    token,
    realHost: WEBVPN_TOKEN_HOSTS[token] || null,
    realPath: match[4] || '/',
  };
}

/**
 * 把一个真实站点 URL 转换为 webvpn 代理 URL。
 * 仅 http/https、无用户名密码、host 不是 webvpn 自身、且 host 命中 WEBVPN_HOST_TOKENS 才生成；否则返回 null。
 * 1.x 行 370-389 逐字迁移。调用点 build 失败需要显式报错时可抛 utils/errors 的 WEBVPN_URL_BUILD_FAILED。
 * @param {string|{href:string}} input
 * @param {{forceHttps443?:boolean}} [options]
 * @returns {string|null}
 */
export function buildWebVpnUrl(input, options) {
  options = options || {};
  const href = typeof input === 'string' ? input : input?.href;
  let parsed;
  try {
    parsed = new URL(href);
  } catch {
    return null;
  }
  const scheme = parsed.protocol.replace(':', '').toLowerCase();
  const host = parsed.hostname.toLowerCase().replace(/\.$/, '');
  if (!['http', 'https'].includes(scheme) || parsed.username || parsed.password || host === WEBVPN_HOST) {
    return null;
  }
  const token = WEBVPN_HOST_TOKENS[host];
  if (!token) return null;
  const port = parsed.port || (scheme === 'https' && options.forceHttps443 ? '443' : '');
  const routeType = port ? `${scheme}-${port}` : scheme;
  return `${WEBVPN_BASE}/${routeType}/${token}${parsed.pathname}${parsed.search}${parsed.hash}`;
}

/**
 * 判断一个解析后的 webvpn 上下文是否代理了指定真实 host。1.x 行 391-393。
 * @param {ReturnType<typeof parseWebVpnContext>} context
 * @param {string} host
 * @returns {boolean}
 */
export function isWebVpnRealHost(context, host) {
  return Boolean(context?.viaVpn && context.realHost === host);
}
