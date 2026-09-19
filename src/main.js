/**
 * 用户脚本入口
 * 对应 1.x：Better NXU.user.js 主入口 IIFE（行 139 起）的 readyState 阻塞 + 上下文构造 + switch(Host) 路由
 * 依赖：context（initContext）、router（resolveRoute）、utils/console
 * 入口/被谁调用：vite-plugin-monkey 由此文件作为脚本入口打包（vite.config.js entry）
 *
 * 流程：initContext() → resolveRoute() → 命中则 register()。
 * ScriptCat 的 `@run-at document-idle` 已保证所有内容加载完成，无需在入口重复等待。
 */
import { MyConsole } from './utils/console.js';
import { initContext } from './context.js';
import { resolveRoute } from './router.js';

const console = MyConsole('[初始化]');

// Better NXU 开始运行（1.x 行 2325 等价日志）
console('Better NXU 开始运行');

// 一次性解析并缓存当前页面上下文（Host/Url/Path/vpnContext 等）
initContext();

// 路由分发：返回命中的 sites/<svc>/pages/*.page.js 注册函数并执行
const register = resolveRoute();
if (typeof register === 'function') {
  // 全局错误兜底（2.0 审计 C2）：register 内部未捕获的异常不应成为 unhandled rejection 使脚本静默中断。
  // 各 page 内部已有自己的 try/catch，此处仅兜底漏网之鱼——记 error 日志（MyConsole 脱敏，不泄露敏感字段）。
  try {
    await register();
  } catch (error) {
    console('页面注册执行异常', error, 'error');
  }
}
