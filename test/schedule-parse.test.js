import test from 'node:test';
import assert from 'node:assert/strict';

import { parseScheduleJson, classifyScheduleFileContent } from '../src/crypto/parse.js';
import { parseIcs } from '../src/schedule/index.js';
import { encryptSchedule, generateKeyPair } from '../src/crypto/index.js';

const ICS_FIXTURE = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Better NXU Test//CN',
  'X-WR-TIMEZONE:Asia/Shanghai',
  'BEGIN:VEVENT',
  'UID:parse-1',
  'DTSTART;TZID=Asia/Shanghai:20260223T081000',
  'DTEND;TZID=Asia/Shanghai:20260223T094500',
  'SUMMARY:高等数学',
  'LOCATION:文荟楼101',
  'END:VEVENT',
  'END:VCALENDAR',
].join('\r\n');

test('parseScheduleJson round-trips a valid schedule', () => {
  const schedule = parseIcs(ICS_FIXTURE);
  const restored = parseScheduleJson(JSON.stringify(schedule));

  assert.equal(restored.meta.totalCourses, 1);
  assert.equal(restored.courses[0].name, '高等数学');
});

test('parseScheduleJson distinguishes plain and encrypted error codes', () => {
  assert.throws(() => parseScheduleJson('not-json'), /文件不是有效的 JSON/);
  assert.throws(() => parseScheduleJson('not-json', true), /文件已解密，但其中不是有效的课表 JSON/);

  const invalidSchedule = JSON.stringify({
    schemaVersion: '2.0',
    courses: [{ id: 'c1' }],
    lessons: [{ courseId: 'ghost', scheduleId: 'ghost', week: 1, weekday: 1, periods: [1] }],
  });
  assert.throws(() => parseScheduleJson(invalidSchedule), /课表文件无效/);
  assert.throws(() => parseScheduleJson(invalidSchedule, true), /文件已解密，但课表内容无效/);
});

test('classifyScheduleFileContent rejects invalid JSON and oversized content', () => {
  assert.throws(() => classifyScheduleFileContent('{{{'), /文件不是有效的 JSON/);

  const bigText = 'x'.repeat(8 * 1024 * 1024);
  assert.throws(() => classifyScheduleFileContent(bigText), /课表文件不能超过 7 MB/);
});

test('classifyScheduleFileContent classifies plain schedules without size limit hit', () => {
  const schedule = parseIcs(ICS_FIXTURE);
  const result = classifyScheduleFileContent(JSON.stringify(schedule));

  assert.equal(result.kind, 'plain');
});

test(
  'classifyScheduleFileContent flags encrypted envelopes and returns header',
  { timeout: 30_000 },
  async () => {
    const schedule = parseIcs(ICS_FIXTURE);
    const keyPair = await generateKeyPair();
    const envelope = await encryptSchedule(schedule, keyPair.publicKey);

    const result = classifyScheduleFileContent(JSON.stringify(envelope));
    assert.equal(result.kind, 'encrypted');
    assert.ok(result.header);
    assert.ok(result.parsed);
  }
);

test('classifyScheduleFileContent treats non-envelope JSON as plain', () => {
  const result = classifyScheduleFileContent(JSON.stringify({ foo: 'bar' }));

  assert.equal(result.kind, 'plain');
});
