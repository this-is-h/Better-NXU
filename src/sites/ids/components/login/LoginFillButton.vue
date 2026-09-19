<!--
  LoginFillButton — 未启用自动登录时注入到统一认证登录页的浮动"填入已保存账号"按钮
  对应 1.x：Better NXU.user.js 行 2226-2252（injectAuthFillHelper）
  依赖：config/gm-store（getGMValue 读 WebVPN.username/password）、config/gm-keys（hasLoginCredentials）、
        utils/dom（fillControlledInput）、libraries/notification（toast）、utils/console
  入口/被谁调用：sites/ids/pages/login.page.js（未启用 autoLogin 时挂本 SFC 到页面右下角）

  与 1.x 行为等价（C5）：
   - 仅当 WebVPN.username/password 都已配置才显示（1.x 行 2230 hasLoginCredentials 守卫）
   - 按钮 id="better-nxu-auth-fill"、定位 fixed 右下角、1.x 行 2235 cssText 逐字保留
   - 点击：querySelector 取账号/密码框 → fillControlledInput 填入 →
     成功 "账号已填入，请手动完成登录验证" success 4 秒；失败 "未找到统一认证登录框，请手动输入" error 4 秒
     （1.x 行 2244-2249）

  1.x 用 `document.getElementById('better-nxu-auth-fill')` 防重复注入；2.0 SFC 化后挂载点由
  login.page.js 保证只挂一次（mountVueApp 仅在未启用 autoLogin 时调一次），等价防重。

  SFC 注：选 vanilla `<script setup>`（无 Vant 依赖，Basic({vant:false}) 场景，不引 vant，符合验收 3 "只注入 notification"）。
  样式用本组件 `<style scoped>`；1.x 是行内 cssText，此 SFC 内以 scoped 选择器等价复刻按钮外观。
-->
<script setup>
import { onMounted, ref } from 'vue';
import { getGMValue } from '../../../../config/gm-store.js';
import { hasLoginCredentials } from '../../../../config/gm-keys.js';
import { fillControlledInput } from '../../../../utils/dom.js';
import { toast, installNotification } from '../../../../libraries/notification.js';
import { MyConsole } from '../../../../utils/console.js';

const console = MyConsole('[ids.login]');

// 是否渲染按钮：仅当已配置 WebVPN 凭证（1.x 行 2228-2230 hasLoginCredentials 守卫）。无凭证则不挂按钮。
const visible = ref(false);

/**
 * 点击"填入已保存账号"：取账号/密码输入框 → 填入 → 提示。1.x 行 2236-2250 逐字迁移。
 */
function fill() {
  const usernameInput = document.querySelector(
    '#pwdFromId #username, .login-main .m-account #username, input#username'
  );
  const passwordInput = document.querySelector(
    '#pwdFromId #password, .login-main .m-account #password, input#password'
  );
  if (!usernameInput || !passwordInput) {
    toast('error', '未找到统一认证登录框，请手动输入', 4);
    return;
  }
  const username = getGMValue('WebVPN.username');
  const password = getGMValue('WebVPN.password');
  fillControlledInput(usernameInput, username);
  fillControlledInput(passwordInput, password);
  toast('success', '账号已填入，请手动完成登录验证', 4);
}

onMounted(() => {
  // 1.x 行 2228-2230：仅当已配置凭证才注入按钮（无凭证直接 return，不显示）。
  const username = getGMValue('WebVPN.username');
  const password = getGMValue('WebVPN.password');
  if (!hasLoginCredentials(username, password)) return;
  // 确保已安装 toast（点击 fill 时 toast 可用）。login.page.js 调 Basic 时已 install，此处双保险。
  installNotification();
  visible.value = true;
  console('注入浮动填账号按钮');
});
</script>

<template>
  <button v-if="visible" id="better-nxu-auth-fill" type="button" class="better-nxu-auth-fill" @click="fill">
    Better NXU · 填入已保存账号
  </button>
</template>

<style scoped>
/* 1.x 行 2235 cssText 逐字复刻（fixed 右下角、蓝底白字、阴影），仅改 scoped 选择器封装。 */
.better-nxu-auth-fill {
  position: fixed;
  right: 16px;
  bottom: 20px;
  z-index: 99999;
  padding: 9px 12px;
  border: 1px solid #2878d7;
  border-radius: 4px;
  background: #3a8bff;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.18);
}
</style>
