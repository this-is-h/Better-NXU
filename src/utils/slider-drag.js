/**
 * 用浏览器鼠标事件拖动指定控件。仅负责轨迹与生命周期，不判断验证结果。
 * 调用方提供轨道、水平位移和移动事件目标；距离单位为视口 CSS 像素。
 */
export function dragSlider({
  handle,
  track,
  distance,
  eventTarget = handle?.ownerDocument,
  signal,
  timeoutMs = 5000,
}) {
  return new Promise((resolve, reject) => {
    signal?.throwIfAborted();
    const doc = handle?.ownerDocument;
    const view = doc?.defaultView;
    if (!doc || !view || !track || !eventTarget || !handle.isConnected || !handle.getClientRects().length)
      throw new Error('滑块控件不可用');
    const rect = handle.getBoundingClientRect();
    const maxDistance = track.getBoundingClientRect().width - rect.width;
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
        // 回到起点再释放，避免页面按当前拖动位置提交半截轨迹。
        try {
          emit(eventTarget, 'mousemove', startX, startY, 1);
          emit(eventTarget, 'mouseup', startX, startY, 0);
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
        if (!handle.isConnected) throw new Error('滑块控件已移除或隐藏');
        const progress = Math.min(1, Math.max(0, (now - startedAt) / durationMs));
        // 保留 IDS 采样间隔；高刷新率屏幕无需每帧派发事件。
        if (progress < 1 && now - lastMoveAt < 20) {
          animationFrame = view.requestAnimationFrame(tick);
          return;
        }
        if (!handle.getClientRects().length) throw new Error('滑块控件已移除或隐藏');
        const eased = progress * progress * (3 - 2 * progress);
        // 按实际经过的时间推进，避免逐点 setTimeout 的延迟累计；保持准确终点。
        emit(
          eventTarget,
          'mousemove',
          startX + distance * eased,
          startY + Math.sin(progress * Math.PI) * verticalOffset,
          1
        );
        lastMoveAt = now;
        if (finished) return;
        if (progress === 1) {
          pressed = false;
          emit(eventTarget, 'mouseup', startX + distance, startY, 0);
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
      emit(handle, 'mousedown', startX, startY, 1);
      if (!finished) animationFrame = view.requestAnimationFrame(tick);
    } catch (error) {
      finish(error);
    }
  });
}
