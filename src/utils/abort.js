/** Stop waiting even when an underlying worker/API does not reject on cancellation. */
export async function withAbort(promise, signal) {
  let abort;
  const interrupted = new Promise((_, reject) => {
    abort = () => reject(signal.reason);
    signal.addEventListener('abort', abort, { once: true });
    if (signal.aborted) abort();
  });
  try {
    return await Promise.race([promise, interrupted]);
  } finally {
    signal.removeEventListener('abort', abort);
  }
}
