/**
 * DOM 工具
 * 对应 1.x：Better NXU.user.js 行 2007-2030（simulateClick）、2186-2198（waitForElement）、
 *          2200-2208（fillControlledInput）。
 * 依赖：utils/console（waitForElement 超时日志）、utils/errors（WAIT_TIMEOUT + scheduleOperationError）、
 *       utils/random（waitForElement 轮询用 WaitTime）
 * 入口/被谁调用：各 sites/pages 调 waitForElement/simulateClick/fillControlledInput
 *
 * 注意：utils 不得 import config/composables/libraries（依赖边界，02 §3）。
 */
import { MyConsole } from './console.js';
import { WAIT_TIMEOUT, scheduleOperationError } from './errors.js';
import { WaitTime } from './random.js';
import { unsafeWindow as grantedUnsafeWindow } from '#gm';

const unsafeWindow = grantedUnsafeWindow ?? window;

const console = MyConsole('[dom]');

/**
 * 模拟点击（click 无效时使用）。
 * 1.x 行 2007-2030 行为逐字迁移：依次派发 mousedown/mouseup/click 并 focus 元素。
 * @param {Element} el
 * @param {boolean} [needScroll=false] - 是否先滚动到可见区域
 */
export function simulateClick(el, needScroll = false) {
  if (!el) return;
  // 先滚动到可见区域（避免被遮挡）
  if (needScroll) {
    el.scrollIntoView({ behavior: 'auto', block: 'center' });
  }

  const events = ['mousedown', 'mouseup', 'click'];
  for (const type of events) {
    const event = new MouseEvent(type, {
      view: unsafeWindow,
      bubbles: true,
      cancelable: true,
      button: 0, // 左键
      buttons: 1,
      pointerId: 1,
      pressure: 0.5,
      isPrimary: true,
    });
    el.dispatchEvent(event);
  }

  // 额外触发 focus（某些按钮需要先聚焦）
  el.focus();
}

/**
 * 轮询等待选择器命中且 predicate 通过的元素，超时抛 WAIT_TIMEOUT。
 * 1.x 行 2186-2198 逐字迁移。默认 10s 超时、100ms 轮询（01 §9 P10）。
 * @param {string} selector
 * @param {{timeout?:number, interval?:number, predicate?:(el:Element)=>boolean}} [options]
 * @returns {Promise<Element>}
 */
export async function waitForElement(selector, options = {}) {
  const timeout = Math.max(0, Number(options.timeout ?? 10000));
  const interval = Math.max(20, Number(options.interval ?? 100));
  const predicate = typeof options.predicate === 'function' ? options.predicate : () => true;
  const startedAt = Date.now();
  while (Date.now() - startedAt <= timeout) {
    const element = document.querySelector(selector);
    if (element && predicate(element)) return element;
    await WaitTime(interval, 0, false);
  }
  console('[DOM 等待] 目标元素等待超时', { selector, timeoutMs: timeout }, 'warn');
  throw scheduleOperationError(WAIT_TIMEOUT, `等待页面元素超时：${selector}`);
}

/**
 * 受控填充输入框：移除 readonly、focus、赋值并派发 input/change 事件，兼容受控组件。
 * 1.x 行 2200-2208 逐字迁移。
 * @param {HTMLInputElement} input
 * @param {string} value
 * @returns {boolean} 是否填充成功（input 为空时返回 false）
 */
export function fillControlledInput(input, value) {
  if (!input) return false;
  input.removeAttribute('readonly');
  input.focus?.();
  input.value = String(value ?? '');
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
  return true;
}
