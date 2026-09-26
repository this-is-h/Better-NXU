/**
 * IDS 滑块识别：沿用 captcha-recognizer-js@1.0.4 的 Worker 算法和展示坐标映射。
 * 静态打包小型算法；ORT、WASM 和模型由 GM 下载，仅以 Blob URL/二进制进入 Worker。
 * WebVPN 会改写页面/Worker 的外链请求，不能再让上游自行访问 CDN。
 */
import { buildWorkerSource, CONF_THRESHOLD } from 'captcha-recognizer-js/src/core.js';
import { unsafeWindow } from '#gm';
import { loadSliderAssets } from './slider-resources.js';
import { SLIDER_RECOGNIZER_UNAVAILABLE, scheduleOperationError } from '../utils/errors.js';

/*!
 * captcha-recognizer-js@1.0.4 — MIT License
 * Copyright (c) 2026 slider-captcha-gap contributors
 * Inference/postprocess ported from captcha-recognizer, Copyright 2024 Zhao Chenwei.
 * https://github.com/this-is-h/captcha-recognizer-js
 * https://github.com/chenwei-zhao/captcha-recognizer
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

export const MIN_CONFIDENCE = CONF_THRESHOLD;
// 上游 1.0.4 的源码锚点仍为 1.20.1；实际加载版本由 slider-resources.js 决定。
const UPSTREAM_ORT_BASE = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.20.1/dist/';
const INIT_TIMEOUT_MS = 90000;
const DETECT_TIMEOUT_MS = 30000;
let active = null;

/** 精确版本的两处加载点；升级上游时必须重新核对，不能静默退回远程加载。 */
export function buildLocalSliderWorker({ runtimeUrl, moduleUrl, wasmUrl }) {
  let source = buildWorkerSource();
  const replacements = [
    [
      `importScripts(${JSON.stringify(`${UPSTREAM_ORT_BASE}ort.min.js`)});`,
      `importScripts(${JSON.stringify(runtimeUrl)});`,
    ],
    [
      `ort.env.wasm.wasmPaths = ${JSON.stringify(UPSTREAM_ORT_BASE)};`,
      `ort.env.wasm.wasmPaths = ${JSON.stringify({ mjs: moduleUrl, wasm: wasmUrl })};`,
    ],
  ];
  for (const [from, to] of replacements) {
    if (source.split(from).length !== 2) throw new Error('滑块 Worker 加载接口已变化');
    source = source.replace(from, () => to);
  }
  return source;
}

/** 同页并发调用共用下载和初始化；失败后允许重试。 */
export function getSliderRecognizer() {
  if (active) return active.ready;
  // 安装版的 window 是 ScriptCat 沙箱，网关转换器只在真实页面上；所有 Blob/Worker API 必须同源。
  const state = {
    pageWindow: unsafeWindow ?? window,
    controller: new AbortController(),
    worker: null,
    urls: [],
    pending: new Map(),
    nextId: 0,
  };
  state.onPageHide = () => stop(state, new Error('滑块识别页面已离开'));
  state.pageWindow.addEventListener('pagehide', state.onPageHide, { once: true });
  active = state;
  state.ready = initialize(state).catch((error) => {
    stop(state, error);
    throw scheduleOperationError(
      SLIDER_RECOGNIZER_UNAVAILABLE,
      `滑块识别组件加载失败：${error?.message || error}，请手动完成验证`
    );
  });
  return state.ready;
}

async function initialize(state) {
  const timer = setTimeout(() => stop(state, new Error('滑块识别组件加载超时')), INIT_TIMEOUT_MS);
  try {
    const assets = await loadSliderAssets(state.controller.signal);
    state.controller.signal.throwIfAborted();
    const pageWindow = state.pageWindow;
    const objectUrl = (bytes, type) => {
      // WebVPN 会解析带 JS MIME 的 Blob，不支持 ORT mjs 中的顶层 await。
      // 无 MIME 的内层 Blob 保存原始内容；外层含 Blob 时 WebVPN 明确保留，不重写源码。
      const blob = new pageWindow.Blob([new pageWindow.Blob([bytes])], { type });
      const url = pageWindow.URL.createObjectURL(blob);
      state.urls.push(url);
      // WebVPN createObjectURL 返回伪装成 ids 来源的 URL；importScripts 会自动还原，
      // 原生动态 import 不会。使用其 URL 转换器统一还原为浏览器真实的 Blob 来源。
      return typeof pageWindow.vpn_rewrite_url === 'function' ? pageWindow.vpn_rewrite_url(url) : url;
    };
    // JS 明确按 UTF-8 解码，WASM/模型保持二进制；禁止把 ArrayBuffer 隐式转为字符串。
    const decoder = new TextDecoder('utf-8', { fatal: true });
    const source = buildLocalSliderWorker({
      runtimeUrl: objectUrl(decoder.decode(assets.runtime), 'text/javascript'),
      moduleUrl: objectUrl(decoder.decode(assets.module), 'text/javascript'),
      wasmUrl: objectUrl(assets.wasm, 'application/wasm'),
    });
    state.worker = new pageWindow.Worker(objectUrl(source, 'text/javascript'));
    state.worker.onmessage = ({ data }) => {
      const id = data.type === 'ready' ? 0 : data.id;
      const pending = state.pending.get(id);
      if (!pending) return;
      state.pending.delete(id);
      data.error ? pending.reject(new Error(data.error)) : pending.resolve(data);
    };
    state.worker.onerror = () => stop(state, new Error('滑块识别 Worker 执行失败'));
    state.worker.onmessageerror = () => stop(state, new Error('滑块识别 Worker 消息读取失败'));
    // 上游 init 的参数名仍是 modelUrl，ORT 同样接受 Uint8Array，不再触发模型 fetch。
    await send(state, { type: 'init', modelUrl: new Uint8Array(assets.model) }, [assets.model], 0);
    return {
      detect: (source, options) => detect(state, source, options),
      dispose: () => stop(state, new Error('滑块识别器已释放')),
    };
  } finally {
    clearTimeout(timer);
  }
}

function send(state, message, transfer = [], id = ++state.nextId) {
  return new Promise((resolve, reject) => {
    state.controller.signal.throwIfAborted();
    state.pending.set(id, { resolve, reject });
    try {
      state.worker.postMessage({ ...message, id }, transfer);
    } catch (error) {
      state.pending.delete(id);
      reject(error);
    }
  });
}

async function detect(state, source, { displayWidth, displayHeight } = {}) {
  state.controller.signal.throwIfAborted();
  const timer = setTimeout(() => stop(state, new Error('滑块识别超时，请手动完成验证')), DETECT_TIMEOUT_MS);
  let rejectOnAbort;
  const aborted = new Promise((_, reject) => {
    rejectOnAbort = () => reject(state.controller.signal.reason);
    state.controller.signal.addEventListener('abort', rejectOnAbort, { once: true });
  });
  try {
    return await Promise.race([detectImage(state, source, displayWidth, displayHeight), aborted]);
  } finally {
    clearTimeout(timer);
    state.controller.signal.removeEventListener('abort', rejectOnAbort);
  }
}

async function detectImage(state, source, displayWidth, displayHeight) {
  let naturalWidth, naturalHeight, result;
  if (source?.data && source.width && source.height) {
    naturalWidth = source.width;
    naturalHeight = source.height;
    result = await send(state, {
      type: 'identifyData',
      data: source.data,
      width: naturalWidth,
      height: naturalHeight,
    });
  } else {
    // 创建独立快照，不转移/关闭调用者持有的图片；transfer 后尺寸会变为 0。
    const bitmap = await createImageBitmap(source);
    try {
      naturalWidth = bitmap.width;
      naturalHeight = bitmap.height;
      result = await send(state, { type: 'identify', bitmap }, [bitmap]);
    } finally {
      bitmap.close();
    }
  }
  const scaleX = (displayWidth ?? naturalWidth) / naturalWidth;
  const scaleY = (displayHeight ?? naturalHeight) / naturalHeight;
  return {
    box: result.box.map((value, index) => value * (index % 2 ? scaleY : scaleX)),
    confidence: result.confidence,
    naturalWidth,
    naturalHeight,
  };
}

function stop(state, error) {
  if (state.controller.signal.aborted) return;
  state.controller.abort(error);
  state.pageWindow.removeEventListener('pagehide', state.onPageHide);
  state.worker?.terminate();
  for (const pending of state.pending.values()) pending.reject(error);
  state.pending.clear();
  for (const url of state.urls) state.pageWindow.URL.revokeObjectURL(url);
  state.urls.length = 0;
  if (active === state) active = null;
}

/** 包括下载/初始化中的取消；释放旧实例不会影响稍后新建的实例。 */
export function disposeSliderRecognizer() {
  if (active) stop(active, new Error('滑块识别器已释放'));
}
