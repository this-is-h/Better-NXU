/**
 * jwgl/pages/course-table-container.page — 课表容器页（iframe 自适应：监听 COURSE_BEAUTIFY_CHANGED）
 * 对应 1.x：Better NXU.user.js 行 3105-3130（jwglCourseIframe）
 * 依赖：composables/use-wait-or-toast（等待 iframe 失败转 toast）、utils/console
 * 入口/被谁调用：router 命中 jwgl/course-table-container.page.js → main.js 调 register()
 *
 * 1.x 行 2495-2498/2580-2583/2377-2380 三形态命中 courseTableForStd.action & method=stdHome 时 `Basic(); jwglCourseIframe();`。
 * jwglCourseIframe 已是原生 DOM，2.0 逐字迁。
 *
 * 与 1.x 行为等价点（C5，逐字对齐行 3105-3130）：
 *  - waitForElement('#contentListFrame', 15s) 后再 waitForElement(同选择器, 15s, contentWindow.document 存在)
 *    （1.x 行 3107-3112，分两段确保 iframe 与其文档就绪）
 *  - resize：读 iframe.contentWindow.document.querySelector('table')→iframe.style.height=scrollHeight+100px;否则 100px
 *    （1.x 行 3117-3122）
 *  - 初始 resize 一次 + addEventListener('message') 监听 COURSE_BEAUTIFY_CHANGED 触发再 resize
 *    （1.x 行 3123-3129，子页 course-table.beautify 完成后 postMessage 该类型）
 *  - 框架缺失 toast 'warning'（1.x 行 3113-3116）
 *
 * 验收对齐（03 B6 验收 3）：课表容器 iframe 自适应；COURSE_BEAUTIFY_CHANGED message 仍生效。
 */
import { waitOrToast } from '../../../composables/use-wait-or-toast.js';
import { MyConsole } from '../../../utils/console.js';

const console = MyConsole('[jwgl CourseFrame]');

/**
 * 课表容器页入口：让 iframe 自适应内容高度并监听子页美化完成消息。对应 1.x jwglCourseIframe 行 3105-3130。
 */
export async function register() {
  console('进入课表容器页');
  // 1.x 行 3107-3109：等待 #contentListFrame 出现。
  const iframe = await waitOrToast('#contentListFrame', {
    timeout: 15000,
    level: 'warning',
    duration: 4,
  });
  if (!iframe) return;
  // 1.x 行 3109-3112：再等其 contentWindow.document 就绪（iframe 文档可能滞后）。
  const ready = await waitOrToast('#contentListFrame', {
    timeout: 15000,
    predicate: (element) => Boolean(element.contentWindow?.document),
    level: 'warning',
    duration: 4,
  });
  if (!ready) return;

  // 1.x 行 3117-3122：按 iframe 内 table 实际高度调整 iframe 高度。
  const resize = () => {
    const iframeDocument = iframe.contentWindow?.document;
    if (!iframeDocument) return;
    const table = iframeDocument.querySelector('table');
    iframe.style.height = table ? `${table.scrollHeight + 100}px` : '100px';
  };
  resize();

  // 1.x 行 3124-3129：监听子页（course-table）postMessage COURSE_BEAUTIFY_CHANGED → 再 resize（美化后高度变化）。
  window.addEventListener('message', (event) => {
    if (event.data?.type === 'COURSE_BEAUTIFY_CHANGED') {
      resize();
    }
  });
}
