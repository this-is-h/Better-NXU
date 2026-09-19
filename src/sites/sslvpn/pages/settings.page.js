/**
 * sites/sslvpn/pages/settings.page — 设置页（sslvpn 独占实现，无 shared 转发层）
 * 对应 1.x：Better NXU.user.js 行 2463-2468（sslvpn case：/h/settings → Basic(); webvpnHSettings()）+
 *           行 3749-4450（webvpnHSettings 主体：清 body→title→装 toast/FA→挂 `#settings`→
 *           注入 settings 样式 → 挂 SettingsPanel SFC 渲染三分组+功能区+重置+原生入口；mounted removeToast+success）
 * 依赖：composables/use-app-page（mountAppPage 骨架 + extraSetup 注入 settings 样式）、
 *       composables/use-vue-app（mountVueApp 挂 SFC）、components/settings/SettingsPanel.vue（页面专属）、
 *       utils/console、config/gm-store（实际读写由 SFC 内完成，page 仅传上下文需要值）、context（取 version）
 * 入口/被谁调用：router 静态 import 本 page 的 register（命中 sslvpn /h/settings 时执行）
 *
 * 需求4/02 §7.2：设置/关于仅 sslvpn 命中——webvpn 不再处理 /h/settings。
 * 历史（B9 重构）：1.x 主体先迁至 sites/shared/settings/（当时设想 sslvpn/webvpn 两 site 共享）；需求4 确认
 *   仅 sslvpn 渲染后 shared 失去第二消费者，B9 并入 sslvpn/pages 就地成为真实实现，删除 shared 转发层。
 *
 * 与 1.x 等价点（C5）：
 *  - 行 3750-3768 骨架（清 body/title/addToast/ToastCss/FA/部署 toast/GM_addElement('div',{id:'settings'}）：
 *    mountAppPage 一站完成（extraSetup 注入 settings 样式 = 1.x 行 3769-3939 的 GM_addStyle 块）。
 *  - 行 3940-4207 settings_template → 抽到 SettingsPanel.vue（SFC，<template> 逐字保留三分组+功能区+重置+原生入口+空状态）。
 *  - 行 4208-4447 Vue.createApp({template,setup,mounted}).use(vant).mount('#settings') → mountVueApp 挂 SFC。
 *  - 行 4443-4446 mounted removeToast(部署 toast)+createToast success → SFC onMounted 内 removeToastHandle+toast。
 *
 * vant 注入（02 §5 / SFC 化）：1.x `settings.use(vant)` 整包注入是为内联模板 van-* 组件注册与函数式
 *  `vant.showConfirmDialog`；2.0 SFC 后 van-* 经按需 import 注册、函数式 API 经 `import {showConfirmDialog} from 'vant'`
 *  直接调（与 B6 use-schedule-export 路线一致），不依赖整包 unsafeWindow.vant——故 mountVueApp 不传 vantInstance。
 *
 * Version 透传：1.x setup 内 `scriptVersion: Version`（Version=Info.script.version，1.x 行 311）。
 *  2.0 经 getContext().version 取（context.version 同源），作 rootProps 传 SFC（显示在功能描述 V 版本号）。
 *
 * ScriptCat 原生配置面板：完整 ==UserConfig== 由 vite-plugin-monkey 的 generate 钩子追加到构建产物；本页
 * “ScriptCat 原生配置”按钮调用 CAT_userConfig（GM grant）打开该面板。原生面板与本页增强设置界面并存。
 * （2.0 审计：config/user-config.schema.js 字段化 schema 已删除——无消费者，SettingsPanel 为保持 1.x 模板逐字
 * 而硬编码字段；若未来要 schema-driven 设置页，应重建并从 GM_VALUE_DEFAULTS 派生单一来源。）
 */
import { mountAppPage } from '../../../composables/use-app-page.js';
import { mountVueApp } from '../../../composables/use-vue-app.js';
import { getContext } from '../../../context.js';
import { MyConsole } from '../../../utils/console.js';
import SettingsPanel from '../components/settings/SettingsPanel.vue';
// 公共骨架（Vant 文档色板/滚动条/box-sizing/html,body）与 settings 专属样式分离注入（B2 复用改造）：
// 顺序硬要求 appPageStyle 在前（与 1.x 单块内公共段在前的覆盖顺序一致）。
import appPageStyle from '../../../composables/app-page.css?style';
import settingsStyle from '../components/settings/settings.css?style';

const console = MyConsole('[sslvpn.settings]');

/**
 * 设置页入口：部署骨架 → 挂 SettingsPanel SFC（含三分组/功能区/重置/原生入口）。
 * 对应 1.x webvpnHSettings() 主体（行 3749-4450）。
 */
export async function register() {
  console('进入设置页');

  const ctx = getContext();

  // mountAppPage：清 body → title → 装 toast/FA → 部署中常驻 toast → 挂 <div id=settings> 容器。
  const { deployToast } = mountAppPage({
    id: 'settings',
    title: '脚本设置 - H',
    extraSetup() {
      // 1.x 行 3769-3939：settings 样式。公共首段（:root --van-doc-* / 滚动条 / box-sizing / html,body）
      //  由 app-page.css 提供（先注入，覆盖顺序与 1.x 单块一致）；本文件只含 #settings 专属与
      //  .settings-function-* / .settings-groups / .group / .login-setting-disabled / @media。
      (document.head || document.documentElement).append(appPageStyle, settingsStyle);
    },
  });

  // 挂 SettingsPanel SFC（1.x 行 4208-4449 Vue.createApp(...).use(vant).mount('#settings')）。
  mountVueApp({
    root: SettingsPanel,
    id: 'settings', // 复用 mountAppPage 已建的 #settings 容器
    rootProps: {
      scriptVersion: ctx.version, // 1.x 行 4413 scriptVersion: Version
      deployToast, // SFC onMounted 末 removeToastHandle(deployToast) + 弹 success（1.x 行 4444-4445）
    },
  });
}
