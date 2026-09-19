<!--
  webvpn/components/home/CustomToolCard.vue — 主页"H - 小工具"卡片组
  对应 1.x：Better NXU.user.js 行 2990-3008（getGMValue('WebVPN.customTool') 时 mainDiv.prepend
           titleCard("H - 小工具","h-tools") + customDiv.appendChild 三张卡：站内小工具/猫狗图鉴/NXU Charge）
  依赖：vue（无 ref，纯展示）
  入口/被谁调用：sites/webvpn/pages/home.page.js 挂本 SFC 渲染整组卡片

  与 1.x 等价点（C5）：
   - 行 2993-2997：站内小工具（https://webvpn.nxu.edu.cn/h/tools，logo"工"#4472c4，"站内小工具"，"一些方便的自制小工具"）
   - 行 2998-3002：猫狗图鉴（https://nxu-cdig.thisish.cn，logo"猫"#95c2fb，"猫狗图鉴"，"猫猫狗狗们的线上家园"）
   - 行 3003-3007：NXU Charge（https://campus-charge.thisish.cn/，logo"猫"#95c2fb，"NXU Charge"，"充电桩状态查看"）
-->
<script setup>
// 1.x 行 2993-3007：三张 H 小工具卡片。
const cards = [
  {
    href: 'https://webvpn.nxu.edu.cn/h/tools',
    icon: '<div class="block-group__item__logo" style="background-color: #4472c4;">工</div>',
    title: '站内小工具',
    content: '一些方便的自制小工具',
  },
  {
    href: 'https://nxu-cdig.thisish.cn',
    icon: '<div class="block-group__item__logo" style="background-color: #95c2fb;">猫</div>',
    title: '猫狗图鉴',
    content: '猫猫狗狗们的线上家园',
  },
  {
    href: 'https://campus-charge.thisish.cn/',
    icon: '<div class="block-group__item__logo" style="background-color: #95c2fb;">猫</div>',
    title: 'NXU Charge',
    content: '充电桩状态查看',
  },
];
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
