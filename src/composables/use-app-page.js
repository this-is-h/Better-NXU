/**
 * use-app-page — 独立 H 页面公共骨架（取代 1.x settings/about/tools 三处 notification 初始化样板）
 * 对应 1.x：Better NXU.user.js 行 3749-3768（webvpnHSettings 头）、4452-4473（webvpnHAbout 头，多 markdown-css/marked）、
 *          4898-4914（webvpnHTools 头）——三处清 body→title→addToast→ToastCss→FontAwesome→绑定 createToast/removeToast
 *          →部署中 toast→GM_addElement('div',{id}) 步骤一字不差。
 * 依赖：libraries/notification（installNotification 装 toast）、
 *       libraries/fontawesome（installFontAwesome 注入 svg-logo 改写后样式）、
 *       原生 DOM（创建挂载节点）、utils/console
 * 入口/被谁调用：sites/sslvpn/pages/{settings,about}.page.js；sites/webvpn/pages/tools.page.js
 *
 * 抽取动机（01 §8.2-1 + B2 验收 3）：
 *  1.x settings/about/tools 三处开头各粘贴一份"清空 body → 设 title → 装 notification（addToast+ToastCss+重设
 *  createToast/removeToast）→ 装 FontAwesome → 部署中常驻 toast → GM_addElement 挂 <div id>"样板。2.0 合并到
 *  mountAppPage，调用方一行完成骨架。about 页多出的 github-markdown-css + marked 注入、tools/settings 各自的
 *  全局样式注入通过 extraSetup 回调处理（B2 风险对策：参数化 extraSetup，避免单一函数包打天下）。
 *
 * 1.x 清 body 行为保留：1.x 用 `document.querySelector("body").innerHTML = ""`（行 3750/4453/4898），本 helper
 * 使用 `document.body.replaceChildren()`。注意这与 §B6 风险"整 body 序列化 reparse"不同：那是 jwgl 课表场景对已渲染
 *  Vue app 的破坏；这里页面正是要被本脚本接管重建，清空 body 是有意为之（settings/about/tools 三页本身是空白页等待填入）。
 */
import { installNotification, toast } from '../libraries/notification.js';
import { installVantStyle } from '../libraries/vant-style.js';
import { MyConsole } from '../utils/console.js';

const console = MyConsole('[use-app-page]');

/**
 * 一次性部署一个独立 H 页面的公共骨架：清空 body → 设标题 → 装 toast/FontAwesome → 挂 <div id> 容器 → 返回容器。
 *
 * 与 1.x 三处样板步骤对齐（行 3750-3768 / 4453-4473 / 4898-4914）：
 *   1. document.body.replaceChildren() 清空（1.x 行 3750 等）
 *   2. document.title = title（1.x 行 3751 等）
 *   3. installNotification()（= 1.x addToast+GM_addStyle(ToastCss)+绑 createToast/removeToast，行 3755-3761）
 *   4. installFontAwesome()（= 1.x GM_addStyle(svg-logo 改写)，行 3758/4462/4907）
 *   5. deploy 常驻 toast（1.x `createToast("info","请等待工具部署",0)` 行 3763/4467/4912）——返 toast 句柄，调用方
 *      部署完成后可 removeToastHandle 取消
 *   6. extraSetup?.() 页面专属注入回调（about 的 github-markdown-css+marked、tools/settings 的 GM_addStyle 全局样式）
 *   7. 挂 <div id> 容器到 body（1.x GM_addElement(body,'div',{id})，行 3768/4473/4914）
 *   返回 mountEl 供调用方 Vue.mount / 后续操作。
 *
 * @param {{id:string, title:string, deployMessage?:string,
 *          extraSetup?:(args:{mountEl:Element}) => void}} options
 *   - id: 挂载容器 id（settings / about / tools 等）
 *   - title: document.title（1.x 形如 `脚本设置 - H`）
 *   - deployMessage: 部署中常驻 toast 文案（默认 `请等待工具部署`，1.x 行 3763/4467/4912）
 *   - extraSetup: 页面专属额外初始化回调（在挂容器前调用，可参 mountEl）。如 about 页注入 markdown-css+marked。
 * @returns {{mountEl:HTMLDivElement, deployToast:*}} mountEl=挂载容器，deployToast=部署中 toast 句柄
 */
export function mountAppPage({ id, title, deployMessage = '请等待工具部署', extraSetup } = {}) {
  // 1. 清空 body（1.x 行 3750/4453/4898）。
  document.body.replaceChildren();
  // 2. 设标题（1.x 行 3751/4454/4899）。
  if (title) document.title = title;

  // 3. 装 notification（含 addToast、ToastCss 和 FontAwesome）。
  installNotification();
  // 保持原入口顺序：Vant 基础样式先注入，页面专属样式随后覆盖。
  installVantStyle();
  // 4+. 部署中常驻 toast（1.x 行 3763/4467/4912：duration=0 常驻）。
  const deployToast = toast('info', deployMessage, 0);

  // 6. 挂 <div id> 容器。等价 1.x `GM_addElement(body,'div',{id})`（1.x 行 3768/4473/4914）：
  //  走原生 createElement+appendChild（这三处只设 id 一个属性，等价；免依赖 GM_addElement）。
  const mountEl = document.createElement('div');
  mountEl.id = id;
  document.body.appendChild(mountEl);

  // 7. 页面专属额外初始化（about 的 markdown 注入、tools/settings 的 GM_addStyle 全局样式等）。
  if (typeof extraSetup === 'function') {
    try {
      extraSetup({ mountEl });
    } catch (error) {
      console('extraSetup 回调抛错', error, 'warn');
    }
  }

  return { mountEl, deployToast };
}
