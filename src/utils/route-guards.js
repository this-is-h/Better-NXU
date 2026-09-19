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
