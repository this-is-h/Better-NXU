/**
 * 控制台统一日志入口
 * 对应 1.x：Better NXU.user.js 行 2085-2130（MyConsole + sanitizeConsoleDetail）
 * 依赖：无（纯 console 封装）
 * 入口/被谁调用：任一模块（main/router/utils/sites 等）import 拿取日志实例
 *
 * 设计：所有生产诊断统一经过 MyConsole 入口，既保留可追溯性，也集中约束敏感信息。
 * 返回的是一个带 scope 前缀的函数；message 可为对象，会经 sanitizeConsoleDetail 脱敏后打印。
 * 敏感字段（password/privateKey/token/cookie/密码/私钥 等）在打印 detail 时自动替换为 [已隐藏]。
 */

/**
 * 创建一个带固定 scope 前缀（如 "[初始化]"、"[ids.login]"）的日志函数。
 * @param {string} scope - 日志前缀，形如 `[模块.功能]`，用于区分来源。
 * @returns {(message: any, detail?: any, level?: 'debug'|'info'|'warn'|'error'|'log') => void}
 */
export function MyConsole(scope) {
  return function log(message, detail = '', level = 'log') {
    if (level === 'debug' && import.meta.env.PROD && globalThis.__BETTER_NXU_DEBUG__ !== true) return;
    const methodName = ['debug', 'info', 'warn', 'error', 'log'].includes(level) ? level : 'log';
    const write =
      typeof console[methodName] === 'function'
        ? console[methodName].bind(console)
        : console.log.bind(console);
    const timestamp = new Date().toLocaleTimeString('zh-CN', { hour12: false });
    const isObjectMessage = message !== null && typeof message === 'object';
    const messageText = isObjectMessage ? '[详情] 输出对象' : String(message ?? '');
    write(
      '%c Better NXU %c %s',
      'border-radius:5px;padding:3px 5px;color:#fff;background:#3a8bff;font-weight:600',
      'margin-left:6px;color:inherit',
      `${scope} ${timestamp} ${messageText}`
    );
    if (isObjectMessage) write(sanitizeConsoleDetail(message));
    if (detail !== '' && detail !== undefined) write('详细信息：', sanitizeConsoleDetail(detail));
  };
}

/**
 * 脱敏序列化任意值用于日志打印：Error 保留 name/code/message/stack；
 * 对象中匹配敏感键的字段值替换为 [已隐藏]，循环引用替换为 [循环引用]，不可序列化则占位。
 * 1.x 行 2102-2130 行为保持一致。
 * @param {any} value
 * @returns {any}
 */
export function sanitizeConsoleDetail(value) {
  if (value instanceof Error) {
    return {
      name: value.name,
      code: value.code,
      message: value.message,
      stack: value.stack,
    };
  }
  if (value === null || typeof value !== 'object') return value;
  const seen = new WeakSet();
  try {
    return JSON.parse(
      JSON.stringify(value, (key, item) => {
        if (
          /(?:password|passwd|secret|privateKey|credential|authorization|cookie|token|密码|私钥)/i.test(key)
        ) {
          return '[已隐藏]';
        }
        if (item instanceof Error) {
          return { name: item.name, code: item.code, message: item.message, stack: item.stack };
        }
        if (item && typeof item === 'object') {
          if (seen.has(item)) return '[循环引用]';
          seen.add(item);
        }
        return item;
      })
    );
  } catch {
    return '[详情无法序列化]';
  }
}
