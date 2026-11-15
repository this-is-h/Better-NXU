import test, { beforeEach } from 'node:test';
import assert from 'node:assert/strict';

document.createElement = () => ({});
const { effectScope } = await import('vue');
const { useTeacherSearch } = await import('../src/sites/webvpn/components/tools/use-teacher-search.js');
const { searchTeachers } = await import('../src/sites/webvpn/components/tools/teacher-search.js');

beforeEach((t) => t.mock.timers.enable({ apis: ['setTimeout', 'Date'], now: 0 }));

function createSearch(t, request) {
  const scope = effectScope();
  t.after(() => scope.stop());
  return scope.run(() => useTeacherSearch(request));
}

async function advance(t, milliseconds) {
  t.mock.timers.tick(milliseconds);
  for (let i = 0; i < 6; i++) await Promise.resolve();
}

async function completeBatch(t, task) {
  await advance(t, 0);
  for (let i = 0; i < 15; i++) await advance(t, 200);
  await task;
}

function pageResult(page, totalPages = 10, count = 10) {
  return {
    success: true,
    page: [page, totalPages],
    data: Array.from({ length: count }, (_, index) => ({
      name: `测试教师${page}-${index}`,
      number: `test-${page}-${index}`,
      unit: '测试单位',
    })),
  };
}

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}

test('search prefetches exactly one extra batch then waits for scrolling', async (t) => {
  const calls = [];
  const search = createSearch(t, async (name, page) => {
    calls.push([name, page]);
    return pageResult(page);
  });

  await completeBatch(t, search.search(' 王 '));
  assert.deepEqual(calls, [
    ['王', 1],
    ['王', 2],
    ['王', 3],
    ['王', 4],
    ['王', 5],
    ['王', 6],
  ]);
  assert.equal(search.teachers.value.length, 60);
  assert.equal(search.loading.value, false);
  assert.equal(search.finished.value, false);

  await completeBatch(t, search.loadMore());
  assert.deepEqual(calls.slice(6), [
    ['王', 7],
    ['王', 8],
    ['王', 9],
  ]);
  assert.equal(search.teachers.value.length, 90);
});

test('tiny API pages cannot cause more than three requests per batch', async (t) => {
  const calls = [];
  const search = createSearch(t, async (_, page) => {
    calls.push(page);
    return pageResult(page, 100, 1);
  });
  await completeBatch(t, search.search('马'));
  assert.deepEqual(calls, [1, 2, 3, 4, 5, 6]);
  assert.equal(search.teachers.value.length, 6);
  assert.equal(search.finished.value, false);
});

test('a larger API page is kept intact without requesting another page', async (t) => {
  const calls = [];
  const search = createSearch(t, async (_, page) => {
    calls.push(page);
    return pageResult(page, 10, 50);
  });
  await completeBatch(t, search.search('马'));
  assert.deepEqual(calls, [1, 2]);
  assert.equal(search.teachers.value.length, 100);
});

test('the last page finishes the list and subsequent loads do nothing', async (t) => {
  const calls = [];
  const search = createSearch(t, async (_, page) => {
    calls.push(page);
    return pageResult(page, 2, page === 2 ? 1 : 10);
  });
  await completeBatch(t, search.search('测试'));
  await search.loadMore();
  assert.deepEqual(calls, [1, 2]);
  assert.equal(search.teachers.value.length, 11);
  assert.equal(search.finished.value, true);
});

test('an empty first page finishes without an error or another request', async (t) => {
  const search = createSearch(t, async () => pageResult(1, 0, 0));
  await completeBatch(t, search.search('测试'));
  assert.deepEqual(search.teachers.value, []);
  assert.equal(search.finished.value, true);
  assert.equal(search.error.value, '');
});

test('empty API responses normalize zero and one based page labels to the requested page', async (t) => {
  const originalParser = globalThis.DOMParser;
  const originalXhr = globalThis.XMLHttpRequest;
  t.after(() => {
    globalThis.DOMParser = originalParser;
    globalThis.XMLHttpRequest = originalXhr;
  });
  let pageLabel;
  function element(nodeName, children) {
    return {
      nodeType: 1,
      nodeName,
      attributes: [],
      hasChildNodes: () => children.length > 0,
      childNodes: { length: children.length, item: (index) => children[index] },
    };
  }
  globalThis.DOMParser = class {
    parseFromString() {
      const text = { nodeType: 3, nodeName: '#text', nodeValue: pageLabel, hasChildNodes: () => false };
      return {
        querySelector: () => null,
        documentElement: element('root', [element('page', [text])]),
      };
    }
  };
  globalThis.XMLHttpRequest = class extends EventTarget {
    DONE = 4;
    open() {}
    setRequestHeader() {}
    send() {
      this.readyState = this.DONE;
      this.status = 200;
      this.responseText = 'empty-result-fixture';
      this.dispatchEvent(new Event('readystatechange'));
    }
  };
  for (pageLabel of ['第0/0页', '第1/0页']) {
    assert.deepEqual(await searchTeachers('测试', 1), { success: true, page: [1, 0], data: [] });
  }
});

test('concurrent load events share the pending batch without duplicate requests', async (t) => {
  const pending = deferred();
  const calls = [];
  const search = createSearch(t, async (_, page) => {
    calls.push(page);
    return pending.promise;
  });
  const first = search.search('测试');
  assert.equal(search.loading.value, true);
  await Promise.all([search.loadMore(), search.loadMore()]);
  assert.deepEqual(calls, [1]);
  pending.resolve(pageResult(1, 1));
  await first;
  assert.equal(search.loading.value, false);
});

test('each completed page appears before the rest of the batch finishes', async (t) => {
  const pending = deferred();
  const secondStarted = deferred();
  const search = createSearch(t, async (_, page) => {
    if (page === 1) return pageResult(1);
    secondStarted.resolve();
    return pending.promise;
  });
  const first = search.search('测试');
  await advance(t, 0);
  await advance(t, 200);
  await secondStarted.promise;
  assert.equal(search.teachers.value.length, 10);
  assert.equal(search.loading.value, true);
  pending.resolve(pageResult(2, 2));
  await first;
  assert.equal(search.teachers.value.length, 20);
});

test('a failed batch keeps completed pages and retry resumes at the failed page', async (t) => {
  const calls = [];
  let fail = true;
  const search = createSearch(t, async (_, page) => {
    calls.push(page);
    if (page === 2 && fail) throw new Error('教师查询请求超时');
    return pageResult(page, 4);
  });
  await completeBatch(t, search.search('测试'));
  assert.deepEqual(calls, [1, 2]);
  assert.equal(search.teachers.value.length, 10);
  assert.equal(search.error.value, '教师查询请求超时');
  assert.equal(search.loading.value, false);
  assert.equal(search.finished.value, false);

  fail = false;
  await completeBatch(t, search.retry());
  assert.deepEqual(calls, [1, 2, 2, 3, 4]);
  assert.equal(search.teachers.value.length, 40);
  assert.equal(search.error.value, '');
  assert.equal(search.finished.value, true);
});

test('server failures are shown without consuming the requested page', async (t) => {
  const calls = [];
  const search = createSearch(t, async (_, page) => {
    calls.push(page);
    return { success: false, msg: 'webvpn登录已过期' };
  });
  await completeBatch(t, search.search('测试'));
  await search.loadMore();
  assert.deepEqual(calls, [1]);
  await completeBatch(t, search.retry());
  assert.deepEqual(calls, [1, 1]);
  assert.equal(search.error.value, 'webvpn登录已过期');
  assert.equal(search.finished.value, false);
});

test('invalid pagination and data never append results or advance the cursor', async (t) => {
  const cases = [
    { ...pageResult(1), data: null },
    pageResult(2),
    pageResult(1, Number.MAX_SAFE_INTEGER + 1),
    pageResult(1, 1.5),
    pageResult(1, 0, 10),
    pageResult(1, 2, 0),
    { ...pageResult(1), page: null },
  ];
  for (const response of cases) {
    const calls = [];
    const search = createSearch(t, async (_, page) => {
      calls.push(page);
      return response;
    });
    await completeBatch(t, search.search('测试'));
    await completeBatch(t, search.retry());
    assert.deepEqual(calls, [1, 1]);
    assert.deepEqual(search.teachers.value, []);
    assert.match(search.error.value, /异常/);
    assert.equal(search.finished.value, false);
  }
});

test('a new query aborts the old batch and ignores its late response', async (t) => {
  const old = deferred();
  let oldSignal;
  const search = createSearch(t, async (name, page, { signal }) => {
    if (name === '旧') {
      oldSignal = signal;
      return old.promise;
    }
    return pageResult(page, 1, 1);
  });
  const first = search.search('旧');
  await completeBatch(t, search.search('新'));
  assert.equal(oldSignal.aborted, true);
  old.resolve(pageResult(1));
  await first;
  assert.equal(search.teachers.value.length, 1);
  assert.equal(search.finished.value, true);
  assert.equal(search.error.value, '');
});

test('a late error or finally from an old query cannot clear the new loading state', async (t) => {
  const old = deferred();
  const current = deferred();
  const search = createSearch(t, (name) => (name === '旧' ? old.promise : current.promise));
  const first = search.search('旧');
  const second = search.search('新');
  old.reject(new Error('旧查询失败'));
  await first;
  assert.equal(search.loading.value, true);
  assert.equal(search.error.value, '');
  current.resolve(pageResult(1, 1, 1));
  await completeBatch(t, second);
  assert.equal(search.loading.value, false);
});

test('clearing the query cancels pending work and resets results and errors', async (t) => {
  const pending = deferred();
  let signal;
  const search = createSearch(t, (_, __, options) => {
    signal = options.signal;
    return pending.promise;
  });
  const first = search.search('测试');
  await search.search('   ');
  assert.equal(signal.aborted, true);
  assert.deepEqual(search.teachers.value, []);
  assert.equal(search.loading.value, false);
  assert.equal(search.finished.value, true);
  pending.resolve(pageResult(1));
  await first;
  assert.deepEqual(search.teachers.value, []);
});

test('disposing the search scope aborts pending work and ignores late responses', async () => {
  const scope = effectScope();
  const pending = deferred();
  let signal;
  const search = scope.run(() =>
    useTeacherSearch((_, __, options) => {
      signal = options.signal;
      return pending.promise;
    })
  );
  const first = search.search('测试');
  scope.stop();
  assert.equal(signal.aborted, true);
  pending.resolve(pageResult(1));
  await first;
  assert.deepEqual(search.teachers.value, []);
  assert.equal(search.loading.value, false);
});

test('valid 636-page responses load in bounded batches instead of failing at page 100', async (t) => {
  const calls = [];
  const search = createSearch(t, async (_, page) => {
    calls.push(page);
    return pageResult(page, 636);
  });
  await completeBatch(t, search.search('测试'));
  assert.deepEqual(calls, [1, 2, 3, 4, 5, 6]);
  assert.equal(search.teachers.value.length, 60);
  assert.equal(search.error.value, '');
  assert.equal(search.finished.value, false);
  await completeBatch(t, search.loadMore());
  assert.deepEqual(calls, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('scroll batches delay at the boundary, use short page gaps and reject repeated scroll events', async (t) => {
  const starts = [];
  const search = createSearch(t, async (_, page) => {
    starts.push([page, Date.now()]);
    return pageResult(page, 636);
  });
  await completeBatch(t, search.search('测试'));
  assert.equal(starts[1][1] - starts[0][1], 200);
  assert.equal(starts[2][1] - starts[1][1], 200);
  assert.equal(starts[3][1] - starts[2][1], 1000);
  const next = search.loadMore();
  assert.equal(search.loading.value, true);
  assert.equal(starts.length, 6);
  await Promise.all([search.loadMore(), search.loadMore()]);
  await advance(t, 999);
  assert.equal(starts.length, 6);
  await advance(t, 1);
  assert.equal(starts.length, 7);
  await completeBatch(t, next);
  assert.deepEqual(
    starts.map(([page]) => page),
    [1, 2, 3, 4, 5, 6, 7, 8, 9]
  );
  assert.equal(starts[7][1] - starts[6][1], 200);
  assert.equal(starts[8][1] - starts[7][1], 200);
});

test('cancelling a delayed batch clears its timer and prevents further scroll requests', async (t) => {
  const calls = [];
  const search = createSearch(t, async (_, page) => {
    calls.push(page);
    return pageResult(page);
  });
  await completeBatch(t, search.search('测试'));
  const next = search.loadMore();
  search.cancel();
  await advance(t, 10000);
  await next;
  await search.loadMore();
  assert.deepEqual(calls, [1, 2, 3, 4, 5, 6]);
  assert.equal(search.loading.value, false);
  assert.equal(search.cancelled.value, true);
  assert.equal(search.teachers.value.length, 60);
  await completeBatch(t, search.search('新'));
  assert.equal(search.cancelled.value, false);
  assert.equal(search.teachers.value.length, 60);
});

test('a new search cannot bypass request spacing or send an old delayed page', async (t) => {
  const calls = [];
  const search = createSearch(t, async (name, page) => {
    calls.push([name, page, Date.now()]);
    return pageResult(page, name === '旧' ? 2 : 1);
  });
  const first = search.search('旧');
  await advance(t, 0);
  const next = search.search('新');
  assert.deepEqual(calls, [['旧', 1, 0]]);
  await advance(t, 999);
  assert.equal(calls.length, 1);
  await advance(t, 1);
  await next;
  await first;
  await advance(t, 5000);
  assert.deepEqual(calls, [
    ['旧', 1, 0],
    ['新', 1, 1000],
  ]);
});

test('cancelling an error keeps results and blocks both scrolling and stale retries until a new search', async (t) => {
  const calls = [];
  const search = createSearch(t, async (name, page) => {
    calls.push([name, page]);
    if (name === '旧' && page === 2) throw new Error('Network error');
    return pageResult(page, name === '旧' ? 2 : 1);
  });
  await completeBatch(t, search.search('旧'));
  search.cancel();
  await search.loadMore();
  await search.retry();
  await advance(t, 10000);
  assert.deepEqual(calls, [
    ['旧', 1],
    ['旧', 2],
  ]);
  assert.equal(search.teachers.value.length, 10);
  assert.equal(search.cancelled.value, true);
  await completeBatch(t, search.search('新'));
  assert.equal(search.teachers.value.length, 10);
  assert.equal(search.cancelled.value, false);
  assert.deepEqual(calls.at(-1), ['新', 1]);
});

test('the initial 30 results appear quickly and prefetch still waits one second', async (t) => {
  const starts = [];
  const search = createSearch(t, async (_, page) => {
    starts.push([page, Date.now()]);
    return pageResult(page, 636);
  });
  const pending = search.search('测试');
  await advance(t, 0);
  await advance(t, 200);
  await advance(t, 200);
  assert.equal(search.teachers.value.length, 30);
  assert.equal(search.loading.value, true);
  await advance(t, 999);
  assert.equal(starts.length, 3);
  await advance(t, 1);
  assert.deepEqual(starts[3], [4, 1400]);
  await completeBatch(t, pending);
  await advance(t, 10000);
  assert.deepEqual(
    starts.map(([page]) => page),
    [1, 2, 3, 4, 5, 6]
  );
  assert.equal(search.teachers.value.length, 60);
});

test('a new search cancels the queued prefetch without requesting its old pages', async (t) => {
  const calls = [];
  const search = createSearch(t, async (name, page) => {
    calls.push([name, page]);
    return pageResult(page, name === '旧' ? 636 : 1);
  });
  const old = search.search('旧');
  await advance(t, 0);
  await advance(t, 200);
  await advance(t, 200);
  const current = search.search('新');
  await completeBatch(t, current);
  await old;
  await advance(t, 10000);
  assert.deepEqual(calls, [
    ['旧', 1],
    ['旧', 2],
    ['旧', 3],
    ['新', 1],
  ]);
  assert.equal(search.teachers.value.length, 10);
});

test('prefetch failure pauses the query and retry resumes only the failed batch', async (t) => {
  const calls = [];
  let fail = true;
  const search = createSearch(t, async (_, page) => {
    calls.push(page);
    if (page === 4 && fail) throw new Error('教师查询服务暂时不可用，请稍后重试');
    return pageResult(page, 636);
  });
  await completeBatch(t, search.search('测试'));
  await advance(t, 10000);
  assert.deepEqual(calls, [1, 2, 3, 4]);
  assert.equal(search.teachers.value.length, 30);
  assert.match(search.error.value, /稍后重试/);
  fail = false;
  await completeBatch(t, search.retry());
  await advance(t, 10000);
  assert.deepEqual(calls, [1, 2, 3, 4, 4, 5, 6]);
  assert.equal(search.teachers.value.length, 60);
});
