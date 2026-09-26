import test from 'node:test';
import assert from 'node:assert/strict';

import { downloadSnapdomImage } from '../src/utils/snapdom.js';

function createInlineStyle(initial = '') {
  let explicitCssText = initial;
  const properties = new Map();
  return {
    get cssText() {
      if (explicitCssText) return explicitCssText;
      return [...properties.entries()]
        .map(([name, { value, priority }]) => `${name}: ${value}${priority ? ` !${priority}` : ''};`)
        .join(' ');
    },
    set cssText(value) {
      explicitCssText = String(value);
      properties.clear();
    },
    setProperty(name, value, priority = '') {
      explicitCssText = '';
      properties.set(name, { value, priority });
    },
    getPropertyValue(name) {
      return properties.get(name)?.value || '';
    },
  };
}

function createElement(name, originalStyle, computedValues, ownerDocument) {
  const attributes = new Map();
  if (originalStyle !== null) attributes.set('style', originalStyle);
  const element = {
    name,
    ownerDocument,
    computedValues,
    style: createInlineStyle(originalStyle || ''),
    descendants: [],
    querySelectorAll() {
      return element.descendants;
    },
    getAttribute(attribute) {
      return attributes.has(attribute) ? attributes.get(attribute) : null;
    },
    setAttribute(attribute, value) {
      attributes.set(attribute, value);
      if (attribute === 'style') element.style.cssText = value;
    },
    removeAttribute(attribute) {
      attributes.delete(attribute);
      if (attribute === 'style') element.style.cssText = '';
    },
  };
  return element;
}

function createEnvironment(descendantCount = 1) {
  let yieldCount = 0;
  const requestedProperties = [];
  const ownerDocument = {
    createElement() {
      return { style: createInlineStyle() };
    },
  };
  class Serializer {
    serializeToString() {
      return '<foreignobject><div></div></foreignobject>';
    }
  }
  const pageWindow = {
    XMLSerializer: Serializer,
    setTimeout(callback) {
      yieldCount++;
      queueMicrotask(callback);
    },
    getComputedStyle(element) {
      const names = Object.keys(element.computedValues);
      return {
        length: names.length,
        ...Object.fromEntries(names.map((name, index) => [index, name])),
        getPropertyValue(name) {
          requestedProperties.push(name);
          return element.style.getPropertyValue(name) || element.computedValues[name] || '';
        },
        getPropertyPriority() {
          return '';
        },
      };
    },
  };
  const root = createElement(
    'root',
    'color: red;',
    { color: 'rgb(255, 0, 0)', display: 'table', '--webvpn-noise': 'ignored' },
    ownerDocument
  );
  const descendants = Array.from({ length: descendantCount }, (_, index) =>
    createElement(
      `child-${index}`,
      null,
      { color: 'rgb(0, 0, 0)', display: 'table-cell', '--webvpn-noise': 'ignored' },
      ownerDocument
    )
  );
  root.descendants.push(...descendants);
  return {
    child: descendants[0],
    getYieldCount: () => yieldCount,
    pageWindow,
    requestedProperties,
    root,
    Serializer,
  };
}

test('direct captures preserve output scale and avoid newly automatic font downloads', async () => {
  const target = { querySelectorAll: () => [] };
  const options = { format: 'png', scale: 2.5 };
  const calls = [];
  const snapdom = {
    async download(receivedTarget, receivedOptions) {
      calls.push({ receivedTarget, receivedOptions });
      return 'direct';
    },
  };

  assert.equal(await downloadSnapdomImage({ snapdom, target, options }), 'direct');
  assert.deepEqual(calls, [{ receivedTarget: target, receivedOptions: { embedFonts: false, ...options } }]);
  await downloadSnapdomImage({ snapdom, target, options: { ...options, embedFonts: 'auto' } });
  assert.equal(calls.at(-1).receivedOptions.embedFonts, 'auto');
});

test('WebVPN captures inline styles, fix foreignObject, and restore state', async () => {
  const { child, pageWindow, root, Serializer } = createEnvironment();
  const originalSerialize = Serializer.prototype.serializeToString;
  let receivedOptions;
  const snapdom = {
    async download(target, options) {
      receivedOptions = options;
      assert.match(target.style.cssText, /rgb\(255, 0, 0\)/);
      assert.match(child.style.cssText, /table-cell/);
      assert.equal(new Serializer().serializeToString(), '<foreignObject><div></div></foreignObject>');
      return 'webvpn';
    },
  };

  const result = await downloadSnapdomImage({
    snapdom,
    target: root,
    options: { format: 'png', cache: 'auto' },
    fixWebVpn: true,
    pageWindow,
  });

  assert.equal(result, 'webvpn');
  assert.equal(receivedOptions.cache, 'disabled');
  assert.equal(receivedOptions.invalidate, true);
  assert.equal(receivedOptions.embedFonts, false);
  assert.equal(root.getAttribute('style'), 'color: red;');
  assert.equal(child.getAttribute('style'), null);
  assert.equal(Serializer.prototype.serializeToString, originalSerialize);
});

test('WebVPN capture failures still restore styles and serializer', async () => {
  const { child, pageWindow, root, Serializer } = createEnvironment();
  const originalSerialize = Serializer.prototype.serializeToString;
  const snapdom = {
    async download() {
      throw new Error('capture failed');
    },
  };

  await assert.rejects(
    downloadSnapdomImage({
      snapdom,
      target: root,
      fixWebVpn: true,
      pageWindow,
    }),
    /capture failed/
  );

  assert.equal(root.getAttribute('style'), 'color: red;');
  assert.equal(child.getAttribute('style'), null);
  assert.equal(Serializer.prototype.serializeToString, originalSerialize);
});

test('WebVPN style collection skips unrelated properties and yields between batches', async () => {
  const { getYieldCount, pageWindow, requestedProperties, root } = createEnvironment(65);
  const snapdom = {
    async download(target) {
      assert.match(target.style.cssText, /display: table/);
      assert.doesNotMatch(target.style.cssText, /webvpn-noise/);
    },
  };

  await downloadSnapdomImage({
    snapdom,
    target: root,
    fixWebVpn: true,
    pageWindow,
  });

  assert.equal(requestedProperties.includes('--webvpn-noise'), false);
  assert.equal(getYieldCount(), 3);
});

test('WebVPN preserves fractional text widths through repeated CSS serialization without changing fonts', async () => {
  const { root, child, pageWindow } = createEnvironment();
  const family =
    '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, "Microsoft Yahei", sans-serif';
  root.computedValues['font-family'] = family;
  child.computedValues['font-family'] = family;
  child.computedValues.width = '68.0156px';
  child.computedValues.height = '25px';
  child.computedValues['line-height'] = '25px';
  child.computedValues['white-space'] = 'normal';
  const originalStyle = 'font-family: "Helvetica Neue" !important; color: red;';
  root.setAttribute('style', originalStyle);
  await downloadSnapdomImage({
    snapdom: {
      async download() {
        assert.match(child.style.cssText, /width: 69px/);
        assert.match(child.style.cssText, /height: 25px/);
        assert.match(child.style.cssText, /line-height: 25px/);
        assert.match(child.style.cssText, /white-space: normal/);
        assert.ok(child.style.cssText.includes(`font-family: ${family};`));
      },
    },
    target: root,
    fixWebVpn: true,
    pageWindow,
  });
  assert.equal(root.getAttribute('style'), originalStyle);
  assert.equal(child.getAttribute('style'), null);
});

test('WebVPN width normalization leaves integer and non-pixel widths unchanged', async () => {
  for (const [width, expected] of [
    ['56.0156px', '57px'],
    ['80px', '80px'],
    ['0px', '0px'],
    ['auto', 'auto'],
    ['100%', '100%'],
    ['calc(100% - 2px)', 'calc(100% - 2px)'],
  ]) {
    const { root, pageWindow } = createEnvironment(0);
    root.computedValues.width = width;
    await downloadSnapdomImage({
      snapdom: {
        async download() {
          assert.ok(root.style.cssText.includes(`width: ${expected};`));
        },
      },
      target: root,
      fixWebVpn: true,
      pageWindow,
    });
  }
});

test('computed-style collection does not mutate any element before all measurements succeed', async () => {
  const { root, child, pageWindow } = createEnvironment();
  root.computedValues['font-family'] = 'Helvetica, sans-serif';
  child.computedValues['font-family'] = 'Helvetica, sans-serif';
  const getStyle = pageWindow.getComputedStyle;
  let calls = 0;
  pageWindow.getComputedStyle = (element) => {
    assert.equal(root.style.cssText, 'color: red;');
    assert.equal(child.style.cssText, '');
    if (++calls === 2) throw new Error('measurement failed');
    return getStyle(element);
  };
  await assert.rejects(
    downloadSnapdomImage({
      snapdom: { download: () => assert.fail('capture must not start') },
      target: root,
      fixWebVpn: true,
      pageWindow,
    }),
    /measurement failed/
  );
  assert.equal(root.getAttribute('style'), 'color: red;');
  assert.equal(child.getAttribute('style'), null);
});
