import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { bridgeDevUserscript, scriptCatDevBridge } from '../scripts/dev-gm-bridge.mjs';

document.createElement = () => ({});
const apiNames = [
  'GM',
  'GM_info',
  'GM_getValue',
  'GM_setValue',
  'GM_setValues',
  'GM_addElement',
  'GM_addStyle',
  'GM_download',
  'GM_getResourceText',
  'GM_openInTab',
  'GM_setClipboard',
  'unsafeWindow',
];
const clientSource = readFileSync(
  new URL('../node_modules/vite-plugin-monkey/dist/client/index.js', import.meta.url),
  'utf8'
).replace(/^export \{.*\};\r?\n/gm, '');
const readClient = new Function(
  'document',
  'window',
  '__MONKEY_WINDOW_KEY__',
  `${clientSource}\nreturn { ${apiNames.join(',')}, monkeyWindow };`
);
let server;
let installSource;

before(async () => {
  server = await createServer({
    configFile: fileURLToPath(new URL('../vite.config.js', import.meta.url)),
    server: { host: '127.0.0.1', port: 0, open: false },
    optimizeDeps: { noDiscovery: true, include: [] },
    logLevel: 'silent',
  });
  await server.listen();
  const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
  const response = await fetch(
    `${origin}/__vite-plugin-monkey.install.user.js?origin=${encodeURIComponent(origin)}`
  );
  assert.equal(response.status, 200);
  installSource = await response.text();
});

after(async () => {
  await server?.close();
});

function executeInstall(bindings = {}, window = {}) {
  const scripts = [];
  const document = {
    head: { append: (script) => scripts.push(script) },
    createElement: () => ({}),
  };
  const run = new Function('window', 'document', ...apiNames, installSource);
  run(window, document, ...apiNames.map((name) => bindings[name]));
  const key = installSource.match(/"(__monkeyWindow-[^"]+)"/)?.[1];
  assert.ok(key);
  assert.equal(scripts.length, 1);
  assert.equal(scripts[0].type, 'module');
  assert.match(scripts[0].src, /^http:\/\/127\.0\.0\.1:\d+\/__vite-plugin-monkey\.entry\.js$/);
  return readClient(document, window, key);
}

test('the actual dev installer exposes ScriptCat lexical version and storage APIs to the official client', () => {
  const calls = [];
  const bindings = {
    GM_info: { script: { version: 'fixture-version' }, scriptHandler: 'ScriptCat' },
    GM_getValue: (...args) => {
      calls.push(args);
      return false;
    },
  };
  const client = executeInstall(bindings);
  assert.equal(client.GM_info, bindings.GM_info);
  assert.equal(client.GM_getValue('Script.toastSound', true), false);
  assert.deepEqual(calls, [['Script.toastSound', true]]);
});

test('development preserves native API references and the granted page window', async () => {
  const bindings = Object.fromEntries(apiNames.map((name) => [name, () => name]));
  bindings.GM = { setValue: async () => 'stored', xmlHttpRequest: () => 'requested' };
  bindings.unsafeWindow = { fixture: 'page-window' };
  const client = executeInstall(bindings);
  for (const name of apiNames) assert.equal(client[name], bindings[name], name);
  assert.equal(await client.GM.setValue(), 'stored');
  assert.equal(client.GM.xmlHttpRequest(), 'requested');
});

test('global-only userscript APIs remain supported and window methods keep their receiver', () => {
  let closed = false;
  const window = {
    GM_getValue: (_, fallback) => fallback,
    close() {
      assert.equal(this, window);
      closed = true;
    },
  };
  const client = executeInstall({}, window);
  assert.equal(client.GM_getValue('fixture', 'default'), 'default');
  client.monkeyWindow.close();
  assert.equal(closed, true);
});

test('the development bridge does not mount privileged APIs on either global window', () => {
  const window = {};
  const page = {};
  const bindings = { GM_getValue: () => 'stored', unsafeWindow: page };
  const client = executeInstall(bindings, window);
  assert.equal(client.GM_getValue, bindings.GM_getValue);
  assert.deepEqual(Object.keys(window), []);
  assert.deepEqual(Object.keys(page), []);
});

test('unavailable APIs stay unavailable rather than simulating a different storage backend', () => {
  const client = executeInstall();
  assert.equal(client.GM_getValue, undefined);
  assert.equal(client.GM_info, undefined);
});

test('the development installer keeps the native ScriptCat settings permission', () => {
  assert.match(installSource, /^\/\/ @grant\s+CAT_userConfig$/m);
  assert.match(installSource, /^\/\/ @grant\s+GM_getValue$/m);
});

test('unknown or ambiguous upstream injection points fail instead of silently losing APIs', () => {
  for (const source of ['document[key] = context;', 'document[key] = window;document[key] = window;']) {
    assert.throws(() => bridgeDevUserscript(source), /injection point changed/);
  }
});

test('the adapter is development-only, leaves other endpoints untouched and reports incompatible output', () => {
  const plugin = scriptCatDevBridge();
  assert.equal(plugin.apply, 'serve');
  let handler;
  plugin.configureServer({ middlewares: { use: (callback) => (handler = callback) } });
  for (const req of [
    { method: 'GET', url: '/src/main.js' },
    { method: 'POST', url: '/__vite-plugin-monkey.install.user.js' },
  ]) {
    const res = { end() {} };
    const originalEnd = res.end;
    let continued = false;
    handler(req, res, () => (continued = true));
    assert.equal(continued, true);
    assert.equal(res.end, originalEnd);
  }
  const headers = {};
  let body;
  const res = {
    setHeader: (name, value) => (headers[name] = value),
    end: (value) => (body = value),
  };
  handler({ method: 'GET', url: '/__vite-plugin-monkey.install.user.js?origin=fixture' }, res, () => {});
  res.end(Buffer.from('changed-upstream-template'));
  assert.equal(res.statusCode, 500);
  assert.equal(headers['content-type'], 'text/plain; charset=utf-8');
  assert.match(body, /injection point changed/);
});
