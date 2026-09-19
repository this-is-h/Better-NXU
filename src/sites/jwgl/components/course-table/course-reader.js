/**
 * jwgl/components/course-table/course-reader — 教务课表读取器 + 导出栏挂载（原生 DOM，弃 jQuery）
 * 对应 1.x：Better NXU.user.js 行 3139-3414（jwglExportCourses）+ 行 3267-3330（hExportData 读取器含
 *           parseRangeString / getAccurateColumnIndex / $("td > div").each 单元格遍历）
 * 依赖：utils/course-cell（parseCourseCellFromJwgl / normalizeCellGroups / filterJwglCourseText）、
 *       utils/file（downloadTextFile）、utils/snapdom（WebVPN 图片兼容）、#gm（unsafeWindow 取 @require 注入的 snapdom/XLSX 全局）、
 *       config/gm-store、context（getContext 判 WebVPN 图片兼容）、schedule（buildFromJwgl / buildJwglExcelTables）、
 *       composables/use-schedule-export（prepareScheduleExport 密钥协商加密）、composables/use-vue-app（mountVueApp 挂 SFC）、
 *       sites/jwgl/components/course-table/CourseToolbar.vue（H 导出栏 SFC，图片/JSON/Excel）、libraries/notification（toast/debug 日志）、utils/console
 * 入口/被谁调用：sites/jwgl/components/course-table/course-beautify.js（beautifyJwglCourseTable 先调 installCourseToolbar = 1.x 行 3432 jwglExportCourses）
 *
 * **需求1 弃 jQuery（B6 验收 7/8）**：1.x 行 3282-3330 的 `$("td > div").each(function(){ var div=$(this); div[0]... })`
 *  2.0 改 `document.querySelectorAll('td > div').forEach((div)=>{ ... })`，逐字段 `div[0]`→`div`、`$(this).attr('title')`
 *  →`div.getAttribute('title')`（其实经 parseCourseCellFromJwgl 统一取）、`div[0].parentElement`→`div.parentElement`、
 *  `div[0].parentElement.getAttribute('rowspan')`→原生 getAttribute。读取行为与 1.x 等价（B6 风险对策②③④）。
 *
 * 全局库取值（关键）：snapdom / XLSX 在 1.x 经 @require 注入页面 window，IIFE 闭包内 bare ref 能解析（1.x 行 3173/3374）。
 *  2.0 ESM 中 bare `snapdom`/`XLSX` 会被 rolldown 当未定义模块报模块解析错。故经官方 ESM `unsafeWindow`
 *  取页面全局（@require bridge 注入其上），等价 1.x 行为。
 *
 * 与 1.x 行为等价点（C5，逐字对齐行 3139-3414）：
 *  - 无 table 直接 return（1.x 行 3139-3143）
 *  - isWebvpn 判定：1.x 行 3145-3148 `var isWebvpn=true; if(Host=='jwgl.nxu.edu.cn'||Host.indexOf('202.201.128.234')!=-1) isWebvpn=false`
 *    → 2.0 用 ctx：直连 jwgl.nxu.edu.cn 或 isJwglIp 为 false（非 webvpn）；webvpn 代理启用计算样式内联兼容
 *  - 挂 #h-export 容器于 table 前（1.x 行 3149-3152；table.before(div) → insertAdjacentElement('beforebegin')）
 *  - 渲染导出栏（1.x 用 Vue.createApp({template}).use(vant).mount，2.0 改 mountVueApp(CourseToolbar.vue) SFC + prop isWebvpn）
 *  - hExportImage: snapdom.download(table, {format:'png',filename:与 JSON/Excel 同源,scale:2.5,quality:1}) + showNotify（1.x 行 3168-3185）
 *  - hExportData: 遍历 td>div → entries[] → buildFromJwgl(entries, ownerName) → JSON.stringify（1.x 行 3187-3333）
 *  - hExportJson: prepareScheduleExport → downloadTextFile + showNotify；EXPORT_CANCELLED 静默（1.x 行 3335-3359）
 *  - hExportExcel: jwglExcelExporting 重入锁 + buildJwglExcelTables → XLSX book → writeFile + showNotify（1.x 行 3361-3412）
 */
import { parseCourseCellFromJwgl, normalizeCellGroups } from '../../../../utils/course-cell.js';
import { downloadTextFile } from '../../../../utils/file.js';
import { downloadSnapdomImage } from '../../../../utils/snapdom.js';
import { unsafeWindow as grantedUnsafeWindow } from '#gm';
import { getContext } from '../../../../context.js';
import { buildFromJwgl, buildJwglExcelTables } from '../../../../schedule/index.js';
import { prepareScheduleExport } from '../../../../composables/use-schedule-export.js';
import { showNotify } from 'vant';
import { mountVueApp } from '../../../../composables/use-vue-app.js';
import CourseToolbar from './CourseToolbar.vue';
import { MyConsole } from '../../../../utils/console.js';

// 带前缀的 console：tag=[教务课表]，函数体内 12 处 console('[图片/JSON/Excel 导出] ...') 均走此工厂
// （与 notification.js / hall-injector.js / dom.js 同款写法）。误删定义会让 console 落到原生全局
// console 对象（非函数），导出触发首句 console(...) 即抛 TypeError: console is not a function。
const console = MyConsole('[教务课表]');
const pageWindow = grantedUnsafeWindow ?? window;

function getJwglExportFilename(schedule, extension) {
  const ownerName = (schedule?.owner?.name || '未命名用户').replace(/[\\/:*?"<>|]/g, '_');
  return `${ownerName} - 教务系统课表.${extension}`;
}

// 中文数字→阿拉伯数字映射（1.x 行 3268-3281，用于节次中文转数）。
const NUMBER_JSON = {
  一: 1,
  二: 2,
  三: 3,
  四: 4,
  五: 5,
  六: 6,
  七: 7,
  八: 8,
  九: 9,
  十: 10,
  十一: 11,
  十二: 12,
};

/**
 * 兼容区间、离散周次与单双周文本 → 周次集合。对应 1.x 行 3189-3208 parseRangeString。
 * `1-3`→{1,2,3}；`单` 过滤奇数；`双` 过滤偶数；其余落字面数字。
 * @param {string} str 原始周次文本
 * @param {string|null} filterType '单'/'双'/null
 * @returns {Set<number>} 周次集合（已过滤非正）
 */
export function parseRangeString(str, filterType = null) {
  let result = [];
  const ranges = String(str || '').match(/\d+\s*-\s*\d+|\d+/g) || [];
  ranges.forEach((token) => {
    const values = token.split('-').map(Number);
    if (values.length === 2) {
      for (let week = values[0]; week <= values[1]; week++) result.push(week);
    } else if (Number.isFinite(values[0])) {
      result.push(values[0]);
    }
  });
  if (filterType === '单') {
    result = result.filter((num) => num % 2 !== 0);
  } else if (filterType === '双') {
    result = result.filter((num) => num % 2 === 0);
  }
  return new Set(result.filter((week) => week > 0));
}

/**
 * 计算单元格在含跨行/跨列合并的表中真实列索引。对应 1.x 行 3210-3265 getAccurateColumnIndex。
 * 因教务课表 td>div 所在 td 可能受上方行 rowspan 占用，cell.cellIndex 不等于实际可见列；
 * 本函数遍历所有行模拟占用，定位 cell 真实起始列。
 * @param {HTMLTableCellElement} cell 目标单元格（td）
 * @returns {number} 实际列索引（1~7 周几；失败回落 cell.cellIndex）
 */
export function getAccurateColumnIndex(cell) {
  const row = cell.parentElement;
  const tbody = row.parentElement;
  const rows = Array.from(tbody.rows);
  const rowIndex = row.rowIndex;
  const colOccupied = [];
  for (let i = 0; i < rows.length; i++) {
    const currentRow = rows[i];
    const cells = Array.from(currentRow.cells);
    if (!colOccupied[i]) colOccupied[i] = [];
    let colIndex = 0;
    for (let j = 0; j < cells.length; j++) {
      const currentCell = cells[j];
      while (colOccupied[i][colIndex]) colIndex++;
      if (i === rowIndex && currentCell === cell) {
        return colIndex;
      }
      const rowspan = currentCell.rowSpan || 1;
      const colspan = currentCell.colSpan || 1;
      for (let k = 0; k < rowspan; k++) {
        if (!colOccupied[i + k]) colOccupied[i + k] = [];
        for (let l = 0; l < colspan; l++) {
          colOccupied[i + k][colIndex + l] = true;
        }
      }
      colIndex += colspan;
    }
  }
  // 1.x 行 3264：理论上不应到达；回落 cell.cellIndex 作后备。
  return cell.cellIndex;
}

/**
 * 读取当前页课表生成 schedule JSON 字符串。对应 1.x hExportData 行 3187-3333。
 * 遍历每个 td>div（title）→ 解析为 entries（name/teacher/room/weeks/weekday/periods）→ buildFromJwgl。
 * @returns {string} schedule JSON 字符串
 */
export function readJwglTableToJson() {
  const entries = [];
  // 1.x 行 3282：$("td > div").each(...)。原生 forEach 替；div 为原生 Element（1.x $(this)[0]）。
  document.querySelectorAll('td > div').forEach((div) => {
    // 1.x 行 3284-3285：取同 tr 第一个 td 内的中文节次数字。
    const numberMatch = div.parentElement.parentElement
      .querySelector('td')
      ?.innerHTML.match(/[一二三四五六七八九十][一二]?/);
    if (!numberMatch) return;
    let number = numberMatch[0];
    number = NUMBER_JSON[number];
    // 1.x 行 3289：列索引（周一=1…周日=7）。
    const day = getAccurateColumnIndex(div.parentElement);
    // 1.x 行 3290：rowspan 即课时长（节数）。
    const duration = parseInt(div.parentElement.getAttribute('rowspan'), 10) || 1;
    // 1.x 行 3291-3303：解析 title → 文本分段（1.x div.attr('title').split/splice/分组/filter）。
    //  复用 utils/course-cell.parseCourseCellFromJwgl（B6 验收 5：beautify 与 export 共用同一 parser）。
    //  export 段 missingPlaceholder='未定'（1.x 行 3293，与 beautify '空' 不同由参数传）。
    const content_array = parseCourseCellFromJwgl(div, { missingPlaceholder: '未定' });
    // 1.x 行 3304-3311：相邻组缺教师/课程名补全（与 beautify 段一字不差，抽 normalizeCellGroups 复用）。
    normalizeCellGroups(content_array);
    for (let i = 0; i < content_array.length; i++) {
      const weekText = content_array[i][2] || '';
      const variation = weekText.match(/[单双]/)?.[0] || null;
      const hasRole = /\(外聘|助理|教授\)|\(讲师\)|\(\)/.test(content_array[i][0]);
      const name = content_array.length > 1 || hasRole ? content_array[i][1] : content_array[i][0];
      const teacher = content_array.length > 1 || hasRole ? content_array[i][0] : content_array[i][1];
      const periods = Array.from({ length: duration }, (_, index) => number + index).filter(
        (period) => period >= 1 && period <= 10
      );
      const weeks = [...parseRangeString(weekText, variation)];
      if (!name || !day || !periods.length || !weeks.length) continue;
      entries.push({
        name,
        teacher,
        room: content_array[i][3] || '未定',
        weeks,
        weekday: day,
        periods,
      });
    }
  });
  // 1.x 行 3331-3332：顶部导航项名（教务登录后右上为学生姓名）做 owner。
  const ownerName =
    window.top.document.querySelector('.layui-nav-item.layuimini-setting a')?.innerText?.trim() || '';
  return JSON.stringify(buildFromJwgl(entries, ownerName));
}

/**
 * 生成课表图片（snapdom 截 table）。对应 1.x hExportImage 行 3168-3185。
 * 直连使用 snapdom 原生路径；WebVPN 代理使用计算样式内联及 foreignObject 大小写兼容。
 */
async function hExportImage({ fixWebVpn = false } = {}) {
  console('[图片导出] 开始生成课表图片', '', 'info');
  showNotify({ type: 'primary', message: '正在生成课表图片，请稍候', duration: 0 });
  try {
    const snapdom = pageWindow.snapdom;
    const schedule = JSON.parse(readJwglTableToJson());
    // 1.x 行 3173-3178：snapdom.download(table, {format,filename,scale:2.5,quality:1})。
    await downloadSnapdomImage({
      snapdom,
      target: document.querySelector('table'),
      options: {
        format: 'png',
        filename: getJwglExportFilename(schedule, 'png'),
        scale: 2.5,
        quality: 1,
      },
      fixWebVpn,
      pageWindow,
    });
    console('[图片导出] 导出完成', '', 'info');
    showNotify({ type: 'success', message: '课表图片已导出' });
  } catch (error) {
    console('[图片导出] 导出失败', error, 'error');
    showNotify({ type: 'danger', message: error.message || '课表图片导出失败' });
  }
}

/**
 * 导出课表 JSON（密钥协商加密分支）。对应 1.x hExportJson 行 3335-3359。
 */
async function hExportJson() {
  console('[JSON 导出] 开始解析当前课表', '', 'info');
  try {
    const schedule = JSON.parse(readJwglTableToJson());
    console(
      '[JSON 导出] 课表解析完成',
      { courseCount: schedule.courses.length, lessonCount: schedule.lessons.length },
      'debug'
    );
    // 1.x 行 3344：prepareScheduleExport 选 加密/直接 导出（密钥协商 Vant 弹窗）。
    const result = await prepareScheduleExport(schedule);
    await downloadTextFile(result.content, getJwglExportFilename(schedule, 'json'));
    console('[JSON 导出] 导出完成', { encrypted: result.encrypted }, 'info');
    showNotify({
      type: 'success',
      message: result.encrypted ? '加密课表已导出' : '课表 JSON 已导出',
    });
  } catch (error) {
    // 1.x 行 3352-3355：用户取消加密导出（EXPORT_CANCELLED）静默返回。
    if (error.code === 'EXPORT_CANCELLED') {
      console('[JSON 导出] 用户取消导出', '', 'info');
      return;
    }
    console('[JSON 导出] 导出失败', error, 'error');
    showNotify({ type: 'danger', message: error.message || '课表导出失败' });
  }
}

// 重入锁：防止 Excel 生成中重复点击（1.x 行 3361 jwglExcelExporting）。
let jwglExcelExporting = false;

/**
 * 导出课表 Excel（XLSX）。对应 1.x hExportExcel 行 3361-3412。
 */
async function hExportExcel() {
  if (jwglExcelExporting) {
    console('[Excel 导出] 忽略重复点击', '已有导出任务正在执行', 'warn');
    showNotify({ type: 'warning', message: '课表 Excel 正在生成，请稍候' });
    return;
  }
  jwglExcelExporting = true;
  console('[Excel 导出] 开始生成工作簿', '', 'info');
  showNotify({ type: 'primary', message: '正在生成课表 Excel' });
  try {
    const XLSX = pageWindow.XLSX;
    const schedule = JSON.parse(readJwglTableToJson());
    const tables = buildJwglExcelTables(schedule);
    // 1.x 行 3374-3395：构造 workbook + 两 sheet + 单元格样式 + 列宽/行高/自动筛选。
    const workbook = XLSX.utils.book_new();
    const timetableSheet = XLSX.utils.aoa_to_sheet(tables.timetableRows);
    const detailSheet = XLSX.utils.aoa_to_sheet(tables.detailRows);
    const baseCellStyle = {
      alignment: { wrapText: true, vertical: 'top' },
      border: {
        top: { style: 'thin', color: { rgb: 'D9E1F2' } },
        bottom: { style: 'thin', color: { rgb: 'D9E1F2' } },
        left: { style: 'thin', color: { rgb: 'D9E1F2' } },
        right: { style: 'thin', color: { rgb: 'D9E1F2' } },
      },
    };
    [timetableSheet, detailSheet].forEach((sheet) =>
      Object.keys(sheet).forEach((address) => {
        if (!address.startsWith('!')) sheet[address].s = baseCellStyle;
      })
    );
    timetableSheet['!cols'] = [{ wch: 18 }, ...Array.from({ length: 7 }, () => ({ wch: 24 }))];
    timetableSheet['!rows'] = [{ hpt: 24 }, ...Array.from({ length: 5 }, () => ({ hpt: 100 }))];
    detailSheet['!cols'] = [
      { wch: 28 },
      { wch: 18 },
      { wch: 20 },
      { wch: 10 },
      { wch: 10 },
      { wch: 16 },
      { wch: 24 },
    ];
    detailSheet['!autofilter'] = { ref: `A1:G${tables.detailRows.length}` };
    XLSX.utils.book_append_sheet(workbook, timetableSheet, '课表');
    XLSX.utils.book_append_sheet(workbook, detailSheet, '课程明细');
    const filename = getJwglExportFilename(schedule, 'xlsx');
    // 1.x 行 3400：Promise.resolve(XLSX.writeFile) 包裹使其 await 友好（writeFile 同步返回 void）。
    await Promise.resolve(XLSX.writeFile(workbook, filename));
    console(
      '[Excel 导出] 导出完成',
      { arrangementCount: tables.arrangementCount, worksheetCount: workbook.SheetNames.length },
      'info'
    );
    showNotify({ type: 'success', message: '课表 Excel 已导出' });
  } catch (error) {
    console('[Excel 导出] 导出失败', error, 'error');
    showNotify({ type: 'danger', message: error.message || '课表 Excel 导出失败' });
  } finally {
    jwglExcelExporting = false;
  }
}

/**
 * 在课表上方注入 H 导出栏（图片/JSON/Excel）并挂载导出 handler。对应 1.x jwglExportCourses 行 3139-3414。
 * 无 table 时直接返回（1.x 行 3140-3143）。WebVPN 环境保留图片按钮并启用兼容捕获。
 */
export function installCourseToolbar() {
  // 1.x 行 3140-3143：无 table 不注入。
  if (!document.querySelector('table')) return;

  const ctx = getContext();
  // 1.x 行 3145-3148：isWebvpn 判定。直连 jwgl.nxu.edu.cn 或 IP :8080~3 = false（可截图）；其余（webvpn 代理）= true。
  const isWebvpn = !(ctx.host === 'jwgl.nxu.edu.cn' || ctx.isJwglIp);

  // 1.x 行 3149-3152：在 table 前插入 #h-export 容器（table.before(div) → insertAdjacentElement beforebegin）。
  let container = document.getElementById('h-export');
  if (!container) {
    container = document.createElement('div');
    container.id = 'h-export';
    container.style.cssText = 'width:100%;padding:1em 2em;box-sizing:border-box;';
    document.querySelector('table').insertAdjacentElement('beforebegin', container);
  }

  // 1.x 行 3301-3309：挂 1.x 内联模板导出栏（Vue.createApp({template}).use(vant).mount('#h-export')）。
  //  2.0 改 mountVueApp(CourseToolbar.vue) SFC——按需 import van-button + showNotify。
  mountVueApp({
    root: CourseToolbar,
    id: 'h-export',
    rootProps: {
      onExportImage: () => hExportImage({ fixWebVpn: isWebvpn }),
      onExportJson: hExportJson,
      onExportExcel: hExportExcel,
    },
  });
}
