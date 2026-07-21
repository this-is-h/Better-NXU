# Better NXU 1.2.0 测试清单

## 安装

- 脚本猫/油猴重新加载 `Better NXU.user.js`
- 确认版本 **1.2.0**
- 控制台有 `Better NXU` / `开始运行 v1.2.0`

## 快速测

| # | 操作 | 预期 |
|---|---|---|
| 1 | 打开 `https://webvpn.nxu.edu.cn/` | 门户增强正常；自定义卡片可点进教务等 |
| 2 | 控制台执行 `BetterNXU.toWebvpnUrl('https://jwgl.nxu.edu.cn/cas.action')` | 返回 webvpn 代理 URL |
| 3 | 控制台执行 `BetterNXU.parseVpnContext()`（在 webvpn 教务页） | `realHost` 为 jwgl 或对应 IP |
| 4 | 统一认证登录页 + **未**开自动登录 + 已存账号 | 右下角「填入账号」→ 填入后手点登录 → 滑块手动过 |
| 5 | 统一认证 + **开启**自动登录 | 自动填表并触发登录；滑块手动过 |
| 6 | WebVPN 内教务登录/课表 | 与以前一致；课表美化/导出正常 |
| 7 | `/h/settings`、`/h/tools`、`/h/about` | 页面能打开，Vant UI 正常 |

## 失败时请提供

- 控制台完整 Better NXU 日志
- `BetterNXU.parseVpnContext()` 输出
- `typeof startLogin` / `typeof encryptPassword` / `typeof CryptoJS`
