/**
 * schema — 课表数据 schema 常量与学期节次、时区配置
 * 对应 1.x：Better NXU.user.js 行 398-413（CourseScheduleTools IIFE 顶部私有常量段）
 * 依赖：无（纯常量；被 schedule 其它子模块与 crypto/parse 共享）
 * 入口/被谁调用：ics-parser、schedule-model、week-compute、excel-build、index
 *
 * 说明（模型合同见 docs/dev/data-and-security.md）：
 * 1.x 这些常量是 CourseScheduleTools IIFE 内部的闭包 const，被(parseIcs/normalize/buildFromJwgl/
 * buildJwglExcelTables …)多处引用，也对外暴露（schemaVersion/periodTimes 见 IIFE return 行 1278-1290）。
 * 2.0 抽到独立子模块后，由需要的子模块按需 import，对外经 index 桶文件 re-export（保持 1.x 表面 API）。
 *
 * 关键不动量（C5 行为等价）：
 *  - schemaVersion 字面量是字符串 "2.0"（非数字 2.0），1.x 行 399、980、955、1279、1834 全部按字符串比较；
 *    2.0 must 保持字符串，任何 normalize 校验 `input.schemaVersion !== schemaVersion` 依赖此。
 *  - timezone/timezoneOffset 字面逐字保留（normalize 用作 meta 兜底，1.x 行 1014-1015）。
 *  - periodTimes 是 10 节次起止时刻表，逐字保留（periodsFromTimes/buildFromJwgl/buildJwglExcelTables 均依赖）。
 */

/** 课表 schema 版本（1.x 行 399；字符串 "2.0"，normalize 校验入口）。 */
export const schemaVersion = '2.0';

/** 默认时区（1.x 行 400；parseIcs 时区兜底与 meta.timezone 兜底）。 */
export const timezone = 'Asia/Shanghai';

/** 时区偏移（1.x 行 401；写入 meta.timezoneOffset）。 */
export const timezoneOffset = '+08:00';

/**
 * 全天 10 节次的起止时刻表（1.x 行 402-413）。
 * periodsFromTimes/buildFromJwgl/buildJwglExcelTables/periodGroups 依赖此推断节次号。
 */
export const periodTimes = [
  { period: 1, start: '08:10', end: '08:55' },
  { period: 2, start: '09:00', end: '09:45' },
  { period: 3, start: '10:15', end: '11:00' },
  { period: 4, start: '11:05', end: '11:50' },
  { period: 5, start: '14:00', end: '14:45' },
  { period: 6, start: '14:50', end: '15:35' },
  { period: 7, start: '15:55', end: '16:40' },
  { period: 8, start: '16:45', end: '17:30' },
  { period: 9, start: '19:00', end: '19:45' },
  { period: 10, start: '19:50', end: '20:35' },
];
