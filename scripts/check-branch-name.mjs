#!/usr/bin/env node
/**
 * 分支命名校验：强制 feature/bugfix/hotfix 等受控前缀。
 * 用途：.husky/pre-push 在推送时拦截（本地分支名创建时不便拦截，推送是最终闸口）。
 * 规则文档：docs/dev/github-workflow.md 第 5 节。
 */
import { readFileSync } from 'node:fs';

const ALLOWED = [
  'main',
  /^(feat|feature)\//, // feat/ 或 feature/
  /^fix\//,
  /^bugfix\//,
  /^hotfix\//,
  /^docs\//,
  /^refactor\//,
  /^perf\//,
  /^test\//,
  /^build\//,
  /^ci\//,
  /^chore\//,
  /^release\//,
];

const pushInput = readFileSync(0, 'utf8');
// pre-push stdin 每行：local-ref local-sha remote-ref remote-sha
const branches = pushInput
  .split('\n')
  .filter(Boolean)
  .map((line) => line.split(/\s+/)[0])
  .filter((ref) => ref.startsWith('refs/heads/'));

if (branches.length === 0) process.exit(0);

const invalid = branches.filter((ref) => {
  const name = ref.replace('refs/heads/', '');
  return !ALLOWED.some((rule) => (rule instanceof RegExp ? rule.test(name) : rule === name));
});

if (invalid.length > 0) {
  console.error('\n[x] 分支命名不符合规范，推送被拒绝：');
  for (const ref of invalid) console.error(`    ${ref.replace('refs/heads/', '')}`);
  console.error('\n    允许的前缀：feat/ feature/ fix/ bugfix/ hotfix/ docs/ refactor/');
  console.error('                perf/ test/ build/ ci/ chore/ release/（以及 main）');
  console.error('\n    示例：git switch -c feat/schedule-export\n');
  process.exit(1);
}
