import { onScopeDispose, shallowRef } from 'vue';
import { searchTeachers } from './teacher-search.js';

const BATCH_SIZE = 30;
const MAX_BATCH_PAGES = 3;
const PAGE_INTERVAL_MS = 200;
const BATCH_INTERVAL_MS = 1000;

function delayRequest(milliseconds, signal) {
  return new Promise((resolve, reject) => {
    const onAbort = () => {
      clearTimeout(timer);
      signal.removeEventListener('abort', onAbort);
      reject(new DOMException('教师查询已取消', 'AbortError'));
    };
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', onAbort);
      resolve();
    }, milliseconds);
    signal.addEventListener('abort', onAbort, { once: true });
    if (signal.aborted) onAbort();
  });
}

export function useTeacherSearch(request = searchTeachers) {
  const teachers = shallowRef([]);
  const loading = shallowRef(false);
  const finished = shallowRef(true);
  const error = shallowRef('');
  const cancelled = shallowRef(false);
  let keyword = '';
  let nextPage = 1;
  let version = 0;
  let controller = null;
  let nextRequestAt = 0;

  function cancel() {
    version++;
    controller?.abort();
    controller = null;
    loading.value = false;
    cancelled.value = true;
    error.value = '';
  }

  async function loadBatch(initial = false) {
    if (!keyword || loading.value || finished.value || cancelled.value || error.value) return;
    const requestVersion = version;
    const currentController = new AbortController();
    controller = currentController;
    loading.value = true;
    error.value = '';
    let loaded = 0;
    try {
      for (let count = 0; count < MAX_BATCH_PAGES && loaded < BATCH_SIZE; count++) {
        const wait =
          count > 0
            ? PAGE_INTERVAL_MS
            : initial
              ? Math.max(0, nextRequestAt - Date.now())
              : BATCH_INTERVAL_MS;
        if (wait > 0) await delayRequest(wait, currentController.signal);
        if (requestVersion !== version) return;
        nextRequestAt = Date.now() + BATCH_INTERVAL_MS;
        const result = await request(keyword, nextPage, { signal: currentController.signal });
        if (requestVersion !== version) return;
        if (!result?.success) throw new Error(result?.msg || '教师查询失败，请稍后重试');
        if (!Array.isArray(result.data)) throw new Error('教师查询返回的数据异常，请稍后重试');
        const page = Number(result.page?.[0]);
        const totalPages = Number(result.page?.[1]);
        const empty = nextPage === 1 && totalPages === 0 && result.data.length === 0;
        if (
          !Number.isSafeInteger(page) ||
          !Number.isSafeInteger(totalPages) ||
          page !== nextPage ||
          (!empty && (totalPages < page || result.data.length === 0))
        ) {
          throw new Error('教师查询返回的数据异常，请稍后重试');
        }
        teachers.value = teachers.value.concat(result.data);
        nextPage = page + 1;
        loaded += result.data.length;
        finished.value = page >= totalPages;
        if (finished.value) break;
      }
    } catch (cause) {
      if (requestVersion === version && cause?.name !== 'AbortError') {
        error.value = cause?.message || '教师查询失败，请稍后重试';
      }
    } finally {
      if (requestVersion === version) {
        loading.value = false;
        controller = null;
      }
    }
  }

  function loadMore() {
    return loadBatch();
  }

  function retry() {
    if (!error.value || cancelled.value) return;
    error.value = '';
    return loadBatch();
  }

  async function search(name) {
    cancel();
    keyword = String(name || '').trim();
    nextPage = 1;
    teachers.value = [];
    error.value = '';
    cancelled.value = false;
    finished.value = !keyword;
    const requestVersion = version;
    await loadBatch(true);
    if (requestVersion === version) await loadBatch();
  }

  onScopeDispose(cancel);
  return { teachers, loading, finished, error, cancelled, search, loadMore, retry, cancel };
}
