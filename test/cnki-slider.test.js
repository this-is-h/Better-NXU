import test from 'node:test';
import assert from 'node:assert/strict';
import { installCnkiSlider } from '../src/sites/cnki/reader/slide-verification.js';

function fixture() {
  const listeners = new Map();
  const frames = new Map();
  let frameId = 0;
  let changed;
  let handle = null;
  let position = 12;
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
      position = left;
      const track = {
        offsetWidth: 302,
        clientWidth: 300,
        clientLeft: 1,
        getBoundingClientRect: () => ({ left: 10, width: 604 }),
      };
      handle = {
        isConnected: true,
        closest: () => track,
        getClientRects: () => (visible ? [{}] : []),
        getBoundingClientRect: () => ({ left: position, width: 80 }),
        classList: { contains: () => ready },
      };
      changed?.();
      return handle;
    },
    move(left) {
      position = left;
      changed();
    },
    fire(type, event = {}) {
      listeners.get(type)?.(event);
    },
  };
}

const flush = async () => {
  for (let i = 0; i < 8; i++) await Promise.resolve();
};

test('CNKI observes late controls, uses full scaled travel and does not resubmit unchanged controls', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
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
  assert.equal(calls[0].eventTarget, handle);
  assert.equal(calls[0].feedback, true);
  t.mock.timers.tick(1000);
  for (let i = 0; i < 5; i++) {
    f.changed();
    f.frame();
    await flush();
  }
  assert.equal(calls.length, 1);
  stop();
});

test('CNKI limits replacements to three attempts and skips hidden, completed or moved handles', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const f = fixture();
  let count = 0;
  const stop = installCnkiSlider({ doc: f.doc, drag: async () => count++ });
  for (const options of [{ visible: false }, { ready: false }, { left: 45 }]) {
    f.insert(options);
    f.frame();
    await flush();
    t.mock.timers.tick(1000);
  }
  assert.equal(count, 0);
  for (let i = 0; i < 6; i++) {
    f.insert();
    f.frame();
    await flush();
    t.mock.timers.tick(1000);
  }
  assert.equal(count, 3);
  assert.equal(f.frames.size, 0);
  stop();
});

test('CNKI retries a reused node only after movement, reset and cooldown, at most three times', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const f = fixture();
  let count = 0;
  const stop = installCnkiSlider({
    doc: f.doc,
    drag: async () => {
      count++;
      f.move(532);
    },
  });
  f.insert();
  for (let attempt = 1; attempt <= 3; attempt++) {
    f.frame();
    await flush();
    assert.equal(count, attempt);
    f.move(12);
    f.frame();
    await flush();
    assert.equal(count, attempt, 'a reset does not bypass the cooldown');
    t.mock.timers.tick(1000);
  }
  f.frame();
  await flush();
  assert.equal(count, 3);
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
  f.fire('pointerdown', { isTrusted: false, target });
  assert.equal(signal.aborted, false);
  f.fire('pointerdown', { isTrusted: true, target });
  await flush();
  assert.equal(signal.aborted, true);
  assert.equal(f.disconnected(), true);
  assert.equal(f.listeners.size, 0);
  assert.equal(f.frames.size, 0);
  assert.deepEqual(errors, []);
});

test('CNKI cancels in the background and permits a fresh attempt when visible again', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const f = fixture();
  const signals = [];
  const stop = installCnkiSlider({
    doc: f.doc,
    drag: ({ signal }) => {
      signals.push(signal);
      return new Promise((_resolve, reject) => signal.addEventListener('abort', () => reject(signal.reason)));
    },
  });
  f.insert();
  f.frame();
  await flush();
  f.doc.hidden = true;
  f.fire('visibilitychange');
  await flush();
  assert.equal(signals[0].aborted, true);
  t.mock.timers.tick(1000);
  f.frame();
  await flush();
  assert.equal(signals.length, 1);
  f.doc.hidden = false;
  f.fire('visibilitychange');
  f.frame();
  await flush();
  assert.equal(signals.length, 2);
  stop();
  await flush();
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

test('CNKI suppresses late errors for a retired challenge without hiding active failures', async () => {
  for (const retired of ['hidden', 'completed', 'replaced']) {
    const f = fixture();
    const errors = [];
    let rejectDrag;
    const stop = installCnkiSlider({
      doc: f.doc,
      drag: () =>
        new Promise((_resolve, reject) => {
          rejectDrag = reject;
        }),
      onError: (error) => errors.push(error),
    });
    const handle = f.insert();
    f.frame();
    await flush();
    if (retired === 'hidden') handle.getClientRects = () => [];
    if (retired === 'completed') handle.classList.contains = () => false;
    if (retired === 'replaced') f.insert();
    rejectDrag(new Error('late drag error'));
    await flush();
    assert.deepEqual(errors, [], retired);
    stop();
  }
});
