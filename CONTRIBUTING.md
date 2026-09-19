# 参与 Better NXU 开发

感谢提交 Issue 和 Pull Request。开始前请阅读[GitHub 协作开发规范](docs/dev/github-workflow.md)。它是贡献者、维护者和后续协作会话共同遵循的完整规则，包含工作区接手、分支、commit、各类更新注意事项、PR、审查、合并、发布和回滚。

## 最低要求

- 正常开发从最新 `main` 创建主题分支，一个 PR 只处理一个主题。
- 分支名以受控前缀开头：`feat/`（或 `feature/`）、`fix/`、`bugfix/`、`hotfix/`、`docs/`、`refactor/`、`perf/`、`test/`、`build/`、`ci/`、`chore/`、`release/`。`pre-push` 钩子会拒绝其他命名。
- commit 标题使用 `<type>: <summary>` 或 `<type>(<scope>): <summary>`（Conventional Commits），例如 `fix(ids): 处理登录请求超时`。commitlint 钩子会自动校验：type 必须是 feat/fix/docs/style/refactor/perf/test/build/ci/chore/revert，标题不超过 72 字符，句尾不加句号。
- `pnpm install` 会自动启用 Git 钩子（husky）：提交前对暂存代码跑 Prettier + ESLint（`lint-staged`），提交信息跑 commitlint，推送前校验分支名。钩子拒绝时按提示修复，不要习惯性 `--no-verify`。
- 实现、直接对应的测试、迁移和文档应在同一 PR 完成。
- 普通 PR 不提交 `dist`，合并后由 GitHub Actions 统一构建并回写。
- 不覆盖工作区中无法确认归属的已有改动。

提交 PR 前至少完成：

```bash
pnpm install --frozen-lockfile
pnpm check        # docs → lint → test → build → verify-meta
```

CI 还会独立执行两项质量门禁，本地可提前验证：

```bash
pnpm test:coverage   # 行覆盖率 ≥ 80%，低于阈值失败
pnpm audit --prod --audit-level=high   # 依赖安全扫描（npmmirror 镜像可能不支持，加 --registry=https://registry.npmjs.org/）
```

涉及 GM API、UserConfig、校园登录态、跨域请求、远程资源或学校页面 DOM 的修改，还需要在 ScriptCat 中安装 `dist/better-nxu.user.js` 真机回归，并在 PR 中记录脱敏结果。用户安装入口为 [ScriptCat 的 Better NXU 项目页](https://scriptcat.org/zh-CN/script-show-page/1429)。

禁止在 Issue、PR、日志或截图中提交账号、密码、cookie、token、课表私钥及其他个人信息。安全漏洞请按 [SECURITY.md](SECURITY.md) 的私密流程报告，不要公开披露。
