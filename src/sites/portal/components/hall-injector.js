/**
 * portal/components/hall-injector — 门户应用中心（#/hall）卡片注入 + SPA 导航协调
 * 对应 1.x：Better NXU.user.js 行 3624-3747（portalApp 函数体：等 iframe#template-container → 等 div.city_sort
 *           出现 → 伪造 Vue scoped data-v 属性 → generateDiv 生成 4 个 Better NXU 卡片块 insertBefore）
 *           + 行 2337-2351（potalSwitchToFunc：导航回调内判定 #/hall 再调 portalApp）
 * 依赖：composables/use-wait-or-toast（等待 iframe 失败转 toast）、utils/random（WaitTime 轮询
 *         div.city_sort）、libraries/notification（列表等待失败 toast）、utils/console
 * 入口/被谁调用：sites/portal/pages/hall.page.js（直连与 WebVPN 代理 portal 共用同一 page）——page 调
 *               patchPortalHistory({ onNavigate: buildPortalOnNavigate() }) 一次 + 立即触发一次首屏注入。
 *
 * 边界说明（02 §3 / 03 §2 B8 验收 1）：本模块属 portal 站点内部组件层，不负责路由或直连/代理判定；
 *   hall.page.js 统一解析当前实时 path，本模块只负责 #/hall 判定后的 DOM 注入与并发控制。
 *
 * 与 1.x 等价点及偏差（C5→修正性迁移，对齐 B8 验收 1"切回 #/hall 不丢注入"）：
 *  - portalApp（行 3624-3747）迁移：iframe#template-container 15s+contentWindow.document predicate、
 *    15s 内轮询 div.city_sort 有 div.sortItem、取首个 sortItem、读 list 上以 data-v- 开头的 Vue scoped
 *    属性伪造、generateDiv 生成 4 个块（常用/教务系统/图书馆/H 小工具）各 insertBefore(listFirst)
 *    且按 #betternxu-h-main/jwgl/lib/tools id 幂等（存在则跳过）。
 *  - 偏差（相对 1.x 逐字）：1.x 用 documentElement.dataset.betterNxuPortalInitialized='1' 作全局
 *    "已注入"标志，首次成功后永久挡住后续 portalApp 调用——在门户 Vue SPA 切走 #/hall（Vue 销毁
 *    iframe#template-container 整树、卡片随之消失）再切回时，该标志仍为 '1'，导致 onNavigate 命中
 *    #/hall 却直接 return，新渲染的空 div.city_sort 永等不到卡片（B8 验收 1 真机暴露）。
 *    2.0 去掉该全局 false 缓存，改为模块级 inflightPromise 锁：仅把"同一次导航窗口内并发的 onNavigate
 *    收敛成一次注入"（fireCallbacks 不 await async 回调，连续导航会并发调 injectPortalHall），
 *    注入结束即放锁——下次切回 #/hall 时 #betternxu-h-* 存在性幂等若找不到旧卡片则真正重注入。
 *  - potalSwitchToFunc（行 2337-2351）：每次导航取实时 path，currentPath=='/index.html'||
 *    '/default/index.html' 且 url 含 '#/hall' → 调 portalApp。2.0 把这判定做成 buildPortalOnNavigate
 *    返回的 onNavigate 回调，path 来源由统一 page 的 resolver 提供。
 *
 * 挂载形态：叠加注入——不清 body、不换 title（portal 自有页面布局），仅向 iframe 内 div.city_sort 前插卡片。
 */
import { waitOrToast } from '../../../composables/use-wait-or-toast.js';
import { WaitTime } from '../../../utils/random.js';
import { toast } from '../../../libraries/notification.js';
import { MyConsole } from '../../../utils/console.js';

const console = MyConsole('[portal.hall]');

// 模块级 in-flight 注入锁（取代 1.x 的 documentElement.dataset.betterNxuPortalInitialized 全局标志）。
// 作用仅限：把同一次导航窗口内并发的 onNavigate 调用收敛成一次注入（fireCallbacks 不 await async 回调，
// 连续 pushState/popstate 会让多个 injectPortalHall 并发跑、各自 waitForElement 等同一 iframe）。
// 注入结束（成功/失败）放锁——不长期保留，否则 SPA 切走销毁卡片、切回时无法重注入（见文件头偏差说明）。
let inflightPortalInject = null;

/**
 * 向门户应用中心注入 4 个 Better NXU 卡片块。对应 1.x portalApp() 函数体（行 3624-3747）。
 * 幂等：并发收敛（inflightPortalInject 锁）+ 各块按 #betternxu-h-* id 存在性跳过（Vue 未销毁卡片则不重注）。
 */
export async function injectPortalHall() {
  // 并发收敛：若已有注入进行中，复用其 promise，不重复进等待循环。
  if (inflightPortalInject) return inflightPortalInject;
  const inject = (async () => {
    // 1.x 行 3628-3631：等 iframe#template-container 加载且 contentWindow.document 就绪（15s）。
    const iframe = await waitOrToast('iframe#template-container', {
      timeout: 15000,
      predicate: (element) => Boolean(element.contentWindow?.document),
      level: 'error',
      duration: 4,
    });
    if (!iframe) return;
    const mainIframe = iframe.contentWindow;
    // 1.x 行 3633-3638：15s 内轮询 iframe 内 div.city_sort 出现 div.sortItem（应用列表渲染完）。
    const startedAt = Date.now();
    while (Date.now() - startedAt <= 15000) {
      const list = mainIframe.document.querySelector('div.city_sort');
      if (list?.querySelector('div.sortItem')) break;
      await WaitTime(200, 0, false);
    }
    const list = mainIframe.document.querySelector('div.city_sort');
    // 1.x 行 3643-3647：列表加载超时（无 div.sortItem）→ toast warning 跳过自定义卡片。
    if (!list?.querySelector('div.sortItem')) {
      toast('warning', '门户分类加载超时，已跳过自定义卡片', 4);
      return;
    }
    const listFirst = list.querySelector('div.sortItem');
    // 1.x 行 3649 在此置 documentElement.dataset.betterNxuPortalInitialized='1' 作永久幂等标志——
    // 2.0 已弃用该全局标志（SPA 切走销毁卡片后切回会误判"已注入"而不重注，见文件头偏差说明）。
    // 改由 #betternxu-h-* 各块存在性幂等 + 模块 inflightPortalInject 并发收敛锁共同保证。

    // 1.x 行 3650-3652：取 list 上以 'data-v-' 开头的 Vue scoped 属性，伪造进我们生成的卡片段以继承原生样式。
    const vueScopedAttr = Array.from(list.attributes).find((attr) => attr.name.startsWith('data-v-'));
    const dataVValue = vueScopedAttr?.name || '';

    // 1.x 行 3653-3697 generateDiv(data)：data=[title, id, items=[[msg,url],...]] → 生成带 data-v 伪造属性的 sortItem div。
    const generateDiv = (data) => {
      const title = data[0];
      const id = data[1];
      const items = data[2];

      // 生成所有 <li> 元素（1.x 行 3659-3681 逐字）。
      const liList = items.map((item) => {
        const msg = item[0];
        const url = item[1];
        const firstChar = msg.charAt(0); // 取第一个汉字或字符（1.x 行 3663）

        return `<li ${dataVValue}>
                        <a ${dataVValue} class="li-item portal-font-color-lv1 portal-primary-color-hover-lv1 favoriteapp-list-hover portal-primary-backgroundcolor-hover-lv5"
                            href="${url}" target="_blank" rel="noopener noreferrer" style="text-decoration:none">
                            <div ${dataVValue} class="favoriteapp-left">
                                <div style="width:100%;height:100%;display:flex;justify-content:center;align-items:center;font-size:x-large;font-weight:bold;color:#38727F">
                                    ${firstChar}
                                </div>
                            </div>
                            <div ${dataVValue} class="favoriteapp-center">
                                <div ${dataVValue} class="we-tooltip item" style="overflow: hidden;" aria-describedby="we-tooltip-9469" tabindex="0">
                                    <span style="box-shadow: transparent 0px 0px;">
                                        <span aria-label="${msg}"> ${msg} </span>
                                    </span>
                                </div>
                            </div>
                        </a>
                    </li>`;
      });

      // 拼接整体模板（1.x 行 3684-3689）。
      const template = `<h2 class="portal-font-color-lv1" ${dataVValue}> ${title} </h2>
            <div class="favoriteapp" ${dataVValue}>
                <ul class="asul" ${dataVValue}>
                    ${liList.join('\n')}
                </ul>
            </div>`;

      // 用 iframe 文档创建（卡片最终插入 iframe 的 div.city_sort；跨 document 创建虽会被 adopt，统一更清晰）。
      const div = mainIframe.document.createElement('div');
      div.className = 'sortItem';
      div.id = id;
      div.innerHTML = template;

      return div;
    };

    // 1.x 行 3698-3746：4 个卡片块各 insertBefore(listFirst)，按 id 存在则跳过（幂等）。
    // 2.0 改数据驱动循环（数据逐字取自 1.x 四处粘贴块，C5 行为等价；消除 1.x 样板）。
    const PORTAL_CARDS = [
      {
        title: 'Better NXU - 常用',
        id: 'betternxu-h-main',
        items: [
          ['学工系统', 'https://xsfw.nxu.edu.cn'],
          ['双创平台', 'http://202.201.128.142/nxu1'],
          ['实验室安全教育平台', 'https://sysaq.nxu.edu.cn'],
        ],
      },
      {
        title: 'Better NXU - 教务系统',
        id: 'betternxu-h-jwgl',
        items: [
          ['教务系统', 'https://jwgl.nxu.edu.cn'],
          ['备用1', 'http://202.201.128.234:8080'],
          ['备用2', 'http://202.201.128.234:8081'],
          ['备用3', 'http://202.201.128.234:8082'],
          ['备用4', 'http://202.201.128.234:8083'],
        ],
      },
      {
        title: 'Better NXU - 图书馆',
        id: 'betternxu-h-lib',
        items: [
          ['图书馆', 'https://zylib.nxu.edu.cn/login'],
          ['中国知网', 'https://zylib.nxu.edu.cn/-----https://www.cnki.net/'],
          ['万方数据', 'https://zylib.nxu.edu.cn/-----https://www.wanfangdata.com.cn/'],
          ['维普资讯', 'https://zylib.nxu.edu.cn/-----https://qikan.cqvip.com/'],
          [
            'Web of Science',
            'https://zylib.nxu.edu.cn/-----https://www.webofscience.com/wos/alldb/basic-search',
          ],
          ['PubScholar公益学术平台(校外)', 'https://pubscholar.cn/'],
        ],
      },
      {
        title: 'Better NXU - H 小工具',
        id: 'betternxu-h-tools',
        items: [
          ['H 小工具', 'h/tools'],
          ['宁夏大学猫狗图鉴', 'https://nxu-cdig.thisish.cn/'],
          ['NXU Charge（已废弃）', 'https://campus-charge.thisish.cn/'],
        ],
      },
    ];
    for (const { title, id, items } of PORTAL_CARDS) {
      // 幂等检查须在 iframe 文档内查（2.0 审计 C1）：卡片插入的是 iframe 的 div.city_sort，查外层 document
      // 永远找不到 → 幂等失效、每次导航都重插，只能靠 SPA 销毁 DOM 兜底。改查 mainIframe.document 后才真正幂等。
      if (!mainIframe.document.querySelector(`#${id}`)) {
        list.insertBefore(generateDiv([title, id, items]), listFirst);
      }
    }
  })();
  // 真正写入并发的 in-flight 锁（上面 doInject 已开始跑，并发的 injectPortalHall 调用在入口 return 此 promise）。
  // 返回 finally 派生出的同一条受控 Promise，避免丢弃一个可能 reject 的 Promise。
  inflightPortalInject = inject.finally(() => {
    inflightPortalInject = null;
  });
  return inflightPortalInject;
}

/**
 * 构造门户导航回调：判定当前 path 是否为门户主页（#/hall）并触发卡片注入。
 * 对应 1.x potalSwitchToFunc（行 2337-2351）。由 page 调用方传入实时 currentPath resolver；
 * url 统一取 window.location.href（直连和代理均在同源门户页面内判定 '#/hall'）。
 *
 * 注意：onNavigate 回调因此可能是异步函数，注入内部 await——spa-history 的 fireCallbacks 用 try/catch
 *  包裹并吞错（已实现），故注入失败不污染补丁链。
 * @param {() => string} resolveCurrentPath - 返回当前应判定的 path（直连 pathname / 代理 realPath）
 * @returns {() => Promise<void>} onNavigate 回调，传给 patchPortalHistory({ onNavigate })
 */
export function buildPortalOnNavigate(resolveCurrentPath) {
  return async () => {
    const currentPath = resolveCurrentPath();
    const currentUrl = window.location.href;
    // 1.x 行 2343-2349：path 为门户主页（/index.html 或 /default/index.html）且 url 含 '#/hall' → 注应用中心卡片。
    if (currentPath === '/index.html' || currentPath === '/default/index.html') {
      if (currentUrl.indexOf('#/hall') !== -1) {
        console('识别到门户应用中心（#/hall）');
        await injectPortalHall();
      }
    }
  };
}
