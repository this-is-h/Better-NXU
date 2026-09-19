/**
 * sites/webvpn/components/tools/schedule-view — 工具页课表视图纯逻辑（个人课表布局/空闲分析/多人空课表汇总的纯函数）
 * 对应 1.x：Better NXU.user.js 行 6229-6876（webvpnHTools 内个人课表/空闲分析/多人空课表各段纯逻辑）
 * 依赖：schedule（periodTimes/weekdayText/getMaps/getLessonDetail/formatWeeks/formatPeriods/classifyScheduleSlot）
 * 入口/被谁调用：sites/webvpn/components/tools/ToolsApp.vue（P3 方案 A 拆分：从 ToolsApp 抽出纯逻辑，ToolsApp 只留
 *               UI + 响应式状态；本模块无副作用、不依赖组件响应式状态，可独立测试）
 *
 * 拆分边界（P3）：
 *  - 纯函数：getTotalWeeks/courseColor/splitConsecutivePeriods/buildPersonalCourseEntries/
 *    buildPersonalCourseLayout/isOnlineLesson/getLessonAvailability/formatAvailabilityWeeks/buildPersonalFreeGrid
 *  - 常量：personalDays/personalPeriodRows（原 ToolsApp 内模块级，随纯逻辑一并迁出，模板仍经 ToolsApp import 可见）
 *  - 注意：getTotalWeeks 原在 ToolsApp 有默认参数 `data = personalSchedule.value`（依赖组件响应式），抽离后改为
 *    必传 data 的纯函数；ToolsApp 内唯一无参调用点（personalWeekOptions）已改显式传 personalSchedule.value。
 *  - scheduleManagerPeriodRows（多人空课表硬编码节次行）留在 ToolsApp（仅 UI 汇总用，非纯逻辑）。
 */
import {
  periodTimes,
  weekdayText,
  getMaps,
  getLessonDetail,
  formatWeeks,
  formatPeriods,
  classifyScheduleSlot,
} from '../../../../schedule/index.js';

/** 个人课表 7 天常量（1.x 行 6229-6232）。 */
export const personalDays = Array.from({ length: 7 }, (_, index) => ({
  number: index + 1,
  text: weekdayText(index + 1),
}));

/** 个人课表节次行常量（1.x 行 6233-6239）。 */
export const personalPeriodRows = periodTimes.map(({ period, start, end }) => ({
  key: String(period),
  label: String(period),
  period,
  periods: [period],
  time: `${start}-${end}`,
}));

/** 取课表总周数（1.x 行 6240-6244）。@param {object} data 课表数据（必传，纯函数——原 ToolsApp 内默认
 *  personalSchedule.value 的组件依赖已由调用方显式传入）。 */
export function getTotalWeeks(data) {
  if (!data) return 0;
  return (
    Number(data.meta?.weekRange?.end) ||
    Math.max(0, ...data.lessons.map((lesson) => Number(lesson.week) || 0))
  );
}

/** 课程颜色（按 id 哈希取色板，1.x 行 6245-6249）。 */
export function courseColor(id) {
  const colors = ['#4a6bdf', '#07c160', '#ee0a24', '#ff976a', '#7232dd', '#1989fa', '#8b5a2b'];
  const hash = String(id || '')
    .split('')
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

/** 连续节次分段（1.x 行 6686-6694）。 */
export function splitConsecutivePeriods(periods) {
  const values = [...new Set((periods || []).map(Number))]
    .filter((period) => Number.isInteger(period) && period >= 1 && period <= 10)
    .sort((left, right) => left - right);
  const segments = [];
  values.forEach((period) => {
    const segment = segments[segments.length - 1];
    if (!segment || period !== segment[segment.length - 1] + 1) {
      segments.push([period]);
    } else {
      segment.push(period);
    }
  });
  return segments;
}

/** 个人课表课程条目（按课程/星期/节次分组 + 教师/教室变体，1.x 行 6695-6766）。 */
export function buildPersonalCourseEntries(data, week = 0) {
  const maps = getMaps(data);
  const groups = new Map();
  data.lessons
    .filter((lesson) => !week || lesson.week === week)
    .forEach((lesson) => {
      const detail = getLessonDetail(maps, lesson);
      const teachers = detail.teachers || [];
      const periods = [...lesson.periods].sort((left, right) => left - right);
      const groupKey = [lesson.courseId, lesson.weekday, periods.join(',')].join('|');
      if (!groups.has(groupKey)) {
        groups.set(groupKey, {
          key: groupKey,
          name: detail.course.name || '未命名课程',
          weekday: lesson.weekday,
          periods,
          periodText: lesson.periodText || formatPeriods(periods),
          color: courseColor(lesson.courseId),
          variants: new Map(),
        });
      }
      const group = groups.get(groupKey);
      const teacherKey = [...teachers].sort().join('、');
      const variantKey = [lesson.scheduleId, teacherKey, detail.room].join('|');
      if (!group.variants.has(variantKey)) {
        group.variants.set(variantKey, {
          key: variantKey,
          teacherText: detail.teacherText || '',
          room: detail.room || '',
          weeks: [],
        });
      }
      group.variants.get(variantKey).weeks.push(lesson.week);
    });

  const totalWeeks = getTotalWeeks(data);
  return [...groups.values()].map((group) => {
    const variants = [...group.variants.values()]
      .map((variant) => {
        const weeks = [...new Set(variant.weeks)].sort((left, right) => left - right);
        return {
          ...variant,
          weeks,
          weeksText: formatWeeks(weeks, totalWeeks),
          detailText: [variant.teacherText, variant.room].filter(Boolean).join(' · ') || '未注明教师与教室',
        };
      })
      .sort(
        (left, right) =>
          (left.weeks[0] || 0) - (right.weeks[0] || 0) ||
          left.teacherText.localeCompare(right.teacherText, 'zh-Hans-CN') ||
          left.room.localeCompare(right.room, 'zh-Hans-CN')
      );
    const seenWeeks = new Set();
    const hasOverlappingVariants = variants.some((variant) =>
      variant.weeks.some((item) => {
        if (seenWeeks.has(item)) return true;
        seenWeeks.add(item);
        return false;
      })
    );
    return {
      key: group.key,
      name: group.name,
      weekday: group.weekday,
      periods: group.periods,
      periodText: group.periodText,
      color: group.color,
      variants,
      hasOverlappingVariants,
    };
  });
}

/** 个人课表布局（连续节次块 + 时间重叠检测，1.x 行 6767-6841）。 */
export function buildPersonalCourseLayout(entries) {
  const blocksByDay = new Map();
  entries.forEach((entry) =>
    splitConsecutivePeriods(entry.periods).forEach((segment) => {
      const startPeriod = segment[0];
      const endPeriod = segment[segment.length - 1];
      const block = {
        ...entry,
        key: `${entry.key}|${startPeriod}-${endPeriod}`,
        periods: segment,
        periodText: formatPeriods(segment),
        startPeriod,
        endPeriod,
      };
      if (!blocksByDay.has(entry.weekday)) blocksByDay.set(entry.weekday, []);
      blocksByDay.get(entry.weekday).push(block);
    })
  );

  const result = [];
  [...blocksByDay.keys()]
    .sort((left, right) => left - right)
    .forEach((weekday) => {
      const dayBlocks = blocksByDay
        .get(weekday)
        .sort(
          (left, right) =>
            left.startPeriod - right.startPeriod ||
            left.endPeriod - right.endPeriod ||
            left.name.localeCompare(right.name, 'zh-Hans-CN')
        );
      const components = [];
      let component = [];
      let componentEnd = 0;
      dayBlocks.forEach((block) => {
        if (component.length && block.startPeriod > componentEnd) {
          components.push(component);
          component = [];
          componentEnd = 0;
        }
        component.push(block);
        componentEnd = Math.max(componentEnd, block.endPeriod);
      });
      if (component.length) components.push(component);

      components.forEach((items) => {
        const startPeriod = Math.min(...items.map((item) => item.startPeriod));
        const endPeriod = Math.max(...items.map((item) => item.endPeriod));
        result.push({
          key: [weekday, startPeriod, endPeriod, ...items.map((item) => item.key)].join('|'),
          weekday,
          startPeriod,
          endPeriod,
          hasTimeOverlap: items.length > 1,
          entries: items,
          gridStyle: {
            gridColumn: String(weekday + 1),
            gridRow: `${startPeriod + 1} / span ${endPeriod - startPeriod + 1}`,
          },
        });
      });
    });
  return result;
}

/** 判定某 lesson 是否线上可协调（尔雅课，1.x 行 6843-6846）。 */
export function isOnlineLesson(maps, lesson) {
  const detail = getLessonDetail(maps, lesson);
  return /尔雅/.test(`${detail.course.name || ''} ${detail.room || ''}`);
}

/** 取某时段空闲状态（busySlots 查表 O(1)，1.x 行 6847-6852）。 */
export function getLessonAvailability(data, maps, week, weekday, period) {
  const lessons = (data.busySlots[`${week}-${weekday}-${period}`] || [])
    .map((id) => maps.lessons.get(id))
    .filter(Boolean);
  return classifyScheduleSlot(lessons, (lesson) => isOnlineLesson(maps, lesson));
}

/** 空闲周文本（1.x 行 6853-6862）。 */
export function formatAvailabilityWeeks(freeWeeks, onlineWeeks, totalWeeks) {
  const parts = [];
  if (freeWeeks.length) {
    parts.push(`${formatWeeks(freeWeeks, totalWeeks)}完全空闲`);
  }
  if (onlineWeeks.length) {
    parts.push(`${formatWeeks(onlineWeeks, totalWeeks)}仅有线上课程（可协调）`);
  }
  return parts.length ? parts.join('\n') : '有课';
}

/** 个人空闲网格（1.x 行 6863-6876）。 */
export function buildPersonalFreeGrid(data, selectedWeek = 0) {
  const grid = Object.fromEntries(
    personalPeriodRows.map((row) => [
      row.key,
      Object.fromEntries(
        personalDays.map((day) => [
          day.number,
          {
            isFree: false,
            isAllTermFree: false,
            hasOnline: false,
            text: '有课',
            ariaLabel: `${day.text}第${row.label}节：有课`,
          },
        ])
      ),
    ])
  );
  if (!data) return grid;
  const maps = getMaps(data);
  const totalWeeks = getTotalWeeks(data);
  const weeks = selectedWeek ? [selectedWeek] : Array.from({ length: totalWeeks }, (_, index) => index + 1);
  personalPeriodRows.forEach((row) =>
    personalDays.forEach((day) => {
      const periodStates = row.periods.map((period) => {
        const states = weeks.map((week) => ({
          week,
          status: getLessonAvailability(data, maps, week, day.number, period),
        }));
        const freeWeeks = states.filter((item) => item.status === 'free').map((item) => item.week);
        const onlineWeeks = states.filter((item) => item.status === 'online').map((item) => item.week);
        return { period, freeWeeks, onlineWeeks };
      });
      let text;
      if (selectedWeek) {
        const labels = periodStates.map((state) =>
          state.freeWeeks.length ? '完全空闲' : state.onlineWeeks.length ? '仅有线上课程（可协调）' : '有课'
        );
        text = labels.every((label) => label === labels[0])
          ? labels[0]
          : periodStates.map((state, index) => `第${state.period}节${labels[index]}`).join('\n');
      } else {
        const signatures = periodStates.map(
          (state) => `${state.freeWeeks.join(',')}|${state.onlineWeeks.join(',')}`
        );
        if (signatures.every((value) => value === signatures[0])) {
          text = formatAvailabilityWeeks(periodStates[0].freeWeeks, periodStates[0].onlineWeeks, totalWeeks);
        } else {
          text = periodStates
            .map(
              (state) =>
                `第${state.period}节：${formatAvailabilityWeeks(state.freeWeeks, state.onlineWeeks, totalWeeks)}`
            )
            .join('\n');
        }
      }
      const hasOnline = periodStates.some((state) => state.onlineWeeks.length);
      grid[row.key][day.number] = {
        isFree: periodStates.some((state) => state.freeWeeks.length || state.onlineWeeks.length),
        isAllTermFree:
          !selectedWeek &&
          totalWeeks > 0 &&
          periodStates.every((state) => state.freeWeeks.length === totalWeeks),
        hasOnline,
        text,
        ariaLabel: `${day.text}第${row.label}节：${text.replace(/\n/g, '；')}`,
      };
    })
  );
  return grid;
}
