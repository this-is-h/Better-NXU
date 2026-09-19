/**
 * sites/webvpn/pages/home.page — webvpn 主页（portal home）注入
 * 对应 1.x：Better NXU.user.js 行 2779-3065（webvpnMain 主体）
 * 依赖：composables/use-wait-or-toast（waitForElement + toast：等待 div[title=教务管理平台] 失败转 error toast）、
 *       composables/use-vue-app（mountVueApp 挂各 SFC：VersionDialog/BetterMenu/CourseGrabCard/CustomToolCard/CustomCards）、
 *       libraries/notification（installNotification 装 toast；BetterMenu.vue 直接调用版本提示函数）、
 *       config/gm-store（getGMValue 读 firstSet/configVersion/WebVPN.* 三项）、
 *       config/config-version（normalizeConfigVersion、ConfigVersion=7）、
 *       context（version：1.x Version = Info.script.version，传 VersionDialog 作 scriptVersion）、
 *       #gm（GM_addStyle）、utils/console
 * 入口/被谁调用：router 命中 webvpn 主页（default 分支）后由 main 调本 page 的 register
 *
 * 与 1.x 等价点（C5）：
 *  - 行 2779-2789：await waitForElement(div[title=教务管理平台], {timeout:15000, predicate:文本非空})；
 *    失败 createToast('error', error.message||'主页加载超时，请刷新后重试', 4) 后 return。→ 改 waitOrToast(
 *    level:'error', timeout:15000, timeoutMessage/errorMessage 备两条文案一致；duration:4)。
 *  - 行 2791-2814：GM_addStyle 三辅助类（.better-nxu-style-hidden/.better-nxu-style-height-full/
 *    .better-nxu-style-floating-bubble）+ html{overflow:hidden}。逐字迁移。
 *  - 行 2816-2817：firstSet = getGMValue('firstSet')；configVersion = normalizeConfigVersion(getGMValue('configVersion'))。
 *  - 行 2822-2898：弹窗 + 浮球 → VersionDialog.vue SFC（经 mountVueApp 挂 #update，rootProps 传
 *    firstSet/configVersion/scriptVersion/configVersionLatest=ConfigVersion）。SFC 内按 firstSet/configVersion
 *    判定渲染首启弹窗 / 版本更新弹窗 / 浮球（去 1.x update_template 字符串拼接：SFC 行内模板）。
 *  - 行 2901-2935：一言回调 + BetterMenu DOM → BetterMenu.vue 直接调用 notification 模块函数；
 *    SFC 经"离屏挂载再移植"
 *    挂到 header .rt：webvpn 原生 navbar CSS 按 `.rt` 子级的 `.wrdvpn-navbar__user` 排布，菜单必须是 `.rt` 直接
 *    子节点；若套中间 host div（多一层）会打断选择器且占布局位致错乱。故先离屏 wrapper 挂 SFC（mountVueApp
 *    渲染出根 .wrdvpn-navbar__user#betternxu-settings），再把该根 DOM appendChild 到 `header .rt` 成其直接子节点，
 *    DOM 与 1.x 行 2935 直接 append div 到 header .rt 逐字一致。Vue 持 vnode→真实 DOM 引用，节点搬家后 patch 不受影响。
 *  - 行 2966-3008：mainDiv = .portal-content__block .el-scrollbar__view（卡片组容器）；courseGrab/customTool/customCard
 *    各按 getGMValue 决定 prepend titleCard + 挂对应卡片 SFC 到 .block-group__content：
 *      · courseGrab → titleCard('抢课备用网址','classes') → CourseGrabCard.vue（8 张抢课备用卡）
 *      · customTool → titleCard('H - 小工具','h-tools') → CustomToolCard.vue（3 张 H 小工具卡）
 *      · customCard → titleCard('自定义','custom-cards') → CustomCards.vue（5 张启用卡，另保留旧门户/大先生注释代码）
 *
 * 挂载形态（与 about/settings 不同）：
 *  本页是 webvpn 原主页的"叠加注入"——不清 body、不换 title（保留 portal 原页），故不用 mountAppPage。
 *  手动 installNotification() 装 toast（需 createToast 兜底 waitOrToast 失败提示与浮球逻辑）；各 SFC 各自挂到
 *  页面对应位置（#update 建 body / 升级版本弹窗；BetterMenu 离屏挂载再移植成 header .rt 直接子节点 / 菜单；各组
 *  titleCard 的 .block-group__content 内建容器 / 卡片组）。
 *
 * 需求4：/h/settings、/h/about 仅 sslvpn 命中——本 home page 不处理设置/关于（BetterMenu 链接已指 sslvpn）。
 */
import { waitOrToast } from '../../../composables/use-wait-or-toast.js';
import { mountVueApp } from '../../../composables/use-vue-app.js';
import { installNotification } from '../../../libraries/notification.js';
import { installVantStyle } from '../../../libraries/vant-style.js';
import { getGMValue } from '../../../config/gm-store.js';
import { normalizeConfigVersion, ConfigVersion } from '../../../config/config-version.js';
import { getContext } from '../../../context.js';
import { GM_addStyle } from '#gm';
import { MyConsole } from '../../../utils/console.js';
import VersionDialog from '../components/home/VersionDialog.vue';
import BetterMenu from '../components/home/BetterMenu.vue';
import CourseGrabCard from '../components/home/CourseGrabCard.vue';
import CustomToolCard from '../components/home/CustomToolCard.vue';
import CustomCards from '../components/home/CustomCards.vue';

const console = MyConsole('[webvpn.home]');

/**
 * 1.x 行 311 Version = Info.script.version。context.version 同源。
 * 必须在 register() 内取——模块顶层取会在 main.js 调 initContext() 之前求值（ES 模块
 * import 深度优先，home.page.js 经 router 静态 import 在 main 函数体执行前就求值），
 * 此时 context 单例尚未初始化，getContext() 抛 "context 尚未初始化"。
 */
/**
 * 建一组卡片根（div.block-group[data-id] > h1.block-group__title + div.block-group__content）。
 * webvpn 主页原生 CSS 即按此结构命中（无需自注入卡片组样式）。返回根 div 与内部 .block-group__content 两条句柄。
 */
function titleCard(title, id) {
  const group = document.createElement('div');
  group.className = 'block-group';
  group.dataset.id = id;
  const h1 = document.createElement('h1');
  h1.className = 'block-group__title';
  h1.textContent = title;
  const content = document.createElement('div');
  content.className = 'block-group__content';
  group.appendChild(h1);
  group.appendChild(content);
  return { group, content };
}

/**
 * 把一个卡片 SFC 挂到给定 .block-group__content：先建一个空容器 div append 到 content，
 * 再 mountVueApp 命中其 id 把 SFC 挂进去（SFC 渲染各 block-group__item 卡）。
 * @param {Element} contentEl - .block-group__content 容器
 * @param {string} hostId - SFC 挂载容器 id（需唯一，避免重注入歧义，1.x 行 2989 注）
 * @param {object} sfc - 卡片 SFC 组件对象
 * @param {object} [rootProps] - 传 SFC 的 props（如 CustomCards 的 customCard）
 */
function mountCardGroup(contentEl, hostId, sfc, rootProps) {
  const host = document.createElement('div');
  host.id = hostId;
  contentEl.appendChild(host);
  mountVueApp({ root: sfc, id: hostId, rootProps });
}

/**
 * webvpn 主页注入入口。对应 1.x webvpnMain()（行 2779-3065）。
 * 保留 webvpn 原主页：不清 body、不换 title，仅叠加挂 VersionDialog/BetterMenu/三组卡片。
 */
export async function register() {
  // 1.x 行 311 Version = Info.script.version。context.version 同源。
  // 此时 main.js 已调 initContext()，getContext() 安全（见模块顶层注释：不可在顶层取）。
  const scriptVersion = getContext().version;

  // 装 notification（必须在 waitOrToast 之前）。1.x 由 Basic() 在主入口早期 AddNotification 装好，故 catch createToast 可用；
  //  2.0 各 page 自调 installNotification，故首屏等待超时的 toast 也依赖它先就绪。本页不换 body/title，不调
  //  mountAppPage（那会清 body）。幂等，重复调用安全。仅挂 toast 容器到 body + GM_addStyle ToastCss，
  //  不依赖任何卡片 DOM，提前调安全。
  installNotification();

  // 1.x 行 2779-2789：等待原生卡片渲染完成（div[title=教务管理平台] 出现且文本非空）。
  //  走 waitOrToast：超时/失败弹 error toast 对齐 1.x（level:'error'，duration:4）。
  const ready = await waitOrToast('div[title=教务管理平台]', {
    timeout: 15000,
    predicate: (el) => el.textContent.trim().length > 0,
    level: 'error',
    timeoutMessage: '主页加载超时，请刷新后重试',
    errorMessage: '主页加载超时，请刷新后重试',
    duration: 4,
  });
  if (!ready) return; // waitOrToast 已弹 toast，对齐 1.x return。

  // Vant 基础样式先于本页补丁注入，保持原入口的 CSS 覆盖顺序。
  installVantStyle();
  // 1.x 行 2791-2814：GM_addStyle 三辅助类 + html overflow hidden。逐字迁移。
  GM_addStyle?.(`
    html {
      overflow: hidden;
    }

    .better-nxu-style-hidden {
      display: none!important;
    }

    .better-nxu-style-height-full {
      height: 100%!important;
    }

    .better-nxu-style-floating-bubble {
      white-space: pre-wrap;
      word-break: break-word;
      font-size: 12px;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
  `);

  // 1.x 行 2816-2817：firstSet / configVersion。
  const firstSet = getGMValue('firstSet');
  const configVersion = normalizeConfigVersion(getGMValue('configVersion'));
  console('检查首次配置与版本提示状态', { firstSet, configVersion, ConfigVersion });

  // 1.x 行 2822-2898：首启/版本更新弹窗 + 搜索栏浮球 → VersionDialog.vue。
  //  1.x GM_addElement(body,'div',{id:'update'}) → 本页手动建 #update 容器 append 到 body（mountVueApp 命中）。
  mountVueApp({
    root: VersionDialog,
    id: 'update',
    rootProps: {
      firstSet,
      configVersion,
      scriptVersion, // 1.x 行 2844 V ${Version}（context.version）
      configVersionLatest: ConfigVersion, // =7（自动登录默认值与卡片选项调整）
    },
  });

  // 1.x 行 2922-2935：BetterMenu dropdown → BetterMenu.vue。1.x 是直接 append 一个带 class/id 的原生 div 到
  //  `header .rt`（行 2935）——菜单元素必须是 `header .rt` 的**直接子节点**：webvpn 原生 navbar CSS 按
  //  `.rt` 子级的 `.wrdvpn-navbar__user` 排布（flex/inline 兄弟），多一层中间 host div 不仅可能打断直系选择器，
  //  更会作为额外的子节点占据布局位、把菜单缩进一级，导致布局/icon 错乱。
  //  Vue 的 mount 语义是"渲染进指定容器内部"（父-子模型）——不能直接让 SFC 根成为 `.rt` 子节点而不引入容器层。
  //  故采用"离屏挂载再移植"：先在 body 末端建离屏 wrapper 挂 SFC（mountVueApp 按其内部结构渲染出
  //  .wrdvpn-navbar__user#betternxu-settings 根节点），再把该根 DOM 节点 appendChild 到 `header .rt`——
  //  它成为 `.rt` 直接子节点，DOM 与 1.x 逐字一致。Vue 持的是 vnode→真实 DOM 节点的引用，节点被 appendChild
  //  搬家后 Vue 后续响应式 patch 仍命中同一节点，实例绑定不断。
  const rtEl = document.querySelector('header .rt');
  if (rtEl) {
    // 离屏 wrapper（绝对定位挪出视口，避免渲染到 body 末端那一瞬被看见；挂完即移除）。
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'position:fixed;left:-99999px;top:-99999px;opacity:0';
    document.body.appendChild(wrapper);
    wrapper.id = 'better-nxu-menu-host';
    mountVueApp({
      root: BetterMenu,
      id: 'better-nxu-menu-host', // mountVueApp 命中已存在的 #id（上面已建），不再自建
      rootProps: { scriptVersion }, // 1.x 行 2927 V ${Version}
    });
    // wrapper[0] 即 SFC 渲染出的根节点 .wrdvpn-navbar__user#betternxu-settings。
    if (wrapper.firstElementChild) {
      rtEl.appendChild(wrapper.firstElementChild); // 移植成 .rt 直接子节点
    }
    wrapper.remove(); // 离屏 wrapper 完成锚点使命，移除（SFC 根已脱离 wrapper）
  } else {
    console('未找到 header .rt，BetterMenu 菜单跳过', undefined, 'warn');
  }

  // 1.x 行 2966：卡片组容器（portal 原生 .portal-content__block .el-scrollbar__view）。
  const mainDiv = document.querySelector('.portal-content__block .el-scrollbar__view');
  if (mainDiv) {
    // 1.x 行 2968-2987：抢课备用 → titleCard('抢课备用网址','classes') + CourseGrabCard.vue。
    if (getGMValue('WebVPN.courseGrab')) {
      const { group, content } = titleCard('抢课备用网址', 'classes');
      mainDiv.prepend(group);
      mountCardGroup(content, 'better-nxu-coursegrab-host', CourseGrabCard);
    }
    // 1.x 行 2990-3008：H - 小工具 → titleCard('H - 小工具','h-tools') + CustomToolCard.vue。
    if (getGMValue('WebVPN.customTool')) {
      const { group, content } = titleCard('H - 小工具', 'h-tools');
      mainDiv.prepend(group);
      mountCardGroup(content, 'better-nxu-customtool-host', CustomToolCard);
    }
    // 1.x 行 3011-3064：自定义 → titleCard('自定义','custom-cards') + CustomCards.vue（仅 customCard 非空）。
    const customCard = getGMValue('WebVPN.customCard');
    if (Array.isArray(customCard) && customCard.length !== 0) {
      const { group, content } = titleCard('自定义', 'custom-cards');
      mainDiv.prepend(group);
      mountCardGroup(content, 'better-nxu-customcards-host', CustomCards, { customCard });
    }
  } else {
    console('未找到卡片组容器 .portal-content__block .el-scrollbar__view，跳过卡片注入', undefined, 'warn');
  }
}
