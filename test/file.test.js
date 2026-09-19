import test from 'node:test';
import assert from 'node:assert/strict';

const calls = [];
let closeCalls = 0;

Object.defineProperty(globalThis.document, '__monkeyWindow-node-test', {
  configurable: true,
  value: {
    close() {
      closeCalls += 1;
    },
  },
});

const links = [];
globalThis.document.createElement = () => {
  const link = {
    style: {},
    click() {
      calls.push({ api: 'link.click', href: link.href, download: link.download });
    },
    remove() {
      calls.push({ api: 'link.remove' });
    },
  };
  links.push(link);
  return link;
};
globalThis.document.body = {
  appendChild(link) {
    calls.push({ api: 'body.appendChild', link });
  },
};
URL.createObjectURL = () => 'blob:better-nxu-test';
URL.revokeObjectURL = (url) => calls.push({ api: 'URL.revokeObjectURL', url });

const { closeCurrentTab, downloadTextFile } = await import('../src/utils/file.js');

test('tab close uses vite-plugin-monkey monkeyWindow', () => {
  closeCalls = 0;
  assert.equal(closeCurrentTab(), true);
  assert.equal(closeCalls, 1);
});

test('text download uses one native link for a local Blob URL', async () => {
  await downloadTextFile('{}', 'schedule.json');
  assert.deepEqual(
    calls.slice(0, 2).map(({ api }) => api),
    ['body.appendChild', 'link.click']
  );
  assert.equal(links.at(-1).href, 'blob:better-nxu-test');
  assert.equal(links.at(-1).download, 'schedule.json');
});
