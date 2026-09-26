import { getContext } from '../../../context.js';
import { getGMValue } from '../../../config/gm-store.js';
import { isTuanweiDownloadRoute } from '../../../utils/route-guards.js';
import { autoDownloadAttachment } from '../components/auto-download.js';
import { installNotification, toast, removeToastHandle } from '../../../libraries/notification.js';

let task;
export function register() {
  if (!isTuanweiDownloadRoute(getContext()) || !getGMValue('TuanWei.autoDownload')) return;
  if (task) return task;
  installNotification();
  let progressToast = null;
  let active = true;
  const clearProgress = () => {
    if (progressToast) removeToastHandle(progressToast);
    progressToast = null;
  };
  const onPageHide = () => {
    active = false;
    clearProgress();
  };
  window.addEventListener('pagehide', onPageHide, { once: true });
  task = autoDownloadAttachment({
    autoClose: getGMValue('TuanWei.autoDownloadClose') === true,
    report: (message, type = 'info') => {
      if (!active) return;
      clearProgress();
      if (type === 'success') toast('success', message, 3);
      else progressToast = toast('info', message, 0);
    },
  })
    .then((result) => {
      if (active && result === 'manual') {
        clearProgress();
        toast('info', '已停止自动下载，请手动完成', 4);
      }
    })
    .catch((error) => {
      if (!active) return;
      clearProgress();
      toast('error', `${error?.message || '自动下载失败'}；页面已保留，可手动下载。`, 6);
    })
    .finally(() => {
      clearProgress();
      window.removeEventListener('pagehide', onPageHide);
    });
  return task;
}
