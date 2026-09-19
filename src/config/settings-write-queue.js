/**
 * Serialize settings writes and coalesce pending writes to the same key.
 * A value changed repeatedly while an earlier write is running is persisted once with its latest value.
 */
export function createSettingsWriteQueue(write, onError = () => {}) {
  if (typeof write !== 'function') throw new TypeError('设置写入函数不可用');

  const pending = new Map();
  let drainPromise = null;

  const startDrain = () => {
    if (drainPromise) return drainPromise;
    drainPromise = (async () => {
      while (pending.size) {
        const [name, value] = pending.entries().next().value;
        pending.delete(name);
        try {
          await write(name, value);
        } catch (error) {
          onError(error, name);
        }
      }
    })().finally(() => {
      drainPromise = null;
      if (pending.size) startDrain();
    });
    return drainPromise;
  };

  return {
    enqueue(name, value) {
      pending.set(name, value);
      return startDrain();
    },
    async flush() {
      while (drainPromise || pending.size) {
        await (drainPromise || startDrain());
      }
    },
  };
}
