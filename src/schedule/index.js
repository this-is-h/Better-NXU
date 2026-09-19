/**
 * schedule — 课表内核对外 API 桶文件
 * 对应 1.x：CourseScheduleTools IIFE return 行 1278-1291（对外导出面）+ buildJwglExcelTables（Constant 平级）
 * 依赖：内部各子模块（schema/ics-parser/schedule-model/week-compute/excel-build）
 * 入口/被谁调用：crypto/*（B4 encryptSchedule 调 normalize、校验 schemaVersion）、
 *                sites/jwgl & webvpn-tools（B6/B7 课表美化/导出/空闲聚合/课表信息面板）
 *
 * 对外面（保持与 1.x `CourseScheduleTools.*` 同名，便于 B6/B7 调用点逐字迁移 `import { foo } from '@/schedule'`）：
 *   schemaVersion, periodTimes, fetchFromUrl, parseIcs, buildFromJwgl, normalize,
 *   getMaps, getLessonDetail, formatWeeks, formatPeriods, weekdayText, stableId
 *   + buildJwglExcelTables, classifyScheduleSlot, summarizePeopleAvailability（1.x Constant 平级 helper）
 *
 * B3 拆分（02 §2）：纯逻辑内核，不 import sites/composables（02 §3）；
 * GM 网络 API 由 ics-parser 通过 #gm 导入，window.location.href 仅 buildFromJwgl 用（page 上下文可见）。
 */

import { schemaVersion, periodTimes } from './schema.js';
import { requestText } from './ics-parser.js';
import {
  parseIcs,
  buildFromJwgl,
  normalize,
  getMaps,
  getLessonDetail,
  classifyScheduleSlot,
  summarizePeopleAvailability,
} from './schedule-model.js';
import { formatWeeks, formatPeriods, weekdayText } from './week-compute.js';
import { stableId } from './_helpers.js';
import { buildJwglExcelTables } from './excel-build.js';

/** 按 URL 拉 ICS 并解析为 schedule（1.x fetchFromUrl 行 458-466）。 */
export async function fetchFromUrl(url, options = {}) {
  const icsText = await requestText(url);
  return parseIcs(icsText, {
    ...options,
    sourceType: 'ics',
    sourceUrl: url,
    sourceInput: url,
  });
}

export {
  schemaVersion,
  periodTimes,
  parseIcs,
  buildFromJwgl,
  normalize,
  getMaps,
  getLessonDetail,
  formatWeeks,
  formatPeriods,
  weekdayText,
  stableId,
  buildJwglExcelTables,
  classifyScheduleSlot,
  summarizePeopleAvailability,
};
