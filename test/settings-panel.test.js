import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parse, compileScript } from 'vue/compiler-sfc';
import * as keys from '../src/config/gm-keys.js';
import { createSettingsWriteQueue } from '../src/config/settings-write-queue.js';

// Import Vue in its normal Node environment; test/setup's document is only a GM bridge.
const gmDocument = globalThis.document;
globalThis.document = undefined;
const vue = await import('vue');
globalThis.document = gmDocument;

// Exercise the real SFC setup/watchers with Vue reactivity and an in-memory GM backend.
// Rendering and the Vant click/emit path are additionally checked in a real browser.
let backend;
const page = {
  createToast: (type, message) => backend.toasts.push({ type, message }),
};
document[globalThis.__MONKEY_WINDOW_KEY__] = {
  unsafeWindow: page,
  GM_getValue: (name, fallback) => (backend.values.has(name) ? backend.values.get(name) : fallback),
  GM: {
    async setValue(name, value) {
      if (backend.failKey === name) throw new Error('fixture write failure');
      backend.values.set(name, keys.cloneGMValue(value));
      backend.writes.push(name);
    },
    async setValues(values) {
      for (const [name, value] of Object.entries(values)) backend.values.set(name, keys.cloneGMValue(value));
    },
  },
};
const store = await import('../src/config/gm-store.js');
const notifications = await import('../src/libraries/notification.js');
const { descriptor } = parse(
  readFileSync(new URL('../src/sites/sslvpn/components/settings/SettingsPanel.vue', import.meta.url), 'utf8')
);
const compiled = compileScript(descriptor, { id: 'settings-regression', genDefaultAs: 'SettingsPanel' });
const imports = Object.values(compiled.imports);
const modules = {
  vue: { ...vue, onMounted() {}, onBeforeUpdate() {} },
  vant: Object.fromEntries(
    imports
      .filter((item) => item.source === 'vant')
      .map((item) => [item.imported, item.imported === 'showConfirmDialog' ? async () => 'confirm' : {}])
  ),
  '../../../../config/gm-store.js': store,
  '../../../../config/gm-keys.js': keys,
  '../../../../config/settings-write-queue.js': { createSettingsWriteQueue },
  '#gm': { unsafeWindow: page },
  '../../../../libraries/notification.js': notifications,
  '../../../../utils/console.js': { MyConsole: () => () => {} },
};
const component = new Function(
  ...imports.map((item) => item.local),
  compiled.content.replace(/^import[\s\S]*?from\s+(['"])[^'"]+\1;?\r?\n/gm, '') + '\nreturn SettingsPanel;'
)(
  ...imports.map((item) => {
    assert.ok(item.imported in modules[item.source], `Missing test adapter for ${item.local}`);
    return modules[item.source][item.imported];
  })
);

function setup(t, initial = {}) {
  backend = {
    values: new Map(
      Object.entries({
        'WebVPN.username': 'fixture-account',
        'WebVPN.password': 'fixture-password',
        'Jwgl.username': 'fixture-account',
        'Jwgl.password': 'fixture-password',
        ...initial,
      })
    ),
    writes: [],
    toasts: [],
  };
  const scope = vue.effectScope();
  t.after(() => scope.stop());
  const model = scope.run(() => component.setup({}, { expose() {} }));
  return {
    model,
    backend,
    scope,
    async flush() {
      await vue.nextTick();
      await model.settingWrites.flush();
    },
  };
}

test('every rendered settings model persists to its GM key and reloads correctly', async (t) => {
  const f = setup(t);
  const bindings = [...descriptor.template.content.matchAll(/v-model="(\w+)"/g)].map((match) => match[1]);
  assert.equal(bindings.length, 16);
  assert.deepEqual(f.backend.writes, [], 'mount must not rewrite saved values');
  const expected = {};
  for (const binding of bindings) {
    const ref = f.model[binding];
    const matches = Object.entries(f.model.allSettingModels).filter(([, value]) => value === ref);
    assert.equal(matches.length, 1, `${binding} must map to exactly one stored setting`);
    const key = matches[0][0];
    const value = Array.isArray(ref.value)
      ? ref.value.slice(1)
      : typeof ref.value === 'boolean'
        ? !ref.value
        : `${ref.value}-updated`;
    ref.value = value;
    expected[key] = value;
    await f.flush();
    assert.deepEqual(f.backend.values.get(key), value, `${key} must persist after UI change`);
  }
  f.scope.stop();
  const reopened = setup(t, Object.fromEntries(f.backend.values));
  for (const [key, value] of Object.entries(expected))
    assert.deepEqual(reopened.model.allSettingModels[key].value, value, key);
  assert.deepEqual(reopened.backend.writes, [], 'reopening must preserve settings without writes');
});

test('card and menu array edits persist when mutated in place', async (t) => {
  const f = setup(t);
  for (const key of ['WebVPN.customCard', 'Jwgl.customMenu']) {
    const ref = f.model.allSettingModels[key];
    ref.value.pop();
    await f.flush();
    assert.deepEqual(f.backend.values.get(key), [...ref.value], key);
  }
});

test('checkbox row handlers accept the array unwrapped by Vue templates', (t) => {
  const f = setup(t);
  let toggles = 0;
  for (const name of ['webVPNCustomCardRefs', 'jwglCustomMenuRefs']) {
    f.model[name].value = [
      {
        toggle() {
          toggles++;
        },
      },
    ];
    f.model.cellCheckBoxToggle(vue.unref(f.model[name]), 0);
    f.model.cellCheckBoxToggle(vue.unref(f.model[name]), 99);
  }
  assert.equal(toggles, 2);
});

test('clearing either credential disables and persists the corresponding automatic login', async (t) => {
  const f = setup(t, { 'WebVPN.autoLogin': true, 'Jwgl.autoLogin': true });
  f.model.webVPNAccount.value = '';
  f.model.jwglPassword.value = '';
  await f.flush();
  for (const group of ['WebVPN', 'Jwgl']) {
    assert.equal(f.model.allSettingModels[`${group}.autoLogin`].value, false);
    assert.equal(f.backend.values.get(`${group}.autoLogin`), false);
  }
});

test('functional and full resets synchronize every model without losing retained credentials', async (t) => {
  const f = setup(t, { 'TuanWei.autoDownload': true, 'TuanWei.autoDownloadClose': true });
  f.model.webVPNCourseGrab.value = false;
  await vue.nextTick();
  await f.model.resetFunctionSettings();
  await f.flush();
  for (const [key, ref] of Object.entries(f.model.resettableSettingModels)) {
    assert.deepEqual(ref.value, keys.GM_VALUE_DEFAULTS[key], key);
    assert.deepEqual(f.backend.values.get(key), keys.GM_VALUE_DEFAULTS[key], key);
  }
  assert.equal(f.backend.values.get('WebVPN.username'), 'fixture-account');
  await f.model.resetAllSettings();
  await f.flush();
  for (const [key, ref] of Object.entries(f.model.allSettingModels)) {
    assert.deepEqual(ref.value, keys.GM_VALUE_DEFAULTS[key], key);
    assert.deepEqual(f.backend.values.get(key), keys.GM_VALUE_DEFAULTS[key], key);
  }
});

test('GM write failure shows the existing error toast and does not stop later settings', async (t) => {
  const f = setup(t);
  f.backend.failKey = 'TuanWei.autoDownload';
  f.model.tuanweiAutoDownload.value = true;
  await f.flush();
  assert.ok(f.backend.toasts.some((event) => event.type === 'error' && event.message.includes('保存失败')));
  assert.notEqual(f.backend.values.get('TuanWei.autoDownload'), true);
  f.model.webVPNAutoClose.value = true;
  await f.flush();
  assert.equal(f.backend.values.get('WebVPN.autoClose'), true);
});
