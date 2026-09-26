# 模块与 API 参考

本页以源码的实际导出面为准。以 `_` 开头或标为测试专用的函数不应在生产业务中调用；站点 page 的公共合同统一为 `register(): Promise<void>`。

## 1. 顶层入口

### `src/main.js`

无导出。ScriptCat 在 `document-idle` 注入后，入口依次执行 `initContext()`、`resolveRoute()` 和命中页面的 `register()`。顶层 `await` 只用于等待页面注册流程。

### `src/context.js`

- `initContext()`：首次调用时解析 URL、WebVPN 真实站点和 `GM_info`，以后返回同一对象。
- `isJwglIp` 只接受精确的 `202.201.128.234` hostname；端口不参与主机判断，相似域名不会命中。
- `getContext()`：取得已初始化上下文；过早调用会抛错。因此 page 不应在模块顶层调用它，应放在 `register()` 或事件处理函数中。
- `_resetContextForTest()`：仅测试使用。

### `src/router.js`

- `resolveRoute()`：按 `JUDGE_TABLE` 顺序返回首个命中的 `register` 函数，未命中返回 `null`。判定异常会记录并继续下一项。

新增路由时必须静态 import page 的 `register`，具体路由放在通用路由之前，并为认证类路由增加独立守卫测试。

## 2. `src/config`

### `gm-keys.js`

- `GM_VALUE_DEFAULTS`：所有允许访问的 GM 键与默认值注册表。
- `SETTINGS_RESET_KEYS`：“恢复功能默认值”覆盖的功能键集合，不含凭证和密钥。
- `cloneGMValue(value)`：对数组/对象做 JSON 深拷贝，原始值原样返回。
- `hasLoginCredentials(username, password)`：两项去空白后均非空才返回 `true`。

新键必须先进入注册表。不要绕开注册表直接写 GM 存储，否则拼写错误会静默产生孤立数据。

### `gm-store.js`

- `getGMValue(name)`：使用 `GM_getValue(name, defaultValue)` 读取已注册键；不存在时返回默认值副本且不写入；未知键抛错。
- `setGMValue(name, value)`：异步写已注册键，优先 `GM.setValue`；未知键拒绝。
- `getResettableSettingDefaults()`：返回功能重置键的默认值对象。
- `resetFunctionSettingValues()`：恢复功能设置，保留账号、密码、首启状态、课表 ID 和密钥。
- `getAllSettingDefaults()`：返回全部默认值；无凭证时将对应自动登录默认调整为 `false`。
- `resetAllSettingValues()`：写回全部默认值，包括清除凭证、课表 ID 和密钥。

### `settings-write-queue.js`

- `createSettingsWriteQueue(write, onError)`：串行执行设置写入，并把同一键尚未开始的多次变更合并为最新值；`flush()` 用于重置前等待现有写入完成。

### `config-version.js`

- `ConfigVersion`：当前配置结构版本，现为 `7`。
- `normalizeConfigVersion(value)`：将数字/数字字符串规范化为非负安全整数，非法值回退 `0`。

新增、删除或改变设置语义时，应提升 `ConfigVersion` 并提供迁移/提示；仅调整 UI 不一定需要提升。

## 3. `src/utils`

### `#gm` 客户端别名

GM API 从 vite-plugin-monkey 官方客户端别名 `#gm` 按需静态导入。生产构建负责绑定脚本管理器 API 并通过 `autoGrant` 收集权限；Node 测试由 `package.json#imports` 指向同一客户端。业务模块不要直接读取裸 `GM_*`、`globalThis` 或 `document['__monkeyWindow-*']`。

`config/gm-store.js` 负责已注册键的同步读取与可等待写入；写入依次兼容 `GM.setValue(s)`、旧式批量 API 和逐项 `GM_setValue`。页面作用域函数和桥接后的远程库通过 `unsafeWindow` 访问。

### `webvpn-url.js`

- `WEBVPN_HOST` / `WEBVPN_BASE`：WebVPN 主机和基址。
- `WEBVPN_HOST_TOKENS`：真实 host 到代理 token 的冻结映射，是唯一配置来源。
- `WEBVPN_TOKEN_HOSTS`：token 到真实 host 的反向映射。
- `parseWebVpnContext(input)`：解析 URL。直连返回 `viaVpn: false` 上下文；有效代理 URL 还原 scheme、port、token、realHost、realPath、search、hash；非法 URL 返回 `null`。
- `buildWebVpnUrl(input, options)`：为映射内 HTTP(S) 地址生成代理 URL。拒绝用户名密码、未知主机和 WebVPN 自身；失败返回 `null`。`forceHttps443` 可显式生成 `https-443`。
- `isWebVpnRealHost(context, host)`：严格判断代理真实主机。

增加映射后必须补往返测试；不要在组件中重复硬编码 token。

### `route-guards.js`

- `isTrustedIdsContext(ctx)`：只接受 IDS 直连或真实主机为 IDS 的 WebVPN 上下文。
- `isWebVpnIdsLoginRoute(ctx)`：可信代理 IDS 且真实路径包含 `/authserver/login`。
- `isWebVpnIdsReAuthRoute(ctx)`：可信代理 IDS 且真实路径包含 `/authserver/reAuthCheck/`。

前三项是凭证访问的安全边界，路由和认证业务入口都要使用。`isCnkiReaderRoute()` / `isWanfangReaderRoute()` 统一直连与代理阅读路径；`isWebVpnToolsRoute(ctx, bodyHtml)` / `isWebVpnFailedRoute(ctx, bodyHtml)` 区分工具直接入口、旧标记入口与普通失败页。

### `dom.js`

- `simulateClick(el, needScroll = false)`：依次派发 `mousedown`、`mouseup`、`click` 并聚焦元素。
- `waitForElement(selector, options)`：按 `interval` 轮询选择器并检查 `predicate`，默认 10 秒/100 毫秒，超时抛 `WAIT_TIMEOUT`。
- `fillControlledInput(input, value)`：移除只读、聚焦、赋值并派发 `input`/`change`，返回是否成功。

### `random.js`

- `Random(min, max)`：返回闭区间随机整数。
- `WaitTime(min, max = 0, log = true, msg = '无')`：固定等待或区间随机等待；轮询调用应传 `log = false`。

### `auth-form.js`

- `getAuthErrorText()`：从统一认证的多种错误 DOM 中读取首个非空文本。
- `hasLegacyAuthCaptcha()`：判断旧式图形验证码是否可见。
- `isCredentialsErrorText(errorText)`：判断错误是否属于账号/密码问题。
- `buildCredentialsErrorToast(options)`：生成带设置入口的静态 toast HTML。动态错误文本仍需转义。

普通消息调用 `libraries/notification.toast()`，由适配层统一转义。只有上述静态配置入口使用 `toastTrustedHtml()`；不向它传入文件名、接口消息或用户文本。

该文件只做 DOM 读取和文案构造，不读取凭证、不弹 toast。

### `course-cell.js`

- `JWGL_COURSE_TEXT_FILTERS`：教务课表文本过滤器列表。
- `filterJwglCourseText(value)`：顺序应用过滤器。
- `parseCourseCellFromJwgl(el, options)`：解析 `td > div[title]` 为课程字段组。美化传 `missingPlaceholder: '空'`，导出传 `'未定'`。
- `normalizeCellGroups(contentArray)`：就地补全教务单元格中继承上一组课程/教师信息的简写组。

美化和导出必须共享这套解析器。修改规则时同时补两条业务路径的 fixture。

### `console.js`

- `MyConsole(scope)`：返回带作用域和时间戳的日志函数。生产环境默认抑制 debug；设置 `globalThis.__BETTER_NXU_DEBUG__ = true` 可开启。
- `sanitizeConsoleDetail(value)`：递归隐藏密码、私钥、cookie、token 等敏感键，处理 Error 和循环引用。

不要用原生 `console.log` 输出响应对象、GM 配置或选中文本；统一经过 `MyConsole`。

### `errors.js`

- 通用码：`OCR_ENGINE_UNAVAILABLE`、`OCR_EMPTY_RESULT`、`JWGL_LOGIN_FORM_MISSING`、`EXPORT_CANCELLED`、`AUTH_SUBMIT_MISSING`、`MENU_TARGET_MISSING`、`WAIT_TIMEOUT`、`WEBVPN_URL_BUILD_FAILED`。
- 课表文件码：`INVALID_JSON`、`INVALID_SCHEDULE`、`INVALID_DECRYPTED_SCHEDULE`、`KEY_REQUIRED`。
- `scheduleOperationError(code, message)`：构造带 `code` 的 Error。

UI 应优先按 `error.code` 分流，`message` 用于用户提示和诊断，不作为稳定协议。

### `fetch.js`

- `fetchWithTimeout(fetchImpl, input, init, options)`：为 page window `fetch` 组合内部超时和调用方 `AbortSignal`；超时抛 `name=TimeoutError`，主动取消保持 `AbortError`。信号可放在 `options.signal` 或标准 `init.signal`，前者优先。
- 需要读取响应体时传 `options.consumeResponse(response)` 并返回读取 Promise；该 Promise 完成前保持超时与取消，成功后返回解析结果。未传时保留返回 `Response` 的语义，响应体读取不受该次超时保护。课表 ID 和身份查询均使用此回调，避免响应头到达后正文卡住。

### `file.js`

- `downloadTextFile(content, filename, mimeType)`：用原生 `<a download>` 下载 Blob URL，并回收临时链接和 Object URL。
- `escapeHtml(value)`：转义 `& < > " '` 五类字符。
- `closeCurrentTab()`：通过 vite-plugin-monkey 官方 `monkeyWindow.close()` 调用关闭权限，失败返回 `false`。

### `snapdom.js`

- `downloadSnapdomImage(options)`：调用 snapdom 生成图片；WebVPN 模式下分批内联计算样式，将像素宽度向上取整以避免教室文字意外换行覆盖周次，并修正 SVG `foreignObject` 大小写。保留原有字体和换行规则，完成或失败后恢复页面状态。

## 4. `src/libraries`

### `notification.js`

- `installNotification()`：把 h.notification 运行时、Toast CSS、FontAwesome 和页面回调准备好；幂等。
- `openTab('settings' | 'about')`：用 `GM_openInTab` 打开 SSL VPN 设置/关于页。
- `betterNXUVersionClick()`：通过 `GM.xmlHttpRequest` 获取一言并 toast。
- `toast(type, message, duration)`：将消息转义为纯文本后传给远程 `createToast`，不可用时降级日志。
- `toastTrustedHtml(type, message, duration)`：仅接收项目静态构造的配置入口 HTML。
- `removeToastHandle(handle)`：包装 `removeToast`。

页面在第一次 toast 前先调用 `installNotification()`。普通消息直接传原文，不重复转义；只有静态配置入口使用专用 HTML 接口。

### 其他适配器

- `fontawesome.js#installFontAwesome()`：读取 `svg-logo` CSS，修正 webfont 路径并幂等注入。
- `vant-style.js#installVantStyle()`：读取 `vant-css` 并幂等注入；GM 样式 API缺失时使用原生 `<style>`。
- `page-resource.js#evaluatePageResource(name, resolveGlobal)`：在真实 page window 执行固定资源并验证 UMD 全局。
- `tesseract.js#createOcrWorker(langs, oem, extraOptions)`：按需加载 Tesseract，补固定 worker/core/lang 路径。默认只保证单语言。
- `markdown.js#renderMarkdown(target, markdown)`：marked 解析、DOMPurify 白名单消毒、外链属性修正；资源失败时纯文本降级。
- `markdown.js#escapeHtml(text)`：Markdown 降级用最小转义。

## 5. `src/composables`

- `use-vue-app.js#mountVueApp(options)`：确保挂载容器、可选注入 Vant CSS、调用 Vue `createApp` 并挂载。认证轻量组件传 `useVantStyles: false`。
- `use-app-page.js#mountAppPage(options)`：接管独立页面，清空 body、设置标题、安装通知/Vant CSS、创建部署 toast 和挂载点，返回 `{ mountEl, deployToast }`。
- `use-wait-or-toast.js#waitOrToast(selector, options)`：将 `waitForElement` 的异常转为指定 toast，成功返回元素，失败返回 `null`；用于不需要额外异常清理的页面等待流程。
- `use-credentials-toast.js#requireCredentials(host)`：校验 `WebVPN` 或 `Jwgl` 凭证，缺失时提示并返回 `false`。
- `use-credentials-toast.js#notifyCredentialsProblem(host, duration)`：提示已保存凭证错误。
- `use-schedule-export.js#requestScheduleKey(type, options)`：弹出公钥/私钥输入框，校验并导入，取消返回 `null`。
- `use-schedule-export.js#selectScheduleExportPublicKey()`：选择当前公钥或接收方公钥，取消抛 `EXPORT_CANCELLED`。
- `use-schedule-export.js#prepareScheduleExport(schedule)`：选择直接或加密导出，返回 `{ encrypted, content }`。

`app-page.css` 是设置、关于页的公共样式；页面专属 CSS 应在其后注入。

## 6. `src/schedule`

`schedule/index.js` 是推荐的站点调用入口：

- 常量：`schemaVersion`、`periodTimes`。
- 获取与解析：`fetchFromUrl(url, options)`、`parseIcs(text, options)`、`buildFromJwgl(entries, ownerName)`。
- 校验与查询：`normalize(input)`、`getMaps(data)`、`getLessonDetail(maps, lesson)`。
- 展示：`formatWeeks()`、`formatPeriods()`、`weekdayText()`、`buildJwglExcelTables()`。
- 空闲分析：`classifyScheduleSlot()`、`summarizePeopleAvailability()`。
- 标识：`stableId(input)`。

子模块公开函数用于内核测试和精细复用：

- `_helpers.js`：`normalizeText`、`uniqueInOrder`、`uniqueSorted`、`uniqueNumbers`、`uniqueBy`、`addManyUnique`、`stableArrayText`、`sameTextArray`、`stableId`。
- `week-compute.js`：`parseDateOnly`、`formatDateOnly`、`getWeekdayNumber`、`weekdayText`、`getTermStartMonday`、`getWeekIndex`、`getWeekRange`、`getDateRange`、`rangeFromValues`、`formatWeeks`、`formatPeriods`、`buildSlotKey`、`compareSlotKeys`、`buildLocalDateTime`。
- `ics-parser.js`：`requestText`、`parseIcsProperty`、`findUnquoted`、`splitUnquoted`、`addProperty`、`unescapeIcsText`、`eventToLesson`、`parseCourseDescription`、`splitGroupsAndTeachers`、`isLikelyTeacherText`、`splitTeacherNames`、`parsePeriodText`、`periodsFromTimes`、`parseIcsDateTime`、`getFirst`、`findTimezone`、`parseIcsText`。
- `schedule-model.js`：`parseIcs`、`mergeLessonsToCourses`、`buildScheduleMap`、`buildLessonRecords`、`buildFromJwgl`、`normalize`、`buildByDate`、`buildBusySlots`、`getMaps`、`getLessonDetail`、`classifyScheduleSlot`、`summarizePeopleAvailability`、`normalizeOwner`、`compareRawLesson`、`compareLesson`、`compareSchedule`。
- `excel-build.js`：`buildJwglExcelTables(schedule)`，生成课表和课程明细二维数组，不直接调用 XLSX。
- `schema.js`：`schemaVersion`、`timezone`、`timezoneOffset`、`periodTimes`。

内核规则：`normalize()` 会深拷贝并校验 Schema、ID、周次、星期和节次；外部数据进入 UI 前必须先归一。不要在组件内另写一套课表结构。

## 7. `src/crypto`

`crypto/index.js` 是推荐入口：

- `storageKey`：固定为 `Schedule.encryptionKeyPair`。
- 大小：`maxPlaintextBytes` 为 5 MB，`maxEnvelopeBytes` 为 7 MB。
- 能力：`assertAvailable()`、`byteLength()`。
- 密钥：`generateKeyPair()`、`importPublicKey()`、`importPrivateKey()`。
- 信封：`isEncryptedEnvelope()`、`inspectEnvelope()`、`encryptSchedule()`、`decryptEnvelope()`。
- 文件纯逻辑：`parseScheduleJson()`、`classifyScheduleFileContent()`。
- 错误：`cryptoError` 及 `CRYPTO_UNAVAILABLE`、`INVALID_KEY`、`INVALID_ENVELOPE`、`UNSUPPORTED_ENCRYPTION`、`FILE_TOO_LARGE`、`DECRYPT_FAILED`。

`rsa.js` 的完整导出为：`getCryptoApi`、`textEncoder`、`byteLength`、`bytesToBase64`、`base64ToBytes`、`bytesToBase64Url`、`base64UrlToBytes`、`arrayBufferToPem`、`pemToBytes`、`getKeyId`、`assertRsaStrength`、`importPublicKey`、`importPrivateKey`、`generateKeyPair`。其中编码转换和强度校验主要供加密内核使用。公私钥固定为 RSA-OAEP、SHA-256、3072 bit、指数 65537；不要只改导出 UI 文案而改变底层参数。

`envelope.js` 使用 RSA-OAEP-256 包装随机 AES-256-GCM 密钥，12 字节 IV、128 bit tag，并把 protected header 作为 AAD。信封格式和 header 字段集合是文件兼容协议。

`parse.js` 只负责纯判定与归一；需要弹窗、GM 私钥和密钥缓存的完整导入流程位于 `sites/webvpn/components/tools/schedule-file.js`。

## 8. `src/sites`

### `ids`

- `auth/ids-login.js`：可信上下文校验、自动填充、记住我、旧验证码/滑块降级和多提交入口；导出 `idsLogin()` 与只读模块绑定 `authLoginSubmitting`。
- `components/login/LoginFillButton.vue`：自动登录关闭时的手动填充按钮。
- `pages/login.page.js`：在自动登录与填充按钮之间分流。
- `pages/re-auth.page.js`：按 `WebVPN.autoReLogin` 调页面 `reAuthByCombined('weixin')`。
- `pages/callback.page.js`：微信扫码 URL 重建和“授权失败”回跳修复。

### `jwgl`

- `auth/jwgl-login.js`：导出 `jwglLogin()`，负责教务凭证校验、错误提示、OCR、填表和提交。
- `components/login/captcha-reader.js`：导出 `readJwglCaptcha()`，负责 OCR 进度、45 秒初始化/30 秒识别超时、worker 清理。
- `pages/home.page.js`：注入“全部学期成绩”。
- `pages/course-table-container.page.js`：等待学校 iframe 后安装高度同步。
- `components/course-table/course-frame.js`：`installCourseFrameResize(iframe)` 幂等监听 iframe `load` 和该 iframe 发出的 `COURSE_BEAUTIFY_CHANGED`，返回清理函数。加载完成前及跨源认证期间保留原高度；最终离页时清理，BFCache 恢复保留监听。
- `components/course-table/course-beautify.js`：导出 `beautifyJwglCourseTable()`，用原生 DOM 安全重建课表单元格。
- `components/course-table/course-reader.js`：导出 `parseRangeString()`、`getAccurateColumnIndex()`、`readJwglTableToJson()`、`installCourseToolbar()`；负责从 DOM 构建标准课表并导出图片/JSON/Excel。
- `components/course-table/CourseToolbar.vue`：导出栏 UI。

### `webvpn`

- `pages/home.page.js`：在原首页叠加版本弹窗、菜单和卡片组。
- `components/home/*`：抢课、自定义工具、自定义站点、菜单和搜索浮球。
- `pages/tools.page.js` + `ToolsApp.vue`：接管工具页。
- `components/tools/teacher-search.js`：导出 `searchTeachers(name, page, options)`，执行可取消、带超时的分页 XML 教师查询。
- `components/tools/ics-id.js`：导出 `getIcsId(options)`、`getStudentOwner(studentId, options)`，用于获取课表分享 ID 和验证当前登录学生身份；`options.signal` 支持取消，`timeoutMs` 默认 15 秒。
- `components/tools/schedule-file.js`：导出 `parseScheduleFileContent(text, options)`，处理明文/加密课表导入和密钥协商。
- `components/tools/schedule-view.js`：导出 `personalDays`、`personalPeriodRows`、`getTotalWeeks`、`courseColor`、`splitConsecutivePeriods`、`buildPersonalCourseEntries`、`buildPersonalCourseLayout`、`isOnlineLesson`、`getLessonAvailability`、`formatAvailabilityWeeks`、`buildPersonalFreeGrid`。
- `pages/failed.page.js`：按配置关闭失败页。

文献阅读页已归属 `sites/cnki/pages/reader.page.js` 与 `sites/wanfang/pages/reader.page.js`，直连和代理共用入口。

### 其他站点

- `portal/pages/hall.page.js`：直连与 WebVPN 代理门户的统一入口，实时解析当前路径并安装 SPA history 回调。
- `portal/runtime/spa-history.js`：幂等补丁门户 `pushState`/`replaceState` 并监听 `popstate`；多个回调存入 Set，并发导航合并后补跑一次。
- `portal/components/hall-injector.js`：等待门户 iframe 和应用列表，注入四组卡片；按 DOM id 幂等且合并并发。
- `sslvpn/pages/settings.page.js`：接管并挂载设置页。
- `sslvpn/pages/about.page.js`：读取资源、接管并挂载关于页。
- `sysaq/pages/login.page.js`、`sysaq/pages/auth.page.js`：分别查找并点击实验室安全平台的登录和统一身份认证入口。
- `weixin/pages/fast-login.page.js`：快速登录参数和按钮。
- `pingjiao/pages/notify.page.js`：仅提示自动评教未实现。
- `tuanwei/pages/notify.page.js`：空操作兼容占位；保留配置键不等于功能已实现。

路由直接静态 import page 文件；无调用方的 `sites/*/index.js` barrel 已删除。

## 9. 阅读与共享拖动

- `utils/slider-drag.js` 的 `dragSlider({ handle, track, distance, eventTarget, signal, timeoutMs })`：视口像素坐标、420–700ms 平滑轨迹、20ms 事件间隔；取消时回到起点释放，Promise 在 mouseup 后完成。它不判断验证是否成功。
- `composables/reader-copy.js` 的 `installReaderCopy(doc)`：幂等选区复制、局部标题样式、忽略合成鼠标事件，返回清理函数。
- `sites/cnki/reader/slide-verification.js` 的 `installCnkiSlider(options)`：观察异步控件，每个控件一次、同页最多三次，手动接管或离页取消；返回停止函数。
- 知网/万方 `pages/reader.page.js`：复用路由守卫与复制流程；只有知网页面安装无缺口滑块处理，不初始化 ONNX。

工具页的 `components/tools/schedule-export.js#prepareCurrentScheduleExport()` 捕获最初课表，在身份核验和导出选项等待后检查是否仍是同一份数据；切换则抛 `SCHEDULE_CHANGED`，成功返回规范化课表与导出结果。

同模块 `selectImageExportName()` 先确认是否采用已配置学号的姓名，或只输入姓名；结果不写 `owner`。`prepareCurrentScheduleImageExport()` 在姓名确认前后校验课表与视图，并返回文件名和最终校验函数；JSON 与图片导出共用页面操作锁，避免重复弹窗。
