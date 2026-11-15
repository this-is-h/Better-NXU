import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { toast as ding } from '@yusufceng1z/ding';

const { toast, updateToastHandle, removeToastHandle, toastPromise } =
  await import('../src/libraries/notification.js');

test('notifications preserve live mute while the saved sound setting is still stale', () => {
  const source = readFileSync(new URL('../src/libraries/notification.js', import.meta.url), 'utf8');
  const createApi = new Function(
    'mountToaster',
    'dingToast',
    'getGMValue',
    'GM_addStyle',
    'installFontAwesome',
    'document',
    source.replace(/^import[\s\S]*?from\s+(['"])[^'"]+\1;?\r?\n/gm, '').replace(/^export /gm, '') +
      '\nreturn { installNotification, setToastSound, toast };'
  );
  const viewport = { isConnected: true };
  let sound;
  const played = [];
  const api = createApi(
    () => () => {},
    {
      configure: (options) => {
        sound = options.sound;
      },
      show: () => played.push(sound),
    },
    () => true,
    () => {},
    () => {},
    { body: {}, querySelectorAll: () => [viewport] }
  );
  api.installNotification();
  api.setToastSound(false);
  api.toast('warning', '检查设置');
  assert.deepEqual(played, [false]);
  api.setToastSound(true);
  api.toast('info', '检查设置');
  assert.deepEqual(played, [false, true]);
});

test('notification sends plain text and converts existing durations from seconds to milliseconds', (t) => {
  const show = t.mock.method(ding, 'show', () => 'fixture-toast');
  const message = '<img src=x onerror=alert(1)> & "fixture"';
  assert.equal(toast('error', message, 4), 'fixture-toast');
  assert.deepEqual(show.mock.calls[0].arguments, ['error', message, { duration: 4000 }]);
  toast('success', '已加载课表');
  assert.deepEqual(show.mock.calls[1].arguments, ['success', '已加载课表', { duration: 5000 }]);
  toast('loading', '正在识别', 0, { progress: 0 });
  assert.deepEqual(show.mock.calls[2].arguments, ['loading', '正在识别', { progress: 0, duration: 0 }]);
});

test('progress, status transitions and dismiss use the native Ding handle APIs', (t) => {
  const update = t.mock.method(ding, 'update', () => {});
  const dismiss = t.mock.method(ding, 'dismiss', () => {});
  updateToastHandle('fixture-toast', { progress: 0.5, meta: '50%' });
  updateToastHandle('fixture-toast', {
    type: 'success',
    title: '识别完成',
    progress: null,
    meta: null,
    duration: 2000,
  });
  removeToastHandle(null);
  removeToastHandle('fixture-toast');
  assert.deepEqual(update.mock.calls[0].arguments, ['fixture-toast', { progress: 0.5, meta: '50%' }]);
  assert.equal(update.mock.calls[1].arguments[1].progress, null);
  assert.deepEqual(
    dismiss.mock.calls.map((call) => call.arguments),
    [['fixture-toast']]
  );
});

test('promise notifications delegate settlement and return values to Ding', async (t) => {
  const promise = t.mock.method(ding, 'promise', (task) => task());
  const messages = { loading: '导出中', success: '已导出', error: '导出失败' };
  const task = () => Promise.resolve('fixture');
  assert.equal(await toastPromise(task, messages), 'fixture');
  assert.deepEqual(promise.mock.calls[0].arguments, [task, messages]);
});

function nativeLifecycle(t) {
  t.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  t.after(() => {
    ding.dismiss();
    t.mock.timers.tick(340);
    t.mock.timers.tick(220);
    ding.configure({ sound: false });
  });
}

test('native progress updates are quiet and morph the existing toast only once at completion', (t) => {
  nativeLifecycle(t);
  const sounds = [];
  ding.configure({ sound: (type) => sounds.push(type) });
  const handle = toast('loading', '识别验证码', 0, { progress: 0 });
  const originalId = ding.getState().toasts[0].id;
  updateToastHandle(handle, { title: '识别验证码', progress: 0.5, meta: '50%' });
  assert.deepEqual(sounds, ['loading']);
  assert.equal(ding.getState().toasts[0].progress, 0.5);
  updateToastHandle(handle, { type: 'success', title: '识别完成', progress: null, duration: 2000 });
  assert.deepEqual(sounds, ['loading', 'success']);
  assert.equal(ding.getState().toasts.length, 1);
  assert.equal(ding.getState().toasts[0].id, originalId);
  assert.equal(ding.getState().toasts[0].progress, undefined);
  t.mock.timers.tick(450);
  t.mock.timers.tick(2000);
  t.mock.timers.tick(340);
  t.mock.timers.tick(220);
  assert.equal(ding.getState().toasts.length, 0);
});

test('native caller ownership prevents late progress from replacing a newer notification', (t) => {
  nativeLifecycle(t);
  const handle = toast('loading', '旧任务', 0);
  toast('info', '新消息');
  updateToastHandle(handle, { type: 'success', title: '旧任务完成' });
  assert.equal(ding.getState().toasts.at(-1).title, '新消息');
});

test('native promise notifications morph to success or error and preserve promise settlement', async (t) => {
  nativeLifecycle(t);
  const messages = { loading: '导出中', success: '已导出', error: (error) => error.message };
  assert.equal(await toastPromise(Promise.resolve('fixture'), messages), 'fixture');
  assert.equal(ding.getState().toasts[0].type, 'success');
  assert.equal(ding.getState().toasts[0].title, '已导出');
  await assert.rejects(
    toastPromise(Promise.reject(new Error('fixture failure')), messages),
    /fixture failure/
  );
  assert.equal(ding.getState().toasts.length, 1);
  assert.equal(ding.getState().toasts[0].type, 'error');
  assert.equal(ding.getState().toasts[0].title, 'fixture failure');
});
