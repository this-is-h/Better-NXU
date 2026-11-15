import test from 'node:test';
import assert from 'node:assert/strict';
import { searchTeachers } from '../src/sites/webvpn/components/tools/teacher-search.js';

const originalXhr = globalThis.XMLHttpRequest;

function mockRequest(t, { status = 0, events = ['loadend'], throwsAt } = {}) {
  t.after(() => (globalThis.XMLHttpRequest = originalXhr));
  globalThis.XMLHttpRequest = class extends EventTarget {
    DONE = 4;
    status = 0;
    open() {
      if (throwsAt === 'open') throw new Error('fixture internal open error');
    }
    setRequestHeader() {}
    send() {
      if (throwsAt === 'send') throw new Error('fixture internal send error');
      this.readyState = this.DONE;
      this.status = status;
      this.dispatchEvent(new Event('readystatechange'));
      events.forEach((event) => this.dispatchEvent(new Event(event)));
    }
  };
}

test('status zero produces an actionable network message instead of a raw HTTP status', async (t) => {
  mockRequest(t);
  await assert.rejects(searchTeachers('测试'), (error) => {
    assert.match(error.message, /网络|连接/);
    assert.match(error.message, /重试/);
    assert.doesNotMatch(error.message, /status|Network error|fixture|\b0\b/);
    return true;
  });
});

test('network error after status zero stays user friendly', async (t) => {
  mockRequest(t, { events: ['error', 'loadend'] });
  await assert.rejects(searchTeachers('测试'), /网络.*重试/);
});

test('status zero does not hide the later timeout or cancellation event', async (t) => {
  mockRequest(t, { events: ['timeout', 'loadend'] });
  await assert.rejects(searchTeachers('测试'), /超时.*重试/);
  mockRequest(t, { events: ['abort', 'loadend'] });
  await assert.rejects(searchTeachers('测试'), { name: 'AbortError' });
});

test('HTTP failures distinguish login, rate limiting and temporary service problems', async (t) => {
  for (const [status, message] of [
    [401, /WebVPN/],
    [403, /WebVPN/],
    [429, /过于频繁/],
    [404, /稍后重试/],
    [503, /暂时不可用/],
  ]) {
    mockRequest(t, { status });
    await assert.rejects(searchTeachers('测试'), (error) => {
      assert.match(error.message, message);
      assert.doesNotMatch(error.message, /Request failed|status|\b\d{3}\b/);
      return true;
    });
  }
});

test('request setup and send exceptions retain diagnostics without exposing technical text', async (t) => {
  for (const throwsAt of ['open', 'send']) {
    mockRequest(t, { throwsAt });
    await assert.rejects(searchTeachers('测试'), (error) => {
      assert.match(error.message, /刷新页面后重试/);
      assert.doesNotMatch(error.message, /fixture/);
      assert.match(error.cause.message, /fixture/);
      return true;
    });
  }
});
