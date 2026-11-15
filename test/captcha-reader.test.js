import test from 'node:test';
import assert from 'node:assert/strict';
import { toast as ding } from '@yusufceng1z/ding';

let scenario;
let logger;
let terminated;
document.head = {};
document[globalThis.__MONKEY_WINDOW_KEY__] = {
  GM_getResourceText: () => 'fixture runtime',
  GM_addElement: () => ({ remove() {} }),
  unsafeWindow: {
    Tesseract: {
      async createWorker(_language, _oem, options) {
        logger = options.logger;
        logger({ status: 'loading language traineddata', progress: '0.25' });
        logger({ status: 'initializing api', progress: 1 });
        return {
          async recognize() {
            logger({ status: 'recognizing text', progress: 0.6 });
            logger({ status: 'unknown', progress: 0.7 });
            logger({ status: 'recognizing text', progress: 'invalid' });
            logger({ status: 'recognizing text', progress: 1 });
            if (scenario === 'error') throw new Error('fixture recognition error');
            return { data: { text: scenario === 'empty' ? ' ' : ' 0123\n' } };
          },
          async terminate() {
            terminated++;
          },
        };
      },
    },
  },
};
const { readJwglCaptcha } = await import('../src/sites/jwgl/components/login/captcha-reader.js');

function setup(t, outcome = 'success') {
  scenario = outcome;
  terminated = 0;
  globalThis.location = { href: 'https://jwgl.nxu.edu.cn/' };
  t.after(() => delete globalThis.location);
  const show = t.mock.method(ding, 'show', () => 'fixture-ocr');
  const update = t.mock.method(ding, 'update', () => {});
  const dismiss = t.mock.method(ding, 'dismiss', () => {});
  return { show, update, dismiss };
}

test('OCR updates fractional native progress on one toast and ignores unknown or invalid events', async (t) => {
  const f = setup(t);
  assert.equal(await readJwglCaptcha(), '0123');
  assert.equal(f.show.mock.calls.length, 1);
  assert.equal(f.show.mock.calls[0].arguments[0], 'loading');
  assert.deepEqual(
    f.update.mock.calls.map((call) => call.arguments),
    [
      ['fixture-ocr', { title: '加载OCR语言训练数据', progress: 0.25, meta: '25%' }],
      ['fixture-ocr', { title: '初始化OCR接口', progress: 1, meta: '100%' }],
      ['fixture-ocr', { title: '识别验证码', progress: 0.6, meta: '60%' }],
      ['fixture-ocr', { title: '识别验证码', progress: 1, meta: '100%' }],
    ]
  );
  assert.equal(terminated, 1);
  assert.deepEqual(f.dismiss.mock.calls[0].arguments, ['fixture-ocr']);
  logger({ status: 'recognizing text', progress: 0.8 });
  assert.equal(f.update.mock.calls.length, 4);
});

test('caller-owned OCR toast stays available for the login result transition', async (t) => {
  const f = setup(t);
  await readJwglCaptcha('login-progress');
  assert.equal(f.show.mock.calls.length, 0);
  assert.equal(f.dismiss.mock.calls.length, 0);
  assert.ok(f.update.mock.calls.every((call) => call.arguments[0] === 'login-progress'));
  assert.equal(terminated, 1);
});

test('OCR errors and empty results clean up owned progress and terminate the worker', async (t) => {
  const f = setup(t, 'error');
  await assert.rejects(readJwglCaptcha(), /fixture recognition error/);
  scenario = 'empty';
  await assert.rejects(readJwglCaptcha(), { code: 'OCR_EMPTY_RESULT' });
  assert.equal(f.dismiss.mock.calls.length, 2);
  assert.equal(terminated, 2);
});
