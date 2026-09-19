import test from 'node:test';
import assert from 'node:assert/strict';

import {
  patchPortalHistory,
  getNavigateCallbackCount,
  _resetPortalSpaForTest,
} from '../src/sites/portal/runtime/spa-history.js';

const flushTasks = () => new Promise((resolve) => setTimeout(resolve, 0));

async function withFakeHistory(run) {
  const originalHistory = globalThis.history;
  const originalAddEventListener = globalThis.addEventListener;
  const originalRemoveEventListener = globalThis.removeEventListener;
  const listeners = new Map();
  const originalCalls = [];

  globalThis.history = {
    pushState(...args) {
      originalCalls.push(['pushState', args]);
      return 'push-result';
    },
    replaceState(...args) {
      originalCalls.push(['replaceState', args]);
      return 'replace-result';
    },
  };
  globalThis.addEventListener = (type, listener) => listeners.set(type, listener);
  globalThis.removeEventListener = (type, listener) => {
    if (listeners.get(type) === listener) listeners.delete(type);
  };

  try {
    await run({ listeners, originalCalls });
  } finally {
    _resetPortalSpaForTest();
    if (originalHistory === undefined) delete globalThis.history;
    else globalThis.history = originalHistory;
    if (originalAddEventListener === undefined) delete globalThis.addEventListener;
    else globalThis.addEventListener = originalAddEventListener;
    if (originalRemoveEventListener === undefined) delete globalThis.removeEventListener;
    else globalThis.removeEventListener = originalRemoveEventListener;
  }
}

test('patchPortalHistory patches once and notifies every registered callback', async () => {
  await withFakeHistory(async ({ listeners, originalCalls }) => {
    const callbackCalls = [];

    patchPortalHistory({ onNavigate: () => callbackCalls.push('first') });
    const patchedPushState = history.pushState;
    patchPortalHistory({
      onNavigate: async () => {
        await Promise.resolve();
        callbackCalls.push('second');
      },
    });

    assert.equal(history.pushState, patchedPushState);
    assert.equal(getNavigateCallbackCount(), 2);
    assert.equal(history.pushState({ page: 1 }, '', '/next'), 'push-result');
    await flushTasks();
    assert.deepEqual(callbackCalls, ['first', 'second']);
    assert.deepEqual(originalCalls, [['pushState', [{ page: 1 }, '', '/next']]]);

    assert.equal(history.replaceState({ page: 2 }, '', '/current'), 'replace-result');
    await flushTasks();
    assert.deepEqual(callbackCalls, ['first', 'second', 'first', 'second']);

    listeners.get('popstate')();
    await flushTasks();
    assert.deepEqual(callbackCalls, ['first', 'second', 'first', 'second', 'first', 'second']);
  });
});

test('patchPortalHistory coalesces navigation events while callbacks are running', async () => {
  await withFakeHistory(async () => {
    let releaseFirstRun;
    let runCount = 0;
    const firstRun = new Promise((resolve) => {
      releaseFirstRun = resolve;
    });

    patchPortalHistory({
      onNavigate: async () => {
        runCount += 1;
        if (runCount === 1) await firstRun;
      },
    });

    history.pushState({}, '', '/one');
    history.pushState({}, '', '/two');
    history.replaceState({}, '', '/three');
    await flushTasks();
    assert.equal(runCount, 1);

    releaseFirstRun();
    await flushTasks();
    await flushTasks();
    assert.equal(runCount, 2);
  });
});
