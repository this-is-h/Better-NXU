# WebVPN 外部资源、Blob 与 Worker 加载排障

适用于“IDS 直连正常，WebVPN 下 JavaScript、WASM 或模型加载失败”的问题。当前有效方案是：**GM 后台下载并校验全部静态资源 → JavaScript 解码为文本 → 嵌套 Blob 保留源码 → 还原真实 Blob URL → 交给 Worker 使用**。只把远程 URL 换成 Blob URL 还不够。

本文记录 2026-09-21 对宁夏大学 WebVPN 的实际排查，参考前端脚本为 `/wengine-vpn/js/main.js?ver=20211207`，识别器为 `captcha-recognizer-js@1.0.4`，运行时为 `onnxruntime-web@1.20.1`。网关或依赖升级后需要重新核对相关行为；查询参数中的版本号不能代替文件内容核验。

## 1. 按报错定位

| 现象或错误                                                                                                                 | 本次确认的原因                                                                                | 对应处理                                                                      |
| -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `Refused to execute script ... MIME type ('text/html')`，资源地址出现 WebVPN `/https/<host-token>/npm/...`，最后返回登录页 | 页面或 Worker 的外链加载被 WebVPN 改写，取得 HTML 而非 JavaScript                             | 全部静态依赖改由 `GM.xmlHttpRequest` 从原始 CDN 下载；验证响应和摘要          |
| `Unexpected identifier 'ArrayBuffer'`，调用栈包含网关 `main.js`                                                            | 网关的 JavaScript Blob hook 将 `ArrayBuffer` 隐式转成 `[object ArrayBuffer]`                  | JavaScript 先用 `TextDecoder` 解码；WASM 和模型保留二进制                     |
| `SyntaxError: Unexpected token (79:31)`，解析栈来自网关 `main.js`                                                          | 网关把模块源码作为普通脚本包装解析，无法处理该 `.mjs` 中的顶层 `await`                        | 使用无 MIME 内层 Blob，再用外层 Blob 设置 JavaScript MIME，避免源码被重新解析 |
| `Not allowed to load local resource: blob:https://ids.nxu.edu.cn/...` 或 `Failed to fetch dynamically imported module`     | `createObjectURL()` 返回的真实 WebVPN 来源被伪装成 IDS 来源；原生动态 `import()` 不会自动还原 | 使用页面已有 `vpn_rewrite_url()` 转回真实 Blob URL，再传给模块加载器          |
| `no available backend found. ERR: [wasm] ...`                                                                              | 上层汇总错误；本次实际失败是动态模块加载                                                      | 先读嵌套错误，检查 `.mjs` 与 `.wasm`，不要仅更换推理后端                      |
| 一直显示初始化中，没有进入错误提示                                                                                         | 上游把初始化错误放在 `id: 0` 的 Worker 消息中，但调用方未处理；也可能是下载未结束             | 初始化也注册待处理消息，设置下载/初始化超时，失败清理后允许重试               |

错误行列随资源版本变化。判断依据是失败阶段、实际加载内容、Blob 来源和调用栈，不能只匹配某个固定行号。

## 2. 为什么要处理完整加载链

原始链路：

```text
ScriptCat @resource 读取识别器入口
  -> 识别器创建 Worker
  -> Worker importScripts(CDN/ort.min.js)
  -> ORT 动态 import(CDN/ort-wasm-simd-threaded.mjs)
  -> WASM 二进制加载
  -> ONNX 模型加载
```

入口通过 ScriptCat 缓存，不代表它的后续请求也走 GM。`@connect` 只授权 GM 请求，不会自动接管原生 `fetch`、`importScripts` 或动态 `import()`。因此只补 `@connect` 或只改模型 URL，仍会留下运行时依赖被改写的问题。

本次还确认了三类页面包装：

- `Blob`：对 JavaScript MIME 的 parts 拼接、解析和重写；发现 parts 中已有 Blob 时直接保留。
- `URL.createObjectURL()` / `revokeObjectURL()`：分别对返回值和入参进行来源转换。
- `Worker` / `importScripts`：包装 Worker 并注入 WebVPN 运行时，转换脚本地址；这不等于原生动态模块导入也能识别伪装后的 Blob URL。

所以普通浏览器中的 Blob/Worker 测试可以通过，而同一段代码在 WebVPN 中仍会失败。

## 3. 可复用的实现方法

### 3.1 下载与完整性校验

实现参考：`src/libraries/slider-resources.js` 的 `fetchSliderAsset()`、`loadSliderAssets()` 和 `SLIDER_ASSETS`。

1. 从 `#gm` 静态导入 `GM`，调用 `GM.xmlHttpRequest`，使用**原始 CDN URL**。
2. 固定完整版本和 SHA384；公用静态资源使用 `anonymous: true`、`responseType: 'arraybuffer'`、合理的下载超时。
3. 检查 HTTP 状态、HTML 响应、非空 ArrayBuffer 和 SHA384，全部通过后才能加载。仅修改 MIME 或忽略浏览器报错不能把登录 HTML 变成代码。
4. 在现有 `@connect` 范围内访问；新增域名时同步 `vite.config.js` 和 `scripts/verify-meta.mjs`。
5. 取消时中止仍在执行的请求；不以页面 `fetch` 或远程 `importScripts` 作为失败回退。

当前四项资源及去向：

| 资源                          | 固定版本     | 下载后处理                           | 消费方式                                      |
| ----------------------------- | ------------ | ------------------------------------ | --------------------------------------------- |
| `ort.min.js`                  | ORT 1.20.1   | UTF-8 文本、受保护的 JavaScript Blob | Worker `importScripts`                        |
| `ort-wasm-simd-threaded.mjs`  | ORT 1.20.1   | UTF-8 文本、受保护的 JavaScript Blob | ORT 原生动态 `import()`                       |
| `ort-wasm-simd-threaded.wasm` | ORT 1.20.1   | 二进制、`application/wasm` Blob      | WASM 后端                                     |
| `slider.onnx.q8.onnx`         | 识别器 1.0.4 | ArrayBuffer 转 Uint8Array            | `InferenceSession.create()`，不再请求模型 URL |

准确 URL 和摘要以 `SLIDER_ASSETS` 为准，文档不重复维护摘要值。下载资源不会上传验证码图像或账号信息。

### 3.2 保留 Blob 内容并还原来源

实现参考：`src/libraries/slider-recognizer.js` 的 `initialize()`。下面是同一处理方式的独立示例，`allocatedUrls` 属于调用方的资源生命周期；这不是新增的项目公共 API。

```js
const allocatedUrls = [];
const decoder = new TextDecoder('utf-8', { fatal: true });

function localResourceUrl(content, type) {
  // 内层不设置 MIME，网关不会把内容送入 JS 解析器。
  // 外层的 parts 已经是 Blob，当前 WebVPN 明确保留它的原始内容。
  const blob = new Blob([new Blob([content])], { type });
  const allocatedUrl = URL.createObjectURL(blob);
  allocatedUrls.push(allocatedUrl);

  // 只转换本模块创建的本地资源地址；直连环境直接使用原值。
  return typeof window.vpn_rewrite_url === 'function' ? window.vpn_rewrite_url(allocatedUrl) : allocatedUrl;
}

// assets 为已经下载并通过摘要校验的 ArrayBuffer 集合。
const runtimeUrl = localResourceUrl(decoder.decode(assets.runtime), 'text/javascript');
const moduleUrl = localResourceUrl(decoder.decode(assets.module), 'text/javascript');
const wasmUrl = localResourceUrl(assets.wasm, 'application/wasm');

// Worker 源码也通过 localResourceUrl 创建。
// 完成使用或初始化失败后，先终止 Worker，再统一释放：
function releaseUrls() {
  for (const url of allocatedUrls) URL.revokeObjectURL(url);
  allocatedUrls.length = 0;
}
```

需要同时保留两种 URL：提供给消费者的是还原后的真实地址；资源列表记录 `createObjectURL()` 的原返回值，并交给同一页面成对的 `revokeObjectURL()` 回收。不要用硬编码的域名替换 Blob 前缀，实际代理来源、端口和被代理站点可能变化。

`vpn_rewrite_url()` 是此网关提供的接口，不是浏览器标准 API。只在函数存在时使用，保持页面对象作为调用接收者。若将来接口消失或行为改变，应重新检查网关实现及报错，不能默认以前的修复对所有 WebVPN 产品都适用。

### 3.3 配置 Worker 内部依赖

ORT 1.20.1 支持将模块和 WASM 分开指定。在 Worker 的初始化代码中，使用上一步得到的真实本地地址：

```js
importScripts(runtimeUrl);
ort.env.wasm.numThreads = 1;
ort.env.wasm.simd = true;
ort.env.wasm.wasmPaths = { mjs: moduleUrl, wasm: wasmUrl };
const session = await ort.InferenceSession.create(modelBytes, {
  executionProviders: ['wasm'],
  graphOptimizationLevel: 'all',
});
```

本仓库的 `buildLocalSliderWorker()` 复用 `captcha-recognizer-js@1.0.4/src/core.js` 生成算法源码，只替换上游写死的 `importScripts` 和 `wasmPaths` 两处。每处必须恰好匹配一次，否则报错停止。依赖已锁定 `1.0.4`；升级时重新核对生成代码，不能宽泛替换所有 URL 或静默回到 CDN。

模型通过 `postMessage` 传入 Uint8Array，并转移对应 ArrayBuffer。上游参数仍名为 `modelUrl`，但 ORT 接受二进制；这个名字不表示当前仍使用远程 URL。传输后发送方 buffer 会被分离，不应继续读取。

小型识别算法静态打包，大型运行时、WASM 和模型仍按需下载。移除旧 IIFE `@resource` 时同时更新元数据校验；静态打包算法后由 `vite.config.js` 的生成阶段保留上游 MIT 许可。

### 3.4 保留生命周期和失败回退

网络修复必须与异步清理一起生效：

- 同页并发调用复用一个初始化 Promise，失败不缓存为可用实例。
- Worker 初始化的成功与 `id: 0` 错误消息都要结算；不能只有 `ready` 分支。
- 当前单项下载上限 60 秒、整个初始化 90 秒、推理 30 秒。
- 出错、超时、显式释放和 `pagehide` 时，中止下载、拒绝等待任务、终止 Worker、回收 Blob URL。
- 已取消的下载或图片快照晚到时不能创建旧实例、覆盖新实例或泄漏资源。

滑块业务中的“失败换图后至多三次尝试”由 `ids/auth/slider-retry.js` 负责，规则见[开发、测试与发布](development.md)。它不应通过重复下载资源来掩盖初始化错误，也不能因页面跳转慢而重复拖动。

## 4. 下次遇到问题的排查顺序

1. **确认正在运行的版本。** 日志中有 `127.0.0.1:5173/src/...` 表示正在使用开发服务。改动资源加载或 Worker 后完整刷新登录页；HMR 不会自动替换已经运行的 Worker。
2. **画出实际依赖链。** 不仅查看入口库，还查它创建的 Worker、动态模块、WASM 和模型请求。逐一确认是否仍有外链。
3. **先确认下载内容。** JS 收到 HTML 时先解决加载来源；记录状态和 MIME 即可，不输出完整登录 HTML、图片或认证参数。
4. **确认构造 Blob 时传入的类型。** JavaScript 是解码后的源码，WASM/模型是二进制；JavaScript Blob 应包含内层 Blob，避免网关重写内容。
5. **比较 Blob 来源。** 浏览器真实来源与 `createObjectURL()` 的表面返回值可能不同；检查最终提供给动态 `import()` 的 URL 是否已还原。
6. **核对当时的网关脚本。** 从页面 `<script src>` 找到实际资源，搜索 `Blob`、`createObjectURL`、`Worker`、`importScripts`、`vpn_rewrite_url`；必要时查看字符串表还原后的对应函数。压缩变量名和堆栈行号不稳定。
7. **让测试先复现，再验证修复。** 普通浏览器通过只能说明原生 API 路径正常。必须加入网关包装行为，尤其是 Blob 来源转换和模块源码重写。

本次三次排障的经验是：GM 下载解决了远程资源问题；文本解码解决了 ArrayBuffer 拼接问题；嵌套 Blob 与来源还原共同解决了后续动态模块问题。这些改动需要作为完整链路保留。

## 5. 验证方法与已确认的边界

### 自动测试

```bash
node --import ./test/setup.mjs --test test/slider-resources.test.js test/slider-recognizer.test.js
pnpm check
pnpm test:coverage
```

对应覆盖：

| 测试文件                         | 验证内容                                                                         |
| -------------------------------- | -------------------------------------------------------------------------------- |
| `test/slider-resources.test.js`  | GM 原始 URL 请求、匿名下载、HTML/HTTP/空内容拒绝、摘要不符和取消                 |
| `test/slider-recognizer.test.js` | 本地 Worker 依赖、Blob 包装、顶层 await 解析错误、来源还原、资源回收、并发和超时 |
| `test/slider-retry.test.js`      | 换图后重试、成功后等待跳转、次数上限和页面离开清理                               |
| `test/slider-drag.test.js`       | 项目自有拖动终点、取消、超时、元素失效和事件完整性                               |

### 本地真实浏览器复现

2026-09-21 已使用学校实际的 WebVPN `main.js`，在本地静态页面复现同样的 `blob:https://ids.nxu.edu.cn/...` 动态模块错误；修复后真实 ORT、WASM、模型初始化、预热和空白画布推理成功，直连页面也通过。此前只模拟 Blob 文本拼接的测试没有覆盖来源伪装，不能沿用它作为完整验证。

重建这个环境的方法：

1. 将当时学校公开的 WebVPN 脚本与四项固定资源下载到本地临时目录，不保存账号、cookie、学校验证码或个人页面内容。
2. 在本地 HTTP 服务提供测试页和静态资源。测试页先加载网关配置及其完整脚本，再加载待验证的识别器模块。配置示例如下；`/vpn.js` 为本地保存的实际网关脚本：

   ```html
   <script>
     var __vpn_app_hostname_data = 'ids.nxu.edu.cn';
     var __vpn_app_protocol_data = 'https:';
     var __vpn_app_url_data = 'https://ids.nxu.edu.cn/authserver/login';
     var __vpn_host_crypt = false;
     var __vpn_js_file = '/vpn.js';
   </script>
   <script src="/vpn.js"></script>
   ```

3. 测试页的 `#gm` 桥仅把这四个已知静态 URL 映射到本地资源，返回真实 ArrayBuffer。使用绝对 localhost URL，避免测试桥自身的相对请求被网关改写。上述配置只用于本地复现，不注入生产登录页。
4. 创建空白 Canvas，调用实际 `getSliderRecognizer()`、`detect()`、`dispose()`。运行旧实现应出现同类错误，修复后应完成初始化及推理；不要求空白图检测到缺口。
5. 去掉网关脚本，验证直连路径。临时测试桥、下载文件和调试日志不进入生产包或提交。

### ScriptCat 真实页面

本地 GM 桥不能验证真实 ScriptCat 下载、学校 CSP、完整登录态及最终校验结果。安装 `dist/better-nxu.user.js`，或完整刷新 `pnpm dev` 对应的登录页，分别检查 IDS 直连和 WebVPN；确认不再出现代理 CDN 的 HTML MIME 错误、ArrayBuffer 语法错误和伪装来源的动态导入错误。

保留手动处理入口。验证记录区分“本地加载了完整网关脚本”“真实模型推理通过”和“ScriptCat 登录流程通过”，避免把其中一项等同于另外两项。

## 6. 维护入口

| 需要调整的内容                                   | 位置                                                     |
| ------------------------------------------------ | -------------------------------------------------------- |
| CDN URL、版本、SHA384、GM 下载与取消             | `src/libraries/slider-resources.js`                      |
| 嵌套 Blob、来源还原、Worker 代码适配、超时与清理 | `src/libraries/slider-recognizer.js`                     |
| 元数据、连接域、远程资源、上游许可               | `vite.config.js`、`scripts/verify-meta.mjs`              |
| 依赖版本                                         | `package.json`、`pnpm-lock.yaml`                         |
| 失败换图后的重试                                 | `src/sites/ids/auth/slider-retry.js`、`slide-captcha.js` |

相关约定见[设计决策与踩坑记录](design-decisions.md)、[数据、配置与安全](data-and-security.md)和[GitHub 协作开发规范](github-workflow.md)。本方法处理已授权页面中的静态资源加载兼容性，认证主机守卫和页面注入模型保持原有约定。
