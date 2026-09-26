/** CSP pages: download verified OCR assets in ScriptCat, then use only local Blob URLs. */
import { GM, unsafeWindow } from '#gm';
import { createOcrWorker } from './tesseract.js';
import { withAbort } from '../utils/abort.js';

export const LOCAL_OCR_ASSETS = Object.freeze({
  worker: {
    url: 'https://unpkg.com/tesseract.js@7.0.0/dist/worker.min.js',
    sha384: 'iUyp1FxLBc4DYaSwxT1/G6elMdSh3vvQffNSmMiySoXDpk2XfS9ZcM4RjPSiqiw3',
  },
  // Portable LSTM core with embedded WASM: no additional network request or SIMD requirement.
  core: {
    url: 'https://unpkg.com/tesseract.js-core@7.0.0/tesseract-core-lstm.wasm.js',
    sha384: 'ljppwjVnA7rpAU/v9enQiR6pXDStaEAYw9I+7ddiEynJcmDNnjHCmcvizBeO3cSA',
  },
  language: {
    url: 'https://unpkg.com/@tesseract.js-data/eng@1.0.0/4.0.0_best_int/eng.traineddata.gz',
    sha384: 'JI+fraGAoc5GBGIliuqzHRnP1nJyrukg5ggNSBv/TO+YOVj+6Te6XXQOx7ia10xq',
  },
});

export async function fetchOcrAsset({ url, sha384 }, signal) {
  signal.throwIfAborted();
  if (typeof GM?.xmlHttpRequest !== 'function') throw new Error('OCR 资源下载 API 不可用');
  const request = GM.xmlHttpRequest({
    method: 'GET',
    url,
    responseType: 'arraybuffer',
    anonymous: true,
    timeout: 60000,
  });
  const abort = () => request.abort?.();
  signal.addEventListener('abort', abort, { once: true });
  try {
    const response = await withAbort(request, signal);
    signal.throwIfAborted();
    const bytes = response.response;
    if (
      response.status !== 200 ||
      Object.prototype.toString.call(bytes) !== '[object ArrayBuffer]' ||
      !bytes.byteLength
    ) {
      throw new Error('OCR 资源下载失败');
    }
    const digest = await crypto.subtle.digest('SHA-384', bytes);
    signal.throwIfAborted();
    if (btoa(String.fromCharCode(...new Uint8Array(digest))) !== sha384) {
      throw new Error('OCR 资源完整性校验失败');
    }
    return bytes;
  } finally {
    signal.removeEventListener('abort', abort);
  }
}

export async function createLocalOcrWorker(
  signal,
  { page = unsafeWindow ?? window, loadAsset = fetchOcrAsset, createWorker = createOcrWorker } = {}
) {
  const controller = new AbortController();
  const cancel = () => controller.abort(signal.reason);
  signal.addEventListener('abort', cancel, { once: true });
  if (signal.aborted) cancel();
  let timer = setTimeout(() => controller.abort(new Error('OCR 初始化超时')), 90000);
  const urls = [];
  let worker;
  let pendingWorker;
  let disposed = false;
  const terminate = (value) =>
    Promise.resolve()
      .then(() => value?.terminate())
      .catch(() => {});
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    clearTimeout(timer);
    signal.removeEventListener('abort', cancel);
    controller.signal.removeEventListener('abort', dispose);
    if (worker) void terminate(worker);
    else if (pendingWorker) void pendingWorker.then(terminate, () => {});
    for (const url of urls) page.URL.revokeObjectURL(url);
  };
  controller.signal.addEventListener('abort', dispose, { once: true });
  try {
    const assets = await Promise.all(
      Object.values(LOCAL_OCR_ASSETS).map((asset) => loadAsset(asset, controller.signal))
    );
    controller.signal.throwIfAborted();
    for (const [index, bytes] of assets.entries()) {
      urls.push(
        page.URL.createObjectURL(
          new page.Blob([bytes], {
            type: index === 2 ? 'application/octet-stream' : 'text/javascript',
          })
        )
      );
    }
    // Tesseract appends /eng.traineddata.gz to langPath and expects corePath to end in js.
    // Put those suffixes in fragments so both URLs still resolve to their original Blob.
    pendingWorker = createWorker('eng', 1, {
      workerPath: urls[0],
      workerBlobURL: false,
      corePath: `${urls[1]}#.js`,
      langPath: `${urls[2]}#`,
      cacheMethod: 'none',
    });
    worker = await withAbort(pendingWorker, controller.signal);
    await withAbort(
      worker.setParameters({
        tessedit_char_whitelist: '0123456789',
        tessedit_pageseg_mode: '7',
      }),
      controller.signal
    );
    clearTimeout(timer);
    return {
      async recognize(image) {
        controller.signal.throwIfAborted();
        timer = setTimeout(() => controller.abort(new Error('验证码识别超时')), 30000);
        try {
          return await withAbort(worker.recognize(image), controller.signal);
        } finally {
          clearTimeout(timer);
        }
      },
      dispose,
    };
  } catch (error) {
    controller.abort(error);
    dispose();
    throw error;
  }
}
