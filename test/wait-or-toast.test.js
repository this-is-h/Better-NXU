import test from 'node:test';
import assert from 'node:assert/strict';

import { waitOrToast } from '../src/composables/use-wait-or-toast.js';
import { waitForElement } from '../src/utils/dom.js';

test('waitOrToast returns the matching element without showing a toast', async () => {
  const originalDocument = globalThis.document;
  const originalCreateToast = globalThis.createToast;
  const element = { id: 'ready' };
  let toastCalls = 0;

  globalThis.document = { querySelector: () => element };
  globalThis.createToast = () => {
    toastCalls += 1;
  };

  try {
    const result = await waitOrToast('#ready', { timeout: 0, interval: 20 });
    assert.equal(result, element);
    assert.equal(toastCalls, 0);
  } finally {
    globalThis.document = originalDocument;
    globalThis.createToast = originalCreateToast;
  }
});

test('DOM timeout distinguishes a missing element from a failed readiness predicate', async (t) => {
  const originalDocument = globalThis.document;
  t.after(() => {
    globalThis.document = originalDocument;
  });
  const warnings = [];
  t.mock.method(console, 'warn', (...args) => warnings.push(args));
  for (const [element, reason] of [
    [null, '未找到匹配元素'],
    [{}, '元素已找到，但就绪条件未满足'],
  ]) {
    globalThis.document = { querySelector: () => element };
    warnings.length = 0;
    await assert.rejects(waitForElement('#fixture', { timeout: 10, interval: 20, predicate: () => false }), {
      code: 'WAIT_TIMEOUT',
    });
    const detail = warnings.find((args) => args[1]?.reason)?.[1];
    assert.equal(detail.reason, reason);
    assert.equal(detail.selector, '#fixture');
    assert.ok(detail.elapsedMs >= detail.timeoutMs);
  }
});

test('unexpected DOM errors are logged with the failed selector before returning null', async (t) => {
  const originalDocument = globalThis.document;
  const originalCreateToast = globalThis.createToast;
  const originalAddToast = globalThis.addToast;
  t.after(() => {
    globalThis.document = originalDocument;
    globalThis.createToast = originalCreateToast;
    globalThis.addToast = originalAddToast;
  });
  globalThis.document = {
    querySelector: () => {
      throw new Error('fixture DOM failure');
    },
  };
  globalThis.createToast = () => {};
  globalThis.addToast = () => {};
  const errors = [];
  t.mock.method(console, 'error', (...args) => errors.push(args));
  assert.equal(await waitOrToast('#fixture'), null);
  const detail = errors.find((args) => args[1]?.selector)?.[1];
  assert.equal(detail.selector, '#fixture');
  assert.equal(detail.error.message, 'fixture DOM failure');
});

test('waitOrToast converts a timeout into the configured toast and null', async () => {
  const originalDocument = globalThis.document;
  const originalAddToast = globalThis.addToast;
  const originalCreateToast = globalThis.createToast;
  const calls = [];

  globalThis.document = { querySelector: () => null };
  globalThis.addToast = () => {};
  globalThis.createToast = (...args) => calls.push(args);

  try {
    const result = await waitOrToast('#missing', {
      timeout: 0,
      interval: 20,
      level: 'error',
      timeoutMessage: '页面尚未就绪',
      duration: 4,
    });

    assert.equal(result, null);
    assert.deepEqual(calls, [['error', '页面尚未就绪', 4]]);
  } finally {
    globalThis.document = originalDocument;
    globalThis.addToast = originalAddToast;
    globalThis.createToast = originalCreateToast;
  }
});
