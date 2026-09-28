import test from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeMarkdownStyle } from '../src/libraries/markdown.js';

test('Markdown preserves the README flex layout and image dimensions', () => {
  assert.equal(
    sanitizeMarkdownStyle('DIV', 'display: flex; justify-content: center; align-items: center;'),
    'display: flex; justify-content: center; align-items: center'
  );
  assert.equal(sanitizeMarkdownStyle('IMG', 'width: 49%;padding: 10px;'), 'width: 49%; padding: 10px');
});

test('Markdown limits inline layout styles to div and img', () => {
  for (const tag of ['a', 'span', 'p', 'svg', 'script']) {
    assert.equal(sanitizeMarkdownStyle(tag, 'display: flex; width: 49%;'), '');
  }
  assert.equal(sanitizeMarkdownStyle('div', 'position: fixed; inset: 0; z-index: 999; display: none'), '');
});

test('Markdown removes CSS requests and functions while preserving safe declarations', () => {
  assert.equal(
    sanitizeMarkdownStyle(
      'img',
      'width: 49%; background: url(https://example.com/track); padding: 10px; ' +
        'width: expression(alert(1)); padding: var(--spacing); --spacing: 100px; color: red'
    ),
    'width: 49%; padding: 10px'
  );
});

test('Markdown accepts only nonnegative lengths and one to four padding values', () => {
  assert.equal(
    sanitizeMarkdownStyle('img', 'WIDTH: 49%; PADDING: 0 .5em 10px 1rem;'),
    'width: 49%; padding: 0 .5em 10px 1rem'
  );
  for (const value of ['-10px', '10', 'calc(100% - 1px)', '49% !important', 'url(x)', '1px 2px']) {
    assert.equal(sanitizeMarkdownStyle('img', `width: ${value}`), '');
  }
  assert.equal(sanitizeMarkdownStyle('img', 'padding: 1px 2px 3px 4px 5px'), '');
});

test('Markdown drops escaped CSS, malformed declarations, and prototype property names', () => {
  assert.equal(
    sanitizeMarkdownStyle(
      'div',
      String.raw`constructor: x; __proto__: x; width; width:; d\69splay: flex; display: f\6cex;`
    ),
    ''
  );
  assert.equal(sanitizeMarkdownStyle('div', ''), '');
});
