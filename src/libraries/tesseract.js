/**
 * Tesseract.js OCR 接入助手
 * 对应 1.x：Better NXU.user.js 行 157-170（AddTesseract）、行 2052-2082（OCR createWorker/recognize/terminate）
 * 依赖：固定 SHA384 的 `tesseract-js` @resource；运行时拉 worker/core/lang 资源（见下方 G1 镜像决策）
 * 入口/被谁调用：sites/jwgl/pages/login.page.js（教务登录验证码 OCR）；B1 验收实测对象
 *
 * 注入模型（02 §5 / §6 / dependency-verification §B）：
 * 仅在教务验证码 OCR 实际触发时读取并执行 UMD 资源，避免约 63 KB 运行时进入每个匹配页面的脚本主体。
 *
 * G1 镜像硬约束（dependency-verification §G1 + 02 §5）：
 *  tesseract.js 6 的 worker/core/lang **默认走 jsdelivr** 自管——但 jsdelivr 在中国大陆长期不稳定
 *  （naptha/tesseract.js#899 开放 issue）。1.x 当年用 sustech 镜像规避正是此点。
 *  故本模块封装的 createWorker 调用**必须显式传 workerPath/corePath/langPath 指向国内可达镜像**，
 *  否则即便 UMD 运行时加载成功，OCR 仍会因 worker/wasm/traineddata 拉不到而失败。
 *
 * 镜像选择（2026-07-28 实测）：
 *  - `mirrors.sustech.edu.cn/cdnjs/ajax/libs/tesseract.js/6.0.1/worker.min.js` 200 → worker 可走 sustech；
 *  - 但 sustech cdnjs **未收录** `tesseract.js-core`（404），core 与 `@tesseract.js-data/*` traineddata 也不在 cdnjs。
 *  - **unpkg 对三项均 200**（worker.min.js / tesseract-core-simd-lstm.wasm.js / eng.traineddata.gz 实测可达），
 *    且对打包器透明（绝对 URL，`utils/resolvePaths` 的 `new URL(abs, base)` 原样保留）。
 *  → 为单一 CDN 一致性（利于 CSP 推理与排障），统一用 **unpkg**。版本钉死与 1.x / 装包一致：
 *    worker 用 `tesseract.js@6.0.1`，core 用 `tesseract.js-core@6.0.0`（库内 coreVersion 解析 `^6.0.0`→`6.0.0`），
 *    lang 用 `@tesseract.js-data/<lang>@1.0.0/4.0.0_best_int`（latest=1.0.0；OEM=LSTM_ONLY → best_int 路径）。
 *
 * 边界（02 §3）：本模块仅 import libraries/page-resource 与 utils，不 import sites/composables。
 */
import { evaluatePageResource } from './page-resource.js';
import { MyConsole } from '../utils/console.js';
import { OCR_ENGINE_UNAVAILABLE, scheduleOperationError } from '../utils/errors.js';

const console = MyConsole('[OCR]');
let tesseractRuntime;

function getTesseractRuntime() {
  if (tesseractRuntime) return tesseractRuntime;
  tesseractRuntime = evaluatePageResource(
    'tesseract-js',
    (pageWindow) => (typeof pageWindow.Tesseract?.createWorker === 'function' ? pageWindow.Tesseract : null),
  );
  return tesseractRuntime;
}

/**
 * worker / core / lang 的国内可达镜像基址（G1，详见模块头注释实测）。
 * 绝对 URL，对 Vite 打包透明（utils/resolvePaths 的 `new URL(abs, base)` 原样保留）。
 */
const OCR_MIRROR = {
  // worker 脚本：tesseract.js 6.0.1 的 worker.min.js（UMD classic-script-friendly，可 Blob URL importScripts）。
  workerPath: 'https://unpkg.com/tesseract.js@6.0.1/dist/worker.min.js',
  // core 目录：getCore 会在此后追加 `/tesseract-core-simd-lstm.wasm.js`（SIMD+LSTM，1.x OEM=LSTM_ONLY 默认即此）。
  // 不带尾斜杠，getCore 内部 `corePathImport.replace(/\/$/,'')` 再拼文件名，故写无尾斜杠形式更安全。
  corePath: 'https://unpkg.com/tesseract.js-core@6.0.0',
  // lang 数据：默认 LSTM_ONLY 用 best_int 训练集；调用时按 lang 拼成 `<base>/<n>.traineddata.gz`。
  // 1.x 只识 eng；此处构造函数按 lang 拼，保持可扩展。
  langPathBase: 'https://unpkg.com/@tesseract.js-data',
};

/**
 * 创建 OCR worker，**始终注入 G1 镜像路径**（不传则走 jsdelivr 国内不可达）。
 * 参数形态与 tesseract.js 6 `createWorker(langs, oem, options)` 一致（1.x 调用：`createWorker('eng', 1, {logger})`）。
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
  const primaryLang = Array.isArray(langs) ? (langs[0] || 'eng') : String(langs).split('+')[0] || 'eng';

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
    throw scheduleOperationError(OCR_ENGINE_UNAVAILABLE, `验证码识别组件加载失败：${error?.message || error}`);
  }
}
