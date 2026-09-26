import test from 'node:test';
import assert from 'node:assert/strict';

const writes = [];
const pageWindow = {};
document[globalThis.__MONKEY_WINDOW_KEY__] = {
  unsafeWindow: pageWindow,
  GM: { setValue: async (...args) => writes.push(args) },
};
const { getIcsId, getStudentOwner } = await import('../src/sites/webvpn/components/tools/ics-id.js');

test('schedule metadata requests time out while reading bodies', async () => {
  writes.length = 0;
  pageWindow.fetch = async () => ({
    ok: true,
    text: () => new Promise(() => {}),
    json: () => new Promise(() => {}),
  });
  await assert.rejects(getIcsId({ timeoutMs: 5 }), /个人课表 ID 获取超时/);
  await assert.rejects(getStudentOwner('100000', { timeoutMs: 5 }), /身份信息获取超时/);
  assert.deepEqual(writes, []);
});

test('cancelled schedule metadata never writes a late share ID', async () => {
  writes.length = 0;
  const controller = new AbortController();
  let finishBody;
  let bodyStarted;
  const started = new Promise((resolve) => (bodyStarted = resolve));
  pageWindow.fetch = async () => ({
    ok: true,
    text() {
      bodyStarted();
      return new Promise((resolve) => (finishBody = resolve));
    },
  });
  const request = getIcsId({ signal: controller.signal });
  await started;
  controller.abort();
  await assert.rejects(request, { name: 'AbortError' });
  finishBody('{"shareId":"100001"}');
  await Promise.resolve();
  assert.deepEqual(writes, []);
});

test('completed schedule metadata retains cache and identity checks', async () => {
  writes.length = 0;
  pageWindow.fetch = async () => ({ ok: true, text: async () => '{"shareId":"100001"}' });
  assert.equal(await getIcsId(), '100001');
  assert.deepEqual(writes, [['icsId', '100001']]);
  pageWindow.fetch = async () => ({
    ok: true,
    json: async () => ({ returnCode: '#E000000000000', data: { XSBH: '100000', XM: '测试用户' } }),
  });
  assert.deepEqual(await getStudentOwner('100000'), { id: '100000', name: '测试用户' });
  await assert.rejects(getStudentOwner('100002'), { code: 'STUDENT_ID_MISMATCH' });
});
