import test from 'node:test';
import assert from 'node:assert/strict';
import { dragIdsSlider } from '../src/sites/ids/auth/slider-drag.js';

function world() {
  const events = [];
  let progress = 0;
  let startX;
  let submissions = 0;
  let now = 0;
  let frameId = 0;
  const frames = new Map();
  class MouseEvent {
    constructor(type, fields) {
      this.type = type;
      Object.assign(this, fields);
      this.timeStamp = now;
    }
  }
  const doc = {
    defaultView: {
      MouseEvent,
      performance: { now: () => now },
      requestAnimationFrame(callback) {
        frames.set(++frameId, callback);
        return frameId;
      },
      cancelAnimationFrame(id) {
        frames.delete(id);
      },
    },
    dispatchEvent(event) {
      events.push(event);
      if (event.type === 'mousemove') progress = event.clientX - startX;
      if (event.type === 'mouseup' && event.clientX !== startX) submissions++;
    },
  };
  const slider = {
    ownerDocument: doc,
    isConnected: true,
    closest: () => ({ getBoundingClientRect: () => ({ width: 278 }) }),
    getClientRects: () => [{}],
    getBoundingClientRect: () => ({ left: 20, top: 40, width: 40, height: 30 }),
    dispatchEvent(event) {
      events.push(event);
      startX = event.clientX;
    },
  };
  return {
    slider,
    doc,
    events,
    progress: () => progress,
    submissions: () => submissions,
    pendingFrames: () => frames.size,
    frame(elapsed) {
      now += elapsed;
      const ready = [...frames.values()];
      frames.clear();
      for (const callback of ready) callback(now);
    },
  };
}

test('drag ends at the requested distance and resolves after mouseup', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const w = world();
  const pending = dragIdsSlider(w.slider, 123);
  for (let i = 0; i < 50; i++) w.frame(16);
  await pending;
  assert.equal(w.events[0].type, 'mousedown');
  assert.equal(w.events.at(-1).type, 'mouseup');
  assert.equal(w.events.at(-1).buttons, 0);
  const moves = w.events.filter((e) => e.type === 'mousemove');
  assert.ok(moves.length >= 10 && moves.length < 30);
  assert.ok(Math.abs(w.progress() - 123) < 1e-10);
  assert.equal(w.submissions(), 1);
  assert.ok(w.events.some((e) => Math.abs(e.clientY - w.events[0].clientY) > 0.5));
  assert.ok(w.events.at(-1).timeStamp >= 420 && w.events.at(-1).timeStamp <= 716);
  assert.equal(w.pendingFrames(), 0);
  const lengths = moves.map((event, i) => event.clientX - (moves[i - 1] ?? w.events[0]).clientX);
  assert.ok(lengths[Math.floor(lengths.length / 2)] > lengths[0]);
  assert.ok(lengths[Math.floor(lengths.length / 2)] > lengths.at(-1));
});

test('abort releases at origin, sends no late movement and never submits', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const w = world();
  const controller = new AbortController();
  const rejected = assert.rejects(dragIdsSlider(w.slider, 100, { signal: controller.signal }), /pagehide/);
  w.frame(32);
  controller.abort(new Error('pagehide'));
  await rejected;
  const count = w.events.length;
  t.mock.timers.tick(10000);
  w.frame(10000);
  assert.equal(w.events.length, count);
  assert.equal(w.events.at(-1).clientX, w.events[0].clientX);
  assert.equal(w.submissions(), 0);
  assert.equal(w.pendingFrames(), 0);
});

test('timeout and detached elements stop the pending drag', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const timeout = world();
  const rejected = assert.rejects(dragIdsSlider(timeout.slider, 100, { timeoutMs: 10 }), /超时/);
  t.mock.timers.tick(10);
  await rejected;
  assert.equal(timeout.submissions(), 0);
  assert.equal(timeout.pendingFrames(), 0);
  const removed = world();
  const detached = assert.rejects(dragIdsSlider(removed.slider, 100), /已移除/);
  removed.slider.isConnected = false;
  removed.frame(32);
  await detached;
  assert.equal(removed.submissions(), 0);
});

test('invalid or cancelled drags never press the slider', async () => {
  const w = world();
  for (const distance of [0, -1, NaN, Infinity, 239]) {
    await assert.rejects(dragIdsSlider(w.slider, distance), /有效范围/);
  }
  const controller = new AbortController();
  controller.abort(new Error('cancelled'));
  await assert.rejects(dragIdsSlider(w.slider, 100, { signal: controller.signal }), /cancelled/);
  assert.equal(w.events.length, 0);
});

test('event dispatch failures reject instead of leaving the drag running', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const w = world();
  w.doc.dispatchEvent = () => {
    throw new Error('DOM changed');
  };
  const rejected = assert.rejects(dragIdsSlider(w.slider, 100), /DOM changed/);
  w.frame(32);
  await rejected;
  t.mock.timers.tick(10000);
  assert.equal(w.events.length, 1);
  assert.equal(w.pendingFrames(), 0);
});

test('drag duration follows distance and elapsed time instead of accumulating callback delays', async (t) => {
  t.mock.method(Math, 'random', () => 0.5);
  const short = world();
  const long = world();
  const done = Promise.all([dragIdsSlider(short.slider, 60), dragIdsSlider(long.slider, 220)]);
  for (let i = 0; i < 10; i++) {
    short.frame(80);
    long.frame(80);
  }
  await done;
  assert.equal(short.events.at(-1).timeStamp, 480);
  assert.equal(long.events.at(-1).timeStamp, 720);
  assert.ok(Math.abs(short.progress() - 60) < 1e-10);
  assert.ok(Math.abs(long.progress() - 220) < 1e-10);
});

test('high refresh rates do not emit points the school would drop for being under 20ms', async () => {
  const w = world();
  const pending = dragIdsSlider(w.slider, 160);
  for (let i = 0; i < 100; i++) w.frame(8);
  await pending;
  const moves = w.events.filter((e) => e.type === 'mousemove');
  for (let i = 1; i < moves.length - 1; i++) {
    assert.ok(moves[i].timeStamp - moves[i - 1].timeStamp >= 20);
  }
  assert.ok(moves.length < 30);
  assert.equal(w.submissions(), 1);
});

test('hidden slider cancels a pending animation without submitting', async () => {
  const w = world();
  const rejected = assert.rejects(dragIdsSlider(w.slider, 100), /隐藏/);
  w.slider.getClientRects = () => [];
  w.frame(32);
  await rejected;
  assert.equal(w.submissions(), 0);
  assert.equal(w.pendingFrames(), 0);
});
