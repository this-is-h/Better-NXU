/**
 * ics-parser — ICS 日历文本 → rawLessons 解析（与后续 merge/build/record 解耦）
 * 对应 1.x：CourseScheduleTools IIFE 行 415-727（requestText / parseIcsText / parseIcsProperty /
 *           findUnquoted / splitUnquoted / addProperty / unescapeIcsText / eventToLesson /
 *           parseCourseDescription / splitGroupsAndTeachers / isLikelyTeacherText /
 *           splitTeacherNames / parsePeriodText / periodsFromTimes / parseIcsDateTime /
 *           findTimezone / getFirst）以及顶层 parseIcs 编排
 * 依赖：schema（schemaVersion/timezone/periodTimes）、week-compute（parseIcsDateTime 内部用
 *       getWeekdayNumber/weekdayText；formatPeriods/periodsFromTimes）、_helpers（stableId/normalizeText/
 *       uniqueBy/periods 解析）、utils/console（MyConsole）、#gm（GM.xmlHttpRequest）
 * 入口/被谁调用：index 桶文件 fetchFromUrl/parseIcs；B7 工具页上传 ICS 时调用
 *
 * B3 原则：函数体逐字迁出 1.x，仅显式化依赖、改命名 export。
 * 跨域请求使用 ScriptCat 官方 Promise API GM.xmlHttpRequest，由 vite-plugin-monkey 自动声明 grant。
 */
import { periodTimes } from './schema.js';
import { stableId, normalizeText, uniqueInOrder, uniqueNumbers } from './_helpers.js';
import { getWeekdayNumber, weekdayText } from './week-compute.js';
import { MyConsole } from '../utils/console.js';
import { GM } from '#gm';

/**
 * 取 ICS 文本（1.x 行 415-456）。
 * 唯一对 GM_* 的接触点；行为与 1.x 等价（带 20s 超时、状态/字节日志）。
 * @param {string} url
 * @returns {Promise<string>}
 */
export async function requestText(url) {
  const startedAt = Date.now();
  let timedOut = false;
  MyConsole('[课表请求] 开始获取 ICS 数据');
  try {
    const response = await GM.xmlHttpRequest({
      method: 'GET',
      url,
      responseType: 'text',
      timeout: 20000,
      ontimeout() {
        timedOut = true;
      },
    });
    if (response.status < 200 || response.status >= 300) {
      MyConsole(
        '[课表请求] ICS 接口返回异常状态',
        {
          status: response.status,
          durationMs: Date.now() - startedAt,
        },
        'error'
      );
      throw new Error(`课表请求失败：HTTP ${response.status}`);
    }
    const responseText = response.responseText || response.response || '';
    MyConsole(
      '[课表请求] ICS 数据获取完成',
      {
        status: response.status,
        durationMs: Date.now() - startedAt,
        bytes: String(responseText).length,
      },
      'info'
    );
    return responseText;
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('课表请求失败：HTTP ')) throw error;
    if (timedOut || error?.type === 'timeout' || error?.error === 'timeout') {
      MyConsole(
        '[课表请求] ICS 请求超时',
        {
          timeoutMs: 20000,
          durationMs: Date.now() - startedAt,
        },
        'warn'
      );
      throw new Error('课表请求超时，请稍后重试', { cause: error });
    }
    MyConsole(
      '[课表请求] ICS 请求发生网络错误',
      {
        durationMs: Date.now() - startedAt,
      },
      'error'
    );
    throw new Error('课表请求失败，请检查网络或登录状态', { cause: error });
  }
}

/**
 * ICS 属性名/参数解析（1.x 行 552-568）。
 * 处理引号保护下的冒号与分号，属性名大写，参数转义还原。
 */
export function parseIcsProperty(line) {
  const colonIndex = findUnquoted(line, ':');
  if (colonIndex < 0) return null;
  const left = line.slice(0, colonIndex);
  const [rawName, ...paramParts] = splitUnquoted(left, ';');
  const params = {};
  paramParts.forEach((part) => {
    const index = part.indexOf('=');
    if (index < 0) return;
    params[part.slice(0, index).toUpperCase()] = part.slice(index + 1).replace(/^"|"$/g, '');
  });
  return {
    name: rawName.toUpperCase(),
    params,
    value: unescapeIcsText(line.slice(colonIndex + 1)),
  };
}

/** 引号外查找字符（1.x 行 570-577）。 */
export function findUnquoted(text, target) {
  let quoted = false;
  for (let index = 0; index < text.length; index++) {
    if (text[index] === '"') quoted = !quoted;
    if (text[index] === target && !quoted) return index;
  }
  return -1;
}

/** 引号外按分隔符切分（1.x 行 579-592）。 */
export function splitUnquoted(text, delimiter) {
  const values = [];
  let quoted = false;
  let start = 0;
  for (let index = 0; index < text.length; index++) {
    if (text[index] === '"') quoted = !quoted;
    if (text[index] === delimiter && !quoted) {
      values.push(text.slice(start, index));
      start = index + 1;
    }
  }
  values.push(text.slice(start));
  return values;
}

/** 把属性累加进 target[name] 数组（1.x 行 594-597）。 */
export function addProperty(target, prop) {
  if (!target[prop.name]) target[prop.name] = [];
  target[prop.name].push(prop);
}

/** 还原 ICS 转义 \\\\ \\n \\, \\;（1.x 行 599-605）。 */
export function unescapeIcsText(text) {
  return String(text).replace(/\\\\/g, '\\').replace(/\\n/gi, '\n').replace(/\\,/g, ',').replace(/\\;/g, ';');
}

/** ICS 事件 → 单节课 lesson（1.x 行 607-644）。依赖 description 教师分组解析与时间→节次推断。 */
export function eventToLesson(event, context) {
  const startProp = event.DTSTART?.[0];
  const endProp = event.DTEND?.[0];
  if (!startProp || !endProp) return null;
  const summary = getFirst(event, 'SUMMARY');
  const description = getFirst(event, 'DESCRIPTION');
  const location = getFirst(event, 'LOCATION');
  const eventTimezone = startProp.params?.TZID || endProp.params?.TZID || context.timezone;
  const start = parseIcsDateTime(startProp.value, eventTimezone);
  const end = parseIcsDateTime(endProp.value, eventTimezone);
  const detail = parseCourseDescription(description, {
    summary,
    location,
    startTime: start.time,
    endTime: end.time,
  });
  if (!detail.name || !start.date) return null;
  const uid = getFirst(event, 'UID') || `event-${context.index + 1}`;
  return {
    id: stableId(
      [uid, start.dateTimeLocal, end.dateTimeLocal, detail.name, detail.teacherText, detail.room].join('|')
    ),
    name: detail.name,
    teachers: detail.teachers,
    teacherText: detail.teacherText,
    groups: detail.groups,
    date: start.date,
    weekday: start.weekday,
    weekdayText: start.weekdayText,
    start,
    end,
    startTime: detail.startTime || start.time,
    endTime: detail.endTime || end.time,
    periodText: detail.periodText,
    periods: detail.periods.length ? detail.periods : periodsFromTimes(start.time, end.time),
    campusOrBuilding: detail.campusOrBuilding,
    room: detail.room || location,
    location,
  };
}

/** DESCRIPTION 行结构化解析（教师/分组/节次），1.x 行 646-675。 */
export function parseCourseDescription(description, fallback) {
  const parts = String(description || '')
    .split('/')
    .map(normalizeText);
  if (parts.length >= 7) {
    const middle = splitGroupsAndTeachers(parts.slice(4, -2));
    return {
      startTime: parts[0],
      endTime: parts[1],
      periodText: parts[2],
      periods: parsePeriodText(parts[2]),
      name: parts[3] || fallback.summary,
      groups: middle.groups,
      teachers: middle.teachers,
      teacherText: middle.teacherText,
      campusOrBuilding: parts[parts.length - 2],
      room: parts[parts.length - 1] || fallback.location,
    };
  }
  return {
    startTime: fallback.startTime,
    endTime: fallback.endTime,
    periodText: '',
    periods: periodsFromTimes(fallback.startTime, fallback.endTime),
    name: fallback.summary,
    groups: [],
    teachers: [],
    teacherText: '',
    campusOrBuilding: '',
    room: fallback.location,
  };
}

/** 从值的尾部剥离教师部分（1.x 行 677-691）。 */
export function splitGroupsAndTeachers(values) {
  const items = values.map(normalizeText).filter(Boolean);
  let teacherIndex = items.length;
  for (let index = items.length - 1; index >= 0; index--) {
    if (isLikelyTeacherText(items[index])) teacherIndex = index;
    else break;
  }
  if (teacherIndex === items.length && items.length >= 2) teacherIndex = items.length - 1;
  const teachers = splitTeacherNames(items.slice(teacherIndex).join('、'));
  return {
    groups: items.slice(0, teacherIndex),
    teachers,
    teacherText: teachers.join('、'),
  };
}

/** 启发式判断是否教师名（1.x 行 693-701）。 */
export function isLikelyTeacherText(value) {
  const names = splitTeacherNames(value);
  return (
    names.length > 0 &&
    names.every((name) => {
      const text = normalizeText(name);
      return (
        text.length >= 2 &&
        text.length <= 8 &&
        /^[㐀-鿿·•A-Za-z.' -]+$/.test(text) &&
        !/[班组级课馆楼室院系专业方向文凭工程师实验实训中心]/.test(text)
      );
    })
  );
}

/** 拆分教师姓名（1.x 行 703-708）。 */
export function splitTeacherNames(text) {
  return uniqueInOrder(
    String(text || '')
      .split(/\s*(?:、|,|，|;|；|&|和|与)\s*/)
      .map(normalizeText)
      .filter((name) => name && name !== '等')
  );
}

/** "第1-3节"/"1,3" → 节次数值数组（1.x 行 710-721）。 */
export function parsePeriodText(text) {
  const result = [];
  String(text || '')
    .split(/[,\s，、]+/)
    .forEach((part) => {
      const range = part.match(/^(\d+)\s*-\s*(\d+)$/);
      if (range) {
        for (let value = Number(range[1]); value <= Number(range[2]); value++) result.push(value);
      } else if (Number.isFinite(Number(part)) && part !== '') {
        result.push(Number(part));
      }
    });
  return uniqueNumbers(result);
}

/** 起止时间 → 节次号数组（1.x 行 723-727）。 */
export function periodsFromTimes(startTime, endTime) {
  return periodTimes
    .filter((item) => item.start >= startTime && item.end <= endTime)
    .map((item) => item.period);
}

/** ICS 日期时间串 → {date,time,dateTimeLocal,weekday,weekdayText}（1.x 行 1072-1097）。 */
export function parseIcsDateTime(value, eventTimezone) {
  const raw = String(value || '');
  const match = raw.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?)?(Z)?$/);
  if (!match)
    return {
      raw,
      timezone: eventTimezone,
      date: '',
      time: '',
      dateTimeLocal: raw,
      weekday: null,
      weekdayText: '',
    };
  // eslint-disable-next-line prefer-const -- UTC 分支会重新赋值各时间分量
  let [, year, month, day, hour = '00', minute = '00', second = '00', utc] = match;
  if (utc) {
    const date = new Date(
      Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second)) +
        8 * 3600000
    );
    year = String(date.getUTCFullYear());
    month = String(date.getUTCMonth() + 1).padStart(2, '0');
    day = String(date.getUTCDate()).padStart(2, '0');
    hour = String(date.getUTCHours()).padStart(2, '0');
    minute = String(date.getUTCMinutes()).padStart(2, '0');
    second = String(date.getUTCSeconds()).padStart(2, '0');
  }
  const date = `${year}-${month}-${day}`;
  const weekday = getWeekdayNumber(Number(year), Number(month), Number(day));
  return {
    raw,
    timezone: eventTimezone,
    date,
    time: `${hour}:${minute}`,
    dateTimeLocal: `${date}T${hour}:${minute}:${second}`,
    weekday,
    weekdayText: weekdayText(weekday),
  };
}

/** 从事件属性数组取首个 value（1.x 行 1187-1189）。 */
export function getFirst(object, key) {
  return object[key]?.[0]?.value || '';
}

/** 在事件里探测首个 TZID 作为时区兜底（1.x 行 1191-1197）。 */
export function findTimezone(parsed) {
  for (const event of parsed.events) {
    const value = event.DTSTART?.[0]?.params?.TZID || event.DTEND?.[0]?.params?.TZID;
    if (value) return value;
  }
  return '';
}

/**
 * ICS 文本 → { calendar, events }（1.x 行 514-550）。
 * 折叠续行后逐行解析，按 BEGIN/END 堆栈把 VCALENDAR/VEVENT 属性累加进对应组件。
 */
export function parseIcsText(icsText) {
  const text = String(icsText || '');
  if (!/BEGIN:VCALENDAR/i.test(text)) {
    throw new Error('返回内容不是有效的 ICS 日历');
  }
  const calendar = {};
  const events = [];
  const stack = [];
  let currentEvent = null;
  const lines = text
    .replace(/\r\n[ \t]/g, '')
    .replace(/\n[ \t]/g, '')
    .replace(/\r[ \t]/g, '')
    .split(/\r\n|\n|\r/);
  for (const line of lines) {
    if (!line.trim()) continue;
    const prop = parseIcsProperty(line);
    if (!prop) continue;
    if (prop.name === 'BEGIN') {
      stack.push(prop.value);
      if (prop.value === 'VEVENT') currentEvent = {};
      continue;
    }
    if (prop.name === 'END') {
      if (prop.value === 'VEVENT' && currentEvent) {
        events.push(currentEvent);
        currentEvent = null;
      }
      stack.pop();
      continue;
    }
    const component = stack[stack.length - 1];
    if (currentEvent && component === 'VEVENT') addProperty(currentEvent, prop);
    else if (!currentEvent && component === 'VCALENDAR') addProperty(calendar, prop);
  }
  return { calendar, events };
}
