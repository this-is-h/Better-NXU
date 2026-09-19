import test from 'node:test';
import assert from 'node:assert/strict';

import {
  WEBVPN_HOST_TOKENS,
  buildWebVpnUrl,
  isWebVpnRealHost,
  parseWebVpnContext,
} from '../src/utils/webvpn-url.js';

test('all known WebVPN host mappings round-trip', () => {
  for (const host of Object.keys(WEBVPN_HOST_TOKENS)) {
    const source = `https://${host}/path/to/resource?q=1#section`;
    const proxyUrl = buildWebVpnUrl(source);
    assert.ok(proxyUrl, `expected a proxy URL for ${host}`);

    const context = parseWebVpnContext(proxyUrl);
    assert.equal(context.viaVpn, true);
    assert.equal(context.realHost, host);
    assert.equal(context.realPath, '/path/to/resource');
    assert.equal(context.search, '?q=1');
    assert.equal(context.hash, '#section');
    assert.equal(isWebVpnRealHost(context, host), true);
  }
});

test('WebVPN URL builder preserves explicit ports and rejects unsafe inputs', () => {
  const proxyUrl = buildWebVpnUrl('http://202.201.128.234:8082/index.action');
  assert.match(proxyUrl, /\/http-8082\//);
  const context = parseWebVpnContext(proxyUrl);
  assert.equal(context.scheme, 'http');
  assert.equal(context.port, '8082');
  assert.equal(context.realHost, '202.201.128.234');

  assert.equal(buildWebVpnUrl('https://unknown.example/path'), null);
  assert.equal(buildWebVpnUrl('https://user:pass@ids.nxu.edu.cn/authserver/login'), null);
  assert.equal(buildWebVpnUrl('https://webvpn.nxu.edu.cn/'), null);
  assert.equal(parseWebVpnContext('not a url'), null);
});
