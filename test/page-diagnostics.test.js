import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

function loadPage(path, dependencies) {
  const source = readFileSync(new URL(`../src/${path}`, import.meta.url), 'utf8');
  const logs = [];
  const imports = {
    MyConsole: () => (message, detail, level) => logs.push({ message, detail, level }),
    ...dependencies,
  };
  const register = new Function(
    ...Object.keys(imports),
    source
      .replace(/^import[\s\S]*?from\s+(['"])[^'"]+\1;?\r?\n/gm, '')
      .replace('export async function register', 'async function register') + '\nreturn register;'
  )(...Object.values(imports));
  return { register, logs };
}

test('missing laboratory login controls explain the stop without triggering navigation', async () => {
  for (const name of ['login', 'auth']) {
    const page = loadPage(`sites/sysaq/pages/${name}.page.js`, {
      installNotification: () => {},
      document: { evaluate: () => ({ singleNodeValue: null }) },
      XPathResult: { FIRST_ORDERED_NODE_TYPE: 9 },
      toast: () => assert.fail('must not announce login'),
      simulateClick: () => assert.fail('must not click'),
    });
    await page.register();
    assert.ok(page.logs.some(({ message, level }) => level === 'warn' && /未找到.*停止/.test(message)));
  }
});

test('disabled automatic actions explain the setting and preserve manual operation', async () => {
  for (const [path, setting, extra] of [
    [
      'sites/webvpn/pages/failed.page.js',
      'WebVPN.autoClose',
      { closeCurrentTab: () => assert.fail('must not close') },
    ],
    [
      'sites/ids/pages/re-auth.page.js',
      'WebVPN.autoReLogin',
      {
        grantedUnsafeWindow: {},
        window: {},
        getContext: () => ({}),
        isTrustedIdsContext: () => true,
        installNotification: () => {},
        toast: () => assert.fail('must not authenticate'),
      },
    ],
    ['sites/jwgl/pages/home.page.js', 'Jwgl.customMenu', {}],
  ]) {
    const page = loadPage(path, { getGMValue: () => (setting === 'Jwgl.customMenu' ? [] : false), ...extra });
    await page.register();
    assert.ok(page.logs.some(({ message, level }) => level === 'info' && message.includes(setting)));
    assert.ok(!page.logs.some(({ level }) => level === 'error'));
  }
});
