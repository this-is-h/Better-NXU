import test from 'node:test';
import assert from 'node:assert/strict';
import { installCnkiSlider } from '../src/sites/cnki/reader/slide-verification.js';

// 模拟控件上的监听器与向祖先冒泡；直接发给 document 不会经过 handle/track。
function fixture(listenerTarget) {
  const frames = new Map();
  let frameId = 0;
  let now = 0;
  let pressed = false;
  let startX = 0;
  let offset = 0;
  const seen = [];
  const node = (parent) => {
    const listeners = new Map();
    return {
      addEventListener(type, callback) {
        listeners.set(type, callback);
      },
      removeEventListener(type) {
        listeners.delete(type);
      },
      dispatchEvent(event) {
        listeners.get(event.type)?.(event);
        if (event.bubbles) parent?.dispatchEvent(event);
      },
    };
  };
  const view = {
    ...node(),
    performance: { now: () => now },
    MouseEvent: class {
      constructor(type, fields) {
        this.type = type;
        Object.assign(this, fields);
      }
    },
    MutationObserver: class {
      observe() {}
      disconnect() {}
    },
    requestAnimationFrame(callback) {
      frames.set(++frameId, callback);
      return frameId;
    },
    cancelAnimationFrame(id) {
      frames.delete(id);
    },
  };
  const doc = { ...node(), defaultView: view, documentElement: {} };
  const track = {
    ...node(doc),
    getBoundingClientRect: () => ({ left: 10, width: 300 }),
  };
  const handle = {
    ...node(track),
    ownerDocument: doc,
    isConnected: true,
    closest: () => track,
    classList: { contains: () => true },
    getClientRects: () => [{}],
    getBoundingClientRect: () => ({ left: 10 + offset, top: 20, width: 40, height: 30 }),
  };
  doc.querySelector = () => handle;
  handle.addEventListener('mousedown', (event) => {
    pressed = true;
    startX = event.clientX;
  });
  const target = { handle, track, document: doc }[listenerTarget];
  target.addEventListener('mousemove', (event) => {
    seen.push(event.type);
    if (pressed) offset = event.clientX - startX;
  });
  target.addEventListener('mouseup', (event) => {
    seen.push(event.type);
    pressed = false;
  });
  return {
    doc,
    handle,
    seen,
    state: () => ({ pressed, offset }),
    moveMouse() {
      handle.dispatchEvent(new view.MouseEvent('mousemove', { bubbles: true, clientX: 500, buttons: 0 }));
    },
    frame() {
      now += 32;
      const ready = [...frames.values()];
      frames.clear();
      ready.forEach((callback) => callback(now));
    },
  };
}

const flush = async () => {
  for (let i = 0; i < 8; i++) await Promise.resolve();
};

test('CNKI moves and releases listeners on the handle, wrapper and document', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  for (const target of ['handle', 'track', 'document']) {
    const f = fixture(target);
    const errors = [];
    const stop = installCnkiSlider({ doc: f.doc, onError: (error) => errors.push(error) });
    f.frame();
    await flush();
    for (let i = 0; i < 30; i++) f.frame();
    await flush();
    assert.ok(Math.abs(f.state().offset - 260) < 1e-10, target);
    assert.equal(f.state().pressed, false, target);
    assert.ok(f.seen.includes('mousemove'), target);
    assert.equal(f.seen.at(-1), 'mouseup', target);
    const offset = f.state().offset;
    f.moveMouse();
    assert.equal(f.state().offset, offset, 'unpressed mouse movement must not drag the handle');
    assert.deepEqual(errors, []);
    stop();
  }
});

test('CNKI cancellation and timeout release wrapper listeners at the origin', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  for (const reason of ['cancel', 'timeout']) {
    const f = fixture('track');
    const errors = [];
    const stop = installCnkiSlider({ doc: f.doc, onError: (error) => errors.push(error) });
    f.frame();
    await flush();
    f.frame();
    assert.equal(f.state().pressed, true);
    assert.ok(f.state().offset > 0);
    if (reason === 'cancel') stop();
    else t.mock.timers.tick(5000);
    await flush();
    assert.deepEqual(f.state(), { pressed: false, offset: 0 });
    f.moveMouse();
    f.frame();
    assert.deepEqual(f.state(), { pressed: false, offset: 0 });
    assert.equal(errors.length, reason === 'timeout' ? 1 : 0);
    stop();
  }
});
