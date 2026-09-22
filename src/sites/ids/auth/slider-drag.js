/** IDS 原生鼠标拖动适配。项目自有实现，仅针对当前滑块 DOM，不依赖第三方拖动脚本。 */
export function dragIdsSlider(slider, distance, { signal, timeoutMs = 5000 } = {}) {
  return new Promise((resolve, reject) => {
    signal?.throwIfAborted();
    const doc = slider?.ownerDocument;
    const view = doc?.defaultView;
    const container = slider?.closest('.sliderContainer');
    if (!doc || !view || !container || !slider.isConnected || !slider.getClientRects().length)
      throw new Error('滑块控件不可用');
    const rect = slider.getBoundingClientRect();
    const maxDistance = container.getBoundingClientRect().width - rect.width;
    if (!Number.isFinite(distance) || distance <= 0 || distance > maxDistance) {
      throw new Error('滑块距离超出有效范围');
    }
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;
    const steps = 48;
    let step = 0;
    let timer;
    let pressed = false;
    let finished = false;

    const emit = (target, type, x, y, buttons) =>
      target.dispatchEvent(
        new view.MouseEvent(type, {
          bubbles: true,
          cancelable: true,
          view,
          button: 0,
          buttons,
          clientX: x,
          clientY: y,
        })
      );
    const finish = (error) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      clearTimeout(deadline);
      signal?.removeEventListener('abort', abort);
      if (error && pressed) {
        // 学校以 mouseup 的水平位移为 0 终止拖动，避免取消时提交半截轨迹。
        try {
          emit(doc, 'mouseup', startX, startY, 0);
        } catch {
          /* 保留原错误 */
        }
      }
      error ? reject(error) : resolve();
    };
    const abort = () => finish(signal.reason ?? new Error('滑块拖动已取消'));
    const tick = () => {
      if (finished) return;
      try {
        signal?.throwIfAborted();
        if (!slider.isConnected || !slider.getClientRects().length) throw new Error('滑块控件已移除或隐藏');
        step++;
        const progress = step / steps;
        const eased = progress * progress * (3 - 2 * progress);
        // 固定终点与平滑速度曲线；少量纵向位移保证轨迹不退化为单一坐标。
        emit(doc, 'mousemove', startX + distance * eased, startY + Math.sin(progress * Math.PI) * 3, 1);
        if (finished) return;
        if (step === steps) {
          pressed = false;
          emit(doc, 'mouseup', startX + distance, startY, 0);
          finish();
        } else {
          timer = setTimeout(tick, 24 + Math.round(Math.random() * 8));
        }
      } catch (error) {
        finish(error);
      }
    };
    const deadline = setTimeout(() => finish(new Error('滑块拖动超时，请手动完成验证')), timeoutMs);
    signal?.addEventListener('abort', abort, { once: true });
    try {
      pressed = true;
      emit(slider, 'mousedown', startX, startY, 1);
      if (!finished) timer = setTimeout(tick, 24);
    } catch (error) {
      finish(error);
    }
  });
}
