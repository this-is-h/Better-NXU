import test from 'node:test';
import assert from 'node:assert/strict';
import { installCnkiSlider } from '../src/sites/cnki/reader/slide-verification.js';

// 模拟控件上的监听器与向祖先冒泡；直接发给 document 不会经过 handle/track。
function fixture(
  listenerTarget,
  {
    limit = 260,
    scale = 1,
    pointer = false,
    blockedAt = limit,
    fractional = false,
    supportsPointer = true,
    completeOnMove = null,
    travel = 260,
  } = {}
) {
  const frames = new Map();
  let frameId = 0;
  let now = 0;
  let pressed = false;
  let startX = 0;
  let offset = 0;
  let completed = 0;
  let reachedEnd = false;
  let visible = true;
  let ready = true;
  const seen = [];
  const emitted = [];
  const node = (parent) => {
    const listeners = new Map();
    return {
      detach() {
        parent = null;
      },
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
        this.timeStamp = now;
        if (fractional) this.clientX = Math.floor(this.clientX);
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
  if (supportsPointer) view.PointerEvent = view.MouseEvent;
  const doc = { ...node(), defaultView: view, documentElement: {} };
  const track = {
    ...node(doc),
    getBoundingClientRect: () => ({ left: 10, width: (travel + 40) * scale }),
  };
  const handle = {
    ...node(track),
    ownerDocument: doc,
    isConnected: true,
    closest: () => track,
    classList: { contains: () => ready },
    getClientRects: () => (visible ? [{}] : []),
    getBoundingClientRect: () => ({ left: 10 + offset * scale, top: 20, width: 40 * scale, height: 30 }),
  };
  doc.querySelector = () => (handle.isConnected ? handle : null);
  const dispatch = handle.dispatchEvent;
  handle.dispatchEvent = (event) => {
    emitted.push(event);
    dispatch(event);
  };
  handle.addEventListener(pointer ? 'pointerdown' : 'mousedown', (event) => {
    pressed = true;
    startX = event.clientX;
  });
  const target = { handle, track, document: doc }[listenerTarget];
  target.addEventListener(pointer ? 'pointermove' : 'mousemove', (event) => {
    seen.push(event.type);
    if (pressed) {
      const distance = event.clientX - startX;
      // 组件只有在越过端点时才完成限位；仅移动到端点坐标不足以触发。
      reachedEnd = distance > limit;
      offset = Math.max(0, Math.min(blockedAt, distance));
      if (completeOnMove && reachedEnd && !completed) {
        completed++;
        if (completeOnMove === 'hidden') visible = false;
        if (completeOnMove === 'class') ready = false;
        if (completeOnMove === 'removed') {
          handle.isConnected = false;
          handle.detach();
        }
      }
    }
  });
  target.addEventListener(pointer ? 'pointerup' : 'mouseup', (event) => {
    seen.push(event.type);
    if (!completeOnMove && pressed && reachedEnd && offset === limit) completed++;
    pressed = false;
  });
  target.addEventListener('pointercancel', () => {
    pressed = false;
  });
  return {
    doc,
    handle,
    seen,
    emitted,
    state: () => ({ pressed, offset }),
    completed: () => completed,
    moveMouse() {
      handle.dispatchEvent(
        new view.MouseEvent(pointer ? 'pointermove' : 'mousemove', {
          bubbles: true,
          clientX: 500,
          buttons: 0,
        })
      );
    },
    frame(elapsed = 32) {
      now += elapsed;
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
    for (let i = 0; i < 120; i++) {
      f.frame();
      t.mock.timers.tick(32);
    }
    await flush();
    assert.ok(Math.abs(f.state().offset - 260) < 1e-10, target);
    assert.equal(f.state().pressed, false, target);
    assert.equal(f.completed(), 1, target);
    assert.ok(f.seen.includes('mousemove'), target);
    assert.equal(f.seen.at(-1), 'mouseup', target);
    const offset = f.state().offset;
    f.moveMouse();
    assert.equal(f.state().offset, offset, 'unpressed mouse movement must not drag the handle');
    assert.deepEqual(errors, []);
    stop();
  }
});

test('CNKI feedback reaches fractional, bordered, scaled and pointer-only endpoints', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  t.mock.method(Math, 'random', () => 0.5);
  for (const options of [
    { fractional: true },
    { limit: 262 },
    { limit: 264 },
    { scale: 1.5 },
    { scale: 0.75, pointer: true },
    { pointer: true },
    { supportsPointer: false },
  ]) {
    const f = fixture('track', options);
    const errors = [];
    const stop = installCnkiSlider({ doc: f.doc, onError: (error) => errors.push(error.message) });
    f.frame();
    await flush();
    for (let i = 0; i < 140; i++) {
      f.frame();
      t.mock.timers.tick(32);
    }
    await flush();
    assert.deepEqual(errors, [], JSON.stringify(options));
    assert.equal(f.completed(), 1, JSON.stringify(options));
    assert.equal(f.state().pressed, false);
    const offset = f.state().offset;
    f.moveMouse();
    assert.equal(f.state().offset, offset);
    stop();
  }
});

test('CNKI sends paired pointer/mouse events and can cancel during delayed mouse release', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const f = fixture('track');
  const stop = installCnkiSlider({ doc: f.doc });
  f.frame();
  await flush();
  for (let i = 0; i < 120 && !f.emitted.some((event) => event.type === 'pointerup'); i++) {
    t.mock.timers.tick(32);
    f.frame();
  }
  assert.deepEqual(
    f.emitted.slice(0, 2).map((event) => event.type),
    ['pointerdown', 'mousedown']
  );
  assert.equal(f.emitted.at(-1).type, 'pointerup');
  assert.equal(f.state().pressed, true, 'mouseup is delayed after pointerup');
  const moves = f.emitted.filter((event) => event.type.endsWith('move'));
  for (let i = 0; i < moves.length; i += 2) {
    assert.equal(moves[i].type, 'pointermove');
    assert.equal(moves[i + 1].type, 'mousemove');
    assert.equal(moves[i].clientX, moves[i + 1].clientX);
    assert.equal(moves[i].pointerType, 'touch');
    assert.equal(moves[i].buttons, 1);
    assert.ok(moves[i].screenX > 0);
  }
  stop();
  await flush();
  assert.deepEqual(f.state(), { pressed: false, offset: 0 });
  const count = f.emitted.length;
  t.mock.timers.tick(10000);
  f.frame();
  assert.equal(f.emitted.length, count);
  assert.equal(f.completed(), 0);
});

test('a slider stuck before the endpoint fails and releases without submitting', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const f = fixture('track', { blockedAt: 120, pointer: true });
  const errors = [];
  const stop = installCnkiSlider({ doc: f.doc, onError: (error) => errors.push(error.message) });
  f.frame();
  await flush();
  for (let i = 0; i < 120; i++) {
    f.frame();
    t.mock.timers.tick(32);
  }
  await flush();
  assert.equal(errors.length, 1);
  assert.match(errors[0], /未到达末端/);
  assert.equal(f.completed(), 0);
  assert.deepEqual(f.state(), { pressed: false, offset: 0 });
  stop();
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

test('CNKI success during movement retires the control without warning or dragging back', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  for (const completeOnMove of ['hidden', 'removed', 'class']) {
    for (const pointer of [false, true]) {
      const f = fixture('document', { completeOnMove, pointer });
      const errors = [];
      const stop = installCnkiSlider({ doc: f.doc, onError: (error) => errors.push(error.message) });
      f.frame();
      await flush();
      for (let i = 0; i < 150; i++) {
        f.frame();
        t.mock.timers.tick(32);
      }
      await flush();
      assert.deepEqual(errors, [], `${completeOnMove}, pointer=${pointer}`);
      assert.equal(f.completed(), 1);
      assert.deepEqual(f.state(), { pressed: false, offset: 260 });
      assert.equal(
        f.emitted.some((event) => event.type === 'pointercancel'),
        false
      );
      assert.equal(f.emitted.at(-1).type, 'mouseup');
      const count = f.emitted.length;
      t.mock.timers.tick(10000);
      f.frame();
      assert.equal(f.emitted.length, count);
      stop();
    }
  }
});

test('CNKI finishes the last ten percent promptly while preserving endpoint verification', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  t.mock.method(Math, 'random', () => 0.5);
  for (const travel of [60, 120, 260, 520]) {
    const f = fixture('track', { travel, limit: travel });
    const errors = [];
    const stop = installCnkiSlider({ doc: f.doc, onError: (error) => errors.push(error.message) });
    f.frame(16);
    await flush();
    for (let i = 0; i < 310 && f.state().pressed; i++) {
      f.frame(16);
      t.mock.timers.tick(16);
    }
    await flush();
    assert.deepEqual(errors, [], `travel=${travel}`);
    assert.equal(f.completed(), 1, `travel=${travel}`);
    assert.equal(f.state().offset, travel);
    const start = f.emitted.find((event) => event.type === 'mousedown');
    const tail = f.emitted.find(
      (event) => event.type === 'mousemove' && event.clientX - start.clientX >= travel * 0.9
    );
    const end = f.emitted.at(-1);
    assert.equal(end.type, 'mouseup');
    assert.ok(
      end.timeStamp - tail.timeStamp <= 500,
      `last 10% took ${end.timeStamp - tail.timeStamp}ms for ${travel}px`
    );
    stop();
  }
});
