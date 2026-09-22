/** IDS 滑块换图监测：只对新题重试，不把跳转延迟视为失败。 */
export const MAX_SLIDER_ATTEMPTS = 3;
const POLL_MS = 200;
const FRAME_TIMEOUT_MS = 8000;
const FRAME_STABLE_MS = 400;

export function getSliderElements() {
  const canvases = document.querySelectorAll('#sliderDiv > canvas');
  return {
    bgImg: canvases[0] ?? null,
    pieceImg: canvases[1] ?? null,
    slider: document.querySelector('#sliderDiv > div.sliderContainer > div.sliderMask > div.slider'),
  };
}

export function isSliderCaptchaPresent() {
  const slider = document.querySelector('#sliderDiv, #sliderCaptchaDiv, #captcha-id');
  return Boolean(slider && slider.offsetParent !== null && slider.innerHTML !== '');
}

function challengeSource() {
  // 仅内存比较，不记录图片、签名或接口内容。
  return ['#slider-img1', '#slider-img2']
    .map((selector) => document.querySelector(selector)?.getAttribute('src') ?? '')
    .join('\n');
}

function canvasFingerprint(canvas) {
  if (!canvas?.width || !canvas.height) return null;
  const pixels = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
  let hash = 2166136261;
  let painted = false;
  for (let i = 0; i < pixels.length; i++) {
    hash = Math.imul(hash ^ pixels[i], 16777619);
    if (i % 4 === 3 && pixels[i] !== 0) painted = true;
  }
  return painted ? `${canvas.width}:${canvas.height}:${hash >>> 0}` : null;
}

export function readSliderFrame() {
  const elements = getSliderElements();
  if (!elements.bgImg || !elements.pieceImg || !elements.slider) return null;
  const background = canvasFingerprint(elements.bgImg);
  const piece = canvasFingerprint(elements.pieceImg);
  if (!background || !piece) return null; // reset() 清空后必须等待两幅画布重新绘制。
  return { ...elements, source: challengeSource(), background, piece };
}

export function isSameSliderFrame(left, right) {
  return Boolean(
    left &&
    right &&
    left.bgImg === right.bgImg &&
    left.pieceImg === right.pieceImg &&
    left.slider === right.slider &&
    left.source === right.source &&
    left.background === right.background &&
    left.piece === right.piece
  );
}

function sleep(signal) {
  return new Promise((resolve, reject) => {
    signal?.throwIfAborted();
    const abort = () => {
      clearTimeout(timer);
      reject(signal.reason);
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', abort);
      resolve();
    }, POLL_MS);
    signal?.addEventListener('abort', abort, { once: true });
  });
}

async function waitForReadyFrame(signal) {
  const deadline = Date.now() + FRAME_TIMEOUT_MS;
  let candidate = null;
  let stableSince = Date.now();
  while (Date.now() < deadline) {
    signal?.throwIfAborted();
    if (document.querySelector('#sliderDiv > .sliderContainer_success') || !isSliderCaptchaPresent())
      return null;
    const frame = readSliderFrame();
    if (!isSameSliderFrame(candidate, frame)) {
      candidate = frame;
      stableSince = Date.now();
    } else if (Date.now() - stableSince >= FRAME_STABLE_MS) {
      return frame;
    }
    await sleep(signal);
  }
  throw new Error('滑块图片加载超时，请手动完成验证');
}

async function waitForRefresh(frame, signal) {
  // 学校验证成功先设置 success，再提交表单；跳转再慢也不能重试已成功的题。
  while (true) {
    signal?.throwIfAborted();
    if (document.querySelector('#sliderDiv > .sliderContainer_success') || !isSliderCaptchaPresent()) {
      return false;
    }
    const elements = getSliderElements();
    if (
      challengeSource() !== frame.source ||
      elements.bgImg !== frame.bgImg ||
      elements.pieceImg !== frame.pieceImg
    ) {
      return true;
    }
    // 当前学校有两张源图片；保留仅画布渲染时的兼容，不把 CSS 拖动位置当换图。
    if (frame.source === '\n') {
      const current = readSliderFrame();
      if (current && current.background !== frame.background) return true;
    }
    await sleep(signal);
  }
}

/**
 * attempt(frame) 返回 submitted / refreshed / manual / closed。
 * 总计至多三次（首次 + 两次重试）；同一题未刷新时只等待，不消耗次数。
 */
export async function runSliderAttempts(attempt, { signal, onRetry = () => {} } = {}) {
  for (let count = 1; count <= MAX_SLIDER_ATTEMPTS; count++) {
    const frame = await waitForReadyFrame(signal);
    if (!frame) return 'closed';
    const outcome = await attempt(frame, count);
    if (outcome === 'closed') return 'closed';
    if (outcome === 'manual') return 'manual';
    if (outcome === 'submitted' && !(await waitForRefresh(frame, signal))) return 'submitted';
    if (count < MAX_SLIDER_ATTEMPTS) onRetry(count + 1);
  }
  return 'exhausted';
}
