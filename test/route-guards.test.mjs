import test from 'node:test';
import assert from 'node:assert/strict';

import {
  isTrustedIdsContext,
  isWebVpnIdsLoginRoute,
  isWebVpnIdsReAuthRoute,
  isCnkiReaderRoute,
  isWanfangReaderRoute,
  isWebVpnToolsRoute,
  isWebVpnFailedRoute,
} from '../src/utils/route-guards.js';
import { buildWebVpnUrl, parseWebVpnContext } from '../src/utils/webvpn-url.js';

function contextFor(url) {
  const parsed = new URL(url);
  const vpnContext = parseWebVpnContext(url);
  return {
    url,
    host: parsed.hostname,
    path: parsed.pathname,
    isWebvpn: Boolean(vpnContext?.viaVpn),
    vpnContext,
  };
}

test('IDS guards accept direct IDS and strict WebVPN IDS routes', () => {
  assert.equal(isTrustedIdsContext(contextFor('https://ids.nxu.edu.cn/authserver/login')), true);

  const login = contextFor(buildWebVpnUrl('https://ids.nxu.edu.cn/authserver/login?service=test'));
  assert.equal(isTrustedIdsContext(login), true);
  assert.equal(isWebVpnIdsLoginRoute(login), true);
  assert.equal(isWebVpnIdsReAuthRoute(login), false);

  const reAuth = contextFor(buildWebVpnUrl('https://ids.nxu.edu.cn/authserver/reAuthCheck/token'));
  assert.equal(isWebVpnIdsLoginRoute(reAuth), false);
  assert.equal(isWebVpnIdsReAuthRoute(reAuth), true);
});

test('IDS guards reject lookalike paths on other proxied hosts', () => {
  const fakeLogin = contextFor(buildWebVpnUrl('https://portal.nxu.edu.cn/authserver/login'));
  assert.equal(isTrustedIdsContext(fakeLogin), false);
  assert.equal(isWebVpnIdsLoginRoute(fakeLogin), false);

  const fakeReAuth = contextFor(buildWebVpnUrl('https://sysaq.nxu.edu.cn/authserver/reAuthCheck/token'));
  assert.equal(isTrustedIdsContext(fakeReAuth), false);
  assert.equal(isWebVpnIdsReAuthRoute(fakeReAuth), false);
});

test('reader routes match direct and proxied canonical reading paths', () => {
  for (const host of ['kns.cnki.net', 'www.cnki.net']) {
    for (const path of ['/reader/xml', '/reader/xml/', '/xmlRead/trialRead.aspx']) {
      const url = `https://${host}${path}?id=fixture#section`;
      for (const ctx of [contextFor(url), contextFor(buildWebVpnUrl(url))]) {
        assert.equal(isCnkiReaderRoute(ctx), true);
        assert.equal(isWanfangReaderRoute(ctx), false);
      }
    }
  }
  const url = 'https://f.wanfangdata.com.cn/online/pc/periodical_html/fixture';
  for (const ctx of [contextFor(url), contextFor(buildWebVpnUrl(url))]) {
    assert.equal(isWanfangReaderRoute(ctx), true);
    assert.equal(isCnkiReaderRoute(ctx), false);
  }
});

test('reader routes reject lookalike hosts, paths and unknown proxy tokens', () => {
  for (const url of [
    'https://kns.cnki.net.example/reader/xml',
    'https://kns.cnki.net/reader/xml-other',
    'https://kns.cnki.net/unrelated/reader/xml',
    'https://www.cnki.net/?next=/reader/xml',
    'https://f.wanfangdata.com.cn/online/pc/periodical_html-other',
    'https://webvpn.nxu.edu.cn/https/unknown/reader/xml',
    buildWebVpnUrl('https://portal.nxu.edu.cn/reader/xml'),
  ]) {
    assert.equal(isCnkiReaderRoute(contextFor(url)), false, url);
    assert.equal(isWanfangReaderRoute(contextFor(url)), false, url);
  }
});

test('tools supports direct path and legacy failure marker without closing the page', () => {
  for (const path of ['/h/tools', '/h/tools/']) {
    const ctx = contextFor(`https://webvpn.nxu.edu.cn${path}?from=portal`);
    assert.equal(isWebVpnToolsRoute(ctx), true);
    assert.equal(isWebVpnFailedRoute(ctx), false);
  }
  const failed = contextFor('https://webvpn.nxu.edu.cn/wengine-vpn/failed');
  for (const html of ['地址：/h/tools', '<p>地址：/h/tools</p>', '地址： /h/tools/?from=portal']) {
    assert.equal(isWebVpnToolsRoute(failed, html), true);
    assert.equal(isWebVpnFailedRoute(failed, html), false);
  }
  for (const html of ['', '地址：/elsewhere', '地址：/h/tools-extra']) {
    assert.equal(isWebVpnToolsRoute(failed, html), false);
    assert.equal(isWebVpnFailedRoute(failed, html), true);
  }
  for (const url of [
    'https://webvpn.nxu.edu.cn/h/tools-extra',
    'https://portal.nxu.edu.cn/h/tools',
    buildWebVpnUrl('https://portal.nxu.edu.cn/h/tools'),
  ]) {
    assert.equal(isWebVpnToolsRoute(contextFor(url), '地址：/h/tools'), false);
  }
});
