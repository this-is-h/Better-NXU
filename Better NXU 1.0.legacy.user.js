// ==UserScript==
// @name         Better NXU
// @namespace    https://thisish.com/
// @version      2.0.0
// @description  这是一个提高各种 NXU 网站体验的用户脚本（Userscript）
// @author       H
// @run-at       document-idle
// @storageName  h.nxu
// @match        *://webvpn.nxu.edu.cn/*
// @match        *://sslvpn.nxu.edu.cn/*
// @match        *://jsfzyjxzlxt.nxu.edu.cn/*
// @match        *://jwgl.nxu.edu.cn/*
// @match        *://portal.nxu.edu.cn/*
// @match        *://sysaq.nxu.edu.cn/*
// @match        *://202.201.128.234/*
// @match        *://tuanwei.nxu.edu.cn/*
// @match        *://ids.nxu.edu.cn/*
// @match        *://open.weixin.qq.com/*
// @grant        GM_info
// @grant        CAT_userConfig
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addElement
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        window.close
// @require      https://scriptcat.org/lib/1405/1.0.7/h.notification.js#sha384-Ef8dnXffgAqEVHA7uHKmtub7Uh4Ji/Yv60yL+Himym+PdTNeb/NAKi+d9qh9olzC
// @require      https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/vue/3.5.22/vue.global.min.js#sha384-qCjGjR+q4j3L6F1d3hI/Tqq5Ry6XGIiJMUdZC+VawNbSWD2eP2RR+laa6A3euDAZ
// @require      https://unpkg.com/@zumer/snapdom@2.16.0/dist/snapdom.js#sha384-XHEQh68myKc3CIe4DhnbAY1QEVszoaGTPQRzEM6JIKCWRg3mnUG3fAt3+UuxqEYE
// @require      https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js#sha384-EnyY0/GSHQGSxSgMwaIPzSESbqoOLSexfnSMN2AP+39Ckmn92stwABZynq1JyzdT
// @resource     svg-logo https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/font-awesome/6.2.1/css/all.min.css#sha384-twcuYPV86B3vvpwNhWJuaLdUSLF9+ttgM2A6M870UYXrOsxKfER2MKox5cirApyA
// @resource     tesseract-js https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/tesseract.js/6.0.1/tesseract.min.js#sha384-r1ru3tcf6FhnCFR4B7pIFG+BhFF9LlFtz/P1y4pblWn3AGs9y3lBx5SKLNf4+rED
// @resource     vant-css https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/vant/4.9.21/index.min.css#sha384-Jb7yH4uJOgDFef++Dmtf9JGETGSXgz9+wrg/jQ7XsqYtJzSClY4imewu/quoIrel
// @resource     vue-js https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/vue/3.5.22/vue.global.min.js#sha384-qCjGjR+q4j3L6F1d3hI/Tqq5Ry6XGIiJMUdZC+VawNbSWD2eP2RR+laa6A3euDAZ
// @resource     vant-js https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/vant/4.9.21/vant.min.js#sha384-tg/s2Kn1Qk+Eh9qunzeS6/nRqv80Tf7NL/0zJTQm/zODh+USIB36cke1jVxQ+X2X
// @resource     github-markdown-css https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/github-markdown-css/5.8.1/github-markdown.min.css#sha384-bKf/D9oOhMXM113OMRKT6sKFRT4jT3AulvzsGu563IJ5zmaH5LSA26VfwRJQ8GAR
// @resource     marked-js https://unpkg.com/marked@18.0.6/lib/marked.umd.js#sha384-uGn1eBC40GtuBgao0epc/cz9O4Lo8/flg/10SW+69UjLI5nP31iT4UPc65Xz10Le
// @resource     about-md https://raw.giteeusercontent.com/thisish/Better-NXU/raw/main/README.md
// @resource     update-md https://raw.giteeusercontent.com/thisish/Better-NXU/raw/main/CHANGELOG.md
// @connect      webvpn.nxu.edu.cn
// @connect      portal.nxu.edu.cn
// @connect      v1.hitokoto.cn
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
        default: ['教务管理','学工系统','信息门户','中国知网', '万方数据','大先生']
        values: ['教务管理','学工系统','信息门户','中国知网', '万方数据','大先生']
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

(async function () {
    'use strict';

    // ==Basic==
    // 添加 Vue 和 Vant 组件到页面
    let notificationReady = false;
    let vantReady = false;

    function AddVant() {
        if (vantReady) return unsafeWindow.vant;
        unsafeWindow.Vue = Vue;
        GM_addStyle(GM_getResourceText("vant-css"));
        unsafeWindow.eval(GM_getResourceText("vant-js"));
        unsafeWindow.vant = vant;
        vantReady = true;
        return unsafeWindow.vant;
    }

    function AddTesseract() {
        if (typeof unsafeWindow.Tesseract?.createWorker === "function") {
            return unsafeWindow.Tesseract;
        }
        const source = GM_getResourceText("tesseract-js");
        if (!source) {
            throw scheduleOperationError("OCR_ENGINE_UNAVAILABLE", "验证码识别组件资源不可用");
        }
        unsafeWindow.eval(source);
        if (typeof unsafeWindow.Tesseract?.createWorker !== "function") {
            throw scheduleOperationError("OCR_ENGINE_UNAVAILABLE", "验证码识别组件加载失败");
        }
        return unsafeWindow.Tesseract;
    }

    function AddNotification() {
        if (notificationReady) return;
        // 添加组件
        addToast();
        // 添加css样式
        GM_addStyle(ToastCss);
        GM_addStyle(GM_getResourceText("svg-logo").replace(/\.\.\/webfonts/g, "https://cdn.bootcdn.net/ajax/libs/font-awesome/6.2.1/webfonts"));
        //绑定Toast事件
        unsafeWindow.createToast = createToast;
        unsafeWindow.removeToast = removeToast;
        notificationReady = true;
    }

    function Basic(options = {}) {
        // 添加Notification组件
        AddNotification()
        // 绑定事件
        unsafeWindow.CAT_userConfig = CAT_userConfig;
        if (options.vant !== false) {
            AddVant();
        }
    }

    function openTab(tab) {
        if (tab == "settings") {
            GM_openInTab("https://sslvpn.nxu.edu.cn/h/settings")
        } else if (tab == "about") {
            GM_openInTab("https://sslvpn.nxu.edu.cn/h/about")
        }
    }
    unsafeWindow.betterNXUOpenTab = openTab
    // /==Basic==

    const GM_VALUE_DEFAULTS = Object.freeze({
        "WebVPN.username": undefined,
        "WebVPN.password": undefined,
        "WebVPN.autoLogin": false,
        "WebVPN.autoReLogin": false,
        "WebVPN.autoClose": false,
        "WebVPN.courseGrab": true,
        "WebVPN.customTool": true,
        "WebVPN.customCard": ["教务管理", "学工系统", "信息门户", "中国知网", "万方数据", "大先生"],
        "WebVPN.qualityJson": [],
        "WebVPN.searchClose": true,
        "Jwgl.username": undefined,
        "Jwgl.password": undefined,
        "Jwgl.autoLogin": false,
        "Jwgl.courseBeautify": true,
        "Jwgl.customMenu": ["全部学期成绩"],
        "TuanWei.autoDownload": false,
        "TuanWei.autoDownloadClose": false,
        "firstSet": 0,
        "configVersion": 0,
        "icsId": undefined,
        "Schedule.encryptionKeyPair": undefined
    });

    const SETTINGS_RESET_KEYS = Object.freeze([
        "WebVPN.autoLogin",
        "WebVPN.autoReLogin",
        "WebVPN.autoClose",
        "WebVPN.courseGrab",
        "WebVPN.customTool",
        "WebVPN.customCard",
        "WebVPN.qualityJson",
        "WebVPN.searchClose",
        "Jwgl.autoLogin",
        "Jwgl.courseBeautify",
        "Jwgl.customMenu",
        "TuanWei.autoDownload",
        "TuanWei.autoDownloadClose"
    ]);

    function cloneGMValue(value) {
        if (value === null || typeof value !== "object") return value;
        return JSON.parse(JSON.stringify(value));
    }

    function hasLoginCredentials(username, password) {
        return String(username ?? "").trim() !== "" && String(password ?? "").trim() !== "";
    }

    function getResettableSettingDefaults() {
        return Object.fromEntries(SETTINGS_RESET_KEYS.map(name => [
            name,
            cloneGMValue(GM_VALUE_DEFAULTS[name])
        ]));
    }

    function resetFunctionSettingValues() {
        const defaults = getResettableSettingDefaults();
        return Promise.all(Object.entries(defaults).map(([name, value]) => GM_setValue(name, value)))
            .then(() => defaults);
    }

    function getAllSettingDefaults() {
        const defaults = Object.fromEntries(Object.entries(GM_VALUE_DEFAULTS).map(([name, value]) => [
            name,
            cloneGMValue(value)
        ]));
        ["WebVPN", "Jwgl"].forEach(group => {
            if (!hasLoginCredentials(defaults[`${group}.username`], defaults[`${group}.password`])) {
                defaults[`${group}.autoLogin`] = false;
            }
        });
        return defaults;
    }

    function resetAllSettingValues() {
        const defaults = getAllSettingDefaults();
        return Promise.all(Object.entries(defaults).map(([name, value]) => GM_setValue(name, value)))
            .then(() => defaults);
    }

    function getGMValue(name) {
        if (!Object.prototype.hasOwnProperty.call(GM_VALUE_DEFAULTS, name)) {
            throw new Error(`未注册的 GM 存储键：${name}`);
        }
        const storedValue = GM_getValue(name);
        if (storedValue !== undefined) return storedValue;
        const defaultValue = cloneGMValue(GM_VALUE_DEFAULTS[name]);
        GM_setValue(name, defaultValue);
        return cloneGMValue(defaultValue);
    }

    function normalizeConfigVersion(value) {
        if (typeof value !== "number" && typeof value !== "string") return 0;
        const version = Number(value);
        return Number.isSafeInteger(version) && version >= 0 ? version : 0;
    }

    // ==Constant==
    const Info = GM_info;
    const Url = window.location.href;
    const Host = window.location.host;
    const Origin = window.location.origin;
    const Path = window.location.pathname;
    // tesseract 提示消息
    const LoadMessage = { "loading tesseract core": "OCR核心加载", "initializing tesseract": "OCR初始化", "loading language traineddata": "加载OCR语言训练数据", "initializing api": "初始化OCR接口", "recognizing text": "识别验证码" };
    const Version = Info.script.version;
    // 每次 UserConfig 新增或调整项目时递增，用于提示用户查看配置页面。
    const ConfigVersion = 6;
    const WEBVPN_HOST = "webvpn.nxu.edu.cn";
    const WEBVPN_BASE = `https://${WEBVPN_HOST}`;
    const WEBVPN_HOST_TOKENS = Object.freeze({
        "ids.nxu.edu.cn": "77726476706e69737468656265737421f9f352d229287d1e7b0c9ce29b5b",
        "jwgl.nxu.edu.cn": "77726476706e69737468656265737421fae04690693e7045300d8db9d6562d",
        "202.201.128.234": "77726476706e69737468656265737421a2a713d27560391e2f5ad1e2ca0677",
        "xsfw.nxu.edu.cn": "77726476706e69737468656265737421e8e4478b693e7045300d8db9d6562d",
        "eip.nxu.edu.cn": "77726476706e69737468656265737421f5fe51d229287d1e7b0c9ce29b5b",
        "www.cnki.net": "77726476706e69737468656265737421e7e056d2243e635930068cb8",
        "kns.cnki.net": "77726476706e69737468656265737421fbf952d2243e635930068cb8",
        "www.wanfangdata.com.cn": "77726476706e69737468656265737421e7e056d2303166567f068ea89941227bfcd3ca21bd0c",
        "f.wanfangdata.com.cn": "77726476706e69737468656265737421f6b9569d2936695e790c88b8991b203a6ed9f11f",
        "open.weixin.qq.com": "77726476706e69737468656265737421ffe7449269276d59660187e289446d36a8d6",
        "portal.nxu.edu.cn": "77726476706e69737468656265737421e0f85388263c265e661dc7a99c406d36de",
        "sysaq.nxu.edu.cn": "77726476706e69737468656265737421e3ee529d367e66486b468ca88d1b203b"
    });
    const WEBVPN_TOKEN_HOSTS = Object.freeze(Object.fromEntries(
        Object.entries(WEBVPN_HOST_TOKENS).map(([host, token]) => [token, host])
    ));

    function parseWebVpnContext(input) {
        const href = typeof input === "string" ? input : input?.href;
        let parsed;
        try {
            parsed = new URL(href);
        } catch (error) {
            return null;
        }
        const outerHost = parsed.hostname.toLowerCase().replace(/\.$/, "");
        const directContext = {
            viaVpn: false,
            outerHost,
            scheme: parsed.protocol.replace(":", ""),
            port: parsed.port,
            token: null,
            realHost: outerHost,
            realPath: parsed.pathname,
            search: parsed.search,
            hash: parsed.hash,
            url: parsed.href
        };
        if (outerHost !== WEBVPN_HOST) return directContext;
        const match = parsed.pathname.match(/^\/(https?)(?:-(\d+))?\/([0-9a-f]{40,})(\/.*)?$/i);
        if (!match) return directContext;
        const token = match[3].toLowerCase();
        return {
            ...directContext,
            viaVpn: true,
            scheme: match[1].toLowerCase(),
            port: match[2] || "",
            token,
            realHost: WEBVPN_TOKEN_HOSTS[token] || null,
            realPath: match[4] || "/"
        };
    }

    function buildWebVpnUrl(input, options) {
        options = options || {};
        const href = typeof input === "string" ? input : input?.href;
        let parsed;
        try {
            parsed = new URL(href);
        } catch (error) {
            return null;
        }
        const scheme = parsed.protocol.replace(":", "").toLowerCase();
        const host = parsed.hostname.toLowerCase().replace(/\.$/, "");
        if (!["http", "https"].includes(scheme) || parsed.username || parsed.password || host === WEBVPN_HOST) {
            return null;
        }
        const token = WEBVPN_HOST_TOKENS[host];
        if (!token) return null;
        const port = parsed.port || (scheme === "https" && options.forceHttps443 ? "443" : "");
        const routeType = port ? `${scheme}-${port}` : scheme;
        return `${WEBVPN_BASE}/${routeType}/${token}${parsed.pathname}${parsed.search}${parsed.hash}`;
    }

    function isWebVpnRealHost(context, host) {
        return Boolean(context?.viaVpn && context.realHost === host);
    }
    // 教务课表字段过滤管线；新增规则时按顺序追加即可。
    const JWGL_COURSE_TEXT_FILTERS = [
        (text) => text.replace(/,{2,}/g, ""),
    ];
    const CourseScheduleTools = (() => {
        const schemaVersion = "2.0";
        const timezone = "Asia/Shanghai";
        const timezoneOffset = "+08:00";
        const periodTimes = [
            { period: 1, start: "08:10", end: "08:55" },
            { period: 2, start: "09:00", end: "09:45" },
            { period: 3, start: "10:15", end: "11:00" },
            { period: 4, start: "11:05", end: "11:50" },
            { period: 5, start: "14:00", end: "14:45" },
            { period: 6, start: "14:50", end: "15:35" },
            { period: 7, start: "15:55", end: "16:40" },
            { period: 8, start: "16:45", end: "17:30" },
            { period: 9, start: "19:00", end: "19:45" },
            { period: 10, start: "19:50", end: "20:35" }
        ];

        function requestText(url) {
            return new Promise((resolve, reject) => {
                const startedAt = Date.now();
                MyConsole("[课表请求] 开始获取 ICS 数据");
                GM_xmlhttpRequest({
                    method: "GET",
                    url,
                    responseType: "text",
                    timeout: 20000,
                    onload(response) {
                        if (response.status < 200 || response.status >= 300) {
                            MyConsole("[课表请求] ICS 接口返回异常状态", {
                                status: response.status,
                                durationMs: Date.now() - startedAt
                            }, "error");
                            reject(new Error(`课表请求失败：HTTP ${response.status}`));
                            return;
                        }
                        const responseText = response.responseText || response.response || "";
                        MyConsole("[课表请求] ICS 数据获取完成", {
                            status: response.status,
                            durationMs: Date.now() - startedAt,
                            bytes: String(responseText).length
                        }, "info");
                        resolve(responseText);
                    },
                    ontimeout() {
                        MyConsole("[课表请求] ICS 请求超时", {
                            timeoutMs: 20000,
                            durationMs: Date.now() - startedAt
                        }, "warn");
                        reject(new Error("课表请求超时，请稍后重试"));
                    },
                    onerror() {
                        MyConsole("[课表请求] ICS 请求发生网络错误", {
                            durationMs: Date.now() - startedAt
                        }, "error");
                        reject(new Error("课表请求失败，请检查网络或登录状态"));
                    }
                });
            });
        }

        async function fetchFromUrl(url, options = {}) {
            const icsText = await requestText(url);
            return parseIcs(icsText, {
                ...options,
                sourceType: "ics",
                sourceUrl: url,
                sourceInput: url
            });
        }

        function parseIcs(icsText, options = {}) {
            const parsed = parseIcsText(icsText);
            const calendarTimezone = parsed.calendar["X-WR-TIMEZONE"]?.[0]?.value || findTimezone(parsed) || timezone;
            const rawLessons = uniqueBy(
                parsed.events
                    .map((event, index) => eventToLesson(event, { index, timezone: calendarTimezone }))
                    .filter(Boolean)
                    .sort(compareRawLesson),
                item => item.id
            );
            if (rawLessons.length === 0) {
                throw new Error("ICS 课表中没有可识别的课程");
            }
            const termStartDate = options.termStartDate || getTermStartMonday(rawLessons);
            const merged = mergeLessonsToCourses(rawLessons, termStartDate);
            const scheduleMap = buildScheduleMap(merged.courses);
            const lessons = buildLessonRecords(rawLessons, merged.lessonLinks, scheduleMap);
            const result = {
                schemaVersion,
                sourceUrl: options.sourceUrl || "",
                source: {
                    type: options.sourceType || "text",
                    input: options.sourceInput || options.sourceUrl || ""
                },
                owner: normalizeOwner(options.owner),
                meta: {
                    calendarName: parsed.calendar["X-WR-CALNAME"]?.[0]?.value || "课表",
                    calendarDescription: parsed.calendar["X-WR-CALDESC"]?.[0]?.value || "",
                    timezone: calendarTimezone,
                    timezoneOffset,
                    termStartDate,
                    weekRange: getWeekRange(lessons),
                    dateRange: getDateRange(rawLessons),
                    totalRawLessons: rawLessons.length,
                    totalLessons: lessons.length,
                    totalCourses: merged.courses.length,
                    totalSchedules: merged.courses.reduce((sum, course) => sum + course.schedules.length, 0)
                },
                courses: merged.courses,
                lessons,
                byDate: buildByDate(lessons),
                busySlots: buildBusySlots(lessons)
            };
            return normalize(result);
        }

        function parseIcsText(icsText) {
            const text = String(icsText || "");
            if (!/BEGIN:VCALENDAR/i.test(text)) {
                throw new Error("返回内容不是有效的 ICS 日历");
            }
            const calendar = {};
            const events = [];
            const stack = [];
            let currentEvent = null;
            const lines = text
                .replace(/\r\n[ \t]/g, "")
                .replace(/\n[ \t]/g, "")
                .replace(/\r[ \t]/g, "")
                .split(/\r\n|\n|\r/);
            for (const line of lines) {
                if (!line.trim()) continue;
                const prop = parseIcsProperty(line);
                if (!prop) continue;
                if (prop.name === "BEGIN") {
                    stack.push(prop.value);
                    if (prop.value === "VEVENT") currentEvent = {};
                    continue;
                }
                if (prop.name === "END") {
                    if (prop.value === "VEVENT" && currentEvent) {
                        events.push(currentEvent);
                        currentEvent = null;
                    }
                    stack.pop();
                    continue;
                }
                const component = stack[stack.length - 1];
                if (currentEvent && component === "VEVENT") addProperty(currentEvent, prop);
                else if (!currentEvent && component === "VCALENDAR") addProperty(calendar, prop);
            }
            return { calendar, events };
        }

        function parseIcsProperty(line) {
            const colonIndex = findUnquoted(line, ":");
            if (colonIndex < 0) return null;
            const left = line.slice(0, colonIndex);
            const [rawName, ...paramParts] = splitUnquoted(left, ";");
            const params = {};
            paramParts.forEach(part => {
                const index = part.indexOf("=");
                if (index < 0) return;
                params[part.slice(0, index).toUpperCase()] = part.slice(index + 1).replace(/^"|"$/g, "");
            });
            return {
                name: rawName.toUpperCase(),
                params,
                value: unescapeIcsText(line.slice(colonIndex + 1))
            };
        }

        function findUnquoted(text, target) {
            let quoted = false;
            for (let index = 0; index < text.length; index++) {
                if (text[index] === '"') quoted = !quoted;
                if (text[index] === target && !quoted) return index;
            }
            return -1;
        }

        function splitUnquoted(text, delimiter) {
            const values = [];
            let quoted = false;
            let start = 0;
            for (let index = 0; index < text.length; index++) {
                if (text[index] === '"') quoted = !quoted;
                if (text[index] === delimiter && !quoted) {
                    values.push(text.slice(start, index));
                    start = index + 1;
                }
            }
            values.push(text.slice(start));
            return values;
        }

        function addProperty(target, prop) {
            if (!target[prop.name]) target[prop.name] = [];
            target[prop.name].push(prop);
        }

        function unescapeIcsText(text) {
            return String(text)
                .replace(/\\\\/g, "\\")
                .replace(/\\n/gi, "\n")
                .replace(/\\,/g, ",")
                .replace(/\\;/g, ";");
        }

        function eventToLesson(event, context) {
            const startProp = event.DTSTART?.[0];
            const endProp = event.DTEND?.[0];
            if (!startProp || !endProp) return null;
            const summary = getFirst(event, "SUMMARY");
            const description = getFirst(event, "DESCRIPTION");
            const location = getFirst(event, "LOCATION");
            const eventTimezone = startProp.params?.TZID || endProp.params?.TZID || context.timezone;
            const start = parseIcsDateTime(startProp.value, eventTimezone);
            const end = parseIcsDateTime(endProp.value, eventTimezone);
            const detail = parseCourseDescription(description, {
                summary,
                location,
                startTime: start.time,
                endTime: end.time
            });
            if (!detail.name || !start.date) return null;
            const uid = getFirst(event, "UID") || `event-${context.index + 1}`;
            return {
                id: stableId([uid, start.dateTimeLocal, end.dateTimeLocal, detail.name, detail.teacherText, detail.room].join("|")),
                name: detail.name,
                teachers: detail.teachers,
                teacherText: detail.teacherText,
                groups: detail.groups,
                date: start.date,
                weekday: start.weekday,
                weekdayText: start.weekdayText,
                start,
                end,
                startTime: detail.startTime || start.time,
                endTime: detail.endTime || end.time,
                periodText: detail.periodText,
                periods: detail.periods.length ? detail.periods : periodsFromTimes(start.time, end.time),
                campusOrBuilding: detail.campusOrBuilding,
                room: detail.room || location,
                location
            };
        }

        function parseCourseDescription(description, fallback) {
            const parts = String(description || "").split("/").map(normalizeText);
            if (parts.length >= 7) {
                const middle = splitGroupsAndTeachers(parts.slice(4, -2));
                return {
                    startTime: parts[0],
                    endTime: parts[1],
                    periodText: parts[2],
                    periods: parsePeriodText(parts[2]),
                    name: parts[3] || fallback.summary,
                    groups: middle.groups,
                    teachers: middle.teachers,
                    teacherText: middle.teacherText,
                    campusOrBuilding: parts[parts.length - 2],
                    room: parts[parts.length - 1] || fallback.location
                };
            }
            return {
                startTime: fallback.startTime,
                endTime: fallback.endTime,
                periodText: "",
                periods: periodsFromTimes(fallback.startTime, fallback.endTime),
                name: fallback.summary,
                groups: [],
                teachers: [],
                teacherText: "",
                campusOrBuilding: "",
                room: fallback.location
            };
        }

        function splitGroupsAndTeachers(values) {
            const items = values.map(normalizeText).filter(Boolean);
            let teacherIndex = items.length;
            for (let index = items.length - 1; index >= 0; index--) {
                if (isLikelyTeacherText(items[index])) teacherIndex = index;
                else break;
            }
            if (teacherIndex === items.length && items.length >= 2) teacherIndex = items.length - 1;
            const teachers = splitTeacherNames(items.slice(teacherIndex).join("、"));
            return {
                groups: items.slice(0, teacherIndex),
                teachers,
                teacherText: teachers.join("、")
            };
        }

        function isLikelyTeacherText(value) {
            const names = splitTeacherNames(value);
            return names.length > 0 && names.every(name => {
                const text = normalizeText(name);
                return text.length >= 2 && text.length <= 8 &&
                    /^[\u3400-\u9fff·•A-Za-z.' -]+$/.test(text) &&
                    !/[班组级课馆楼室院系专业方向文凭工程师实验实训中心]/.test(text);
            });
        }

        function splitTeacherNames(text) {
            return uniqueInOrder(String(text || "")
                .split(/\s*(?:、|,|，|;|；|&|和|与)\s*/)
                .map(normalizeText)
                .filter(name => name && name !== "等"));
        }

        function parsePeriodText(text) {
            const result = [];
            String(text || "").split(/[,\s，、]+/).forEach(part => {
                const range = part.match(/^(\d+)\s*-\s*(\d+)$/);
                if (range) {
                    for (let value = Number(range[1]); value <= Number(range[2]); value++) result.push(value);
                } else if (Number.isFinite(Number(part)) && part !== "") {
                    result.push(Number(part));
                }
            });
            return uniqueNumbers(result);
        }

        function periodsFromTimes(startTime, endTime) {
            return periodTimes
                .filter(item => item.start >= startTime && item.end <= endTime)
                .map(item => item.period);
        }

        function mergeLessonsToCourses(lessons, termStartDate) {
            const courseMap = new Map();
            const lessonLinks = new Map();
            lessons.forEach(lesson => {
                const courseId = stableId(`${normalizeText(lesson.name)}|${stableArrayText(lesson.groups)}`);
                if (!courseMap.has(courseId)) {
                    courseMap.set(courseId, {
                        id: courseId,
                        name: lesson.name,
                        teachers: [],
                        teacherText: "",
                        groups: lesson.groups,
                        lessonCount: 0,
                        dateRange: { start: "", end: "" },
                        dates: [],
                        schedules: []
                    });
                }
                const course = courseMap.get(courseId);
                course.lessonCount++;
                course.dates.push(lesson.date);
                addManyUnique(course.teachers, lesson.teachers);
                const scheduleId = stableId([
                    courseId,
                    lesson.weekday,
                    lesson.startTime,
                    lesson.endTime,
                    lesson.periodText,
                    lesson.campusOrBuilding,
                    lesson.room
                ].map(normalizeText).join("|"));
                let schedule = course.schedules.find(item => item.id === scheduleId);
                if (!schedule) {
                    schedule = {
                        id: scheduleId,
                        weekday: lesson.weekday,
                        weekdayText: lesson.weekdayText,
                        startTime: lesson.startTime,
                        endTime: lesson.endTime,
                        periodText: lesson.periodText || formatPeriods(lesson.periods),
                        periods: lesson.periods,
                        campusOrBuilding: lesson.campusOrBuilding,
                        room: lesson.room,
                        location: lesson.location,
                        teachers: [],
                        teacherText: "",
                        dates: [],
                        weeks: [],
                        lessonIds: [],
                        dateRange: { start: "", end: "" }
                    };
                    course.schedules.push(schedule);
                }
                addManyUnique(schedule.teachers, lesson.teachers);
                const week = getWeekIndex(lesson.date, termStartDate);
                schedule.dates.push(lesson.date);
                if (week) schedule.weeks.push(week);
                schedule.lessonIds.push(lesson.id);
                lessonLinks.set(lesson.id, { courseId, scheduleId, week });
            });
            const courses = [...courseMap.values()];
            courses.forEach(course => {
                course.dates = uniqueSorted(course.dates);
                course.teacherText = course.teachers.join("、");
                course.dateRange = rangeFromValues(course.dates);
                course.schedules.forEach(schedule => {
                    schedule.dates = uniqueSorted(schedule.dates);
                    schedule.weeks = uniqueNumbers(schedule.weeks);
                    schedule.lessonIds = uniqueInOrder(schedule.lessonIds);
                    schedule.teacherText = schedule.teachers.join("、");
                    schedule.dateRange = rangeFromValues(schedule.dates);
                });
                course.schedules.sort(compareSchedule);
            });
            courses.sort((left, right) => left.name.localeCompare(right.name, "zh-Hans-CN"));
            return { courses, lessonLinks };
        }

        function buildScheduleMap(courses) {
            const map = new Map();
            courses.forEach(course => course.schedules.forEach(schedule => map.set(schedule.id, schedule)));
            return map;
        }

        function buildLessonRecords(rawLessons, lessonLinks, scheduleMap) {
            return rawLessons.map(lesson => {
                const link = lessonLinks.get(lesson.id) || {};
                const schedule = scheduleMap.get(link.scheduleId);
                const record = {
                    id: lesson.id,
                    courseId: link.courseId || "",
                    scheduleId: link.scheduleId || "",
                    date: lesson.date,
                    week: link.week ?? null,
                    weekday: lesson.weekday,
                    weekdayText: lesson.weekdayText,
                    startTime: lesson.startTime,
                    endTime: lesson.endTime,
                    startDateTimeLocal: buildLocalDateTime(lesson.date, lesson.startTime),
                    endDateTimeLocal: buildLocalDateTime(lesson.date, lesson.endTime),
                    periodText: lesson.periodText || formatPeriods(lesson.periods),
                    periods: lesson.periods,
                    slotKeys: lesson.periods.map(period => buildSlotKey(link.week, lesson.weekday, period)).filter(Boolean)
                };
                if (!schedule || !sameTextArray(lesson.teachers, schedule.teachers)) {
                    record.teachers = lesson.teachers;
                    record.teacherText = lesson.teacherText;
                }
                return record;
            }).sort(compareLesson);
        }

        function buildFromJwgl(entries, ownerName = "") {
            const courseMap = new Map();
            const occurrenceMap = new Map();
            const lessons = [];
            entries.forEach(entry => {
                const teachers = Array.isArray(entry.teachers) ? entry.teachers : splitTeacherNames(entry.teacher);
                const courseId = stableId(normalizeText(entry.name));
                if (!courseMap.has(courseId)) {
                    courseMap.set(courseId, {
                        id: courseId,
                        name: normalizeText(entry.name),
                        teachers: [],
                        teacherText: "",
                        groups: [],
                        lessonCount: 0,
                        dateRange: { start: "", end: "" },
                        dates: [],
                        schedules: []
                    });
                }
                const course = courseMap.get(courseId);
                addManyUnique(course.teachers, teachers);
                const periods = uniqueNumbers(entry.periods || []);
                const startTime = periodTimes.find(item => item.period === periods[0])?.start || "";
                const endTime = periodTimes.find(item => item.period === periods[periods.length - 1])?.end || "";
                const scheduleId = stableId([courseId, entry.weekday, startTime, endTime, formatPeriods(periods), entry.room].join("|"));
                let schedule = course.schedules.find(item => item.id === scheduleId);
                if (!schedule) {
                    schedule = {
                        id: scheduleId,
                        weekday: entry.weekday,
                        weekdayText: weekdayText(entry.weekday),
                        startTime,
                        endTime,
                        periodText: formatPeriods(periods),
                        periods,
                        campusOrBuilding: "",
                        room: normalizeText(entry.room),
                        location: normalizeText(entry.room),
                        teachers: [],
                        teacherText: "",
                        dates: [],
                        weeks: [],
                        lessonIds: [],
                        dateRange: { start: "", end: "" }
                    };
                    course.schedules.push(schedule);
                }
                addManyUnique(schedule.teachers, teachers);
                uniqueNumbers(entry.weeks || []).forEach(week => {
                    const key = `${courseId}|${scheduleId}|${week}`;
                    if (!occurrenceMap.has(key)) {
                        occurrenceMap.set(key, {
                            key,
                            courseId,
                            scheduleId,
                            week,
                            weekday: entry.weekday,
                            startTime,
                            endTime,
                            periodText: formatPeriods(periods),
                            periods,
                            teachers: []
                        });
                    }
                    addManyUnique(occurrenceMap.get(key).teachers, teachers);
                });
            });
            occurrenceMap.forEach(occurrence => {
                const id = stableId(`jwgl|${occurrence.key}`);
                const course = courseMap.get(occurrence.courseId);
                const schedule = course.schedules.find(item => item.id === occurrence.scheduleId);
                schedule.weeks.push(occurrence.week);
                schedule.lessonIds.push(id);
                course.lessonCount++;
                lessons.push({
                    id,
                    courseId: occurrence.courseId,
                    scheduleId: occurrence.scheduleId,
                    date: "",
                    week: occurrence.week,
                    weekday: occurrence.weekday,
                    weekdayText: weekdayText(occurrence.weekday),
                    startTime: occurrence.startTime,
                    endTime: occurrence.endTime,
                    startDateTimeLocal: "",
                    endDateTimeLocal: "",
                    periodText: occurrence.periodText,
                    periods: occurrence.periods,
                    slotKeys: occurrence.periods.map(period => buildSlotKey(occurrence.week, occurrence.weekday, period)),
                    teachers: occurrence.teachers,
                    teacherText: occurrence.teachers.join("、")
                });
            });
            const courses = [...courseMap.values()];
            courses.forEach(course => {
                course.teacherText = course.teachers.join("、");
                course.schedules.forEach(schedule => {
                    schedule.teachers = uniqueInOrder(schedule.teachers);
                    schedule.teacherText = schedule.teachers.join("、");
                    schedule.weeks = uniqueNumbers(schedule.weeks);
                    schedule.lessonIds = uniqueInOrder(schedule.lessonIds);
                });
                course.schedules.sort(compareSchedule);
            });
            lessons.forEach(lesson => {
                const schedule = courseMap.get(lesson.courseId)?.schedules.find(item => item.id === lesson.scheduleId);
                if (schedule && sameTextArray(lesson.teachers, schedule.teachers)) {
                    delete lesson.teachers;
                    delete lesson.teacherText;
                }
            });
            const weeks = uniqueNumbers(lessons.map(item => item.week));
            return normalize({
                schemaVersion,
                sourceUrl: "",
                source: { type: "jwgl", input: window.location.href },
                owner: { id: "", name: normalizeText(ownerName) },
                meta: {
                    calendarName: "教务系统课表",
                    calendarDescription: "由 Better NXU 从教务系统导出",
                    timezone,
                    timezoneOffset,
                    termStartDate: "",
                    weekRange: { start: weeks[0] || null, end: weeks[weeks.length - 1] || null, weeks },
                    dateRange: { start: "", end: "" },
                    totalRawLessons: lessons.length,
                    totalLessons: lessons.length,
                    totalCourses: courses.length,
                    totalSchedules: courses.reduce((sum, course) => sum + course.schedules.length, 0)
                },
                courses,
                lessons,
                byDate: {},
                busySlots: buildBusySlots(lessons)
            });
        }

        function normalize(input) {
            if (!input || input.schemaVersion !== schemaVersion || !Array.isArray(input.courses) || !Array.isArray(input.lessons)) {
                throw new Error("仅支持 Better NXU 2.0 课表 JSON");
            }
            const data = JSON.parse(JSON.stringify(input));
            const courseIds = new Set(data.courses.map(course => course.id));
            if (courseIds.size !== data.courses.length) throw new Error("课表 JSON 存在重复的课程 ID");
            const scheduleIdsByCourse = new Map();
            data.courses.forEach(course => {
                if (!Array.isArray(course.schedules)) throw new Error("课表 JSON 缺少课程安排");
                const ids = new Set(course.schedules.map(schedule => schedule.id));
                if (ids.size !== course.schedules.length) throw new Error("课表 JSON 存在重复的安排 ID");
                scheduleIdsByCourse.set(course.id, ids);
            });
            const lessonIds = new Set(data.lessons.map(lesson => lesson.id));
            if (lessonIds.size !== data.lessons.length) throw new Error("课表 JSON 存在重复的课次 ID");
            data.lessons.forEach(lesson => {
                if (!courseIds.has(lesson.courseId) || !scheduleIdsByCourse.get(lesson.courseId)?.has(lesson.scheduleId)) {
                    throw new Error("课表 JSON 存在无效的课程或安排引用");
                }
                lesson.week = Number(lesson.week);
                lesson.weekday = Number(lesson.weekday);
                lesson.periods = uniqueNumbers((lesson.periods || []).map(Number));
                if (!Number.isInteger(lesson.week) || lesson.week < 1 ||
                    !Number.isInteger(lesson.weekday) || lesson.weekday < 1 || lesson.weekday > 7 ||
                    !lesson.periods.length || lesson.periods.some(period => !Number.isInteger(period) || period < 1 || period > 10)) {
                    throw new Error("课表 JSON 存在无效的周次、星期或节次");
                }
                lesson.slotKeys = lesson.periods.map(period => buildSlotKey(lesson.week, lesson.weekday, period));
            });
            data.lessons.sort(compareLesson);
            data.sourceUrl = data.sourceUrl || "";
            data.source = data.source || { type: "text", input: data.sourceUrl };
            data.owner = normalizeOwner(data.owner);
            data.meta = data.meta || {};
            data.meta.timezone = data.meta.timezone || timezone;
            data.meta.timezoneOffset = data.meta.timezoneOffset || timezoneOffset;
            data.meta.weekRange = getWeekRange(data.lessons);
            data.meta.dateRange = getDateRange(data.lessons);
            data.meta.totalLessons = data.lessons.length;
            data.meta.totalRawLessons = Number(data.meta.totalRawLessons) || data.lessons.length;
            data.meta.totalCourses = data.courses.length;
            data.meta.totalSchedules = data.courses.reduce((sum, course) => sum + (course.schedules?.length || 0), 0);
            data.byDate = buildByDate(data.lessons);
            data.busySlots = buildBusySlots(data.lessons);
            return data;
        }

        function buildByDate(lessons) {
            const result = {};
            lessons.forEach(lesson => {
                if (!lesson.date) return;
                if (!result[lesson.date]) result[lesson.date] = [];
                result[lesson.date].push(lesson.id);
            });
            return result;
        }

        function buildBusySlots(lessons) {
            const result = {};
            lessons.forEach(lesson => lesson.periods.forEach(period => {
                const key = buildSlotKey(lesson.week, lesson.weekday, period);
                if (!key) return;
                if (!result[key]) result[key] = [];
                if (!result[key].includes(lesson.id)) result[key].push(lesson.id);
            }));
            return Object.fromEntries(Object.entries(result).sort(([left], [right]) => compareSlotKeys(left, right)));
        }

        function getMaps(data) {
            const courses = new Map(data.courses.map(course => [course.id, course]));
            const schedules = new Map();
            data.courses.forEach(course => (course.schedules || []).forEach(schedule => {
                schedules.set(`${course.id}|${schedule.id}`, schedule);
                if (!schedules.has(schedule.id)) schedules.set(schedule.id, schedule);
            }));
            const lessons = new Map(data.lessons.map(lesson => [lesson.id, lesson]));
            return { courses, schedules, lessons };
        }

        function getLessonDetail(maps, lesson) {
            const course = maps.courses.get(lesson.courseId) || {};
            const schedule = maps.schedules.get(`${lesson.courseId}|${lesson.scheduleId}`) || maps.schedules.get(lesson.scheduleId) || {};
            const teachers = lesson.teachers || schedule.teachers || course.teachers || [];
            return {
                course,
                schedule,
                teachers,
                teacherText: lesson.teacherText || schedule.teacherText || course.teacherText || teachers.join("、"),
                room: schedule.room || schedule.location || ""
            };
        }

        function parseIcsDateTime(value, eventTimezone) {
            const raw = String(value || "");
            const match = raw.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?)?(Z)?$/);
            if (!match) return { raw, timezone: eventTimezone, date: "", time: "", dateTimeLocal: raw, weekday: null, weekdayText: "" };
            let [, year, month, day, hour = "00", minute = "00", second = "00", utc] = match;
            if (utc) {
                const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second)) + 8 * 3600000);
                year = String(date.getUTCFullYear());
                month = String(date.getUTCMonth() + 1).padStart(2, "0");
                day = String(date.getUTCDate()).padStart(2, "0");
                hour = String(date.getUTCHours()).padStart(2, "0");
                minute = String(date.getUTCMinutes()).padStart(2, "0");
                second = String(date.getUTCSeconds()).padStart(2, "0");
            }
            const date = `${year}-${month}-${day}`;
            const weekday = getWeekdayNumber(Number(year), Number(month), Number(day));
            return {
                raw,
                timezone: eventTimezone,
                date,
                time: `${hour}:${minute}`,
                dateTimeLocal: `${date}T${hour}:${minute}:${second}`,
                weekday,
                weekdayText: weekdayText(weekday)
            };
        }

        function getTermStartMonday(lessons) {
            const firstDate = lessons.map(item => item.date).filter(Boolean).sort()[0];
            if (!firstDate) return "";
            const date = parseDateOnly(firstDate);
            const weekday = getWeekdayNumber(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
            date.setUTCDate(date.getUTCDate() - weekday + 1);
            return formatDateOnly(date);
        }

        function getWeekIndex(dateString, termStartDate) {
            if (!dateString || !termStartDate) return null;
            const days = Math.floor((parseDateOnly(dateString) - parseDateOnly(termStartDate)) / 86400000);
            return days < 0 ? null : Math.floor(days / 7) + 1;
        }

        function getWeekRange(lessons) {
            const weeks = uniqueNumbers(lessons.map(item => Number(item.week)));
            return { start: weeks[0] || null, end: weeks[weeks.length - 1] || null, weeks };
        }

        function getDateRange(lessons) {
            return rangeFromValues(lessons.map(item => item.date).filter(Boolean));
        }

        function rangeFromValues(values) {
            const sorted = uniqueSorted(values);
            return { start: sorted[0] || "", end: sorted[sorted.length - 1] || "" };
        }

        function formatWeeks(weeks, totalWeeks = 0) {
            const values = uniqueNumbers((weeks || []).map(Number));
            if (!values.length) return "无";
            if (totalWeeks && values.length === totalWeeks && values[0] === 1 && values[values.length - 1] === totalWeeks) return "全学期";
            if (values.length >= 3 && values.every((value, index) => index === 0 || value - values[index - 1] === 2)) {
                return `${values[0]}-${values[values.length - 1]}周${values[0] % 2 ? "单" : "双"}`;
            }
            const chunks = [];
            let start = values[0];
            let previous = values[0];
            for (let index = 1; index <= values.length; index++) {
                const current = values[index];
                if (current === previous + 1) {
                    previous = current;
                    continue;
                }
                chunks.push(start === previous ? String(start) : `${start}-${previous}`);
                start = current;
                previous = current;
            }
            return `${chunks.join("、")}周`;
        }

        function formatPeriods(periods) {
            const values = uniqueNumbers(periods || []);
            if (!values.length) return "";
            return values.length > 1 && values.every((value, index) => index === 0 || value === values[index - 1] + 1)
                ? `${values[0]}-${values[values.length - 1]}`
                : values.join(",");
        }

        function buildSlotKey(week, weekday, period) {
            return [week, weekday, period].every(Number.isFinite) ? `${week}-${weekday}-${period}` : "";
        }

        function compareSlotKeys(left, right) {
            const a = left.split("-").map(Number);
            const b = right.split("-").map(Number);
            return a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
        }

        function compareRawLesson(left, right) {
            return left.start.dateTimeLocal.localeCompare(right.start.dateTimeLocal) || left.id.localeCompare(right.id);
        }

        function compareLesson(left, right) {
            return String(left.date || "").localeCompare(String(right.date || "")) ||
                Number(left.week) - Number(right.week) ||
                Number(left.weekday) - Number(right.weekday) ||
                (left.periods?.[0] || 999) - (right.periods?.[0] || 999) ||
                String(left.id).localeCompare(String(right.id));
        }

        function compareSchedule(left, right) {
            return left.weekday - right.weekday ||
                (left.periods?.[0] || 999) - (right.periods?.[0] || 999) ||
                String(left.room || "").localeCompare(String(right.room || ""), "zh-Hans-CN");
        }

        function getFirst(object, key) {
            return object[key]?.[0]?.value || "";
        }

        function findTimezone(parsed) {
            for (const event of parsed.events) {
                const value = event.DTSTART?.[0]?.params?.TZID || event.DTEND?.[0]?.params?.TZID;
                if (value) return value;
            }
            return "";
        }

        function normalizeOwner(owner) {
            if (!owner) return { id: "", name: "" };
            if (typeof owner === "string") return { id: owner, name: owner };
            return { id: normalizeText(owner.id), name: normalizeText(owner.name) };
        }

        function buildLocalDateTime(date, time) {
            return date && time ? `${date}T${time}:00` : "";
        }

        function parseDateOnly(value) {
            const [year, month, day] = value.split("-").map(Number);
            return new Date(Date.UTC(year, month - 1, day));
        }

        function formatDateOnly(date) {
            return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
        }

        function getWeekdayNumber(year, month, day) {
            const value = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
            return value || 7;
        }

        function weekdayText(value) {
            return ["", "周一", "周二", "周三", "周四", "周五", "周六", "周日"][value] || "";
        }

        function addManyUnique(target, values) {
            (values || []).forEach(value => {
                const text = normalizeText(value);
                if (text && !target.includes(text)) target.push(text);
            });
        }

        function uniqueBy(values, key) {
            const seen = new Set();
            return values.filter(value => {
                const id = key(value);
                if (seen.has(id)) return false;
                seen.add(id);
                return true;
            });
        }

        function uniqueSorted(values) {
            return [...new Set((values || []).filter(Boolean))].sort();
        }

        function uniqueInOrder(values) {
            return [...new Set((values || []).filter(Boolean))];
        }

        function uniqueNumbers(values) {
            return [...new Set((values || []).filter(Number.isFinite))].sort((left, right) => left - right);
        }

        function normalizeText(value) {
            return String(value || "").trim().replace(/\s+/g, " ");
        }

        function stableArrayText(values) {
            return uniqueSorted((values || []).map(normalizeText)).join(",");
        }

        function sameTextArray(left, right) {
            return stableArrayText(left) === stableArrayText(right);
        }

        function stableId(input) {
            let hash = 2166136261;
            const text = String(input || "");
            for (let index = 0; index < text.length; index++) {
                hash ^= text.charCodeAt(index);
                hash = Math.imul(hash, 16777619);
            }
            return `c_${(hash >>> 0).toString(36)}`;
        }

        return {
            schemaVersion,
            periodTimes,
            fetchFromUrl,
            parseIcs,
            buildFromJwgl,
            normalize,
            getMaps,
            getLessonDetail,
            formatWeeks,
            formatPeriods,
            weekdayText,
            stableId
        };
    })();

    const ScheduleCryptoTools = (() => {
        const storageKey = "Schedule.encryptionKeyPair";
        const maxPlaintextBytes = 5 * 1024 * 1024;
        const maxEnvelopeBytes = 7 * 1024 * 1024;
        const protectedHeaderType = "better-nxu-schedule+jwe";
        const protectedContentType = "application/vnd.better-nxu.schedule+json";
        const textEncoder = new TextEncoder();
        const textDecoder = new TextDecoder("utf-8", { fatal: true });

        function cryptoError(code, message, cause) {
            const error = new Error(message);
            error.code = code;
            if (cause) error.cause = cause;
            return error;
        }

        function getCryptoApi() {
            const cryptoApi = globalThis.crypto;
            if (!cryptoApi?.subtle || typeof cryptoApi.getRandomValues !== "function") {
                throw cryptoError("CRYPTO_UNAVAILABLE", "当前页面不支持安全加密，请使用 HTTPS 地址或更新浏览器后重试");
            }
            return cryptoApi;
        }

        function byteLength(text) {
            return textEncoder.encode(String(text ?? "")).byteLength;
        }

        function bytesToBase64(bytes) {
            const values = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
            let binary = "";
            for (let index = 0; index < values.length; index += 0x8000) {
                binary += String.fromCharCode(...values.subarray(index, index + 0x8000));
            }
            return btoa(binary);
        }

        function base64ToBytes(value, fieldName = "密钥") {
            const text = String(value || "").replace(/\s+/g, "");
            if (!text || !/^[A-Za-z0-9+/]+={0,2}$/.test(text) || text.length % 4 === 1) {
                throw cryptoError("INVALID_KEY", `${fieldName}格式不正确`);
            }
            try {
                const binary = atob(text);
                return Uint8Array.from(binary, char => char.charCodeAt(0));
            } catch (error) {
                throw cryptoError("INVALID_KEY", `${fieldName}格式不正确`, error);
            }
        }

        function bytesToBase64Url(bytes) {
            return bytesToBase64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
        }

        function base64UrlToBytes(value, fieldName) {
            const text = String(value || "");
            if (!text || !/^[A-Za-z0-9_-]+$/.test(text) || text.length % 4 === 1) {
                throw cryptoError("INVALID_ENVELOPE", `加密文件的 ${fieldName} 字段无效`);
            }
            const padding = "=".repeat((4 - text.length % 4) % 4);
            try {
                const binary = atob(text.replace(/-/g, "+").replace(/_/g, "/") + padding);
                const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
                if (bytesToBase64Url(bytes) !== text) throw new Error("Non-canonical Base64URL");
                return bytes;
            } catch (error) {
                throw cryptoError("INVALID_ENVELOPE", `加密文件的 ${fieldName} 字段无效`, error);
            }
        }

        function arrayBufferToPem(buffer, label) {
            const base64 = bytesToBase64(new Uint8Array(buffer));
            const lines = base64.match(/.{1,64}/g) || [];
            return `-----BEGIN ${label}-----\n${lines.join("\n")}\n-----END ${label}-----`;
        }

        function pemToBytes(pem, label) {
            const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const match = String(pem || "").trim().match(new RegExp(
                `^-----BEGIN ${escapedLabel}-----\\s+([A-Za-z0-9+/=\\s]+?)\\s+-----END ${escapedLabel}-----$`
            ));
            if (!match) throw cryptoError("INVALID_KEY", `请输入完整的${label === "PUBLIC KEY" ? "加密密钥（公钥）" : "解密密钥（私钥）"}`);
            return base64ToBytes(match[1], label === "PUBLIC KEY" ? "加密密钥" : "解密密钥");
        }

        async function getKeyId(spkiBytes) {
            const { subtle } = getCryptoApi();
            const digest = await subtle.digest("SHA-256", spkiBytes);
            return `sha256-${bytesToBase64Url(new Uint8Array(digest))}`;
        }

        function assertRsaStrength(key, keyName) {
            const publicExponent = Array.from(key?.algorithm?.publicExponent || []);
            if (Number(key?.algorithm?.modulusLength) < 3072 || key?.algorithm?.hash?.name !== "SHA-256") {
                throw cryptoError("INVALID_KEY", `${keyName}不符合当前课表加密要求，请使用“课表密钥管理”生成的密钥`);
            }
            if (publicExponent.join(",") !== "1,0,1") {
                throw cryptoError("INVALID_KEY", `${keyName}使用了不受支持的参数，请使用“课表密钥管理”生成的密钥`);
            }
        }

        async function importPublicKey(pem) {
            const { subtle } = getCryptoApi();
            const spki = pemToBytes(pem, "PUBLIC KEY");
            try {
                const cryptoKey = await subtle.importKey(
                    "spki",
                    spki,
                    { name: "RSA-OAEP", hash: "SHA-256" },
                    false,
                    ["encrypt"]
                );
                assertRsaStrength(cryptoKey, "加密密钥");
                return { cryptoKey, keyId: await getKeyId(spki) };
            } catch (error) {
                if (error.code) throw error;
                throw cryptoError("INVALID_KEY", "加密密钥无法识别，请粘贴完整的课表加密密钥", error);
            }
        }

        async function importPrivateKey(pem) {
            const { subtle } = getCryptoApi();
            const pkcs8 = pemToBytes(pem, "PRIVATE KEY");
            try {
                const cryptoKey = await subtle.importKey(
                    "pkcs8",
                    pkcs8,
                    { name: "RSA-OAEP", hash: "SHA-256" },
                    false,
                    ["decrypt"]
                );
                assertRsaStrength(cryptoKey, "解密密钥");
                return cryptoKey;
            } catch (error) {
                if (error.code) throw error;
                throw cryptoError("INVALID_KEY", "解密密钥无法识别，请粘贴完整的课表解密密钥", error);
            }
        }

        async function generateKeyPair() {
            const { subtle } = getCryptoApi();
            const keyPair = await subtle.generateKey({
                name: "RSA-OAEP",
                modulusLength: 3072,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: "SHA-256"
            }, true, ["encrypt", "decrypt"]);
            const [spki, pkcs8] = await Promise.all([
                subtle.exportKey("spki", keyPair.publicKey),
                subtle.exportKey("pkcs8", keyPair.privateKey)
            ]);
            return {
                publicKey: arrayBufferToPem(spki, "PUBLIC KEY"),
                privateKey: arrayBufferToPem(pkcs8, "PRIVATE KEY"),
                keyId: await getKeyId(new Uint8Array(spki)),
                createdAt: new Date().toISOString()
            };
        }

        function isEncryptedEnvelope(value) {
            if (!value || typeof value !== "object" || Array.isArray(value)) return false;
            return ["protected", "encrypted_key", "iv", "ciphertext", "tag"]
                .some(field => Object.prototype.hasOwnProperty.call(value, field));
        }

        function inspectEnvelope(envelope) {
            if (!envelope || typeof envelope !== "object" || Array.isArray(envelope)) {
                throw cryptoError("INVALID_ENVELOPE", "加密课表文件结构无效");
            }
            const requiredFields = ["protected", "encrypted_key", "iv", "ciphertext", "tag"];
            const fields = Object.keys(envelope).sort();
            if (fields.join("|") !== [...requiredFields].sort().join("|") ||
                requiredFields.some(field => typeof envelope[field] !== "string" || !envelope[field])) {
                throw cryptoError("INVALID_ENVELOPE", "加密课表文件缺少必要字段");
            }
            const protectedBytes = base64UrlToBytes(envelope.protected, "protected");
            if (protectedBytes.byteLength > 2048) throw cryptoError("INVALID_ENVELOPE", "加密课表文件头过大");
            let header;
            try {
                header = JSON.parse(textDecoder.decode(protectedBytes));
            } catch (error) {
                throw cryptoError("INVALID_ENVELOPE", "加密课表文件头无效", error);
            }
            const allowedHeaderFields = ["alg", "bnxv", "cty", "enc", "kid", "typ"];
            if (!header || typeof header !== "object" || Array.isArray(header) ||
                Object.keys(header).sort().join("|") !== allowedHeaderFields.sort().join("|") ||
                header.alg !== "RSA-OAEP-256" || header.enc !== "A256GCM" ||
                header.typ !== protectedHeaderType || header.cty !== protectedContentType ||
                header.bnxv !== 1 || !/^sha256-[A-Za-z0-9_-]{43}$/.test(header.kid || "")) {
                throw cryptoError("UNSUPPORTED_ENCRYPTION", "该文件使用了不受支持的课表加密格式");
            }
            return { header, protectedText: envelope.protected };
        }

        async function encryptSchedule(schedule, publicKeyPem) {
            const { subtle } = getCryptoApi();
            const normalized = CourseScheduleTools.normalize(schedule);
            const plaintext = JSON.stringify(normalized);
            const plaintextBytes = textEncoder.encode(plaintext);
            if (plaintextBytes.byteLength > maxPlaintextBytes) {
                throw cryptoError("FILE_TOO_LARGE", "课表内容不能超过 5 MB");
            }
            const { cryptoKey: publicKey, keyId } = await importPublicKey(publicKeyPem);
            const header = {
                alg: "RSA-OAEP-256",
                enc: "A256GCM",
                typ: protectedHeaderType,
                cty: protectedContentType,
                kid: keyId,
                bnxv: 1
            };
            const protectedText = bytesToBase64Url(textEncoder.encode(JSON.stringify(header)));
            const iv = getCryptoApi().getRandomValues(new Uint8Array(12));
            const aesKey = await subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt"]);
            const rawAesKey = await subtle.exportKey("raw", aesKey);
            const [encryptedKey, encryptedContent] = await Promise.all([
                subtle.encrypt({ name: "RSA-OAEP" }, publicKey, rawAesKey),
                subtle.encrypt({
                    name: "AES-GCM",
                    iv,
                    additionalData: textEncoder.encode(protectedText),
                    tagLength: 128
                }, aesKey, plaintextBytes)
            ]);
            const contentBytes = new Uint8Array(encryptedContent);
            const tag = contentBytes.slice(contentBytes.length - 16);
            const ciphertext = contentBytes.slice(0, contentBytes.length - 16);
            return {
                protected: protectedText,
                encrypted_key: bytesToBase64Url(new Uint8Array(encryptedKey)),
                iv: bytesToBase64Url(iv),
                ciphertext: bytesToBase64Url(ciphertext),
                tag: bytesToBase64Url(tag)
            };
        }

        async function decryptEnvelope(envelope, privateKey) {
            const { subtle } = getCryptoApi();
            const { protectedText } = inspectEnvelope(envelope);
            const encryptedKey = base64UrlToBytes(envelope.encrypted_key, "encrypted_key");
            const iv = base64UrlToBytes(envelope.iv, "iv");
            const ciphertext = base64UrlToBytes(envelope.ciphertext, "ciphertext");
            const tag = base64UrlToBytes(envelope.tag, "tag");
            if (iv.byteLength !== 12 || tag.byteLength !== 16 || !ciphertext.byteLength) {
                throw cryptoError("INVALID_ENVELOPE", "加密课表文件参数无效");
            }
            try {
                const rawAesKey = await subtle.decrypt({ name: "RSA-OAEP" }, privateKey, encryptedKey);
                if (rawAesKey.byteLength !== 32) throw new Error("AES key length mismatch");
                const aesKey = await subtle.importKey("raw", rawAesKey, { name: "AES-GCM" }, false, ["decrypt"]);
                const encryptedContent = new Uint8Array(ciphertext.byteLength + tag.byteLength);
                encryptedContent.set(ciphertext);
                encryptedContent.set(tag, ciphertext.byteLength);
                const plaintext = await subtle.decrypt({
                    name: "AES-GCM",
                    iv,
                    additionalData: textEncoder.encode(protectedText),
                    tagLength: 128
                }, aesKey, encryptedContent);
                if (plaintext.byteLength > maxPlaintextBytes) {
                    throw cryptoError("FILE_TOO_LARGE", "解密后的课表内容不能超过 5 MB");
                }
                return textDecoder.decode(plaintext);
            } catch (error) {
                if (error.code === "FILE_TOO_LARGE") throw error;
                throw cryptoError("DECRYPT_FAILED", "解密密钥不匹配或加密文件已损坏", error);
            }
        }

        return {
            storageKey,
            maxPlaintextBytes,
            maxEnvelopeBytes,
            assertAvailable: getCryptoApi,
            byteLength,
            generateKeyPair,
            importPublicKey,
            importPrivateKey,
            encryptSchedule,
            decryptEnvelope,
            isEncryptedEnvelope,
            inspectEnvelope
        };
    })();

    function scheduleOperationError(code, message) {
        const error = new Error(message);
        error.code = code;
        return error;
    }

    function classifyScheduleSlot(lessons, isOnline) {
        const values = Array.isArray(lessons) ? lessons : [];
        if (!values.length) return "free";
        return values.some(lesson => !isOnline(lesson)) ? "busy" : "online";
    }

    function summarizePeopleAvailability(states) {
        const values = Array.isArray(states) ? states : [];
        if (!values.length) return { status: "empty", text: "尚未添加课表" };
        if (values.every(status => status === "free")) {
            return { status: "free", text: "全部人员全时段完全空闲" };
        }
        if (values.every(status => status === "free" || status === "online")) {
            return { status: "online", text: "全部人员可协调（含线上课程）" };
        }
        const availableCount = values.filter(status => status !== "busy").length;
        return availableCount
            ? { status: "partial", text: `${availableCount}/${values.length} 人存在空闲或可协调时段` }
            : { status: "none", text: "无人空闲" };
    }

    function buildJwglExcelTables(schedule, tools = CourseScheduleTools) {
        const data = tools.normalize(schedule);
        const totalWeeks = Number(data.meta?.weekRange?.end) ||
            Math.max(0, ...data.lessons.map(lesson => Number(lesson.week) || 0));
        const lessonWeeksBySchedule = new Map();
        data.lessons.forEach(lesson => {
            if (!lessonWeeksBySchedule.has(lesson.scheduleId)) lessonWeeksBySchedule.set(lesson.scheduleId, []);
            lessonWeeksBySchedule.get(lesson.scheduleId).push(Number(lesson.week));
        });

        const arrangements = data.courses.flatMap(course => (course.schedules || []).map(item => {
            const periods = [...new Set((item.periods || []).map(Number))]
                .filter(period => Number.isInteger(period) && period >= 1 && period <= 10)
                .sort((left, right) => left - right);
            const weeks = [...new Set((item.weeks?.length ? item.weeks : lessonWeeksBySchedule.get(item.id) || [])
                .map(Number))]
                .filter(week => Number.isInteger(week) && week > 0)
                .sort((left, right) => left - right);
            return {
                courseName: course.name || "未命名课程",
                teacherText: item.teacherText || course.teacherText || "未注明教师",
                room: item.room || item.location || "未注明教室",
                weekday: Number(item.weekday),
                weekdayText: item.weekdayText || tools.weekdayText(Number(item.weekday)),
                periods,
                periodText: item.periodText || tools.formatPeriods(periods),
                startTime: item.startTime || "",
                endTime: item.endTime || "",
                weeks,
                weeksText: tools.formatWeeks(weeks, totalWeeks)
            };
        })).filter(item =>
            Number.isInteger(item.weekday) && item.weekday >= 1 && item.weekday <= 7 && item.periods.length
        ).sort((left, right) =>
            left.weekday - right.weekday ||
            left.periods[0] - right.periods[0] ||
            left.courseName.localeCompare(right.courseName, "zh-Hans-CN")
        );

        if (!arrangements.length) throw new Error("当前课表没有可导出的课程安排");

        const weekdays = Array.from({ length: 7 }, (_, index) => tools.weekdayText(index + 1));
        const periodGroups = Array.from({ length: 5 }, (_, index) => {
            const first = tools.periodTimes[index * 2];
            const second = tools.periodTimes[index * 2 + 1];
            return {
                label: `${first.period}-${second.period}`,
                periods: [first.period, second.period],
                time: `${first.start}-${second.end}`
            };
        });
        const timetableRows = [["节次 / 时间", ...weekdays]];
        periodGroups.forEach(group => {
            const row = [`第 ${group.label} 节\n${group.time}`];
            for (let weekday = 1; weekday <= 7; weekday++) {
                const values = arrangements
                    .filter(item => item.weekday === weekday && item.periods.some(period => group.periods.includes(period)))
                    .map(item => [
                        item.courseName,
                        `教师：${item.teacherText}`,
                        `教室：${item.room}`,
                        `周次：${item.weeksText}`,
                        `节次：${item.periodText}`
                    ].join("\n"));
                row.push(values.join("\n\n"));
            }
            timetableRows.push(row);
        });

        const detailRows = [["课程名称", "教师", "教室", "星期", "节次", "上课时间", "周次"]];
        arrangements.forEach(item => detailRows.push([
            item.courseName,
            item.teacherText,
            item.room,
            item.weekdayText,
            item.periodText,
            [item.startTime, item.endTime].filter(Boolean).join("-") || "未注明",
            item.weeksText
        ]));

        return { timetableRows, detailRows, arrangementCount: arrangements.length };
    }

    function downloadTextFile(content, filename) {
        const blob = new Blob([content], { type: "application/json;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
            link.remove();
            URL.revokeObjectURL(url);
        }, 100);
    }

    async function requestScheduleKey(type, options = {}) {
        const isPublic = type === "public";
        const value = Vue.ref(String(options.initialValue || ""));
        let importedKey = null;
        try {
            const action = await vant.showConfirmDialog({
                title: isPublic ? "粘贴接收方的加密密钥" : "需要对应的解密密钥",
                messageAlign: "left",
                confirmButtonText: isPublic ? "使用此加密密钥" : "解密文件",
                cancelButtonText: "取消",
                closeOnClickOverlay: false,
                message: () => Vue.h("div", null, [
                    Vue.h("div", {
                        style: "padding:0 16px 8px;color:#646566;font-size:13px;line-height:1.6;"
                    }, isPublic
                        ? "发给谁查看，就粘贴谁发给你的加密密钥。加密密钥可以分享，请不要让对方发送解密密钥。"
                        : `${options.filename ? `文件“${options.filename}”无法用当前解密密钥打开。` : "当前解密密钥无法打开这个文件。"}请粘贴你自己的对应解密密钥备份；如果没有，请取消并让对方使用本页当前加密密钥重新导出。`),
                    Vue.h(vant.Field, {
                        modelValue: value.value,
                        type: "textarea",
                        rows: 7,
                        autosize: false,
                        clearable: true,
                        autocomplete: "off",
                        placeholder: isPublic ? "-----BEGIN PUBLIC KEY-----" : "-----BEGIN PRIVATE KEY-----",
                        "onUpdate:modelValue": input => value.value = String(input || "")
                    })
                ]),
                async beforeClose(action) {
                    if (action !== "confirm") return true;
                    if (!value.value.trim()) {
                        vant.showToast(isPublic ? "请粘贴加密密钥" : "请粘贴解密密钥");
                        return false;
                    }
                    try {
                        importedKey = isPublic
                            ? await ScheduleCryptoTools.importPublicKey(value.value.trim())
                            : await ScheduleCryptoTools.importPrivateKey(value.value.trim());
                        return true;
                    } catch (error) {
                        vant.showToast(error.message || "密钥格式无效");
                        return false;
                    }
                }
            });
            if (action !== "confirm") return null;
            return { pem: value.value.trim(), importedKey };
        } catch (error) {
            return null;
        }
    }

    async function selectScheduleExportPublicKey() {
        const currentKeyPair = getGMValue(ScheduleCryptoTools.storageKey);
        if (currentKeyPair?.publicKey) {
            try {
                const action = await vant.showConfirmDialog({
                    title: "选择接收人的加密密钥",
                    message: "使用当前加密密钥：只有本页当前解密密钥能打开。\n\n粘贴接收方加密密钥：把加密课表发给对方时使用。",
                    messageAlign: "left",
                    confirmButtonText: "使用当前加密密钥",
                    cancelButtonText: "粘贴接收方加密密钥",
                    closeOnClickOverlay: false
                });
                if (action === "confirm") return currentKeyPair.publicKey;
            } catch (error) {
                // 用户选择粘贴接收方的加密密钥。
            }
        }
        const provided = await requestScheduleKey("public");
        if (!provided) throw scheduleOperationError("EXPORT_CANCELLED", "已取消加密导出");
        return provided.pem;
    }

    async function prepareScheduleExport(schedule) {
        const normalized = CourseScheduleTools.normalize(schedule);
        let encrypt = false;
        try {
            const action = await vant.showConfirmDialog({
                title: "导出课表 JSON",
                message: "直接导出可被任何拿到文件的人查看；加密导出只有持有对应解密密钥的人可以打开。",
                messageAlign: "left",
                confirmButtonText: "加密导出",
                cancelButtonText: "直接导出",
                closeOnClickOverlay: false
            });
            encrypt = action === "confirm";
        } catch (error) {
            // “直接导出”对应 Vant 对话框的取消动作。
        }
        if (!encrypt) {
            return { encrypted: false, content: JSON.stringify(normalized) };
        }
        const publicKey = await selectScheduleExportPublicKey();
        const envelope = await ScheduleCryptoTools.encryptSchedule(normalized, publicKey);
        return { encrypted: true, content: JSON.stringify(envelope) };
    }

    function parseScheduleJson(text, encrypted = false) {
        let data;
        try {
            data = JSON.parse(text);
        } catch (error) {
            throw scheduleOperationError(
                encrypted ? "INVALID_DECRYPTED_SCHEDULE" : "INVALID_JSON",
                encrypted ? "文件已解密，但其中不是有效的课表 JSON" : "文件不是有效的 JSON"
            );
        }
        try {
            return CourseScheduleTools.normalize(data);
        } catch (error) {
            throw scheduleOperationError(
                encrypted ? "INVALID_DECRYPTED_SCHEDULE" : "INVALID_SCHEDULE",
                `${encrypted ? "文件已解密，但课表内容无效" : "课表文件无效"}：${error.message}`
            );
        }
    }

    async function parseScheduleFileContent(text, options = {}) {
        const content = String(text || "");
        const outerSize = ScheduleCryptoTools.byteLength(content);
        if (outerSize > ScheduleCryptoTools.maxEnvelopeBytes) {
            throw scheduleOperationError("FILE_TOO_LARGE", "课表文件不能超过 7 MB");
        }
        let parsed;
        try {
            parsed = JSON.parse(content);
        } catch (error) {
            throw scheduleOperationError("INVALID_JSON", "文件不是有效的 JSON");
        }
        if (parsed?.schemaVersion === CourseScheduleTools.schemaVersion) {
            if (outerSize > ScheduleCryptoTools.maxPlaintextBytes) {
                throw scheduleOperationError("FILE_TOO_LARGE", "课表内容不能超过 5 MB");
            }
            return CourseScheduleTools.normalize(parsed);
        }
        if (!ScheduleCryptoTools.isEncryptedEnvelope(parsed)) {
            return CourseScheduleTools.normalize(parsed);
        }

        const { header } = ScheduleCryptoTools.inspectEnvelope(parsed);
        ScheduleCryptoTools.assertAvailable();
        const keyCache = options.keyCache || new Map();
        const declinedKeyIds = options.declinedKeyIds || new Set();
        const tryDecrypt = async privateKey => {
            const decrypted = await ScheduleCryptoTools.decryptEnvelope(parsed, privateKey);
            return parseScheduleJson(decrypted, true);
        };

        if (keyCache.has(header.kid)) {
            try {
                return await tryDecrypt(keyCache.get(header.kid));
            } catch (error) {
                if (error.code !== "DECRYPT_FAILED") throw error;
                // 此密钥此前已成功解密相同 kid；当前文件失败只能单独视为损坏，保留缓存供后续文件使用。
                throw error;
            }
        }

        const currentKeyPair = getGMValue(ScheduleCryptoTools.storageKey);
        if (currentKeyPair?.privateKey && (!currentKeyPair.keyId || currentKeyPair.keyId === header.kid)) {
            try {
                const currentPrivateKey = await ScheduleCryptoTools.importPrivateKey(currentKeyPair.privateKey);
                const schedule = await tryDecrypt(currentPrivateKey);
                keyCache.set(header.kid, currentPrivateKey);
                return schedule;
            } catch (error) {
                if (error.code !== "DECRYPT_FAILED" && error.code !== "INVALID_KEY") throw error;
                // 当前解密密钥不匹配或文件已损坏，继续请求用户提供对应解密密钥。
            }
        }

        if (declinedKeyIds.has(header.kid)) {
            throw scheduleOperationError("KEY_REQUIRED", "未提供对应解密密钥，该文件已跳过");
        }
        while (true) {
            const provided = await requestScheduleKey("private", { filename: options.filename });
            if (!provided) {
                declinedKeyIds.add(header.kid);
                throw scheduleOperationError("KEY_REQUIRED", "未提供对应解密密钥，该文件已跳过");
            }
            try {
                const privateKey = provided.importedKey;
                const schedule = await tryDecrypt(privateKey);
                keyCache.set(header.kid, privateKey);
                return schedule;
            } catch (error) {
                if (error.code !== "DECRYPT_FAILED") throw error;
                createToast("error", error.message || "解密密钥不匹配或文件已损坏", 4);
            }
        }
    }

    function extractIcsId(payload) {
        const visited = new Set();
        const candidates = new Set();
        const preferredKeys = /^(?:icsId|icsid|shareId|shareid|calendarId|calendarid|calUrl|calurl|shareUrl|shareurl|url)$/;

        function walk(value, key = "") {
            if (typeof value === "string") {
                const normalizedValue = value.replace(/\\\//g, "/");
                const urlMatch = normalizedValue.match(/portal\.nxu\.edu\.cn\/cal\/(\d{6,})/i);
                if (urlMatch) return urlMatch[1];
                if (preferredKeys.test(key) && /^\d{6,}$/.test(value.trim())) return value.trim();
                if (/^\d{6,}$/.test(value.trim()) && !["20284725165199735", "1384527242405474304"].includes(value.trim())) {
                    candidates.add(value.trim());
                }
                if (/^[\[{]/.test(value.trim())) {
                    try {
                        return walk(JSON.parse(value), key);
                    } catch (error) {
                        return "";
                    }
                }
                return "";
            }
            if (!value || typeof value !== "object" || visited.has(value)) return "";
            visited.add(value);
            if (Array.isArray(value)) {
                for (const item of value) {
                    const id = walk(item, key);
                    if (id) return id;
                }
                return "";
            }
            for (const [itemKey, itemValue] of Object.entries(value)) {
                const id = walk(itemValue, itemKey);
                if (id) return id;
            }
            return "";
        }

        if (typeof payload === "string") {
            const raw = payload.replace(/\\\//g, "/");
            const urlMatch = raw.match(/portal\.nxu\.edu\.cn\/cal\/(\d{6,})/i);
            if (urlMatch) return urlMatch[1];
            const fieldMatch = raw.match(/"(?:icsId|icsid|shareId|shareid|calendarId|calendarid|data)"\s*:\s*"?(\d{6,})"?/i);
            if (fieldMatch && !["20284725165199735", "1384527242405474304"].includes(fieldMatch[1])) return fieldMatch[1];
        }
        const result = walk(payload);
        return result || (candidates.size === 1 ? [...candidates][0] : "");
    }

    async function getIcsId() {
        const response = await fetch("https://webvpn.nxu.edu.cn/https/77726476706e69737468656265737421e0f85388263c265e661dc7a99c406d36de/execCardMethod/20284725165199735/SYS_CARD_CALENDAR", {
            method: "POST",
            credentials: "include",
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                cardId: "SYS_CARD_CALENDAR",
                cardWid: "20284725165199735",
                method: "share",
                param: { calId: "1384527242405474304", lang: "zh_CN" },
                n: String(Math.random())
            })
        });
        if (!response.ok) throw new Error(`个人课表 ID 获取失败：HTTP ${response.status}`);
        const responseText = await response.text();
        let payload = responseText;
        try {
            payload = JSON.parse(responseText);
        } catch (error) {
            // 部分门户版本直接返回分享链接文本。
        }
        const icsId = extractIcsId(responseText) || extractIcsId(payload);
        if (!icsId) throw new Error("响应中未找到个人课表 ID，请确认信息门户登录状态");
        GM_setValue("icsId", icsId);
        return icsId;
    }

    async function getStudentOwner(studentId) {
        const normalizedId = String(studentId || "").trim();
        const response = await fetch("https://webvpn.nxu.edu.cn/https/77726476706e69737468656265737421e8e4478b693e7045300d8db9d6562d/xsfw/sys/jbxxapp/modules/infoStudent/getStuBaseInfo.do?vpn-12-o2-xsfw.nxu.edu.cn", {
            method: "POST",
            credentials: "include",
            headers: { Accept: "application/json, text/plain, */*" },
            body: new URLSearchParams({ requestParamStr: JSON.stringify({ XSBH: normalizedId }) })
        });
        if (!response.ok) throw new Error(`身份信息获取失败：HTTP ${response.status}`);
        const result = await response.json();
        if (result?.returnCode !== "#E000000000000") {
            const error = new Error(result?.returnMessage || result?.message || "学号与当前登录账号不一致");
            error.code = "STUDENT_ID_MISMATCH";
            throw error;
        }
        const owner = {
            id: String(result.data?.XSBH || "").trim(),
            name: String(result.data?.XM || "").trim()
        };
        if (!owner.id || !owner.name || owner.id !== normalizedId) {
            const error = new Error("返回的身份信息与输入学号不一致");
            error.code = "STUDENT_ID_MISMATCH";
            throw error;
        }
        return owner;
    }
    // /==Constant==

    // ==Function==
    // 模拟点击（click无效时）
    function simulateClick(el, needScroll = false) {
        // 先滚动到可见区域（避免被遮挡）
        if (needScroll) {
            el.scrollIntoView({ behavior: 'auto', block: 'center' });
        }

        const events = ['mousedown', 'mouseup', 'click'];
        for (const type of events) {
            const event = new MouseEvent(type, {
                view: unsafeWindow,
                bubbles: true,
                cancelable: true,
                button: 0,          // 左键
                buttons: 1,
                pointerId: 1,
                pressure: 0.5,
                isPrimary: true
            });
            el.dispatchEvent(event);
        }

        // 额外触发 focus（某些按钮需要先聚焦）
        el.focus();
    }

    // 识别验证码
    async function GetVerificationCode(web) {
        let url = "";
        switch (web) {
            case "WebVPN":
                url = "https://webvpn.nxu.edu.cn/https/77726476706e69737468656265737421f9f352d229287d1e7b0c9ce29b5b/authserver/captcha.html?vpn-1&ts=225";
                break;
            case "Jwgl":
                url = new URL("captcha/image.action", window.location.href).href;
                break;
            case "TuanWei":
                url = "https://tuanwei.nxu.edu.cn/system/resource/js/filedownload/createimage.jsp";
                break;
            default:
                // 不匹配时返回一个拒绝的 Promise，避免调用者无感知
                throw new Error(`Unsupported web type: ${web}`);
        }

        MyConsole("[OCR] 开始加载验证码图片", { source: web, url });

        const tesseract = AddTesseract();
        let worker;
        try {
            worker = await tesseract.createWorker('eng', 1, {
                logger: (m) => {
                    if (LoadMessage[m.status]) {
                        MyConsole("[OCR] 识别进度", {
                            source: web,
                            status: LoadMessage[m.status],
                            progress: Number(m.progress || 0)
                        }, "debug");
                    }
                    if ((m.progress == 0)) {
                        createToast("info", LoadMessage[m.status], 0);
                    } else if (m.progress == 1) {
                        createToast("success", `完成`, 0);
                    }
                },
            });
            const ret = await worker.recognize(url);
            const code = ret.data.text.replace(/\s+/g, '');
            if (!code) {
                throw scheduleOperationError("OCR_EMPTY_RESULT", "验证码识别结果为空");
            }
            MyConsole("[OCR] 验证码识别完成", { source: web });
            return code;
        } finally {
            // 确保无论成功或失败，worker 都被终止，防止内存泄漏
            if (worker) {
                try {
                    await worker.terminate();
                } catch (error) {
                    MyConsole("[OCR] worker 清理失败", error, "warn");
                }
            }
        }
    }

    // 所有生产诊断统一经过此入口，既保留可追踪性，也集中约束敏感信息。
    function MyConsole(message, detail = "", level = "log") {
        const methodName = ["debug", "info", "warn", "error", "log"].includes(level) ? level : "log";
        const write = typeof console[methodName] === "function" ? console[methodName].bind(console) : console.log.bind(console);
        const timestamp = new Date().toLocaleTimeString("zh-CN", { hour12: false });
        const isObjectMessage = message !== null && typeof message === "object";
        const messageText = isObjectMessage ? "[详情] 输出对象" : String(message ?? "");
        write(
            "%c Better NXU %c %s",
            "border-radius:5px;padding:3px 5px;color:#fff;background:#3a8bff;font-weight:600",
            "margin-left:6px;color:inherit",
            `[${timestamp}] ${messageText}`
        );
        if (isObjectMessage) write(sanitizeConsoleDetail(message));
        if (detail !== "" && detail !== undefined) write("详细信息：", sanitizeConsoleDetail(detail));
    }

    function sanitizeConsoleDetail(value) {
        if (value instanceof Error) {
            return {
                name: value.name,
                code: value.code,
                message: value.message,
                stack: value.stack
            };
        }
        if (value === null || typeof value !== "object") return value;
        const seen = new WeakSet();
        try {
            return JSON.parse(JSON.stringify(value, (key, item) => {
                if (/(?:password|passwd|secret|privateKey|credential|authorization|cookie|token|密码|私钥)/i.test(key)) {
                    return "[已隐藏]";
                }
                if (item instanceof Error) {
                    return { name: item.name, code: item.code, message: item.message, stack: item.stack };
                }
                if (item && typeof item === "object") {
                    if (seen.has(item)) return "[循环引用]";
                    seen.add(item);
                }
                return item;
            }));
        } catch (error) {
            return "[详情无法序列化]";
        }
    }

    // 检查账号密码是否配置
    function CheckUsernameAndSecret(web) {
        const username = getGMValue(web + ".username");
        const password = getGMValue(web + ".password");
        if (!username || !password) {
            MyConsole(`[配置][${web}] 未配置登录账号或密码`, "请前往 Better NXU 设置页面补充", "warn");
            createToast("error", `
                    <p style="margin-bottom:0.5em;margin-top: 0">账号密码未配置<br>请前往配置相关信息</p>
                    <a href="javascript:void(0)" onclick="betterNXUOpenTab('settings')" style="font-weight:bold;font-size:small">> 前往配置 <</a>
                `, 0);
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
                    MyConsole("[等待] 定时任务完成", waitmsg.replace(/ /g, ""), "debug");
                }
                resolve();
            }, waittime);
        });
    }

    // DOM 等待必须有超时；页面重入或登录失败时不能永久占用定时器。
    async function waitForElement(selector, options = {}) {
        const timeout = Math.max(0, Number(options.timeout ?? 10000));
        const interval = Math.max(20, Number(options.interval ?? 100));
        const predicate = typeof options.predicate === "function" ? options.predicate : () => true;
        const startedAt = Date.now();
        while (Date.now() - startedAt <= timeout) {
            const element = document.querySelector(selector);
            if (element && predicate(element)) return element;
            await WaitTime(interval, 0, false);
        }
        MyConsole("[DOM 等待] 目标元素等待超时", { selector, timeoutMs: timeout }, "warn");
        throw scheduleOperationError("WAIT_TIMEOUT", `等待页面元素超时：${selector}`);
    }

    function fillControlledInput(input, value) {
        if (!input) return false;
        input.removeAttribute("readonly");
        input.focus?.();
        input.value = String(value ?? "");
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
        return true;
    }

    function getAuthErrorText() {
        for (const selector of ["span#msg.auth_error", "#showErrorTip span", "#showErrorTip", ".form-error"]) {
            const text = document.querySelector(selector)?.textContent.trim();
            if (text) return text;
        }
        return "";
    }

    function hasLegacyAuthCaptcha() {
        if (document.querySelector("#captchaSwitch")?.value === "1") return true;
        const container = document.querySelector("p#cpatchaDiv, #cpatchaDiv");
        if (container?.textContent.trim()) return true;
        const input = document.querySelector("input#captchaResponse");
        return Boolean(input && input.type !== "hidden" && input.offsetParent !== null);
    }

    function injectAuthFillHelper() {
        if (document.getElementById("better-nxu-auth-fill")) return;
        const username = getGMValue("WebVPN.username");
        const password = getGMValue("WebVPN.password");
        if (!hasLoginCredentials(username, password) || !document.body) return;
        const button = document.createElement("button");
        button.id = "better-nxu-auth-fill";
        button.type = "button";
        button.textContent = "Better NXU · 填入已保存账号";
        button.style.cssText = "position:fixed;right:16px;bottom:20px;z-index:99999;padding:9px 12px;border:1px solid #2878d7;border-radius:4px;background:#3a8bff;color:#fff;font-size:14px;cursor:pointer;box-shadow:0 3px 10px rgba(0,0,0,.18);";
        button.addEventListener("click", () => {
            const usernameInput = document.querySelector(
                "#pwdFromId #username, .login-main .m-account #username, input#username"
            );
            const passwordInput = document.querySelector(
                "#pwdFromId #password, .login-main .m-account #password, input#password"
            );
            if (!usernameInput || !passwordInput) {
                createToast("error", "未找到统一认证登录框，请手动输入", 4);
                return;
            }
            fillControlledInput(usernameInput, username);
            fillControlledInput(passwordInput, password);
            createToast("success", "账号已填入，请手动完成登录验证", 4);
        });
        document.body.appendChild(button);
    }

    let authLoginSubmitting = false;

    async function routeAuthLogin() {
        Basic({ vant: false });
        if (getGMValue("WebVPN.autoLogin")) {
            await webvpnLogin();
        } else {
            MyConsole("[统一认证] 自动登录未启用");
            injectAuthFillHelper();
        }
    }

    function qualityUnavailable() {
        const message = "评教自动填写功能暂未实现，请手动完成当前页面操作。";
        if (typeof createToast === "function") {
            createToast("info", message, 5);
        } else {
            window.alert(message);
        }
    }

    function escapeHtml(value) {
        return String(value || "").replace(/[&<>"']/g, character => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[character]));
    }

    function renderMarkdownSafely(target, markdown) {
        if (!target) return;
        const source = String(markdown || "");
        const html = typeof globalThis.marked?.parse === "function"
            ? globalThis.marked.parse(source)
            : source.replace(/[&<>]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[character]));
        const parsed = new DOMParser().parseFromString(String(html), "text/html");
        const allowedTags = new Set(["A", "BLOCKQUOTE", "BR", "CODE", "EM", "H1", "H2", "H3", "H4", "LI", "OL", "P", "PRE", "STRONG", "UL"]);
        const allowedAttributes = new Set(["class", "href", "rel", "target"]);
        for (const element of [...parsed.body.querySelectorAll("*")]) {
            if (!allowedTags.has(element.tagName)) {
                element.replaceWith(document.createTextNode(element.textContent || ""));
                continue;
            }
            for (const attribute of [...element.attributes]) {
                if (!allowedAttributes.has(attribute.name.toLowerCase())) element.removeAttribute(attribute.name);
            }
            if (element.tagName === "A") {
                const href = element.getAttribute("href") || "";
                if (!/^https?:\/\//i.test(href)) element.removeAttribute("href");
                element.setAttribute("rel", "noopener noreferrer");
                element.setAttribute("target", "_blank");
            }
        }
        target.replaceChildren(...[...parsed.body.childNodes].map(node => document.importNode(node, true)));
    }

    // 关闭当前页面
    function CloseWin() {
        try {
            window.opener = window;
            var win = window.open("", "_self");
            win.close();
            top.close();
        } catch (e) {
            void e;
        }
    }
    // /==Function==

    MyConsole("[初始化] Better NXU 开始运行");
    MyConsole("[初始化] ScriptCat 脚本元信息", Info, "debug");
    // 确保页面完全加载
    MyConsole("[初始化] 等待页面加载完成");
    while (document.readyState != "complete") {
        await WaitTime(500);
    }
    // 对于旧版本进行配置重配置
    MyConsole("[路由] 开始识别当前页面", { host: Host, path: Path });
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    const vpnContext = parseWebVpnContext(Url);
    const potalSwitchToFunc = () => {
        const currentContext = parseWebVpnContext(window.location.href);
        const currentPath = currentContext?.realHost === "portal.nxu.edu.cn"
            ? currentContext.realPath
            : window.location.pathname;
        const currentUrl = window.location.href;
        if (currentPath == '/index.html' || currentPath == '/default/index.html') {
            MyConsole("[路由][信息门户] 识别到门户主页");
            if (currentUrl.indexOf('#/hall') != -1) {
                MyConsole("[路由][信息门户] 进入应用中心");
                Basic();
                portalApp();
            }
        }
    }
    switch (Host) {
        case 'open.weixin.qq.com':
            if (Url.indexOf("nxu.edu") == -1) {
                return;
            }
            MyConsole("[路由][微信登录] 进入授权页面");
            if (GetQuery('fast_login') == 0) {
                location.href = Url.replace("fast_login=0", "fast_login=1")
            }
            Basic({ vant: false });
            weixinLogin();
            break;
        case 'webvpn.nxu.edu.cn':
            MyConsole("[路由][WebVPN] 进入 WebVPN 域名");
            if (isWebVpnRealHost(vpnContext, "jwgl.nxu.edu.cn") || isWebVpnRealHost(vpnContext, "202.201.128.234")) {
                const jwglPath = vpnContext.realPath;
                MyConsole("[路由][WebVPN][教务] 识别到教务代理页面");
                if (jwglPath.indexOf('index.action') != -1 || jwglPath.indexOf('login.action') != -1) {
                    MyConsole("[路由][WebVPN][教务] 进入登录页");
                    Basic();
                    jwglLogin();
                } else if (jwglPath.indexOf('cas.action') != -1 || jwglPath.indexOf('home.action') != -1) {
                    MyConsole("[路由][WebVPN][教务] 进入主页");
                    Basic();
                    jwglMain();
                } else if (jwglPath.indexOf('courseTableForStd.action') != -1 && GetQuery('method') == 'stdHome') {
                    MyConsole("[路由][WebVPN][教务] 进入课表容器页");
                    Basic();
                    jwglCourseIframe();
                } else if (jwglPath.indexOf('courseTableForStd.action') != -1 && GetQuery('method') == 'courseTable') {
                    MyConsole("[路由][WebVPN][教务] 进入课表内容页");
                    AddVant();
                    jwglCourseBeautify();
                }
            } else if (((isWebVpnRealHost(vpnContext, "ids.nxu.edu.cn") && vpnContext.realPath.indexOf('/authserver/login') != -1) ||
                Url.indexOf("service=https%3A%2F%2Fwebvpn.nxu.edu.cn%2Flogin%3Fcas_login%3Dtrue") != -1 || Url.indexOf('/authserver/login') != -1 || Url.indexOf('login') != -1) &&
                (Url.indexOf('nonlogin') == -1 && Url.indexOf('connect/qrconnect') == -1 && Url.indexOf('reAuthCheck') == -1) && Url.indexOf("/77726476706e69737468656265737421a1a70fcd777e39022646dbfcce/#/pages/login/caslogin") == -1 && Url.indexOf("/77726476706e69737468656265737421e3ee529d367e66486b468ca88d1b203b/") == -1) {
                MyConsole("[路由][WebVPN] 进入登录页");
                await routeAuthLogin();
            } else if ((isWebVpnRealHost(vpnContext, "ids.nxu.edu.cn") && vpnContext.realPath.indexOf('/authserver/reAuthCheck/') != -1) || Url.indexOf('/authserver/reAuthCheck/') != -1) {
                MyConsole("[路由][WebVPN] 进入二次确认页");
                Basic({ vant: false });
                webvpnCheck();
            } else if (isWebVpnRealHost(vpnContext, "open.weixin.qq.com")) {
                MyConsole("[路由][WebVPN] 进入微信扫码页");
                Basic({ vant: false });
                webvpnReLogin();
            } else if (Url == 'https://webvpn.nxu.edu.cn/' || Path == "/") {
                MyConsole("[路由][WebVPN] 进入主页");
                Basic();
                webvpnMain();
            } else if (isWebVpnRealHost(vpnContext, "xsfw.nxu.edu.cn")) {
                MyConsole("[路由][WebVPN] 进入学工系统");
            } else if (isWebVpnRealHost(vpnContext, "kns.cnki.net") || isWebVpnRealHost(vpnContext, "www.cnki.net")) {
                MyConsole("[路由][WebVPN] 进入中国知网页面");
                if (vpnContext.realPath.indexOf('/xmlRead/trialRead') != -1) {
                    Basic();
                    MyConsole("[路由][中国知网] 进入 HTML 阅读页");
                    webvpnCnkiHtml();
                }
            } else if (isWebVpnRealHost(vpnContext, "f.wanfangdata.com.cn") && vpnContext.realPath.indexOf('/online/pc/periodical_html') != -1) {
                Basic();
                MyConsole("[路由][万方] 进入期刊 HTML 阅读页");
                webvpnCnkiHtml();
            } else if (Path == '/wengine-vpn/failed') {
                if (document.body.innerHTML.indexOf('地址：/h/tools') != -1) {
                    MyConsole("[路由][WebVPN] 进入 Better NXU 小工具页");
                    Basic();
                    webvpnHTools();
                } else {
                    MyConsole("[路由][WebVPN] 进入未识别的失败页", "按错误页配置处理", "warn");
                    errorHtml();
                }
            } else if (isWebVpnRealHost(vpnContext, "sysaq.nxu.edu.cn")) {
                MyConsole("[路由][WebVPN] 识别到实验室安全教育平台");
                if (vpnContext.realPath == "/lab-platform/") {
                    MyConsole("[路由][WebVPN][实验室安全] 进入登录页");
                    AddNotification()
                    sysaqLogin();
                } else if (vpnContext.realPath.indexOf("/lab-platform/login") != -1) {
                    MyConsole("[路由][WebVPN][实验室安全] 进入认证页");
                    AddNotification()
                    sysaqAuth();
                }
            } else if (isWebVpnRealHost(vpnContext, "portal.nxu.edu.cn")) {
                MyConsole("[路由][WebVPN] 识别到新版信息门户");

                potalSwitchToFunc()

                history.pushState = function (...args) {
                    // 调用原始方法，先更新URL
                    const result = originalPushState.apply(this, args);
                    // 触发你的自定义逻辑
                    potalSwitchToFunc()
                    return result;
                };

                history.replaceState = function (...args) {
                    const result = originalReplaceState.apply(this, args);
                    potalSwitchToFunc()
                    return result;
                };

                // --- 3. 监听 popstate 事件，处理浏览器的前进/后退 ---
                window.addEventListener('popstate', () => potalSwitchToFunc());
            } else {
                if (document.querySelector("h1") && (document.querySelector("h1").innerHTML == `404页面不存在`)) {
                    errorHtml();
                }
            }
            break;
        case 'sslvpn.nxu.edu.cn':
            MyConsole("[路由][sslvpn] 进入客户端版SSLVPN（渲染Better NXU页面）");
            if (Path == '/h/settings') {
                MyConsole("[路由][sslvpn] 进入 Better NXU 设置页");
                Basic();
                webvpnHSettings();
            } else if (Path == '/h/about') {
                MyConsole("[路由][sslvpn] 进入 Better NXU 关于页");
                Basic();
                webvpnHAbout();
            }
            break;
        case 'jsfzyjxzlxt.nxu.edu.cn':
            MyConsole("[路由][评教] 进入评教系统");
            if (Path == "/quality/student/evaluate/item_tasks") {
                MyConsole("[路由][评教] 进入任务选择页");
                qualityUnavailable();
            } else if (Path == "/quality/student/evaluate/item_tasks_text") {
                MyConsole("[路由][评教] 进入评价填写页");
                qualityUnavailable();
            }
            break;
        case 'jwgl.nxu.edu.cn':
            MyConsole("[路由][教务] 进入直连教务系统");
            if (Path == '/index.action' || Path == '/login.action') {
                MyConsole("[路由][教务] 进入登录页");
                Basic();
                jwglLogin();
            } else if (Url.indexOf('cas.action') != -1 || Url.indexOf('home.action') != -1) {
                MyConsole("[路由][教务] 进入主页");
                Basic();
                jwglMain();
            } else if (Url.indexOf('courseTableForStd.action') != -1 && GetQuery('method') == 'stdHome') {
                MyConsole("[路由][教务] 进入课表容器页");
                Basic();
                jwglCourseIframe();
            } else if (Url.indexOf('courseTableForStd.action') != -1 && GetQuery('method') == 'courseTable') {
                MyConsole("[路由][教务] 进入课表内容页");
                AddVant();
                jwglCourseBeautify();
            }
            break;
        case 'ids.nxu.edu.cn':
            MyConsole("[路由][统一认证] 进入认证系统");
            if (Path.indexOf("/authserver/login") != -1) {
                MyConsole("[路由][统一认证] 进入登录页");
                await routeAuthLogin();
            } else if (Url.indexOf('/authserver/reAuthCheck/') != -1) {
                MyConsole("[路由][统一认证] 进入二次确认页");
                Basic({ vant: false });
                webvpnCheck();
            } else if (Url.indexOf('/77726476706e69737468656265737421ffe7449269276d59660187e289446d36a8d6/connect/qrconnect') != -1) {
                MyConsole("[路由][统一认证] 进入微信扫码页");
                Basic({ vant: false });
                webvpnReLogin();
            } else if (Path == ('/authserver/callback')) {
                MyConsole("[路由][统一认证] 进入微信回调页");
                Basic({ vant: false });
                idsReLogin();
            }
            break;
        case 'portal.nxu.edu.cn':
            MyConsole("[路由][信息门户] 进入新版门户域名");
            potalSwitchToFunc()

            history.pushState = function (...args) {
                // 调用原始方法，先更新URL
                const result = originalPushState.apply(this, args);
                // 触发你的自定义逻辑
                potalSwitchToFunc()
                return result;
            };

            history.replaceState = function (...args) {
                const result = originalReplaceState.apply(this, args);
                potalSwitchToFunc()
                return result;
            };

            // --- 3. 监听 popstate 事件，处理浏览器的前进/后退 ---
            window.addEventListener('popstate', () => potalSwitchToFunc());
            break;
        case 'sysaq.nxu.edu.cn':
            MyConsole("[路由][实验室安全] 进入平台域名");
            if (Path == "/lab-platform/") {
                MyConsole("[路由][实验室安全] 进入登录页");
                AddNotification()
                sysaqLogin();
            } else if (Path.indexOf("/lab-platform/login") != -1) {
                MyConsole("[路由][实验室安全] 进入认证页");
                AddNotification()
                sysaqAuth();
            }
            break;
        // case 'tuanwei.nxu.edu.cn':
        //     MyConsole("欢迎使用团委");
        //     if (Path == '/system/_content/download.jsp') {
        //         MyConsole("这里是 - 附件下载页");
        //         unsafeWindow.eval(GM_getResourceText("tesseract-webvpn").replace(/^vpn_eval\(\(function\(\)\{/, '').replace(/\}[\n\r]*\)\.toString\(\)\.slice\(12\,[\s]*\-2\)\,\"\"\)\;$/, ''));
        //         Basic();
        //         tuanweiDownload();
        //     // } else if (Path == '/info/1003/1022.htm') {
        //     } else {
        //         tuanweiDownloadBridge();
        //     }
        //     break;
        default:
            if (Host.indexOf('202.201.128.234') != -1) {
                MyConsole("[路由][教务] 进入 IP 直连教务系统");
                if (Path == '/index.action' || Path == '/login.action') {
                    MyConsole("[路由][教务][IP 直连] 进入登录页");
                    Basic();
                    jwglLogin();
                } else if (Url.indexOf('cas.action') != -1 || Url.indexOf('home.action') != -1) {
                    MyConsole("[路由][教务][IP 直连] 进入主页");
                    Basic();
                    jwglMain();
                } else if (Url.indexOf('courseTableForStd.action') != -1 && GetQuery('method') == 'stdHome') {
                    MyConsole("[路由][教务][IP 直连] 进入课表容器页");
                    Basic();
                    jwglCourseIframe();
                } else if (Url.indexOf('courseTableForStd.action') != -1 && GetQuery('method') == 'courseTable') {
                    MyConsole("[路由][教务][IP 直连] 进入课表内容页");
                    AddVant();
                    jwglCourseBeautify();
                }
            }
            return;
    }
    return;

    async function weixinLogin() {
        try {
            const container = await waitForElement('.js_quick_login', {
                predicate: element => element.querySelector('button')
            });
            const visible = await waitForElement('.js_quick_login', {
                timeout: 10000,
                predicate: element => element.style.display !== 'none'
            });
            visible.querySelector('button').click();
        } catch (error) {
            createToast("error", error.message || "微信登录入口加载失败，请手动操作", 4);
        }
    }

    async function webvpnLogin() {
        if (!getGMValue("WebVPN.autoLogin")) {
            return;
        }
        if (authLoginSubmitting) {
            MyConsole("[统一认证] 已触发登录，忽略重复调用", "", "debug");
            return;
        }
        createToast("info", "正在填写统一认证登录信息…", 3);
        if (!CheckUsernameAndSecret("WebVPN")) {
            return;
        }
        const authErrorText = getAuthErrorText();
        if (authErrorText) {
            if (/用户名|账号|密码/.test(authErrorText) && /错误|有误|不存在|失败/.test(authErrorText)) {
                createToast("error", `
                    <p style="margin-bottom:0.5em;margin-top: 0">账号密码配置错误<br>请前往配置相关信息</p>
                    <a href="javascript:void(0)" onclick="betterNXUOpenTab('settings')" style="font-weight:bold;font-size:small">&gt; 前往设置 &lt;</a>
                `);
            } else {
                createToast("error", `<p>${escapeHtml(authErrorText)}</p>`, 5);
            }
            return;
        }
        try {
            const usernameInput = await waitForElement(
                "#pwdFromId #username, .login-main .m-account #username, input#username",
                { timeout: 12000 }
            );
            const passwordInput = await waitForElement(
                "#pwdFromId #password, .login-main .m-account #password, input#password",
                { timeout: 12000 }
            );
            const username = String(getGMValue("WebVPN.username") || "");
            const password = String(getGMValue("WebVPN.password") || "");
            fillControlledInput(usernameInput, username);
            fillControlledInput(passwordInput, password);
            const rememberInput = document.querySelector(
                "input#rememberMe, input#myRememberMe, input[name=rememberMe]"
            );
            if (rememberInput) {
                rememberInput.checked = true;
                rememberInput.value = "true";
                rememberInput.dispatchEvent(new Event("change", { bubbles: true }));
            }
            if (hasLegacyAuthCaptcha()) {
                createToast("warning", "账号已填入，请手动输入图形验证码后登录", 0);
                return;
            }

            const submitButton = document.querySelector(
                "a#login_submit, #pwdFromId a.login-btn, button[type=submit], input[type=submit]"
            );
            authLoginSubmitting = true;
            if (typeof unsafeWindow.startLogin === "function" && submitButton) {
                await Promise.resolve(unsafeWindow.startLogin(submitButton));
            } else if (submitButton) {
                submitButton.click();
            } else if (typeof unsafeWindow.checkForm === "function") {
                const valid = await Promise.resolve(unsafeWindow.checkForm());
                if (valid === false) {
                    authLoginSubmitting = false;
                    return;
                }
                const form = document.querySelector("#pwdFromId, .login-main form");
                if (typeof form?.requestSubmit !== "function") {
                    throw scheduleOperationError("AUTH_SUBMIT_MISSING", "统一认证页面缺少安全提交入口");
                }
                form.requestSubmit();
            } else {
                throw scheduleOperationError("AUTH_SUBMIT_MISSING", "统一认证登录按钮尚未加载");
            }

            setTimeout(() => {
                const slider = document.querySelector(
                    "#captcha-id, #sliderCaptchaDiv, #sliderDiv, .slidercaptcha"
                );
                if (slider && slider.offsetParent !== null && slider.innerHTML != "") {
                    createToast("warning", "请手动完成滑块验证", 0);
                }
            }, 800);
        } catch (error) {
            authLoginSubmitting = false;
            MyConsole("[统一认证] 自动登录失败", error, "error");
            createToast("error", "统一认证自动登录失败，请手动操作", 5);
        }
    }

    async function webvpnCheck() {
        if (!getGMValue("WebVPN.autoReLogin")) {
            return;
        }
        createToast("info", `尝试自动登录...`);
        unsafeWindow.reAuthByCombined('weixin')
    }

    async function webvpnReLogin() {
        if (!getGMValue("WebVPN.autoReLogin")) {
            return;
        }
        createToast("info", `尝试自动登录...`);
        const target = new URL("https://open.weixin.qq.com/connect/qrconnect");
        target.searchParams.set("appid", GetQuery("appid") || "");
        target.searchParams.set("redirect_uri", "https://ids.nxu.edu.cn/authserver/callback");
        target.searchParams.set("response_type", "code");
        target.searchParams.set("scope", "snsapi_login");
        target.searchParams.set("state", GetQuery("state") || "");
        target.searchParams.set("fast_login", "1");
        location.href = target.href;
    }

    async function idsReLogin() {
        const warning = document.querySelector("#welcome.warn");
        if (!warning || !warning.textContent.includes("授权失败")) {
            return
        }
        createToast("info", `请稍候...`);
        createToast("info", `尝试跳转至正确页面`);
        const callback = new URL("https://ids.nxu.edu.cn/authserver/callback");
        callback.searchParams.set("code", GetQuery("code") || "");
        callback.searchParams.set("state", GetQuery("state") || "");
        const callbackUrl = buildWebVpnUrl(callback);
        if (!callbackUrl) {
            createToast("error", "无法生成统一认证回调地址，请手动返回 WebVPN", 5);
            return;
        }
        location.href = callbackUrl;
    }

    async function jwglLogin() {
        if (!getGMValue("Jwgl.autoLogin")) {
            return;
        }
        createToast("info", `自动登录...`, 3);
        if (!CheckUsernameAndSecret("Jwgl")) {
            return;
        }
        if (document.querySelector('div#errors.message')?.textContent.trim()) {
            const errorText = document.querySelector('div#errors.message').textContent.trim();
            if (errorText == "密码错误" || errorText == "账户不存在") {
                createToast("error", `
                    <p style="margin-bottom:0.5em;margin-top: 0">账号密码配置错误<br>请前往配置相关信息</p>
                    <a href="javascript:void(0)" onclick="CAT_userConfig()" style="font-weight:bold;font-size:small">> 前往配置 <</a>
                `);
                return;
            }
        }
        // 可能是网络问题，部分时候下载很慢
        const recognitionToast = createToast("info", `正在识别验证码，首次使用需下载识别模型，请耐心等待...`, 0);
        try {
            const verification = await GetVerificationCode("Jwgl");
            const usernameInput = document.getElementsByName("loginForm.name")[0];
            const passwordInput = document.getElementsByName("loginForm.password")[0];
            const captchaInput = document.getElementsByName("loginForm.captcha")[0];
            const submitButton = document.querySelector("input#loginSubmit");
            if (!usernameInput || !passwordInput || !captchaInput || !submitButton) {
                throw scheduleOperationError("JWGL_LOGIN_FORM_MISSING", "教务登录表单结构已变化");
            }
            usernameInput.value = getGMValue("Jwgl.username");
            passwordInput.value = getGMValue("Jwgl.password");
            captchaInput.value = verification;
            submitButton.click();
        } catch (error) {
            MyConsole("[教务登录] 自动填写失败", error, "error");
            createToast("error", "验证码识别失败，请手动输入后登录", 5);
        } finally {
            removeToast(recognitionToast);
        }
    }

    async function webvpnMain() {
        // 页面有渲染时间，确保元素渲染完成
        try {
            await waitForElement("div[title=教务管理平台]", {
                timeout: 15000,
                predicate: element => element.textContent.trim().length > 0
            });
        } catch (error) {
            createToast("error", error.message || "主页加载超时，请刷新后重试", 4);
            return;
        }

        GM_addStyle(`
            html {
                overflow: hidden;
            }

            .better-nxu-style-hidden {
                display: none!important;
            }

            .better-nxu-style-height-full {
                height: 100%!important;
            }

            .better-nxu-style-floating-bubble {
                white-space: pre-wrap;
                word-break: break-word;
                font-size: 12px;
                font-weight: bold;
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
            }
        `)

        const firstSet = getGMValue('firstSet');
        const configVersion = normalizeConfigVersion(getGMValue('configVersion'));
        // createToast("success", "测试消息", 0);

        //更新配置弹窗
        MyConsole("[配置] 检查首次配置与版本提示状态");
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
        } else if (configVersion < ConfigVersion) {
            update_template = `
                <van-dialog v-model:show="show" title="Better NXU 配置更新" show-cancel-button confirmButtonText="前往配置" cancelButtonText="稍后" @confirm="goConfig" @close="closeFunc" style="--van-dialog-font-size:1.5em;--van-dialog-header-padding-top:18px">
                    <div style="font-size: 16px;color:var(--van-dialog-has-title-message-text-color);margin: 0.5em 0;padding: 0 2em;display: flex;flex-direction: column;justify-content: center;">
                        <p style="text-align: center;line-height: 23px;">
                            <span style="font-weight:bold;">V ${Version}</span><br>
                            我们更新了一些配置信息<br>
                            建议前往配置页面查看新增或调整项<br>
                            也可以稍后从 Better NXU 设置中查看
                        </p>
                    </div>
                </van-dialog>
            `;
            update_show = true;
        }
        const float = `
            <van-floating-bubble class="better-nxu-style-floating-bubble" @click="changeSearch">
                {{ floatingBubbleContent }}
            </van-floating-bubble>
        `
        const update = Vue.createApp({
            template: update_template + float,
            setup() {
                const show = Vue.ref(false);
                show.value = update_show;
                const floatingBubbleContent = Vue.ref('关闭\n搜索栏')
                const searchDom = document.querySelector(".portal-search-wrap")
                const cardDom = document.querySelector(".portal-content")
                const closeSearch = () => {
                    searchDom.classList.add("better-nxu-style-hidden")
                    cardDom.classList.add("better-nxu-style-height-full")
                    floatingBubbleContent.value = "打开\n搜索栏"
                }
                const openSearch = () => {
                    searchDom.classList.remove("better-nxu-style-hidden")
                    cardDom.classList.remove("better-nxu-style-height-full")
                    floatingBubbleContent.value = '关闭\n搜索栏'
                }
                if (getGMValue("WebVPN.searchClose")) {
                    closeSearch()
                }
                const goConfig = () => {
                    openTab('settings')
                }
                const closeFunc = async () => {
                    await GM_setValue('firstSet', true);
                    await GM_setValue('configVersion', Math.max(configVersion, ConfigVersion));
                }
                const changeSearch = () => {
                    if (searchDom.classList.contains("better-nxu-style-hidden")) {
                        openSearch()
                    } else {
                        closeSearch()
                    }
                }
                return { show, goConfig, closeFunc, floatingBubbleContent, changeSearch };
            }
        });
        update.use(vant);
        update.mount("#update");

        // 添加 Better NXU 设置及下拉菜单
        unsafeWindow.betterNXUVersionClick = () => {
            fetch("https://v1.hitokoto.cn/", { credentials: "omit" })
                .then(response => {
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    return response.json();
                })
                .then(json => {
                    const text = json?.hitokoto ? `${json.hitokoto}\n——${json.from || ""}` : "之前点的太快啦，请稍后重试";
                    createToast("info", text, 3);
                })
                .catch(() => createToast("warning", "一言暂时不可用，请稍后重试", 3));
        }
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
                <li class="wrdvpn-navbar__user__menuitem"><a href="javascript:void(0)" onclick="betterNXUVersionClick()">V ${Version}</a></li>
                <li class="wrdvpn-navbar__user__menuitem"><a href="//sslvpn.nxu.edu.cn/h/settings" target="_blank">设置</a></li>
                <li class="wrdvpn-navbar__user__menuitem"><a href="//sslvpn.nxu.edu.cn/h/about" target="_blank">关于我们</a></li>
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

        if (getGMValue('WebVPN.courseGrab')) {
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
                const vpnLink = buildWebVpnUrl(`http://202.201.128.234:${8080 + i}/index.action`);
                if (!vpnLink) continue;
                classesDiv.appendChild(divCard(
                    vpnLink,
                    '<div class="block-group__item__logo" style="background-color: rgb(80, 135, 229);">抢</div>',
                    `备用${i + 5}`, "校外可用")
                );
            }
        }

        // 自定义工具与自定义卡片使用独立 data-id，避免重入时选择器歧义。
        if (getGMValue('WebVPN.customTool')) {
            mainDiv.prepend(titleCard("H - 小工具", "h-tools"));
            const customDiv = document.querySelector('div[data-id=h-tools] div.block-group__content');
            customDiv.appendChild(divCard(
                `https://webvpn.nxu.edu.cn/h/tools`,
                '<div class="block-group__item__logo" style="background-color: #4472c4;">工</div>',
                `站内小工具`, "一些方便的自制小工具")
            );
            customDiv.appendChild(divCard(
                `https://nxu-cdig.thisish.cn`,
                '<div class="block-group__item__logo" style="background-color: #95c2fb;">猫</div>',
                `猫狗图鉴`, "猫猫狗狗们的线上家园")
            );
            customDiv.appendChild(divCard(
                `https://campus-charge.thisish.cn/`,
                '<div class="block-group__item__logo" style="background-color: #95c2fb;">猫</div>',
                `NXU Charge`, "充电桩状态查看")
            );
        }

        //自定义卡片
        const webVPNCustomCard = getGMValue("WebVPN.customCard");
        if (webVPNCustomCard.length != 0) {
            mainDiv.prepend(titleCard("自定义", "custom-cards"));
            const customDiv = document.querySelector('div[data-id=custom-cards] div.block-group__content');
            if (webVPNCustomCard.indexOf('教务管理') != -1) {
                customDiv.appendChild(divCard(
                    buildWebVpnUrl("https://jwgl.nxu.edu.cn/cas.action", { forceHttps443: true }),
                    '<div class="block-group__item__logo" style="background-color: rgb(235, 94, 94);">教</div>',
                    `教务平台`, "教务管理平台")
                );
            }
            if (webVPNCustomCard.indexOf('学工系统') != -1) {
                customDiv.appendChild(divCard(
                    buildWebVpnUrl("https://xsfw.nxu.edu.cn/"),
                    '<div class="block-group__item__logo" style="background-color: #95c2fb;">学</div>',
                    `学工系统`, "学工平台")
                );
            }
            if (webVPNCustomCard.indexOf('信息门户') != -1) {
                customDiv.appendChild(divCard(
                    buildWebVpnUrl("https://eip.nxu.edu.cn/"),
                    '<div class="block-group__item__logo" style="background-color: #0966b5;">信</div>',
                    `信息门户（旧）`, "综合信息服务门户")
                );
            }
            if (webVPNCustomCard.indexOf('中国知网') != -1) {
                customDiv.appendChild(divCard(
                    buildWebVpnUrl("https://www.cnki.net/"),
                    '<div class="block-group__item__logo" style="background-color: #1b66e6;">知</div>',
                    `中国知网`, "中国期刊全文数据库")
                );
            }
            if (webVPNCustomCard.indexOf('万方数据') != -1) {
                customDiv.appendChild(divCard(
                    buildWebVpnUrl("https://www.wanfangdata.com.cn/"),
                    '<div class="block-group__item__logo" style="background-color: #00417e;">万</div>',
                    `万方数据`, "万方数据知识服务平台")
                );
            }
            // if (webVPNCustomCard.indexOf('H小工具') != -1) {
            //     customDiv.appendChild(divCard(
            //         `https://webvpn.nxu.edu.cn/h/tools`,
            //         '<div class="block-group__item__logo" style="background-color: #4472c4;">工</div>',
            //         `小工具 - H`, "一些方便的小工具 - H")
            //     );
            // }
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
        const jwglCustomMenu = getGMValue("Jwgl.customMenu");
        MyConsole("[教务菜单] 当前启用的自定义菜单", jwglCustomMenu, "debug")
        if (jwglCustomMenu.length != 0) {

            function addMenu(menu, menu_dd, href, content) {
                const menuCourseManage = document.querySelectorAll('div.layui-side.layui-bg-black.layuimini-menu-left li.layui-nav-item.menu-li');
                const menuContainer = menuCourseManage[menu];
                const menuDdMyGrade = menuContainer?.querySelectorAll('dd.menu-dd')[menu_dd];
                const menuList = menuContainer?.querySelector("dl");
                if (!menuContainer || !menuList) {
                    throw scheduleOperationError("MENU_TARGET_MISSING", "教务菜单结构已变化，未添加自定义入口");
                }
                var menu_dd_all_grade = document.createElement('dd');
                menu_dd_all_grade.className = 'menu-dd';
                menu_dd_all_grade.innerHTML = `
                    <a href="javascript:this.top.vpn_inject_script(this);vpn_eval((function () { ; }).toString().slice(14, -2))" layuimini-href="${href}" target="_self">
                        <i class="fa fa-file-text-o"></i>
                        <span class="layui-left-nav">${content}</span>
                    </a>
                `;
                menuList.insertBefore(menu_dd_all_grade, menuDdMyGrade || null);
            }

            try {
                await waitForElement('div.layui-side.layui-bg-black.layuimini-menu-left li.layui-nav-item.menu-li', {
                    timeout: 15000,
                    predicate: element => element.textContent.trim().length > 0
                });
                if (jwglCustomMenu.indexOf('全部学期成绩') != -1) {
                    addMenu(1, 4, 'personGrade.action?method=historyCourseGrade', '全部学期成绩');
                }
            } catch (error) {
                createToast("warning", error.message || "教务菜单加载超时，已跳过自定义菜单", 4);
            }
        }
    }

    async function jwglCourseIframe() {
        let iframe;
        try {
            iframe = await waitForElement("#contentListFrame", { timeout: 15000 });
            await waitForElement("#contentListFrame", {
                timeout: 15000,
                predicate: element => Boolean(element.contentWindow?.document)
            });
        } catch (error) {
            createToast("warning", error.message || "课表框架加载超时，请刷新后重试", 4);
            return;
        }
        const resize = () => {
            const iframeDocument = iframe.contentWindow?.document;
            if (!iframeDocument) return;
            const table = iframeDocument.querySelector("table");
            iframe.style.height = table ? `${table.scrollHeight + 100}px` : "100px";
        };
        resize();
        // 监听来自iframe的消息（切换个人和班级课表时触发）
        window.addEventListener('message', function (event) {
            if (event.data?.type === 'COURSE_BEAUTIFY_CHANGED') {
                resize();
            }
        });
    }

    function filterJwglCourseText(value) {
        return JWGL_COURSE_TEXT_FILTERS.reduce(
            (text, filter) => filter(text),
            String(value ?? "")
        );
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

        const export_template = `
            <div style="width:100%;display:flex;align-items: center;justify-content:center;gap:1em">
                H - 将课表导出为
                ${isWebvpn ? '' : '<van-button plain type="primary" size="small" onclick="hExportImage()">图片</van-button>'}
                <van-button plain type="primary" size="small" onclick="hExportJson()">json文件</van-button>
                <van-button plain type="primary" size="small" onclick="hExportExcel()">Excel表格</van-button>
            </div>
        `
        const exportOperation = Vue.createApp({
            template: export_template
        });
        exportOperation.use(vant);
        exportOperation.mount("#h-export");

        unsafeWindow.hExportImage = async () => {
            MyConsole("[教务课表][图片导出] 开始生成课表图片", "", "info");
            vant.showNotify({ type: 'primary', message: '正在生成课表图片' });
            try {
                const el = document.querySelector('table');
                await snapdom.download(el, {
                    format: 'png',
                    filename: window.top.document.querySelector(".layui-nav-item.layuimini-setting a")?.innerText || "课表",
                    scale: 2.5,
                    quality: 1
                });
                MyConsole("[教务课表][图片导出] 导出完成", "", "info");
                vant.showNotify({ type: 'success', message: '课表图片已导出' });
            } catch (error) {
                MyConsole("[教务课表][图片导出] 导出失败", error, "error");
                vant.showNotify({ type: 'danger', message: error.message || '课表图片导出失败' });
            }
        }

        unsafeWindow.hExportData = () => {
            // 兼容区间、离散周次以及单双周文本。
            function parseRangeString(str, filterType = null) {
                let result = [];
                const ranges = String(str || "").match(/\d+\s*-\s*\d+|\d+/g) || [];
                ranges.forEach(token => {
                    const values = token.split("-").map(Number);
                    if (values.length === 2) {
                        for (let week = values[0]; week <= values[1]; week++) result.push(week);
                    } else if (Number.isFinite(values[0])) {
                        result.push(values[0]);
                    }
                });

                if (filterType === "单") {
                    result = result.filter((num) => num % 2 !== 0);
                } else if (filterType === "双") {
                    result = result.filter((num) => num % 2 === 0);
                }

                return new Set(result.filter(week => week > 0));
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

            const entries = [];
            const numberJson = {
                一: 1,
                二: 2,
                三: 3,
                四: 4,
                五: 5,
                六: 6,
                七: 7,
                八: 8,
                九: 9,
                十: 10,
                十一: 11,
                十二: 12,
            };
            $("td > div").each(function () {
                var div = $(this);
                const numberMatch = div[0].parentElement.parentElement
                    .querySelector("td")?.innerHTML.match(/[一二三四五六七八九十][一二]?/);
                if (!numberMatch) return;
                var number = numberMatch[0];
                number = numberJson[number];
                var day = getAccurateColumnIndex(div[0].parentElement);
                var duration = parseInt(div[0].parentElement.getAttribute("rowspan")) || 1;
                var content = div.attr("title") || "";
                content = content.split(/\n|(?<!\n)\s{2,}?(?!\n)/);
                content.length == 3 ? content.splice(1, 0, "未定") : null;
                var content_array = [];
                for (let i = 0; i < content.length; i += 4) {
                    if (/^[0-9\-()[\]单双周]*$/.test(content[i])) {
                        content_array.push(content.slice(i, i + 2));
                        i -= 2;
                    } else {
                        content_array.push(content.slice(i, i + 4));
                    }
                }
                content_array = content_array.map((items) => items.map(filterJwglCourseText));
                for (let i = 0; i < content_array.length; i++) {
                    if (
                        content_array[i].length == 2 &&
                        /^[0-9\-()[\]单双周]*$/.test(content_array[i][0])
                    ) {
                        content_array[i].unshift(content_array[i - 1][1]);
                        content_array[i].unshift(content_array[i - 1][0]);
                    }
                    const weekText = content_array[i][2] || "";
                    const variation = weekText.match(/[单双]/)?.[0] || null;
                    const hasRole = /\(外聘|助理|教授\)|\(讲师\)|\(\)/.test(content_array[i][0]);
                    const name = content_array.length > 1 || hasRole ? content_array[i][1] : content_array[i][0];
                    const teacher = content_array.length > 1 || hasRole ? content_array[i][0] : content_array[i][1];
                    const periods = Array.from({ length: duration }, (_, index) => number + index)
                        .filter(period => period >= 1 && period <= 10);
                    const weeks = [...parseRangeString(weekText, variation)];
                    if (!name || !day || !periods.length || !weeks.length) continue;
                    entries.push({
                        name,
                        teacher,
                        room: content_array[i][3] || "未定",
                        weeks,
                        weekday: day,
                        periods
                    });
                }
            });
            const ownerName = window.top.document.querySelector(".layui-nav-item.layuimini-setting a")?.innerText?.trim() || "";
            return JSON.stringify(CourseScheduleTools.buildFromJwgl(entries, ownerName));
        };

        unsafeWindow.hExportJson = async () => {
            MyConsole("[教务课表][JSON 导出] 开始解析当前课表", "", "info");
            try {
                const schedule = JSON.parse(unsafeWindow.hExportData());
                MyConsole("[教务课表][JSON 导出] 课表解析完成", {
                    courseCount: schedule.courses.length,
                    lessonCount: schedule.lessons.length
                }, "debug");
                const ownerName = (schedule.owner?.name || "未命名用户").replace(/[\\/:*?"<>|]/g, "_");
                const result = await prepareScheduleExport(schedule);
                downloadTextFile(result.content, `${ownerName} - 教务系统课表.json`);
                MyConsole("[教务课表][JSON 导出] 导出完成", { encrypted: result.encrypted }, "info");
                vant.showNotify({
                    type: "success",
                    message: result.encrypted ? "加密课表已导出" : "课表 JSON 已导出"
                });
            } catch (error) {
                if (error.code === "EXPORT_CANCELLED") {
                    MyConsole("[教务课表][JSON 导出] 用户取消导出", "", "info");
                    return;
                }
                MyConsole("[教务课表][JSON 导出] 导出失败", error, "error");
                vant.showNotify({ type: "danger", message: error.message || "课表导出失败" });
            }
        }

        let jwglExcelExporting = false;
        unsafeWindow.hExportExcel = async () => {
            if (jwglExcelExporting) {
                MyConsole("[教务课表][Excel 导出] 忽略重复点击", "已有导出任务正在执行", "warn");
                vant.showNotify({ type: "warning", message: "课表 Excel 正在生成，请稍候" });
                return;
            }
            jwglExcelExporting = true;
            MyConsole("[教务课表][Excel 导出] 开始生成工作簿", "", "info");
            vant.showNotify({ type: "primary", message: "正在生成课表 Excel" });
            try {
                const schedule = JSON.parse(unsafeWindow.hExportData());
                const tables = buildJwglExcelTables(schedule);
                const workbook = XLSX.utils.book_new();
                const timetableSheet = XLSX.utils.aoa_to_sheet(tables.timetableRows);
                const detailSheet = XLSX.utils.aoa_to_sheet(tables.detailRows);
                const baseCellStyle = {
                    alignment: { wrapText: true, vertical: "top" },
                    border: {
                        top: { style: "thin", color: { rgb: "D9E1F2" } },
                        bottom: { style: "thin", color: { rgb: "D9E1F2" } },
                        left: { style: "thin", color: { rgb: "D9E1F2" } },
                        right: { style: "thin", color: { rgb: "D9E1F2" } }
                    }
                };
                [timetableSheet, detailSheet].forEach(sheet => Object.keys(sheet).forEach(address => {
                    if (!address.startsWith("!")) sheet[address].s = baseCellStyle;
                }));
                timetableSheet["!cols"] = [{ wch: 18 }, ...Array.from({ length: 7 }, () => ({ wch: 24 }))];
                timetableSheet["!rows"] = [{ hpt: 24 }, ...Array.from({ length: 5 }, () => ({ hpt: 100 }))];
                detailSheet["!cols"] = [
                    { wch: 28 }, { wch: 18 }, { wch: 20 }, { wch: 10 },
                    { wch: 10 }, { wch: 16 }, { wch: 24 }
                ];
                detailSheet["!autofilter"] = { ref: `A1:G${tables.detailRows.length}` };
                XLSX.utils.book_append_sheet(workbook, timetableSheet, "课表");
                XLSX.utils.book_append_sheet(workbook, detailSheet, "课程明细");
                const ownerName = (schedule.owner?.name || "未命名用户").replace(/[\\/:*?"<>|]/g, "_");
                const filename = `${ownerName} - 教务系统课表.xlsx`;
                await Promise.resolve(XLSX.writeFile(workbook, filename));
                MyConsole("[教务课表][Excel 导出] 导出完成", {
                    arrangementCount: tables.arrangementCount,
                    worksheetCount: workbook.SheetNames.length
                }, "info");
                vant.showNotify({ type: "success", message: "课表 Excel 已导出" });
            } catch (error) {
                MyConsole("[教务课表][Excel 导出] 导出失败", error, "error");
                vant.showNotify({ type: "danger", message: error.message || "课表 Excel 导出失败" });
            } finally {
                jwglExcelExporting = false;
            }
        }

    }

    async function jwglCourseBeautify() {
        unsafeWindow.courseBeautify = false;
        unsafeWindow.courseBeautifyProxy = new Proxy({ value: courseBeautify }, {
            set: function (target, property, value) {
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

        if (!getGMValue('Jwgl.courseBeautify') || !document.querySelector("table")) {
            unsafeWindow.courseBeautify = true;
            unsafeWindow.courseBeautifyProxy.value = true;
            return;
        }

        function jwglClass(content_array, mode = -1) {
            if (mode == 0) {
                /^\s*$/.test(content_array[0]) ? content_array[0] = "未知教师" : (null);
                return `
                    <div class="class_main" style="display:flex;flex-direction:column;align-items:center;margin-bottom:1em">
                        <div class="subject">${content_array[1]}</div>
                        <div class="teacher">${content_array[0]}<br><mark>${content_array[3]}</mark><br>${content_array[2]}</div>
                    </div>
                `;
            } else if (mode > 0) {
                /^\s*$/.test(content_array[0]) ? content_array[0] = "未知教师" : (null);
                return `
                    <div class="class_main" style="display:flex;flex-direction:column;align-items:center;margin-bottom:1em">
                        <div class="teacher">${content_array[0]}<br><mark>${content_array[3]}</mark><br>${content_array[2]}</div>
                    </div>
                `;
            } else {
                /^\s*$/.test(content_array[1]) ? content_array[1] = "未知教师" : (null);
                return `
                    <div class="class_main" style="display:flex;flex-direction:column;align-items:center;margin-bottom:1em">
                        <div class="subject">${content_array[0]}</div>
                        <div class="teacher">${content_array[1]}<br><mark>${content_array[3]}</mark><br>${content_array[2]}</div>
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
            (content.length == 3) ? (content.splice(1, 0, "空")) : (null);
            var content_array = [];
            for (let i = 0; i < content.length; i += 4) {
                if (/^[0-9\-()[\]单双周]*$/.test(content[i])) {
                    content_array.push(content.slice(i, i + 2));
                    i -= 2;
                } else {
                    content_array.push(content.slice(i, i + 4));
                }
            }
            content_array = content_array.map((items) => items.map(filterJwglCourseText));
            div.css("display", "flex");
            div.css("flex-direction", "column");
            div.css("justify-content", "center");
            div.css("align-items", "center");
            div.css("text-align", "center");
            div.html("");
            let temp_var;
            for (let i = 0; i < content_array.length; i++) {
                if (content_array.length > 1) {
                    if (content_array[i].length == 2 && /^[0-9\-()[\]单双周]*$/.test(content_array[i][0])) {
                        content_array[i].unshift(content_array[i - 1][1]);
                        content_array[i].unshift(content_array[i - 1][0]);
                    }
                    if (i == 0 || content_array[i][1] == content_array[i - 1][1]) {
                        div.append(jwglClass(content_array[i], i));
                    } else {
                        div.append('<div style="height:1px; background-color: grey;width: 90%;margin-bottom:1em"></div>')
                        div.append(jwglClass(content_array[i], 0));
                    }
                } else {
                    if (/\(外聘|助理|教授\)|\(讲师\)|\(\)/.test(content_array[i][0])) {
                        temp_var = content_array[i][0];
                        content_array[i][0] = content_array[i][1];
                        content_array[i][1] = temp_var;
                    }
                    div.append(jwglClass(content_array[i]));
                }
            }
        });
        unsafeWindow.courseBeautify = true;
        unsafeWindow.courseBeautifyProxy.value = true;
    }

    async function sysaqLogin() {
        const button = document.evaluate(
            "//button[.//span[contains(., '点击登录')]]",
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
        ).singleNodeValue;

        if (button) {
            createToast("success", `自动登录…`, 3);
            const url = new URL(window.location.href);
            // 去掉 pathname 末尾的斜杠（如果存在）
            url.pathname = url.pathname.replace(/\/$/, '') + '/login';
            // 跳转到新地址
            window.location.href = url.toString();
        }
    }

    async function sysaqAuth() {
        const button = document.evaluate(
            ".//a[contains(., '统一身份认证登录')]",
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
        ).singleNodeValue;

        if (button) {
            createToast("success", `自动登录…`, 3);
            simulateClick(button);
        }
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
        MyConsole("[自由复制] 文本选择监听已启用");
        createToast("success", `已开启复制，选中文字即可自动复制到粘贴板~`, 3);
        // 监听内容区域鼠标抬起事件
        document.addEventListener('mouseup', function () {
            var copy = getCurrentSelect();
            if (copy.text == "") {
                return;
            }
            // myConsole('onmouseup');
            MyConsole("[自由复制] 捕获当前选区", getCurrentSelect(), "debug");
            GM_setClipboard(getCurrentSelect().text);
        });
    }

    async function portalApp() {
        if (document.documentElement.dataset.betterNxuPortalInitialized === "1") return;
        let mainIframe;
        try {
            const iframe = await waitForElement("iframe#template-container", {
                timeout: 15000,
                predicate: element => Boolean(element.contentWindow?.document)
            });
            mainIframe = iframe.contentWindow;
            const startedAt = Date.now();
            while (Date.now() - startedAt <= 15000) {
                const list = mainIframe.document.querySelector("div.city_sort");
                if (list?.querySelector("div.sortItem")) break;
                await WaitTime(200, 0, false);
            }
        } catch (error) {
            createToast("error", error.message || "门户页面加载超时，请刷新后重试", 4);
            return;
        }
        const list = mainIframe.document.querySelector("div.city_sort");
        if (!list?.querySelector("div.sortItem")) {
            createToast("warning", "门户分类加载超时，已跳过自定义卡片", 4);
            return;
        }
        const listFirst = list.querySelector("div.sortItem")
        document.documentElement.dataset.betterNxuPortalInitialized = "1";
        const vueScopedAttr = Array.from(list.attributes)
            .find(attr => attr.name.startsWith('data-v-'));
        const dataVValue = vueScopedAttr?.name || "";
        const generateDiv = (data) => {
            const title = data[0];
            const id = data[1];
            const items = data[2];

            // 生成所有 <li> 元素
            const liList = items.map((item) => {
                const msg = item[0];
                const url = item[1];
                const firstChar = msg.charAt(0); // 取第一个汉字或字符

                return `<li ${dataVValue}>
                        <div ${dataVValue} class="li-item portal-font-color-lv1 portal-primary-color-hover-lv1 favoriteapp-list-hover portal-primary-backgroundcolor-hover-lv5"
                            onclick="window.open('${url}')">
                            <div ${dataVValue} class="favoriteapp-left">
                                <div style="width:100%;height:100%;display:flex;justify-content:center;align-items:center;font-size:x-large;font-weight:bold;color:#38727F">
                                    ${firstChar}
                                </div>
                            </div>
                            <div ${dataVValue} class="favoriteapp-center">
                                <div ${dataVValue} class="we-tooltip item" style="overflow: hidden;" aria-describedby="we-tooltip-9469" tabindex="0">
                                    <span style="box-shadow: transparent 0px 0px;">
                                        <span aria-label="${msg}"> ${msg} </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </li>`;
            });

            // 拼接整体模板
            const template = `<h2 class="portal-font-color-lv1" ${dataVValue}> ${title} </h2>
            <div class="favoriteapp" ${dataVValue}>
                <ul class="asul" ${dataVValue}>
                    ${liList.join('\n')}
                </ul>
            </div>`;

            var div = document.createElement('div');
            div.className = 'sortItem';
            div.id = id;
            div.innerHTML = template

            return div;
        }
        if (!document.querySelector("#betternxu-h-main")) {
            list.insertBefore(generateDiv([
                "Better NXU - 常用",
                "betternxu-h-main",
                [
                    ["学工系统", "https://xsfw.nxu.edu.cn"],
                    ["双创平台", "http://202.201.128.142/nxu1"],
                    ["实验室安全教育平台", "https://sysaq.nxu.edu.cn"],
                ]
            ]), listFirst);
        }
        if (!document.querySelector("#betternxu-h-jwgl")) {
            list.insertBefore(generateDiv([
                "Better NXU - 教务系统",
                "betternxu-h-jwgl",
                [
                    ["教务系统", "https://jwgl.nxu.edu.cn"],
                    ["备用1", "http://202.201.128.234:8080"],
                    ["备用2", "http://202.201.128.234:8081"],
                    ["备用3", "http://202.201.128.234:8082"],
                    ["备用4", "http://202.201.128.234:8083"],
                ]
            ]), listFirst);
        }
        if (!document.querySelector("#betternxu-h-lib")) {
            list.insertBefore(generateDiv([
                "Better NXU - 图书馆",
                "betternxu-h-lib",
                [
                    ["图书馆", "https://zylib.nxu.edu.cn/login"],
                    ["中国知网", "https://zylib.nxu.edu.cn/-----https://www.cnki.net/"],
                    ["万方数据", "https://zylib.nxu.edu.cn/-----https://www.wanfangdata.com.cn/"],
                    ["维普资讯", "https://zylib.nxu.edu.cn/-----https://qikan.cqvip.com/"],
                    ["Web of Science", "https://zylib.nxu.edu.cn/-----https://www.webofscience.com/wos/alldb/basic-search"],
                    ["PubScholar公益学术平台(校外)", "https://pubscholar.cn/"],
                ]
            ]), listFirst);
        }
        if (!document.querySelector("#betternxu-h-tools")) {
            list.insertBefore(generateDiv([
                "Better NXU - H 小工具",
                "betternxu-h-tools",
                [
                    ["H 小工具", "h/tools"],
                    ["宁夏大学猫狗图鉴", "https://nxu-cdig.thisish.cn/"],
                    ["NXU Charge（已废弃）", "https://campus-charge.thisish.cn/"],
                ]
            ]), listFirst);
        }
    }

    async function webvpnHSettings() {
        document.querySelector("body").innerHTML = ``;
        document.title = `脚本设置 - H`;

        // 添加Notification组件
        // 添加组件
        addToast();
        // 添加css样式
        GM_addStyle(ToastCss);
        GM_addStyle(GM_getResourceText("svg-logo").replace(/\.\.\/webfonts/g, "https://cdn.bootcdn.net/ajax/libs/font-awesome/6.2.1/webfonts"));
        //绑定Toast事件
        unsafeWindow.createToast = createToast;
        unsafeWindow.removeToast = removeToast;

        var toast = createToast("info", `请等待工具部署`, 0);
        // CloseWin();

        // CAT_userConfig()

        GM_addElement(document.querySelector('body'), 'div', { id: 'settings' });
        GM_addStyle(`
            :root {
                --van-doc-black: #000;
                --van-doc-white: #fff;
                --van-doc-gray-1: #f7f8fa;
                --van-doc-gray-2: #f2f3f5;
                --van-doc-gray-3: #ebedf0;
                --van-doc-gray-4: #dcdee0;
                --van-doc-gray-5: #c8c9cc;
                --van-doc-gray-6: #969799;
                --van-doc-gray-7: #646566;
                --van-doc-gray-8: #323233;
                --van-doc-blue: #1989fa;
                --van-doc-green: #07c160;
                --van-doc-purple: #8e69d3;
                --van-doc-background: #eff2f5;
            }

            /* 美化滚动条 */
            *::-webkit-scrollbar {
                width: 4px;
            }

            *::-webkit-scrollbar-corner {
                background-color: transparent;
            }

            *::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 100px;
            }

            *::-webkit-scrollbar-thumb {
                background: #c1c1c1;
                border-radius: 100px;
            }

            /* Firefox 滚动条样式 */
            * {
                scrollbar-width: thin;
                scrollbar-color: #c1c1c1 #f1f1f1;
            }

            * {
                box-sizing: border-box;
            }

            html, body, #settings {
                width: 100%;
                height: 100%;
                background-color: var(--van-doc-background);
                overflow: hidden;
            }

            #settings {
                padding: 20px;
                display: flex;
                flex-direction: column;
                gap: 12px;
                overflow: hidden;
            }

            .settings-function-area {
                flex-shrink: 0;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 16px;
                min-width: 0;
                padding: 14px 16px;
                border: 1px solid var(--van-doc-gray-3);
                border-radius: 8px;
                background-color: var(--van-doc-white);
            }

            .settings-function-copy {
                display: flex;
                flex-direction: column;
                gap: 4px;
                min-width: 0;
            }

            .settings-function-title {
                color: var(--van-doc-gray-8);
                font-size: 16px;
                font-weight: 600;
                line-height: 22px;
            }

            .settings-function-description {
                color: var(--van-doc-gray-6);
                font-size: 13px;
                line-height: 18px;
            }

            .settings-function-actions {
                display: flex;
                flex-shrink: 0;
                flex-wrap: wrap;
                justify-content: flex-end;
                gap: 8px;
            }

            .settings-groups {
                flex: 1;
                display: flex;
                gap: 1em;
                min-height: 0;
                overflow-x: auto;
                scrollbar-width: auto;
            }

            .group {
                flex-shrink: 0;
                width: 400px;
                height: 100%;
                border-radius: 20px;
                overflow: hidden;
                background-color: var(--van-doc-gray-1);
                scrollbar-width: auto;
            }

            .group-content {
                width: 100%;
                height: calc(100% - 46px);
                overflow: hidden;
                overflow-y: auto;
                padding-bottom: 32px;
            }

            .group h2 {
                color: var(--van-doc-gray-6);
                margin: 0;
                padding: 32px 16px 16px;
                font-size: 14px;
                font-weight: 400;
                line-height: 16px;
            }

            .group h3 {
                color: var(--van-doc-gray-6);
                margin: 0;
                padding: 16px 32px 16px;
                font-size: 14px;
                font-weight: 400;
                line-height: 14px;
            }

            .login-setting-disabled {
                --van-cell-label-color: var(--van-doc-gray-6);
            }

            @media (max-width: 640px) {
                #settings {
                    padding: 12px;
                }

                .settings-function-area {
                    align-items: stretch;
                    flex-direction: column;
                }

                .settings-function-actions {
                    justify-content: flex-start;
                }

                .group {
                    width: calc(100vw - 24px);
                }
            }
        `);
        const settings_template = `
            <section class="settings-function-area" aria-label="设置功能区">
                <div class="settings-function-copy">
                    <span class="settings-function-title">脚本设置</span>
                    <span class="settings-function-description">修改会自动保存 · Better NXU V {{ scriptVersion }}</span>
                </div>
                <div class="settings-function-actions">
                    <van-button size="small" plain icon="setting-o" @click="openNativeConfig">ScriptCat 原生配置</van-button>
                    <van-button size="small" plain type="warning" icon="replay" @click="resetFunctionSettings">恢复功能默认值</van-button>
                    <van-button size="small" type="danger" icon="delete-o" @click="resetAllSettings">完全重置</van-button>
                </div>
            </section>
            <div class="settings-groups">
            <div class="group">
                <van-nav-bar title="WebVPN 页面设置" />
                <div class="group-content">
                    <van-form>
                        <h2>登录设置</h2>
                        <van-cell-group inset>
                            <van-cell
                                center
                                title="是否自动登录"
                                :label="webVPNCredentialsReady ? '' : '请先填写账号和密码'"
                                :class="{ 'login-setting-disabled': !webVPNCredentialsReady }"
                            >
                                <template #right-icon>
                                    <van-switch v-model="webVPNAutoLogin" :disabled="!webVPNCredentialsReady" />
                                </template>
                            </van-cell>
                            <van-field v-model="webVPNAccount" label="账号" autocomplete="off" placeholder="请输入账号（学号）" />
                            <van-field v-model="webVPNPassword" type="password" autocomplete="off" label="密码" placeholder="请输入密码（登录校园网的密码）" />
                            <van-cell center title="是否在多因子认证（微信扫码）时启用快速登录">
                                <template #right-icon>
                                    <van-switch v-model="webVPNAutoReLogin" />
                                </template>
                            </van-cell>
                        </van-cell-group>
                        <h2>卡片设置</h2>
                        <van-cell-group inset>
                            <van-cell center title="是否显示抢课备用列表">
                                <template #right-icon>
                                    <van-switch v-model="webVPNCourseGrab" />
                                </template>
                            </van-cell>
                            <van-cell center title="是否显示工具列表">
                                <template #right-icon>
                                    <van-switch v-model="webVPNCustomTool" />
                                </template>
                            </van-cell>
                        </van-cell-group>
                        <h3>需要添加的自定义卡片</h3>
                        <van-checkbox-group v-model="webVPNCustomCard">
                            <van-cell-group inset>
                                <van-cell
                                    v-for="(item, index) in webVPNCustomCardList"
                                    clickable
                                    :key="item"
                                    :title="item"
                                    @click="cellCheckBoxToggle(webVPNCustomCardRefs, index)"
                                >
                                    <template #right-icon>
                                        <van-checkbox
                                            :name="item"
                                            :ref="el => webVPNCustomCardRefs[index] = el"
                                            @click.stop
                                        />
                                    </template>
                                </van-cell>
                            </van-cell-group>
                        </van-checkbox-group>
                        <h2>其他设置</h2>
                        <van-cell-group inset>
                            <van-cell center title="是否默认关闭搜索栏">
                                <template #right-icon>
                                    <van-switch v-model="webVPNSearchClose" />
                                </template>
                            </van-cell>
                            <van-cell center title="是否自动关闭错误网站">
                                <template #right-icon>
                                    <van-switch v-model="webVPNAutoClose" />
                                </template>
                            </van-cell>
                        </van-cell-group>
                    </van-form>
                </div>
            </div>
            <div class="group">
                <van-nav-bar title="教务系统页面设置" />
                <div class="group-content">
                    <van-form>
                        <h2>登录设置</h2>
                        <van-cell-group inset>
                            <van-cell
                                center
                                title="是否自动登录"
                                :label="jwglCredentialsReady ? '' : '请先填写账号和密码'"
                                :class="{ 'login-setting-disabled': !jwglCredentialsReady }"
                            >
                                <template #right-icon>
                                    <van-switch v-model="jwglAutoLogin" :disabled="!jwglCredentialsReady" />
                                </template>
                            </van-cell>
                            <van-field v-model="jwglAccount" label="账号" autocomplete="off" placeholder="请输入账号（学号）" />
                            <van-field v-model="jwglPassword" type="password" label="密码" autocomplete="off" placeholder="请输入密码（登录教务系统的密码）" />
                        </van-cell-group>
                        <h2>功能设置</h2>
                        <van-cell-group inset>
                            <van-cell center title="是否自动美化课表">
                                <template #right-icon>
                                    <van-switch v-model="jwglCourseBeautify" />
                                </template>
                            </van-cell>
                        </van-cell-group>
                        <!-- <h2>菜单设置</h2> -->
                        <h3>在菜单需要添加的条目</h3>
                        <van-checkbox-group v-model="jwglCustomMenu">
                            <van-cell-group inset>
                                <van-cell
                                    v-for="(item, index) in jwglCustomMenuList"
                                    clickable
                                    :key="item"
                                    :title="item"
                                    @click="cellCheckBoxToggle(jwglCustomMenuRefs, index)"
                                >
                                    <template #right-icon>
                                        <van-checkbox
                                            :name="item"
                                            :ref="el => jwglCustomMenuRefs[index] = el"
                                            @click.stop
                                        />
                                    </template>
                                </van-cell>
                            </van-cell-group>
                        </van-checkbox-group>
                    </van-form>
                </div>
            </div>
            <div class="group">
                <van-nav-bar title="团委官网页面设置" />
                <div class="group-content">
                    <van-form>
                        <h2>下载设置</h2>
                        <van-cell-group inset>
                            <van-cell center style="--van-cell-text-color:var(--van-doc-gray-6)" title="是否自动下载附件" @click="unrealizedFunction">
                                <template #right-icon>
                                    <van-switch v-model="tuanweiAutoDownload" disabled />
                                </template>
                            </van-cell>
                            <van-cell center style="--van-cell-text-color:var(--van-doc-gray-6)" title="是否自动关闭下载页面" @click="unrealizedFunction">
                                <template #right-icon>
                                    <van-switch v-model="tuanweiAutoDownloadClose" disabled />
                                </template>
                            </van-cell>
                        </van-cell-group>
                    </van-form>
                </div>
            </div>
            <div class="group">
                <van-empty style="width: 100%;height: 100%;" description="更多设置等待建设中...">
                    <template #image>
                        <svg width="160" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <g fill="none" class="nc-icon-wrapper">
                                <path
                                    d="M14.5489 8H9.4513L9.08052 19.9253C9.0382 21.0584 9.94529 22 11.0791 22H12.921C14.0549 22 14.962 21.0584 14.9197 19.9254L14.5489 8Z"
                                    fill="url(#hammer_existing_0)"
                                    data-glass="origin"
                                    mask="url(#hammer_mask)"
                                />
                                <path
                                    d="M14.5489 8H9.4513L9.08052 19.9253C9.0382 21.0584 9.94529 22 11.0791 22H12.921C14.0549 22 14.962 21.0584 14.9197 19.9254L14.5489 8Z"
                                    fill="url(#hammer_existing_0)"
                                    data-glass="clone"
                                    filter="url(#hammer_filter)"
                                    clip-path="url(#hammer_clipPath)"
                                />
                                <path
                                    d="M3 9V5C3 3.34315 4.34315 2 6 2H14.7393C15.4739 2 16.1833 2.26975 16.7324 2.75781L19.9932 5.65625C20.6335 6.22554 21 7.04162 21 7.89844V9.5C21 10.8807 19.8807 12 18.5 12H6C4.34315 12 3 10.6569 3 9Z"
                                    fill="url(#hammer_existing_1)"
                                    data-glass="blur"
                                />
                                <path
                                    d="M3 9V5C3 3.34315 4.34315 2 6 2H14.7393C15.4739 2 16.1833 2.26975 16.7324 2.75781L19.9932 5.65625C20.6335 6.22554 21 7.04162 21 7.89844V9.5C21 10.8807 19.8807 12 18.5 12V11.25C19.4665 11.25 20.25 10.4665 20.25 9.5V7.89844C20.25 7.33628 20.0393 6.79772 19.665 6.38574L19.4951 6.2168L16.2344 3.31836C15.8225 2.95228 15.2902 2.75 14.7393 2.75H6C4.75736 2.75 3.75 3.75736 3.75 5V9C3.75 10.2426 4.75736 11.25 6 11.25V12C4.34315 12 3 10.6569 3 9ZM18.5 11.25V12H6V11.25H18.5Z"
                                    fill="url(#hammer_existing_2)"
                                />
                                <defs>
                                    <linearGradient
                                        id="hammer_existing_0"
                                        x1="12"
                                        y1="8"
                                        x2="12"
                                        y2="22"
                                        gradientUnits="userSpaceOnUse"
                                    >
                                        <stop stop-color="rgba(87, 87, 87, 1)" data-glass-11="on" />
                                        <stop offset="1" stop-color="rgba(21, 21, 21, 1)" data-glass-12="on" />
                                    </linearGradient>
                                    <linearGradient
                                        id="hammer_existing_1"
                                        x1="12"
                                        y1="2"
                                        x2="12"
                                        y2="12"
                                        gradientUnits="userSpaceOnUse"
                                    >
                                        <stop stop-color="rgba(227, 227, 229, 0.6)" data-glass-21="on" />
                                        <stop
                                            offset="1"
                                            stop-color="rgba(187, 187, 192, 0.6)"
                                            data-glass-22="on"
                                        />
                                    </linearGradient>
                                    <linearGradient
                                        id="hammer_existing_2"
                                        x1="12"
                                        y1="2"
                                        x2="12"
                                        y2="7.791"
                                        gradientUnits="userSpaceOnUse"
                                    >
                                        <stop stop-color="rgba(255, 255, 255, 1)" data-glass-light="on" />
                                        <stop
                                            offset="1"
                                            stop-color="rgba(255, 255, 255, 1)"
                                            stop-opacity="0"
                                            data-glass-light="on"
                                        />
                                    </linearGradient>
                                    <filter
                                        id="hammer_filter"
                                        x="-100%"
                                        y="-100%"
                                        width="400%"
                                        height="400%"
                                        filterUnits="objectBoundingBox"
                                        primitiveUnits="userSpaceOnUse"
                                    >
                                        <feGaussianBlur
                                            stdDeviation="2"
                                            x="0%"
                                            y="0%"
                                            width="100%"
                                            height="100%"
                                            in="SourceGraphic"
                                            edgeMode="none"
                                            result="blur"
                                        />
                                    </filter>
                                    <clipPath id="hammer_clipPath">
                                        <path
                                            d="M3 9V5C3 3.34315 4.34315 2 6 2H14.7393C15.4739 2 16.1833 2.26975 16.7324 2.75781L19.9932 5.65625C20.6335 6.22554 21 7.04162 21 7.89844V9.5C21 10.8807 19.8807 12 18.5 12H6C4.34315 12 3 10.6569 3 9Z"
                                            fill="url(#hammer_existing_1)"
                                        />
                                    </clipPath>
                                    <mask id="hammer_mask">
                                        <rect width="100%" height="100%" fill="#FFF" />
                                        <path
                                            d="M3 9V5C3 3.34315 4.34315 2 6 2H14.7393C15.4739 2 16.1833 2.26975 16.7324 2.75781L19.9932 5.65625C20.6335 6.22554 21 7.04162 21 7.89844V9.5C21 10.8807 19.8807 12 18.5 12H6C4.34315 12 3 10.6569 3 9Z"
                                            fill="#000"
                                        />
                                    </mask>
                                </defs>
                            </g>
                        </svg>
                    </template>
                </van-empty>
            </div>
            </div>
        `
        const settings = Vue.createApp({
            template: settings_template,
            setup() {
                const cellCheckBoxToggle = (refs, index) => {
                    refs[index].toggle();
                };

                const webVPNAutoLogin = Vue.ref(getGMValue("WebVPN.autoLogin"));
                const webVPNAutoReLogin = Vue.ref(getGMValue("WebVPN.autoReLogin"));
                const webVPNAccount = Vue.ref(getGMValue("WebVPN.username"));
                const webVPNPassword = Vue.ref(getGMValue("WebVPN.password"));
                const webVPNCourseGrab = Vue.ref(getGMValue('WebVPN.courseGrab'));
                const webVPNCustomTool = Vue.ref(getGMValue("WebVPN.customTool"));
                const webVPNCustomCard = Vue.ref(getGMValue("WebVPN.customCard"));
                const webVPNCustomCardList = ['教务管理', '学工系统', '信息门户', '中国知网', '万方数据', '大先生'];
                const webVPNCustomCardRefs = Vue.ref([]);
                const webVPNAutoClose = Vue.ref(getGMValue("WebVPN.autoClose"));
                const webVPNSearchClose = Vue.ref(getGMValue("WebVPN.searchClose"));
                const jwglAutoLogin = Vue.ref(getGMValue("Jwgl.autoLogin"));
                const jwglAccount = Vue.ref(getGMValue("Jwgl.username"));
                const jwglPassword = Vue.ref(getGMValue("Jwgl.password"));
                const jwglCourseBeautify = Vue.ref(getGMValue("Jwgl.courseBeautify"));
                const jwglCustomMenu = Vue.ref(getGMValue("Jwgl.customMenu"));
                const jwglCustomMenuList = ['全部学期成绩'];
                const jwglCustomMenuRefs = Vue.ref([]);
                const tuanweiAutoDownload = Vue.ref(getGMValue("TuanWei.autoDownload"));
                const tuanweiAutoDownloadClose = Vue.ref(getGMValue("TuanWei.autoDownloadClose"));
                const webVPNCredentialsReady = Vue.computed(() => hasLoginCredentials(webVPNAccount.value, webVPNPassword.value));
                const jwglCredentialsReady = Vue.computed(() => hasLoginCredentials(jwglAccount.value, jwglPassword.value));

                const enforceAutoLoginCredentials = (credentialsReady, autoLogin, storageKey, label, notify = true) => {
                    if (credentialsReady.value || !autoLogin.value) return;
                    autoLogin.value = false;
                    GM_setValue(storageKey, false);
                    if (notify) createToast("info", `${label}自动登录已关闭，请先填写账号和密码`, 3);
                };

                enforceAutoLoginCredentials(webVPNCredentialsReady, webVPNAutoLogin, "WebVPN.autoLogin", "WebVPN ", false);
                enforceAutoLoginCredentials(jwglCredentialsReady, jwglAutoLogin, "Jwgl.autoLogin", "教务系统", false);

                Vue.watch(webVPNCustomCard, (newValue, oldValue) => {
                    GM_setValue("WebVPN.customCard", newValue);
                })

                Vue.watch(webVPNAutoLogin, (newValue, oldValue) => {
                    GM_setValue("WebVPN.autoLogin", newValue);
                });

                Vue.watch(webVPNAutoReLogin, (newValue, oldValue) => {
                    GM_setValue("WebVPN.autoReLogin", newValue);
                });

                Vue.watch(webVPNAccount, (newValue, oldValue) => {
                    GM_setValue("WebVPN.username", newValue);
                });

                Vue.watch(webVPNPassword, (newValue, oldValue) => {
                    GM_setValue("WebVPN.password", newValue);
                });

                Vue.watch([webVPNAccount, webVPNPassword], () => {
                    enforceAutoLoginCredentials(webVPNCredentialsReady, webVPNAutoLogin, "WebVPN.autoLogin", "WebVPN ");
                });

                Vue.watch(webVPNCourseGrab, (newValue, oldValue) => {
                    GM_setValue("WebVPN.courseGrab", newValue);
                });

                Vue.watch(webVPNCustomTool, (newValue, oldValue) => {
                    GM_setValue("WebVPN.customTool", newValue);
                });

                Vue.watch(webVPNAutoClose, (newValue, oldValue) => {
                    GM_setValue("WebVPN.autoClose", newValue);
                });

                Vue.watch(webVPNSearchClose, (newValue, oldValue) => {
                    GM_setValue("WebVPN.searchClose", newValue);
                });

                Vue.watch(jwglCustomMenu, (newValue, oldValue) => {
                    GM_setValue("Jwgl.customMenu", newValue);
                })

                Vue.watch(jwglAutoLogin, (newValue, oldValue) => {
                    GM_setValue("Jwgl.autoLogin", newValue);
                });

                Vue.watch(jwglAccount, (newValue, oldValue) => {
                    GM_setValue("Jwgl.username", newValue);
                });

                Vue.watch(jwglPassword, (newValue, oldValue) => {
                    GM_setValue("Jwgl.password", newValue);
                });

                Vue.watch([jwglAccount, jwglPassword], () => {
                    enforceAutoLoginCredentials(jwglCredentialsReady, jwglAutoLogin, "Jwgl.autoLogin", "教务系统");
                });

                Vue.watch(jwglCourseBeautify, (newValue, oldValue) => {
                    GM_setValue("Jwgl.courseBeautify", newValue);
                });

                const resettableSettingModels = {
                    "WebVPN.autoLogin": webVPNAutoLogin,
                    "WebVPN.autoReLogin": webVPNAutoReLogin,
                    "WebVPN.autoClose": webVPNAutoClose,
                    "WebVPN.courseGrab": webVPNCourseGrab,
                    "WebVPN.customTool": webVPNCustomTool,
                    "WebVPN.customCard": webVPNCustomCard,
                    "WebVPN.searchClose": webVPNSearchClose,
                    "Jwgl.autoLogin": jwglAutoLogin,
                    "Jwgl.courseBeautify": jwglCourseBeautify,
                    "Jwgl.customMenu": jwglCustomMenu,
                    "TuanWei.autoDownload": tuanweiAutoDownload,
                    "TuanWei.autoDownloadClose": tuanweiAutoDownloadClose
                };
                const allSettingModels = {
                    ...resettableSettingModels,
                    "WebVPN.username": webVPNAccount,
                    "WebVPN.password": webVPNPassword,
                    "Jwgl.username": jwglAccount,
                    "Jwgl.password": jwglPassword
                };
                const syncSettingModels = (defaults, models) => {
                    Object.entries(models).forEach(([name, model]) => {
                        model.value = cloneGMValue(defaults[name]);
                    });
                };

                const resetFunctionSettings = async () => {
                    let action;
                    try {
                        action = await vant.showConfirmDialog({
                            title: "恢复功能默认值",
                            message: "将恢复自动登录、页面显示和菜单等功能设置。账号密码、配置提示状态、课表 ID 与课表密钥不会被修改。",
                            messageAlign: "left",
                            confirmButtonText: "恢复默认",
                            cancelButtonText: "取消",
                            closeOnClickOverlay: false
                        });
                    } catch (error) {
                        return;
                    }
                    if (action !== "confirm") return;

                    try {
                        const defaults = await resetFunctionSettingValues();
                        syncSettingModels(defaults, resettableSettingModels);
                        enforceAutoLoginCredentials(webVPNCredentialsReady, webVPNAutoLogin, "WebVPN.autoLogin", "WebVPN ", false);
                        enforceAutoLoginCredentials(jwglCredentialsReady, jwglAutoLogin, "Jwgl.autoLogin", "教务系统", false);
                        createToast("success", "功能设置已恢复默认，账号密码和课表数据保持不变", 3);
                    } catch (error) {
                        MyConsole("[设置] 恢复功能默认值失败", error, "error");
                        createToast("error", "恢复默认设置失败，请稍后重试", 4);
                    }
                };

                const resetAllSettings = async () => {
                    let action;
                    try {
                        action = await vant.showConfirmDialog({
                            title: "完全重置 Better NXU",
                            message: "这将清除 WebVPN 与教务账号密码、全部功能设置、配置提示状态、课表 ID 和课表解密密钥。\n\n解密密钥清除后无法恢复，已有加密课表可能无法再次打开。此操作无法撤销。",
                            messageAlign: "left",
                            confirmButtonText: "确认完全重置",
                            confirmButtonColor: "#ee0a24",
                            cancelButtonText: "取消",
                            closeOnClickOverlay: false
                        });
                    } catch (error) {
                        return;
                    }
                    if (action !== "confirm") return;

                    try {
                        const defaults = await resetAllSettingValues();
                        syncSettingModels(defaults, allSettingModels);
                        createToast("success", "Better NXU 已完全重置，返回首页后请重新配置", 4);
                    } catch (error) {
                        MyConsole("[设置] 完全重置失败", error, "error");
                        createToast("error", "完全重置失败，请稍后重试", 4);
                    }
                };

                const openNativeConfig = () => {
                    try {
                        CAT_userConfig();
                    } catch (error) {
                        MyConsole("[设置] 打开 ScriptCat 原生配置失败", error, "error");
                        createToast("error", "暂时无法打开 ScriptCat 原生配置", 4);
                    }
                };

                Vue.onBeforeUpdate(() => {
                    webVPNCustomCardRefs.value = [];
                    jwglCustomMenuRefs.value = [];
                });

                const unrealizedFunction = () => {
                    createToast("error", `暂未实现的功能`, 3);
                }

                return {
                    scriptVersion: Version,
                    cellCheckBoxToggle,
                    webVPNAutoLogin,
                    webVPNCredentialsReady,
                    webVPNAccount,
                    webVPNPassword,
                    webVPNCourseGrab,
                    webVPNCustomTool,
                    webVPNCustomCard,
                    webVPNCustomCardList,
                    webVPNCustomCardRefs,
                    webVPNAutoClose,
                    webVPNSearchClose,
                    jwglAutoLogin,
                    jwglCredentialsReady,
                    webVPNAutoReLogin,
                    jwglAccount,
                    jwglPassword,
                    jwglCourseBeautify,
                    jwglCustomMenu,
                    jwglCustomMenuList,
                    jwglCustomMenuRefs,
                    tuanweiAutoDownload,
                    tuanweiAutoDownloadClose,
                    resetFunctionSettings,
                    resetAllSettings,
                    openNativeConfig,
                    unrealizedFunction
                };
            },
            mounted() {
                removeToast(toast);
                createToast("success", `设置页面部署完毕`, 2);
            }
        })
        settings.use(vant);
        settings.mount("#settings");
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

        var toast = createToast("info", `请等待工具部署`, 0);
        // createToast("error", `暂未实现的页面`, 0);

        GM_addStyle(GM_getResourceText("github-markdown-css"))
        eval(GM_getResourceText("marked-js"))

        GM_addElement(document.querySelector('body'), 'div', { id: 'about' });
        GM_addStyle(`
            :root {
                --van-doc-black: #000;
                --van-doc-white: #fff;
                --van-doc-gray-1: #f7f8fa;
                --van-doc-gray-2: #f2f3f5;
                --van-doc-gray-3: #ebedf0;
                --van-doc-gray-4: #dcdee0;
                --van-doc-gray-5: #c8c9cc;
                --van-doc-gray-6: #969799;
                --van-doc-gray-7: #646566;
                --van-doc-gray-8: #323233;
                --van-doc-blue: #1989fa;
                --van-doc-green: #07c160;
                --van-doc-purple: #8e69d3;
                --van-doc-background: #eff2f5;
            }

            /* 美化滚动条 */
            *::-webkit-scrollbar {
                width: 4px;
            }

            *::-webkit-scrollbar-corner {
                background-color: transparent;
            }

            *::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 100px;
            }

            *::-webkit-scrollbar-thumb {
                background: #c1c1c1;
                border-radius: 100px;
            }

            /* Firefox 滚动条样式 */
            * {
                scrollbar-width: thin;
                scrollbar-color: #c1c1c1 #f1f1f1;
            }

            * {
                box-sizing: border-box;
            }

            ul {
                list-style-type: disc;
            }

            :is(dir, menu, ol, ul) ul {
                list-style-type: circle;
            }

            :is(dir, menu, ol, ul) :is(dir, menu, ol, ul) ul {
                list-style-type: square;
            }

            html, body, #about {
                width: 100%;
                height: 100%;
                background-color: var(--van-doc-background);
                overflow: hidden;
            }

            #about {
                padding: 20px 1vw;
                display: flex;
                gap: 1vw;
                overflow-x: auto;
                scrollbar-width: auto;
            }

            .group {
                flex-shrink: 0;
                width: 32vw;
                height: 100%;
                border-radius: 20px;
                overflow: hidden;
                background-color: var(--van-doc-gray-1);
                scrollbar-width: auto;
            }

            .group-content {
                width: 100%;
                height: calc(100% - 46px);
                overflow: hidden;
                overflow-y: auto;
                padding-bottom: 32px;
            }

            .group-content:not(.markdown-body) > h2 {
                color: var(--van-doc-gray-6);
                margin: 0;
                padding: 32px 16px 16px;
                font-size: 14px;
                font-weight: 400;
                line-height: 16px;
            }

            .markdown-body {
                box-sizing: border-box;
                min-width: 200px;
                max-width: 980px;
                margin: 0 auto;
                padding: 25px;
            }
        `);
        const about_template = `
            <div class="group">
                <van-nav-bar title="关于我们" />
                <div class="group-content markdown-body" id="aboutmd"></div>
            </div>
            <div class="group">
                <van-nav-bar title="更新日志" />
                <div class="group-content markdown-body" id="updatemd"></div>
            </div>
            <div class="group">
                <van-nav-bar title="致谢名单" />
                <div class="group-content">
                    <h2>特别鸣谢</h2>
                    <van-cell-group inset>
                        <van-cell title="H" label="This is H" center is-link @click="dialogH = true">
                            <template #icon>
                                <img
                                    style="margin-right: 10px; width: 24px; height: 24px; border-radius:999px"
                                    referrerpolicy="no-referrer"
                                    src="https://raw.giteeusercontent.com/thisish/NXU-CDIG/raw/main/src/assets/img/h.png"
                                />
                            </template>
                        </van-cell>
                        <van-cell title="Smile232323" label="日拱一卒，干就完事了" center is-link url="https://github.com/Smile232323">
                            <template #icon>
                                <img
                                    style="margin-right: 10px; width: 24px; height: 24px; border-radius:999px"
                                    referrerpolicy="no-referrer"
                                    src="https://raw.giteeusercontent.com/thisish/Better-NXU/raw/main/assets/img/Smile232323.png"
                                />
                            </template>
                        </van-cell>
                        <van-cell title="Karl" label="Your Name Engraved Herein" center>
                            <template #icon>
                                <img
                                    style="margin-right: 10px; width: 24px; height: 24px; border-radius:999px"
                                    referrerpolicy="no-referrer"
                                    src="https://raw.giteeusercontent.com/thisish/Better-NXU/raw/main/assets/img/Karl.png"
                                />
                            </template>
                        </van-cell>
                        <van-dialog v-model:show="dialogH" title="关注我们">
                            <img referrerpolicy="no-referrer" style="padding: 1em 0.5em;width:100%" src="https://gitee.com/thisish/NXU-CDIG/raw/main/src/assets/img/gzh-large.png" />
                        </van-dialog>
                    </van-cell-group>
                    <h2>项目支持</h2>
                    <van-cell-group inset>
                        <van-cell
                            title="ScriptCat"
                            label="脚本猫脚本站,在这里你可以与全世界分享你的用户脚本"
                            url="https://scriptcat.org/zh-CN"
                            center
                            is-link
                        >
                            <template #icon>
                                <img
                                    style="margin-right: 10px; width: 24px"
                                    src="	https://scriptcat.org/_next/image?url=%2Fassets%2Flogo.png&w=64&q=75"
                                />
                            </template>
                        </van-cell>
                        <van-cell
                            title="Vue"
                            label="一款用于构建用户界面的 JavaScript 框架"
                            url="https://cn.vuejs.org/"
                            center
                            is-link
                        >
                            <template #icon>
                                <svg
                                    style="margin-right: 10px"
                                    class="logo"
                                    viewBox="0 0 128 128"
                                    width="24"
                                    height="24"
                                    data-v-35dc6318=""
                                >
                                    <path
                                        fill="#42b883"
                                        d="M78.8,10L64,35.4L49.2,10H0l64,110l64-110C128,10,78.8,10,78.8,10z"
                                        data-v-35dc6318=""
                                    ></path>
                                    <path
                                        fill="#35495e"
                                        d="M78.8,10L64,35.4L49.2,10H25.6L64,76l38.4-66H78.8z"
                                        data-v-35dc6318=""
                                    ></path>
                                </svg>
                            </template>
                        </van-cell>
                        <van-cell
                            title="Vant"
                            label="一个轻量、可定制的移动端组件库"
                            url="https://vant-ui.github.io/vant/#/zh-CN"
                            center
                            is-link
                        >
                            <template #icon>
                                <img
                                    style="margin-right: 10px; width: 24px"
                                    src="https://fastly.jsdelivr.net/npm/@vant/assets/logo.png"
                                />
                            </template>
                        </van-cell>
                        <van-cell
                            title="Tesseract"
                            label="Tesseract is an open source text recognition (OCR) Engine, available under the Apache 2.0 license."
                            url="https://github.com/tesseract-ocr/tessdoc"
                            center
                            is-link
                        >
                            <template #icon>
                                <span style="margin-right: 10px; width: 24px; text-align: center;font-weight: bold">T</span>
                            </template>
                        </van-cell>
                        <van-cell
                            title="SnapDOM"
                            label="SnapDOM is a next-generation DOM Capture Engine — ultra-fast, modular, and extensible."
                            url="https://github.com/zumerlab/snapdom"
                            center
                            is-link
                        >
                            <template #icon>
                                <span style="margin-right: 10px; width: 24px; text-align: center;font-weight: bold">S</span>
                            </template>
                        </van-cell>
                        <van-cell
                            title="SheetJS"
                            label="SheetJS Tools for Excel Spreadsheets"
                            url="https://sheetjs.com/"
                            center
                            is-link
                        >
                            <template #icon>
                                <img
                                    style="margin-right: 10px; width: 24px"
                                    src="https://sheetjs.com/sketch128.png"
                                />
                            </template>
                        </van-cell>
                        <van-cell
                            title="Marked"
                            label="a low-level markdown compiler for parsing markdown without caching or blocking for long periods of time."
                            url="https://marked.js.org/"
                            center
                            is-link
                        >
                            <template #icon>
                                <img
                                    style="margin-right: 10px; width: 24px"
                                    src="https://marked.js.org/img/logo-black.svg"
                                />
                            </template>
                        </van-cell>
                        <van-cell
                            title="一言（Hitokoto）"
                            label="动漫也好、小说也好、网络也好，不论在哪里，我们总会看到有那么一两个句子能穿透你的心。我们把这些句子汇聚起来，形成一言网络，以传递更多的感动。如果可以，我们希望我们没有停止服务的那一天。"
                            url="https://hitokoto.cn/"
                            center
                            is-link
                        >
                            <template #icon>
                                <img
                                    style="margin-right: 10px; width: 24px"
                                    src="https://developer.hitokoto.cn/logo.png"
                                />
                            </template>
                        </van-cell>
                    </van-cell-group>
                </div>
            </div>
        `
        const about = Vue.createApp({
            template: about_template,
            setup() {
                const dialogH = Vue.ref(false)
                return {
                    dialogH
                };
            },
            mounted() {
                renderMarkdownSafely(document.getElementById('aboutmd'), GM_getResourceText("about-md").replace(/(.*[\r?\n]){2}/, ''));
                renderMarkdownSafely(document.getElementById('updatemd'), GM_getResourceText("update-md").replace(/(.*[\r?\n]){2}/, ''));
                removeToast(toast);
                createToast("success", `关于我们部署完毕`, 2);
            }
        });
        about.use(vant);
        about.mount("#about");
    }

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
                        if (typeof (obj[nodeName]) === 'undefined') {
                            obj[nodeName] = parseElement(item);
                        } else {
                            if (typeof (obj[nodeName].push) === 'undefined') {
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
                MyConsole("[教师查询] 开始请求分页数据", { page }, "debug");

                const xhr = new XMLHttpRequest();
                xhr.withCredentials = true;

                xhr.addEventListener("readystatechange", function () {
                    if (this.readyState === this.DONE) {
                        if (this.status >= 200 && this.status < 300) {
                            const data = this.responseText;
                            const raw_result = xmlToJson(data);
                            if (!raw_result.page?.["#text"]) {
                                MyConsole("[教师查询] WebVPN 登录状态已失效", { page }, "warn");
                                resolve({ success: false, msg: "webvpn登录已过期" });
                                return;
                            }
                            const pages = raw_result.page["#text"].match(/第(\d+)\/(\d+)页/);
                            if (!pages) {
                                MyConsole("[教师查询] 无法识别分页信息", { page }, "error");
                                resolve({ success: false, msg: "教师查询结果格式异常" });
                                return;
                            }
                            const now_page = parseInt(pages[1]);
                            const all_page = parseInt(pages[2]);
                            if (all_page == 0) {
                                MyConsole("[教师查询] 当前关键词没有结果", { page }, "info");
                                resolve({ success: false, msg: "查询不到该教师" });
                                return;
                            }
                            var result = { success: true, page: [now_page, all_page], data: [] };
                            var name;
                            if (raw_result.val.length == undefined) {
                                name = raw_result.word["#text"].replace(raw_result.val["#text"] + "-", "");
                                result.data.push({ name: name, number: raw_result.val["#text"], unit: raw_result.remind["#text"] });
                            } else {
                                for (let i = 0; i < raw_result.val.length; i++) {
                                    // if (result.data[i%3] == undefined) {
                                    //     result.data[i%3] = [];
                                    // }
                                    name = raw_result.word[i]["#text"].replace(raw_result.val[i]["#text"] + "-", "");
                                    result.data.push({ name: name, number: raw_result.val[i]["#text"], unit: raw_result.remind[i]["#text"] });
                                }
                            }
                            MyConsole("[教师查询] 分页数据解析完成", {
                                page: now_page,
                                totalPages: all_page,
                                resultCount: result.data.length
                            }, "debug");
                            resolve(result);
                        } else {
                            MyConsole("[教师查询] 接口返回异常状态", { page, status: this.status }, "error");
                            reject(new Error(`Request failed with status ${this.status}`));
                        }
                    }
                });

                xhr.addEventListener("error", function () {
                    MyConsole("[教师查询] 请求发生网络错误", { page }, "error");
                    reject(new Error("Network error"));
                });

                xhr.open("POST", "https://webvpn.nxu.edu.cn/http/77726476706e69737468656265737421a2a713d27560391e2f5ad1e2c90171/StuExpbook/AutoCompleteServletSrtp?vpn-12-o1-202.201.128.142=");
                xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");

                try {
                    xhr.send(data);
                } catch (err) {
                    MyConsole("[教师查询] 请求发送失败", { page, error: err }, "error");
                    reject(err);
                }
            });
        }
        const tabPortal = GM_openInTab("https://webvpn.nxu.edu.cn/https/77726476706e69737468656265737421e0f85388263c265e661dc7a99c406d36de/index.html", { active: false });
        setTimeout(() => {
            tabPortal.close()
        }, "5000");
        const tabXgxtBaseInfo = GM_openInTab("https://webvpn.nxu.edu.cn/https/77726476706e69737468656265737421e8e4478b693e7045300d8db9d6562d/xsfw/sys/jbxxapp/*default/index.do#/wdxx", { active: false });
        setTimeout(() => {
            tabXgxtBaseInfo.close()
        }, "5000");
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

        GM_addElement(document.querySelector('body'), 'div', { id: 'tools' });
        GM_addStyle(`
            #main,
            #main .schedule-manager,
            #main .schedule-manager * {
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

            .schedule-manager-tab {
                padding: 12px;
                background: #f7f8fa;
            }

            .schedule-manager-actions {
                flex: none;
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 12px;
                padding: 4px 8px 12px;
                border-bottom: 1px solid #e1e4e8;
            }

            .schedule-manager-hint {
                color: #6b7280;
                font-size: 13px;
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

            .add-btn:disabled {
                cursor: not-allowed;
                opacity: 0.55;
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
                background: transparent;
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
                padding: 12px 0 0;
                overflow: auto;
            }

            .schedule-table {
                width: 100%;
                border-collapse: collapse;
                background: white;
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

            .file-item-display.file-item-all-free {
                background: #e8f8ef;
                color: #07c160;
                font-weight: 600;
            }

            .file-item-display.file-item-online-only {
                background: #fff7e6;
                color: #ad6800;
                font-weight: 600;
            }

            .availability-summary {
                margin-top: 6px;
                color: #646566;
                font-size: 11px;
                font-weight: 600;
            }

            .availability-summary.status-free {
                color: #078b47;
            }

            .availability-summary.status-online {
                color: #ad6800;
            }

            .availability-summary.status-none {
                color: #c41d7f;
            }

            .empty-cell {
                color: #a0aec0;
                font-size: 12px;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .visually-hidden {
                position: absolute !important;
                width: 1px !important;
                height: 1px !important;
                padding: 0 !important;
                margin: -1px !important;
                overflow: hidden !important;
                clip: rect(0, 0, 0, 0) !important;
                white-space: nowrap !important;
                border: 0 !important;
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
            }

            .personal-schedule-page {
                height: 100%;
                min-width: 0;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                background: #f7f8fa;
            }

            #main > .personal-schedule-page.show {
                display: flex;
            }

            .personal-schedule-toolbar {
                flex: none;
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                gap: 12px;
                padding: 8px 12px;
                background: #fff;
                border-bottom: 1px solid #ebedf0;
            }

            .personal-link-search-form {
                flex: 1 1 420px;
                min-width: 240px;
            }

            .personal-link-search {
                width: 100%;
                padding: 0;
            }

            .personal-schedule-actions {
                flex: none;
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                gap: 8px;
            }

            .personal-schedule-tabs {
                flex: 1;
                min-height: 0;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }

            .personal-schedule-tabs > .van-tabs__wrap {
                flex: none;
            }

            .personal-schedule-tabs > .van-tabs__content {
                flex: 1;
                min-height: 0;
            }

            .personal-schedule-tabs > .van-tabs__content > .van-tab__panel {
                height: 100%;
                overflow: hidden;
            }

            .schedule-key-page {
                height: 100%;
                overflow: auto;
                padding: 12px 16px;
                background: #f7f8fa;
            }

            .schedule-key-content {
                width: 100%;
                max-width: 100%;
            }

            .schedule-key-guide {
                margin-bottom: 18px;
                padding: 8px 12px;
                border-left: 4px solid #1989fa;
                color: #4b5563;
                line-height: 1.65;
            }

            .schedule-key-guide p {
                margin: 4px 0;
            }

            .schedule-key-empty {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding-bottom: 24px;
            }

            .schedule-key-section {
                padding: 16px 0;
                border-top: 1px solid #ebedf0;
            }

            .schedule-private-key-section {
                border-color: #ebedf0;
            }

            .schedule-key-section-title {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
                margin-bottom: 10px;
            }

            .schedule-key-section-title strong,
            .schedule-key-section-title span {
                display: block;
            }

            .schedule-key-section-title span {
                margin-top: 3px;
                color: #6b7280;
                font-size: 13px;
            }

            .schedule-key-buttons {
                display: flex;
                flex-wrap: wrap;
                justify-content: flex-end;
                gap: 8px;
            }

            .schedule-key-text {
                width: 100%;
                resize: vertical;
                padding: 10px;
                border: 1px solid #dcdfe6;
                border-radius: 8px;
                background: #f8fafc;
                color: #334155;
                font: 12px/1.5 Consolas, Monaco, monospace;
                word-break: break-all;
            }

            .schedule-private-key-text {
                background: #fff;
            }

            .schedule-private-key-hidden {
                padding: 24px 12px;
                background: #f3f4f6;
                color: #6b7280;
                text-align: center;
            }

            .schedule-key-regenerate {
                display: flex;
                justify-content: flex-end;
                margin-top: 18px;
            }

            .personal-panel-shell {
                height: 100%;
                min-height: 0;
                display: flex;
                flex-direction: column;
            }

            .personal-week-filter {
                flex: none;
                padding: 6px 12px;
                background: #fff;
                border-bottom: 1px solid #f0f1f2;
                overflow: hidden;
            }

            .personal-week-axis {
                --van-radius-sm: var(--van-radius-max);
                --van-tabs-card-height: 32px;
            }

            .personal-week-axis > .van-tabs__wrap {
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .personal-week-axis .van-tabs__nav--card {
                max-width: 100%;
                margin: 0;
            }

            .personal-week-axis .van-tabs__nav--card .van-tab {
                min-width: 64px;
            }

            .personal-schedule-capture {
                flex: 1;
                min-height: 0;
                overflow: auto;
                padding: 12px;
                background: #f7f8fa;
            }

            .personal-table-capture {
                width: 100%;
                min-width: 1002px;
                min-height: 100%;
            }

            .personal-stats-capture {
                min-height: 100%;
            }

            .personal-course-grid {
                width: 100%;
                min-width: 1002px;
                display: grid;
                grid-template-columns: 92px repeat(7, minmax(130px, 1fr));
                grid-template-rows: 38px repeat(10, minmax(52px, auto));
                gap: 1px;
                padding: 1px;
                background: #ebedf0;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, .05);
            }

            .personal-course-grid-corner,
            .personal-course-grid-day,
            .personal-course-grid-period,
            .personal-course-grid-cell {
                min-width: 0;
                box-sizing: border-box;
            }

            .personal-course-grid-corner,
            .personal-course-grid-day {
                display: flex;
                align-items: center;
                justify-content: center;
                background: #f0f4ff;
                color: #4a5568;
                font-size: 13px;
                font-weight: 600;
            }

            .personal-course-grid-corner {
                grid-column: 1;
                grid-row: 1;
            }

            .personal-course-grid-period {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 4px;
                background: #f8f9ff;
                color: #4a5568;
                font-size: 11px;
                text-align: center;
            }

            .personal-course-grid-cell {
                z-index: 1;
                background: #fff;
            }

            .personal-table {
                width: 100%;
                min-width: 980px;
                table-layout: fixed;
                border-spacing: 0;
                border-collapse: separate;
                background: #fff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 10px rgba(0, 0, 0, .05);
            }

            .personal-table th,
            .personal-table td {
                border-right: 1px solid #ebedf0;
                border-bottom: 1px solid #ebedf0;
                padding: 6px;
                text-align: center;
                vertical-align: top;
            }

            .personal-table thead th {
                height: 38px;
                background: #f0f4ff;
                color: #4a5568;
                font-size: 13px;
            }

            .personal-table .personal-period-cell {
                width: 92px;
                min-width: 92px;
                background: #f8f9ff;
                color: #4a5568;
                vertical-align: middle;
                font-size: 12px;
            }

            .personal-course-card {
                margin-bottom: 5px;
                padding: 7px 6px;
                border-radius: 6px;
                border-left: 3px solid #4a6bdf;
                background: #edf3ff;
                color: #2d3748;
                line-height: 1.35;
                text-align: left;
                word-break: break-word;
            }

            .personal-course-card:last-child {
                margin-bottom: 0;
            }

            .personal-course-stack {
                z-index: 2;
                min-width: 0;
                align-self: stretch;
                margin-top: 3px;
                margin-right: 3px;
                margin-bottom: 3px;
                margin-left: 3px;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                gap: 4px;
                box-sizing: border-box;
            }

            .personal-course-stack > .personal-course-card {
                width: 100%;
                min-height: 0;
                flex: 0 0 auto;
                margin-bottom: 0;
                box-sizing: border-box;
            }

            .personal-course-name {
                flex: 1;
                min-width: 0;
                font-size: 13px;
                font-weight: 600;
                color: #2949b8;
            }

            .personal-course-header {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                gap: 5px;
            }

            .personal-course-variant-count {
                flex: none;
                padding: 1px 5px;
                border-radius: 999px;
                background: #dfe7ff;
                color: #4a6bdf;
                font-size: 10px;
                line-height: 1.5;
                white-space: nowrap;
            }

            .personal-course-variant-count.overlap {
                background: #fff3e0;
                color: #d46b08;
            }

            .personal-course-variants {
                margin-top: 5px;
                border-top: 1px solid #d9e1f2;
            }

            .personal-course-variant {
                padding: 5px 0;
            }

            .personal-course-variant + .personal-course-variant {
                border-top: 1px dashed #d9e1f2;
            }

            .personal-course-variant-weeks {
                color: #4a6bdf;
                font-size: 11px;
                font-weight: 600;
            }

            .personal-course-variant-detail {
                margin-top: 1px;
                color: #646566;
                font-size: 11px;
            }

            .personal-course-meta {
                margin-top: 2px;
                color: #646566;
                font-size: 11px;
            }

            .personal-free-cell {
                min-height: 52px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #1989fa;
                font-size: 12px;
                line-height: 1.45;
                white-space: pre-line;
            }

            .personal-not-free {
                color: #c8c9cc;
            }

            .personal-all-term-free {
                color: #07c160;
                font-weight: 600;
            }

            .personal-online-only {
                color: #ad6800;
                font-weight: 600;
            }

            .personal-empty-state {
                height: 100%;
                min-height: 260px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .personal-stats {
                height: 100%;
                overflow: auto;
                padding: 12px;
            }

            .personal-stat-grid {
                display: grid;
                grid-template-columns: repeat(4, minmax(130px, 1fr));
                gap: 10px;
                margin-bottom: 12px;
            }

            .personal-stat-card,
            .personal-chart-card {
                padding: 14px;
                border-radius: 8px;
                background: #fff;
                box-shadow: 0 2px 10px rgba(0, 0, 0, .05);
            }

            .personal-stat-value {
                margin-top: 4px;
                color: #4a6bdf;
                font-size: 26px;
                font-weight: 700;
            }

            .personal-stat-label,
            .personal-stat-unit {
                color: #969799;
                font-size: 12px;
            }

            .personal-chart-card h3 {
                margin: 0 0 12px;
                color: #323233;
                font-size: 16px;
            }

            .personal-week-bars {
                display: flex;
                align-items: flex-end;
                gap: 8px;
                min-height: 210px;
                overflow-x: auto;
                padding: 8px 4px 0;
            }

            .personal-week-bar-item {
                flex: 1 0 36px;
                min-width: 36px;
                text-align: center;
                color: #969799;
                font-size: 11px;
            }

            .personal-week-bar-track {
                height: 160px;
                display: flex;
                align-items: flex-end;
                justify-content: center;
            }

            .personal-week-bar {
                width: 22px;
                min-height: 2px;
                border-radius: 5px 5px 0 0;
                background: linear-gradient(180deg, #6f8df3, #4a6bdf);
            }

            .personal-week-bar-value {
                margin-bottom: 3px;
                color: #4a6bdf;
                font-weight: 600;
            }

            @media (max-width: 900px) {
                .personal-schedule-toolbar {
                    align-items: stretch;
                    flex-direction: column;
                    gap: 6px;
                }

                .personal-link-search-form {
                    flex-basis: auto;
                    width: 100%;
                    min-width: 0;
                }

                .schedule-manager-actions {
                    align-items: stretch;
                    flex-direction: column;
                }

                .schedule-manager-actions > div {
                    justify-content: flex-start !important;
                }

                .personal-stat-grid {
                    grid-template-columns: repeat(2, minmax(120px, 1fr));
                }

                .schedule-key-page {
                    padding: 10px;
                }

                .schedule-key-section-title {
                    align-items: stretch;
                    flex-direction: column;
                }

                .schedule-key-buttons {
                    justify-content: flex-start;
                }
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
                <van-sidebar-item title="课表信息" />
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
                <!-- <div>
                    <iframe src="//campus-charge.thisish.cn" style="width: 100%;height: 100%;border: none;"></iframe>
                </div> -->
                <div class="personal-schedule-page">
                    <van-tabs ref="personalTabsRef" v-model:active="personalTab" class="personal-schedule-tabs">
                        <template #nav-bottom>
                    <div v-show="personalScheduleToolbarVisible" class="personal-schedule-toolbar">
                        <form action="/" class="personal-link-search-form" @submit.prevent>
                            <van-search
                                v-model="personalLink"
                                class="personal-link-search"
                                show-action
                                clearable
                                placeholder="输入课表链接，如 https://portal.nxu.edu.cn/cal/1526230487620710400"
                                @search="loadScheduleFromInput"
                            >
                                <template #action>
                                    <div @click="loadScheduleFromInput">查看课表</div>
                                </template>
                            </van-search>
                        </form>
                        <div class="personal-schedule-actions">
                            <van-uploader
                                accept=".json,application/json"
                                result-type="file"
                                :disabled="personalLoading"
                                :after-read="handlePersonalUpload"
                            >
                                <van-button size="small" icon="upgrade" type="primary" plain>上传 JSON</van-button>
                            </van-uploader>
                            <van-button
                                size="small"
                                icon="down"
                                type="primary"
                                plain
                                :disabled="!canExportPersonalJson"
                                @click="exportPersonalJson"
                            >导出 JSON</van-button>
                            <van-button size="small" icon="photo-o" type="primary" @click="exportPersonalImage">导出图片</van-button>
                        </div>
                    </div>
                        </template>
                        <van-tab title="课程总览" name="overview">
                            <div class="personal-stats">
                                <div ref="personalStatsCapture" class="personal-stats-capture">
                                    <van-empty v-if="!personalSchedule" description="暂无可统计的课表" />
                                    <template v-else>
                                    <div class="personal-stat-grid">
                                        <div class="personal-stat-card">
                                            <div class="personal-stat-label">本学期课程</div>
                                            <div class="personal-stat-value">{{ personalStats.totalCourses }}</div>
                                            <div class="personal-stat-unit">门</div>
                                        </div>
                                        <div class="personal-stat-card">
                                            <div class="personal-stat-label">总课时</div>
                                            <div class="personal-stat-value">{{ personalStats.totalHours }}</div>
                                            <div class="personal-stat-unit">节</div>
                                        </div>
                                        <div class="personal-stat-card">
                                            <div class="personal-stat-label">实际课次</div>
                                            <div class="personal-stat-value">{{ personalStats.totalLessons }}</div>
                                            <div class="personal-stat-unit">次</div>
                                        </div>
                                        <div class="personal-stat-card">
                                            <div class="personal-stat-label">教学周</div>
                                            <div class="personal-stat-value">{{ personalStats.totalWeeks }}</div>
                                            <div class="personal-stat-unit">周</div>
                                        </div>
                                    </div>
                                    <div class="personal-chart-card">
                                        <h3>每周课时分布</h3>
                                        <div class="personal-week-bars">
                                            <div v-for="item in personalStats.weekly" :key="item.week" class="personal-week-bar-item">
                                                <div class="personal-week-bar-value">{{ item.hours }}</div>
                                                <div class="personal-week-bar-track">
                                                    <div class="personal-week-bar" :style="{ height: item.percent + '%' }"></div>
                                                </div>
                                                <div>第{{ item.week }}周</div>
                                            </div>
                                        </div>
                                    </div>
                                    </template>
                                </div>
                            </div>
                        </van-tab>
                        <van-tab title="个人课表" name="personal">
                            <div class="personal-panel-shell">
                                <div class="personal-week-filter" v-if="personalSchedule">
                                    <van-tabs ref="personalCourseWeekTabsRef" v-model:active="selectedCourseWeek" type="card" shrink class="personal-week-axis">
                                        <van-tab v-for="option in personalWeekOptions" :key="option.value" :name="option.value" :title="option.text" />
                                    </van-tabs>
                                </div>
                                <div class="personal-schedule-capture">
                                    <div ref="personalCourseCapture" class="personal-table-capture">
                                        <div v-if="personalLoading" class="personal-empty-state"><van-loading size="28px" vertical>正在获取课表</van-loading></div>
                                        <van-empty v-else-if="!personalSchedule" :description="personalError || '暂无课表，请输入链接或上传 JSON'" />
                                        <div v-else class="personal-course-grid">
                                            <div class="personal-course-grid-corner">节次 / 时间</div>
                                            <div
                                                v-for="day in personalDays"
                                                :key="'header-' + day.number"
                                                class="personal-course-grid-day"
                                                :style="{ gridColumn: String(day.number + 1), gridRow: '1' }"
                                            >{{ day.text }}</div>
                                            <template v-for="row in personalPeriodRows" :key="row.key">
                                                <div
                                                    class="personal-course-grid-period"
                                                    :style="{ gridColumn: '1', gridRow: String(row.period + 1) }"
                                                >
                                                    <div>第 {{ row.label }} 节</div>
                                                    <div>{{ row.time }}</div>
                                                </div>
                                                <div
                                                    v-for="day in personalDays"
                                                    :key="row.key + '-' + day.number"
                                                    class="personal-course-grid-cell"
                                                    :style="{ gridColumn: String(day.number + 1), gridRow: String(row.period + 1) }"
                                                ></div>
                                            </template>
                                            <div
                                                v-for="group in personalCourseLayout"
                                                :key="group.key"
                                                class="personal-course-stack"
                                                :style="group.gridStyle"
                                            >
                                                <div
                                                    v-for="entry in group.entries"
                                                    :key="entry.key"
                                                    class="personal-course-card"
                                                    :style="{ borderLeftColor: entry.color }"
                                                >
                                                        <div class="personal-course-header">
                                                            <div class="personal-course-name">{{ entry.name }}</div>
                                                            <!--<span
                                                                v-if="entry.variants.length > 1"
                                                                class="personal-course-variant-count"
                                                                :class="{ overlap: entry.hasOverlappingVariants }"
                                                            >{{ entry.hasOverlappingVariants ? '同周多安排' : entry.variants.length + ' 种安排' }}</span>-->
                                                        </div>
                                                        <template v-if="entry.variants.length === 1">
                                                            <div class="personal-course-meta" v-if="entry.variants[0].teacherText">教师：{{ entry.variants[0].teacherText }}</div>
                                                            <div class="personal-course-meta" v-if="entry.variants[0].room">教室：{{ entry.variants[0].room }}</div>
                                                            <div class="personal-course-meta">周次：{{ entry.variants[0].weeksText }}</div>
                                                        </template>
                                                        <div v-else class="personal-course-variants">
                                                            <div v-for="variant in entry.variants" :key="variant.key" class="personal-course-variant">
                                                                <div class="personal-course-variant-weeks">{{ variant.weeksText }}</div>
                                                                <div class="personal-course-variant-detail">{{ variant.detailText }}</div>
                                                            </div>
                                                        </div>
                                                        <div class="personal-course-meta" v-if="entry.periodText">节次：{{ entry.periodText }}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </van-tab>
                        <van-tab title="个人空课表" name="personal-free">
                            <div class="personal-panel-shell">
                                <div class="personal-week-filter" v-if="personalSchedule">
                                    <van-tabs ref="personalFreeWeekTabsRef" v-model:active="selectedFreeWeek" type="card" shrink class="personal-week-axis">
                                        <van-tab v-for="option in personalWeekOptions" :key="option.value" :name="option.value" :title="option.text" />
                                    </van-tabs>
                                </div>
                                <div class="personal-schedule-capture">
                                    <div ref="personalFreeCapture" class="personal-table-capture">
                                        <van-empty v-if="!personalSchedule" description="暂无课表数据" />
                                        <table v-else class="personal-table" aria-label="个人空闲时间表">
                                        <caption class="visually-hidden">按星期和节次展示完全空闲、仅有线上课程可协调或有课状态</caption>
                                        <thead>
                                            <tr>
                                                <th scope="col" class="personal-period-cell">节次 / 时间</th>
                                                <th v-for="day in personalDays" :key="day.number" scope="col">{{ day.text }}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="row in personalPeriodRows" :key="row.key">
                                                <th scope="row" class="personal-period-cell">
                                                    <div>第 {{ row.label }} 节</div>
                                                    <div>{{ row.time }}</div>
                                                </th>
                                                <td v-for="day in personalDays" :key="day.number">
                                                    <div
                                                        class="personal-free-cell"
                                                        :class="{
                                                            'personal-not-free': !personalFreeGrid[row.key][day.number].isFree,
                                                            'personal-all-term-free': personalFreeGrid[row.key][day.number].isAllTermFree,
                                                            'personal-online-only': personalFreeGrid[row.key][day.number].hasOnline
                                                        }"
                                                        :aria-label="personalFreeGrid[row.key][day.number].ariaLabel"
                                                    >{{ personalFreeGrid[row.key][day.number].text }}</div>
                                                </td>
                                            </tr>
                                        </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </van-tab>
                        <van-tab title="空课表生成" name="multi-free">
                    <div class="schedule-manager schedule-manager-tab">
                        <div class="schedule-manager-actions">
                            <span class="schedule-manager-hint">前往教务系统导出 JSON 文件后在此添加</span>
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
                                <button @click="triggerFileInput" class="add-btn" :disabled="multiScheduleLoading">
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
                                <table ref="multiEmptyTable" class="schedule-table" aria-label="多人空闲时间表">
                                    <caption class="visually-hidden">按星期和节次展示各成员的完全空闲、仅有线上课程可协调、部分可用或无人空闲状态</caption>
                                    <thead>
                                        <tr>
                                        <th scope="col" class="time-header">节次</th>
                                        <th v-for="day in daysOfWeek" :key="day" scope="col">{{ day }}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(period, index) in classPeriods" :key="index">
                                            <th scope="row" class="period-cell">{{ period }}</th>
                                            <td v-for="day in daysOfWeek" :key="day" class="schedule-cell">
                                                <div v-if="allFilesSchedule[day] && allFilesSchedule[day][index].length > 0">
                                                <div
                                                    v-for="(item, i) in allFilesSchedule[day][index]"
                                                    :key="item.key || i"
                                                    class="file-item-display"
                                                    :class="{
                                                        'file-item-all-free': item.status === 'free',
                                                        'file-item-online-only': item.status === 'online'
                                                    }"
                                                >
                                                    {{ item.text }}
                                                </div>
                                                <div
                                                    class="availability-summary"
                                                    :class="'status-' + multiAvailabilitySummary[day][index].status"
                                                >{{ multiAvailabilitySummary[day][index].text }}</div>
                                                </div>
                                                <div v-else class="empty-cell">
                                                {{ multiAvailabilitySummary[day][index].text }}
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                        </van-tab>
                        <van-tab title="课表密钥管理" name="keys">
                            <div class="schedule-key-page">
                                <div class="schedule-key-content">
                                    <div class="schedule-key-guide">
                                        <p><strong>加密密钥（公钥）可以分享：</strong>对方导出课表时使用你的加密密钥，生成的文件只能由你的解密密钥打开。</p>
                                        <p><strong>解密密钥（私钥）必须保密：</strong>不要发给同学、群聊或任何其他人。解密密钥丢失后无法恢复，旧加密文件也无法打开。</p>
                                        <p>换浏览器、清理脚本数据、重装脚本或重新生成密钥前，请先自行备份解密密钥。</p>
                                    </div>
                                    <div v-if="!scheduleKeyPair" class="schedule-key-empty">
                                        <van-empty description="尚未生成课表密钥" />
                                        <van-button type="primary" :loading="scheduleKeyGenerating" @click="generateScheduleKeyPair">生成课表密钥</van-button>
                                    </div>
                                    <template v-else>
                                        <section class="schedule-key-section">
                                            <div class="schedule-key-section-title">
                                                <div><strong>加密密钥（公钥，可分享）</strong><span>可以复制并发送给需要向你提供课表的人</span></div>
                                                <van-button size="small" type="primary" plain @click="copyScheduleKey('public')">复制加密密钥</van-button>
                                            </div>
                                            <textarea class="schedule-key-text" :value="scheduleKeyPair.publicKey" rows="8" readonly></textarea>
                                        </section>
                                        <section class="schedule-key-section schedule-private-key-section">
                                            <div class="schedule-key-section-title">
                                                <div><strong>解密密钥（私钥，请保密）</strong><span>只由你本人保管，任何人索要都不要发送</span></div>
                                                <div class="schedule-key-buttons">
                                                    <van-button size="small" plain @click="showSchedulePrivateKey = !showSchedulePrivateKey">{{ showSchedulePrivateKey ? '隐藏解密密钥' : '显示解密密钥' }}</van-button>
                                                    <van-button size="small" type="danger" plain @click="copyScheduleKey('private')">复制解密密钥</van-button>
                                                </div>
                                            </div>
                                            <textarea
                                                v-if="showSchedulePrivateKey"
                                                class="schedule-key-text schedule-private-key-text"
                                                :value="scheduleKeyPair.privateKey"
                                                rows="12"
                                                readonly
                                            ></textarea>
                                            <div v-else class="schedule-private-key-hidden">解密密钥已隐藏，查看前请确认周围无人窥视屏幕。</div>
                                        </section>
                                        <div class="schedule-key-regenerate">
                                            <van-button type="danger" plain :loading="scheduleKeyGenerating" @click="generateScheduleKeyPair">重新生成密钥</van-button>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </van-tab>
                    </van-tabs>
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
                    if (index === 1) {
                        ensurePersonalSchedule();
                        resizePersonalTabs();
                    }
                };
                const searchValue = Vue.ref('');
                const teacherList = Vue.ref([]);
                const onSearch = (val) => {
                    searchTeacher(val);
                };
                const onSearchClick = () => {
                    searchTeacher(searchValue.value);
                };
                const searchTeacher = async (val) => {
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
                        if (!list.success) {
                            createToast("error", list.msg);
                            break;
                        }
                        for (let i = 0; i < list.data.length; i++) {
                            row = i % 3 + now_row;
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
                        now_page = list.page[0] + 1;
                        all_page = list.page[1];
                    }
                };
                const teacherClick = (event) => {
                    GM_setClipboard(event.target.closest('.van-cell').getAttribute("number"));
                    vant.showToast("工号已复制");
                }

                const personalDays = Array.from({ length: 7 }, (_, index) => ({
                    number: index + 1,
                    text: CourseScheduleTools.weekdayText(index + 1)
                }));
                const personalPeriodRows = CourseScheduleTools.periodTimes.map(({ period, start, end }) => ({
                    key: String(period),
                    label: String(period),
                    period,
                    periods: [period],
                    time: `${start}-${end}`
                }));
                const scheduleManagerPeriodRows = [
                    { key: "1-2", label: "1-2", periods: [1, 2], time: "08:10-09:45" },
                    { key: "3-4", label: "3-4", periods: [3, 4], time: "10:15-11:50" },
                    { key: "5-6", label: "5-6", periods: [5, 6], time: "14:00-15:35" },
                    { key: "7-8", label: "7-8", periods: [7, 8], time: "15:55-17:30" },
                    { key: "9-10", label: "9-10", periods: [9, 10], time: "19:00-20:35" }
                ];
                const personalLink = Vue.ref("");
                const personalSchedule = Vue.ref(null);
                const personalSource = Vue.ref("");
                const personalLoading = Vue.ref(false);
                const personalError = Vue.ref("");
                const personalTab = Vue.ref("personal");
                const personalScheduleToolbarVisible = Vue.computed(() =>
                    ["overview", "personal", "personal-free"].includes(personalTab.value)
                );
                const selectedCourseWeek = Vue.ref(0);
                const selectedFreeWeek = Vue.ref(0);
                const personalTabsRef = Vue.ref(null);
                const personalCourseWeekTabsRef = Vue.ref(null);
                const personalFreeWeekTabsRef = Vue.ref(null);
                const personalCourseCapture = Vue.ref(null);
                const personalStatsCapture = Vue.ref(null);
                const personalFreeCapture = Vue.ref(null);
                let personalInitialized = false;
                let personalRequestVersion = 0;
                const importedSchedulePrivateKeys = new Map();
                const savedScheduleKeyPair = getGMValue(ScheduleCryptoTools.storageKey);
                const scheduleKeyPair = Vue.ref(
                    savedScheduleKeyPair?.publicKey && savedScheduleKeyPair?.privateKey
                        ? savedScheduleKeyPair
                        : null
                );
                const scheduleKeyGenerating = Vue.ref(false);
                const showSchedulePrivateKey = Vue.ref(false);

                const generateScheduleKeyPair = async () => {
                    if (scheduleKeyPair.value) {
                        try {
                            const action = await vant.showConfirmDialog({
                                title: "重新生成课表密钥？",
                                message: "重新生成后，当前解密密钥会被替换。以前的加密课表仍需要旧解密密钥才能打开，请先复制并妥善备份旧解密密钥。",
                                messageAlign: "left",
                                confirmButtonText: "确认重新生成",
                                confirmButtonColor: "#ee0a24",
                                cancelButtonText: "取消",
                                closeOnClickOverlay: false
                            });
                            if (action !== "confirm") return;
                        } catch (error) {
                            return;
                        }
                    }
                    scheduleKeyGenerating.value = true;
                    try {
                        const keyPair = await ScheduleCryptoTools.generateKeyPair();
                        GM_setValue(ScheduleCryptoTools.storageKey, keyPair);
                        scheduleKeyPair.value = keyPair;
                        showSchedulePrivateKey.value = false;
                        importedSchedulePrivateKeys.clear();
                        createToast("success", "课表密钥已生成，请立即备份解密密钥", 4);
                    } catch (error) {
                        createToast("error", error.message || "课表密钥生成失败", 4);
                    } finally {
                        scheduleKeyGenerating.value = false;
                    }
                };

                const copyScheduleKey = type => {
                    const isPrivate = type === "private";
                    const value = isPrivate ? scheduleKeyPair.value?.privateKey : scheduleKeyPair.value?.publicKey;
                    if (!value) return;
                    GM_setClipboard(value);
                    createToast("success", isPrivate ? "解密密钥已复制，请勿发送给他人" : "加密密钥已复制，可以发给他人", 3);
                };

                const resizePersonalTabs = () => Vue.nextTick(() => {
                    personalTabsRef.value?.resize();
                    const activeWeekTabs = personalTab.value === "personal"
                        ? personalCourseWeekTabsRef
                        : personalTab.value === "personal-free" ? personalFreeWeekTabsRef : null;
                    activeWeekTabs?.value?.resize();
                });

                Vue.watch(personalTab, resizePersonalTabs);

                const getTotalWeeks = (data = personalSchedule.value) => {
                    if (!data) return 0;
                    return Number(data.meta?.weekRange?.end) ||
                        Math.max(0, ...data.lessons.map(lesson => Number(lesson.week) || 0));
                };

                const personalWeekOptions = Vue.computed(() => {
                    const options = [{ text: "总体", value: 0 }];
                    for (let week = 1; week <= getTotalWeeks(); week++) {
                        options.push({ text: `第${week}周`, value: week });
                    }
                    return options;
                });

                const canExportPersonalJson = Vue.computed(() => {
                    if (!personalSchedule.value || personalSource.value === "upload") return false;
                    if (personalSource.value === "personal") return true;
                    const ownIcsId = String(getGMValue("icsId") || "");
                    const displayedIcsId = personalSchedule.value.sourceUrl?.match(/\/cal\/(\d+)/)?.[1] || "";
                    return personalSource.value === "link" && Boolean(ownIcsId) && displayedIcsId === ownIcsId;
                });

                const courseColor = (id) => {
                    const colors = ["#4a6bdf", "#07c160", "#ee0a24", "#ff976a", "#7232dd", "#1989fa", "#8b5a2b"];
                    const hash = String(id || "").split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
                    return colors[hash % colors.length];
                };

                const setPersonalSchedule = (data, source, url = "") => {
                    personalSchedule.value = CourseScheduleTools.normalize(data);
                    personalSource.value = source;
                    personalError.value = "";
                    selectedCourseWeek.value = 0;
                    selectedFreeWeek.value = 0;
                    if (url) personalLink.value = url;
                    MyConsole("[个人课表] 数据已提交到页面状态", {
                        source,
                        courseCount: personalSchedule.value.courses.length,
                        lessonCount: personalSchedule.value.lessons.length
                    }, "info");
                };

                const loadPersonalScheduleById = async (icsId, source) => {
                    const requestVersion = ++personalRequestVersion;
                    const url = `https://portal.nxu.edu.cn/cal/${icsId}`;
                    personalLoading.value = true;
                    personalError.value = "";
                    MyConsole("[个人课表] 开始加载课表", { source, requestVersion }, "info");
                    try {
                        const data = await CourseScheduleTools.fetchFromUrl(url, {
                            owner: { id: "", name: "" }
                        });
                        if (requestVersion !== personalRequestVersion) {
                            MyConsole("[个人课表] 丢弃已过期的加载结果", { source, requestVersion }, "debug");
                            return;
                        }
                        setPersonalSchedule(data, source, url);
                    } catch (error) {
                        if (requestVersion !== personalRequestVersion) {
                            MyConsole("[个人课表] 丢弃已过期请求的错误", { source, requestVersion }, "debug");
                            return;
                        }
                        personalSchedule.value = null;
                        personalSource.value = "";
                        personalError.value = error.message || "课表加载失败";
                        MyConsole("[个人课表] 课表加载失败", { source, requestVersion, error }, "error");
                        createToast("error", personalError.value, 4);
                    } finally {
                        if (requestVersion === personalRequestVersion) personalLoading.value = false;
                    }
                };

                const ensurePersonalSchedule = async () => {
                    if (personalInitialized) {
                        MyConsole("[个人课表] 跳过重复初始化", "已有初始化任务或数据", "debug");
                        return;
                    }
                    personalInitialized = true;
                    const requestVersion = ++personalRequestVersion;
                    personalLoading.value = true;
                    MyConsole("[个人课表] 开始初始化当前账号课表", { requestVersion }, "info");
                    try {
                        let icsId = getGMValue("icsId");
                        if (!icsId) icsId = await getIcsId();
                        if (requestVersion !== personalRequestVersion) {
                            MyConsole("[个人课表] 初始化结果已过期", { requestVersion }, "debug");
                            return;
                        }
                        await loadPersonalScheduleById(String(icsId), "personal");
                    } catch (error) {
                        if (requestVersion !== personalRequestVersion) return;
                        personalInitialized = false;
                        personalLoading.value = false;
                        personalError.value = error.message || "个人课表初始化失败";
                        MyConsole("[个人课表] 当前账号课表初始化失败", { requestVersion, error }, "error");
                        createToast("error", personalError.value, 4);
                    }
                };

                const parsePersonalLink = (input) => {
                    const value = String(input || "").trim();
                    const match = value.match(/^(?:https?:\/\/portal\.nxu\.edu\.cn\/cal\/)?(\d{6,})\/?(?:[?#].*)?$/i);
                    if (!match) throw new Error("请输入有效的宁夏大学课表链接");
                    return match[1];
                };

                const loadScheduleFromInput = async (value) => {
                    try {
                        const input = typeof value === "string" ? value : personalLink.value;
                        const icsId = parsePersonalLink(input);
                        await loadPersonalScheduleById(icsId, "link");
                    } catch (error) {
                        personalError.value = error.message;
                        MyConsole("[个人课表] 用户输入的课表链接无效", error, "warn");
                        createToast("warning", error.message, 3);
                    }
                };

                const handlePersonalUpload = async (fileInfo) => {
                    const requestVersion = ++personalRequestVersion;
                    personalLoading.value = true;
                    personalError.value = "";
                    try {
                        const file = fileInfo.file;
                        if (!file || !file.name.toLowerCase().endsWith(".json")) {
                            throw new Error("请选择 JSON 课表文件");
                        }
                        if (personalSource.value === "upload") {
                            personalSchedule.value = null;
                            personalSource.value = "";
                        }
                        if (file.size > ScheduleCryptoTools.maxEnvelopeBytes) throw new Error("课表文件不能超过 7 MB");
                        MyConsole("[个人课表] 开始解析上传文件", {
                            requestVersion,
                            bytes: file.size,
                            type: file.type || "unknown"
                        }, "info");
                        const data = await parseScheduleFileContent(await file.text(), {
                            filename: file.name,
                            keyCache: importedSchedulePrivateKeys,
                            declinedKeyIds: new Set()
                        });
                        if (requestVersion !== personalRequestVersion) {
                            MyConsole("[个人课表] 丢弃已过期的上传解析结果", { requestVersion }, "debug");
                            return;
                        }
                        setPersonalSchedule(data, "upload");
                        MyConsole("[个人课表] 上传文件解析完成", {
                            requestVersion,
                            courseCount: data.courses.length,
                            lessonCount: data.lessons.length
                        }, "info");
                        createToast("success", `已加载 ${file.name}`, 2);
                    } catch (error) {
                        if (requestVersion !== personalRequestVersion) return;
                        personalError.value = error.message || "JSON 文件解析失败";
                        MyConsole("[个人课表] 上传文件解析失败", { requestVersion, error }, "error");
                        createToast("error", personalError.value, 4);
                    } finally {
                        if (requestVersion === personalRequestVersion) personalLoading.value = false;
                    }
                };

                const requestStudentId = async (initialValue = "") => {
                    const value = Vue.ref(String(initialValue || ""));
                    try {
                        const action = await vant.showConfirmDialog({
                            title: "输入学号",
                            messageAlign: "left",
                            confirmButtonText: "验证",
                            message: () => Vue.h("div", null, [
                                Vue.h("div", { style: "padding: 0 16px 8px;color:#646566;font-size:13px;" }, "只能获取当前 WebVPN 登录账号的身份信息，请输入与登录账号一致的学号。"),
                                Vue.h(vant.Field, {
                                    modelValue: value.value,
                                    label: "学号",
                                    clearable: true,
                                    autocomplete: "off",
                                    placeholder: "请输入学号",
                                    "onUpdate:modelValue": input => value.value = String(input || "")
                                })
                            ]),
                            beforeClose(action) {
                                if (action === "confirm" && !/^\d{6,}$/.test(value.value.trim())) {
                                    vant.showToast("请输入有效学号");
                                    return false;
                                }
                                return true;
                            }
                        });
                        return action === "confirm" ? value.value.trim() : "";
                    } catch (error) {
                        return "";
                    }
                };

                const getVerifiedStudentOwner = async () => {
                    const existingOwner = personalSchedule.value?.owner;
                    if (existingOwner?.id && existingOwner?.name) return existingOwner;
                    const savedStudentId = String(getGMValue("WebVPN.username") || "").trim();
                    let studentId = "";
                    if (savedStudentId) {
                        try {
                            const action = await vant.showConfirmDialog({
                                title: "确认学号",
                                message: `是否使用学号 ${savedStudentId} 获取身份信息？\n\n学号必须与当前 WebVPN 登录账号一致；只能导出登录账号本人的课表，其他账号的课表只能查看。`,
                                messageAlign: "left",
                                confirmButtonText: "确认使用",
                                cancelButtonText: "重新输入"
                            });
                            if (action === "confirm") studentId = savedStudentId;
                        } catch (error) {
                            // 用户选择重新输入。
                        }
                    }
                    while (true) {
                        if (!studentId) studentId = await requestStudentId();
                        if (!studentId) {
                            const error = new Error("已取消课表导出");
                            error.code = "EXPORT_CANCELLED";
                            throw error;
                        }
                        try {
                            return await getStudentOwner(studentId);
                        } catch (error) {
                            if (error.code !== "STUDENT_ID_MISMATCH") throw error;
                            createToast("warning", `${error.message}，请重新输入学号`, 4);
                            studentId = "";
                        }
                    }
                };

                const exportPersonalJson = async () => {
                    if (!canExportPersonalJson.value) {
                        createToast("warning", "只能导出当前登录账号本人的课表", 3);
                        return;
                    }
                    MyConsole("[个人课表][JSON 导出] 开始导出", {
                        courseCount: personalSchedule.value.courses.length,
                        lessonCount: personalSchedule.value.lessons.length
                    }, "info");
                    try {
                        const owner = await getVerifiedStudentOwner();
                        const data = CourseScheduleTools.normalize({ ...personalSchedule.value, owner });
                        personalSchedule.value = data;
                        const filenameOwner = owner.name.replace(/[\\/:*?"<>|]/g, "_");
                        const result = await prepareScheduleExport(data);
                        downloadTextFile(result.content, `${filenameOwner} - 课表.json`);
                        MyConsole("[个人课表][JSON 导出] 导出完成", { encrypted: result.encrypted }, "info");
                        createToast("success", result.encrypted ? "加密课表已导出" : "课表 JSON 已导出", 2);
                    } catch (error) {
                        if (error.code === "EXPORT_CANCELLED") {
                            MyConsole("[个人课表][JSON 导出] 用户取消导出", "", "info");
                            return;
                        }
                        MyConsole("[个人课表][JSON 导出] 导出失败", error, "error");
                        createToast("error", error.message || "课表导出失败", 4);
                    }
                };

                const exportPersonalImage = async () => {
                    await Vue.nextTick();
                    const exportOptions = {
                        overview: { target: personalStatsCapture.value, filename: "课程总览" },
                        personal: { target: personalCourseCapture.value, filename: "个人课表" },
                        "personal-free": { target: personalFreeCapture.value, filename: "个人空课表" }
                    };
                    const option = exportOptions[personalTab.value];
                    if (!option?.target) {
                        MyConsole("[个人课表][图片导出] 当前 Tab 尚未完成渲染", { tab: personalTab.value }, "warn");
                        createToast("warning", "当前页面尚未完成渲染", 2);
                        return;
                    }
                    MyConsole("[个人课表][图片导出] 开始导出", { tab: personalTab.value }, "info");
                    try {
                        await snapdom.download(option.target, {
                            format: "png",
                            filename: option.filename,
                            scale: 2.5,
                            quality: 1
                        });
                        MyConsole("[个人课表][图片导出] 导出完成", { tab: personalTab.value }, "info");
                    } catch (error) {
                        MyConsole("[个人课表][图片导出] 导出失败", { tab: personalTab.value, error }, "error");
                        createToast("error", "导出图片失败，请重试", 3);
                    }
                };

                const buildPersonalCourseEntries = (data, week = 0) => {
                    const maps = CourseScheduleTools.getMaps(data);
                    const groups = new Map();
                    data.lessons
                        .filter(lesson => !week || lesson.week === week)
                        .forEach(lesson => {
                            const detail = CourseScheduleTools.getLessonDetail(maps, lesson);
                            const teachers = detail.teachers || [];
                            const periods = [...lesson.periods].sort((left, right) => left - right);
                            const groupKey = [lesson.courseId, lesson.weekday, periods.join(",")].join("|");
                            if (!groups.has(groupKey)) {
                                groups.set(groupKey, {
                                    key: groupKey,
                                    name: detail.course.name || "未命名课程",
                                    weekday: lesson.weekday,
                                    periods,
                                    periodText: lesson.periodText || CourseScheduleTools.formatPeriods(periods),
                                    color: courseColor(lesson.courseId),
                                    variants: new Map()
                                });
                            }
                            const group = groups.get(groupKey);
                            const teacherKey = [...teachers].sort().join("、");
                            const variantKey = [lesson.scheduleId, teacherKey, detail.room].join("|");
                            if (!group.variants.has(variantKey)) {
                                group.variants.set(variantKey, {
                                    key: variantKey,
                                    teacherText: detail.teacherText || "",
                                    room: detail.room || "",
                                    weeks: []
                                });
                            }
                            group.variants.get(variantKey).weeks.push(lesson.week);
                        });

                    const totalWeeks = getTotalWeeks(data);
                    return [...groups.values()].map(group => {
                        const variants = [...group.variants.values()]
                            .map(variant => {
                                const weeks = [...new Set(variant.weeks)].sort((left, right) => left - right);
                                return {
                                    ...variant,
                                    weeks,
                                    weeksText: CourseScheduleTools.formatWeeks(weeks, totalWeeks),
                                    detailText: [variant.teacherText, variant.room].filter(Boolean).join(" · ") || "未注明教师与教室"
                                };
                            })
                            .sort((left, right) =>
                                (left.weeks[0] || 0) - (right.weeks[0] || 0) ||
                                left.teacherText.localeCompare(right.teacherText, "zh-Hans-CN") ||
                                left.room.localeCompare(right.room, "zh-Hans-CN")
                            );
                        const seenWeeks = new Set();
                        const hasOverlappingVariants = variants.some(variant =>
                            variant.weeks.some(item => {
                                if (seenWeeks.has(item)) return true;
                                seenWeeks.add(item);
                                return false;
                            })
                        );
                        return {
                            key: group.key,
                            name: group.name,
                            weekday: group.weekday,
                            periods: group.periods,
                            periodText: group.periodText,
                            color: group.color,
                            variants,
                            hasOverlappingVariants
                        };
                    });
                };

                const splitConsecutivePeriods = (periods) => {
                    const values = [...new Set((periods || []).map(Number))]
                        .filter(period => Number.isInteger(period) && period >= 1 && period <= 10)
                        .sort((left, right) => left - right);
                    const segments = [];
                    values.forEach(period => {
                        const segment = segments[segments.length - 1];
                        if (!segment || period !== segment[segment.length - 1] + 1) {
                            segments.push([period]);
                        } else {
                            segment.push(period);
                        }
                    });
                    return segments;
                };

                const buildPersonalCourseLayout = (entries) => {
                    const blocksByDay = new Map();
                    entries.forEach(entry => splitConsecutivePeriods(entry.periods).forEach(segment => {
                        const startPeriod = segment[0];
                        const endPeriod = segment[segment.length - 1];
                        const block = {
                            ...entry,
                            key: `${entry.key}|${startPeriod}-${endPeriod}`,
                            periods: segment,
                            periodText: CourseScheduleTools.formatPeriods(segment),
                            startPeriod,
                            endPeriod
                        };
                        if (!blocksByDay.has(entry.weekday)) blocksByDay.set(entry.weekday, []);
                        blocksByDay.get(entry.weekday).push(block);
                    }));

                    const result = [];
                    [...blocksByDay.keys()].sort((left, right) => left - right).forEach(weekday => {
                        const dayBlocks = blocksByDay.get(weekday).sort((left, right) =>
                            left.startPeriod - right.startPeriod ||
                            left.endPeriod - right.endPeriod ||
                            left.name.localeCompare(right.name, "zh-Hans-CN")
                        );
                        const components = [];
                        let component = [];
                        let componentEnd = 0;
                        dayBlocks.forEach(block => {
                            if (component.length && block.startPeriod > componentEnd) {
                                components.push(component);
                                component = [];
                                componentEnd = 0;
                            }
                            component.push(block);
                            componentEnd = Math.max(componentEnd, block.endPeriod);
                        });
                        if (component.length) components.push(component);

                        components.forEach(items => {
                            const startPeriod = Math.min(...items.map(item => item.startPeriod));
                            const endPeriod = Math.max(...items.map(item => item.endPeriod));
                            result.push({
                                key: [weekday, startPeriod, endPeriod, ...items.map(item => item.key)].join("|"),
                                weekday,
                                startPeriod,
                                endPeriod,
                                hasTimeOverlap: items.length > 1,
                                entries: items,
                                gridStyle: {
                                    gridColumn: String(weekday + 1),
                                    gridRow: `${startPeriod + 1} / span ${endPeriod - startPeriod + 1}`
                                }
                            });
                        });
                    });
                    return result;
                };

                const personalCourseLayout = Vue.computed(() => {
                    const data = personalSchedule.value;
                    if (!data) return [];
                    return buildPersonalCourseLayout(
                        buildPersonalCourseEntries(data, Number(selectedCourseWeek.value))
                    );
                });

                const personalStats = Vue.computed(() => {
                    const data = personalSchedule.value;
                    if (!data) return { totalCourses: 0, totalHours: 0, totalLessons: 0, totalWeeks: 0, weekly: [] };
                    const totalWeeks = getTotalWeeks(data);
                    const weekly = Array.from({ length: totalWeeks }, (_, index) => {
                        const week = index + 1;
                        const lessons = data.lessons.filter(lesson => lesson.week === week);
                        return { week, hours: lessons.reduce((sum, lesson) => sum + lesson.periods.length, 0) };
                    });
                    const maxHours = Math.max(1, ...weekly.map(item => item.hours));
                    weekly.forEach(item => item.percent = Math.max(2, Math.round(item.hours / maxHours * 100)));
                    return {
                        totalCourses: data.courses.length,
                        totalHours: data.lessons.reduce((sum, lesson) => sum + lesson.periods.length, 0),
                        totalLessons: data.lessons.length,
                        totalWeeks,
                        weekly
                    };
                });

                const isOnlineLesson = (maps, lesson) => {
                    const detail = CourseScheduleTools.getLessonDetail(maps, lesson);
                    return /尔雅/.test(`${detail.course.name || ""} ${detail.room || ""}`);
                };

                const getLessonAvailability = (data, maps, week, weekday, period) => {
                    const lessons = (data.busySlots[`${week}-${weekday}-${period}`] || [])
                        .map(id => maps.lessons.get(id))
                        .filter(Boolean);
                    return classifyScheduleSlot(lessons, lesson => isOnlineLesson(maps, lesson));
                };

                const formatAvailabilityWeeks = (freeWeeks, onlineWeeks, totalWeeks) => {
                    const parts = [];
                    if (freeWeeks.length) {
                        parts.push(`${CourseScheduleTools.formatWeeks(freeWeeks, totalWeeks)}完全空闲`);
                    }
                    if (onlineWeeks.length) {
                        parts.push(`${CourseScheduleTools.formatWeeks(onlineWeeks, totalWeeks)}仅有线上课程（可协调）`);
                    }
                    return parts.length ? parts.join("\n") : "有课";
                };

                const buildPersonalFreeGrid = (data, selectedWeek = 0) => {
                    const grid = Object.fromEntries(personalPeriodRows.map(row => [
                        row.key,
                        Object.fromEntries(personalDays.map(day => [day.number, {
                            isFree: false,
                            isAllTermFree: false,
                            hasOnline: false,
                            text: "有课",
                            ariaLabel: `${day.text}第${row.label}节：有课`
                        }]))
                    ]));
                    if (!data) return grid;
                    const maps = CourseScheduleTools.getMaps(data);
                    const totalWeeks = getTotalWeeks(data);
                    const weeks = selectedWeek ? [selectedWeek] : Array.from({ length: totalWeeks }, (_, index) => index + 1);
                    personalPeriodRows.forEach(row => personalDays.forEach(day => {
                        const periodStates = row.periods.map(period => {
                            const states = weeks.map(week => ({
                                week,
                                status: getLessonAvailability(data, maps, week, day.number, period)
                            }));
                            const freeWeeks = states.filter(item => item.status === "free").map(item => item.week);
                            const onlineWeeks = states.filter(item => item.status === "online").map(item => item.week);
                            return { period, freeWeeks, onlineWeeks };
                        });
                        let text;
                        if (selectedWeek) {
                            const labels = periodStates.map(state => state.freeWeeks.length
                                ? "完全空闲"
                                : state.onlineWeeks.length ? "仅有线上课程（可协调）" : "有课"
                            );
                            text = labels.every(label => label === labels[0])
                                ? labels[0]
                                : periodStates.map((state, index) => `第${state.period}节${labels[index]}`).join("\n");
                        } else {
                            const signatures = periodStates.map(state =>
                                `${state.freeWeeks.join(",")}|${state.onlineWeeks.join(",")}`
                            );
                            if (signatures.every(value => value === signatures[0])) {
                                text = formatAvailabilityWeeks(
                                    periodStates[0].freeWeeks,
                                    periodStates[0].onlineWeeks,
                                    totalWeeks
                                );
                            } else {
                                text = periodStates.map(state =>
                                    `第${state.period}节：${formatAvailabilityWeeks(state.freeWeeks, state.onlineWeeks, totalWeeks)}`
                                ).join("\n");
                            }
                        }
                        const hasOnline = periodStates.some(state => state.onlineWeeks.length);
                        grid[row.key][day.number] = {
                            isFree: periodStates.some(state => state.freeWeeks.length || state.onlineWeeks.length),
                            isAllTermFree: !selectedWeek && totalWeeks > 0 &&
                                periodStates.every(state => state.freeWeeks.length === totalWeeks),
                            hasOnline,
                            text,
                            ariaLabel: `${day.text}第${row.label}节：${text.replace(/\n/g, "；")}`
                        };
                    }));
                    return grid;
                };

                const personalFreeGrid = Vue.computed(() => {
                    return buildPersonalFreeGrid(personalSchedule.value, Number(selectedFreeWeek.value));
                });

                // 响应式数据
                const uploadedFiles = Vue.reactive({});
                const daysOfWeek = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
                const classPeriods = scheduleManagerPeriodRows.map(row => `第 ${row.label} 节`);
                const showExportMenu = Vue.ref(false);
                const multiEmptyTable = Vue.ref(null);
                const multiScheduleLoading = Vue.ref(false);

                // 计算属性
                const fileList = Vue.computed(() => Object.keys(uploadedFiles).map(filename => ({
                    filename,
                    name: filename.replace('.json', ''),
                    ...uploadedFiles[filename]
                })));

                // 计算属性：处理所有文件的课程表数据，生成用于显示的结构
                const allFilesSchedule = Vue.computed(() => {
                    const result = Object.fromEntries(daysOfWeek.map(day => [
                        day,
                        Object.fromEntries(classPeriods.map((period, index) => [index, []]))
                    ]));
                    Object.keys(uploadedFiles).forEach(filename => {
                        const data = uploadedFiles[filename]?.content;
                        if (!data) return;
                        const maps = CourseScheduleTools.getMaps(data);
                        const totalWeeks = getTotalWeeks(data);
                        const weeks = Array.from({ length: totalWeeks }, (_, index) => index + 1);
                        const displayName = data.owner?.name || "未命名用户";
                        daysOfWeek.forEach((cnDay, index) => {
                            scheduleManagerPeriodRows.forEach((row, periodIndex) => {
                                const states = row.periods.map(period => {
                                    const availability = weeks.map(week => ({
                                        week,
                                        status: getLessonAvailability(data, maps, week, index + 1, period)
                                    }));
                                    return {
                                        period,
                                        freeWeeks: availability.filter(item => item.status === "free").map(item => item.week),
                                        onlineWeeks: availability.filter(item => item.status === "online").map(item => item.week)
                                    };
                                });
                                if (!states.some(state => state.freeWeeks.length || state.onlineWeeks.length)) return;
                                const sameAvailability = states.every(state =>
                                    state.freeWeeks.join(',') === states[0].freeWeeks.join(',') &&
                                    state.onlineWeeks.join(',') === states[0].onlineWeeks.join(',')
                                );
                                let label = displayName;
                                if (sameAvailability) {
                                    label += `（${formatAvailabilityWeeks(
                                        states[0].freeWeeks,
                                        states[0].onlineWeeks,
                                        totalWeeks
                                    ).replace(/\n/g, "；")}）`;
                                } else {
                                    label += `（${states.map(state =>
                                        `第${state.period}节：${formatAvailabilityWeeks(
                                            state.freeWeeks,
                                            state.onlineWeeks,
                                            totalWeeks
                                        ).replace(/\n/g, "；")}`
                                    ).join('；')}）`;
                                }
                                const fullyFree = totalWeeks > 0 && states.every(state => state.freeWeeks.length === totalWeeks);
                                const neverBusy = totalWeeks > 0 && states.every(state =>
                                    state.freeWeeks.length + state.onlineWeeks.length === totalWeeks
                                );
                                result[cnDay][periodIndex].push({
                                    key: `${filename}|${cnDay}|${periodIndex}`,
                                    text: label,
                                    status: fullyFree ? "free" : neverBusy ? "online" : "partial"
                                });
                            });
                        });
                    });
                    return result;
                });

                const multiAvailabilitySummary = Vue.computed(() => {
                    const result = Object.fromEntries(daysOfWeek.map(day => [
                        day, Object.fromEntries(classPeriods.map((period, index) => [index, {
                            status: "empty",
                            text: "尚未添加课表"
                        }]))
                    ]));
                    const people = Object.values(uploadedFiles)
                        .map(file => file?.content)
                        .filter(Boolean)
                        .map(data => ({
                            data,
                            maps: CourseScheduleTools.getMaps(data),
                            totalWeeks: getTotalWeeks(data)
                        }));
                    if (!people.length) return result;
                    daysOfWeek.forEach((day, dayIndex) => scheduleManagerPeriodRows.forEach((row, periodIndex) => {
                        const states = people.map(({ data, maps, totalWeeks }) => {
                            if (totalWeeks <= 0) return "busy";
                            const availability = Array.from({ length: totalWeeks }, (_, index) => index + 1)
                                .flatMap(week => row.periods.map(period =>
                                    getLessonAvailability(data, maps, week, dayIndex + 1, period)
                                ));
                            if (availability.every(status => status === "free")) return "free";
                            if (availability.every(status => status !== "busy")) return "online";
                            if (availability.some(status => status !== "busy")) return "partial";
                            return "busy";
                        });
                        result[day][periodIndex] = summarizePeopleAvailability(states);
                    }));
                    return result;
                });

                // 方法
                const triggerFileInput = () => {
                    if (multiScheduleLoading.value) return;
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.json';
                    input.multiple = true;
                    input.onchange = handleFileSelect;
                    input.click();
                };

                const handleFileSelect = async (event) => {
                    const files = Array.from(event.target.files || []);
                    if (!files?.length) return;
                    if (multiScheduleLoading.value) return;
                    multiScheduleLoading.value = true;
                    const declinedKeyIds = new Set();
                    let successCount = 0;
                    try {
                        for (const file of files) {
                            if (!file.name.toLowerCase().endsWith('.json')) {
                                createToast("error", '请只上传JSON文件', 3);
                                continue;
                            }
                            delete uploadedFiles[file.name];
                            if (file.size > ScheduleCryptoTools.maxEnvelopeBytes) {
                                createToast("error", `文件 "${file.name}" 超过 7 MB`, 3);
                                continue;
                            }
                            if (await readFile(file, declinedKeyIds)) successCount++;
                        }
                        if (successCount) {
                            createToast("success", `已成功读取 ${successCount} 个课表文件`, 3);
                        }
                    } finally {
                        multiScheduleLoading.value = false;
                    }
                };

                const readFile = async (file, declinedKeyIds) => {
                    try {
                        const jsonContent = await parseScheduleFileContent(await file.text(), {
                            filename: file.name,
                            keyCache: importedSchedulePrivateKeys,
                            declinedKeyIds
                        });
                        uploadedFiles[file.name] = {
                            content: jsonContent,
                            size: file.size,
                            type: file.type,
                            lastModified: file.lastModified
                        };
                        return true;
                    } catch (error) {
                        createToast("error", `文件 "${file.name}" 已跳过：${error.message || "格式错误"}`, 4);
                        return false;
                    }
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
                        !exportBtn?.contains(e.target) &&
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
                    try {
                        const wsData = [['时间/星期', ...daysOfWeek]];
                        classPeriods.forEach((period, periodIndex) => {
                            const row = [period];
                            daysOfWeek.forEach(day => {
                                const items = allFilesSchedule.value[day]?.[periodIndex] || [];
                                const summary = multiAvailabilitySummary.value[day][periodIndex].text;
                                const cellData = items.length
                                    ? [...items.map(item => item.text), summary].join('\n')
                                    : summary;
                                row.push(cellData);
                            });
                            wsData.push(row);
                        });
                        const wb = XLSX.utils.book_new();
                        const ws = XLSX.utils.aoa_to_sheet(wsData);
                        ws['!cols'] = [{ wch: 10 }, ...daysOfWeek.map(() => ({ wch: 20 }))];
                        const wrapTextStyle = { alignment: { wrapText: true, vertical: 'top' } };
                        Object.keys(ws).forEach(key => {
                            if (!key.startsWith('!')) ws[key].s = wrapTextStyle;
                        });
                        XLSX.utils.book_append_sheet(wb, ws, '空课表');
                        XLSX.writeFile(wb, '空课表.xlsx');
                        showExportMenu.value = false;
                        createToast("success", "空课表 Excel 已导出", 3);
                    } catch (error) {
                        createToast("error", error.message || "空课表 Excel 导出失败", 4);
                    }
                };

                const exportToImage = async () => {
                    if (!fileList.value.length) {
                        createToast("error", '请先上传文件', 3);
                        return;
                    }
                    if (multiScheduleLoading.value) return;
                    multiScheduleLoading.value = true;
                    try {
                        await Vue.nextTick();
                        await snapdom.download(multiEmptyTable.value, {
                            format: 'png',
                            filename: "空课表",
                            scale: 2.5,
                            quality: 1
                        });
                        showExportMenu.value = false;
                        createToast("success", "空课表图片已导出", 3);
                    } catch (error) {
                        createToast("error", error.message || '导出图片失败，请重试', 3);
                    } finally {
                        multiScheduleLoading.value = false;
                    }
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
                    personalDays,
                    personalPeriodRows,
                    personalLink,
                    personalSchedule,
                    personalSource,
                    personalLoading,
                    personalError,
                    personalTab,
                    personalScheduleToolbarVisible,
                    selectedCourseWeek,
                    selectedFreeWeek,
                    personalTabsRef,
                    personalCourseWeekTabsRef,
                    personalFreeWeekTabsRef,
                    personalCourseCapture,
                    personalStatsCapture,
                    personalFreeCapture,
                    scheduleKeyPair,
                    scheduleKeyGenerating,
                    showSchedulePrivateKey,
                    generateScheduleKeyPair,
                    copyScheduleKey,
                    personalWeekOptions,
                    canExportPersonalJson,
                    personalCourseLayout,
                    personalStats,
                    personalFreeGrid,
                    loadScheduleFromInput,
                    handlePersonalUpload,
                    exportPersonalJson,
                    exportPersonalImage,
                    fileList,
                    toggleExportMenu,
                    classPeriods,
                    daysOfWeek,
                    triggerFileInput,
                    multiScheduleLoading,
                    showExportMenu,
                    allFilesSchedule,
                    multiAvailabilitySummary,
                    exportToExcel,
                    exportToImage,
                    removeFile,
                    multiEmptyTable
                }
            },
            mounted() {
                removeToast(toast);
                createToast("success", `小工具部署完毕`, 2);
                createToast("info", `由于获取课表信息需要，我们正在后台打开信息门户和学工系统页面，请稍后再打开“课表信息”页面，以免获取信息失败`, 6);
            }
        });
        tools.use(vant);
        tools.mount("#tools");
    }


    async function errorHtml() {
        if (!getGMValue('WebVPN.autoClose')) {
            return;
        }
        CloseWin();
    }
})()
