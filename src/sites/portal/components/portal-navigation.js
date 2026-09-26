import { parseWebVpnContext } from '../../../utils/webvpn-url.js';

export function resolvePortalCardLink(card, portalUrl) {
  const context = parseWebVpnContext(portalUrl);
  const viaVpn = context?.viaVpn && context.realHost === 'portal.nxu.edu.cn';
  const url = typeof card.url === 'string' ? card.url : card.url?.[viaVpn ? 'webvpn' : 'campus'];
  const navigation = card.navigation ?? 'system';
  if (!['system', 'direct'].includes(navigation)) throw new Error('门户卡片跳转模式无效');
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error('当前环境的门户卡片地址未配置');
  }
  if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password) {
    throw new Error('门户卡片地址必须为 HTTP(S) 地址');
  }
  // 保留原字符串，包括已经显式配置的 WebVPN 地址，不再次构建或包裹。
  return { url, navigation };
}

export function openPortalCard(card, { portalUrl, pageWindow, openInTab }) {
  const { url, navigation } = resolvePortalCardLink(card, portalUrl);
  if (navigation === 'direct') {
    if (typeof openInTab !== 'function') throw new Error('直接打开链接需要 ScriptCat 的 GM_openInTab 权限');
    return openInTab(url, { active: true, insert: true });
  }
  return pageWindow.open(url, '_blank', 'noopener,noreferrer');
}
