import test from 'node:test';
import assert from 'node:assert/strict';
import { PORTAL_CARDS } from '../src/sites/portal/components/portal-cards.js';
import { resolvePortalCardLink, openPortalCard } from '../src/sites/portal/components/portal-navigation.js';
import { buildWebVpnUrl } from '../src/utils/webvpn-url.js';

const campus = 'https://portal.nxu.edu.cn/index.html#/hall';
const webvpn = buildWebVpnUrl(campus);

test('portal library cards choose campus library authentication or platform URLs for the VPN hook', () => {
  const cards = PORTAL_CARDS.find((group) => group.id === 'betternxu-h-lib').items;
  for (const card of cards.filter((item) => typeof item.url === 'object')) {
    const direct = resolvePortalCardLink(card, campus);
    const proxied = resolvePortalCardLink(card, webvpn);
    assert.equal(direct.navigation, 'system');
    assert.equal(proxied.navigation, 'system');
    assert.equal(direct.url, `https://zylib.nxu.edu.cn/-----${proxied.url}`);
    assert.notEqual(new URL(proxied.url).hostname, 'zylib.nxu.edu.cn');
  }
  for (const portalUrl of [campus, webvpn]) {
    assert.deepEqual(resolvePortalCardLink(cards[0], portalUrl), {
      url: 'https://zylib.nxu.edu.cn/login',
      navigation: 'system',
    });
  }
});

test('tool cards and PubScholar bypass the page opener in both portal environments', () => {
  const cards = PORTAL_CARDS.flatMap((group) => group.items).filter((card) => card.navigation === 'direct');
  assert.equal(cards.length, 4);
  for (const portalUrl of [campus, webvpn]) {
    for (const card of cards) {
      const calls = [];
      const handle = {};
      assert.equal(
        openPortalCard(card, {
          portalUrl,
          pageWindow: { open: () => assert.fail('direct links must bypass the WebVPN hook') },
          openInTab: (...args) => {
            calls.push(args);
            return handle;
          },
        }),
        handle
      );
      assert.deepEqual(calls, [[card.url, { active: true, insert: true }]]);
    }
  }
});

test('system cards use the portal opener and preserve explicit environment URLs', () => {
  for (const portalUrl of [campus, webvpn]) {
    for (const card of PORTAL_CARDS.flatMap((group) => group.items).filter(
      (item) => item.navigation !== 'direct'
    )) {
      const calls = [];
      const opened = { opener: {} };
      openPortalCard(card, {
        portalUrl,
        pageWindow: {
          open: (...args) => {
            calls.push(args);
            return opened;
          },
        },
        openInTab: () => assert.fail('system links use the page'),
      });
      assert.deepEqual(calls, [[resolvePortalCardLink(card, portalUrl).url, '_blank']]);
      assert.equal(opened.opener, null);
    }
  }
});

test('portal open hook can initialize session storage before the opener is detached', () => {
  for (const portalUrl of [campus, webvpn]) {
    let initialized = false;
    let openCalls = 0;
    let opener = {};
    const child = {
      sessionStorage: {
        setItem: () => {
          initialized = true;
        },
      },
      set opener(value) {
        assert.equal(initialized, true);
        opener = value;
      },
    };
    const pageWindow = {
      open(_url, _target, features = '') {
        assert.equal(this, pageWindow);
        openCalls++;
        // 模拟页面在原生 open 之后初始化新窗口；旧 features 会使这里发生空引用。
        const opened = /noopener|noreferrer/.test(features) ? null : child;
        opened.sessionStorage.setItem('fixture', 'ready');
        return opened;
      },
    };
    assert.equal(openPortalCard({ url: 'https://example.com/' }, { portalUrl, pageWindow }), child);
    assert.equal(openCalls, 1);
    assert.equal(opener, null);
  }
});

test('portal null handles are safe and genuine opener failures propagate without opening twice', () => {
  const card = { url: 'https://example.com/' };
  assert.equal(openPortalCard(card, { portalUrl: campus, pageWindow: { open: () => null } }), null);
  let calls = 0;
  assert.throws(
    () =>
      openPortalCard(card, {
        portalUrl: campus,
        pageWindow: {
          open: () => {
            calls++;
            throw new Error('open failed');
          },
        },
      }),
    /open failed/
  );
  assert.equal(calls, 1);
});

test('direct mode can choose distinct environment URLs, including a fixed WebVPN destination on campus', () => {
  const card = {
    navigation: 'direct',
    url: { campus: buildWebVpnUrl('https://www.cnki.net/'), webvpn: 'https://pubscholar.cn/' },
  };
  for (const [portalUrl, expected] of [
    [campus, card.url.campus],
    [webvpn, card.url.webvpn],
  ]) {
    const calls = [];
    openPortalCard(card, {
      portalUrl,
      pageWindow: { open: () => assert.fail() },
      openInTab: (url) => calls.push(url),
    });
    assert.deepEqual(calls, [expected]);
  }
});

test('invalid or missing direct destinations never fall back to a rewritten page navigation', () => {
  const pageWindow = { open: () => assert.fail('no silent proxy fallback') };
  assert.throws(
    () =>
      openPortalCard(
        { navigation: 'direct', url: 'https://example.com/' },
        { portalUrl: webvpn, pageWindow }
      ),
    /GM_openInTab/
  );
  for (const card of [
    { url: { campus: 'https://example.com/' } },
    { url: 'javascript:alert(1)' },
    { url: 'https://fixture@example.com/' },
    { url: 'https://example.com/', navigation: 'unknown' },
  ])
    assert.throws(() => openPortalCard(card, { portalUrl: webvpn, pageWindow }));
});
