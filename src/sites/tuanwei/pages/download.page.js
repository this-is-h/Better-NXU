import { getContext } from '../../../context.js';
import { getGMValue } from '../../../config/gm-store.js';
import { isTuanweiDownloadRoute } from '../../../utils/route-guards.js';
import { autoDownloadAttachment } from '../components/auto-download.js';
import {
  installNotification,
  toast,
  removeToastHandle,
  updateToastHandle,
} from '../../../libraries/notification.js';
import { MyConsole } from '../../../utils/console.js';

const console = MyConsole('[tuanwei.download]');
let task;
export function register() {
  if (!isTuanweiDownloadRoute(getContext())) {
    console('未匹配团委附件下载入口，停止自动下载', '', 'info');
    return;
  }
  if (!getGMValue('TuanWei.autoDownload')) {
    console('TuanWei.autoDownload 未开启，跳过自动下载', '', 'info');
    return;
  }
  if (task) return task;
  installNotification();
  let progressToast = null;
  let active = true;
  const clearProgress = () => {
    if (progressToast) removeToastHandle(progressToast);
    progressToast = null;
  };
  const finishProgress = (type, message, duration) => {
    if (progressToast)
      updateToastHandle(progressToast, { type, title: message, progress: null, meta: null, duration });
    else toast(type, message, duration / 1000);
    progressToast = null;
  };
  const onPageHide = () => {
    console('页面已离开，停止自动下载流程', '', 'info');
    active = false;
    clearProgress();
  };
  window.addEventListener('pagehide', onPageHide, { once: true });
  task = autoDownloadAttachment({
    autoClose: getGMValue('TuanWei.autoDownloadClose') === true,
    report: (message, type = 'info', progress) => {
      if (!active) return;
      console(message, '', 'info');
      if (type === 'success') {
        finishProgress('success', message, 3000);
      } else {
        if (!progressToast) progressToast = toast('loading', message, 0);
        updateToastHandle(progressToast, {
          title: message,
          progress: progress ?? null,
          meta: progress === undefined ? null : `${Math.round(progress * 100)}%`,
        });
      }
    },
  })
    .then((result) => {
      if (active && result === 'manual') {
        console('已停止自动下载，请手动完成', '', 'info');
        finishProgress('info', '已停止自动下载，请手动完成', 4000);
      }
    })
    .catch((error) => {
      if (!active) return;
      console('自动下载异常终止，页面已保留，可手动下载', error, 'error');
      finishProgress('error', `${error?.message || '自动下载失败'}；页面已保留，可手动下载。`, 6000);
    })
    .finally(() => {
      clearProgress();
      window.removeEventListener('pagehide', onPageHide);
    });
  return task;
}
