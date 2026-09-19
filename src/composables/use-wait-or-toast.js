/**
 * use-wait-or-toast — waitForElement + toast 统一封装（替代 1.x 散点 createToast('error', err.message)）
 * 对应 1.x：Better NXU.user.js 行 2604/2693/2732/2749/3640/4363 等约 30 处 createToast("error", error.message || ...)
 *          + 行 2655/2687/2911/3100/3114/3645 等约 8 处 createToast("warning", 超时..., n)
 * 依赖：utils/dom（waitForElement）、utils/errors（WAIT_TIMEOUT）、libraries/notification（toast 副作用）
 * 入口/被谁调用：webvpn 首页、微信快登、教务菜单、教务课表 iframe、门户 iframe 等
 *               "等待元素失败转提示并停止当前步骤"的场景。IDS 登录不使用本 helper，因为其 catch
 *               还负责提交锁复位和整段登录失败处理。
 *
 * 抽取动机（01 §8.2-4 + B2 验收 4）：
 *  1.x 的"waitForElement + try/catch + createToast"散落在主页、菜单、iframe、门户和微信快登等流程。
 *  2.0 对只需要“提示并停止当前步骤”的等待统一使用本 composable：调用方一行 await waitOrToast(...)，
 *  返回命中 Element 或 null。需要额外清理、锁复位或整段事务兜底的流程继续直接使用 waitForElement。
 *
 * 失败策略（与 1.x 散点行为对齐）：
 *  - WAIT_TIMEOUT 默认弹 warning（1.x 行 2655/3100/3114 等超时多配 warning 引导）——但调用方可在 options.level='error'
 *    改走 error toast（1.x 行 2605 等用 error）。
 *  - 非 WAIT_TIMEOUT 的其它错误（如调度被取消）弹 error 并附 error.message（1.x 行 2605/2693 散点 error.message 兜底）。
 *  - 返回 null 让调用方"跳过后续"而非抛错（与 1.x 散点 try/catch 后 return 同效，但更可控）。
 */
import { waitForElement } from '../utils/dom.js';
import { WAIT_TIMEOUT } from '../utils/errors.js';
import { toast, installNotification } from '../libraries/notification.js';
import { MyConsole } from '../utils/console.js';

const console = MyConsole('[wait-or-toast]');

/**
 * 等待选择器命中的元素，超时或出错时弹 toast 并返回 null（替代散点 waitForElement + try/catch + createToast）。
 *
 * @param {string} selector - waitForElement 的选择器
 * @param {{timeout?:number, interval?:number, predicate?:(el:Element)=>boolean,
 *          level?:'warning'|'error', timeoutMessage?:string, errorMessage?:string,
 *          duration?:number}} [options]
 *   - timeout: waitForElement 超时毫秒（默认 10000，与 1.x waitForElement 默认一致）
 *   - level: 超时/失败弹 toast 的级别。'warning'（默认）引导用户手动操作；'error' 走错误 toast
 *   - timeoutMessage: 超时时的文案（默认 "等待页面元素超时：<selector>"）
 *   - errorMessage: 非超时错误的文案（默认取 error.message || "<selector> 加载失败"）
 *   - duration: toast 持续秒数（默认 5，与 1.x 散点 error 5 秒一致；常驻场景传 0）
 * @returns {Promise<Element|null>} 命中元素或 null（失败时已弹 toast）
 */
export async function waitOrToast(selector, options = {}) {
  const { timeout, interval, predicate, level, timeoutMessage, errorMessage, duration = 5 } = options || {};
  try {
    return await waitForElement(selector, { timeout, interval, predicate });
  } catch (error) {
    installNotification();
    const isTimeout = error?.code === WAIT_TIMEOUT;
    const tipLevel = level === 'error' ? 'error' : 'warning';
    const message = isTimeout
      ? timeoutMessage || `等待页面元素超时：${selector}`
      : errorMessage || error?.message || `${selector} 加载失败`;
    toast(tipLevel, message, duration);
    console('waitOrToast 捕获', { selector, isTimeout, code: error?.code, message }, 'warn');
    return null;
  }
}
