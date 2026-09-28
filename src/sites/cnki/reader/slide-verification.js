import { dragSlider } from '../../../utils/slider-drag.js';

const installations = new WeakMap();
const MAX_ATTEMPTS = 3;

/** 仅处理知网阅读页的无缺口控件；不判断服务端验证成功，也不加载识别模型。 */
export function installCnkiSlider({ doc = document, drag = dragSlider, onError = () => {} } = {}) {
  const existing = installations.get(doc);
  if (existing) return existing;
  const view = doc.defaultView;
  const handled = new WeakMap();
  let attempts = 0;
  let active = null;
  let frame = null;
  let cooldown = null;
  let stopped = false;

  const scan = () => {
    frame = null;
    if (stopped || active || cooldown !== null || attempts >= MAX_ATTEMPTS || doc.hidden) return;
    const handle = doc.querySelector('.slider-wrapper #js-handler.handler');
    const track = handle?.closest('.slider-wrapper');
    if (!track || !handle.getClientRects().length) return;
    if (!handle.classList.contains('handler_bg')) return;
    const rect = handle.getBoundingClientRect();
    const trackRect = track.getBoundingClientRect();
    const scale = track.offsetWidth ? trackRect.width / track.offsetWidth : 1;
    const left = trackRect.left + (track.clientLeft || 0) * scale;
    const width = track.clientWidth ? track.clientWidth * scale : trackRect.width;
    const distance = width - rect.width;
    // 已拖动、成功或尚未布局的控件不再自动操作。
    if (distance <= 0 || rect.width <= 0 || Math.abs(rect.left - left) > 1) return;
    const previous = handled.get(handle);
    if (previous && (!previous.reset || previous.failed)) return;

    const state = { track, origin: rect.left - trackRect.left, moved: false, reset: false, failed: false };
    handled.set(handle, state);
    attempts++;
    const controller = new AbortController();
    active = controller;
    // 页面可在 mousemove 内直接完成验证；控件退出待验证状态后不再要求继续拖动。
    const isPending = () =>
      handle.isConnected &&
      doc.querySelector('.slider-wrapper #js-handler.handler') === handle &&
      handle.classList.contains('handler_bg') &&
      handle.getClientRects().length > 0;
    void Promise.resolve()
      // 从滑块冒泡到轨道/document；直接发给 document 会漏掉控件上的移动和释放监听。
      .then(() =>
        drag({
          handle,
          track,
          distance,
          feedback: true,
          eventTarget: handle,
          signal: controller.signal,
          isPending,
        })
      )
      .catch((error) => {
        state.failed = isPending();
        if (controller.signal.aborted) handled.delete(handle);
        if (!controller.signal.aborted && state.failed) onError(error);
      })
      .finally(() => {
        if (active === controller) active = null;
        if (stopped) return;
        cooldown = setTimeout(() => {
          cooldown = null;
          schedule();
        }, 1000);
      });
  };
  const schedule = () => {
    if (!stopped && !active && cooldown === null && attempts < MAX_ATTEMPTS && frame === null) {
      frame = view.requestAnimationFrame(scan);
    }
  };
  const observer = new view.MutationObserver(() => {
    const handle = doc.querySelector('.slider-wrapper #js-handler.handler');
    const state = handle && handled.get(handle);
    if (state && handle.getClientRects().length) {
      const offset =
        handle.getBoundingClientRect().left - state.track.getBoundingClientRect().left - state.origin;
      if (Math.abs(offset) > 1) state.moved = true;
      else if (state.moved && handle.classList.contains('handler_bg')) state.reset = true;
    }
    schedule();
  });
  const onUserPress = (event) => {
    if (event.isTrusted && event.target?.closest('.slider-wrapper')) stop();
  };
  const onPageHide = (event) => {
    active?.abort();
    if (!event.persisted) stop();
  };
  const onVisibilityChange = () => {
    if (doc.hidden) active?.abort();
    else schedule();
  };
  const stop = () => {
    if (stopped) return;
    stopped = true;
    observer.disconnect();
    if (frame !== null) view.cancelAnimationFrame(frame);
    frame = null;
    clearTimeout(cooldown);
    cooldown = null;
    active?.abort();
    doc.removeEventListener('pointerdown', onUserPress, true);
    doc.removeEventListener('mousedown', onUserPress, true);
    doc.removeEventListener('touchstart', onUserPress, true);
    doc.removeEventListener('visibilitychange', onVisibilityChange);
    view.removeEventListener('resize', schedule);
    view.removeEventListener('pageshow', schedule);
    view.removeEventListener('pagehide', onPageHide);
  };

  installations.set(doc, stop);
  observer.observe(doc.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['class', 'style', 'hidden'],
  });
  doc.addEventListener('pointerdown', onUserPress, true);
  doc.addEventListener('mousedown', onUserPress, true);
  doc.addEventListener('touchstart', onUserPress, true);
  doc.addEventListener('visibilitychange', onVisibilityChange);
  view.addEventListener('resize', schedule);
  view.addEventListener('pageshow', schedule);
  view.addEventListener('pagehide', onPageHide);
  schedule();
  return stop;
}
