# Better NXU Repository Instructions

Before modifying this repository, read **`docs/dev/github-workflow.md`** — it is the **authoritative** collaboration guide for contributors, maintainers, and future automated sessions. It covers the complete development lifecycle:

- **GitHub Flow**: `main` as long-lived branch, `feat/`/`fix/`/etc. as short-lived feature branches
- **Commit convention**: Conventional Commits `type(scope): summary` (validated by commitlint)
- **Branch naming**: Enforced by `pre-push` hook (must use controlled prefixes)
- **Quality gates**: Lint → test → build → verify-meta (via `pnpm check`)

Read the linked architecture, development, and security documents when the task touches those areas.

Mandatory repository rules:

- Inspect `git status --short --branch` before editing. Preserve unrelated or pre-existing changes; never reset, clean, restore, or overwrite work of uncertain ownership.
- Keep changes scoped to the requested task. Update direct tests, migrations, user/developer documentation, and `CHANGELOG.md` when the change requires them.
- Use pnpm and keep `pnpm-lock.yaml` as the only dependency lock file.
- Do not commit `dist` in ordinary changes or PRs. GitHub Actions builds and commits release artifacts after merge to `main`.
- Run `pnpm check` before handoff when feasible. GM APIs, ScriptCat resources, authentication, cross-origin behavior, and school DOM changes also require relevant real-browser/ScriptCat regression testing.
- Branch names MUST start with `feat/` (or `feature/`), `fix/`, `bugfix/`, `hotfix/`, `docs/`, `refactor/`, `perf/`, `test/`, `build/`, `ci/`, `chore/`, or `release/`; `scripts/check-branch-name.mjs` (pre-push hook) rejects anything else.
- Commit messages MUST pass commitlint (`commitlint.config.js` via the `.husky/commit-msg` hook): Conventional Commits `type(scope): summary`, header ≤ 72 chars, no trailing period. Staged code must pass lint-staged (Prettier + ESLint) via the `pre-commit` hook; avoid `--no-verify` unless CI can backstop it.
- Never add credentials, cookies, tokens, private keys, personal schedules, or unredacted personal information to files, tests, logs, issues, or PR descriptions.
- Do not create commits, push branches, open/merge PRs, change repository rules, tag versions, or publish releases unless the user explicitly requests that action.
- Commit and PR titles follow `type(scope): summary` or `type: summary`; scope is optional. Follow the detailed atomic-commit and update-coupling rules in `docs/dev/github-workflow.md`.
