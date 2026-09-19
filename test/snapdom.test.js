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
          return element.computedValues[name] || '';
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

test('direct captures keep the native snapdom path unchanged', async () => {
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
  assert.deepEqual(calls, [{ receivedTarget: target, receivedOptions: options }]);
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
