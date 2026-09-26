import test from 'node:test';
import assert from 'node:assert/strict';
import {
  LIBRARY_READER_PLATFORMS,
  LIBRARY_READER_MATCHES,
  parseLibraryReaderLocation,
  resolveLibraryReader,
} from '../src/utils/library-reader.js';
import { buildWebVpnUrl } from '../src/utils/webvpn-url.js';
import { isTrustedIdsContext } from '../src/utils/route-guards.js';

function campusUrl(input) {
  const source = new URL(input);
  const target = new URL(source.pathname + source.search + source.hash, 'https://zylib.nxu.edu.cn');
  target.searchParams.set('__proto__', source.protocol.slice(0, -1));
  target.searchParams.set('__host__', source.hostname);
  return target.href;
}

test('library platforms share reader capabilities across direct, zylib and WebVPN access', () => {
  for (const platform of LIBRARY_READER_PLATFORMS) {
    for (const host of platform.hosts) {
      for (const path of platform.paths) {
        for (const suffix of ['', '/', '.aspx']) {
          const source = `https://${host}${path}${suffix}?id=fixture#section`;
          for (const [url, access] of [
            [source, 'direct'],
            [campusUrl(source), 'zylib'],
            [buildWebVpnUrl(source), 'webvpn'],
          ]) {
            const location = parseLibraryReaderLocation(url);
            assert.deepEqual(location, { host, path: `${path}${suffix}`, access });
            assert.equal(resolveLibraryReader({ url }), platform);
          }
        }
      }
    }
    assert.equal(platform.copy, true);
    assert.equal(platform.slider, platform.id === 'cnki');
  }
});

test('zylib entry URLs recognize only supported reading pages', () => {
  assert.equal(
    resolveLibraryReader('https://zylib.nxu.edu.cn/-----https://kns.cnki.net/reader/xml')?.id,
    'cnki'
  );
  assert.equal(
    resolveLibraryReader(
      'https://zylib.nxu.edu.cn/-----https://f.wanfangdata.com.cn/online/pc/periodical_html/fixture'
    )?.id,
    'wanfang'
  );
  for (const url of [
    'https://zylib.nxu.edu.cn/login',
    'https://zylib.nxu.edu.cn/-----https://www.cnki.net/',
    campusUrl('https://www.cnki.net/'),
  ]) {
    assert.equal(resolveLibraryReader(url), null);
  }
});

test('reader guards reject ambiguous targets, lookalikes and unrelated paths', () => {
  const base = 'https://zylib.nxu.edu.cn/reader/xml';
  for (const url of [
    `${base}?__host__=kns.cnki.net`,
    `${base}?__proto__=https`,
    `${base}?__proto__=javascript&__host__=kns.cnki.net`,
    `${base}?__proto__=https&__host__=kns.cnki.net&__host__=example.com`,
    `${base}?__proto__=https&__proto__=http&__host__=kns.cnki.net`,
    `${base}?__proto__=https&__host__=kns.cnki.net.example`,
    `${base}?__proto__=https&__host__=kns.cnki.net/other`,
    `${base}?__proto__=https&__host__=kns.cnki.net:443`,
    `${base}?__proto__=https&__host__=kns.cnki.net@example.com`,
    `${base}?__proto__=https&__host__=https://kns.cnki.net`,
    'https://zylib.nxu.edu.cn.example/reader/xml?__proto__=https&__host__=kns.cnki.net',
    'https://example.com/reader/xml?__proto__=https&__host__=kns.cnki.net',
    'https://zylib.nxu.edu.cn/-----https://kns.cnki.net/reader/xml?__proto__=https&__host__=kns.cnki.net',
    'https://zylib.nxu.edu.cn/-----https://fixture@kns.cnki.net/reader/xml',
    'https://fixture@kns.cnki.net/reader/xml',
    campusUrl('https://kns.cnki.net/reader/xml-other'),
    campusUrl('https://kns.cnki.net/unrelated/reader/xml'),
    campusUrl('https://f.wanfangdata.com.cn/online/pc/periodical_html-other'),
    'https://webvpn.nxu.edu.cn/https/0000000000000000000000000000000000000000/reader/xml',
    'not a URL',
  ])
    assert.equal(resolveLibraryReader(url), null, url);
  assert.equal({}.polluted, undefined);
});

test('zylib targets do not become trusted authentication contexts', () => {
  const url = campusUrl('https://ids.nxu.edu.cn/authserver/login');
  assert.equal(isTrustedIdsContext({ url, host: 'zylib.nxu.edu.cn', isWebvpn: false }), false);
  assert.equal(resolveLibraryReader(url), null);
});

test('new copying platforms use the same resolver and metadata is limited to configured paths', () => {
  const platform = {
    id: 'fixture',
    hosts: ['reader.example.com'],
    paths: ['/read'],
    copy: true,
    slider: false,
  };
  for (const url of [
    'https://reader.example.com/read/fixture',
    campusUrl('https://reader.example.com/read/fixture'),
  ]) {
    assert.equal(resolveLibraryReader(url, [platform]), platform);
  }
  assert.equal(LIBRARY_READER_MATCHES.length, 6);
  assert.equal(LIBRARY_READER_MATCHES.includes('*://zylib.nxu.edu.cn/*'), true);
  assert.equal(LIBRARY_READER_MATCHES.includes('*://www.cnki.net/*'), false);
});
