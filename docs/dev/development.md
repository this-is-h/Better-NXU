# 开发、测试与发布

## 1. 环境准备

项目指定 pnpm，版本见 `package.json#packageManager`；`pnpm-lock.yaml` 是唯一锁文件。

```bash
pnpm install --frozen-lockfile
```

Node 要求 `^20.19.0 || >=22.12.0`。推荐 Node 22，与 CI 一致。

常用命令：

| 命令           | 作用                                                           |
| -------------- | -------------------------------------------------------------- |
| `pnpm dev`     | 启动 Vite 开发服务器，仅适合构建和公开页面调试                 |
| `pnpm test`    | 运行 `node --test`                                             |
| `pnpm build`   | 生成安装脚本和 metadata                                        |
| `pnpm preview` | 预览 Vite 输出；不能模拟 ScriptCat                             |
| `pnpm docs`    | 检查 Markdown 本地链接、标题层级、代码围栏、冲突标记和行尾空格 |
| `pnpm check`   | 文档检查、测试、构建、元数据校验和体积输出的发布前统一入口     |

开发服务器无法准确模拟 GM API、`@require` 包装作用域、`@inject-into page`、校园登录态和 WebVPN 跨域 cookie。涉及这些边界的改动必须安装 `dist/better-nxu.user.js` 回归。

## 2. 本地工作流

工作区接手、分支、commit、更新联动、PR、代码审查与合并规则见 [GitHub 协作开发规范](github-workflow.md)。

1. 阅读改动所属站点 page、它调用的 component/auth/composable，以及对应路由。
2. 确认工作区已有改动，不覆盖他人或未提交文件。
3. 对纯逻辑先写/改 Node 测试，再修改实现。
4. 对 DOM 适配保留超时、空值和手动降级。
5. 运行 `pnpm test`，再运行 `pnpm check`。
6. 在 ScriptCat 中安装构建产物，按受影响页面回归。
7. 记录真实 URL 形态、命中的 site/page、选择器状态和脱敏错误；禁止记录账号、密码、cookie、token、私钥或选中文本。

## 3. 新增页面或路由

### 创建 page

在 `src/sites/<site>/pages/<name>.page.js` 导出：

```js
export async function register() {
  // 页面级编排
}
```

page 应只负责：安装所需运行时、等待页面就绪、挂载组件/调用 auth、处理页面级错误。复杂纯逻辑移入组件或下层模块。

### 注册路由

1. 在 `src/router.js` 顶部静态 import `register`。
2. 把该 `register` 函数直接写入 `JUDGE_TABLE` 条目。
3. 在 `JUDGE_TABLE` 添加条目，具体路径放在通用主机条目前。
4. WebVPN 场景优先判断 `ctx.vpnContext.realHost` 和 `realPath`。
5. 认证或自动提交路由增加 `route-guards.js` 守卫，并在业务入口重复校验。
6. 添加直连、合法代理和伪造代理的测试。
7. 如果新增用户脚本匹配域名，同步 `vite.config.js` 和 `scripts/verify-meta.mjs` 的期望值。

vite-plugin-monkey 官方支持动态 import，但会改用 SystemJS 构建。当前发布合同明确不接受 SystemJS/chunk，因此路由继续使用静态 import；这是一项项目部署决策，不是插件能力限制。

## 4. 新增设置

1. 在 `GM_VALUE_DEFAULTS` 添加稳定键名和默认值。
2. 判断它是否属于“恢复功能默认值”，需要则加入 `SETTINGS_RESET_KEYS`。
3. 通过 `getGMValue` / `setGMValue` 使用，不直接访问 GM API。
4. 在设置页创建与存储键对应的响应式模型和 watcher。
5. 如果配置结构或语义变化，提升 `ConfigVersion` 并设计旧值迁移。
6. 更新用户设置文档、开发数据表和元数据相关测试（如适用）。
7. 测试首次安装、已有旧值、恢复功能默认值、完全重置四种路径。

账号密码默认 `undefined`；自动登录 UI 必须在凭证不完整时禁用并持久化为 `false`。

## 5. 引入依赖或远程资源

优先级：现有浏览器 API/项目 helper，其次已有 npm 依赖，最后才新增远程 `@require`/`@resource`。

新增远程可执行或样式资源时：

1. 固定完整版本，禁止 `latest`、`main` 或浮动 semver。
2. 计算并核对 SHA384，使用 ScriptCat/vite-plugin-monkey 期望的 `#sha384-<base64>` 格式。
3. 在 `vite.config.js` 中保持依赖与桥接脚本顺序。
4. 提供资源缺失时的用户可操作降级。
5. 更新 `scripts/verify-meta.mjs` 的数量、名称和固定值。
6. 比较产物原始/gzip 体积并说明增加来源。
7. 真机验证资源被 ScriptCat 接受，UMD 全局落在预期 window。

README/CHANGELOG 是经消毒的非执行内容，允许使用 `main` 无摘要 URL。不要把这一例外扩展到 JS 或 CSS。

### IDS 滑块资源

WebVPN 的外链、Blob 和 Worker 兼容方案已集中记录在[WebVPN 资源加载排障](webvpn-resource-loading.md)，包括错误对照、嵌套 Blob 与来源还原示例、依赖升级和完整网关脚本验证步骤。

`captcha-recognizer-js@1.0.4/src/core.js`（MIT）的小型算法静态编入脚本。上游只开放模型 URL，ORT JavaScript 和 WASM 路径写死在 Worker；`libraries/slider-recognizer.js` 校验并替换这两处加载点，升级依赖时必须重新核对。原 IIFE `@resource` 已移除。

`libraries/slider-resources.js` 在首次使用时经 `GM.xmlHttpRequest` 匿名下载 ORT 1.20.1 的 `ort.min.js`、`ort-wasm-simd-threaded.mjs`、`ort-wasm-simd-threaded.wasm` 和识别器 1.0.4 的模型，逐一校验 SHA384。ORT 摘要由 CDN 原始文件计算，模型摘要取自同版本 npm 包内文件。所有文件都在已有 `@connect cdn.jsdelivr.net` 范围内。不要将页面 `fetch` 或远程 `importScripts` 作为回退，否则 WebVPN 会再次重写地址。

Worker 只收到本地 Blob URL 与模型 `Uint8Array`，保持单线程 WASM 和原展示坐标映射。单次下载超时为 60 秒，整个初始化上限 90 秒，识别上限 30 秒；同页并发初始化复用同一个 Promise。失败、显式释放及 `pagehide` 会中止请求、拒绝等待中的任务、终止 Worker 并回收 Blob URL，随后允许重试。

发布前在 ScriptCat 安装构建产物，分别验证 IDS 直连与 WebVPN：首次下载及再次识别、背景图尺寸大于展示尺寸、无缺口、断网/下载失败、初始化超时后的手动回退。检查资源下载未进入 WebVPN 的 `/https/<token>/npm/` 路径，且不再出现 JavaScript 收到登录 HTML 的 MIME 错误。Node 测试与本地真实 WASM 加载不能替代这两条登录流程的实测。

`ids/auth/slider-retry.js` 管理最多三次尝试（首次 + 两次重试）。学校成功时设置 `.sliderContainer_success` 并提交表单，失败约一秒后更新 `#slider-img1/2` 并清空、重画 Canvas。仅当图片来源或画布节点变化（无源图片时检测背景像素变化）才重试；两幅画布均有内容且稳定 120 ms 后才能识别（每 60 ms 检查一次）。新图绘制最多等待 8 秒，推理中换图则丢弃旧结果。拖动后的等待不设失败倒计时，成功标记、关闭验证或 `pagehide` 结束监测；延迟跳转不会触发额外拖动。识别模型在循环外加载，同页并发调用共用一个流程。回归应包含连续三次失败、前两次失败第三次成功、超过一分钟的响应延迟、慢速重绘、节点替换和离开页面的清理。

`ids/auth/slider-drag.js` 是项目自有的 IDS 拖动实现，仅派发学校组件使用的 `mousedown`、`mousemove`、`mouseup`。终点使用识别出的展示距离，拖动范围不超过轨道可用宽度；5 秒超时、页面离开或控件隐藏/移除时停止后续事件。取消时在按下原点释放，避免提交未完成轨迹。旧的来源不明通用拖动脚本不进入发布分支；新轨迹需在 ScriptCat 实际登录中回归。

拖动使用 `requestAnimationFrame` 和 `performance.now()` 按实际经过时间推进，目标时长随距离在 420–700 ms 内变化，不累积固定步数的定时器延迟。保留平滑加速/减速、控件内部起点变化和 1–3 像素纵向偏移，终点始终准确。学校组件以鼠标事件采集 `{a, b, c}` 位移/时间轨迹，移动点采样间隔至少 20 ms、位移至少 2 像素；脚本对普通移动事件做 20 ms 节流，末点仍完整发送。它不会移动系统光标，也不能把合成事件变成真实用户输入；服务器是否接受更短轨迹仍需真机确认。

2026-09-23 本地浏览器、合成画布、相同距离对比：60/120/220 像素拖动分别由 1552/1594/1589 ms 降至 449/528/655 ms，移动事件由每次 48 个降至 20/24/30 个；画布就绪等待由 449 ms 降至 154 ms。这是一次本地测量，受帧率和负载影响，不包含模型冷启动、推理、服务器验证与页面跳转。原实现的主要等待来自固定 48 点与每点 24–32 ms 延迟，再叠加 400 ms 画布等待；不应通过省略鼠标事件或直接改 CSS 来提速。

## 6. Vue、Vant 与 DOM

- Vue SFC 内按需 import Vant 组件和函数式 API，不调用全局整包 `vant`。
- 挂载页面使用 `mountVueApp()`；接管页先用 `mountAppPage()`。
- 叠加注入要创建独立容器，不能 mount 到学校页面已有业务根节点。
- IDS 填充按钮不需要 Vant，传 `useVantStyles: false`，避免全量 CSS 污染认证页。
- WebVPN 首页菜单需要成为 `header .rt` 的直接子节点。现有“离屏挂载后搬移根节点”是为了满足原站 CSS 结构，不要改回中间 wrapper。
- DOM 数据使用节点和 `textContent`。`v-html` 只允许源码常量；来自接口、GM 或文档的内容必须消毒。
- 页面监听器需要卸载，或证明同一页面生命周期只注册一次。SPA 回调特别容易重复注册。

## 7. 异步与网络约定

- 所有请求设置合理超时。教师查询、个人课表 ID 和身份验证默认 15 秒，ICS 请求为 20 秒。
- 可重复搜索/加载使用 AbortController 或版本号，旧响应不能覆盖新状态。
- fire-and-forget Promise 必须显式 `void` 且内部捕获，或在调用边界 `.catch()`。
- `setTimeout` 回调内也要捕获可能抛出的资源释放错误。
- worker 创建超时不等于底层 Promise 被取消；现有 OCR 会在迟到 worker 成功后立即 terminate。
- 并发状态要有锁：`authLoginSubmitting`、`jwglExcelExporting`、portal in-flight、工具页加载版本号可作参考。
- 后台标签页句柄、XHR、DOM 监听器、worker、Object URL 都要释放。
- 设置页异步写入通过按键合并的串行队列落盘；重置前必须先等待队列清空。

## 8. 测试现状

当前 Node 测试覆盖：

- IDS 直连与 WebVPN 严格守卫，拒绝其他代理主机的伪造认证路径。
- 所有 WebVPN host/token 构建与解析往返，端口和不安全输入拒绝。
- 最小 ICS 到 Schema 2.0 双节课解析。
- RSA-OAEP + AES-GCM 加解密往返。
- 课表 JSON 解析与文件内容分流（`crypto/parse.js`：明文/加密/超大/无效 JSON 错误码）。
- Excel 导出表生成（`excel-build.js`：课表/详情行布局与空安排拒绝）。
- 固定 `@resource` 在真实 page window 的求值与全局校验。
- 构建元数据、资源摘要、单文件约束和体积输出（由 `verify-meta.mjs`）。
- 设置队列、文件下载、fetch 超时、snapdom WebVPN 适配和 UserConfig 默认值。

整体行覆盖率门禁为 80%（`pnpm test:coverage`，`scripts/check-coverage.mjs` 解析 Node 内置覆盖率报告并强制阈值）；CI 中低于阈值无法合并。

`verify-docs.mjs` 另行检查根目录、`docs/`、`.github/` 等位置的 Markdown，保证本地链接与标题锚点可解析，并拦截标题跳级、未闭合代码围栏、冲突标记和行尾空格。

适合 Node 测试的内容：URL、文本解析、课表模型、加密、错误码、配置纯函数。依赖学校 DOM 或 GM 的场景应逐步补本地 HTML fixture 和明确测试桩，但测试桩不能编入生产包。

## 9. `verify-meta.mjs` 门禁

脚本会验证：

- 产物版本等于 `package.json`。
- `inject-into=page`、`run-at=document-idle`、`storageName=h.nxu`。
- match/connect 的精确集合和顺序、grant 的精确集合。
- 7 个 require、8 个 resource；可执行/样式远程 URL 均带 SHA384。
- README/CHANGELOG 仅为两个允许浮动的资源。
- user.js 与 meta.js 头部一致。
- `dist` 只有两个 JavaScript 产物，无 SystemJS。
- 输出 user.js 原始与 gzip 体积；当前不设置固定大小上限，显著增长须在 PR 中解释来源和影响。

修改元数据必须同步维护该脚本。项目目前只记录体积、不设固定上限，但 PR 仍应说明显著增长的来源、必要性和真机代价。

## 10. 真机回归矩阵

每次发布至少覆盖与改动相关的行；大范围重构应覆盖全部：

- IDS 直连登录、WebVPN 代理 IDS 登录、自动登录关闭时的填充按钮。
- 凭证缺失/错误、旧图形验证码、滑块验证（含自动识别成功与失败回退）和页面 DOM 缺失。
- 微信 `fast_login=0 -> 1`、二次认证、授权失败回跳。
- 教务域名、IP 和 WebVPN 三种形态；OCR 成功、超时、资源失败、手动降级。
- 教务首页菜单、课表美化、父 iframe 高度、图片/JSON/Excel 导出。
- WebVPN 首页搜索浮球、Better NXU 菜单、三类卡片与配置开关。
- 工具页教师搜索：回车、连续搜索、无结果、断网、超时、登录过期。
- 个人课表自动获取、链接加载、上传明文/加密 JSON、身份验证和导出限制。
- 多人空课表：混合密钥、取消私钥、删除成员、图片/Excel 导出。
- 门户直连/代理从 `#/hall` 切出再切回，确保重新注入且不重复。
- 知网/万方无选区与正常选区复制。
- WebVPN 工具伪失败页与普通失败页自动关闭设置。
- SSL VPN 设置页读写/两种重置，关于页 Markdown 正常/资源失败降级。
- 实验室安全平台跳转；评教只提示；团委无副作用。

## 11. 调试

生产 debug 默认关闭。在页面控制台执行后刷新：

```js
globalThis.__BETTER_NXU_DEBUG__ = true;
```

关注带作用域前缀的日志，如 `[路由]`、`[统一认证]`、`[教务课表]`、`[portal.hall]`。诊断 GM 注入时检查构建产物的 `@grant`、对应 `#gm` 导入和具体 API 是否可用；不要依赖或记录 vite-plugin-monkey 的私有 monkeyWindow 键。

未命中路由时先检查：外层 host/path、`vpnContext.viaVpn`、`realHost`、`realPath`、查询参数和路由顺序。命中但无 UI 时再检查等待选择器、远程资源和原站 DOM。

## 12. 发布

```bash
pnpm check
```

随后安装 `dist/better-nxu.user.js` 完成人工回归。确认：

- `dist` 只含 `.user.js` 与 `.meta.js`。
- 头部版本、权限、资源和 `@storageName` 正确。
- README/CHANGELOG 已更新；关于页资源在脚本安装/更新后才刷新。关于页 Markdown 来自持续同步的 [Gitee 镜像 `thisish/Better-NXU`](https://gitee.com/thisish/Better-NXU)。
- `CHANGELOG.md` 按 Keep a Changelog 记录用户可见变化。
- 没有修改现有 GM 键语义或遗失配置迁移。

`.github/workflows/build.yml` 在 `main` 的相关路径变化时运行 `pnpm check`，成功后将 `dist` 强制提交回 `main`。仓库分支保护必须允许该 bot 行为，否则应改用 Release/Artifact；不要让 CI 静默失败后仍发布旧产物。完整的 PR 审查、合并和合并后检查见 [GitHub 协作开发规范](github-workflow.md)。
