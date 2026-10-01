import test from 'node:test';
import assert from 'node:assert/strict';
import { MyConsole, sanitizeConsoleDetail } from '../src/utils/console.js';

test('console details redact nested credentials and URL parameters without changing input', () => {
  const value = {
    username: 'fixture-user',
    nested: { password: 'fixture-password' },
    href: 'https://fixture-user:fixture-password@ids.nxu.edu.cn/authserver/callback?code=fixture-code#fixture-state',
    path: '/authserver/login?ticket=fixture-ticket',
    realPath: '/cal/fixture-calendar',
  };
  const safe = sanitizeConsoleDetail(value);
  assert.equal(safe.username, '[已隐藏]');
  assert.equal(safe.nested.password, '[已隐藏]');
  assert.equal(safe.href, 'https://ids.nxu.edu.cn/authserver/callback');
  assert.equal(safe.path, '/authserver/login');
  assert.equal(safe.realPath, '/cal/[已隐藏]');
  assert.equal(value.nested.password, 'fixture-password');
});

test('console sanitizes error messages and stacks at the root and in nested details', () => {
  const error = new Error('GET https://ids.nxu.edu.cn/authserver/login?ticket=fixture-ticket failed');
  error.code = 'WAIT_TIMEOUT';
  for (const value of [error, { error }]) {
    const result = sanitizeConsoleDetail(value);
    assert.doesNotMatch(JSON.stringify(result), /fixture-ticket/);
    const safe = result.error || result;
    assert.equal(safe.code, 'WAIT_TIMEOUT');
    assert.match(safe.stack, /Error/);
    assert.match(safe.message, /authserver\/login/);
  }
  const cycle = {};
  cycle.self = cycle;
  assert.equal(sanitizeConsoleDetail(cycle).self, '[循环引用]');
});

test('debug can be enabled at runtime and log messages pass through redaction', (t) => {
  const calls = [];
  t.mock.method(globalThis.console, 'debug', (...args) => calls.push(args));
  t.mock.method(globalThis.console, 'warn', (...args) => calls.push(args));
  const previous = globalThis.__BETTER_NXU_DEBUG__;
  t.after(() => {
    globalThis.__BETTER_NXU_DEBUG__ = previous;
  });
  const log = MyConsole('[fixture]');
  globalThis.__BETTER_NXU_DEBUG__ = false;
  log('hidden', '', 'debug');
  assert.equal(calls.length, 0);
  globalThis.__BETTER_NXU_DEBUG__ = true;
  log('visible', '', 'debug');
  log('请求失败 https://example.com/login?code=fixture-code', { token: 'fixture-token' }, 'warn');
  assert.match(JSON.stringify(calls), /visible/);
  assert.doesNotMatch(JSON.stringify(calls), /fixture-code|fixture-token/);
});
