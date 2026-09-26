import test from 'node:test';
import assert from 'node:assert/strict';
import { installCnkiSlider } from '../src/sites/cnki/reader/slide-verification.js';

function fixture() {
  const listeners = new Map();
  const frames = new Map();
  let frameId = 0;
  let changed;
  let handle = null;
  let disconnected = false;
  const events = {
    addEventListener(type, callback) {
      listeners.set(type, callback);
    },
    removeEventListener(type) {
      listeners.delete(type);
    },
  };
  const view = {
    ...events,
    requestAnimationFrame(callback) {
      frames.set(++frameId, callback);
      return frameId;
    },
    cancelAnimationFrame(id) {
      frames.delete(id);
    },
    MutationObserver: class {
      constructor(callback) {
        changed = callback;
      }
      observe() {}
      disconnect() {
        disconnected = true;
      }
    },
  };
  const doc = { ...events, defaultView: view, documentElement: {}, querySelector: () => handle };
  return {
    doc,
    frames,
    listeners,
    disconnected: () => disconnected,
    changed: () => changed(),
    frame() {
      const callbacks = [...frames.values()];
      frames.clear();
      callbacks.forEach((fn) => fn());
    },
    insert({ left = 12, visible = true, ready = true } = {}) {
      const track = {
        offsetWidth: 302,
        clientWidth: 300,
        clientLeft: 1,
        getBoundingClientRect: () => ({ left: 10, width: 604 }),
      };
      handle = {
        closest: () => track,
        getClientRects: () => (visible ? [{}] : []),
        getBoundingClientRect: () => ({ left, width: 80 }),
        classList: { contains: () => ready },
      };
      changed?.();
      return handle;
    },
    fire(type, event = {}) {
      listeners.get(type)?.(event);
    },
  };
}

const flush = async () => {
  for (let i = 0; i < 8; i++) await Promise.resolve();
};

test('CNKI observes late controls, uses full scaled travel and never resubmits the same control', async () => {
  const f = fixture();
  const calls = [];
  const options = { doc: f.doc, drag: async (value) => calls.push(value) };
  const stop = installCnkiSlider(options);
  assert.equal(installCnkiSlider(options), stop);
  f.frame();
  assert.equal(calls.length, 0);
  const handle = f.insert();
  f.frame();
  await flush();
  assert.equal(calls.length, 1);
  assert.equal(calls[0].handle, handle);
  assert.equal(calls[0].distance, 520);
  assert.equal(calls[0].eventTarget, f.doc);
  for (let i = 0; i < 5; i++) {
    f.changed();
    f.frame();
    await flush();
  }
  assert.equal(calls.length, 1);
  stop();
});

test('CNKI limits replacements to three attempts and skips hidden, completed or moved handles', async () => {
  const f = fixture();
  let count = 0;
  const stop = installCnkiSlider({ doc: f.doc, drag: async () => count++ });
  for (const options of [{ visible: false }, { ready: false }, { left: 45 }]) {
    f.insert(options);
    f.frame();
    await flush();
  }
  assert.equal(count, 0);
  for (let i = 0; i < 6; i++) {
    f.insert();
    f.frame();
    await flush();
  }
  assert.equal(count, 3);
  assert.equal(f.frames.size, 0);
  stop();
});

test('CNKI manual takeover cancels active drag and cleans up without reporting failure', async () => {
  const f = fixture();
  let signal;
  const errors = [];
  installCnkiSlider({
    doc: f.doc,
    drag: (options) => {
      signal = options.signal;
      return new Promise((_resolve, reject) => signal.addEventListener('abort', () => reject(signal.reason)));
    },
    onError: (error) => errors.push(error),
  });
  const target = f.insert();
  f.frame();
  await flush();
  f.fire('mousedown', { isTrusted: false, target });
  assert.equal(signal.aborted, false);
  f.fire('mousedown', { isTrusted: true, target });
  await flush();
  assert.equal(signal.aborted, true);
  assert.equal(f.disconnected(), true);
  assert.equal(f.listeners.size, 0);
  assert.equal(f.frames.size, 0);
  assert.deepEqual(errors, []);
});

test('CNKI failed drags preserve manual fallback and page exit removes listeners', async () => {
  const f = fixture();
  const errors = [];
  installCnkiSlider({
    doc: f.doc,
    drag: async () => {
      throw new Error('fixture');
    },
    onError: (error) => errors.push(error),
  });
  f.insert();
  f.frame();
  await flush();
  assert.equal(errors.length, 1);
  f.fire('pagehide', { persisted: false });
  assert.equal(f.listeners.size, 0);
  assert.equal(f.frames.size, 0);
});
