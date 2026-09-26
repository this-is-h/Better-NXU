import test from 'node:test';
import assert from 'node:assert/strict';

const calls = [];
document[globalThis.__MONKEY_WINDOW_KEY__] = {
  unsafeWindow: { createToast: (...args) => calls.push(args) },
};
const { toast, toastTrustedHtml } = await import('../src/libraries/notification.js');
const { buildCredentialsErrorToast } = await import('../src/utils/auth-form.js');

test('notification treats remote error messages and filenames as plain text', () => {
  toast('error', '<img src=x onerror=alert(1)> & "fixture"', 4);
  assert.deepEqual(calls[0], ['error', '&lt;img src=x onerror=alert(1)&gt; &amp; &quot;fixture&quot;', 4]);
  toast('success', '已加载课表', 2);
  assert.deepEqual(calls[1], ['success', '已加载课表', 2]);
});

test('static credential settings links retain their dedicated HTML rendering path', () => {
  const html = buildCredentialsErrorToast();
  toastTrustedHtml('error', html, 0);
  assert.equal(calls.at(-1)[1], html);
  assert.match(html, /href="https:\/\/sslvpn.nxu.edu.cn\/h\/settings"/);
});
