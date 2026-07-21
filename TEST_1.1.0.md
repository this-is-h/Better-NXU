# Better NXU 1.1.0 测试清单

文件：`Better NXU.user.js`  
版本：`1.1.0` / ConfigVersion `6`

## 安装

1. 脚本猫 / Tampermonkey 重新加载本文件（覆盖旧版）
2. 打开任意匹配页，控制台过滤 `Better NXU`，确认日志版本为 1.1.0

## A. 统一认证自动登录（核心）

前置：设置 → WebVPN → 勾选自动登录，填账号密码

| # | 步骤 | 预期 |
|---|---|---|
| A1 | 打开 `https://ids.nxu.edu.cn/authserver/login` | 自动填用户名密码；Toast「自动登录」 |
| A2 | 观察是否弹出滑块 | 有则 Toast 提示手动完成；**手动拖完**后应登录成功 |
| A3 | 打开 `https://webvpn.nxu.edu.cn/login` 或会跳到统一认证的入口 | 同 A1/A2 |
| A4 | 故意填错密码再开自动登录 | Toast 提示密码错误，不进入死循环 |
| A5 | 控制台 | 可见 `调用页面 startLogin()` 或 `已预填 saltPassword`；**不应**再加载 Tesseract 模型下载 |

失败时请记录：

- 是否有 `#pwdEncryptSalt` / `#saltPassword` / `#login_submit`
- `typeof startLogin` / `typeof encryptPassword`（在页面控制台）
- 滑块 DOM 是否出现（`#captcha-id` / `#sliderDiv`）

## B. 主页卡片

| # | 步骤 | 预期 |
|---|---|---|
| B1 | 开启「H - 小工具」+ 自定义卡片（教务等） | 两个分区都在，卡片不串台 |
| B2 | 只开其中一个 | 仅对应分区显示 |

## C. 微信快速登录（若你用）

| # | 步骤 | 预期 |
|---|---|---|
| C1 | 开启 autoReLogin，走到微信确认/扫码 | 能点到快速登录或按原逻辑跳转；不白屏 |

## D. 回归：教务 OCR 登录

| # | 步骤 | 预期 |
|---|---|---|
| D1 | Jwgl 自动登录开，进教务登录页 | 仍走 Tesseract 图形码（与 1.0.2 类似） |

## 已知边界（不是 bug）

- **不会**自动完成统一认证滑块（有意为之）
- 密码 AES 依赖页面 `encryptPassword` 或 `CryptoJS`；若 WebVPN 改写导致二者都不在 `unsafeWindow`，会退化为仅填明文并 click，需你反馈页面实际全局变量名
