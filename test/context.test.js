import test from 'node:test';
import assert from 'node:assert/strict';
import { initContext, getContext, _resetContextForTest } from '../src/context.js';

test('context accepts the exact JWGL IP across ports and rejects lookalike hosts', (t) => {
  const originalLocation = globalThis.location;
  t.after(() => {
    globalThis.location = originalLocation;
    _resetContextForTest();
  });
  for (const port of ['', ':80', ':8080', ':8081', ':8082', ':8083']) {
    globalThis.location = new URL(`http://202.201.128.234${port}/index.action`);
    _resetContextForTest();
    assert.equal(initContext().isJwglIp, true);
  }
  for (const host of ['202.201.128.234.example.com', 'prefix202.201.128.234.example.com']) {
    globalThis.location = new URL(`https://${host}/index.action`);
    _resetContextForTest();
    assert.equal(initContext().isJwglIp, false);
  }
});

test('context remains a startup snapshot until explicitly reset for tests', (t) => {
  const originalLocation = globalThis.location;
  t.after(() => {
    globalThis.location = originalLocation;
    _resetContextForTest();
  });
  _resetContextForTest();
  assert.throws(getContext, /尚未初始化/);
  globalThis.location = new URL('https://portal.nxu.edu.cn/index.html#/hall');
  const snapshot = initContext();
  globalThis.location = new URL('https://portal.nxu.edu.cn/another');
  assert.equal(initContext(), snapshot);
  assert.equal(getContext().path, '/index.html');
});
