import { getContext } from '../context.js';
import { resolveLibraryReader } from '../utils/library-reader.js';
import { installReaderCopy } from './reader-copy.js';
import { toast } from '../libraries/notification.js';
import { MyConsole } from '../utils/console.js';

/** 新增仅复制的平台只需增加平台规则；专用滑块由该站点注入实现。 */
export function createLibraryReaderRegistration(id, installSlider) {
  const console = MyConsole(`[${id}.reader]`);
  return async () => {
    const platform = resolveLibraryReader(getContext());
    if (platform?.id !== id) {
      console('未匹配当前平台阅读页，停止阅读增强', '', 'info');
      return;
    }
    if (platform.copy) installReaderCopy();
    if (platform.slider && installSlider) {
      installSlider({ onError: () => toast('warning', '阅读滑块自动拖动失败，请手动完成验证', 4) });
    }
    console(
      '阅读增强监听已安装',
      { copy: Boolean(platform.copy), slider: Boolean(platform.slider && installSlider) },
      'info'
    );
  };
}
