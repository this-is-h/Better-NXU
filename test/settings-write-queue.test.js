import test from 'node:test';
import assert from 'node:assert/strict';
import { createSettingsWriteQueue } from '../src/config/settings-write-queue.js';

test('settings writes stay ordered and pending values are coalesced by key', async () => {
  const writes = [];
  let releaseFirst;
  const firstWrite = new Promise((resolve) => {
    releaseFirst = resolve;
  });
  const queue = createSettingsWriteQueue(async (name, value) => {
    writes.push([name, value]);
    if (writes.length === 1) await firstWrite;
  });

  queue.enqueue('WebVPN.username', 'first');
  queue.enqueue('WebVPN.username', 'second');
  queue.enqueue('WebVPN.username', 'latest');
  queue.enqueue('WebVPN.password', 'secret');
  releaseFirst();
  await queue.flush();

  assert.deepEqual(writes, [
    ['WebVPN.username', 'first'],
    ['WebVPN.username', 'latest'],
    ['WebVPN.password', 'secret'],
  ]);
});

test('settings queue reports one failure and continues draining', async () => {
  const writes = [];
  const failures = [];
  const queue = createSettingsWriteQueue(
    async (name) => {
      writes.push(name);
      if (name === 'bad') throw new Error('write failed');
    },
    (error, name) => failures.push([name, error.message])
  );

  queue.enqueue('bad', 1);
  queue.enqueue('good', 2);
  await queue.flush();

  assert.deepEqual(writes, ['bad', 'good']);
  assert.deepEqual(failures, [['bad', 'write failed']]);
});
