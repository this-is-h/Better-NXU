/**
 * jwgl/pages/login.page — 教务登录页（自动登录：填账号密码 + OCR 验证码 + 提交）
 * 对应 1.x：Better NXU.user.js 行 2487-2490/2572-2575/2369-2372（jwgl 三形态直连/IP/WebVPN 代理 登录页分发 jwglLogin）
 * 依赖：libraries/notification（installNotification = 1.x Basic() 装 toast+FontAwesome+重设 betterNXU*）、
 *       sites/jwgl/auth/jwgl-login（jwglLogin 主干）、utils/console
 * 入口/被谁调用：router 命中 jwgl/login.page.js → main.js 调 register()
 *
 * 1.x 三形态命中后均 `Basic(); jwglLogin();`（行 2371-2372 / 2489-2490 / 2574-2575）。
 * Basic()（无 options）= AddNotification + 装 vant + 重设 CAT_userConfig 等（1.x 行 185-191）。jwgl 登录页
 * 不用到 Vant 组件，但 1.x Basic() 仍装 vant 作后续铺垫；2.0 installNotification 等价 AddNotification 部分
 * （toast+FontAwesome+betterNXU* 三项），vant 按需由后续页/组件自 import，本页不引 Vant（与 ids 验收 3 同理轻量）。
 */
import { installNotification } from '../../../libraries/notification.js';
import { jwglLogin } from '../auth/jwgl-login.js';
import { MyConsole } from '../../../utils/console.js';

const console = MyConsole('[jwgl.login]');

/**
 * 教务登录页入口：装 notification 后跑 jwglLogin 自动登录主干。1.x 三形态登录页分发等价。
 */
export async function register() {
  console('进入登录页');
  installNotification();
  await jwglLogin();
}
