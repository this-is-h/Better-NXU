import test from 'node:test';
import assert from 'node:assert/strict';
import { installCourseFrameResize } from '../src/sites/jwgl/components/course-table/course-frame.js';

function createFrame() {
  const pageWindow = new EventTarget();
  const iframe = new EventTarget();
  const table = { scrollHeight: 600 };
  const frameDocument = { querySelector: () => table };
  iframe.ownerDocument = { defaultView: pageWindow };
  iframe.contentWindow = { document: frameDocument };
  iframe.style = { height: '480px' };
  const message = (source = iframe.contentWindow) => {
    const event = new Event('message');
    Object.assign(event, { source, data: { type: 'COURSE_BEAUTIFY_CHANGED' } });
    pageWindow.dispatchEvent(event);
  };
  return { iframe, pageWindow, table, frameDocument, message };
}

test('course iframe keeps its height until the table loads and handles later reloads', () => {
  const { iframe, frameDocument, table } = createFrame();
  frameDocument.querySelector = () => null;
  const cleanup = installCourseFrameResize(iframe);
  try {
    assert.equal(iframe.style.height, '480px');
    frameDocument.querySelector = () => table;
    iframe.dispatchEvent(new Event('load'));
    assert.equal(iframe.style.height, '700px');
    table.scrollHeight = 920;
    iframe.dispatchEvent(new Event('load'));
    assert.equal(iframe.style.height, '1020px');
  } finally {
    cleanup();
  }
});

test('course iframe accepts only its own resize messages and tolerates cross-origin redirects', () => {
  const { iframe, table, message, frameDocument } = createFrame();
  const cleanup = installCourseFrameResize(iframe);
  try {
    table.scrollHeight = 800;
    message({});
    assert.equal(iframe.style.height, '700px');
    message();
    assert.equal(iframe.style.height, '900px');
    Object.defineProperty(iframe.contentWindow, 'document', {
      configurable: true,
      get: () => {
        throw new DOMException('Cross-origin frame', 'SecurityError');
      },
    });
    iframe.dispatchEvent(new Event('load'));
    message();
    assert.equal(iframe.style.height, '900px');
    Object.defineProperty(iframe.contentWindow, 'document', { value: frameDocument });
    table.scrollHeight = 500;
    iframe.dispatchEvent(new Event('load'));
    assert.equal(iframe.style.height, '600px');
  } finally {
    cleanup();
  }
});

test('course iframe installs once and cleans up on final page exit while preserving BFCache', () => {
  const { iframe, pageWindow, table, message } = createFrame();
  const cleanup = installCourseFrameResize(iframe);
  assert.equal(installCourseFrameResize(iframe), cleanup);
  const cachedExit = new Event('pagehide');
  Object.assign(cachedExit, { persisted: true });
  pageWindow.dispatchEvent(cachedExit);
  table.scrollHeight = 900;
  message();
  assert.equal(iframe.style.height, '1000px');

  pageWindow.dispatchEvent(new Event('pagehide'));
  table.scrollHeight = 1100;
  iframe.dispatchEvent(new Event('load'));
  message();
  assert.equal(iframe.style.height, '1000px');
  const reinstalledCleanup = installCourseFrameResize(iframe);
  assert.notEqual(reinstalledCleanup, cleanup);
  assert.equal(iframe.style.height, '1200px');
  reinstalledCleanup();
});
