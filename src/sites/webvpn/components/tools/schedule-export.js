import { normalize } from '../../../../schedule/index.js';

export function personalScheduleFilename(name, extension) {
  const safeName = String(name || '')
    .trim()
    .replace(/[\\/:*?"<>|\p{Cc}]/gu, '_');
  return `${safeName || '未命名用户'} - 课表.${extension}`;
}

/** 图片命名不写入课表 owner，手动姓名不能作为 JSON 身份核验结果。 */
export async function selectImageExportName({
  studentId,
  owner,
  confirmAccountName,
  requestName,
  getOwner,
  onLookupError,
}) {
  const id = String(studentId || '').trim();
  if (id && (await confirmAccountName(id, owner))) {
    try {
      const account = owner?.id === id && owner?.name?.trim() ? owner : await getOwner(id);
      const name = String(account?.name || '').trim();
      if (!name) throw new Error('当前学号未返回姓名');
      return name;
    } catch (error) {
      if (error?.name === 'AbortError') throw error;
      onLookupError?.(error);
    }
  }
  const name = String((await requestName(owner?.name || '')) || '').trim();
  if (!name) {
    const error = new Error('已取消图片导出');
    error.code = 'EXPORT_CANCELLED';
    throw error;
  }
  return name;
}

/** 姓名弹窗期间切换课表、周次或视图时，不能把原姓名用于新的图片。 */
export async function prepareCurrentScheduleImageExport({ getSchedule, getViewKey, getName }) {
  const original = getSchedule();
  const viewKey = getViewKey();
  const assertCurrent = () => {
    if (!original || getSchedule() !== original || getViewKey() !== viewKey) {
      const error = new Error('课表或视图已切换，请重新导出图片');
      error.code = 'SCHEDULE_CHANGED';
      throw error;
    }
  };
  assertCurrent();
  const name = await getName(original);
  assertCurrent();
  return { filename: personalScheduleFilename(name, 'png'), assertCurrent };
}

/** 身份确认和加密弹窗期间，导出始终绑定用户最初选择的课表。 */
export async function prepareCurrentScheduleExport({ getSchedule, getOwner, prepareExport }) {
  const original = getSchedule();
  const assertCurrent = () => {
    if (!original || getSchedule() !== original) {
      const error = new Error('课表已切换，请重新发起导出');
      error.code = 'SCHEDULE_CHANGED';
      throw error;
    }
  };
  assertCurrent();
  const owner = await getOwner();
  assertCurrent();
  const data = normalize({ ...original, owner });
  const result = await prepareExport(data);
  assertCurrent();
  return { data, result };
}
