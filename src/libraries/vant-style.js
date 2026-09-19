import { GM_addStyle, GM_getResourceText } from '#gm';
import { MyConsole } from '../utils/console.js';

let installed = false;
const console = MyConsole('[vant.style]');

/** 仅在实际挂载 Vant 页面时注入一次全量组件样式。 */
export function installVantStyle() {
  if (installed) return;
  const vantCss = GM_getResourceText?.('vant-css');
  if (typeof vantCss !== 'string' || vantCss.trim() === '') {
    console('Vant CSS 资源不可用，跳过样式注入', '', 'error');
    return;
  }

  if (typeof GM_addStyle === 'function') {
    GM_addStyle(vantCss);
  } else {
    const style = document.createElement('style');
    style.dataset.betterNxuVant = 'true';
    style.textContent = vantCss;
    (document.head || document.documentElement).appendChild(style);
  }
  installed = true;
}
