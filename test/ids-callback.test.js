import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildWebVpnUrl, WEBVPN_HOST_TOKENS } from '../src/utils/webvpn-url.js';

const source = readFileSync(new URL('../src/sites/ids/pages/callback.page.js', import.meta.url), 'utf8');
const loadCallback = new Function(
  'getContext',
  'buildWebVpnUrl',
  'WEBVPN_HOST_TOKENS',
  'installNotification',
  'toast',
  'MyConsole',
  'document',
  'location',
  source
    .replace(/^import .*;\r?\n/gm, '')
    .replace('export async function register', 'async function register') + '\nreturn register;'
);

function setup(warning, buildUrl = buildWebVpnUrl) {
  const original = new URL(
    'https://ids.nxu.edu.cn/authserver/callback?code=fixture-code&state=fixture-state'
  );
  const location = { href: original.href };
  const toasts = [];
  const register = loadCallback(
    () => ({ url: original.href, query: original.searchParams }),
    buildUrl,
    WEBVPN_HOST_TOKENS,
    () => {},
    (...args) => toasts.push(args),
    () => () => {},
    { querySelector: () => warning },
    location
  );
  return { register, location, original, toasts };
}

test('Chinese and English authorization failures independently trigger callback recovery', async () => {
  for (const textContent of [
    '授权失败',
    'Fail to bind your account',
    '授权失败 / Fail to bind your account',
  ]) {
    const page = setup({ textContent });
    await page.register();
    const target = new URL(page.location.href);
    assert.equal(target.hostname, 'webvpn.nxu.edu.cn');
    assert.ok(target.pathname.endsWith('/authserver/callback'));
    assert.equal(target.searchParams.get('code'), 'fixture-code');
    assert.equal(target.searchParams.get('state'), 'fixture-state');
  }
});

test('missing or unrelated callback warnings preserve the current page', async () => {
  for (const warning of [
    null,
    { textContent: '' },
    { textContent: '授权成功' },
    { textContent: 'Welcome' },
  ]) {
    const page = setup(warning);
    await page.register();
    assert.equal(page.location.href, page.original.href);
    assert.equal(page.toasts.length, 0);
  }
});

test('callback URL construction failure preserves the page and offers manual recovery', async () => {
  const page = setup({ textContent: 'Fail to bind your account' }, () => null);
  await page.register();
  assert.equal(page.location.href, page.original.href);
  assert.ok(page.toasts.some(([level, message]) => level === 'error' && /手动返回 WebVPN/.test(message)));
});
