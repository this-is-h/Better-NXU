#!/usr/bin/env node
/**
 * 覆盖率运行器：跨平台执行 Node 内置测试 + 覆盖率，并把输出喂给门禁脚本。
 * 不用 shell 管道（tee /dev/stderr 在 Windows 不可用），直接 spawn 并转发 stdout/stderr。
 */
import { spawn } from 'node:child_process';

const test = spawn(
  process.execPath,
  ['--import', './test/setup.mjs', '--test', '--experimental-test-coverage'],
  {
    stdio: ['ignore', 'pipe', 'pipe'],
  }
);

let output = '';
test.stdout.on('data', (chunk) => {
  output += chunk;
  process.stdout.write(chunk);
});
test.stderr.on('data', (chunk) => {
  output += chunk;
  process.stderr.write(chunk);
});

test.on('close', (code) => {
  if (code !== 0) process.exit(code);
  const gate = spawn(process.execPath, ['scripts/check-coverage.mjs'], {
    stdio: ['pipe', 'inherit', 'inherit'],
  });
  gate.stdin.end(output);
  gate.on('close', (gateCode) => process.exit(gateCode ?? 1));
});
