import test from 'node:test';
import assert from 'node:assert/strict';
const calls = [];
const pageWindow = {
  Tesseract: {
    createWorker: async (...args) => {
      calls.push(args);
      return { terminate() {} };
    },
  },
};
document.head = {};
document[globalThis.__MONKEY_WINDOW_KEY__] = {
  unsafeWindow: pageWindow,
  GM_getResourceText: () => 'fixture runtime',
  GM_addElement: () => ({ remove() {} }),
};
const { createOcrWorker } = await import('../src/libraries/tesseract.js');

test('OCR keeps worker and core on v7 and lets the runtime select SIMD support', async () => {
  await createOcrWorker();
  const [language, oem, options] = calls[0];
  assert.equal(language, 'eng');
  assert.equal(oem, 1);
  assert.equal(options.workerPath, 'https://unpkg.com/tesseract.js@7.0.0/dist/worker.min.js');
  assert.equal(options.corePath, 'https://unpkg.com/tesseract.js-core@7.0.0');
  assert.equal(options.langPath, 'https://unpkg.com/@tesseract.js-data/eng@1.0.0/4.0.0_best_int');
  await createOcrWorker('eng', 1, { corePath: 'https://fixture.example/core/', logger: () => {} });
  assert.equal(calls[1][2].corePath, 'https://fixture.example/core/');
  assert.equal(typeof calls[1][2].logger, 'function');
});
