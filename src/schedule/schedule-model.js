/**
 * schedule-model — 课表三层模型（course/schedule/lesson）构建、合并、归一与查询
 * 对应 1.x：CourseScheduleTools IIFE 行 468-512（parseIcs 编排）+ 729-1070
 *           （mergeLessonsToCourses / buildScheduleMap / buildLessonRecords / buildFromJwgl /
 *             normalize / buildByDate / buildBusySlots / getMaps / getLessonDetail）+
 *           1169-1185（compareRawLesson/compareLesson/compareSchedule）+ 1199-1203（normalizeOwner）；
 *           以及 Constant 平级 1585-1604（classifyScheduleSlot / summarizePeopleAvailability）
 * 依赖：schema、_helpers、week-compute、ics-parser（parseIcsText/eventToLesson/findTimezone/splitTeacherNames）
 * 入口/被谁调用：index 桶文件（fetchFromUrl/parseIcs/buildFromJwgl/normalize/getMaps/getLessonDetail）；
 *                crypto/envelope（B4 encryptSchedule 调 normalize）、crypto/parse（B4 校验 schemaVersion）
 *
 * B3 原则：函数体逐字迁出 1.x，仅显式化依赖、改命名 export；算法不变（C5）。
 * 对 window.location.href 的引用（buildFromJwgl 行 957）按 1.x 原样保留——schedule 运行在 page 上下文，
 * window 可见；02 §3 仅禁止 schedule→sites/composables 反向依赖，未禁 window。
 */
import { schemaVersion, timezone, timezoneOffset, periodTimes } from './schema.js';
import {
  stableId,
  normalizeText,
  addManyUnique,
  uniqueBy,
  uniqueSorted,
  uniqueInOrder,
  uniqueNumbers,
  stableArrayText,
  sameTextArray,
} from './_helpers.js';
import {
  getTermStartMonday,
  getWeekIndex,
  getWeekRange,
  getDateRange,
  rangeFromValues,
  formatPeriods,
  buildSlotKey,
  compareSlotKeys,
  weekdayText,
  buildLocalDateTime,
} from './week-compute.js';
import { parseIcsText, eventToLesson, findTimezone, splitTeacherNames } from './ics-parser.js';

/** ICS 文本顶层解析编排（1.x 行 468-512）。 */
export function parseIcs(icsText, options = {}) {
  const parsed = parseIcsText(icsText);
  const calendarTimezone = parsed.calendar['X-WR-TIMEZONE']?.[0]?.value || findTimezone(parsed) || timezone;
  const rawLessons = uniqueBy(
    parsed.events
      .map((event, index) => eventToLesson(event, { index, timezone: calendarTimezone }))
      .filter(Boolean)
      .sort(compareRawLesson),
    (item) => item.id
  );
  if (rawLessons.length === 0) {
    throw new Error('ICS 课表中没有可识别的课程');
  }
  const termStartDate = options.termStartDate || getTermStartMonday(rawLessons);
  const merged = mergeLessonsToCourses(rawLessons, termStartDate);
  const scheduleMap = buildScheduleMap(merged.courses);
  const lessons = buildLessonRecords(rawLessons, merged.lessonLinks, scheduleMap);
  const result = {
    schemaVersion,
    sourceUrl: options.sourceUrl || '',
    source: {
      type: options.sourceType || 'text',
      input: options.sourceInput || options.sourceUrl || '',
    },
    owner: normalizeOwner(options.owner),
    meta: {
      calendarName: parsed.calendar['X-WR-CALNAME']?.[0]?.value || '课表',
      calendarDescription: parsed.calendar['X-WR-CALDESC']?.[0]?.value || '',
      timezone: calendarTimezone,
      timezoneOffset,
      termStartDate,
      weekRange: getWeekRange(lessons),
      dateRange: getDateRange(rawLessons),
      totalRawLessons: rawLessons.length,
      totalLessons: lessons.length,
      totalCourses: merged.courses.length,
      totalSchedules: merged.courses.reduce((sum, course) => sum + course.schedules.length, 0),
    },
    courses: merged.courses,
    lessons,
    byDate: buildByDate(lessons),
    busySlots: buildBusySlots(lessons),
  };
  return normalize(result);
}

/** rawLessons → 合并 courses + lessonLinks（1.x 行 729-805）。 */
export function mergeLessonsToCourses(lessons, termStartDate) {
  const courseMap = new Map();
  const lessonLinks = new Map();
  lessons.forEach((lesson) => {
    const courseId = stableId(`${normalizeText(lesson.name)}|${stableArrayText(lesson.groups)}`);
    if (!courseMap.has(courseId)) {
      courseMap.set(courseId, {
        id: courseId,
        name: lesson.name,
        teachers: [],
        teacherText: '',
        groups: lesson.groups,
        lessonCount: 0,
        dateRange: { start: '', end: '' },
        dates: [],
        schedules: [],
      });
    }
    const course = courseMap.get(courseId);
    course.lessonCount++;
    course.dates.push(lesson.date);
    addManyUnique(course.teachers, lesson.teachers);
    const scheduleId = stableId(
      [
        courseId,
        lesson.weekday,
        lesson.startTime,
        lesson.endTime,
        lesson.periodText,
        lesson.campusOrBuilding,
        lesson.room,
      ]
        .map(normalizeText)
        .join('|')
    );
    let schedule = course.schedules.find((item) => item.id === scheduleId);
    if (!schedule) {
      schedule = {
        id: scheduleId,
        weekday: lesson.weekday,
        weekdayText: lesson.weekdayText,
        startTime: lesson.startTime,
        endTime: lesson.endTime,
        periodText: lesson.periodText || formatPeriods(lesson.periods),
        periods: lesson.periods,
        campusOrBuilding: lesson.campusOrBuilding,
        room: lesson.room,
        location: lesson.location,
        teachers: [],
        teacherText: '',
        dates: [],
        weeks: [],
        lessonIds: [],
        dateRange: { start: '', end: '' },
      };
      course.schedules.push(schedule);
    }
    addManyUnique(schedule.teachers, lesson.teachers);
    const week = getWeekIndex(lesson.date, termStartDate);
    schedule.dates.push(lesson.date);
    if (week) schedule.weeks.push(week);
    schedule.lessonIds.push(lesson.id);
    lessonLinks.set(lesson.id, { courseId, scheduleId, week });
  });
  const courses = [...courseMap.values()];
  courses.forEach((course) => {
    course.dates = uniqueSorted(course.dates);
    course.teacherText = course.teachers.join('、');
    course.dateRange = rangeFromValues(course.dates);
    course.schedules.forEach((schedule) => {
      schedule.dates = uniqueSorted(schedule.dates);
      schedule.weeks = uniqueNumbers(schedule.weeks);
      schedule.lessonIds = uniqueInOrder(schedule.lessonIds);
      schedule.teacherText = schedule.teachers.join('、');
      schedule.dateRange = rangeFromValues(schedule.dates);
    });
    course.schedules.sort(compareSchedule);
  });
  courses.sort((left, right) => left.name.localeCompare(right.name, 'zh-Hans-CN'));
  return { courses, lessonLinks };
}

/** 课程 schedules 映射表（1.x 行 807-811）。 */
export function buildScheduleMap(courses) {
  const map = new Map();
  courses.forEach((course) => course.schedules.forEach((schedule) => map.set(schedule.id, schedule)));
  return map;
}

/** rawLessons + links + map → lesson 记录数组（1.x 行 813-839）。 */
export function buildLessonRecords(rawLessons, lessonLinks, scheduleMap) {
  return rawLessons
    .map((lesson) => {
      const link = lessonLinks.get(lesson.id) || {};
      const schedule = scheduleMap.get(link.scheduleId);
      const record = {
        id: lesson.id,
        courseId: link.courseId || '',
        scheduleId: link.scheduleId || '',
        date: lesson.date,
        week: link.week ?? null,
        weekday: lesson.weekday,
        weekdayText: lesson.weekdayText,
        startTime: lesson.startTime,
        endTime: lesson.endTime,
        startDateTimeLocal: buildLocalDateTime(lesson.date, lesson.startTime),
        endDateTimeLocal: buildLocalDateTime(lesson.date, lesson.endTime),
        periodText: lesson.periodText || formatPeriods(lesson.periods),
        periods: lesson.periods,
        slotKeys: lesson.periods
          .map((period) => buildSlotKey(link.week, lesson.weekday, period))
          .filter(Boolean),
      };
      if (!schedule || !sameTextArray(lesson.teachers, schedule.teachers)) {
        record.teachers = lesson.teachers;
        record.teacherText = lesson.teacherText;
      }
      return record;
    })
    .sort(compareLesson);
}

/** 教务系统 entries → schedule（不经 ICS，直接构 model；1.x 行 841-977）。 */
export function buildFromJwgl(entries, ownerName = '') {
  const courseMap = new Map();
  const occurrenceMap = new Map();
  const lessons = [];
  entries.forEach((entry) => {
    const teachers = Array.isArray(entry.teachers) ? entry.teachers : splitTeacherNames(entry.teacher);
    const courseId = stableId(normalizeText(entry.name));
    if (!courseMap.has(courseId)) {
      courseMap.set(courseId, {
        id: courseId,
        name: normalizeText(entry.name),
        teachers: [],
        teacherText: '',
        groups: [],
        lessonCount: 0,
        dateRange: { start: '', end: '' },
        dates: [],
        schedules: [],
      });
    }
    const course = courseMap.get(courseId);
    addManyUnique(course.teachers, teachers);
    const periods = uniqueNumbers(entry.periods || []);
    const startTime = periodTimes.find((item) => item.period === periods[0])?.start || '';
    const endTime = periodTimes.find((item) => item.period === periods[periods.length - 1])?.end || '';
    const scheduleId = stableId(
      [courseId, entry.weekday, startTime, endTime, formatPeriods(periods), entry.room].join('|')
    );
    let schedule = course.schedules.find((item) => item.id === scheduleId);
    if (!schedule) {
      schedule = {
        id: scheduleId,
        weekday: entry.weekday,
        weekdayText: weekdayText(entry.weekday),
        startTime,
        endTime,
        periodText: formatPeriods(periods),
        periods,
        campusOrBuilding: '',
        room: normalizeText(entry.room),
        location: normalizeText(entry.room),
        teachers: [],
        teacherText: '',
        dates: [],
        weeks: [],
        lessonIds: [],
        dateRange: { start: '', end: '' },
      };
      course.schedules.push(schedule);
    }
    addManyUnique(schedule.teachers, teachers);
    uniqueNumbers(entry.weeks || []).forEach((week) => {
      const key = `${courseId}|${scheduleId}|${week}`;
      if (!occurrenceMap.has(key)) {
        occurrenceMap.set(key, {
          key,
          courseId,
          scheduleId,
          week,
          weekday: entry.weekday,
          startTime,
          endTime,
          periodText: formatPeriods(periods),
          periods,
          teachers: [],
        });
      }
      addManyUnique(occurrenceMap.get(key).teachers, teachers);
    });
  });
  occurrenceMap.forEach((occurrence) => {
    const id = stableId(`jwgl|${occurrence.key}`);
    const course = courseMap.get(occurrence.courseId);
    const schedule = course.schedules.find((item) => item.id === occurrence.scheduleId);
    schedule.weeks.push(occurrence.week);
    schedule.lessonIds.push(id);
    course.lessonCount++;
    lessons.push({
      id,
      courseId: occurrence.courseId,
      scheduleId: occurrence.scheduleId,
      date: '',
      week: occurrence.week,
      weekday: occurrence.weekday,
      weekdayText: weekdayText(occurrence.weekday),
      startTime: occurrence.startTime,
      endTime: occurrence.endTime,
      startDateTimeLocal: '',
      endDateTimeLocal: '',
      periodText: occurrence.periodText,
      periods: occurrence.periods,
      slotKeys: occurrence.periods.map((period) => buildSlotKey(occurrence.week, occurrence.weekday, period)),
      teachers: occurrence.teachers,
      teacherText: occurrence.teachers.join('、'),
    });
  });
  const courses = [...courseMap.values()];
  courses.forEach((course) => {
    course.teacherText = course.teachers.join('、');
    course.schedules.forEach((schedule) => {
      schedule.teachers = uniqueInOrder(schedule.teachers);
      schedule.teacherText = schedule.teachers.join('、');
      schedule.weeks = uniqueNumbers(schedule.weeks);
      schedule.lessonIds = uniqueInOrder(schedule.lessonIds);
    });
    course.schedules.sort(compareSchedule);
  });
  lessons.forEach((lesson) => {
    const schedule = courseMap.get(lesson.courseId)?.schedules.find((item) => item.id === lesson.scheduleId);
    if (schedule && sameTextArray(lesson.teachers, schedule.teachers)) {
      delete lesson.teachers;
      delete lesson.teacherText;
    }
  });
  const weeks = uniqueNumbers(lessons.map((item) => item.week));
  return normalize({
    schemaVersion,
    sourceUrl: '',
    source: { type: 'jwgl', input: window.location.href },
    owner: { id: '', name: normalizeText(ownerName) },
    meta: {
      calendarName: '教务系统课表',
      calendarDescription: '由 Better NXU 从教务系统导出',
      timezone,
      timezoneOffset,
      termStartDate: '',
      weekRange: { start: weeks[0] || null, end: weeks[weeks.length - 1] || null, weeks },
      dateRange: { start: '', end: '' },
      totalRawLessons: lessons.length,
      totalLessons: lessons.length,
      totalCourses: courses.length,
      totalSchedules: courses.reduce((sum, course) => sum + course.schedules.length, 0),
    },
    courses,
    lessons,
    byDate: {},
    busySlots: buildBusySlots(lessons),
  });
}

/**
 * 课表对象归一化/校验（1.x 行 979-1025）。
 * 深拷贝后校验 schemaVersion、ID 唯一性、周/星期/节次合法性，并补 meta/byDate/busySlots。
 */
export function normalize(input) {
  if (
    !input ||
    input.schemaVersion !== schemaVersion ||
    !Array.isArray(input.courses) ||
    !Array.isArray(input.lessons)
  ) {
    throw new Error('仅支持 Better NXU 2.0 课表 JSON');
  }
  const data = JSON.parse(JSON.stringify(input));
  const courseIds = new Set(data.courses.map((course) => course.id));
  if (courseIds.size !== data.courses.length) throw new Error('课表 JSON 存在重复的课程 ID');
  const scheduleIdsByCourse = new Map();
  data.courses.forEach((course) => {
    if (!Array.isArray(course.schedules)) throw new Error('课表 JSON 缺少课程安排');
    const ids = new Set(course.schedules.map((schedule) => schedule.id));
    if (ids.size !== course.schedules.length) throw new Error('课表 JSON 存在重复的安排 ID');
    scheduleIdsByCourse.set(course.id, ids);
  });
  const lessonIds = new Set(data.lessons.map((lesson) => lesson.id));
  if (lessonIds.size !== data.lessons.length) throw new Error('课表 JSON 存在重复的课次 ID');
  data.lessons.forEach((lesson) => {
    if (
      !courseIds.has(lesson.courseId) ||
      !scheduleIdsByCourse.get(lesson.courseId)?.has(lesson.scheduleId)
    ) {
      throw new Error('课表 JSON 存在无效的课程或安排引用');
    }
    lesson.week = Number(lesson.week);
    lesson.weekday = Number(lesson.weekday);
    lesson.periods = uniqueNumbers((lesson.periods || []).map(Number));
    if (
      !Number.isInteger(lesson.week) ||
      lesson.week < 1 ||
      !Number.isInteger(lesson.weekday) ||
      lesson.weekday < 1 ||
      lesson.weekday > 7 ||
      !lesson.periods.length ||
      lesson.periods.some((period) => !Number.isInteger(period) || period < 1 || period > 10)
    ) {
      throw new Error('课表 JSON 存在无效的周次、星期或节次');
    }
    lesson.slotKeys = lesson.periods.map((period) => buildSlotKey(lesson.week, lesson.weekday, period));
  });
  data.lessons.sort(compareLesson);
  data.sourceUrl = data.sourceUrl || '';
  data.source = data.source || { type: 'text', input: data.sourceUrl };
  data.owner = normalizeOwner(data.owner);
  data.meta = data.meta || {};
  data.meta.timezone = data.meta.timezone || timezone;
  data.meta.timezoneOffset = data.meta.timezoneOffset || timezoneOffset;
  data.meta.weekRange = getWeekRange(data.lessons);
  data.meta.dateRange = getDateRange(data.lessons);
  data.meta.totalLessons = data.lessons.length;
  data.meta.totalRawLessons = Number(data.meta.totalRawLessons) || data.lessons.length;
  data.meta.totalCourses = data.courses.length;
  data.meta.totalSchedules = data.courses.reduce((sum, course) => sum + (course.schedules?.length || 0), 0);
  data.byDate = buildByDate(data.lessons);
  data.busySlots = buildBusySlots(data.lessons);
  return data;
}

/** 按 date 分组课次 id（1.x 行 1027-1035）。 */
export function buildByDate(lessons) {
  const result = {};
  lessons.forEach((lesson) => {
    if (!lesson.date) return;
    if (!result[lesson.date]) result[lesson.date] = [];
    result[lesson.date].push(lesson.id);
  });
  return result;
}

/** 构 slotKey → lessonIds 占用表（1.x 行 1037-1046）。 */
export function buildBusySlots(lessons) {
  // P3 微优化：原 `result[key].includes(lesson.id)` 数组线性去重 O(n²)（同 key 多 lesson 或 lesson.periods 含
  // 重复 period 时退化明显）；改 `seen` Set 全局去重 O(n)。输出数组顺序不变（按首次出现 push，与 includes
  // 去重后顺序语义一致）。
  const result = {};
  const seen = new Set();
  lessons.forEach((lesson) =>
    lesson.periods.forEach((period) => {
      const key = buildSlotKey(lesson.week, lesson.weekday, period);
      if (!key) return;
      const dedupeKey = `${key}|${lesson.id}`;
      if (seen.has(dedupeKey)) return;
      seen.add(dedupeKey);
      if (!result[key]) result[key] = [];
      result[key].push(lesson.id);
    })
  );
  return Object.fromEntries(Object.entries(result).sort(([left], [right]) => compareSlotKeys(left, right)));
}

/** 构 course/schedule/lesson 三张查找表（1.x 行 1048-1057）。 */
export function getMaps(data) {
  const courses = new Map(data.courses.map((course) => [course.id, course]));
  const schedules = new Map();
  data.courses.forEach((course) =>
    (course.schedules || []).forEach((schedule) => {
      schedules.set(`${course.id}|${schedule.id}`, schedule);
      if (!schedules.has(schedule.id)) schedules.set(schedule.id, schedule);
    })
  );
  const lessons = new Map(data.lessons.map((lesson) => [lesson.id, lesson]));
  return { courses, schedules, lessons };
}

/** 取某 lesson 的 course/schedule/teacher 明细（1.x 行 1059-1070）。 */
export function getLessonDetail(maps, lesson) {
  const course = maps.courses.get(lesson.courseId) || {};
  const schedule =
    maps.schedules.get(`${lesson.courseId}|${lesson.scheduleId}`) ||
    maps.schedules.get(lesson.scheduleId) ||
    {};
  const teachers = lesson.teachers || schedule.teachers || course.teachers || [];
  return {
    course,
    schedule,
    teachers,
    teacherText: lesson.teacherText || schedule.teacherText || course.teacherText || teachers.join('、'),
    room: schedule.room || schedule.location || '',
  };
}

/** 判定某时段是空闲/忙碌/线上可协调（Constant 平级，1.x 行 1585-1589）。 */
export function classifyScheduleSlot(lessons, isOnline) {
  const values = Array.isArray(lessons) ? lessons : [];
  if (!values.length) return 'free';
  return values.some((lesson) => !isOnline(lesson)) ? 'busy' : 'online';
}

/** 汇总多人在某时段的空闲状态文本（Constant 平级，1.x 行 1591-1604）。 */
export function summarizePeopleAvailability(states) {
  const values = Array.isArray(states) ? states : [];
  if (!values.length) return { status: 'empty', text: '尚未添加课表' };
  if (values.every((status) => status === 'free')) {
    return { status: 'free', text: '全部人员全时段完全空闲' };
  }
  if (values.every((status) => status === 'free' || status === 'online')) {
    return { status: 'online', text: '全部人员可协调（含线上课程）' };
  }
  const availableCount = values.filter((status) => status !== 'busy').length;
  return availableCount
    ? { status: 'partial', text: `${availableCount}/${values.length} 人存在空闲或可协调时段` }
    : { status: 'none', text: '无人空闲' };
}

/** owner 归一化（1.x 行 1199-1203）。 */
export function normalizeOwner(owner) {
  if (!owner) return { id: '', name: '' };
  if (typeof owner === 'string') return { id: owner, name: owner };
  return { id: normalizeText(owner.id), name: normalizeText(owner.name) };
}

/** rawLesson 排序：按 start 本地时间再 id（1.x 行 1169-1171）。 */
export function compareRawLesson(left, right) {
  return left.start.dateTimeLocal.localeCompare(right.start.dateTimeLocal) || left.id.localeCompare(right.id);
}

/** lesson 排序：date→week→weekday→首节次→id（1.x 行 1173-1179）。 */
export function compareLesson(left, right) {
  return (
    String(left.date || '').localeCompare(String(right.date || '')) ||
    Number(left.week) - Number(right.week) ||
    Number(left.weekday) - Number(right.weekday) ||
    (left.periods?.[0] || 999) - (right.periods?.[0] || 999) ||
    String(left.id).localeCompare(String(right.id))
  );
}

/** schedule 排序：weekday→首节次→room（1.x 行 1181-1185）。 */
export function compareSchedule(left, right) {
  return (
    left.weekday - right.weekday ||
    (left.periods?.[0] || 999) - (right.periods?.[0] || 999) ||
    String(left.room || '').localeCompare(String(right.room || ''), 'zh-Hans-CN')
  );
}
