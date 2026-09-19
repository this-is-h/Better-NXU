/**
 * sites/webvpn/pages/tools — webvpn 小工具页（1.x webvpnHTools 巨函数的挂载入口）
 * 对应 1.x：Better NXU.user.js 行 4774-7203（webvpnHTools 整函数）
 * 依赖：composables/use-app-page（mountAppPage 清 body/标题/toast/fontawesome/挂 #tools 容器，1.x 行 4898-4914）、
 *       composables/use-vue-app（mountVueApp 挂 ToolsApp SFC）、#gm（GM_openInTab）、
 *       libraries/notification（removeToastHandle/toast——mounted 等价）、utils/console、
 *       components/tools/ToolsApp.vue、components/tools/tools.css（1.x 行 4915-5799 的页面样式，?style 注入）
 * 入口/被谁调用：router 命中 webvpn '/wengine-vpn/failed' 且 body 含 '地址：/h/tools'（1.x 行 2417-2420）后由
 *               main 调本 page 的 register
 *
 * 挂载形态：接管重建——清 body + 重建 #tools 容器（1.x 行 4898-4914 逐字等价；与 home 的"原生页叠加注入"相反，
 *           本页 body 本就是 webvpn 失败页/空壳，接管是有意为之）。
 *
 * 与 1.x 等价点（C5）：
 *  - 行 4890-4897：register 最前预开两个后台 tab（信息门户 + 学工系统，催 webvpn 代理 cookie 供后续
 *    getIcsId/getStudentOwner fetch），5s 后自动关。GM_openInTab 从 #gm 导入（1.x 为裸调用）。
 *  - 行 4898-4914：mountAppPage({id:'tools', title:'小工具 - H'}) 一步完成清 body/标题/notification/fontawesome/
 *    部署中 toast/#tools 容器；1.x 的 GM_addElement(body,'div',{id:'tools'}) 由 mountAppPage 原生 createElement 等价。
 *  - 行 4915-5799：通过 vite-plugin-monkey `?style` 模块按路由注入 tools.css。
 *  - 行 6166-7202：mountVueApp({root: ToolsApp, id:'tools'})——SFC 已含 template+setup（vant 组件 PascalCase
 *    化 + npm 按需 import，无整包 vant 注入；1.x 的 tools.use(vant) 不再需要）。
 *  - 行 7195-7199 mounted 钩子：mountVueApp 完成后同步执行等价——removeToastHandle(deployToast)
 *    （=1.x removeToast(toast)）+ toast('success','小工具部署完毕',2) + toast('info','由于获取课表信息需要…',6)。
 *
 * 路由判定（router JUDGE_TABLE）：'/wengine-vpn/failed' 且 body 含 '地址：/h/tools'（1.x 行 2416-2424 子分支），
 *   与 failed page（同 path 但 body 不含该标记）互斥。
 */
import toolsStyle from '../components/tools/tools.css?style';
import { mountAppPage } from '../../../composables/use-app-page.js';
import { mountVueApp } from '../../../composables/use-vue-app.js';
import { GM_openInTab } from '#gm';
import { buildWebVpnUrl } from '../../../utils/webvpn-url.js';
import { removeToastHandle, toast } from '../../../libraries/notification.js';
import { MyConsole } from '../../../utils/console.js';
import ToolsApp from '../components/tools/ToolsApp.vue';

const console = MyConsole('[webvpn.tools]');

function openWarmupTab(openInTab, url) {
  if (typeof openInTab !== 'function' || !url) return;
  try {
    const tab = openInTab(url, { active: false });
    if (typeof tab?.close === 'function') {
      setTimeout(() => {
        try {
          tab.close();
        } catch (error) {
          console('后台预热标签页关闭失败', error, 'warn');
        }
      }, 5000);
    }
  } catch (error) {
    console('后台预热标签页打开失败', error, 'warn');
  }
}

/**
 * webvpn 小工具页挂载入口。对应 1.x webvpnHTools()（行 4774-7203）。
 */
export async function register() {
  // 1.x 行 4890-4897：后台预开信息门户 + 学工系统（催 cookie），5s 后自动关。
  // 代理 URL 经 buildWebVpnUrl 构造（B2 审计：原硬编码 webvpn token 与 WEBVPN_HOST_TOKENS 表重复，改单一来源）。
  openWarmupTab(GM_openInTab, buildWebVpnUrl('https://portal.nxu.edu.cn/index.html'));
  openWarmupTab(
    GM_openInTab,
    buildWebVpnUrl('https://xsfw.nxu.edu.cn/xsfw/sys/jbxxapp/*default/index.do#/wdxx')
  );

  // 1.x 行 4898-4914：清 body → 标题 → notification/fontawesome → 部署中 toast → 挂 #tools 容器。
  const { deployToast } = mountAppPage({ id: 'tools', title: '小工具 - H' });

  // 1.x 行 4915-5799：用 vite-plugin-monkey 的 ?style 模块按路由挂载页面样式。
  (document.head || document.documentElement).appendChild(toolsStyle);

  // 1.x 行 6166-7202：挂 ToolsApp SFC（template+setup 全量，vant 按需 import，无需 .use(vant)）。
  mountVueApp({ root: ToolsApp, id: 'tools' });

  // 1.x 行 7195-7199 mounted 钩子等价：移除部署中 toast + 部署完毕两条提示。
  removeToastHandle(deployToast);
  toast('success', '小工具部署完毕', 2);
  toast(
    'info',
    '由于获取课表信息需要，我们正在后台打开信息门户和学工系统页面，请稍后再打开"课表信息"页面，以免获取信息失败',
    6
  );

  console('小工具页部署完毕');
}
