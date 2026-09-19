/**
 * sites/tuanwei/pages/notify — 团委系统命中占位（空操作）
 * 对应 1.x：Better NXU.user.js 行 2557-2568（case 'tuanwei.nxu.edu.cn' 整段被注释——1.x 未启用任何业务逻辑，
 *           原拟调 tuanweiDownload/eval 附件下载但被注释禁用，命中 tuanwei 实际落 default 分支跑空，
 *           无任何 toast/log/通知副作用）。
 * 依赖：utils/console（仅诊断日志，不面向用户）
 * 入口/被谁调用：router 命中 tuanwei.nxu.edu.cn 后由 main 调本 page 的 register
 *
 * 与 1.x 一致点（03 §2 B8 验收 5，对齐用户要求"tuanwei 全站不执行任何操作"）：
 *  - 1.x 该 case 整段注释，命中 tuanwei 完全跑空：不下载附件、不 eval、不 throw、不弹 toast、不装通知。
 *  - 2.0 同——register 为空操作（仅一条 console 诊断，与 1.x MyConsole 静默 diagnostic 维度一致，不打扰用户）。
 *    早期 2.0 实现曾弹"附件下载暂未实现"toast，按要求改为不提示（toast 反而构成"操作"，与"全站不执行任何操作"相悖）。
 *
 * GM 键：TuanWei.autoDownload* 仍保留在 config/gm-keys.js 兼容（03 §2 B8 产出说明：无业务消费）——
 *  本 page 不读这些键（其语义对应被注释的 tuanweiDownload，2.0 不实现），仅作占位/兼容。
 *
 * 挂载形态：不操作——不装 toast、不弹提示、不清 body、不换 title（与 1.x 跑空逐字维度一致）。
 */
import { MyConsole } from '../../../utils/console.js';

const console = MyConsole('[团委]');

/**
 * 团委系统命中占位。1.x 该 case 已注释（命中跑空）；2.0 对齐——register 空操作，仅一条诊断日志。
 * 路由命中（tuanwei.nxu.edu.cn 全站，无 path 细分——1.x 原注释块也无 path 细分前置）。
 * 03 §2 B8 验收 5：不 throw、不下载、不 eval、不 toast、不装通知——全站不执行任何操作。
 */
export async function register() {
  console('团委系统命中（与 1.x 一致：不执行任何操作）');
}
