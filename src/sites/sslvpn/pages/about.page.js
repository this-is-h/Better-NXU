/**
 * SSL VPN 关于页：接管空壳页面并渲染 README、CHANGELOG 与致谢名单。
 * README/CHANGELOG 通过 Gitee main 的无摘要 @resource 提供；Markdown 统一经 libraries/markdown 的
 * 固定版本 marked + DOMPurify 通路处理。资源缺失时显示本地纯文本降级信息。
 * Vant 组件由 SFC 按需导入，样式在实际挂载页面时由 mountAppPage/mountVueApp 幂等注入。
 */
import { mountAppPage } from '../../../composables/use-app-page.js';
import { mountVueApp } from '../../../composables/use-vue-app.js';
import { GM_addStyle, GM_getResourceText } from '#gm';
import { MyConsole } from '../../../utils/console.js';
import AboutPanel from '../components/about/AboutPanel.vue';
// 公共骨架与 about 专属样式分离注入（B2 复用改造），顺序 appPageStyle 在前。
import appPageStyle from '../../../composables/app-page.css?style';
import aboutStyle from '../components/about/about.css?style';

const console = MyConsole('[sslvpn.about]');

// 去掉文档顶部原本不在关于页展示的两行标题/提示。
function trimMarkdownHead(text) {
  return String(text || '').replace(/^(?:.*(?:\r\n|\n|\r)){2}/, '');
}

function readMarkdownResource(name, fallback) {
  const markdown = GM_getResourceText?.(name);
  if (typeof markdown === 'string' && markdown.trim() !== '') return trimMarkdownHead(markdown);
  console(`Markdown 资源 ${name} 不可用，使用降级内容`, '', 'error');
  return fallback;
}

/**
 * 关于页入口：部署骨架 → 挂 AboutPanel SFC（其 onMounted 渲染 README/CHANGELOG/致谢）。
 * 对应 1.x webvpnHAbout() 主体（行 4452-4773）。
 */
export async function register() {
  console('进入关于页');

  const aboutMd = readMarkdownResource('about-md', '项目说明暂时无法加载，请稍后重新安装或更新脚本。');
  const updateMd = readMarkdownResource('update-md', '更新日志暂时无法加载，请稍后重新安装或更新脚本。');

  // mountAppPage：清 body → title → 装 toast/FA → 部署中常驻 toast → 挂 <div id=about> 容器。
  const { deployToast } = mountAppPage({
    id: 'about',
    title: '关于我们 - H',
    extraSetup() {
      // 1.x 行 4470：注入 github-markdown-css（@resource，与 about.vue 的 .markdown-body 配合）。
      GM_addStyle?.(GM_getResourceText?.('github-markdown-css') || '');
      // #about 页样式（1.x 行 4474-4582）。公共首段（:root/滚动条/box-sizing/html,body）由 app-page.css
      //  先注入（顺序与 1.x 单块一致），本文件只含 #about 专属与 .group/.markdown-body/ul 列表。
      (document.head || document.documentElement).append(appPageStyle, aboutStyle);
    },
  });

  // 挂 AboutPanel SFC（1.x 行 4755-4771 Vue.createApp(...).use(vant).mount('#about')；2.0 改 SFC 按需 import vant）。
  mountVueApp({
    root: AboutPanel,
    id: 'about', // 复用 mountAppPage 已建的 #about 容器
    rootProps: {
      aboutMd,
      updateMd,
      deployToast, // SFC onMounted 末 removeToastHandle(deployToast) + 弹 success 提示（1.x 行 4766-4767）
    },
  });
}
