# 设计决策与踩坑记录

本页记录“为什么不能直接改成更常见的写法”。这些约束大多来自 ScriptCat 真机、学校页面生命周期或从 1.x 单文件迁移到 ESM 时遇到的问题。

## 1. 为什么仍然是单文件静态 import

vite-plugin-monkey 官方支持单文件中的动态 import，并会改用 SystemJS 构建。项目并非因为插件“不支持”而禁用它，而是发布合同明确要求产物不含 SystemJS 或动态 chunk，以减少额外运行时、CSP、网络、加载顺序和离线失败面。因此所有 page 仍静态进入一个 IIFE，以体积换部署确定性。

低频大资源不等于都应打包。Vant CSS、Tesseract、marked、DOMPurify 被移到 `@resource`，ScriptCat 安装时缓存，业务命中时才读/执行。Vant JS 暂留 npm 包，因为将它外置会让所有匹配页面启动都依赖新的全局桥接。

## 2. GM API 为什么统一走官方客户端

业务模块通过自定义 `clientAlias: '#gm'` 使用 vite-plugin-monkey 官方客户端，例如 `import { GM_info, unsafeWindow } from '#gm'`。插件在开发环境提供 client bridge，在生产构建中把这些导入替换为用户脚本作用域绑定，并由 `autoGrant` 精确生成权限。

`document['__monkeyWindow-<hash>']` 是插件客户端的开发期实现细节，不是业务代码应依赖的接口；自行扫描它还会绕过静态分析。旧 `utils/gm.js` 已删除。Node 测试通过 `package.json#imports` 和 `test/setup.mjs` 模拟官方客户端所需环境，不改变生产代码。

本轮按 vite-plugin-monkey 与 ScriptCat 官方能力逐项核对后的边界如下：

- 标准 GM API 使用 `#gm` 和 `autoGrant`；可等待的写入和请求优先使用 ScriptCat 的 `GM.setValue(s)` 与 `GM.xmlHttpRequest`。
- vite-plugin-monkey 按官方要求位于 Vite 插件列表最后；项目未启用不推荐的 `server.mountGmApi`，也不加载其全局类型，避免业务代码绕过 ESM 导入。
- 本地路由 CSS 使用 `?style`，内联 `data:` 依赖使用 `util.dataUrl`。
- vite-plugin-monkey 没有专用 UserConfig 配置项，因此用其官方 `generate` 钩子把完整配置块追加到 user/meta 产物；`CAT_userConfig` 仅负责打开面板，不能替代配置定义。
- 固定摘要的低频 UMD 仍保留 `@resource` + `GM_getResourceText` + page window 执行和全局校验。改为 `externalResource` 会改变当前按路由懒执行、异常降级和全局验证边界。
- 普通页面节点继续使用原生 `createElement`，因为这里不需要 `GM_addElement` 的跨作用域能力，且可少一项 grant。
- 运行时生成的 JSON 使用原生 `<a download>` 下载 Blob URL，并在完成后回收链接和 Object URL；不额外申请下载权限。
- ScriptCat 原生 UserConfig 入口继续提供，但不能替代当前带校验、条件禁用、密钥管理和两级重置的设置页。
- ScriptCat 的 `document-idle` 已表示内容加载完成；入口不再重复实现 readyState 等待。

## 3. 为什么 `@inject-into page` 不能改

业务需要调用学校页面定义的 `startLogin`、`checkForm`、`reAuthByCombined`，读取真实页面 Vue/DOM 环境，以及取得桥接后的 snapdom/XLSX。改成 content/sandbox 会改变 window 身份、页面函数可见性和 GM API 路径，需要全面重新设计与真机验证，不是普通配置调整。

## 4. `@require` 后为什么还有三条 `data:` bridge

ScriptCat 会把 `@require` 与脚本主体包装在一个 sandbox 函数中：

- h.notification 用顶层声明暴露 `addToast/createToast/removeToast/ToastCss`，它们可能只是包装函数局部变量。
- snapdom/XLSX 写入的 `window` 可能是 sandbox window，而业务读取的是真实 page window。
- ESM 模块既访问不到包装函数局部，也不能可靠假定全局落点。

解决方式是在每个库之后紧跟 `data:` 脚本，利用同一包装作用域中的裸变量，把对象挂到 `unsafeWindow` 和 `window`。顺序是依赖关系：bridge 放到库前会引用不存在的变量；改用 `eval` 也无法访问外层包装函数的词法局部。

已踩坑表现：通知函数 undefined；图片/Excel 导出读取 `unsafeWindow.snapdom`/`.XLSX` 时崩溃。不要自动排序 `require` 数组，也不要把 bridge 合并到产物模块中。

## 5. 为什么 `@storageName h.nxu` 经 `$extra`

`storageName` 是 ScriptCat 专有元数据，vite-plugin-monkey 不把普通 `userscript.storageName` 透传，曾出现构建成功但产物缺少该字段。当前通过 `userscript.$extra` 生成 `@storageName h.nxu`，并由 `verify-meta.mjs` 强制检查。

丢失该字段会让更新后的脚本看起来像“配置全部消失”，实际上是进入了另一个存储域。

## 6. 为什么认证路由必须严格还原真实主机

WebVPN 外层 host 永远可能是 `webvpn.nxu.edu.cn`，路径中还可能出现 `login`。过去宽泛匹配会让非 IDS 被代理页面误进入自动登录逻辑。最严重的后果是读取已保存凭证并把它填入攻击者可控或错误页面。

当前三层防护：

1. `parseWebVpnContext()` 通过已知 token 还原真实主机。
2. 路由使用 `isWebVpnIdsLoginRoute()` 等严格守卫。
3. `idsLogin()` 和 re-auth 入口再次调用 `isTrustedIdsContext()`。

路由便利性不能弱化这三层。对认证路径新增兼容时，应增加明确 host/token 映射和测试，而不是恢复外层 URL 子串兜底。

## 7. 为什么上下文只初始化一次

普通用户脚本页面中，启动时 URL、host 和 ScriptCat 信息是稳态值。集中解析避免不同模块各自实现 WebVPN 判定导致不一致，也避免 page 在模块求值阶段过早读取 `GM_info`。

门户是例外：SPA 导航会修改 URL，所以它的 onNavigate 使用实时 resolver 重新读取 pathname 或重新解析代理 URL。不要把整个全局 context 改成隐式可变对象，会让路由、日志和认证守卫在异步流程中难以推理。

## 8. 门户为什么不用永久 initialized 标志

早期实现用 document dataset 标记“已经注入”。门户从 `#/hall` 切走时 Vue 会销毁 iframe 和自定义卡片，但 dataset 仍在；切回后脚本错误地认为已完成，从而不再注入。

当前只在注入进行期间使用 Promise 锁，完成后释放。DOM 中存在对应 id 时幂等跳过；DOM 被销毁后再次导航会重新执行。history 原方法只捕获一次，重复调用只追加回调，避免补丁套补丁。

## 9. 为什么设置/关于/工具可以清空 body

这三条 URL 对脚本而言是预留空壳或 WebVPN 失败页，业务目标就是由脚本接管，因此 `mountAppPage()` 清空 body 是有意行为。普通学校页面是叠加注入，绝不能复用这一行为。

教务课表曾通过序列化并重写整个 body 删除一条样式规则，这会重建 DOM、丢失 Vue 实例和事件。现在只定位并修改目标 `<style>` 文本。判断标准不是“永远不能写 innerHTML”，而是是否有意接管整个空壳页面，以及是否会破坏现有运行时。

## 10. WebVPN 首页菜单为什么离屏挂载再搬移

原站导航 CSS 要求 `.wrdvpn-navbar__user` 是 `header .rt` 的直接子节点。Vue 通常把组件渲染在 host 容器内部，多一层 wrapper 会破坏原站直接子选择器并占据 flex 布局位置。

当前先把组件挂到离屏 wrapper，再将组件根 DOM 移到 `.rt`，最后移除 wrapper。Vue 持有真实 DOM 引用，搬移后仍可 patch。除非同时验证原站 CSS 与 Vue 更新行为，不要改成常规 host 包裹。

## 11. Vant CSS 为什么按需注入

全局在所有匹配页面注入 Vant CSS 会污染学校页面、增加解析成本，认证页尤其敏感。当前 Vant JS 由构建按组件使用，完整 CSS 只在 `mountVueApp()` 默认路径或 `mountAppPage()` 注入；IDS 填充按钮显式跳过。

如果新增纯原生/Vue 组件不使用 Vant，应传 `useVantStyles: false`。如果使用 Vant，先确保 CSS，再注入页面专属覆盖样式。

## 12. Markdown 为什么必须“双组件成功才渲染 HTML”

marked 只解析 Markdown，不提供安全边界。README/CHANGELOG 跟随远程 main，内容可能变化，所以必须经 DOMPurify。若 marked 可用而 DOMPurify 不可用，不能把 marked 输出写入 `innerHTML`，只能降级为转义文本。

关于页资源由 ScriptCat 在安装/更新时缓存，不是每次打开页面都联网。更新仓库文档后，已安装用户要等脚本更新或重装才看到新内容。

## 13. OCR 为什么分为 UMD、worker、core、语言包

把完整 OCR 编入脚本会显著增加每个匹配页面的启动成本。当前 UMD 作为固定 SHA384 `@resource`，只在教务登录或团委附件识别时执行；教务 worker/core/lang 由 Tesseract 运行时继续按固定 URL 获取。

团委 CSP 禁止 Worker 直接加载 CDN。`tesseract-local.js` 经 GM 匿名下载并验证三项固定 SHA384，再创建本地 Blob URL；core 选用内嵌 WASM 的通用 LSTM 构建。Tesseract 会向语言路径追加文件名，且按 `js` 后缀判断 core 文件，因此用 URL fragment 容纳这些后缀，保持 Blob 目标不变。资源约 6.96 MB，仅命中并开启功能时加载；不改变教务原加载路径。该路径已在保持 CSP 的真实团委页面识别并获取有效附件。

自动点击只拦截脚本自己派发的确定事件，学校原 `setCode()` 处理器保留给手动操作。同源 fetch 验证 HTTP 状态、Content-Disposition 和 Content-Type 并收完响应体后，才使用 `GM_download({ downloadMode: 'browser', saveAs: false })` 保存 data URL，避免页面 Blob URL 无法被管理器后台读取。以 `onload` 作为关页依据，不按固定延时猜测；ScriptCat 当前实现会将部分用户取消也转为 onload，脚本无法独立检查磁盘，此限制必须保留在用户说明中。依据：[ScriptCat API](https://docs.scriptcat.org/docs/dev/api/#gm_download)、[下载回调源码](https://github.com/scriptscat/scriptcat/blob/main/src/app/service/content/gm_api/gm_api.ts)、[Tesseract 7 core 加载源码](https://github.com/naptha/tesseract.js/blob/v7.0.0/src/worker-script/browser/getCore.js)。

已踩坑：Tesseract 默认 CDN 在中国大陆不稳定；某镜像只有 worker、缺 core 或语言包。当前三类统一指向经验证的 unpkg 固定版本。超时后 Promise 仍可能晚到，因此要为 late worker 补 terminate，不能只清当前局部变量。

## 14. 教师搜索为什么有取消、版本号和页数上限

用户连续输入时旧请求可能晚于新请求返回，覆盖最新结果；XML 异常可能让 Promise 永不结束；错误分页可能形成无限循环。当前做法：

- 新搜索 abort 上一个 XHR。
- 每轮携带请求版本，旧结果直接丢弃。
- XHR 有超时，XML parsererror 显式 reject。
- 页码必须与请求相符，总页数最大 100。
- `<form>` 使用 `@submit.prevent`，防止按回车跳转 `/`。

任何新的分页请求都应沿用这些边界，而不是只在成功路径递归。

## 15. 课表解析为什么统一到 Schema 2.0

ICS、教务 DOM、个人视图、多人空闲、Excel 和加密如果各自维护结构，会迅速出现单双周、教师/课程交换、线上课和合并单元格差异。现在所有来源先转换为 course/schedule/lesson，再由 `normalize()` 验证和重建派生索引。

教务美化与导出共用 `course-cell.js`，但保留不同缺失占位：显示用“空”，导出用“未定”。这是有意差异，不应为了表面统一而抹平。

## 16. 课表加密为什么使用混合加密

RSA 不适合直接加密几 MB JSON。每个文件生成随机 AES-256-GCM 密钥加密正文，再用接收方 RSA-OAEP-256 公钥包装 AES 密钥。GCM 同时提供机密性和篡改检测，protected header 作为 AAD。

`kid` 是公钥 SPKI 的 SHA-256 标识，用于从本地/会话密钥缓存选择私钥，不是秘密。文件格式严格限制字段集合，避免无意接受含歧义扩展字段的信封。

## 17. 为什么只能导出当前账号本人的课表 JSON

工具页允许通过链接查看别人的公开课表，但导出会生成可传播文件并写入 owner。当前通过门户课表 ID和学工接口验证当前 WebVPN 登录身份，只允许导出自己的远程课表；上传文件只用于查看/聚合，也不能再次冒充原作者导出。

这是业务完整性边界。不要仅通过前端按钮状态判断，导出处理函数内部也保留检查。

## 18. 日志为什么默认关闭 debug 并脱敏

用户脚本运行在包含账号、课表、cookie 和选中文本的页面。生产 debug 噪音不仅影响排障，也可能诱导用户在反馈中提交敏感信息。`MyConsole` 默认在生产关闭 debug，并按键名脱敏对象。

脱敏不是万能的：字符串正文没有字段名可供识别。因此不要记录完整 HTML、接口响应、课表 JSON、选中文本、URL 中的认证参数或 PEM。

## 19. 当前已知残余风险

- 学校 DOM 变化仍会使硬编码选择器失效，关键 selector 尚未全部集中。
- 没有完整的 ScriptCat 浏览器自动化；Node 测试不能覆盖真实注入与登录态。
- 依赖升级必须与外置 Vue/Vant 版本和 SHA384 联动，并完成 ScriptCat 真机验证；不能只更新 npm 版本。
- 门户常量卡片仍用字符串模板；若未来数据来自接口/GM，必须改为节点构建。
- 远程 CDN 和校园网络可用性仍是外部依赖，降级路径必须长期保留。

## 20. WebVPN 为什么需要同时保护 Blob 内容与来源

WebVPN 会包装外部请求、`Blob`、`URL.createObjectURL()` 和 Worker。GM 后台下载只能解决外链改写；JavaScript 还需按 UTF-8 解码，再使用嵌套 Blob 保留源码，并将网关伪装成 IDS 来源的 Blob URL 还原后交给动态模块加载器。少一层都会重新出现已遇到的报错。

实现位于 `libraries/slider-resources.js` 和 `libraries/slider-recognizer.js`。具体错误对照、复用示例及为何普通浏览器测试不足，见[WebVPN 资源加载排障](webvpn-resource-loading.md)。升级运行时或网关后按该文档复查完整加载链。

## 21. WebVPN 导出周次文字为什么会重叠

2026-09-25 根据用户指出的教室换行线索重新验证，纠正此前的字体重影判断：教室 `<mark>` 没有换行符，但导出样式固定了小数宽度和单行高度，同时允许文字换行。计算宽度序列化后会丢失少量精度，再次布局时向下量化；例如 SVG 的 `68.0156px` 在本地 Chrome 中变成 `68px`。教室末尾数字被挤到下一行，而 `height: 25px`、`line-height: 25px` 和可见溢出让它覆盖周次。

WebVPN 导出在 `utils/snapdom.js` 内将计算样式中的像素 `width` 向上取整，每个小数宽度增加不足 1px，防止内联和 snapdom 克隆重复序列化后继续缩窄。整数宽度、非像素值、字体、行高和换行规则保持原值，因此原本需要多行的长教室名仍可正常换行。全部计算样式读取完成后才统一写入；成功或失败都在 `finally` 恢复原内联样式。移除此前的 Helvetica/Arial 替换，直连仍使用原生捕获路径。

本地 Chrome 验证上传 SVG 的 41 个教室节点均出现换行覆盖；仅将教室宽度向上取整后，41 处均恢复正常，未改字体。另用虚构课程验证 snapdom 2.16.0 和 3.1.0 的实际 SVG/PNG 导出：直连正常，旧 WebVPN 样式复制可复现短教室名换行，修复后短教室名恢复单行、长教室名保持原有三行，2.5 倍导出尺寸不变。Node 回归覆盖小数/整数/非像素宽度、字体和换行保留、测量失败与样式恢复。仍需在真实 ScriptCat 的教务直连与 WebVPN 页面验证；禁止把用户上传的完整课表 SVG 加入测试或文档。

## 官方参考

- [vite-plugin-monkey GM API usage](https://github.com/lisonge/vite-plugin-monkey#gm_api-usage)
- [vite-plugin-monkey 中文文档](https://github.com/lisonge/vite-plugin-monkey/blob/main/README_zh.md)
- [ScriptCat 脚本 API](https://docs.scriptcat.org/docs/dev/api/)
- [ScriptCat 脚本配置](https://docs.scriptcat.org/docs/dev/config/)
- [ScriptCat 开发指南：常见误区](https://learn.scriptcat.org/常见问题/常见误区2/)
- [ScriptCat 开发指南：脚本与网页作用域](https://learn.scriptcat.org/油猴教程/番外篇/脚本与网页作用域的引申/)
