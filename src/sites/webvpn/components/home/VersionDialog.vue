<!--
  webvpn/components/home/VersionDialog.vue — 首启/版本更新弹窗 + 搜索栏浮球
  对应 1.x：Better NXU.user.js 行 2822-2898（update_template + float 模板 + update = Vue.createApp({setup}).use(vant).mount('#update')）
  依赖：vant 按需 import（Dialog/FloatingBubble；样式随页面按需注入）、config/gm-store（setGMValue 写 firstSet/configVersion）、
         #gm（GM_openInTab 开设置页）、utils/console、vue（ref）
  入口/被谁调用：sites/webvpn/pages/home.page.js 经 mountVueApp 挂本 SFC 到 #update（rootProps 传 firstSet/configVersion/scriptVersion）

  与 1.x 等价点（C5）：
   - 行 2824-2853：firstSet 未设 → 首启弹窗（"第一次使用" + 前往配置/取消）；configVersion < ConfigVersion → 版本更新弹窗
     （V ${Version} + 前往配置/稍后）。两弹窗均 show-cancel-button + @confirm goConfig + @close closeFunc。
   - 行 2854-2858：浮球（van-floating-bubble @click changeSearch，文案 floatingBubbleContent）。
   - 行 2862-2864：show 初始值 = update_show（firstSet 未设或 configVersion<ConfigVersion 时 true）；floatingBubbleContent 初始"关闭\n搜索栏"。
   - 行 2865-2879：searchDom/cardDom 取 .portal-search-wrap/.portal-content；closeSearch 隐藏搜索栏+cardDom 撑满+文案"打开\n搜索栏"；
     openSearch 反之；WebVPN.searchClose 开启时初始 closeSearch。
   - 行 2880-2882：goConfig → GM_openInTab 打开设置页。
   - 行 2883-2886：closeFunc → GM_setValue firstSet=true + configVersion=max(当前,ConfigVersion)（标记已提示，防再弹）。
   - 行 2887-2893：changeSearch → 浮球点击切换搜索栏显隐。
-->
<script setup>
import { ref } from 'vue';
import { Dialog as VanDialog, FloatingBubble as VanFloatingBubble } from 'vant';
import { setGMValue, getGMValue } from '../../../../config/gm-store.js';
import { GM_openInTab } from '#gm';
import { MyConsole } from '../../../../utils/console.js';

const console = MyConsole('[webvpn.home]');

const props = defineProps({
  // 1.x 行 2816-2817：firstSet 未设（=0/falsy）→ 首启弹窗；configVersion < ConfigVersion → 版本更新弹窗。
  firstSet: { type: [Boolean, Number], default: false },
  configVersion: { type: Number, default: 0 },
  scriptVersion: { type: String, default: '' }, // 1.x 行 2844 V ${Version}
  configVersionLatest: { type: Number, default: 7 }, // ConfigVersion=7（自动登录默认值与卡片选项调整）
});

// 1.x 行 2862-2863：show 初始 = update_show（firstSet 未设 或 configVersion<ConfigVersion 时为 true）。
const isFirstSet = !props.firstSet;
const isVersionUpdate = props.configVersion < props.configVersionLatest;
const show = ref(isFirstSet || isVersionUpdate);

// 1.x 行 2864：浮球文案初始"关闭\n搜索栏"。
const floatingBubbleContent = ref('关闭\n搜索栏');

// 1.x 行 2865-2866：取页面搜索栏与卡片容器 DOM（webvpn 主页原生元素）。
const searchDom = document.querySelector('.portal-search-wrap');
const cardDom = document.querySelector('.portal-content');

// 1.x 行 2867-2871：关闭搜索栏：隐藏 searchDom + cardDom 撑满 + 文案改"打开\n搜索栏"。
const closeSearch = () => {
  searchDom?.classList.add('better-nxu-style-hidden');
  cardDom?.classList.add('better-nxu-style-height-full');
  floatingBubbleContent.value = '打开\n搜索栏';
};
// 1.x 行 2872-2876：打开搜索栏：恢复显隐 + 文案改"关闭\n搜索栏"。
const openSearch = () => {
  searchDom?.classList.remove('better-nxu-style-hidden');
  cardDom?.classList.remove('better-nxu-style-height-full');
  floatingBubbleContent.value = '关闭\n搜索栏';
};

// 1.x 行 2877-2879：WebVPN.searchClose 配置开启时初始即关闭搜索栏。
//  注意：1.x 是 setup 内直接 getGMValue，为对齐行为，本 SFC 内同样读（gm-store 已多处用，无新依赖）。
if (getGMValue('WebVPN.searchClose')) {
  closeSearch();
}

// 1.x 行 2880-2882：打开设置页。
const goConfig = () => {
  GM_openInTab?.('https://sslvpn.nxu.edu.cn/h/settings');
};

// 1.x 行 2883-2886：closeFunc（dialog @close）→ 标记 firstSet=true + configVersion=max(当前,ConfigVersion)。
const closeFunc = async () => {
  await setGMValue('firstSet', true);
  await setGMValue('configVersion', Math.max(props.configVersion, props.configVersionLatest));
};

// 1.x 行 2887-2893：changeSearch（浮球 @click）→ 切换搜索栏显隐。
const changeSearch = () => {
  if (searchDom?.classList.contains('better-nxu-style-hidden')) {
    openSearch();
  } else {
    closeSearch();
  }
};

void console; // 保留 scope 引用防 tree-shake（后续 home page log 用同一 scope）
</script>

<template>
  <!-- 1.x 行 2825-2837：首启弹窗（firstSet 未设时渲染）-->
  <van-dialog
    v-if="isFirstSet"
    v-model:show="show"
    title="Better NXU 首次配置"
    show-cancel-button
    confirm-button-text="前往配置"
    style="--van-dialog-font-size: 1.5em; --van-dialog-header-padding-top: 18px"
    @confirm="goConfig"
    @close="closeFunc"
  >
    <div
      style="
        font-size: 16px;
        color: var(--van-dialog-has-title-message-text-color);
        margin: 0.5em 0;
        padding: 0 2em;
        display: flex;
        flex-direction: column;
        justify-content: center;
      "
    >
      <p style="text-align: center; line-height: 22px">
        <span style="font-weight: bold">这好像是你<span style="color: #0283ef">第一次</span>使用本插件</span
        ><br />
        我们需要一些配置信息<br />
        你可以选择<span style="color: #32ae57">前往配置</span><br />
        或点击<span style="color: #ff7b35">取消</span>不进行配置<br />
        后续自行前往设置页面进行配置
      </p>
    </div>
  </van-dialog>
  <!-- 1.x 行 2840-2851：版本更新弹窗（configVersion < ConfigVersion 时渲染）-->
  <van-dialog
    v-else-if="isVersionUpdate"
    v-model:show="show"
    title="Better NXU 配置更新"
    show-cancel-button
    confirm-button-text="前往配置"
    cancel-button-text="稍后"
    style="--van-dialog-font-size: 1.5em; --van-dialog-header-padding-top: 18px"
    @confirm="goConfig"
    @close="closeFunc"
  >
    <div
      style="
        font-size: 16px;
        color: var(--van-dialog-has-title-message-text-color);
        margin: 0.5em 0;
        padding: 0 2em;
        display: flex;
        flex-direction: column;
        justify-content: center;
      "
    >
      <p style="text-align: center; line-height: 23px">
        <span style="font-weight: bold">V {{ scriptVersion }}</span
        ><br />
        我们更新了一些配置信息<br />
        建议前往配置页面查看新增或调整项<br />
        也可以稍后从 Better NXU 设置中查看
      </p>
    </div>
  </van-dialog>
  <!-- 1.x 行 2854-2858：搜索栏浮球 -->
  <van-floating-bubble class="better-nxu-style-floating-bubble" @click="changeSearch">
    {{ floatingBubbleContent }}
  </van-floating-bubble>
</template>
