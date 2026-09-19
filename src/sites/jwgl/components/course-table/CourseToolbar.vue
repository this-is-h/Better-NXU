<!--
  jwgl/components/course-table/CourseToolbar.vue — H 课表导出栏（图片 / JSON / Excel）
  对应 1.x：Better NXU.user.js 行 3154-3166（jwglExportCourses 内 export_template 内联模板）
  依赖：vant 的 van-button（按需 import；样式随组件挂载按需注入）
  入口/被谁调用：sites/jwgl/components/course-table/course-reader.js（installCourseToolbar 经 mountVueApp 挂本 SFC 到 #h-export）

  B6 验收 8：导出栏 SFC 化（CourseToolbar.vue 处理 H 导出栏：图片/JSON/Excel）。
  与 1.x 内联模板等价点：
   - WebVPN 的 snapdom 兼容已由 course-reader 的共享适配器处理，因此三类导出在直连/代理环境均显示
   - 按钮点击调用 course-reader 通过 rootProps 传入的导出函数，不再把模块内部函数暴露到页面全局
  注意：van-button 经 Vite 改写为全局 Vue 组件后，模板里 `<van-button>` 渲染需组件已注册——本 SFC 显式 import
   van-button（SFC 编译会自动局部注册 import 的组件），无需整包 vant 注入。
-->
<script setup>
import { Button as VanButton } from 'vant';

const props = defineProps({
  onExportImage: { type: Function, required: true },
  onExportJson: { type: Function, required: true },
  onExportExcel: { type: Function, required: true },
});

const exportImage = () => props.onExportImage();
const exportJson = () => props.onExportJson();
const exportExcel = () => props.onExportExcel();
</script>

<template>
  <div
    class="h-course-toolbar"
    style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 1em"
  >
    <span>H - 将课表导出为</span>
    <van-button plain type="primary" size="small" @click="exportImage">图片</van-button>
    <van-button plain type="primary" size="small" @click="exportJson">json文件</van-button>
    <van-button plain type="primary" size="small" @click="exportExcel">Excel表格</van-button>
  </div>
</template>
