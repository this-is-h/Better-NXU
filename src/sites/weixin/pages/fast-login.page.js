/**
 * sites/weixin/pages/fast-login.page — 微信扫码授权页"快速登录"
 * 对应 1.x：Better NXU.user.js 行 2353-2363（case 'open.weixin.qq.com'）+ 行 2594-2607（weixinLogin）
 * 依赖：composables/use-wait-or-toast（等待元素失败转 toast）、libraries/notification（installNotification = Basic({vant:false})+toast）、
 *       utils/context（getContext 取 query 判 fast_login）、utils/console
 * 入口/被谁调用：router 命中 weixin/fast-login.page.js → main.js 调 register()

 * 1.x case 'open.weixin.qq.com' 行 2353-2363：
 *   if (Url.indexOf("nxu.edu") == -1) return;        // nxu.edu 守卫已在 router entry test 内（02 §7.2）
 *   if (GetQuery('fast_login') == 0)                 // 将 fast_login=0 改写为 1（1.x 行 2358-2360）
 *       location.href = Url.replace("fast_login=0", "fast_login=1")
 *   Basic({ vant: false });
 *   weixinLogin();
 *
 * 1.x weixinLogin 行 2594-2607：
 *   try {
 *     const container = await waitForElement('.js_quick_login', { predicate: el => el.querySelector('button') });
 *     const visible   = await waitForElement('.js_quick_login', { timeout: 10000,
 *                                                                predicate: el => el.style.display !== 'none' });
 *     visible.querySelector('button').click();
 *   } catch (error) {
 *     createToast("error", error.message || "微信登录入口加载失败，请手动操作", 4);
 *   }
 *
 * 验收对齐（03 B5 验收 2/3）：
 *   - 微信 fast_login=1 + 点快登按钮，与 1.x 一致（router 守卫 url 含 nxu.edu，page 内再改 fast_login=0→1）
 *   - Basic({vant:false}) 等价：只 installNotification，不引 Vant（本 page 无 vant 依赖），满足验收 3
 */
import { installNotification, toast } from '../../../libraries/notification.js';
import { waitOrToast } from '../../../composables/use-wait-or-toast.js';
import { getContext } from '../../../context.js';
import { MyConsole } from '../../../utils/console.js';

const console = MyConsole('[weixin.login]');

/**
 * 微信扫码授权页入口：改写 fast_login=0→1（若需要）后自动点击快速登录按钮。1.x 行 2353-2363 等价。
 */
export async function register() {
  console('进入授权页面');
  const ctx = getContext();
  // 1.x 行 2358-2360：fast_login=0 → 改写为 1 并刷新（路由 entry 已守 url 含 nxu.edu，此处不重复守卫）。
  // URLSearchParams.get('fast_login') 返回字符串 '0'，与 1.x 松等语义一致后转严格比较。
  if (ctx.query.get('fast_login') === '0') {
    location.href = ctx.url.replace('fast_login=0', 'fast_login=1');
    return;
  }
  // 1.x 行 2361 Basic({vant:false})：装 notification，不引 Vant。
  installNotification();
  try {
    // 1.x 行 2596-2598：等待快登容器内出现按钮。
    const container = await waitOrToast('.js_quick_login', {
      predicate: (element) => element.querySelector('button'),
      level: 'error',
      duration: 4,
    });
    if (!container) return;
    // 1.x 行 2599-2602：再等容器可见（display !== 'none'）。
    const visible = await waitOrToast('.js_quick_login', {
      timeout: 10000,
      predicate: (element) => element.style.display !== 'none',
      level: 'error',
      duration: 4,
    });
    if (!visible) return;
    visible.querySelector('button').click();
  } catch (error) {
    // 1.x 行 2604-2606：点击失败提示手动操作。
    toast('error', error.message || '微信登录入口加载失败，请手动操作', 4);
  }
}
