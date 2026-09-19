import test from 'node:test';
import assert from 'node:assert/strict';

import { buildJwglExcelTables } from '../src/schedule/excel-build.js';
import { parseIcs } from '../src/schedule/index.js';

const ICS_FIXTURE = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Better NXU Test//CN',
  'X-WR-TIMEZONE:Asia/Shanghai',
  'BEGIN:VEVENT',
  'UID:excel-1',
  'DTSTART;TZID=Asia/Shanghai:20260223T081000',
  'DTEND;TZID=Asia/Shanghai:20260223T094500',
  'SUMMARY:高等数学',
  'LOCATION:文荟楼101',
  'END:VEVENT',
  'END:VCALENDAR',
].join('\r\n');

test('buildJwglExcelTables produces timetable and detail rows from a schedule', () => {
  const schedule = parseIcs(ICS_FIXTURE);
  const { timetableRows, detailRows, arrangementCount } = buildJwglExcelTables(schedule);

  assert.equal(arrangementCount, 1);
  assert.equal(timetableRows.length, 6); // 表头 + 5 个节次组
  assert.deepEqual(timetableRows[0], ['节次 / 时间', '周一', '周二', '周三', '周四', '周五', '周六', '周日']);
  // 周一 1-2 节应含课程名与教室
  const mondayCell = timetableRows[1][1];
  assert.match(mondayCell, /高等数学/);
  assert.match(mondayCell, /文荟楼101/);
  // 详情行：表头 + 1 条安排
  assert.equal(detailRows.length, 2);
  assert.equal(detailRows[1][0], '高等数学');
  assert.match(detailRows[1][3], /周一/);
});

test('buildJwglExcelTables rejects a schedule with no exportable arrangements', () => {
  assert.throws(
    () =>
      buildJwglExcelTables({
        schemaVersion: '2.0',
        courses: [{ id: 'c1', name: '空课', schedules: [{ id: 's-x', weekday: 9, periods: [1] }] }],
        lessons: [],
      }),
    /没有可导出的课程安排/
  );
});

test('buildJwglExcelTables rejects an invalid schedule object', () => {
  assert.throws(() => buildJwglExcelTables(null), /仅支持 Better NXU 2\.0 课表 JSON/);
});
