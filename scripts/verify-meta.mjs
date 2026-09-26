import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { USER_CONFIG_BLOCK, USER_CONFIG_SAFE_DEFAULTS } from '../src/config/user-config.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = resolve(root, 'dist');
const metaPath = resolve(distDir, 'better-nxu.meta.js');
const userPath = resolve(distDir, 'better-nxu.user.js');
const packageJson = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
const [meta, user, distFiles] = await Promise.all([
  readFile(metaPath, 'utf8'),
  readFile(userPath, 'utf8'),
  readdir(distDir),
]);

function valuesFrom(source, key) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return [...source.matchAll(new RegExp(`^// @${escaped}\\s+(.+)$`, 'gm'))].map((match) => match[1].trim());
}

function values(key) {
  return valuesFrom(meta, key);
}

function one(key) {
  const found = values(key);
  assert.equal(found.length, 1, `expected exactly one @${key}`);
  return found[0];
}

const expectedMatches = [
  '*://webvpn.nxu.edu.cn/*',
  '*://sslvpn.nxu.edu.cn/*',
  '*://jsfzyjxzlxt.nxu.edu.cn/*',
  '*://jwgl.nxu.edu.cn/*',
  '*://portal.nxu.edu.cn/*',
  '*://sysaq.nxu.edu.cn/*',
  '*://202.201.128.234/*',
  '*://tuanwei.nxu.edu.cn/*',
  '*://ids.nxu.edu.cn/*',
  '*://open.weixin.qq.com/*',
  '*://zylib.nxu.edu.cn/*',
  '*://kns.cnki.net/reader/xml*',
  '*://kns.cnki.net/xmlRead/trialRead*',
  '*://www.cnki.net/reader/xml*',
  '*://www.cnki.net/xmlRead/trialRead*',
  '*://f.wanfangdata.com.cn/online/pc/periodical_html*',
];
const expectedGrants = [
  'CAT_userConfig',
  'GM.setValue',
  'GM.setValues',
  'GM.xmlHttpRequest',
  'GM_addElement',
  'GM_addStyle',
  'GM_getResourceText',
  'GM_getValue',
  'GM_info',
  'GM_openInTab',
  'GM_setClipboard',
  'GM_setValue',
  'GM_setValues',
  'unsafeWindow',
  'window.close',
];

assert.equal(one('version'), packageJson.version);
assert.equal(one('inject-into'), 'page');
assert.equal(one('run-at'), 'document-idle');
assert.equal(one('storageName'), 'h.nxu');
assert.deepEqual(values('match'), expectedMatches);
assert.deepEqual(values('grant').sort(), expectedGrants.sort());
assert.deepEqual(values('connect'), [
  'webvpn.nxu.edu.cn',
  'portal.nxu.edu.cn',
  'v1.hitokoto.cn',
  'cdn.jsdelivr.net',
]);

const requires = values('require');
const resources = values('resource');
const resourceMap = Object.fromEntries(resources.map((entry) => entry.split(/\s+/, 2)));
const mutableMarkdownResources = {
  'about-md': 'https://raw.giteeusercontent.com/thisish/Better-NXU/raw/main/README.md',
  'update-md': 'https://raw.giteeusercontent.com/thisish/Better-NXU/raw/main/CHANGELOG.md',
};
assert.equal(requires.length, 7);
assert.equal(resources.length, 8);
for (const entry of requires.filter((value) => /^https?:/i.test(value))) {
  assert.match(entry, /#sha384-[A-Za-z0-9+/]+={0,2}$/);
}
for (const entry of resources) {
  const [name] = entry.split(/\s+/, 1);
  if (name in mutableMarkdownResources) {
    assert.equal(resourceMap[name], mutableMarkdownResources[name]);
  } else {
    assert.match(entry, /^\S+\s+https?:\/\/\S+#sha384-[A-Za-z0-9+/]+={0,2}$/);
  }
}
const integrityProtectedEntries = [
  ...requires,
  ...resources.filter((entry) => !(entry.split(/\s+/, 1)[0] in mutableMarkdownResources)),
].filter((value) => /https?:\/\//i.test(value));
for (const entry of integrityProtectedEntries) {
  assert.equal(
    /(?:\/|@)(?:main|latest)(?:\/|$)/i.test(entry),
    false,
    `mutable remote URL is forbidden: ${entry}`
  );
}

assert.deepEqual(resources.map((entry) => entry.split(/\s+/, 1)[0]).sort(), [
  'about-md',
  'dompurify-js',
  'github-markdown-css',
  'marked-js',
  'svg-logo',
  'tesseract-js',
  'update-md',
  'vant-css',
]);
assert.equal(values('grant').includes('GM_addElement'), true);

function getUserConfigBlock(source) {
  return source.match(/\/\* ==UserConfig==[\s\S]*?==\/UserConfig== \*\//)?.[0] ?? '';
}

function getUserConfigKeys(source) {
  const keys = [];
  let group = '';
  for (const line of source.split(/\r?\n/)) {
    const groupMatch = line.match(/^([A-Za-z][A-Za-z0-9]*):$/);
    if (groupMatch) {
      group = groupMatch[1];
      continue;
    }
    const keyMatch = line.match(/^ {4}([A-Za-z][A-Za-z0-9]*):$/);
    if (group && keyMatch) keys.push(`${group}.${keyMatch[1]}`);
  }
  return keys;
}

const expectedUserConfigKeys = [
  'WebVPN.username',
  'WebVPN.password',
  'WebVPN.autoLogin',
  'WebVPN.autoReLogin',
  'WebVPN.searchClose',
  'WebVPN.autoClose',
  'WebVPN.courseGrab',
  'WebVPN.customTool',
  'WebVPN.customCard',
  'WebVPN.qualityJson',
  'Jwgl.username',
  'Jwgl.password',
  'Jwgl.autoLogin',
  'Jwgl.courseBeautify',
  'Jwgl.customMenu',
  'TuanWei.autoDownload',
  'TuanWei.autoDownloadClose',
];
assert.deepEqual(USER_CONFIG_SAFE_DEFAULTS, {
  'WebVPN.autoLogin': false,
  'Jwgl.autoLogin': false,
});
for (const [name, source] of [
  ['metadata', meta],
  ['userscript', user],
]) {
  const userConfig = getUserConfigBlock(source);
  assert.equal(userConfig, USER_CONFIG_BLOCK, `${name} must contain the complete UserConfig block`);
  assert.deepEqual(
    getUserConfigKeys(userConfig),
    expectedUserConfigKeys,
    `${name} UserConfig keys must match`
  );
}

for (const key of [
  'name',
  'namespace',
  'version',
  'author',
  'description',
  'match',
  'require',
  'resource',
  'connect',
  'grant',
  'inject-into',
  'run-at',
  'storageName',
]) {
  assert.deepEqual(valuesFrom(user, key), values(key), `meta and userscript @${key} values must match`);
}
assert.deepEqual(distFiles.filter((name) => name.endsWith('.js')).sort(), [
  'better-nxu.meta.js',
  'better-nxu.user.js',
]);
assert.equal(/System\.register|systemjs/i.test(user), false, 'userscript must not rely on SystemJS chunks');

console.log(`userscript size: ${Buffer.byteLength(user)} bytes`);
console.log(`gzipped userscript size: ${gzipSync(user).byteLength} bytes`);

console.log(
  `metadata verified: ${values('match').length} matches, ${values('grant').length} grants, ${requires.length} requires, ${resources.length} resources`
);
