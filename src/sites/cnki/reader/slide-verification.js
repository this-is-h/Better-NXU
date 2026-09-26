import { dragSlider } from '../../../utils/slider-drag.js';

const installations = new WeakMap();
const MAX_ATTEMPTS = 3;

/** 仅处理知网阅读页的无缺口控件；不判断服务端验证成功，也不加载识别模型。 */
export function installCnkiSlider({ doc = document, drag = dragSlider, onError = () => {} } = {}) {
  const existing = installations.get(doc);
  if (existing) return existing;
  const view = doc.defaultView;
  const handled = new WeakSet();
  let attempts = 0;
  let active = null;
  let frame = null;
  let stopped = false;

  const scan = () => {
    frame = null;
    if (stopped || active || attempts >= MAX_ATTEMPTS || doc.hidden) return;
    const handle = doc.querySelector('.slider-wrapper #js-handler.handler');
    const track = handle?.closest('.slider-wrapper');
    if (!track || handled.has(handle) || !handle.getClientRects().length) return;
    if (!handle.classList.contains('handler_bg')) return;
    const rect = handle.getBoundingClientRect();
    const trackRect = track.getBoundingClientRect();
    const scale = track.offsetWidth ? trackRect.width / track.offsetWidth : 1;
    const left = trackRect.left + (track.clientLeft || 0) * scale;
    const width = track.clientWidth ? track.clientWidth * scale : trackRect.width;
    const distance = width - rect.width;
    // 已拖动、成功或尚未布局的控件不再自动操作。
    if (distance <= 0 || rect.width <= 0 || Math.abs(rect.left - left) > 1) return;

    handled.add(handle);
    attempts++;
    const controller = new AbortController();
    active = controller;
    void Promise.resolve()
      .then(() => drag({ handle, track, distance, eventTarget: doc, signal: controller.signal }))
      .catch((error) => {
        if (!controller.signal.aborted) onError(error);
      })
      .finally(() => {
        if (active === controller) active = null;
        schedule();
      });
  };
  const schedule = () => {
    if (!stopped && !active && attempts < MAX_ATTEMPTS && frame === null) {
      frame = view.requestAnimationFrame(scan);
    }
  };
  const observer = new view.MutationObserver(schedule);
  const onUserPress = (event) => {
    if (event.isTrusted && event.target?.closest('.slider-wrapper')) stop();
  };
  const onPageHide = (event) => {
    active?.abort();
    if (!event.persisted) stop();
  };
  const stop = () => {
    if (stopped) return;
    stopped = true;
    observer.disconnect();
    if (frame !== null) view.cancelAnimationFrame(frame);
    frame = null;
    active?.abort();
    doc.removeEventListener('mousedown', onUserPress, true);
    doc.removeEventListener('touchstart', onUserPress, true);
    doc.removeEventListener('visibilitychange', schedule);
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
  doc.addEventListener('mousedown', onUserPress, true);
  doc.addEventListener('touchstart', onUserPress, true);
  doc.addEventListener('visibilitychange', schedule);
  view.addEventListener('resize', schedule);
  view.addEventListener('pageshow', schedule);
  view.addEventListener('pagehide', onPageHide);
  schedule();
  return stop;
}
