// ==UserScript==
// @name           Better NXU
// @namespace      https://thisish.com/
// @version        2.0.0
// @author         H
// @description    这是一个提高各种 NXU 网站体验的用户脚本（Userscript）
// @match          *://webvpn.nxu.edu.cn/*
// @match          *://sslvpn.nxu.edu.cn/*
// @match          *://jsfzyjxzlxt.nxu.edu.cn/*
// @match          *://jwgl.nxu.edu.cn/*
// @match          *://portal.nxu.edu.cn/*
// @match          *://sysaq.nxu.edu.cn/*
// @match          *://202.201.128.234/*
// @match          *://tuanwei.nxu.edu.cn/*
// @match          *://ids.nxu.edu.cn/*
// @match          *://open.weixin.qq.com/*
// @require        https://scriptcat.org/lib/1405/1.0.7/h.notification.js#sha384-Ef8dnXffgAqEVHA7uHKmtub7Uh4Ji/Yv60yL+Himym+PdTNeb/NAKi+d9qh9olzC
// @require        data:application/javascript,%3B(function()%7Bvar%20w%3D(typeof%20unsafeWindow!%3D%3D'undefined')%3FunsafeWindow%3Awindow%3Bw.addToast%3DaddToast%3Bw.createToast%3DcreateToast%3Bw.removeToast%3DremoveToast%3Bw.ToastCss%3DToastCss%3Bvar%20c%3D(typeof%20CAT_userConfig!%3D%3D'undefined')%3FCAT_userConfig%3Aundefined%3Bif(c)%7Bw.CAT_userConfig%3Dc%3Bwindow.CAT_userConfig%3Dc%3B%7D%7D)()%3B
// @require        https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/vue/3.5.22/vue.global.min.js#sha384-qCjGjR+q4j3L6F1d3hI/Tqq5Ry6XGIiJMUdZC+VawNbSWD2eP2RR+laa6A3euDAZ
// @require        https://unpkg.com/@zumer/snapdom@2.16.0/dist/snapdom.js#sha384-XHEQh68myKc3CIe4DhnbAY1QEVszoaGTPQRzEM6JIKCWRg3mnUG3fAt3+UuxqEYE
// @require        data:application/javascript,%3B(function()%7Bvar%20w%3D(typeof%20unsafeWindow!%3D%3D'undefined')%3FunsafeWindow%3Awindow%3Bvar%20s%3D(typeof%20snapdom!%3D%3D'undefined')%3Fsnapdom%3A(typeof%20window!%3D%3D'undefined'%3Fwindow.snapdom%3Aundefined)%3Bif(s)%7Bw.snapdom%3Ds%3Bwindow.snapdom%3Ds%3B%7D%7D)()%3B
// @require        https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js#sha384-EnyY0/GSHQGSxSgMwaIPzSESbqoOLSexfnSMN2AP+39Ckmn92stwABZynq1JyzdT
// @require        data:application/javascript,%3B(function()%7Bvar%20w%3D(typeof%20unsafeWindow!%3D%3D'undefined')%3FunsafeWindow%3Awindow%3Bvar%20x%3D(typeof%20XLSX!%3D%3D'undefined')%3FXLSX%3A(typeof%20window!%3D%3D'undefined'%3Fwindow.XLSX%3Aundefined)%3Bif(x)%7Bw.XLSX%3Dx%3Bwindow.XLSX%3Dx%3B%7D%7D)()%3B
// @resource       about-md             https://raw.giteeusercontent.com/thisish/Better-NXU/raw/main/README.md
// @resource       dompurify-js         https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/dompurify/3.2.4/purify.min.js#sha384-eEu5CTj3qGvu9PdJuS+YlkNi7d2XxQROAFYOr59zgObtlcux1ae1Il3u7jvdCSWu
// @resource       github-markdown-css  https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/github-markdown-css/5.8.1/github-markdown.min.css#sha384-bKf/D9oOhMXM113OMRKT6sKFRT4jT3AulvzsGu563IJ5zmaH5LSA26VfwRJQ8GAR
// @resource       marked-js            https://unpkg.com/marked@18.0.6/lib/marked.umd.js#sha384-uGn1eBC40GtuBgao0epc/cz9O4Lo8/flg/10SW+69UjLI5nP31iT4UPc65Xz10Le
// @resource       svg-logo             https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/font-awesome/6.2.1/css/all.min.css#sha384-twcuYPV86B3vvpwNhWJuaLdUSLF9+ttgM2A6M870UYXrOsxKfER2MKox5cirApyA
// @resource       tesseract-js         https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/tesseract.js/6.0.1/tesseract.min.js#sha384-r1ru3tcf6FhnCFR4B7pIFG+BhFF9LlFtz/P1y4pblWn3AGs9y3lBx5SKLNf4+rED
// @resource       update-md            https://raw.giteeusercontent.com/thisish/Better-NXU/raw/main/CHANGELOG.md
// @resource       vant-css             https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/vant/4.9.21/index.min.css#sha384-Jb7yH4uJOgDFef++Dmtf9JGETGSXgz9+wrg/jQ7XsqYtJzSClY4imewu/quoIrel
// @connect        webvpn.nxu.edu.cn
// @connect        portal.nxu.edu.cn
// @connect        v1.hitokoto.cn
// @grant          CAT_userConfig
// @grant          GM.setValue
// @grant          GM.setValues
// @grant          GM.xmlHttpRequest
// @grant          GM_addElement
// @grant          GM_addStyle
// @grant          GM_getResourceText
// @grant          GM_getValue
// @grant          GM_info
// @grant          GM_openInTab
// @grant          GM_setClipboard
// @grant          GM_setValue
// @grant          GM_setValues
// @grant          unsafeWindow
// @grant          window.close
// @inject-into    page
// @run-at         document-idle
// @storageName    h.nxu
// ==/UserScript==

/* ==UserConfig==
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
        default: false
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
        default: false
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
 ==/UserConfig== */