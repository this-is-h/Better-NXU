# 站点维护与依赖评估

本轮以已合入的 2.0.1 为基线，覆盖阅读页、信息门户、工具入口和已确认的异步问题。历史 CHANGELOG 由维护者整理，本轮仅增加未发布条目。

## 1. 架构与一致性

当前 `main → router → sites/pages → 站点组件/共享流程 → libraries/utils` 分层适合单文件 ScriptCat 脚本，无需引入前端路由框架或额外分包。站点统一通过 `register()` 接入；直连与 WebVPN 共用页面模块，代理 host/token 继续由 `webvpn-url.js` 集中管理。

本轮修正以下不一致：

- 知网、万方阅读页从 WebVPN 专属目录移至各自站点。路由和页面入口共用主机/路径守卫，元数据补充指定直连阅读路径。
- 选区复制归入 `composables/reader-copy.js`；鼠标拖动归入 `utils/slider-drag.js`。IDS 保留缺口识别与重试，知网只处理无缺口控件，不加载模型。
- 工具页直接匹配 `/h/tools`，同时兼容失败页地址标记；普通失败页与工具页互斥。
- 教务 IP 改用精确 hostname 比较，所有端口继续支持；不接受名称相似的其他域名。
- 课表 iframe 在加载及收到自身通知时同步高度，跨源跳转保留原高度，离页清理监听。
- 课表 ID、身份接口的超时覆盖响应体；取消后的迟到响应不再写缓存。导出绑定操作开始时的课表，身份确认或加密选项期间切换数据即取消导出。
- 普通通知默认转义文本；只有项目静态构造的凭证配置入口调用 `toastTrustedHtml()`，避免文件名和服务端消息作为 HTML 执行。

门户保留本次卡片点击打开方式，改用事件监听并支持 Enter；H 小工具使用完整 WebVPN 地址。README 保留图片属性调整并补回闭合标签。

## 2. 已更新的依赖

| 依赖                  | 原版本  | 本轮版本 | 兼容处理                                          |
| --------------------- | ------- | -------- | ------------------------------------------------- |
| Vue                   | 3.5.22  | 3.5.43   | npm 与 `@require` 同步，保留现有全局桥接模型      |
| Vant                  | 4.9.21  | 4.10.2   | npm JS 与固定 CSS 同步，不改组件调用方式          |
| vite-plugin-monkey    | 8.0.0   | 8.1.1    | 同一主版本，验证单文件构建、GM grants 和 metadata |
| @vitejs/plugin-vue    | 6.0.6   | 6.0.9    | 同一主版本的 SFC 编译修复                         |
| ESLint                | 10.10.0 | 10.11.0  | 保留现有 flat config                              |
| commitlint CLI/config | 21.2.2  | 21.2.3   | 保留 Conventional Commits 配置                    |
| Prettier              | 3.9.7   | 3.9.9    | 只格式化本轮代码，历史 CHANGELOG 不改             |
| DOMPurify             | 3.2.4   | 3.4.15   | 保留 Markdown 白名单，验证危险属性移除            |
| marked                | 18.0.6  | 18.0.14  | 保留 UMD 和同步 `parse()` 调用                    |
| github-markdown-css   | 5.8.1   | 5.9.0    | 保留 `.markdown-body` 作用范围                    |

Vue、Vant、DOMPurify、Markdown CSS 的新版在原镜像地址返回 HTML，因此切换到固定版本 cdnjs 文件；marked 继续使用 unpkg。所有远程 JS/CSS 均重新下载核验 SHA384，未放宽完整性检查。构建校验新增 Vue/Vant 的 npm 与 CDN 版本一致性及 require/bridge 顺序约束。

直接依赖按 npm registry 查询。生产依赖审计未发现已知漏洞；这不代表第三方运行时代码绝无风险。远程库依据官方发布记录单独评估：

- [Vue 发布记录](https://github.com/vuejs/core/blob/main/CHANGELOG.md)
- [Vant 4.10.2](https://github.com/youzan/vant/releases/tag/v4.10.2)
- [vite-plugin-monkey 8.1.1](https://github.com/lisonge/vite-plugin-monkey/releases/tag/v8.1.1)
- [DOMPurify 3.4.15](https://github.com/cure53/DOMPurify/releases/tag/3.4.15)

完整工具链已不支持 Node 20：ESLint 要求至少 Node 22.13，commitlint 要求至少 22.12。`engines` 统一为 `^22.13.0 || >=24.0.0`，CI 继续安装最新 Node 22 补丁。pnpm 保持 10.32.1 和现有锁文件格式。

## 3. 运行时主版本升级

2026-09-24 按维护者要求升级至 npm 最新稳定版，并对调用方完成兼容适配：

| 依赖                    | 已完成适配                                                                                                                                                                                                                                                                                                             |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| snapdom 3.1.0           | 保留单文件 `@require` 和 page window 桥接；三个导出调用仅传 `scale: 2.5`，没有与宽高冲突的参数。显式 `embedFonts: false` 保持原系统字体及请求成本，调用方可覆盖；WebVPN 使用 `cache: 'disabled'` 与 `invalidate: true`，保留临时样式/序列化器恢复。[迁移说明](https://github.com/zumerlab/snapdom/releases/tag/v3.0.0) |
| Tesseract 7.0.0         | UMD、worker、core 同步固定到 7.0.0。core 仍传目录，由官方 worker 自动检测 relaxed SIMD/SIMD/普通 WASM；语言模型保持 eng 1.0.0。core 的 latest 标签仍指向 6.1.2，但 7.0.0 已正式发布且由 Tesseract 7 声明依赖，不能混用旧 core。[发布说明](https://github.com/naptha/tesseract.js/releases/tag/v7.0.0)                  |
| ONNX Runtime Web 1.30.0 | JS/mjs/WASM 三件套同步升级并重新计算 SHA384；保持单线程 WASM、GM 匿名下载、嵌套 Blob、代理来源还原和本地模型二进制。上游识别器 1.0.4 的旧 URL 仅作为源码替换锚点，不进行远程加载。                                                                                                                                     |

snapdom/Tesseract CDN 文件与 npm 发布包逐字节一致。FontAwesome 6.2.1、SheetJS 0.20.3 和 h.notification 1.0.7 保持原版本。

## 4. 验证与适用范围

Node 回归覆盖直连/代理路由、伪主机拒绝、拖动坐标与取消、知网异步控件和三次上限、选区复制、iframe 重载、慢响应体与导出切换。统一门禁为 `pnpm check`、`pnpm test:coverage` 和生产依赖 audit。

2026-09-25 提交前检查：130 项测试、生产构建与元数据校验全部成功。行覆盖率 86.92%，通过 80% 门禁；产物 523,154 字节，gzip 133,893 字节。生产依赖 audit 未发现已知漏洞；固定运行时资源保留 SHA384 校验。

2026-09-26 安装版滑块修复复查：`pnpm check` 的 132 项测试、构建和元数据检查通过，`pnpm test:coverage` 行覆盖率 86.92%，`pnpm audit --prod --audit-level=high --registry=https://registry.npmjs.org/` 未发现已知漏洞。产物 523,328 字节，gzip 133,956 字节。Vue 改为同版本生产文件，重新核验 SHA384 并增加精确构建断言。

本地独立 Chrome 使用保存的完整 WebVPN 网关脚本、真实 ORT 1.30.0/WASM/量化模型，以及分离的脚本沙箱和页面对象。修复前的完整构建产物复现 `Failed to construct 'Worker' ... cannot be accessed from origin`；修复后在网关和直连环境均完成初始化及连续两次空白画布推理，无页面错误或 Vue 开发版警告。GM 下载在本地映射到已校验资源，仅在测试内暴露构建后的识别器入口；未安装真实 ScriptCat，未验证学校服务器接受滑动。Node 新增沙箱/页面 API 分离、构造失败清理及重试回归。该修复统一通过 `unsafeWindow` 使用页面 Blob、URL、Worker、地址转换器和离页监听。

本地浏览器已验证真实 DOM 下的知网形态拖动（260px 约 700ms）、第三次后停止、人工拖选复制、门户重复注入及 Enter 打开工具地址、升级后的 marked/DOMPurify 与普通通知文本处理，以及 Vue/Vant 工具页挂载和标签切换。样例使用真实项目模块和已校验库，GM/学校接口使用本地替身。

本次升级在本地真实浏览器中验证 Tesseract 7 在直连及完整 WebVPN 前端脚本环境识别 ABC123，以及 snapdom 3.1 在两种环境生成内容正确的 750×350 图片（原元素 300×140，2.5 倍）。ONNX 使用实际 1.30.0 运行时和现有量化模型在两种环境进行初始化及推理。

实测工作区为仓库原目录，分支 `feat/site-maintenance-local`；安装新构建的 `dist/better-nxu.user.js` 完成 ScriptCat 回归。普通开发页可运行 `pnpm dev`；zylib 的 Service Worker 会代理本地开发模块，应改用 `pnpm dev:build` 并更新 ScriptCat 中的完整脚本，详见[开发说明](development.md#zylib-阅读页的开发入口-mime-错误)。本地独立 Chrome 已用模拟 Service Worker/GM 复现该 MIME 错误，并验证完整脚本可正常复制；此验证不代表真实校园登录态已通过。

课表图片导出已补齐独立姓名确认：可使用配置学号对应的姓名，或只填写姓名；取消不导出，查询失败转手填。手填姓名不写入课表 owner，JSON 继续使用身份核验。回归覆盖首次图片命名、已核验姓名复用、空值/取消、异常文件名、确认期间切换课表/周次；本地页面验证两条姓名路径及文件名。

上线前仍需真实 ScriptCat 验证：直接 `/h/tools` 与旧失败入口；直连/代理知网滑块及复制；门户卡片导航；IDS 自动登录；教务 iframe、课表导出和样式。真实服务器是否接受合成滑动不能由本地 DOM 测试证明。知网对同一控件只尝试一次，同页最多处理三个新控件；失败后保留手动路径。
