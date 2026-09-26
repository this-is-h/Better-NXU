/** 固定资源通过 ScriptCat 后台请求，避免 WebVPN 改写外链；不发送页面凭证或验证码。 */
import { GM } from '#gm';

const ORT_BASE = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.30.0/dist/';
export const SLIDER_ASSETS = {
  runtime: {
    url: `${ORT_BASE}ort.min.js`,
    sha384: 'N94xSNjPDbfBJj4+QINst0nbHpcCm8kc1qNlIP/wA0muqjR3aVyIuDkMeccPrLvQ',
  },
  module: {
    url: `${ORT_BASE}ort-wasm-simd-threaded.mjs`,
    sha384: 'XcXA/MtAf0WpB8e023xQH9CM7RIjiugakT7x99DIwpFf7k56BIFFcAPerIF7FDad',
  },
  wasm: {
    url: `${ORT_BASE}ort-wasm-simd-threaded.wasm`,
    sha384: 'vjBJ1z7qrhkTyYsNqKeF6c7N+nOJSU94czEo+tvZcu8G75JparGq9kB+kTnEUNVM',
  },
  model: {
    url: 'https://cdn.jsdelivr.net/npm/captcha-recognizer-js@1.0.4/model/slider.onnx.q8.onnx',
    sha384: '6bKNnUGtWRYJcsM4Mvh3wqs0Dapp+uJhJJqScnfAw6LQwpgbJB24w9oasthHB26N',
  },
};

export async function fetchSliderAsset({ url, sha384 }, signal) {
  signal.throwIfAborted();
  if (typeof GM?.xmlHttpRequest !== 'function') throw new Error('GM.xmlHttpRequest 不可用');
  const request = GM.xmlHttpRequest({
    method: 'GET',
    url,
    responseType: 'arraybuffer',
    anonymous: true,
    timeout: 60000,
  });
  let abort;
  const aborted = new Promise((_, reject) => {
    abort = () => {
      reject(signal.reason);
      request.abort?.();
    };
    signal.addEventListener('abort', abort, { once: true });
    if (signal.aborted) abort();
  });
  try {
    const response = await Promise.race([request, aborted]);
    signal.throwIfAborted();
    if (response.status !== 200) throw new Error(`滑块资源下载失败（HTTP ${response.status}）`);
    if (/^content-type:\s*(?:text\/html|application\/xhtml\+xml)/im.test(response.responseHeaders || '')) {
      throw new Error('滑块资源返回了 HTML 页面');
    }
    const bytes = response.response;
    if (Object.prototype.toString.call(bytes) !== '[object ArrayBuffer]' || !bytes.byteLength) {
      throw new Error('滑块资源不是有效的二进制文件');
    }
    const digest = await crypto.subtle.digest('SHA-384', bytes);
    signal.throwIfAborted();
    if (btoa(String.fromCharCode(...new Uint8Array(digest))) !== sha384) {
      throw new Error('滑块资源完整性校验失败');
    }
    return bytes;
  } finally {
    signal.removeEventListener('abort', abort);
  }
}

export async function loadSliderAssets(signal) {
  const entries = await Promise.all(
    Object.entries(SLIDER_ASSETS).map(async ([name, asset]) => [name, await fetchSliderAsset(asset, signal)])
  );
  return Object.fromEntries(entries);
}
