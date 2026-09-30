import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildPersonalCourseEntries,
  buildPersonalCourseLayout,
  buildPersonalCourseGridStyle,
} from '../src/sites/webvpn/components/tools/schedule-view.js';

function schedule(arrangements) {
  const courses = new Map();
  const lessons = [];
  arrangements.forEach(
    ({ id, periods, weeks = [1], weekday = 2, teacher = '教师甲', room = '教室甲' }, i) => {
      if (!courses.has(id)) courses.set(id, { id, name: id, schedules: [] });
      const scheduleId = `arrangement-${i}`;
      courses.get(id).schedules.push({ id: scheduleId, teachers: teacher ? [teacher] : [], room });
      weeks.forEach((week) =>
        lessons.push({ id: `${i}-${week}`, courseId: id, scheduleId, periods, week, weekday })
      );
    }
  );
  return { courses: [...courses.values()], lessons, meta: { weekRange: { end: 20 } } };
}

const weeks = (start, end) => Array.from({ length: end - start + 1 }, (_, i) => start + i);
const layout = (data, week = 0) => buildPersonalCourseLayout(buildPersonalCourseEntries(data, week));

test('overview preserves a long lesson beside two shorter lessons in other weeks', () => {
  const data = schedule([
    { id: '长课', periods: [5, 6, 7, 8], weeks: weeks(1, 5) },
    { id: '短课甲', periods: [5, 6], weeks: weeks(6, 10) },
    { id: '短课乙', periods: [7, 8], weeks: weeks(6, 10) },
  ]);
  const [group] = layout(data);
  assert.equal(group.columnCount, 2);
  assert.equal(group.gridStyle.gridRow, '6 / span 4');
  const byName = Object.fromEntries(group.entries.map((entry) => [entry.name, entry]));
  assert.equal(byName.长课.gridStyle.gridRow, '1 / span 4');
  assert.equal(byName.短课甲.gridStyle.gridRow, '1 / span 2');
  assert.equal(byName.短课乙.gridStyle.gridRow, '3 / span 2');
  assert.equal(byName.短课甲.gridStyle.gridColumn, byName.短课乙.gridStyle.gridColumn);
  assert.notEqual(byName.长课.gridStyle.gridColumn, byName.短课甲.gridStyle.gridColumn);
  assert.deepEqual(
    layout(data, 3).map((group) => group.columnCount),
    [1]
  );
  assert.deepEqual(
    layout(data, 8).map((group) => group.columnCount),
    [1, 1]
  );
});

test('nested, chained and identical intervals occupy separate columns only while needed', () => {
  const [group] = layout(
    schedule([
      { id: '全天', periods: weeks(1, 10) },
      { id: '前段', periods: [1, 2, 3] },
      { id: '嵌套', periods: [2] },
      { id: '交叉', periods: [3, 4, 5] },
      { id: '同段', periods: [3, 4, 5] },
      { id: '后段', periods: [6, 7, 8, 9, 10] },
    ])
  );
  assert.equal(group.columnCount, 4);
  for (let period = 1; period <= 10; period++) {
    const columns = new Set();
    for (const entry of group.entries.filter((item) => item.periods.includes(period))) {
      assert.ok(!columns.has(entry.column), `${entry.name} overlaps another card at period ${period}`);
      columns.add(entry.column);
      assert.equal(entry.gridStyle.gridRow, `${entry.startPeriod} / span ${entry.periods.length}`);
    }
  }
  assert.deepEqual(layout(schedule([{ id: '空周', periods: [1] }]), 2), []);
});

test('nonconsecutive periods retain gaps and different weekdays never share a group', () => {
  const groups = layout(
    schedule([
      { id: '分段', periods: [1, 2, 5, 6], weekday: 1 },
      { id: '周日', periods: [1, 2], weekday: 7 },
    ])
  );
  assert.deepEqual(
    groups.map(({ weekday, startPeriod, endPeriod }) => [weekday, startPeriod, endPeriod]),
    [
      [1, 1, 2],
      [1, 5, 6],
      [7, 1, 2],
    ]
  );
  assert.deepEqual(
    groups.flatMap((group) => group.entries.map((entry) => entry.periodText)),
    ['1-2', '5-6', '1-2']
  );
});

test('every pair of valid period intervals preserves its extent without sharing occupied columns', () => {
  const intervals = [];
  for (let start = 1; start <= 10; start++) {
    for (let end = start; end <= 10; end++) intervals.push(weeks(start, end));
  }
  for (const left of intervals) {
    for (const right of intervals) {
      const groups = layout(
        schedule([
          { id: '甲', periods: left },
          { id: '乙', periods: right },
        ])
      );
      const overlaps = left.some((period) => right.includes(period));
      assert.equal(groups.length, overlaps ? 1 : 2);
      for (const group of groups) {
        assert.equal(group.columnCount, overlaps ? 2 : 1);
        for (const entry of group.entries) {
          const periods = entry.name === '甲' ? left : right;
          assert.deepEqual(entry.periods, periods);
          assert.equal(
            entry.gridStyle.gridRow,
            `${periods[0] - group.startPeriod + 1} / span ${periods.length}`
          );
        }
        if (overlaps) assert.notEqual(group.entries[0].column, group.entries[1].column);
      }
    }
  }
});

test('only days with overlapping cards widen, using the largest simultaneous column count', () => {
  const groups = layout(
    schedule([
      { id: '甲', periods: [1, 2] },
      { id: '乙', periods: [1, 2] },
      { id: '丙', periods: [5, 6] },
      { id: '丁', periods: [5, 6], weekday: 7 },
    ])
  );
  assert.equal(
    buildPersonalCourseGridStyle(groups).gridTemplateColumns,
    '92px minmax(130px, 1fr) minmax(260px, 1fr) minmax(130px, 1fr) minmax(130px, 1fr) minmax(130px, 1fr) minmax(130px, 1fr) minmax(130px, 1fr)'
  );
  assert.equal(
    buildPersonalCourseGridStyle([]).gridTemplateColumns,
    `92px ${Array(7).fill('minmax(130px, 1fr)').join(' ')}`
  );
  assert.equal(buildPersonalCourseGridStyle(groups).minWidth, '1141px');
  assert.equal(buildPersonalCourseGridStyle([]).minWidth, '1011px');
});

test('teacher and room details merge identical arrangements and preserve changed and missing details', () => {
  const [entry] = buildPersonalCourseEntries(
    schedule([
      { id: '课程', periods: [1, 2], weeks: [1, 3] },
      { id: '课程', periods: [1, 2], weeks: [5] },
      { id: '课程', periods: [1, 2], weeks: [2, 4], room: '教室乙' },
      { id: '课程', periods: [1, 2], weeks: [6], teacher: '教师乙', room: '教室乙' },
      { id: '课程', periods: [1, 2], weeks: [7], teacher: '', room: '' },
    ])
  );
  assert.equal(entry.variants.length, 4);
  assert.deepEqual(
    entry.variants.map((variant) => variant.weeks),
    [[1, 3, 5], [2, 4], [6], [7]]
  );
  assert.deepEqual(
    entry.variants.map((variant) => variant.detailText),
    ['教师甲 · 教室甲', '教师甲 · 教室乙', '教师乙 · 教室乙', '未注明教师与教室']
  );
});

test('course colors do not collide and remain stable across weeks and input order', () => {
  const data = schedule(
    Array.from({ length: 80 }, (_, i) => ({
      id: `课程-${i}`,
      periods: [1, 2],
      weeks: [(i % 2) + 1],
    }))
  );
  const entries = buildPersonalCourseEntries(data);
  const colors = new Map(entries.map((entry) => [entry.name, entry.color]));
  assert.equal(new Set(colors.values()).size, 80);
  const reordered = { ...data, courses: [...data.courses].reverse(), lessons: [...data.lessons].reverse() };
  for (const week of [0, 1, 2]) {
    for (const entry of buildPersonalCourseEntries(reordered, week)) {
      assert.equal(entry.color, colors.get(entry.name));
    }
  }
  const repeated = buildPersonalCourseEntries(
    schedule([
      { id: '同课', weekday: 1, periods: [1, 2] },
      { id: '同课', weekday: 5, periods: [3, 4] },
    ])
  );
  assert.equal(repeated[0].color, repeated[1].color);
});
