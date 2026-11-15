import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { THIRD_PARTY_NOTICE } from '../scripts/third-party-notices.mjs';

const require = createRequire(import.meta.url);
const vantRequire = createRequire(require.resolve('vant'));
const normalize = (value) => value.replace(/\s+/g, ' ').trim();

function packageLicense(name, resolver = require) {
  let directory = dirname(resolver.resolve(name));
  while (!existsSync(join(directory, 'package.json'))) directory = dirname(directory);
  return readFileSync(join(directory, 'LICENSE'), 'utf8');
}

test('the consolidated notice retains the complete MIT terms of bundled dependencies', () => {
  const licenses = [
    readFileSync(new URL('../LICENSE', import.meta.url), 'utf8'),
    packageLicense('captcha-recognizer-js'),
    packageLicense('@yusufceng1z/ding'),
    packageLicense('vant'),
    packageLicense('@vant/use', vantRequire),
    packageLicense('@vant/popperjs', vantRequire),
    packageLicense('@vue/shared', vantRequire),
  ];
  for (const license of licenses) {
    const terms = license.slice(license.indexOf('Permission is hereby granted'));
    assert.ok(normalize(THIRD_PARTY_NOTICE).includes(normalize(terms)));
  }
  assert.equal(THIRD_PARTY_NOTICE.split('Permission is hereby granted').length, 2);
  assert.equal(THIRD_PARTY_NOTICE.split('THE SOFTWARE IS PROVIDED "AS IS"').length, 2);
});

test('each bundled copyright attribution appears exactly once', () => {
  for (const attribution of [
    'Copyright (c) 2025 this-is-h',
    'Copyright (c) 2026 slider-captcha-gap contributors',
    'Copyright 2024 Zhao Chenwei',
    'Copyright (c) 2026 Yusuf Cengiz',
    'Copyright (c) Youzan',
    'Copyright (c) Chen Jiahan and other contributors',
    'Copyright (c) 2018-present, Yuxi (Evan) You',
  ]) {
    assert.equal(THIRD_PARTY_NOTICE.split(attribution).length, 2, attribution);
  }
});
