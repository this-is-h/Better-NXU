# Better NXU 开发者文档

Better NXU 是面向宁夏大学多个站点的 ScriptCat 用户脚本。源码以 Vite、vite-plugin-monkey、Vue 3 和 Vant 组织，最终交付物仍是一个可安装的 `dist/better-nxu.user.js`。它不是普通 SPA：代码运行在学校页面、ScriptCat 沙箱、真实 page window 和远程 `@require` 资源共同组成的环境中。

## 建议阅读顺序

1. [架构说明](architecture.md)：入口、分层、路由、运行时边界和关键业务流。
2. [模块与 API 参考](modules.md)：逐目录说明文件职责和公开函数，包含 `utils/` 全量 API（含 snapdom WebVPN 适配）。
3. [数据、配置与安全](data-and-security.md)：GM 键、课表 Schema、加密信封、权限与外部请求。
4. [开发、测试与发布](development.md)：环境、常见改动流程、调试、测试矩阵和发布检查。
5. [GitHub 协作开发规范](github-workflow.md)：工作区接手、分支、commit、更新联动、PR、审查、合并、发布与回滚。
6. [设计决策与踩坑记录](design-decisions.md)：为什么这样设计、哪些写法不能随意改、已遇到的真机问题。
7. [架构审计与优化报告](architecture-review.md)：当前剩余风险和后续优化方向。

WebVPN 下出现外部脚本 MIME 错误、`Unexpected identifier 'ArrayBuffer'` 或 Blob 动态模块加载失败时，直接查看[WebVPN 资源加载排障](webvpn-resource-loading.md)：包含报错速查、可复用代码和完整网关脚本回归方法。

## 五分钟上手

环境要求：

- Node.js `^20.19.0 || >=22.12.0`
- pnpm `10.32.1`
- Chromium 系浏览器和 ScriptCat，用于真实站点回归

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm build
pnpm check
```

安装依赖会自动启用 Git 钩子（husky）：`pre-commit` 对暂存文件跑 Prettier + ESLint，`commit-msg` 按 Conventional Commits 校验提交信息，`pre-push` 校验分支名前缀（`feat/`、`fix/`、`hotfix/` 等）。

主要入口：

```text
vite.config.js          用户脚本元数据、远程依赖、桥接脚本和产物配置
src/main.js             初始化上下文，执行首个命中路由
src/context.js          当前 URL 与 WebVPN 真实站点的单例快照
src/router.js           有序路由表，映射到 sites/*/pages/*.page.js
src/sites/              各站点页面编排与 UI
src/composables/        跨站点流程和 Vue 页面骨架
src/libraries/          第三方运行时及样式适配
src/schedule/           课表纯逻辑内核
src/crypto/             课表加密纯逻辑内核
src/utils/              最底层通用能力
test/                   Node 内置测试
scripts/verify-docs.mjs Markdown 链接、标题、围栏和空白规范校验
scripts/verify-meta.mjs 构建产物、元数据校验和体积输出
scripts/check-branch-name.mjs pre-push 分支命名校验
scripts/check-coverage.mjs    行覆盖率门禁（阈值 80%）
scripts/run-coverage.mjs      跨平台覆盖率运行器
commitlint.config.js   Conventional Commits 校验规则
eslint.config.js       ESLint flat config（静态检查）
.prettierrc.json       Prettier 格式化配置
```

## 开发时先记住的约束

- 保持 `@inject-into page` 和 `@storageName h.nxu`。前者决定 GM/Page 作用域模型，后者决定老用户配置是否还能读到。
- 所有页面模块统一导出 `register()`，路由使用静态 import。vite-plugin-monkey 官方虽支持单文件动态 import，但会引入 SystemJS，不符合当前发布合同。
- GM API 必须从项目的 `#gm` 别名按需静态导入，让 vite-plugin-monkey 负责作用域适配与 `autoGrant`；不要读取 `__monkeyWindow-*` 私有桥接。
- 认证凭证只允许在可信 IDS 页面或教务登录页面读取。IDS 路由与业务入口都必须有主机守卫。
- 页面数据进入 DOM 时使用 `textContent`、属性 API 和节点构建；Markdown 必须经过 DOMPurify。
- `h.notification`、snapdom、XLSX 的 `data:` 桥接脚本必须紧跟对应 `@require`，不能排序或合并。
- Vant CSS 只在实际挂载 Vant 页面时注入；IDS 轻量页面使用 `useVantStyles: false`。
- 网络请求要有超时、错误处理和旧请求失效机制；worker、监听器、定时器与后台标签页要有清理路径。
- `pnpm check` 通过不代表真实可用。GM 注入、校内登录态、跨域和学校 DOM 必须安装产物后真机验证。

## 修改归属速查

| 需求                                  | 首选位置                                             |
| ------------------------------------- | ---------------------------------------------------- |
| 新站点或新页面                        | `src/sites/<site>/pages/`，并在 `src/router.js` 注册 |
| 同站点复用 UI                         | `src/sites/<site>/components/`                       |
| 两个及以上站点共享的业务流程          | `src/composables/`                                   |
| 第三方全局库、CSS 或 `@resource` 适配 | `src/libraries/` 与 `vite.config.js`                 |
| URL、DOM、文件、日志等基础能力        | `src/utils/`                                         |
| GM 键和默认值                         | `src/config/gm-keys.js`，同步版本与迁移策略          |
| 课表解析、归一、空闲计算              | `src/schedule/`                                      |
| 密钥、信封、加解密                    | `src/crypto/`                                        |
| 元数据与远程依赖                      | `vite.config.js`、`scripts/verify-meta.mjs`          |
