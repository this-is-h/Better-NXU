/** 将固定 SHA384 的 @resource 脚本注入真实 page window，并返回其 UMD 全局对象。 */
import { GM_addElement, GM_getResourceText, unsafeWindow } from '#gm';

/**
 * @param {string} resourceName @resource 名称
 * @param {(pageWindow: Window) => any} resolveGlobal 注入后读取并校验全局对象
 * @returns {any}
 */
export function evaluatePageResource(resourceName, resolveGlobal) {
  if (typeof GM_getResourceText !== 'function') {
    throw new Error(`GM_getResourceText 不可用，无法加载 ${resourceName}`);
  }

  const source = GM_getResourceText(resourceName);
  if (typeof source !== 'string' || source.trim() === '') {
    throw new Error(`资源 ${resourceName} 不存在或内容为空`);
  }

  const pageWindow = unsafeWindow ?? window;
  const parent = document.head || document.documentElement;
  if (typeof GM_addElement !== 'function' || !parent) {
    throw new Error(`GM_addElement 不可用，无法加载 ${resourceName}`);
  }

  const script = GM_addElement(parent, 'script', {
    textContent: `${source}\n//# sourceURL=better-nxu-resource-${resourceName}.js`,
  });
  script?.remove();
  const runtime = resolveGlobal(pageWindow);
  if (!runtime) throw new Error(`资源 ${resourceName} 未暴露预期的全局对象`);
  return runtime;
}
