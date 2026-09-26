import { createLocalOcrWorker } from '../../../libraries/tesseract-local.js';
import { closeCurrentTab } from '../../../utils/file.js';
import { isTuanweiDownloadRoute } from '../../../utils/route-guards.js';
import { withAbort } from '../../../utils/abort.js';
import { fetchAttachment, saveAttachment } from './attachment.js';

const BUTTON = 'body > div.code > div > div.code_but > input[type="button"]';
const IMAGE_PATH = '/system/resource/js/filedownload/createimage.jsp';

export function normalizeCaptcha(text) {
  const code = String(text || '').replace(/\s+/g, '');
  return /^\d{4}$/.test(code) ? code : null;
}

function waitForImage(image, signal) {
  if (image.complete && image.naturalWidth) return Promise.resolve();
  let loaded;
  let failed;
  let timer;
  const pending = new Promise((resolve, reject) => {
    loaded = () => (image.naturalWidth ? resolve() : reject(new Error('验证码图片为空')));
    failed = () => reject(new Error('验证码图片加载失败'));
    image.addEventListener('load', loaded, { once: true });
    image.addEventListener('error', failed, { once: true });
    timer = setTimeout(failed, 10000);
  });
  return withAbort(pending, signal).finally(() => {
    clearTimeout(timer);
    image.removeEventListener('load', loaded);
    image.removeEventListener('error', failed);
  });
}

/** Read only the visible image: fetching createimage.jsp again changes the server CAPTCHA. */
function snapshot(doc, image) {
  const canvas = doc.createElement('canvas');
  canvas.width = image.naturalWidth * 3;
  canvas.height = image.naturalHeight * 3;
  canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas;
}

export async function autoDownloadAttachment({
  doc = document,
  page = window,
  autoClose = false,
  report = () => {},
  createWorker = createLocalOcrWorker,
  request = fetchAttachment,
  save = saveAttachment,
  close = closeCurrentTab,
} = {}) {
  const url = new URL(page.location.href);
  if (!isTuanweiDownloadRoute({ url: url.href })) return 'ignored';
  const input = doc.querySelector('#codeValue');
  const button = doc.querySelector(BUTTON);
  const image = doc.querySelector('#codeimg');
  if (!input || !button || !image) throw new Error('未找到附件验证码控件，请手动下载');
  const imageUrl = new URL(image.src, url);
  if (imageUrl.origin !== url.origin || imageUrl.pathname !== IMAGE_PATH)
    throw new Error('验证码图片地址不匹配');
  if (input.value.trim()) return 'manual';

  const controller = new AbortController();
  const { signal } = controller;
  let worker;
  let automaticClick = false;
  let downloadTask;
  const originalDisabled = button.disabled;
  const stop = () => controller.abort();
  // Trusted input/click events transfer control to the user, without blocking native handlers.
  const manual = (event) => {
    if (event.isTrusted) stop();
  };
  const intercept = (event) => {
    if (!automaticClick) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const target = new URL(url);
    target.searchParams.set('codeValue', input.value);
    downloadTask = request(target.href, signal);
  };
  input.addEventListener('input', manual);
  image.addEventListener('click', manual, true);
  button.addEventListener('click', manual, true);
  button.addEventListener('click', intercept, true);
  page.addEventListener('pagehide', stop, { once: true });
  try {
    report('正在加载验证码识别组件…');
    worker = await createWorker(signal);
    for (let attempt = 0; attempt < 3; attempt++) {
      signal.throwIfAborted();
      if (attempt) {
        image.src = new URL(`${IMAGE_PATH}?randnum=${Date.now()}`, url).href;
      }
      await waitForImage(image, signal);
      const source = image.src;
      report(`正在识别验证码（${attempt + 1}/3）…`);
      const result = await withAbort(worker.recognize(snapshot(doc, image)), signal);
      signal.throwIfAborted();
      if (
        !input.isConnected ||
        !button.isConnected ||
        !image.isConnected ||
        image.src !== source ||
        input.value.trim()
      ) {
        return 'manual';
      }
      const code = normalizeCaptcha(result?.data?.text);
      if (!code) continue;
      input.value = code;
      input.dispatchEvent(new page.Event('input', { bubbles: true }));
      input.dispatchEvent(new page.Event('change', { bubbles: true }));
      downloadTask = undefined;
      automaticClick = true;
      try {
        button.click();
      } finally {
        automaticClick = false;
      }
      if (!downloadTask) throw new Error('无法提交附件下载');
      button.disabled = true;
      report('正在验证并接收附件…');
      const attachment = await withAbort(downloadTask, signal);
      signal.throwIfAborted();
      if (attachment) {
        report('正在保存附件，请等待下载完成…');
        await withAbort(save(attachment, signal), signal);
        signal.throwIfAborted();
        report('附件下载完成', 'success');
        if (autoClose) close();
        return 'downloaded';
      }
      button.disabled = originalDisabled;
      if (input.value !== code) return 'manual';
      input.value = '';
    }
    throw new Error('验证码识别未通过，请点击验证码图片后手动输入并下载');
  } catch (error) {
    if (signal.aborted) return 'manual';
    throw error;
  } finally {
    controller.abort();
    worker?.dispose();
    button.disabled = originalDisabled;
    input.removeEventListener('input', manual);
    image.removeEventListener('click', manual, true);
    button.removeEventListener('click', manual, true);
    button.removeEventListener('click', intercept, true);
    page.removeEventListener('pagehide', stop);
  }
}
