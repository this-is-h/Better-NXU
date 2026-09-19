/**
 * 随机与延时工具
 * 对应 1.x：Better NXU.user.js 行 2160-2162（Random）、2165-2183（WaitTime）
 * 依赖：utils/console（日志）
 * 入口/被谁调用：utils/dom（waitForElement 的轮询间隔）、各 sites（业务延时/随机退避）
 *
 * 纯时间/随机函数，无 DOM 依赖。从 dom.js 拆出以便单独复用与测试。
 */
import { MyConsole } from './console.js';

const console = MyConsole('[wait]');

/**
 * 返回 [min, max] 闭区间的随机整数。1.x 行 2160-2162 逐字迁移。
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function Random(min, max) {
  return parseInt(Math.random() * (max - min + 1) + min, 10);
}

/**
 * 等待指定毫秒，或在 [min,max] 区间随机等待。
 * 1.x 行 2165-2183 行为迁移：max==0 表示固定等待 min 毫秒；否则随机。
 * 默认日志输出 [等待] 定时任务完成（log=true 时）。
 * @param {number} min - 固定模式即等待毫秒数；区间模式为下界
 * @param {number} [max=0] - 上界；为 0 表示固定等待 min
 * @param {boolean} [log=true] - 是否打印等待日志
 * @param {string} [msg='无'] - 日志备注
 * @returns {Promise<void>}
 */
export function WaitTime(min, max = 0, log = true, msg = '无') {
  let waitmsg, waittime;
  if (max === 0) {
    waittime = min;
    waitmsg = `====================\n等待了：${waittime / 1000} 秒\n备注：${msg}\n====================`;
  } else {
    waittime = Random(min, max);
    waitmsg = `====================\n随机等待了：${waittime / 1000} 秒\n备注：${msg}\n====================`;
  }
  return new Promise(function (resolve) {
    setTimeout(function () {
      if (log) {
        console('[等待] 定时任务完成', waitmsg.replace(/ /g, ''), 'debug');
      }
      resolve();
    }, waittime);
  });
}
