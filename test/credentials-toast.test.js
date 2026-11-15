import test from 'node:test';
import assert from 'node:assert/strict';
import { toast as ding } from '@yusufceng1z/ding';

const opened = [];
let nativeOpens = 0;
let hasCredentials = false;
document[globalThis.__MONKEY_WINDOW_KEY__] = {
  unsafeWindow: { CAT_userConfig: () => nativeOpens++ },
  GM_openInTab: (...args) => opened.push(args),
  GM_getValue: () => (hasCredentials ? 'fixture' : ''),
};
const { requireCredentials, notifyCredentialsProblem } =
  await import('../src/composables/use-credentials-toast.js');

test('missing credentials offer a native Ding action without HTML or inline handlers', (t) => {
  const show = t.mock.method(ding, 'show', () => 'fixture-credentials');
  assert.equal(requireCredentials('WebVPN'), false);
  const [type, title, options] = show.mock.calls[0].arguments;
  assert.equal(type, 'error');
  assert.equal(title, '账号密码未配置');
  assert.equal(options.description, '请前往配置相关信息');
  assert.equal(options.action.label, '前往配置');
  options.action.onClick();
  assert.deepEqual(opened, [['https://sslvpn.nxu.edu.cn/h/settings', { active: true }]]);
});

test('JWGL credential errors retain the ScriptCat settings action', (t) => {
  const show = t.mock.method(ding, 'show', () => 'fixture-credentials');
  notifyCredentialsProblem('Jwgl', 0);
  const options = show.mock.calls[0].arguments[2];
  assert.equal(show.mock.calls[0].arguments[1], '账号密码配置错误');
  assert.equal(options.duration, 0);
  options.action.onClick();
  assert.equal(nativeOpens, 1);
});

test('configured credentials do not create a notification', (t) => {
  const show = t.mock.method(ding, 'show', () => 'fixture-credentials');
  hasCredentials = true;
  t.after(() => {
    hasCredentials = false;
  });
  assert.equal(requireCredentials('WebVPN'), true);
  assert.equal(show.mock.calls.length, 0);
});
