/**
 * use-vue-app — Vue app 挂载帮手（取代 1.x 散点 `Vue.createApp({template,setup}).use(vant).mount('#id')` 样板）
 * 对应 1.x：Better NXU.user.js 行 4208/4448/4755/4770/6166/7201（settings/about/tools Vue.createApp().use(vant).mount）
 *          + 行 3768/4473/4914 的 `GM_addElement(body,'div',{id})` 挂容器
 * 依赖：vue（externalGlobals 别名 'Vue'；本 helper `import { createApp } from 'vue'`，vite-plugin-monkey
 *       将其改写为对 IIFE 参数 `vue` 的引用——见下方"取值路径"重要说明）
 * 入口/被谁调用：site 页面（B6/B7）的 SFC 挂载点（beautify/CourseToolbar/SettingsPanel 等）
 *
 * 抽取动机（01 §8.2-2）：
 *  1.x 在 settings/about/tools/主页浮球/教务导出栏等 5+ 处各写 `Vue.createApp({template,setup}).use(vant).mount('#id')`
 *  + `GM_addElement('div',{id})` 挂容器。2.0 合并到 mountVueApp，调用方一行挂载。
 *
 * Vant 注入策略（SFC 化决策）：
 *  2.0 SFC 化后各 SFC 直接 `import { Button, Cell } from 'vant'`（按需 tree-shake），Vant 样式仅在实际挂载
 *  Vant 页面时由 installVantStyle 幂等注入；纯认证页面可传 `useVantStyles:false` 跳过。
 *  各 SFC 自行按需导入 Vant 组件，不再依赖 1.x 的 `unsafeWindow.vant` 整包注入。
 *
 * 容器挂载：传入 id 时先确保 `<div id>` 存在于 body（挂载点），等价 1.x GM_addElement('div',{id})。
 *
 * 【取值路径 重要，2026-07-30】原实现在脚本上下文经 `globalThis.Vue` 取 Vue——真机 ScriptCat 失败：
 *  ScriptCat 把整个脚本（@require 代码 + vite-plugin-monkey 产物 IIFE）包在同一 sandbox 包装函数内执行，
 *  @require 的 vue.global.min.js 顶层 `var Vue = ...` 声明的是该包装函数的**局部**变量，**不挂 globalThis
 *  也不挂真实 page window**（详见 ScriptCat 文档"脚本作用域问题"+"Require 后出现各种问题"+ vue 引用文档）。
 *  故：
 *   - 裸 `Vue` 引用在同 sandbox 包装函数内可达（1.x `Vue.createApp` 走此路）；
 *   - `globalThis.Vue` 在 sandbox 下取不到（Vue 不是全局对象的属性）→ 旧实现报"Vue 全局未就绪"。
 *  vite-plugin-monkey 的 externalGlobals `vue:'Vue'` 把 SFC 的 `import { createApp } from 'vue'` 改写为对
 *  IIFE 参数 `vue` 的引用（产物尾部 `})(Vue)` 把裸 Vue 作参数传入——裸 Vue 在 sandbox 包装函数局部可达）。
 *  本 helper 改为同样 `import { createApp } from 'vue'`，不再经 globalThis，与 SFC 同源同路。
 */
import { createApp } from 'vue';
import { installVantStyle } from '../libraries/vant-style.js';
import { MyConsole } from '../utils/console.js';

const console = MyConsole('[use-vue-app]');

/**
 * 挂载一个 Vue app 到 #id 容器并返回 app 实例。
 *
 * @param {{root:object, id?:string, rootProps?:object, useVantStyles?:boolean}} options
 *   - root: createApp 的根组件选项或 SFC 组件对象
 *   - id: 挂载容器 id（不存在则自动创建 `<div id>` 挂到 body，等价 1.x GM_addElement）
 *   - rootProps: 传给根组件的 props（透传 Vue.createApp(root, rootProps)），如 SFC 的 defineProps 入参
 * @returns {object} Vue app 实例（可用于 .provide/.config 等进阶配置）
 */
export function mountVueApp(options = {}) {
  const { root, id, rootProps, useVantStyles = true } = options;

  // 确保挂载容器存在：传入 id 且 #id 不在 body 时创建（等价 1.x GM_addElement(body,'div',{id})，行 3768/4473/4914）。
  let mountEl = id ? document.getElementById(id) : null;
  if (id && !mountEl) {
    mountEl = document.createElement('div');
    mountEl.id = id;
    document.body.appendChild(mountEl);
    // GM_addElement 提供额外能力（如沙箱内安全创建+样式注入），但 1.x 这三处只用了 {id} 一个属性，
    // 等价于原生 createElement + appendChild。保留原生路径不依赖 GM_addElement（简化 grant 依赖面）。
  }

  // createApp 来自 `import { createApp } from 'vue'`，vite-plugin-monkey 改写为对 IIFE 参数 `vue` 的引用
  // （= 裸 Vue，sandbox 包装函数局部可达，见模块头"取值路径"）。不再经 globalThis.Vue（sandbox 下取不到）。
  if (typeof createApp !== 'function') {
    console('createApp 未就绪（@require vue 可能被 ScriptCat 拒载）', undefined, 'error');
    return null;
  }

  if (useVantStyles) installVantStyle();
  const app = createApp(root, rootProps);
  app.mount(mountEl || document.body.appendChild(document.createElement('div')));
  return app;
}
