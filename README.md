<p><strong>⚠️如果点击安装弹出油猴安装界面，请取消！！！<br>⚠️本插件只能通过 ScriptCat 安装！！！<br>⚠️如果没有安装该插件，可以<a href="https://microsoftedge.microsoft.com/addons/detail/scriptcat/liilgpjgabokdklappibcjfablkpcekh">点击此处</a>安装<br>⚠️两个同时安装会产生冲突导致无法正常使用！！！</strong></p>

# Better NXU

这是一个提高各种 NXU 网站体验的用户脚本（Userscript）。推荐通过 [ScriptCat 的 Better NXU 项目页](https://scriptcat.org/zh-CN/script-show-page/1429)安装。

## 文档

- [用户指南](https://github.com/this-is-h/Better-NXU/blob/main/docs/user/README.md)：安装、配置、功能、课表工具与常见问题
- [开发者文档](https://github.com/this-is-h/Better-NXU/blob/main/docs/dev/README.md)：架构、模块 API、设计决策、测试与发布
- [GitHub 协作开发规范](https://github.com/this-is-h/Better-NXU/blob/main/docs/dev/github-workflow.md)：GitHub Flow 分支模型、Conventional Commits、代码审查、质量门禁与发布流程
- [贡献指南](CONTRIBUTING.md)：分支、commit、更新联动、PR、审查、合并与发布规范

## 安全提示

自动登录功能会通过用户脚本管理器的存储能力保存账号信息。请只在可信设备上开启自动登录，不建议在公共电脑或他人设备上保存密码。

## ✨功能介绍

### 1. WebVPN

- ✔️已实现（🔹为部分实现或存在问题）
  - 自动登录🔹
  - 自定义卡片（知网、万方、学工系统等）
  - 抢课备用系统卡片
  - 教务系统课表优化
  - 知网自由复制
  - 一些自制的小工具
  - 配置页面
  - 关于页面
- 📅计划中
  - 无感保活（或者轻微有感）
- ⛔无法实现（技术限制，可能是暂时的）
  - 暂无

### 2. 教务系统

- ✔️已实现（🔹为部分实现或存在问题）
  - 自动登录
  - 课表美化
  - 教务系统自定义菜单🔹
  - 课表导出为图片、JSON 和 Excel
- 📅计划中
  - 其他课表软件导入文件格式
  - 抢课（？不知道能不能）
- ⛔无法实现（技术限制，可能是暂时的）
  - 暂无

### 3. 评教系统

- ✔️已实现（🔹为部分实现或存在问题）
  - 暂无
- 📅计划中
  - 自动评教（适配新平台）
- ⛔无法实现（技术限制，可能是暂时的）
  - 暂无

### 4. 信息门户

- ✔️已实现（🔹为部分实现或存在问题）
  - 新版信息门户的自定义菜单
- 📅计划中
  - 暂无

### 5. 团委官网

- ✔️已实现（🔹为部分实现或存在问题）
  - 暂无
- 📅计划中
  - 暂无
- ⛔无法实现（技术限制，可能是暂时的）
  - 下载附件自动识别验证码并下载（似乎因CSP限制无法加载tessact.js）

## ⭐️关于我们

### 项目介绍

- 这是一个提高各种 NXU 网站体验的用户脚本（Userscript）
- 你是否面临着以下情况？
  - 每次登录都需要输入账号与密码
  - 记不清各个网站的链接，每次需要找很久
  - 进入某个网站后，需要点击很多次才能到达目标页面（如知网万方）
  - 教务系统的课表难以阅读
  - 抢课进不去，找不到备用网站，输入验证码很繁琐
  - ……
- 本项目以 WebVPN 为入口，为各个 NXU 网站提供了一些额外的功能，希望能给你带来更好的体验！
- 本项目的代码将保持以 [MIT 协议](https://mit-license.org/) 开源，欢迎大家提交 PR 与 Issue。参与开发前请阅读[贡献指南](CONTRIBUTING.md)和[开发者文档](docs/dev/README.md)。

### 问题反馈

- 左：[兔小巢反馈平台](https://txc.qq.com/products/680684)
- 右：QQ交流群

<div style="display: flex; justify-content: center; align-items: center;">
  <img src="https://raw.giteeusercontent.com/thisish/Better-NXU/raw/main/assets/img/issue.png" style="width: 49%;padding: 10px;" referrerpolicy="no-referrer"/>
  <img src="https://raw.giteeusercontent.com/thisish/Better-NXU/raw/main/assets/img/group.png" style="width: 49%;padding: 10px;" referrerpolicy="no-referrer"/>
</div>
