/**
 * use-schedule-export — 课表导出前的密钥协商（Vant 弹窗选/粘贴密钥 + 用 crypto 加密信封）
 * 对应 1.x：Better NXU.user.js 行 1704-1800（requestScheduleKey / selectScheduleExportPublicKey / prepareScheduleExport）
 * 依赖：config/gm-store（getGMValue 读 Schedule.encryptionKeyPair）、crypto（normalize / encryptSchedule /
 *       importPublicKey / importPrivateKey / storageKey）、utils/errors（EXPORT_CANCELLED + scheduleOperationError）、
 *       libraries/notification（toast 兜底）、vue（`import { ref, h } from 'vue'`，externalGlobals 别名 'Vue'）、vant（npm 按需
 *       import showConfirmDialog/showToast 与 Field 组件对象；样式由实际 Vant 页面按需注入）、utils/console
 * 入口/被谁调用：B6 sites/jwgl/components/course-table/course-reader.js（hExportJson 加密分支）、B7 sites/webvpn 工具页
 *               （ScheduleUpload/ScheduleExportBar 共用同一份密钥协商）——提前到 B6 落地以解 jwgl/B7 共需
 *
 * 边界说明（02 §3）：本模块属 composables 共享层，可被多 site 调用；import crypto（向下允许）、不反向依赖 sites。
 *  1.x 这三函数直接调 page 全局 vant/Vue；2.0 改 npm 按需 import vant 的函数式 API 与 Field 组件，Vue 用
 *  `import { ref, h } from 'vue'`（与 use-vue-app / SFC 同源，vite-plugin-monkey 改写为对 IIFE 参数 vue 的引用；
 *  不再经 globalThis.Vue——ScriptCat sandbox 下取不到，见 [[scriptcat-require-sandbox-scope]]）。不注入整包 vant 全局
 *  （与 1.x unsafeWindow.vant=vant 不同）——函数式 showConfirmDialog/showToast 直接调、Field 作 render 节点即可。
 *
 * 与 1.x 行为等价点（C5，逐字对齐行 1704-1800）：
 *  - requestScheduleKey(type): 弹粘贴密钥框（public/private 二态文案），beforeClose 校验 → importKey →
 *    成功 confirm 返 {pem, importedKey}；取消/空返 null/null（1.x 行 1704-1754）
 *  - selectScheduleExportPublicKey: 优先用当前 GM keypair.publicKey（弹"使用当前/粘贴接收方"二选一），
 *    confirm 用当前、否则 requestScheduleKey('public')；取消抛 EXPORT_CANCELLED（1.x 行 1756-1776）
 *  - prepareScheduleExport(schedule): showConfirmDialog 选 加密/直接 导出；直接→JSON.stringify(normalize)；
 *    加密→selectScheduleExportPublicKey→encryptSchedule→JSON.stringify(envelope)；取消视为直接导出（1.x 行 1778-1800，
 *    catch 即用户在"直接导出/取消"动作，1.x catch 内不再设 encrypt，默认 false 走直接导出，与本实现一致）
 *
 * 【修订 2026-07-30】原 B4 决策把这三函数"留 B7 sites/webvpn-tools 层逐字迁"，但 B6 jwgl hExportJson（1.x 行 3344）
 *  已需 prepareScheduleExport；经用户确认提前到 B6 落平级 composables 共享，jwgl 与 B7 工具页共用同一份。详见
 *  memory better-nxu-2.0-refactor B4 段（已同步修订）。
 */
import { showConfirmDialog, showToast, Field } from 'vant';
import { ref, h } from 'vue';
import { getGMValue } from '../config/gm-store.js';
import { encryptSchedule, importPublicKey, importPrivateKey, storageKey } from '../crypto/index.js';
import { normalize } from '../schedule/index.js';
import { EXPORT_CANCELLED, scheduleOperationError } from '../utils/errors.js';

/**
 * 弹粘贴密钥框校验并导入公/私钥。对应 1.x requestScheduleKey 行 1704-1754。
 * @param {'public'|'private'} type 公钥=粘贴接收方加密密钥；私钥=粘贴对应解密密钥
 * @param {{initialValue?:string, filename?:string}} [options] initialValue 预填文本；filename 仅 private 用于提示文案
 * @returns {Promise<{pem:string, importedKey:object}|null>} confirm 返 {pem,importedKey}；取消/overlay close 返 null
 */
export async function requestScheduleKey(type, options = {}) {
  // Vue.ref/Vue.h 取自 `import { ref, h } from 'vue'`（vite-plugin-monkey 改写为对 IIFE 参数 vue 的引用，
  // sandbox 包装函数局部可达，与 SFC 同源；不再经 globalThis.Vue——见 [[scriptcat-require-sandbox-scope]]）。
  const isPublic = type === 'public';
  // 1.x 行 1706：用 ref 持输入值（render 函数响应式）。
  const value = ref(String(options.initialValue || ''));
  let importedKey = null;
  try {
    // 1.x 行 1709-1748：showConfirmDialog + 自定义 render message（含说明 + Field 文本域）。
    // beforeClose 返回 false 阻止关闭（用于校验/导入），true 放行。
    const action = await showConfirmDialog({
      title: isPublic ? '粘贴接收方的加密密钥' : '需要对应的解密密钥',
      messageAlign: 'left',
      confirmButtonText: isPublic ? '使用此加密密钥' : '解密文件',
      cancelButtonText: '取消',
      closeOnClickOverlay: false,
      // 1.x 行 1715-1731：message 为 render 函数，h 构造说明 div + Field 文本域。
      message: () =>
        h('div', null, [
          h(
            'div',
            { style: 'padding:0 16px 8px;color:#646566;font-size:13px;line-height:1.6;' },
            isPublic
              ? '发给谁查看，就粘贴谁发给你的加密密钥。加密密钥可以分享，请不要让对方发送解密密钥。'
              : `${options.filename ? `文件“${options.filename}”无法用当前解密密钥打开。` : '当前解密密钥无法打开这个文件。'}请粘贴你自己的对应解密密钥备份；如果没有，请取消并让对方使用本页当前加密密钥重新导出。`
          ),
          h(Field, {
            modelValue: value.value,
            type: 'textarea',
            rows: 7,
            autosize: false,
            clearable: true,
            autocomplete: 'off',
            placeholder: isPublic ? '-----BEGIN PUBLIC KEY-----' : '-----BEGIN PRIVATE KEY-----',
            'onUpdate:modelValue': (input) => (value.value = String(input || '')),
          }),
        ]),
      // 1.x 行 1732-1747：beforeClose 校验空值/密钥格式，导入成功才放行。
      async beforeClose(action) {
        if (action !== 'confirm') return true;
        if (!value.value.trim()) {
          showToast(isPublic ? '请粘贴加密密钥' : '请粘贴解密密钥');
          return false;
        }
        try {
          importedKey = isPublic
            ? await importPublicKey(value.value.trim())
            : await importPrivateKey(value.value.trim());
          return true;
        } catch (error) {
          showToast(error.message || '密钥格式无效');
          return false;
        }
      },
    });
    // 1.x 行 1749：仅 confirm 才返回结果。
    if (action !== 'confirm') return null;
    return { pem: value.value.trim(), importedKey };
  } catch {
    // 1.x 行 1751-1753：overlay close / 异常 → 返回 null。
    return null;
  }
}

/**
 * 选择导出加密密钥：优先用当前 GM keypair 的公钥（弹"使用当前/粘贴接收方"二选一）；否则粘贴。
 * 取消粘贴抛 EXPORT_CANCELLED。对应 1.x selectScheduleExportPublicKey 行 1756-1776。
 * @returns {Promise<string>} PEM 公钥（用户取消则 reject EXPORT_CANCELLED）
 */
export async function selectScheduleExportPublicKey() {
  // 1.x 行 1757：读当前 keypair（GM 键名经 crypto/storageKey 锁定，C3）。
  const currentKeyPair = getGMValue(storageKey);
  if (currentKeyPair?.publicKey) {
    try {
      const action = await showConfirmDialog({
        title: '选择接收人的加密密钥',
        message:
          '使用当前加密密钥：只有本页当前解密密钥能打开。\n\n粘贴接收方加密密钥：把加密课表发给对方时使用。',
        messageAlign: 'left',
        confirmButtonText: '使用当前加密密钥',
        cancelButtonText: '粘贴接收方加密密钥',
        closeOnClickOverlay: false,
      });
      // 1.x 行 1768：confirm = 使用当前公钥。
      if (action === 'confirm') return currentKeyPair.publicKey;
    } catch {
      // 1.x 行 1769-1771：catch = 用户选粘贴（cancel/overlay）→ 落到下方粘贴分支。
    }
  }
  // 1.x 行 1773-1775：无当前密钥或用户选粘贴 → requestScheduleKey('public')；取消抛 EXPORT_CANCELLED。
  const provided = await requestScheduleKey('public');
  if (!provided) throw scheduleOperationError(EXPORT_CANCELLED, '已取消加密导出');
  return provided.pem;
}

/**
 * 课表导出前置：弹"加密/直接"二选一 → 直接导出返明文 JSON；加密导出走密钥协商+信封加密。
 * 对应 1.x prepareScheduleExport 行 1778-1800。
 * @param {object} schedule 课表对象（将经 crypto.normalize 规范化）
 * @returns {Promise<{encrypted:boolean, content:string}>} encrypted=true 为加密信封 JSON，false 为明文 schedule JSON
 */
export async function prepareScheduleExport(schedule) {
  // 1.x 行 1779：先规范化（保证 owner/meta/schemaVersion 等字段稳定）。
  const normalized = normalize(schedule);
  let encrypt = false;
  try {
    // 1.x 行 1782-1790：弹"加密/直接"确认框。confirm=加密导出；cancel=直接导出；overlay 不关（closeOnClickOverlay:false）。
    const action = await showConfirmDialog({
      title: '导出课表 JSON',
      message: '直接导出可被任何拿到文件的人查看；加密导出只有持有对应解密密钥的人可以打开。',
      messageAlign: 'left',
      confirmButtonText: '加密导出',
      cancelButtonText: '直接导出',
      closeOnClickOverlay: false,
    });
    encrypt = action === 'confirm';
  } catch {
    // 1.x 行 1791-1793：catch（用户按"直接导出"cancel）→ encrypt 维持 false，落直接导出分支。
  }
  if (!encrypt) {
    // 1.x 行 1795：直接导出 = 明文 JSON。
    return { encrypted: false, content: JSON.stringify(normalized) };
  }
  // 1.x 行 1797-1799：加密导出 = 选公钥 → 信封加密 → JSON 化信封。
  const publicKey = await selectScheduleExportPublicKey();
  const envelope = await encryptSchedule(normalized, publicKey);
  return { encrypted: true, content: JSON.stringify(envelope) };
}
