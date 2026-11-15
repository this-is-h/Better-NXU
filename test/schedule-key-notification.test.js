import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { importPublicKey, importPrivateKey } from '../src/crypto/index.js';

const gmDocument = globalThis.document;
globalThis.document = undefined;
const { ref, h } = await import('vue');
globalThis.document = gmDocument;

const source = readFileSync(new URL('../src/composables/use-schedule-export.js', import.meta.url), 'utf8');
const createRequest = new Function(
  'showConfirmDialog',
  'Field',
  'ref',
  'h',
  'importPublicKey',
  'importPrivateKey',
  'toast',
  source.replace(/^import[\s\S]*?from\s+(['"])[^'"]+\1;?\r?\n/gm, '').replace(/^export /gm, '') +
    '\nreturn requestScheduleKey;'
);

for (const type of ['public', 'private']) {
  test(`${type} key validation uses a warning notification and keeps the dialog open`, async () => {
    for (const initialValue of ['', 'invalid-key']) {
      const notices = [];
      let closed;
      const request = createRequest(
        async (options) => {
          closed = await options.beforeClose('confirm');
          return 'cancel';
        },
        {},
        ref,
        h,
        importPublicKey,
        importPrivateKey,
        (...args) => notices.push(args)
      );
      assert.equal(await request(type, { initialValue }), null);
      assert.equal(closed, false);
      assert.equal(notices.length, 1);
      assert.equal(notices[0][0], 'warning');
      assert.ok(notices[0][1]);
      if (!initialValue) {
        assert.equal(notices[0][1], type === 'public' ? '请粘贴加密密钥' : '请粘贴解密密钥');
      }
    }
  });
}

test('cancelling key entry closes the dialog without a notification', async () => {
  const request = createRequest(
    async (options) => {
      assert.equal(await options.beforeClose('cancel'), true);
      return 'cancel';
    },
    {},
    ref,
    h,
    importPublicKey,
    importPrivateKey,
    () => assert.fail('cancel must not notify')
  );
  assert.equal(await request('public'), null);
});
