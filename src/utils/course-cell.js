/**
 * 课表单元格解析（jwgl beautify/export 共用 parser）
 * 对应 1.x：Better NXU.user.js 行 395-397（JWGL_COURSE_TEXT_FILTERS）、3132-3137（filterJwglCourseText）、
 *          3282-3330（jwglExportCourses 内 $("td > div").each 单元格分组）、3498-3545（jwglCourseBeautify 内 $("td > div").each 单元格分组）
 * 依赖：无 GM 依赖、无 UI 依赖（纯 DOM 文本解析工具）
 * 入口/被谁调用：B6 sites/jwgl/components/course-table/course-beautify.js 与 course-reader.js 共用（01 §8.2-5、B6 验收 5）。
 *
 * 抽取动机（02 §3 禁 pages 互相 import / 01 §8.2-5）：
 *  1.x 在 jwglCourseBeautify（行 3498-3545）与 jwglExportCourses（行 3282-3330）各粘贴一份近乎相同的
 *  "content = div.attr('title').split(...) → splice 占位 → 4 元组分组 → map(filterJwglCourseText)" 解析。
 *  2.0 抽 parseCourseCellFromJwgl 一次，beautify 与 export 各自 call（消除重复）。需求1 弃 jQuery：入参取原生
 *  Element（1.x 用 $(this)，2.0 用 document.querySelectorAll('#td > div') 直接给 Element），不依赖页面 jQuery。
 *
 * 占位差异（逐项对照 1.x 两处实际值，不强行统一以免破坏渲染/导出语义）：
 *  - export 段（行 3293）：content.length==3 时 splice(1, 0, "未定")
 *  - beautify 段（行 3506）：content.length==3 时 splice(1, 0, "空")
 *  两处其余 split 正则与 4 元组分组循环一字不差。故抽 missingPlaceholder 参数默认按调用方各自传入，
 *  调用方须显式传（beautify 传 "空"、export 传 "未定"），保留 1.x 两处各自占位语义。
 *
 * 不在本模块的部分（属调用方各自专属，避免过抽）：
 *  - 单元格定位（number=节次、day=列、duration=rowspan）——只用 export 需要（beautify 不用），保留在 export 读取器。
 *  - entries.push / jwglClass 渲染 —— export/beautify 各自专属输出形态。
 *  唯一也重复的"补全相邻组教师课程名 unshift"逻辑（beautify 行 3526-3529、export 行 3304-3311 一字不差）
 *  单独抽 normalizeCellGroups 供两边复用（见下）。
 */

/**
 * 教务课表单元格文本规范化过滤器。1.x 行 395-397 逐字迁移（当前仅一条：折叠 2+ 连续逗号为空）。
 * 用 reduce 串接，便于将来在此数组追加 filter（不改调用方）。
 */
export const JWGL_COURSE_TEXT_FILTERS = [(text) => text.replace(/,{2,}/g, '')];

/**
 * 对单元格内文本逐条套用 JWGL_COURSE_TEXT_FILTERS。1.x 行 3132-3137 逐字迁移。
 * @param {*} value
 * @returns {string}
 */
export function filterJwglCourseText(value) {
  return JWGL_COURSE_TEXT_FILTERS.reduce((text, filter) => filter(text), String(value ?? ''));
}

/**
 * 解析单个教务课表单元格（td > div 的 title 属性）为规范化后的"课程组件数组"。
 * 1.x export 段 3282-3303 与 beautify 段 3498-3516 公共部分逐字抽取：
 *  1. 取 div 元素的 title 属性原文（1.x 行 3291/3503）
 *  2. 按 `\n` 或非换行处 2+ 连续空白拆分（1.x 行 3292/3505 同正则）
 *  3. 段数为 3 时在索引 1 处插入占位符（export "未定" / beautify "空"，由参数传，1.x 行 3293/3506）
 *  4. 按 4 元组步进分组：遇纯"周次范围"行则只取 2 元并回退 2（与下一组拼为 4），否则取满 4（1.x 行 3294-3302/3507-3515）
 *  5. 每组每元素经 filterJwglCourseText 规范化（1.x 行 3303/3516）
 *
 * 返回的 content_array 仅完成"分组 + 文本规范化"，未做"相邻组教师/课程名补全（unshift prev）"——
 * 该补全见 normalizeCellGroups（两端一字不差，单独抽），调用方须显式再调一次以与 1.x 行为等价。
 *
 * @param {Element} el - 原生 td > div 元素（须有 title 属性）
 * @param {{missingPlaceholder?:string}} [options] - 段数为 3 时的占位文案（export 传 "未定"、beautify 传 "空"）
 * @returns {string[][]} 分组并规范化后的 content_array（每组 2 或 4 个字符串元素）
 */
export function parseCourseCellFromJwgl(el, options = {}) {
  const missingPlaceholder = options.missingPlaceholder ?? '未定';
  // 1.x 行 3291/3503：取 title 原文（1.x 用 div.attr("title")，2.0 用原生 getAttribute，弃 jQuery）。
  let content = el?.getAttribute('title') || '';
  // 1.x 行 3292/3505：同款 split 正则（一字不差）。
  content = content.split(/\n|(?<!\n)\s{2,}?(?!\n)/);
  // 1.x 行 3293/3506：段数为 3 时插入占位（export "未定" / beautify "空"）。
  if (content.length === 3) content.splice(1, 0, missingPlaceholder);
  // 1.x 行 3294-3302/3507-3515：4 元组步进分组。
  const contentArray = [];
  for (let i = 0; i < content.length; i += 4) {
    if (/^[0-9\-()[\]单双周]*$/.test(content[i])) {
      contentArray.push(content.slice(i, i + 2));
      i -= 2;
    } else {
      contentArray.push(content.slice(i, i + 4));
    }
  }
  // 1.x 行 3303/3516：每组每元素经 filterJwglCourseText 规范化。
  return contentArray.map((items) => items.map(filterJwglCourseText));
}

/**
 * 就地补全相邻组的教师/课程名：当某组只有 2 元且首元为纯"周次范围"串时，
 * 说明该组缺教师/课程名，从前一组借末两元 unshift 到本组首位（1.x beautify 行 3526-3529、export 行 3304-3311 一字不差）。
 * 原地修改 contentArray 并返回（与 1.x 行为一致：若本组借了 prev，next 组若同样缺则再借本组——故须从前往后顺次依赖）。
 * @param {string[][]} contentArray - parseCourseCellFromJwgl 返回的数组
 * @returns {string[][]} 就地补全后的同一数组（便于链式使用）
 */
export function normalizeCellGroups(contentArray) {
  for (let i = 0; i < contentArray.length; i++) {
    if (contentArray[i].length === 2 && /^[0-9\-()[\]单双周]*$/.test(contentArray[i][0])) {
      // 从前一组借末两元（[1]=课程名、[0]=教师名）补到本组首位（与 1.x unshift 顺序一致）。
      contentArray[i].unshift(contentArray[i - 1][1]);
      contentArray[i].unshift(contentArray[i - 1][0]);
    }
  }
  return contentArray;
}
