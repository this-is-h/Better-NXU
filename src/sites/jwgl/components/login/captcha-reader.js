/**
 * jwgl/components/login/captcha-reader — 教务登录页验证码 OCR 识别
 * 对应 1.x：Better NXU.user.js 行 2033-2082（GetVerificationCode）的 Jwgl 分支 + 行 310（LoadMessage 进度文案）
 * 依赖：libraries/tesseract（createOcrWorker，注入 G1 镜像 worker/core/langPath）、utils/errors（OCR_EMPTY_RESULT +
 *       scheduleOperationError）、utils/console
 * 入口/被谁调用：sites/jwgl/pages/login.page.js（jwglLogin 启用自动登录时调）
 *
 * 抽取边界：1.x `GetVerificationCode(web)` 一个函数分发 WebVPN/Jwgl/TuanWei 三类验证码 url。2.0 拆模块后，
 *  各 site 自带验证码 url 不同（webvpn ids 走 webvpn 代理 captcha、jwgl 走 `captcha/image.action`、tuanwei 已停用），
 *  故不做通用分发器，仅迁 jwgl 分支为本模块 `readJwglCaptcha`。WebVPN ids 登录的验证码在 ids-login 主干另行处理
 * （1.x ids 走 `hasLegacyAuthCaptcha` 人工填，不 OCR）。
 *
 * 与 1.x 行为等价点（C5，逐字对齐行 2033-2082）：
 *  - url 形态：1.x 行 2040 `new URL("captcha/image.action", window.location.href).href`；2.0 同构造（page 上下文
 *    window.location 即当前页，含 IP 直连 :8080~3 / iframe 内均可用相对解析）。
 *  - createWorker('eng', 1, {logger})：1.x 行 2055 调 `AddTesseract().createWorker('eng',1,{logger})`；2.0 经
 *    libraries/tesseract.createOcrWorker('eng',1,{logger})（按需读取固定 SHA384 资源 + 注入 unpkg 镜像路径）。
 *  - logger 进度文案：1.x 行 2056-2064 按 LoadMessage 翻译仅记前 5 种状态；2.0 同 LoadMessage 表逐字搬。
 *  - recognize(url) → ret.data.text.replace(/\s+/g,'')；空则抛 OCR_EMPTY_RESULT（1.x 行 2067-2070）。
 *  - finally terminate worker 兜底清理（1.x 行 2073-2082）。
 *  - 失败上抛：调用方（jwglLogin）catch 后 toast"验证码识别失败，请手动输入后登录"（与 1.x 行 2771-2773 一致）。
 */
import { createOcrWorker } from '../../../../libraries/tesseract.js';
import { OCR_EMPTY_RESULT, scheduleOperationError } from '../../../../utils/errors.js';
import { toast, installNotification, removeToastHandle } from '../../../../libraries/notification.js';
import { MyConsole } from '../../../../utils/console.js';

const console = MyConsole('[OCR]');

// 1.x 行 310 逐字迁移：tesseract worker 状态→中文进度文案（logger 仅对此 5 种状态记日志）。
const LoadMessage = {
  'loading tesseract core': 'OCR核心加载',
  'initializing tesseract': 'OCR初始化',
  'loading language traineddata': '加载OCR语言训练数据',
  'initializing api': '初始化OCR接口',
  'recognizing text': '识别验证码',
};

function withTimeout(promise, timeoutMs, message) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(message)), timeoutMs);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

/**
 * 识别教务系统登录页验证码并返回去空白后的文本。对应 1.x GetVerificationCode('Jwgl') 行 2033-2082。
 * 失败上抛（OCR_EMPTY_RESULT / OCR_ENGINE_UNAVAILABLE / 网络）；调用方 catch 后转 toast 引导手动填。
 * @returns {Promise<string>} 识别出的验证码（已去所有空白）
 */
export async function readJwglCaptcha() {
  // 1.x 行 2040：相对当前页解析验证码图片 url（教务登录页、IP 直连 :8080~3、webvpn 代理形态均适用）。
  const url = new URL('captcha/image.action', window.location.href).href;
  console('开始加载验证码图片', { url }, 'info');

  // 确保 toast 体系就绪：logger 内进度回调会用 toast 弹进度文案，
  // createOcrWorker 的 worker 可能同步触发首个进度事件（progress==0），
  // 故须在 createOcrWorker 之前 installNotification（幂等，重复调用安全）。
  installNotification();

  let worker;
  let progressToast = null;
  let active = true;
  let workerPromise;
  try {
    // 1.x 行 2055：createWorker('eng', 1, {logger})，经 createOcrWorker 注入 unpkg 镜像（G1）。
    workerPromise = createOcrWorker('eng', 1, {
      logger: (m) => {
        if (!active) return;
        // 1.x 行 2057-2064：仅对 LoadMessage 已知状态记进度日志。
        const statusText = LoadMessage[m.status];
        if (statusText) {
          console('识别进度', { status: statusText, progress: Number(m.progress || 0) }, 'debug');
        }
        // 1.x 行 2058-2061：progress==0 弹进度提示常驻、progress==1 弹完成。
        // 2.0 经 libraries/notification.toast（1.x 裸 createToast 全局；2.0 模块作用域取不到，
        // 必经 toast 包装 + installNotification 先就绪）。仅对已知状态弹，避免未知 status 弹 undefined。
        // worker 消息的 progress 可能是字符串，统一转数字后严格比较。
        const progress = Number(m.progress);
        if (progress === 0) {
          if (statusText) {
            if (progressToast) removeToastHandle(progressToast);
            progressToast = toast('info', statusText, 0);
          }
        } else if (progress === 1) {
          if (progressToast) removeToastHandle(progressToast);
          progressToast = null;
          toast('success', '验证码识别组件加载完成', 2);
        }
      },
    });
    worker = await withTimeout(workerPromise, 45000, '验证码识别组件加载超时');
    // 1.x 行 2066-2070：recognize(url) → 去空白；空则抛 OCR_EMPTY_RESULT。
    const ret = await withTimeout(worker.recognize(url), 30000, '验证码识别超时');
    const code = (ret?.data?.text || '').replace(/\s+/g, '');
    if (!code) {
      throw scheduleOperationError(OCR_EMPTY_RESULT, '验证码识别结果为空');
    }
    console('验证码识别完成', undefined, 'info');
    return code;
  } finally {
    active = false;
    if (progressToast) removeToastHandle(progressToast);
    // 初始化超时不会取消 createWorker 自身；若 worker 之后才创建成功，立即终止，避免后台线程永久驻留。
    if (!worker && workerPromise) {
      void workerPromise
        .then(async (lateWorker) => {
          try {
            await lateWorker?.terminate?.();
          } catch (error) {
            console('迟到 worker 清理失败', error, 'warn');
          }
        })
        .catch(() => {});
    }
    // 1.x 行 2073-2082：无论成败终止 worker，防内存泄漏。
    if (worker) {
      try {
        await worker.terminate();
      } catch (error) {
        console('worker 清理失败', error, 'warn');
      }
    }
  }
}
