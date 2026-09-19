/**
 * excel-build — 教务课表 export 数据结构（Excel 行/列二维数组生成）
 * 对应 1.x：Better NXU.user.js 行 1606-1687（buildJwglExcelTables，Constant 平级函数）
 * 依赖：schema（periodTimes）、week-compute（weekdayText/formatPeriods/formatWeeks）、
 *       schedule-model（normalize）—— 1.x 经默认参 `tools = CourseScheduleTools` 注入，
 *       2.0 改为显式 import 同三个模块的具名 export，不依赖全局 `CourseScheduleTools` 名。
 * 入口/被谁调用：index 桶文件 buildJwglExcelTables；B6 jwgl 课表导出 / B7 工具页 Excel 导出
 *
 * B3 原则：函数体逐字迁出 1.x，仅显式化依赖来源（tools.xxx → 各子模块 export）。
 * 列/行布局保持与 1.x 严格一致：表头 "节次/时间" + 7 列 weekdayText；5 行 periodGroups（1-2/3-4/5-6/7-8/9-10）。
 */
import { periodTimes } from './schema.js';
import { weekdayText, formatPeriods, formatWeeks } from './week-compute.js';
import { normalize } from './schedule-model.js';

/**
 * 生成课表导出所需的两组 AoA。
 * @param {object} schedule - 课表对象（含 courses/lessons/meta，会被 normalize）
 * @returns {{ timetableRows: any[][], detailRows: any[][], arrangementCount: number }}
 *   timetableRows：[1表头 + 5节次组] 行；每格多门课用 \n\n 分隔，每门课 5 行用 \n 连接。
 *   detailRows：[1表头 + arrangements] 行，每条安排一行。
 *   arrangementCount：有效安排数（日志/telemetry 用）。
 * @throws {Error} 校验/无安排时抛 Error（1.x 行 981/1645），不裹错误码（与 1.x 一致）。
 */
export function buildJwglExcelTables(schedule) {
  const data = normalize(schedule);
  const totalWeeks =
    Number(data.meta?.weekRange?.end) ||
    Math.max(0, ...data.lessons.map((lesson) => Number(lesson.week) || 0));
  const lessonWeeksBySchedule = new Map();
  data.lessons.forEach((lesson) => {
    if (!lessonWeeksBySchedule.has(lesson.scheduleId)) lessonWeeksBySchedule.set(lesson.scheduleId, []);
    lessonWeeksBySchedule.get(lesson.scheduleId).push(Number(lesson.week));
  });

  const arrangements = data.courses
    .flatMap((course) =>
      (course.schedules || []).map((item) => {
        const periods = [...new Set((item.periods || []).map(Number))]
          .filter((period) => Number.isInteger(period) && period >= 1 && period <= 10)
          .sort((left, right) => left - right);
        const weeks = [
          ...new Set(
            (item.weeks?.length ? item.weeks : lessonWeeksBySchedule.get(item.id) || []).map(Number)
          ),
        ]
          .filter((week) => Number.isInteger(week) && week > 0)
          .sort((left, right) => left - right);
        return {
          courseName: course.name || '未命名课程',
          teacherText: item.teacherText || course.teacherText || '未注明教师',
          room: item.room || item.location || '未注明教室',
          weekday: Number(item.weekday),
          weekdayText: item.weekdayText || weekdayText(Number(item.weekday)),
          periods,
          periodText: item.periodText || formatPeriods(periods),
          startTime: item.startTime || '',
          endTime: item.endTime || '',
          weeks,
          weeksText: formatWeeks(weeks, totalWeeks),
        };
      })
    )
    .filter(
      (item) =>
        Number.isInteger(item.weekday) && item.weekday >= 1 && item.weekday <= 7 && item.periods.length
    )
    .sort(
      (left, right) =>
        left.weekday - right.weekday ||
        left.periods[0] - right.periods[0] ||
        left.courseName.localeCompare(right.courseName, 'zh-Hans-CN')
    );

  if (!arrangements.length) throw new Error('当前课表没有可导出的课程安排');

  const weekdays = Array.from({ length: 7 }, (_, index) => weekdayText(index + 1));
  const periodGroups = Array.from({ length: 5 }, (_, index) => {
    const first = periodTimes[index * 2];
    const second = periodTimes[index * 2 + 1];
    return {
      label: `${first.period}-${second.period}`,
      periods: [first.period, second.period],
      time: `${first.start}-${second.end}`,
    };
  });
  const timetableRows = [['节次 / 时间', ...weekdays]];
  periodGroups.forEach((group) => {
    const row = [`第 ${group.label} 节\n${group.time}`];
    for (let weekday = 1; weekday <= 7; weekday++) {
      const values = arrangements
        .filter(
          (item) => item.weekday === weekday && item.periods.some((period) => group.periods.includes(period))
        )
        .map((item) =>
          [
            item.courseName,
            `教师：${item.teacherText}`,
            `教室：${item.room}`,
            `周次：${item.weeksText}`,
            `节次：${item.periodText}`,
          ].join('\n')
        );
      row.push(values.join('\n\n'));
    }
    timetableRows.push(row);
  });

  const detailRows = [['课程名称', '教师', '教室', '星期', '节次', '上课时间', '周次']];
  arrangements.forEach((item) =>
    detailRows.push([
      item.courseName,
      item.teacherText,
      item.room,
      item.weekdayText,
      item.periodText,
      [item.startTime, item.endTime].filter(Boolean).join('-') || '未注明',
      item.weeksText,
    ])
  );

  return { timetableRows, detailRows, arrangementCount: arrangements.length };
}
