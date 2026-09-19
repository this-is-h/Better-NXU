/**
 * vite-plugin-monkey 构建配置
 * 对应 1.x：Better NXU.user.js 头部 ==UserScript== 元数据块（行 1-46）
 * 依赖：@vitejs/plugin-vue（必须先于 monkey，见 docs/dev/design-decisions.md）
 * 入口：src/main.js → router.js → sites/* 分发
 *
 * 关键约束见 docs/dev/architecture.md 与 docs/dev/design-decisions.md：
 *  - vue 经 externalGlobals 纯字符串 'Vue' 仅设全局别名，不自动 emit @require；
 *    vue 的唯一 @require 来源是下面 userscript.require 手写的那条（带 1.x 原 sha384）。
 *  - snapdom / xlsx / h.notification 仍走头部手动 @require（保留 1.x URL + sha384 连字符语法）。
 *  - Vant JS 仍由 npm 构建；Vant CSS、Tesseract、marked、DOMPurify 与关于页文档走固定版本/提交的 @resource。
 *  - @storageName h.nxu 是 ScriptCat 专有非标键，必须经 userscript.$extra 透传
 *    （直接写 userscript.storageName 会被 vite-plugin-monkey 8.x 静默忽略，见 §6.1/§8）。
 *  - 所有 sha384 逐字取自 1.x 头部（连字符 `#sha384-<base64>`，非 Tampermonkey 等号），不手填不截短。
 */
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import monkey, { util } from 'vite-plugin-monkey';
import { USER_CONFIG_BLOCK } from './src/config/user-config.js';

// h.notification.js 桥接脚本（@require 顺序紧跟在 h.notification.js 之后执行）。
//  【为何需要 2026-07-30】ScriptCat 把整个脚本（@require 代码 + vite 产物 IIFE）包在同一 sandbox 包装函数内
//  执行，h.notification.js 用顶层 `function addToast(){}`/`const ToastCss` 声明的是该包装函数的**局部**标识符，
//  **不挂 globalThis、也不挂真实 page window**（详见 ScriptCat 文档"脚本作用域问题"+"Require 后出现各种问题"）。
//  后果：
//   - 1.x 脚本主体与 @require 同 sandbox，裸 `addToast()` / `unsafeWindow.createToast = createToast` 可达
//    （裸引用同包装函数局部；unsafeWindow 桥接供页面 onclick 用）。
//   - 2.0 模块化后，libraries/notification.js 模块作用域既取不到裸 `addToast`（@require 不在模块作用域），
//    也取不到 `globalThis.addToast`/`unsafeWindow.addToast`（h.notification 局部声明不落这两个对象）。
//  修复（对齐 ScriptCat vue 引用文档"unsafeWindow.Vue=Vue"桥接 + data: @require 变体）：用一条 data: @require
//  脚本，紧跟 h.notification.js 之后在 sandbox 包装函数内执行——此时裸引用同包装函数局部 addToast/createToast/
//  removeToast/ToastCss 全部可达，把它们挂到 unsafeWindow（真实 page window）。之后 2.0 模块经
//  vite-plugin-monkey 的 ESM `unsafeWindow` 取这四项即就绪（page 模型 unsafeWindow === 真实 window，见 §6.5）。
//  顺序硬要求：必须排在 h.notification.js 之后（依赖其声明的局部）；不带 sha384（data: 自身即源码，无外网校验）。
//  兼容多脚本管理器：unsafeWindow 缺省回落 window（page 模型下二者一致；沙箱模型 unsafeWindow=真实 window）。
//  幂等：纯赋值，重复执行无副作用。
//  挂载面：同时挂 unsafeWindow 与 window 两处；page 模型下二者都指向真实 page window。裸引用
//  addToast/createToast/removeToast/ToastCss/CAT_userConfig 在 @require
//  脚本所在 sandbox 包装函数作用域可达（同 1.x 裸引用机制），不可改 eval(包装函数局部取不到)。
const NOTIFICATION_BRIDGE = `;(function(){var w=(typeof unsafeWindow!=='undefined')?unsafeWindow:window;w.addToast=addToast;w.createToast=createToast;w.removeToast=removeToast;w.ToastCss=ToastCss;var c=(typeof CAT_userConfig!=='undefined')?CAT_userConfig:undefined;if(c){w.CAT_userConfig=c;window.CAT_userConfig=c;}})();`;
const NOTIFICATION_BRIDGE_REQUIRE = util.dataUrl(NOTIFICATION_BRIDGE);

// snapdom / xlsx 桥接脚本（同 NOTIFICATION_BRIDGE 的作用域根因，2026-07-31 真机报图片/Excel 导出崩）。
//  snapdom@2.16.0 自身 `window.snapdom=N`、xlsx.full.min.js 自身 `window.XLSX=XLSX`——这俩库用的裸 `window`
//  在 ScriptCat sandbox 包装函数内不保证是真实 page window（实测挂到了 sandbox window 而非真实 page window），
//  故真实 page unsafeWindow 上取不到 snapdom/XLSX，课表页读取 .snapdom.download / .XLSX.utils 时会崩溃。
//  桥接同 toast: 紧跟各库条目之后在 sandbox 包装函数内执行，裸引用同包装函数局部的 snapdom/XLSX（@require
//  顶层 var 挂的那个，1.x 裸引用机制），挂到 @grant unsafeWindow（真实 page window）。顺序硬要求:必须排在
//  各自库条目之后（依赖其局部声明）；不带 sha384（data: 自身即源码）。幂等:纯赋值。挂 unsafeWindow 与 window 两处。
//  注意:裸引用依赖 snapdom/xlsx 顶层 var 是 sandbox 包装函数局部可见——与 1.x 裸 `snapdom.download` 同路。
const SNAPDOM_BRIDGE = `;(function(){var w=(typeof unsafeWindow!=='undefined')?unsafeWindow:window;var s=(typeof snapdom!=='undefined')?snapdom:(typeof window!=='undefined'?window.snapdom:undefined);if(s){w.snapdom=s;window.snapdom=s;}})();`;
const SNAPDOM_BRIDGE_REQUIRE = util.dataUrl(SNAPDOM_BRIDGE);
const XLSX_BRIDGE = `;(function(){var w=(typeof unsafeWindow!=='undefined')?unsafeWindow:window;var x=(typeof XLSX!=='undefined')?XLSX:(typeof window!=='undefined'?window.XLSX:undefined);if(x){w.XLSX=x;window.XLSX=x;}})();`;
const XLSX_BRIDGE_REQUIRE = util.dataUrl(XLSX_BRIDGE);

export default defineConfig({
  // vite-plugin-monkey 默认关闭最终 IIFE 压缩；显式启用可显著减小安装脚本且不改变单文件模型。
  // 但脚本管理器一般不允许压缩
  // build: {
  //   minify: 'oxc',
  // },
  plugins: [
    // 官方要求 monkey() 位于插件列表最后；vue() 必须先完成 SFC 解析。
    vue(),
    monkey({
      entry: 'src/main.js',
      // 使用官方 clientAlias；业务代码从 #gm 静态导入，开发期/构建期的作用域差异由插件处理。
      clientAlias: '#gm',
      // vite-plugin-monkey 官方 generate 钩子可扩展最终元数据文本。ScriptCat 的 ==UserConfig==
      // 不是标准 userscript 键，故对 serve/build/meta 三种产物统一追加完整配置块。
      generate({ userscript }) {
        return `${userscript}\n\n${USER_CONFIG_BLOCK}`;
      },
      userscript: {
        name: 'Better NXU',
        namespace: 'https://thisish.com/',
        version: '2.0.0', // 脚本版本与配置结构版本独立；本版 ConfigVersion 为 7（见 src/config/config-version.js）。
        description: '这是一个提高各种 NXU 网站体验的用户脚本（Userscript）',
        author: 'H',
        'run-at': 'document-idle',
        // 显式声明 inject-into: 'page'（见 docs/dev/design-decisions.md 的运行时边界说明）。
        // 1.x 头部未写该键、ScriptCat 默认即 page；2.0 经 vite-plugin-monkey 打包头部多 @require/@resource，
        // 显式 page 确保 ScriptCat 走与 1.x 同一注入模型（脚本进 page 上下文、GM_* 在脚本主作用域可见），
        // 从源头对齐 1.x 的 GM_* 取值前提，避免 stub `typeof GM_info` 在 content/边界模型下取不到值。
        'inject-into': 'page',
        // match 10 项逐字取自 1.x 头部行 9-18，不增不减（C4）。
        match: [
          '*://webvpn.nxu.edu.cn/*',
          '*://sslvpn.nxu.edu.cn/*',
          '*://jsfzyjxzlxt.nxu.edu.cn/*',
          '*://jwgl.nxu.edu.cn/*',
          '*://portal.nxu.edu.cn/*',
          '*://sysaq.nxu.edu.cn/*',
          '*://202.201.128.234/*',
          '*://tuanwei.nxu.edu.cn/*',
          '*://ids.nxu.edu.cn/*',
          '*://open.weixin.qq.com/*',
        ],
        // 头部手动固定 @require，sha384 逐字取自 1.x 头部行 30-33（连字符语法）。
        // vue 这条同时是 externalGlobals: { vue: 'Vue' } 指向的全局来源（单一来源，见 §6.1）。
        // 顺序敏感：h.notification.js / snapdom / xlsx 各紧跟一条 data: 桥接脚本（*_BRIDGE_REQUIRE），
        //  把各库在 sandbox 包装函数内的局部/挂错 window 的全局声明桥接到真实 page unsafeWindow——
        //  详见 vite.config.js 顶部 NOTIFICATION_BRIDGE / SNAPDOM_BRIDGE / XLSX_BRIDGE 注释。
        require: [
          'https://scriptcat.org/lib/1405/1.0.7/h.notification.js#sha384-Ef8dnXffgAqEVHA7uHKmtub7Uh4Ji/Yv60yL+Himym+PdTNeb/NAKi+d9qh9olzC',
          NOTIFICATION_BRIDGE_REQUIRE,
          'https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/vue/3.5.22/vue.global.min.js#sha384-qCjGjR+q4j3L6F1d3hI/Tqq5Ry6XGIiJMUdZC+VawNbSWD2eP2RR+laa6A3euDAZ',
          'https://unpkg.com/@zumer/snapdom@2.16.0/dist/snapdom.js#sha384-XHEQh68myKc3CIe4DhnbAY1QEVszoaGTPQRzEM6JIKCWRg3mnUG3fAt3+UuxqEYE',
          SNAPDOM_BRIDGE_REQUIRE,
          'https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js#sha384-EnyY0/GSHQGSxSgMwaIPzSESbqoOLSexfnSMN2AP+39Ckmn92stwABZynq1JyzdT',
          XLSX_BRIDGE_REQUIRE,
        ],
        // 大体积、低频资源不编入用户脚本：ScriptCat 安装时缓存，业务命中时才读取/执行。
        // 可执行第三方库与样式固定完整版本并校验 SHA384；README/CHANGELOG 是经消毒的非执行内容，
        // 按发布策略读取 main 且不校验摘要，脚本安装/更新时即可取得当时的最新文档。
        // Vant JS 保持 npm 构建，避免把它变成所有匹配页面的关键远程启动依赖。
        resource: {
          'svg-logo':
            'https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/font-awesome/6.2.1/css/all.min.css#sha384-twcuYPV86B3vvpwNhWJuaLdUSLF9+ttgM2A6M870UYXrOsxKfER2MKox5cirApyA',
          'github-markdown-css':
            'https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/github-markdown-css/5.8.1/github-markdown.min.css#sha384-bKf/D9oOhMXM113OMRKT6sKFRT4jT3AulvzsGu563IJ5zmaH5LSA26VfwRJQ8GAR',
          'vant-css':
            'https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/vant/4.9.21/index.min.css#sha384-Jb7yH4uJOgDFef++Dmtf9JGETGSXgz9+wrg/jQ7XsqYtJzSClY4imewu/quoIrel',
          'tesseract-js':
            'https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/tesseract.js/6.0.1/tesseract.min.js#sha384-r1ru3tcf6FhnCFR4B7pIFG+BhFF9LlFtz/P1y4pblWn3AGs9y3lBx5SKLNf4+rED',
          'marked-js':
            'https://unpkg.com/marked@18.0.6/lib/marked.umd.js#sha384-uGn1eBC40GtuBgao0epc/cz9O4Lo8/flg/10SW+69UjLI5nP31iT4UPc65Xz10Le',
          'dompurify-js':
            'https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/dompurify/3.2.4/purify.min.js#sha384-eEu5CTj3qGvu9PdJuS+YlkNi7d2XxQROAFYOr59zgObtlcux1ae1Il3u7jvdCSWu',
          'about-md': 'https://raw.giteeusercontent.com/thisish/Better-NXU/raw/main/README.md',
          'update-md': 'https://raw.giteeusercontent.com/thisish/Better-NXU/raw/main/CHANGELOG.md',
        },
        // connect 逐字取自 1.x 头部行 43-45。一言 v1.hitokoto.cn 走 GM.xmlHttpRequest（02 §6.1）。
        connect: ['webvpn.nxu.edu.cn', 'portal.nxu.edu.cn', 'v1.hitokoto.cn'],
        // @storageName ScriptCat 专有经 $extra 透传（§6.1 源码核验：直接 userscript.storageName 会被静默忽略）。
        $extra: { storageName: 'h.nxu' },
        // 标准 GM API 全部通过 #gm 静态导入，由 autoGrant 精确收集。CAT_userConfig 是 ScriptCat
        // 的非标准 grant，不在 vite-plugin-monkey 客户端导出表中，因此仅保留这一项显式声明。
        grant: ['CAT_userConfig'],
      },
      build: {
        fileName: 'better-nxu.user.js', // 保 1.x 用户习惯（02 §6.2）
        metaFileName: true, // 生成 .meta.js，便于将来 updateURL 节流（1.x 无，合理增强，不破坏兼容）
        autoGrant: true,
        externalGlobals: {
          // vue：纯字符串值 → 仅全局别名 'Vue'，不自动 emit @require（见 §6.1 vue 单一来源约束）。
          // vite 据 globalsPkg2VarName 把 `import { createApp } from 'vue'` 改写为 globalThis.Vue 引用；
          // 头部 require 先注入 window.Vue 全局（vue.global.min.js 3.5.22）。
          vue: 'Vue',
          // snapdom/xlsx 走头部手动 @require；Vant JS 仍打包；其余低频库由业务代码从 @resource 按需注入。
        },
      },
    }),
  ],
});
