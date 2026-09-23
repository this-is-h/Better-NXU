import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

const gm = {};
document[globalThis.__MONKEY_WINDOW_KEY__] = { GM: gm };
const { fetchSliderAsset, SLIDER_ASSETS } = await import('../src/libraries/slider-resources.js');
const bytes = new TextEncoder().encode('static test asset').buffer;
const asset = {
  url: 'https://cdn.jsdelivr.net/npm/example@1.0.0/test.js',
  sha384: createHash('sha384').update(new Uint8Array(bytes)).digest('base64'),
};
const response = { status: 200, response: bytes, responseHeaders: 'Content-Type: application/javascript' };
const signal = () => new AbortController().signal;

test('slider resources pin all runtime files and the model to versions and SHA384', () => {
  assert.deepEqual(Object.keys(SLIDER_ASSETS), ['runtime', 'module', 'wasm', 'model']);
  for (const descriptor of Object.values(SLIDER_ASSETS)) {
    assert.equal(new URL(descriptor.url).hostname, 'cdn.jsdelivr.net');
    assert.match(descriptor.url, /@\d+\.\d+\.\d+\//);
    assert.equal(Buffer.from(descriptor.sha384, 'base64').length, 48);
  }
});

test('GM downloads original CDN bytes anonymously without using page fetch', async (t) => {
  t.mock.method(globalThis, 'fetch', () => {
    throw new Error('page fetch must not be used');
  });
  gm.xmlHttpRequest = async (options) => {
    assert.deepEqual(options, {
      method: 'GET',
      url: asset.url,
      responseType: 'arraybuffer',
      anonymous: true,
      timeout: 60000,
    });
    return response;
  };
  assert.equal(await fetchSliderAsset(asset, signal()), bytes);
});

test('HTML login responses, HTTP failures and invalid binary responses are rejected', async () => {
  for (const [overrides, expected] of [
    [{ status: 403 }, /HTTP 403/],
    [{ responseHeaders: 'Content-Type: text/html; charset=utf-8' }, /HTML/],
    [{ response: '<html>login</html>' }, /二进制/],
    [{ response: new ArrayBuffer(0) }, /二进制/],
  ]) {
    gm.xmlHttpRequest = async () => ({ ...response, ...overrides });
    await assert.rejects(fetchSliderAsset(asset, signal()), expected);
  }
});

test('tampered bytes fail integrity even if the response claims JavaScript', async () => {
  gm.xmlHttpRequest = async () => ({
    ...response,
    response: new TextEncoder().encode('<html>login</html>').buffer,
  });
  await assert.rejects(fetchSliderAsset(asset, signal()), /完整性校验失败/);
});

test('cancellation aborts the background request even when it never settles', async () => {
  const controller = new AbortController();
  let aborted = 0;
  gm.xmlHttpRequest = () => Object.assign(new Promise(() => {}), { abort: () => aborted++ });
  const pending = fetchSliderAsset(asset, controller.signal);
  controller.abort(new Error('cancel test'));
  await assert.rejects(pending, /cancel test/);
  assert.equal(aborted, 1);
});

test('missing GM API, rejected downloads and pre-cancelled work fail promptly', async () => {
  gm.xmlHttpRequest = undefined;
  await assert.rejects(fetchSliderAsset(asset, signal()), /不可用/);
  gm.xmlHttpRequest = async () => {
    throw new Error('network timeout');
  };
  await assert.rejects(fetchSliderAsset(asset, signal()), /network timeout/);
  const controller = new AbortController();
  controller.abort(new Error('already cancelled'));
  await assert.rejects(fetchSliderAsset(asset, controller.signal), /already cancelled/);
});
