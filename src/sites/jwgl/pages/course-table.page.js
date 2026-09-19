/**
 * jwgl/pages/course-table.page — 课表内容页（美化重写 + 导出栏注入）
 * 对应 1.x：Better NXU.user.js 行 2499-2502/2584-2587/2381-2384（三形态命中 courseTableForStd.action &
 *           method=courseTable 时 `AddVant(); jwglCourseBeautify();`）+ 行 3416-3548（jwglCourseBeautify 主体）
 * 依赖：sites/jwgl/components/course-table/course-beautify（beautifyJwglCourseTable 主入口，内含 installCourseToolbar 导出栏）、
 *       utils/console
 * 入口/被谁调用：router 命中 jwgl/course-table.page.js → main.js 调 register()
 *
 * 1.x `AddVant()`（行 147-155）装整包 Vant + css 到 unsafeWindow.vant，供 jwglCourseBeautify 内联模板的 van-button 与
 *  showNotify/css 用。2.0 导出栏 SFC 化（CourseToolbar.vue）+ course-beautify/course-reader 经 npm 按需 import
 *  `van-button`/`showNotify`（Vant 样式由 mountVueApp 按需注入），不再需整包 Vant 全局注入——故本 page 直接调
 *  beautifyJwglCourseTable（其 installCourseToolbar 内挂 CourseToolbar.vue 已按需引 Vant）。与 1.x `AddVant()` 等价
 *  转为"按需 import"，无 unsafeWindow.vant 全局依赖（B1 决策，SFC 化按需 import 路线）。
 *
 * 验收对齐（03 B6 验收 4/7/8）：课表美化重写 + 工具栏导出 图片/JSON/Excel 与 1.x 一致；全原生 DOM 无 jQuery；
 *  course-beautify/course-reader 是直接操作页面 DOM 的模块（非 Vue SFC），CourseToolbar.vue 处理 H 导出栏。
 */
import { beautifyJwglCourseTable } from '../components/course-table/course-beautify.js';
import { MyConsole } from '../../../utils/console.js';

const console = MyConsole('[jwgl CourseTable]');

/**
 * 课表内容页入口：美化重写单元格并注入导出栏。1.x `AddVant(); jwglCourseBeautify();` 等价。
 */
export async function register() {
  console('进入课表内容页');
  await beautifyJwglCourseTable();
}
