/**
 * FontAwesome 图标注入助手
 * 对应 1.x：Better NXU.user.js 行 178（AddNotification 内）与 行 4462（tools/failed 页）
 *          `GM_addStyle(GM_getResourceText("svg-logo").replace(/\.\.\/webfonts/g, "<cdn 路径>"))`
 * 依赖：@resource svg-logo（FontAwesome all.min.css，头部已声明带 sha384）+ GM_addStyle + GM_getResourceText
 * 入口/被谁调用：composables/use-app-page.js（挂页时调 installFontAwesome）；各 sites/pages 需要图标的环境
 *
 * 说明：
 *  svg-logo 指向 font-awesome 6.2.1 的 all.min.css，其内部用相对路径 `../webfonts/...` 引字体文件，
 *  但 @resource 拉的 CSS 没有 base，相对路径会解析到当前站点（NXU 域名根下无此目录 → 图标全是豆腐块）。
 *  1.x 的修法：把 CSS 文本里所有 `../webfonts` 替换成同一个 font-awesome 6.2.1 的 CDN webfonts 绝对路径，
 *  让浏览器去该 CDN 拿字体。2.0 逐字保留该行为（C5 行为等价）。
 *
 * vite-plugin-monkey 8.x 已因供应链风险弃用 BootCDN/Staticfile。字体路径使用固定版本的 jsDelivr npm 资源，
 * 与 `svg-logo` 中 FontAwesome 6.2.1 的文件名和目录结构一致。
 *
 * GM_addStyle / GM_getResourceText 通过 vite-plugin-monkey 官方 ESM 客户端别名 #gm 导入。
 */
import { GM_addStyle, GM_getResourceText } from '#gm';

const FONT_AWESOME_WEBFONTS_URL = 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.2.1/webfonts';

let installed = false;

/**
 * 注入 FontAwesome 图标样式：取 @resource svg-logo 的 CSS 文本，把 `../webfonts` 重写为 CDN 绝对路径后 GM_addStyle。
 * 1.x 行 178 / 行 4462 逐字迁移。幂等：installed 标志位跳过重复注入（notification.js 现并入调用，与 use-app-page.js
 * 显式调用可能叠加；重复 GM_addStyle 同一 CSS 仅多挂 style 标签无视觉影响，但仍幂等折叠）。
 */
export function installFontAwesome() {
  if (installed) return;
  const css = GM_getResourceText?.('svg-logo');
  if (!css) return; // @resource 未就绪时静默跳过（CSS 注入失败不致命，仅图标变豆腐块）
  GM_addStyle?.(css.replace(/\.\.\/webfonts/g, FONT_AWESOME_WEBFONTS_URL));
  installed = true;
}
