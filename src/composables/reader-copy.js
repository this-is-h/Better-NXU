import { GM_setClipboard } from '#gm';
import { installNotification, toast } from '../libraries/notification.js';
import { MyConsole } from '../utils/console.js';

const console = MyConsole('[reader.copy]');
const installations = new WeakMap();

/** 知网与万方共用的复制生命周期；不读取 HTML，不记录正文。 */
export function installReaderCopy(doc = document) {
  const existing = installations.get(doc);
  if (existing) return existing;
  installNotification();
  const style = doc.createElement('style');
  style.textContent = 'h1.Chapter { user-select: text !important; -webkit-user-select: text !important; }';
  (doc.head || doc.documentElement).appendChild(style);
  const copy = (event) => {
    // 自动拖动使用合成 mouseup；不能将旧选区误写到剪贴板。
    if (!event.isTrusted || event.button !== 0) return;
    const selection = doc.defaultView.getSelection();
    if (!selection?.rangeCount) return;
    const text = selection.toString();
    if (!text.trim()) return;
    try {
      GM_setClipboard?.(text);
    } catch (error) {
      console('自动复制失败', { name: error?.name }, 'warn');
      toast('warning', '自动复制失败，请使用浏览器复制功能', 3);
    }
  };
  const onPageHide = (event) => {
    if (!event.persisted) cleanup();
  };
  const cleanup = () => {
    doc.removeEventListener('mouseup', copy, true);
    doc.defaultView.removeEventListener('pagehide', onPageHide);
    style.remove();
    installations.delete(doc);
  };
  installations.set(doc, cleanup);
  doc.addEventListener('mouseup', copy, true);
  doc.defaultView.addEventListener('pagehide', onPageHide);
  toast('success', '已开启复制，选中文字即可自动复制到剪贴板~', 3);
  return cleanup;
}
