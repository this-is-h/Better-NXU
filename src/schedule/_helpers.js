/**
 * _helpers — schedule 内部共享的纯工具集合（私有助手，不对外经桶文件暴露）
 * 对应 1.x：CourseScheduleTools IIFE 内散落的通用私有函数（行 1147-1276）
 * 依赖：无
 * 入口/被谁调用：仅 schedule/* 子模块（ics-parser/schedule-model/week-compute/excel-build）import
 *
 * 为什么单独成文件（B3 "原样迁出、不动算法" + 02 §3 边界）：
 *  1.x 这些函数是 IIFE 闭包内的私有 helper，被 parseIcs/mergeLessonsToCourses/normalize/
 * weekdayText/formatWeeks/excel-build 等多方引用。2.0 拆分后若每子模块各自抄一份，会破坏
 * "同一 stableId/normalizeText 在一次解析中一致"的隐含语义且散点易漂移；02 §3 又禁止
 * schedule 以外的 utils 反向依赖 schedule。折中：在 schedule 内放一份私有 _helpers，
 * 仅供 schedule 子模块共享，不对外暴露（桶文件不 re-export），保持 1.x 私有作用域语义。
 *
 * 逐字迁出 1.x：下列函数体与 1.x 逐行一致（行号见各函数注释），仅包装为具名 export。
 */

/** 归一化空白（1.x 行 1256-1258）。 */
export function normalizeText(value) {
  return String(value || '')
    .trim()
    .replace(/\s+/g, ' ');
}

/** 数组去重保留首次出现顺序（1.x 行 1248-1250）。 */
export function uniqueInOrder(values) {
  return [...new Set((values || []).filter(Boolean))];
}

/** 字符串数组去重排序（1.x 行 1244-1246）。 */
export function uniqueSorted(values) {
  return [...new Set((values || []).filter(Boolean))].sort();
}

/** 数值数组去重并升序排序，过滤非有限值（1.x 行 1252-1254）。 */
export function uniqueNumbers(values) {
  return [...new Set((values || []).filter(Number.isFinite))].sort((left, right) => left - right);
}

/** 按 key 函数去重（1.x 行 1234-1242）。 */
export function uniqueBy(values, key) {
  const seen = new Set();
  return values.filter((value) => {
    const id = key(value);
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

/** 向 target 追加 values 中不重复的归一化文本（1.x 行 1227-1232）。 */
export function addManyUnique(target, values) {
  (values || []).forEach((value) => {
    const text = normalizeText(value);
    if (text && !target.includes(text)) target.push(text);
  });
}

/** 数组归一化文本去重后拼成逗号分隔字符串（1.x 行 1260-1262）。 */
export function stableArrayText(values) {
  return uniqueSorted((values || []).map(normalizeText)).join(',');
}

/** 两侧数组经 stableArrayText 比较（1.x 行 1264-1266）。 */
export function sameTextArray(left, right) {
  return stableArrayText(left) === stableArrayText(right);
}

/**
 * FNV-1a 哈希，返回 c_<base36> 形式稳定 ID（1.x 行 1268-1276）。
 * schedule 内 course/schedule/lesson 的 id 生成唯一稳定来源，桌面级防碰撞。
 */
export function stableId(input) {
  let hash = 2166136261;
  const text = String(input || '');
  for (let index = 0; index < text.length; index++) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `c_${(hash >>> 0).toString(36)}`;
}
