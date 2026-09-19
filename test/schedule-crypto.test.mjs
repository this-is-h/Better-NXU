import test from 'node:test';
import assert from 'node:assert/strict';

import { parseIcs } from '../src/schedule/index.js';
import {
  decryptEnvelope,
  encryptSchedule,
  generateKeyPair,
  importPrivateKey,
  inspectEnvelope,
} from '../src/crypto/index.js';

const ICS_FIXTURE = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Better NXU Test//CN',
  'X-WR-CALNAME:测试课表',
  'X-WR-TIMEZONE:Asia/Shanghai',
  'BEGIN:VEVENT',
  'UID:test-1',
  'DTSTART;TZID=Asia/Shanghai:20260223T081000',
  'DTEND;TZID=Asia/Shanghai:20260223T094500',
  'SUMMARY:高等数学',
  'LOCATION:文荟楼101',
  'END:VEVENT',
  'END:VCALENDAR',
].join('\r\n');

test('ICS parsing produces a normalized two-period lesson', () => {
  const schedule = parseIcs(ICS_FIXTURE, { owner: { id: '20260001', name: '测试用户' } });

  assert.equal(schedule.schemaVersion, '2.0');
  assert.equal(schedule.meta.calendarName, '测试课表');
  assert.equal(schedule.meta.totalCourses, 1);
  assert.equal(schedule.meta.totalLessons, 1);
  assert.equal(schedule.courses[0].name, '高等数学');
  assert.deepEqual(schedule.lessons[0].periods, [1, 2]);
  assert.equal(schedule.lessons[0].date, '2026-02-23');
});

test('schedule encryption round-trips through RSA-OAEP and AES-GCM', { timeout: 30_000 }, async () => {
  const schedule = parseIcs(ICS_FIXTURE);
  const keyPair = await generateKeyPair();
  const envelope = await encryptSchedule(schedule, keyPair.publicKey);
  const privateKey = await importPrivateKey(keyPair.privateKey);
  const plaintext = await decryptEnvelope(envelope, privateKey);
  const restored = JSON.parse(plaintext);

  assert.equal(inspectEnvelope(envelope).header.kid, keyPair.keyId);
  assert.equal(restored.schemaVersion, schedule.schemaVersion);
  assert.equal(restored.courses[0].name, '高等数学');
  assert.deepEqual(restored.lessons[0].periods, [1, 2]);
});
