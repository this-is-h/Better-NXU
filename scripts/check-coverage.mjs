#!/usr/bin/env node
/**
 * 覆盖率门禁：解析 `node --test --experimental-test-coverage` 输出的 "all files" 行，
 * 校验行覆盖率 ≥ 阈值。低于阈值时以非零退出码失败，供本地与 CI 使用。
 *
 * 用法：node scripts/check-coverage.mjs [--threshold=80]
 * 前置：先运行 pnpm test:coverage 并把完整 stdout 传入本脚本 stdin。
 */
import { readFileSync } from 'node:fs';

const args = process.argv.slice(2);
let threshold = 80;
for (const arg of args) {
  const match = arg.match(/^--threshold=(\d+(?:\.\d+)?)$/);
  if (match) threshold = Number(match[1]);
}

const input = readFileSync(0, 'utf8');
// 行格式：ℹ all files                   |  83.59 |    70.21 |   84.36 |
const line = input.split('\n').find((l) => l.includes('all files') && l.includes('|'));

if (!line) {
  console.error('[x] 未在测试输出中找到覆盖率报告（all files 行）。请先运行 pnpm test:coverage。');
  process.exit(1);
}

const columns = line.split('|').map((c) => c.trim());
const linePct = Number(columns[1]);
const branchPct = Number(columns[2]);
const funcsPct = Number(columns[3]);

if (![linePct, branchPct, funcsPct].every(Number.isFinite)) {
  console.error(`[x] 覆盖率报告解析失败：${line.trim()}`);
  process.exit(1);
}

console.log(`line ${linePct}% | branch ${branchPct}% | funcs ${funcsPct}% (threshold: ${threshold}%)`);

if (linePct < threshold) {
  console.error(`\n[x] 行覆盖率 ${linePct}% 低于门禁阈值 ${threshold}%，禁止合并。请为改动补充测试。`);
  process.exit(1);
}

console.log(`[ok] 覆盖率门禁通过`);
