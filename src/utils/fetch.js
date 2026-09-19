/**
 * Execute a fetch request with an internal timeout while preserving an optional caller signal.
 * Timeout failures use the stable `TimeoutError` name so callers can provide operation-specific text.
 */
export async function fetchWithTimeout(fetchImpl, input, init = {}, options = {}) {
  if (typeof fetchImpl !== 'function') throw new TypeError('fetch 实现不可用');

  const requestedTimeout = Number(options.timeoutMs);
  const timeoutMs = Number.isFinite(requestedTimeout) && requestedTimeout > 0 ? requestedTimeout : 15000;
  const externalSignal = options.signal;
  const controller = new AbortController();
  let timedOut = false;

  const abortFromCaller = () => controller.abort(externalSignal?.reason);
  if (externalSignal?.aborted) {
    const abortError = new Error('请求已取消');
    abortError.name = 'AbortError';
    throw abortError;
  }
  externalSignal?.addEventListener('abort', abortFromCaller, { once: true });

  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);

  try {
    return await fetchImpl(input, { ...init, signal: controller.signal });
  } catch (error) {
    if (timedOut) {
      const timeoutError = new Error(`请求在 ${timeoutMs}ms 内未完成`, { cause: error });
      timeoutError.name = 'TimeoutError';
      throw timeoutError;
    }
    if (externalSignal?.aborted && error?.name !== 'AbortError') {
      const abortError = new Error('请求已取消', { cause: error });
      abortError.name = 'AbortError';
      throw abortError;
    }
    throw error;
  } finally {
    clearTimeout(timer);
    externalSignal?.removeEventListener('abort', abortFromCaller);
  }
}
