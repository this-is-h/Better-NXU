/**
 * jwgl/pages/home.page — 教务主页（自定义菜单注入：Jwgl.customMenu 多选）
 * 对应 1.x：Better NXU.user.js 行 3067-3103（jwglMain）
 * 依赖：config/gm-store（getGMValue Jwgl.customMenu）、composables/use-wait-or-toast（等待菜单失败转 toast）、utils/errors
 *       （MENU_TARGET_MISSING + scheduleOperationError）、libraries/notification（toast）、utils/console
 * 入口/被谁调用：router 命中 jwgl/home.page.js → main.js 调 register()
 *
 * 1.x 行 2491-2494/2576-2579/2373-2376 三形态命中后均 `Basic(); jwglMain();`。
 * 1.x jwglMain 已用 document.querySelectorAll 原生 DOM（行 3073），无 jQuery，2.0 逐字迁。
 * addMenu 内嵌函数（1.x 行 3072-3089）迁为本模块私有 addMenu。
 *
 * 与 1.x 行为等价点（C5，逐字对齐行 3067-3103）：
 *  - customMenu 为空数组无操作（1.x 行 3070）
 *  - addMenu(menu,menu_dd,href,content)：取第 menu 个 layui-nav-item.menu-li → 第 menu_dd 个 dd.menu-dd 前插入新 dd
 *    link 用 layuimini-href + 教务页 webvpn 注入脚本 onclick（1.x 行 3082-3088 一字不动）
 *  - waitForElement 菜单容器（15s+textContent 非空，1.x 行 3092-3095）后按 customMenu 含"全部学期成绩"addMenu(1,4,...)
 *  - 失败 toast 'warning'（1.x 行 3099-3101；waitOrToast 等价但此处保留 1.x 即 errors.message 兜底文案）
 *
 * 验收对齐（03 B6 验收 2）：主页菜单注入"全部学期成绩"按 Jwgl.customMenu 多选。
 */
import { getGMValue } from '../../../config/gm-store.js';
import { waitOrToast } from '../../../composables/use-wait-or-toast.js';
import { scheduleOperationError } from '../../../utils/errors.js';
import { toast } from '../../../libraries/notification.js';
import { MyConsole } from '../../../utils/console.js';

const console = MyConsole('[教务菜单]');

/**
 * 在教务主页左侧导航注入自定义菜单项。1.x addMenu 行 3072-3089 等价。
 * @param {number} menu 菜单容器索引（menu-li 数组的第几个）
 * @param {number} menu_dd dd.menu-dd 的插入位置索引
 * @param {string} href iframe 内跳转链接（layuimini-href）
 * @param {string} content 菜单项文案
 */
function addMenu(menu, menu_dd, href, content) {
  // 1.x 行 3073-3075：原生 querySelectorAll 取容器 / 目标 dd / dl 列表。
  const menuCourseManage = document.querySelectorAll(
    'div.layui-side.layui-bg-black.layuimini-menu-left li.layui-nav-item.menu-li'
  );
  const menuContainer = menuCourseManage[menu];
  const menuDdMyGrade = menuContainer?.querySelectorAll('dd.menu-dd')[menu_dd];
  const menuList = menuContainer?.querySelector('dl');
  // 1.x 行 3077-3079：结构缺失抛 MENU_TARGET_MISSING（统一错误码入口）。
  if (!menuContainer || !menuList) {
    throw scheduleOperationError('MENU_TARGET_MISSING', '教务菜单结构已变化，未添加自定义入口');
  }
  const menu_dd_all_grade = document.createElement('dd');
  menu_dd_all_grade.className = 'menu-dd';
  // 1.x 行 3082-3087：内联 onclick 走教务 webvpn 注入脚本模板（layuimini-href + target=_self），一字不动。
  menu_dd_all_grade.innerHTML = `
    <a href="javascript:this.top.vpn_inject_script(this);vpn_eval((function () { ; }).toString().slice(14, -2))" layuimini-href="${href}" target="_self">
      <i class="fa fa-file-text-o"></i>
      <span class="layui-left-nav">${content}</span>
    </a>
  `;
  menuList.insertBefore(menu_dd_all_grade, menuDdMyGrade || null);
}

/**
 * 教务主页入口：按 Jwgl.customMenu 注入自定义菜单。对应 1.x jwglMain 行 3067-3103。
 */
export async function register() {
  console('进入主页');
  const jwglCustomMenu = getGMValue('Jwgl.customMenu');
  console('当前启用的自定义菜单', jwglCustomMenu, 'debug');
  if (jwglCustomMenu.length === 0) return;
  // 1.x 行 3092-3095：等待左侧菜单容器渲染并文本非空。
  const ready = await waitOrToast(
    'div.layui-side.layui-bg-black.layuimini-menu-left li.layui-nav-item.menu-li',
    {
      timeout: 15000,
      predicate: (element) => element.textContent.trim().length > 0,
      level: 'warning',
      duration: 4,
    }
  );
  if (!ready) return;
  try {
    // 1.x 行 3096-3098：含"全部学期成绩"时在第 1 个容器第 4 个 dd 前插入该项。
    if (jwglCustomMenu.indexOf('全部学期成绩') !== -1) {
      addMenu(1, 4, 'personGrade.action?method=historyCourseGrade', '全部学期成绩');
    }
  } catch (error) {
    // 结构缺失仍由页面专属逻辑提示，避免把业务错误伪装成等待错误。
    toast('warning', error.message || '教务菜单加载超时，已跳过自定义菜单', 4);
  }
}
