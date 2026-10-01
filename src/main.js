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
import { GM_info } from '#gm';

const console = MyConsole('[初始化]');

console('Better NXU 开始运行');
const startedAt = Date.now();
let stage = '读取版本信息';
try {
  console(`脚本版本：${GM_info?.script?.version || '未知（GM_info 未提供版本）'}`, '', 'info');
  stage = '上下文初始化';
  const ctx = initContext();
  console(
    '运行环境',
    {
      scriptHandler: GM_info?.scriptHandler || '未知',
      handlerVersion: GM_info?.version || '未知',
      access: ctx.isWebvpn ? 'WebVPN 代理' : ctx.isWebvpnHost ? 'WebVPN 主站' : '直连',
      frame: window === window.top ? '顶层页面' : 'iframe',
      readyState: document.readyState,
      visibilityState: document.visibilityState,
    },
    'info'
  );

  stage = '路由匹配';
  const register = resolveRoute();
  if (typeof register === 'function') {
    stage = '页面注册';
    console('开始执行页面入口', '', 'debug');
    await register();
    console('页面入口执行结束', { elapsedMs: Date.now() - startedAt }, 'info');
  } else {
    console('未匹配页面处理程序，停止当前页面初始化', { elapsedMs: Date.now() - startedAt }, 'info');
  }
} catch (error) {
  console('当前页面初始化异常终止', { stage, elapsedMs: Date.now() - startedAt, error }, 'error');
}
