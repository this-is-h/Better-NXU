import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';

const gm = {};
// ScriptCat's installed script window is distinct from the real page window.
const pageWindow = Object.create(globalThis);
document[globalThis.__MONKEY_WINDOW_KEY__] = { GM: gm, unsafeWindow: pageWindow };
const { SLIDER_ASSETS } = await import('../src/libraries/slider-resources.js');
const { buildLocalSliderWorker, getSliderRecognizer, disposeSliderRecognizer } =
  await import('../src/libraries/slider-recognizer.js');
let workers, requests, urls, listeners, initReply, detection, blobs;
globalThis.addEventListener = () => {};
globalThis.removeEventListener = () => {};
globalThis.Worker = class {};
globalThis.createImageBitmap = async () => {};

test.beforeEach((t) => {
  workers = [];
  requests = [];
  urls = new Set();
  blobs = [];
  listeners = new Map();
  initReply = { type: 'ready' };
  detection = { box: [120, 20, 160, 60], confidence: 0.9 };
  t.mock.method(URL, 'createObjectURL', (blob) => {
    blobs.push(blob);
    const url = `blob:test-${urls.size}`;
    urls.add(url);
    return url;
  });
  t.mock.method(URL, 'revokeObjectURL', (url) => urls.delete(url));
  t.mock.method(globalThis, 'addEventListener', (type, listener) => listeners.set(type, listener));
  t.mock.method(globalThis, 'removeEventListener', (type) => listeners.delete(type));
  // Fake downloads keep tests small; integrity validation itself is tested with real SHA384 separately.
  t.mock.method(crypto.subtle, 'digest', async (_, buffer) => {
    const index = new Uint8Array(buffer)[0];
    return Uint8Array.from(Buffer.from(Object.values(SLIDER_ASSETS)[index].sha384, 'base64')).buffer;
  });
  gm.xmlHttpRequest = async (options) => {
    requests.push(options);
    const index = Object.values(SLIDER_ASSETS).findIndex((asset) => asset.url === options.url);
    return { status: 200, response: new Uint8Array([index]).buffer };
  };
  globalThis.Worker = class {
    constructor(url) {
      this.url = url;
      this.messages = [];
      workers.push(this);
    }
    postMessage(message, transfer) {
      this.messages.push({ message, transfer });
      const reply = message.type === 'init' ? initReply : detection;
      if (reply) queueMicrotask(() => this.onmessage({ data: { id: message.id, ...reply } }));
    }
    terminate() {
      this.terminated = true;
    }
  };
});

test.afterEach(() => disposeSliderRecognizer());

test('generated worker uses local runtime/module/WASM and passes model bytes to ORT', async () => {
  const imported = [];
  const model = new Uint8Array([1, 2]);
  let sessionModel;
  const ort = {
    env: { wasm: {} },
    InferenceSession: {
      create: async (input) => {
        sessionModel = input;
        return { inputNames: ['input'], run: async () => ({}) };
      },
    },
    Tensor: class {},
  };
  const sandbox = {
    self: { postMessage() {} },
    importScripts: (url) => {
      imported.push(url);
      sandbox.ort = ort;
    },
  };
  const source = buildLocalSliderWorker({
    runtimeUrl: 'blob:runtime',
    moduleUrl: 'blob:module',
    wasmUrl: 'blob:wasm',
  });
  assert.doesNotMatch(source, /https?:\/\//);
  vm.runInNewContext(source, sandbox);
  await sandbox.self.onmessage({ data: { type: 'init', id: 0, modelUrl: model } });
  assert.deepEqual(imported, ['blob:runtime']);
  assert.equal(
    JSON.stringify(ort.env.wasm.wasmPaths),
    JSON.stringify({ mjs: 'blob:module', wasm: 'blob:wasm' })
  );
  assert.equal(ort.env.wasm.numThreads, 1);
  assert.equal(sessionModel, model);
});

test('concurrent callers share initialization and preserve display coordinates and no-detection results', async () => {
  const first = getSliderRecognizer();
  assert.equal(first, getSliderRecognizer());
  const rec = await first;
  assert.equal(workers.length, 1);
  assert.equal(requests.length, 4);
  const { message, transfer } = workers[0].messages[0];
  assert.ok(message.modelUrl instanceof Uint8Array);
  assert.equal(transfer[0], message.modelUrl.buffer);
  const rgba = { data: new Uint8ClampedArray(4), width: 600, height: 300 };
  assert.deepEqual(await rec.detect(rgba, { displayWidth: 300, displayHeight: 150 }), {
    box: [60, 10, 80, 30],
    confidence: 0.9,
    naturalWidth: 600,
    naturalHeight: 300,
  });
  detection = { box: [], confidence: 0 };
  assert.deepEqual((await rec.detect(rgba)).box, []);
  rec.dispose();
  assert.equal(workers[0].terminated, true);
  assert.equal(urls.size, 0);
  assert.equal(listeners.size, 0);
  await assert.rejects(rec.detect(rgba), /已释放/);
});

test('WebVPN Blob hooks preserve script text without reparsing modules and keep WASM binary intact', async (t) => {
  const NativeBlob = globalThis.Blob;
  // WebVPN main.js parses JS parts after coercing them to text, except existing Blobs.
  // Its script parser rejects ORT's top-level await even though browsers support it in modules.
  class WebVpnBlob extends NativeBlob {
    constructor(parts, options) {
      if (options?.type === 'text/javascript' && !parts.some((part) => part instanceof NativeBlob)) {
        const source = parts.join('');
        if (source.includes('await import(')) throw new SyntaxError('Unexpected token (79:31)');
        super([source], options);
      } else {
        super(parts, options);
      }
    }
  }
  globalThis.Blob = WebVpnBlob;
  t.after(() => {
    globalThis.Blob = NativeBlob;
  });
  const runtime = new TextEncoder().encode('/* 中文 */ self.ort = { ready: true };');
  const module = new TextEncoder().encode(
    "export default function wasm() { /* 模块 */ }\nif (false) await import('worker_threads');"
  );
  const wasm = new Uint8Array([0, 97, 115, 109, 255]);
  const payloads = [runtime, module, wasm, new Uint8Array([3])];
  t.mock.method(crypto.subtle, 'digest', async (_, buffer) => {
    const index = payloads.findIndex((payload) => payload.buffer === buffer);
    return Uint8Array.from(Buffer.from(Object.values(SLIDER_ASSETS)[index].sha384, 'base64')).buffer;
  });
  gm.xmlHttpRequest = async (options) => {
    const index = Object.values(SLIDER_ASSETS).findIndex((asset) => asset.url === options.url);
    return { status: 200, response: payloads[index].buffer };
  };
  // Capture the original failure rather than merely asserting a new call shape.
  assert.equal(
    await new WebVpnBlob([runtime.buffer], { type: 'text/javascript' }).text(),
    '[object ArrayBuffer]'
  );
  assert.throws(
    () => new WebVpnBlob([new TextDecoder().decode(module)], { type: 'text/javascript' }),
    /Unexpected token/
  );
  await getSliderRecognizer();
  assert.equal(await blobs[0].text(), new TextDecoder().decode(runtime));
  assert.equal(await blobs[1].text(), new TextDecoder().decode(module));
  assert.deepEqual(new Uint8Array(await blobs[2].arrayBuffer()), wasm);
  const context = { self: {} };
  vm.runInNewContext(await blobs[0].text(), context);
  assert.equal(context.self.ort.ready, true);
});

test('WebVPN masked Blob URLs are normalized for native module imports and cleaned up', async (t) => {
  let id = 0;
  const normalized = [];
  const revoked = [];
  const originalRewrite = window.vpn_rewrite_url;
  window.vpn_rewrite_url = function (url) {
    assert.equal(this, pageWindow);
    normalized.push(url);
    return url.replace('blob:https://ids.nxu.edu.cn/', 'blob:https://webvpn.nxu.edu.cn/');
  };
  t.after(() => {
    window.vpn_rewrite_url = originalRewrite;
  });
  t.mock.method(URL, 'createObjectURL', (blob) => {
    blobs.push(blob);
    return `blob:https://ids.nxu.edu.cn/${++id}`;
  });
  t.mock.method(URL, 'revokeObjectURL', (url) => revoked.push(url));
  const rec = await getSliderRecognizer();
  assert.equal(workers[0].url, 'blob:https://webvpn.nxu.edu.cn/4');
  const source = await blobs[3].text();
  assert.match(source, /importScripts\("blob:https:\/\/webvpn.nxu.edu.cn\/1"\)/);
  assert.match(source, /"mjs":"blob:https:\/\/webvpn.nxu.edu.cn\/2"/);
  assert.match(source, /"wasm":"blob:https:\/\/webvpn.nxu.edu.cn\/3"/);
  assert.doesNotMatch(source, /blob:https:\/\/ids.nxu.edu.cn/);
  rec.dispose();
  assert.deepEqual(revoked, normalized);
});

test('installed sandbox uses page Blob, URL and Worker together with the page-only URL rewriter', async (t) => {
  const revoked = [];
  const normalized = [];
  const SandboxWorker = globalThis.Worker;
  Object.assign(pageWindow, {
    Blob: globalThis.Blob,
    URL: {
      createObjectURL(blob) {
        assert.equal(this, pageWindow.URL);
        blobs.push(blob);
        return `blob:https://ids.nxu.edu.cn/${blobs.length}`;
      },
      revokeObjectURL(url) {
        assert.equal(this, pageWindow.URL);
        revoked.push(url);
      },
    },
    vpn_rewrite_url(url) {
      assert.equal(this, pageWindow);
      normalized.push(url);
      return url.replace('blob:https://ids.nxu.edu.cn/', 'blob:https://webvpn.nxu.edu.cn/');
    },
    Worker: class extends SandboxWorker {
      constructor(url) {
        if (!url.startsWith('blob:https://webvpn.nxu.edu.cn/')) {
          throw new DOMException('Worker script cannot be accessed from origin', 'SecurityError');
        }
        super(url);
      }
    },
  });
  t.after(() => {
    disposeSliderRecognizer();
    for (const key of ['Blob', 'URL', 'Worker', 'vpn_rewrite_url']) delete pageWindow[key];
  });
  assert.equal(typeof window.vpn_rewrite_url, 'undefined');
  assert.throws(() => new pageWindow.Worker('blob:https://ids.nxu.edu.cn/4'), { name: 'SecurityError' });
  t.mock.method(globalThis, 'Worker', function () {
    throw new Error('sandbox Worker must not be used');
  });
  t.mock.method(globalThis, 'Blob', function () {
    throw new Error('sandbox Blob must not be used');
  });
  t.mock.method(URL, 'createObjectURL', () => {
    throw new Error('sandbox URL must not be used');
  });
  const rec = await getSliderRecognizer();
  assert.equal(workers[0].url, 'blob:https://webvpn.nxu.edu.cn/4');
  const source = await blobs[3].text();
  assert.doesNotMatch(source, /blob:https:\/\/ids.nxu.edu.cn/);
  assert.match(source, /"mjs":"blob:https:\/\/webvpn.nxu.edu.cn\/2"/);
  assert.deepEqual(
    (await rec.detect({ data: new Uint8ClampedArray(4), width: 1, height: 1 })).box,
    detection.box
  );
  rec.dispose();
  assert.deepEqual(revoked, normalized);
  assert.equal(workers[0].terminated, true);
  assert.equal(listeners.size, 0);
});

test('Worker constructor failure revokes all allocated URLs and allows a new initialization', async (t) => {
  const Worker = globalThis.Worker;
  const replacement = t.mock.method(globalThis, 'Worker', function () {
    throw new DOMException('Worker script cannot be accessed from origin', 'SecurityError');
  });
  await assert.rejects(
    getSliderRecognizer(),
    (error) => error.code === 'SLIDER_RECOGNIZER_UNAVAILABLE' && /cannot be accessed/.test(error.message)
  );
  assert.equal(urls.size, 0);
  assert.equal(listeners.size, 0);
  replacement.mock.restore();
  assert.equal(globalThis.Worker, Worker);
  await getSliderRecognizer();
  assert.equal(workers.length, 1);
});

test('worker init error id=0 rejects immediately, cleans up and permits retry', async () => {
  initReply = { error: 'ORT init failed' };
  await assert.rejects(
    getSliderRecognizer(),
    (error) => error.code === 'SLIDER_RECOGNIZER_UNAVAILABLE' && /ORT init failed/.test(error.message)
  );
  assert.equal(workers[0].terminated, true);
  assert.equal(urls.size, 0);
  initReply = { type: 'ready' };
  await getSliderRecognizer();
  assert.equal(workers.length, 2);
});

test('worker initialization timeout clears resources and rejects all callers', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  initReply = null;
  const ready = getSliderRecognizer();
  const rejected = assert.rejects(ready, /加载超时/);
  await new Promise((resolve) => setImmediate(resolve));
  t.mock.timers.tick(90000);
  await rejected;
  assert.equal(workers[0].terminated, true);
  assert.equal(urls.size, 0);
});

test('worker failure rejects pending detection and pagehide disposes the replacement', async () => {
  const rec = await getSliderRecognizer();
  detection = null;
  const pending = rec.detect({ data: new Uint8ClampedArray(4), width: 1, height: 1 });
  workers[0].onerror({ message: 'failure' });
  await assert.rejects(pending, /Worker 执行失败/);
  await getSliderRecognizer();
  listeners.get('pagehide')();
  assert.equal(workers[1].terminated, true);
  assert.equal(urls.size, 0);
});

test('late downloads after disposal cannot create a stale worker or replace a new instance', async () => {
  const resume = [];
  const normalRequest = gm.xmlHttpRequest;
  gm.xmlHttpRequest = (options) =>
    new Promise((resolve) => resume.push(() => resolve(normalRequest(options))));
  const old = getSliderRecognizer();
  const rejected = assert.rejects(old, /已释放/);
  disposeSliderRecognizer();
  gm.xmlHttpRequest = normalRequest;
  const current = getSliderRecognizer();
  for (const resolve of resume) resolve();
  await rejected;
  await current;
  assert.equal(workers.length, 1);
  assert.equal(getSliderRecognizer(), current);
});

test('canvas snapshots capture size before transfer and close after inference', async (t) => {
  const bitmap = { width: 600, height: 300, close: t.mock.fn() };
  t.mock.method(globalThis, 'createImageBitmap', async () => bitmap);
  const rec = await getSliderRecognizer();
  assert.deepEqual((await rec.detect({}, { displayWidth: 300, displayHeight: 150 })).box, [60, 10, 80, 30]);
  assert.equal(workers[0].messages[1].transfer[0], bitmap);
  assert.equal(bitmap.close.mock.callCount(), 1);
});

test('detection timeout stops the worker and rejects waiting inference', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const rec = await getSliderRecognizer();
  detection = null;
  const pending = rec.detect({ data: new Uint8ClampedArray(4), width: 1, height: 1 });
  const rejected = assert.rejects(pending, /识别超时/);
  t.mock.timers.tick(30000);
  await rejected;
  assert.equal(workers[0].terminated, true);
  assert.equal(urls.size, 0);
});

test('timeout while capturing an image rejects promptly and closes a late bitmap', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  let resolveBitmap;
  t.mock.method(
    globalThis,
    'createImageBitmap',
    () =>
      new Promise((resolve) => {
        resolveBitmap = resolve;
      })
  );
  const rec = await getSliderRecognizer();
  const rejected = assert.rejects(rec.detect({}), /识别超时/);
  t.mock.timers.tick(30000);
  await rejected;
  const bitmap = { width: 600, height: 300, close: t.mock.fn() };
  resolveBitmap(bitmap);
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(bitmap.close.mock.callCount(), 1);
  assert.equal(workers[0].messages.length, 1);
});
