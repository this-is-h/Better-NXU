<!--
  sslvpn/components/settings/SettingsPanel.vue — 设置页主体（功能区 + 三分组 + 空状态）
  对应 1.x：Better NXU.user.js 行 3940-4449（settings_template + Vue.createApp({setup,mounted}).use(vant).mount('#settings')）
  依赖：vant 按需 import（NavBar/Button/CellGroup/Cell/Switch/Field/Checkbox/CheckboxGroup/Empty；样式随页面按需注入）、
         函数式 showConfirmDialog；config/gm-store（getGMValue/setGMValue/reset* + cloneGMValue/hasLoginCredentials）、
         #gm（unsafeWindow 取桥接后的 CAT_userConfig）、libraries/notification（toast/removeToastHandle）、utils/console、vue（ref/computed/watch/onMounted/onBeforeUpdate）
  入口/被谁调用：sites/sslvpn/pages/settings.page.js 经 mountVueApp 挂本 SFC 到 #settings（rootProps 传 scriptVersion + deployToast）

  与 1.x 等价点（C5）：
   - 行 3940-4207 settings_template 逐字保留：功能区（原生配置/恢复功能默认值/完全重置）+ 三分组（WebVPN/教务/团委）+
     空状态卡。van-* 组件、绑定状态/方法名、@click/@change 事件、:class 计算属性 全 1:1。
   - ref/computed/onBeforeUpdate 保留；所有设置按模型映射注册深度 watch，经写入队列持久化；
     enforceAutoLoginCredentials 缺凭证自动关 autoLogin；resetFunctionSettings/resetAllSettings 弹
     showConfirmDialog 二次确认；openNativeConfig 调 CAT_userConfig。
   - 行 4443-4446 mounted：removeToast(部署中) + createToast success → SFC onMounted 内 removeToastHandle + toast。
   - 行 4412-4441 return 字段全暴露给模板（script setup 下 defineExpose 非必须，模板可直接访问 setup 顶层声明）。

  vant 注入（02 §5 / SFC 化）：1.x `settings.use(vant)` 整包注入；2.0 SFC 按 import van-* 组件自动局部注册 +
   `import {showConfirmDialog} from 'vant'` 调函数式 API。不依赖整包 unsafeWindow.vant。

  cellCheckBoxToggle + onBeforeUpdate 清 refs（1.x 行 4211-4213 / 4403-4406）逐字保留——为 van-cell 整行 clickable
   点击同步触发 van-checkbox toggle 的样板（Vant 官方 checkbox in cell 写法），refs 在 onBeforeUpdate 清空防累积。
-->
<script setup>
import { ref, computed, watch, onMounted, onBeforeUpdate } from 'vue';
import {
  NavBar as VanNavBar,
  Button as VanButton,
  CellGroup as VanCellGroup,
  Cell as VanCell,
  Switch as VanSwitch,
  Field as VanField,
  Checkbox as VanCheckbox,
  CheckboxGroup as VanCheckboxGroup,
  Empty as VanEmpty,
  showConfirmDialog,
} from 'vant';
import {
  getGMValue,
  setGMValue,
  resetFunctionSettingValues,
  resetAllSettingValues,
} from '../../../../config/gm-store.js';
import { cloneGMValue, hasLoginCredentials } from '../../../../config/gm-keys.js';
import { createSettingsWriteQueue } from '../../../../config/settings-write-queue.js';
import { unsafeWindow as grantedUnsafeWindow } from '#gm';
import { toast, removeToastHandle } from '../../../../libraries/notification.js';
import { MyConsole } from '../../../../utils/console.js';

const console = MyConsole('[设置]');
const pageWindow = grantedUnsafeWindow ?? window;

const props = defineProps({
  scriptVersion: { type: String, default: '' }, // 1.x 行 4413 scriptVersion: Version
  deployToast: { type: null, default: null }, // 部署中常驻 toast 句柄，部署完毕移除（1.x 行 4444）
});

// 1.x 行 4211-4213：van-cell 整行 clickable 点击 → 触发对应 van-checkbox toggle（Vant checkbox-in-cell 官方写法）。
const cellCheckBoxToggle = (refs, index) => {
  // 模板传参时 ref 已自动解包，这里收到的是复选框实例数组。
  refs[index]?.toggle();
};

// === WebVPN 组 ref（1.x 行 4215-4225）===
const webVPNAutoLogin = ref(getGMValue('WebVPN.autoLogin'));
const webVPNAutoReLogin = ref(getGMValue('WebVPN.autoReLogin'));
const webVPNAccount = ref(getGMValue('WebVPN.username'));
const webVPNPassword = ref(getGMValue('WebVPN.password'));
const webVPNCourseGrab = ref(getGMValue('WebVPN.courseGrab'));
const webVPNCustomTool = ref(getGMValue('WebVPN.customTool'));
const webVPNCustomCard = ref(getGMValue('WebVPN.customCard'));
// 旧存储数组可能仍含已下线的“大先生”；不主动改写，UI 与渲染候选均忽略未知名称。
// 恢复“大先生”或让新旧信息门户共存时，需在此列表补回对应名称；完整恢复清单见 CustomCards.vue。
const webVPNCustomCardList = ['教务管理', '学工系统', '信息门户', '中国知网', '万方数据'];
// 大先生服务恢复后可改回：
// const webVPNCustomCardList = ['教务管理', '学工系统', '信息门户', '中国知网', '万方数据', '大先生'];
const webVPNCustomCardRefs = ref([]);
const webVPNAutoClose = ref(getGMValue('WebVPN.autoClose'));
const webVPNSearchClose = ref(getGMValue('WebVPN.searchClose'));

// === 教务组 ref（1.x 行 4226-4232）===
const jwglAutoLogin = ref(getGMValue('Jwgl.autoLogin'));
const jwglAccount = ref(getGMValue('Jwgl.username'));
const jwglPassword = ref(getGMValue('Jwgl.password'));
const jwglCourseBeautify = ref(getGMValue('Jwgl.courseBeautify'));
const jwglCustomMenu = ref(getGMValue('Jwgl.customMenu'));
const jwglCustomMenuList = ['全部学期成绩'];
const jwglCustomMenuRefs = ref([]);

// === 团委附件下载设置（沿用历史键名）===
const tuanweiAutoDownload = ref(getGMValue('TuanWei.autoDownload'));
const tuanweiAutoDownloadClose = ref(getGMValue('TuanWei.autoDownloadClose'));

// 1.x 行 4235-4236：凭证就绪计算属性（缺账号密码时禁用 autoLogin 并提示）。
const webVPNCredentialsReady = computed(() => hasLoginCredentials(webVPNAccount.value, webVPNPassword.value));
const jwglCredentialsReady = computed(() => hasLoginCredentials(jwglAccount.value, jwglPassword.value));

// 串行写入并合并同一键的待处理值，避免快速输入时旧写入晚完成后覆盖新值。
const settingWrites = createSettingsWriteQueue(setGMValue, (error, name) => {
  console('保存设置失败', { name, error }, 'error');
  toast('error', '设置保存失败，请重试', 3);
});
const persistSetting = (name, value) => {
  void settingWrites.enqueue(name, cloneGMValue(value));
};

// 1.x 行 4238-4243：缺凭证且 autoLogin 开启 → 强制关 autoLogin 并持久化 + 可选 toast 提示。
const enforceAutoLoginCredentials = (credentialsReady, autoLogin, storageKey, label, notify = true) => {
  if (credentialsReady.value || !autoLogin.value) return;
  autoLogin.value = false;
  persistSetting(storageKey, false);
  if (notify) toast('info', `${label}自动登录已关闭，请先填写账号和密码`, 3);
};

// 1.x 行 4245-4246：初始化即校正一次（notify=false 静默，与 1.x 同）。
enforceAutoLoginCredentials(webVPNCredentialsReady, webVPNAutoLogin, 'WebVPN.autoLogin', 'WebVPN ', false);
enforceAutoLoginCredentials(jwglCredentialsReady, jwglAutoLogin, 'Jwgl.autoLogin', '教务系统', false);

// 保存监听与重置回填共用映射，避免新增开关只有 UI 绑定却漏掉存储写入。
const resettableSettingModels = {
  'WebVPN.autoLogin': webVPNAutoLogin,
  'WebVPN.autoReLogin': webVPNAutoReLogin,
  'WebVPN.autoClose': webVPNAutoClose,
  'WebVPN.courseGrab': webVPNCourseGrab,
  'WebVPN.customTool': webVPNCustomTool,
  'WebVPN.customCard': webVPNCustomCard,
  'WebVPN.searchClose': webVPNSearchClose,
  'Jwgl.autoLogin': jwglAutoLogin,
  'Jwgl.courseBeautify': jwglCourseBeautify,
  'Jwgl.customMenu': jwglCustomMenu,
  'TuanWei.autoDownload': tuanweiAutoDownload,
  'TuanWei.autoDownloadClose': tuanweiAutoDownloadClose,
};
const allSettingModels = {
  ...resettableSettingModels,
  'WebVPN.username': webVPNAccount,
  'WebVPN.password': webVPNPassword,
  'Jwgl.username': jwglAccount,
  'Jwgl.password': jwglPassword,
};
Object.entries(allSettingModels).forEach(([name, model]) => {
  watch(model, (value) => persistSetting(name, value), { deep: true });
});
watch([webVPNAccount, webVPNPassword], () => {
  enforceAutoLoginCredentials(webVPNCredentialsReady, webVPNAutoLogin, 'WebVPN.autoLogin', 'WebVPN ');
});
watch([jwglAccount, jwglPassword], () => {
  enforceAutoLoginCredentials(jwglCredentialsReady, jwglAutoLogin, 'Jwgl.autoLogin', '教务系统');
});
// 1.x 行 4333-4337：把默认值集合回填到对应 ref.value（深拷贝防引用共享）。
const syncSettingModels = (defaults, models) => {
  Object.entries(models).forEach(([name, model]) => {
    model.value = cloneGMValue(defaults[name]);
  });
};

// 1.x 行 4339-4365：恢复功能默认值（showConfirmDialog 二次确认 → resetFunctionSettingValues → 回填 + 校正 autoLogin）。
const resetFunctionSettings = async () => {
  let action;
  try {
    action = await showConfirmDialog({
      title: '恢复功能默认值',
      message:
        '将恢复自动登录、页面显示和菜单等功能设置。账号密码、配置提示状态、课表 ID 与课表密钥不会被修改。',
      messageAlign: 'left',
      confirmButtonText: '恢复默认',
      cancelButtonText: '取消',
      closeOnClickOverlay: false,
    });
  } catch {
    return;
  }
  if (action !== 'confirm') return;
  try {
    await settingWrites.flush();
    const defaults = await resetFunctionSettingValues();
    syncSettingModels(defaults, resettableSettingModels);
    enforceAutoLoginCredentials(
      webVPNCredentialsReady,
      webVPNAutoLogin,
      'WebVPN.autoLogin',
      'WebVPN ',
      false
    );
    enforceAutoLoginCredentials(jwglCredentialsReady, jwglAutoLogin, 'Jwgl.autoLogin', '教务系统', false);
    toast('success', '功能设置已恢复默认，账号密码和课表数据保持不变', 3);
  } catch (error) {
    console('恢复功能默认值失败', error, 'error');
    toast('error', '恢复默认设置失败，请稍后重试', 4);
  }
};

// 1.x 行 4367-4392：完全重置（showConfirmDialog 二次确认 → resetAllSettingValues → 回填全量）。
const resetAllSettings = async () => {
  let action;
  try {
    action = await showConfirmDialog({
      title: '完全重置 Better NXU',
      message:
        '这将清除 WebVPN 与教务账号密码、全部功能设置、配置提示状态、课表 ID 和课表解密密钥。\n\n解密密钥清除后无法恢复，已有加密课表可能无法再次打开。此操作无法撤销。',
      messageAlign: 'left',
      confirmButtonText: '确认完全重置',
      confirmButtonColor: '#ee0a24',
      cancelButtonText: '取消',
      closeOnClickOverlay: false,
    });
  } catch {
    return;
  }
  if (action !== 'confirm') return;
  try {
    await settingWrites.flush();
    const defaults = await resetAllSettingValues();
    syncSettingModels(defaults, allSettingModels);
    toast('success', 'Better NXU 已完全重置，返回首页后请重新配置', 4);
  } catch (error) {
    console('完全重置失败', error, 'error');
    toast('error', '完全重置失败，请稍后重试', 4);
  }
};

// 1.x 行 4394-4401：打开 ScriptCat 原生配置面板（CAT_userConfig 经 GM grant 注入，1.x 即调全局）。
const openNativeConfig = () => {
  try {
    pageWindow.CAT_userConfig?.();
  } catch (error) {
    console('打开 ScriptCat 原生配置失败', error, 'error');
    toast('error', '暂时无法打开 ScriptCat 原生配置', 4);
  }
};

// 1.x 行 4403-4406：onBeforeUpdate 清空 refs 数组（van-checkbox 函数式 ref 在每次更新前重置，防累积陈旧实例）。
onBeforeUpdate(() => {
  webVPNCustomCardRefs.value = [];
  jwglCustomMenuRefs.value = [];
});

// 1.x 行 4443-4446 mounted：移除部署中常驻 toast + 弹"设置页面部署完毕"。
onMounted(() => {
  if (props.deployToast) removeToastHandle(props.deployToast);
  toast('success', '设置页面部署完毕', 2);
});
</script>

<template>
  <section class="settings-function-area" aria-label="设置功能区">
    <div class="settings-function-copy">
      <span class="settings-function-title">脚本设置</span>
      <span class="settings-function-description">修改会自动保存 · Better NXU V {{ scriptVersion }}</span>
    </div>
    <div class="settings-function-actions">
      <van-button size="small" plain icon="setting-o" @click="openNativeConfig"
        >ScriptCat 原生配置</van-button
      >
      <van-button size="small" plain type="warning" icon="replay" @click="resetFunctionSettings"
        >恢复功能默认值</van-button
      >
      <van-button size="small" type="danger" icon="delete-o" @click="resetAllSettings">完全重置</van-button>
    </div>
  </section>
  <div class="settings-groups">
    <div class="group">
      <van-nav-bar title="WebVPN 页面设置" />
      <div class="group-content">
        <van-form>
          <h2>登录设置</h2>
          <van-cell-group inset>
            <van-cell
              center
              title="是否自动登录"
              :label="webVPNCredentialsReady ? '' : '请先填写账号和密码'"
              :class="{ 'login-setting-disabled': !webVPNCredentialsReady }"
            >
              <template #right-icon>
                <van-switch v-model="webVPNAutoLogin" :disabled="!webVPNCredentialsReady" />
              </template>
            </van-cell>
            <van-field
              v-model="webVPNAccount"
              label="账号"
              autocomplete="off"
              placeholder="请输入账号（学号）"
            />
            <van-field
              v-model="webVPNPassword"
              type="password"
              autocomplete="off"
              label="密码"
              placeholder="请输入密码（登录校园网的密码）"
            />
            <van-cell center title="是否在多因子认证（微信扫码）时启用快速登录">
              <template #right-icon>
                <van-switch v-model="webVPNAutoReLogin" />
              </template>
            </van-cell>
          </van-cell-group>
          <h2>卡片设置</h2>
          <van-cell-group inset>
            <van-cell center title="是否显示抢课备用列表">
              <template #right-icon>
                <van-switch v-model="webVPNCourseGrab" />
              </template>
            </van-cell>
            <van-cell center title="是否显示工具列表">
              <template #right-icon>
                <van-switch v-model="webVPNCustomTool" />
              </template>
            </van-cell>
          </van-cell-group>
          <h3>需要添加的自定义卡片</h3>
          <van-checkbox-group v-model="webVPNCustomCard">
            <van-cell-group inset>
              <van-cell
                v-for="(item, index) in webVPNCustomCardList"
                :key="item"
                clickable
                :title="item"
                @click="cellCheckBoxToggle(webVPNCustomCardRefs, index)"
              >
                <template #right-icon>
                  <van-checkbox :ref="(el) => (webVPNCustomCardRefs[index] = el)" :name="item" @click.stop />
                </template>
              </van-cell>
            </van-cell-group>
          </van-checkbox-group>
          <h2>其他设置</h2>
          <van-cell-group inset>
            <van-cell center title="是否默认关闭搜索栏">
              <template #right-icon>
                <van-switch v-model="webVPNSearchClose" />
              </template>
            </van-cell>
            <van-cell center title="是否自动关闭错误网站">
              <template #right-icon>
                <van-switch v-model="webVPNAutoClose" />
              </template>
            </van-cell>
          </van-cell-group>
        </van-form>
      </div>
    </div>
    <div class="group">
      <van-nav-bar title="教务系统页面设置" />
      <div class="group-content">
        <van-form>
          <h2>登录设置</h2>
          <van-cell-group inset>
            <van-cell
              center
              title="是否自动登录"
              :label="jwglCredentialsReady ? '' : '请先填写账号和密码'"
              :class="{ 'login-setting-disabled': !jwglCredentialsReady }"
            >
              <template #right-icon>
                <van-switch v-model="jwglAutoLogin" :disabled="!jwglCredentialsReady" />
              </template>
            </van-cell>
            <van-field
              v-model="jwglAccount"
              label="账号"
              autocomplete="off"
              placeholder="请输入账号（学号）"
            />
            <van-field
              v-model="jwglPassword"
              type="password"
              label="密码"
              autocomplete="off"
              placeholder="请输入密码（登录教务系统的密码）"
            />
          </van-cell-group>
          <h2>功能设置</h2>
          <van-cell-group inset>
            <van-cell center title="是否自动美化课表">
              <template #right-icon>
                <van-switch v-model="jwglCourseBeautify" />
              </template>
            </van-cell>
          </van-cell-group>
          <!-- <h2>菜单设置</h2> -->
          <h3>在菜单需要添加的条目</h3>
          <van-checkbox-group v-model="jwglCustomMenu">
            <van-cell-group inset>
              <van-cell
                v-for="(item, index) in jwglCustomMenuList"
                :key="item"
                clickable
                :title="item"
                @click="cellCheckBoxToggle(jwglCustomMenuRefs, index)"
              >
                <template #right-icon>
                  <van-checkbox :ref="(el) => (jwglCustomMenuRefs[index] = el)" :name="item" @click.stop />
                </template>
              </van-cell>
            </van-cell-group>
          </van-checkbox-group>
        </van-form>
      </div>
    </div>
    <div class="group">
      <van-nav-bar title="团委官网页面设置" />
      <div class="group-content">
        <van-form>
          <h2>下载设置</h2>
          <van-cell-group inset>
            <van-cell center title="是否自动下载附件" label="自动识别验证码，失败时可手动下载">
              <template #right-icon>
                <van-switch v-model="tuanweiAutoDownload" />
              </template>
            </van-cell>
            <van-cell center title="是否自动关闭下载页面" label="自动下载完成后关闭附件页">
              <template #right-icon>
                <van-switch v-model="tuanweiAutoDownloadClose" :disabled="!tuanweiAutoDownload" />
              </template>
            </van-cell>
          </van-cell-group>
        </van-form>
      </div>
    </div>
    <div class="group">
      <van-empty style="width: 100%; height: 100%" description="更多设置等待建设中...">
        <template #image>
          <svg width="160" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" class="nc-icon-wrapper">
              <path
                d="M14.5489 8H9.4513L9.08052 19.9253C9.0382 21.0584 9.94529 22 11.0791 22H12.921C14.0549 22 14.962 21.0584 14.9197 19.9254L14.5489 8Z"
                fill="url(#hammer_existing_0)"
                data-glass="origin"
                mask="url(#hammer_mask)"
              />
              <path
                d="M14.5489 8H9.4513L9.08052 19.9253C9.0382 21.0584 9.94529 22 11.0791 22H12.921C14.0549 22 14.962 21.0584 14.9197 19.9254L14.5489 8Z"
                fill="url(#hammer_existing_0)"
                data-glass="clone"
                filter="url(#hammer_filter)"
                clip-path="url(#hammer_clipPath)"
              />
              <path
                d="M3 9V5C3 3.34315 4.34315 2 6 2H14.7393C15.4739 2 16.1833 2.26975 16.7324 2.75781L19.9932 5.65625C20.6335 6.22554 21 7.04162 21 7.89844V9.5C21 10.8807 19.8807 12 18.5 12H6C4.34315 12 3 10.6569 3 9Z"
                fill="url(#hammer_existing_1)"
                data-glass="blur"
              />
              <path
                d="M3 9V5C3 3.34315 4.34315 2 6 2H14.7393C15.4739 2 16.1833 2.26975 16.7324 2.75781L19.9932 5.65625C20.6335 6.22554 21 7.04162 21 7.89844V9.5C21 10.8807 19.8807 12 18.5 12V11.25C19.4665 11.25 20.25 10.4665 20.25 9.5V7.89844C20.25 7.33628 20.0393 6.79772 19.665 6.38574L19.4951 6.2168L16.2344 3.31836C15.8225 2.95228 15.2902 2.75 14.7393 2.75H6C4.75736 2.75 3.75 3.75736 3.75 5V9C3.75 10.2426 4.75736 11.25 6 11.25V12C4.34315 12 3 10.6569 3 9ZM18.5 11.25V12H6V11.25H18.5Z"
                fill="url(#hammer_existing_2)"
              />
              <defs>
                <linearGradient
                  id="hammer_existing_0"
                  x1="12"
                  y1="8"
                  x2="12"
                  y2="22"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="rgba(87, 87, 87, 1)" data-glass-11="on" />
                  <stop offset="1" stop-color="rgba(21, 21, 21, 1)" data-glass-12="on" />
                </linearGradient>
                <linearGradient
                  id="hammer_existing_1"
                  x1="12"
                  y1="2"
                  x2="12"
                  y2="12"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="rgba(227, 227, 229, 0.6)" data-glass-21="on" />
                  <stop offset="1" stop-color="rgba(187, 187, 192, 0.6)" data-glass-22="on" />
                </linearGradient>
                <linearGradient
                  id="hammer_existing_2"
                  x1="12"
                  y1="2"
                  x2="12"
                  y2="7.791"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="rgba(255, 255, 255, 1)" data-glass-light="on" />
                  <stop
                    offset="1"
                    stop-color="rgba(255, 255, 255, 1)"
                    stop-opacity="0"
                    data-glass-light="on"
                  />
                </linearGradient>
                <filter
                  id="hammer_filter"
                  x="-100%"
                  y="-100%"
                  width="400%"
                  height="400%"
                  filterUnits="objectBoundingBox"
                  primitiveUnits="userSpaceOnUse"
                >
                  <feGaussianBlur
                    stdDeviation="2"
                    x="0%"
                    y="0%"
                    width="100%"
                    height="100%"
                    in="SourceGraphic"
                    edgeMode="none"
                    result="blur"
                  />
                </filter>
                <clipPath id="hammer_clipPath">
                  <path
                    d="M3 9V5C3 3.34315 4.34315 2 6 2H14.7393C15.4739 2 16.1833 2.26975 16.7324 2.75781L19.9932 5.65625C20.6335 6.22554 21 7.04162 21 7.89844V9.5C21 10.8807 19.8807 12 18.5 12H6C4.34315 12 3 10.6569 3 9Z"
                    fill="url(#hammer_existing_1)"
                  />
                </clipPath>
                <mask id="hammer_mask">
                  <rect width="100%" height="100%" fill="#FFF" />
                  <path
                    d="M3 9V5C3 3.34315 4.34315 2 6 2H14.7393C15.4739 2 16.1833 2.26975 16.7324 2.75781L19.9932 5.65625C20.6335 6.22554 21 7.04162 21 7.89844V9.5C21 10.8807 19.8807 12 18.5 12H6C4.34315 12 3 10.6569 3 9Z"
                    fill="#000"
                  />
                </mask>
              </defs>
            </g>
          </svg>
        </template>
      </van-empty>
    </div>
  </div>
</template>
