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
    const startX = rect.left + rect.width * (0.4 + Math.random() * 0.2);
    const startY = rect.top + rect.height * (0.4 + Math.random() * 0.2);
    const durationMs = Math.min(700, Math.max(420, 320 + distance * 1.4) + Math.random() * 40);
    const verticalOffset = (Math.random() < 0.5 ? -1 : 1) * (1 + Math.random() * 2);
    const startedAt = view.performance.now();
    let lastMoveAt = startedAt;
    let animationFrame;
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
      view.cancelAnimationFrame(animationFrame);
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
    const tick = (now) => {
      if (finished) return;
      try {
        signal?.throwIfAborted();
        if (!slider.isConnected) throw new Error('滑块控件已移除或隐藏');
        const progress = Math.min(1, Math.max(0, (now - startedAt) / durationMs));
        // 学校只采集间隔至少 20ms 的移动点；高刷新率屏幕无需每帧派发事件。
        if (progress < 1 && now - lastMoveAt < 20) {
          animationFrame = view.requestAnimationFrame(tick);
          return;
        }
        if (!slider.getClientRects().length) throw new Error('滑块控件已移除或隐藏');
        const eased = progress * progress * (3 - 2 * progress);
        // 按实际经过的时间推进，避免逐点 setTimeout 的延迟累计；保持准确终点。
        emit(
          doc,
          'mousemove',
          startX + distance * eased,
          startY + Math.sin(progress * Math.PI) * verticalOffset,
          1
        );
        lastMoveAt = now;
        if (finished) return;
        if (progress === 1) {
          pressed = false;
          emit(doc, 'mouseup', startX + distance, startY, 0);
          finish();
        } else {
          animationFrame = view.requestAnimationFrame(tick);
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
      if (!finished) animationFrame = view.requestAnimationFrame(tick);
    } catch (error) {
      finish(error);
    }
  });
}
