/**
 * jwgl/components/course-table/course-beautify — 教务课表单元格美化重写（原生 DOM，弃 jQuery）
 * 对应 1.x：Better NXU.user.js 行 3416-3548（jwglCourseBeautify）
 * 依赖：utils/course-cell（parseCourseCellFromJwgl / normalizeCellGroups / filterJwglCourseText）、
 *       #gm（GM_addStyle / unsafeWindow）、config/gm-store（getGMValue Jwgl.courseBeautify）、
 *       sites/jwgl/components/course-table/course-reader（installCourseToolbar = 1.x jwglExportCourses 注入导出栏）、utils/console
 * 入口/被谁调用：sites/jwgl/pages/course-table.page.js（命中 courseTable 页时调 beautifyJwglCourseTable）
 *
 * **需求1 弃 jQuery（B6 验收 7/8）**：1.x 行 3492-3545 全程用页面自带 jQuery（`$(this)`/`$("table")`/`.each`/`.attr`/
 *  `.css`/`.html`/`.append`）依赖教务页面 jQuery。2.0 改原生 DOM：`querySelectorAll` 替 `$`、`forEach` 替 `.each`、
 *  `getAttribute` 替 `.attr('title')`、`style.setProperty` 替 `.css(k,v)`、`classList.add` 替 `.addClass`；课程数据
 *  通过 createElement/textContent 构建节点，不再拼接进 HTML，避免页面数据进入脚本执行上下文。
 *
 * 1.x `$("body").html(html.replace(".noneprint{...}",""))` 全 body 序列化 reparse 的副作用式写法（风险点），
 *  2.0 改**精确改目标 `<style>` 节点**：定位含该规则的 `<style>`，用 textContent 字符串替换去该规则再回写，
 *  不动 body 主体 → 不丢已注入的 Vue app 挂载点与事件（B6 风险对策①）。
 *
 * 与 1.x 行为等价点（C5）：
 *  - 未启用美化或无 table 时直接通知父 iframe 校准高度
 *  - 完成后 postMessage COURSE_BEAUTIFY_CHANGED 通知父 iframe resize
 *  - 注入导出栏（先调 installCourseToolbar，1.x 行 3432 jwglExportCourses）
 *  - createJwglClassNode(content_array, mode)：按 mode 渲染教师/课程块（1.x 行 3440-3465）
 *  - GM_addStyle 注入优化样式（1.x 行 3467-3491；注意 1.x 该字符串含 `<style>` 包裹标签，2.0 GM_addStyle 不需标签——见下注释）
 *  - 区分相邻组同课程名是否加分隔线 div + 单 group 时外聘/讲师关键字教师课程名互换（1.x 行 3523-3543）
 */
import { parseCourseCellFromJwgl, normalizeCellGroups } from '../../../../utils/course-cell.js';
import { GM_addStyle, unsafeWindow as grantedUnsafeWindow } from '#gm';
import { getGMValue } from '../../../../config/gm-store.js';
import { installCourseToolbar } from './course-reader.js';
import { MyConsole } from '../../../../utils/console.js';

const console = MyConsole('[教务课表美化]');
const pageWindow = grantedUnsafeWindow ?? window;

function notifyCourseBeautifyChanged() {
  pageWindow.parent.postMessage({ type: 'COURSE_BEAUTIFY_CHANGED' }, '*');
}

/**
 * 渲染单个课程块 DOM。对应 1.x jwglClass 行 3440-3465。
 *  - mode==0：含课程名 subject + 教师/周次/教室（"换组分隔后第一组"形态）
 *  - mode>0：仅教师/周次/教室（首组无 subject，因同课程名沿用上一组）
 *  - mode==-1：含 subject + 教师/周次/教室，且外聘/讲师关键字时教师/课程名互换由调用方已处理
 * @param {string[]} content_array 单个课程组四元组 [教师, 课程名, 周次, 教室]（或两元组经补全后）
 * @param {number} mode -1=正常单组, 0=分隔后的首组, >0=沿用课程名的后续组
 * @returns {HTMLDivElement} 课程块节点
 */
function createJwglClassNode(content_array, mode = -1) {
  const main = document.createElement('div');
  main.className = 'class_main';
  Object.assign(main.style, {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '1em',
  });

  const teacherIndex = mode >= 0 ? 0 : 1;
  const subjectIndex = mode >= 0 ? 1 : 0;
  if (/^\s*$/.test(content_array[teacherIndex])) content_array[teacherIndex] = '未知教师';

  if (mode <= 0) {
    const subject = document.createElement('div');
    subject.className = 'subject';
    subject.textContent = content_array[subjectIndex];
    main.appendChild(subject);
  }

  const teacher = document.createElement('div');
  teacher.className = 'teacher';
  const teacherName = document.createElement('span');
  teacherName.textContent = content_array[teacherIndex];
  const room = document.createElement('mark');
  room.textContent = content_array[3];
  const week = document.createElement('span');
  week.textContent = content_array[2];
  teacher.append(teacherName, room, week);
  main.appendChild(teacher);
  return main;
}

/**
 * 精确移除教务页面已注入 `<style>` 节点里 `.noneprint{display:none}` 规则。
 * 对应 1.x 行 3492 `$("body").html($("body").html().replace(".noneprint{\\n\\tdisplay:none\\n}    \\n\\n",""))`，但改
 * 精确改目标 style 节点 textContent，不整 body reparse（避免丢失已挂载的导出栏 Vue app 与事件监听）。
 *
 * 1.x 替换的字面串：`.noneprint{\n\tdisplay:none\n}    \n\n`（含 Tab 与尾随 4 空格+两空行）。教务原始页面 `<style>` 内
 * 多含此段以隐藏待用样式。2.0 扫所有 `<style>` 节点的 textContent，对每个去掉该字面规则的匹配段，回写 textContent。
 */
function stripNoneprintStyle() {
  const target = '.noneprint{\n\tdisplay:none\n}    \n\n';
  // page 注入模型下 unsafeWindow === window；用 unsafeWindow.document 与 1.x 同源取页面 DOM。
  const doc = pageWindow.document;
  doc.querySelectorAll('style').forEach((styleEl) => {
    const text = styleEl.textContent || '';
    if (text.indexOf(target) === -1) return;
    // 逐串替换（可能出现一次或多次）；textContent 回写不触发 body reparse。
    styleEl.textContent = text.split(target).join('');
  });
}

/**
 * 教务课表美化主入口。对应 1.x jwglCourseBeautify 行 3416-3548。
 * 先注入导出栏（installCourseToolbar），再按 Jwgl.courseBeautify 开关重写各 td>div 单元格为美观卡片；
 * 完成或跳过均 postMessage 通知父容器 resize。
 */
export async function beautifyJwglCourseTable() {
  // 1.x 行 3432：先注入导出栏（jwglExportCourses），与课表美化顺序一致。
  installCourseToolbar();

  // 未启用美化或无 table 时直接返回，仍通知父页面校准高度。
  if (!getGMValue('Jwgl.courseBeautify') || !document.querySelector('table')) {
    notifyCourseBeautifyChanged();
    return;
  }

  // 1.x 行 3467-3491：注入优化样式。注意 1.x 该字符串外裹 `<style>...</style>` 标签，但 1.x AddVant 时的
  //  GM_addStyle 实际拼接会再裹一层——此处 1.x 原文 GM_addStyle 内含 `<style>`，行为是把 style 块整体注入。
  //  2.0 GM_addStyle 传纯 CSS 文本（不带 <style> 标签）；剥离外标签写纯 CSS 以等价。
  if (typeof GM_addStyle === 'function') {
    GM_addStyle(`
      .class_main > div {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 0;
      }
      .teacher {
        font-size: 12px;
        padding: 0;
      }
      .classroom {
        font-size: 12px;
        padding: 0;
      }
      .subject {
        font-size: 16px;
        font-weight: bold;
        padding: 0.5em 0;
      }
    `);
  } else {
    console('GM_addStyle 不可用，跳过样式注入', undefined, 'warn');
  }

  // 1.x 行 3492：精确移除 .noneprint 规则（原生 DOM 替整 body reparse，见 stripNoneprintStyle 注释）。
  stripNoneprintStyle();

  // 1.x 行 3493：给课表主体表加 optimized 类，便于后续选择器（原生 classList.add 替 addClass）。
  const mainTable = document.querySelector('table.listTable#contentListFrame');
  if (mainTable) mainTable.classList.add('optimized');

  // 1.x 行 3494-3497：表格底外边距 + 行高自适应 + td 左内距清零。原生逐节点设样式替 `.css()`。
  document.querySelectorAll('table').forEach((el) => el.style.setProperty('margin-bottom', '3em'));
  document.querySelectorAll('tr').forEach((el) => {
    el.setAttribute('height', 'auto');
    el.style.setProperty('min-height', '45px');
  });
  document.querySelectorAll('td').forEach((el) => el.style.setProperty('padding-left', '0'));

  // 1.x 行 3498-3545：遍历每个 td > div，解析 title → 重写为美观卡片。
  document.querySelectorAll('td > div').forEach((div) => {
    // 1.x 行 3501-3502：div 高度自适应 + 内距。
    div.style.setProperty('height', 'auto');
    div.style.setProperty('padding', '1em 0.5em 0');
    // 1.x 行 3503：取 title 原文（1.x div.attr('title')，原生 getAttribute）。
    //  逐字迁 jwglCourseBeautify 段：missingPlaceholder 传 "空"（1.x 行 3506）。
    const content_array = parseCourseCellFromJwgl(div, { missingPlaceholder: '空' });
    // 1.x 行 3526-3529：相邻组缺教师/课程名时从前一组借补 unshift（与 export 段一字不差，抽 normalizeCellGroups 复用）。
    normalizeCellGroups(content_array);
    // 1.x 行 3517-3521：div 改 flex 居中容器。
    div.style.setProperty('display', 'flex');
    div.style.setProperty('flex-direction', 'column');
    div.style.setProperty('justify-content', 'center');
    div.style.setProperty('align-items', 'center');
    div.style.setProperty('text-align', 'center');
    // 1.x 行 3522：清空原内容。
    div.replaceChildren();
    let temp_var;
    for (let i = 0; i < content_array.length; i++) {
      if (content_array.length > 1) {
        // 1.x 行 3526-3529 已在上 normalizeCellGroups 处理。此处判 i==0 或与上一组同课程名（[1]）则续接，
        //  否则插分隔线并以 mode==0 渲染（首组后换课程名的标志）。
        if (i === 0 || content_array[i][1] === content_array[i - 1][1]) {
          div.appendChild(createJwglClassNode(content_array[i], i));
        } else {
          const separator = document.createElement('div');
          Object.assign(separator.style, {
            height: '1px',
            backgroundColor: 'grey',
            width: '90%',
            marginBottom: '1em',
          });
          div.append(separator, createJwglClassNode(content_array[i], 0));
        }
      } else {
        // 1.x 行 3537-3542：单组时若教师名含外聘/助理/教授/讲师/() 等关键字，互换 [0][1]（教师↔课程名）。
        if (/\(外聘|助理|教授\)|\(讲师\)|\(\)/.test(content_array[i][0])) {
          temp_var = content_array[i][0];
          content_array[i][0] = content_array[i][1];
          content_array[i][1] = temp_var;
        }
        div.appendChild(createJwglClassNode(content_array[i]));
      }
    }
  });

  notifyCourseBeautifyChanged();
}
