/**
 * 用浏览器事件拖动指定控件。仅负责轨迹与生命周期，不判断验证结果。
 * 调用方提供轨道、水平位移和移动事件目标；距离单位为视口 CSS 像素。
 * feedback 用于无缺口滑块：按实际位移减速、试探末端并在释放前校正。
 * isPending 由站点判断控件是否还需要操作；退出时只释放事件，不回拉或报告拖动失败。
 */
export function dragSlider({
  handle,
  track,
  distance,
  eventTarget = handle?.ownerDocument,
  feedback = false,
  signal,
  timeoutMs = 5000,
  isPending = () => true,
}) {
  return new Promise((resolve, reject) => {
    signal?.throwIfAborted();
    if (!isPending()) return resolve();
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
    const origin = rect.left - track.getBoundingClientRect().left;
    let lastMoveAt = startedAt;
    let animationFrame;
    let releaseTimer;
    let pressed = false;
    let pointerPressed = false;
    let finished = false;
    let releasing = false;
    let x = startX;
    let y = startY;
    let goal = distance + 5;
    let correcting = false;
    let previousOffset = 0;
    let stalled = 0;
    let moveCount = 0;
    let nextMoveAt = startedAt;

    const emit = (target, type, x, y, buttons) => {
      const isPointer = type.startsWith('pointer');
      const Event = isPointer ? view.PointerEvent : view.MouseEvent;
      target.dispatchEvent(
        new Event(type, {
          bubbles: true,
          cancelable: true,
          view,
          button: 0,
          buttons,
          clientX: x,
          clientY: y,
          screenX: (view.screenX || 0) + x,
          screenY: (view.screenY || 0) + y,
          ...(isPointer ? { pointerId: 1, pointerType: 'touch', isPrimary: true } : {}),
        })
      );
    };
    const emitCleanup = (type, x, y, buttons) => {
      const detached = eventTarget !== doc && eventTarget.isConnected === false;
      emit(eventTarget, type, x, y, buttons);
      // 节点移除后事件不再冒泡，仍需释放 document 上的拖动监听。
      if (detached) emit(doc, type, x, y, buttons);
    };
    const move = (nextX, nextY) => {
      x = nextX;
      y = nextY;
      if (pointerPressed) emit(eventTarget, 'pointermove', x, y, 1);
      if (!finished && isPending()) emit(eventTarget, 'mousemove', x, y, 1);
    };
    const finish = (error) => {
      if (finished) return;
      const failed = error && isPending();
      finished = true;
      view.cancelAnimationFrame(animationFrame);
      clearTimeout(deadline);
      clearTimeout(releaseTimer);
      signal?.removeEventListener('abort', abort);
      if (error && (pressed || pointerPressed)) {
        // 仍待验证的异常回到起点；已退出验证的控件在当前位置释放，避免扰动成功状态。
        const events = [
          ...(failed && pointerPressed ? ['pointermove'] : []),
          ...(failed && pressed ? ['mousemove'] : []),
          ...(pointerPressed ? [failed ? 'pointercancel' : 'pointerup'] : []),
          ...(pressed ? ['mouseup'] : []),
        ];
        for (const type of events) {
          try {
            emitCleanup(type, failed ? startX : x, failed ? startY : y, type.endsWith('move') ? 1 : 0);
          } catch {
            /* 单个监听器失败也要尝试释放其余事件，保留原错误。 */
          }
        }
      }
      failed ? reject(error) : resolve();
    };
    const abort = () => finish(signal.reason ?? new Error('滑块拖动已取消'));
    const release = () => {
      if (releasing || finished) return;
      releasing = true;
      if (pointerPressed) {
        emitCleanup('pointerup', x, y, 0);
        pointerPressed = false;
      }
      if (finished) return;
      const releaseMouse = () => {
        if (finished) return;
        try {
          emitCleanup('mouseup', x, y, 0);
          pressed = false;
          finish();
        } catch (error) {
          finish(error);
        }
      };
      // 末段移动、指针释放和鼠标释放分开，让控件有时间更新验证状态。
      if (feedback && isPending()) releaseTimer = setTimeout(releaseMouse, 60 + Math.random() * 40);
      else releaseMouse();
    };
    const feedbackTick = (now) => {
      if (now < nextMoveAt) return;
      // 相对轨道读取展示位移，覆盖 left、margin、transform 及父节点移动，保留小数和符号。
      const offset = handle.getBoundingClientRect().left - track.getBoundingClientRect().left - origin;
      if (!Number.isFinite(offset)) throw new Error('无法读取滑块位置');
      stalled = moveCount > 0 && Math.abs(offset - previousOffset) < 0.01 ? stalled + 1 : 0;
      previousOffset = offset;
      if (stalled >= 6 && offset < distance - 1) throw new Error('滑块未到达末端，请手动完成验证');

      if ((correcting ? Math.abs(goal - offset) <= 1 : offset > goal + 1) || stalled >= 6) {
        if (correcting) {
          release();
          return true;
        }
        // 探过末端后回调；控件已被轨道限位时，以实际端点为准，避免回拉后再次失效。
        goal = stalled >= 6 ? offset : distance;
        correcting = true;
        stalled = 0;
      }
      const remaining = goal - offset;
      const ratio = Math.abs(remaining) / distance;
      // 末段按剩余距离收敛，只在贴近端点时使用小步，避免整段逐个亚像素挪动。
      const tailStep = Math.min(3, Math.max(0.75, Math.abs(remaining) * 0.35));
      const step = moveCount === 0 ? 20 : ratio > 0.5 ? 5 : ratio > 0.25 ? 3 : ratio > 0.1 ? 2 : tailStep;
      const delta = (step + 0.5 + Math.random() * 0.5) * (remaining < 0 ? -1 : 1);
      let delay =
        ratio > 0.5
          ? 0.2 + Math.random() * 0.3
          : ratio > 0.1
            ? 8 + Math.random() * 4
            : 10 + Math.random() * 4;
      // 短轨道的整体减速不再叠加到末端校正；每次仍等待下一帧读取实际位移。
      if (ratio > 0.1) {
        if (distance <= 100) delay *= 5;
        else if (distance <= 130) delay *= 2;
      }
      nextMoveAt = now + delay;
      moveCount++;
      move(x + delta, startY + Math.sin(moveCount / 8) * verticalOffset);
      return false;
    };
    const tick = (now) => {
      if (finished) return;
      try {
        signal?.throwIfAborted();
        if (!isPending()) {
          release();
          return;
        }
        if (!handle.isConnected || doc.hidden) throw new Error('滑块控件已移除或隐藏');
        if (feedback) {
          if (!handle.getClientRects().length) throw new Error('滑块控件已移除或隐藏');
          if (!feedbackTick(now) && !finished) animationFrame = view.requestAnimationFrame(tick);
          return;
        }
        const progress = Math.min(1, Math.max(0, (now - startedAt) / durationMs));
        // 保留 IDS 采样间隔；高刷新率屏幕无需每帧派发事件。
        if (progress < 1 && now - lastMoveAt < 20) {
          animationFrame = view.requestAnimationFrame(tick);
          return;
        }
        if (!handle.getClientRects().length) throw new Error('滑块控件已移除或隐藏');
        const eased = progress * progress * (3 - 2 * progress);
        // 按实际经过的时间推进，避免逐点 setTimeout 的延迟累计；保持准确终点。
        move(startX + distance * eased, startY + Math.sin(progress * Math.PI) * verticalOffset);
        lastMoveAt = now;
        if (finished) return;
        if (progress === 1) {
          release();
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
      if (feedback && typeof view.PointerEvent === 'function') {
        pointerPressed = true;
        emit(handle, 'pointerdown', startX, startY, 1);
      }
      if (finished) return;
      pressed = true;
      emit(handle, 'mousedown', startX, startY, 1);
      if (!finished) animationFrame = view.requestAnimationFrame(tick);
    } catch (error) {
      finish(error);
    }
  });
}
