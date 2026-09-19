import test from 'node:test';
import assert from 'node:assert/strict';
import { USER_CONFIG_BLOCK, USER_CONFIG_SAFE_DEFAULTS } from '../src/config/user-config.js';

test('native ScriptCat configuration keeps automatic login opt-in', () => {
  assert.deepEqual(USER_CONFIG_SAFE_DEFAULTS, {
    'WebVPN.autoLogin': false,
    'Jwgl.autoLogin': false,
  });

  const autoLoginDefaults = [
    ...USER_CONFIG_BLOCK.matchAll(/autoLogin:\s*[\s\S]*?default:\s*(true|false)/g),
  ].map((match) => match[1]);
  assert.deepEqual(autoLoginDefaults, ['false', 'false']);
  assert.equal(USER_CONFIG_BLOCK.includes('大先生'), false);
});
