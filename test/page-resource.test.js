import test from 'node:test';
import assert from 'node:assert/strict';

const pageWindow = {};
const injected = [];

globalThis.document = { head: {} };
Object.defineProperty(globalThis.document, '__monkeyWindow-node-test', {
  configurable: true,
  value: {
    unsafeWindow: pageWindow,
    GM_getResourceText(name) {
      if (name === 'test-library') return 'window.TestLibrary = { ready: true };';
      return '';
    },
    GM_addElement(parent, tag, attributes) {
      injected.push({ parent, tag, attributes, removed: false });
      Function('window', attributes.textContent).call(pageWindow, pageWindow);
      return {
        remove() {
          injected.at(-1).removed = true;
        },
      };
    },
  },
});

const { evaluatePageResource } = await import('../src/libraries/page-resource.js');

test('page resource evaluates in unsafeWindow and validates its global', () => {
  injected.length = 0;
  const runtime = evaluatePageResource(
    'test-library',
    (target) => target.TestLibrary?.ready && target.TestLibrary
  );
  assert.equal(runtime.ready, true);
  assert.equal(injected.length, 1);
  assert.equal(injected[0].parent, document.head);
  assert.equal(injected[0].tag, 'script');
  assert.equal(injected[0].removed, true);
});

test('page resource rejects missing content and unexpected globals', () => {
  assert.throws(() => evaluatePageResource('missing-library', () => null), /不存在或内容为空/);
  assert.throws(() => evaluatePageResource('test-library', () => null), /未暴露预期的全局对象/);
});
