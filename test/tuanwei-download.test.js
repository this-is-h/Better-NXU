import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { isTuanweiDownloadRoute } from '../src/utils/route-guards.js';

let download;
let xhr;
Object.defineProperty(document, '__monkeyWindow-node-test', {
  configurable: true,
  value: {
    GM_download: (options) => download(options),
    GM: { xmlHttpRequest: (options) => xhr(options) },
  },
});
const { autoDownloadAttachment, normalizeCaptcha } =
  await import('../src/sites/tuanwei/components/auto-download.js');
const { attachmentName, fetchAttachment, saveAttachment } =
  await import('../src/sites/tuanwei/components/attachment.js');
const { createLocalOcrWorker, fetchOcrAsset } = await import('../src/libraries/tesseract-local.js');
const URL_BASE =
  'https://tuanwei.nxu.edu.cn/system/_content/download.jsp?urltype=news.DownloadAttachUrl&owner=123&wbfileid=456';
const tick = () => new Promise((resolve) => setImmediate(resolve));
function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}
class Element {
  value = '';
  isConnected = true;
  disabled = false;
  events = new Map();
  addEventListener(type, fn) {
    this.events.set(type, [...(this.events.get(type) || []), fn]);
  }
  removeEventListener(type, fn) {
    this.events.set(
      type,
      (this.events.get(type) || []).filter((value) => value !== fn)
    );
  }
  emit(type, event = {}) {
    let stopped = false;
    event.preventDefault ??= () => {};
    event.stopImmediatePropagation = () => {
      stopped = true;
    };
    for (const fn of this.events.get(type) || []) {
      fn(event);
      if (stopped) break;
    }
    return stopped;
  }
  dispatchEvent(event) {
    this.emit(event.type, event);
  }
}
function fixture(overrides = {}) {
  const input = new Element();
  const button = new Element();
  const image = Object.assign(new Element(), {
    complete: true,
    naturalWidth: 100,
    naturalHeight: 42,
    src: 'https://tuanwei.nxu.edu.cn/system/resource/js/filedownload/createimage.jsp?randnum=1',
  });
  const calls = { clicks: 0, native: 0, requests: [], saves: 0, closed: 0, disposed: 0, recognized: 0 };
  button.click = () => {
    if (button.disabled) return;
    calls.clicks++;
    if (!button.emit('click')) calls.native++;
  };
  const doc = {
    querySelector: (selector) =>
      selector === '#codeValue' ? input : selector === '#codeimg' ? image : button,
    createElement: () => ({ getContext: () => ({ drawImage() {} }) }),
  };
  const page = Object.assign(new Element(), { location: { href: URL_BASE }, Event });
  const worker = {
    recognize: async () => {
      calls.recognized++;
      return { data: { text: ' 0123\n' } };
    },
    dispose: () => calls.disposed++,
  };
  const options = {
    doc,
    page,
    autoClose: true,
    createWorker: async () => worker,
    request: async (url) => {
      calls.requests.push(url);
      return { name: 'fixture.txt', blob: new Blob(['fixture']) };
    },
    save: async () => {
      calls.saves++;
    },
    close: () => calls.closed++,
    ...overrides,
  };
  return { input, button, image, worker, page, calls, options, run: () => autoDownloadAttachment(options) };
}

test('only canonical direct attachment URLs are accepted', () => {
  assert.equal(isTuanweiDownloadRoute({ url: URL_BASE }), true);
  for (const url of [
    undefined,
    URL_BASE.replace('tuanwei.nxu.edu.cn', 'tuanwei.nxu.edu.cn.example'),
    URL_BASE.replace('https:', 'ftp:'),
    URL_BASE.replace('download.jsp', 'download.jsp/other'),
    URL_BASE + '&owner=789',
    URL_BASE.replace('owner=123', 'owner='),
    URL_BASE.replace('news.DownloadAttachUrl', 'other'),
    'https://tuanwei.nxu.edu.cn/info/1001/123.htm',
    URL_BASE.replace('tuanwei.nxu.edu.cn', 'webvpn.nxu.edu.cn/https/unknown'),
    URL_BASE.replace(
      'tuanwei.nxu.edu.cn',
      'webvpn.nxu.edu.cn/https/77726476706e69737468656265737421e0f853d22e3e7d44300d8db9d6562d'
    ),
  ])
    assert.equal(isTuanweiDownloadRoute({ url }), false, url);
});

test('OCR accepts exactly four digits without guessing letters', () => {
  assert.equal(normalizeCaptcha(' 0 1 2 3\n'), '0123');
  for (const text of ['', '123', '12345', 'I234', '12.34']) assert.equal(normalizeCaptcha(text), null);
});

test('click submits once and closes only after the download callback resolves', async () => {
  const saved = deferred();
  const f = fixture({ save: () => saved.promise });
  const task = f.run();
  await tick();
  assert.equal(f.input.value, '0123');
  assert.equal(f.calls.clicks, 1);
  assert.equal(f.calls.native, 0);
  assert.equal(new URL(f.calls.requests[0]).searchParams.get('codeValue'), '0123');
  assert.equal(f.calls.closed, 0);
  assert.equal(f.button.disabled, true);
  saved.resolve();
  assert.equal(await task, 'downloaded');
  assert.equal(f.calls.closed, 1);
  assert.equal(f.calls.disposed, 1);
  assert.equal(f.button.disabled, false);
  f.button.click();
  assert.equal(f.calls.native, 1);
});

test('close setting off leaves a successfully downloaded page open', async () => {
  const f = fixture({ autoClose: false });
  assert.equal(await f.run(), 'downloaded');
  assert.equal(f.calls.closed, 0);
});

test('rejected CAPTCHA retries new images at most three times', async () => {
  let requests = 0;
  const f = fixture({
    request: async () => {
      requests++;
      return null;
    },
  });
  const oldSource = f.image.src;
  await assert.rejects(f.run(), /手动输入/);
  assert.equal(requests, 3);
  assert.equal(f.calls.recognized, 3);
  assert.notEqual(f.image.src, oldSource);
  assert.equal(f.calls.closed, 0);
  assert.equal(f.calls.saves, 0);
  assert.equal(f.calls.disposed, 1);
});

test('invalid OCR output never submits and exhausts the bounded retry budget', async () => {
  const f = fixture();
  f.worker.recognize = async () => ({ data: { text: '12345' } });
  await assert.rejects(f.run(), /手动输入/);
  assert.equal(f.calls.clicks, 0);
});

test('download/network failures preserve the page and restore native controls', async () => {
  for (const stage of ['request', 'save', 'createWorker']) {
    const f = fixture({
      [stage]: async () => {
        throw new Error('offline');
      },
    });
    await assert.rejects(f.run(), /offline/);
    assert.equal(f.calls.closed, 0);
    assert.equal(f.button.disabled, false);
    f.button.click();
    assert.equal(f.calls.native, 1);
  }
});

test('existing input, changed image, manual input and pagehide stop automation', async () => {
  const existing = fixture();
  existing.input.value = '9876';
  assert.equal(await existing.run(), 'manual');
  assert.equal(existing.calls.recognized, 0);
  for (const event of ['image-change', 'input', 'pagehide']) {
    const result = deferred();
    const f = fixture();
    f.worker.recognize = () => result.promise;
    const task = f.run();
    await tick();
    if (event === 'image-change') f.image.src += '2';
    if (event === 'input') {
      f.input.value = '9876';
      f.input.emit('input', { isTrusted: true });
    }
    if (event === 'pagehide') f.page.emit('pagehide');
    result.resolve({ data: { text: '0123' } });
    assert.equal(await task, 'manual');
    assert.equal(f.calls.clicks, 0);
    assert.equal(f.calls.disposed, 1);
  }
});

test('late download completion after navigation cannot close a different page', async () => {
  const saved = deferred();
  const f = fixture({ save: () => saved.promise });
  const task = f.run();
  await tick();
  f.page.emit('pagehide');
  assert.equal(await task, 'manual');
  saved.resolve();
  await tick();
  assert.equal(f.calls.closed, 0);
});

test('attachment headers reject error pages and safely decode filenames', async () => {
  const response = (type, disposition, status = 200) =>
    new Response('fixture', {
      status,
      headers: {
        'content-type': type,
        'content-disposition': disposition,
      },
    });
  assert.equal(attachmentName(response('text/html', 'attachment; filename=error.html')), null);
  assert.equal(attachmentName(response('application/pdf', 'inline; filename=file.pdf')), null);
  assert.equal(attachmentName(response('application/pdf', 'attachment; filename=file.pdf', 500)), null);
  assert.equal(
    attachmentName(response('application/pdf', "attachment; filename*=UTF-8''%E9%99%84%E4%BB%B6.pdf")),
    '附件.pdf'
  );
  assert.equal(
    attachmentName(response('application/pdf', 'attachment; filename="../file.pdf"')),
    '_file.pdf'
  );
  const signal = new AbortController().signal;
  assert.equal(await fetchAttachment(URL_BASE, signal, async () => response('text/html', '')), null);
  await assert.rejects(
    fetchAttachment(URL_BASE, signal, async () => response('text/html', '', 500)),
    /有效附件/
  );
  const file = await fetchAttachment(URL_BASE, signal, async (_url, init) => {
    assert.equal(init.credentials, 'same-origin');
    assert.equal(init.redirect, 'error');
    return response('application/octet-stream', 'attachment; filename=fixture.txt');
  });
  assert.equal(await file.blob.text(), 'fixture');
});

test('ScriptCat download uses data URL and waits for onload, failures and aborts reject', async () => {
  globalThis.FileReader = class {
    readAsDataURL() {
      this.result = 'data:text/plain;base64,Zml4dHVyZQ==';
      this.onload();
    }
    abort() {}
  };
  for (const event of ['onload', 'onerror', 'ontimeout', 'abort']) {
    let details;
    let aborted = 0;
    download = (options) => {
      details = options;
      return {
        abort() {
          aborted++;
        },
      };
    };
    const controller = new AbortController();
    let complete = false;
    const task = saveAttachment({ name: 'fixture.txt', blob: new Blob(['fixture']) }, controller.signal);
    task.then(
      () => {
        complete = true;
      },
      () => {}
    );
    await tick();
    assert.equal(complete, false);
    assert.equal(details.downloadMode, 'browser');
    assert.equal(details.saveAs, false);
    assert.match(details.url, /^data:/);
    if (event === 'abort') controller.abort();
    else details[event]();
    if (event === 'onload') await task;
    else await assert.rejects(task);
    if (event === 'abort') assert.equal(aborted, 1);
  }
});

test('OCR assets require matching digest and use anonymous background requests', async () => {
  const bytes = new TextEncoder().encode('fixture').buffer;
  const asset = {
    url: 'https://unpkg.com/fixture',
    sha384: createHash('sha384').update(new Uint8Array(bytes)).digest('base64'),
  };
  xhr = (options) => {
    assert.equal(options.anonymous, true);
    assert.equal(options.responseType, 'arraybuffer');
    return Promise.resolve({ status: 200, response: bytes });
  };
  const signal = new AbortController().signal;
  assert.equal(await fetchOcrAsset(asset, signal), bytes);
  await assert.rejects(fetchOcrAsset({ ...asset, sha384: 'wrong' }, signal), /完整性/);
  xhr = () => Promise.resolve({ status: 200, response: '<html>error</html>' });
  await assert.rejects(fetchOcrAsset(asset, signal), /下载失败/);
});

test('CSP OCR session releases Blob URLs and terminates late workers on cancellation', async () => {
  for (const cancelEarly of [false, true]) {
    const pending = deferred();
    const controller = new AbortController();
    const revoked = [];
    let count = 0;
    let terminated = 0;
    const worker = {
      setParameters: async () => {},
      recognize: async () => 'recognized',
      terminate: async () => {
        terminated++;
      },
    };
    const task = createLocalOcrWorker(controller.signal, {
      page: {
        Blob,
        URL: {
          createObjectURL: () => `blob:fixture-${count++}`,
          revokeObjectURL: (value) => revoked.push(value),
        },
      },
      loadAsset: async () => new ArrayBuffer(1),
      createWorker: (_language, _oem, options) => {
        assert.equal(options.workerBlobURL, false);
        assert.equal(options.corePath, 'blob:fixture-1#.js');
        assert.equal(options.langPath, 'blob:fixture-2#');
        return pending.promise;
      },
    });
    await tick();
    if (cancelEarly) {
      controller.abort();
      await assert.rejects(task);
      pending.resolve(worker);
    } else {
      pending.resolve(worker);
      const session = await task;
      assert.equal(await session.recognize({}), 'recognized');
      session.dispose();
      session.dispose();
    }
    await tick();
    assert.equal(terminated, 1);
    assert.equal(revoked.length, 3);
  }
});
