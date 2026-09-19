import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const ignoredDirectories = new Set(['.git', 'dist', 'node_modules']);
const firstHeadingExemptions = new Set(['.github/PULL_REQUEST_TEMPLATE.md']);

async function collectMarkdownFiles(directory = root) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectMarkdownFiles(absolutePath)));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
      files.push(absolutePath);
    }
  }
  return files;
}

function toRepositoryPath(absolutePath) {
  return path.relative(root, absolutePath).split(path.sep).join('/');
}

function stripHeadingMarkup(value) {
  return value
    .replace(/<[^>]*>/g, '')
    .replace(/!??\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[`*_~]/g, '')
    .trim();
}

function createAnchorSet(markdown) {
  const anchors = new Set();
  const occurrences = new Map();
  let fence = null;

  for (const line of markdown.split(/\r?\n/)) {
    const fenceMatch = line.match(/^\s*(`{3,}|~{3,})/);
    if (fenceMatch) {
      const marker = fenceMatch[1];
      if (!fence) fence = marker;
      else if (marker[0] === fence[0] && marker.length >= fence.length) fence = null;
      continue;
    }
    if (fence) continue;

    const heading = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (!heading) continue;
    const base = stripHeadingMarkup(heading[2])
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\p{M}\s_-]/gu, '')
      .replace(/\s+/g, '-');
    if (!base) continue;
    const count = occurrences.get(base) ?? 0;
    occurrences.set(base, count + 1);
    anchors.add(count === 0 ? base : `${base}-${count}`);
  }
  return anchors;
}

function validateStructure(repositoryPath, markdown) {
  const errors = [];
  const lines = markdown.split(/\r?\n/);
  let fence = null;
  let firstHeading = null;
  let previousHeadingLevel = null;

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    if (/[ \t]+$/.test(line)) errors.push(`${repositoryPath}:${lineNumber} 存在行尾空格`);
    if (/^(<{7}|={7}|>{7})(?:\s|$)/.test(line)) {
      errors.push(`${repositoryPath}:${lineNumber} 存在未解决的冲突标记`);
    }

    const fenceMatch = line.match(/^\s*(`{3,}|~{3,})/);
    if (fenceMatch) {
      const marker = fenceMatch[1];
      if (!fence) fence = { marker, lineNumber };
      else if (marker[0] === fence.marker[0] && marker.length >= fence.marker.length) fence = null;
      return;
    }
    if (fence) return;

    const heading = line.match(/^(#{1,6})\s+\S/);
    if (!heading) return;
    const level = heading[1].length;
    firstHeading ??= { level, lineNumber };
    if (previousHeadingLevel !== null && level > previousHeadingLevel + 1) {
      errors.push(`${repositoryPath}:${lineNumber} 标题层级从 H${previousHeadingLevel} 跳到 H${level}`);
    }
    previousHeadingLevel = level;
  });

  if (fence) errors.push(`${repositoryPath}:${fence.lineNumber} 代码围栏未闭合`);
  if (!firstHeading) errors.push(`${repositoryPath}:1 缺少 Markdown 标题`);
  else if (!firstHeadingExemptions.has(repositoryPath) && firstHeading.level !== 1) {
    errors.push(`${repositoryPath}:${firstHeading.lineNumber} 首个 Markdown 标题必须是 H1`);
  }
  return errors;
}

function parseLinkDestination(rawDestination) {
  const destination = rawDestination.trim();
  if (destination.startsWith('<')) {
    const closing = destination.indexOf('>');
    return closing === -1 ? destination : destination.slice(1, closing);
  }
  return destination.split(/\s+["'(]/, 1)[0];
}

function decodeLinkPart(value, repositoryPath, lineNumber, errors) {
  try {
    return decodeURIComponent(value);
  } catch {
    errors.push(`${repositoryPath}:${lineNumber} 链接包含无效的 URL 编码：${value}`);
    return value;
  }
}

const markdownFiles = await collectMarkdownFiles();
const repositoryFiles = new Set(markdownFiles.map(toRepositoryPath));
const contentByPath = new Map();
const anchorByPath = new Map();
const errors = [];
let checkedLinks = 0;

for (const absolutePath of markdownFiles) {
  const repositoryPath = toRepositoryPath(absolutePath);
  const markdown = await readFile(absolutePath, 'utf8');
  contentByPath.set(repositoryPath, markdown);
  anchorByPath.set(repositoryPath, createAnchorSet(markdown));
  errors.push(...validateStructure(repositoryPath, markdown));
}

for (const [repositoryPath, markdown] of contentByPath) {
  const lines = markdown.split(/\r?\n/);
  let fence = null;

  lines.forEach((line, index) => {
    const fenceMatch = line.match(/^\s*(`{3,}|~{3,})/);
    if (fenceMatch) {
      const marker = fenceMatch[1];
      if (!fence) fence = marker;
      else if (marker[0] === fence[0] && marker.length >= fence.length) fence = null;
      return;
    }
    if (fence) return;

    const linkPattern = /!?\[[^\]]*\]\(([^)\n]+)\)/g;
    for (const match of line.matchAll(linkPattern)) {
      const destination = parseLinkDestination(match[1]);
      if (!destination || /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(destination)) continue;
      checkedLinks += 1;

      const hashIndex = destination.indexOf('#');
      const rawTarget = hashIndex === -1 ? destination : destination.slice(0, hashIndex);
      const rawFragment = hashIndex === -1 ? '' : destination.slice(hashIndex + 1);
      const decodedTarget = decodeLinkPart(rawTarget, repositoryPath, index + 1, errors);
      const targetPath = decodedTarget
        ? path.posix.normalize(
            path.posix.join(path.posix.dirname(repositoryPath), decodedTarget.replaceAll('\\', '/'))
          )
        : repositoryPath;

      if (!repositoryFiles.has(targetPath)) {
        errors.push(`${repositoryPath}:${index + 1} 本地链接目标不存在或大小写不匹配：${destination}`);
        continue;
      }
      if (rawFragment) {
        const fragment = decodeLinkPart(rawFragment, repositoryPath, index + 1, errors).toLowerCase();
        if (!anchorByPath.get(targetPath)?.has(fragment)) {
          errors.push(`${repositoryPath}:${index + 1} 标题锚点不存在：${destination}`);
        }
      }
    }
  });
}

assert.deepEqual(errors, [], `文档检查失败：\n${errors.map((error) => `- ${error}`).join('\n')}`);
console.log(`documentation verified: ${markdownFiles.length} Markdown files, ${checkedLinks} local links`);
