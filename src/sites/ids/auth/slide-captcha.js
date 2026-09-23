/**
 * ids/auth/slide-captcha — 统一认证滑块验证码自动识别
 *
 * 依赖：
 *   - libraries/slider-recognizer.js  captcha-recognizer-js 接入封装（懒加载 ONNX Worker，
 *     调用 rec.detect(source, { displayWidth, displayHeight }) 返回展示坐标系 box）
 *   - ids/auth/slider-drag.js          项目自有拖动实现（平滑轨迹、范围校验、取消与超时）
 *
 * 入口/被谁调用：
 *   sites/ids/auth/ids-login.js 在提交后 800ms 检测到 #sliderDiv 时调用 solveIdsSliderCaptcha()。
 *
 * 页面实际 DOM（用户指定）：
 *   背景图  = document.querySelectorAll("#sliderDiv > canvas")[0]
 *   小图    = document.querySelectorAll("#sliderDiv > canvas")[1]
 *   滑块控件 = document.querySelector("#sliderDiv > div.sliderContainer > div.sliderMask > div.slider")
 *
 * 坐标系（2026-09-20 用户实测指定）：
 *   展示区域宽高以展示位图 canvas（canvas[1]）的 width/height 属性为准。
 *   captcha-recognizer-js.rec.detect(source, { displayWidth, displayHeight }) 传入展示尺寸
 *   后返回的 box 坐标已映射到展示区域，x1 即滑块需拖动的展示像素距离。
 *
 * 识别流程：
 *   1. 等待两个 canvas 完成绘制并稳定
 *   2. 从展示位图 canvas（canvas[1]）取 displayWidth/displayHeight 传入识别器
 *   3. ONNX Worker 返回缺口 box（展示像素）；置信度低于阈值则回退手动
 *   4. 用 slider-drag 的 dragIdsSlider 派发完整鼠标拖动序列
 *   5. 拖动后等待成功/跳转；只有失败换图才重试，总计最多三次
 */

import { getSliderRecognizer, MIN_CONFIDENCE } from '../../../libraries/slider-recognizer.js';
import { dragIdsSlider } from './slider-drag.js';
import { toast, removeToastHandle } from '../../../libraries/notification.js';
import { MyConsole } from '../../../utils/console.js';
import { SLIDER_RECOGNIZER_UNAVAILABLE } from '../../../utils/errors.js';
import {
  getSliderElements,
  isSliderCaptchaPresent,
  isSameSliderFrame,
  readSliderFrame,
  runSliderAttempts,
} from './slider-retry.js';

export { isSliderCaptchaPresent } from './slider-retry.js';

const console = MyConsole('[ids.slider]');
let solving = null;

/**
 * 等待滑块验证码元素加载。
 * @param {number} [timeoutMs=8000]
 * @returns {Promise<{bgImg:HTMLElement,pieceImg:HTMLElement,slider:HTMLElement}>}
 */
export async function waitForSliderElements(timeoutMs = 8000) {
  const interval = 200;
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const els = getSliderElements();
    if (els.bgImg && els.pieceImg && els.slider) return els;
    await new Promise((r) => setTimeout(r, interval));
  }
  throw new Error('滑块验证码元素等待超时');
}

/** 同一登录页的重复调用共用一个流程，避免并行拖动与重试。 */
export function solveIdsSliderCaptcha() {
  if (!solving) {
    solving = solve().finally(() => {
      solving = null;
    });
  }
  return solving;
}

async function solve() {
  if (!isSliderCaptchaPresent()) {
    console('滑块验证码未出现，跳过');
    return false;
  }

  let toastHandle = toast('info', '正在识别滑块验证…', 0);
  const controller = new AbortController();
  const onPageHide = () => controller.abort(new Error('页面已离开'));
  window.addEventListener('pagehide', onPageHide, { once: true });
  const showProgress = (message) => {
    if (toastHandle) removeToastHandle(toastHandle);
    toastHandle = toast('info', message, 0);
  };
  console('发现滑块验证码，开始自动识别');

  try {
    const { pieceImg } = await waitForSliderElements();
    if (!pieceImg.width || !pieceImg.height) {
      throw new Error('展示位图 canvas 尺寸无效，无法确定滑动坐标系');
    }
    controller.signal.throwIfAborted();
    // 在循环外加载，重试只识别新图，不重新下载模型或初始化 Worker。
    const rec = await getSliderRecognizer();
    let manualMessage = '滑块验证无法自动完成，请手动操作';
    const result = await runSliderAttempts(
      async (frame, attempt) => {
        const { bgImg, pieceImg, slider } = frame;
        const { box, confidence } = await rec.detect(bgImg, {
          displayWidth: pieceImg.width,
          displayHeight: pieceImg.height,
        });
        controller.signal.throwIfAborted();
        if (!isSliderCaptchaPresent() || document.querySelector('#sliderDiv > .sliderContainer_success'))
          return 'closed';
        // 推理期间学校/用户换了题时，不使用旧距离拖动新题。
        if (!isSameSliderFrame(frame, readSliderFrame())) return 'refreshed';
        if (!box || box.length !== 4 || !box.every(Number.isFinite)) return 'manual';
        if (!Number.isFinite(confidence) || confidence < MIN_CONFIDENCE) {
          manualMessage = '滑块验证识别置信度过低，请手动操作';
          return 'manual';
        }
        const distance = Math.round(box[0]);
        console(`第 ${attempt}/3 次滑块拖动，距离: ${distance}px`);
        await dragIdsSlider(slider, distance, { signal: controller.signal });
        controller.signal.throwIfAborted();
        showProgress('滑块已拖动，等待验证与跳转…');
        return 'submitted';
      },
      {
        signal: controller.signal,
        onRetry: (attempt) => showProgress(`验证码已刷新，正在重试（${attempt}/3）…`),
      }
    );
    if (result === 'exhausted' || result === 'manual') {
      removeToastHandle(toastHandle);
      toastHandle = null;
      toast('warning', result === 'exhausted' ? '滑块自动验证已尝试 3 次，请手动完成验证' : manualMessage, 0);
      return false;
    }
    return result === 'submitted';
  } catch (err) {
    if (controller.signal.aborted) return false;
    // scheduleOperationError 抛出的结构化错误已含人类可读 message；其他错误原样保留。
    const isScheduleError = err?.code === SLIDER_RECOGNIZER_UNAVAILABLE;
    console('滑块验证识别异常', err, 'error');
    removeToastHandle(toastHandle);
    toastHandle = null;
    toast('error', isScheduleError ? err.message : '滑块验证识别失败，请手动操作', 5);
    return false;
  } finally {
    if (toastHandle) removeToastHandle(toastHandle);
    window.removeEventListener('pagehide', onPageHide);
  }
}
