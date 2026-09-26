import { parseWebVpnContext } from './webvpn-url.js';

export const LIBRARY_PROXY_HOST = 'zylib.nxu.edu.cn';

/** 阅读平台规则：精确主机、阅读路径前缀、复制/滑块能力；路由与直连 @match 共用。 */
export const LIBRARY_READER_PLATFORMS = Object.freeze([
  {
    id: 'cnki',
    hosts: ['kns.cnki.net', 'www.cnki.net'],
    paths: ['/reader/xml', '/xmlRead/trialRead'],
    copy: true,
    slider: true,
  },
  {
    id: 'wanfang',
    hosts: ['f.wanfangdata.com.cn'],
    paths: ['/online/pc/periodical_html'],
    copy: true,
    slider: false,
  },
]);

export const LIBRARY_READER_MATCHES = Object.freeze([
  `*://${LIBRARY_PROXY_HOST}/*`,
  ...LIBRARY_READER_PLATFORMS.flatMap(({ hosts, paths }) =>
    hosts.flatMap((host) => paths.map((path) => `*://${host}${path}*`))
  ),
]);

/** 只还原阅读位置，不将 zylib 参数用于认证路由或凭证读取。 */
export function parseLibraryReaderLocation(input) {
  let url;
  try {
    url = new URL(typeof input === 'string' ? input : input?.url);
  } catch {
    return null;
  }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return null;

  if (url.hostname === LIBRARY_PROXY_HOST) {
    const hosts = url.searchParams.getAll('__host__');
    const protocols = url.searchParams.getAll('__proto__');
    if (hosts.length || protocols.length) {
      // 不接受重复、缺失、带端口/路径/用户信息的目标，避免歧义解析。
      if (hosts.length !== 1 || protocols.length !== 1) return null;
      if (!['http', 'https'].includes(protocols[0]) || !/^[a-z0-9.-]+$/i.test(hosts[0])) return null;
      if (url.pathname.startsWith('/-----')) return null;
      return { host: hosts[0].toLowerCase(), path: url.pathname, access: 'zylib' };
    }
    // 兼容认证前的入口形式；只在目标本身为阅读路径时启用功能。
    if (!url.pathname.startsWith('/-----')) return null;
    let target;
    try {
      target = new URL(url.pathname.slice('/-----'.length));
    } catch {
      return null;
    }
    if (!['http:', 'https:'].includes(target.protocol) || target.username || target.password || target.port) {
      return null;
    }
    return { host: target.hostname, path: target.pathname, access: 'zylib' };
  }

  const vpn = parseWebVpnContext(url.href);
  if (vpn?.viaVpn) {
    return vpn.realHost ? { host: vpn.realHost, path: vpn.realPath, access: 'webvpn' } : null;
  }
  return { host: url.hostname, path: url.pathname, access: 'direct' };
}

export function resolveLibraryReader(input, platforms = LIBRARY_READER_PLATFORMS) {
  const location = parseLibraryReaderLocation(input);
  if (!location) return null;
  return (
    platforms.find(
      ({ hosts, paths }) =>
        hosts.includes(location.host) &&
        paths.some(
          (path) =>
            location.path === path ||
            location.path.startsWith(`${path}/`) ||
            location.path.startsWith(`${path}.`)
        )
    ) || null
  );
}
