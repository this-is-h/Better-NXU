<!--
  webvpn/components/home/CustomCards.vue — 主页"自定义"卡片组
  对应 1.x：Better NXU.user.js 行 3011-3064（webVPNCustomCard = getGMValue("WebVPN.customCard")，
           length!=0 时 mainDiv.prepend(titleCard("自定义","custom-cards")) + customDiv.appendChild
           各 divCard，每张按 webVPNCustomCard.indexOf(名称) != -1 决定是否添加）
  依赖：utils/webvpn-url（buildWebVpnUrl 构建校外代理链接；教务管理传 {forceHttps443:true}）、
         vue（无 ref，纯展示）
  入口/被谁调用：sites/webvpn/pages/home.page.js 收集卡片数据后挂本 SFC 渲染整组卡片
-->
<script setup>
import { buildWebVpnUrl } from '../../../../utils/webvpn-url.js';

// 1.x 行 3011：webVPNCustomCard = getGMValue("WebVPN.customCard")，由 home.page.js 读取后经 props 传入。
const props = defineProps({
  customCard: { type: Array, default: () => [] }, // 1.x webVPNCustomCard 数组（getGMValue 已保证数组形态）
});

// 1.x 行 3015-3063：按 indexOf 决定是否生成对应卡。每卡同 1.x divCard 模板结构。
// 定义当前启用的候选卡列表（含名称用于 indexOf 判定 + href 工厂 + icon + title + content）。
const candidates = [
  {
    name: '教务管理',
    href: buildWebVpnUrl('https://jwgl.nxu.edu.cn/cas.action', { forceHttps443: true }),
    icon: '<div class="block-group__item__logo" style="background-color: rgb(235, 94, 94);">教</div>',
    title: '教务平台',
    content: '教务管理平台',
  },
  {
    name: '学工系统',
    href: buildWebVpnUrl('https://xsfw.nxu.edu.cn/'),
    icon: '<div class="block-group__item__logo" style="background-color: #95c2fb;">学</div>',
    title: '学工系统',
    content: '学工平台',
  },
  {
    name: '信息门户',
    href: buildWebVpnUrl('https://portal.nxu.edu.cn/'),
    icon: '<div class="block-group__item__logo"><img src="/wengine-vpn/js/image/portal_logos/系统集成.png"></div>',
    title: '信息门户',
    content: '综合信息服务门户',
  },
  {
    name: '中国知网',
    href: buildWebVpnUrl('https://www.cnki.net/'),
    icon: '<div class="block-group__item__logo" style="background-color: #1b66e6;">知</div>',
    title: '中国知网',
    content: '中国期刊全文数据库',
  },
  {
    name: '万方数据',
    href: buildWebVpnUrl('https://www.wanfangdata.com.cn/'),
    icon: '<div class="block-group__item__logo" style="background-color: #00417e;">万</div>',
    title: '万方数据',
    content: '万方数据知识服务平台',
  },
];

// 暂停服务/替换入口的历史卡片保留为注释代码，便于后续恢复：
//
// 1. 旧信息门户：历史配置键同样是“信息门户”。如果以后要把入口切回旧门户，直接用下方对象
//    替换上方当前启用的“信息门户”对象即可，旧用户存储无需迁移；如果需要新旧门户同时存在，
//    则把 name 改为“旧信息门户”，并同步 gm-keys.js、user-config.js、SettingsPanel.vue、测试和文档。
// {
//   name: '信息门户',
//   href: buildWebVpnUrl('https://eip.nxu.edu.cn/'),
//   icon: '<div class="block-group__item__logo" style="background-color: #0966b5;">信</div>',
//   title: '信息门户（旧）',
//   content: '综合信息服务门户',
// },
//
// 2. 大先生：目标页面 https://chat.zju.edu.cn 当前返回 404，因此不加入候选和设置项。
//    如果服务恢复，取消下方对象注释，并同步恢复 gm-keys.js、user-config.js、SettingsPanel.vue 中的
//    “大先生”选项，递增 ConfigVersion，更新测试、用户文档与 CHANGELOG。旧用户存储中的名称仍被保留，
//    恢复候选后可重新生效。
// {
//   name: '大先生',
//   href: 'https://chat.zju.edu.cn',
//   icon: '<div class="block-group__item__logo" style="background-color: #4472c4;">工</div>',
//   title: '大先生',
//   content: '浙江大学深度融合智能体',
// },

// 1.x 行 3015/3022/3029/3036/3043/3057：indexOf(name) != -1 才加入；buildWebVpnUrl 返回 null（falsy）
// 时该卡跳过（对齐 1.x buildWebVpnUrl 返回 null 时 divCard href 为 null 的实际无效卡——为安全跳过）。
const cards = candidates.filter((c) => props.customCard.indexOf(c.name) !== -1 && c.href);
</script>

<template>
  <div v-for="(card, index) in cards" :key="index" class="block-group__item__wrap">
    <a target="_blank" :href="card.href" class="block-group__item is-active">
      <div class="block-group__item__logo__wrap" v-html="card.icon"></div>
      <div class="block-group__item__content">
        <h2 :title="card.title" class="block-group__item__name">{{ card.title }}</h2>
        <div :title="card.content" class="block-group__item__desc">{{ card.content }}</div>
      </div>
    </a>
  </div>
</template>
