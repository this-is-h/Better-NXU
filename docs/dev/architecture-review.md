# Better NXU 架构审计与优化报告

审计基线：Better NXU 2.0.0 vite-plugin-monkey 重构版，生产环境为 ScriptCat 浏览器用户脚本，`@inject-into page`，单文件交付。本报告中的状态与指标以当前源码和 `pnpm check` 输出为准。

## 1. 总体结论

当前架构的主干是清晰的：入口、上下文、路由、站点页面、共享流程、第三方适配、课表内核和加密内核已有明确分层。站点页面统一通过 `register()` 接入，有序静态路由符合单文件用户脚本的现实限制；WebVPN URL 和 GM 存储也已有集中管理。

重构初版的主要风险并非目录结构，而是从单文件迁移到模块系统后产生的运行时边界：ScriptCat 的 page 注入和 `@require` 作用域、宽泛路由、异步任务失控、远程资源漂移，以及业务数据继续沿用字符串 HTML。当前优化已处理其中的高风险项，并建立了基础回归门禁。

## 2. 已完成修复

| 级别 | 问题                                                                       | 修复结果                                                                                 |
| ---- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| 高   | WebVPN 代理路由只要 URL 含 `login` 就可能进入 IDS 自动登录                 | 改为同时校验代理真实主机 `ids.nxu.edu.cn` 和真实认证路径，登录业务入口再次校验可信上下文 |
| 高   | IDS 二次认证仍保留外层 URL 子串兜底                                        | 改为严格真实主机/真实路径守卫，页面入口增加防御性校验                                    |
| 高   | 教务课表把课程字段插入 HTML 字符串                                         | 改用 `createElement`、`textContent` 和节点追加，阻断存储型/响应型 HTML 注入              |
| 中   | README/CHANGELOG 固定提交需要每次发布同步维护 URL 与摘要                   | 按发布策略改用无摘要的 `main` 资源；内容仍经 DOMPurify 消毒，资源失败时只显示转义纯文本  |
| 中   | 门户 SPA 异步回调异常可能成为未处理 Promise                                | 回调统一 Promise 化、捕获错误，并合并导航期间的重复触发                                  |
| 中   | 教师查询无超时、不可取消、旧响应可覆盖新查询                               | 增加 XHR 超时、AbortSignal、版本号、分页上限和严格分页校验                               |
| 中   | 教师 XML 解析异常可能逃出事件回调，使 Promise 永不结束                     | 检查 parsererror、字段和数组长度，解析失败统一 reject                                    |
| 中   | 教师搜索回车可能提交 `<form>` 并跳回 `/`                                   | 增加 `@submit.prevent`，点击项直接传业务对象，不再依赖事件目标 DOM 属性                  |
| 中   | 小工具后台预热在 GM API 缺失或空句柄时异步抛错                             | 增加 API/句柄守卫、数值定时器和打开/关闭异常处理                                         |
| 中   | OCR 多个常驻进度 toast、无超时、worker 可能泄漏                            | 合并为单一进度句柄；初始化/识别加超时；正常、异常和迟到 worker 均清理                    |
| 中   | 知网/万方无选区时调用 `getRangeAt(0)`                                      | 检查 `rangeCount`；日志只记录长度，不记录选中文本和 HTML                                 |
| 中   | Vant CSS 在所有匹配站点全局注入                                            | 改为实际 Vant 页面挂载时幂等注入，IDS 纯登录页显式跳过                                   |
| 低   | 生产 debug 日志增加噪音并可能暴露业务细节                                  | 生产默认关闭 debug，可通过 `__BETTER_NXU_DEBUG__ = true` 临时开启                        |
| 中   | 固定 UMD 资源通过 `pageWindow.eval` 执行                                   | 改用 ScriptCat 官方 `GM_addElement` 注入并绕过 CSP，执行后移除临时节点                   |
| 中   | FontAwesome 字体仍从官方已警告供应链风险的 BootCDN 加载                    | CSS 使用固定版本与 SHA384，字体相对路径改为同版本 jsDelivr npm 资源                      |
| 低   | `@run-at document-idle` 后仍重复等待 readyState                            | 删除自定义等待，直接使用 ScriptCat 生命周期保证                                          |
| 低   | 未启用 `mountGmApi` 却加载 vite-plugin-monkey 全局类型，可能掩盖裸 GM 调用 | 删除 `vite-plugin-monkey/global` 类型引用，只保留 `#gm` ESM 模块入口                     |
| 低   | 工具彩蛋使用 `window.open`，门户卡片使用内联 `onclick`                     | 工具彩蛋改用官方 `GM_openInTab`；静态门户链接改为带 `noopener noreferrer` 的原生链接     |

## 3. 重复与冗余治理

- 门户直连和 WebVPN 代理共用同一个 `portal/hall` page；站点内部 `portal/runtime/spa-history.js` 与 `hall-injector` 分别负责 history 补丁和 DOM 注入。
- 独立设置/关于/工具页面共用 `mountAppPage`，Vue 容器和 Vant 样式由统一挂载助手管理。
- WebVPN host/token 映射集中在 `webvpn-url.js`，工具预热、卡片和路由不再各自维护 token。
- FontAwesome 只由 notification 安装链路负责，避免同一页面重复注入。
- Markdown 只保留 `marked + DOMPurify` 一条渲染路径，删除失去调用方的重复消毒模块。
- 固定 UMD 资源统一经 `GM_addElement` 注入真实页面并校验全局，不再使用 `eval`。
- 配置读取使用 `GM_getValue(name, defaultValue)`，不存在的键不再因读取产生隐藏写入。
- Vue 组件回调通过 props 传递，删除课表导出、版本点击和设置跳转的页面全局函数。
- 删除无调用方的站点 barrel、路由 `{ register }` 二次包装和旧 IE 选区分支。
- 标签页关闭改用 vite-plugin-monkey 官方 `monkeyWindow.close()`，删除 `opener/open(_self)/top.close` 旧式兼容链。
- 修正 `.gitignore`，测试目录会随源码进入版本控制并供 CI 使用。
- 教师结果列分配改为连续取模，移除跨分页的临时行状态分支。

## 4. 性能评估

低频大资源已迁到 `@resource`，避免将 OCR、Markdown 解析器和完整样式全部编入脚本主体。当前构建不启用最终 IIFE 压缩，`verify-meta.mjs` 只输出 user.js 原始与 gzip 体积，不设置固定大小上限。体积用于评审趋势和启动成本，不作为单独的构建失败条件。构建仍为单 `.user.js`，没有 SystemJS 或动态 chunk。

需要区分“脚本主体体积”和“安装资源总量”：ScriptCat 仍需下载并缓存这些资源，收益主要是缩短脚本主体的安装、更新、解析与每页启动成本。Vant CSS 只在 Vant 页面注入 DOM；Tesseract 只在 OCR 触发时执行；marked/DOMPurify 只在关于页执行。资源缺失时 OCR 回退手动输入、Markdown 回退纯文本，且不会影响无关站点启动。

已完成的性能优化：

- 删除 `document-idle` 后的重复文档等待。
- 门户导航回调合并并发触发。
- 教师查询可取消旧请求，限制最大 100 页。
- Vant CSS 只在需要的页面写入 DOM，减少无关学校页面的样式解析和冲突。
- 元数据校验输出原始与 gzip 体积；出现显著增长时由 PR 解释来源、必要性和真机代价。
- 文档校验覆盖本地链接、标题层级与锚点、代码围栏、冲突标记和行尾空格，并纳入 `pnpm check`。
- Vant CSS、Tesseract、marked、DOMPurify 和关于页文档移出脚本主体，统一由资源适配器校验后按业务需要读取。
- OCR worker 无论成功、失败或初始化迟到都会回收。
- 课表美化不再序列化并重建整个 body。

Vant JS 暂不外置。将其改为全局 `@require` 虽可继续缩小脚本主体，但会让所有匹配页面在模块初始化时依赖 Vant 远程运行时，并需要额外验证 Vue/page window 桥接。继续优化应先以构建组成报告量化收益，再决定是否接受这一启动可靠性成本。

## 5. 剩余风险

### 缺少真实 ScriptCat 自动化

Node 测试能覆盖纯逻辑和构建合同，但无法模拟 ScriptCat 的 GM 注入、校园登录状态、跨域权限和学校页面 DOM。当前仍需要真机安装回归，这是发布前的主要残余风险。

### 页面 DOM 适配具有外部脆弱性

学校站点更新 class、iframe 或登录函数后，选择器和页面桥接可能失效。建议把关键选择器集中为站点内常量，并在等待超时时输出不含敏感数据的诊断信息。

### 包管理锁文件

项目已声明 `pnpm@10.32.1`，已删除包含旧依赖的 `package-lock.json`；`pnpm-lock.yaml` 是唯一锁文件。

### 常量 HTML

门户卡片生成仍使用由源码常量组成的 `innerHTML`。当前没有外部数据进入，风险可控；如果未来标题、URL 或卡片内容来自 GM 存储/接口，必须先改为 DOM 节点构建，不能直接插值。

## 6. 后续修改指南

### 第一优先级：真机回归

按[开发、测试与发布](development.md#10-真机回归矩阵)逐项安装测试。尤其关注 IDS 代理登录、Vant 样式加载顺序、OCR 超时降级和门户 SPA 切换。问题记录应包含 URL 形态、命中的 site/page、DOM 选择器状态和脱敏后的错误，不记录账号、密码、cookie、token 或选中文本。

### 第二优先级：补浏览器级测试夹具

建立本地静态 HTML fixture，模拟 IDS 表单、教务课表和门户 iframe。使用浏览器测试验证路由后实际 DOM 行为，但 GM API 需用明确的测试桩提供，不能把桩逻辑编入生产包。

### 第三优先级：体积优化

1. 使用构建可视化确认剩余业务代码与 Vant 组件占比。
2. 新增 Vant 组件时确认是具名按需导入，避免 `import * as vant`。
3. 只有在收益显著且完成 ScriptCat 真机桥接验证后，才考虑外置 Vant JS。
4. 可执行/样式外置资源必须固定版本、提供 SHA384、加载失败提示和安全降级；无摘要的 `main` 例外仅限经消毒的 README/CHANGELOG。
5. 每次方案都运行 `pnpm check` 并比较 user.js 原始/gzip 体积；显著增长须在评审中说明新增来源。

### 第四优先级：维护性收敛

- 将站点 DOM 选择器按页面集中，减少散落字符串。
- 为教师 XML 解析增加浏览器 DOMParser fixture 测试。
- 为 Markdown 消毒增加恶意链接、事件属性和图片协议测试。
- 对新增的全局事件监听器要求显式卸载或说明页面生命周期内只注册一次。
- 保持 `router.js` 只做判定和映射，业务副作用留在 page/auth 模块。

## 7. 验收标准

- `pnpm check` 成功。
- Markdown 本地链接、标题锚点和基础结构检查成功。
- `dist` 只有一个安装脚本和一个 metadata 文件，无 SystemJS/chunk。
- 元数据保持 10/15/7/8/3 的 match/grant/require/resource/connect 数量及预期值，并包含完整 UserConfig。
- 所有远程 require/resource 固定版本并校验摘要。
- 非 IDS 代理站点即使路径包含 `login` 或 `reAuthCheck` 也不触发认证逻辑。
- 可重复操作的网络请求不会产生结果竞态或永久 pending。
- 外部业务数据不通过未消毒的 HTML 字符串写入页面。
- 与改动相关的 ScriptCat 真机矩阵通过。
