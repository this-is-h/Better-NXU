# 依赖升级与安全验证

## 1. 范围与版本

2026-11-15 以 `origin/main` 为基线更新 npm 依赖和固定的远程运行时，不包含尚未合并的 Ding 通知改动。版本依据 npm 官方 registry 和各项目的正式发布记录；运行时保持精确版本，开发依赖保持原有 semver 范围策略。

| 依赖                                 | 原版本  | 当前版本 |
| ------------------------------------ | ------- | -------- |
| Vue                                  | 3.5.43  | 3.5.45   |
| Vite                                 | 8.3.0   | 8.3.8    |
| @vitejs/plugin-vue                   | 6.0.9   | 6.0.11   |
| commitlint CLI / conventional config | 21.2.3  | 21.2.4   |
| ESLint                               | 10.11.0 | 10.15.0  |
| eslint-plugin-vue                    | 10.11.0 | 10.12.1  |
| globals                              | 17.12.0 | 17.14.0  |
| lint-staged                          | 17.5.1  | 17.6.0   |
| Prettier                             | 3.9.9   | 3.10.1   |
| snapdom                              | 3.1.0   | 3.7.5    |
| marked                               | 18.0.14 | 18.2.0   |
| DOMPurify                            | 3.4.15  | 3.4.18   |
| ONNX Runtime Web                     | 1.30.0  | 1.31.1   |
| pnpm                                 | 10.32.1 | 10.34.9  |

Vue 的 npm 与 `@require` 版本同步。ONNX 的 JS、mjs、WASM 同步升级，并与 npm 发布包逐字节核对；所有更新的远程文件均重新计算 SHA384，保留摘要校验、匿名 GM 下载、嵌套 Blob 和页面来源还原。未增加 `grant`、`connect` 或匹配范围。

lint-staged 要求至少 Node 22.22.1，因此 Node 范围调整为 `^22.22.1 || >=24.0.0`；CI 继续使用最新 Node 22 补丁，并同步 pnpm 版本。

## 2. 保留项

- Vant 4.10.2、captcha-recognizer-js 1.0.4、vite-plugin-monkey 8.1.1、@eslint/js 10.0.1、eslint-config-prettier 10.1.8、husky 9.1.7、github-markdown-css 5.9.0 和英语训练数据 1.0.0 已为最新稳定版。
- Tesseract 7.0.0 继续使用它声明依赖的 core 7.0.0。core 的 `latest` 标签仍指向 6.1.2，不据此降级。
- SheetJS 官方独立分发仍为 0.20.3；npm 的 `xlsx` 0.18.5 不是升级目标。
- h.notification 的 ScriptCat 官方版本仍为 1.0.7。主线旧通知使用 FontAwesome，因此本分支保留 6.2.1；Ding 分支已移除脚本自己的字体资源和注入，教务原页面的图标类名保持不变。
- 按维护者确认，pnpm 暂不跨主版本迁移至 12.x。GitHub Actions 自身的主版本迁移不属于本次 npm / 运行时升级范围，固定 Action SHA 保持不变。
- 传递依赖按上游兼容范围刷新，不将旧 CommonJS 依赖强制替换为不兼容的最新主版本，也不添加安全告警豁免或 overrides。

## 3. 安全结果

升级前全量审计有 15 条告警，其中 4 条高危、0 条严重。高危涉及 brace-expansion、source-map-js 和 Vite；生产依赖审计也包含 source-map-js 的高危告警。

刷新后，brace-expansion 使用兼容的 1.1.22 / 5.0.13，source-map-js 为 1.2.2，minimatch 新版链路为 11.0.8，fast-uri 为 3.1.9。全量和生产依赖审计均未发现已知漏洞。CI 的安全门禁改为包含开发依赖，避免仅扫描生产依赖时漏掉构建工具的高危漏洞。

主要公告：

- [brace-expansion：嵌套展开导致栈耗尽](https://github.com/advisories/GHSA-qhr7-859c-m2p7)
- [brace-expansion：逗号解析导致栈耗尽](https://github.com/advisories/GHSA-6j4f-fj2g-mc7p)
- [source-map-js：事件循环拒绝服务](https://github.com/advisories/GHSA-68fv-2mgg-jv7q)
- [Vite 安全公告](https://github.com/vitejs/vite/security/advisories)

审计结果只覆盖扫描时已公布的漏洞，不保证远程库或依赖绝无风险。

## 4. 验证

已执行：

```bash
pnpm install --frozen-lockfile --registry=https://registry.npmjs.org/
pnpm check
pnpm test:coverage
pnpm audit --registry=https://registry.npmjs.org/
pnpm audit --prod --audit-level=high --registry=https://registry.npmjs.org/
pnpm outdated
git diff --check
```

- 197 项 Node 测试、ESLint、文档、构建和元数据校验通过；行覆盖率 86.95%，通过 80% 门禁。
- npm 直接依赖检查无待升级项；全量与生产审计均为 0 条告警。
- 本地 Chrome 使用更新后的完整构建脚本、真实 Vue/Vant、snapdom、marked/DOMPurify、ONNX/WASM 和量化模型。分别验证直连、模拟 WebVPN，以及从学校公开地址下载的完整 WebVPN 网关脚本；GM 下载仅映射到已校验的本地静态资源，脚本沙箱与真实页面 API 分离。
- 三种环境均通过 Vant 设置开关交互、Markdown 危险属性与链接过滤、750×350 PNG 导出和样式恢复，以及模型初始化、预热和连续两次空白画布推理。未发现页面脚本错误或额外远程资源请求。
- 安装脚本由 564,441 字节降至 549,942 字节，gzip 由 143,291 降至 142,385 字节。远程 snapdom 文件增加约 53.5 kB，ONNX WASM 增加约 609 kB，均不编入安装脚本。

尚未执行真实 ScriptCat 与校园登录态回归；本地完整网关脚本测试不能证明学校服务器接受滑动，也不能代替脚本管理器的资源下载与 CSP 验证。合并前仍需按[开发验证矩阵](development.md)检查直连 / WebVPN 登录、课表导出和通知。

## 5. 官方来源

- [Vue 3.5.45](https://github.com/vuejs/core/releases/tag/v3.5.45)
- [Vite 8.3.8](https://github.com/vitejs/vite/releases/tag/v8.3.8)
- [snapdom 3.7.5](https://github.com/zumerlab/snapdom/releases/tag/v3.7.5)
- [ONNX Runtime 1.31.1](https://github.com/microsoft/onnxruntime/releases/tag/v1.31.1)
- [DOMPurify 发布记录](https://github.com/cure53/DOMPurify/releases)
- [marked 发布记录](https://github.com/markedjs/marked/releases)
- [pnpm 10.34.9](https://github.com/pnpm/pnpm/releases/tag/v10.34.9)
- [SheetJS 独立安装说明](https://docs.sheetjs.com/docs/getting-started/installation/standalone/)
