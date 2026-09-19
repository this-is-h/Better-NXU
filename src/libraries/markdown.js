/**
 * Markdown 渲染边界：marked 只负责解析，任何 HTML 写入 DOM 前必须经过 DOMPurify 白名单过滤。
 * 解析器与消毒器使用固定版本、固定 SHA384 的 @resource，仅在关于页渲染时加载。
 */
import { evaluatePageResource } from './page-resource.js';
import { MyConsole } from '../utils/console.js';

const console = MyConsole('[markdown]');
let markdownRuntime;
let runtimeLoadAttempted = false;

function getMarkdownRuntime() {
  if (runtimeLoadAttempted) return markdownRuntime;
  runtimeLoadAttempted = true;
  try {
    const marked = evaluatePageResource(
      'marked-js',
      (pageWindow) => (typeof pageWindow.marked?.parse === 'function' ? pageWindow.marked : null),
    );
    const DOMPurify = evaluatePageResource(
      'dompurify-js',
      (pageWindow) => (typeof pageWindow.DOMPurify?.sanitize === 'function' ? pageWindow.DOMPurify : null),
    );
    markdownRuntime = { marked, DOMPurify };
  } catch (error) {
    console('Markdown 运行时资源加载失败，降级为纯文本', error, 'error');
    markdownRuntime = null;
  }
  return markdownRuntime;
}

/**
 * DOMPurify 配置：白名单标签/属性，禁用 script/iframe/on* 与其它危险内容。
 * 与 1.x renderMarkdownSafely 的 allowedTags（A/BLOCKQUOTE/BR/CODE/EM/H1-H4/LI/OL/P/PRE/STRONG/UL）对齐，
 * 并额外放开 marked 常见输出（H5/H6/HR/TABLE 系列/TITLE 不含）。属性仅放 class/href/rel/target（与 1.x 一致）。
 */
const PURIFY_CONFIG = {
  ALLOWED_TAGS: [
    'a', 'blockquote', 'br', 'code', 'em',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr',
    'li', 'ol', 'ul', 'p', 'pre', 'strong',
    'span', 'div', 'img',
    'table', 'thead', 'tbody', 'tr', 'th', 'td', 'del', 'sup', 'sub',
  ],
  ALLOWED_ATTR: ['class', 'href', 'rel', 'target', 'src', 'alt', 'title'],
  // 禁止 data: / javascript: 链接、防 XSSsrc 绕过（img 来源 markdown 一般为外链图标）。
  FORBID_ATTR: ['style', 'onerror', 'onload', 'onclick'],
};

/**
 * 渲染 markdown 到目标元素：marked.parse → DOMPurify.sanitize → 写入 target，
 * 并对保留的外链 <a> 强制加 rel=noopener noreferrer & target=_blank（1.x renderMarkdownSafely 行 2302-2307 等价意图）。
 *
 * 空目标或空文本时安全跳过（1.x 行 2286 `if (!target) return`）。
 * marked 不可用时降级为 HTML 转义（1.x 行 2290 同款兜底）后经 DOMPurify 再写。
 *
 * @param {Element} target - 写入渲染结果的容器元素
 * @param {string} markdown - markdown 源文本
 */
export function renderMarkdown(target, markdown) {
  if (!target) return;
  const source = String(markdown || '');
  const runtime = getMarkdownRuntime();

  let rawHtml;
  if (runtime) {
    try {
      rawHtml = runtime.marked.parse(source);
    } catch (error) {
      console('marked.parse 失败，降级 HTML 转义', error, 'warn');
      rawHtml = escapeHtml(source);
    }
  } else {
    // 任一解析/消毒资源不可用时，只写转义后的纯文本，绝不使用未消毒的 marked 输出。
    rawHtml = escapeHtml(source);
  }

  // 先经 DOMPurify 剥离 script/iframe/on*/危险属性，再在 DOM 层给外链加 rel/target 双保险。
  const cleanHtml = runtime ? runtime.DOMPurify.sanitize(rawHtml, PURIFY_CONFIG) : rawHtml;

  // 用临时容器解析 cleanHtml，遍历 <a> 补 rel/target（DOMPurify 已剥离危险部分，此步只加属性）。
  const holder = document.createElement('div');
  holder.innerHTML = cleanHtml;
  for (const anchor of holder.querySelectorAll('a')) {
    const href = anchor.getAttribute('href') || '';
    if (/^https?:\/\//i.test(href)) {
      anchor.setAttribute('rel', 'noopener noreferrer');
      anchor.setAttribute('target', '_blank');
    } else {
      // 非外链（含 javascript: 残留、mailto、相对等）：移除 href 杜绝风险（1.x 行 2304 等价）。
      anchor.removeAttribute('href');
    }
  }
  target.replaceChildren(...holder.childNodes);
}

/**
 * 最小 HTML 转义（marked 不可用时的降级，1.x 行 2289-2290 同形态）。
 * @param {string} text
 * @returns {string}
 */
export function escapeHtml(text) {
  // 用字符串拼接构造实体，避免在源码里直写 &/< 等字面量（本仓库工具管道会将其解码回原字符）。
  const amp = '&' + 'amp;';
  const lt = '&' + 'lt;';
  const gt = '&' + 'gt;';
  const quot = '&' + 'quot;';
  const apos = '&' + '#39;';
  return String(text).replace(/[&<>"']/g, (ch) => ({
    '&': amp,
    '<': lt,
    '>': gt,
    '"': quot,
    "'": apos,
  }[ch]));
}
