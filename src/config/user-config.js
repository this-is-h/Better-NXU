/**
 * ScriptCat 原生配置面板定义。
 *
 * vite-plugin-monkey 没有专用 UserConfig 字段，因此由其官方 generate 钩子把本块追加到
 * .user.js 与 .meta.js。字段键名保持 1.x 兼容；业务设置页仍提供更完整的校验、条件禁用、
 * 密钥管理和分级重置。
 */
// Automatic login is opt-in for both the native ScriptCat panel and the in-page settings UI.
export const USER_CONFIG_SAFE_DEFAULTS = Object.freeze({
  'WebVPN.autoLogin': false,
  'Jwgl.autoLogin': false,
});

// 大先生服务恢复时，USER_CONFIG_BLOCK 的 customCard default/values 可改回：
// default: ['教务管理','学工系统','信息门户','中国知网','万方数据','大先生']
// values: ['教务管理','学工系统','信息门户','中国知网','万方数据','大先生']
// 同时还需恢复 CustomCards.vue 和 SettingsPanel.vue，并递增 ConfigVersion。

export const USER_CONFIG_BLOCK = `/* ==UserConfig==
WebVPN:
    username:
        title: 账号
        description: 连接校园网的账号（学号）
        type: text
    password:
        title: 密码
        description: 连接校园网的密码
        type: text
        password: true
    autoLogin:
        title: 自动登录WebVPN
        description: 是否自动登录WebVPN
        type: checkbox
        default: ${USER_CONFIG_SAFE_DEFAULTS['WebVPN.autoLogin']}
    autoReLogin:
        title: 微信快速登录
        description: 是否在多因子认证（微信扫码）时启用快速登录
        type: checkbox
        default: false
    searchClose:
        title: 默认关闭搜索栏
        description: 是否将搜索栏设置为默认关闭状态
        type: checkbox
        default: true
    autoClose:
        title: 自动关闭错误网站
        description: 是否自动关闭显示错误的网站
        type: checkbox
        default: false
    courseGrab:
        title: 抢课备用列表
        description: 是否添加抢课备用列表
        type: checkbox
        default: true
    customTool:
        title: H - 小工具
        description: 是否添加小工具列表
        type: checkbox
        default: true
    customCard:
        title: 在主页需要添加的卡片
        description: 这里可以选择在主页增加的自定义卡片
        type: mult-select
        default: ['教务管理','学工系统','信息门户','中国知网','万方数据']
        values: ['教务管理','学工系统','信息门户','中国知网','万方数据']
    qualityJson:
        title: 评教系统自定义配置（暂未实现）
        description: 这里可以配置评教系统的自定义设置，请严格按照以下要求：1. 每一条规则均用[]表示，每条规则之间用英文逗号,隔开。2. 内有三个参数，每个参数之间用英文逗号,隔开。3. 参数1为一个数字，表示第几列；参数2为一个字符串，需用英文单引号'引用，表示这一列匹配的内容是什么；参数3为一个数字，1表示完全同意，2表示同意，以此类推。  示例：[[0, '“四史”教育'， 2], [1, 'XX学院'， 1]]
        type: textarea
        default: []
Jwgl:
    username:
        title: 账号
        description: 登录教务系统的账号（学号）
        type: text
    password:
        title: 密码
        description: 登录教务系统的密码
        type: text
        password: true
    autoLogin:
        title: 自动登录教务系统
        description: 是否自动登录教务系统（抢课时可解放双手）
        type: checkbox
        default: ${USER_CONFIG_SAFE_DEFAULTS['Jwgl.autoLogin']}
    courseBeautify:
        title: 课表美化
        description: 是否自动美化课表
        type: checkbox
        default: true
    customMenu:
        title: 在菜单需要添加的条目
        description: 这里可以选择在主页左侧边栏增加的自定义条目
        type: mult-select
        default: ['全部学期成绩']
        values: ['全部学期成绩']
TuanWei:
    autoDownload:
        title: 自动下载附件（未实现）
        description: 是否自动填写二维码并下载附件
        type: checkbox
        default: false
    autoDownloadClose:
        title: 自动关闭下载页面（未实现）
        description: 是否自动下载后自动关闭页面
        type: checkbox
        default: false
 ==/UserConfig== */`;
