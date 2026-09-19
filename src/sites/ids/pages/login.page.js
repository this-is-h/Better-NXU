/**
 * ids/pages/login.page — 统一认证登录页（仅 Basic({vant:false})：自动登录或浮动填账号按钮）
 * 对应 1.x：Better NXU.user.js 行 2256-2264（routeAuthLogin）+ 行 2505-2509（ids case 登录分发 routeAuthLogin）
 * 依赖：libraries/notification（installNotification = Basic({vant:false}) 等价）、config/gm-store（getGMValue autoLogin）、
 *       sites/ids/auth/ids-login（idsLogin 主干）、composables/use-vue-app（mountVueApp 挂 LoginFillButton）、
 *       components/login/LoginFillButton.vue（未启用自动登录时的浮动按钮）、utils/console
 * 入口/被谁调用：router 命中 ids/login.page.js → main.js 调 register()

 * 1.x routeAuthLogin 行 2256-2264：
 *   Basic({ vant: false }); if (WebVPN.autoLogin) await webvpnLogin(); else injectAuthFillHelper();
 * 2.0 等价：
 *   installNotification()（= Basic({vant:false}）：装 toast + 重设 betterNXU* 三项 + 不引 Vant，标志 ids 仅注入 notification）
 *   if (WebVPN.autoLogin) idsLogin(); else 挂 LoginFillButton.vue 浮动按钮（= injectAuthFillHelper）
 *
 * 验收对齐（03 B5 验收 1/3）：
 *   - 未启用 autoLogin → 仅注入浮动按钮（不自动填、不提交）
 *   - 启用 → 自动填 + 识别验证码 + 提交（idsLogin 内含 hasLegacyAuthCaptcha / 滑块提示分支）
 *   - 无凭证 → requireCredentials('WebVPN') 弹 toast 转设置页（1.x 行 2618 等价）
 *   - Basic({vant:false}) 等价：只 installNotification，不 import Vant（本 page 与 LoginFillButton 均无 vant 依赖），满足验收 3
 */
import { installNotification } from '../../../libraries/notification.js';
import { getGMValue } from '../../../config/gm-store.js';
import { idsLogin } from '../auth/ids-login.js';
import { mountVueApp } from '../../../composables/use-vue-app.js';
import LoginFillButton from '../components/login/LoginFillButton.vue';
import { MyConsole } from '../../../utils/console.js';

const console = MyConsole('[ids.login]');

/**
 * 统一认证登录页入口：装 toast；启用自动登录则跑 idsLogin，否则注入浮动填账号按钮。
 * 1.x routeAuthLogin 行 2256-2264 等价。
 */
export async function register() {
  console('进入登录页');
  // 1.x Basic({vant:false})：装 notification（含 toast 容器/样式/重设 betterNXU* 三项），不引 Vant。
  installNotification();
  if (getGMValue('WebVPN.autoLogin')) {
    await idsLogin();
  } else {
    console('自动登录未启用，注入浮动填账号按钮');
    // 挂 LoginFillButton.vue 到一个独立容器（避免直接 mount 到 body 覆盖页面表单）。
    // mountVueApp 默认挂 #id 容器；此处用一个固定 id 容纳按钮 SFC，挂到 body 末尾不干扰登录表单。
    mountVueApp({
      root: LoginFillButton,
      id: 'better-nxu-auth-fill-host',
      useVantStyles: false,
    });
  }
}
