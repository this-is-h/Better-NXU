<!--
  webvpn/components/home/CourseGrabCard.vue — 主页"抢课备用网址"卡片组
  对应 1.x：Better NXU.user.js 行 2938-2954（divCard 工厂）+ 行 2968-2987（getGMValue('WebVPN.courseGrab')
           时 mainDiv.prepend(titleCard("抢课备用网址","classes")) + 循环 0..3 校园网备用 + 0..3 校外 webvpn 代理备用）
  依赖：utils/webvpn-url（buildWebVpnUrl 构建校外代理链接）、vue（无 ref，纯展示）
  入口/被谁调用：sites/webvpn/pages/home.page.js 收集卡片数据后挂本 SFC 渲染整组卡片

  与 1.x 等价点（C5）：
   - 行 2941-2950：divCard 模板（a.block-group__item.is-active > .block-group__item__logo__wrap > icon +
     .block-group__item__content > h2[title] + div[title]）。SFC v-for cards 数组渲染同结构。
   - 行 2971-2977：4 张校园网备用（http://202.201.128.234:8080~8083，logo"抢"蓝底，备用1-4，"仅校园网可用"）。
   - 行 2978-2986：4 张校外备用（buildWebVpnUrl(http://202.201.128.234:8080~3/index.action)，logo"抢"蓝底，
     备用5-8，"校外可用"；buildWebVpnUrl 返回 null 则跳过，与 1.x `if(!vpnLink) continue` 一致）。
-->
<script setup>
import { buildWebVpnUrl } from '../../../../utils/webvpn-url.js';

// 1.x 行 2971-2986：8 张抢课备用卡片（4 校园网 + 4 校外代理）。
const cards = [];
for (let i = 0; i <= 3; i++) {
  // 校园网直连：http://202.201.128.234:8080~8083（1.x 行 2972-2975）。
  cards.push({
    href: `http://202.201.128.234:${8080 + i}`,
    icon: '<div class="block-group__item__logo" style="background-color: rgb(80, 135, 229);">抢</div>',
    title: `备用${i + 1}`,
    content: '仅校园网可用',
  });
}
for (let i = 0; i <= 3; i++) {
  // 校外代理：buildWebVpnUrl(http://202.201.128.234:8080~3/index.action)，null 跳过（1.x 行 2979-2986）。
  const vpnLink = buildWebVpnUrl(`http://202.201.128.234:${8080 + i}/index.action`);
  if (!vpnLink) continue;
  cards.push({
    href: vpnLink,
    icon: '<div class="block-group__item__logo" style="background-color: rgb(80, 135, 229);">抢</div>',
    title: `备用${i + 5}`,
    content: '校外可用',
  });
}
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
