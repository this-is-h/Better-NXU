/**
 * sites/pingjiao/pages/notify — 评教系统未实现提示（toast"暂未实现"）
 * 对应 1.x：Better NXU.user.js 行 2475-2483（case 'jsfzyjxzlxt.nxu.edu.cn' 分发）+ 行 2266-2273（qualityUnavailable 函数体）
 * 依赖：libraries/notification（installNotification 装 toast；2.0 各 page 自调； toast 弹提示）、utils/console
 * 入口/被谁调用：router 命中评教（jsfzyjxzlxt.nxu.edu.cn）且 path 为 '/quality/student/evaluate/item_tasks'
 *                或 '/quality/student/evaluate/item_tasks_text' 后由 main 调本 page 的 register
 *
 * 与 1.x 等价点（C5）：
 *  - qualityUnavailable（行 2266-2273）：message="评教自动填写功能暂未实现，请手动完成当前页面操作。"
 *    若 createToast 存在则 createToast('info', message, 5)，否则 window.alert(message)。
 *  - 2.0 恒因 installNotification 先于本逻辑装载 toast 体系，故走 toast 分支（与 1.x 装了 notification 后等价）；
 *    保留 alert 兜底分支（与 1.x 同款防御写法，installNotification 万一失败时仍有提示）。
 *  - 1.x 两个 path 均调 qualityUnavailable，行为一致，2.0 同——路由两个 entry 命中后调同一 register。
 *
 * 03 §2 B8 验收 3：评教任务页与团委页均 toast 未实现，不 throw——本 page 只弹 toast，不做任何业务注入。
 * 挂载形态：叠加注入——装 toast + 弹提示，不清 body、不换 title。
 *
 * 注：评教域名 jsfzyjxzlxt.nxu.edu.cn 不在 @match 的 nxu.edu 直连白名单内由 portal 代理可达，但其自有 @match 条目
 *  （见 01 §1 命中表）；router 命中即本 page。GM 键此 site 无关联配置（不涉 TuanWei.*），不需要读 store。
 */
import { installNotification, toast } from '../../../libraries/notification.js';
import { MyConsole } from '../../../utils/console.js';

const console = MyConsole('[评教]');

/**
 * 评教未实现提示 toast。对应 1.x qualityUnavailable()（行 2266-2273）。
 * 路由命中（行 2479/2481 两个 path 同调）。
 */
export async function register() {
  installNotification();
  console('进入评教系统', '注入未实现提示');
  // 1.x 行 2267 文案逐字保留。
  const message = '评教自动填写功能暂未实现，请手动完成当前页面操作。';
  // 1.x 行 2268-2272：createToast 存在则 toast 否则 alert。2.0 恒因 installNotification 已装而走 toast，保留 alert 兜底。
  if (toast) {
    toast('info', message, 5);
  } else {
    window.alert(message);
  }
}
