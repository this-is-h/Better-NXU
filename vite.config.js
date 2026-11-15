/**
 * vite-plugin-monkey 构建配置
 * 对应 1.x：Better NXU.user.js 头部 ==UserScript== 元数据块（行 1-46）
 * 依赖：@vitejs/plugin-vue（必须先于 monkey，见 docs/dev/design-decisions.md）
 * 入口：src/main.js → router.js → sites/* 分发
 *
 * 关键约束见 docs/dev/architecture.md 与 docs/dev/design-decisions.md：
 *  - vue 经 externalGlobals 纯字符串 'Vue' 仅设全局别名，不自动 emit @require；
 *    vue 的唯一 @require 来源是下面 userscript.require 手写的生产版（固定版本和 sha384）。
 *  - snapdom / xlsx 仍走头部手动 @require（保留 1.x URL + sha384 连字符语法）。
 *  - Vant JS 仍由 npm 构建；Vant CSS、Tesseract、marked、DOMPurify 与关于页文档走固定版本/提交的 @resource。
 *  - @storageName h.nxu 是 ScriptCat 专有非标键，必须经 userscript.$extra 透传
 *    （直接写 userscript.storageName 会被 vite-plugin-monkey 8.x 静默忽略，见 §6.1/§8）。
 *  - sha384 根据对应 CDN 原始文件计算（连字符 `#sha384-<base64>`，非 Tampermonkey 等号），不截短。
 */
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import monkey, { util } from 'vite-plugin-monkey';
import { USER_CONFIG_BLOCK } from './src/config/user-config.js';
import { LIBRARY_READER_MATCHES } from './src/utils/library-reader.js';
import { readFileSync } from 'node:fs';

// 小型滑块算法静态打包后，必须随单文件产物保留上游 MIT 许可。
const SLIDER_LICENSE = readFileSync(
  new URL('./node_modules/captcha-recognizer-js/LICENSE', import.meta.url),
  'utf8'
);
const DING_LICENSE = readFileSync(
  new URL('./node_modules/@yusufceng1z/ding/LICENSE', import.meta.url),
  'utf8'
);

const USER_CONFIG_BRIDGE = `;(function(){var w=(typeof unsafeWindow!=='undefined')?unsafeWindow:window;var c=(typeof CAT_userConfig!=='undefined')?CAT_userConfig:undefined;if(c){w.CAT_userConfig=c;window.CAT_userConfig=c;}})();`;
const USER_CONFIG_BRIDGE_REQUIRE = util.dataUrl(USER_CONFIG_BRIDGE);

// snapdom / xlsx 桥接脚本（ScriptCat 包装作用域适配，2026-07-31 真机报图片/Excel 导出崩）。
//  snapdom@2.16.0 自身 `window.snapdom=N`、xlsx.full.min.js 自身 `window.XLSX=XLSX`——这俩库用的裸 `window`
//  在 ScriptCat sandbox 包装函数内不保证是真实 page window（实测挂到了 sandbox window 而非真实 page window），
//  故真实 page unsafeWindow 上取不到 snapdom/XLSX，课表页读取 .snapdom.download / .XLSX.utils 时会崩溃。
//  桥接: 紧跟各库条目之后在 sandbox 包装函数内执行，裸引用同包装函数局部的 snapdom/XLSX（@require
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
        return `${userscript}\n\n${USER_CONFIG_BLOCK}\n\n/*! captcha-recognizer-js@1.0.4\n${SLIDER_LICENSE}\n*/\n\n/*! Ding@0.0.6\n${DING_LICENSE}\n*/`;
      },
      userscript: {
        name: 'Better NXU',
        namespace: 'https://thisish.com/',
        version: '2.0.5', // 脚本版本与配置结构版本独立；本版 ConfigVersion 为 9（见 src/config/config-version.js）。
        description: '这是一个提高各种 NXU 网站体验的用户脚本（Userscript）',
        author: 'H',
        'run-at': 'document-idle',
        // 显式声明 inject-into: 'page'（见 docs/dev/design-decisions.md 的运行时边界说明）。
        // 1.x 头部未写该键、ScriptCat 默认即 page；2.0 经 vite-plugin-monkey 打包头部多 @require/@resource，
        // 显式 page 确保 ScriptCat 走与 1.x 同一注入模型（脚本进 page 上下文、GM_* 在脚本主作用域可见），
        // 从源头对齐 1.x 的 GM_* 取值前提，避免 stub `typeof GM_info` 在 content/边界模型下取不到值。
        'inject-into': 'page',
        // 校园站点与指定文献阅读路径；zylib 在运行时再次校验目标主机与路径。
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
          ...LIBRARY_READER_MATCHES,
        ],
        // 头部手动固定 @require 的版本和 SHA384，保持运行时与桥接脚本相邻。
        // vue 这条同时是 externalGlobals: { vue: 'Vue' } 指向的全局来源（单一来源，见 §6.1）。
        // 顺序敏感：CAT_userConfig / snapdom / xlsx 各紧跟一条 data: 桥接脚本（*_BRIDGE_REQUIRE），
        //  把各库在 sandbox 包装函数内的局部/挂错 window 的全局声明桥接到真实 page unsafeWindow——
        //  详见 vite.config.js 顶部 USER_CONFIG_BRIDGE / SNAPDOM_BRIDGE / XLSX_BRIDGE 注释。
        require: [
          USER_CONFIG_BRIDGE_REQUIRE,
          'https://cdnjs.cloudflare.com/ajax/libs/vue/3.5.43/vue.global.prod.min.js#sha384-jpQley6yTEvoZeHVfCkBVqGK6kLbDxptME8BFcqX9FJiFhpNkdkUSs54xLMnxmuB',
          'https://unpkg.com/@zumer/snapdom@3.1.0/dist/snapdom.js#sha384-WGMhfcLrIwHy2nch3wquBVui5YbAvFGEjpUqtK65dcKwZ+vBMkydMJja61MRE6An',
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
            'https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.9.0/github-markdown.min.css#sha384-dvqix+FXNZkkgkfxRwowYZelxQUSFEjEbDpb1k1mIMw84dsT8M3NM2CJC3xyp2hh',
          'vant-css':
            'https://cdnjs.cloudflare.com/ajax/libs/vant/4.10.2/index.min.css#sha384-/emcjTEhfcL99sMjPCGhXaThIpqFm61vsVdjpoJHtfHHJ/mY354KjvR3/POEs56i',
          'tesseract-js':
            'https://unpkg.com/tesseract.js@7.0.0/dist/tesseract.min.js#sha384-2BQ3U3OdKOb0Uczxqr41I9UvZkzr4V9Hv8uSzMMZAlmhsFClvdZX5wi5fDCzG+tM',
          'marked-js':
            'https://unpkg.com/marked@18.0.14/lib/marked.umd.js#sha384-2vpGtuKqJvFlwJqYnf/wUMuzUfhUnYBt9oay0e2yaFcq0Dh6/aEbQ8YAOeKGzlYo',
          'dompurify-js':
            'https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.4.15/purify.min.js#sha384-uUMu9JDY09vBzRf9SPcK2VgUj+W/70J6Soc+Dded5P474ElQ63iv9j5N3DE7Kp3N',
          'about-md': 'https://raw.giteeusercontent.com/thisish/Better-NXU/raw/main/README.md',
          'update-md': 'https://raw.giteeusercontent.com/thisish/Better-NXU/raw/main/CHANGELOG.md',
        },
        // cdn.jsdelivr.net 用于滑块 ORT/WASM/模型的 GM 后台下载；固定版本与摘要见
        // libraries/slider-resources.js。Worker 只使用本地资源，避免 WebVPN 改写外链。
        connect: [
          'webvpn.nxu.edu.cn',
          'portal.nxu.edu.cn',
          'v1.hitokoto.cn',
          'cdn.jsdelivr.net',
          'unpkg.com',
        ],
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
          // 头部 require 提供与 npm 版本一致的 Vue 全局。
          vue: 'Vue',
          // snapdom/xlsx 走头部手动 @require；Vant JS 仍打包；其余低频库由业务代码从 @resource 按需注入。
        },
      },
    }),
  ],
});
