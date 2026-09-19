import test from 'node:test';
import assert from 'node:assert/strict';

import { waitOrToast } from '../src/composables/use-wait-or-toast.js';

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
