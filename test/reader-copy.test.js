import test from 'node:test';
import assert from 'node:assert/strict';

const copied = [];
document[globalThis.__MONKEY_WINDOW_KEY__] = {
  GM_setClipboard: (text) => copied.push(text),
  unsafeWindow: { addToast() {}, createToast() {} },
};
const { installReaderCopy } = await import('../src/composables/reader-copy.js');

test('reader copy is idempotent, preserves styles and ignores synthetic or empty selections', () => {
  const listeners = new Map();
  let selected = '';
  let count = 0;
  let removed = false;
  const events = {
    addEventListener(type, callback, capture) {
      listeners.set(type, { callback, capture });
    },
    removeEventListener(type) {
      listeners.delete(type);
    },
  };
  const view = {
    ...events,
    getSelection: () => ({ rangeCount: selected ? 1 : 0, toString: () => selected }),
  };
  const doc = {
    ...events,
    defaultView: view,
    createElement: () => ({
      textContent: '',
      remove() {
        removed = true;
      },
    }),
    head: {
      appendChild(style) {
        count++;
        assert.match(style.textContent, /h1\.Chapter/);
      },
    },
  };
  const cleanup = installReaderCopy(doc);
  assert.equal(installReaderCopy(doc), cleanup);
  assert.equal(count, 1);
  const { callback: copy, capture } = listeners.get('mouseup');
  assert.equal(capture, true);
  copy({ isTrusted: true, button: 0 });
  selected = '  ';
  copy({ isTrusted: true, button: 0 });
  selected = 'fixture text';
  copy({ isTrusted: false, button: 0 });
  copy({ isTrusted: true, button: 2 });
  assert.deepEqual(copied, []);
  copy({ isTrusted: true, button: 0 });
  assert.deepEqual(copied, ['fixture text']);
  listeners.get('pagehide').callback({ persisted: true });
  assert.equal(listeners.size, 2);
  listeners.get('pagehide').callback({ persisted: false });
  assert.equal(listeners.size, 0);
  assert.equal(removed, true);
});
