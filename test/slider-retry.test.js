import test from 'node:test';
import assert from 'node:assert/strict';
import { runSliderAttempts, readSliderFrame, isSameSliderFrame } from '../src/sites/ids/auth/slider-retry.js';

const originalDocument = globalThis.document;
let world;

function canvas(color = 1) {
  return {
    width: 278,
    height: 155,
    color,
    painted: true,
    getContext() {
      return {
        getImageData: () => ({ data: new Uint8ClampedArray([this.color, 0, 0, this.painted ? 255 : 0]) }),
      };
    },
  };
}

test.beforeEach((t) => {
  t.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  world = {
    visible: true,
    success: false,
    source: 'first',
    bg: canvas(),
    piece: canvas(),
    slider: { style: {} },
    sourceImages: true,
  };
  globalThis.document = {
    querySelectorAll: () => [world.bg, world.piece],
    querySelector(selector) {
      if (selector === '#sliderDiv, #sliderCaptchaDiv, #captcha-id')
        return world.visible ? { offsetParent: {}, innerHTML: '<canvas></canvas>' } : null;
      if (selector === '#sliderDiv > .sliderContainer_success') return world.success ? {} : null;
      if (selector.includes('sliderMask')) return world.slider;
      if (selector === '#slider-img1' || selector === '#slider-img2')
        return world.sourceImages ? { getAttribute: () => world.source } : null;
      return null;
    },
  };
});
test.afterEach(() => {
  globalThis.document = originalDocument;
});

async function advance(t, milliseconds) {
  for (let elapsed = 0; elapsed < milliseconds; elapsed += 200) {
    t.mock.timers.tick(200);
    await new Promise((resolve) => setImmediate(resolve));
  }
}

function refresh({ delay = 0 } = {}) {
  world.source += '-new';
  world.bg.painted = world.piece.painted = false;
  const draw = () => {
    world.bg.color++;
    world.piece.color++;
    world.bg.painted = world.piece.painted = true;
  };
  if (delay) setTimeout(draw, delay);
  else draw();
}

test('failed challenges refresh twice, wait for painting, then succeed on the third attempt', async (t) => {
  const attempts = [];
  const retries = [];
  const result = runSliderAttempts(
    async (frame, count) => {
      attempts.push({ count, source: frame.source, time: Date.now() });
      if (count < 3) setTimeout(() => refresh({ delay: 1600 }), 1000);
      else world.success = true;
      return 'submitted';
    },
    { onRetry: (count) => retries.push(count) }
  );
  await advance(t, 8000);
  assert.equal(await result, 'submitted');
  assert.deepEqual(
    attempts.map(({ count }) => count),
    [1, 2, 3]
  );
  assert.deepEqual(retries, [2, 3]);
  assert.equal(new Set(attempts.map(({ source }) => source)).size, 3);
  assert.ok(attempts[1].time - attempts[0].time >= 3000);
});

test('three failed challenges stop without a fourth attempt', async (t) => {
  let attempts = 0;
  const result = runSliderAttempts(async () => {
    attempts++;
    refresh();
    return 'submitted';
  });
  await advance(t, 4000);
  assert.equal(await result, 'exhausted');
  assert.equal(attempts, 3);
});

test('slow response without image refresh never causes a duplicate drag', async (t) => {
  let attempts = 0;
  let settled = false;
  const result = runSliderAttempts(async () => {
    attempts++;
    return 'submitted';
  });
  void result.then(() => {
    settled = true;
  });
  await advance(t, 60000);
  assert.equal(attempts, 1);
  assert.equal(settled, false);
  world.success = true;
  await advance(t, 200);
  assert.equal(await result, 'submitted');
  assert.equal(attempts, 1);
});

test('success marker wins over simultaneous source changes', async (t) => {
  let attempts = 0;
  const result = runSliderAttempts(async () => {
    attempts++;
    refresh();
    world.success = true;
    return 'submitted';
  });
  await advance(t, 1000);
  assert.equal(await result, 'submitted');
  assert.equal(attempts, 1);
});

test('canvas-only challenges retry on pixel changes, never on CSS movement', async (t) => {
  world.sourceImages = false;
  let attempts = 0;
  const result = runSliderAttempts(async () => {
    attempts++;
    if (attempts === 2) world.success = true;
    return 'submitted';
  });
  await advance(t, 1000);
  world.slider.style.left = '140px';
  await advance(t, 2000);
  assert.equal(attempts, 1);
  world.bg.color++;
  await advance(t, 1000);
  assert.equal(await result, 'submitted');
  assert.equal(attempts, 2);
});

test('replacement canvas nodes are read for the retry', async (t) => {
  const seen = [];
  const result = runSliderAttempts(async (frame) => {
    seen.push(frame.bgImg);
    if (seen.length === 1) {
      world.bg = canvas(2);
      world.piece = canvas(2);
      world.slider = {};
    } else world.success = true;
    return 'submitted';
  });
  await advance(t, 2000);
  assert.equal(await result, 'submitted');
  assert.equal(seen.length, 2);
  assert.notEqual(seen[0], seen[1]);
});

test('waits for both canvases, rejects blank-image timeout and does not drag', async (t) => {
  world.bg.painted = world.piece.painted = false;
  let attempts = 0;
  const result = runSliderAttempts(async () => {
    attempts++;
    return 'manual';
  });
  const rejected = assert.rejects(result, /图片加载超时/);
  await advance(t, 8000);
  await rejected;
  assert.equal(attempts, 0);
});

test('page exit aborts pending refresh monitoring', async (t) => {
  const controller = new AbortController();
  let attempts = 0;
  const result = runSliderAttempts(
    async () => {
      attempts++;
      return 'submitted';
    },
    { signal: controller.signal }
  );
  const rejected = assert.rejects(result, /pagehide/);
  await advance(t, 1000);
  controller.abort(new Error('pagehide'));
  await rejected;
  refresh();
  await advance(t, 2000);
  assert.equal(attempts, 1);
});

test('closing the challenge ends monitoring without retrying', async (t) => {
  let attempts = 0;
  const result = runSliderAttempts(async () => {
    attempts++;
    return 'submitted';
  });
  await advance(t, 1000);
  world.visible = false;
  await advance(t, 200);
  assert.equal(await result, 'submitted');
  assert.equal(attempts, 1);
});

test('manual fallback is immediate and completed challenges are not retried', async (t) => {
  const result = runSliderAttempts(async () => 'manual');
  await advance(t, 1000);
  assert.equal(await result, 'manual');
  world.success = true;
  assert.equal(await runSliderAttempts(() => assert.fail('must not drag a completed challenge')), 'closed');
});

test('closing the dialog during inference stops without waiting for a new frame', async (t) => {
  const result = runSliderAttempts(async () => 'closed');
  await advance(t, 1000);
  assert.equal(await result, 'closed');
});

test('frames detect changes during inference and discard the old result', async (t) => {
  const original = readSliderFrame();
  assert.equal(isSameSliderFrame(original, readSliderFrame()), true);
  refresh();
  assert.equal(isSameSliderFrame(original, readSliderFrame()), false);
  let attempts = 0;
  const result = runSliderAttempts(async () => {
    attempts++;
    if (attempts === 1) {
      refresh();
      return 'refreshed';
    }
    world.success = true;
    return 'submitted';
  });
  await advance(t, 2000);
  assert.equal(await result, 'submitted');
  assert.equal(attempts, 2);
});
