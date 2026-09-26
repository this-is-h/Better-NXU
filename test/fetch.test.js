import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchWithTimeout } from '../src/utils/fetch.js';

test('fetchWithTimeout forwards caller cancellation and removes its listener', async () => {
  const controller = new AbortController();
  const request = fetchWithTimeout(
    (_input, init) =>
      new Promise((_resolve, reject) => {
        init.signal.addEventListener(
          'abort',
          () => {
            const error = new Error('aborted');
            error.name = 'AbortError';
            reject(error);
          },
          { once: true }
        );
      }),
    '/test',
    {},
    { signal: controller.signal, timeoutMs: 5000 }
  );

  controller.abort();
  await assert.rejects(request, { name: 'AbortError' });
});

test('fetchWithTimeout reports a stable timeout error', async () => {
  const request = fetchWithTimeout(
    (_input, init) =>
      new Promise((_resolve, reject) => {
        init.signal.addEventListener(
          'abort',
          () => {
            const error = new Error('aborted');
            error.name = 'AbortError';
            reject(error);
          },
          { once: true }
        );
      }),
    '/test',
    {},
    { timeoutMs: 1 }
  );

  await assert.rejects(request, { name: 'TimeoutError' });
});

test('fetchWithTimeout rejects an already aborted caller signal', async () => {
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(
    fetchWithTimeout(async () => ({ ok: true }), '/test', {}, { signal: controller.signal }),
    { name: 'AbortError' }
  );
});

test('fetchWithTimeout clears its timer after success', async () => {
  const response = { ok: true };
  assert.equal(await fetchWithTimeout(async () => response, '/test'), response);
});

test('fetchWithTimeout covers stalled response bodies and abort-ignoring wrappers', async () => {
  let requestSignal;
  await assert.rejects(
    fetchWithTimeout(
      async (_input, init) => {
        requestSignal = init.signal;
        return { text: () => new Promise(() => {}) };
      },
      '/test',
      {},
      { timeoutMs: 5, consumeResponse: (response) => response.text() }
    ),
    { name: 'TimeoutError' }
  );
  assert.equal(requestSignal.aborted, true);
});

test('fetchWithTimeout keeps caller cancellation active after headers arrive', async () => {
  const controller = new AbortController();
  const request = fetchWithTimeout(
    async () => ({ text: () => new Promise(() => {}) }),
    '/test',
    { signal: controller.signal },
    {
      consumeResponse(response) {
        controller.abort();
        return response.text();
      },
    }
  );
  await assert.rejects(request, { name: 'AbortError' });
});

test('fetchWithTimeout returns consumed response data and preserves reader errors', async () => {
  assert.deepEqual(
    await fetchWithTimeout(
      async () => ({ json: async () => ({ value: 42 }) }),
      '/test',
      {},
      {
        consumeResponse: (response) => response.json(),
      }
    ),
    { value: 42 }
  );
  await assert.rejects(
    fetchWithTimeout(
      async () => ({}),
      '/test',
      {},
      {
        consumeResponse() {
          throw new SyntaxError('invalid response');
        },
      }
    ),
    { name: 'SyntaxError', message: 'invalid response' }
  );
});
