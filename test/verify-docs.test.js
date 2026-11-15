import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

test('documentation checks ignore coverage reports without skipping project documents', async (t) => {
  const prefix = path.join(tmpdir(), 'better-nxu-docs-');
  const root = await mkdtemp(prefix);
  t.after(async () => {
    assert.ok(path.resolve(root).startsWith(path.resolve(prefix)));
    await rm(root, { recursive: true, force: true });
  });
  await mkdir(path.join(root, 'coverage'));
  await writeFile(path.join(root, 'coverage', 'report.md'), '## 临时报告\n', 'utf8');
  await writeFile(path.join(root, 'README.md'), '# 项目文档\n', 'utf8');
  const script = fileURLToPath(new URL('../scripts/verify-docs.mjs', import.meta.url));
  const run = () => promisify(execFile)(process.execPath, [script], { cwd: root });
  assert.match((await run()).stdout, /documentation verified: 1 Markdown files/);
  await writeFile(path.join(root, 'README.md'), '## 项目文档\n', 'utf8');
  await assert.rejects(run(), (error) => {
    assert.match(error.stderr, /README\.md:1 首个 Markdown 标题必须是 H1/);
    return true;
  });
});
