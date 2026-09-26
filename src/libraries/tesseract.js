/**
 * Tesseract 7 适配：UMD 入口从固定 SHA384 的 @resource 加载。
 * worker 与 core 同为 7.0.0；corePath 保留目录，让 worker 按浏览器能力选择
 * relaxed SIMD、SIMD 或普通 WASM。语言数据继续使用 eng 1.0.0 的 best_int。
 */
import { evaluatePageResource } from './page-resource.js';
import { MyConsole } from '../utils/console.js';
import { OCR_ENGINE_UNAVAILABLE, scheduleOperationError } from '../utils/errors.js';

const console = MyConsole('[OCR]');
let tesseractRuntime;

function getTesseractRuntime() {
  if (tesseractRuntime) return tesseractRuntime;
  tesseractRuntime = evaluatePageResource('tesseract-js', (pageWindow) =>
    typeof pageWindow.Tesseract?.createWorker === 'function' ? pageWindow.Tesseract : null
  );
  return tesseractRuntime;
}

/**
 * worker / core / lang 的固定 CDN 基址。
 * 绝对 URL，对 Vite 打包透明（utils/resolvePaths 的 `new URL(abs, base)` 原样保留）。
 */
const OCR_MIRROR = {
  // worker 脚本：tesseract.js 7.0.0 的 worker.min.js（UMD classic-script-friendly，可 Blob URL importScripts）。
  workerPath: 'https://unpkg.com/tesseract.js@7.0.0/dist/worker.min.js',
  // core 目录：getCore 按能力选择 relaxed SIMD、SIMD 或普通 WASM，支持 LSTM_ONLY。
  // 不带尾斜杠，getCore 内部 `corePathImport.replace(/\/$/,'')` 再拼文件名，故写无尾斜杠形式更安全。
  corePath: 'https://unpkg.com/tesseract.js-core@7.0.0',
  // lang 数据：默认 LSTM_ONLY 用 best_int 训练集；调用时按 lang 拼成 `<base>/<n>.traineddata.gz`。
  // 1.x 只识 eng；此处构造函数按 lang 拼，保持可扩展。
  langPathBase: 'https://unpkg.com/@tesseract.js-data',
};

/**
 * 创建 OCR worker，始终注入已核验的固定 CDN 路径。
 * 参数形态与 tesseract.js 7 `createWorker(langs, oem, options)` 一致（1.x 调用：`createWorker('eng', 1, {logger})`）。
 *
 * 语言范围说明：1.x 固定只识 `eng`（行 2055）。tesseract.js 的 `langPath` 是单一 base 字符串，库内按
 *  `${langPath}/${lang}.traineddata.gz` 拼拉取 URL——本函数按**首个语言**拼 `@<lang>@1.0.0/4.0.0_best_int` base。
 * 故多语言（如 `'eng+chi_sim'`）会因 base 里的 lang 不匹配而拉取失败。**当前仅支持单语言**（与 1.x 一致）；
 * 如需多语言，调用方须自行在 extraOptions 里传完整 `langPath` 覆盖（本函数不覆盖调用方显式传的 langPath）。
 *
 * @param {string} [langs='eng'] 识别语言（单语言，1.x 固定 'eng'）
 * @param {number} [oem=1] OCR 引擎模式，1 = OEM.LSTM_ONLY（1.x 行 2055 实调用 1）
 * @param {object} [extraOptions] 透传给 tesseract.createWorker 的额外选项（如 logger）；本函数注入镜像路径，
 *   调用方显式传的同名键优先（不覆盖）——保留 oem=1 LSTM 路径下默认 best_int 行为。
 * @returns {Promise<Worker>} tesseract worker（调用方负责 `worker.recognize` 后 `worker.terminate`）
 */
export async function createOcrWorker(langs = 'eng', oem = 1, extraOptions = {}) {
  const primaryLang = Array.isArray(langs) ? langs[0] || 'eng' : String(langs).split('+')[0] || 'eng';

  // 镜像路径：worker/core 固定；langPath 按 primaryLang 拼 best_int（LSTM_ONLY）子路径（单语言见上注释）。
  const langPath = `${OCR_MIRROR.langPathBase}/${primaryLang}@1.0.0/4.0.0_best_int`;

  // 调用方若显式传了同名路径键则以其为准（不覆盖），否则补镜像默认。
  const options = {
    workerPath: OCR_MIRROR.workerPath,
    corePath: OCR_MIRROR.corePath,
    langPath,
    ...extraOptions,
  };

  try {
    return await getTesseractRuntime().createWorker(langs, oem, options);
  } catch (error) {
    // createWorker 同步阶段失败多为 worker 资源拉取/构造失败 → 统一抛 OCR_ENGINE_UNAVAILABLE。
    console('createWorker 失败（worker/core/lang 镜像或构造问题）', error, 'error');
    throw scheduleOperationError(
      OCR_ENGINE_UNAVAILABLE,
      `验证码识别组件加载失败：${error?.message || error}`
    );
  }
}
