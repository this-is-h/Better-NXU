import test from 'node:test';
import assert from 'node:assert/strict';
import { dragIdsSlider } from '../src/sites/ids/auth/slider-drag.js';

function world() {
  const events = [];
  let progress = 0;
  let startX;
  let submissions = 0;
  class MouseEvent {
    constructor(type, fields) {
      this.type = type;
      Object.assign(this, fields);
    }
  }
  const doc = {
    defaultView: { MouseEvent },
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
  return { slider, doc, events, progress: () => progress, submissions: () => submissions };
}

test('drag ends at the requested distance and resolves after mouseup', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const w = world();
  const pending = dragIdsSlider(w.slider, 123);
  for (let i = 0; i < 48; i++) t.mock.timers.tick(40);
  await pending;
  assert.equal(w.events[0].type, 'mousedown');
  assert.equal(w.events.at(-1).type, 'mouseup');
  assert.equal(w.events.at(-1).buttons, 0);
  assert.equal(w.events.filter((e) => e.type === 'mousemove').length, 48);
  assert.equal(w.progress(), 123);
  assert.equal(w.submissions(), 1);
  assert.ok(w.events.some((e) => e.clientY > w.events[0].clientY));
});

test('abort releases at origin, sends no late movement and never submits', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const w = world();
  const controller = new AbortController();
  const rejected = assert.rejects(dragIdsSlider(w.slider, 100, { signal: controller.signal }), /pagehide/);
  t.mock.timers.tick(40);
  controller.abort(new Error('pagehide'));
  await rejected;
  const count = w.events.length;
  t.mock.timers.tick(10000);
  assert.equal(w.events.length, count);
  assert.equal(w.events.at(-1).clientX, w.events[0].clientX);
  assert.equal(w.submissions(), 0);
});

test('timeout and detached elements stop the pending drag', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const timeout = world();
  const rejected = assert.rejects(dragIdsSlider(timeout.slider, 100, { timeoutMs: 10 }), /超时/);
  t.mock.timers.tick(10);
  await rejected;
  assert.equal(timeout.submissions(), 0);
  const removed = world();
  const detached = assert.rejects(dragIdsSlider(removed.slider, 100), /已移除/);
  removed.slider.isConnected = false;
  t.mock.timers.tick(40);
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
  t.mock.timers.tick(40);
  await rejected;
  t.mock.timers.tick(10000);
  assert.equal(w.events.length, 1);
});
