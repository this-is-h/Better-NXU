import test from 'node:test';
import assert from 'node:assert/strict';

import {
  isTrustedIdsContext,
  isWebVpnIdsLoginRoute,
  isWebVpnIdsReAuthRoute,
} from '../src/utils/route-guards.js';
import { buildWebVpnUrl, parseWebVpnContext } from '../src/utils/webvpn-url.js';

function contextFor(url) {
  const parsed = new URL(url);
  const vpnContext = parseWebVpnContext(url);
  return {
    host: parsed.hostname,
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
