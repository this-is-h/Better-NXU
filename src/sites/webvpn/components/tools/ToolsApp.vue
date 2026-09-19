<template>
  <van-nav-bar title="小工具 - H" left-text="返回" left-arrow @click-left="onClickLeft" />
  <van-sidebar v-model="active" style="z-index: 9999" @change="onChange">
    <van-sidebar-item title="在职教师工号查询" />
    <van-sidebar-item title="课表信息" />
    <van-sidebar-item title="🚧等待⚠️施工" />
  </van-sidebar>
  <div id="main">
    <div id="searchTeacher" class="show" style="width: 100%; height: 100%; padding: 10px">
      <form action="/" @submit.prevent>
        <van-search
          v-model="searchValue"
          show-action
          placeholder="请输入需要查询的教师姓名"
          @search="onSearch"
        >
          <template #action>
            <div @click="onSearchClick">搜索</div>
          </template>
        </van-search>
      </form>
      <div
        style="
          width: 100%;
          display: flex;
          align-content: center;
          justify-content: center;
          overflow: auto;
          height: calc(100% - 54px);
        "
      >
        <div v-for="(teachers, columnIndex) in teacherList" :key="columnIndex" style="width: 33%">
          <van-cell-group inset>
            <van-cell
              v-for="teacher in teachers"
              :key="`${teacher.number}-${teacher.name}`"
              :title="teacher.name"
              :value="teacher.number"
              :label="teacher.unit"
              clickable
              @click="teacherClick(teacher)"
            />
          </van-cell-group>
        </div>
      </div>
      <div class="credits-bar">
        <span>数据来源：</span>
        <a href="https://cxcy.nxu.edu.cn/" target="_blank" rel="noopener"> 宁夏大学创新创业学院 </a>
        <span>宁夏大学创新创业服务平台</span>
      </div>
    </div>
    <!-- <div>
      <iframe src="//campus-charge.thisish.cn" style="width: 100%;height: 100%;border: none;"></iframe>
    </div> -->
    <div class="personal-schedule-page">
      <van-tabs ref="personalTabsRef" v-model:active="personalTab" class="personal-schedule-tabs">
        <template #nav-bottom>
          <div v-show="personalScheduleToolbarVisible" class="personal-schedule-toolbar">
            <form action="/" class="personal-link-search-form" @submit.prevent>
              <van-search
                v-model="personalLink"
                class="personal-link-search"
                show-action
                clearable
                placeholder="输入课表链接，如 https://portal.nxu.edu.cn/cal/xxxx"
                @search="loadScheduleFromInput"
              >
                <template #action>
                  <div @click="loadScheduleFromInput">查看课表</div>
                </template>
              </van-search>
            </form>
            <div class="personal-schedule-actions">
              <van-button
                v-if="canViewMySchedule"
                size="small"
                icon="user-o"
                type="primary"
                plain
                :loading="personalLoading"
                @click="viewMySchedule"
                >查看我的</van-button
              >
              <van-uploader
                accept=".json,application/json"
                result-type="file"
                :disabled="personalLoading"
                :after-read="handlePersonalUpload"
              >
                <van-button size="small" icon="upgrade" type="primary" plain>上传 JSON</van-button>
              </van-uploader>
              <van-button
                size="small"
                icon="down"
                type="primary"
                plain
                :disabled="!canExportPersonalJson"
                @click="exportPersonalJson"
                >导出 JSON</van-button
              >
              <van-button size="small" icon="photo-o" type="primary" @click="exportPersonalImage"
                >导出图片</van-button
              >
            </div>
          </div>
        </template>
        <van-tab title="课程总览" name="overview">
          <div class="personal-stats">
            <div ref="personalStatsCapture" class="personal-stats-capture">
              <van-empty v-if="!personalSchedule" description="暂无可统计的课表" />
              <template v-else>
                <div class="personal-stat-grid">
                  <div class="personal-stat-card">
                    <div class="personal-stat-label">本学期课程</div>
                    <div class="personal-stat-value">{{ personalStats.totalCourses }}</div>
                    <div class="personal-stat-unit">门</div>
                  </div>
                  <div class="personal-stat-card">
                    <div class="personal-stat-label">总课时</div>
                    <div class="personal-stat-value">{{ personalStats.totalHours }}</div>
                    <div class="personal-stat-unit">节</div>
                  </div>
                  <div class="personal-stat-card">
                    <div class="personal-stat-label">实际课次</div>
                    <div class="personal-stat-value">{{ personalStats.totalLessons }}</div>
                    <div class="personal-stat-unit">次</div>
                  </div>
                  <div class="personal-stat-card">
                    <div class="personal-stat-label">教学周</div>
                    <div class="personal-stat-value">{{ personalStats.totalWeeks }}</div>
                    <div class="personal-stat-unit">周</div>
                  </div>
                </div>
                <div class="personal-chart-card">
                  <h3>每周课时分布</h3>
                  <div class="personal-week-bars">
                    <div v-for="item in personalStats.weekly" :key="item.week" class="personal-week-bar-item">
                      <div class="personal-week-bar-value">{{ item.hours }}</div>
                      <div class="personal-week-bar-track">
                        <div class="personal-week-bar" :style="{ height: item.percent + '%' }"></div>
                      </div>
                      <div>第{{ item.week }}周</div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </van-tab>
        <van-tab title="个人课表" name="personal">
          <div class="personal-panel-shell">
            <div v-if="personalSchedule" class="personal-week-filter">
              <van-tabs
                ref="personalCourseWeekTabsRef"
                v-model:active="selectedCourseWeek"
                type="card"
                shrink
                class="personal-week-axis"
              >
                <van-tab
                  v-for="option in personalWeekOptions"
                  :key="option.value"
                  :name="option.value"
                  :title="option.text"
                />
              </van-tabs>
            </div>
            <div class="personal-schedule-capture">
              <div ref="personalCourseCapture" class="personal-table-capture">
                <div v-if="personalLoading" class="personal-empty-state">
                  <van-loading size="28px" vertical>正在获取课表</van-loading>
                </div>
                <van-empty
                  v-else-if="!personalSchedule"
                  :description="personalError || '暂无课表，请输入链接或上传 JSON'"
                />
                <div v-else class="personal-course-grid">
                  <div class="personal-course-grid-corner">节次 / 时间</div>
                  <div
                    v-for="day in personalDays"
                    :key="'header-' + day.number"
                    class="personal-course-grid-day"
                    :style="{ gridColumn: String(day.number + 1), gridRow: '1' }"
                  >
                    {{ day.text }}
                  </div>
                  <template v-for="row in personalPeriodRows" :key="row.key">
                    <div
                      class="personal-course-grid-period"
                      :style="{ gridColumn: '1', gridRow: String(row.period + 1) }"
                    >
                      <div>第 {{ row.label }} 节</div>
                      <div>{{ row.time }}</div>
                    </div>
                    <div
                      v-for="day in personalDays"
                      :key="row.key + '-' + day.number"
                      class="personal-course-grid-cell"
                      :style="{ gridColumn: String(day.number + 1), gridRow: String(row.period + 1) }"
                    ></div>
                  </template>
                  <div
                    v-for="group in personalCourseLayout"
                    :key="group.key"
                    class="personal-course-stack"
                    :style="group.gridStyle"
                  >
                    <div
                      v-for="entry in group.entries"
                      :key="entry.key"
                      class="personal-course-card"
                      :style="{ borderLeftColor: entry.color }"
                    >
                      <div class="personal-course-header">
                        <div class="personal-course-name">{{ entry.name }}</div>
                        <!--<span
                          v-if="entry.variants.length > 1"
                          class="personal-course-variant-count"
                          :class="{ overlap: entry.hasOverlappingVariants }"
                        >{{ entry.hasOverlappingVariants ? '同周多安排' : entry.variants.length + ' 种安排' }}</span>-->
                      </div>
                      <template v-if="entry.variants.length === 1">
                        <div v-if="entry.variants[0].teacherText" class="personal-course-meta">
                          教师：{{ entry.variants[0].teacherText }}
                        </div>
                        <div v-if="entry.variants[0].room" class="personal-course-meta">
                          教室：{{ entry.variants[0].room }}
                        </div>
                        <div class="personal-course-meta">周次：{{ entry.variants[0].weeksText }}</div>
                      </template>
                      <div v-else class="personal-course-variants">
                        <div
                          v-for="variant in entry.variants"
                          :key="variant.key"
                          class="personal-course-variant"
                        >
                          <div class="personal-course-variant-weeks">{{ variant.weeksText }}</div>
                          <div class="personal-course-variant-detail">{{ variant.detailText }}</div>
                        </div>
                      </div>
                      <div v-if="entry.periodText" class="personal-course-meta">
                        节次：{{ entry.periodText }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab title="个人空课表" name="personal-free">
          <div class="personal-panel-shell">
            <div v-if="personalSchedule" class="personal-week-filter">
              <van-tabs
                ref="personalFreeWeekTabsRef"
                v-model:active="selectedFreeWeek"
                type="card"
                shrink
                class="personal-week-axis"
              >
                <van-tab
                  v-for="option in personalWeekOptions"
                  :key="option.value"
                  :name="option.value"
                  :title="option.text"
                />
              </van-tabs>
            </div>
            <div class="personal-schedule-capture">
              <div ref="personalFreeCapture" class="personal-table-capture">
                <van-empty v-if="!personalSchedule" description="暂无课表数据" />
                <table v-else class="personal-table" aria-label="个人空闲时间表">
                  <caption class="visually-hidden">
                    按星期和节次展示完全空闲、仅有线上课程可协调或有课状态
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col" class="personal-period-cell">节次 / 时间</th>
                      <th v-for="day in personalDays" :key="day.number" scope="col">{{ day.text }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in personalPeriodRows" :key="row.key">
                      <th scope="row" class="personal-period-cell">
                        <div>第 {{ row.label }} 节</div>
                        <div>{{ row.time }}</div>
                      </th>
                      <td v-for="day in personalDays" :key="day.number">
                        <div
                          class="personal-free-cell"
                          :class="{
                            'personal-not-free': !personalFreeGrid[row.key][day.number].isFree,
                            'personal-all-term-free': personalFreeGrid[row.key][day.number].isAllTermFree,
                            'personal-online-only': personalFreeGrid[row.key][day.number].hasOnline,
                          }"
                          :aria-label="personalFreeGrid[row.key][day.number].ariaLabel"
                        >
                          {{ personalFreeGrid[row.key][day.number].text }}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab title="空课表生成" name="multi-free">
          <div class="schedule-manager schedule-manager-tab">
            <div class="schedule-manager-actions">
              <span class="schedule-manager-hint">前往教务系统导出 JSON 文件后在此添加</span>
              <div style="display: flex; align-items: center">
                <div class="export-container">
                  <div class="export-btn" @click="toggleExportMenu">
                    <span>导出</span>
                    <div v-if="showExportMenu" class="export-dropdown">
                      <div @click="exportToExcel">导出为Excel</div>
                      <div @click="exportToImage">导出为图片</div>
                    </div>
                  </div>
                </div>
                <button class="add-btn" :disabled="multiScheduleLoading" @click="triggerFileInput">
                  <span>+</span> 添加人员
                </button>
              </div>
            </div>

            <!-- 主内容区 -->
            <div class="main-content">
              <div v-if="fileList.length > 0" class="file-list-header">
                <h3>成员管理 ({{ fileList.length }})</h3>
                <div class="files-display">
                  <span v-for="file in fileList" :key="file.filename" class="file-tag">
                    {{ file.name }}
                    <button class="tag-delete-btn" @click="removeFile(file.filename, $event)">×</button>
                  </span>
                </div>
              </div>

              <div class="schedule-container">
                <table ref="multiEmptyTable" class="schedule-table" aria-label="多人空闲时间表">
                  <caption class="visually-hidden">
                    按星期和节次展示各成员的完全空闲、仅有线上课程可协调、部分可用或无人空闲状态
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col" class="time-header">节次</th>
                      <th v-for="day in daysOfWeek" :key="day" scope="col">{{ day }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(period, index) in classPeriods" :key="index">
                      <th scope="row" class="period-cell">{{ period }}</th>
                      <td v-for="day in daysOfWeek" :key="day" class="schedule-cell">
                        <div v-if="allFilesSchedule[day] && allFilesSchedule[day][index].length > 0">
                          <div
                            v-for="(item, i) in allFilesSchedule[day][index]"
                            :key="item.key || i"
                            class="file-item-display"
                            :class="{
                              'file-item-all-free': item.status === 'free',
                              'file-item-online-only': item.status === 'online',
                            }"
                          >
                            {{ item.text }}
                          </div>
                          <div
                            class="availability-summary"
                            :class="'status-' + multiAvailabilitySummary[day][index].status"
                          >
                            {{ multiAvailabilitySummary[day][index].text }}
                          </div>
                        </div>
                        <div v-else class="empty-cell">
                          {{ multiAvailabilitySummary[day][index].text }}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab title="课表密钥管理" name="keys">
          <div class="schedule-key-page">
            <div class="schedule-key-content">
              <div class="schedule-key-guide">
                <p>
                  <strong>加密密钥（公钥）可以分享：</strong
                  >对方导出课表时使用你的加密密钥，生成的文件只能由你的解密密钥打开。
                </p>
                <p>
                  <strong>解密密钥（私钥）必须保密：</strong
                  >不要发给同学、群聊或任何其他人。解密密钥丢失后无法恢复，旧加密文件也无法打开。
                </p>
                <p>换浏览器、清理脚本数据、重装脚本或重新生成密钥前，请先自行备份解密密钥。</p>
              </div>
              <div v-if="!scheduleKeyPair" class="schedule-key-empty">
                <van-empty description="尚未生成课表密钥" />
                <van-button type="primary" :loading="scheduleKeyGenerating" @click="generateScheduleKeyPair"
                  >生成课表密钥</van-button
                >
              </div>
              <template v-else>
                <section class="schedule-key-section">
                  <div class="schedule-key-section-title">
                    <div>
                      <strong>加密密钥（公钥，可分享）</strong
                      ><span>可以复制并发送给需要向你提供课表的人</span>
                    </div>
                    <van-button size="small" type="primary" plain @click="copyScheduleKey('public')"
                      >复制加密密钥</van-button
                    >
                  </div>
                  <textarea
                    class="schedule-key-text"
                    :value="scheduleKeyPair.publicKey"
                    rows="8"
                    readonly
                  ></textarea>
                </section>
                <section class="schedule-key-section schedule-private-key-section">
                  <div class="schedule-key-section-title">
                    <div>
                      <strong>解密密钥（私钥，请保密）</strong
                      ><span>只由你本人保管，任何人索要都不要发送</span>
                    </div>
                    <div class="schedule-key-buttons">
                      <van-button
                        size="small"
                        plain
                        @click="showSchedulePrivateKey = !showSchedulePrivateKey"
                        >{{ showSchedulePrivateKey ? '隐藏解密密钥' : '显示解密密钥' }}</van-button
                      >
                      <van-button size="small" type="danger" plain @click="copyScheduleKey('private')"
                        >复制解密密钥</van-button
                      >
                    </div>
                  </div>
                  <textarea
                    v-if="showSchedulePrivateKey"
                    class="schedule-key-text schedule-private-key-text"
                    :value="scheduleKeyPair.privateKey"
                    rows="12"
                    readonly
                  ></textarea>
                  <div v-else class="schedule-private-key-hidden">
                    解密密钥已隐藏，查看前请确认周围无人窥视屏幕。
                  </div>
                </section>
                <div class="schedule-key-regenerate">
                  <van-button
                    type="danger"
                    plain
                    :loading="scheduleKeyGenerating"
                    @click="generateScheduleKeyPair"
                    >重新生成密钥</van-button
                  >
                </div>
              </template>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
    <div>
      <h3 style="width: 100%; text-align: center">静候佳音...</h3>
    </div>
  </div>
</template>

<script setup>
/**
 * sites/webvpn/components/tools/ToolsApp — webvpn 小工具页（1.x webvpnHTools 的 Vue 段 SFC 化）
 * 对应 1.x：Better NXU.user.js 行 5800-7200（tools_template + Vue.createApp({template,setup,mounted})）
 * 依赖：vue（ref/reactive/computed/watch/nextTick/onUnmounted/h——vite-plugin-monkey 改写为对 IIFE 参数 vue 的引用）、
 *       vant npm 按需（NavBar/Sidebar/SidebarItem/Search/Cell/CellGroup/Tabs/Tab/Uploader/Button/Empty/Loading +
 *       showToast/showConfirmDialog/Field；样式随工具页按需注入）、schedule、crypto、utils（file/console/gm）、
 *       config/gm-store、libraries/notification、composables/use-schedule-export、
 *       tools/{teacher-search,ics-id,schedule-file,schedule-view}（P3 方案 A：课表视图纯逻辑抽出到 schedule-view）
 * 入口/被谁调用：sites/webvpn/pages/tools.page.js（mountVueApp({root:ToolsApp,id:'tools'})）
 *
 * 挂载形态：工具页是"接管重建"形态（清 body + 重建 #tools 容器），与 home 的"原生页叠加注入"不同——
 *  body 清空、容器 #tools 由 mountAppPage 创建（1.x GM_addElement 等价）。SFC 根模板即 1.x tools_template
 *  （vant 组件标签 PascalCase 化：van-* → Van*，供 script setup 按需 import 注册；模板结构逐字保留）。
 *
 * 与 1.x 等价点（C5）：
 *  - setup() 全段（行 6169-7193）逐字迁移：教师查询（searchTeacher 循环分页）、个人课表（拉取/上传/导出）、
 *    密钥管理（generateScheduleKeyPair/copyScheduleKey）、多人空课表（fileList/allFilesSchedule/
 *    multiAvailabilitySummary/导出 Excel/图片）。仅标识符改写：
 *    Vue.ref/computed/... → import；vant.* → npm import；CourseScheduleTools.* → schedule 桶；
 *    ScheduleCryptoTools.* → crypto 桶；getGMValue/setGMValue → gm-store；GM_setClipboard → #gm；
 *    snapdom/XLSX → unsafeWindow.snapdom/.XLSX（@require 注入页面 window，B6 同模式）；
 *    裸 open() → vite-plugin-monkey 官方 GM_openInTab。
 *  - mounted()（行 7195-7199）的"移除部署中 toast + 部署完毕两条 toast"移到 tools.page.js（mountAppPage
 *    返回 deployToast 句柄，SFC 拿不到），时序等价：mountVueApp 完成挂载后 page 同步执行。
 *  - 1.x return 块（行 7140-7193）无需迁移：script setup 顶层绑定自动暴露。
 */
import { ref, reactive, computed, watch, nextTick, onUnmounted, h } from 'vue';
import {
  showToast,
  showConfirmDialog,
  Field,
  NavBar as VanNavBar,
  Sidebar as VanSidebar,
  SidebarItem as VanSidebarItem,
  Search as VanSearch,
  CellGroup as VanCellGroup,
  Cell as VanCell,
  Tabs as VanTabs,
  Tab as VanTab,
  Uploader as VanUploader,
  Button as VanButton,
  Empty as VanEmpty,
  Loading as VanLoading,
} from 'vant';
import { normalize, fetchFromUrl, getMaps, summarizePeopleAvailability } from '../../../../schedule/index.js';
import {
  getTotalWeeks,
  buildPersonalCourseEntries,
  buildPersonalCourseLayout,
  getLessonAvailability,
  formatAvailabilityWeeks,
  buildPersonalFreeGrid,
  personalDays,
  personalPeriodRows,
} from './schedule-view.js';
import {
  storageKey as scheduleStorageKey,
  generateKeyPair,
  maxEnvelopeBytes,
} from '../../../../crypto/index.js';
import { closeCurrentTab, downloadTextFile } from '../../../../utils/file.js';
import { downloadSnapdomImage } from '../../../../utils/snapdom.js';
import { GM_openInTab, GM_setClipboard, unsafeWindow as grantedUnsafeWindow } from '#gm';
import { MyConsole } from '../../../../utils/console.js';
import { getGMValue, setGMValue } from '../../../../config/gm-store.js';
import { removeToastHandle, toast } from '../../../../libraries/notification.js';
import { prepareScheduleExport } from '../../../../composables/use-schedule-export.js';
import { searchTeachers } from './teacher-search.js';
import { getIcsId, getStudentOwner } from './ics-id.js';
import { parseScheduleFileContent } from './schedule-file.js';

const console = MyConsole('[小工具]');
const setClipboard = GM_setClipboard;
const pageWindow = grantedUnsafeWindow ?? window;

// ===== 教师查询（1.x 行 6169-6227） =====
const active = ref(0);
const onClickLeft = () => {
  closeCurrentTab();
};
const onChange = (index) => {
  document.querySelector('div#main > div.show').classList.remove('show');
  const tools_tab = document.querySelectorAll('div#main > div');
  tools_tab[index].classList.add('show');
  if (index === 1) {
    ensurePersonalSchedule();
    resizePersonalTabs();
  }
};
const searchValue = ref('');
const teacherList = ref([]);
const MAX_TEACHER_PAGES = 100;
let teacherSearchVersion = 0;
let teacherSearchController = null;
const onSearch = (val) => {
  void searchTeacher(val);
};
const onSearchClick = () => {
  void searchTeacher(searchValue.value);
};
const searchTeacher = async (val) => {
  const keyword = String(val || '').trim();
  teacherSearchController?.abort();
  teacherSearchController = null;
  const requestVersion = ++teacherSearchVersion;
  if (!keyword) {
    teacherList.value = [];
    return;
  }
  // vant.showToast(val)
  if (keyword.toLowerCase() === 'moss') {
    toast(
      'info',
      decodeURI(
        '%E6%81%AD%E5%96%9C%E4%BD%A0%E5%8F%91%E7%8E%B0%E4%BA%86%E8%BF%99%E4%B8%AA%E5%B0%8F%E5%BD%A9%E8%9B%8B~'
      ),
      0
    );
    GM_openInTab('https://moss.thisish.cn', { active: true, insert: true, setParent: false });
    return;
  }
  const controller = new AbortController();
  teacherSearchController = controller;
  const rows = [[], [], []];
  let nowPage = 1;
  let allPages = 1;
  let nowRow = 0;
  try {
    while (nowPage <= allPages) {
      const list = await searchTeachers(keyword, nowPage, { signal: controller.signal });
      if (requestVersion !== teacherSearchVersion) return;
      if (!list.success) {
        toast('error', list.msg);
        return;
      }
      if (!Array.isArray(list.data)) throw new Error('教师查询结果格式异常');
      for (let i = 0; i < list.data.length; i++) {
        const row = (nowRow + i) % 3;
        rows[row].push(list.data[i]);
      }
      nowRow = (nowRow + list.data.length) % 3;
      const responsePage = Number(list.page?.[0]);
      allPages = Number(list.page?.[1]);
      if (
        !Number.isInteger(responsePage) ||
        !Number.isInteger(allPages) ||
        responsePage !== nowPage ||
        allPages < responsePage ||
        allPages > MAX_TEACHER_PAGES
      ) {
        throw new Error('教师查询分页信息异常');
      }
      nowPage = responsePage + 1;
    }
    if (requestVersion === teacherSearchVersion) teacherList.value = rows;
  } catch (error) {
    if (error?.name !== 'AbortError' && requestVersion === teacherSearchVersion) {
      console('教师查询失败', error, 'error');
      toast('error', error?.message || '教师查询失败，请稍后重试', 4);
    }
  } finally {
    if (requestVersion === teacherSearchVersion) teacherSearchController = null;
  }
};
const teacherClick = (teacher) => {
  const number = String(teacher?.number || '');
  if (!number) return;
  setClipboard?.(number);
  showToast('工号已复制');
};

// ===== 多人空课表节次行常量（个人课表常量 personalDays/personalPeriodRows 已抽到 components/tools/schedule-view.js，P3） =====
const scheduleManagerPeriodRows = [
  { key: '1-2', label: '1-2', periods: [1, 2], time: '08:10-09:45' },
  { key: '3-4', label: '3-4', periods: [3, 4], time: '10:15-11:50' },
  { key: '5-6', label: '5-6', periods: [5, 6], time: '14:00-15:35' },
  { key: '7-8', label: '7-8', periods: [7, 8], time: '15:55-17:30' },
  { key: '9-10', label: '9-10', periods: [9, 10], time: '19:00-20:35' },
];
const personalLink = ref('');
const personalSchedule = ref(null);
const personalSource = ref('');
const personalLoading = ref(false);
const personalError = ref('');
const personalTab = ref('personal');
const personalScheduleToolbarVisible = computed(() =>
  ['overview', 'personal', 'personal-free'].includes(personalTab.value)
);
const selectedCourseWeek = ref(0);
const selectedFreeWeek = ref(0);
const personalTabsRef = ref(null);
const personalCourseWeekTabsRef = ref(null);
const personalFreeWeekTabsRef = ref(null);
const personalCourseCapture = ref(null);
const personalStatsCapture = ref(null);
const personalFreeCapture = ref(null);
let personalInitialized = false;
let personalRequestVersion = 0;
let personalMetadataController = null;
let ownerRequestController = null;
const importedSchedulePrivateKeys = new Map();

// ===== 课表密钥管理（1.x 行 6267-6314） =====
const savedScheduleKeyPair = getGMValue(scheduleStorageKey);
const scheduleKeyPair = ref(
  savedScheduleKeyPair?.publicKey && savedScheduleKeyPair?.privateKey ? savedScheduleKeyPair : null
);
const scheduleKeyGenerating = ref(false);
const showSchedulePrivateKey = ref(false);

const generateScheduleKeyPair = async () => {
  if (scheduleKeyPair.value) {
    try {
      const action = await showConfirmDialog({
        title: '重新生成课表密钥？',
        message:
          '重新生成后，当前解密密钥会被替换。以前的加密课表仍需要旧解密密钥才能打开，请先复制并妥善备份旧解密密钥。',
        messageAlign: 'left',
        confirmButtonText: '确认重新生成',
        confirmButtonColor: '#ee0a24',
        cancelButtonText: '取消',
        closeOnClickOverlay: false,
      });
      if (action !== 'confirm') return;
    } catch {
      return;
    }
  }
  scheduleKeyGenerating.value = true;
  try {
    const keyPair = await generateKeyPair();
    await setGMValue(scheduleStorageKey, keyPair);
    scheduleKeyPair.value = keyPair;
    showSchedulePrivateKey.value = false;
    importedSchedulePrivateKeys.clear();
    toast('success', '课表密钥已生成，请立即备份解密密钥', 4);
  } catch (error) {
    toast('error', error.message || '课表密钥生成失败', 4);
  } finally {
    scheduleKeyGenerating.value = false;
  }
};

const copyScheduleKey = (type) => {
  const isPrivate = type === 'private';
  const value = isPrivate ? scheduleKeyPair.value?.privateKey : scheduleKeyPair.value?.publicKey;
  if (!value) return;
  setClipboard?.(value);
  toast('success', isPrivate ? '解密密钥已复制，请勿发送给他人' : '加密密钥已复制，可以发给他人', 3);
};

// ===== 个人课表加载/切换（1.x 行 6316-6346） =====
const resizePersonalTabs = () =>
  nextTick(() => {
    personalTabsRef.value?.resize();
    const activeWeekTabs =
      personalTab.value === 'personal'
        ? personalCourseWeekTabsRef
        : personalTab.value === 'personal-free'
          ? personalFreeWeekTabsRef
          : null;
    activeWeekTabs?.value?.resize();
  });

watch(personalTab, resizePersonalTabs);

const personalWeekOptions = computed(() => {
  const options = [{ text: '总体', value: 0 }];
  for (let week = 1; week <= getTotalWeeks(personalSchedule.value); week++) {
    options.push({ text: `第${week}周`, value: week });
  }
  return options;
});

const canExportPersonalJson = computed(() => {
  if (!personalSchedule.value || personalSource.value === 'upload') return false;
  if (personalSource.value === 'personal') return true;
  const ownIcsId = String(getGMValue('icsId') || '');
  const displayedIcsId = personalSchedule.value.sourceUrl?.match(/\/cal\/(\d+)/)?.[1] || '';
  return personalSource.value === 'link' && Boolean(ownIcsId) && displayedIcsId === ownIcsId;
});

const canViewMySchedule = computed(() => personalSource.value !== 'personal');

const setPersonalSchedule = (data, source, url = '') => {
  personalSchedule.value = normalize(data);
  personalSource.value = source;
  personalError.value = '';
  selectedCourseWeek.value = 0;
  selectedFreeWeek.value = 0;
  if (url) personalLink.value = url;
  console(
    '数据已提交到页面状态',
    {
      source,
      courseCount: personalSchedule.value.courses.length,
      lessonCount: personalSchedule.value.lessons.length,
    },
    'info'
  );
};

const loadPersonalScheduleById = async (icsId, source) => {
  personalMetadataController?.abort();
  personalMetadataController = null;
  const requestVersion = ++personalRequestVersion;
  const url = `https://portal.nxu.edu.cn/cal/${icsId}`;
  personalLoading.value = true;
  personalError.value = '';
  console('开始加载课表', { source, requestVersion }, 'info');
  try {
    const data = await fetchFromUrl(url, {
      owner: { id: '', name: '' },
    });
    if (requestVersion !== personalRequestVersion) {
      console('丢弃已过期的加载结果', { source, requestVersion }, 'debug');
      return;
    }
    setPersonalSchedule(data, source, url);
  } catch (error) {
    if (requestVersion !== personalRequestVersion) {
      console('丢弃已过期请求的错误', { source, requestVersion }, 'debug');
      return;
    }
    personalSchedule.value = null;
    personalSource.value = '';
    personalError.value = error.message || '课表加载失败';
    console('课表加载失败', { source, requestVersion, error }, 'error');
    toast('error', personalError.value, 4);
  } finally {
    if (requestVersion === personalRequestVersion) personalLoading.value = false;
  }
};

const ensurePersonalSchedule = async () => {
  if (personalInitialized) {
    console('跳过重复初始化', '已有初始化任务或数据', 'debug');
    return;
  }
  personalInitialized = true;
  const requestVersion = ++personalRequestVersion;
  personalMetadataController?.abort();
  const controller = new AbortController();
  personalMetadataController = controller;
  personalLoading.value = true;
  console('开始初始化当前账号课表', { requestVersion }, 'info');
  try {
    let icsId = getGMValue('icsId');
    if (!icsId) icsId = await getIcsId({ signal: controller.signal });
    if (requestVersion !== personalRequestVersion) {
      console('初始化结果已过期', { requestVersion }, 'debug');
      return;
    }
    await loadPersonalScheduleById(String(icsId), 'personal');
  } catch (error) {
    if (requestVersion !== personalRequestVersion) return;
    personalInitialized = false;
    personalLoading.value = false;
    personalError.value = error.message || '个人课表初始化失败';
    console('当前账号课表初始化失败', { requestVersion, error }, 'error');
    toast('error', personalError.value, 4);
  } finally {
    if (personalMetadataController === controller) personalMetadataController = null;
  }
};

const parsePersonalLink = (input) => {
  const value = String(input || '').trim();
  const match = value.match(/^(?:https?:\/\/portal\.nxu\.edu\.cn\/cal\/)?(\d{6,})\/?(?:[?#].*)?$/i);
  if (!match) throw new Error('请输入有效的宁夏大学课表链接');
  return match[1];
};

const loadScheduleFromInput = async (value) => {
  try {
    const input = typeof value === 'string' ? value : personalLink.value;
    const icsId = parsePersonalLink(input);
    await loadPersonalScheduleById(icsId, 'link');
  } catch (error) {
    personalError.value = error.message;
    console('用户输入的课表链接无效', error, 'warn');
    toast('warning', error.message, 3);
  }
};

const viewMySchedule = async () => {
  const requestVersion = ++personalRequestVersion;
  personalMetadataController?.abort();
  const controller = new AbortController();
  personalMetadataController = controller;
  personalLoading.value = true;
  try {
    let icsId = getGMValue('icsId');
    if (!icsId) icsId = await getIcsId({ signal: controller.signal });
    if (requestVersion !== personalRequestVersion) return;
    await loadPersonalScheduleById(String(icsId), 'personal');
  } catch (error) {
    if (requestVersion !== personalRequestVersion || error?.name === 'AbortError') return;
    personalError.value = error.message || '个人课表加载失败';
    console('返回当前账号课表失败', error, 'error');
    toast('error', personalError.value, 4);
  } finally {
    if (personalMetadataController === controller) personalMetadataController = null;
    if (requestVersion === personalRequestVersion) personalLoading.value = false;
  }
};

const handlePersonalUpload = async (fileInfo) => {
  personalMetadataController?.abort();
  personalMetadataController = null;
  const requestVersion = ++personalRequestVersion;
  personalLoading.value = true;
  personalError.value = '';
  try {
    const file = fileInfo.file;
    if (!file || !file.name.toLowerCase().endsWith('.json')) {
      throw new Error('请选择 JSON 课表文件');
    }
    if (personalSource.value === 'upload') {
      personalSchedule.value = null;
      personalSource.value = '';
    }
    if (file.size > maxEnvelopeBytes) throw new Error('课表文件不能超过 7 MB');
    console(
      '开始解析上传文件',
      {
        requestVersion,
        bytes: file.size,
        type: file.type || 'unknown',
      },
      'info'
    );
    const data = await parseScheduleFileContent(await file.text(), {
      filename: file.name,
      keyCache: importedSchedulePrivateKeys,
      declinedKeyIds: new Set(),
    });
    if (requestVersion !== personalRequestVersion) {
      console('丢弃已过期的上传解析结果', { requestVersion }, 'debug');
      return;
    }
    setPersonalSchedule(data, 'upload');
    console(
      '上传文件解析完成',
      {
        requestVersion,
        courseCount: data.courses.length,
        lessonCount: data.lessons.length,
      },
      'info'
    );
    toast('success', `已加载 ${file.name}`, 2);
  } catch (error) {
    if (requestVersion !== personalRequestVersion) return;
    personalError.value = error.message || 'JSON 文件解析失败';
    console('上传文件解析失败', { requestVersion, error }, 'error');
    toast('error', personalError.value, 4);
  } finally {
    if (requestVersion === personalRequestVersion) personalLoading.value = false;
  }
};

// ===== 导出身份验证（1.x 行 6489-6555） =====
const requestStudentId = async (initialValue = '') => {
  const value = ref(String(initialValue || ''));
  try {
    const action = await showConfirmDialog({
      title: '输入学号',
      messageAlign: 'left',
      confirmButtonText: '验证',
      message: () =>
        h('div', null, [
          h(
            'div',
            { style: 'padding: 0 16px 8px;color:#646566;font-size:13px;' },
            '只能获取当前 WebVPN 登录账号的身份信息，请输入与登录账号一致的学号。'
          ),
          h(Field, {
            modelValue: value.value,
            label: '学号',
            clearable: true,
            autocomplete: 'off',
            placeholder: '请输入学号',
            'onUpdate:modelValue': (input) => (value.value = String(input || '')),
          }),
        ]),
      beforeClose(action) {
        if (action === 'confirm' && !/^\d{6,}$/.test(value.value.trim())) {
          showToast('请输入有效学号');
          return false;
        }
        return true;
      },
    });
    return action === 'confirm' ? value.value.trim() : '';
  } catch {
    return '';
  }
};

const getVerifiedStudentOwner = async () => {
  const existingOwner = personalSchedule.value?.owner;
  if (existingOwner?.id && existingOwner?.name) return existingOwner;
  const savedStudentId = String(getGMValue('WebVPN.username') || '').trim();
  let studentId = '';
  if (savedStudentId) {
    try {
      const action = await showConfirmDialog({
        title: '确认学号',
        message: `是否使用学号 ${savedStudentId} 获取身份信息？\n\n学号必须与当前 WebVPN 登录账号一致；只能导出登录账号本人的课表，其他账号的课表只能查看。`,
        messageAlign: 'left',
        confirmButtonText: '确认使用',
        cancelButtonText: '重新输入',
      });
      if (action === 'confirm') studentId = savedStudentId;
    } catch {
      // 用户选择重新输入。
    }
  }
  while (true) {
    if (!studentId) studentId = await requestStudentId();
    if (!studentId) {
      const error = new Error('已取消课表导出');
      error.code = 'EXPORT_CANCELLED';
      throw error;
    }
    try {
      ownerRequestController?.abort();
      const controller = new AbortController();
      ownerRequestController = controller;
      try {
        return await getStudentOwner(studentId, { signal: controller.signal });
      } finally {
        if (ownerRequestController === controller) ownerRequestController = null;
      }
    } catch (error) {
      if (error.code !== 'STUDENT_ID_MISMATCH') throw error;
      toast('warning', `${error.message}，请重新输入学号`, 4);
      studentId = '';
    }
  }
};

// ===== 导出（1.x 行 6557-6611） =====
const getPersonalExportFilename = (extension) => {
  const ownerName = (personalSchedule.value?.owner?.name || '未命名用户').replace(/[\\/:*?"<>|]/g, '_');
  return `${ownerName} - 课表.${extension}`;
};

const exportPersonalJson = async () => {
  if (!canExportPersonalJson.value) {
    toast('warning', '只能导出当前登录账号本人的课表', 3);
    return;
  }
  console(
    '开始导出',
    {
      courseCount: personalSchedule.value.courses.length,
      lessonCount: personalSchedule.value.lessons.length,
    },
    'info'
  );
  try {
    const owner = await getVerifiedStudentOwner();
    const data = normalize({ ...personalSchedule.value, owner });
    personalSchedule.value = data;
    const result = await prepareScheduleExport(data);
    await downloadTextFile(result.content, getPersonalExportFilename('json'));
    console('导出完成', { encrypted: result.encrypted }, 'info');
    toast('success', result.encrypted ? '加密课表已导出' : '课表 JSON 已导出', 2);
  } catch (error) {
    if (error.code === 'EXPORT_CANCELLED' || error?.name === 'AbortError') {
      console('用户取消导出', '', 'info');
      return;
    }
    console('导出失败', error, 'error');
    toast('error', error.message || '课表导出失败', 4);
  }
};

const exportPersonalImage = async () => {
  await nextTick();
  const exportOptions = {
    overview: personalStatsCapture.value,
    personal: personalCourseCapture.value,
    'personal-free': personalFreeCapture.value,
  };
  const target = exportOptions[personalTab.value];
  if (!target) {
    console('当前 Tab 尚未完成渲染', { tab: personalTab.value }, 'warn');
    toast('warning', '当前页面尚未完成渲染', 2);
    return;
  }
  console('开始导出', { tab: personalTab.value }, 'info');
  try {
    const progressToast = toast('info', '正在生成课表图片，请稍候', 0);
    try {
      await downloadSnapdomImage({
        snapdom: pageWindow.snapdom,
        target,
        options: {
          format: 'png',
          filename: getPersonalExportFilename('png'),
          scale: 2.5,
          quality: 1,
        },
        fixWebVpn: true,
        pageWindow,
      });
    } finally {
      removeToastHandle(progressToast);
    }
    console('导出完成', { tab: personalTab.value }, 'info');
    toast('success', '课表图片已导出', 3);
  } catch (error) {
    console('导出失败', { tab: personalTab.value, error }, 'error');
    toast('error', '导出图片失败，请重试', 3);
  }
};

// ===== 个人课表布局/统计（1.x 行 6613-6684） =====
const personalCourseLayout = computed(() => {
  const data = personalSchedule.value;
  if (!data) return [];
  return buildPersonalCourseLayout(buildPersonalCourseEntries(data, Number(selectedCourseWeek.value)));
});

const personalStats = computed(() => {
  const data = personalSchedule.value;
  if (!data) return { totalCourses: 0, totalHours: 0, totalLessons: 0, totalWeeks: 0, weekly: [] };
  const totalWeeks = getTotalWeeks(data);
  const weekly = Array.from({ length: totalWeeks }, (_, index) => {
    const week = index + 1;
    const lessons = data.lessons.filter((lesson) => lesson.week === week);
    return { week, hours: lessons.reduce((sum, lesson) => sum + lesson.periods.length, 0) };
  });
  const maxHours = Math.max(1, ...weekly.map((item) => item.hours));
  weekly.forEach((item) => (item.percent = Math.max(2, Math.round((item.hours / maxHours) * 100))));
  return {
    totalCourses: data.courses.length,
    totalHours: data.lessons.reduce((sum, lesson) => sum + lesson.periods.length, 0),
    totalLessons: data.lessons.length,
    totalWeeks,
    weekly,
  };
});

// ===== 空闲分析（1.x 行 6788-6876） =====
const personalFreeGrid = computed(() => {
  return buildPersonalFreeGrid(personalSchedule.value, Number(selectedFreeWeek.value));
});

// ===== 多人空课表（1.x 行 6878-6884） =====
// 响应式数据
const uploadedFiles = reactive({});
const daysOfWeek = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
const classPeriods = scheduleManagerPeriodRows.map((row) => `第 ${row.label} 节`);
const showExportMenu = ref(false);
const multiEmptyTable = ref(null);
const multiScheduleLoading = ref(false);

// 计算属性
const fileList = computed(() =>
  Object.keys(uploadedFiles).map((filename) => ({
    filename,
    name: filename.replace('.json', ''),
    ...uploadedFiles[filename],
  }))
);

// 计算属性：处理所有文件的课程表数据，生成用于显示的结构
const allFilesSchedule = computed(() => {
  const result = Object.fromEntries(
    daysOfWeek.map((day) => [day, Object.fromEntries(classPeriods.map((period, index) => [index, []]))])
  );
  Object.keys(uploadedFiles).forEach((filename) => {
    const data = uploadedFiles[filename]?.content;
    if (!data) return;
    const maps = getMaps(data);
    const totalWeeks = getTotalWeeks(data);
    const weeks = Array.from({ length: totalWeeks }, (_, index) => index + 1);
    const displayName = data.owner?.name || '未命名用户';
    daysOfWeek.forEach((cnDay, index) => {
      scheduleManagerPeriodRows.forEach((row, periodIndex) => {
        const states = row.periods.map((period) => {
          const availability = weeks.map((week) => ({
            week,
            status: getLessonAvailability(data, maps, week, index + 1, period),
          }));
          return {
            period,
            freeWeeks: availability.filter((item) => item.status === 'free').map((item) => item.week),
            onlineWeeks: availability.filter((item) => item.status === 'online').map((item) => item.week),
          };
        });
        if (!states.some((state) => state.freeWeeks.length || state.onlineWeeks.length)) return;
        const sameAvailability = states.every(
          (state) =>
            state.freeWeeks.join(',') === states[0].freeWeeks.join(',') &&
            state.onlineWeeks.join(',') === states[0].onlineWeeks.join(',')
        );
        let label = displayName;
        if (sameAvailability) {
          label += `（${formatAvailabilityWeeks(
            states[0].freeWeeks,
            states[0].onlineWeeks,
            totalWeeks
          ).replace(/\n/g, '；')}）`;
        } else {
          label += `（${states
            .map(
              (state) =>
                `第${state.period}节：${formatAvailabilityWeeks(
                  state.freeWeeks,
                  state.onlineWeeks,
                  totalWeeks
                ).replace(/\n/g, '；')}`
            )
            .join('；')}）`;
        }
        const fullyFree = totalWeeks > 0 && states.every((state) => state.freeWeeks.length === totalWeeks);
        const neverBusy =
          totalWeeks > 0 &&
          states.every((state) => state.freeWeeks.length + state.onlineWeeks.length === totalWeeks);
        result[cnDay][periodIndex].push({
          key: `${filename}|${cnDay}|${periodIndex}`,
          text: label,
          status: fullyFree ? 'free' : neverBusy ? 'online' : 'partial',
        });
      });
    });
  });
  return result;
});

const multiAvailabilitySummary = computed(() => {
  const result = Object.fromEntries(
    daysOfWeek.map((day) => [
      day,
      Object.fromEntries(
        classPeriods.map((period, index) => [
          index,
          {
            status: 'empty',
            text: '尚未添加课表',
          },
        ])
      ),
    ])
  );
  const people = Object.values(uploadedFiles)
    .map((file) => file?.content)
    .filter(Boolean)
    .map((data) => ({
      data,
      maps: getMaps(data),
      totalWeeks: getTotalWeeks(data),
    }));
  if (!people.length) return result;
  daysOfWeek.forEach((day, dayIndex) =>
    scheduleManagerPeriodRows.forEach((row, periodIndex) => {
      const states = people.map(({ data, maps, totalWeeks }) => {
        if (totalWeeks <= 0) return 'busy';
        const availability = Array.from({ length: totalWeeks }, (_, index) => index + 1).flatMap((week) =>
          row.periods.map((period) => getLessonAvailability(data, maps, week, dayIndex + 1, period))
        );
        if (availability.every((status) => status === 'free')) return 'free';
        if (availability.every((status) => status !== 'busy')) return 'online';
        if (availability.some((status) => status !== 'busy')) return 'partial';
        return 'busy';
      });
      result[day][periodIndex] = summarizePeopleAvailability(states);
    })
  );
  return result;
});

// 方法
const triggerFileInput = () => {
  if (multiScheduleLoading.value) return;
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.multiple = true;
  input.onchange = handleFileSelect;
  input.click();
};

const handleFileSelect = async (event) => {
  const files = Array.from(event.target.files || []);
  if (!files?.length) return;
  if (multiScheduleLoading.value) return;
  multiScheduleLoading.value = true;
  const declinedKeyIds = new Set();
  let successCount = 0;
  try {
    for (const file of files) {
      if (!file.name.toLowerCase().endsWith('.json')) {
        toast('error', '请只上传JSON文件', 3);
        continue;
      }
      delete uploadedFiles[file.name];
      if (file.size > maxEnvelopeBytes) {
        toast('error', `文件 "${file.name}" 超过 7 MB`, 3);
        continue;
      }
      if (await readFile(file, declinedKeyIds)) successCount++;
    }
    if (successCount) {
      toast('success', `已成功读取 ${successCount} 个课表文件`, 3);
    }
  } finally {
    multiScheduleLoading.value = false;
  }
};

const readFile = async (file, declinedKeyIds) => {
  try {
    const jsonContent = await parseScheduleFileContent(await file.text(), {
      filename: file.name,
      keyCache: importedSchedulePrivateKeys,
      declinedKeyIds,
    });
    uploadedFiles[file.name] = {
      content: jsonContent,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    };
    return true;
  } catch (error) {
    toast('error', `文件 "${file.name}" 已跳过：${error.message || '格式错误'}`, 4);
    return false;
  }
};

const removeFile = (filename, event) => {
  event.stopPropagation();
  delete uploadedFiles[filename];
};

// 导出相关方法
const toggleExportMenu = () => {
  showExportMenu.value = !showExportMenu.value;
};

// 点击外部关闭下拉菜单
let exportBtn, exportDropdown;
const handleClickOutside = (e) => {
  if (!exportBtn) exportBtn = document.querySelector('.export-btn');
  if (!exportDropdown) exportDropdown = document.querySelector('.export-dropdown');

  if (showExportMenu.value && !exportBtn?.contains(e.target) && !exportDropdown?.contains(e.target)) {
    showExportMenu.value = false;
  }
};

// 注册事件监听器
document.addEventListener('click', handleClickOutside);

// 组件卸载时移除事件监听器
onUnmounted(() => {
  teacherSearchController?.abort();
  personalMetadataController?.abort();
  ownerRequestController?.abort();
  personalRequestVersion++;
  document.removeEventListener('click', handleClickOutside);
  // 清理引用
  exportBtn = null;
  exportDropdown = null;
});

const exportToExcel = () => {
  if (!fileList.value.length) {
    toast('error', '请先上传文件', 3);
    return;
  }
  try {
    const wsData = [['时间/星期', ...daysOfWeek]];
    classPeriods.forEach((period, periodIndex) => {
      const row = [period];
      daysOfWeek.forEach((day) => {
        const items = allFilesSchedule.value[day]?.[periodIndex] || [];
        const summary = multiAvailabilitySummary.value[day][periodIndex].text;
        const cellData = items.length ? [...items.map((item) => item.text), summary].join('\n') : summary;
        row.push(cellData);
      });
      wsData.push(row);
    });
    const XLSX = pageWindow.XLSX;
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws['!cols'] = [{ wch: 10 }, ...daysOfWeek.map(() => ({ wch: 20 }))];
    const wrapTextStyle = { alignment: { wrapText: true, vertical: 'top' } };
    Object.keys(ws).forEach((key) => {
      if (!key.startsWith('!')) ws[key].s = wrapTextStyle;
    });
    XLSX.utils.book_append_sheet(wb, ws, '空课表');
    XLSX.writeFile(wb, '空课表.xlsx');
    showExportMenu.value = false;
    toast('success', '空课表 Excel 已导出', 3);
  } catch (error) {
    toast('error', error.message || '空课表 Excel 导出失败', 4);
  }
};

const exportToImage = async () => {
  if (!fileList.value.length) {
    toast('error', '请先上传文件', 3);
    return;
  }
  if (multiScheduleLoading.value) return;
  multiScheduleLoading.value = true;
  try {
    const progressToast = toast('info', '正在生成空课表图片，请稍候', 0);
    try {
      await nextTick();
      await downloadSnapdomImage({
        snapdom: pageWindow.snapdom,
        target: multiEmptyTable.value,
        options: {
          format: 'png',
          filename: '空课表.png',
          scale: 2.5,
          quality: 1,
        },
        fixWebVpn: true,
        pageWindow,
      });
    } finally {
      removeToastHandle(progressToast);
    }
    showExportMenu.value = false;
    toast('success', '空课表图片已导出', 3);
  } catch (error) {
    toast('error', error.message || '导出图片失败，请重试', 3);
  } finally {
    multiScheduleLoading.value = false;
  }
};
</script>
