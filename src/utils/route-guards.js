import { resolveLibraryReader } from './library-reader.js';

/** Only the direct, canonical attachment endpoint may submit a CAPTCHA. */
export function isTuanweiDownloadRoute(ctx) {
  try {
    const url = new URL(ctx?.url);
    return (
      ['https:', 'http:'].includes(url.protocol) &&
      url.hostname === 'tuanwei.nxu.edu.cn' &&
      !url.port &&
      !url.username &&
      !url.password &&
      url.pathname === '/system/_content/download.jsp' &&
      url.searchParams.getAll('urltype').length === 1 &&
      url.searchParams.get('urltype') === 'news.DownloadAttachUrl' &&
      ['owner', 'wbfileid'].every(
        (key) => url.searchParams.getAll(key).length === 1 && /^\d+$/.test(url.searchParams.get(key))
      )
    );
  } catch {
    return false;
  }
}

/**
 * 判断当前上下文是否是可信的统一身份认证登录页。
 * 仅允许 ids 直连，或 WebVPN 明确还原为 ids.nxu.edu.cn 的代理页。
 */
export function isTrustedIdsContext(ctx) {
  if (!ctx) return false;
  if (ctx.host === 'ids.nxu.edu.cn') return true;
  return Boolean(ctx.isWebvpn && ctx.vpnContext?.realHost === 'ids.nxu.edu.cn');
}

/** WebVPN 代理下的 IDS 登录页判定。 */
export function isWebVpnIdsLoginRoute(ctx) {
  if (!isTrustedIdsContext(ctx) || !ctx.isWebvpn) return false;
  const realPath = String(ctx.vpnContext?.realPath || '');
  return realPath.includes('/authserver/login');
}

/** WebVPN 代理下的 IDS 二次认证页判定。 */
export function isWebVpnIdsReAuthRoute(ctx) {
  if (!isTrustedIdsContext(ctx) || !ctx.isWebvpn) return false;
  const realPath = String(ctx.vpnContext?.realPath || '');
  return realPath.includes('/authserver/reAuthCheck/');
}

export function isCnkiReaderRoute(ctx) {
  return resolveLibraryReader(ctx)?.id === 'cnki';
}

export function isWanfangReaderRoute(ctx) {
  return resolveLibraryReader(ctx)?.id === 'wanfang';
}

/** /h/tools 是正式入口；同时兼容 WebVPN 将该地址重定向到失败页的旧行为。 */
export function isWebVpnToolsRoute(ctx, bodyHtml = '') {
  if (ctx?.host !== 'webvpn.nxu.edu.cn') return false;
  if (ctx.path === '/h/tools' || ctx.path === '/h/tools/') return true;
  return ctx.path === '/wengine-vpn/failed' && /地址[：:]\s*\/h\/tools\/?(?=$|[\s?#<])/.test(bodyHtml);
}

export function isWebVpnFailedRoute(ctx, bodyHtml = '') {
  return (
    ctx?.host === 'webvpn.nxu.edu.cn' &&
    ctx.path === '/wengine-vpn/failed' &&
    !isWebVpnToolsRoute(ctx, bodyHtml)
  );
}
