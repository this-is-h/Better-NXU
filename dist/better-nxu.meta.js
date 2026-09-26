// ==UserScript==
// @name           Better NXU
// @namespace      https://thisish.com/
// @version        2.0.2
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
// @match          *://zylib.nxu.edu.cn/*
// @match          *://kns.cnki.net/reader/xml*
// @match          *://kns.cnki.net/xmlRead/trialRead*
// @match          *://www.cnki.net/reader/xml*
// @match          *://www.cnki.net/xmlRead/trialRead*
// @match          *://f.wanfangdata.com.cn/online/pc/periodical_html*
// @require        https://scriptcat.org/lib/1405/1.0.7/h.notification.js#sha384-Ef8dnXffgAqEVHA7uHKmtub7Uh4Ji/Yv60yL+Himym+PdTNeb/NAKi+d9qh9olzC
// @require        data:application/javascript,%3B(function()%7Bvar%20w%3D(typeof%20unsafeWindow!%3D%3D'undefined')%3FunsafeWindow%3Awindow%3Bw.addToast%3DaddToast%3Bw.createToast%3DcreateToast%3Bw.removeToast%3DremoveToast%3Bw.ToastCss%3DToastCss%3Bvar%20c%3D(typeof%20CAT_userConfig!%3D%3D'undefined')%3FCAT_userConfig%3Aundefined%3Bif(c)%7Bw.CAT_userConfig%3Dc%3Bwindow.CAT_userConfig%3Dc%3B%7D%7D)()%3B
// @require        https://cdnjs.cloudflare.com/ajax/libs/vue/3.5.43/vue.global.prod.min.js#sha384-jpQley6yTEvoZeHVfCkBVqGK6kLbDxptME8BFcqX9FJiFhpNkdkUSs54xLMnxmuB
// @require        https://unpkg.com/@zumer/snapdom@3.1.0/dist/snapdom.js#sha384-WGMhfcLrIwHy2nch3wquBVui5YbAvFGEjpUqtK65dcKwZ+vBMkydMJja61MRE6An
// @require        data:application/javascript,%3B(function()%7Bvar%20w%3D(typeof%20unsafeWindow!%3D%3D'undefined')%3FunsafeWindow%3Awindow%3Bvar%20s%3D(typeof%20snapdom!%3D%3D'undefined')%3Fsnapdom%3A(typeof%20window!%3D%3D'undefined'%3Fwindow.snapdom%3Aundefined)%3Bif(s)%7Bw.snapdom%3Ds%3Bwindow.snapdom%3Ds%3B%7D%7D)()%3B
// @require        https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js#sha384-EnyY0/GSHQGSxSgMwaIPzSESbqoOLSexfnSMN2AP+39Ckmn92stwABZynq1JyzdT
// @require        data:application/javascript,%3B(function()%7Bvar%20w%3D(typeof%20unsafeWindow!%3D%3D'undefined')%3FunsafeWindow%3Awindow%3Bvar%20x%3D(typeof%20XLSX!%3D%3D'undefined')%3FXLSX%3A(typeof%20window!%3D%3D'undefined'%3Fwindow.XLSX%3Aundefined)%3Bif(x)%7Bw.XLSX%3Dx%3Bwindow.XLSX%3Dx%3B%7D%7D)()%3B
// @resource       about-md             https://raw.giteeusercontent.com/thisish/Better-NXU/raw/main/README.md
// @resource       dompurify-js         https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.4.15/purify.min.js#sha384-uUMu9JDY09vBzRf9SPcK2VgUj+W/70J6Soc+Dded5P474ElQ63iv9j5N3DE7Kp3N
// @resource       github-markdown-css  https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.9.0/github-markdown.min.css#sha384-dvqix+FXNZkkgkfxRwowYZelxQUSFEjEbDpb1k1mIMw84dsT8M3NM2CJC3xyp2hh
// @resource       marked-js            https://unpkg.com/marked@18.0.14/lib/marked.umd.js#sha384-2vpGtuKqJvFlwJqYnf/wUMuzUfhUnYBt9oay0e2yaFcq0Dh6/aEbQ8YAOeKGzlYo
// @resource       svg-logo             https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/font-awesome/6.2.1/css/all.min.css#sha384-twcuYPV86B3vvpwNhWJuaLdUSLF9+ttgM2A6M870UYXrOsxKfER2MKox5cirApyA
// @resource       tesseract-js         https://unpkg.com/tesseract.js@7.0.0/dist/tesseract.min.js#sha384-2BQ3U3OdKOb0Uczxqr41I9UvZkzr4V9Hv8uSzMMZAlmhsFClvdZX5wi5fDCzG+tM
// @resource       update-md            https://raw.giteeusercontent.com/thisish/Better-NXU/raw/main/CHANGELOG.md
// @resource       vant-css             https://cdnjs.cloudflare.com/ajax/libs/vant/4.10.2/index.min.css#sha384-/emcjTEhfcL99sMjPCGhXaThIpqFm61vsVdjpoJHtfHHJ/mY354KjvR3/POEs56i
// @connect        webvpn.nxu.edu.cn
// @connect        portal.nxu.edu.cn
// @connect        v1.hitokoto.cn
// @connect        cdn.jsdelivr.net
// @connect        unpkg.com
// @grant          CAT_userConfig
// @grant          GM.setValue
// @grant          GM.setValues
// @grant          GM.xmlHttpRequest
// @grant          GM_addElement
// @grant          GM_addStyle
// @grant          GM_download
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
        title: 自动下载附件
        description: 自动识别团委附件页验证码并下载，失败时保留手动操作
        type: checkbox
        default: false
    autoDownloadClose:
        title: 自动关闭下载页面
        description: 开启自动下载后，收到下载完成回调时关闭附件页面
        type: checkbox
        default: false
 ==/UserConfig== */

/*! captcha-recognizer-js@1.0.4
MIT License

Copyright (c) 2026 slider-captcha-gap contributors

Inference/postprocess logic is a JavaScript port of captcha-recognizer
(https://github.com/chenwei-zhao/captcha-recognizer), MIT License,
Copyright 2024 Zhao Chenwei. The quantized ONNX model
(model/slider.onnx.q8.onnx) is derived from that project's
captcha_recognizer/models/slider.onnx and remains subject to its MIT license.

This package bundles no third-party code at runtime; ONNX Runtime Web
(MIT, © Microsoft Corporation) is loaded from jsDelivr at runtime.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/