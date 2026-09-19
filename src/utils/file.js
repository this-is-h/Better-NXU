/**
 * 文件下载与标签页关闭工具
 * 对应 1.x：Better NXU.user.js 行 1689-1702（downloadTextFile）、2275-2283（escapeHtml）、2313-2322（CloseWin）
 * 依赖：#gm（monkeyWindow）、无 UI 依赖
 * 入口/被谁调用：B6/B7 课表/工具导出（downloadTextFile）；各 toast/页面错误提示（escapeHtml）；
 *                failed/autoClose/NavBar（closeCurrentTab）
 *
 * 说明：
 *  - downloadTextFile：使用原生 `<a download>` 下载页面生成的 Blob，避免 ScriptCat 的 GM.download
 *    无法读取页面 Blob URL 时先留下失败记录再触发回退下载。默认 MIME 与 1.x 一致。
 *  - escapeHtml：1.x 行 2275-2283 逐字迁移——5 实体转义。与 libraries/markdown.js 的 escapeHtml 同形态
 *    （后者 marked 降级用）；本模块作通用 HTML 转义入口（toast 错误文案等）。两处定义与 1.x 一致，不合并以
 *    保持 libraries/utils 各自自包含（libraries/markdown.js 不应反向依赖 utils，见 02 §3 边界）。
 *  - closeCurrentTab：使用 vite-plugin-monkey 官方 `monkeyWindow.close()`，由 autoGrant 收集 `window.close` 权限。
 *
 * 实体字面量避码：与 libraries/markdown.js 同款用字符串拼接构造实体，避免源码直写 </>/" 等
 *  被本仓库某些文档工具管道解码回原字符。
 */
import { monkeyWindow } from '#gm';

/**
 * 把文本内容作为文件下载（触发浏览器"另存为"）。
 * 本地 Blob 直接使用隐藏链接下载，并在 100ms 后回收链接和 Object URL。
 * @param {string} content - 文件文本内容
 * @param {string} filename - 下载文件名（含扩展名）
 * @param {string} [mimeType='application/json;charset=utf-8'] - Blob MIME 类型；1.x 硬编码 JSON，2.0 可改
 */
export async function downloadTextFile(content, filename, mimeType = 'application/json;charset=utf-8') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  try {
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    URL.revokeObjectURL(url);
    throw error;
  }
  setTimeout(() => {
    link.remove();
    URL.revokeObjectURL(url);
  }, 100);
}

// 实体拼接片段（避免源码直写被工具管道解码；与 libraries/markdown.js 同思路）。
const AMP = '&' + 'amp;';
const LT = '&' + 'lt;';
const GT = '&' + 'gt;';
const QUOT = '&' + 'quot;';
const APOS = '&' + '#39;';

/**
 * 最小 HTML 转义（5 实体）。1.x 行 2275-2283 逐字迁移。用于把任意文本安全嵌入 HTML（如 toast 错误文案）。
 * @param {*} value
 * @returns {string}
 */
export function escapeHtml(value) {
  return String(value || '').replace(
    /[&<>"']/g,
    (character) =>
      ({
        '&': AMP,
        '<': LT,
        '>': GT,
        '"': QUOT,
        "'": APOS,
      })[character]
  );
}

/**
 * 关闭当前页面标签。window.close 通过 vite-plugin-monkey 官方客户端的 monkeyWindow 取得，
 * 由 autoGrant 生成对应权限；管理器拒绝关闭时静默返回 false。
 * @returns {boolean} 是否成功调用关闭 API
 */
export function closeCurrentTab() {
  try {
    if (typeof monkeyWindow?.close !== 'function') return false;
    monkeyWindow.close();
    return true;
  } catch {
    return false;
  }
}
