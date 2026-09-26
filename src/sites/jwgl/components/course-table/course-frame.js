/** 同步学校课表 iframe 高度；加载和子页通知共用同一条更新路径。 */
const installations = new WeakMap();

export function installCourseFrameResize(iframe) {
  const existing = installations.get(iframe);
  if (existing) return existing;

  const pageWindow = iframe.ownerDocument.defaultView;
  const resize = () => {
    try {
      const frameDocument = iframe.contentWindow?.document;
      const table = frameDocument?.querySelector('table');
      // about:blank、登录重定向和尚未绘制的课表都不应把已有高度压成 100px。
      if (table) iframe.style.height = `${table.scrollHeight + 100}px`;
    } catch {
      // 学校可能把 iframe 重定向到跨源认证页，保留原生布局与手动登录。
    }
  };
  const onMessage = (event) => {
    if (event.source === iframe.contentWindow && event.data?.type === 'COURSE_BEAUTIFY_CHANGED') {
      resize();
    }
  };
  const onPageHide = (event) => {
    // BFCache 恢复会沿用当前文档，无计时器的监听器应随页面一起保留。
    if (!event.persisted) cleanup();
  };
  const cleanup = () => {
    iframe.removeEventListener('load', resize);
    pageWindow.removeEventListener('message', onMessage);
    pageWindow.removeEventListener('pagehide', onPageHide);
    installations.delete(iframe);
  };

  iframe.addEventListener('load', resize);
  pageWindow.addEventListener('message', onMessage);
  pageWindow.addEventListener('pagehide', onPageHide);
  installations.set(iframe, cleanup);
  resize();
  return cleanup;
}
