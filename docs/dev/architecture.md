# 架构说明

## 1. 系统定位

Better NXU 同时增强 WebVPN、统一身份认证、教务系统、信息门户、实验室安全教育平台、微信扫码页等多个站点。Vite 只负责开发期模块化和打包，运行时没有应用服务器，也没有前端路由框架；每次匹配页面加载时，完整用户脚本在该页面执行一次。

生产合同如下：

- 交付 `dist/better-nxu.user.js` 和 `dist/better-nxu.meta.js`。
- 安装脚本必须保持单文件，不含 SystemJS 或动态 chunk。
- 依赖 ScriptCat `@run-at document-idle` 的“所有内容加载完成”保证，入口不再重复等待 `readyState`。
- 运行在 ScriptCat `@inject-into page` 模型下，共享存储域为 `h.nxu`。
- 当前元数据固定为 16 个 `@match`、16 个 `@grant`、7 个 `@require`、8 个 `@resource`、5 个 `@connect`，并包含完整 `==UserConfig==`。

## 2. 启动与分发

```text
浏览器打开匹配页面
  -> ScriptCat 按顺序加载 @require / @resource
  -> ScriptCat 在 document-idle 注入 src/main.js
  -> initContext() 只解析一次当前 URL
  -> resolveRoute() 从上到下检查 JUDGE_TABLE
  -> 首个命中的 page.register()
  -> page 编排 auth / component / composable / library
```

`main.js` 只负责生命周期和最后一道异常兜底。业务异常应优先在站点或共享流程边界处理，避免错误变成未处理 Promise。

`context.js` 缓存以下稳态字段：

| 字段                               | 含义                                          |
| ---------------------------------- | --------------------------------------------- |
| `info` / `version`                 | `GM_info` 与当前脚本版本                      |
| `url` / `host` / `origin` / `path` | 外层页面地址信息                              |
| `query`                            | 启动时的 `URLSearchParams`                    |
| `vpnContext`                       | WebVPN URL 解析结果；直连页面也返回直连上下文 |
| `isWebvpn`                         | 当前 URL 是否是可识别的 WebVPN 代理 URL       |
| `webvpnRealHost`                   | 代理后的真实主机；直连为 `null`               |
| `isWebvpnHost`                     | 外层主机是否为 `webvpn.nxu.edu.cn`            |
| `isJwglIp`                         | 是否为 `202.201.128.234` 教务 IP 形态         |

上下文是页面启动快照。门户 SPA 导航后需要重新解析的内容由 `parseWebVpnContext(location.href)` 或调用方 resolver 获取，不能假定单例会随 URL 自动变化。

## 3. 分层与依赖方向

```text
main / router
    |
    v
sites/*/pages  ----> sites/*/components, sites/*/auth
    |                         |
    +-----------> composables+
                      |
                      +----> libraries
                      +----> schedule / crypto
                      +----> config / utils

schedule <---- crypto
   |             |
   +-----------> utils

libraries / config ----> utils
utils -----------------> 浏览器基础 API（不依赖上层）
```

约束：

- `utils` 不依赖 `config`、`libraries`、`composables` 或 `sites`。
- `schedule` 和 `crypto` 不依赖站点或 UI；`crypto` 可以依赖 `schedule.normalize()`。
- 一个站点不直接 import 另一个站点。跨站点复用放入 `composables`。
- `router.js` 只做判定和映射，不执行登录、DOM 注入或网络请求。
- page 负责页面级编排，component/auth 负责站点内部细节。

## 4. 路由矩阵

路由是有序首命中表。更具体或更敏感的路由必须放在宽泛路由之前。

| site/page                     | 主要命中条件                                                                                  | 行为                                 |
| ----------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------ |
| `sslvpn/settings`             | `sslvpn.nxu.edu.cn/h/settings`                                                                | 接管页面，渲染设置中心               |
| `sslvpn/about`                | `sslvpn.nxu.edu.cn/h/about`                                                                   | 接管页面，渲染项目说明与更新日志     |
| `jwgl/login`                  | 教务域名、教务 IP 或 WebVPN 代理；`index.action`/`login.action`                               | 自动登录和 OCR                       |
| `jwgl/home`                   | 同上；`cas.action`/`home.action`                                                              | 注入“全部学期成绩”菜单               |
| `jwgl/course-table-container` | `courseTableForStd.action?method=stdHome`                                                     | iframe 高度同步                      |
| `jwgl/course-table`           | `courseTableForStd.action?method=courseTable`                                                 | 课表美化与导出栏                     |
| `weixin/fast-login`           | `open.weixin.qq.com` 且 URL 含 `nxu.edu`                                                      | 强制 `fast_login=1` 并点击快速登录   |
| `ids/login`                   | IDS 直连或 WebVPN 真实主机为 IDS 的登录路径                                                   | 自动登录或显示填充按钮               |
| `ids/re-auth`                 | IDS 二次认证路径                                                                              | 可选微信快速二次认证                 |
| `ids/callback`                | IDS 回调或 WebVPN 代理微信扫码页                                                              | 修复授权回跳                         |
| `webvpn/home`                 | WebVPN 根路径                                                                                 | 菜单、搜索浮球、抢课/工具/自定义卡片 |
| `cnki/reader`                 | 直连、zylib 或 WebVPN 下 `kns.cnki.net`/`www.cnki.net` 的 `/reader/xml`、`/xmlRead/trialRead` | 无缺口滑块拖动、选中文字复制         |
| `wanfang/reader`              | 直连、zylib 或 WebVPN 下 `f.wanfangdata.com.cn/online/pc/periodical_html`                     | 选中文字自动复制                     |
| `webvpn/tools`                | WebVPN 的 `/h/tools`，或 `/wengine-vpn/failed` 且页面含工具地址标记                           | 接管为小工具页                       |
| `webvpn/failed`               | 同一失败路径但不是工具标记                                                                    | 按配置尝试关闭标签页                 |
| `sysaq/login`                 | 直连或代理 `/lab-platform/`                                                                   | 跳转登录页                           |
| `sysaq/auth`                  | 直连或代理 `/lab-platform/login`                                                              | 点击统一身份认证                     |
| `portal/hall`                 | 直连 `portal.nxu.edu.cn` 或 WebVPN 真实主机为该域名                                           | 门户 SPA 卡片注入                    |
| `pingjiao/notify`             | 两个评教任务路径                                                                              | 提示尚未实现，不自动评教             |
| `tuanwei/download`            | 团委直连 `/system/_content/download.jsp`，含附件类型、owner 和 wbfileid 参数                  | 验证码识别、下载与可选关页           |

WebVPN 代理 URL 形如：

```text
https://webvpn.nxu.edu.cn/<http|https>[-port]/<host-token>/<real-path>
```

`src/utils/webvpn-url.js` 是 host/token 唯一来源。路由不能通过外层 URL 的宽泛 `includes('login')` 判断认证页；必须先还原真实主机，再检查真实路径。此规则防止其他被代理站点构造相似路径后触发凭证读取和提交。

## 5. 三种页面接入形态

### 叠加注入

保留学校页面，只增加菜单、卡片、监听器或按钮。WebVPN 首页、教务页、门户、IDS、知网/万方使用此模式。此模式不能清空 `body`，也应避免全局 CSS 污染。

### 接管重建

学校页面本身是空壳或失败页，脚本清空 `body` 后挂载完整 Vue 页面。设置、关于、小工具使用 `mountAppPage()`。该 helper 统一完成标题、通知、Vant CSS、挂载容器和部署提示。

### 纯行为注入

不创建主要 UI，只自动点击、跳转、复制或关闭。实验室安全平台、微信快登、WebVPN 失败页属于此类。

## 6. 关键业务流

### 统一身份认证

1. 路由确认直连 IDS，或 WebVPN 真实主机严格等于 `ids.nxu.edu.cn`。
2. `idsLogin()` 再调用 `isTrustedIdsContext()` 做防御性校验。
3. 自动登录关闭时，仅在已保存凭证的情况下显示“填入已保存账号”按钮，不自动提交。
4. 自动登录开启时，检查页面错误、等待输入框、填充账号密码、勾选记住我。
5. 遇到旧式图形验证码回退用户手动操作；提交后出现的滑块由 `ids/auth/slide-captcha.js` 自动识别（本地 ONNX Worker 缺口检测 + 人类滑动模拟，失败回退手动提示）。`libraries/slider-resources.js` 通过 GM 后台下载固定版本和 SHA384 的 ORT、WASM 与模型；Worker 仅加载 Blob URL 和模型二进制，避免 WebVPN 重写外链。
6. 二次认证和微信回调由独立 page 处理，避免登录主干承担所有 URL 变体。

### 教务登录与课表

1. 教务登录读取独立的 `Jwgl.*` 凭证。
2. Tesseract UMD 仅在验证码识别时从 `@resource` 执行；worker/core/lang 使用固定版本 URL。
3. OCR 初始化最长 45 秒、识别最长 30 秒，任何失败都保留手动输入路径并终止 worker。
4. 课表页先注入导出栏，再按 `Jwgl.courseBeautify` 重建课程单元格。
5. 美化和导出共用 `parseCourseCellFromJwgl()`，避免两套解析规则漂移。
6. 父页面在 iframe 加载后、收到该 iframe 的 `COURSE_BEAUTIFY_CHANGED` 通知时重新计算高度；跨源读取失败时保留已有高度。监听器随页面生命周期清理。

### 团委附件下载

`tuanwei/pages/download.page.js` 按两个历史配置开关启用。`tesseract-local.js` 经 GM 匿名下载并校验固定 SHA384 的 worker、内嵌 WASM core 和语言包，再使用本地 Blob URL，适配学校 CSP。验证码只从当前 `#codeimg` 绘制到 Canvas，不重新请求验证码接口。自动点击确定时临时拦截该次导航，使用同源 fetch 获取并验证附件，再交给 `GM_download` 的 browser 模式保存 data URL；只有完成回调到达才按设置关页。手动操作保留原处理器，重试最多三次，离页时取消并清理资源。

### 课表工具

课表统一为 Schema `2.0`：ICS 与教务 DOM 都先转换为 `courses + lessons` 标准模型，再构建 `byDate`、`busySlots`、统计、个人课表和多人空闲视图。导入支持明文 JSON 和加密信封；导出可直接保存或使用接收方 RSA 公钥加密。

### 门户 SPA

直连和 WebVPN 代理共用 `sites/portal/pages/hall.page.js`；该 page 在每次 SPA 导航时实时解析 pathname 或代理 realPath，再调用站点内 `runtime/spa-history.js` 的 `patchPortalHistory()` 与 `injectPortalHall()`。history 补丁只安装一次，导航回调存入集合；并发注入通过 in-flight Promise 合并。不能用“页面生命周期永久已注入”标志，因为从 `#/hall` 切走时 Vue 会销毁卡片，切回必须重新注入。

### 文献阅读页

`utils/library-reader.js` 集中管理平台主机、阅读路径和能力，解析直连、zylib 和已识别 WebVPN 的阅读位置，并为 Vite 生成阅读页匹配范围。`router.js` 根据平台表生成路由，`composables/library-reader.js` 统一编排能力；新增仅复制的平台无需另建 page。知网、万方保留薄 page 入口，知网 page 注入专用滑块实现。zylib 解析只用于阅读增强，不改变认证上下文。

`composables/reader-copy.js` 管理选区复制，`utils/slider-drag.js` 只负责鼠标拖动；IDS 的缺口识别、重试和知网的无缺口控件发现留在各自站点内。知网不初始化识别模型，合成拖动事件也不会触发复制。

## 7. 用户脚本运行时资源

| 类型        | 资源                    | 用途与加载方式                                      |
| ----------- | ----------------------- | --------------------------------------------------- |
| `@require`  | h.notification + bridge | toast 与 ScriptCat 配置入口，桥接到真实 page window |
| `@require`  | Vue 3.5.43 生产版       | 由 `externalGlobals.vue = 'Vue'` 提供给打包结果     |
| `@require`  | snapdom + bridge        | 图片导出                                            |
| `@require`  | XLSX + bridge           | Excel 导出                                          |
| `@resource` | FontAwesome CSS         | toast 与页面图标，注入前修正 webfont 相对路径       |
| `@resource` | Vant CSS                | 只在 Vant 页面幂等注入                              |
| `@resource` | Tesseract UMD           | 只在 OCR 触发时执行                                 |
| `@resource` | marked + DOMPurify      | 只在关于页解析并消毒 Markdown                       |
| `@resource` | README + CHANGELOG      | 安装/更新脚本时由 ScriptCat 缓存                    |

远程可执行资源和样式必须固定版本并带 SHA384。README/CHANGELOG 是唯一允许跟随 `main` 且无摘要的例外，因为它们不是代码，写入 DOM 前仍必须消毒。两项 Markdown 由持续同步 GitHub 主仓库的 [Gitee 镜像 `thisish/Better-NXU`](https://gitee.com/thisish/Better-NXU) 提供，以改善国内访问稳定性。

## 8. 故障边界

- 页面 DOM 变化：`waitForElement()` 超时并抛 `WAIT_TIMEOUT`，page 转为 toast，不继续空引用。
- GM API 不可用：适配层返回 `undefined`，调用方降级或记录错误，不应在模块求值阶段崩溃。
- 远程运行时不可用：OCR 回退手动输入；Markdown 回退转义纯文本；图标/CSS 不应阻断业务。
- 网络过期或乱序：教师搜索可取消旧请求并用版本号丢弃旧响应；门户导航合并并发回调。
- 用户重复操作：OCR worker、Excel 导出和课表加载有锁或版本号；所有清理路径必须在 `finally` 或卸载钩子中执行。
