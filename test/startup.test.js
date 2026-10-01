import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
const run = new AsyncFunction(
  'MyConsole',
  'GM_info',
  'initContext',
  'resolveRoute',
  'window',
  'document',
  source.replace(/^import .*;\r?\n/gm, '')
);

async function startup({ init = () => ({}), resolve = () => null, info } = {}) {
  const logs = [];
  const page = {};
  page.top = page;
  await run(
    () => (message, detail, level) => logs.push({ message, detail, level }),
    info ?? { script: { version: '2.0.4' }, scriptHandler: 'ScriptCat', version: '1.2.3' },
    init,
    resolve,
    page,
    { readyState: 'complete', visibilityState: 'visible' }
  );
  return logs;
}

test('startup reports the installed version immediately after the start message', async () => {
  const logs = await startup();
  assert.equal(logs[0].message, 'Better NXU 开始运行');
  assert.match(logs[1].message, /2\.0\.4/);
  assert.match(JSON.stringify(logs), /ScriptCat|1\.2\.3/);
  assert.ok(logs.some(({ message }) => /未匹配.*停止/.test(message)));
  assert.ok(!logs.some(({ message }) => /页面入口执行结束/.test(message)));
});

test('startup catches failures in context, routing and asynchronous registration with the failing stage', async () => {
  for (const [stage, options] of [
    [
      '上下文初始化',
      {
        init: () => {
          throw new Error('fixture');
        },
      },
    ],
    [
      '路由匹配',
      {
        resolve: () => {
          throw new Error('fixture');
        },
      },
    ],
    [
      '页面注册',
      {
        resolve: () => async () => {
          throw new Error('fixture');
        },
      },
    ],
  ]) {
    const logs = await startup(options);
    const failure = logs.find(({ level }) => level === 'error');
    assert.match(failure.message, /终止/);
    assert.equal(failure.detail.stage, stage);
    assert.ok(failure.detail.error instanceof Error);
    assert.ok(!logs.some(({ message }) => /页面入口执行结束/.test(message)));
  }
});

test('startup waits for page registration and reports duration without claiming business success', async () => {
  let registered = false;
  const logs = await startup({
    resolve: () => async () => {
      await Promise.resolve();
      registered = true;
    },
  });
  assert.equal(registered, true);
  const done = logs.find(({ message }) => /页面入口执行结束/.test(message));
  assert.ok(done.detail.elapsedMs >= 0);
  assert.ok(!logs.some(({ message }) => /登录成功|初始化成功/.test(message)));
  const unknown = await startup({ info: {} });
  assert.match(unknown[1].message, /未知/);
});
