/**
 * week-compute — 学年周次与日期/节次格式化工具
 * 对应 1.x：CourseScheduleTools IIFE 行 1099-1167、1123-1126、1159-1234、1205-1225
 * 依赖：schema（periodTimes）、_helpers（uniqueNumbers）
 * 入口/被谁调用：ics-parser、schedule-model、excel-build、index（formatWeeks/formatPeriods/weekdayText 对外）
 *
 * 拆分依据（B3 "原样迁出、不动算法"）：1.x 这些都是 IIFE 闭包内私有纯函数，无 UI/GM 依赖，
 * 02 §2 目录树将它们归入 week-compute.js。函数体逐字保留，仅改为命名 export。
 */

import { uniqueNumbers, uniqueSorted } from './_helpers.js';

/** 仅取日期（split + Date.UTC 构造），1.x 行 1209-1212。 */
export function parseDateOnly(value) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

/** Date → "YYYY-MM-DD"（UTC），1.x 行 1214-1216。 */
export function formatDateOnly(date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
}

/** (year,month,day) → 周一为 1..周日为 7 的 weekday，1.x 行 1218-1221。 */
export function getWeekdayNumber(year, month, day) {
  const value = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  return value || 7;
}

/** weekday 1..7 → 周一..周日 中文，1.x 行 1223-1225。 */
export function weekdayText(value) {
  return ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日'][value] || '';
}

/**
 * 推算学期起始周一（1.x 行 1099-1106）。
 * 取所有 lesson 按 date 升序的第一个日期，回退到该周周一。
 */
export function getTermStartMonday(lessons) {
  const firstDate = lessons
    .map((item) => item.date)
    .filter(Boolean)
    .sort()[0];
  if (!firstDate) return '';
  const date = parseDateOnly(firstDate);
  const weekday = getWeekdayNumber(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
  date.setUTCDate(date.getUTCDate() - weekday + 1);
  return formatDateOnly(date);
}

/** 日期相对学期起始的周次（1-based）；学期前或缺失返回 null（1.x 行 1108-1112）。 */
export function getWeekIndex(dateString, termStartDate) {
  if (!dateString || !termStartDate) return null;
  const days = Math.floor((parseDateOnly(dateString) - parseDateOnly(termStartDate)) / 86400000);
  return days < 0 ? null : Math.floor(days / 7) + 1;
}

/** 课次 weeks 数组 → 周次范围对象 {start,end,weeks}（1.x 行 1114-1117）。 */
export function getWeekRange(lessons) {
  const weeks = uniqueNumbers(lessons.map((item) => Number(item.week)));
  return { start: weeks[0] || null, end: weeks[weeks.length - 1] || null, weeks };
}

/** 课次 dates → 日期区间（1.x 行 1119-1121）。 */
export function getDateRange(lessons) {
  return rangeFromValues(lessons.map((item) => item.date).filter(Boolean));
}

/** 通用：取值数组 min/max 区间（1.x 行 1123-1126）。 */
export function rangeFromValues(values) {
  const sorted = uniqueSorted(values);
  return { start: sorted[0] || '', end: sorted[sorted.length - 1] || '' };
}

/**
 * 周次集合 → "1-16周"/"单双周" 等文本（1.x 行 1128-1149）。
 * totalWeeks 为学期总周数；整学期范围或等差单/双周有专门短语。
 */
export function formatWeeks(weeks, totalWeeks = 0) {
  const values = uniqueNumbers((weeks || []).map(Number));
  if (!values.length) return '无';
  if (
    totalWeeks &&
    values.length === totalWeeks &&
    values[0] === 1 &&
    values[values.length - 1] === totalWeeks
  )
    return '全学期';
  if (values.length >= 3 && values.every((value, index) => index === 0 || value - values[index - 1] === 2)) {
    return `${values[0]}-${values[values.length - 1]}周${values[0] % 2 ? '单' : '双'}`;
  }
  const chunks = [];
  let start = values[0];
  let previous = values[0];
  for (let index = 1; index <= values.length; index++) {
    const current = values[index];
    if (current === previous + 1) {
      previous = current;
      continue;
    }
    chunks.push(start === previous ? String(start) : `${start}-${previous}`);
    start = current;
    previous = current;
  }
  return `${chunks.join('、')}周`;
}

/** 节次集合 → "1-2"/"1,3" 文本（1.x 行 1151-1157）。 */
export function formatPeriods(periods) {
  const values = uniqueNumbers(periods || []);
  if (!values.length) return '';
  return values.length > 1 && values.every((value, index) => index === 0 || value === values[index - 1] + 1)
    ? `${values[0]}-${values[values.length - 1]}`
    : values.join(',');
}

/** (week,weekday,period) → "week-weekday-period" 稳定 key；缺有限值返回空串（1.x 行 1159-1161）。 */
export function buildSlotKey(week, weekday, period) {
  return [week, weekday, period].every(Number.isFinite) ? `${week}-${weekday}-${period}` : '';
}

/** slotKey 数值比较器（1.x 行 1163-1167）。 */
export function compareSlotKeys(left, right) {
  const a = left.split('-').map(Number);
  const b = right.split('-').map(Number);
  return a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
}

/** UTC 构造本地日期时间拼接（1.x 行 1205-1207）。 */
export function buildLocalDateTime(date, time) {
  return date && time ? `${date}T${time}:00` : '';
}
