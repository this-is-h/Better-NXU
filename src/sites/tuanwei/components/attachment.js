import { GM_download } from '#gm';
import { fetchWithTimeout } from '../../../utils/fetch.js';
import { withAbort } from '../../../utils/abort.js';

/** Only accept an attachment response, never save a CAPTCHA/error/login HTML page. */
export function attachmentName(response) {
  const disposition = response.headers.get('content-disposition') || '';
  if (!response.ok || !/^attachment(?:\s*;|\s*$)/i.test(disposition)) return null;
  if (/^(?:text\/html|application\/xhtml\+xml)(?:;|$)/i.test(response.headers.get('content-type') || ''))
    return null;
  const extended = disposition.match(/(?:^|;)\s*filename\*\s*=\s*UTF-8'[^']*'([^;]+)/i);
  const basic = disposition.match(/(?:^|;)\s*filename\s*=\s*(?:"([^"]*)"|([^;]*))/i);
  let name = extended?.[1] || basic?.[1] || basic?.[2] || '团委附件';
  try {
    name = decodeURIComponent(name.trim());
  } catch {
    /* Preserve legacy filenames. */
  }
  // eslint-disable-next-line no-control-regex -- Remove filename control characters from server input.
  return name.replace(/[\x00-\x1f\x7f/\\:*?"<>|]/g, '_').replace(/^[.\s]+|[.\s]+$/g, '') || '团委附件';
}

export function fetchAttachment(url, signal, fetchImpl = window.fetch.bind(window)) {
  return fetchWithTimeout(
    fetchImpl,
    url,
    { credentials: 'same-origin', cache: 'no-store', redirect: 'error' },
    {
      signal,
      timeoutMs: 120000,
      async consumeResponse(response) {
        const name = attachmentName(response);
        if (!name) {
          await response.body?.cancel();
          // Only a normal HTML response can be a rejected CAPTCHA; HTTP errors stop retries.
          if (response.ok && /^text\/html(?:;|$)/i.test(response.headers.get('content-type') || ''))
            return null;
          throw new Error('服务器未返回有效附件');
        }
        const blob = await response.blob();
        if (!blob.size) throw new Error('附件内容为空');
        return { name, blob };
      },
    }
  );
}

/** Data URLs work across ScriptCat's page/background boundary; page Blob URLs do not. */
export async function saveAttachment({ name, blob }, signal) {
  signal.throwIfAborted();
  if (typeof GM_download !== 'function') throw new Error('下载 API 不可用，请更新脚本并允许下载权限');
  const reader = new FileReader();
  const abortReader = () => reader.abort();
  signal.addEventListener('abort', abortReader, { once: true });
  let url;
  try {
    url = await withAbort(
      new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('附件读取失败'));
        reader.readAsDataURL(blob);
      }),
      signal
    );
  } finally {
    signal.removeEventListener('abort', abortReader);
  }
  signal.throwIfAborted();
  let handle;
  let timer;
  const abort = () => handle?.abort?.();
  signal.addEventListener('abort', abort, { once: true });
  try {
    await withAbort(
      new Promise((resolve, reject) => {
        timer = setTimeout(() => {
          abort();
          reject(new Error('等待下载完成超时，请检查浏览器下载列表'));
        }, 120000);
        handle = GM_download({
          url,
          name,
          downloadMode: 'browser',
          saveAs: false,
          onload: resolve,
          onerror: () => reject(new Error('附件下载失败，请检查下载权限或手动下载')),
          ontimeout: () => reject(new Error('附件下载超时')),
        });
      }),
      signal
    );
    signal.throwIfAborted();
  } finally {
    clearTimeout(timer);
    signal.removeEventListener('abort', abort);
  }
}
