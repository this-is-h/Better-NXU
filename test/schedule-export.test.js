import test from 'node:test';
import assert from 'node:assert/strict';
import {
  personalScheduleFilename,
  prepareCurrentScheduleExport,
  prepareCurrentScheduleImageExport,
  selectImageExportName,
} from '../src/sites/webvpn/components/tools/schedule-export.js';

const blankSchedule = () => ({ schemaVersion: '2.0', courses: [], lessons: [] });
const owner = { id: '100000', name: '测试用户' };

test('switching schedules during identity confirmation does not bind that owner to new data', async () => {
  const original = blankSchedule();
  const replacement = blankSchedule();
  let current = original;
  let prepareCalls = 0;
  await assert.rejects(
    prepareCurrentScheduleExport({
      getSchedule: () => current,
      async getOwner() {
        current = replacement;
        return owner;
      },
      prepareExport: async () => prepareCalls++,
    }),
    { code: 'SCHEDULE_CHANGED' }
  );
  assert.equal(prepareCalls, 0);
  assert.equal(current, replacement);
  assert.equal(original.owner, undefined);
  assert.equal(replacement.owner, undefined);
});

test('switching schedules during export options discards the old export result', async () => {
  const original = blankSchedule();
  const replacement = blankSchedule();
  let current = original;
  await assert.rejects(
    prepareCurrentScheduleExport({
      getSchedule: () => current,
      getOwner: async () => owner,
      async prepareExport() {
        current = replacement;
        return { content: 'old export' };
      },
    }),
    { code: 'SCHEDULE_CHANGED' }
  );
  assert.equal(current, replacement);
  assert.equal(replacement.owner, undefined);
});

test('unchanged schedules export normalized data without mutating the original', async () => {
  const original = blankSchedule();
  const result = await prepareCurrentScheduleExport({
    getSchedule: () => original,
    getOwner: async () => owner,
    prepareExport: async (data) => ({ content: JSON.stringify(data), encrypted: false }),
  });
  assert.deepEqual(result.data.owner, owner);
  assert.deepEqual(JSON.parse(result.result.content), result.data);
  assert.equal(original.owner, undefined);
});

test('first image export confirms the saved account and uses its returned name without mutating owner', async () => {
  const schedule = { ...blankSchedule(), owner: { id: '', name: '' } };
  const steps = [];
  const result = await prepareCurrentScheduleImageExport({
    getSchedule: () => schedule,
    getViewKey: () => 'personal:0',
    getName: (data) =>
      selectImageExportName({
        studentId: '100000',
        owner: data.owner,
        confirmAccountName: async (id) => {
          steps.push(['confirm', id]);
          return true;
        },
        getOwner: async (id) => {
          steps.push(['lookup', id]);
          return owner;
        },
        requestName: () => assert.fail('name input must not open'),
      }),
  });
  assert.equal(result.filename, '测试用户 - 课表.png');
  assert.deepEqual(steps, [
    ['confirm', '100000'],
    ['lookup', '100000'],
  ]);
  assert.deepEqual(schedule.owner, { id: '', name: '' });
});

test('manual image names require no account lookup and never change JSON identity', async () => {
  const existingOwner = { ...owner };
  for (const studentId of ['100000', '']) {
    const name = await selectImageExportName({
      studentId,
      owner: existingOwner,
      confirmAccountName: async () => false,
      getOwner: () => assert.fail('manual name must not look up an account'),
      requestName: async () => '  图片姓名  ',
    });
    assert.equal(name, '图片姓名');
    assert.deepEqual(existingOwner, owner);
  }
});

test('an already verified name still needs confirmation but does not repeat the lookup', async () => {
  let confirmations = 0;
  assert.equal(
    await selectImageExportName({
      studentId: owner.id,
      owner,
      confirmAccountName: async () => {
        confirmations++;
        return true;
      },
      getOwner: () => assert.fail('verified account must be reused'),
      requestName: () => assert.fail('manual prompt not chosen'),
    }),
    owner.name
  );
  assert.equal(confirmations, 1);
});

test('name lookup failures offer manual entry while cancellation never produces an image filename', async () => {
  let fallbackNotices = 0;
  const options = {
    studentId: '100000',
    confirmAccountName: async () => true,
    getOwner: async () => {
      throw new Error('network unavailable');
    },
    requestName: async () => '手动姓名',
    onLookupError: () => fallbackNotices++,
  };
  assert.equal(await selectImageExportName(options), '手动姓名');
  assert.equal(fallbackNotices, 1);
  await assert.rejects(selectImageExportName({ ...options, requestName: async () => '' }), {
    code: 'EXPORT_CANCELLED',
  });
  await assert.rejects(
    selectImageExportName({
      ...options,
      getOwner: async () => {
        throw new DOMException('cancelled', 'AbortError');
      },
      requestName: () => assert.fail('abort must not reopen a prompt'),
    }),
    { name: 'AbortError' }
  );
});

test('image name confirmation rejects changed schedules or selected weeks', async () => {
  for (const change of ['schedule', 'view']) {
    let schedule = blankSchedule();
    let view = 'personal:0';
    await assert.rejects(
      prepareCurrentScheduleImageExport({
        getSchedule: () => schedule,
        getViewKey: () => view,
        getName: async () => {
          if (change === 'schedule') schedule = blankSchedule();
          else view = 'personal:1';
          return '图片姓名';
        },
      }),
      { code: 'SCHEDULE_CHANGED' }
    );
  }
});

test('image filename sanitizes invalid filename characters and its final guard catches a later view change', async () => {
  assert.equal(personalScheduleFilename(' 名/姓:字\n ', 'png'), '名_姓_字 - 课表.png');
  const schedule = blankSchedule();
  let view = 'personal:0';
  const result = await prepareCurrentScheduleImageExport({
    getSchedule: () => schedule,
    getViewKey: () => view,
    getName: async () => '图片姓名',
  });
  view = 'overview';
  assert.throws(result.assertCurrent, { code: 'SCHEDULE_CHANGED' });
});
