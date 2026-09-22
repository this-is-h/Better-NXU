# 数据、配置与安全

## 1. GM 存储合同

所有数据保存在 ScriptCat 的 `@storageName h.nxu` 命名空间。键名是跨版本兼容合同，改名会让老用户的配置静默丢失。读取和写入必须经 `getGMValue()` / `setGMValue()`。

| 键                           |             默认值 | 用途                                                           |
| ---------------------------- | -----------------: | -------------------------------------------------------------- |
| `WebVPN.username`            |        `undefined` | 统一认证/WebVPN 学号                                           |
| `WebVPN.password`            |        `undefined` | 统一认证/WebVPN 密码                                           |
| `WebVPN.autoLogin`           |            `false` | 新安装默认关闭；已有用户已保存的值保持不变，需在设置中主动开启 |
| `WebVPN.autoReLogin`         |            `false` | 微信多因子快速登录与二次认证                                   |
| `WebVPN.autoClose`           |            `false` | 自动关闭 WebVPN 失败页                                         |
| `WebVPN.courseGrab`          |             `true` | WebVPN 首页抢课备用卡片                                        |
| `WebVPN.customTool`          |             `true` | WebVPN 首页 H 小工具卡片组                                     |
| `WebVPN.customCard`          |           五项全选 | 自定义站点卡片；旧值中的“大先生”会被保留但不再渲染             |
| `WebVPN.qualityJson`         |               `[]` | 历史兼容数据，当前业务未消费                                   |
| `WebVPN.searchClose`         |             `true` | 首页默认收起搜索栏                                             |
| `Jwgl.username`              |        `undefined` | 教务学号                                                       |
| `Jwgl.password`              |        `undefined` | 教务密码                                                       |
| `Jwgl.autoLogin`             |            `false` | 新安装默认关闭；已有用户已保存的值保持不变，需在设置中主动开启 |
| `Jwgl.courseBeautify`        |             `true` | 自动美化课表                                                   |
| `Jwgl.customMenu`            | `['全部学期成绩']` | 教务自定义菜单                                                 |
| `TuanWei.autoDownload`       |            `false` | 历史兼容，当前未实现                                           |
| `TuanWei.autoDownloadClose`  |            `false` | 历史兼容，当前未实现                                           |
| `firstSet`                   |                `0` | 是否关闭过首次配置提示                                         |
| `configVersion`              |                `0` | 已确认的配置结构版本                                           |
| `icsId`                      |        `undefined` | 当前账号门户课表分享 ID 缓存                                   |
| `Schedule.encryptionKeyPair` |        `undefined` | 本地课表公私钥、keyId 和创建时间                               |

“恢复功能默认值”只写 `SETTINGS_RESET_KEYS`，保留凭证、首启状态、课表 ID 和密钥。“完全重置”写回全部默认值，会清除凭证和解密私钥，且不可恢复旧加密课表。

## 2. 凭证边界

- WebVPN/IDS 与教务使用两组独立凭证。
- 凭证只保存在脚本管理器存储中，不应写入 DOM 属性、URL、日志或导出文件。
- IDS 凭证只有在 `isTrustedIdsContext()` 返回 true 后才读取；路由和 `idsLogin()` 各检查一次。
- 教务凭证只在教务登录 page 使用。
- `sanitizeConsoleDetail()` 会隐藏常见敏感键，但不能依赖它补救主动输出的密码、cookie、token 或完整请求体。
- 公共电脑、共享浏览器配置文件或他人设备上不应保存凭证。

## 3. 课表 Schema 2.0

顶层结构：

```json
{
  "schemaVersion": "2.0",
  "sourceUrl": "https://portal.nxu.edu.cn/cal/...",
  "source": { "type": "ics", "input": "..." },
  "owner": { "id": "", "name": "" },
  "meta": {
    "calendarName": "课表",
    "timezone": "Asia/Shanghai",
    "timezoneOffset": "+08:00",
    "termStartDate": "2026-02-23",
    "weekRange": { "start": 1, "end": 18, "weeks": [1, 2] },
    "dateRange": { "start": "", "end": "" },
    "totalRawLessons": 0,
    "totalLessons": 0,
    "totalCourses": 0,
    "totalSchedules": 0
  },
  "courses": [],
  "lessons": [],
  "byDate": {},
  "busySlots": {}
}
```

模型分三层：

- `course`：一门课程的稳定信息，包含教师、班级、日期范围和多个安排 `schedules`。
- `schedule`：课程在星期、时间、节次、教室上的一种重复安排，包含周次和关联 lesson ID。
- `lesson`：某一周/日期的实际课次，关联 `courseId`、`scheduleId`，并生成 `slotKeys`。

宁大节次固定为 1 至 10：08:10 开始，20:35 结束。时区默认 `Asia/Shanghai`。`normalize()` 是所有导入数据的可信边界：它会深拷贝、验证 Schema 版本和引用一致性，并重建派生索引。

旧版课表 JSON 不保证兼容。任何修改 Schema 的工作都需要：提升字符串版本、提供迁移方案、更新解析/加密/工具页和 fixture，不能只调整一个组件。

## 4. 加密课表协议

密钥参数：RSA-OAEP、SHA-256、3072 bit、指数 65537。每次导出生成随机 AES-256-GCM 内容密钥，用接收方 RSA 公钥加密该 AES 密钥。

信封只允许五个顶层字段：

```json
{
  "protected": "base64url(header)",
  "encrypted_key": "base64url(RSA encrypted AES key)",
  "iv": "base64url(12 bytes)",
  "ciphertext": "base64url(ciphertext)",
  "tag": "base64url(16 bytes)"
}
```

protected header 必须精确包含：

```json
{
  "alg": "RSA-OAEP-256",
  "enc": "A256GCM",
  "typ": "better-nxu-schedule+jwe",
  "cty": "application/vnd.better-nxu.schedule+json",
  "kid": "sha256-...",
  "bnxv": 1
}
```

header 的 Base64URL 文本同时作为 AES-GCM AAD，因此篡改 header、密文或 tag 都会导致解密失败。明文上限 5 MB，信封上限 7 MB。

公钥可以分享；私钥绝不能分享。重新生成或完全重置密钥后，旧私钥不会自动保留。项目没有服务器托管、同步或找回私钥。

## 5. 外部请求与权限

### 远程请求

| 目标                           | 目的                        | 数据                                                                      |
| ------------------------------ | --------------------------- | ------------------------------------------------------------------------- |
| `portal.nxu.edu.cn/cal/<id>`   | 获取 ICS 课表               | 课表分享 ID、现有登录 cookie                                              |
| 门户 `execCardMethod`          | 获取当前账号课表分享 ID     | 固定卡片参数、现有登录 cookie                                             |
| 学工 `getStuBaseInfo.do`       | 验证导出者身份              | 用户确认的学号、现有登录 cookie                                           |
| 教师查询代理接口               | 查询工号                    | 教师姓名关键词、页码                                                      |
| `v1.hitokoto.cn`               | 点击版本号显示一言          | 不发送业务凭证                                                            |
| Tesseract worker/core/lang CDN | OCR 运行时                  | 下载静态资源；验证码图片仍由当前教务页面读取                              |
| `cdn.jsdelivr.net`             | IDS 滑块 ORT/WASM/ONNX 模型 | GM 匿名下载固定版本静态资源并校验 SHA384；不发送账号、cookie 或验证码图片 |

工具页会在后台打开信息门户和学工系统代理页并在约 5 秒后尝试关闭，用于建立所需登录态。该动作不绕过学校认证。

### `@grant`

- `GM_getValue` / `GM.setValue` / `GM.setValues`：配置、凭证、课表 ID、密钥；旧式写 API 仅作兼容回退。
- `GM_getResourceText` / `GM_addElement` / `GM_addStyle`：读取固定资源、把可执行资源注入真实页面、注入样式；GM 注入路径可绕过 CSP。
- `GM_openInTab` / `window.close`：设置页、后台预热和失败页关闭。
- `GM.xmlHttpRequest`：ICS/一言及滑块静态资源等受权限控制的请求；滑块资源显式使用 `anonymous: true`。
- 原生 `<a download>`：下载运行时生成的课表 Blob URL，并在完成后回收 Object URL。
- `GM_setClipboard`：教师工号、知网/万方选区、密钥复制。
- `GM_info`：版本信息。
- `unsafeWindow`：调用学校页面函数和读取桥接运行时。
- `CAT_userConfig`：ScriptCat 原生配置入口。

标准权限由 vite-plugin-monkey 的 `autoGrant` 从 `#gm` 静态导入自动收集；只显式保留插件客户端无法表示的 ScriptCat 非标准 `CAT_userConfig`。减少权限前仍须确认所有运行路径。

## 6. DOM 与内容安全

- 课程名、教师、教室、接口字段等动态数据必须用 `textContent` 或 Vue 文本插值。
- 只有完全由源码常量组成的模板允许 `innerHTML`；一旦加入外部或 GM 数据，改为节点 API。
- README/CHANGELOG 先由 marked 解析，再由 DOMPurify 白名单消毒。解析器或消毒器任一缺失时，只显示转义文本。
- 外链统一补 `target=_blank` 和 `rel=noopener noreferrer`；非 HTTP(S) Markdown 链接移除 `href`。
- 选区复制日志只记录字符长度，不记录正文或 HTML。

## 7. 威胁与残余风险

- 学校页面 DOM 和页面函数不受本项目控制，更新后选择器可能失效。
- ScriptCat、浏览器及远程 CDN 的作用域/CSP 行为只能通过真机验证。
- 用户脚本拥有页面级权限，恶意第三方脚本或受污染设备仍可能读取页面和用户脚本存储。
- 加密保护课表文件的静态内容，不隐藏文件存在、大小、加密算法或接收方 keyId，也不替代设备安全。
- 自动登录提高便利性但增加本地凭证风险。默认配置不应被解释为适合公共设备。
