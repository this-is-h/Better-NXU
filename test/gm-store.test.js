import test from 'node:test';
import assert from 'node:assert/strict';

const calls = [];
const persisted = new Map();
const gm = {
  async setValue(name, value) {
    calls.push({ api: 'GM.setValue', name, value });
  },
  async setValues(values) {
    calls.push({ api: 'GM.setValues', values });
  },
};

Object.defineProperty(globalThis.document, '__monkeyWindow-node-test', {
  configurable: true,
  value: {
    GM: gm,
    GM_getValue(name, defaultValue) {
      calls.push({ api: 'GM_getValue', name, defaultValue });
      return persisted.has(name) ? persisted.get(name) : defaultValue;
    },
    async GM_setValue(name, value) {
      calls.push({ api: 'GM_setValue', name, value });
    },
    async GM_setValues(values) {
      calls.push({ api: 'GM_setValues', values });
    },
  },
});

const { getAllSettingDefaults, getGMValue, resetFunctionSettingValues, setGMValue } =
  await import('../src/config/gm-store.js');

test('reads use the official default-value parameter without writing', () => {
  calls.length = 0;
  const customCards = getGMValue('WebVPN.customCard');
  assert.deepEqual(calls, [
    {
      api: 'GM_getValue',
      name: 'WebVPN.customCard',
      defaultValue: customCards,
    },
  ]);
  assert.notEqual(calls[0].defaultValue, customCards);
});

test('effective reset defaults disable automatic login when credentials are absent', () => {
  const defaults = getAllSettingDefaults();
  assert.equal(defaults['WebVPN.autoLogin'], false);
  assert.equal(defaults['Jwgl.autoLogin'], false);
  assert.deepEqual(defaults['WebVPN.customCard'], [
    '教务管理',
    '学工系统',
    '信息门户',
    '中国知网',
    '万方数据',
  ]);
});

test('settings reset prefers GM.setValues and falls back to GM_setValues', async () => {
  calls.length = 0;
  const defaults = await resetFunctionSettingValues();
  assert.deepEqual(
    calls.map(({ api }) => api),
    ['GM.setValues']
  );
  assert.deepEqual(calls[0].values, defaults);

  gm.setValues = undefined;
  const fallbackDefaults = await resetFunctionSettingValues();
  assert.deepEqual(
    calls.map(({ api }) => api),
    ['GM.setValues', 'GM_setValues']
  );
  assert.deepEqual(calls[1].values, fallbackDefaults);
});

test('single writes prefer GM.setValue and fall back to GM_setValue', async () => {
  calls.length = 0;
  await setGMValue('firstSet', true);
  assert.deepEqual(calls, [{ api: 'GM.setValue', name: 'firstSet', value: true }]);

  gm.setValue = undefined;
  await setGMValue('configVersion', 7);
  assert.deepEqual(calls, [
    { api: 'GM.setValue', name: 'firstSet', value: true },
    { api: 'GM_setValue', name: 'configVersion', value: 7 },
  ]);
});

test('single writes reject unregistered keys', async () => {
  await assert.rejects(setGMValue('unknown.key', true), /未注册的 GM 存储键/);
});

test('Tuanwei settings retain explicit old values and both resets default to off', async () => {
  const { ConfigVersion } = await import('../src/config/config-version.js');
  const { resetAllSettingValues } = await import('../src/config/gm-store.js');
  assert.equal(ConfigVersion, 8);
  for (const key of ['TuanWei.autoDownload', 'TuanWei.autoDownloadClose']) {
    assert.equal(getGMValue(key), false);
    persisted.set(key, true);
    assert.equal(getGMValue(key), true);
    persisted.delete(key);
    assert.equal((await resetFunctionSettingValues())[key], false);
    assert.equal((await resetAllSettingValues())[key], false);
  }
});
