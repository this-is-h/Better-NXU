# GitHub 协作开发规范

本文是 Better NXU 的长期协作规范，适用于外部贡献者、仓库维护者，以及以后接手仓库的自动化工具或协作会话。它覆盖从接手工作区、创建分支和编写 commit，到更新依赖、提交 PR、审查、合并、发布和回滚的完整流程。

代码结构和实现约束见[开发、测试与发布](development.md)、[架构说明](architecture.md)、[数据、配置与安全](data-and-security.md)和[设计决策](design-decisions.md)。如果本文与实际代码或 CI 行为不一致，应先核对 `package.json`、`vite.config.js`、`scripts/verify-meta.mjs` 与 `.github/workflows/build.yml`，再在同一 PR 中修正文档；不要默默选择其中一套规则。

## 1. 规则强度与基本原则

本文使用以下词语区分规则强度：

- **必须/禁止**：正确性、安全性或发布流程的硬性要求，不满足时不能合并。
- **应该/不应**：默认做法；偏离时需要在 PR 中说明理由和替代验证。
- **可以**：按改动情况选择，不构成合并条件。

所有协作遵循以下原则：

1. `main` 始终保持可构建、可审查，正常开发不直接提交到 `main`。
2. 一个 Issue、分支和 PR 聚焦一个主题；不顺手混入无关重构或全仓库格式化。
3. 源码、测试、迁移、文档和更新日志属于同一项变更，应一起完成。
4. `pnpm check` 是统一自动检查入口，但不能代替 ScriptCat、校园登录态和学校真实 DOM 的人工回归。
5. 账号、密码、cookie、token、私钥、个人课表和未脱敏截图不得进入 Git、Issue、PR 或 Actions 日志。
6. 普通 PR 不提交 `dist`。合并后由 GitHub Actions 构建并回写发布产物。
7. 不用删除测试、放宽安全断言或隐藏错误的方式让 CI 变绿。
8. 不覆盖无法确认归属的本地改动。发现脏工作区时先识别边界，再继续工作。

## 2. 完整流程总览

```text
接手检查
  -> Issue/需求与影响范围确认
  -> 同步 main，创建主题分支
  -> 实现 + 测试 + 文档 + 迁移
  -> 自查 diff，编写原子 commit
  -> 推送并创建 Draft PR/PR
  -> GitHub Actions 执行 pnpm check
  -> 维护者审查与真机验证
  -> 在原分支回应意见并复查增量
  -> Squash and merge 到 main
  -> main 再次检查，Actions 回写 dist
  -> 安装产物抽查，关闭 Issue，记录后续事项
```

## 3. 接手仓库或开始新会话

开始修改前必须先了解当前状态。至少执行：

```bash
git status --short --branch
git remote -v
git log -10 --oneline
```

然后阅读与任务直接相关的源码、测试和文档，并核对：

- 当前分支是否为 `main`，是否应该先创建主题分支。
- 工作区是否已有修改、删除或未跟踪文件。
- 这些修改是否属于当前任务，是否可能来自其他人或前一次未完成的工作。
- `package.json` 的 Node/pnpm 版本、可用命令和脚本版本。
- `.github/workflows/build.yml` 的触发条件、权限和发布行为。
- 改动是否涉及 `vite.config.js` 元数据、GM 配置、远程资源或用户数据兼容。

### 脏工作区处理

仓库可能故意保留未提交工作。此时：

- 禁止使用 `git reset --hard`、`git clean -fd`、`git checkout -- .` 或类似命令清空工作区。
- 禁止恢复、删除或覆盖无法确认由自己产生的文件。
- 用 `git diff -- <文件>`、`git diff --staged` 和 `git status` 区分已有改动与本次改动。
- 本次修改应尽量限制在任务相关文件；必须编辑已有改动的文件时，保留原有内容并只追加必要变化。
- 提交前再次核对暂存区，确保没有把他人的工作一起提交。

### 自动化工具和后续协作会话

自动化工具或后续对话应把本文作为持久化项目上下文，但仍以用户当前指令为准。默认边界如下：

- 可以读取仓库、执行无副作用检查，并在被要求实现修改时编辑任务范围内的文件。
- 未得到明确要求时，不创建 commit、不推送分支、不创建或合并 PR、不发布版本。
- 不以“清理”为由删除已有改动，不擅自修改分支保护、Actions 权限或仓库设置。
- 完成后应报告修改文件、验证命令、未执行的真机步骤和剩余风险。

## 4. Issue、需求和安全报告

小型、边界清楚的修复可以直接提交 PR。以下事项应该先创建 Issue 或讨论方案：

- 新站点、新页面、大型功能或跨模块重构。
- GM 键、配置语义、课表 Schema、加密格式等持久化数据变化。
- 新增或替换远程 `@require`/`@resource`。
- 权限、认证、自动登录、跨域、发布方式和兼容性策略变化。
- 会显著增加产物体积或启动成本的依赖更新。

Issue 应包含可复现步骤、预期行为、实际行为、影响页面和已脱敏环境信息。不要只写“不能用”。与代码位置相关但尚未确认根因时，应把观察到的事实和推测分开。

安全漏洞或包含敏感数据的问题不要公开提交。按仓库根目录 [SECURITY.md](../../SECURITY.md) 使用 GitHub Private vulnerability reporting 或其中说明的备用私密渠道。公开修复前不得粘贴利用细节、真实凭证或用户数据。

## 5. Fork、远程仓库与分支

### 外部贡献者

先在 GitHub 点击 **Fork**，再克隆自己的 Fork，并把上游仓库配置为 `upstream`：

```bash
git clone https://github.com/<你的账号>/Better-NXU.git
cd Better-NXU
git remote add upstream https://github.com/this-is-h/Better-NXU.git
git remote -v
```

每次开始新主题前同步 `main`：

```bash
git switch main
git fetch upstream
git merge --ff-only upstream/main
git push origin main
git switch -c feat/short-description
```

### 有写权限的维护者

维护者可以直接从上游仓库创建分支：

```bash
git switch main
git fetch origin
git merge --ff-only origin/main
git switch -c fix/short-description
```

即使拥有写权限，也不应在 `main` 上直接开发。

### 分支命名

格式为 `<类型>/<简短英文说明>`，使用小写字母、数字和连字符。命名由本地 `pre-push` 钩子（`scripts/check-branch-name.mjs`）强制校验，不带下表前缀的分支会被拒绝推送：

| 前缀                  | 用途                        | 示例                         |
| --------------------- | --------------------------- | ---------------------------- |
| `feat/` 或 `feature/` | 新功能                      | `feat/schedule-export`       |
| `fix/`                | 缺陷修复                    | `fix/ids-login-timeout`      |
| `bugfix/`             | 缺陷修复（`fix/` 的长别名） | `bugfix/ids-login-timeout`   |
| `hotfix/`             | 紧急修复（仍走 PR 流程）    | `hotfix/ids-login-timeout`   |
| `docs/`               | 仅文档                      | `docs/github-workflow`       |
| `refactor/`           | 不改变用户行为的重构        | `refactor/router-guards`     |
| `perf/`               | 性能优化                    | `perf/lazy-resource-loading` |
| `test/`               | 测试补充                    | `test/webvpn-hosts`          |
| `build/`              | 构建或依赖                  | `build/update-vite`          |
| `ci/`                 | GitHub Actions              | `ci/publish-permissions`     |
| `chore/`              | 其他维护任务                | `chore/cleanup-comments`     |
| `release/`            | 版本发布准备                | `release/2.1.0`              |

分支名不使用姓名、`new`、`update`、`test1` 等无法表达意图的词，也不把 Issue 标题整句复制进分支名。

## 6. 日常开发与同步

首次安装依赖：

```bash
pnpm install --frozen-lockfile
```

日常开发至少遵循：

1. 先阅读改动所属 page、component/auth/composable、路由和现有测试。
2. 纯逻辑优先补测试；DOM 适配保留超时、空值、错误提示和手动降级。
3. 不修改与当前需求无关的格式、命名或注释。
4. 每完成一个可独立验证的逻辑单元就检查 diff，而不是最后一次性检查全部内容。
5. 提交前运行与改动匹配的测试，准备 PR 前运行 `pnpm check`。

### 同步上游变化

PR 分支落后或发生冲突时，公开或已进入审查的分支默认合并 `main`，避免重写其他人正在审查的历史：

```bash
git fetch upstream
git switch feat/short-description
git merge upstream/main
# 逐个解决冲突
git add <已解决的文件>
git commit
pnpm check
git push
```

维护者直接使用上游仓库时，把 `upstream` 换成 `origin`。分支首次推送前可以 rebase 整理本地历史；分支已共享或开始审查后，不应无说明地 rebase/force push。

解决冲突时必须理解两侧行为，不得盲目使用 “ours/theirs” 覆盖整个文件。解决后同时验证本 PR 功能和 `main` 新增行为。

## 7. Commit 规范

### 7.1 基本格式

commit 标题采用 Conventional Commits 风格，由 commitlint（`.husky/commit-msg` 钩子，规则见根目录 `commitlint.config.js`）自动校验，不符合的提交会被直接拒绝：

```text
<type>(<scope>)!: <summary>
```

- `type` 必填，只能取 7.2 表中的枚举值。
- `scope` 可选，用于说明主要模块。
- `!` 只用于明确的破坏性变更。
- `summary` 必填，说明这次提交产生的结果。
- 标题整体不超过 72 个字符（commitlint `header-max-length` 强制）。
- 一般现在时/祈使句，描述结果而非过程；英文不强制大写开头、句尾不加句号（`subject-full-stop` 强制）。

完整 commit 可以包含正文和 footer：

```text
<type>(<scope>)!: <summary>

<为什么修改、采用什么方案、关键取舍>

<关联 Issue、破坏性变化或共同作者>
```

标题应该：

- 使用中文或英文均可，但同一个 PR 内保持一致。
- 简短、具体，建议不超过 72 个可见字符。
- 使用动词描述结果，例如“处理”“增加”“移除”“固定”，不写“修改一些问题”。
- 结尾不加句号，不包含文件清单、测试报告或聊天式说明。

### 7.2 type

| type       | 含义                     | 示例                                   |
| ---------- | ------------------------ | -------------------------------------- |
| `feat`     | 用户可见的新能力         | `feat(schedule): 支持 Excel 导出`      |
| `fix`      | 修复错误行为             | `fix(ids): 处理登录请求超时`           |
| `docs`     | 仅修改文档               | `docs(contributing): 补充 commit 规范` |
| `refactor` | 重构且不改变预期行为     | `refactor(router): 集中认证主机守卫`   |
| `perf`     | 性能改进                 | `perf(resource): 延迟加载 OCR 运行时`  |
| `test`     | 仅新增或调整测试         | `test(webvpn): 覆盖伪造代理主机`       |
| `build`    | 构建、依赖、产物配置     | `build(deps): 更新 Vite`               |
| `ci`       | CI/CD 工作流             | `ci(publish): 收紧 contents 权限`      |
| `chore`    | 不属于以上类型的维护工作 | `chore: 清理失效开发注释`              |
| `revert`   | 撤销已有提交或 PR        | `revert: 撤销课表颜色算法调整`         |

版本发布准备使用 `chore(release): prepare 2.1.0`；不要把普通功能提交标为 `release`。

### 7.3 scope

scope 应是稳定、可识别的模块，不使用文件名堆砌。推荐值包括：

```text
ids  jwgl  webvpn  portal  sslvpn  schedule  crypto
config  router  ui  resource  metadata  deps  docs  ci  release
```

跨多个模块且不存在明确主模块时可以省略 scope。不要写 `fix(src/utils/file)` 这类路径型 scope。

### 7.4 正文与 footer

简单提交可以只有标题。出现以下情况时应该写正文：

- 代码本身不能说明为什么这样实现。
- 涉及安全边界、兼容策略、性能取舍或行为差异。
- 更换依赖或远程资源，需要说明来源和风险。
- 修复竞态、超时或真机 DOM 问题，需要记录复现条件。

正文重点写“为什么”和“影响”，不要逐行复述 diff。正文与标题之间保留一个空行。

Footer 常用格式：

```text
Refs: #123
Closes: #123
BREAKING CHANGE: 旧版课表 JSON 不再被接受，需要重新导出。
Co-authored-by: Name <email@example.com>
```

通常把 `Closes #123` 放在 PR 描述，由合并自动关闭 Issue；只有 commit 本身需要独立表达时才放 footer。不得虚构共同作者。

### 7.5 原子提交

一个 commit 应表达一个完整意图，并能单独审查：

- 实现和直接对应的测试应放在同一 commit，避免出现中间提交必然失败。
- 依赖版本与对应 `pnpm-lock.yaml` 必须同一 commit。
- 配置迁移、默认值和对应测试必须同一 commit。
- 无关重构与功能修改应拆开；如果重构只是实现该功能的必要部分，可以同一 commit 但需在正文说明。
- 不为追求“每个文件一个 commit”而机械拆分。

允许在开发中使用 `fixup!` 临时提交，但在请求正式审查前应该整理历史，或依赖最终 Squash 合并生成一个清晰提交。

### 7.6 禁止进入 commit 的内容

- 账号、密码、cookie、token、密钥、真实课表或个人信息。
- 临时日志、调试开关、抓包文件、编辑器缓存和本机路径。
- 普通 PR 中的 `dist/**`、根目录临时 `.user.js` 或备份文件。
- 与当前主题无关的格式化、依赖更新或文件改名。
- 未确认许可证和来源的第三方代码或资源。

### 7.7 修改提交历史

- 尚未推送的本地 commit 可以 amend、rebase 或 squash。
- 已推送但仅自己使用、尚未审查的分支，可以使用 `git push --force-with-lease`，禁止普通 `--force`。
- 已有审查评论或多人共同使用的分支，不应重写历史；确需重写时先通知审查者。
- 禁止重写 `main`、已发布 tag 或他人的分支。

提交前至少执行：

```bash
git status
git diff
git diff --staged
git diff --staged --check
```

脏工作区或多人共享目录中应显式暂存目标文件，避免用 `git add .` 带入无关内容：

```bash
git add src/<相关文件> test/<相关测试> docs/<相关文档>
git diff --staged
git commit -m "fix(ids): 处理登录请求超时"
```

commit 的 `type` 用于表达变更性质，不会在当前仓库自动决定版本号或生成 Changelog。版本提升和 `CHANGELOG.md` 仍按第 8.6 节人工评估。GitHub Actions 产生的 `build: 自动构建 dist 产物 [skip ci]` 是发布机器人专用提交，普通开发提交不要模仿 `[skip ci]`。

### 7.8 Git hooks 强制校验（husky）

依赖安装时（`pnpm install` 的 `prepare` 脚本）自动启用 `.husky/` 钩子，共三道，任何一道失败都会中止操作：

| 钩子         | 内容                                                                | 失败条件                                        |
| ------------ | ------------------------------------------------------------------- | ----------------------------------------------- |
| `pre-commit` | `lint-staged`：对暂存文件跑 Prettier 格式化 + ESLint 检查并自动修复 | 修复后仍有 lint 错误（如 `no-undef`、`eqeqeq`） |
| `commit-msg` | commitlint 按 Conventional Commits 校验标题                         | type 非法、标题超 72 字符、句尾句号等           |
| `pre-push`   | `scripts/check-branch-name.mjs` 校验分支前缀                        | 分支名不在第 5 节前缀表内                       |

临时绕过用 `git commit --no-verify` / `git push --no-verify`，仅允许在 CI 门禁可兜底的场景使用（如导入历史）；CI 会重新执行完整 `pnpm check`。钩子配置位于 `package.json` 的 `lint-staged` 字段和根目录 `commitlint.config.js`，调整时需同步更新本文。

## 7a. 代码风格与静态检查

- 格式化：Prettier（`.prettierrc.json`），`pnpm format` 写入、`pnpm format:check` 校验。
- 静态检查：ESLint（flat config `eslint.config.js`），`pnpm lint`。`src/libraries/**`（第三方运行时适配）与本地产物豁免。
- 两者都接入 `pnpm check` 与 `pre-commit` 钩子；新增依赖的全局变量（GM_* 等）需同步 `eslint.config.js`。
- `src/sites/webvpn/components/home/*.vue` 中的 `v-html` 豁免 `vue/no-v-html`：icon 是源码内静态字符串。其他位置引入 `v-html` 必须走 DOMPurify 并在 PR 说明。

## 8. 不同类型更新的联动要求

更新不是只改“看起来最相关”的一个文件。下面的矩阵用于确定同一 PR 还需要同步哪些内容。

| 变更类型               | 必查或同步内容                                                                  | 最低验证                                        |
| ---------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------- |
| 用户可见功能/修复      | 源码、测试、用户文档、`CHANGELOG.md`                                            | `pnpm check` + 相关真机场景                     |
| 纯内部重构             | 调用方、路由、测试；确认行为不变                                                | `pnpm check`                                    |
| 新站点/页面            | `src/sites/`、`src/router.js`、主机守卫；必要时 metadata                        | 直连、合法 WebVPN、伪造代理测试 + 真机          |
| GM 设置/默认值         | `gm-keys.js`、`user-config.js`、设置 UI、`ConfigVersion`、迁移/重置、文档、测试 | 新装、旧值、功能重置、全部重置                  |
| 课表 Schema/加密格式   | Schema 版本、解析器、迁移、加解密、fixture、用户文档                            | 往返测试 + 旧文件兼容/报错测试                  |
| npm 依赖               | `package.json`、`pnpm-lock.yaml`、相关 import、许可证/安全影响                  | `pnpm install --frozen-lockfile` + `pnpm check` |
| `@require`/`@resource` | `vite.config.js`、固定版本、SHA384、顺序/桥接、降级、`verify-meta.mjs`          | `pnpm check` + ScriptCat 真实加载               |
| userscript metadata    | match/grant/connect/resource/extra 与 `verify-meta.mjs` 期望                    | 构建头部检查 + 相关站点真机                     |
| 脚本版本               | `package.json`、`vite.config.js`、`CHANGELOG.md`；发布产物由 CI 生成            | `pnpm check` + 合并后产物抽查                   |
| CI/发布                | workflow 触发路径、权限、并发、Fork 安全、bot 回写                              | PR 事件和 `main` 事件分别推演/验证              |
| Node/pnpm 工具链       | `engines`、`packageManager`、workflow、锁文件、开发文档                         | 干净安装 + `pnpm check`                         |
| 仅文档                 | 入口链接、相对路径、命令与当前配置一致                                          | 链接检查 + `git diff --check`                   |

### 8.1 用户可见功能和修复

- 用户能感知的变化应该写入 `CHANGELOG.md`，使用 Added/Changed/Fixed/Removed/Security 等合适分类。
- UI 文案、入口或交互变化要同步用户文档；架构、模块职责或维护方式变化要同步开发文档。
- 修复必须尽可能增加能在本地稳定复现的回归测试。无法自动化的学校 DOM 问题，应在 PR 中记录脱敏复现步骤和真机结果。
- 不在一个修复 PR 中顺便改变相邻功能行为；确有必要时明确列入范围和测试矩阵。

### 8.2 GM 设置与持久化数据

GM 键位于 `@storageName h.nxu` 下，改名或改变语义会影响已安装用户，属于高风险变更。

新增、删除或改变设置时必须评估：

1. `src/config/gm-keys.js` 的键、默认值和 `SETTINGS_RESET_KEYS`。
2. `src/config/user-config.js` 的 ScriptCat 原生配置块及安全默认值。
3. 设置页面的响应式状态、禁用条件和异步写入。
4. `src/config/config-version.js` 的 `ConfigVersion` 是否递增。
5. 已有用户旧值如何读取、迁移、废弃或回退。
6. 首次安装、升级、恢复功能默认值、恢复全部默认值四条路径。
7. `scripts/verify-meta.mjs` 的 UserConfig 键集合和相关测试。
8. 用户文档与数据安全文档。

脚本版本和 `ConfigVersion` 是两个不同概念：脚本版本表示发布版本；`ConfigVersion` 表示配置结构/提示版本。不得因为发布补丁版本就机械增加 `ConfigVersion`，也不得在配置结构变化时只增加脚本版本而遗漏迁移。

### 8.3 npm 依赖更新

- 使用 pnpm，`pnpm-lock.yaml` 是唯一锁文件；不得提交 `package-lock.json` 或 `yarn.lock`。
- 依赖更新必须明确是直接依赖还是开发依赖，不用宽泛的版本范围替代当前固定策略。
- 检查上游 changelog、Node/浏览器兼容、许可证、已知漏洞、包体积和 tree-shaking 行为。
- Vue/Vant 等运行时依赖还要检查真实页面 CSS、挂载和跨 window 行为。
- Vant JS 来自 npm 构建，Vant CSS 当前来自固定 `@resource`；更新其中一个时必须判断另一个是否也应同步。
- 更新 `packageManager`、Node `engines` 时同步 GitHub Actions 和开发文档。

### 8.4 远程 `@require` 与 `@resource`

远程可执行代码和样式必须：

1. 使用固定完整版本，禁止 `latest`、`main` 或浮动 semver。
2. 从可信来源取得原始文件，计算并核对 SHA384，格式为 `#sha384-<base64>`。
3. 更新 `vite.config.js` 和 `scripts/verify-meta.mjs` 的数量、名称或固定期望。
4. 保持 `h.notification`、snapdom、XLSX 与各自 `data:` bridge 的相邻顺序。
5. 验证 ScriptCat 接受资源，预期全局落在正确的 page window。
6. 提供资源下载、摘要校验或执行失败时的可操作降级。
7. 比较 user.js 原始/gzip 体积，并在显著增长时说明来源。

README/CHANGELOG 是经 DOMPurify 处理的非执行 Markdown，当前允许读取无摘要 `main` URL。这是受控例外，不得扩展到 JavaScript 或 CSS。

### 8.5 userscript metadata

修改 `match`、`grant`、`connect`、`require`、`resource`、`inject-into`、`run-at` 或 `storageName` 时：

- 同步 `scripts/verify-meta.mjs` 的精确集合和顺序要求。
- 检查是否扩大了页面注入范围、跨域访问或敏感 API 权限。
- 新增认证入口时同时增加严格主机守卫，不能只依赖宽泛路径。
- 保持 `@inject-into page` 与 `@storageName h.nxu`，除非已有完整迁移方案并完成真机验证。
- 构建后比较 `.user.js` 与 `.meta.js` 头部。

### 8.6 版本更新与 Changelog

CHANGELOG 以用户或调用方可感知的变化为记录单位。分支、PR、Issue 可以帮助聚合相关改动，但不能直接作为条目：不逐 commit 记录，不照抄分支名或合并标题；同一功能的实现、修复和测试应合并为可理解的行为说明。纯内部重构无需列出文件搬迁清单。

维护者已整理的历史记录保持原样，包括措辞和格式。后续工作只追加未发布或新版本条目；如发现历史记录确需更正，先告知维护者，由维护者修改。

项目采用语义化版本：

- Patch：向后兼容的修复。
- Minor：向后兼容的新功能。
- Major：破坏性行为或数据兼容变化。

发布版本至少同步：

- `package.json#version`。
- `vite.config.js` 中 userscript `version`。
- `CHANGELOG.md` 的版本、日期和用户可见变化。
- 必要的用户文档、迁移说明与发布验证记录。

`scripts/verify-meta.mjs` 会在构建后校验产物版本等于 `package.json`，可以拦截两处版本不一致；版本 PR 仍必须人工确认目标版本符合 SemVer 和发布意图。当前仓库没有自动创建 GitHub Release/tag 的工作流；不要把合并等同于已创建 Release。若人工打 tag，应在 `main` 的检查和 `dist` 回写成功后进行，并确保 tag 指向包含最终产物的预期提交。

### 8.7 CI 与发布流程更新

修改 `.github/workflows/build.yml` 时必须分别考虑 PR 与 `main` push：

- PR 只运行只读检查，不授予外部 Fork 写权限或发布密钥。
- `publish` 只允许在 `main` 校验成功后执行，并使用最小 `contents: write` 权限。
- 新增会影响构建或验证的目录时，同步 `paths` 过滤。
- 第三方 Action 使用固定 commit SHA；更新时核对官方仓库和变更说明。
- 保留并发取消，避免旧分支检查和多个产物回写相互冲突。
- 修改 bot 回写方式时同步分支保护规则和本文。

## 9. 测试与验证要求

### 自动检查

统一入口：

```bash
pnpm check
```

当前执行顺序为：

```text
Markdown 结构与本地链接检查（pnpm docs）
  -> ESLint 静态检查（pnpm lint）
  -> Node 测试（pnpm test）
  -> Vite 生产构建
  -> metadata、权限、资源摘要、UserConfig、单文件约束校验
  -> 输出原始/gzip 体积（不设固定上限）
```

另外两个独立门禁命令：

- `pnpm test:coverage`：测试 + 行覆盖率门禁（阈值 80%，`scripts/check-coverage.mjs`），低于阈值即失败；CI 单独执行。
- `pnpm audit --prod --audit-level=high`：依赖安全扫描；CI 单独执行（本地如使用 npmmirror 镜像，audit 端点可能不可用，需 `--registry=https://registry.npmjs.org/`）。

根据改动范围可以先运行 `pnpm test` 或具体测试文件，但创建 PR 前应运行完整 `pnpm check`。检查失败时先定位第一处有效错误，在本地复现后修复；不要只重复运行等待偶然通过。

### 真机回归

以下改动不能仅凭 Node 测试合并：

- GM API、UserConfig、`@require`/`@resource`、page/sandbox window。
- IDS、WebVPN、教务登录、微信快速登录和跨域 cookie。
- 学校页面 DOM、iframe、SPA 导航、样式注入和文件下载。
- OCR、图片/Excel 导出、后台标签页和自动关闭。

在 ScriptCat 中安装 `dist/better-nxu.user.js`，按[开发、测试与发布](development.md)的真机矩阵验证。PR 记录页面/入口、直连或 WebVPN 形态、操作步骤和结果；截图、URL 和错误日志必须脱敏。

### 文档检查

文档 PR 至少确认：

- 相对链接能从当前文件位置解析。
- 命令、路径、版本和工作流名称与仓库一致。
- Markdown 代码围栏完整，无尾随空格或冲突标记。
- 标题从 H1 开始且不跳级，文件内标题锚点有效。
- `pnpm docs` 与 `git diff --check` 通过。

## 10. 创建 Pull Request

把分支推送到自己的远程仓库：

```bash
git push -u origin feat/short-description
```

在 GitHub 的 Fork 页面点击 **Contribute > Open pull request**，或在上游仓库点击 **New pull request**。确认：

- base repository：`this-is-h/Better-NXU`
- base branch：`main`
- head repository：贡献者 Fork 或上游仓库
- compare branch：本次主题分支，而不是 `main`

尚未完成但需要提前讨论时创建 **Draft PR**；达到可审查状态后点击 **Ready for review**。

### PR 标题

PR 标题使用与最终 Squash commit 相同的格式：

```text
feat(schedule): 支持课表 Excel 导出
fix(ids): 处理登录请求超时
docs(contributing): 完善 GitHub 协作规范
```

不要使用“更新”“修复 bug”“合并一下”等无法进入主分支历史的标题。

### PR 描述

必须完整填写模板，包括：

- 背景、目标与关联 Issue。
- 修改内容和明确不在本 PR 中处理的范围。
- commit/数据/接口兼容性和迁移影响。
- 实际执行的命令、测试数量与结果。
- 真机验证页面和结果，或不适用原因。
- UI 改动的脱敏前后截图/录屏。
- 风险、回退方案和后续工作。

创建后作者先自审 **Files changed**，确认没有意外文件、调试代码、敏感数据或 `dist`。作者应主动解释看起来异常但有意保留的代码，而不是等待审查者猜测。

## 11. GitHub Actions 与失败处理

面向 `main` 的 PR 修改源码、测试、文档、依赖、协作模板或构建配置时，`.github/workflows/build.yml` 会安装 Node 22 与 pnpm 10.32.1，依次执行多层质量门禁：

```text
编译/构建门禁：pnpm check（docs → lint → test → build → verify-meta）
测试门禁：    pnpm test:coverage（单元测试全部通过 且 行覆盖率 ≥ 80%）
Lint 门禁：   pnpm lint（ESLint，已并入 pnpm check）
安全扫描门禁：pnpm audit --prod --audit-level=high
```

任何一道门禁未通过，PR 都不能合并。

失败处理顺序：

1. 打开失败 job，找到第一处有效错误，而不是只看最后的退出码。
2. 确认失败是否能在本地复现，记录环境差异。
3. 修复后推送到原分支，等待新检查；不要重复创建 PR。
4. 如果是基础设施或外部网络偶发问题，可以重跑，但 PR 中应说明判断依据。
5. 如果路径过滤导致未触发，维护者仍应按改动要求检查；“未运行”不等于“已通过”。

项目不设置固定脚本体积上限。`verify-meta.mjs` 会输出原始与 gzip 体积；出现显著增长时作者与审查者应确认新增来源、必要性和启动成本。

## 12. 维护者审查流程

维护者按以下顺序处理 PR：

1. **初审范围**：目标是否清楚、是否指向 `main`、是否重复、是否含敏感或无关内容。
2. **确认方案**：需求、用户行为、数据兼容和迁移是否明确；重大方案未讨论时先转 Draft。
3. **检查提交**：commit 是否可理解，PR 标题是否适合作为最终 Squash commit。
4. **检查自动化**：必需检查是否成功；未触发是否合理。
5. **代码审查**：正确性、安全、认证守卫、GM/Page 作用域、错误处理、竞态、资源清理、测试和文档。
6. **行为验证**：确认作者的真机记录；高风险改动由维护者复验。
7. **提交结论**：阻塞问题使用 **Request changes**，非阻塞建议使用普通评论，无阻塞项后 **Approve**。
8. **复查增量**：新提交后重新检查变化、已解决对话和最新 CI，不沿用旧版本结论。

### 审查意见分级

- **阻塞**：安全漏洞、数据丢失、错误行为、兼容破坏、无迁移、缺少关键测试、CI 失败。必须修改后才能合并。
- **应该修改**：维护性、边界处理、文档缺失或明显性能问题。默认需要修改；不改须给出充分理由。
- **非阻塞建议**：命名、局部可读性或未来优化。可以后续处理，但应明确是否创建 Issue。
- **提问**：审查者尚未确认意图，不应在未获得答案前自行假定正确。

审查评论应指出具体行为、触发条件和风险，避免只写“这里不对”。对外部贡献代码按不可信输入处理：先阅读 diff 和安装脚本，再决定是否在具有校园登录态或本地密钥的环境运行。

维护者本地检出 PR 可以使用：

```bash
gh pr checkout <PR 编号>
pnpm install --frozen-lockfile
pnpm check
```

## 13. 回应审查

- 在原 PR 分支继续提交并推送，PR 会自动更新。
- 每条阻塞意见都应有修改或明确回复；不要只点击 Resolve 而不处理内容。
- 有不同意见时提供代码、测试、文档或真机结果作为依据。
- 审查者提出范围外改动时，可以创建后续 Issue，不必无限扩大当前 PR。
- 大规模调整后，在 PR 描述追加变更摘要和新的验证结果。
- 不因旧 CI 曾通过就跳过新提交后的检查。

## 14. 合并规范

满足以下条件后才能合并：

- PR 不再是 Draft，范围和方案已确认。
- 所有必需检查通过，显著体积变化已被知悉并评估。
- 分支与当前 `main` 无未解决冲突。
- 阻塞意见和审查对话全部解决，获得项目要求的批准。
- 测试、迁移、用户/开发文档和 `CHANGELOG.md` 已按改动性质更新。
- 必须真机验证的场景有脱敏记录。
- 没有凭证、个人数据、调试代码或普通 PR 不应提交的 `dist`。

默认使用 **Squash and merge**，让一个 PR 在 `main` 上对应一个清晰 commit。合并前维护者必须整理最终标题，使其符合第 7 节；Squash 正文应保留必要背景、Issue 和共同作者信息。

除维护长期分支等明确场景外，不使用 **Create a merge commit**。一般不使用 **Rebase and merge**，因为开发过程中的 fixup commit 会污染主分支历史。

合并后删除主题分支。不得在检查失败时随意使用管理员权限绕过；紧急例外必须记录原因、已完成验证、负责人和补救 Issue。

## 15. 合并后构建与发布

PR 合并到 `main` 后，GitHub Actions 会重新运行 `pnpm check`。成功后 `publish` job 再次构建和校验，并由 `github-actions[bot]` 强制加入被 `.gitignore` 忽略的：

```text
dist/better-nxu.user.js
dist/better-nxu.meta.js
```

机器人提交包含 `[skip ci]`，且 `dist/**` 不在触发路径中，因此不会循环触发。普通开发者不要手工模拟这个提交。

合并人必须确认：

1. `main` 的 `check` 与 `publish` 均成功。
2. bot commit 只包含预期的两个产物；无变化时允许跳过提交。
3. `.user.js` 与 `.meta.js` 版本、权限、资源和 UserConfig 正确。
4. 发布相关改动从 `main` 安装最新脚本完成最终抽查。
5. 关联 Issue 已关闭或更新，遗留问题已有后续记录。

如果 `check` 失败，通过新 PR 修复源码或配置，不发布旧产物。如果 `publish` 因权限或分支保护失败，修复最小权限/规则后重跑；不要开放所有人直接 push `main`。无法安全允许 bot 回写时，应另行评审改为 GitHub Release 或 Artifact。

## 16. 回滚、紧急修复与发布事故

### 普通回滚

已合并错误应通过 GitHub **Revert** 创建新 PR，或在新分支执行 `git revert <commit>`。不要 reset/force push `main`。回滚 PR 仍需测试和审查，并说明：

- 回滚哪个 PR/commit。
- 用户受到什么影响。
- 数据或配置是否已经写入，回滚代码能否恢复。
- 后续是重新实现还是永久撤销。

### 已发布产物有问题

- 优先修复源码或 revert 源码，让 Actions 重新生成 `dist`。
- 不直接手改压缩后的 `dist/better-nxu.user.js`。
- 如果错误涉及 GM 数据写入，先判断回滚是否会让新数据无法读取；必要时采用向前修复和兼容迁移。
- 如果远程资源被撤回或摘要不匹配，固定新的可信资源并更新摘要，保留安全降级。

### 紧急修复

紧急修复仍从最新 `main` 创建 `fix/` 分支并走 PR。可以缩短等待，但不能省略最小测试、敏感信息检查和合并后产物确认。事后必须补齐因紧急情况省略的测试、文档和根因分析。

## 17. 仓库保护建议

仓库管理员应为 `main` 配置 Ruleset 或 Branch protection：

- 合并前必须经过 PR，禁止普通成员直接 push、force push 和删除 `main`。
- 将工作流 `check` 设为必需状态检查。
- 要求解决所有审查对话；多人维护时至少一名其他维护者批准。
- 限制管理员绕过，并记录紧急例外。
- 为 `github-actions[bot]` 回写 `dist` 配置范围最小的例外；无法最小授权时改用 Release/Artifact。

分支保护是平台门禁，本文是团队流程。即使仓库设置暂时没有强制某项，贡献者和维护者仍应遵守本文。

## 18. 常用检查清单

### 开始工作前

- [ ] 已查看当前分支、remote、工作区状态和近期提交。
- [ ] 已确认已有改动归属，没有覆盖未提交工作。
- [ ] 已阅读相关源码、测试、开发文档和 Issue。
- [ ] 已从最新 `main` 创建主题分支。

### commit 前

- [ ] commit 只表达一个清晰意图，标题符合规范。
- [ ] 已检查 unstaged/staged diff 和敏感信息。
- [ ] 实现、直接测试、迁移和锁文件没有被错误拆开。
- [ ] 未提交 `dist`、临时日志、本机文件或无关格式化。
- [ ] 已运行与改动匹配的测试。

### PR 前

- [ ] 已运行 `pnpm check` 并记录结果。
- [ ] 已完成需要的 ScriptCat 真机回归。
- [ ] 已更新用户/开发文档与 `CHANGELOG.md`。
- [ ] PR 标题可以直接作为 Squash commit。
- [ ] PR 描述包含范围、验证、兼容性、风险和回退。
- [ ] 已自行审查 Files changed。

### 合并前

- [ ] 最新 CI 通过，显著体积变化已评估。
- [ ] 阻塞评论全部解决，最新增量已复查。
- [ ] 配置、数据和版本迁移完整。
- [ ] 最终 Squash 标题和正文已整理。
- [ ] 没有敏感数据和非预期产物。

### 合并后

- [ ] `main` 的 `check` 和 `publish` 成功。
- [ ] bot 回写的 `dist` 内容符合预期。
- [ ] 已安装最新产物抽查关键路径。
- [ ] Issue、Changelog、发布说明和后续事项状态正确。
