/**
 * sites/webvpn/components/tools/ics-id — 个人课表 ID 提取 + 身份信息获取（信息门户/学工系统 fetch 网络层）
 * 对应 1.x：Better NXU.user.js 行 1897-2002（IIFE 顶层 extractIcsId / getIcsId / getStudentOwner，
 *           B4 决定"导入侧解密/ids 提取留 B7"，本批随 tools 页一并迁出）
 * 依赖：vite-plugin-monkey 官方客户端（unsafeWindow 取真实 window 的 fetch——02 §6.1：沙箱 fetch 被 ScriptCat 拦，
 *       须走真实 page window）、config/gm-store（setGMValue 写 'icsId'，键已注册）、utils/console
 * 入口/被谁调用：sites/webvpn/components/tools/ToolsApp.vue（ensurePersonalSchedule → getIcsId；
 *               exportPersonalJson → getVerifiedStudentOwner → getStudentOwner）
 *
 * 与 1.x 等价点（C5，逐字对齐行 1897-2002）：
 *  - extractIcsId(payload)：walk 递归 + preferredKeys/url 正则 + candidates 收集，逐字迁移。
 *  - getIcsId()：POST 信息门户 execCardMethod/SYS_CARD_CALENDAR（body 含 calId 固定值 + n=Math.random()），
 *    extractIcsId 提取 → await setGMValue('icsId', icsId) 缓存。fetch 改经 unsafeWindow.fetch
 *    （1.x 裸 fetch 在 IIFE 内可达；2.0 模块作用域取不到裸 fetch，且沙箱 fetch 可能被拦，故显式真实 window）。
 *  - getStudentOwner(studentId)：POST 学工系统 getStuBaseInfo.do（URLSearchParams 表单），
 *    returnCode !== '#E000000000000' → STUDENT_ID_MISMATCH；返回 {id, name}。
 */
import { unsafeWindow as grantedUnsafeWindow } from '#gm';
import { buildWebVpnUrl } from '../../../../utils/webvpn-url.js';
import { fetchWithTimeout } from '../../../../utils/fetch.js';
import { setGMValue } from '../../../../config/gm-store.js';

const pageWindow = grantedUnsafeWindow ?? window;

/**
 * 从门户分享响应中递归提取课表 ID。对应 1.x extractIcsId（行 1897-1945）。
 * @param {*} payload 响应文本或已 JSON.parse 的对象
 * @returns {string} 找到的 icsId；未找到返回 ''
 */
function extractIcsId(payload) {
  const visited = new Set();
  const candidates = new Set();
  const preferredKeys =
    /^(?:icsId|icsid|shareId|shareid|calendarId|calendarid|calUrl|calurl|shareUrl|shareurl|url)$/;

  function walk(value, key = '') {
    if (typeof value === 'string') {
      const normalizedValue = value.replace(/\\\//g, '/');
      const urlMatch = normalizedValue.match(/portal\.nxu\.edu\.cn\/cal\/(\d{6,})/i);
      if (urlMatch) return urlMatch[1];
      if (preferredKeys.test(key) && /^\d{6,}$/.test(value.trim())) return value.trim();
      if (
        /^\d{6,}$/.test(value.trim()) &&
        !['20284725165199735', '1384527242405474304'].includes(value.trim())
      ) {
        candidates.add(value.trim());
      }
      if (/^[[{]/.test(value.trim())) {
        try {
          return walk(JSON.parse(value), key);
        } catch {
          return '';
        }
      }
      return '';
    }
    if (!value || typeof value !== 'object' || visited.has(value)) return '';
    visited.add(value);
    if (Array.isArray(value)) {
      for (const item of value) {
        const id = walk(item, key);
        if (id) return id;
      }
      return '';
    }
    for (const [itemKey, itemValue] of Object.entries(value)) {
      const id = walk(itemValue, itemKey);
      if (id) return id;
    }
    return '';
  }

  if (typeof payload === 'string') {
    const raw = payload.replace(/\\\//g, '/');
    const urlMatch = raw.match(/portal\.nxu\.edu\.cn\/cal\/(\d{6,})/i);
    if (urlMatch) return urlMatch[1];
    const fieldMatch = raw.match(
      /"(?:icsId|icsid|shareId|shareid|calendarId|calendarid|data)"\s*:\s*"?(\d{6,})"?/i
    );
    if (fieldMatch && !['20284725165199735', '1384527242405474304'].includes(fieldMatch[1]))
      return fieldMatch[1];
  }
  const result = walk(payload);
  return result || (candidates.size === 1 ? [...candidates][0] : '');
}

/**
 * 获取当前账号个人课表 ID（信息门户分享接口），并缓存到 GM 键 'icsId'。
 * 对应 1.x getIcsId（行 1947-1975）。fetch 走真实 page window（02 §6.1）。
 * @returns {Promise<string>} icsId（失败抛 Error）
 */
export async function getIcsId(options = {}) {
  // 代理 URL 经 buildWebVpnUrl 构造（B2 审计：原硬编码 webvpn token 与 WEBVPN_HOST_TOKENS 表重复，改单一来源）。
  let response;
  try {
    response = await fetchWithTimeout(
      pageWindow.fetch.bind(pageWindow),
      buildWebVpnUrl('https://portal.nxu.edu.cn/execCardMethod/20284725165199735/SYS_CARD_CALENDAR'),
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardId: 'SYS_CARD_CALENDAR',
          cardWid: '20284725165199735',
          method: 'share',
          param: { calId: '1384527242405474304', lang: 'zh_CN' },
          n: String(Math.random()),
        }),
      },
      { signal: options.signal, timeoutMs: options.timeoutMs || 15000 }
    );
  } catch (error) {
    if (error?.name === 'TimeoutError') throw new Error('个人课表 ID 获取超时，请稍后重试', { cause: error });
    throw error;
  }
  if (!response.ok) throw new Error(`个人课表 ID 获取失败：HTTP ${response.status}`);
  const responseText = await response.text();
  let payload = responseText;
  try {
    payload = JSON.parse(responseText);
  } catch {
    // 部分门户版本直接返回分享链接文本。
  }
  const icsId = extractIcsId(responseText) || extractIcsId(payload);
  if (!icsId) throw new Error('响应中未找到个人课表 ID，请确认信息门户登录状态');
  await setGMValue('icsId', icsId);
  return icsId;
}

/**
 * 按学号获取当前 WebVPN 登录账号的身份信息（学工系统接口）。
 * 对应 1.x getStudentOwner（行 1977-2002）。fetch 走真实 page window。
 * @param {string|number} studentId 学号
 * @returns {Promise<{id:string, name:string}>} 身份信息；学号不匹配抛 code=STUDENT_ID_MISMATCH
 */
export async function getStudentOwner(studentId, options = {}) {
  const normalizedId = String(studentId || '').trim();
  // 代理 URL 经 buildWebVpnUrl 构造（B2 审计：单一来源，query 参数 vpn-12-o2-xsfw.nxu.edu.cn 原样保留）。
  let response;
  try {
    response = await fetchWithTimeout(
      pageWindow.fetch.bind(pageWindow),
      buildWebVpnUrl(
        'https://xsfw.nxu.edu.cn/xsfw/sys/jbxxapp/modules/infoStudent/getStuBaseInfo.do?vpn-12-o2-xsfw.nxu.edu.cn'
      ),
      {
        method: 'POST',
        credentials: 'include',
        headers: { Accept: 'application/json, text/plain, */*' },
        body: new URLSearchParams({ requestParamStr: JSON.stringify({ XSBH: normalizedId }) }),
      },
      { signal: options.signal, timeoutMs: options.timeoutMs || 15000 }
    );
  } catch (error) {
    if (error?.name === 'TimeoutError') throw new Error('身份信息获取超时，请稍后重试', { cause: error });
    throw error;
  }
  if (!response.ok) throw new Error(`身份信息获取失败：HTTP ${response.status}`);
  const result = await response.json();
  if (result?.returnCode !== '#E000000000000') {
    const error = new Error(result?.returnMessage || result?.message || '学号与当前登录账号不一致');
    error.code = 'STUDENT_ID_MISMATCH';
    throw error;
  }
  const owner = {
    id: String(result.data?.XSBH || '').trim(),
    name: String(result.data?.XM || '').trim(),
  };
  if (!owner.id || !owner.name || owner.id !== normalizedId) {
    const error = new Error('返回的身份信息与输入学号不一致');
    error.code = 'STUDENT_ID_MISMATCH';
    throw error;
  }
  return owner;
}
