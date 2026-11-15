import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { isTuanweiDownloadRoute } from '../src/utils/route-guards.js';
import { MyConsole } from '../src/utils/console.js';
import { toast as ding } from '@yusufceng1z/ding';

let events;
let nextHandle = 0;
test.beforeEach((t) => {
  t.mock.method(ding, 'show', (type, message, { duration }) => {
    const handle = ++nextHandle;
    events.push({ event: 'show', handle, type, message, duration });
    return handle;
  });
  t.mock.method(ding, 'update', (handle, patch) => events.push({ event: 'update', handle, ...patch }));
  t.mock.method(ding, 'dismiss', (handle) => events.push({ event: 'remove', handle }));
});
document[globalThis.__MONKEY_WINDOW_KEY__] = {
  unsafeWindow: {},
  GM_getResourceText: () => '',
};
const { toast, removeToastHandle, updateToastHandle } = await import('../src/libraries/notification.js');
const source = readFileSync(new URL('../src/sites/tuanwei/pages/download.page.js', import.meta.url), 'utf8');
// Keep the real page orchestration and notification adapter; replace only the download boundary.
const loadPage = new Function(
  'getContext',
  'getGMValue',
  'isTuanweiDownloadRoute',
  'autoDownloadAttachment',
  'installNotification',
  'toast',
  'removeToastHandle',
  'updateToastHandle',
  'window',
  'MyConsole',
  source
    .replace(/^import[\s\S]*?from\s+(['"])[^'"]+\1;?\r?\n/gm, '')
    .replace('export function register', 'function register') + '\nreturn register;'
);
const url =
  'https://tuanwei.nxu.edu.cn/system/_content/download.jsp?urltype=news.DownloadAttachUrl&owner=123&wbfileid=456';
function setup(run, { enabled = true, location = url } = {}) {
  events = [];
  const window = new EventTarget();
  const register = loadPage(
    () => ({ url: location }),
    () => enabled,
    isTuanweiDownloadRoute,
    run,
    () => events.push({ event: 'install' }),
    toast,
    removeToastHandle,
    updateToastHandle,
    window,
    MyConsole
  );
  return { register, window };
}
function assertNoPersistentToast() {
  for (const show of events.filter((event) => event.event === 'show' && event.duration === 0)) {
    assert.ok(
      events.some(
        (event) =>
          event.handle === show.handle &&
          (event.event === 'remove' || (event.event === 'update' && event.type && event.type !== 'loading'))
      )
    );
  }
}

test('download page updates one loading toast and morphs it into success once', async () => {
  let finish;
  let runs = 0;
  const f = setup(async ({ report, autoClose }) => {
    runs++;
    assert.equal(autoClose, true);
    report('加载组件');
    report('识别验证码');
    report('识别验证码', 'info', 0.5);
    await new Promise((resolve) => {
      finish = resolve;
    });
    report('附件下载完成', 'success');
    return 'downloaded';
  });
  const task = f.register();
  assert.equal(f.register(), task);
  assert.equal(runs, 1);
  assert.equal(events.filter((event) => event.event === 'install').length, 1);
  const progress = events.filter((event) => event.event === 'show');
  assert.deepEqual(
    progress.map((event) => [event.type, event.duration]),
    [['loading', 0]]
  );
  assert.ok(
    events.some(
      (event) =>
        event.event === 'update' && event.title === '识别验证码' && event.handle === progress[0].handle
    )
  );
  assert.ok(events.some((event) => event.progress === 0.5 && event.meta === '50%'));
  finish();
  await task;
  assertNoPersistentToast();
  assert.deepEqual(
    events.filter((event) => event.type === 'success').map((event) => [event.title, event.duration]),
    [['附件下载完成', 3000]]
  );
});

test('download errors and manual takeover clear progress and display finite toasts', async () => {
  for (const outcome of ['error', 'manual']) {
    const f = setup(async ({ report }) => {
      report('识别验证码');
      if (outcome === 'error') throw new Error('<fixture>下载失败');
      return 'manual';
    });
    await f.register();
    assertNoPersistentToast();
    const finalToast = events.filter((event) => event.event === 'update').at(-1);
    assert.equal(finalToast.type, outcome === 'error' ? 'error' : 'info');
    assert.ok(finalToast.duration > 0);
    if (outcome === 'error') assert.match(finalToast.title, /<fixture>/);
  }
});

test('page exit clears progress and suppresses late notifications', async () => {
  let finish;
  const f = setup(async ({ report }) => {
    report('保存附件');
    await new Promise((resolve) => {
      finish = resolve;
    });
    report('附件下载完成', 'success');
    return 'manual';
  });
  const task = f.register();
  f.window.dispatchEvent(new Event('pagehide'));
  finish();
  await task;
  assertNoPersistentToast();
  assert.equal(events.filter((event) => event.event === 'show').length, 1);
});

test('disabled settings and unrelated pages install no download notifications', () => {
  for (const options of [{ enabled: false }, { location: 'https://tuanwei.nxu.edu.cn/' }]) {
    const f = setup(() => assert.fail('download must not start'), options);
    assert.equal(f.register(), undefined);
    assert.deepEqual(events, []);
  }
});
