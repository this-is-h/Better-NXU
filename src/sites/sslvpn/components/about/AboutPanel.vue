<!-- SSL VPN 关于页主体。Markdown 由固定 @resource 提供并经 renderMarkdown 消毒后写入。 -->
<script setup>
import { ref, onMounted } from 'vue';
import { NavBar as VanNavBar, CellGroup as VanCellGroup, Cell as VanCell, Dialog as VanDialog } from 'vant';
import { renderMarkdown } from '../../../../libraries/markdown.js';
import { toast, removeToastHandle } from '../../../../libraries/notification.js';

// rootProps：about.page.js 从 Gitee main 的 README/CHANGELOG 资源生成，渲染仍经过消毒。
const props = defineProps({
  aboutMd: { type: String, default: '' }, // README 文本（已去前两行）
  updateMd: { type: String, default: '' }, // CHANGELOG 文本（已去前两行）
  deployToast: { type: null, default: null }, // 部署中常驻 toast 句柄，渲染完移除（1.x 行 4766 removeToast）
});

// 1.x 行 4758-4760：致谢名单元胞点击 → 弹出"关注我们"二维码图（van-dialog v-model:show）。
const dialogH = ref(false);

onMounted(() => {
  // marked 输出先经 DOMPurify 白名单过滤，并为外链补 rel/target。
  renderMarkdown(document.getElementById('aboutmd'), props.aboutMd);
  renderMarkdown(document.getElementById('updatemd'), props.updateMd);
  // 1.x 行 4766-4767：移除"请等待工具部署"常驻 toast，弹"关于我们部署完毕"成功提示。
  if (props.deployToast) removeToastHandle(props.deployToast);
  toast('success', '关于我们部署完毕', 2);
});
</script>

<template>
  <div class="group">
    <van-nav-bar title="关于我们" />
    <div id="aboutmd" class="group-content markdown-body"></div>
  </div>
  <div class="group">
    <van-nav-bar title="更新日志" />
    <div id="updatemd" class="group-content markdown-body"></div>
  </div>
  <div class="group">
    <van-nav-bar title="致谢名单" />
    <div class="group-content">
      <h2>特别鸣谢</h2>
      <van-cell-group inset>
        <van-cell title="H" label="This is H" center is-link @click="dialogH = true">
          <template #icon>
            <img
              style="margin-right: 10px; width: 24px; height: 24px; border-radius: 999px"
              referrerpolicy="no-referrer"
              src="https://raw.giteeusercontent.com/thisish/NXU-CDIG/raw/main/src/assets/img/h.png"
            />
          </template>
        </van-cell>
        <van-cell
          title="Smile232323"
          label="日拱一卒，干就完事了"
          center
          is-link
          url="https://github.com/Smile232323"
        >
          <template #icon>
            <img
              style="margin-right: 10px; width: 24px; height: 24px; border-radius: 999px"
              referrerpolicy="no-referrer"
              src="https://raw.giteeusercontent.com/thisish/Better-NXU/raw/main/assets/img/Smile232323.png"
            />
          </template>
        </van-cell>
        <van-cell title="Karl" label="Your Name Engraved Herein" center>
          <template #icon>
            <img
              style="margin-right: 10px; width: 24px; height: 24px; border-radius: 999px"
              referrerpolicy="no-referrer"
              src="https://raw.giteeusercontent.com/thisish/Better-NXU/raw/main/assets/img/Karl.png"
            />
          </template>
        </van-cell>
        <van-dialog v-model:show="dialogH" title="关注我们">
          <img
            referrerpolicy="no-referrer"
            style="padding: 1em 0.5em; width: 100%"
            src="https://gitee.com/thisish/NXU-CDIG/raw/main/src/assets/img/gzh-large.png"
          />
        </van-dialog>
      </van-cell-group>
      <h2>项目支持</h2>
      <van-cell-group inset>
        <van-cell
          title="ScriptCat"
          label="脚本猫脚本站,在这里你可以与全世界分享你的用户脚本"
          url="https://scriptcat.org/zh-CN"
          center
          is-link
        >
          <template #icon>
            <img
              style="margin-right: 10px; width: 24px"
              src="https://scriptcat.org/_next/image?url=%2Fassets%2Flogo.png&w=64&q=75"
            />
          </template>
        </van-cell>
        <van-cell
          title="Vue"
          label="一款用于构建用户界面的 JavaScript 框架"
          url="https://cn.vuejs.org/"
          center
          is-link
        >
          <template #icon>
            <svg
              style="margin-right: 10px"
              class="logo"
              viewBox="0 0 128 128"
              width="24"
              height="24"
              data-v-35dc6318=""
            >
              <path
                fill="#42b883"
                d="M78.8,10L64,35.4L49.2,10H0l64,110l64-110C128,10,78.8,10,78.8,10z"
                data-v-35dc6318=""
              ></path>
              <path
                fill="#35495e"
                d="M78.8,10L64,35.4L49.2,10H25.6L64,76l38.4-66H78.8z"
                data-v-35dc6318=""
              ></path>
            </svg>
          </template>
        </van-cell>
        <van-cell
          title="Vant"
          label="一个轻量、可定制的移动端组件库"
          url="https://vant-ui.github.io/vant/#/zh-CN"
          center
          is-link
        >
          <template #icon>
            <img
              style="margin-right: 10px; width: 24px"
              src="https://fastly.jsdelivr.net/npm/@vant/assets/logo.png"
            />
          </template>
        </van-cell>
        <van-cell
          title="Tesseract"
          label="Tesseract is an open source text recognition (OCR) Engine, available under the Apache 2.0 license."
          url="https://github.com/tesseract-ocr/tessdoc"
          center
          is-link
        >
          <template #icon>
            <span style="margin-right: 10px; width: 24px; text-align: center; font-weight: bold">T</span>
          </template>
        </van-cell>
        <van-cell
          title="SnapDOM"
          label="SnapDOM is a next-generation DOM Capture Engine — ultra-fast, modular, and extensible."
          url="https://github.com/zumerlab/snapdom"
          center
          is-link
        >
          <template #icon>
            <span style="margin-right: 10px; width: 24px; text-align: center; font-weight: bold">S</span>
          </template>
        </van-cell>
        <van-cell
          title="SheetJS"
          label="SheetJS Tools for Excel Spreadsheets"
          url="https://sheetjs.com/"
          center
          is-link
        >
          <template #icon>
            <img style="margin-right: 10px; width: 24px" src="https://sheetjs.com/sketch128.png" />
          </template>
        </van-cell>
        <van-cell
          title="Marked"
          label="a low-level markdown compiler for parsing markdown without caching or blocking for long periods of time."
          url="https://marked.js.org/"
          center
          is-link
        >
          <template #icon>
            <img style="margin-right: 10px; width: 24px" src="https://marked.js.org/img/logo-black.svg" />
          </template>
        </van-cell>
        <van-cell
          title="一言（Hitokoto）"
          label="动漫也好、小说也好、网络也好，不论在哪里，我们总会看到有那么一两个句子能穿透你的心。我们把这些句子汇聚起来，形成一言网络，以传递更多的感动。如果可以，我们希望我们没有停止服务的那一天。"
          url="https://hitokoto.cn/"
          center
          is-link
        >
          <template #icon>
            <img style="margin-right: 10px; width: 24px" src="https://developer.hitokoto.cn/logo.png" />
          </template>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>
