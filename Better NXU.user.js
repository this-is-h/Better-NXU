// ==UserScript==
// @name         Better NXU
// @namespace    https://thisish.com/
// @version      0.3.5
// @description  这是一个提高各种 NXU 网站体验的用户脚本（Userscript）
// @author       H
// @run-at       document-idle
// @storageName  h.nxu
// @match        *://webvpn.nxu.edu.cn*
// @match        *://jsfzyjxzlxt.nxu.edu.cn*
// @match        *://jwgl.nxu.edu.cn*
// @match        *://202.201.128.234*
// @match        *://tuanwei.nxu.edu.cn*
// @match        *://ids.nxu.edu.cn*
// @grant        GM_info
// @grant        GM_log
// @grant        CAT_userConfig
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addElement
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        window.close
// @require      https://scriptcat.org/lib/1405/1.0.7/h.notification.js
// @require      https://unpkg.com/vue@3/dist/vue.global.js
// @require      https://unpkg.com/tesseract.js@5/dist/tesseract.min.js
// @require      https://cdn.jsdelivr.net/npm/@zumer/snapdom/dist/snapdom.min.js
// @require      https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js
// @resource     svg-logo https://cdn.bootcdn.net/ajax/libs/font-awesome/6.2.1/css/all.min.css
// @resource     tesseract https://unpkg.com/tesseract.js@5/dist/tesseract.min.js
// @resource     vant-css https://unpkg.com/vant@4/lib/index.css
// @resource     vue-js https://unpkg.com/vue@3/dist/vue.global.js
// @resource     vant-js https://unpkg.com/vant@4.8.0/lib/vant.min.js
// @connect      webvpn.nxu.edu.cn
// ==/UserScript==

// // @require      https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js

/* ==UserConfig==
WebVPN:
    username:
        title: 账号
        description: 连接校园网的账号
        type: text
        default: null
    password:
        title: 密码
        description: 连接校园网的密码
        type: text
        default: null
        password: true
    autoLogin:
        title: 自动登录WebVPN
        description: 是否自动登录WebVPN
        type: checkbox
        default: false
    autoClose:
        title: 自动关闭错误网站
        description: 是否自动关闭显示错误的网站
        type: checkbox
        default: false
    courseGrab:
        title: 抢课备用列表 
        description: 是否添加抢课备用列表
        type: checkbox
        default: false
    customCard:
        title: 在主页需要添加的卡片
        description: 这里可以选择在主页增加的自定义卡片
        type: mult-select
        default: ['教务管理','学工系统','信息门户','中国知网', '万方数据', 'H小工具','大先生']
        values: ['教务管理','学工系统','信息门户','中国知网', '万方数据', 'H小工具','大先生']
    qualityJson:
        title: 评教系统自定义配置（暂未实现）
        description: 这里可以配置评教系统的自定义设置，请严格按照以下要求：1. 每一条规则均用[]表示，每条规则之间用英文逗号,隔开。2. 内有三个参数，每个参数之间用英文逗号,隔开。3. 参数1为一个数字，表示第几列；参数2为一个字符串，需用英文单引号'引用，表示这一列匹配的内容是什么；参数3为一个数字，1表示完全同意，2表示同意，以此类推。  示例：[[0, '“四史”教育'， 2], [1, 'XX学院'， 1]]
        type: textarea
        default: []
Jwgl:
    username:
        title: 账号
        description: 登录教务系统的账号（一般同校园网）
        type: text
        default: null
    password:
        title: 密码
        description: 登录教务系统的密码（一般同校园网）
        type: text
        default: null
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
        default: false
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

(async function() {
    'use strict';

    // ==Basic==
        // 添加 Vue 和 Vant 组件到页面
        function AddVant() {
            unsafeWindow.Vue = Vue;
            GM_addStyle(GM_getResourceText("vant-css"));
            unsafeWindow.eval(GM_getResourceText("vant-js"));
            unsafeWindow.vant = vant;
        }

        function AddTesseract() {
            unsafeWindow.Tesseract = Tesseract;
            Tesseract = unsafeWindow.Tesseract;
        }

        function Basic() {
            // 添加Notification组件
                // 添加组件
                addToast();
                //createToast("success", "测试消息", 0);
                // 添加css样式
                GM_addStyle(ToastCss);
                GM_addStyle(GM_getResourceText("svg-logo").replace(/\.\.\/webfonts/g, "https://cdn.bootcdn.net/ajax/libs/font-awesome/6.2.1/webfonts"));
                //绑定Toast事件
                unsafeWindow.createToast = createToast;
                unsafeWindow.removeToast = removeToast;
            // 绑定事件
                unsafeWindow.CAT_userConfig = CAT_userConfig;
            // UI
                AddVant();
        }
    // /==Basic==

    // ==Constant==
        const Info = GM_info;
        const Url = window.location.href;
        const Host = window.location.host;
        const Origin = window.location.origin;
        const Path = window.location.pathname;
        // tesseract 提示消息
        const LoadMessage = { "loading tesseract core": "核心加载", "initializing tesseract": "初始化", "loading language traineddata": "加载语言训练数据", "initializing api": "初始化接口", "recognizing text": "识别验证码" };
        // 配置版本，增加即可使用户弹出更新窗口
        const ConfigVersion = 3;
    // /==Constant==

    // ==Function==
        // 识别验证码
        function GetVerificationCode(web) {
            var url = "";
            switch (web) {
                case "WebVPN":
                    url = "https://webvpn.nxu.edu.cn/https/77726476706e69737468656265737421f9f352d229287d1e7b0c9ce29b5b/authserver/captcha.html?vpn-1&ts=225";
                    break;
                case "Jwgl":
                    url = "captcha/image.action";
                    break;
                case "TuanWei":
                    url = "https://tuanwei.nxu.edu.cn/system/resource/js/filedownload/createimage.jsp";
                    break;
                default:
                    return;
            }
            MyConsole(url);
            return new Promise(function (resolve, reject) {
                Tesseract.recognize(
                    url,
                    'eng',
                    { logger: m => LoadMessage[m.status] ? (MyConsole(LoadMessage[m.status])) : (null) }
                ).then(({ data: { text } }) => {
                    MyConsole(text.replace(/\s+/g, ''));
                    resolve(text.replace(/\s+/g, ''));
                })
            });
        }

        // 自定义的控制台输出，提高可识别度
        function MyConsole(msg, custom = "") {
            if (typeof (msg) != 'object') {
                // if (/\n/.test(msg)) {
                //     console.log("======== Better NXU ========\n" + msg + "\n======== Better NXU ========");
                // } else {
                    console.log(
                        '%c %s %c %s',
                        'border-radius: 5px;padding: 3px 4px;color: white;background-color: #3a8bff;margin-bottom: 0.5em',
                        'Better NXU',
                        'margin-left: 0.6em;font-size:1.2em',
                        '\n' + msg,
                    );
                    if (custom != "") {
                        console.info("自定义信息：" + custom)
                    }
                // }
            } else {
                console.log(
                    '%c %s %c %s',
                    'border-radius: 5px;padding: 3px 4px;color: white;background-color: #3a8bff;margin-bottom: 0.5em',
                    'Better NXU',
                    'margin-left: 0.6em;',
                    '\n下面是一个object对象',
                );
                console.log(msg);
            }
        }

        // 检查账号密码是否配置
        function CheckUsernameAndSecret(web) {
            const username = GM_getValue(web + ".username", false);
            const password = GM_getValue(web + ".password", false);
            if (!username || !password) {
                MyConsole("账号密码未配置\n请前往配置相关信息");
                createToast("error", `
                    <p style="margin-bottom:0.5em;margin-top: 0">账号密码未配置<br>请前往配置相关信息</p>
                    <a href="javascript:void(0)" onclick="CAT_userConfig()" style="font-weight:bold;font-size:small">> 前往配置 <</a>
                `);
                return false;
            }
            return true;
        }

        // 获取查询参数
        function GetQuery(msg) {
            // 获取当前页面的 URL
            let urlString = window.location.href;
            // 创建 URL 对象
            let url = new URL(urlString);
            // 获取查询参数
            let searchParams = new URLSearchParams(url.search);
            let result = searchParams.get(msg);
            return result;
        }

        // 随机数
        function Random(min, max) {
            return parseInt(Math.random() * (max - min + 1) + min, 10);
        }

        // 等待执行
        function WaitTime(min, max = 0, log = true, msg = "无") {
            var waitmsg, waittime, line;
            if (max == 0) {
                waittime = min;
                waitmsg = `====================\n等待了：${(waittime / 1000)} 秒\n备注：${msg}\n====================`;
            } else {
                waittime = Random(min, max);
                waitmsg = `====================\n随机等待了：${(waittime / 1000)} 秒\n备注：${msg}\n====================`;

            }
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    if (log) {
                        MyConsole(waitmsg.replace(/ /g, ""));
                    }
                    resolve();
                }, waittime);
            });
        }

        // 关闭当前页面
        function CloseWin() {
            try {
                window.opener = window;
                var win = window.open("", "_self");
                win.close();
                top.close();
            } catch (e) {
                console.log("关闭页面失败", e);
            }
        }
    // /==Function==

    MyConsole(`开始运行`);
    // 配置信息
    MyConsole(Info);
    // MyConsole(`预判断...`);
    // switch (Host) {
    //     default:
    //         break;
    // }
    // MyConsole(`预判断未匹配`);
    // 确保页面完全加载
    MyConsole(`等待页面加载完毕...`);
    while (document.readyState != "complete") {
        await WaitTime(500);
    }
    MyConsole(`判断页面...`);
    switch (Host) {
        case 'webvpn.nxu.edu.cn':
            MyConsole("欢迎使用 webvpn");
            if (Url.indexOf("service=https%3A%2F%2Fwebvpn.nxu.edu.cn%2Flogin%3Fcas_login%3Dtrue") != -1) {
                MyConsole("这里是 - 登录页");
                AddTesseract();
                Basic();
                webvpnLogin();
            } else if (Url == 'https://webvpn.nxu.edu.cn/' || Path == "/") {
                MyConsole("这里是 - 主页");
                Basic();
                webvpnMain();
            } else if (Url.indexOf('xsfw/sys/xggzptapp/*default/index.do') != -1) {
                MyConsole("这里是 - 学工系统");
            } else if (Url.indexOf('/77726476706e69737468656265737421fae04690693e7045300d8db9d6562d/') != -1 || Url.indexOf('/77726476706e69737468656265737421a2a713d27560391e2f5ad1e2ca0677/') != -1) {
                MyConsole("这里是 - 教务系统");
                if (Url.indexOf('index.action') != -1 || Url.indexOf('login.action') != -1) {
                    MyConsole("正在 - 登录页");
                    AddTesseract();
                    Basic();
                    jwglLogin();
                } else if (Url.indexOf('cas.action') != -1 || Url.indexOf('home.action') != -1) {
                    MyConsole("正在 - 主页");
                    Basic();
                    jwglMain();
                } else if (Url.indexOf('courseTableForStd.action') != -1 && GetQuery('method') == 'stdHome') {
                    MyConsole("正在 - 课表");
                    Basic();
                    jwglCourseIframe();
                } else if (Url.indexOf('courseTableForStd.action') != -1 && GetQuery('method') == 'courseTable') {
                    MyConsole("正在 - 课表");
                    AddVant();
                    jwglCourseBeautify();
                }
            } else if (Url.indexOf('/77726476706e69737468656265737421fbf952d2243e635930068cb8') != -1 || Url.indexOf('/77726476706e69737468656265737421e7e056d2243e635930068cb8') != -1) {
                MyConsole("这里是 - 中国知网");
                if (Url.indexOf('/xmlRead/trialRead') != -1) {
                    Basic();
                    MyConsole("正在 - html阅读");
                    webvpnCnkiHtml();
                }
            } else if (Url.indexOf('/77726476706e69737468656265737421f6b9569d2936695e790c88b8991b203a6ed9f11f/online/pc/periodical_html') != -1) {
                Basic();
                MyConsole("这里是 - 万方阅读页");
                webvpnCnkiHtml();
            } else if (Path == '/wengine-vpn/failed') {
                if (document.body.innerHTML.indexOf('地址：/h/tools') != -1) {
                    MyConsole("正在 - 小工具");
                    Basic();
                    webvpnHTools();
                } else if (document.body.innerHTML.indexOf('地址：/h/settings') != -1) {
                    MyConsole("正在 - 脚本设置");
                    Basic();
                    webvpnHSettings();
                } else if (document.body.innerHTML.indexOf('地址：/h/about') != -1) {
                    MyConsole("正在 - 关于脚本");
                    Basic();
                    webvpnHAbout();
                } else {
                    MyConsole("正在 - 错误页");
                    errorHtml();
                }
            } else {
                if (document.querySelector("h1") && (document.querySelector("h1").innerHTML == `404页面不存在`)) {
                    errorHtml();
                }
            }
            break;
        case 'jsfzyjxzlxt.nxu.edu.cn':
            MyConsole("欢迎使用评教系统");
            if (Path == "/quality/student/evaluate/item_tasks") {
                MyConsole("这里是 - 选择页");
                qualityChoose();
            } else if (Path == "/quality/student/evaluate/item_tasks_text") {
                MyConsole("这里是 - 填写页");
                qualityText();
            }
            break;
        case 'jwgl.nxu.edu.cn':
            MyConsole("欢迎使用教务系统");
            if (Path == '/index.action' || Path == '/login.action') {
                MyConsole("这里是 - 登录页");
                AddTesseract();
                Basic();
                jwglLogin();
            } else if (Url.indexOf('cas.action') != -1 || Url.indexOf('home.action') != -1) {
                MyConsole("正在 - 主页");
                Basic();
                jwglMain();
            } else if (Url.indexOf('courseTableForStd.action') != -1 && GetQuery('method') == 'stdHome') {
                MyConsole("正在 - 课表");
                Basic();
                jwglCourseIframe();
            } else if (Url.indexOf('courseTableForStd.action') != -1 && GetQuery('method') == 'courseTable') {
                MyConsole("正在 - 课表");
                AddVant();
                jwglCourseBeautify();
            }
            break;
        case 'ids.nxu.edu.cn':
            MyConsole("欢迎使用统一身份认证系统");
            if (Path == "/authserver/login") {
                MyConsole("这里是 - 登录页");
                AddTesseract();
                Basic();
                webvpnLogin();
            }
            break;
        // case 'tuanwei.nxu.edu.cn':
        //     MyConsole("欢迎使用团委");
        //     if (Path == '/system/_content/download.jsp') {
        //         MyConsole("这里是 - 附件下载页");
        //         unsafeWindow.eval(GM_getResourceText("tesseract-webvpn").replace(/^vpn_eval\(\(function\(\)\{/, '').replace(/\}[\n\r]*\)\.toString\(\)\.slice\(12\,[\s]*\-2\)\,\"\"\)\;$/, ''));
        //         Tesseract = unsafeWindow.Tesseract;
        //         Basic();
        //         tuanweiDownload();
        //     // } else if (Path == '/info/1003/1022.htm') {
        //     } else {
        //         tuanweiDownloadBridge();
        //     }
        //     break;
        default:
            if (Host.indexOf('202.201.128.234') != -1) {
                MyConsole("欢迎使用教务系统");
                if (Path == '/index.action' || Path == '/login.action') {
                    MyConsole("这里是 - 登录页");
                    AddTesseract();
                    Basic();
                    jwglLogin();
                } else if (Url.indexOf('cas.action') != -1 || Url.indexOf('home.action') != -1) {
                    MyConsole("正在 - 主页");
                    Basic();
                    jwglMain();
                } else if (Url.indexOf('courseTableForStd.action') != -1 && GetQuery('method') == 'stdHome') {
                    MyConsole("正在 - 课表");
                    Basic();
                    jwglCourseIframe();
                } else if (Url.indexOf('courseTableForStd.action') != -1 && GetQuery('method') == 'courseTable') {
                    MyConsole("正在 - 课表");
                    AddVant();
                    jwglCourseBeautify();
                }
            }
            return;
    }
    return;

    async function webvpnLogin() {
        if (!GM_getValue("WebVPN.autoLogin", false)) {
            return;
        }
        // if (document.body.innerHTML.indexOf("7天免登录") != -1) {
        //     newWebvpnLogin();
        //     return;
        // }
        createToast("info", `自动登录...`);
        if (!CheckUsernameAndSecret("WebVPN")) {
            return;
        }
        if (document.querySelector('span#msg.auth_error') && document.querySelector('span#msg.auth_error').innerHTML && document.querySelector('span#msg.auth_error').innerHTML == '您提供的用户名或者密码有误') {
            createToast("error", `
                <p style="margin-bottom:0.5em;margin-top: 0">账号密码配置错误<br>请前往配置相关信息</p>
                <a href="javascript:void(0)" onclick="CAT_userConfig()" style="font-weight:bold;font-size:small">> 前往配置 <</a>
            `);
            return;
        } else if (document.querySelector('span#showErrorTip') && document.querySelector('span#showErrorTip').querySelector("span") && document.querySelector('span#showErrorTip').querySelector("span").innerHTML) {
            if (document.querySelector('span#showErrorTip').querySelector("span").innerHTML == '您提供的用户名或者密码有误') {
                createToast("error", `
                    <p style="margin-bottom:0.5em;margin-top: 0">账号密码配置错误<br>请前往配置相关信息</p>
                    <a href="javascript:void(0)" onclick="CAT_userConfig()" style="font-weight:bold;font-size:small">> 前往配置 <</a>
                `);
                return;
            }
            createToast("error", `
                <p style="margin-bottom:0.5em;margin-top: 0">${document.querySelector('span#showErrorTip').querySelector("span").innerHTML}<br>请检查登录信息</p>
            `);
            return;
        }
        // 多次登录失败会需要验证码，一般不会出现
        if (document.querySelector("p#cpatchaDiv") && document.querySelector("p#cpatchaDiv").innerHTML && document.querySelector("p#cpatchaDiv").innerHTML.replace(/\s/g, '') != '') {
            // var verification = await GetVerificationCode("WebVPN");
            // document.querySelector('input#captchaResponse').value = verification;
            createToast("warning", `请手动输入验证码登录`, 0);
            return;
        }
        const username = GM_getValue("WebVPN.username");
        const password = GM_getValue("WebVPN.password");
        // 确保填充，有时候执行太快会出现未填充登录失败的情况
        while (document.querySelector('input#username').value != username || document.querySelector('input#password').value != password) {
            document.querySelector('input#username').value = GM_getValue("WebVPN.username");
            document.querySelector('input#password').value = GM_getValue("WebVPN.password");
            await WaitTime(100);
        }
        if (document.querySelector('button[type=submit]')) {
            document.querySelector('button[type=submit]').click();
        } else {
           document.querySelector('a#login_submit').click(); 
        }
    }

    async function jwglLogin() {
        if (!GM_getValue("Jwgl.autoLogin", false)) {
            return;
        }
        createToast("info", `自动登录...`, 0);
        if (!CheckUsernameAndSecret("Jwgl")) {
            return;
        }
        if (document.querySelector('div#errors.message') && document.querySelector('div#errors.message').innerHTML) {
            const errorText = document.querySelector('div#errors.message').innerHTML;
            if (errorText == "密码错误" || errorText == "账户不存在") {
                createToast("error", `
                    <p style="margin-bottom:0.5em;margin-top: 0">账号密码配置错误<br>请前往配置相关信息</p>
                    <a href="javascript:void(0)" onclick="CAT_userConfig()" style="font-weight:bold;font-size:small">> 前往配置 <</a>
                `);
                return;
            }
        }
        // 可能是网络问题，部分时候下载很慢
        createToast("info", `下载识别模型可能需要花费一些时间，请耐心等待...`, 0);
        var verification = await GetVerificationCode("Jwgl");
        document.getElementsByName("loginForm.name")[0].value = GM_getValue("Jwgl.username");
        document.getElementsByName("loginForm.password")[0].value = GM_getValue("Jwgl.password");
        document.getElementsByName("loginForm.captcha")[0].value = verification;
        document.querySelector("input#loginSubmit").click();
    }

    async function webvpnMain() {
        // 页面有渲染时间，确保元素渲染完成
        while (!document.querySelector("div[title=教务管理平台]")) {
            await WaitTime(500);
        }
        while (!document.querySelector("div[title=教务管理平台]").innerHTML) {
            await WaitTime(500);
        }

        const firstSet = GM_getValue('firstSet', 0);
        const configVersion = GM_getValue('configVersion', -1);
        // createToast("success", "测试消息", 0);

        //更新配置弹窗
        MyConsole("检查配置信息");
        GM_addElement(document.querySelector('body'), 'div', { id: 'update' });
        var update_template = '', update_show = false;
        if (!firstSet) {
            update_template = `
                <van-dialog v-model:show="show" title="Better NXU 首次配置" show-cancel-button confirmButtonText="前往配置" @confirm="goConfig" @close="closeFunc" style="--van-dialog-font-size:1.5em;--van-dialog-header-padding-top:18px">
                    <div style="font-size: 16px;color:var(--van-dialog-has-title-message-text-color);margin: 0.5em 0;padding: 0 2em;display: flex;flex-direction: column;justify-content: center;">
                        <p style="text-align: center;line-height: 22px;">
                            <span style="font-weight:bold;">这好像是你<span style="color:#0283EF">第一次</span>使用本插件</span><br>
                            我们需要一些配置信息<br>
                            你可以选择<span style="color:#32AE57">前往配置</span><br>
                            或点击<span style="color:#FF7B35">取消</span>不进行配置<br>
                            后续自行前往设置页面进行配置
                        </p>
                    </div>
                </van-dialog>
            `;
            update_show = true;
        } else if (configVersion != ConfigVersion) {
            update_template = `
                <van-dialog v-model:show="show" title="Better NXU 版本更新" show-cancel-button confirmButtonText='前往配置' @confirm="goConfig" @close="closeFunc" style="--van-dialog-font-size:1.5em;--van-dialog-header-padding-top:18px">
                    <div style="font-size: 16px;color:var(--van-dialog-has-title-message-text-color);margin: 0.5em 0;padding: 0 2em;display: flex;flex-direction: column;justify-content: center;">
                        <p style="text-align: center;line-height: 23px;">
                            <span style="font-weight:bold;">V ${Info.script.version}</span><br>
                            我们更新了一些配置信息<br>
                            你可以选择<span style="color:#32AE57">前往配置</span><br>
                            或点击<span style="color:#FF7B35">取消</span>不进行配置<br>
                            后续自行前往设置页面进行配置
                        </p>
                    </div>
                </van-dialog>
            `;
            update_show = true;
        }
        const update = Vue.createApp({
            template: update_template,
            setup() {
                const show = Vue.ref(false);
                show.value = update_show;
                const goConfig = () => {
                    CAT_userConfig();
                }
                const closeFunc = () => {
                    GM_setValue('firstSet', true);
                    GM_setValue('configVersion', ConfigVersion);
                }
                return { show, goConfig, closeFunc };
            }
        });
        update.use(vant);
        update.mount("#update");

        // 添加 Better NXU 设置及下拉菜单
        GM_addStyle(`
            #betternxu-settings .wrdvpn-navbar__user__menu {
                display:none;
            }

            #betternxu-settings:hover .wrdvpn-navbar__user__menu {
                display:block;
            }
        `);
        var div = document.createElement('div');
        div.innerHTML = `
            <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M510.37806 337.803609c-98.010221 0-177.748287 78.842673-177.748287 175.75284 0 96.91426 79.738066 175.763073 177.748287 175.763073 9.537214 0 19.620873-0.978281 31.797194-3.088338 18.196431-3.281743 30.290887-20.538779 26.963095-38.471197-2.924609-15.732309-16.693194-27.152407-32.747845-27.152407-2.071172 0-4.15974 0.196475-6.123464 0.563842-7.937786 1.402953-14.233166 2.056845-19.807115 2.056845-61.159942 0-110.915136-49.201585-110.915136-109.671819 0-60.467163 49.679469-109.661585 110.747313-109.661585 61.116963 0 110.832248 49.194422 110.832248 109.661585 0 5.892197-0.656963 12.0832-2.088568 19.531845-3.327792 17.928325 8.769734 35.189454 26.959002 38.464033 2.006703 0.360204 4.045129 0.546446 6.070252 0.546446 16.204054 0 30.019711-11.43033 32.832779-27.116591 2.13871-11.45182 3.13848-21.435195 3.13848-31.41857 0.042979-46.873564-18.435884-90.990341-52.033074-124.223233C602.407056 356.106464 557.790906 337.803609 510.37806 337.803609z" fill="#FFFFFF"></path><path d="M938.476161 432.79917c-2.185782-11.426237-11.037381-20.499893-22.563902-23.12058-41.909505-9.508561-76.781734-34.929534-98.185206-71.550593-21.334911-36.560684-26.191522-79.099523-13.68979-119.709429 3.52836-11.123338 0.007163-23.235191-8.951883-30.840402-41.860387-35.721573-89.536222-62.938448-141.695163-80.885192-3.152806-1.088798-6.437619-1.639337-9.776667-1.639337-8.256034 0-16.182564 3.431146-21.724791 9.376555-29.236881 31.04404-68.840878 48.140417-111.5107 48.140417-42.673915 0-82.305541-17.125029-111.607914-48.230468-7.877411-8.333806-20.510126-11.512195-31.580253-7.726985-52.483328 18.171871-100.131535 45.416376-141.640927 80.988546-8.815783 7.591909-12.322653 19.620873-8.934486 30.67258 12.586666 40.645722 7.759731 83.180468-13.597693 119.78106-21.306258 36.5965-56.149834 62.006216-98.17395 71.561849-11.540847 2.709715-20.396539 11.812023-22.559808 23.166629-5.228071 27.169803-7.877411 54.346769-7.877411 80.770582 0 26.426883 2.64934 53.603849 7.873318 80.763418 2.174526 11.411911 11.023054 20.488637 22.552645 23.12058 41.913599 9.512654 76.785827 34.922371 98.19237 71.547523 21.349237 36.59343 26.177196 79.128175 13.583366 119.795387-3.363607 10.969842 0.121773 23.013133 8.973372 30.758538 41.84913 35.707246 89.494267 62.920028 141.662417 80.902588 11.466146 3.885494 23.738657 0.549515 31.454386-7.680936 29.29828-31.091112 68.925812-48.216141 111.593588-48.216141s82.302471 17.125029 111.560842 48.183396c5.556553 5.955642 13.494339 9.380648 21.782096 9.380648 3.27765 0 6.537903-0.520863 9.829879-1.599428 52.126194-17.968234 99.774401-45.184085 141.652184-80.912821 8.791224-7.577582 12.308327-19.628036 8.94165-30.758538-12.597923-40.678468-7.745405-83.20605 13.672394-119.773897 21.324678-36.625152 56.192813-62.030775 98.19237-71.547523 11.390421-2.592035 20.23588-11.633968 22.549575-23.106254 5.223978-27.184129 7.870248-54.358025 7.870248-80.770582C946.342316 487.171522 943.697069 459.965903 938.476161 432.79917zM728.572524 789.878798c-26.02677 20.157085-54.736649 36.553521-85.487 48.818869-36.682457-32.144094-83.60207-49.779753-132.792399-49.779753-48.926316 0-95.838765 17.635659-132.767839 49.786916-30.744211-12.262278-59.45716-28.655643-85.491093-48.812729 9.894348-47.441499 1.889023-96.449679-22.763446-138.627291-24.448832-41.966811-63.427588-73.339332-110.186542-88.840374-2.381234-16.343223-3.584642-32.758078-3.584642-48.869011 0-16.043395 1.203408-32.451086 3.584642-48.851615 46.612621-15.389502 85.584214-46.758953 110.186542-88.850607 24.523533-42.024116 32.525788-91.033319 22.74912-138.620128 26.0237-20.149922 54.735625-36.543288 85.494163-48.815799 36.821627 32.201399 83.73817 49.861618 132.778072 49.861618 49.194422 0 96.109941-17.635659 132.792399-49.779753 30.751375 12.269441 59.45716 28.662807 85.48086 48.812729-9.809413 47.63388-1.835811 96.634898 22.667256 138.620128 24.445762 41.966811 63.416332 73.343425 110.182448 88.850607 2.381234 16.386202 3.584642 32.801057 3.584642 48.940642 0.143263 15.443737-1.031493 31.797194-3.499707 48.701189-46.763047 15.504112-85.73771 46.873564-110.186542 88.836281C726.84416 693.189665 718.845998 742.190683 728.572524 789.878798z" fill="#FFFFFF"></path></svg>
            Better NXU
            <ul class="wrdvpn-navbar__user__menu">
                <li class="wrdvpn-navbar__user__menuitem"><a href="/h/settings" target="_blank">设置</a></li>
                <li class="wrdvpn-navbar__user__menuitem"><a href="/h/about" target="_blank">关于我们</a></li>
                <li class="wrdvpn-navbar__user__menuitem"><a href="https://github.com/this-is-h/Better-NXU" target="_blank">Github</a></li>
            </ul>
        `;
        div.className = 'wrdvpn-navbar__user';
        div.id = 'betternxu-settings';
        document.querySelector("header .rt").appendChild(div);
        
        
        // 抢课备用列表
        function divCard(href, icon, title, content) {
            var div = document.createElement('div');
            div.innerHTML = `
                <a target="_blank" href="${href}" class="block-group__item is-active">
                    <div class="block-group__item__logo__wrap">
                        ${icon}
                    </div>
                    <div class="block-group__item__content">
                        <h2 title="${title}" class="block-group__item__name">${title}</h2>
                        <div title="${content}" class="block-group__item__desc">${content}</div>
                    </div>
                </a>
            `;
            div.className = 'block-group__item__wrap';
            return div;
        }
        function titleCard(title, id) {
            var div = document.createElement('div');
            div.innerHTML = `
                <h1 class="block-group__title">${title}</h1>
                <div class="block-group__content"></div>
            `;
            div.className = 'block-group';
            div.dataset.id = id;
            return div;
        }

        const mainDiv = document.querySelector('.portal-content__block .el-scrollbar__view');

        if (GM_getValue('WebVPN.courseGrab', false)) {
            mainDiv.prepend(titleCard("抢课备用网址", "classes"));
            const classesDiv = document.querySelector('div[data-id=classes] div.block-group__content');
            for (let i = 0; i <= 3; i++) {
                classesDiv.appendChild(divCard(
                    `http://202.201.128.234:${8080 + i}`,
                    '<div class="block-group__item__logo" style="background-color: rgb(80, 135, 229);">抢</div>',
                    `备用${i + 1}`, "仅校园网可用")
                );
            }
            for (let i = 0; i <= 3; i++) {
                classesDiv.appendChild(divCard(
                    `https://webvpn.nxu.edu.cn/http-${8080 + i}/77726476706e69737468656265737421a2a713d27560391e2f5ad1e2ca0677/index.action`,
                    '<div class="block-group__item__logo" style="background-color: rgb(80, 135, 229);">抢</div>',
                    `备用${i + 5}`, "校外可用")
                );
            }
        }

        //自定义卡片
        const webVPNCustomCard = GM_getValue("WebVPN.customCard", ['教务管理','学工系统','信息门户','中国知网', '万方数据', 'H小工具','大先生']);
        if (webVPNCustomCard.length != 0) {
            mainDiv.prepend(titleCard("自定义", "custom"));
            const customDiv = document.querySelector('div[data-id=custom] div.block-group__content');
            if (webVPNCustomCard.indexOf('教务管理') != -1) {
                customDiv.appendChild(divCard(
                    `https://webvpn.nxu.edu.cn/https-443/77726476706e69737468656265737421fae04690693e7045300d8db9d6562d/cas.action`,
                    '<div class="block-group__item__logo" style="background-color: rgb(235, 94, 94);">教</div>',
                    `教务平台`, "教务管理平台")
                );
            }
            if (webVPNCustomCard.indexOf('学工系统') != -1) {
                customDiv.appendChild(divCard(
                    `https://webvpn.nxu.edu.cn/https/77726476706e69737468656265737421e8e4478b693e7045300d8db9d6562d/`,
                    '<div class="block-group__item__logo" style="background-color: #95c2fb;">学</div>',
                    `学工系统`, "学工平台")
                );
            }
            if (webVPNCustomCard.indexOf('信息门户') != -1) {
                customDiv.appendChild(divCard(
                    `https://webvpn.nxu.edu.cn/https/77726476706e69737468656265737421f5fe51d229287d1e7b0c9ce29b5b/`,
                    '<div class="block-group__item__logo" style="background-color: #0966b5;">信</div>',
                    `信息门户`, "综合信息服务门户")
                );
            }
            if (webVPNCustomCard.indexOf('中国知网') != -1) {
                customDiv.appendChild(divCard(
                    `https://webvpn.nxu.edu.cn/https/77726476706e69737468656265737421e7e056d2243e635930068cb8/`,
                    '<div class="block-group__item__logo" style="background-color: #1b66e6;">知</div>',
                    `中国知网`, "中国期刊全文数据库")
                );
            }
            if (webVPNCustomCard.indexOf('万方数据') != -1) {
                customDiv.appendChild(divCard(
                    `https://webvpn.nxu.edu.cn/https/77726476706e69737468656265737421e7e056d2303166567f068ea89941227bfcd3ca21bd0c/`,
                    '<div class="block-group__item__logo" style="background-color: #00417e;">万</div>',
                    `万方数据`, "万方数据知识服务平台")
                );
            }
            if (webVPNCustomCard.indexOf('H小工具') != -1) {
                customDiv.appendChild(divCard(
                    `https://webvpn.nxu.edu.cn/h/tools`,
                    '<div class="block-group__item__logo" style="background-color: #4472c4;">工</div>',
                    `小工具 - H`, "一些方便的小工具 - H")
                );
            }
            if (webVPNCustomCard.indexOf('大先生') != -1) {
                customDiv.appendChild(divCard(
                    `https://chat.zju.edu.cn`,
                    '<div class="block-group__item__logo" style="background-color: #4472c4;">工</div>',
                    `大先生`, "浙江大学深度融合智能体")
                );
            }
        }
    }

    async function jwglMain() {
        const jwglCustomMenu = GM_getValue("Jwgl.customMenu", []);
        MyConsole(jwglCustomMenu)
        if (jwglCustomMenu.length != 0) {

            function addMenu(menu, menu_dd, href, content) {
                const menuCourseManage = document.querySelectorAll('div.layui-side.layui-bg-black.layuimini-menu-left li.layui-nav-item.menu-li');
                MyConsole(menuCourseManage)
                const menuDdMyGrade = menuCourseManage[menu].querySelectorAll('dd.menu-dd')[menu_dd];
                var menu_dd_all_grade = document.createElement('dd');
                menu_dd_all_grade.class = 'menu-dd';
                menu_dd_all_grade.innerHTML = `
                    <a href="javascript:this.top.vpn_inject_script(this);vpn_eval((function () { ; }).toString().slice(14, -2))" layuimini-href="${href}" target="_self">
                        <i class="fa fa-file-text-o"></i>
                        <span class="layui-left-nav">${content}</span>
                    </a>
                `;
                menuCourseManage[menu].querySelector("dl").insertBefore(menu_dd_all_grade, menuDdMyGrade);
            }

            while (!document.querySelector('div.layui-side.layui-bg-black.layuimini-menu-left li.layui-nav-item.menu-li')) {
                await WaitTime(500);
            }
            while (!document.querySelector('div.layui-side.layui-bg-black.layuimini-menu-left li.layui-nav-item.menu-li').innerHTML) {
                await WaitTime(500);
            }
            if (jwglCustomMenu.indexOf('全部学期成绩') != -1) {
                addMenu(1,4,'personGrade.action?method=historyCourseGrade','全部学期成绩');
            }
        }
    }

    async function jwglCourseIframe() {
        // 获取 iframe 元素
        var iframe = document.querySelector("#contentListFrame");
        while (iframe.contentWindow && iframe.contentWindow.courseBeautify != true) {
            await WaitTime(500, 0, true, "iframe");
        }
        // 等待 iframe 中的内容加载完成后获取内容高度并设置 iframe 高度（首次）
        var iframeDocument = iframe.contentWindow.document;
        if (!iframeDocument.querySelector("table")) {
            iframe.style.height = "100px";
        } else {
            var height = (iframeDocument.querySelector("table").scrollHeight + 100) + 'px';
            iframe.style.height = height;
        }
        // 监听来自iframe的消息（切换个人和班级课表时触发）
        window.addEventListener('message', function(event) {    
            if (event.data.type === 'COURSE_BEAUTIFY_CHANGED') {
                console.log('changed to:', event.data.value);
                // 等待 iframe 中的内容加载完成后获取内容高度并设置 iframe 高度
                var iframeDocument = iframe.contentWindow.document;
                if (!iframeDocument.querySelector("table")) {
                    iframe.style.height = "100px";
                } else {
                    var height = (iframeDocument.querySelector("table").scrollHeight + 100) + 'px';
                    iframe.style.height = height;
                }
            }
        });
    }

    function jwglExportCourses() {
        // 没有课表的情况
        if (!document.querySelector("table")) {
            return;
        }
        // webvpn 环境下无法引入 snapdom，无法截图
        var isWebvpn = true;
        if (Host == "jwgl.nxu.edu.cn" || Host.indexOf('202.201.128.234') != -1) {
            isWebvpn = false;
        }
        var div = document.createElement("div");
        div.id = "h-export";
        div.style = "width:100%;padding:1em 2em;box-sizing: border-box;";
        document.querySelector("table").before(div);

        GM_addStyle(`
            #
        `);
        const export_template = `
            <div style="width:100%;display:flex;align-items: center;justify-content:center;gap:1em">
                H - 将课表导出为
                ${ isWebvpn ? '' : '<van-button plain type="primary" size="small" onclick="hExportImage()">图片</van-button>'}
                <van-button plain type="primary" size="small" onclick="hExportJson()">json文件</van-button>
                <van-button plain type="primary" size="small" onclick="hExportExcel()">Excel表格</van-button>
            </div>
        `
        const exportOperation = Vue.createApp({
            template: export_template,
            // 此页面上的vue语法失效（未知问题）
            // setup() {
            //     unsafeWindow.hExportImage = async() => {
            //         vant.showNotify({ type: 'primary', message: '已尝试下载，请查看下载目录' });
            //         const el = document.querySelector('table');
            //         await snapdom.download(el, {
            //             format: 'png',
            //             filename: "课表",
            //             scale: 2.5,
            //             quality: 1
            //         });
            //     }
            //     return {}
            // }
        });
        exportOperation.use(vant);
        exportOperation.mount("#h-export");

        unsafeWindow.hExportImage = async() => {
            vant.showNotify({ type: 'primary', message: '已尝试下载，请查看下载目录' });
            const el = document.querySelector('table');
            await snapdom.download(el, {
                format: 'png',
                filename: window.top.document.querySelector(".layui-nav-item.layuimini-setting a").innerText,
                scale: 2.5,
                quality: 1
            })
        }

        unsafeWindow.hExportData = () => {
            // 这一部分 AI 实现的还没细看·v·
            function parseRangeString(str, filterType = null) {
                str = str.trim();
                if (str.startsWith('(') && str.endsWith(')')) {
                    str = str.substring(1, str.length - 1).trim();
                }
                
                let tokens = str.split(/\s+/);
                let result = [];
                
                for (let token of tokens) {
                    let rangeMatch = token.match(/\[(\d+)-(\d+)\]/);
                    if (rangeMatch) {
                        let start = parseInt(rangeMatch[1]);
                        let end = parseInt(rangeMatch[2]);
                        for (let i = start; i <= end; i++) {
                            result.push(i);
                        }
                    } else {
                        let num = parseInt(token);
                        if (!isNaN(num)) {
                            result.push(num);
                        }
                    }
                }
                
                if (filterType === "单") {
                    result = result.filter(num => num % 2 !== 0);
                } else if (filterType === "双") {
                    result = result.filter(num => num % 2 === 0);
                }
                
                return new Set(result);
            }

            function getAccurateColumnIndex(cell) {
                const row = cell.parentElement;
                const tbody = row.parentElement;
                const rows = Array.from(tbody.rows);
                const rowIndex = row.rowIndex;
                
                // 初始化列占用状态数组
                let colOccupied = [];
                
                // 遍历所有行，计算列占用情况
                for (let i = 0; i < rows.length; i++) {
                    const currentRow = rows[i];
                    const cells = Array.from(currentRow.cells);
                    
                    // 初始化当前行的列状态
                    if (!colOccupied[i]) {
                        colOccupied[i] = [];
                    }
                    
                    let colIndex = 0;
                    
                    // 遍历当前行的所有单元格
                    for (let j = 0; j < cells.length; j++) {
                        const currentCell = cells[j];
                        
                        // 找到第一个未被占用的列
                        while (colOccupied[i][colIndex]) {
                            colIndex++;
                        }
                        
                        // 如果这是我们要查找的单元格
                        if (i === rowIndex && currentCell === cell) {
                            return colIndex;
                        }
                        
                        // 标记当前单元格占用的列
                        const rowspan = currentCell.rowSpan || 1;
                        const colspan = currentCell.colSpan || 1;
                        
                        // 标记所有受影响的行和列
                        for (let k = 0; k < rowspan; k++) {
                            if (!colOccupied[i + k]) {
                                colOccupied[i + k] = [];
                            }
                            for (let l = 0; l < colspan; l++) {
                                colOccupied[i + k][colIndex + l] = true;
                            }
                        }
                        
                        colIndex += colspan;
                    }
                }
                
                // 如果未找到（理论上不应该发生），返回cellIndex作为后备方案
                return cell.cellIndex;
            }

            if (unsafeWindow.hCourseData != undefined) {
                return unsafeWindow.hCourseData;
            }

            var exportData = {
                "meta": {
                    "total_weeks": 16,
                    "classes_per_day": 5,
                    "week_days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                    "class_times": ["08:10-09:45", "10:15-11:50", "14:00-15:35", "15:55-17:30", "19:00-20:35", "21:00"]
                },
                "schedule": {}
            };

            const numberJson = {"一":1,"二":"1a","三":2,"四":"2a","五":3,"六":"3a","七":4,"八":"4a","九":5,"十":"5a","十一":6,"十二":"6a"}
            const dayJson = {"1":"Monday","2":"Tuesday","3":"Wednesday","4":"Thursday","5":"Friday","6":"Saturday","7":"Sunday"}

            $("td > div").each(function () {
                var div = $(this);
                // console.log(div);
                // console.log(div[0]);
                var number = div[0].parentElement.parentElement.querySelector("td").innerHTML.match(/[一二三四五六七八九十][一二]?/)[0];
                number = numberJson[number];
                var day = getAccurateColumnIndex(div[0].parentElement);
                day = dayJson[day];
                var duration = parseInt(div[0].parentElement.getAttribute("rowspan"));
                // console.log(day, number)
                var content = div.attr('title');
                // content = content.split(/(?<!\d|\[|\]|\(|\))[ \n\r]+(?<!\d|\[|\]|\(|\))/);
                content = content.split(/\n|(?<!\n)\s{2,}?(?!\n)/);
                // console.log(content);
                (content.length == 3) ? (content.splice(1, 0, "未定")) : (null);
                var content_array = [];
                for (let i = 0; i < content.length; i += 4) {
                    content_array.push(content.slice(i, i + 4));
                }
                // console.log(content_array);
                exportData.schedule[day] == null ? exportData.schedule[day] = {} : null;
                for (let i = 0; i < duration / 2; i++) {
                    exportData.schedule[day][number + i] == null ? exportData.schedule[day][number + i] = {} : null;
                }
                for (let i = 0; i < content_array.length; i++) {
                    if (content_array[i].length == 2 && /^[0-9\-\(\)\[\]单双周]*$/.test(content_array[i][0])) {
                        content_array[i].unshift(content_array[i-1][1]);
                        content_array[i].unshift(content_array[i-1][0]);
                    }
                    var variations = !(content_array[i][2].match(/[单双]/) == null);
                    var variations_content;
                    variations ? variations_content = content_array[i][2].match(/[单双]/)[0] : variations_content = null;
                    var week = parseRangeString(content_array[i][2], variations_content);
                    // console.log(content_array[i])
                    // console.log(week, variations, variations_content)
                    for (let j = 0; j < duration / 2; j++) {
                        if (content_array.length > 1) {
                            if (exportData.schedule[day][number + j][content_array[i][1]] == null){
                                exportData.schedule[day][number + j][content_array[i][1]] = []
                            }
                            console.log(content_array[i])
                            exportData.schedule[day][number + j][content_array[i][1]].push({
                                "teacher": content_array[i][0],
                                "classroom": content_array[i][3],
                                "week": week,
                                "variations": variations,
                                "variations_content": variations_content
                            })
                        } else {
                            exportData.schedule[day][number + j][content_array[i][0]] = [{
                                "teacher": content_array[i][1], 
                                "classroom": content_array[i][3], 
                                "week": week,
                                "variations": variations,
                                "variations_content": variations_content
                            }];
                        }
                    }
                }
            });
            for (const item_day in exportData.schedule) {
                for (const item_number in exportData.schedule[item_day]) {
                    for (const item_course in exportData.schedule[item_day][item_number]) {
                        console.log(exportData.schedule[item_day][item_number][item_course])
                    }
                }
            }
            // console.log(JSON.stringify(exportData, (key, value) => {
            //     if (typeof value === 'object' && value instanceof Set) {
            //     return [...value];
            //     }
            //     return value;
            // }));
            unsafeWindow.hCourseData = JSON.stringify(exportData, (key, value) => {
                if (typeof value === 'object' && value instanceof Set) {
                return [...value];
                }
                return value;
            });

            // 挂载到 unsafewindow 上，下次直接返回即可
            return unsafeWindow.hCourseData;
        }

        unsafeWindow.hExportJson = async() => {
            vant.showNotify({ type: 'primary', message: '已尝试下载，请查看下载目录' });
            var courseJson = await hExportData();
            const blob = new Blob([courseJson], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = window.top.document.querySelector(".layui-nav-item.layuimini-setting a").innerText + '.json';
            a.style = "display:none";
            document.body.appendChild(a);
            a.click();
            
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
        }

        unsafeWindow.hExportExcel = async() => {
            vant.showNotify({ type: 'danger', message: '暂未实现的功能' });
        }
    }

    async function jwglCourseBeautify() {
        unsafeWindow.courseBeautify = false;
        unsafeWindow.courseBeautifyProxy = new Proxy({ value: courseBeautify }, {
            set: function(target, property, value) {
                if (property === 'value') {
                target[property] = value;
                    // 通知父页面变量已更改
                    window.parent.postMessage({
                        type: 'COURSE_BEAUTIFY_CHANGED',
                        value: value
                    }, '*');
                }
                return true;
            }
        });

        jwglExportCourses();

        if (!GM_getValue('Jwgl.courseBeautify') || !document.querySelector("table")) {
            unsafeWindow.courseBeautify = true;
            unsafeWindow.courseBeautifyProxy.value = true;
            return;
        }

        function jwglClass(content_array, mode = -1) {
            if (mode == 0) {
                return `
                <div class="class_main" style="display:flex;flex-direction:column;align-items:center;margin-bottom:1em">
                    <div class="classroom">${content_array[3]}</div>
                    <div class="subject">${content_array[1]}</div>
                    <div class="teacher">${content_array[2]}<br>${content_array[0]}</div>
                </div>
            `;
            } else if (mode > 0) {
                return `
                <div class="class_main" style="display:flex;flex-direction:column;align-items:center;margin-bottom:1em">
                    <div class="teacher">${content_array[2]}<br>${content_array[0]}</div>
                </div>
            `;
            } else {
                return `
                <div class="class_main" style="display:flex;flex-direction:column;align-items:center;margin-bottom:1em">
                    <div class="classroom">${content_array[3]}</div>
                    <div class="subject">${content_array[0]}</div>
                    <div class="teacher">${content_array[2]}<br>${content_array[1]}</div>
                </div>
            `;
            }
        }

        GM_addStyle(`
            <style>
                .class_main > div {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin: 0;
                }
                .teacher {
                    font-size: 12px;
                    padding: 0;
                }
                .classroom {
                    font-size: 12px;
                    padding: 0;
                    /* color: #eff0ea; */
                }
                .subject {
                    font-size: 16px;
                    font-weight: bold;
                    padding: 0.5em 0;
                }
            </style>
        `);
        $("body").html($("body").html().replace(".noneprint{\n\tdisplay:none\n}    \n\n", ""))
        $("table.listTable#contentListFrame").addClass('optimized');
        $("table").css("margin-bottom", "3em");
        $("tr").attr("height", "auto");
        $("tr").css("min-height", "45px");
        $("td").css("padding-left", "0");
        $("td > div").each(function () {
            var div = $(this);
            //div.html(div.attr('title'));
            div.css("height", "auto");
            div.css("padding", "1em 0.5em 0");
            var content = div.attr('title');
            // content = content.split(/(?<!\d|\[|\]|\(|\))[ \n\r]+(?<!\d|\[|\]|\(|\))/);
            content = content.split(/\n|(?<!\n)\s{2,}?(?!\n)/);
            console.log(content);
            (content.length == 3) ? (content.splice(1, 0, "未定")) : (null);
            var content_array = [];
            for (let i = 0; i < content.length; i += 4) {
                content_array.push(content.slice(i, i + 4));
            }
            console.log(content_array);
            div.css("display", "flex");
            div.css("flex-direction", "column");
            div.css("justify-content", "center");
            div.css("align-items", "center");
            div.css("text-align", "center");
            div.html("");
            for (let i = 0; i < content_array.length; i++) {
                if (content_array.length > 1) {
                    if (i == 0 || content_array[i][1] == content_array[i - 1][1]) {
                        div.append(jwglClass(content_array[i], i));
                    } else {
                        if (content_array[i].length == 2 && /^[0-9\-\(\)\[\]单双周]*$/.test(content_array[i][0])) {
                            content_array[i].unshift(content_array[i-1][1]);
                            content_array[i].unshift(content_array[i-1][0]);
                        }
                        div.append('<div style="height:1px; background-color: grey;width: 90%;margin-bottom:1em"></div>')
                        div.append(jwglClass(content_array[i], 0));
                    }
                } else {
                    div.append(jwglClass(content_array[i]));
                }
            }
        });
        unsafeWindow.courseBeautify = true;
        unsafeWindow.courseBeautifyProxy.value = true;
    }

    async function webvpnCnkiHtml() {
        function getCurrentSelect() {
            let selectionObj = null, rangeObj = null;
            let selectedText = "", selectedHtml = "";
            // 处理兼容性
            if (window.getSelection) {
                // 现代浏览器
                // 获取text
                selectionObj = window.getSelection();
                selectedText = selectionObj.toString();
                //  获取html
                rangeObj = selectionObj.getRangeAt(0);
                var docFragment = rangeObj.cloneContents();
                var tempDiv = document.createElement("div");
                tempDiv.appendChild(docFragment);
                selectedHtml = tempDiv.innerHTML;
            } else if (document.selection) {
                // 非主流浏览器IE
                selectionObj = document.selection;
                rangeObj = selectionObj.createRange();
                selectedText = rangeObj.text;
                selectedHtml = rangeObj.htmlText;
            }
            return {
                text: selectedText,
                html: selectedHtml
            }
        }
        // 使标题可选中
        if (document.querySelector('h1.Chapter')) {
            document.querySelector('h1.Chapter').setAttribute('style', 'user-select:auto;');
        }
        MyConsole("复制已开启");
        createToast("success", `已开启复制，选中文字即可自动复制到粘贴板~`, 3);
        // 监听内容区域鼠标抬起事件
        document.addEventListener('mouseup', function () {
            var copy = getCurrentSelect();
            if (copy.text == "") {
                return;
            }
            // myConsole('onmouseup');
            MyConsole(getCurrentSelect());
            GM_setClipboard(getCurrentSelect().text);
        });
    }

    async function webvpnHSettings() {
        document.querySelector("body").innerHTML = ``;
        document.title = `脚本设置 - H`;

        // 添加Notification组件
        // 添加组件
        addToast();
        //createToast("success", "测试消息", 0);
        // 添加css样式
        GM_addStyle(ToastCss);
        GM_addStyle(GM_getResourceText("svg-logo").replace(/\.\.\/webfonts/g, "https://cdn.bootcdn.net/ajax/libs/font-awesome/6.2.1/webfonts"));
        //绑定Toast事件
        unsafeWindow.createToast = createToast;
        unsafeWindow.removeToast = removeToast;

        createToast("info", `请等待页面部署`, 0);
        createToast("error", `暂未实现的页面`, 0);
        createToast("info", `为您跳转到默认配置页面`, 0);
        CloseWin();

        CAT_userConfig()

        GM_addElement(document.querySelector('body'), 'div', { id: 'settings' });
        GM_addStyle(`

        `);
        const tools_template = `

        `
        const tools = Vue.createApp({
            template: tools_template,
            setup() {
                
                return {  };
            }
        });
        tools.use(vant);
        tools.mount("#tools");
    }

    async function webvpnHAbout() {
        document.querySelector("body").innerHTML = ``;
        document.title = `关于我们 - H`;

        // 添加Notification组件
        // 添加组件
        addToast();
        //createToast("success", "测试消息", 0);
        // 添加css样式
        GM_addStyle(ToastCss);
        GM_addStyle(GM_getResourceText("svg-logo").replace(/\.\.\/webfonts/g, "https://cdn.bootcdn.net/ajax/libs/font-awesome/6.2.1/webfonts"));
        //绑定Toast事件
        unsafeWindow.createToast = createToast;
        unsafeWindow.removeToast = removeToast;

        createToast("info", `请等待页面部署`, 0);
        createToast("error", `暂未实现的页面`, 0);

        GM_addElement(document.querySelector('body'), 'div', { id: 'settings' });
        GM_addStyle(`

        `);
        const tools_template = `

        `
        const tools = Vue.createApp({
            template: tools_template,
            setup() {
                
                return {  };
            }
        });
        tools.use(vant);
        tools.mount("#tools");
    }

    // 后面的代码会很乱，能跑的代码就先让它跑着吧（）
    async function webvpnHTools() {
        function searchTeachers(name, page = 1) {
            function xmlToJson(xml) {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xml, 'application/xml');
                const json = parseElement(xmlDoc.documentElement);
                // return JSON.stringify(json, null, 2);
                return json;
            }
                
            function parseElement(element) {
                let obj = {};
                if (element.nodeType === 1) { // Element
                    if (element.attributes.length > 0) {
                        obj['@attributes'] = {};
                        for (let j = 0; j < element.attributes.length; j++) {
                            let attribute = element.attributes.item(j);
                            obj['@attributes'][attribute.nodeName] = attribute.nodeValue;
                        }
                    }
                } else if (element.nodeType === 3) { // Text
                    obj = element.nodeValue;
                }
                
                if (element.hasChildNodes()) {
                    for (let i = 0; i < element.childNodes.length; i++) {
                        let item = element.childNodes.item(i);
                        let nodeName = item.nodeName;
                        if (typeof(obj[nodeName]) === 'undefined') {
                            obj[nodeName] = parseElement(item);
                        } else {
                            if (typeof(obj[nodeName].push) === 'undefined') {
                            let old = obj[nodeName];
                            obj[nodeName] = [];
                            obj[nodeName].push(old);
                            }
                            obj[nodeName].push(parseElement(item));
                        }
                    }
                }
                return obj;
            }

            return new Promise((resolve, reject) => {
                const data = `word=${name}&index=0&currentPage=${page}&sql=teacher&tea=1&srtp_teacher_project_num=4&planyear=null&planid=undefined&university_en_name=undefined`;

                const xhr = new XMLHttpRequest();
                xhr.withCredentials = true;

                xhr.addEventListener("readystatechange", function () {
                    if (this.readyState === this.DONE) {
                        if (this.status >= 200 && this.status < 300) {
                            const data = this.responseText;
                            const raw_result = xmlToJson(data);
                            // console.log(raw_result);
                            if (raw_result.page == undefined) {
                               resolve({success: false,msg: "webvpn登录已过期"}); 
                            }
                            // 构建最终的JSON对象
                            console.log(raw_result);
                            const pages = raw_result.page["#text"].match(/第(\d+)\/(\d+)页/);
                            const now_page = parseInt(pages[1]);
                            const all_page = parseInt(pages[2]);
                            if (all_page == 0) {
                               resolve({success: false,msg: "查询不到该教师"}); 
                            }
                            var result = {success: true, page: [now_page, all_page], data: []};
                            var name;
                            if (raw_result.val.length == undefined) {
                                    name = raw_result.word["#text"].replace(raw_result.val["#text"] + "-", "");
                                    result.data.push({name: name, number: raw_result.val["#text"], unit: raw_result.remind["#text"]});
                            } else {
                                for (let i = 0; i < raw_result.val.length; i++) {
                                    // if (result.data[i%3] == undefined) {
                                    //     result.data[i%3] = [];
                                    // }
                                    name = raw_result.word[i]["#text"].replace(raw_result.val[i]["#text"] + "-", "");
                                    result.data.push({name: name, number: raw_result.val[i]["#text"], unit: raw_result.remind[i]["#text"]});
                                }
                            }
                            resolve(result);
                        } else {
                            reject(new Error(`Request failed with status ${this.status}`));
                        }
                    }
                });

                xhr.addEventListener("error", function () {
                    reject(new Error("Network error"));
                });

                xhr.open("POST", "https://webvpn.nxu.edu.cn/http/77726476706e69737468656265737421a2a713d27560391e2f5ad1e2c90171/StuExpbook/AutoCompleteServletSrtp?vpn-12-o1-202.201.128.142=");
                xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
                
                try {
                    xhr.send(data);
                } catch (err) {
                    reject(err);
                }
            });
        }
        document.querySelector("body").innerHTML = ``;
        document.title = `小工具 - H`;

        // 添加Notification组件
        // 添加组件
        addToast();
        //createToast("success", "测试消息", 0);
        // 添加css样式
        GM_addStyle(ToastCss);
        GM_addStyle(GM_getResourceText("svg-logo").replace(/\.\.\/webfonts/g, "https://cdn.bootcdn.net/ajax/libs/font-awesome/6.2.1/webfonts"));
        //绑定Toast事件
        unsafeWindow.createToast = createToast;
        unsafeWindow.removeToast = removeToast;

        var toast = createToast("info", `请等待工具部署`, 0);
        
        unsafeWindow.searchTeachers = searchTeachers;

        GM_addElement(document.querySelector('body'), 'div', { id: 'tools' });
        GM_addStyle(`
            #main, #main * {
                box-sizing: border-box;
            }

            #main {
                width: calc(100% - 80px);
                height: calc(100% - 46px);
                position: absolute;
                top: 46px;
                left: 80px;
                padding-right: 20px;
                overflow: hidden;
            }

            #main > div {
                display: none;
                width: 100%;
                height: 100%;
                box-sizing: border-box;
            }

            #main > div.show {
                display: block;
            }

            #searchTeacher > .credits-bar {
                margin: 0;
                box-sizing: border-box;
                position: fixed;
                bottom: 20px;
                left: calc(50% + 64px);
                transform: translateX(-50%);
                background: rgba(255, 255, 255, 0.1);
                color: black;
                padding: 10px 25px;
                border-radius: 30px;
                font-size: 0.9rem;
                backdrop-filter: blur(8px);
                z-index: 1000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                animation: slideUp 0.6s ease-out;
                display: flex;
                align-items: center;
                white-space: nowrap;
                gap: 8px;
            }

            #searchTeacher .van-cell-group {
                padding-bottom:60px;
            }

            .schedule-manager {
                display: flex;
                flex-direction: column;
                height: 100%;
                overflow: hidden;
            }

                /* 顶部导航 */
            .top-nav {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 20px;
                background: white;
                border-bottom: 1px solid #e1e4e8;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            }

            .top-nav h2 {
                font-size: 20px;
                font-weight: 600;
                color: #2d3748;
            }

            .top-nav h2 span {
                font-size: 12px;
                font-weight: 500;
                color: #2d3748;
                margin-left: 1em;
            }

            .add-btn {
                background: #4a6bdf;
                color: white;
                border: none;
                border-radius: 6px;
                padding: 8px 12px;
                font-size: 14px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 5px;
                transition: background-color 0.2s;
            }

            .add-btn:hover {
                background: #3a5bc7;
            }

            /* 导出按钮样式 */
            .export-container {
                position: relative;
                margin-right: 15px;
            }

            .export-btn {
                background: #a0a0a0;
                color: white;
                border: none;
                border-radius: 6px;
                padding: 8px 12px;
                font-size: 14px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 5px;
                transition: background-color 0.2s;
                margin-right: 5px;
            }

            .export-btn:hover {
                background: #5b5b5b;
            }

            .export-dropdown {
                position: absolute;
                top: 100%;
                right: 0;
                background: white;
                border-radius: 6px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                padding: 8px 0;
                min-width: 120px;
                z-index: 100;
            }

            .export-dropdown div {
                padding: 8px 16px;
                cursor: pointer;
                transition: background-color 0.2s;
                color: #4a5568;
            }

            .export-dropdown div:hover {
                background-color: #f0f4ff;
                color: #4a6bdf;
            }

            /* 文件列表头部 */
            .file-list-header {
                padding: 15px 20px;
                background: white;
                border-bottom: 1px solid #e1e4e8;
            }

            .file-list-header h3 {
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 10px;
                color: #4a5568;
                margin-top: 0;
            }

            .files-display {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }

            .file-tag {
                background: #edf2f7;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 13px;
                display: flex;
                align-items: center;
                gap: 6px;
                color: #4a5568;
            }

            .tag-delete-btn {
                background: none;
                border: none;
                font-size: 14px;
                color: #718096;
                cursor: pointer;
                width: 16px;
                height: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
            }

            .tag-delete-btn:hover {
                color: #e53e3e;
                background: #fff5f5;
            }

            /* 主内容区 */
            .main-content {
                flex: 1;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }

            .schedule-container {
                flex: 1;
                padding: 20px;
                overflow: auto;
            }

            .schedule-table {
                width: 100%;
                border-collapse: collapse;
                background: white;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                table-layout: fixed;
            }

            .schedule-table th,
                .schedule-table td {
                padding: 12px;
                text-align: center;
                border: 1px solid #e1e4e8;
            }

            .schedule-table th {
                background-color: #f8f9ff;
                font-weight: 600;
                font-size: 14px;
                color: #4a5568;
            }

            .schedule-table th.time-header {
                background-color: #f0f4ff !important;
                width: 80px;
                font-weight: 600;
            }

            .period-cell {
                font-weight: 600;
                background-color: #f8f9ff;
                font-size: 14px;
            }

            .schedule-cell {
                vertical-align: top;
                min-height: 80px;
                padding: 8px;
            }

            .file-item-display {
                background: #ebf4ff;
                padding: 6px 8px;
                border-radius: 4px;
                margin-bottom: 4px;
                font-size: 13px;
                color: #2b6cb0;
                word-break: break-all;
            }

            .empty-cell {
                color: #a0aec0;
                font-size: 12px;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            /* 响应式调整 */
            @media (max-width: 768px) {
                .schedule-table {
                    font-size: 12px;
                }

                .schedule-table th,
                .schedule-table td {
                    padding: 6px;
            }
        `);
        const tools_template = `
            <van-nav-bar
                title="小工具 - H"
                left-text="返回"
                left-arrow
                @click-left="onClickLeft"
            />
            <van-sidebar v-model="active" @change="onChange" style="z-index:9999">
                <van-sidebar-item title="在职教师工号查询" />
                <van-sidebar-item title="Campus Charge" />
                <van-sidebar-item title="空课表生成" />
                <van-sidebar-item title="🚧等待⚠️施工" />
            </van-sidebar>
            <div id="main">
                <div id="searchTeacher" class="show" style="width: 100%;height:100%;padding:10px">
                    <form action="/">
                        <van-search
                            v-model="searchValue"
                            show-action
                            placeholder="请输入需要查询的教师姓名"
                            @search="onSearch"
                        >
                            <template #action>
                                <div @click="onSearchClick">搜索</div>
                            </template>
                        </van-search>
                    </form>
                    <div style="width:100%;display:flex;align-content:center;justify-content:center;overflow:auto;height:calc(100% - 54px);">
                        <div v-for="teachers in teacherList" style="width:33%">
                            <van-cell-group inset>
                                <van-cell v-for="teacher in teachers" :number="teacher.number" :title="teacher.name" :value="teacher.number" :label="teacher.unit" clickable @click="teacherClick"/>
                            </van-cell-group>
                        </div>
                    </div>
                    <div class="credits-bar">
                        <span>数据来源：</span>
                        <a href="https://cxcy.nxu.edu.cn/" target="_blank" rel="noopener">
                            宁夏大学创新创业学院
                        </a>
                        <span>宁夏大学创新创业服务平台</span>
                    </div>
                </div>
                <div>
                    <iframe src="//campus-charge.thisish.cn" style="width: 100%;height: 100%;border: none;"></iframe>
                </div>
                <div style="width: 100%;height:100%;padding:10px">
                    <div class="schedule-manager">
                        <!-- 顶部导航 -->
                        <div class="top-nav">
                            <h2>空课表生成<span>前往教务系统导出json文件后在此添加</span></h2>
                            <div style="display: flex; align-items: center;">
                                <div class="export-container">
                                <div class="export-btn" @click="toggleExportMenu">
                                    <span>导出</span>
                                    <div class="export-dropdown" v-if="showExportMenu">
                                    <div @click="exportToExcel">导出为Excel</div>
                                    <div @click="exportToImage">导出为图片</div>
                                    </div>
                                </div>
                                </div>
                                <button @click="triggerFileInput" class="add-btn">
                                <span>+</span> 添加人员
                                </button>
                            </div>
                        </div>

                        <!-- 主内容区 -->
                        <div class="main-content">

                            <div class="file-list-header" v-if="fileList.length > 0">
                                <h3>成员管理 ({{ fileList.length }})</h3>
                                <div class="files-display">
                                    <span v-for="file in fileList" :key="file.filename" class="file-tag">
                                        {{ file.name }}
                                        <button @click="removeFile(file.filename, $event)" class="tag-delete-btn">×</button>
                                    </span>
                                </div>
                            </div>

                            <div class="schedule-container">
                                <table class="schedule-table">
                                    <thead>
                                        <tr>
                                        <th class="time-header">/</th>
                                        <th v-for="day in daysOfWeek" :key="day">{{ day }}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(period, index) in classPeriods" :key="index">
                                            <td class="period-cell">{{ period }}</td>
                                            <td v-for="day in daysOfWeek" :key="day" class="schedule-cell">
                                                <div v-if="allFilesSchedule[day] && allFilesSchedule[day][index].length > 0">
                                                <div v-for="(item, i) in allFilesSchedule[day][index]" :key="i" class="file-item-display">
                                                    {{ item }}
                                                </div>
                                                </div>
                                                <div v-else class="empty-cell">
                                                - 无数据 -
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 style="width:100%;text-align:center">静候佳音...</h3>
                </div>
            </div>
        `
        const tools = Vue.createApp({
            template: tools_template,
            setup() {
                const active = Vue.ref(0);
                const onClickLeft = () => { CloseWin(); };
                const onChange = (index) => {
                    document.querySelector("div#main > div.show").classList.remove("show");
                    const tools_tab = document.querySelectorAll("div#main > div");
                    tools_tab[index].classList.add("show");
                };
                const searchValue = Vue.ref('');
                const teacherList = Vue.ref([]);
                const onSearch = (val) => {
                    searchTeacher(val);
                };
                const onSearchClick = () => {
                    searchTeacher(searchValue.value);
                };
                const searchTeacher = async(val) => {
                    // console.log(val)
                    // vant.showToast(val)
                    if (val.toLowerCase() == "moss") {
                        createToast("info", decodeURI("%E6%81%AD%E5%96%9C%E4%BD%A0%E5%8F%91%E7%8E%B0%E4%BA%86%E8%BF%99%E4%B8%AA%E5%B0%8F%E5%BD%A9%E8%9B%8B~"), 0);
                        open("//moss.thisish.cn");
                        return;   
                    }
                    teacherList.value = [];
                    var now_page = 1;
                    var all_page = 1;
                    var now_row = 0;
                    var row = 0;
                    while (now_page <= all_page) {
                        var list = await searchTeachers(val, now_page);
                        console.log(list)
                        if (!list.success) {
                            createToast("error", list.msg);
                            break;
                        }
                        for (let i = 0; i < list.data.length; i++) {
                            row = i%3 + now_row;
                            if (row >= 3) {
                                row -= 3;
                            }
                            if (teacherList.value[row] == undefined) {
                                teacherList.value[row] = [];
                            }
                            teacherList.value[row].push(list.data[i]);
                        }
                        now_row = row + 1;
                        if (now_row >= 3) {
                            now_row -= 3;
                        }
                        // if (list.data.length == 1) {
                        //     teacherList.value = [list.data];
                        // } else if (list.data.length == 2) {
                        //     teacherList.value = [[list.data[0]],[list.data[1]]];
                        // } else {
                        //     if (teacherList.value.length == 0) {
                        //         teacherList.value = [[],[],[]];
                        //     }

                        //     teacherList.value[0].push(...list.data[0]);
                        //     teacherList.value[1].push(...list.data[1]);
                        //     teacherList.value[2].push(...list.data[2]);
                        // }
                        console.log(JSON.stringify(teacherList.value))
                        now_page = list.page[0] + 1;
                        all_page = list.page[1];
                    }
                };
                const teacherClick = (event) => {
                    // console.log(event)
                    // console.log(event.target.closest('.van-cell'))
                    GM_setClipboard(event.target.closest('.van-cell').getAttribute("number"));
                    vant.showToast("工号已复制");
                }
                // 响应式数据
                const uploadedFiles = Vue.reactive({});
                const daysOfWeek = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
                const classPeriods = ['第一节', '第二节', '第三节', '第四节', '第五节', '第六节'];
                const showExportMenu = Vue.ref(false);

                // 计算属性
                const fileList = Vue.computed(() => Object.keys(uploadedFiles).map(filename => ({
                    filename,
                    name: filename.replace('.json', ''),
                    ...uploadedFiles[filename]
                })));

                // 计算属性：处理所有文件的课程表数据，生成用于显示的结构
                const allFilesSchedule = Vue.computed(() => {
                    // 创建结果结构：按天和时间段组织，记录每个单元格中的文件信息
                    const result = {};
                    daysOfWeek.forEach(cnDay => {
                        result[cnDay] = {};
                        classPeriods.forEach((period, periodIndex) => {
                            result[cnDay][periodIndex] = [];
                        });
                    });

                    // 处理每个上传的文件
                    Object.keys(uploadedFiles).forEach(filename => {
                        const fileContent = uploadedFiles[filename]?.content || {};
                        const schedule = fileContent.schedule || {};
                        const meta = fileContent.meta || {};
                        const totalWeeks = meta.total_weeks || 16;
                        const weekDays = meta.week_days || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                        const fileNameWithoutExt = filename.replace('.json', '');

                        // 遍历每一天
                        daysOfWeek.forEach((cnDay, index) => {
                            const enDay = weekDays[index];
                            const daySchedule = schedule[enDay] || {};

                            // 遍历每一节课
                            classPeriods.forEach((period, periodIndex) => {
                                const periodKey = periodIndex + 1;
                                const classInfo = daySchedule[periodKey] || {};
                                    // 检查是否有课程
                                    if (Object.keys(classInfo).length > 0) {
                                    // 有课程的情况：合并同一时间段内所有课程所有老师的week信息
                                    const allHasClassWeeks = new Set();
                                    
                                    // 遍历同一时间段内的所有课程
                                    Object.values(classInfo).forEach(courseDetails => {
                                        // 遍历每个课程的所有老师信息
                                        courseDetails.forEach(detail => {
                                            (detail.week || []).forEach(week => allHasClassWeeks.add(week));
                                        });
                                    });

                                    // 找出没有课程的周数
                                    const noClassWeeks = [];
                                    for (let week = 1; week <= totalWeeks; week++) {
                                        if (!allHasClassWeeks.has(week)) {
                                            noClassWeeks.push(week);
                                        }
                                    }

                                    // 如果有没课的周数，记录下来
                                    if (noClassWeeks.length > 0) {
                                        result[cnDay][periodIndex].push(`${fileNameWithoutExt}(${noClassWeeks.join(',')})`);
                                    }
                                    // 所有周都有课的情况下，不记录
                                } else {
                                    // 没有课程的情况：记录文件名
                                    result[cnDay][periodIndex].push(fileNameWithoutExt);
                                }
                            });
                        });
                    });
                    console.log(result);
                    return result;
                });

                // 方法
                const triggerFileInput = () => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.json';
                    input.multiple = true;
                    input.onchange = handleFileSelect;
                    input.click();
                };

                const handleFileSelect = (event) => {
                    const files = event.target.files;
                    if (!files?.length) return;

                    Array.from(files).forEach(file => {
                        if (!file.name.toLowerCase().endsWith('.json')) {
                            createToast("error", '请只上传JSON文件', 3);
                            return;
                        }

                        readFile(file);
                    });
                };

                const readFile = (file) => {
                    const reader = new FileReader();

                    reader.onload = (e) => {
                        try {
                            const jsonContent = JSON.parse(e.target.result);

                            // 验证是否为课表JSON文件
                            if (!(jsonContent && typeof jsonContent === 'object' && 'meta' in jsonContent && 'schedule' in jsonContent)) {
                                createToast("warning", `文件 "${file.name}" 不是有效的课表JSON文件`, 3);
                                return;
                            }

                            // 存储文件信息
                            uploadedFiles[file.name] = {
                                content: jsonContent,
                                size: file.size,
                                type: file.type,
                                lastModified: file.lastModified
                            };

                            console.log(`文件 "${file.name}" 已成功读取`);
                        } catch (error) {
                            console.error(`解析JSON文件 "${file.name}" 时发生错误:`, error);
                            createToast("error", `文件 "${file.name}" 格式错误`, 3);
                        }
                    };

                    reader.onerror = () => {
                        console.error(`读取文件 "${file.name}" 时发生错误`);
                        createToast("error", `无法读取文件: ${file.name}`, 3);
                    };

                    reader.readAsText(file);
                };

                const removeFile = (filename, event) => {
                    event.stopPropagation();
                    delete uploadedFiles[filename];
                };

                // 导出相关方法
                const toggleExportMenu = () => {
                    showExportMenu.value = !showExportMenu.value;
                };

                // 点击外部关闭下拉菜单
                let exportBtn, exportDropdown;
                const handleClickOutside = (e) => {
                    if (!exportBtn) exportBtn = document.querySelector('.export-btn');
                    if (!exportDropdown) exportDropdown = document.querySelector('.export-dropdown');

                    if (showExportMenu.value &&
                        !exportBtn.contains(e.target) &&
                        !exportDropdown?.contains(e.target)) {
                        showExportMenu.value = false;
                    }
                };

                // 注册事件监听器
                document.addEventListener('click', handleClickOutside);

                // 组件卸载时移除事件监听器
                Vue.onUnmounted(() => {
                    document.removeEventListener('click', handleClickOutside);
                    // 清理引用
                    exportBtn = null;
                    exportDropdown = null;
                });

                const exportToExcel = () => {
                    if (!fileList.value.length) {
                        createToast("error", '请先上传文件', 3);
                        return;
                    }

                    // 创建工作表数据
                    const wsData = [['时间/星期', ...daysOfWeek]];

                    classPeriods.forEach((period, periodIndex) => {
                        const row = [period];
                        daysOfWeek.forEach(day => {
                            const cellData = allFilesSchedule.value[day]?.[periodIndex]
                                ? allFilesSchedule.value[day][periodIndex].join('\n')
                                : '- 无数据 -';
                            row.push(cellData);
                        });
                        wsData.push(row);
                    });

                    // 创建工作簿和工作表
                    const wb = XLSX.utils.book_new();
                    const ws = XLSX.utils.aoa_to_sheet(wsData);

                    // 设置列宽
                    const wscols = [{ wch: 10 }];
                    daysOfWeek.forEach(() => wscols.push({ wch: 20 }));
                    ws['!cols'] = wscols;

                    // 设置单元格样式 - 允许自动换行
                    const wrapTextStyle = {
                        alignment: {
                            wrapText: true,
                            vertical: 'top'
                        }
                    };

                    // 为所有数据单元格应用样式
                    Object.keys(ws).forEach(key => {
                        // 跳过!开头的特殊属性
                        if (!key.startsWith('!')) {
                            ws[key].s = wrapTextStyle;
                        }
                    })

                    // 将工作表添加到工作簿
                    XLSX.utils.book_append_sheet(wb, ws, '空课表');

                    // 导出Excel文件
                    XLSX.writeFile(wb, '空课表.xlsx');

                    // 关闭下拉菜单
                    showExportMenu.value = false;
                };

                const exportToImage = () => {
                    if (!fileList.value.length) {
                        createToast("error", '请先上传文件', 3);
                        return;
                    }

                    Vue.nextTick(async () => {
                        try {
                            const tableElement = document.querySelector('.schedule-table');
                            await snapdom.download(tableElement, {
                                format: 'png',
                                filename: "空课表",
                                scale: 2.5,
                                quality: 1
                            });
                        } catch (error) {
                            console.error('导出图片失败:', error);
                            createToast("error", '导出图片失败，请重试', 3);
                        }
                    });

                    // 关闭下拉菜单
                    showExportMenu.value = false;
                };

                return { 
                    active,
                    onClickLeft,
                    onChange,
                    searchValue,
                    onSearch,
                    onSearchClick,
                    teacherList,
                    teacherClick,
                    fileList,
                    toggleExportMenu,
                    classPeriods,
                    daysOfWeek,
                    triggerFileInput,
                    showExportMenu,
                    allFilesSchedule,
                    exportToExcel,
                    exportToImage,
                    removeFile
                };
            }
        });
        tools.use(vant);
        tools.mount("#tools");

        removeToast(toast);
        createToast("success", `小工具部署完毕`, 2);
        
    }


    async function errorHtml() {
        if (!GM_getValue('WebVPN.autoClose')) {
            return;
        }
        CloseWin();
    }

    //     if (!GM_getValue("TuanWei.autoDownload", false)) {
    //     return;
    // }
    // createToast("info", `自动下载...`);
    // var verification = await GetVerificationCode("TuanWei");
    // MyConsole(verification);
    // // document.querySelector("input#codeValue").value = 1234;
    // // document.querySelector("input[type=button]").click();
    // // if (!GM_getValue("TuanWei.autoDownloadClose", false)) {
    // //     return;
    // // }
    // // createToast("info", `5秒后自动关闭...`);
    // // await WaitTime(5000);
    // // CloseWin();

    async function jwglGrade() {
        MyConsole(window.parent.document.readyState);
    }
})();