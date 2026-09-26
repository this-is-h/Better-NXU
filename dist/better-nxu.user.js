// ==UserScript==
// @name         Better NXU
// @namespace    https://thisish.com/
// @version      2.0.2
// @author       H
// @description  这是一个提高各种 NXU 网站体验的用户脚本（Userscript）
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
// @match        *://zylib.nxu.edu.cn/*
// @match        *://kns.cnki.net/reader/xml*
// @match        *://kns.cnki.net/xmlRead/trialRead*
// @match        *://www.cnki.net/reader/xml*
// @match        *://www.cnki.net/xmlRead/trialRead*
// @match        *://f.wanfangdata.com.cn/online/pc/periodical_html*
// @require      https://scriptcat.org/lib/1405/1.0.7/h.notification.js#sha384-Ef8dnXffgAqEVHA7uHKmtub7Uh4Ji/Yv60yL+Himym+PdTNeb/NAKi+d9qh9olzC
// @require      data:application/javascript,%3B(function()%7Bvar%20w%3D(typeof%20unsafeWindow!%3D%3D'undefined')%3FunsafeWindow%3Awindow%3Bw.addToast%3DaddToast%3Bw.createToast%3DcreateToast%3Bw.removeToast%3DremoveToast%3Bw.ToastCss%3DToastCss%3Bvar%20c%3D(typeof%20CAT_userConfig!%3D%3D'undefined')%3FCAT_userConfig%3Aundefined%3Bif(c)%7Bw.CAT_userConfig%3Dc%3Bwindow.CAT_userConfig%3Dc%3B%7D%7D)()%3B
// @require      https://cdnjs.cloudflare.com/ajax/libs/vue/3.5.43/vue.global.prod.min.js#sha384-jpQley6yTEvoZeHVfCkBVqGK6kLbDxptME8BFcqX9FJiFhpNkdkUSs54xLMnxmuB
// @require      https://unpkg.com/@zumer/snapdom@3.1.0/dist/snapdom.js#sha384-WGMhfcLrIwHy2nch3wquBVui5YbAvFGEjpUqtK65dcKwZ+vBMkydMJja61MRE6An
// @require      data:application/javascript,%3B(function()%7Bvar%20w%3D(typeof%20unsafeWindow!%3D%3D'undefined')%3FunsafeWindow%3Awindow%3Bvar%20s%3D(typeof%20snapdom!%3D%3D'undefined')%3Fsnapdom%3A(typeof%20window!%3D%3D'undefined'%3Fwindow.snapdom%3Aundefined)%3Bif(s)%7Bw.snapdom%3Ds%3Bwindow.snapdom%3Ds%3B%7D%7D)()%3B
// @require      https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js#sha384-EnyY0/GSHQGSxSgMwaIPzSESbqoOLSexfnSMN2AP+39Ckmn92stwABZynq1JyzdT
// @require      data:application/javascript,%3B(function()%7Bvar%20w%3D(typeof%20unsafeWindow!%3D%3D'undefined')%3FunsafeWindow%3Awindow%3Bvar%20x%3D(typeof%20XLSX!%3D%3D'undefined')%3FXLSX%3A(typeof%20window!%3D%3D'undefined'%3Fwindow.XLSX%3Aundefined)%3Bif(x)%7Bw.XLSX%3Dx%3Bwindow.XLSX%3Dx%3B%7D%7D)()%3B
// @resource     about-md             https://raw.giteeusercontent.com/thisish/Better-NXU/raw/main/README.md
// @resource     dompurify-js         https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.4.15/purify.min.js#sha384-uUMu9JDY09vBzRf9SPcK2VgUj+W/70J6Soc+Dded5P474ElQ63iv9j5N3DE7Kp3N
// @resource     github-markdown-css  https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.9.0/github-markdown.min.css#sha384-dvqix+FXNZkkgkfxRwowYZelxQUSFEjEbDpb1k1mIMw84dsT8M3NM2CJC3xyp2hh
// @resource     marked-js            https://unpkg.com/marked@18.0.14/lib/marked.umd.js#sha384-2vpGtuKqJvFlwJqYnf/wUMuzUfhUnYBt9oay0e2yaFcq0Dh6/aEbQ8YAOeKGzlYo
// @resource     svg-logo             https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/font-awesome/6.2.1/css/all.min.css#sha384-twcuYPV86B3vvpwNhWJuaLdUSLF9+ttgM2A6M870UYXrOsxKfER2MKox5cirApyA
// @resource     tesseract-js         https://unpkg.com/tesseract.js@7.0.0/dist/tesseract.min.js#sha384-2BQ3U3OdKOb0Uczxqr41I9UvZkzr4V9Hv8uSzMMZAlmhsFClvdZX5wi5fDCzG+tM
// @resource     update-md            https://raw.giteeusercontent.com/thisish/Better-NXU/raw/main/CHANGELOG.md
// @resource     vant-css             https://cdnjs.cloudflare.com/ajax/libs/vant/4.10.2/index.min.css#sha384-/emcjTEhfcL99sMjPCGhXaThIpqFm61vsVdjpoJHtfHHJ/mY354KjvR3/POEs56i
// @connect      webvpn.nxu.edu.cn
// @connect      portal.nxu.edu.cn
// @connect      v1.hitokoto.cn
// @connect      cdn.jsdelivr.net
// @connect      unpkg.com
// @grant        CAT_userConfig
// @grant        GM.setValue
// @grant        GM.setValues
// @grant        GM.xmlHttpRequest
// @grant        GM_addElement
// @grant        GM_addStyle
// @grant        GM_download
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_info
// @grant        GM_openInTab
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_setValues
// @grant        unsafeWindow
// @grant        window.close
// @inject-into  page
// @run-at       document-idle
// @storageName  h.nxu
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

(async function(vue) {
	"use strict";
	var s = new Set();
	var _css = async (t) => {
		if (s.has(t)) return;
		s.add(t);
		((c) => {
			if (typeof GM_addStyle === "function") GM_addStyle(c);
			else (document.head || document.documentElement).appendChild(document.createElement("style")).append(c);
		})(t);
	};
	_css(" .better-nxu-auth-fill[data-v-acbd53d7]{z-index:99999;color:#fff;cursor:pointer;background:#3a8bff;border:1px solid #2878d7;border-radius:4px;padding:9px 12px;font-size:14px;position:fixed;bottom:20px;right:16px;box-shadow:0 3px 10px #0000002e}.wrdvpn-navbar__user__menu[data-v-d0855931]{display:none}.wrdvpn-navbar__user:hover .wrdvpn-navbar__user__menu[data-v-d0855931]{display:block}\n/*$vite$:1*/ ");
	function MyConsole(scope) {
		return function log(message, detail = "", level = "log") {
			if (level === "debug" && globalThis.__BETTER_NXU_DEBUG__ !== true) return;
			const methodName = [
				"debug",
				"info",
				"warn",
				"error",
				"log"
			].includes(level) ? level : "log";
			const write = typeof console[methodName] === "function" ? console[methodName].bind(console) : console.log.bind(console);
			const timestamp = new Date().toLocaleTimeString("zh-CN", { hour12: false });
			const isObjectMessage = message !== null && typeof message === "object";
			write("%c Better NXU %c %s", "border-radius:5px;padding:3px 5px;color:#fff;background:#3a8bff;font-weight:600", "margin-left:6px;color:inherit", `${scope} ${timestamp} ${isObjectMessage ? "[详情] 输出对象" : String(message ?? "")}`);
			if (isObjectMessage) write(sanitizeConsoleDetail(message));
			if (detail !== "" && detail !== void 0) write("详细信息：", sanitizeConsoleDetail(detail));
		};
	}
	function sanitizeConsoleDetail(value) {
		if (value instanceof Error) return {
			name: value.name,
			code: value.code,
			message: value.message,
			stack: value.stack
		};
		if (value === null || typeof value !== "object") return value;
		const seen = new WeakSet();
		try {
			return JSON.parse(JSON.stringify(value, (key, item) => {
				if (/(?:password|passwd|secret|privateKey|credential|authorization|cookie|token|密码|私钥)/i.test(key)) return "[已隐藏]";
				if (item instanceof Error) return {
					name: item.name,
					code: item.code,
					message: item.message,
					stack: item.stack
				};
				if (item && typeof item === "object") {
					if (seen.has(item)) return "[循环引用]";
					seen.add(item);
				}
				return item;
			}));
		} catch {
			return "[详情无法序列化]";
		}
	}
	var _GM = (() => typeof GM != "undefined" ? GM : void 0)();
	var _GM_addElement = (() => typeof GM_addElement != "undefined" ? GM_addElement : void 0)();
	var _GM_addStyle = (() => typeof GM_addStyle != "undefined" ? GM_addStyle : void 0)();
	var _GM_download = (() => typeof GM_download != "undefined" ? GM_download : void 0)();
	var _GM_getResourceText = (() => typeof GM_getResourceText != "undefined" ? GM_getResourceText : void 0)();
	var _GM_getValue = (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
	var _GM_info = (() => typeof GM_info != "undefined" ? GM_info : void 0)();
	var _GM_openInTab = (() => typeof GM_openInTab != "undefined" ? GM_openInTab : void 0)();
	var _GM_setClipboard = (() => typeof GM_setClipboard != "undefined" ? GM_setClipboard : void 0)();
	var _GM_setValue = (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
	var _GM_setValues = (() => typeof GM_setValues != "undefined" ? GM_setValues : void 0)();
	var _unsafeWindow = (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
	var _monkeyWindow = (() => window)();
	var WEBVPN_BASE = `https://webvpn.nxu.edu.cn`;
	var WEBVPN_HOST_TOKENS = Object.freeze({
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
	var WEBVPN_TOKEN_HOSTS = Object.freeze(Object.fromEntries(Object.entries(WEBVPN_HOST_TOKENS).map(([host, token]) => [token, host])));
	function parseWebVpnContext(input) {
		const href = typeof input === "string" ? input : input?.href;
		let parsed;
		try {
			parsed = new URL(href);
		} catch {
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
		if (outerHost !== "webvpn.nxu.edu.cn") return directContext;
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
		} catch {
			return null;
		}
		const scheme = parsed.protocol.replace(":", "").toLowerCase();
		const host = parsed.hostname.toLowerCase().replace(/\.$/, "");
		if (!["http", "https"].includes(scheme) || parsed.username || parsed.password || host === "webvpn.nxu.edu.cn") return null;
		const token = WEBVPN_HOST_TOKENS[host];
		if (!token) return null;
		const port = parsed.port || (scheme === "https" && options.forceHttps443 ? "443" : "");
		return `${WEBVPN_BASE}/${port ? `${scheme}-${port}` : scheme}/${token}${parsed.pathname}${parsed.search}${parsed.hash}`;
	}
	function isWebVpnRealHost(context, host) {
		return Boolean(context?.viaVpn && context.realHost === host);
	}
	var context = null;
	function initContext() {
		if (context) return context;
		const Info = _GM_info;
		const Url = window.location.href;
		const Host = window.location.hostname;
		const Origin = window.location.origin;
		const Path = window.location.pathname;
		const vpnContext = parseWebVpnContext(Url);
		context = {
			info: Info,
			version: Info?.script?.version,
			url: Url,
			host: Host,
			origin: Origin,
			path: Path,
			query: new URLSearchParams(window.location.search),
			vpnContext,
			isWebvpn: Boolean(vpnContext?.viaVpn),
			webvpnRealHost: vpnContext?.viaVpn ? vpnContext.realHost : null,
			isWebvpnHost: Host === "webvpn.nxu.edu.cn",
			isJwglIp: Host === "202.201.128.234"
		};
		return context;
	}
	function getContext() {
		if (!context) throw new Error("context 尚未初始化：请在 main.js 中先调用 initContext()");
		return context;
	}
	var FONT_AWESOME_WEBFONTS_URL = "https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.2.1/webfonts";
	var installed$2 = false;
	function installFontAwesome() {
		if (installed$2) return;
		const css = _GM_getResourceText?.("svg-logo");
		if (!css) return;
		_GM_addStyle?.(css.replace(/\.\.\/webfonts/g, FONT_AWESOME_WEBFONTS_URL));
		installed$2 = true;
	}
	async function downloadTextFile(content, filename, mimeType = "application/json;charset=utf-8") {
		const blob = new Blob([content], { type: mimeType });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = filename;
		link.style.display = "none";
		try {
			document.body.appendChild(link);
			link.click();
		} catch (error) {
			URL.revokeObjectURL(url);
			throw error;
		}
		setTimeout(() => {
			link.remove();
			URL.revokeObjectURL(url);
		}, 100);
	}
	var AMP = "&amp;";
	var LT = "&lt;";
	var GT = "&gt;";
	var QUOT = "&quot;";
	var APOS = "&#39;";
	function escapeHtml$1(value) {
		return String(value || "").replace(/[&<>"']/g, (character) => ({
			"&": AMP,
			"<": LT,
			">": GT,
			"\"": QUOT,
			"'": APOS
		})[character]);
	}
	function closeCurrentTab() {
		try {
			if (typeof _monkeyWindow?.close !== "function") return false;
			_monkeyWindow.close();
			return true;
		} catch {
			return false;
		}
	}
	var console$39 = MyConsole("[notification]");
	var global$1 = _unsafeWindow ?? window;
	var installed$1 = false;
	function installNotification() {
		if (typeof global$1.addToast === "function") global$1.addToast();
		else console$39("h.notification.js 的 addToast 未就绪（@require 可能被 ScriptCat 拒载）", void 0, "warn");
		if (!installed$1 && typeof global$1.ToastCss === "string") _GM_addStyle?.(global$1.ToastCss);
		if (!installed$1) installFontAwesome();
		installed$1 = true;
	}
	function betterNXUVersionClick() {
		if (typeof _GM?.xmlHttpRequest !== "function") {
			toast("warning", "一言暂时不可用，请稍后重试", 3);
			return;
		}
		_GM.xmlHttpRequest({
			method: "GET",
			url: "https://v1.hitokoto.cn/"
		}).then((response) => {
			try {
				const json = JSON.parse(response.responseText);
				toast("info", json?.hitokoto ? `${json.hitokoto}\n——${json.from || ""}` : "之前点的太快啦，请稍后重试", 3);
			} catch {
				toast("info", "之前点的太快啦，请稍后重试", 3);
			}
		}).catch(() => {
			toast("warning", "一言暂时不可用，请稍后重试", 3);
		});
	}
	function toast(type, message, duration) {
		return toastTrustedHtml(type, escapeHtml$1(String(message ?? "")), duration);
	}
	function toastTrustedHtml(type, message, duration) {
		const impl = global$1.createToast;
		if (typeof impl === "function") return impl(type, message, duration);
		console$39("createToast 全局未就绪，降级记日志", {
			type,
			message
		}, "warn");
		return null;
	}
	function removeToastHandle(handle) {
		const impl = global$1.removeToast;
		if (typeof impl === "function") impl(handle);
	}
	var GM_VALUE_DEFAULTS = Object.freeze({
		"WebVPN.username": void 0,
		"WebVPN.password": void 0,
		"WebVPN.autoLogin": false,
		"WebVPN.autoReLogin": false,
		"WebVPN.autoClose": false,
		"WebVPN.courseGrab": true,
		"WebVPN.customTool": true,
		"WebVPN.customCard": [
			"教务管理",
			"学工系统",
			"信息门户",
			"中国知网",
			"万方数据"
		],
		"WebVPN.qualityJson": [],
		"WebVPN.searchClose": true,
		"Jwgl.username": void 0,
		"Jwgl.password": void 0,
		"Jwgl.autoLogin": false,
		"Jwgl.courseBeautify": true,
		"Jwgl.customMenu": ["全部学期成绩"],
		"TuanWei.autoDownload": false,
		"TuanWei.autoDownloadClose": false,
		firstSet: 0,
		configVersion: 0,
		icsId: void 0,
		"Schedule.encryptionKeyPair": void 0
	});
	var SETTINGS_RESET_KEYS = Object.freeze([
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
	async function setValues(values) {
		if (typeof _GM?.setValues === "function") {
			await _GM.setValues(values);
			return;
		}
		if (typeof _GM_setValues === "function") {
			await _GM_setValues(values);
			return;
		}
		await Promise.all(Object.entries(values).map(([name, value]) => _GM_setValue(name, value)));
	}
	function getGMValue(name) {
		if (!Object.prototype.hasOwnProperty.call(GM_VALUE_DEFAULTS, name)) throw new Error(`未注册的 GM 存储键：${name}`);
		return cloneGMValue(_GM_getValue(name, cloneGMValue(GM_VALUE_DEFAULTS[name])));
	}
	async function setGMValue(name, value) {
		if (!Object.prototype.hasOwnProperty.call(GM_VALUE_DEFAULTS, name)) throw new Error(`未注册的 GM 存储键：${name}`);
		if (typeof _GM?.setValue === "function") {
			await _GM.setValue(name, value);
			return;
		}
		await _GM_setValue(name, value);
	}
	function getResettableSettingDefaults() {
		return Object.fromEntries(SETTINGS_RESET_KEYS.map((name) => [name, cloneGMValue(GM_VALUE_DEFAULTS[name])]));
	}
	async function resetFunctionSettingValues() {
		const defaults = getResettableSettingDefaults();
		await setValues(defaults);
		return defaults;
	}
	function getAllSettingDefaults() {
		const defaults = Object.fromEntries(Object.entries(GM_VALUE_DEFAULTS).map(([name, value]) => [name, cloneGMValue(value)]));
		["WebVPN", "Jwgl"].forEach((group) => {
			if (!hasLoginCredentials(defaults[`${group}.username`], defaults[`${group}.password`])) defaults[`${group}.autoLogin`] = false;
		});
		return defaults;
	}
	async function resetAllSettingValues() {
		const defaults = getAllSettingDefaults();
		await setValues(defaults);
		return defaults;
	}
	var OCR_ENGINE_UNAVAILABLE = "OCR_ENGINE_UNAVAILABLE";
	var OCR_EMPTY_RESULT = "OCR_EMPTY_RESULT";
	var JWGL_LOGIN_FORM_MISSING = "JWGL_LOGIN_FORM_MISSING";
	var EXPORT_CANCELLED = "EXPORT_CANCELLED";
	var AUTH_SUBMIT_MISSING = "AUTH_SUBMIT_MISSING";
	var WAIT_TIMEOUT = "WAIT_TIMEOUT";
	var SLIDER_RECOGNIZER_UNAVAILABLE = "SLIDER_RECOGNIZER_UNAVAILABLE";
	var INVALID_JSON = "INVALID_JSON";
	var INVALID_SCHEDULE = "INVALID_SCHEDULE";
	var INVALID_DECRYPTED_SCHEDULE = "INVALID_DECRYPTED_SCHEDULE";
	var KEY_REQUIRED = "KEY_REQUIRED";
	function scheduleOperationError(code, message) {
		const error = new Error(message);
		error.code = code;
		return error;
	}
	var console$38 = MyConsole("[wait]");
	function Random(min, max) {
		return parseInt(Math.random() * (max - min + 1) + min, 10);
	}
	function WaitTime(min, max = 0, log = true, msg = "无") {
		let waitmsg, waittime;
		if (max === 0) {
			waittime = min;
			waitmsg = `====================\n等待了：${waittime / 1e3} 秒\n备注：${msg}\n====================`;
		} else {
			waittime = Random(min, max);
			waitmsg = `====================\n随机等待了：${waittime / 1e3} 秒\n备注：${msg}\n====================`;
		}
		return new Promise(function(resolve) {
			setTimeout(function() {
				if (log) console$38("[等待] 定时任务完成", waitmsg.replace(/ /g, ""), "debug");
				resolve();
			}, waittime);
		});
	}
	var unsafeWindow$1 = _unsafeWindow ?? window;
	var console$37 = MyConsole("[dom]");
	function simulateClick(el, needScroll = false) {
		if (!el) return;
		if (needScroll) el.scrollIntoView({
			behavior: "auto",
			block: "center"
		});
		for (const type of [
			"mousedown",
			"mouseup",
			"click"
		]) {
			const event = new MouseEvent(type, {
				view: unsafeWindow$1,
				bubbles: true,
				cancelable: true,
				button: 0,
				buttons: 1,
				pointerId: 1,
				pressure: .5,
				isPrimary: true
			});
			el.dispatchEvent(event);
		}
		el.focus();
	}
	async function waitForElement(selector, options = {}) {
		const timeout = Math.max(0, Number(options.timeout ?? 1e4));
		const interval = Math.max(20, Number(options.interval ?? 100));
		const predicate = typeof options.predicate === "function" ? options.predicate : () => true;
		const startedAt = Date.now();
		while (Date.now() - startedAt <= timeout) {
			const element = document.querySelector(selector);
			if (element && predicate(element)) return element;
			await WaitTime(interval, 0, false);
		}
		console$37("[DOM 等待] 目标元素等待超时", {
			selector,
			timeoutMs: timeout
		}, "warn");
		throw scheduleOperationError(WAIT_TIMEOUT, `等待页面元素超时：${selector}`);
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
		for (const selector of [
			"span#msg.auth_error",
			"#showErrorTip span",
			"#showErrorTip",
			".form-error"
		]) {
			const text = document.querySelector(selector)?.textContent.trim();
			if (text) return text;
		}
		return "";
	}
	function hasLegacyAuthCaptcha() {
		if (document.querySelector("#captchaSwitch")?.value === "1") return true;
		if (document.querySelector("p#cpatchaDiv, #cpatchaDiv")?.textContent.trim()) return true;
		const input = document.querySelector("input#captchaResponse");
		return Boolean(input && input.type !== "hidden" && input.offsetParent !== null);
	}
	function isCredentialsErrorText(errorText) {
		return /用户名|账号|密码/.test(errorText) && /错误|有误|不存在|失败/.test(errorText);
	}
	function buildCredentialsErrorToast(options = {}) {
		const { missing = true, opener = "settingsPage" } = options;
		const headline = missing ? "账号密码未配置" : "账号密码配置错误";
		const link = opener === "openConfig" ? "<a href=\"javascript:void(0)\" onclick=\"CAT_userConfig()\" style=\"font-weight:bold;font-size:small\">> 前往配置 <</a>" : "<a href=\"https://sslvpn.nxu.edu.cn/h/settings\" target=\"_blank\" rel=\"noopener noreferrer\" style=\"font-weight:bold;font-size:small\">> 前往配置 <</a>";
		return [`<p style="margin-bottom:0.5em;margin-top: 0">${escapeHtml$1(headline)}<br>请前往配置相关信息</p>`, link].join("");
	}
	var console$36 = MyConsole("[credentials]");
	function resolveOpener(host) {
		return host === "Jwgl" ? "openConfig" : "settingsPage";
	}
	function requireCredentials(host) {
		const username = getGMValue(`${host}.username`);
		const password = getGMValue(`${host}.password`);
		if (username && password) return true;
		console$36(`[${host}] 未配置登录账号或密码`, "请前往 Better NXU 设置页面补充", "warn");
		installNotification();
		toastTrustedHtml("error", buildCredentialsErrorToast({
			missing: true,
			opener: resolveOpener(host)
		}), 0);
		return false;
	}
	function notifyCredentialsProblem(host, duration = 5) {
		installNotification();
		toastTrustedHtml("error", buildCredentialsErrorToast({
			missing: false,
			opener: resolveOpener(host)
		}), duration);
	}
	var CONF_THRESHOLD = .5;
	var IOU_THRESHOLD = .8;
	var Y_IOU_THRESHOLD = .85;
	var NC = 1;
	var MASK_DIM = 32;
	var ORT_BASE$1 = "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.20.1/dist/";
	function buildWorkerSource() {
		return `/* slider-captcha-gap worker (generated) */
/* global ort, importScripts, self */
const CONF_THRESHOLD = ${CONF_THRESHOLD};
const IOU_THRESHOLD = ${IOU_THRESHOLD};
const Y_IOU_THRESHOLD = ${Y_IOU_THRESHOLD};
const IMGSZ = 640;
const NC = ${NC};
const MASK_DIM = ${MASK_DIM};

let session = null;

async function init(modelUrl) {
  if (typeof ort === 'undefined') {
    importScripts(${JSON.stringify(ORT_BASE$1 + "ort.min.js")});
  }
  ort.env.wasm.numThreads = 1; // page contexts are usually not crossOriginIsolated
  ort.env.wasm.simd = true;
  ort.env.wasm.wasmPaths = ${JSON.stringify(ORT_BASE$1)};
  session = await ort.InferenceSession.create(modelUrl, {
    executionProviders: ['wasm'],
    graphOptimizationLevel: 'all',
  });
  // Prewarm: first session.run() JIT-compiles the graph and allocates arena
  // buffers (~1-2s in WASM). Do it here so the first user call is as fast as
  // later ones.
  const dummy = new ort.Tensor('float32', new Float32Array(3 * IMGSZ * IMGSZ), [1, 3, IMGSZ, IMGSZ]);
  await session.run({ [session.inputNames[0]]: dummy });
  self.postMessage({ type: 'ready' });
}

function letterboxTensor(source, srcW, srcH) {
  const canvas = new OffscreenCanvas(IMGSZ, IMGSZ);
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.fillStyle = 'rgb(114,114,114)';
  ctx.fillRect(0, 0, IMGSZ, IMGSZ);
  const r = Math.min(IMGSZ / srcH, IMGSZ / srcW);
  const nw = Math.max(1, Math.min(Math.round(srcW * r), IMGSZ));
  const nh = Math.max(1, Math.min(Math.round(srcH * r), IMGSZ));
  const left = Math.round((IMGSZ - nw) / 2);
  const top = Math.round((IMGSZ - nh) / 2);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'medium';
  ctx.drawImage(source, 0, 0, srcW, srcH, left, top, nw, nh);
  const rgba = ctx.getImageData(0, 0, IMGSZ, IMGSZ).data;
  const n = IMGSZ * IMGSZ;
  const chw = new Float32Array(3 * n);
  for (let i = 0; i < n; i++) {
    const b = rgba[i * 4 + 2], g = rgba[i * 4 + 1], r8 = rgba[i * 4];
    chw[i] = b / 255;
    chw[n + i] = g / 255;
    chw[2 * n + i] = r8 / 255;
  }
  return chw;
}

async function identify(source, srcW, srcH) {
  const tensor = new ort.Tensor('float32', letterboxTensor(source, srcW, srcH), [1, 3, IMGSZ, IMGSZ]);
  const feeds = { [session.inputNames[0]]: tensor };
  const results = await session.run(feeds);
  const pred = results[session.outputNames[0]]; // [1, 4+nc+32, 8400]
  const det = nonMaxSuppression(pred, CONF_THRESHOLD, IOU_THRESHOLD, NC)[0];
  if (!det.length) return { box: [], confidence: 0 };
  return pickBest(det, [srcH, srcW]);
}

function nonMaxSuppression(pred, confThres, iouThres, nc) {
  const [, , anchors] = pred.dims;
  const all = [];
  for (let a = 0; a < anchors; a++) {
    let best = -1;
    for (let c = 4; c < 4 + nc; c++) {
      const v = pred.data[c * anchors + a];
      if (v > best) best = v;
    }
    if (best > confThres) {
      const cx = pred.data[0 * anchors + a];
      const cy = pred.data[1 * anchors + a];
      const w = pred.data[2 * anchors + a];
      const h = pred.data[3 * anchors + a];
      all.push({ x1: cx - w/2, y1: cy - h/2, x2: cx + w/2, y2: cy + h/2, conf: best });
    }
  }
  if (!all.length) return [[]];
  all.sort((p, q) => q.conf - p.conf);
  const keep = [];
  for (const cand of all) {
    if (keep.every(k => iouRect(k, cand) <= iouThres)) keep.push(cand);
  }
  return [keep];
}

function iouRect(a, b) {
  const xx1 = Math.max(a.x1, b.x1), yy1 = Math.max(a.y1, b.y1);
  const xx2 = Math.min(a.x2, b.x2), yy2 = Math.min(a.y2, b.y2);
  const w = Math.max(0, xx2 - xx1), h = Math.max(0, yy2 - yy1);
  const inter = w * h;
  const uni = (a.x2 - a.x1) * (a.y2 - a.y1) + (b.x2 - b.x1) * (b.y2 - b.y1) - inter;
  return uni > 0 ? inter / uni : 0;
}

function pickOutMask(cands) {
  if (cands.length === 1) return cands[0];
  const sorted = [...cands].sort((a, b) => a.x1 - b.x1);
  const slider = sorted[0];
  const rest = sorted.slice(1);
  const yFiltered = rest.filter(b => yIou([slider.y1, slider.y2], [b.y1, b.y2]) > Y_IOU_THRESHOLD);
  const pool = yFiltered.length ? yFiltered : rest;
  if (pool.length === 1) return pool[0];
  let best = pool[0], bestScore = -1;
  for (const cand of pool) {
    const sc = iouRect(slider, cand);
    if (sc > bestScore) { bestScore = sc; best = cand; }
  }
  return best;
}

function yIou([ay1, ay2], [by1, by2]) {
  const inter = Math.max(0, Math.min(ay2, by2) - Math.max(ay1, by1));
  const uni = (ay2 - ay1) + (by2 - by1) - inter;
  return uni > 0 ? inter / uni : 0;
}

function scaleBoxes(boxes, origShape) {
  const [oh, ow] = origShape;
  const gain = Math.min(IMGSZ / oh, IMGSZ / ow);
  const padX = Math.round((IMGSZ - ow * gain) / 2);
  const padY = Math.round((IMGSZ - oh * gain) / 2);
  for (const b of boxes) {
    b.x1 = clamp((b.x1 - padX) / gain, 0, ow);
    b.y1 = clamp((b.y1 - padY) / gain, 0, oh);
    b.x2 = clamp((b.x2 - padX) / gain, 0, ow);
    b.y2 = clamp((b.y2 - padY) / gain, 0, oh);
  }
  return boxes;
}

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

function pickBest(cands, origShape) {
  const scaled = scaleBoxes(cands, origShape);
  const best = pickOutMask(scaled);
  return { box: [best.x1, best.y1, best.x2, best.y2], confidence: best.conf };
}

self.onmessage = async (e) => {
  const msg = e.data;
  try {
    if (msg.type === 'init') {
      await init(msg.modelUrl);
      return;
    }
    if (msg.type === 'identify') {
      if (!session) throw new Error('worker not initialized');
      const res = await identify(msg.bitmap, msg.bitmap.width, msg.bitmap.height);
      if (msg.bitmap) msg.bitmap.close();
      self.postMessage({ id: msg.id, ...res });
    } else if (msg.type === 'identifyData') {
      if (!session) throw new Error('worker not initialized');
      const c = new OffscreenCanvas(msg.width, msg.height);
      c.getContext('2d').putImageData(new ImageData(msg.data, msg.width, msg.height), 0, 0);
      const res = await identify(c, msg.width, msg.height);
      self.postMessage({ id: msg.id, ...res });
    }
  } catch (err) {
    self.postMessage({ id: msg.id, error: String((err && err.stack) || err) });
  }
};
`;
	}
	var ORT_BASE = "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.30.0/dist/";
	var SLIDER_ASSETS = {
		runtime: {
			url: `${ORT_BASE}ort.min.js`,
			sha384: "N94xSNjPDbfBJj4+QINst0nbHpcCm8kc1qNlIP/wA0muqjR3aVyIuDkMeccPrLvQ"
		},
		module: {
			url: `${ORT_BASE}ort-wasm-simd-threaded.mjs`,
			sha384: "XcXA/MtAf0WpB8e023xQH9CM7RIjiugakT7x99DIwpFf7k56BIFFcAPerIF7FDad"
		},
		wasm: {
			url: `${ORT_BASE}ort-wasm-simd-threaded.wasm`,
			sha384: "vjBJ1z7qrhkTyYsNqKeF6c7N+nOJSU94czEo+tvZcu8G75JparGq9kB+kTnEUNVM"
		},
		model: {
			url: "https://cdn.jsdelivr.net/npm/captcha-recognizer-js@1.0.4/model/slider.onnx.q8.onnx",
			sha384: "6bKNnUGtWRYJcsM4Mvh3wqs0Dapp+uJhJJqScnfAw6LQwpgbJB24w9oasthHB26N"
		}
	};
	async function fetchSliderAsset({ url, sha384 }, signal) {
		signal.throwIfAborted();
		if (typeof _GM?.xmlHttpRequest !== "function") throw new Error("GM.xmlHttpRequest 不可用");
		const request = _GM.xmlHttpRequest({
			method: "GET",
			url,
			responseType: "arraybuffer",
			anonymous: true,
			timeout: 6e4
		});
		let abort;
		const aborted = new Promise((_, reject) => {
			abort = () => {
				reject(signal.reason);
				request.abort?.();
			};
			signal.addEventListener("abort", abort, { once: true });
			if (signal.aborted) abort();
		});
		try {
			const response = await Promise.race([request, aborted]);
			signal.throwIfAborted();
			if (response.status !== 200) throw new Error(`滑块资源下载失败（HTTP ${response.status}）`);
			if (/^content-type:\s*(?:text\/html|application\/xhtml\+xml)/im.test(response.responseHeaders || "")) throw new Error("滑块资源返回了 HTML 页面");
			const bytes = response.response;
			if (Object.prototype.toString.call(bytes) !== "[object ArrayBuffer]" || !bytes.byteLength) throw new Error("滑块资源不是有效的二进制文件");
			const digest = await crypto.subtle.digest("SHA-384", bytes);
			signal.throwIfAborted();
			if (btoa(String.fromCharCode(...new Uint8Array(digest))) !== sha384) throw new Error("滑块资源完整性校验失败");
			return bytes;
		} finally {
			signal.removeEventListener("abort", abort);
		}
	}
	async function loadSliderAssets(signal) {
		const entries = await Promise.all(Object.entries(SLIDER_ASSETS).map(async ([name, asset]) => [name, await fetchSliderAsset(asset, signal)]));
		return Object.fromEntries(entries);
	}
	var MIN_CONFIDENCE = CONF_THRESHOLD;
	var UPSTREAM_ORT_BASE = "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.20.1/dist/";
	var INIT_TIMEOUT_MS = 9e4;
	var DETECT_TIMEOUT_MS = 3e4;
	var active = null;
	function buildLocalSliderWorker({ runtimeUrl, moduleUrl, wasmUrl }) {
		let source = buildWorkerSource();
		const replacements = [[`importScripts(${JSON.stringify(`${UPSTREAM_ORT_BASE}ort.min.js`)});`, `importScripts(${JSON.stringify(runtimeUrl)});`], [`ort.env.wasm.wasmPaths = ${JSON.stringify(UPSTREAM_ORT_BASE)};`, `ort.env.wasm.wasmPaths = ${JSON.stringify({
			mjs: moduleUrl,
			wasm: wasmUrl
		})};`]];
		for (const [from, to] of replacements) {
			if (source.split(from).length !== 2) throw new Error("滑块 Worker 加载接口已变化");
			source = source.replace(from, () => to);
		}
		return source;
	}
	function getSliderRecognizer() {
		if (active) return active.ready;
		const state = {
			pageWindow: _unsafeWindow ?? window,
			controller: new AbortController(),
			worker: null,
			urls: [],
			pending: new Map(),
			nextId: 0
		};
		state.onPageHide = () => stop(state, new Error("滑块识别页面已离开"));
		state.pageWindow.addEventListener("pagehide", state.onPageHide, { once: true });
		active = state;
		state.ready = initialize(state).catch((error) => {
			stop(state, error);
			throw scheduleOperationError(SLIDER_RECOGNIZER_UNAVAILABLE, `滑块识别组件加载失败：${error?.message || error}，请手动完成验证`);
		});
		return state.ready;
	}
	async function initialize(state) {
		const timer = setTimeout(() => stop(state, new Error("滑块识别组件加载超时")), INIT_TIMEOUT_MS);
		try {
			const assets = await loadSliderAssets(state.controller.signal);
			state.controller.signal.throwIfAborted();
			const pageWindow = state.pageWindow;
			const objectUrl = (bytes, type) => {
				const blob = new pageWindow.Blob([new pageWindow.Blob([bytes])], { type });
				const url = pageWindow.URL.createObjectURL(blob);
				state.urls.push(url);
				return typeof pageWindow.vpn_rewrite_url === "function" ? pageWindow.vpn_rewrite_url(url) : url;
			};
			const decoder = new TextDecoder("utf-8", { fatal: true });
			const source = buildLocalSliderWorker({
				runtimeUrl: objectUrl(decoder.decode(assets.runtime), "text/javascript"),
				moduleUrl: objectUrl(decoder.decode(assets.module), "text/javascript"),
				wasmUrl: objectUrl(assets.wasm, "application/wasm")
			});
			state.worker = new pageWindow.Worker(objectUrl(source, "text/javascript"));
			state.worker.onmessage = ({ data }) => {
				const id = data.type === "ready" ? 0 : data.id;
				const pending = state.pending.get(id);
				if (!pending) return;
				state.pending.delete(id);
				data.error ? pending.reject(new Error(data.error)) : pending.resolve(data);
			};
			state.worker.onerror = () => stop(state, new Error("滑块识别 Worker 执行失败"));
			state.worker.onmessageerror = () => stop(state, new Error("滑块识别 Worker 消息读取失败"));
			await send(state, {
				type: "init",
				modelUrl: new Uint8Array(assets.model)
			}, [assets.model], 0);
			return {
				detect: (source, options) => detect(state, source, options),
				dispose: () => stop(state, new Error("滑块识别器已释放"))
			};
		} finally {
			clearTimeout(timer);
		}
	}
	function send(state, message, transfer = [], id = ++state.nextId) {
		return new Promise((resolve, reject) => {
			state.controller.signal.throwIfAborted();
			state.pending.set(id, {
				resolve,
				reject
			});
			try {
				state.worker.postMessage({
					...message,
					id
				}, transfer);
			} catch (error) {
				state.pending.delete(id);
				reject(error);
			}
		});
	}
	async function detect(state, source, { displayWidth, displayHeight } = {}) {
		state.controller.signal.throwIfAborted();
		const timer = setTimeout(() => stop(state, new Error("滑块识别超时，请手动完成验证")), DETECT_TIMEOUT_MS);
		let rejectOnAbort;
		const aborted = new Promise((_, reject) => {
			rejectOnAbort = () => reject(state.controller.signal.reason);
			state.controller.signal.addEventListener("abort", rejectOnAbort, { once: true });
		});
		try {
			return await Promise.race([detectImage(state, source, displayWidth, displayHeight), aborted]);
		} finally {
			clearTimeout(timer);
			state.controller.signal.removeEventListener("abort", rejectOnAbort);
		}
	}
	async function detectImage(state, source, displayWidth, displayHeight) {
		let naturalWidth, naturalHeight, result;
		if (source?.data && source.width && source.height) {
			naturalWidth = source.width;
			naturalHeight = source.height;
			result = await send(state, {
				type: "identifyData",
				data: source.data,
				width: naturalWidth,
				height: naturalHeight
			});
		} else {
			const bitmap = await createImageBitmap(source);
			try {
				naturalWidth = bitmap.width;
				naturalHeight = bitmap.height;
				result = await send(state, {
					type: "identify",
					bitmap
				}, [bitmap]);
			} finally {
				bitmap.close();
			}
		}
		const scaleX = (displayWidth ?? naturalWidth) / naturalWidth;
		const scaleY = (displayHeight ?? naturalHeight) / naturalHeight;
		return {
			box: result.box.map((value, index) => value * (index % 2 ? scaleY : scaleX)),
			confidence: result.confidence,
			naturalWidth,
			naturalHeight
		};
	}
	function stop(state, error) {
		if (state.controller.signal.aborted) return;
		state.controller.abort(error);
		state.pageWindow.removeEventListener("pagehide", state.onPageHide);
		state.worker?.terminate();
		for (const pending of state.pending.values()) pending.reject(error);
		state.pending.clear();
		for (const url of state.urls) state.pageWindow.URL.revokeObjectURL(url);
		state.urls.length = 0;
		if (active === state) active = null;
	}
	function dragSlider({ handle, track, distance, eventTarget = handle?.ownerDocument, signal, timeoutMs = 5e3 }) {
		return new Promise((resolve, reject) => {
			signal?.throwIfAborted();
			const doc = handle?.ownerDocument;
			const view = doc?.defaultView;
			if (!doc || !view || !track || !eventTarget || !handle.isConnected || !handle.getClientRects().length) throw new Error("滑块控件不可用");
			const rect = handle.getBoundingClientRect();
			const maxDistance = track.getBoundingClientRect().width - rect.width;
			if (!Number.isFinite(distance) || distance <= 0 || distance > maxDistance) throw new Error("滑块距离超出有效范围");
			const startX = rect.left + rect.width * (.4 + Math.random() * .2);
			const startY = rect.top + rect.height * (.4 + Math.random() * .2);
			const durationMs = Math.min(700, Math.max(420, 320 + distance * 1.4) + Math.random() * 40);
			const verticalOffset = (Math.random() < .5 ? -1 : 1) * (1 + Math.random() * 2);
			const startedAt = view.performance.now();
			let lastMoveAt = startedAt;
			let animationFrame;
			let pressed = false;
			let finished = false;
			const emit = (target, type, x, y, buttons) => target.dispatchEvent(new view.MouseEvent(type, {
				bubbles: true,
				cancelable: true,
				view,
				button: 0,
				buttons,
				clientX: x,
				clientY: y
			}));
			const finish = (error) => {
				if (finished) return;
				finished = true;
				view.cancelAnimationFrame(animationFrame);
				clearTimeout(deadline);
				signal?.removeEventListener("abort", abort);
				if (error && pressed) try {
					emit(eventTarget, "mousemove", startX, startY, 1);
					emit(eventTarget, "mouseup", startX, startY, 0);
				} catch {}
				error ? reject(error) : resolve();
			};
			const abort = () => finish(signal.reason ?? new Error("滑块拖动已取消"));
			const tick = (now) => {
				if (finished) return;
				try {
					signal?.throwIfAborted();
					if (!handle.isConnected) throw new Error("滑块控件已移除或隐藏");
					const progress = Math.min(1, Math.max(0, (now - startedAt) / durationMs));
					if (progress < 1 && now - lastMoveAt < 20) {
						animationFrame = view.requestAnimationFrame(tick);
						return;
					}
					if (!handle.getClientRects().length) throw new Error("滑块控件已移除或隐藏");
					const eased = progress * progress * (3 - 2 * progress);
					emit(eventTarget, "mousemove", startX + distance * eased, startY + Math.sin(progress * Math.PI) * verticalOffset, 1);
					lastMoveAt = now;
					if (finished) return;
					if (progress === 1) {
						pressed = false;
						emit(eventTarget, "mouseup", startX + distance, startY, 0);
						finish();
					} else animationFrame = view.requestAnimationFrame(tick);
				} catch (error) {
					finish(error);
				}
			};
			const deadline = setTimeout(() => finish(new Error("滑块拖动超时，请手动完成验证")), timeoutMs);
			signal?.addEventListener("abort", abort, { once: true });
			try {
				pressed = true;
				emit(handle, "mousedown", startX, startY, 1);
				if (!finished) animationFrame = view.requestAnimationFrame(tick);
			} catch (error) {
				finish(error);
			}
		});
	}
	function dragIdsSlider(slider, distance, options = {}) {
		return dragSlider({
			...options,
			handle: slider,
			track: slider?.closest(".sliderContainer"),
			distance
		});
	}
	var POLL_MS = 200;
	var FRAME_POLL_MS = 60;
	var FRAME_TIMEOUT_MS = 8e3;
	var FRAME_STABLE_MS = 120;
	function getSliderElements() {
		const canvases = document.querySelectorAll("#sliderDiv > canvas");
		return {
			bgImg: canvases[0] ?? null,
			pieceImg: canvases[1] ?? null,
			slider: document.querySelector("#sliderDiv > div.sliderContainer > div.sliderMask > div.slider")
		};
	}
	function isSliderCaptchaPresent() {
		const slider = document.querySelector("#sliderDiv, #sliderCaptchaDiv, #captcha-id");
		return Boolean(slider && slider.offsetParent !== null && slider.innerHTML !== "");
	}
	function challengeSource() {
		return ["#slider-img1", "#slider-img2"].map((selector) => document.querySelector(selector)?.getAttribute("src") ?? "").join("\n");
	}
	function canvasFingerprint(canvas) {
		if (!canvas?.width || !canvas.height) return null;
		const pixels = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data;
		let hash = 2166136261;
		let painted = false;
		for (let i = 0; i < pixels.length; i++) {
			hash = Math.imul(hash ^ pixels[i], 16777619);
			if (i % 4 === 3 && pixels[i] !== 0) painted = true;
		}
		return painted ? `${canvas.width}:${canvas.height}:${hash >>> 0}` : null;
	}
	function readSliderFrame() {
		const elements = getSliderElements();
		if (!elements.bgImg || !elements.pieceImg || !elements.slider) return null;
		const background = canvasFingerprint(elements.bgImg);
		const piece = canvasFingerprint(elements.pieceImg);
		if (!background || !piece) return null;
		return {
			...elements,
			source: challengeSource(),
			background,
			piece
		};
	}
	function isSameSliderFrame(left, right) {
		return Boolean(left && right && left.bgImg === right.bgImg && left.pieceImg === right.pieceImg && left.slider === right.slider && left.source === right.source && left.background === right.background && left.piece === right.piece);
	}
	function sleep(signal, delayMs = POLL_MS) {
		return new Promise((resolve, reject) => {
			signal?.throwIfAborted();
			const abort = () => {
				clearTimeout(timer);
				reject(signal.reason);
			};
			const timer = setTimeout(() => {
				signal?.removeEventListener("abort", abort);
				resolve();
			}, delayMs);
			signal?.addEventListener("abort", abort, { once: true });
		});
	}
	async function waitForReadyFrame(signal) {
		const deadline = Date.now() + FRAME_TIMEOUT_MS;
		let candidate = null;
		let stableSince = Date.now();
		while (Date.now() < deadline) {
			signal?.throwIfAborted();
			if (document.querySelector("#sliderDiv > .sliderContainer_success") || !isSliderCaptchaPresent()) return null;
			const frame = readSliderFrame();
			if (!isSameSliderFrame(candidate, frame)) {
				candidate = frame;
				stableSince = Date.now();
			} else if (Date.now() - stableSince >= FRAME_STABLE_MS) return frame;
			await sleep(signal, FRAME_POLL_MS);
		}
		throw new Error("滑块图片加载超时，请手动完成验证");
	}
	async function waitForRefresh(frame, signal) {
		while (true) {
			signal?.throwIfAborted();
			if (document.querySelector("#sliderDiv > .sliderContainer_success") || !isSliderCaptchaPresent()) return false;
			const elements = getSliderElements();
			if (challengeSource() !== frame.source || elements.bgImg !== frame.bgImg || elements.pieceImg !== frame.pieceImg) return true;
			if (frame.source === "\n") {
				const current = readSliderFrame();
				if (current && current.background !== frame.background) return true;
			}
			await sleep(signal);
		}
	}
	async function runSliderAttempts(attempt, { signal, onRetry = () => {} } = {}) {
		for (let count = 1; count <= 3; count++) {
			const frame = await waitForReadyFrame(signal);
			if (!frame) return "closed";
			const outcome = await attempt(frame, count);
			if (outcome === "closed") return "closed";
			if (outcome === "manual") return "manual";
			if (outcome === "submitted" && !await waitForRefresh(frame, signal)) return "submitted";
			if (count < 3) onRetry(count + 1);
		}
		return "exhausted";
	}
	var console$35 = MyConsole("[ids.slider]");
	var solving = null;
	async function waitForSliderElements(timeoutMs = 8e3) {
		const interval = 200;
		const deadline = Date.now() + timeoutMs;
		while (Date.now() < deadline) {
			const els = getSliderElements();
			if (els.bgImg && els.pieceImg && els.slider) return els;
			await new Promise((r) => setTimeout(r, interval));
		}
		throw new Error("滑块验证码元素等待超时");
	}
	function solveIdsSliderCaptcha() {
		if (!solving) solving = solve().finally(() => {
			solving = null;
		});
		return solving;
	}
	async function solve() {
		if (!isSliderCaptchaPresent()) {
			console$35("滑块验证码未出现，跳过");
			return false;
		}
		let toastHandle = toast("info", "正在识别滑块验证…", 0);
		const controller = new AbortController();
		const onPageHide = () => controller.abort(new Error("页面已离开"));
		window.addEventListener("pagehide", onPageHide, { once: true });
		const showProgress = (message) => {
			if (toastHandle) removeToastHandle(toastHandle);
			toastHandle = toast("info", message, 0);
		};
		console$35("发现滑块验证码，开始自动识别");
		try {
			const { pieceImg } = await waitForSliderElements();
			if (!pieceImg.width || !pieceImg.height) throw new Error("展示位图 canvas 尺寸无效，无法确定滑动坐标系");
			controller.signal.throwIfAborted();
			const rec = await getSliderRecognizer();
			let manualMessage = "滑块验证无法自动完成，请手动操作";
			const result = await runSliderAttempts(async (frame, attempt) => {
				const { bgImg, pieceImg, slider } = frame;
				const { box, confidence } = await rec.detect(bgImg, {
					displayWidth: pieceImg.width,
					displayHeight: pieceImg.height
				});
				controller.signal.throwIfAborted();
				if (!isSliderCaptchaPresent() || document.querySelector("#sliderDiv > .sliderContainer_success")) return "closed";
				if (!isSameSliderFrame(frame, readSliderFrame())) return "refreshed";
				if (!box || box.length !== 4 || !box.every(Number.isFinite)) return "manual";
				if (!Number.isFinite(confidence) || confidence < MIN_CONFIDENCE) {
					manualMessage = "滑块验证识别置信度过低，请手动操作";
					return "manual";
				}
				const distance = Math.round(box[0]);
				console$35(`第 ${attempt}/3 次滑块拖动，距离: ${distance}px`);
				await dragIdsSlider(slider, distance, { signal: controller.signal });
				controller.signal.throwIfAborted();
				showProgress("滑块已拖动，等待验证与跳转…");
				return "submitted";
			}, {
				signal: controller.signal,
				onRetry: (attempt) => showProgress(`验证码已刷新，正在重试（${attempt}/3）…`)
			});
			if (result === "exhausted" || result === "manual") {
				removeToastHandle(toastHandle);
				toastHandle = null;
				toast("warning", result === "exhausted" ? "滑块自动验证已尝试 3 次，请手动完成验证" : manualMessage, 0);
				return false;
			}
			return result === "submitted";
		} catch (err) {
			if (controller.signal.aborted) return false;
			const isScheduleError = err?.code === SLIDER_RECOGNIZER_UNAVAILABLE;
			console$35("滑块验证识别异常", err, "error");
			removeToastHandle(toastHandle);
			toastHandle = null;
			toast("error", isScheduleError ? err.message : "滑块验证识别失败，请手动操作", 5);
			return false;
		} finally {
			if (toastHandle) removeToastHandle(toastHandle);
			window.removeEventListener("pagehide", onPageHide);
		}
	}
	var LIBRARY_PROXY_HOST = "zylib.nxu.edu.cn";
	var LIBRARY_READER_PLATFORMS = Object.freeze([{
		id: "cnki",
		hosts: ["kns.cnki.net", "www.cnki.net"],
		paths: ["/reader/xml", "/xmlRead/trialRead"],
		copy: true,
		slider: true
	}, {
		id: "wanfang",
		hosts: ["f.wanfangdata.com.cn"],
		paths: ["/online/pc/periodical_html"],
		copy: true,
		slider: false
	}]);
	Object.freeze([`*://${LIBRARY_PROXY_HOST}/*`, ...LIBRARY_READER_PLATFORMS.flatMap(({ hosts, paths }) => hosts.flatMap((host) => paths.map((path) => `*://${host}${path}*`)))]);
	function parseLibraryReaderLocation(input) {
		let url;
		try {
			url = new URL(typeof input === "string" ? input : input?.url);
		} catch {
			return null;
		}
		if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) return null;
		if (url.hostname === "zylib.nxu.edu.cn") {
			const hosts = url.searchParams.getAll("__host__");
			const protocols = url.searchParams.getAll("__proto__");
			if (hosts.length || protocols.length) {
				if (hosts.length !== 1 || protocols.length !== 1) return null;
				if (!["http", "https"].includes(protocols[0]) || !/^[a-z0-9.-]+$/i.test(hosts[0])) return null;
				if (url.pathname.startsWith("/-----")) return null;
				return {
					host: hosts[0].toLowerCase(),
					path: url.pathname,
					access: "zylib"
				};
			}
			if (!url.pathname.startsWith("/-----")) return null;
			let target;
			try {
				target = new URL(url.pathname.slice(6));
			} catch {
				return null;
			}
			if (!["http:", "https:"].includes(target.protocol) || target.username || target.password || target.port) return null;
			return {
				host: target.hostname,
				path: target.pathname,
				access: "zylib"
			};
		}
		const vpn = parseWebVpnContext(url.href);
		if (vpn?.viaVpn) return vpn.realHost ? {
			host: vpn.realHost,
			path: vpn.realPath,
			access: "webvpn"
		} : null;
		return {
			host: url.hostname,
			path: url.pathname,
			access: "direct"
		};
	}
	function resolveLibraryReader(input, platforms = LIBRARY_READER_PLATFORMS) {
		const location = parseLibraryReaderLocation(input);
		if (!location) return null;
		return platforms.find(({ hosts, paths }) => hosts.includes(location.host) && paths.some((path) => location.path === path || location.path.startsWith(`${path}/`) || location.path.startsWith(`${path}.`))) || null;
	}
	function isTuanweiDownloadRoute(ctx) {
		try {
			const url = new URL(ctx?.url);
			return ["https:", "http:"].includes(url.protocol) && url.hostname === "tuanwei.nxu.edu.cn" && !url.port && !url.username && !url.password && url.pathname === "/system/_content/download.jsp" && url.searchParams.getAll("urltype").length === 1 && url.searchParams.get("urltype") === "news.DownloadAttachUrl" && ["owner", "wbfileid"].every((key) => url.searchParams.getAll(key).length === 1 && /^\d+$/.test(url.searchParams.get(key)));
		} catch {
			return false;
		}
	}
	function isTrustedIdsContext(ctx) {
		if (!ctx) return false;
		if (ctx.host === "ids.nxu.edu.cn") return true;
		return Boolean(ctx.isWebvpn && ctx.vpnContext?.realHost === "ids.nxu.edu.cn");
	}
	function isWebVpnIdsLoginRoute(ctx) {
		if (!isTrustedIdsContext(ctx) || !ctx.isWebvpn) return false;
		return String(ctx.vpnContext?.realPath || "").includes("/authserver/login");
	}
	function isWebVpnIdsReAuthRoute(ctx) {
		if (!isTrustedIdsContext(ctx) || !ctx.isWebvpn) return false;
		return String(ctx.vpnContext?.realPath || "").includes("/authserver/reAuthCheck/");
	}
	function isWebVpnToolsRoute(ctx, bodyHtml = "") {
		if (ctx?.host !== "webvpn.nxu.edu.cn") return false;
		if (ctx.path === "/h/tools" || ctx.path === "/h/tools/") return true;
		return ctx.path === "/wengine-vpn/failed" && /地址[：:]\s*\/h\/tools\/?(?=$|[\s?#<])/.test(bodyHtml);
	}
	function isWebVpnFailedRoute(ctx, bodyHtml = "") {
		return ctx?.host === "webvpn.nxu.edu.cn" && ctx.path === "/wengine-vpn/failed" && !isWebVpnToolsRoute(ctx, bodyHtml);
	}
	var console$34 = MyConsole("[统一认证]");
	var pageWindow$4 = _unsafeWindow ?? window;
	var authLoginSubmitting = false;
	async function idsLogin() {
		if (!getGMValue("WebVPN.autoLogin")) return;
		if (authLoginSubmitting) {
			console$34("已触发登录，忽略重复调用", "", "debug");
			return;
		}
		if (!isTrustedIdsContext(getContext())) {
			console$34("拒绝在非统一认证页面执行自动登录", { href: window.location.href }, "error");
			return;
		}
		toast("info", "正在填写统一认证登录信息…", 3);
		if (!requireCredentials("WebVPN")) return;
		const authErrorText = getAuthErrorText();
		if (authErrorText) {
			if (isCredentialsErrorText(authErrorText)) notifyCredentialsProblem("WebVPN", 0);
			else toast("error", authErrorText, 5);
			return;
		}
		try {
			authLoginSubmitting = true;
			const usernameInput = await waitForElement("#pwdFromId #username, .login-main .m-account #username, input#username", { timeout: 12e3 });
			const passwordInput = await waitForElement("#pwdFromId #password, .login-main .m-account #password, input#password", { timeout: 12e3 });
			const username = String(getGMValue("WebVPN.username") || "");
			const password = String(getGMValue("WebVPN.password") || "");
			fillControlledInput(usernameInput, username);
			fillControlledInput(passwordInput, password);
			const rememberInput = document.querySelector("input#rememberMe, input#myRememberMe, input[name=rememberMe]");
			if (rememberInput) {
				rememberInput.checked = true;
				rememberInput.value = "true";
				rememberInput.dispatchEvent(new Event("change", { bubbles: true }));
			}
			if (hasLegacyAuthCaptcha()) {
				authLoginSubmitting = false;
				toast("warning", "账号已填入，请手动输入图形验证码后登录", 0);
				return;
			}
			const submitButton = document.querySelector("a#login_submit, #pwdFromId a.login-btn, button[type=submit], input[type=submit]");
			if (typeof pageWindow$4.startLogin === "function" && submitButton) await Promise.resolve(pageWindow$4.startLogin(submitButton));
			else if (submitButton) submitButton.click();
			else if (typeof pageWindow$4.checkForm === "function") {
				if (await Promise.resolve(pageWindow$4.checkForm()) === false) {
					authLoginSubmitting = false;
					return;
				}
				const form = document.querySelector("#pwdFromId, .login-main form");
				if (typeof form?.requestSubmit !== "function") throw scheduleOperationError(AUTH_SUBMIT_MISSING, "统一认证页面缺少安全提交入口");
				form.requestSubmit();
			} else throw scheduleOperationError(AUTH_SUBMIT_MISSING, "统一认证登录按钮尚未加载");
			setTimeout(() => {
				solveIdsSliderCaptcha().catch((err) => {
					console$34("滑块自动识别流程异常", err, "error");
				});
			}, 800);
		} catch (error) {
			authLoginSubmitting = false;
			console$34("自动登录失败", error, "error");
			installNotification();
			toast("error", "统一认证自动登录失败，请手动操作", 5);
		}
	}
	var installed = false;
	var console$33 = MyConsole("[vant.style]");
	function installVantStyle() {
		if (installed) return;
		const vantCss = _GM_getResourceText?.("vant-css");
		if (typeof vantCss !== "string" || vantCss.trim() === "") {
			console$33("Vant CSS 资源不可用，跳过样式注入", "", "error");
			return;
		}
		if (typeof _GM_addStyle === "function") _GM_addStyle(vantCss);
		else {
			const style = document.createElement("style");
			style.dataset.betterNxuVant = "true";
			style.textContent = vantCss;
			(document.head || document.documentElement).appendChild(style);
		}
		installed = true;
	}
	var console$32 = MyConsole("[use-vue-app]");
	function mountVueApp(options = {}) {
		const { root, id, rootProps, useVantStyles = true } = options;
		let mountEl = id ? document.getElementById(id) : null;
		if (id && !mountEl) {
			mountEl = document.createElement("div");
			mountEl.id = id;
			document.body.appendChild(mountEl);
		}
		if (typeof vue.createApp !== "function") {
			console$32("createApp 未就绪（@require vue 可能被 ScriptCat 拒载）", void 0, "error");
			return null;
		}
		if (useVantStyles) installVantStyle();
		const app = (0, vue.createApp)(root, rootProps);
		app.mount(mountEl || document.body.appendChild(document.createElement("div")));
		return app;
	}
	var _plugin_vue_export_helper_default = (sfc, props) => {
		const target = sfc.__vccOpts || sfc;
		for (const [key, val] of props) target[key] = val;
		return target;
	};
	var LoginFillButton_default = _plugin_vue_export_helper_default({
		__name: "LoginFillButton",
		setup(__props) {
			const console = MyConsole("[ids.login]");
			const visible = (0, vue.ref)(false);
			function fill() {
				const usernameInput = document.querySelector("#pwdFromId #username, .login-main .m-account #username, input#username");
				const passwordInput = document.querySelector("#pwdFromId #password, .login-main .m-account #password, input#password");
				if (!usernameInput || !passwordInput) {
					toast("error", "未找到统一认证登录框，请手动输入", 4);
					return;
				}
				const username = getGMValue("WebVPN.username");
				const password = getGMValue("WebVPN.password");
				fillControlledInput(usernameInput, username);
				fillControlledInput(passwordInput, password);
				toast("success", "账号已填入，请手动完成登录验证", 4);
			}
			(0, vue.onMounted)(() => {
				if (!hasLoginCredentials(getGMValue("WebVPN.username"), getGMValue("WebVPN.password"))) return;
				installNotification();
				visible.value = true;
				console("注入浮动填账号按钮");
			});
			return (_ctx, _cache) => {
				return visible.value ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("button", {
					key: 0,
					id: "better-nxu-auth-fill",
					type: "button",
					class: "better-nxu-auth-fill",
					onClick: fill
				}, " Better NXU · 填入已保存账号 ")) : (0, vue.createCommentVNode)("", true);
			};
		}
	}, [["__scopeId", "data-v-acbd53d7"]]);
	var console$31 = MyConsole("[ids.login]");
	async function register$20() {
		console$31("进入登录页");
		installNotification();
		if (getGMValue("WebVPN.autoLogin")) await idsLogin();
		else {
			console$31("自动登录未启用，注入浮动填账号按钮");
			mountVueApp({
				root: LoginFillButton_default,
				id: "better-nxu-auth-fill-host",
				useVantStyles: false
			});
		}
	}
	var console$30 = MyConsole("[ids.re-auth]");
	var pageWindow$3 = _unsafeWindow ?? window;
	async function register$19() {
		console$30("进入二次确认页");
		if (!isTrustedIdsContext(getContext())) {
			console$30("拒绝在非统一认证页面执行二次认证", { href: window.location.href }, "error");
			return;
		}
		installNotification();
		if (!getGMValue("WebVPN.autoReLogin")) return;
		toast("info", "尝试自动登录...");
		if (typeof pageWindow$3.reAuthByCombined === "function") pageWindow$3.reAuthByCombined("weixin");
		else console$30("页面未提供 reAuthByCombined 函数，无法自动通过二次验证", void 0, "warn");
	}
	var console$29 = MyConsole("[ids.callback]");
	function redirectToWeixinScan(query) {
		if (!getGMValue("WebVPN.autoReLogin")) return;
		toast("info", "尝试自动登录...");
		const target = new URL("https://open.weixin.qq.com/connect/qrconnect");
		target.searchParams.set("appid", query.get("appid") || "");
		target.searchParams.set("redirect_uri", "https://ids.nxu.edu.cn/authserver/callback");
		target.searchParams.set("response_type", "code");
		target.searchParams.set("scope", "snsapi_login");
		target.searchParams.set("state", query.get("state") || "");
		target.searchParams.set("fast_login", "1");
		location.href = target.href;
	}
	function redirectToFixedCallback(query) {
		const warning = document.querySelector("#welcome.warn");
		if (!warning || !warning.textContent.includes("授权失败")) return;
		toast("info", "请稍候...");
		toast("info", "尝试跳转至正确页面");
		const callback = new URL("https://ids.nxu.edu.cn/authserver/callback");
		callback.searchParams.set("code", query.get("code") || "");
		callback.searchParams.set("state", query.get("state") || "");
		const callbackUrl = buildWebVpnUrl(callback);
		if (!callbackUrl) {
			toast("error", "无法生成统一认证回调地址，请手动返回 WebVPN", 5);
			return;
		}
		location.href = callbackUrl;
	}
	async function register$18() {
		console$29("进入微信回调/扫码代理页");
		installNotification();
		const ctx = getContext();
		if (ctx.url.indexOf(`/${WEBVPN_HOST_TOKENS["open.weixin.qq.com"]}/connect/qrconnect`) !== -1) {
			console$29("进入微信扫码代理分支");
			redirectToWeixinScan(ctx.query);
			return;
		}
		console$29("进入微信回调修复分支");
		redirectToFixedCallback(ctx.query);
	}
	var console$28 = MyConsole("[wait-or-toast]");
	async function waitOrToast(selector, options = {}) {
		const { timeout, interval, predicate, level, timeoutMessage, errorMessage, duration = 5 } = options || {};
		try {
			return await waitForElement(selector, {
				timeout,
				interval,
				predicate
			});
		} catch (error) {
			installNotification();
			const isTimeout = error?.code === WAIT_TIMEOUT;
			const tipLevel = level === "error" ? "error" : "warning";
			const message = isTimeout ? timeoutMessage || `等待页面元素超时：${selector}` : errorMessage || error?.message || `${selector} 加载失败`;
			toast(tipLevel, message, duration);
			console$28("waitOrToast 捕获", {
				selector,
				isTimeout,
				code: error?.code,
				message
			}, "warn");
			return null;
		}
	}
	var console$27 = MyConsole("[weixin.login]");
	async function register$17() {
		console$27("进入授权页面");
		const ctx = getContext();
		if (ctx.query.get("fast_login") === "0") {
			location.href = ctx.url.replace("fast_login=0", "fast_login=1");
			return;
		}
		installNotification();
		try {
			if (!await waitOrToast(".js_quick_login", {
				predicate: (element) => element.querySelector("button"),
				level: "error",
				duration: 4
			})) return;
			const visible = await waitOrToast(".js_quick_login", {
				timeout: 1e4,
				predicate: (element) => element.style.display !== "none",
				level: "error",
				duration: 4
			});
			if (!visible) return;
			visible.querySelector("button").click();
		} catch (error) {
			toast("error", error.message || "微信登录入口加载失败，请手动操作", 4);
		}
	}
	var console$26 = MyConsole("[use-app-page]");
	function mountAppPage({ id, title, deployMessage = "请等待工具部署", extraSetup } = {}) {
		document.body.replaceChildren();
		if (title) document.title = title;
		installNotification();
		installVantStyle();
		const deployToast = toast("info", deployMessage, 0);
		const mountEl = document.createElement("div");
		mountEl.id = id;
		document.body.appendChild(mountEl);
		if (typeof extraSetup === "function") try {
			extraSetup({ mountEl });
		} catch (error) {
			console$26("extraSetup 回调抛错", error, "warn");
		}
		return {
			mountEl,
			deployToast
		};
	}
	function noop() {}
	var extend = Object.assign;
	var inBrowser$1 = typeof window !== "undefined";
	var isObject$1 = (val) => val !== null && typeof val === "object";
	var isDef = (val) => val !== void 0 && val !== null;
	var isFunction = (val) => typeof val === "function";
	var isPromise = (val) => isObject$1(val) && isFunction(val.then) && isFunction(val.catch);
	var isNumeric = (val) => typeof val === "number" || /^\d+(\.\d+)?$/.test(val);
	var isIOS$1 = () => inBrowser$1 ? /ios|iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase()) : false;
	function get(object, path) {
		const keys = path.split(".");
		let result = object;
		keys.forEach((key) => {
			var _a;
			result = isObject$1(result) ? (_a = result[key]) != null ? _a : "" : "";
		});
		return result;
	}
	function pick(obj, keys, ignoreUndefined) {
		return keys.reduce((ret, key) => {
			if (!ignoreUndefined || obj[key] !== void 0) ret[key] = obj[key];
			return ret;
		}, {});
	}
	var toArray = (item) => Array.isArray(item) ? item : [item];
	var numericProp = [Number, String];
	var truthProp = {
		type: Boolean,
		default: true
	};
	var makeRequiredProp = (type) => ({
		type,
		required: true
	});
	var makeArrayProp = () => ({
		type: Array,
		default: () => []
	});
	var makeNumberProp = (defaultVal) => ({
		type: Number,
		default: defaultVal
	});
	var makeNumericProp = (defaultVal) => ({
		type: numericProp,
		default: defaultVal
	});
	var makeStringProp = (defaultVal) => ({
		type: String,
		default: defaultVal
	});
	var inBrowser = typeof window !== "undefined";
	function raf(fn) {
		return inBrowser ? requestAnimationFrame(fn) : -1;
	}
	function cancelRaf(id) {
		if (inBrowser) cancelAnimationFrame(id);
	}
	function doubleRaf(fn) {
		raf(() => raf(fn));
	}
	var isWindow = (val) => val === window;
	var makeDOMRect = (width2, height2) => ({
		top: 0,
		left: 0,
		right: width2,
		bottom: height2,
		width: width2,
		height: height2
	});
	var useRect = (elementOrRef) => {
		const element = (0, vue.unref)(elementOrRef);
		if (isWindow(element)) {
			const width2 = element.innerWidth;
			const height2 = element.innerHeight;
			return makeDOMRect(width2, height2);
		}
		if (element == null ? void 0 : element.getBoundingClientRect) return element.getBoundingClientRect();
		return makeDOMRect(0, 0);
	};
	function useParent(key) {
		const parent = (0, vue.inject)(key, null);
		if (parent) {
			const instance = (0, vue.getCurrentInstance)();
			const { link, unlink, internalChildren } = parent;
			link(instance);
			(0, vue.onUnmounted)(() => unlink(instance));
			return {
				parent,
				index: (0, vue.computed)(() => internalChildren.indexOf(instance))
			};
		}
		return {
			parent: null,
			index: (0, vue.ref)(-1)
		};
	}
	function flattenVNodes(children) {
		const result = [];
		const traverse = (children2) => {
			if (Array.isArray(children2)) children2.forEach((child) => {
				var _a;
				if ((0, vue.isVNode)(child)) {
					result.push(child);
					if ((_a = child.component) == null ? void 0 : _a.subTree) {
						result.push(child.component.subTree);
						traverse(child.component.subTree.children);
					}
					if (child.children) traverse(child.children);
				}
			});
		};
		traverse(children);
		return result;
	}
	var findVNodeIndex = (vnodes, vnode) => {
		const index = vnodes.indexOf(vnode);
		if (index === -1) return vnodes.findIndex((item) => vnode.key !== void 0 && vnode.key !== null && item.type === vnode.type && item.key === vnode.key);
		return index;
	};
	function sortChildren(parent, publicChildren, internalChildren) {
		const vnodes = flattenVNodes(parent.subTree.children);
		internalChildren.sort((a, b) => findVNodeIndex(vnodes, a.vnode) - findVNodeIndex(vnodes, b.vnode));
		const orderedPublicChildren = internalChildren.map((item) => item.proxy);
		publicChildren.sort((a, b) => {
			return orderedPublicChildren.indexOf(a) - orderedPublicChildren.indexOf(b);
		});
	}
	function useChildren(key) {
		const publicChildren = (0, vue.reactive)([]);
		const internalChildren = (0, vue.reactive)([]);
		const parent = (0, vue.getCurrentInstance)();
		const linkChildren = (value) => {
			const link = (child) => {
				if (child.proxy) {
					internalChildren.push(child);
					publicChildren.push(child.proxy);
					sortChildren(parent, publicChildren, internalChildren);
				}
			};
			const unlink = (child) => {
				const index = internalChildren.indexOf(child);
				publicChildren.splice(index, 1);
				internalChildren.splice(index, 1);
			};
			(0, vue.provide)(key, Object.assign({
				link,
				unlink,
				children: publicChildren,
				internalChildren
			}, value));
		};
		return {
			children: publicChildren,
			linkChildren
		};
	}
	function onMountedOrActivated(hook) {
		let mounted;
		(0, vue.onMounted)(() => {
			hook();
			(0, vue.nextTick)(() => {
				mounted = true;
			});
		});
		(0, vue.onActivated)(() => {
			if (mounted) hook();
		});
	}
	function useEventListener(type, listener, options = {}) {
		if (!inBrowser) return;
		const { target = window, passive = false, capture = false } = options;
		let cleaned = false;
		let attached;
		const add = (target2) => {
			if (cleaned) return;
			const element = (0, vue.unref)(target2);
			if (element && !attached) {
				element.addEventListener(type, listener, {
					capture,
					passive
				});
				attached = true;
			}
		};
		const remove = (target2) => {
			if (cleaned) return;
			const element = (0, vue.unref)(target2);
			if (element && attached) {
				element.removeEventListener(type, listener, capture);
				attached = false;
			}
		};
		(0, vue.onUnmounted)(() => remove(target));
		(0, vue.onDeactivated)(() => remove(target));
		onMountedOrActivated(() => add(target));
		let stopWatch;
		if ((0, vue.isRef)(target)) stopWatch = (0, vue.watch)(target, (val, oldVal) => {
			remove(oldVal);
			add(val);
		});
		return () => {
			stopWatch?.();
			remove(target);
			cleaned = true;
		};
	}
	var width;
	var height;
	function useWindowSize() {
		if (!width) {
			width = (0, vue.ref)(0);
			height = (0, vue.ref)(0);
			if (inBrowser) {
				const update = () => {
					width.value = window.innerWidth;
					height.value = window.innerHeight;
				};
				update();
				window.addEventListener("resize", update, { passive: true });
				window.addEventListener("orientationchange", update, { passive: true });
			}
		}
		return {
			width,
			height
		};
	}
	var overflowScrollReg = /scroll|auto|overlay/i;
	var defaultRoot = inBrowser ? window : void 0;
	function isElement(node) {
		return node.tagName !== "HTML" && node.tagName !== "BODY" && node.nodeType === 1;
	}
	function getScrollParent(el, root = defaultRoot) {
		let node = el;
		while (node && node !== root && isElement(node)) {
			const { overflowY } = window.getComputedStyle(node);
			if (overflowScrollReg.test(overflowY)) return node;
			node = node.parentNode;
		}
		return root;
	}
	function useScrollParent(el, root = defaultRoot) {
		const scrollParent = (0, vue.ref)();
		(0, vue.onMounted)(() => {
			if (el.value) scrollParent.value = getScrollParent(el.value, root);
		});
		return scrollParent;
	}
	var visibility;
	function usePageVisibility() {
		if (!visibility) {
			visibility = (0, vue.ref)("visible");
			if (inBrowser) {
				const update = () => {
					visibility.value = document.hidden ? "hidden" : "visible";
				};
				update();
				window.addEventListener("visibilitychange", update);
			}
		}
		return visibility;
	}
	var CUSTOM_FIELD_INJECTION_KEY = Symbol("van-field");
	function useCustomFieldValue(customValue) {
		const field = (0, vue.inject)(CUSTOM_FIELD_INJECTION_KEY, null);
		if (field && !field.customValue.value) {
			field.customValue.value = customValue;
			(0, vue.watch)(customValue, () => {
				field.resetValidation();
				field.validateWithTrigger("onChange");
			});
		}
	}
	function getScrollTop(el) {
		const top = "scrollTop" in el ? el.scrollTop : el.pageYOffset;
		return Math.max(top, 0);
	}
	function setScrollTop(el, value) {
		if ("scrollTop" in el) el.scrollTop = value;
		else el.scrollTo(el.scrollX, value);
	}
	function getRootScrollTop() {
		return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
	}
	function setRootScrollTop(value) {
		setScrollTop(window, value);
		setScrollTop(document.body, value);
	}
	function getElementTop(el, scroller) {
		if (el === window) return 0;
		const scrollTop = scroller ? getScrollTop(scroller) : getRootScrollTop();
		return useRect(el).top + scrollTop;
	}
	var isIOS = isIOS$1();
	function resetScroll() {
		if (isIOS) setRootScrollTop(getRootScrollTop());
	}
	var stopPropagation = (event) => event.stopPropagation();
	function preventDefault(event, isStopPropagation) {
		if (typeof event.cancelable !== "boolean" || event.cancelable) event.preventDefault();
		if (isStopPropagation) stopPropagation(event);
	}
	function isHidden(elementRef) {
		const el = (0, vue.unref)(elementRef);
		if (!el) return false;
		const style = window.getComputedStyle(el);
		const hidden = style.display === "none";
		const parentHidden = el.offsetParent === null && style.position !== "fixed";
		return hidden || parentHidden;
	}
	var { width: windowWidth, height: windowHeight } = useWindowSize();
	function addUnit(value) {
		if (isDef(value)) return isNumeric(value) ? `${value}px` : String(value);
	}
	function getSizeStyle(originSize) {
		if (isDef(originSize)) {
			if (Array.isArray(originSize)) return {
				width: addUnit(originSize[0]),
				height: addUnit(originSize[1])
			};
			const size = addUnit(originSize);
			return {
				width: size,
				height: size
			};
		}
	}
	function getZIndexStyle(zIndex) {
		const style = {};
		if (zIndex !== void 0) style.zIndex = +zIndex;
		return style;
	}
	var rootFontSize;
	function getRootFontSize() {
		if (!rootFontSize) {
			const doc = document.documentElement;
			const fontSize = doc.style.fontSize || window.getComputedStyle(doc).fontSize;
			rootFontSize = parseFloat(fontSize);
		}
		return rootFontSize;
	}
	function convertRem(value) {
		value = value.replace(/rem/g, "");
		return +value * getRootFontSize();
	}
	function convertVw(value) {
		value = value.replace(/vw/g, "");
		return +value * windowWidth.value / 100;
	}
	function convertVh(value) {
		value = value.replace(/vh/g, "");
		return +value * windowHeight.value / 100;
	}
	function unitToPx(value) {
		if (typeof value === "number") return value;
		if (inBrowser$1) {
			if (value.includes("rem")) return convertRem(value);
			if (value.includes("vw")) return convertVw(value);
			if (value.includes("vh")) return convertVh(value);
		}
		return parseFloat(value);
	}
	var camelizeRE$1 = /-(\w)/g;
	var camelize$1 = (str) => str.replace(camelizeRE$1, (_, c) => c.toUpperCase());
	var kebabCase = (str) => str.replace(/([A-Z])/g, "-$1").toLowerCase().replace(/^-/, "");
	var clamp = (num, min, max) => Math.min(Math.max(num, min), max);
	function trimExtraChar(value, char, regExp) {
		const index = value.indexOf(char);
		if (index === -1) return value;
		if (char === "-" && index !== 0) return value.slice(0, index);
		return value.slice(0, index + 1) + value.slice(index).replace(regExp, "");
	}
	function formatNumber(value, allowDot = true, allowMinus = true) {
		if (allowDot) value = trimExtraChar(value, ".", /\./g);
		else value = value.split(".")[0];
		if (allowMinus) value = trimExtraChar(value, "-", /-/g);
		else value = value.replace(/-/, "");
		const regExp = allowDot ? /[^-0-9.]/g : /[^-0-9]/g;
		return value.replace(regExp, "");
	}
	var { hasOwnProperty } = Object.prototype;
	function assignKey(to, from, key) {
		const val = from[key];
		if (!isDef(val)) return;
		if (!hasOwnProperty.call(to, key) || !isObject$1(val)) to[key] = val;
		else to[key] = deepAssign(Object(to[key]), val);
	}
	function deepAssign(to, from) {
		Object.keys(from).forEach((key) => {
			assignKey(to, from, key);
		});
		return to;
	}
	var stdin_default$38 = {
		name: "姓名",
		tel: "电话",
		save: "保存",
		clear: "清空",
		undo: "撤销",
		cancel: "取消",
		confirm: "确认",
		delete: "删除",
		loading: "加载中...",
		noCoupon: "暂无优惠券",
		nameEmpty: "请填写姓名",
		addContact: "添加联系人",
		telInvalid: "请填写正确的电话",
		vanCalendar: {
			end: "结束",
			start: "开始",
			title: "日期选择",
			weekdays: [
				"日",
				"一",
				"二",
				"三",
				"四",
				"五",
				"六"
			],
			monthTitle: (year, month) => `${year}\u5E74${month}\u6708`,
			rangePrompt: (maxRange) => `\u6700\u591A\u9009\u62E9 ${maxRange} \u5929`
		},
		vanCascader: { select: "请选择" },
		vanPagination: {
			prev: "上一页",
			next: "下一页"
		},
		vanPullRefresh: {
			pulling: "下拉即可刷新...",
			loosing: "释放即可刷新..."
		},
		vanSubmitBar: { label: "合计:" },
		vanCoupon: {
			unlimited: "无门槛",
			discount: (discount) => `${discount}\u6298`,
			condition: (condition) => `\u6EE1${condition}\u5143\u53EF\u7528`
		},
		vanCouponCell: {
			title: "优惠券",
			count: (count) => `${count}\u5F20\u53EF\u7528`
		},
		vanCouponList: {
			exchange: "兑换",
			close: "不使用",
			enable: "可用",
			disabled: "不可用",
			placeholder: "输入优惠码"
		},
		vanAddressEdit: {
			area: "地区",
			areaEmpty: "请选择地区",
			addressEmpty: "请填写详细地址",
			addressDetail: "详细地址",
			defaultAddress: "设为默认收货地址"
		},
		vanAddressList: { add: "新增地址" }
	};
	var lang = (0, vue.ref)("zh-CN");
	var messages = (0, vue.reactive)({ "zh-CN": stdin_default$38 });
	var stdin_default$37 = {
		messages() {
			return messages[lang.value];
		},
		use(newLang, newMessages) {
			lang.value = newLang;
			this.add({ [newLang]: newMessages });
		},
		add(newMessages = {}) {
			deepAssign(messages, newMessages);
		}
	};
	function createTranslate(name) {
		const prefix = camelize$1(name) + ".";
		return (path, ...args) => {
			const messages = stdin_default$37.messages();
			const message = get(messages, prefix + path) || get(messages, path);
			return isFunction(message) ? message(...args) : message;
		};
	}
	function genBem(name, mods) {
		if (!mods) return "";
		if (typeof mods === "string") return ` ${name}--${mods}`;
		if (Array.isArray(mods)) return mods.reduce((ret, item) => ret + genBem(name, item), "");
		return Object.keys(mods).reduce((ret, key) => ret + (mods[key] ? genBem(name, key) : ""), "");
	}
	function createBEM(name) {
		return (el, mods) => {
			if (el && typeof el !== "string") {
				mods = el;
				el = "";
			}
			el = el ? `${name}__${el}` : name;
			return `${el}${genBem(el, mods)}`;
		};
	}
	function createNamespace(name) {
		const prefixedName = `van-${name}`;
		return [
			prefixedName,
			createBEM(prefixedName),
			createTranslate(prefixedName)
		];
	}
	var BORDER = "van-hairline";
	var BORDER_TOP = `${BORDER}--top`;
	var BORDER_LEFT = `${BORDER}--left`;
	`${BORDER}`;
	var BORDER_BOTTOM = `${BORDER}--bottom`;
	var BORDER_SURROUND = `${BORDER}--surround`;
	var BORDER_TOP_BOTTOM = `${BORDER}--top-bottom`;
	`${BORDER}`;
	var HAPTICS_FEEDBACK = "van-haptics-feedback";
	var FORM_KEY = Symbol("van-form");
	function callInterceptor(interceptor, { args = [], done, canceled, error }) {
		if (interceptor) {
			const returnVal = interceptor.apply(null, args);
			if (isPromise(returnVal)) returnVal.then((value) => {
				if (value) done();
				else if (canceled) canceled();
			}).catch(error || noop);
			else if (returnVal) done();
			else if (canceled) canceled();
		} else done();
	}
	function withInstall(options) {
		options.install = (app) => {
			const { name } = options;
			if (name) {
				app.component(name, options);
				app.component(camelize$1(`-${name}`), options);
			}
		};
		return options;
	}
	function closest(arr, target) {
		return arr.reduce((pre, cur) => Math.abs(pre - target) < Math.abs(cur - target) ? pre : cur);
	}
	var POPUP_TOGGLE_KEY = Symbol();
	function onPopupReopen(callback) {
		const popupToggleStatus = (0, vue.inject)(POPUP_TOGGLE_KEY, null);
		if (popupToggleStatus) (0, vue.watch)(popupToggleStatus, (show) => {
			if (show) callback();
		});
	}
	var useHeight = (element, withSafeArea) => {
		const height = (0, vue.ref)();
		const setHeight = () => {
			height.value = useRect(element).height;
		};
		(0, vue.onMounted)(() => {
			(0, vue.nextTick)(setHeight);
			if (withSafeArea) for (let i = 1; i <= 3; i++) setTimeout(setHeight, 100 * i);
		});
		onPopupReopen(() => (0, vue.nextTick)(setHeight));
		(0, vue.watch)([windowWidth, windowHeight], setHeight);
		return height;
	};
	function usePlaceholder(contentRef, bem) {
		const height = useHeight(contentRef, true);
		return (renderContent) => (0, vue.createVNode)("div", {
			"class": bem("placeholder"),
			"style": { height: height.value ? `${height.value}px` : void 0 }
		}, [renderContent()]);
	}
	var [name$33, bem$34] = createNamespace("action-bar");
	var ACTION_BAR_KEY = Symbol(name$33);
	var ActionBar = withInstall((0, vue.defineComponent)({
		name: name$33,
		props: {
			placeholder: Boolean,
			safeAreaInsetBottom: truthProp
		},
		setup(props, { slots }) {
			const root = (0, vue.ref)();
			const renderPlaceholder = usePlaceholder(root, bem$34);
			const { linkChildren } = useChildren(ACTION_BAR_KEY);
			linkChildren();
			const renderActionBar = () => {
				var _a;
				return (0, vue.createVNode)("div", {
					"ref": root,
					"class": [bem$34(), { "van-safe-area-bottom": props.safeAreaInsetBottom }]
				}, [(_a = slots.default) == null ? void 0 : _a.call(slots)]);
			};
			return () => {
				if (props.placeholder) return renderPlaceholder(renderActionBar);
				return renderActionBar();
			};
		}
	}));
	function useExpose(apis) {
		const instance = (0, vue.getCurrentInstance)();
		if (instance) extend(instance.proxy, apis);
	}
	var routeProps = {
		to: [String, Object],
		url: String,
		replace: Boolean
	};
	function route({ to, url, replace, $router: router }) {
		if (to && router) router[replace ? "replace" : "push"](to);
		else if (url) replace ? location.replace(url) : location.href = url;
	}
	function useRoute() {
		const vm = (0, vue.getCurrentInstance)().proxy;
		return () => route(vm);
	}
	var [name$32, bem$33] = createNamespace("badge");
	var badgeProps = {
		dot: Boolean,
		max: numericProp,
		tag: makeStringProp("div"),
		color: String,
		offset: Array,
		content: numericProp,
		showZero: truthProp,
		position: makeStringProp("top-right")
	};
	var Badge = withInstall((0, vue.defineComponent)({
		name: name$32,
		props: badgeProps,
		setup(props, { slots }) {
			const hasContent = () => {
				if (slots.content) return true;
				const { content, showZero } = props;
				return isDef(content) && content !== "" && (showZero || content !== 0 && content !== "0");
			};
			const renderContent = () => {
				const { dot, max, content } = props;
				if (!dot && hasContent()) {
					if (slots.content) return slots.content();
					if (isDef(max) && isNumeric(content) && +content > +max) return `${max}+`;
					return content;
				}
			};
			const getOffsetWithMinusString = (val) => val.startsWith("-") ? val.replace("-", "") : `-${val}`;
			const style = (0, vue.computed)(() => {
				const style2 = { background: props.color };
				if (props.offset) {
					const [x, y] = props.offset;
					const { position } = props;
					const [offsetY, offsetX] = position.split("-");
					if (slots.default) {
						if (typeof y === "number") style2[offsetY] = addUnit(offsetY === "top" ? y : -y);
						else style2[offsetY] = offsetY === "top" ? addUnit(y) : getOffsetWithMinusString(y);
						if (typeof x === "number") style2[offsetX] = addUnit(offsetX === "left" ? x : -x);
						else style2[offsetX] = offsetX === "left" ? addUnit(x) : getOffsetWithMinusString(x);
					} else {
						style2.marginTop = addUnit(y);
						style2.marginLeft = addUnit(x);
					}
				}
				return style2;
			});
			const renderBadge = () => {
				if (hasContent() || props.dot) return (0, vue.createVNode)("div", {
					"class": bem$33([props.position, {
						dot: props.dot,
						fixed: !!slots.default
					}]),
					"style": style.value
				}, [renderContent()]);
			};
			return () => {
				if (slots.default) {
					const { tag } = props;
					return (0, vue.createVNode)(tag, { "class": bem$33("wrapper") }, { default: () => [slots.default(), renderBadge()] });
				}
				return renderBadge();
			};
		}
	}));
	var globalZIndex = 2e3;
	var useGlobalZIndex = () => ++globalZIndex;
	var setGlobalZIndex = (val) => {
		globalZIndex = val;
	};
	var [name$31, bem$32] = createNamespace("config-provider");
	var CONFIG_PROVIDER_KEY = Symbol(name$31);
	var configProviderProps = {
		tag: makeStringProp("div"),
		theme: makeStringProp("light"),
		zIndex: Number,
		themeVars: Object,
		themeVarsDark: Object,
		themeVarsLight: Object,
		themeVarsScope: makeStringProp("local"),
		iconPrefix: String
	};
	function insertDash(str) {
		return str.replace(/([a-zA-Z])(\d)/g, "$1-$2");
	}
	function mapThemeVarsToCSSVars(themeVars) {
		const cssVars = {};
		Object.keys(themeVars).forEach((key) => {
			const formattedKey = insertDash(kebabCase(key));
			cssVars[`--van-${formattedKey}`] = themeVars[key];
		});
		return cssVars;
	}
	function syncThemeVarsOnRoot(newStyle = {}, oldStyle = {}) {
		Object.keys(newStyle).forEach((key) => {
			if (newStyle[key] !== oldStyle[key]) document.documentElement.style.setProperty(key, newStyle[key]);
		});
		Object.keys(oldStyle).forEach((key) => {
			if (!newStyle[key]) document.documentElement.style.removeProperty(key);
		});
	}
	(0, vue.defineComponent)({
		name: name$31,
		props: configProviderProps,
		setup(props, { slots }) {
			const style = (0, vue.computed)(() => mapThemeVarsToCSSVars(extend({}, props.themeVars, props.theme === "dark" ? props.themeVarsDark : props.themeVarsLight)));
			if (inBrowser$1) {
				const addTheme = () => {
					document.documentElement.classList.add(`van-theme-${props.theme}`);
				};
				const removeTheme = (theme = props.theme) => {
					document.documentElement.classList.remove(`van-theme-${theme}`);
				};
				(0, vue.watch)(() => props.theme, (newVal, oldVal) => {
					if (oldVal) removeTheme(oldVal);
					addTheme();
				}, { immediate: true });
				(0, vue.onActivated)(addTheme);
				(0, vue.onDeactivated)(removeTheme);
				(0, vue.onBeforeUnmount)(removeTheme);
				(0, vue.watch)(style, (newStyle, oldStyle) => {
					if (props.themeVarsScope === "global") syncThemeVarsOnRoot(newStyle, oldStyle);
				});
				(0, vue.watch)(() => props.themeVarsScope, (newScope, oldScope) => {
					if (oldScope === "global") syncThemeVarsOnRoot({}, style.value);
					if (newScope === "global") syncThemeVarsOnRoot(style.value, {});
				});
				if (props.themeVarsScope === "global") syncThemeVarsOnRoot(style.value, {});
			}
			(0, vue.provide)(CONFIG_PROVIDER_KEY, props);
			(0, vue.watchEffect)(() => {
				if (props.zIndex !== void 0) setGlobalZIndex(props.zIndex);
			});
			return () => (0, vue.createVNode)(props.tag, {
				"class": bem$32(),
				"style": props.themeVarsScope === "local" ? style.value : void 0
			}, { default: () => {
				var _a;
				return [(_a = slots.default) == null ? void 0 : _a.call(slots)];
			} });
		}
	});
	var [name$30, bem$31] = createNamespace("icon");
	var isImage = (name2) => name2 == null ? void 0 : name2.includes("/");
	var iconProps = {
		dot: Boolean,
		tag: makeStringProp("i"),
		name: String,
		size: numericProp,
		badge: numericProp,
		color: String,
		badgeProps: Object,
		classPrefix: String
	};
	var Icon = withInstall((0, vue.defineComponent)({
		name: name$30,
		props: iconProps,
		setup(props, { slots }) {
			const config = (0, vue.inject)(CONFIG_PROVIDER_KEY, null);
			const classPrefix = (0, vue.computed)(() => props.classPrefix || (config == null ? void 0 : config.iconPrefix) || bem$31());
			return () => {
				const { tag, dot, name: name2, size, badge, color } = props;
				const isImageIcon = isImage(name2);
				return (0, vue.createVNode)(Badge, (0, vue.mergeProps)({
					"dot": dot,
					"tag": tag,
					"class": [classPrefix.value, isImageIcon ? "" : `${classPrefix.value}-${name2}`],
					"style": {
						color,
						fontSize: addUnit(size)
					},
					"content": badge
				}, props.badgeProps), { default: () => {
					var _a;
					return [(_a = slots.default) == null ? void 0 : _a.call(slots), isImageIcon && (0, vue.createVNode)("img", {
						"class": bem$31("image"),
						"src": name2
					}, null)];
				} });
			};
		}
	}));
	var stdin_default$32 = Icon;
	var [name$29, bem$30] = createNamespace("loading");
	var SpinIcon = Array(12).fill(null).map((_, index) => (0, vue.createVNode)("i", { "class": bem$30("line", String(index + 1)) }, null));
	var CircularIcon = (0, vue.createVNode)("svg", {
		"class": bem$30("circular"),
		"viewBox": "25 25 50 50"
	}, [(0, vue.createVNode)("circle", {
		"cx": "50",
		"cy": "50",
		"r": "20",
		"fill": "none"
	}, null)]);
	var loadingProps = {
		size: numericProp,
		type: makeStringProp("circular"),
		color: String,
		vertical: Boolean,
		textSize: numericProp,
		textColor: String
	};
	var Loading = withInstall((0, vue.defineComponent)({
		name: name$29,
		props: loadingProps,
		setup(props, { slots }) {
			const spinnerStyle = (0, vue.computed)(() => extend({ color: props.color }, getSizeStyle(props.size)));
			const renderIcon = () => {
				const DefaultIcon = props.type === "spinner" ? SpinIcon : CircularIcon;
				return (0, vue.createVNode)("span", {
					"class": bem$30("spinner", props.type),
					"style": spinnerStyle.value
				}, [slots.icon ? slots.icon() : DefaultIcon]);
			};
			const renderText = () => {
				var _a;
				if (slots.default) return (0, vue.createVNode)("span", {
					"class": bem$30("text"),
					"style": {
						fontSize: addUnit(props.textSize),
						color: (_a = props.textColor) != null ? _a : props.color
					}
				}, [slots.default()]);
			};
			return () => {
				const { type, vertical } = props;
				return (0, vue.createVNode)("div", {
					"class": bem$30([type, { vertical }]),
					"aria-live": "polite",
					"aria-busy": true
				}, [renderIcon(), renderText()]);
			};
		}
	}));
	var [name$28, bem$29] = createNamespace("button");
	var buttonProps = extend({}, routeProps, {
		tag: makeStringProp("button"),
		text: String,
		icon: String,
		type: makeStringProp("default"),
		size: makeStringProp("normal"),
		color: String,
		block: Boolean,
		plain: Boolean,
		round: Boolean,
		square: Boolean,
		loading: Boolean,
		hairline: Boolean,
		disabled: Boolean,
		iconPrefix: String,
		nativeType: makeStringProp("button"),
		loadingSize: numericProp,
		loadingText: String,
		loadingType: String,
		iconPosition: makeStringProp("left")
	});
	var Button = withInstall((0, vue.defineComponent)({
		name: name$28,
		props: buttonProps,
		emits: ["click"],
		setup(props, { emit, slots }) {
			const route = useRoute();
			const renderLoadingIcon = () => {
				if (slots.loading) return slots.loading();
				return (0, vue.createVNode)(Loading, {
					"size": props.loadingSize,
					"type": props.loadingType,
					"class": bem$29("loading")
				}, null);
			};
			const renderIcon = () => {
				if (props.loading) return renderLoadingIcon();
				if (slots.icon) return (0, vue.createVNode)("div", { "class": bem$29("icon") }, [slots.icon()]);
				if (props.icon) return (0, vue.createVNode)(Icon, {
					"name": props.icon,
					"class": bem$29("icon"),
					"classPrefix": props.iconPrefix
				}, null);
			};
			const renderText = () => {
				let text;
				if (props.loading) text = props.loadingText;
				else text = slots.default ? slots.default() : props.text;
				if (text) return (0, vue.createVNode)("span", { "class": bem$29("text") }, [text]);
			};
			const getStyle = () => {
				const { color, plain } = props;
				if (color) {
					const style = { color: plain ? color : "white" };
					if (!plain) style.background = color;
					if (color.includes("gradient")) style.border = 0;
					else style.borderColor = color;
					return style;
				}
			};
			const onClick = (event) => {
				if (props.loading) preventDefault(event);
				else if (!props.disabled) {
					emit("click", event);
					route();
				}
			};
			return () => {
				const { tag, type, size, block, round, plain, square, loading, disabled, hairline, nativeType, iconPosition } = props;
				const classes = [bem$29([
					type,
					size,
					{
						plain,
						block,
						round,
						square,
						loading,
						disabled,
						hairline
					}
				]), { [BORDER_SURROUND]: hairline }];
				return (0, vue.createVNode)(tag, {
					"type": nativeType,
					"class": classes,
					"style": getStyle(),
					"disabled": disabled,
					"onClick": onClick
				}, { default: () => [(0, vue.createVNode)("div", { "class": bem$29("content") }, [
					iconPosition === "left" && renderIcon(),
					renderText(),
					iconPosition === "right" && renderIcon()
				])] });
			};
		}
	}));
	var [name$27, bem$28] = createNamespace("action-bar-button");
	var actionBarButtonProps = extend({}, routeProps, {
		type: String,
		text: String,
		icon: String,
		color: String,
		loading: Boolean,
		disabled: Boolean
	});
	var ActionBarButton = withInstall((0, vue.defineComponent)({
		name: name$27,
		props: actionBarButtonProps,
		setup(props, { slots }) {
			const route = useRoute();
			const { parent, index } = useParent(ACTION_BAR_KEY);
			const isFirst = (0, vue.computed)(() => {
				if (parent) {
					const prev = parent.children[index.value - 1];
					return !(prev && "isButton" in prev);
				}
			});
			const isLast = (0, vue.computed)(() => {
				if (parent) {
					const next = parent.children[index.value + 1];
					return !(next && "isButton" in next);
				}
			});
			useExpose({ isButton: true });
			return () => {
				const { type, icon, text, color, loading, disabled } = props;
				return (0, vue.createVNode)(Button, {
					"class": bem$28([type, {
						last: isLast.value,
						first: isFirst.value
					}]),
					"size": "large",
					"type": type,
					"icon": icon,
					"color": color,
					"loading": loading,
					"disabled": disabled,
					"onClick": route
				}, { default: () => [slots.default ? slots.default() : text] });
			};
		}
	}));
	var popupSharedProps = {
		show: Boolean,
		zIndex: numericProp,
		overlay: truthProp,
		duration: numericProp,
		teleport: [String, Object],
		lockScroll: truthProp,
		lazyRender: truthProp,
		beforeClose: Function,
		overlayProps: Object,
		overlayStyle: Object,
		overlayClass: null,
		transitionAppear: Boolean,
		closeOnClickOverlay: truthProp
	};
	var popupSharedPropKeys = Object.keys(popupSharedProps);
	function getDirection(x, y) {
		if (x > y) return "horizontal";
		if (y > x) return "vertical";
		return "";
	}
	function useTouch() {
		const startX = (0, vue.ref)(0);
		const startY = (0, vue.ref)(0);
		const deltaX = (0, vue.ref)(0);
		const deltaY = (0, vue.ref)(0);
		const offsetX = (0, vue.ref)(0);
		const offsetY = (0, vue.ref)(0);
		const direction = (0, vue.ref)("");
		const isTap = (0, vue.ref)(true);
		const isVertical = () => direction.value === "vertical";
		const isHorizontal = () => direction.value === "horizontal";
		const reset = () => {
			deltaX.value = 0;
			deltaY.value = 0;
			offsetX.value = 0;
			offsetY.value = 0;
			direction.value = "";
			isTap.value = true;
		};
		const start = ((event) => {
			reset();
			startX.value = event.touches[0].clientX;
			startY.value = event.touches[0].clientY;
		});
		const move = ((event) => {
			const touch = event.touches[0];
			deltaX.value = (touch.clientX < 0 ? 0 : touch.clientX) - startX.value;
			deltaY.value = touch.clientY - startY.value;
			offsetX.value = Math.abs(deltaX.value);
			offsetY.value = Math.abs(deltaY.value);
			const LOCK_DIRECTION_DISTANCE = 10;
			if (!direction.value || offsetX.value < LOCK_DIRECTION_DISTANCE && offsetY.value < LOCK_DIRECTION_DISTANCE) direction.value = getDirection(offsetX.value, offsetY.value);
			if (isTap.value && (offsetX.value > 5 || offsetY.value > 5)) isTap.value = false;
		});
		return {
			move,
			start,
			reset,
			startX,
			startY,
			deltaX,
			deltaY,
			offsetX,
			offsetY,
			direction,
			isVertical,
			isHorizontal,
			isTap
		};
	}
	var totalLockCount = 0;
	var BODY_LOCK_CLASS = "van-overflow-hidden";
	function useLockScroll(rootRef, shouldLock) {
		const touch = useTouch();
		const DIRECTION_UP = "01";
		const DIRECTION_DOWN = "10";
		const onTouchMove = (event) => {
			touch.move(event);
			const direction = touch.deltaY.value > 0 ? DIRECTION_DOWN : DIRECTION_UP;
			let el = getScrollParent(event.target, rootRef.value);
			while (el.scrollHeight <= el.offsetHeight && el !== rootRef.value && el.parentElement) el = getScrollParent(el.parentElement, rootRef.value);
			const { scrollHeight, offsetHeight, scrollTop } = el;
			let status = "11";
			if (scrollTop === 0) status = offsetHeight >= scrollHeight ? "00" : "01";
			else if (scrollTop + offsetHeight >= scrollHeight) status = "10";
			if (status !== "11" && touch.isVertical() && !(parseInt(status, 2) & parseInt(direction, 2))) preventDefault(event, true);
		};
		const lock = () => {
			document.addEventListener("touchstart", touch.start);
			document.addEventListener("touchmove", onTouchMove, { passive: false });
			if (!totalLockCount) document.body.classList.add(BODY_LOCK_CLASS);
			totalLockCount++;
		};
		const unlock = () => {
			if (totalLockCount) {
				document.removeEventListener("touchstart", touch.start);
				document.removeEventListener("touchmove", onTouchMove);
				totalLockCount--;
				if (!totalLockCount) document.body.classList.remove(BODY_LOCK_CLASS);
			}
		};
		const init = () => shouldLock() && lock();
		const destroy = () => shouldLock() && unlock();
		onMountedOrActivated(init);
		(0, vue.onDeactivated)(destroy);
		(0, vue.onBeforeUnmount)(destroy);
		(0, vue.watch)(shouldLock, (value) => {
			value ? lock() : unlock();
		});
	}
	function useLazyRender(show) {
		const inited = (0, vue.ref)(false);
		(0, vue.watch)(show, (value) => {
			if (value) inited.value = value;
		}, { immediate: true });
		return (render) => () => inited.value ? render() : null;
	}
	var useScopeId = () => {
		var _a;
		const { scopeId } = ((_a = (0, vue.getCurrentInstance)()) == null ? void 0 : _a.vnode) || {};
		return scopeId ? { [scopeId]: "" } : null;
	};
	var [name$26, bem$27] = createNamespace("overlay");
	var Overlay = withInstall((0, vue.defineComponent)({
		name: name$26,
		inheritAttrs: false,
		props: {
			show: Boolean,
			zIndex: numericProp,
			duration: numericProp,
			className: null,
			lockScroll: truthProp,
			lazyRender: truthProp,
			customStyle: Object,
			teleport: [String, Object]
		},
		setup(props, { attrs, slots }) {
			const root = (0, vue.ref)();
			const lazyRender = useLazyRender(() => props.show || !props.lazyRender);
			const onTouchMove = (event) => {
				if (props.lockScroll) preventDefault(event, true);
			};
			const renderOverlay = lazyRender(() => {
				var _a;
				const style = extend(getZIndexStyle(props.zIndex), props.customStyle);
				if (isDef(props.duration)) style.animationDuration = `${props.duration}s`;
				return (0, vue.withDirectives)((0, vue.createVNode)("div", (0, vue.mergeProps)({
					"ref": root,
					"style": style,
					"class": [bem$27(), props.className]
				}, attrs), [(_a = slots.default) == null ? void 0 : _a.call(slots)]), [[vue.vShow, props.show]]);
			});
			useEventListener("touchmove", onTouchMove, { target: root });
			return () => {
				const Content = (0, vue.createVNode)(vue.Transition, {
					"name": "van-fade",
					"appear": true
				}, { default: renderOverlay });
				if (props.teleport) return (0, vue.createVNode)(vue.Teleport, { "to": props.teleport }, { default: () => [Content] });
				return Content;
			};
		}
	}));
	var popupProps$1 = extend({}, popupSharedProps, {
		round: Boolean,
		position: makeStringProp("center"),
		closeIcon: makeStringProp("cross"),
		closeable: Boolean,
		transition: String,
		iconPrefix: String,
		closeOnPopstate: Boolean,
		closeIconPosition: makeStringProp("top-right"),
		destroyOnClose: Boolean,
		safeAreaInsetTop: Boolean,
		safeAreaInsetBottom: Boolean
	});
	var [name$25, bem$26] = createNamespace("popup");
	var Popup = withInstall((0, vue.defineComponent)({
		name: name$25,
		inheritAttrs: false,
		props: popupProps$1,
		emits: [
			"open",
			"close",
			"opened",
			"closed",
			"keydown",
			"update:show",
			"clickOverlay",
			"clickCloseIcon"
		],
		setup(props, { emit, attrs, slots }) {
			let opened;
			let shouldReopen;
			const zIndex = (0, vue.ref)();
			const popupRef = (0, vue.ref)();
			const lazyRender = useLazyRender(() => props.show || !props.lazyRender);
			const style = (0, vue.computed)(() => {
				const style2 = { zIndex: zIndex.value };
				if (isDef(props.duration)) {
					const key = props.position === "center" ? "animationDuration" : "transitionDuration";
					style2[key] = `${props.duration}s`;
				}
				return style2;
			});
			const open = () => {
				if (!opened) {
					opened = true;
					zIndex.value = props.zIndex !== void 0 ? +props.zIndex : useGlobalZIndex();
					emit("open");
				}
			};
			const close = () => {
				if (opened) callInterceptor(props.beforeClose, { done() {
					opened = false;
					emit("close");
					emit("update:show", false);
				} });
			};
			const onClickOverlay = (event) => {
				emit("clickOverlay", event);
				if (props.closeOnClickOverlay) close();
			};
			const renderOverlay = () => {
				if (props.overlay) {
					const overlayProps = extend({
						show: props.show,
						class: props.overlayClass,
						zIndex: zIndex.value,
						duration: props.duration,
						customStyle: props.overlayStyle,
						role: props.closeOnClickOverlay ? "button" : void 0,
						tabindex: props.closeOnClickOverlay ? 0 : void 0
					}, props.overlayProps);
					return (0, vue.createVNode)(Overlay, (0, vue.mergeProps)(overlayProps, useScopeId(), { "onClick": onClickOverlay }), { default: slots["overlay-content"] });
				}
			};
			const onClickCloseIcon = (event) => {
				emit("clickCloseIcon", event);
				close();
			};
			const renderCloseIcon = () => {
				if (props.closeable) return (0, vue.createVNode)(Icon, {
					"role": "button",
					"tabindex": 0,
					"name": props.closeIcon,
					"class": [bem$26("close-icon", props.closeIconPosition), HAPTICS_FEEDBACK],
					"classPrefix": props.iconPrefix,
					"onClick": onClickCloseIcon
				}, null);
			};
			let timer;
			const onOpened = () => {
				if (timer) clearTimeout(timer);
				timer = setTimeout(() => {
					emit("opened");
				});
			};
			const onClosed = () => emit("closed");
			const onKeydown = (event) => emit("keydown", event);
			const renderPopup = lazyRender(() => {
				var _a;
				const { destroyOnClose, round, position, safeAreaInsetTop, safeAreaInsetBottom, show } = props;
				if (!show && destroyOnClose) return;
				return (0, vue.withDirectives)((0, vue.createVNode)("div", (0, vue.mergeProps)({
					"ref": popupRef,
					"style": style.value,
					"role": "dialog",
					"tabindex": 0,
					"class": [bem$26({
						round,
						[position]: position
					}), {
						"van-safe-area-top": safeAreaInsetTop,
						"van-safe-area-bottom": safeAreaInsetBottom
					}],
					"onKeydown": onKeydown
				}, attrs, useScopeId()), [(_a = slots.default) == null ? void 0 : _a.call(slots), renderCloseIcon()]), [[vue.vShow, show]]);
			});
			const renderTransition = () => {
				const { position, transition, transitionAppear } = props;
				const name2 = position === "center" ? "van-fade" : `van-popup-slide-${position}`;
				return (0, vue.createVNode)(vue.Transition, {
					"name": transition || name2,
					"appear": transitionAppear,
					"onAfterEnter": onOpened,
					"onAfterLeave": onClosed
				}, { default: renderPopup });
			};
			(0, vue.watch)(() => props.show, (show) => {
				if (show && !opened) {
					open();
					if (attrs.tabindex === 0) (0, vue.nextTick)(() => {
						var _a;
						(_a = popupRef.value) == null || _a.focus();
					});
				}
				if (!show && opened) {
					opened = false;
					emit("close");
				}
			});
			useExpose({ popupRef });
			useLockScroll(popupRef, () => props.show && props.lockScroll);
			useEventListener("popstate", () => {
				if (props.closeOnPopstate) {
					close();
					shouldReopen = false;
				}
			});
			(0, vue.onMounted)(() => {
				if (props.show) open();
			});
			(0, vue.onActivated)(() => {
				if (shouldReopen) {
					emit("update:show", true);
					shouldReopen = false;
				}
			});
			(0, vue.onDeactivated)(() => {
				if (props.show && props.teleport) {
					close();
					shouldReopen = true;
				}
			});
			(0, vue.provide)(POPUP_TOGGLE_KEY, () => props.show);
			return () => {
				if (props.teleport) return (0, vue.createVNode)(vue.Teleport, { "to": props.teleport }, { default: () => [renderOverlay(), renderTransition()] });
				return (0, vue.createVNode)(vue.Fragment, null, [renderOverlay(), renderTransition()]);
			};
		}
	}));
	var isArray = Array.isArray;
	var isString = (val) => typeof val === "string";
	var isObject = (val) => val !== null && typeof val === "object";
	var cacheStringFunction = (fn) => {
		const cache = Object.create(null);
		return ((str) => {
			return cache[str] || (cache[str] = fn(str));
		});
	};
	var hyphenateRE = /\B([A-Z])/g;
	var hyphenate = cacheStringFunction((str) => str.replace(hyphenateRE, "-$1").toLowerCase());
	function normalizeStyle$1(value) {
		if (isArray(value)) {
			const res = {};
			for (let i = 0; i < value.length; i++) {
				const item = value[i];
				const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle$1(item);
				if (normalized) for (const key in normalized) res[key] = normalized[key];
			}
			return res;
		} else if (isString(value) || isObject(value)) return value;
	}
	var listDelimiterRE = /;(?![^(]*\))/g;
	var propertyDelimiterRE = /:([^]+)/;
	var styleCommentRE = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
	function parseStringStyle(cssText) {
		const ret = {};
		cssText.replace(styleCommentRE, (match) => match.startsWith("/*") ? "" : match).split(listDelimiterRE).forEach((item) => {
			if (item) {
				const tmp = item.split(propertyDelimiterRE);
				tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
			}
		});
		return ret;
	}
	function stringifyStyle(styles) {
		if (!styles) return "";
		if (isString(styles)) return styles;
		let ret = "";
		for (const key in styles) {
			const value = styles[key];
			if (isString(value) || typeof value === "number") {
				const normalizedKey = key.startsWith(`--`) ? key : hyphenate(key);
				ret += `${normalizedKey}:${value};`;
			}
		}
		return ret;
	}
	function normalizeClass$1(value) {
		let res = "";
		if (isString(value)) res = value;
		else if (isArray(value)) for (let i = 0; i < value.length; i++) {
			const normalized = normalizeClass$1(value[i]);
			if (normalized) res += normalized + " ";
		}
		else if (isObject(value)) {
			for (const name in value) if (value[name]) res += name + " ";
		}
		return res.trim();
	}
	function scrollLeftTo(scroller, to, duration) {
		let rafId;
		let count = 0;
		const from = scroller.scrollLeft;
		const frames = duration === 0 ? 1 : Math.round(duration * 1e3 / 16);
		let scrollLeft = from;
		function cancel() {
			cancelRaf(rafId);
		}
		function animate() {
			scrollLeft += (to - from) / frames;
			scroller.scrollLeft = scrollLeft;
			if (++count < frames) rafId = raf(animate);
		}
		animate();
		return cancel;
	}
	function scrollTopTo(scroller, to, duration, callback) {
		let rafId;
		let current = getScrollTop(scroller);
		const isDown = current < to;
		const frames = duration === 0 ? 1 : Math.round(duration * 1e3 / 16);
		const step = (to - current) / frames;
		function cancel() {
			cancelRaf(rafId);
		}
		function animate() {
			current += step;
			if (isDown && current > to || !isDown && current < to) current = to;
			setScrollTop(scroller, current);
			if (isDown && current < to || !isDown && current > to) rafId = raf(animate);
			else if (callback) rafId = raf(callback);
		}
		animate();
		return cancel;
	}
	var current = 0;
	function useId() {
		const vm = (0, vue.getCurrentInstance)();
		const { name = "unknown" } = (vm == null ? void 0 : vm.type) || {};
		return `${name}-${++current}`;
	}
	function useRefs() {
		const refs = (0, vue.ref)([]);
		const cache = [];
		(0, vue.onBeforeUpdate)(() => {
			refs.value = [];
		});
		const setRefs = (index) => {
			if (!cache[index]) cache[index] = (el) => {
				refs.value[index] = el;
			};
			return cache[index];
		};
		return [refs, setRefs];
	}
	function useVisibilityChange(target, onChange) {
		if (!inBrowser$1 || !window.IntersectionObserver) return;
		const observer = new IntersectionObserver((entries) => {
			onChange(entries[0].intersectionRatio > 0);
		}, { root: document.body });
		const observe = () => {
			if (target.value) observer.observe(target.value);
		};
		const unobserve = () => {
			if (target.value) observer.unobserve(target.value);
		};
		(0, vue.onDeactivated)(unobserve);
		(0, vue.onBeforeUnmount)(unobserve);
		onMountedOrActivated(observe);
	}
	var [name$24, bem$25] = createNamespace("sticky");
	var stickyProps = {
		zIndex: numericProp,
		position: makeStringProp("top"),
		container: Object,
		offsetTop: makeNumericProp(0),
		offsetBottom: makeNumericProp(0)
	};
	var Sticky = withInstall((0, vue.defineComponent)({
		name: name$24,
		props: stickyProps,
		emits: ["scroll", "change"],
		setup(props, { emit, slots }) {
			const root = (0, vue.ref)();
			const scrollParent = useScrollParent(root);
			const state = (0, vue.reactive)({
				fixed: false,
				width: 0,
				height: 0,
				transform: 0
			});
			const isReset = (0, vue.ref)(false);
			const offset = (0, vue.computed)(() => unitToPx(props.position === "top" ? props.offsetTop : props.offsetBottom));
			const rootStyle = (0, vue.computed)(() => {
				if (isReset.value) return;
				const { fixed, height, width } = state;
				if (fixed) return {
					width: `${width}px`,
					height: `${height}px`
				};
			});
			const stickyStyle = (0, vue.computed)(() => {
				if (!state.fixed || isReset.value) return;
				const style = extend(getZIndexStyle(props.zIndex), {
					width: `${state.width}px`,
					height: `${state.height}px`,
					[props.position]: `${offset.value}px`
				});
				if (state.transform) style.transform = `translate3d(0, ${state.transform}px, 0)`;
				return style;
			});
			const emitScroll = (scrollTop) => emit("scroll", {
				scrollTop,
				isFixed: state.fixed
			});
			const onScroll = () => {
				if (!root.value || isHidden(root)) return;
				const { container, position } = props;
				const rootRect = useRect(root);
				const scrollTop = getScrollTop(window);
				state.width = rootRect.width;
				state.height = rootRect.height;
				if (position === "top") {
					if (container) {
						const containerRect = useRect(container);
						const difference = containerRect.bottom - offset.value - state.height;
						state.fixed = offset.value > rootRect.top && containerRect.bottom > 0;
						state.transform = difference < 0 ? difference : 0;
					} else state.fixed = offset.value > rootRect.top;
				} else {
					const { clientHeight } = document.documentElement;
					if (container) {
						const containerRect = useRect(container);
						const difference = clientHeight - containerRect.top - offset.value - state.height;
						state.fixed = clientHeight - offset.value < rootRect.bottom && clientHeight > containerRect.top;
						state.transform = difference < 0 ? -difference : 0;
					} else state.fixed = clientHeight - offset.value < rootRect.bottom;
				}
				emitScroll(scrollTop);
			};
			(0, vue.watch)(() => state.fixed, (value) => emit("change", value));
			useEventListener("scroll", onScroll, {
				target: scrollParent,
				passive: true
			});
			useVisibilityChange(root, onScroll);
			(0, vue.watch)([windowWidth, windowHeight], () => {
				if (!root.value || isHidden(root) || !state.fixed) return;
				isReset.value = true;
				(0, vue.nextTick)(() => {
					const rootRect = useRect(root);
					state.width = rootRect.width;
					state.height = rootRect.height;
					isReset.value = false;
				});
			});
			return () => {
				var _a;
				return (0, vue.createVNode)("div", {
					"ref": root,
					"style": rootStyle.value
				}, [(0, vue.createVNode)("div", {
					"class": bem$25({ fixed: state.fixed && !isReset.value }),
					"style": stickyStyle.value
				}, [(_a = slots.default) == null ? void 0 : _a.call(slots)])]);
			};
		}
	}));
	var [name$23, bem$24] = createNamespace("swipe");
	var swipeProps = {
		loop: truthProp,
		width: numericProp,
		height: numericProp,
		vertical: Boolean,
		autoplay: makeNumericProp(0),
		duration: makeNumericProp(500),
		touchable: truthProp,
		lazyRender: Boolean,
		initialSwipe: makeNumericProp(0),
		indicatorColor: String,
		showIndicators: truthProp,
		stopPropagation: truthProp
	};
	var SWIPE_KEY = Symbol(name$23);
	var Swipe = withInstall((0, vue.defineComponent)({
		name: name$23,
		props: swipeProps,
		emits: [
			"change",
			"dragStart",
			"dragEnd"
		],
		setup(props, { emit, slots }) {
			const root = (0, vue.ref)();
			const track = (0, vue.ref)();
			const state = (0, vue.reactive)({
				rect: null,
				width: 0,
				height: 0,
				offset: 0,
				active: 0,
				swiping: false
			});
			let dragging = false;
			const touch = useTouch();
			const { children, linkChildren } = useChildren(SWIPE_KEY);
			const count = (0, vue.computed)(() => children.length);
			const size = (0, vue.computed)(() => state[props.vertical ? "height" : "width"]);
			const delta = (0, vue.computed)(() => props.vertical ? touch.deltaY.value : touch.deltaX.value);
			const minOffset = (0, vue.computed)(() => {
				if (state.rect) return (props.vertical ? state.rect.height : state.rect.width) - size.value * count.value;
				return 0;
			});
			const maxCount = (0, vue.computed)(() => size.value ? Math.ceil(Math.abs(minOffset.value) / size.value) : count.value);
			const trackSize = (0, vue.computed)(() => count.value * size.value);
			const activeIndicator = (0, vue.computed)(() => (state.active + count.value) % count.value);
			const isCorrectDirection = (0, vue.computed)(() => {
				const expect = props.vertical ? "vertical" : "horizontal";
				return touch.direction.value === expect;
			});
			const trackStyle = (0, vue.computed)(() => {
				const style = {
					transitionDuration: `${state.swiping ? 0 : props.duration}ms`,
					transform: `translate${props.vertical ? "Y" : "X"}(${+state.offset.toFixed(2)}px)`
				};
				if (size.value) {
					const mainAxis = props.vertical ? "height" : "width";
					const crossAxis = props.vertical ? "width" : "height";
					style[mainAxis] = `${trackSize.value}px`;
					style[crossAxis] = props[crossAxis] ? `${props[crossAxis]}px` : "";
				}
				return style;
			});
			const getTargetActive = (pace) => {
				const { active } = state;
				if (pace) {
					if (props.loop) return clamp(active + pace, -1, count.value);
					return clamp(active + pace, 0, maxCount.value);
				}
				return active;
			};
			const getTargetOffset = (targetActive, offset = 0) => {
				let currentPosition = targetActive * size.value;
				if (!props.loop) currentPosition = Math.min(currentPosition, -minOffset.value);
				let targetOffset = offset - currentPosition;
				if (!props.loop) targetOffset = clamp(targetOffset, minOffset.value, 0);
				return targetOffset;
			};
			const move = ({ pace = 0, offset = 0, emitChange }) => {
				if (count.value <= 1) return;
				const { active } = state;
				const targetActive = getTargetActive(pace);
				const targetOffset = getTargetOffset(targetActive, offset);
				if (props.loop) {
					if (children[0] && targetOffset !== minOffset.value) {
						const outRightBound = targetOffset < minOffset.value;
						children[0].setOffset(outRightBound ? trackSize.value : 0);
					}
					if (children[count.value - 1] && targetOffset !== 0) {
						const outLeftBound = targetOffset > 0;
						children[count.value - 1].setOffset(outLeftBound ? -trackSize.value : 0);
					}
				}
				state.active = targetActive;
				state.offset = targetOffset;
				if (emitChange && targetActive !== active) emit("change", activeIndicator.value);
			};
			const correctPosition = () => {
				state.swiping = true;
				if (state.active <= -1) move({ pace: count.value });
				else if (state.active >= count.value) move({ pace: -count.value });
			};
			const prev = () => {
				correctPosition();
				touch.reset();
				doubleRaf(() => {
					state.swiping = false;
					move({
						pace: -1,
						emitChange: true
					});
				});
			};
			const next = () => {
				correctPosition();
				touch.reset();
				doubleRaf(() => {
					state.swiping = false;
					move({
						pace: 1,
						emitChange: true
					});
				});
			};
			let autoplayTimer;
			const stopAutoplay = () => clearTimeout(autoplayTimer);
			const autoplay = () => {
				stopAutoplay();
				if (+props.autoplay > 0 && count.value > 1) autoplayTimer = setTimeout(() => {
					next();
					autoplay();
				}, +props.autoplay);
			};
			const initialize = (active = +props.initialSwipe) => {
				if (!root.value) return;
				const cb = () => {
					var _a, _b;
					if (!isHidden(root)) {
						const rect = {
							width: root.value.offsetWidth,
							height: root.value.offsetHeight
						};
						state.rect = rect;
						state.width = +((_a = props.width) != null ? _a : rect.width);
						state.height = +((_b = props.height) != null ? _b : rect.height);
					}
					if (count.value) {
						active = Math.min(count.value - 1, active);
						if (active === -1) active = count.value - 1;
					}
					state.active = active;
					state.swiping = true;
					state.offset = getTargetOffset(active);
					children.forEach((swipe) => {
						swipe.setOffset(0);
					});
					autoplay();
				};
				if (isHidden(root)) (0, vue.nextTick)().then(cb);
				else cb();
			};
			const resize = () => initialize(state.active);
			let touchStartTime;
			const onTouchStart = (event) => {
				if (!props.touchable || event.touches.length > 1) return;
				touch.start(event);
				dragging = false;
				touchStartTime = Date.now();
				stopAutoplay();
				correctPosition();
			};
			const onTouchMove = (event) => {
				if (props.touchable && state.swiping) {
					touch.move(event);
					if (isCorrectDirection.value) {
						if (!(!props.loop && (state.active === 0 && delta.value > 0 || state.active === count.value - 1 && delta.value < 0))) {
							preventDefault(event, props.stopPropagation);
							move({ offset: delta.value });
							if (!dragging) {
								emit("dragStart", { index: activeIndicator.value });
								dragging = true;
							}
						}
					}
				}
			};
			const onTouchEnd = () => {
				if (!props.touchable || !state.swiping) return;
				const duration = Date.now() - touchStartTime;
				const speed = delta.value / duration;
				if ((Math.abs(speed) > .25 || Math.abs(delta.value) > size.value / 2) && isCorrectDirection.value) {
					const offset = props.vertical ? touch.offsetY.value : touch.offsetX.value;
					let pace = 0;
					if (props.loop) pace = offset > 0 ? delta.value > 0 ? -1 : 1 : 0;
					else pace = -Math[delta.value > 0 ? "ceil" : "floor"](delta.value / size.value);
					move({
						pace,
						emitChange: true
					});
				} else if (delta.value) move({ pace: 0 });
				dragging = false;
				state.swiping = false;
				emit("dragEnd", { index: activeIndicator.value });
				autoplay();
			};
			const swipeTo = (index, options = {}) => {
				correctPosition();
				touch.reset();
				doubleRaf(() => {
					let targetIndex;
					if (props.loop && index === count.value) targetIndex = state.active === 0 ? 0 : index;
					else targetIndex = index % count.value;
					if (options.immediate) doubleRaf(() => {
						state.swiping = false;
					});
					else state.swiping = false;
					move({
						pace: targetIndex - state.active,
						emitChange: true
					});
				});
			};
			const renderDot = (_, index) => {
				const active = index === activeIndicator.value;
				const style = active ? { backgroundColor: props.indicatorColor } : void 0;
				return (0, vue.createVNode)("i", {
					"style": style,
					"class": bem$24("indicator", { active })
				}, null);
			};
			const renderIndicator = () => {
				if (slots.indicator) return slots.indicator({
					active: activeIndicator.value,
					total: count.value
				});
				if (props.showIndicators && count.value > 1) return (0, vue.createVNode)("div", { "class": bem$24("indicators", { vertical: props.vertical }) }, [Array(count.value).fill("").map(renderDot)]);
			};
			useExpose({
				prev,
				next,
				state,
				resize,
				swipeTo
			});
			linkChildren({
				size,
				props,
				count,
				activeIndicator
			});
			(0, vue.watch)(() => props.initialSwipe, (value) => initialize(+value));
			(0, vue.watch)(count, () => initialize(state.active));
			(0, vue.watch)(() => props.autoplay, autoplay);
			(0, vue.watch)([
				windowWidth,
				windowHeight,
				() => props.width,
				() => props.height
			], resize);
			(0, vue.watch)(usePageVisibility(), (visible) => {
				if (visible === "visible") autoplay();
				else stopAutoplay();
			});
			(0, vue.onMounted)(initialize);
			(0, vue.onActivated)(() => initialize(state.active));
			onPopupReopen(() => initialize(state.active));
			(0, vue.onDeactivated)(stopAutoplay);
			(0, vue.onBeforeUnmount)(stopAutoplay);
			useEventListener("touchmove", onTouchMove, { target: track });
			return () => {
				var _a;
				return (0, vue.createVNode)("div", {
					"ref": root,
					"class": bem$24()
				}, [(0, vue.createVNode)("div", {
					"ref": track,
					"style": trackStyle.value,
					"class": bem$24("track", { vertical: props.vertical }),
					"onTouchstartPassive": onTouchStart,
					"onTouchend": onTouchEnd,
					"onTouchcancel": onTouchEnd
				}, [(_a = slots.default) == null ? void 0 : _a.call(slots)]), renderIndicator()]);
			};
		}
	}));
	var [name$22, bem$23] = createNamespace("tabs");
	var stdin_default$24 = (0, vue.defineComponent)({
		name: name$22,
		props: {
			count: makeRequiredProp(Number),
			inited: Boolean,
			animated: Boolean,
			duration: makeRequiredProp(numericProp),
			swipeable: Boolean,
			lazyRender: Boolean,
			currentIndex: makeRequiredProp(Number)
		},
		emits: ["change"],
		setup(props, { emit, slots }) {
			const swipeRef = (0, vue.ref)();
			const onChange = (index) => emit("change", index);
			const renderChildren = () => {
				var _a;
				const Content = (_a = slots.default) == null ? void 0 : _a.call(slots);
				if (props.animated || props.swipeable) return (0, vue.createVNode)(Swipe, {
					"ref": swipeRef,
					"loop": false,
					"class": bem$23("track"),
					"duration": +props.duration * 1e3,
					"touchable": props.swipeable,
					"lazyRender": props.lazyRender,
					"showIndicators": false,
					"onChange": onChange
				}, { default: () => [Content] });
				return Content;
			};
			const swipeToCurrentTab = (index) => {
				const swipe = swipeRef.value;
				if (swipe && swipe.state.active !== index) swipe.swipeTo(index, { immediate: !props.inited });
			};
			(0, vue.watch)(() => props.currentIndex, swipeToCurrentTab);
			(0, vue.onMounted)(() => {
				swipeToCurrentTab(props.currentIndex);
			});
			useExpose({ swipeRef });
			return () => (0, vue.createVNode)("div", { "class": bem$23("content", { animated: props.animated || props.swipeable }) }, [renderChildren()]);
		}
	});
	var [name$21, bem$22] = createNamespace("tabs");
	var tabsProps = {
		type: makeStringProp("line"),
		color: String,
		border: Boolean,
		sticky: Boolean,
		shrink: Boolean,
		active: makeNumericProp(0),
		duration: makeNumericProp(.3),
		animated: Boolean,
		ellipsis: truthProp,
		swipeable: Boolean,
		scrollspy: Boolean,
		offsetTop: makeNumericProp(0),
		background: String,
		lazyRender: truthProp,
		showHeader: truthProp,
		lineWidth: numericProp,
		lineHeight: numericProp,
		beforeChange: Function,
		swipeThreshold: makeNumericProp(5),
		titleActiveColor: String,
		titleInactiveColor: String
	};
	var TABS_KEY = Symbol(name$21);
	var stdin_default$23 = (0, vue.defineComponent)({
		name: name$21,
		props: tabsProps,
		emits: [
			"change",
			"scroll",
			"rendered",
			"clickTab",
			"update:active"
		],
		setup(props, { emit, slots }) {
			let tabHeight;
			let lockScroll;
			let stickyFixed;
			let cancelScrollLeftToRaf;
			let cancelScrollTopToRaf;
			const root = (0, vue.ref)();
			const navRef = (0, vue.ref)();
			const wrapRef = (0, vue.ref)();
			const contentRef = (0, vue.ref)();
			const id = useId();
			const scroller = useScrollParent(root);
			const [titleRefs, setTitleRefs] = useRefs();
			const { children, linkChildren } = useChildren(TABS_KEY);
			const state = (0, vue.reactive)({
				inited: false,
				position: "",
				lineStyle: {},
				currentIndex: -1
			});
			const scrollable = (0, vue.computed)(() => children.length > +props.swipeThreshold || !props.ellipsis || props.shrink);
			const navStyle = (0, vue.computed)(() => ({
				borderColor: props.color,
				background: props.background
			}));
			const getTabName = (tab, index) => {
				var _a;
				return (_a = tab.name) != null ? _a : index;
			};
			const currentName = (0, vue.computed)(() => {
				const activeTab = children[state.currentIndex];
				if (activeTab) return getTabName(activeTab, state.currentIndex);
			});
			const offsetTopPx = (0, vue.computed)(() => unitToPx(props.offsetTop));
			const scrollOffset = (0, vue.computed)(() => {
				if (props.sticky) return offsetTopPx.value + tabHeight;
				return 0;
			});
			const scrollIntoView = (immediate) => {
				const nav = navRef.value;
				const titles = titleRefs.value;
				if (!scrollable.value || !nav || !titles || !titles[state.currentIndex]) return;
				const title = titles[state.currentIndex].$el;
				const to = title.offsetLeft - (nav.offsetWidth - title.offsetWidth) / 2;
				if (cancelScrollLeftToRaf) cancelScrollLeftToRaf();
				cancelScrollLeftToRaf = scrollLeftTo(nav, to, immediate ? 0 : +props.duration);
			};
			const setLine = () => {
				const shouldAnimate = state.inited;
				(0, vue.nextTick)(() => {
					const titles = titleRefs.value;
					if (!titles || !titles[state.currentIndex] || props.type !== "line" || isHidden(root.value)) return;
					const title = titles[state.currentIndex].$el;
					const { lineWidth, lineHeight } = props;
					const left = title.offsetLeft + title.offsetWidth / 2;
					const lineStyle = {
						width: addUnit(lineWidth),
						backgroundColor: props.color,
						transform: `translateX(${left}px) translateX(-50%)`
					};
					if (shouldAnimate) lineStyle.transitionDuration = `${props.duration}s`;
					if (isDef(lineHeight)) {
						const height = addUnit(lineHeight);
						lineStyle.height = height;
						lineStyle.borderRadius = height;
					}
					state.lineStyle = lineStyle;
				});
			};
			const findAvailableTab = (index) => {
				const diff = index < state.currentIndex ? -1 : 1;
				while (index >= 0 && index < children.length) {
					if (!children[index].disabled) return index;
					index += diff;
				}
			};
			const setCurrentIndex = (currentIndex, skipScrollIntoView) => {
				const newIndex = findAvailableTab(currentIndex);
				if (!isDef(newIndex)) return;
				const newTab = children[newIndex];
				const newName = getTabName(newTab, newIndex);
				const shouldEmitChange = state.currentIndex !== null;
				if (state.currentIndex !== newIndex) {
					state.currentIndex = newIndex;
					if (!skipScrollIntoView) scrollIntoView();
					setLine();
				}
				if (newName !== props.active) {
					emit("update:active", newName);
					if (shouldEmitChange) emit("change", newName, newTab.title);
				}
				if (stickyFixed && !props.scrollspy) setRootScrollTop(Math.ceil(getElementTop(root.value) - offsetTopPx.value));
			};
			const setCurrentIndexByName = (name2, skipScrollIntoView) => {
				const index = children.findIndex((tab, index2) => getTabName(tab, index2) === name2);
				setCurrentIndex(index === -1 ? 0 : index, skipScrollIntoView);
			};
			const scrollToCurrentContent = (immediate = false) => {
				if (props.scrollspy) {
					const target = children[state.currentIndex].$el;
					if (target && scroller.value) {
						const to = getElementTop(target, scroller.value) - scrollOffset.value;
						lockScroll = true;
						if (cancelScrollTopToRaf) cancelScrollTopToRaf();
						cancelScrollTopToRaf = scrollTopTo(scroller.value, to, immediate ? 0 : +props.duration, () => {
							lockScroll = false;
						});
					}
				}
			};
			const onClickTab = (item, index, event) => {
				const { title, disabled } = children[index];
				const name2 = getTabName(children[index], index);
				if (!disabled) {
					callInterceptor(props.beforeChange, {
						args: [name2],
						done: () => {
							setCurrentIndex(index);
							scrollToCurrentContent();
						}
					});
					route(item);
				}
				emit("clickTab", {
					name: name2,
					title,
					event,
					disabled
				});
			};
			const onStickyScroll = (params) => {
				stickyFixed = params.isFixed;
				emit("scroll", params);
			};
			const scrollTo = (name2) => {
				(0, vue.nextTick)(() => {
					setCurrentIndexByName(name2);
					scrollToCurrentContent(true);
				});
			};
			const getCurrentIndexOnScroll = () => {
				for (let index = 0; index < children.length; index++) {
					const { top } = useRect(children[index].$el);
					if (top > scrollOffset.value) return index === 0 ? 0 : index - 1;
				}
				return children.length - 1;
			};
			const onScroll = () => {
				if (props.scrollspy && !lockScroll) {
					const index = getCurrentIndexOnScroll();
					setCurrentIndex(index);
				}
			};
			const renderLine = () => {
				if (props.type === "line" && children.length) return (0, vue.createVNode)("div", {
					"class": bem$22("line"),
					"style": state.lineStyle
				}, null);
			};
			const renderHeader = () => {
				var _a, _b, _c;
				const { type, border, sticky } = props;
				const Header = [(0, vue.createVNode)("div", {
					"ref": sticky ? void 0 : wrapRef,
					"class": [bem$22("wrap"), { [BORDER_TOP_BOTTOM]: type === "line" && border }]
				}, [(0, vue.createVNode)("div", {
					"ref": navRef,
					"role": "tablist",
					"class": bem$22("nav", [type, {
						shrink: props.shrink,
						complete: scrollable.value
					}]),
					"style": navStyle.value,
					"aria-orientation": "horizontal"
				}, [
					(_a = slots["nav-left"]) == null ? void 0 : _a.call(slots),
					children.map((item) => item.renderTitle(onClickTab)),
					renderLine(),
					(_b = slots["nav-right"]) == null ? void 0 : _b.call(slots)
				])]), (_c = slots["nav-bottom"]) == null ? void 0 : _c.call(slots)];
				if (sticky) return (0, vue.createVNode)("div", { "ref": wrapRef }, [Header]);
				return Header;
			};
			const resize = () => {
				setLine();
				(0, vue.nextTick)(() => {
					var _a, _b;
					scrollIntoView(true);
					(_b = (_a = contentRef.value) == null ? void 0 : _a.swipeRef.value) == null || _b.resize();
				});
			};
			(0, vue.watch)(() => [
				props.color,
				props.duration,
				props.lineWidth,
				props.lineHeight
			], setLine);
			(0, vue.watch)(windowWidth, resize);
			(0, vue.watch)(() => props.active, (value) => {
				if (value !== currentName.value) setCurrentIndexByName(value);
			});
			(0, vue.watch)(() => children.length, () => {
				if (state.inited) {
					setCurrentIndexByName(props.active);
					setLine();
					(0, vue.nextTick)(() => {
						scrollIntoView(true);
					});
				}
			});
			const init = () => {
				setCurrentIndexByName(props.active, true);
				(0, vue.nextTick)(() => {
					state.inited = true;
					if (wrapRef.value) tabHeight = useRect(wrapRef.value).height;
					scrollIntoView(true);
				});
			};
			const onRendered = (name2, title) => emit("rendered", name2, title);
			useExpose({
				resize,
				scrollTo
			});
			(0, vue.onActivated)(setLine);
			onPopupReopen(setLine);
			onMountedOrActivated(init);
			useVisibilityChange(root, setLine);
			useEventListener("scroll", onScroll, {
				target: scroller,
				passive: true
			});
			linkChildren({
				id,
				props,
				setLine,
				scrollable,
				onRendered,
				currentName,
				setTitleRefs,
				scrollIntoView
			});
			return () => (0, vue.createVNode)("div", {
				"ref": root,
				"class": bem$22([props.type])
			}, [props.showHeader ? props.sticky ? (0, vue.createVNode)(Sticky, {
				"container": root.value,
				"offsetTop": offsetTopPx.value,
				"onScroll": onStickyScroll
			}, { default: () => [renderHeader()] }) : renderHeader() : null, (0, vue.createVNode)(stdin_default$24, {
				"ref": contentRef,
				"count": children.length,
				"inited": state.inited,
				"animated": props.animated,
				"duration": props.duration,
				"swipeable": props.swipeable,
				"lazyRender": props.lazyRender,
				"currentIndex": state.currentIndex,
				"onChange": setCurrentIndex
			}, { default: () => {
				var _a;
				return [(_a = slots.default) == null ? void 0 : _a.call(slots)];
			} })]);
		}
	});
	var TAB_STATUS_KEY = Symbol();
	var ALL_TAB_STATUS_KEY = Symbol();
	var useAllTabStatus = () => (0, vue.inject)(ALL_TAB_STATUS_KEY, null);
	var useProvideTabStatus = (status) => {
		const allTabStatus = useAllTabStatus();
		(0, vue.provide)(TAB_STATUS_KEY, status);
		(0, vue.provide)(ALL_TAB_STATUS_KEY, (0, vue.computed)(() => {
			return (allTabStatus == null || allTabStatus.value) && status.value;
		}));
	};
	var [name$20, bem$21] = createNamespace("tab");
	var TabTitle = (0, vue.defineComponent)({
		name: name$20,
		props: {
			id: String,
			dot: Boolean,
			type: String,
			color: String,
			title: String,
			badge: numericProp,
			shrink: Boolean,
			isActive: Boolean,
			disabled: Boolean,
			controls: String,
			scrollable: Boolean,
			activeColor: String,
			inactiveColor: String,
			showZeroBadge: truthProp
		},
		setup(props, { slots }) {
			const style = (0, vue.computed)(() => {
				const style2 = {};
				const { type, color, disabled, isActive, activeColor, inactiveColor } = props;
				if (color && type === "card") {
					style2.borderColor = color;
					if (!disabled) {
						if (isActive) style2.backgroundColor = color;
						else style2.color = color;
					}
				}
				const titleColor = isActive ? activeColor : inactiveColor;
				if (titleColor) style2.color = titleColor;
				return style2;
			});
			const renderText = () => {
				const Text = (0, vue.createVNode)("span", { "class": bem$21("text", { ellipsis: !props.scrollable }) }, [slots.title ? slots.title() : props.title]);
				if (props.dot || isDef(props.badge) && props.badge !== "") return (0, vue.createVNode)(Badge, {
					"dot": props.dot,
					"content": props.badge,
					"showZero": props.showZeroBadge
				}, { default: () => [Text] });
				return Text;
			};
			return () => (0, vue.createVNode)("div", {
				"id": props.id,
				"role": "tab",
				"class": [bem$21([props.type, {
					grow: props.scrollable && !props.shrink,
					shrink: props.shrink,
					active: props.isActive,
					disabled: props.disabled
				}])],
				"style": style.value,
				"tabindex": props.disabled ? void 0 : props.isActive ? 0 : -1,
				"aria-selected": props.isActive,
				"aria-disabled": props.disabled || void 0,
				"aria-controls": props.controls,
				"data-allow-mismatch": "attribute"
			}, [renderText()]);
		}
	});
	var [name$19, bem$20] = createNamespace("swipe-item");
	var SwipeItem = withInstall((0, vue.defineComponent)({
		name: name$19,
		setup(props, { slots }) {
			let rendered;
			const state = (0, vue.reactive)({
				offset: 0,
				inited: false,
				mounted: false
			});
			const { parent, index } = useParent(SWIPE_KEY);
			if (!parent) return;
			const style = (0, vue.computed)(() => {
				const style2 = {};
				const { vertical } = parent.props;
				if (parent.size.value) style2[vertical ? "height" : "width"] = `${parent.size.value}px`;
				if (state.offset) style2.transform = `translate${vertical ? "Y" : "X"}(${state.offset}px)`;
				return style2;
			});
			const shouldRender = (0, vue.computed)(() => {
				const { loop, lazyRender } = parent.props;
				if (!lazyRender || rendered) return true;
				if (!state.mounted) return false;
				const active = parent.activeIndicator.value;
				const maxActive = parent.count.value - 1;
				const prevActive = active === 0 && loop ? maxActive : active - 1;
				const nextActive = active === maxActive && loop ? 0 : active + 1;
				rendered = index.value === active || index.value === prevActive || index.value === nextActive;
				return rendered;
			});
			const setOffset = (offset) => {
				state.offset = offset;
			};
			(0, vue.onMounted)(() => {
				(0, vue.nextTick)(() => {
					state.mounted = true;
				});
			});
			useExpose({ setOffset });
			return () => {
				var _a;
				return (0, vue.createVNode)("div", {
					"class": bem$20(),
					"style": style.value
				}, [shouldRender.value ? (_a = slots.default) == null ? void 0 : _a.call(slots) : null]);
			};
		}
	}));
	var [name$18, bem$19] = createNamespace("tab");
	var tabProps = extend({}, routeProps, {
		dot: Boolean,
		name: numericProp,
		badge: numericProp,
		title: String,
		disabled: Boolean,
		titleClass: null,
		titleStyle: [String, Object],
		showZeroBadge: truthProp
	});
	var Tab = withInstall((0, vue.defineComponent)({
		name: name$18,
		props: tabProps,
		setup(props, { slots }) {
			const id = useId();
			const inited = (0, vue.ref)(false);
			const instance = (0, vue.getCurrentInstance)();
			const { parent, index } = useParent(TABS_KEY);
			if (!parent) return;
			const getName = () => {
				var _a;
				return (_a = props.name) != null ? _a : index.value;
			};
			const init = () => {
				inited.value = true;
				if (parent.props.lazyRender) (0, vue.nextTick)(() => {
					parent.onRendered(getName(), props.title);
				});
			};
			const active = (0, vue.computed)(() => {
				const isActive = getName() === parent.currentName.value;
				if (isActive && !inited.value) init();
				return isActive;
			});
			const parsedClass = (0, vue.ref)("");
			const parsedStyle = (0, vue.ref)("");
			(0, vue.watchEffect)(() => {
				const { titleClass, titleStyle } = props;
				parsedClass.value = titleClass ? normalizeClass$1(titleClass) : "";
				parsedStyle.value = titleStyle && typeof titleStyle !== "string" ? stringifyStyle(normalizeStyle$1(titleStyle)) : titleStyle;
			});
			const renderTitle = (onClickTab) => (0, vue.createVNode)(TabTitle, (0, vue.mergeProps)({
				"key": id,
				"id": `${parent.id}-${index.value}`,
				"ref": parent.setTitleRefs(index.value),
				"style": parsedStyle.value,
				"class": parsedClass.value,
				"isActive": active.value,
				"controls": id,
				"scrollable": parent.scrollable.value,
				"activeColor": parent.props.titleActiveColor,
				"inactiveColor": parent.props.titleInactiveColor,
				"onClick": (event) => onClickTab(instance.proxy, index.value, event)
			}, pick(parent.props, [
				"type",
				"color",
				"shrink"
			]), pick(props, [
				"dot",
				"badge",
				"title",
				"disabled",
				"showZeroBadge"
			])), { title: slots.title });
			const hasInactiveClass = (0, vue.ref)(!active.value);
			(0, vue.watch)(active, (val) => {
				if (val) hasInactiveClass.value = false;
				else doubleRaf(() => {
					hasInactiveClass.value = true;
				});
			});
			(0, vue.watch)(() => props.title, () => {
				parent.setLine();
				parent.scrollIntoView();
			});
			useProvideTabStatus(active);
			useExpose({
				id,
				renderTitle
			});
			return () => {
				var _a;
				const label = `${parent.id}-${index.value}`;
				const { animated, swipeable, scrollspy, lazyRender } = parent.props;
				if (!slots.default && !animated) return;
				const show = scrollspy || active.value;
				if (animated || swipeable) return (0, vue.createVNode)(SwipeItem, {
					"id": id,
					"role": "tabpanel",
					"class": bem$19("panel-wrapper", { inactive: hasInactiveClass.value }),
					"tabindex": active.value ? 0 : -1,
					"aria-hidden": !active.value,
					"aria-labelledby": label,
					"data-allow-mismatch": "attribute"
				}, { default: () => {
					var _a2;
					return [(0, vue.createVNode)("div", { "class": bem$19("panel") }, [(_a2 = slots.default) == null ? void 0 : _a2.call(slots)])];
				} });
				const Content = inited.value || scrollspy || !lazyRender ? (_a = slots.default) == null ? void 0 : _a.call(slots) : null;
				return (0, vue.withDirectives)((0, vue.createVNode)("div", {
					"id": id,
					"role": "tabpanel",
					"class": bem$19("panel"),
					"tabindex": show ? 0 : -1,
					"aria-labelledby": label,
					"data-allow-mismatch": "attribute"
				}, [Content]), [[vue.vShow, show]]);
			};
		}
	}));
	var Tabs = withInstall(stdin_default$23);
	var [name$17, bem$18] = createNamespace("cell");
	var cellSharedProps = {
		tag: makeStringProp("div"),
		icon: String,
		size: String,
		title: numericProp,
		value: numericProp,
		label: numericProp,
		center: Boolean,
		isLink: Boolean,
		border: truthProp,
		iconPrefix: String,
		valueClass: null,
		labelClass: null,
		titleClass: null,
		titleStyle: null,
		arrowDirection: String,
		required: {
			type: [Boolean, String],
			default: null
		},
		clickable: {
			type: Boolean,
			default: null
		}
	};
	var cellProps = extend({}, cellSharedProps, routeProps);
	var Cell = withInstall((0, vue.defineComponent)({
		name: name$17,
		props: cellProps,
		setup(props, { slots }) {
			const route = useRoute();
			const renderLabel = () => {
				if (slots.label || isDef(props.label)) return (0, vue.createVNode)("div", { "class": [bem$18("label"), props.labelClass] }, [slots.label ? slots.label() : props.label]);
			};
			const renderTitle = () => {
				var _a;
				if (slots.title || isDef(props.title)) {
					const titleSlot = (_a = slots.title) == null ? void 0 : _a.call(slots);
					if (Array.isArray(titleSlot) && titleSlot.length === 0) return;
					return (0, vue.createVNode)("div", {
						"class": [bem$18("title"), props.titleClass],
						"style": props.titleStyle
					}, [titleSlot || (0, vue.createVNode)("span", null, [props.title]), renderLabel()]);
				}
			};
			const renderValue = () => {
				const slot = slots.value || slots.default;
				if (slot || isDef(props.value)) return (0, vue.createVNode)("div", { "class": [bem$18("value"), props.valueClass] }, [slot ? slot() : (0, vue.createVNode)("span", null, [props.value])]);
			};
			const renderLeftIcon = () => {
				if (slots.icon) return slots.icon();
				if (props.icon) return (0, vue.createVNode)(Icon, {
					"name": props.icon,
					"class": bem$18("left-icon"),
					"classPrefix": props.iconPrefix
				}, null);
			};
			const renderRightIcon = () => {
				if (slots["right-icon"]) return slots["right-icon"]();
				if (props.isLink) {
					const name2 = props.arrowDirection && props.arrowDirection !== "right" ? `arrow-${props.arrowDirection}` : "arrow";
					return (0, vue.createVNode)(Icon, {
						"name": name2,
						"class": bem$18("right-icon")
					}, null);
				}
			};
			return () => {
				var _a, _b, _c;
				const { tag, size, center, border, isLink, required } = props;
				const clickable = Boolean((_c = (_b = (_a = props.clickable) != null ? _a : props.to) != null ? _b : props.url) != null ? _c : isLink);
				const classes = {
					center,
					required: !!required,
					clickable,
					borderless: !border
				};
				if (size) classes[size] = !!size;
				return (0, vue.createVNode)(tag, {
					"class": bem$18(classes),
					"role": clickable ? "button" : void 0,
					"tabindex": clickable ? 0 : void 0,
					"onClick": clickable ? route : void 0
				}, { default: () => {
					var _a2;
					return [
						renderLeftIcon(),
						renderTitle(),
						renderValue(),
						renderRightIcon(),
						(_a2 = slots.extra) == null ? void 0 : _a2.call(slots)
					];
				} });
			};
		}
	}));
	function isEmptyValue(value) {
		if (Array.isArray(value)) return !value.length;
		if (value === 0) return false;
		return !value;
	}
	function runSyncRule(value, rule) {
		if (isEmptyValue(value)) {
			if (rule.required) return false;
			if (rule.validateEmpty === false) return true;
		}
		if (rule.pattern && !rule.pattern.test(String(value))) return false;
		return true;
	}
	function runRuleValidator(value, rule) {
		return new Promise((resolve) => {
			const returnVal = rule.validator(value, rule);
			if (isPromise(returnVal)) {
				returnVal.then(resolve);
				return;
			}
			resolve(returnVal);
		});
	}
	function getRuleMessage(value, rule) {
		const { message } = rule;
		if (isFunction(message)) return message(value, rule);
		return message || "";
	}
	function startComposing({ target }) {
		target.composing = true;
	}
	function endComposing({ target }) {
		if (target.composing) {
			target.composing = false;
			target.dispatchEvent(new Event("input"));
		}
	}
	function resizeTextarea(input, autosize) {
		const scrollTop = getRootScrollTop();
		input.style.height = "auto";
		let height = input.scrollHeight;
		if (isObject$1(autosize)) {
			const { maxHeight, minHeight } = autosize;
			if (maxHeight !== void 0) height = Math.min(height, maxHeight);
			if (minHeight !== void 0) height = Math.max(height, minHeight);
		}
		if (height) {
			input.style.height = `${height}px`;
			setRootScrollTop(scrollTop);
		}
	}
	function mapInputType(type, inputmode) {
		if (type === "number") {
			type = "text";
			inputmode ??= "decimal";
		}
		if (type === "digit") {
			type = "tel";
			inputmode ??= "numeric";
		}
		return {
			type,
			inputmode
		};
	}
	function getStringLength(str) {
		return [...str].length;
	}
	function cutString(str, maxlength) {
		return [...str].slice(0, maxlength).join("");
	}
	var [name$16, bem$17] = createNamespace("field");
	var fieldSharedProps = {
		id: String,
		name: String,
		leftIcon: String,
		rightIcon: String,
		autofocus: Boolean,
		clearable: Boolean,
		maxlength: numericProp,
		max: Number,
		min: Number,
		formatter: Function,
		clearIcon: makeStringProp("clear"),
		modelValue: makeNumericProp(""),
		inputAlign: String,
		placeholder: String,
		autocomplete: String,
		autocapitalize: String,
		autocorrect: String,
		errorMessage: String,
		enterkeyhint: String,
		clearTrigger: makeStringProp("focus"),
		formatTrigger: makeStringProp("onChange"),
		spellcheck: {
			type: Boolean,
			default: null
		},
		error: {
			type: Boolean,
			default: null
		},
		disabled: {
			type: Boolean,
			default: null
		},
		readonly: {
			type: Boolean,
			default: null
		},
		inputmode: String
	};
	var fieldProps = extend({}, cellSharedProps, fieldSharedProps, {
		rows: numericProp,
		type: makeStringProp("text"),
		rules: Array,
		autosize: [Boolean, Object],
		labelWidth: numericProp,
		labelClass: null,
		labelAlign: String,
		showWordLimit: Boolean,
		errorMessageAlign: String,
		colon: {
			type: Boolean,
			default: null
		}
	});
	var Field = withInstall((0, vue.defineComponent)({
		name: name$16,
		props: fieldProps,
		emits: [
			"blur",
			"focus",
			"clear",
			"keypress",
			"clickInput",
			"endValidate",
			"startValidate",
			"clickLeftIcon",
			"clickRightIcon",
			"update:modelValue"
		],
		setup(props, { emit, slots }) {
			const id = useId();
			const state = (0, vue.reactive)({
				status: "unvalidated",
				focused: false,
				validateMessage: ""
			});
			const inputRef = (0, vue.ref)();
			const clearIconRef = (0, vue.ref)();
			const customValue = (0, vue.ref)();
			const { parent: form } = useParent(FORM_KEY);
			const getModelValue = () => {
				var _a;
				return String((_a = props.modelValue) != null ? _a : "");
			};
			const getProp = (key) => {
				if (isDef(props[key])) return props[key];
				if (form && isDef(form.props[key])) return form.props[key];
			};
			const showClear = (0, vue.computed)(() => {
				const readonly = getProp("readonly");
				if (props.clearable && !readonly) {
					const hasValue = getModelValue() !== "";
					const trigger = props.clearTrigger === "always" || props.clearTrigger === "focus" && state.focused;
					return hasValue && trigger;
				}
				return false;
			});
			const formValue = (0, vue.computed)(() => {
				if (customValue.value && slots.input) return customValue.value();
				return props.modelValue;
			});
			const showRequiredMark = (0, vue.computed)(() => {
				var _a;
				const required = getProp("required");
				if (required === "auto") return (_a = props.rules) == null ? void 0 : _a.some((rule) => rule.required);
				return required;
			});
			const runRules = (rules) => rules.reduce((promise, rule) => promise.then(() => {
				if (state.status === "failed") return;
				let { value } = formValue;
				if (rule.formatter) value = rule.formatter(value, rule);
				if (!runSyncRule(value, rule)) {
					state.status = "failed";
					state.validateMessage = getRuleMessage(value, rule);
					return;
				}
				if (rule.validator) {
					if (isEmptyValue(value) && rule.validateEmpty === false) return;
					return runRuleValidator(value, rule).then((result) => {
						if (result && typeof result === "string") {
							state.status = "failed";
							state.validateMessage = result;
						} else if (result === false) {
							state.status = "failed";
							state.validateMessage = getRuleMessage(value, rule);
						}
					});
				}
			}), Promise.resolve());
			const resetValidation = () => {
				state.status = "unvalidated";
				state.validateMessage = "";
			};
			const endValidate = () => emit("endValidate", {
				status: state.status,
				message: state.validateMessage
			});
			const validate = (rules = props.rules) => new Promise((resolve) => {
				resetValidation();
				if (rules) {
					emit("startValidate");
					runRules(rules).then(() => {
						if (state.status === "failed") {
							resolve({
								name: props.name,
								message: state.validateMessage
							});
							endValidate();
						} else {
							state.status = "passed";
							resolve();
							endValidate();
						}
					});
				} else resolve();
			});
			const validateWithTrigger = (trigger) => {
				if (form && props.rules) {
					const { validateTrigger } = form.props;
					const defaultTrigger = toArray(validateTrigger).includes(trigger);
					const rules = props.rules.filter((rule) => {
						if (rule.trigger) return toArray(rule.trigger).includes(trigger);
						return defaultTrigger;
					});
					if (rules.length) validate(rules);
				}
			};
			const limitValueLength = (value) => {
				var _a;
				const { maxlength } = props;
				if (isDef(maxlength) && getStringLength(value) > +maxlength) {
					const modelValue = getModelValue();
					if (modelValue && getStringLength(modelValue) === +maxlength) return modelValue;
					let selectionEnd = (_a = inputRef.value) == null ? void 0 : _a.selectionEnd;
					if (state.focused && selectionEnd) {
						const valueArr = [...value];
						const exceededLength = valueArr.length - +maxlength;
						selectionEnd = getStringLength(value.slice(0, selectionEnd));
						valueArr.splice(selectionEnd - exceededLength, exceededLength);
						return valueArr.join("");
					}
					return cutString(value, +maxlength);
				}
				return value;
			};
			const updateValue = (value, trigger = "onChange") => {
				var _a, _b;
				const originalValue = value;
				value = limitValueLength(value);
				const limitDiffLen = originalValue.length - value.length;
				if (props.type === "number" || props.type === "digit") {
					const isNumber = props.type === "number";
					value = formatNumber(value, isNumber, isNumber);
					if (trigger === "onBlur" && value !== "" && (props.min !== void 0 || props.max !== void 0)) {
						const adjustedValue = clamp(+value, (_a = props.min) != null ? _a : -Infinity, (_b = props.max) != null ? _b : Infinity);
						if (+value !== adjustedValue) value = adjustedValue.toString();
					}
				}
				let formatterDiffLen = 0;
				if (props.formatter && trigger === props.formatTrigger) {
					const { formatter, maxlength } = props;
					value = formatter(value);
					if (isDef(maxlength) && getStringLength(value) > +maxlength) value = cutString(value, +maxlength);
					if (inputRef.value && state.focused) {
						const { selectionEnd } = inputRef.value;
						const bcoVal = cutString(originalValue, selectionEnd);
						formatterDiffLen = formatter(bcoVal).length - bcoVal.length;
					}
				}
				if (inputRef.value && inputRef.value.value !== value) {
					if (state.focused) {
						let { selectionStart, selectionEnd } = inputRef.value;
						inputRef.value.value = value;
						if (isDef(selectionStart) && isDef(selectionEnd)) {
							const valueLen = value.length;
							if (limitDiffLen) {
								selectionStart -= limitDiffLen;
								selectionEnd -= limitDiffLen;
							} else if (formatterDiffLen) {
								selectionStart += formatterDiffLen;
								selectionEnd += formatterDiffLen;
							}
							inputRef.value.setSelectionRange(Math.min(selectionStart, valueLen), Math.min(selectionEnd, valueLen));
						}
					} else inputRef.value.value = value;
				}
				if (value !== props.modelValue) emit("update:modelValue", value);
			};
			const onInput = (event) => {
				if (!event.target.composing) updateValue(event.target.value);
			};
			const blur = () => {
				var _a;
				return (_a = inputRef.value) == null ? void 0 : _a.blur();
			};
			const focus = () => {
				var _a;
				return (_a = inputRef.value) == null ? void 0 : _a.focus();
			};
			const adjustTextareaSize = () => {
				const input = inputRef.value;
				if (props.type === "textarea" && props.autosize && input) resizeTextarea(input, props.autosize);
			};
			const onFocus = (event) => {
				state.focused = true;
				emit("focus", event);
				(0, vue.nextTick)(adjustTextareaSize);
				if (getProp("readonly")) blur();
			};
			const onBlur = (event) => {
				state.focused = false;
				updateValue(getModelValue(), "onBlur");
				emit("blur", event);
				if (getProp("readonly")) return;
				validateWithTrigger("onBlur");
				(0, vue.nextTick)(adjustTextareaSize);
				resetScroll();
			};
			const onClickInput = (event) => emit("clickInput", event);
			const onClickLeftIcon = (event) => emit("clickLeftIcon", event);
			const onClickRightIcon = (event) => emit("clickRightIcon", event);
			const onClear = (event) => {
				preventDefault(event);
				emit("update:modelValue", "");
				emit("clear", event);
			};
			const showError = (0, vue.computed)(() => {
				if (typeof props.error === "boolean") return props.error;
				if (form && form.props.showError && state.status === "failed") return true;
			});
			const labelStyle = (0, vue.computed)(() => {
				const labelWidth = getProp("labelWidth");
				const labelAlign = getProp("labelAlign");
				if (labelWidth && labelAlign !== "top") return { width: addUnit(labelWidth) };
			});
			const onKeypress = (event) => {
				if (event.keyCode === 13) {
					if (!(form && form.props.submitOnEnter) && props.type !== "textarea") preventDefault(event);
					if (props.type === "search") blur();
				}
				emit("keypress", event);
			};
			const getInputId = () => props.id || `${id}-input`;
			const getValidationStatus = () => state.status;
			const renderInput = () => {
				const controlClass = bem$17("control", [getProp("inputAlign"), {
					error: showError.value,
					custom: !!slots.input,
					"min-height": props.type === "textarea" && !props.autosize
				}]);
				if (slots.input) return (0, vue.createVNode)("div", {
					"class": controlClass,
					"onClick": onClickInput
				}, [slots.input()]);
				const inputAttrs = {
					id: getInputId(),
					ref: inputRef,
					name: props.name,
					rows: props.rows !== void 0 ? +props.rows : void 0,
					class: controlClass,
					disabled: getProp("disabled"),
					readonly: getProp("readonly"),
					autofocus: props.autofocus,
					placeholder: props.placeholder,
					autocomplete: props.autocomplete,
					autocapitalize: props.autocapitalize,
					autocorrect: props.autocorrect,
					enterkeyhint: props.enterkeyhint,
					spellcheck: props.spellcheck,
					"aria-labelledby": props.label ? `${id}-label` : void 0,
					"data-allow-mismatch": "attribute",
					onBlur,
					onFocus,
					onInput,
					onClick: onClickInput,
					onChange: endComposing,
					onKeypress,
					onCompositionend: endComposing,
					onCompositionstart: startComposing
				};
				if (props.type === "textarea") return (0, vue.createVNode)("textarea", (0, vue.mergeProps)(inputAttrs, { "inputmode": props.inputmode }), null);
				return (0, vue.createVNode)("input", (0, vue.mergeProps)(mapInputType(props.type, props.inputmode), inputAttrs), null);
			};
			const renderLeftIcon = () => {
				const leftIconSlot = slots["left-icon"];
				if (props.leftIcon || leftIconSlot) return (0, vue.createVNode)("div", {
					"class": bem$17("left-icon"),
					"onClick": onClickLeftIcon
				}, [leftIconSlot ? leftIconSlot() : (0, vue.createVNode)(Icon, {
					"name": props.leftIcon,
					"classPrefix": props.iconPrefix
				}, null)]);
			};
			const renderRightIcon = () => {
				const rightIconSlot = slots["right-icon"];
				if (props.rightIcon || rightIconSlot) return (0, vue.createVNode)("div", {
					"class": bem$17("right-icon"),
					"onClick": onClickRightIcon
				}, [rightIconSlot ? rightIconSlot() : (0, vue.createVNode)(Icon, {
					"name": props.rightIcon,
					"classPrefix": props.iconPrefix
				}, null)]);
			};
			const renderWordLimit = () => {
				if (props.showWordLimit && props.maxlength) {
					const count = getStringLength(getModelValue());
					return (0, vue.createVNode)("div", { "class": bem$17("word-limit") }, [
						(0, vue.createVNode)("span", { "class": bem$17("word-num") }, [count]),
						(0, vue.createTextVNode)("/"),
						props.maxlength
					]);
				}
			};
			const renderMessage = () => {
				if (form && form.props.showErrorMessage === false) return;
				const message = props.errorMessage || state.validateMessage;
				if (message) {
					const slot = slots["error-message"];
					const errorMessageAlign = getProp("errorMessageAlign");
					return (0, vue.createVNode)("div", { "class": bem$17("error-message", errorMessageAlign) }, [slot ? slot({ message }) : message]);
				}
			};
			const renderLabel = () => {
				const labelWidth = getProp("labelWidth");
				const labelAlign = getProp("labelAlign");
				const colon = getProp("colon") ? ":" : "";
				if (slots.label) return [slots.label(), colon];
				if (props.label) return (0, vue.createVNode)("label", {
					"id": `${id}-label`,
					"for": slots.input ? void 0 : getInputId(),
					"data-allow-mismatch": "attribute",
					"onClick": (event) => {
						preventDefault(event);
						focus();
					},
					"style": labelAlign === "top" && labelWidth ? { width: addUnit(labelWidth) } : void 0
				}, [props.label + colon]);
			};
			const renderFieldBody = () => [
				(0, vue.createVNode)("div", { "class": bem$17("body") }, [
					renderInput(),
					showClear.value && (0, vue.createVNode)(Icon, {
						"ref": clearIconRef,
						"name": props.clearIcon,
						"class": bem$17("clear")
					}, null),
					renderRightIcon(),
					slots.button && (0, vue.createVNode)("div", { "class": bem$17("button") }, [slots.button()])
				]),
				renderWordLimit(),
				renderMessage()
			];
			useExpose({
				blur,
				focus,
				validate,
				formValue,
				resetValidation,
				getValidationStatus,
				adjustTextareaSize
			});
			(0, vue.provide)(CUSTOM_FIELD_INJECTION_KEY, {
				customValue,
				resetValidation,
				validateWithTrigger
			});
			(0, vue.watch)(() => props.modelValue, () => {
				updateValue(getModelValue());
				resetValidation();
				validateWithTrigger("onChange");
				(0, vue.nextTick)(adjustTextareaSize);
			});
			(0, vue.onMounted)(() => {
				updateValue(getModelValue(), props.formatTrigger);
				(0, vue.nextTick)(adjustTextareaSize);
			});
			useEventListener("touchstart", onClear, { target: (0, vue.computed)(() => {
				var _a;
				return (_a = clearIconRef.value) == null ? void 0 : _a.$el;
			}) });
			return () => {
				const disabled = getProp("disabled");
				const labelAlign = getProp("labelAlign");
				const LeftIcon = renderLeftIcon();
				const renderTitle = () => {
					const Label = renderLabel();
					if (labelAlign === "top") return [LeftIcon, Label].filter(Boolean);
					return Label || [];
				};
				return (0, vue.createVNode)(Cell, {
					"size": props.size,
					"class": bem$17({
						error: showError.value,
						disabled,
						[`label-${labelAlign}`]: labelAlign
					}),
					"center": props.center,
					"border": props.border,
					"isLink": disabled ? false : props.isLink,
					"clickable": disabled ? false : props.clickable,
					"onClick": disabled ? (e) => e.stopImmediatePropagation() : void 0,
					"titleStyle": labelStyle.value,
					"valueClass": bem$17("value"),
					"titleClass": [bem$17("label", [labelAlign, { required: showRequiredMark.value }]), props.labelClass],
					"arrowDirection": props.arrowDirection
				}, {
					icon: LeftIcon && labelAlign !== "top" ? () => LeftIcon : null,
					title: renderTitle,
					value: renderFieldBody,
					extra: slots.extra
				});
			};
		}
	}));
	var lockCount = 0;
	function lockClick(lock) {
		if (lock) {
			if (!lockCount) document.body.classList.add("van-toast--unclickable");
			lockCount++;
		} else if (lockCount) {
			lockCount--;
			if (!lockCount) document.body.classList.remove("van-toast--unclickable");
		}
	}
	var [name$15, bem$16] = createNamespace("toast");
	var popupInheritProps$1 = [
		"show",
		"overlay",
		"teleport",
		"transition",
		"overlayClass",
		"overlayStyle",
		"closeOnClickOverlay",
		"zIndex"
	];
	var toastProps = {
		icon: String,
		show: Boolean,
		type: makeStringProp("text"),
		overlay: Boolean,
		message: numericProp,
		iconSize: numericProp,
		duration: makeNumberProp(2e3),
		position: makeStringProp("middle"),
		teleport: [String, Object],
		wordBreak: String,
		className: null,
		iconPrefix: String,
		transition: makeStringProp("van-fade"),
		loadingType: String,
		forbidClick: Boolean,
		overlayClass: null,
		overlayStyle: Object,
		closeOnClick: Boolean,
		closeOnClickOverlay: Boolean,
		zIndex: numericProp
	};
	var stdin_default$18 = (0, vue.defineComponent)({
		name: name$15,
		props: toastProps,
		emits: ["update:show"],
		setup(props, { emit, slots }) {
			let timer;
			let clickable = false;
			const toggleClickable = () => {
				const newValue = props.show && props.forbidClick;
				if (clickable !== newValue) {
					clickable = newValue;
					lockClick(clickable);
				}
			};
			const updateShow = (show) => emit("update:show", show);
			const onClick = () => {
				if (props.closeOnClick) updateShow(false);
			};
			const clearTimer = () => clearTimeout(timer);
			const renderIcon = () => {
				const { icon, type, iconSize, iconPrefix, loadingType } = props;
				if (icon || type === "success" || type === "fail") return (0, vue.createVNode)(Icon, {
					"name": icon || type,
					"size": iconSize,
					"class": bem$16("icon"),
					"classPrefix": iconPrefix
				}, null);
				if (type === "loading") return (0, vue.createVNode)(Loading, {
					"class": bem$16("loading"),
					"size": iconSize,
					"type": loadingType
				}, null);
			};
			const renderMessage = () => {
				const { type, message } = props;
				if (slots.message) return (0, vue.createVNode)("div", { "class": bem$16("text") }, [slots.message()]);
				if (isDef(message) && message !== "") return type === "html" ? (0, vue.createVNode)("div", {
					"key": 0,
					"class": bem$16("text"),
					"innerHTML": String(message)
				}, null) : (0, vue.createVNode)("div", { "class": bem$16("text") }, [message]);
			};
			(0, vue.watch)(() => [props.show, props.forbidClick], toggleClickable);
			(0, vue.watch)(() => [
				props.show,
				props.type,
				props.message,
				props.duration
			], () => {
				clearTimer();
				if (props.show && props.duration > 0) timer = setTimeout(() => {
					updateShow(false);
				}, props.duration);
			});
			(0, vue.onMounted)(toggleClickable);
			(0, vue.onUnmounted)(toggleClickable);
			return () => (0, vue.createVNode)(Popup, (0, vue.mergeProps)({
				"class": [bem$16([
					props.position,
					props.wordBreak === "normal" ? "break-normal" : props.wordBreak,
					{ [props.type]: !props.icon }
				]), props.className],
				"lockScroll": false,
				"onClick": onClick,
				"onClosed": clearTimer,
				"onUpdate:show": updateShow
			}, pick(props, popupInheritProps$1)), { default: () => [renderIcon(), renderMessage()] });
		}
	});
	function usePopupState() {
		const state = (0, vue.reactive)({ show: false });
		const toggle = (show) => {
			state.show = show;
		};
		const open = (props) => {
			extend(state, props, { transitionAppear: true });
			toggle(true);
		};
		const close = () => toggle(false);
		useExpose({
			open,
			close,
			toggle
		});
		return {
			open,
			close,
			state,
			toggle
		};
	}
	function mountComponent(RootComponent) {
		const app = (0, vue.createApp)(RootComponent);
		const root = document.createElement("div");
		document.body.appendChild(root);
		return {
			instance: app.mount(root),
			unmount() {
				app.unmount();
				document.body.removeChild(root);
			}
		};
	}
	var defaultOptions = {
		icon: "",
		type: "text",
		message: "",
		className: "",
		overlay: false,
		onClose: void 0,
		onOpened: void 0,
		duration: 2e3,
		teleport: "body",
		iconSize: void 0,
		iconPrefix: void 0,
		position: "middle",
		transition: "van-fade",
		forbidClick: false,
		loadingType: void 0,
		overlayClass: "",
		overlayStyle: void 0,
		closeOnClick: false,
		closeOnClickOverlay: false
	};
	var queue = [];
	var allowMultiple = false;
	var currentOptions$2 = extend({}, defaultOptions);
	var defaultOptionsMap = new Map();
	function parseOptions$1(message) {
		if (isObject$1(message)) return message;
		return { message };
	}
	function createInstance() {
		const { instance, unmount } = mountComponent({ setup() {
			const message = (0, vue.ref)("");
			const { open, state, close, toggle } = usePopupState();
			const onClosed = () => {
				if (allowMultiple) {
					queue = queue.filter((item) => item !== instance);
					unmount();
				}
			};
			const render = () => {
				return (0, vue.createVNode)(stdin_default$18, (0, vue.mergeProps)(state, {
					onClosed,
					"onUpdate:show": toggle
				}), null);
			};
			(0, vue.watch)(message, (val) => {
				state.message = val;
			});
			(0, vue.getCurrentInstance)().render = render;
			return {
				open,
				close,
				message
			};
		} });
		return instance;
	}
	function getInstance() {
		if (!queue.length || allowMultiple) {
			const instance = createInstance();
			queue.push(instance);
		}
		return queue[queue.length - 1];
	}
	function showToast(options = {}) {
		if (!inBrowser$1) return {};
		const toast = getInstance();
		const parsedOptions = parseOptions$1(options);
		toast.open(extend({}, currentOptions$2, defaultOptionsMap.get(parsedOptions.type || currentOptions$2.type), parsedOptions));
		return toast;
	}
	var [name$14, bem$15] = createNamespace("switch");
	var Switch = withInstall((0, vue.defineComponent)({
		name: name$14,
		props: {
			size: numericProp,
			loading: Boolean,
			disabled: Boolean,
			modelValue: null,
			activeColor: String,
			inactiveColor: String,
			activeValue: {
				type: null,
				default: true
			},
			inactiveValue: {
				type: null,
				default: false
			}
		},
		emits: ["change", "update:modelValue"],
		setup(props, { emit, slots }) {
			const isChecked = () => props.modelValue === props.activeValue;
			const onClick = () => {
				if (!props.disabled && !props.loading) {
					const newValue = isChecked() ? props.inactiveValue : props.activeValue;
					emit("update:modelValue", newValue);
					emit("change", newValue);
				}
			};
			const renderLoading = () => {
				if (props.loading) {
					const color = isChecked() ? props.activeColor : props.inactiveColor;
					return (0, vue.createVNode)(Loading, {
						"class": bem$15("loading"),
						"color": color
					}, null);
				}
				if (slots.node) return slots.node();
			};
			useCustomFieldValue(() => props.modelValue);
			return () => {
				var _a;
				const { size, loading, disabled, activeColor, inactiveColor } = props;
				const checked = isChecked();
				const style = {
					fontSize: addUnit(size),
					backgroundColor: checked ? activeColor : inactiveColor
				};
				return (0, vue.createVNode)("div", {
					"role": "switch",
					"class": bem$15({
						on: checked,
						loading,
						disabled
					}),
					"style": style,
					"tabindex": disabled ? void 0 : 0,
					"aria-checked": checked,
					"onClick": onClick
				}, [(0, vue.createVNode)("div", { "class": bem$15("node") }, [renderLoading()]), (_a = slots.background) == null ? void 0 : _a.call(slots)]);
			};
		}
	}));
	var [name$13, bem$14] = createNamespace("checkbox-group");
	var checkboxGroupProps = {
		max: numericProp,
		shape: makeStringProp("round"),
		disabled: Boolean,
		iconSize: numericProp,
		direction: String,
		modelValue: makeArrayProp(),
		checkedColor: String
	};
	var CHECKBOX_GROUP_KEY = Symbol(name$13);
	var CheckboxGroup = withInstall((0, vue.defineComponent)({
		name: name$13,
		props: checkboxGroupProps,
		emits: ["change", "update:modelValue"],
		setup(props, { emit, slots }) {
			const { children, linkChildren } = useChildren(CHECKBOX_GROUP_KEY);
			const updateValue = (value) => emit("update:modelValue", value);
			const toggleAll = (options = {}) => {
				if (typeof options === "boolean") options = { checked: options };
				const { checked, skipDisabled } = options;
				const names = children.filter((item) => {
					if (!item.props.bindGroup) return false;
					if (item.props.disabled && skipDisabled) return item.checked.value;
					return checked != null ? checked : !item.checked.value;
				}).map((item) => item.name);
				updateValue(names);
			};
			(0, vue.watch)(() => props.modelValue, (value) => emit("change", value));
			useExpose({ toggleAll });
			useCustomFieldValue(() => props.modelValue);
			linkChildren({
				props,
				updateValue
			});
			return () => {
				var _a;
				return (0, vue.createVNode)("div", { "class": bem$14([props.direction]) }, [(_a = slots.default) == null ? void 0 : _a.call(slots)]);
			};
		}
	}));
	var checkerProps = {
		name: null,
		disabled: Boolean,
		iconSize: numericProp,
		modelValue: null,
		checkedColor: String,
		labelPosition: String,
		labelDisabled: Boolean
	};
	var stdin_default$15 = (0, vue.defineComponent)({
		props: extend({}, checkerProps, {
			bem: makeRequiredProp(Function),
			role: String,
			shape: String,
			parent: Object,
			checked: Boolean,
			bindGroup: truthProp,
			indeterminate: {
				type: Boolean,
				default: null
			}
		}),
		emits: ["click", "toggle"],
		setup(props, { emit, slots }) {
			const iconRef = (0, vue.ref)();
			const getParentProp = (name) => {
				if (props.parent && props.bindGroup) return props.parent.props[name];
			};
			const disabled = (0, vue.computed)(() => {
				if (props.parent && props.bindGroup) {
					const disabled2 = getParentProp("disabled") || props.disabled;
					if (props.role === "checkbox") {
						const checkedCount = getParentProp("modelValue").length;
						const max = getParentProp("max");
						const overlimit = max && checkedCount >= +max;
						return disabled2 || overlimit && !props.checked;
					}
					return disabled2;
				}
				return props.disabled;
			});
			const direction = (0, vue.computed)(() => getParentProp("direction"));
			const iconStyle = (0, vue.computed)(() => {
				const checkedColor = props.checkedColor || getParentProp("checkedColor");
				if (checkedColor && (props.checked || props.indeterminate) && !disabled.value) return {
					borderColor: checkedColor,
					backgroundColor: checkedColor
				};
			});
			const shape = (0, vue.computed)(() => {
				return props.shape || getParentProp("shape") || "round";
			});
			const onClick = (event) => {
				const { target } = event;
				const icon = iconRef.value;
				const iconClicked = icon === target || (icon == null ? void 0 : icon.contains(target));
				if (!disabled.value && (iconClicked || !props.labelDisabled)) emit("toggle");
				emit("click", event);
			};
			const renderIcon = () => {
				var _a, _b;
				const { bem, checked, indeterminate } = props;
				const iconSize = props.iconSize || getParentProp("iconSize");
				return (0, vue.createVNode)("div", {
					"ref": iconRef,
					"class": bem("icon", [shape.value, {
						disabled: disabled.value,
						checked,
						indeterminate
					}]),
					"style": shape.value !== "dot" ? { fontSize: addUnit(iconSize) } : {
						width: addUnit(iconSize),
						height: addUnit(iconSize),
						borderColor: (_a = iconStyle.value) == null ? void 0 : _a.borderColor
					}
				}, [slots.icon ? slots.icon({
					checked,
					disabled: disabled.value
				}) : shape.value !== "dot" ? (0, vue.createVNode)(Icon, {
					"name": indeterminate ? "minus" : "success",
					"style": iconStyle.value
				}, null) : (0, vue.createVNode)("div", {
					"class": bem("icon--dot__icon"),
					"style": { backgroundColor: (_b = iconStyle.value) == null ? void 0 : _b.backgroundColor }
				}, null)]);
			};
			const renderLabel = () => {
				const { checked } = props;
				if (slots.default) return (0, vue.createVNode)("span", { "class": props.bem("label", [props.labelPosition, { disabled: disabled.value }]) }, [slots.default({
					checked,
					disabled: disabled.value
				})]);
			};
			return () => {
				const nodes = props.labelPosition === "left" ? [renderLabel(), renderIcon()] : [renderIcon(), renderLabel()];
				return (0, vue.createVNode)("div", {
					"role": props.role,
					"class": props.bem([{
						disabled: disabled.value,
						"label-disabled": props.labelDisabled
					}, direction.value]),
					"tabindex": disabled.value ? void 0 : 0,
					"aria-checked": props.checked,
					"onClick": onClick
				}, [nodes]);
			};
		}
	});
	var [name$12, bem$13] = createNamespace("checkbox");
	var checkboxProps = extend({}, checkerProps, {
		shape: String,
		bindGroup: truthProp,
		indeterminate: {
			type: Boolean,
			default: null
		}
	});
	var Checkbox = withInstall((0, vue.defineComponent)({
		name: name$12,
		props: checkboxProps,
		emits: ["change", "update:modelValue"],
		setup(props, { emit, slots }) {
			const { parent } = useParent(CHECKBOX_GROUP_KEY);
			const setParentValue = (checked2) => {
				const { name: name2 } = props;
				const { max, modelValue } = parent.props;
				const value = modelValue.slice();
				if (checked2) {
					if (!(max && value.length >= +max) && !value.includes(name2)) {
						value.push(name2);
						if (props.bindGroup) parent.updateValue(value);
					}
				} else {
					const index = value.indexOf(name2);
					if (index !== -1) {
						value.splice(index, 1);
						if (props.bindGroup) parent.updateValue(value);
					}
				}
			};
			const checked = (0, vue.computed)(() => {
				if (parent && props.bindGroup) return parent.props.modelValue.indexOf(props.name) !== -1;
				return !!props.modelValue;
			});
			const toggle = (newValue = !checked.value) => {
				if (parent && props.bindGroup) setParentValue(newValue);
				else emit("update:modelValue", newValue);
				if (props.indeterminate !== null) emit("change", newValue);
			};
			(0, vue.watch)(() => props.modelValue, (value) => {
				if (props.indeterminate === null) emit("change", value);
			});
			useExpose({
				toggle,
				props,
				checked
			});
			useCustomFieldValue(() => props.modelValue);
			return () => (0, vue.createVNode)(stdin_default$15, (0, vue.mergeProps)({
				"bem": bem$13,
				"role": "checkbox",
				"parent": parent,
				"checked": checked.value,
				"onToggle": toggle
			}, props), pick(slots, ["default", "icon"]));
		}
	}));
	var [name$11, bem$12] = createNamespace("image");
	var imageProps = {
		src: String,
		alt: String,
		fit: String,
		position: String,
		round: Boolean,
		block: Boolean,
		width: numericProp,
		height: numericProp,
		radius: numericProp,
		lazyLoad: Boolean,
		iconSize: numericProp,
		showError: truthProp,
		errorIcon: makeStringProp("photo-fail"),
		iconPrefix: String,
		showLoading: truthProp,
		loadingIcon: makeStringProp("photo"),
		crossorigin: String,
		referrerpolicy: String,
		decoding: String
	};
	var Image = withInstall((0, vue.defineComponent)({
		name: name$11,
		props: imageProps,
		emits: ["load", "error"],
		setup(props, { emit, slots }) {
			const error = (0, vue.ref)(false);
			const loading = (0, vue.ref)(true);
			const imageRef = (0, vue.ref)();
			const { $Lazyload } = (0, vue.getCurrentInstance)().proxy;
			const style = (0, vue.computed)(() => {
				const style2 = {
					width: addUnit(props.width),
					height: addUnit(props.height)
				};
				if (isDef(props.radius)) {
					style2.overflow = "hidden";
					style2.borderRadius = addUnit(props.radius);
				}
				return style2;
			});
			(0, vue.watch)(() => props.src, () => {
				error.value = false;
				loading.value = true;
			});
			const onLoad = (event) => {
				if (loading.value) {
					loading.value = false;
					emit("load", event);
				}
			};
			const triggerLoad = () => {
				const loadEvent = new Event("load");
				Object.defineProperty(loadEvent, "target", {
					value: imageRef.value,
					enumerable: true
				});
				onLoad(loadEvent);
			};
			const onError = (event) => {
				error.value = true;
				loading.value = false;
				emit("error", event);
			};
			const renderIcon = (name2, className, slot) => {
				if (slot) return slot();
				return (0, vue.createVNode)(Icon, {
					"name": name2,
					"size": props.iconSize,
					"class": className,
					"classPrefix": props.iconPrefix
				}, null);
			};
			const renderPlaceholder = () => {
				if (loading.value && props.showLoading) return (0, vue.createVNode)("div", { "class": bem$12("loading") }, [renderIcon(props.loadingIcon, bem$12("loading-icon"), slots.loading)]);
				if (error.value && props.showError) return (0, vue.createVNode)("div", { "class": bem$12("error") }, [renderIcon(props.errorIcon, bem$12("error-icon"), slots.error)]);
			};
			const renderImage = () => {
				if (error.value || !props.src) return;
				const attrs = {
					alt: props.alt,
					class: bem$12("img"),
					decoding: props.decoding,
					style: {
						objectFit: props.fit,
						objectPosition: props.position
					},
					crossorigin: props.crossorigin,
					referrerpolicy: props.referrerpolicy
				};
				if (props.lazyLoad) return (0, vue.withDirectives)((0, vue.createVNode)("img", (0, vue.mergeProps)({ "ref": imageRef }, attrs), null), [[(0, vue.resolveDirective)("lazy"), props.src]]);
				return (0, vue.createVNode)("img", (0, vue.mergeProps)({
					"ref": imageRef,
					"src": props.src,
					"onLoad": onLoad,
					"onError": onError
				}, attrs), null);
			};
			const onLazyLoaded = ({ el }) => {
				const check = () => {
					if (el === imageRef.value && loading.value) triggerLoad();
				};
				if (imageRef.value) check();
				else (0, vue.nextTick)(check);
			};
			const onLazyLoadError = ({ el }) => {
				if (el === imageRef.value && !error.value) onError();
			};
			if ($Lazyload && inBrowser$1) {
				$Lazyload.$on("loaded", onLazyLoaded);
				$Lazyload.$on("error", onLazyLoadError);
				(0, vue.onBeforeUnmount)(() => {
					$Lazyload.$off("loaded", onLazyLoaded);
					$Lazyload.$off("error", onLazyLoadError);
				});
			}
			(0, vue.onMounted)(() => {
				(0, vue.nextTick)(() => {
					var _a;
					if (((_a = imageRef.value) == null ? void 0 : _a.complete) && !props.lazyLoad) triggerLoad();
				});
			});
			return () => {
				var _a;
				return (0, vue.createVNode)("div", {
					"class": bem$12({
						round: props.round,
						block: props.block
					}),
					"style": style.value
				}, [
					renderImage(),
					renderPlaceholder(),
					(_a = slots.default) == null ? void 0 : _a.call(slots)
				]);
			};
		}
	}));
	var [name$10, bem$11] = createNamespace("cell-group");
	var CellGroup = withInstall((0, vue.defineComponent)({
		name: name$10,
		inheritAttrs: false,
		props: {
			title: String,
			inset: Boolean,
			border: truthProp
		},
		setup(props, { slots, attrs }) {
			const renderGroup = () => {
				var _a;
				return (0, vue.createVNode)("div", (0, vue.mergeProps)({ "class": [bem$11({ inset: props.inset }), { [BORDER_TOP_BOTTOM]: props.border && !props.inset }] }, attrs, useScopeId()), [(_a = slots.default) == null ? void 0 : _a.call(slots)]);
			};
			const renderTitle = () => (0, vue.createVNode)("div", { "class": bem$11("title", { inset: props.inset }) }, [slots.title ? slots.title() : props.title]);
			return () => {
				if (props.title || slots.title) return (0, vue.createVNode)(vue.Fragment, null, [renderTitle(), renderGroup()]);
				return renderGroup();
			};
		}
	}));
	var [name$9, bem$10] = createNamespace("empty");
	var emptyProps = {
		image: makeStringProp("default"),
		imageSize: [
			Number,
			String,
			Array
		],
		description: String
	};
	var Empty = withInstall((0, vue.defineComponent)({
		name: name$9,
		props: emptyProps,
		setup(props, { slots }) {
			const renderDescription = () => {
				const description = slots.description ? slots.description() : props.description;
				if (description) return (0, vue.createVNode)("p", { "class": bem$10("description") }, [description]);
			};
			const renderBottom = () => {
				if (slots.default) return (0, vue.createVNode)("div", { "class": bem$10("bottom") }, [slots.default()]);
			};
			const baseId = useId();
			const getId = (num) => `${baseId}-${num}`;
			const getUrlById = (num) => `url(#${getId(num)})`;
			const renderStop = (color, offset, opacity) => (0, vue.createVNode)("stop", {
				"stop-color": color,
				"offset": `${offset}%`,
				"stop-opacity": opacity
			}, null);
			const renderStops = (fromColor, toColor) => [renderStop(fromColor, 0), renderStop(toColor, 100)];
			const renderShadow = (id) => [(0, vue.createVNode)("defs", null, [(0, vue.createVNode)("radialGradient", {
				"id": getId(id),
				"cx": "50%",
				"cy": "54%",
				"fx": "50%",
				"fy": "54%",
				"r": "297%",
				"gradientTransform": "matrix(-.16 0 0 -.33 .58 .72)",
				"data-allow-mismatch": "attribute"
			}, [renderStop("#EBEDF0", 0), renderStop("#F2F3F5", 100, .3)])]), (0, vue.createVNode)("ellipse", {
				"fill": getUrlById(id),
				"opacity": ".8",
				"cx": "80",
				"cy": "140",
				"rx": "46",
				"ry": "8",
				"data-allow-mismatch": "attribute"
			}, null)];
			const renderBuilding = () => [(0, vue.createVNode)("defs", null, [(0, vue.createVNode)("linearGradient", {
				"id": getId("a"),
				"x1": "64%",
				"y1": "100%",
				"x2": "64%",
				"data-allow-mismatch": "attribute"
			}, [renderStop("#FFF", 0, .5), renderStop("#F2F3F5", 100)])]), (0, vue.createVNode)("g", {
				"opacity": ".8",
				"data-allow-mismatch": "children"
			}, [(0, vue.createVNode)("path", {
				"d": "M36 131V53H16v20H2v58h34z",
				"fill": getUrlById("a")
			}, null), (0, vue.createVNode)("path", {
				"d": "M123 15h22v14h9v77h-31V15z",
				"fill": getUrlById("a")
			}, null)])];
			const renderCloud = () => [(0, vue.createVNode)("defs", null, [(0, vue.createVNode)("linearGradient", {
				"id": getId("b"),
				"x1": "64%",
				"y1": "97%",
				"x2": "64%",
				"y2": "0%",
				"data-allow-mismatch": "attribute"
			}, [renderStop("#F2F3F5", 0, .3), renderStop("#F2F3F5", 100)])]), (0, vue.createVNode)("g", {
				"opacity": ".8",
				"data-allow-mismatch": "children"
			}, [(0, vue.createVNode)("path", {
				"d": "M87 6c3 0 7 3 8 6a8 8 0 1 1-1 16H80a7 7 0 0 1-8-6c0-4 3-7 6-7 0-5 4-9 9-9Z",
				"fill": getUrlById("b")
			}, null), (0, vue.createVNode)("path", {
				"d": "M19 23c2 0 3 1 4 3 2 0 4 2 4 4a4 4 0 0 1-4 3v1h-7v-1l-1 1c-2 0-3-2-3-4 0-1 1-3 3-3 0-2 2-4 4-4Z",
				"fill": getUrlById("b")
			}, null)])];
			const renderNetwork = () => (0, vue.createVNode)("svg", { "viewBox": "0 0 160 160" }, [(0, vue.createVNode)("defs", { "data-allow-mismatch": "children" }, [
				(0, vue.createVNode)("linearGradient", {
					"id": getId(1),
					"x1": "64%",
					"y1": "100%",
					"x2": "64%"
				}, [renderStop("#FFF", 0, .5), renderStop("#F2F3F5", 100)]),
				(0, vue.createVNode)("linearGradient", {
					"id": getId(2),
					"x1": "50%",
					"x2": "50%",
					"y2": "84%"
				}, [renderStop("#EBEDF0", 0), renderStop("#DCDEE0", 100, 0)]),
				(0, vue.createVNode)("linearGradient", {
					"id": getId(3),
					"x1": "100%",
					"x2": "100%",
					"y2": "100%"
				}, [renderStops("#EAEDF0", "#DCDEE0")]),
				(0, vue.createVNode)("radialGradient", {
					"id": getId(4),
					"cx": "50%",
					"cy": "0%",
					"fx": "50%",
					"fy": "0%",
					"r": "100%",
					"gradientTransform": "matrix(0 1 -.54 0 .5 -.5)"
				}, [renderStop("#EBEDF0", 0), renderStop("#FFF", 100, 0)])
			]), (0, vue.createVNode)("g", { "fill": "none" }, [
				renderBuilding(),
				(0, vue.createVNode)("path", {
					"fill": getUrlById(4),
					"d": "M0 139h160v21H0z",
					"data-allow-mismatch": "attribute"
				}, null),
				(0, vue.createVNode)("path", {
					"d": "M80 54a7 7 0 0 1 3 13v27l-2 2h-2a2 2 0 0 1-2-2V67a7 7 0 0 1 3-13z",
					"fill": getUrlById(2),
					"data-allow-mismatch": "attribute"
				}, null),
				(0, vue.createVNode)("g", {
					"opacity": ".6",
					"stroke-linecap": "round",
					"stroke-width": "7",
					"data-allow-mismatch": "children"
				}, [
					(0, vue.createVNode)("path", {
						"d": "M64 47a19 19 0 0 0-5 13c0 5 2 10 5 13",
						"stroke": getUrlById(3)
					}, null),
					(0, vue.createVNode)("path", {
						"d": "M53 36a34 34 0 0 0 0 48",
						"stroke": getUrlById(3)
					}, null),
					(0, vue.createVNode)("path", {
						"d": "M95 73a19 19 0 0 0 6-13c0-5-2-9-6-13",
						"stroke": getUrlById(3)
					}, null),
					(0, vue.createVNode)("path", {
						"d": "M106 84a34 34 0 0 0 0-48",
						"stroke": getUrlById(3)
					}, null)
				]),
				(0, vue.createVNode)("g", { "transform": "translate(31 105)" }, [
					(0, vue.createVNode)("rect", {
						"fill": "#EBEDF0",
						"width": "98",
						"height": "34",
						"rx": "2"
					}, null),
					(0, vue.createVNode)("rect", {
						"fill": "#FFF",
						"x": "9",
						"y": "8",
						"width": "80",
						"height": "18",
						"rx": "1.1"
					}, null),
					(0, vue.createVNode)("rect", {
						"fill": "#EBEDF0",
						"x": "15",
						"y": "12",
						"width": "18",
						"height": "6",
						"rx": "1.1"
					}, null)
				])
			])]);
			const renderMaterial = () => (0, vue.createVNode)("svg", { "viewBox": "0 0 160 160" }, [
				(0, vue.createVNode)("defs", { "data-allow-mismatch": "children" }, [
					(0, vue.createVNode)("linearGradient", {
						"x1": "50%",
						"x2": "50%",
						"y2": "100%",
						"id": getId(5)
					}, [renderStops("#F2F3F5", "#DCDEE0")]),
					(0, vue.createVNode)("linearGradient", {
						"x1": "95%",
						"y1": "48%",
						"x2": "5.5%",
						"y2": "51%",
						"id": getId(6)
					}, [renderStops("#EAEDF1", "#DCDEE0")]),
					(0, vue.createVNode)("linearGradient", {
						"y1": "45%",
						"x2": "100%",
						"y2": "54%",
						"id": getId(7)
					}, [renderStops("#EAEDF1", "#DCDEE0")])
				]),
				renderBuilding(),
				renderCloud(),
				(0, vue.createVNode)("g", {
					"transform": "translate(36 50)",
					"fill": "none"
				}, [
					(0, vue.createVNode)("g", { "transform": "translate(8)" }, [
						(0, vue.createVNode)("rect", {
							"fill": "#EBEDF0",
							"opacity": ".6",
							"x": "38",
							"y": "13",
							"width": "36",
							"height": "53",
							"rx": "2"
						}, null),
						(0, vue.createVNode)("rect", {
							"fill": getUrlById(5),
							"width": "64",
							"height": "66",
							"rx": "2",
							"data-allow-mismatch": "attribute"
						}, null),
						(0, vue.createVNode)("rect", {
							"fill": "#FFF",
							"x": "6",
							"y": "6",
							"width": "52",
							"height": "55",
							"rx": "1"
						}, null),
						(0, vue.createVNode)("g", {
							"transform": "translate(15 17)",
							"fill": getUrlById(6),
							"data-allow-mismatch": "attribute"
						}, [
							(0, vue.createVNode)("rect", {
								"width": "34",
								"height": "6",
								"rx": "1"
							}, null),
							(0, vue.createVNode)("path", { "d": "M0 14h34v6H0z" }, null),
							(0, vue.createVNode)("rect", {
								"y": "28",
								"width": "34",
								"height": "6",
								"rx": "1"
							}, null)
						])
					]),
					(0, vue.createVNode)("rect", {
						"fill": getUrlById(7),
						"y": "61",
						"width": "88",
						"height": "28",
						"rx": "1",
						"data-allow-mismatch": "attribute"
					}, null),
					(0, vue.createVNode)("rect", {
						"fill": "#F7F8FA",
						"x": "29",
						"y": "72",
						"width": "30",
						"height": "6",
						"rx": "1"
					}, null)
				])
			]);
			const renderError = () => (0, vue.createVNode)("svg", { "viewBox": "0 0 160 160" }, [
				(0, vue.createVNode)("defs", null, [(0, vue.createVNode)("linearGradient", {
					"x1": "50%",
					"x2": "50%",
					"y2": "100%",
					"id": getId(8),
					"data-allow-mismatch": "attribute"
				}, [renderStops("#EAEDF1", "#DCDEE0")])]),
				renderBuilding(),
				renderCloud(),
				renderShadow("c"),
				(0, vue.createVNode)("path", {
					"d": "m59 60 21 21 21-21h3l9 9v3L92 93l21 21v3l-9 9h-3l-21-21-21 21h-3l-9-9v-3l21-21-21-21v-3l9-9h3Z",
					"fill": getUrlById(8),
					"data-allow-mismatch": "attribute"
				}, null)
			]);
			const renderSearch = () => (0, vue.createVNode)("svg", { "viewBox": "0 0 160 160" }, [
				(0, vue.createVNode)("defs", { "data-allow-mismatch": "children" }, [
					(0, vue.createVNode)("linearGradient", {
						"x1": "50%",
						"y1": "100%",
						"x2": "50%",
						"id": getId(9)
					}, [renderStops("#EEE", "#D8D8D8")]),
					(0, vue.createVNode)("linearGradient", {
						"x1": "100%",
						"y1": "50%",
						"y2": "50%",
						"id": getId(10)
					}, [renderStops("#F2F3F5", "#DCDEE0")]),
					(0, vue.createVNode)("linearGradient", {
						"x1": "50%",
						"x2": "50%",
						"y2": "100%",
						"id": getId(11)
					}, [renderStops("#F2F3F5", "#DCDEE0")]),
					(0, vue.createVNode)("linearGradient", {
						"x1": "50%",
						"x2": "50%",
						"y2": "100%",
						"id": getId(12)
					}, [renderStops("#FFF", "#F7F8FA")])
				]),
				renderBuilding(),
				renderCloud(),
				renderShadow("d"),
				(0, vue.createVNode)("g", {
					"transform": "rotate(-45 113 -4)",
					"fill": "none",
					"data-allow-mismatch": "children"
				}, [
					(0, vue.createVNode)("rect", {
						"fill": getUrlById(9),
						"x": "24",
						"y": "52.8",
						"width": "5.8",
						"height": "19",
						"rx": "1"
					}, null),
					(0, vue.createVNode)("rect", {
						"fill": getUrlById(10),
						"x": "22.1",
						"y": "67.3",
						"width": "9.9",
						"height": "28",
						"rx": "1"
					}, null),
					(0, vue.createVNode)("circle", {
						"stroke": getUrlById(11),
						"stroke-width": "8",
						"cx": "27",
						"cy": "27",
						"r": "27"
					}, null),
					(0, vue.createVNode)("circle", {
						"fill": getUrlById(12),
						"cx": "27",
						"cy": "27",
						"r": "16"
					}, null),
					(0, vue.createVNode)("path", {
						"d": "M37 7c-8 0-15 5-16 12",
						"stroke": getUrlById(11),
						"stroke-width": "3",
						"opacity": ".5",
						"stroke-linecap": "round",
						"transform": "rotate(45 29 13)"
					}, null)
				])
			]);
			const renderImage = () => {
				var _a;
				if (slots.image) return slots.image();
				const PRESET_IMAGES = {
					error: renderError,
					search: renderSearch,
					network: renderNetwork,
					default: renderMaterial
				};
				return ((_a = PRESET_IMAGES[props.image]) == null ? void 0 : _a.call(PRESET_IMAGES)) || (0, vue.createVNode)("img", { "src": props.image }, null);
			};
			return () => (0, vue.createVNode)("div", { "class": bem$10() }, [
				(0, vue.createVNode)("div", {
					"class": bem$10("image"),
					"style": getSizeStyle(props.imageSize)
				}, [renderImage()]),
				renderDescription(),
				renderBottom()
			]);
		}
	}));
	var [name$8, bem$9, t$2] = createNamespace("dialog");
	var dialogProps = extend({}, popupSharedProps, {
		title: String,
		theme: String,
		width: numericProp,
		message: [String, Function],
		callback: Function,
		allowHtml: Boolean,
		className: null,
		transition: makeStringProp("van-dialog-bounce"),
		messageAlign: String,
		closeOnPopstate: truthProp,
		showCancelButton: Boolean,
		cancelButtonText: String,
		cancelButtonColor: String,
		cancelButtonDisabled: Boolean,
		confirmButtonText: String,
		confirmButtonColor: String,
		confirmButtonDisabled: Boolean,
		showConfirmButton: truthProp,
		closeOnClickOverlay: Boolean,
		keyboardEnabled: truthProp,
		destroyOnClose: Boolean
	});
	var popupInheritKeys = [
		...popupSharedPropKeys,
		"transition",
		"closeOnPopstate",
		"destroyOnClose"
	];
	var stdin_default$10 = (0, vue.defineComponent)({
		name: name$8,
		props: dialogProps,
		emits: [
			"confirm",
			"cancel",
			"keydown",
			"update:show"
		],
		setup(props, { emit, slots }) {
			const root = (0, vue.ref)();
			const loading = (0, vue.reactive)({
				confirm: false,
				cancel: false
			});
			const updateShow = (value) => emit("update:show", value);
			const close = (action) => {
				var _a;
				updateShow(false);
				(_a = props.callback) == null || _a.call(props, action);
			};
			const getActionHandler = (action) => () => {
				if (!props.show) return;
				emit(action);
				if (props.beforeClose) {
					loading[action] = true;
					callInterceptor(props.beforeClose, {
						args: [action],
						done() {
							close(action);
							loading[action] = false;
						},
						canceled() {
							loading[action] = false;
						}
					});
				} else close(action);
			};
			const onCancel = getActionHandler("cancel");
			const onConfirm = getActionHandler("confirm");
			const onKeydown = (0, vue.withKeys)((event) => {
				var _a, _b;
				if (!props.keyboardEnabled) return;
				if (event.target !== ((_b = (_a = root.value) == null ? void 0 : _a.popupRef) == null ? void 0 : _b.value)) return;
				({
					Enter: props.showConfirmButton ? onConfirm : noop,
					Escape: props.showCancelButton ? onCancel : noop
				})[event.key]();
				emit("keydown", event);
			}, ["enter", "esc"]);
			const renderTitle = () => {
				const title = slots.title ? slots.title() : props.title;
				if (title) return (0, vue.createVNode)("div", { "class": bem$9("header", { isolated: !props.message && !slots.default }) }, [title]);
			};
			const renderMessage = (hasTitle) => {
				const { message, allowHtml, messageAlign } = props;
				const classNames = bem$9("message", {
					"has-title": hasTitle,
					[messageAlign]: messageAlign
				});
				const content = isFunction(message) ? message() : message;
				if (allowHtml && typeof content === "string") return (0, vue.createVNode)("div", {
					"class": classNames,
					"innerHTML": content
				}, null);
				return (0, vue.createVNode)("div", { "class": classNames }, [content]);
			};
			const renderContent = () => {
				if (slots.default) return (0, vue.createVNode)("div", { "class": bem$9("content") }, [slots.default()]);
				const { title, message, allowHtml } = props;
				if (message) {
					const hasTitle = !!(title || slots.title);
					return (0, vue.createVNode)("div", {
						"key": allowHtml ? 1 : 0,
						"class": bem$9("content", { isolated: !hasTitle })
					}, [renderMessage(hasTitle)]);
				}
			};
			const renderButtons = () => (0, vue.createVNode)("div", { "class": [BORDER_TOP, bem$9("footer")] }, [props.showCancelButton && (0, vue.createVNode)(Button, {
				"size": "large",
				"text": props.cancelButtonText || t$2("cancel"),
				"class": bem$9("cancel"),
				"style": { color: props.cancelButtonColor },
				"loading": loading.cancel,
				"disabled": props.cancelButtonDisabled,
				"onClick": onCancel
			}, null), props.showConfirmButton && (0, vue.createVNode)(Button, {
				"size": "large",
				"text": props.confirmButtonText || t$2("confirm"),
				"class": [bem$9("confirm"), { [BORDER_LEFT]: props.showCancelButton }],
				"style": { color: props.confirmButtonColor },
				"loading": loading.confirm,
				"disabled": props.confirmButtonDisabled,
				"onClick": onConfirm
			}, null)]);
			const renderRoundButtons = () => (0, vue.createVNode)(ActionBar, { "class": bem$9("footer") }, { default: () => [props.showCancelButton && (0, vue.createVNode)(ActionBarButton, {
				"type": "warning",
				"text": props.cancelButtonText || t$2("cancel"),
				"class": bem$9("cancel"),
				"color": props.cancelButtonColor,
				"loading": loading.cancel,
				"disabled": props.cancelButtonDisabled,
				"onClick": onCancel
			}, null), props.showConfirmButton && (0, vue.createVNode)(ActionBarButton, {
				"type": "danger",
				"text": props.confirmButtonText || t$2("confirm"),
				"class": bem$9("confirm"),
				"color": props.confirmButtonColor,
				"loading": loading.confirm,
				"disabled": props.confirmButtonDisabled,
				"onClick": onConfirm
			}, null)] });
			const renderFooter = () => {
				if (slots.footer) return slots.footer();
				return props.theme === "round-button" ? renderRoundButtons() : renderButtons();
			};
			return () => {
				const { width, title, theme, message, className } = props;
				return (0, vue.createVNode)(Popup, (0, vue.mergeProps)({
					"ref": root,
					"role": "dialog",
					"class": [bem$9([theme]), className],
					"style": { width: addUnit(width) },
					"tabindex": 0,
					"aria-labelledby": title || message,
					"onKeydown": onKeydown,
					"onUpdate:show": updateShow
				}, pick(props, popupInheritKeys)), { default: () => [
					renderTitle(),
					renderContent(),
					renderFooter()
				] });
			};
		}
	});
	var instance$2;
	var currentOptions$1 = extend({}, {
		title: "",
		width: "",
		theme: null,
		message: "",
		overlay: true,
		callback: null,
		teleport: "body",
		className: "",
		allowHtml: false,
		lockScroll: true,
		transition: void 0,
		beforeClose: null,
		overlayClass: "",
		overlayStyle: void 0,
		messageAlign: "",
		cancelButtonText: "",
		cancelButtonColor: null,
		cancelButtonDisabled: false,
		confirmButtonText: "",
		confirmButtonColor: null,
		confirmButtonDisabled: false,
		showConfirmButton: true,
		showCancelButton: false,
		closeOnPopstate: true,
		closeOnClickOverlay: false,
		destroyOnClose: false
	});
	function initInstance$2() {
		const Wrapper = { setup() {
			const { state, toggle } = usePopupState();
			return () => (0, vue.createVNode)(stdin_default$10, (0, vue.mergeProps)(state, { "onUpdate:show": toggle }), null);
		} };
		({instance: instance$2} = mountComponent(Wrapper));
	}
	function showDialog(options) {
		if (!inBrowser$1) return Promise.resolve(void 0);
		return new Promise((resolve, reject) => {
			if (!instance$2) initInstance$2();
			instance$2.open(extend({}, currentOptions$1, options, { callback: (action) => {
				(action === "confirm" ? resolve : reject)(action);
			} }));
		});
	}
	var showConfirmDialog = (options) => showDialog(extend({ showCancelButton: true }, options));
	var Dialog = withInstall(stdin_default$10);
	var floatingBubbleProps = {
		gap: {
			type: [Number, Object],
			default: 24
		},
		icon: String,
		axis: makeStringProp("y"),
		magnetic: String,
		offset: Object,
		teleport: {
			type: [String, Object],
			default: "body"
		}
	};
	var [name$7, bem$8] = createNamespace("floating-bubble");
	var FloatingBubble = withInstall((0, vue.defineComponent)({
		name: name$7,
		inheritAttrs: false,
		props: floatingBubbleProps,
		emits: [
			"click",
			"update:offset",
			"offsetChange"
		],
		setup(props, { slots, emit, attrs }) {
			const rootRef = (0, vue.ref)();
			const state = (0, vue.ref)({
				x: 0,
				y: 0,
				width: 0,
				height: 0
			});
			const gapX = (0, vue.computed)(() => isObject$1(props.gap) ? props.gap.x : props.gap);
			const gapY = (0, vue.computed)(() => isObject$1(props.gap) ? props.gap.y : props.gap);
			const boundary = (0, vue.computed)(() => ({
				top: gapY.value,
				right: windowWidth.value - state.value.width - gapX.value,
				bottom: windowHeight.value - state.value.height - gapY.value,
				left: gapX.value
			}));
			const dragging = (0, vue.ref)(false);
			let initialized = false;
			const rootStyle = (0, vue.computed)(() => {
				const style = {};
				style.transform = `translate3d(${addUnit(state.value.x)}, ${addUnit(state.value.y)}, 0)`;
				if (dragging.value || !initialized) style.transition = "none";
				return style;
			});
			const updateState = () => {
				if (!show.value) return;
				const { width, height } = useRect(rootRef.value);
				const { offset } = props;
				state.value = {
					x: offset ? offset.x : windowWidth.value - width - gapX.value,
					y: offset ? offset.y : windowHeight.value - height - gapY.value,
					width,
					height
				};
			};
			const touch = useTouch();
			let prevX = 0;
			let prevY = 0;
			const onTouchStart = (e) => {
				touch.start(e);
				dragging.value = true;
				prevX = state.value.x;
				prevY = state.value.y;
			};
			const onTouchMove = (e) => {
				e.preventDefault();
				touch.move(e);
				if (props.axis === "lock") return;
				if (!touch.isTap.value) {
					if (props.axis === "x" || props.axis === "xy") {
						let nextX = prevX + touch.deltaX.value;
						if (nextX < boundary.value.left) nextX = boundary.value.left;
						if (nextX > boundary.value.right) nextX = boundary.value.right;
						state.value.x = nextX;
					}
					if (props.axis === "y" || props.axis === "xy") {
						let nextY = prevY + touch.deltaY.value;
						if (nextY < boundary.value.top) nextY = boundary.value.top;
						if (nextY > boundary.value.bottom) nextY = boundary.value.bottom;
						state.value.y = nextY;
					}
					emit("update:offset", pick(state.value, ["x", "y"]));
				}
			};
			useEventListener("touchmove", onTouchMove, { target: rootRef });
			const onTouchEnd = () => {
				dragging.value = false;
				(0, vue.nextTick)(() => {
					if (props.magnetic === "x") {
						const nextX = closest([boundary.value.left, boundary.value.right], state.value.x);
						state.value.x = nextX;
					}
					if (props.magnetic === "y") {
						const nextY = closest([boundary.value.top, boundary.value.bottom], state.value.y);
						state.value.y = nextY;
					}
					if (!touch.isTap.value) {
						const offset = pick(state.value, ["x", "y"]);
						emit("update:offset", offset);
						if (prevX !== offset.x || prevY !== offset.y) emit("offsetChange", offset);
					}
				});
			};
			const onClick = (e) => {
				if (touch.isTap.value) emit("click", e);
				else e.stopPropagation();
			};
			(0, vue.onMounted)(() => {
				updateState();
				(0, vue.nextTick)(() => {
					initialized = true;
				});
			});
			(0, vue.watch)([
				windowWidth,
				windowHeight,
				gapX,
				gapY,
				() => props.offset
			], updateState, { deep: true });
			const show = (0, vue.ref)(true);
			(0, vue.onActivated)(() => {
				show.value = true;
			});
			(0, vue.onDeactivated)(() => {
				if (props.teleport) show.value = false;
			});
			return () => {
				const Content = (0, vue.withDirectives)((0, vue.createVNode)("div", (0, vue.mergeProps)({
					"class": bem$8(),
					"ref": rootRef,
					"onTouchstartPassive": onTouchStart,
					"onTouchend": onTouchEnd,
					"onTouchcancel": onTouchEnd,
					"onClickCapture": onClick,
					"style": rootStyle.value
				}, attrs), [slots.default ? slots.default() : (0, vue.createVNode)(stdin_default$32, {
					"name": props.icon,
					"class": bem$8("icon")
				}, null)]), [[vue.vShow, show.value]]);
				return props.teleport ? (0, vue.createVNode)(vue.Teleport, { "to": props.teleport }, { default: () => [Content] }) : Content;
			};
		}
	}));
	var getDistance = (touches) => Math.sqrt((touches[0].clientX - touches[1].clientX) ** 2 + (touches[0].clientY - touches[1].clientY) ** 2);
	var getCenter = (touches) => ({
		x: (touches[0].clientX + touches[1].clientX) / 2,
		y: (touches[0].clientY + touches[1].clientY) / 2
	});
	var bem$7 = createNamespace("image-preview")[1];
	var longImageRatio = 2.6;
	var imagePreviewItemProps = {
		src: String,
		show: Boolean,
		active: Number,
		minZoom: makeRequiredProp(numericProp),
		maxZoom: makeRequiredProp(numericProp),
		rootWidth: makeRequiredProp(Number),
		rootHeight: makeRequiredProp(Number),
		disableZoom: Boolean,
		doubleScale: Boolean,
		closeOnClickImage: Boolean,
		closeOnClickOverlay: Boolean,
		vertical: Boolean
	};
	var stdin_default$8 = (0, vue.defineComponent)({
		props: imagePreviewItemProps,
		emits: [
			"scale",
			"close",
			"longPress"
		],
		setup(props, { emit, slots }) {
			const state = (0, vue.reactive)({
				scale: 1,
				moveX: 0,
				moveY: 0,
				moving: false,
				zooming: false,
				initializing: false,
				imageRatio: 0
			});
			const touch = useTouch();
			const imageRef = (0, vue.ref)();
			const swipeItem = (0, vue.ref)();
			const vertical = (0, vue.ref)(false);
			const isLongImage = (0, vue.ref)(false);
			let initialMoveY = 0;
			const imageStyle = (0, vue.computed)(() => {
				const { scale, moveX, moveY, moving, zooming, initializing } = state;
				const style = { transitionDuration: zooming || moving || initializing ? "0s" : ".3s" };
				if (scale !== 1 || isLongImage.value) style.transform = `matrix(${scale}, 0, 0, ${scale}, ${moveX}, ${moveY})`;
				return style;
			});
			const maxMoveX = (0, vue.computed)(() => {
				if (state.imageRatio) {
					const { rootWidth, rootHeight } = props;
					const displayWidth = vertical.value ? rootHeight / state.imageRatio : rootWidth;
					return Math.max(0, (state.scale * displayWidth - rootWidth) / 2);
				}
				return 0;
			});
			const maxMoveY = (0, vue.computed)(() => {
				if (state.imageRatio) {
					const { rootWidth, rootHeight } = props;
					const displayHeight = vertical.value ? rootHeight : rootWidth * state.imageRatio;
					return Math.max(0, (state.scale * displayHeight - rootHeight) / 2);
				}
				return 0;
			});
			const setScale = (scale, center) => {
				var _a;
				scale = clamp(scale, +props.minZoom, +props.maxZoom + 1);
				if (scale !== state.scale) {
					const ratio = scale / state.scale;
					state.scale = scale;
					if (center) {
						const imageRect = useRect((_a = imageRef.value) == null ? void 0 : _a.$el);
						const origin = {
							x: imageRect.width * .5,
							y: imageRect.height * .5
						};
						const moveX = state.moveX - (center.x - imageRect.left - origin.x) * (ratio - 1);
						const moveY = state.moveY - (center.y - imageRect.top - origin.y) * (ratio - 1);
						state.moveX = clamp(moveX, -maxMoveX.value, maxMoveX.value);
						state.moveY = clamp(moveY, -maxMoveY.value, maxMoveY.value);
					} else {
						state.moveX = 0;
						state.moveY = isLongImage.value ? initialMoveY : 0;
					}
					emit("scale", {
						scale,
						index: props.active
					});
				}
			};
			const resetScale = () => {
				setScale(1);
			};
			const toggleScale = () => {
				const scale = state.scale > 1 ? 1 : 2;
				setScale(scale, scale === 2 || isLongImage.value ? {
					x: touch.startX.value,
					y: touch.startY.value
				} : void 0);
			};
			let fingerNum;
			let startMoveX;
			let startMoveY;
			let startScale;
			let startDistance;
			let lastCenter;
			let doubleTapTimer;
			let touchStartTime;
			let isImageMoved = false;
			const onTouchStart = (event) => {
				const { touches } = event;
				fingerNum = touches.length;
				if (fingerNum === 2 && props.disableZoom) return;
				const { offsetX } = touch;
				touch.start(event);
				startMoveX = state.moveX;
				startMoveY = state.moveY;
				touchStartTime = Date.now();
				isImageMoved = false;
				state.moving = fingerNum === 1 && (state.scale !== 1 || isLongImage.value);
				state.zooming = fingerNum === 2 && !offsetX.value;
				if (state.zooming) {
					startScale = state.scale;
					startDistance = getDistance(touches);
				}
			};
			const onTouchMove = (event) => {
				const { touches } = event;
				touch.move(event);
				if (state.moving) {
					const { deltaX, deltaY } = touch;
					const moveX = deltaX.value + startMoveX;
					const moveY = deltaY.value + startMoveY;
					if ((props.vertical ? touch.isVertical() && Math.abs(moveY) > maxMoveY.value : touch.isHorizontal() && Math.abs(moveX) > maxMoveX.value) && !isImageMoved) {
						state.moving = false;
						return;
					}
					isImageMoved = true;
					preventDefault(event, true);
					state.moveX = clamp(moveX, -maxMoveX.value, maxMoveX.value);
					state.moveY = clamp(moveY, -maxMoveY.value, maxMoveY.value);
				}
				if (state.zooming) {
					preventDefault(event, true);
					if (touches.length === 2) {
						const distance = getDistance(touches);
						const scale = startScale * distance / startDistance;
						lastCenter = getCenter(touches);
						setScale(scale, lastCenter);
					}
				}
			};
			const checkClose = (event) => {
				var _a;
				const swipeItemEl = (_a = swipeItem.value) == null ? void 0 : _a.$el;
				if (!swipeItemEl) return;
				const imageEl = swipeItemEl.firstElementChild;
				const isClickOverlay = event.target === swipeItemEl;
				const isClickImage = imageEl == null ? void 0 : imageEl.contains(event.target);
				if (!props.closeOnClickImage && isClickImage) return;
				if (!props.closeOnClickOverlay && isClickOverlay) return;
				emit("close");
			};
			const checkTap = (event) => {
				if (fingerNum > 1) return;
				const deltaTime = Date.now() - touchStartTime;
				const TAP_TIME = 250;
				if (touch.isTap.value) {
					if (deltaTime < TAP_TIME) {
						if (props.doubleScale) {
							if (doubleTapTimer) {
								clearTimeout(doubleTapTimer);
								doubleTapTimer = null;
								toggleScale();
							} else doubleTapTimer = setTimeout(() => {
								checkClose(event);
								doubleTapTimer = null;
							}, TAP_TIME);
						} else checkClose(event);
					} else if (deltaTime > 500) emit("longPress");
				}
			};
			const onTouchEnd = (event) => {
				let stopPropagation = false;
				if (state.moving || state.zooming) {
					stopPropagation = true;
					if (state.moving && startMoveX === state.moveX && startMoveY === state.moveY) stopPropagation = false;
					if (!event.touches.length) {
						if (state.zooming) {
							state.moveX = clamp(state.moveX, -maxMoveX.value, maxMoveX.value);
							state.moveY = clamp(state.moveY, -maxMoveY.value, maxMoveY.value);
							state.zooming = false;
						}
						state.moving = false;
						startMoveX = 0;
						startMoveY = 0;
						startScale = 1;
						if (state.scale < 1) resetScale();
						const maxZoom = +props.maxZoom;
						if (state.scale > maxZoom) setScale(maxZoom, lastCenter);
					}
				}
				preventDefault(event, stopPropagation);
				checkTap(event);
				touch.reset();
			};
			const resize = () => {
				const { rootWidth, rootHeight } = props;
				const rootRatio = rootHeight / rootWidth;
				const { imageRatio } = state;
				vertical.value = state.imageRatio > rootRatio && imageRatio < longImageRatio;
				isLongImage.value = state.imageRatio > rootRatio && imageRatio >= longImageRatio;
				if (isLongImage.value) {
					initialMoveY = (imageRatio * rootWidth - rootHeight) / 2;
					state.moveY = initialMoveY;
					state.initializing = true;
					raf(() => {
						state.initializing = false;
					});
				}
				resetScale();
			};
			const onLoad = (event) => {
				const { naturalWidth, naturalHeight } = event.target;
				state.imageRatio = naturalHeight / naturalWidth;
				resize();
			};
			(0, vue.watch)(() => props.active, resetScale);
			(0, vue.watch)(() => props.show, (value) => {
				if (!value) resetScale();
			});
			(0, vue.watch)(() => [props.rootWidth, props.rootHeight], resize);
			useEventListener("touchmove", onTouchMove, { target: (0, vue.computed)(() => {
				var _a;
				return (_a = swipeItem.value) == null ? void 0 : _a.$el;
			}) });
			useExpose({ resetScale });
			return () => {
				const imageSlots = { loading: () => (0, vue.createVNode)(Loading, { "type": "spinner" }, null) };
				return (0, vue.createVNode)(SwipeItem, {
					"ref": swipeItem,
					"class": bem$7("swipe-item"),
					"onTouchstartPassive": onTouchStart,
					"onTouchend": onTouchEnd,
					"onTouchcancel": onTouchEnd
				}, { default: () => [slots.image ? (0, vue.createVNode)("div", { "class": bem$7("image-wrap") }, [slots.image({
					src: props.src,
					onLoad,
					style: imageStyle.value
				})]) : (0, vue.createVNode)(Image, {
					"ref": imageRef,
					"src": props.src,
					"fit": "contain",
					"class": bem$7("image", { vertical: vertical.value }),
					"style": imageStyle.value,
					"onLoad": onLoad
				}, imageSlots)] });
			};
		}
	});
	var [name$6, bem$6] = createNamespace("image-preview");
	var popupProps = [
		"show",
		"teleport",
		"transition",
		"overlayStyle",
		"closeOnPopstate"
	];
	var imagePreviewProps = {
		show: Boolean,
		loop: truthProp,
		images: makeArrayProp(),
		minZoom: makeNumericProp(1 / 3),
		maxZoom: makeNumericProp(3),
		overlay: truthProp,
		vertical: Boolean,
		closeable: Boolean,
		showIndex: truthProp,
		className: null,
		closeIcon: makeStringProp("clear"),
		transition: String,
		beforeClose: Function,
		doubleScale: truthProp,
		overlayClass: null,
		overlayStyle: Object,
		swipeDuration: makeNumericProp(300),
		startPosition: makeNumericProp(0),
		showIndicators: Boolean,
		closeOnPopstate: truthProp,
		closeOnClickImage: truthProp,
		closeOnClickOverlay: truthProp,
		closeIconPosition: makeStringProp("top-right"),
		teleport: [String, Object]
	};
	var stdin_default$7 = (0, vue.defineComponent)({
		name: name$6,
		props: imagePreviewProps,
		emits: [
			"scale",
			"close",
			"closed",
			"change",
			"longPress",
			"update:show"
		],
		setup(props, { emit, slots }) {
			const swipeRef = (0, vue.ref)();
			const activedPreviewItemRef = (0, vue.ref)();
			const state = (0, vue.reactive)({
				active: 0,
				rootWidth: 0,
				rootHeight: 0,
				disableZoom: false
			});
			const resize = () => {
				if (swipeRef.value) {
					const rect = useRect(swipeRef.value.$el);
					state.rootWidth = rect.width;
					state.rootHeight = rect.height;
					swipeRef.value.resize();
				}
			};
			const emitScale = (args) => emit("scale", args);
			const updateShow = (show) => emit("update:show", show);
			const emitClose = () => {
				callInterceptor(props.beforeClose, {
					args: [state.active],
					done: () => updateShow(false)
				});
			};
			const setActive = (active) => {
				if (active !== state.active) {
					state.active = active;
					emit("change", active);
				}
			};
			const renderIndex = () => {
				if (props.showIndex) return (0, vue.createVNode)("div", { "class": bem$6("index") }, [slots.index ? slots.index({ index: state.active }) : `${state.active + 1} / ${props.images.length}`]);
			};
			const renderCover = () => {
				if (slots.cover) return (0, vue.createVNode)("div", { "class": bem$6("cover") }, [slots.cover()]);
			};
			const onDragStart = () => {
				state.disableZoom = true;
			};
			const onDragEnd = () => {
				state.disableZoom = false;
			};
			const renderImages = () => (0, vue.createVNode)(Swipe, {
				"ref": swipeRef,
				"lazyRender": true,
				"loop": props.loop,
				"class": bem$6("swipe"),
				"vertical": props.vertical,
				"duration": props.swipeDuration,
				"initialSwipe": props.startPosition,
				"showIndicators": props.showIndicators,
				"indicatorColor": "white",
				"onChange": setActive,
				"onDragEnd": onDragEnd,
				"onDragStart": onDragStart
			}, { default: () => [props.images.map((image, index) => (0, vue.createVNode)(stdin_default$8, {
				"ref": (item) => {
					if (index === state.active) activedPreviewItemRef.value = item;
				},
				"src": image,
				"show": props.show,
				"active": state.active,
				"maxZoom": props.maxZoom,
				"minZoom": props.minZoom,
				"rootWidth": state.rootWidth,
				"rootHeight": state.rootHeight,
				"disableZoom": state.disableZoom,
				"doubleScale": props.doubleScale,
				"closeOnClickImage": props.closeOnClickImage,
				"closeOnClickOverlay": props.closeOnClickOverlay,
				"vertical": props.vertical,
				"onScale": emitScale,
				"onClose": emitClose,
				"onLongPress": () => emit("longPress", { index })
			}, { image: slots.image }))] });
			const renderClose = () => {
				if (props.closeable) return (0, vue.createVNode)(Icon, {
					"role": "button",
					"name": props.closeIcon,
					"class": [bem$6("close-icon", props.closeIconPosition), HAPTICS_FEEDBACK],
					"onClick": emitClose
				}, null);
			};
			const onClosed = () => emit("closed");
			const prev = () => {
				var _a;
				return (_a = swipeRef.value) == null ? void 0 : _a.prev();
			};
			const next = () => {
				var _a;
				return (_a = swipeRef.value) == null ? void 0 : _a.next();
			};
			const swipeTo = (index, options) => {
				var _a;
				return (_a = swipeRef.value) == null ? void 0 : _a.swipeTo(index, options);
			};
			useExpose({
				resetScale: () => {
					var _a;
					(_a = activedPreviewItemRef.value) == null || _a.resetScale();
				},
				swipeTo,
				prev,
				next
			});
			(0, vue.onMounted)(resize);
			(0, vue.watch)([windowWidth, windowHeight], resize);
			(0, vue.watch)(() => props.startPosition, (value) => setActive(+value));
			(0, vue.watch)(() => props.show, (value) => {
				const { images, startPosition } = props;
				if (value) {
					setActive(+startPosition);
					(0, vue.nextTick)(() => {
						resize();
						swipeTo(+startPosition, { immediate: true });
					});
				} else emit("close", {
					index: state.active,
					url: images[state.active]
				});
			});
			return () => (0, vue.createVNode)(Popup, (0, vue.mergeProps)({
				"class": [bem$6(), props.className],
				"overlayClass": [bem$6("overlay"), props.overlayClass],
				"onClosed": onClosed,
				"onUpdate:show": updateShow
			}, pick(props, popupProps)), { default: () => [
				renderClose(),
				renderImages(),
				renderIndex(),
				renderCover()
			] });
		}
	});
	var instance$1;
	var defaultConfig = {
		loop: true,
		images: [],
		maxZoom: 3,
		minZoom: 1 / 3,
		onScale: void 0,
		onClose: void 0,
		onChange: void 0,
		vertical: false,
		teleport: "body",
		className: "",
		showIndex: true,
		closeable: false,
		closeIcon: "clear",
		transition: void 0,
		beforeClose: void 0,
		doubleScale: true,
		overlayStyle: void 0,
		overlayClass: void 0,
		startPosition: 0,
		swipeDuration: 300,
		showIndicators: false,
		closeOnPopstate: true,
		closeOnClickOverlay: true,
		closeIconPosition: "top-right"
	};
	function initInstance$1() {
		({instance: instance$1} = mountComponent({ setup() {
			const { state, toggle } = usePopupState();
			const onClosed = () => {
				state.images = [];
			};
			return () => (0, vue.createVNode)(stdin_default$7, (0, vue.mergeProps)(state, {
				"onClosed": onClosed,
				"onUpdate:show": toggle
			}), null);
		} }));
	}
	var showImagePreview = (options, startPosition = 0) => {
		if (!inBrowser$1) return;
		if (!instance$1) initInstance$1();
		options = Array.isArray(options) ? {
			images: options,
			startPosition
		} : options;
		instance$1.open(extend({}, defaultConfig, options));
		return instance$1;
	};
	var [name$5, bem$5] = createNamespace("nav-bar");
	var NavBar = withInstall((0, vue.defineComponent)({
		name: name$5,
		props: {
			title: String,
			fixed: Boolean,
			zIndex: numericProp,
			border: truthProp,
			leftText: String,
			rightText: String,
			leftDisabled: Boolean,
			rightDisabled: Boolean,
			leftArrow: Boolean,
			placeholder: Boolean,
			safeAreaInsetTop: Boolean,
			clickable: truthProp
		},
		emits: ["clickLeft", "clickRight"],
		setup(props, { emit, slots }) {
			const navBarRef = (0, vue.ref)();
			const renderPlaceholder = usePlaceholder(navBarRef, bem$5);
			const onClickLeft = (event) => {
				if (!props.leftDisabled) emit("clickLeft", event);
			};
			const onClickRight = (event) => {
				if (!props.rightDisabled) emit("clickRight", event);
			};
			const renderLeft = () => {
				if (slots.left) return slots.left();
				return [props.leftArrow && (0, vue.createVNode)(Icon, {
					"class": bem$5("arrow"),
					"name": "arrow-left"
				}, null), props.leftText && (0, vue.createVNode)("span", { "class": bem$5("text") }, [props.leftText])];
			};
			const renderRight = () => {
				if (slots.right) return slots.right();
				return (0, vue.createVNode)("span", { "class": bem$5("text") }, [props.rightText]);
			};
			const renderNavBar = () => {
				const { title, fixed, border, zIndex } = props;
				const style = getZIndexStyle(zIndex);
				const hasLeft = props.leftArrow || props.leftText || slots.left;
				const hasRight = props.rightText || slots.right;
				return (0, vue.createVNode)("div", {
					"ref": navBarRef,
					"style": style,
					"class": [bem$5({ fixed }), {
						[BORDER_BOTTOM]: border,
						"van-safe-area-top": props.safeAreaInsetTop
					}]
				}, [(0, vue.createVNode)("div", { "class": bem$5("content") }, [
					hasLeft && (0, vue.createVNode)("div", {
						"class": [bem$5("left", { disabled: props.leftDisabled }), props.clickable && !props.leftDisabled ? "van-haptics-feedback" : ""],
						"onClick": onClickLeft
					}, [renderLeft()]),
					(0, vue.createVNode)("div", { "class": [bem$5("title"), "van-ellipsis"] }, [slots.title ? slots.title() : title]),
					hasRight && (0, vue.createVNode)("div", {
						"class": [bem$5("right", { disabled: props.rightDisabled }), props.clickable && !props.rightDisabled ? "van-haptics-feedback" : ""],
						"onClick": onClickRight
					}, [renderRight()])
				])]);
			};
			return () => {
				if (props.fixed && props.placeholder) return renderPlaceholder(renderNavBar);
				return renderNavBar();
			};
		}
	}));
	var [name$4, bem$4] = createNamespace("notify");
	var popupInheritProps = [
		"lockScroll",
		"position",
		"show",
		"teleport",
		"zIndex"
	];
	var notifyProps = extend({}, popupSharedProps, {
		type: makeStringProp("danger"),
		color: String,
		message: numericProp,
		position: makeStringProp("top"),
		className: null,
		background: String,
		lockScroll: Boolean
	});
	var stdin_default$5 = (0, vue.defineComponent)({
		name: name$4,
		props: notifyProps,
		emits: ["update:show"],
		setup(props, { emit, slots }) {
			const updateShow = (show) => emit("update:show", show);
			return () => (0, vue.createVNode)(Popup, (0, vue.mergeProps)({
				"class": [bem$4([props.type]), props.className],
				"style": {
					color: props.color,
					background: props.background
				},
				"overlay": false,
				"duration": .2,
				"onUpdate:show": updateShow
			}, pick(props, popupInheritProps)), { default: () => [slots.default ? slots.default() : props.message] });
		}
	});
	var timer;
	var instance;
	var parseOptions = (message) => isObject$1(message) ? message : { message };
	function initInstance() {
		({instance} = mountComponent({ setup() {
			const { state, toggle } = usePopupState();
			return () => (0, vue.createVNode)(stdin_default$5, (0, vue.mergeProps)(state, { "onUpdate:show": toggle }), null);
		} }));
	}
	var getDefaultOptions = () => ({
		type: "danger",
		color: void 0,
		message: "",
		onClose: void 0,
		onClick: void 0,
		onOpened: void 0,
		duration: 3e3,
		position: void 0,
		className: "",
		lockScroll: false,
		background: void 0
	});
	var currentOptions = getDefaultOptions();
	var closeNotify = () => {
		if (instance) instance.toggle(false);
	};
	function showNotify(options) {
		if (!inBrowser$1) return;
		if (!instance) initInstance();
		options = extend({}, currentOptions, parseOptions(options));
		instance.open(options);
		clearTimeout(timer);
		if (options.duration > 0) timer = setTimeout(closeNotify, options.duration);
		return instance;
	}
	var [name$3, bem$3, t$1] = createNamespace("search");
	var searchProps = extend({}, fieldSharedProps, {
		label: String,
		shape: makeStringProp("square"),
		leftIcon: makeStringProp("search"),
		clearable: truthProp,
		actionText: String,
		background: String,
		showAction: Boolean
	});
	var Search = withInstall((0, vue.defineComponent)({
		name: name$3,
		props: searchProps,
		emits: [
			"blur",
			"focus",
			"clear",
			"search",
			"cancel",
			"clickInput",
			"clickLeftIcon",
			"clickRightIcon",
			"update:modelValue"
		],
		setup(props, { emit, slots, attrs }) {
			const id = useId();
			const fieldRef = (0, vue.ref)();
			const onCancel = () => {
				if (!slots.action) {
					emit("update:modelValue", "");
					emit("cancel");
				}
			};
			const onKeypress = (event) => {
				if (event.keyCode === 13) {
					preventDefault(event);
					emit("search", props.modelValue);
				}
			};
			const getInputId = () => props.id || `${id}-input`;
			const renderLabel = () => {
				if (slots.label || props.label) return (0, vue.createVNode)("label", {
					"class": bem$3("label"),
					"for": getInputId(),
					"data-allow-mismatch": "attribute"
				}, [slots.label ? slots.label() : props.label]);
			};
			const renderAction = () => {
				if (props.showAction) {
					const text = props.actionText || t$1("cancel");
					return (0, vue.createVNode)("div", {
						"class": bem$3("action"),
						"role": "button",
						"tabindex": 0,
						"onClick": onCancel
					}, [slots.action ? slots.action() : text]);
				}
			};
			const blur = () => {
				var _a;
				return (_a = fieldRef.value) == null ? void 0 : _a.blur();
			};
			const focus = () => {
				var _a;
				return (_a = fieldRef.value) == null ? void 0 : _a.focus();
			};
			const onBlur = (event) => emit("blur", event);
			const onFocus = (event) => emit("focus", event);
			const onClear = (event) => emit("clear", event);
			const onClickInput = (event) => emit("clickInput", event);
			const onClickLeftIcon = (event) => emit("clickLeftIcon", event);
			const onClickRightIcon = (event) => emit("clickRightIcon", event);
			const fieldPropNames = Object.keys(fieldSharedProps);
			const renderField = () => {
				const fieldAttrs = extend({}, attrs, pick(props, fieldPropNames), { id: getInputId() });
				const onInput = (value) => emit("update:modelValue", value);
				return (0, vue.createVNode)(Field, (0, vue.mergeProps)({
					"ref": fieldRef,
					"type": "search",
					"class": bem$3("field", { "with-message": fieldAttrs.errorMessage }),
					"border": false,
					"labelAlign": "left",
					"onBlur": onBlur,
					"onFocus": onFocus,
					"onClear": onClear,
					"onKeypress": onKeypress,
					"onClickInput": onClickInput,
					"onClickLeftIcon": onClickLeftIcon,
					"onClickRightIcon": onClickRightIcon,
					"onUpdate:modelValue": onInput
				}, fieldAttrs), pick(slots, ["left-icon", "right-icon"]));
			};
			useExpose({
				focus,
				blur
			});
			return () => {
				var _a;
				return (0, vue.createVNode)("div", {
					"class": bem$3({ "show-action": props.showAction }),
					"style": { background: props.background }
				}, [
					(_a = slots.left) == null ? void 0 : _a.call(slots),
					(0, vue.createVNode)("div", { "class": bem$3("content", props.shape) }, [renderLabel(), renderField()]),
					renderAction()
				]);
			};
		}
	}));
	var [name$2, bem$2] = createNamespace("sidebar");
	var SIDEBAR_KEY = Symbol(name$2);
	var sidebarProps = { modelValue: makeNumericProp(0) };
	var Sidebar = withInstall((0, vue.defineComponent)({
		name: name$2,
		props: sidebarProps,
		emits: ["change", "update:modelValue"],
		setup(props, { emit, slots }) {
			const { linkChildren } = useChildren(SIDEBAR_KEY);
			const getActive = () => +props.modelValue;
			const setActive = (value) => {
				if (value !== getActive()) {
					emit("update:modelValue", value);
					emit("change", value);
				}
			};
			linkChildren({
				getActive,
				setActive
			});
			return () => {
				var _a;
				return (0, vue.createVNode)("div", {
					"role": "tablist",
					"class": bem$2()
				}, [(_a = slots.default) == null ? void 0 : _a.call(slots)]);
			};
		}
	}));
	var [name$1, bem$1] = createNamespace("sidebar-item");
	var sidebarItemProps = extend({}, routeProps, {
		dot: Boolean,
		title: String,
		badge: numericProp,
		disabled: Boolean,
		badgeProps: Object
	});
	var SidebarItem = withInstall((0, vue.defineComponent)({
		name: name$1,
		props: sidebarItemProps,
		emits: ["click"],
		setup(props, { emit, slots }) {
			const route = useRoute();
			const { parent, index } = useParent(SIDEBAR_KEY);
			if (!parent) return;
			const onClick = () => {
				if (props.disabled) return;
				emit("click", index.value);
				parent.setActive(index.value);
				route();
			};
			return () => {
				const { dot, badge, title, disabled } = props;
				const selected = index.value === parent.getActive();
				return (0, vue.createVNode)("div", {
					"role": "tab",
					"class": bem$1({
						select: selected,
						disabled
					}),
					"tabindex": disabled ? void 0 : 0,
					"aria-selected": selected,
					"onClick": onClick
				}, [(0, vue.createVNode)(Badge, (0, vue.mergeProps)({
					"dot": dot,
					"class": bem$1("text"),
					"content": badge
				}, props.badgeProps), { default: () => [slots.title ? slots.title() : title] })]);
			};
		}
	}));
	var [name, bem, t] = createNamespace("uploader");
	function readFileContent(file, resultType) {
		return new Promise((resolve) => {
			if (resultType === "file") {
				resolve();
				return;
			}
			const reader = new FileReader();
			reader.onload = (event) => {
				resolve(event.target.result);
			};
			if (resultType === "dataUrl") reader.readAsDataURL(file);
			else if (resultType === "text") reader.readAsText(file);
		});
	}
	function isOversize(items, maxSize) {
		return toArray(items).some((item) => {
			if (item.file) {
				if (isFunction(maxSize)) return maxSize(item.file);
				return item.file.size > +maxSize;
			}
			return false;
		});
	}
	function filterFiles(items, maxSize) {
		const valid = [];
		const invalid = [];
		items.forEach((item) => {
			if (isOversize(item, maxSize)) invalid.push(item);
			else valid.push(item);
		});
		return {
			valid,
			invalid
		};
	}
	var IMAGE_REGEXP = /\.(jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg|avif)/i;
	var isImageUrl = (url) => IMAGE_REGEXP.test(url);
	function isImageFile(item) {
		if (item.isImage) return true;
		if (item.file && item.file.type) return item.file.type.indexOf("image") === 0;
		if (item.url) return isImageUrl(item.url);
		if (typeof item.content === "string") return item.content.indexOf("data:image") === 0;
		return false;
	}
	var stdin_default$1 = (0, vue.defineComponent)({
		props: {
			name: numericProp,
			item: makeRequiredProp(Object),
			index: Number,
			imageFit: String,
			lazyLoad: Boolean,
			deletable: Boolean,
			reupload: Boolean,
			previewSize: [
				Number,
				String,
				Array
			],
			beforeDelete: Function
		},
		emits: [
			"delete",
			"preview",
			"reupload"
		],
		setup(props, { emit, slots }) {
			const renderMask = () => {
				const { status, message } = props.item;
				if (status === "uploading" || status === "failed") {
					const MaskIcon = status === "failed" ? (0, vue.createVNode)(Icon, {
						"name": "close",
						"class": bem("mask-icon")
					}, null) : (0, vue.createVNode)(Loading, { "class": bem("loading") }, null);
					const showMessage = isDef(message) && message !== "";
					return (0, vue.createVNode)("div", { "class": bem("mask") }, [MaskIcon, showMessage && (0, vue.createVNode)("div", { "class": bem("mask-message") }, [message])]);
				}
			};
			const onDelete = (event) => {
				const { name, item, index, beforeDelete } = props;
				event.stopPropagation();
				callInterceptor(beforeDelete, {
					args: [item, {
						name,
						index
					}],
					done: () => emit("delete")
				});
			};
			const onPreview = () => emit("preview");
			const onReupload = () => emit("reupload");
			const renderDeleteIcon = () => {
				if (props.deletable && props.item.status !== "uploading") {
					const slot = slots["preview-delete"];
					return (0, vue.createVNode)("div", {
						"role": "button",
						"class": bem("preview-delete", { shadow: !slot }),
						"tabindex": 0,
						"aria-label": t("delete"),
						"onClick": onDelete
					}, [slot ? slot() : (0, vue.createVNode)(Icon, {
						"name": "cross",
						"class": bem("preview-delete-icon")
					}, null)]);
				}
			};
			const renderCover = () => {
				if (slots["preview-cover"]) {
					const { index, item } = props;
					return (0, vue.createVNode)("div", { "class": bem("preview-cover") }, [slots["preview-cover"](extend({ index }, item))]);
				}
			};
			const renderPreview = () => {
				const { item, lazyLoad, imageFit, previewSize, reupload } = props;
				if (isImageFile(item)) return (0, vue.createVNode)(Image, {
					"fit": imageFit,
					"src": item.objectUrl || item.content || item.url,
					"class": bem("preview-image"),
					"width": Array.isArray(previewSize) ? previewSize[0] : previewSize,
					"height": Array.isArray(previewSize) ? previewSize[1] : previewSize,
					"lazyLoad": lazyLoad,
					"onClick": reupload ? onReupload : onPreview
				}, { default: renderCover });
				return (0, vue.createVNode)("div", {
					"class": bem("file"),
					"style": getSizeStyle(props.previewSize)
				}, [
					(0, vue.createVNode)(Icon, {
						"class": bem("file-icon"),
						"name": "description"
					}, null),
					(0, vue.createVNode)("div", { "class": [bem("file-name"), "van-ellipsis"] }, [item.file ? item.file.name : item.url]),
					renderCover()
				]);
			};
			return () => (0, vue.createVNode)("div", { "class": bem("preview") }, [
				renderPreview(),
				renderMask(),
				renderDeleteIcon()
			]);
		}
	});
	var uploaderProps = {
		name: makeNumericProp(""),
		accept: makeStringProp("image/*"),
		capture: String,
		multiple: Boolean,
		disabled: Boolean,
		readonly: Boolean,
		lazyLoad: Boolean,
		maxCount: makeNumericProp(Infinity),
		imageFit: makeStringProp("cover"),
		resultType: makeStringProp("dataUrl"),
		uploadIcon: makeStringProp("photograph"),
		uploadText: String,
		deletable: truthProp,
		reupload: Boolean,
		afterRead: Function,
		showUpload: truthProp,
		modelValue: makeArrayProp(),
		beforeRead: Function,
		beforeDelete: Function,
		previewSize: [
			Number,
			String,
			Array
		],
		previewImage: truthProp,
		previewOptions: Object,
		previewFullImage: truthProp,
		maxSize: {
			type: [
				Number,
				String,
				Function
			],
			default: Infinity
		}
	};
	var Uploader = withInstall((0, vue.defineComponent)({
		name,
		props: uploaderProps,
		emits: [
			"delete",
			"oversize",
			"clickUpload",
			"closePreview",
			"clickPreview",
			"clickReupload",
			"update:modelValue"
		],
		setup(props, { emit, slots }) {
			const inputRef = (0, vue.ref)();
			const urls = [];
			const reuploadIndex = (0, vue.ref)(-1);
			const isReuploading = (0, vue.ref)(false);
			const getDetail = (index = props.modelValue.length) => ({
				name: props.name,
				index
			});
			const resetInput = () => {
				if (inputRef.value) inputRef.value.value = "";
			};
			const onAfterRead = (items) => {
				resetInput();
				if (isOversize(items, props.maxSize)) {
					if (Array.isArray(items)) {
						const result = filterFiles(items, props.maxSize);
						items = result.valid;
						emit("oversize", result.invalid, getDetail());
						if (!items.length) return;
					} else {
						emit("oversize", items, getDetail());
						return;
					}
				}
				items = (0, vue.reactive)(items);
				if (reuploadIndex.value > -1) {
					const arr = [...props.modelValue];
					arr.splice(reuploadIndex.value, 1, items);
					emit("update:modelValue", arr);
					reuploadIndex.value = -1;
				} else emit("update:modelValue", [...props.modelValue, ...toArray(items)]);
				if (props.afterRead) props.afterRead(items, getDetail());
			};
			const readFile = (files) => {
				const { maxCount, modelValue, resultType } = props;
				if (Array.isArray(files)) {
					const remainCount = +maxCount - modelValue.length;
					if (files.length > remainCount) files = files.slice(0, remainCount);
					Promise.all(files.map((file) => readFileContent(file, resultType))).then((contents) => {
						const fileList = files.map((file, index) => {
							const result = {
								file,
								status: "",
								message: "",
								objectUrl: URL.createObjectURL(file)
							};
							if (contents[index]) result.content = contents[index];
							return result;
						});
						onAfterRead(fileList);
					});
				} else readFileContent(files, resultType).then((content) => {
					const result = {
						file: files,
						status: "",
						message: "",
						objectUrl: URL.createObjectURL(files)
					};
					if (content) result.content = content;
					onAfterRead(result);
				});
			};
			const onChange = (event) => {
				const { files } = event.target;
				if (props.disabled || !files || !files.length) return;
				const file = files.length === 1 ? files[0] : [].slice.call(files);
				if (props.beforeRead) {
					const response = props.beforeRead(file, getDetail());
					if (!response) {
						resetInput();
						return;
					}
					if (isPromise(response)) {
						response.then((data) => {
							if (data) readFile(data);
							else readFile(file);
						}).catch(resetInput);
						return;
					}
				}
				readFile(file);
			};
			let imagePreview;
			const onClosePreview = () => emit("closePreview");
			const previewImage = (item) => {
				if (props.previewFullImage) {
					const imageFiles = props.modelValue.filter(isImageFile);
					imagePreview = showImagePreview(extend({
						images: imageFiles.map((item2) => {
							if (item2.objectUrl && !item2.url && item2.status !== "failed") {
								item2.url = item2.objectUrl;
								urls.push(item2.url);
							}
							return item2.url;
						}).filter(Boolean),
						startPosition: imageFiles.indexOf(item),
						onClose: onClosePreview
					}, props.previewOptions));
				}
			};
			const closeImagePreview = () => {
				if (imagePreview) imagePreview.close();
			};
			const deleteFile = (item, index) => {
				const fileList = props.modelValue.slice(0);
				fileList.splice(index, 1);
				emit("update:modelValue", fileList);
				emit("delete", item, getDetail(index));
			};
			const reuploadFile = (index) => {
				isReuploading.value = true;
				reuploadIndex.value = index;
				(0, vue.nextTick)(() => chooseFile());
			};
			const onInputClick = () => {
				if (!isReuploading.value) reuploadIndex.value = -1;
				isReuploading.value = false;
			};
			const renderPreviewItem = (item, index) => {
				const needPickData = [
					"imageFit",
					"deletable",
					"reupload",
					"previewSize",
					"beforeDelete"
				];
				const previewData = extend(pick(props, needPickData), pick(item, needPickData, true));
				return (0, vue.createVNode)(stdin_default$1, (0, vue.mergeProps)({
					"item": item,
					"index": index,
					"onClick": () => emit(props.reupload ? "clickReupload" : "clickPreview", item, getDetail(index)),
					"onDelete": () => deleteFile(item, index),
					"onPreview": () => previewImage(item),
					"onReupload": () => reuploadFile(index)
				}, pick(props, ["name", "lazyLoad"]), previewData), pick(slots, ["preview-cover", "preview-delete"]));
			};
			const renderPreviewList = () => {
				if (props.previewImage) return props.modelValue.map(renderPreviewItem);
			};
			const onClickUpload = (event) => emit("clickUpload", event);
			const renderUpload = () => {
				const lessThanMax = props.modelValue.length < +props.maxCount;
				const Input = props.readonly ? null : (0, vue.createVNode)("input", {
					"ref": inputRef,
					"type": "file",
					"class": bem("input"),
					"accept": props.accept,
					"capture": props.capture,
					"multiple": props.multiple && reuploadIndex.value === -1,
					"disabled": props.disabled,
					"onChange": onChange,
					"onClick": onInputClick
				}, null);
				if (slots.default) return (0, vue.withDirectives)((0, vue.createVNode)("div", {
					"class": bem("input-wrapper"),
					"onClick": onClickUpload
				}, [slots.default(), Input]), [[vue.vShow, lessThanMax]]);
				return (0, vue.withDirectives)((0, vue.createVNode)("div", {
					"class": bem("upload", { readonly: props.readonly }),
					"style": getSizeStyle(props.previewSize),
					"onClick": onClickUpload
				}, [
					(0, vue.createVNode)(Icon, {
						"name": props.uploadIcon,
						"class": bem("upload-icon")
					}, null),
					props.uploadText && (0, vue.createVNode)("span", { "class": bem("upload-text") }, [props.uploadText]),
					Input
				]), [[vue.vShow, props.showUpload && lessThanMax]]);
			};
			const chooseFile = () => {
				if (inputRef.value && !props.disabled) inputRef.value.click();
			};
			(0, vue.onBeforeUnmount)(() => {
				urls.forEach((url) => URL.revokeObjectURL(url));
			});
			useExpose({
				chooseFile,
				reuploadFile,
				closeImagePreview
			});
			useCustomFieldValue(() => props.modelValue);
			return () => (0, vue.createVNode)("div", { "class": bem() }, [(0, vue.createVNode)("div", { "class": bem("wrapper", { disabled: props.disabled }) }, [renderPreviewList(), renderUpload()])]);
		}
	}));
	function createSettingsWriteQueue(write, onError = () => {}) {
		if (typeof write !== "function") throw new TypeError("设置写入函数不可用");
		const pending = new Map();
		let drainPromise = null;
		const startDrain = () => {
			if (drainPromise) return drainPromise;
			drainPromise = (async () => {
				while (pending.size) {
					const [name, value] = pending.entries().next().value;
					pending.delete(name);
					try {
						await write(name, value);
					} catch (error) {
						onError(error, name);
					}
				}
			})().finally(() => {
				drainPromise = null;
				if (pending.size) startDrain();
			});
			return drainPromise;
		};
		return {
			enqueue(name, value) {
				pending.set(name, value);
				return startDrain();
			},
			async flush() {
				while (drainPromise || pending.size) await (drainPromise || startDrain());
			}
		};
	}
	var _hoisted_1$8 = {
		class: "settings-function-area",
		"aria-label": "设置功能区"
	};
	var _hoisted_2$7 = { class: "settings-function-copy" };
	var _hoisted_3$7 = { class: "settings-function-description" };
	var _hoisted_4$5 = { class: "settings-function-actions" };
	var _hoisted_5$5 = { class: "settings-groups" };
	var _hoisted_6$1 = { class: "group" };
	var _hoisted_7$1 = { class: "group-content" };
	var _hoisted_8$1 = { class: "group" };
	var _hoisted_9$1 = { class: "group-content" };
	var _hoisted_10$1 = { class: "group" };
	var _hoisted_11$1 = { class: "group-content" };
	var _hoisted_12$1 = { class: "group" };
	var _sfc_main$8 = {
		__name: "SettingsPanel",
		props: {
			scriptVersion: {
				type: String,
				default: ""
			},
			deployToast: {
				type: null,
				default: null
			}
		},
		setup(__props) {
			const console = MyConsole("[设置]");
			const pageWindow = _unsafeWindow ?? window;
			const props = __props;
			const cellCheckBoxToggle = (refs, index) => {
				refs[index]?.toggle();
			};
			const webVPNAutoLogin = (0, vue.ref)(getGMValue("WebVPN.autoLogin"));
			const webVPNAutoReLogin = (0, vue.ref)(getGMValue("WebVPN.autoReLogin"));
			const webVPNAccount = (0, vue.ref)(getGMValue("WebVPN.username"));
			const webVPNPassword = (0, vue.ref)(getGMValue("WebVPN.password"));
			const webVPNCourseGrab = (0, vue.ref)(getGMValue("WebVPN.courseGrab"));
			const webVPNCustomTool = (0, vue.ref)(getGMValue("WebVPN.customTool"));
			const webVPNCustomCard = (0, vue.ref)(getGMValue("WebVPN.customCard"));
			const webVPNCustomCardList = [
				"教务管理",
				"学工系统",
				"信息门户",
				"中国知网",
				"万方数据"
			];
			const webVPNCustomCardRefs = (0, vue.ref)([]);
			const webVPNAutoClose = (0, vue.ref)(getGMValue("WebVPN.autoClose"));
			const webVPNSearchClose = (0, vue.ref)(getGMValue("WebVPN.searchClose"));
			const jwglAutoLogin = (0, vue.ref)(getGMValue("Jwgl.autoLogin"));
			const jwglAccount = (0, vue.ref)(getGMValue("Jwgl.username"));
			const jwglPassword = (0, vue.ref)(getGMValue("Jwgl.password"));
			const jwglCourseBeautify = (0, vue.ref)(getGMValue("Jwgl.courseBeautify"));
			const jwglCustomMenu = (0, vue.ref)(getGMValue("Jwgl.customMenu"));
			const jwglCustomMenuList = ["全部学期成绩"];
			const jwglCustomMenuRefs = (0, vue.ref)([]);
			const tuanweiAutoDownload = (0, vue.ref)(getGMValue("TuanWei.autoDownload"));
			const tuanweiAutoDownloadClose = (0, vue.ref)(getGMValue("TuanWei.autoDownloadClose"));
			const webVPNCredentialsReady = (0, vue.computed)(() => hasLoginCredentials(webVPNAccount.value, webVPNPassword.value));
			const jwglCredentialsReady = (0, vue.computed)(() => hasLoginCredentials(jwglAccount.value, jwglPassword.value));
			const settingWrites = createSettingsWriteQueue(setGMValue, (error, name) => {
				console("保存设置失败", {
					name,
					error
				}, "error");
				toast("error", "设置保存失败，请重试", 3);
			});
			const persistSetting = (name, value) => {
				settingWrites.enqueue(name, cloneGMValue(value));
			};
			const enforceAutoLoginCredentials = (credentialsReady, autoLogin, storageKey, label, notify = true) => {
				if (credentialsReady.value || !autoLogin.value) return;
				autoLogin.value = false;
				persistSetting(storageKey, false);
				if (notify) toast("info", `${label}自动登录已关闭，请先填写账号和密码`, 3);
			};
			enforceAutoLoginCredentials(webVPNCredentialsReady, webVPNAutoLogin, "WebVPN.autoLogin", "WebVPN ", false);
			enforceAutoLoginCredentials(jwglCredentialsReady, jwglAutoLogin, "Jwgl.autoLogin", "教务系统", false);
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
			Object.entries(allSettingModels).forEach(([name, model]) => {
				(0, vue.watch)(model, (value) => persistSetting(name, value), { deep: true });
			});
			(0, vue.watch)([webVPNAccount, webVPNPassword], () => {
				enforceAutoLoginCredentials(webVPNCredentialsReady, webVPNAutoLogin, "WebVPN.autoLogin", "WebVPN ");
			});
			(0, vue.watch)([jwglAccount, jwglPassword], () => {
				enforceAutoLoginCredentials(jwglCredentialsReady, jwglAutoLogin, "Jwgl.autoLogin", "教务系统");
			});
			const syncSettingModels = (defaults, models) => {
				Object.entries(models).forEach(([name, model]) => {
					model.value = cloneGMValue(defaults[name]);
				});
			};
			const resetFunctionSettings = async () => {
				let action;
				try {
					action = await showConfirmDialog({
						title: "恢复功能默认值",
						message: "将恢复自动登录、页面显示和菜单等功能设置。账号密码、配置提示状态、课表 ID 与课表密钥不会被修改。",
						messageAlign: "left",
						confirmButtonText: "恢复默认",
						cancelButtonText: "取消",
						closeOnClickOverlay: false
					});
				} catch {
					return;
				}
				if (action !== "confirm") return;
				try {
					await settingWrites.flush();
					const defaults = await resetFunctionSettingValues();
					syncSettingModels(defaults, resettableSettingModels);
					enforceAutoLoginCredentials(webVPNCredentialsReady, webVPNAutoLogin, "WebVPN.autoLogin", "WebVPN ", false);
					enforceAutoLoginCredentials(jwglCredentialsReady, jwglAutoLogin, "Jwgl.autoLogin", "教务系统", false);
					toast("success", "功能设置已恢复默认，账号密码和课表数据保持不变", 3);
				} catch (error) {
					console("恢复功能默认值失败", error, "error");
					toast("error", "恢复默认设置失败，请稍后重试", 4);
				}
			};
			const resetAllSettings = async () => {
				let action;
				try {
					action = await showConfirmDialog({
						title: "完全重置 Better NXU",
						message: "这将清除 WebVPN 与教务账号密码、全部功能设置、配置提示状态、课表 ID 和课表解密密钥。\n\n解密密钥清除后无法恢复，已有加密课表可能无法再次打开。此操作无法撤销。",
						messageAlign: "left",
						confirmButtonText: "确认完全重置",
						confirmButtonColor: "#ee0a24",
						cancelButtonText: "取消",
						closeOnClickOverlay: false
					});
				} catch {
					return;
				}
				if (action !== "confirm") return;
				try {
					await settingWrites.flush();
					const defaults = await resetAllSettingValues();
					syncSettingModels(defaults, allSettingModels);
					toast("success", "Better NXU 已完全重置，返回首页后请重新配置", 4);
				} catch (error) {
					console("完全重置失败", error, "error");
					toast("error", "完全重置失败，请稍后重试", 4);
				}
			};
			const openNativeConfig = () => {
				try {
					pageWindow.CAT_userConfig?.();
				} catch (error) {
					console("打开 ScriptCat 原生配置失败", error, "error");
					toast("error", "暂时无法打开 ScriptCat 原生配置", 4);
				}
			};
			(0, vue.onBeforeUpdate)(() => {
				webVPNCustomCardRefs.value = [];
				jwglCustomMenuRefs.value = [];
			});
			(0, vue.onMounted)(() => {
				if (props.deployToast) removeToastHandle(props.deployToast);
				toast("success", "设置页面部署完毕", 2);
			});
			return (_ctx, _cache) => {
				const _component_van_form = (0, vue.resolveComponent)("van-form");
				return (0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, null, [(0, vue.createElementVNode)("section", _hoisted_1$8, [(0, vue.createElementVNode)("div", _hoisted_2$7, [_cache[18] || (_cache[18] = (0, vue.createElementVNode)("span", { class: "settings-function-title" }, "脚本设置", -1)), (0, vue.createElementVNode)("span", _hoisted_3$7, "修改会自动保存 · Better NXU V " + (0, vue.toDisplayString)(__props.scriptVersion), 1)]), (0, vue.createElementVNode)("div", _hoisted_4$5, [
					(0, vue.createVNode)((0, vue.unref)(Button), {
						size: "small",
						plain: "",
						icon: "setting-o",
						onClick: openNativeConfig
					}, {
						default: (0, vue.withCtx)(() => [..._cache[19] || (_cache[19] = [(0, vue.createTextVNode)("ScriptCat 原生配置", -1)])]),
						_: 1
					}),
					(0, vue.createVNode)((0, vue.unref)(Button), {
						size: "small",
						plain: "",
						type: "warning",
						icon: "replay",
						onClick: resetFunctionSettings
					}, {
						default: (0, vue.withCtx)(() => [..._cache[20] || (_cache[20] = [(0, vue.createTextVNode)("恢复功能默认值", -1)])]),
						_: 1
					}),
					(0, vue.createVNode)((0, vue.unref)(Button), {
						size: "small",
						type: "danger",
						icon: "delete-o",
						onClick: resetAllSettings
					}, {
						default: (0, vue.withCtx)(() => [..._cache[21] || (_cache[21] = [(0, vue.createTextVNode)("完全重置", -1)])]),
						_: 1
					})
				])]), (0, vue.createElementVNode)("div", _hoisted_5$5, [
					(0, vue.createElementVNode)("div", _hoisted_6$1, [(0, vue.createVNode)((0, vue.unref)(NavBar), { title: "WebVPN 页面设置" }), (0, vue.createElementVNode)("div", _hoisted_7$1, [(0, vue.createVNode)(_component_van_form, null, {
						default: (0, vue.withCtx)(() => [
							_cache[22] || (_cache[22] = (0, vue.createElementVNode)("h2", null, "登录设置", -1)),
							(0, vue.createVNode)((0, vue.unref)(CellGroup), { inset: "" }, {
								default: (0, vue.withCtx)(() => [
									(0, vue.createVNode)((0, vue.unref)(Cell), {
										center: "",
										title: "是否自动登录",
										label: webVPNCredentialsReady.value ? "" : "请先填写账号和密码",
										class: (0, vue.normalizeClass)({ "login-setting-disabled": !webVPNCredentialsReady.value })
									}, {
										"right-icon": (0, vue.withCtx)(() => [(0, vue.createVNode)((0, vue.unref)(Switch), {
											modelValue: webVPNAutoLogin.value,
											"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => webVPNAutoLogin.value = $event),
											disabled: !webVPNCredentialsReady.value
										}, null, 8, ["modelValue", "disabled"])]),
										_: 1
									}, 8, ["label", "class"]),
									(0, vue.createVNode)((0, vue.unref)(Field), {
										modelValue: webVPNAccount.value,
										"onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => webVPNAccount.value = $event),
										label: "账号",
										autocomplete: "off",
										placeholder: "请输入账号（学号）"
									}, null, 8, ["modelValue"]),
									(0, vue.createVNode)((0, vue.unref)(Field), {
										modelValue: webVPNPassword.value,
										"onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => webVPNPassword.value = $event),
										type: "password",
										autocomplete: "off",
										label: "密码",
										placeholder: "请输入密码（登录校园网的密码）"
									}, null, 8, ["modelValue"]),
									(0, vue.createVNode)((0, vue.unref)(Cell), {
										center: "",
										title: "是否在多因子认证（微信扫码）时启用快速登录"
									}, {
										"right-icon": (0, vue.withCtx)(() => [(0, vue.createVNode)((0, vue.unref)(Switch), {
											modelValue: webVPNAutoReLogin.value,
											"onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => webVPNAutoReLogin.value = $event)
										}, null, 8, ["modelValue"])]),
										_: 1
									})
								]),
								_: 1
							}),
							_cache[23] || (_cache[23] = (0, vue.createElementVNode)("h2", null, "卡片设置", -1)),
							(0, vue.createVNode)((0, vue.unref)(CellGroup), { inset: "" }, {
								default: (0, vue.withCtx)(() => [(0, vue.createVNode)((0, vue.unref)(Cell), {
									center: "",
									title: "是否显示抢课备用列表"
								}, {
									"right-icon": (0, vue.withCtx)(() => [(0, vue.createVNode)((0, vue.unref)(Switch), {
										modelValue: webVPNCourseGrab.value,
										"onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => webVPNCourseGrab.value = $event)
									}, null, 8, ["modelValue"])]),
									_: 1
								}), (0, vue.createVNode)((0, vue.unref)(Cell), {
									center: "",
									title: "是否显示工具列表"
								}, {
									"right-icon": (0, vue.withCtx)(() => [(0, vue.createVNode)((0, vue.unref)(Switch), {
										modelValue: webVPNCustomTool.value,
										"onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => webVPNCustomTool.value = $event)
									}, null, 8, ["modelValue"])]),
									_: 1
								})]),
								_: 1
							}),
							_cache[24] || (_cache[24] = (0, vue.createElementVNode)("h3", null, "需要添加的自定义卡片", -1)),
							(0, vue.createVNode)((0, vue.unref)(CheckboxGroup), {
								modelValue: webVPNCustomCard.value,
								"onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => webVPNCustomCard.value = $event)
							}, {
								default: (0, vue.withCtx)(() => [(0, vue.createVNode)((0, vue.unref)(CellGroup), { inset: "" }, {
									default: (0, vue.withCtx)(() => [((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, null, (0, vue.renderList)(webVPNCustomCardList, (item, index) => {
										return (0, vue.createVNode)((0, vue.unref)(Cell), {
											key: item,
											clickable: "",
											title: item,
											onClick: ($event) => cellCheckBoxToggle(webVPNCustomCardRefs.value, index)
										}, {
											"right-icon": (0, vue.withCtx)(() => [(0, vue.createVNode)((0, vue.unref)(Checkbox), {
												ref_for: true,
												ref: (el) => webVPNCustomCardRefs.value[index] = el,
												name: item,
												onClick: _cache[6] || (_cache[6] = (0, vue.withModifiers)(() => {}, ["stop"]))
											}, null, 8, ["name"])]),
											_: 2
										}, 1032, ["title", "onClick"]);
									}), 64))]),
									_: 1
								})]),
								_: 1
							}, 8, ["modelValue"]),
							_cache[25] || (_cache[25] = (0, vue.createElementVNode)("h2", null, "其他设置", -1)),
							(0, vue.createVNode)((0, vue.unref)(CellGroup), { inset: "" }, {
								default: (0, vue.withCtx)(() => [(0, vue.createVNode)((0, vue.unref)(Cell), {
									center: "",
									title: "是否默认关闭搜索栏"
								}, {
									"right-icon": (0, vue.withCtx)(() => [(0, vue.createVNode)((0, vue.unref)(Switch), {
										modelValue: webVPNSearchClose.value,
										"onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => webVPNSearchClose.value = $event)
									}, null, 8, ["modelValue"])]),
									_: 1
								}), (0, vue.createVNode)((0, vue.unref)(Cell), {
									center: "",
									title: "是否自动关闭错误网站"
								}, {
									"right-icon": (0, vue.withCtx)(() => [(0, vue.createVNode)((0, vue.unref)(Switch), {
										modelValue: webVPNAutoClose.value,
										"onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => webVPNAutoClose.value = $event)
									}, null, 8, ["modelValue"])]),
									_: 1
								})]),
								_: 1
							})
						]),
						_: 1
					})])]),
					(0, vue.createElementVNode)("div", _hoisted_8$1, [(0, vue.createVNode)((0, vue.unref)(NavBar), { title: "教务系统页面设置" }), (0, vue.createElementVNode)("div", _hoisted_9$1, [(0, vue.createVNode)(_component_van_form, null, {
						default: (0, vue.withCtx)(() => [
							_cache[26] || (_cache[26] = (0, vue.createElementVNode)("h2", null, "登录设置", -1)),
							(0, vue.createVNode)((0, vue.unref)(CellGroup), { inset: "" }, {
								default: (0, vue.withCtx)(() => [
									(0, vue.createVNode)((0, vue.unref)(Cell), {
										center: "",
										title: "是否自动登录",
										label: jwglCredentialsReady.value ? "" : "请先填写账号和密码",
										class: (0, vue.normalizeClass)({ "login-setting-disabled": !jwglCredentialsReady.value })
									}, {
										"right-icon": (0, vue.withCtx)(() => [(0, vue.createVNode)((0, vue.unref)(Switch), {
											modelValue: jwglAutoLogin.value,
											"onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => jwglAutoLogin.value = $event),
											disabled: !jwglCredentialsReady.value
										}, null, 8, ["modelValue", "disabled"])]),
										_: 1
									}, 8, ["label", "class"]),
									(0, vue.createVNode)((0, vue.unref)(Field), {
										modelValue: jwglAccount.value,
										"onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => jwglAccount.value = $event),
										label: "账号",
										autocomplete: "off",
										placeholder: "请输入账号（学号）"
									}, null, 8, ["modelValue"]),
									(0, vue.createVNode)((0, vue.unref)(Field), {
										modelValue: jwglPassword.value,
										"onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => jwglPassword.value = $event),
										type: "password",
										label: "密码",
										autocomplete: "off",
										placeholder: "请输入密码（登录教务系统的密码）"
									}, null, 8, ["modelValue"])
								]),
								_: 1
							}),
							_cache[27] || (_cache[27] = (0, vue.createElementVNode)("h2", null, "功能设置", -1)),
							(0, vue.createVNode)((0, vue.unref)(CellGroup), { inset: "" }, {
								default: (0, vue.withCtx)(() => [(0, vue.createVNode)((0, vue.unref)(Cell), {
									center: "",
									title: "是否自动美化课表"
								}, {
									"right-icon": (0, vue.withCtx)(() => [(0, vue.createVNode)((0, vue.unref)(Switch), {
										modelValue: jwglCourseBeautify.value,
										"onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => jwglCourseBeautify.value = $event)
									}, null, 8, ["modelValue"])]),
									_: 1
								})]),
								_: 1
							}),
							_cache[28] || (_cache[28] = (0, vue.createElementVNode)("h3", null, "在菜单需要添加的条目", -1)),
							(0, vue.createVNode)((0, vue.unref)(CheckboxGroup), {
								modelValue: jwglCustomMenu.value,
								"onUpdate:modelValue": _cache[15] || (_cache[15] = ($event) => jwglCustomMenu.value = $event)
							}, {
								default: (0, vue.withCtx)(() => [(0, vue.createVNode)((0, vue.unref)(CellGroup), { inset: "" }, {
									default: (0, vue.withCtx)(() => [((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, null, (0, vue.renderList)(jwglCustomMenuList, (item, index) => {
										return (0, vue.createVNode)((0, vue.unref)(Cell), {
											key: item,
											clickable: "",
											title: item,
											onClick: ($event) => cellCheckBoxToggle(jwglCustomMenuRefs.value, index)
										}, {
											"right-icon": (0, vue.withCtx)(() => [(0, vue.createVNode)((0, vue.unref)(Checkbox), {
												ref_for: true,
												ref: (el) => jwglCustomMenuRefs.value[index] = el,
												name: item,
												onClick: _cache[14] || (_cache[14] = (0, vue.withModifiers)(() => {}, ["stop"]))
											}, null, 8, ["name"])]),
											_: 2
										}, 1032, ["title", "onClick"]);
									}), 64))]),
									_: 1
								})]),
								_: 1
							}, 8, ["modelValue"])
						]),
						_: 1
					})])]),
					(0, vue.createElementVNode)("div", _hoisted_10$1, [(0, vue.createVNode)((0, vue.unref)(NavBar), { title: "团委官网页面设置" }), (0, vue.createElementVNode)("div", _hoisted_11$1, [(0, vue.createVNode)(_component_van_form, null, {
						default: (0, vue.withCtx)(() => [_cache[29] || (_cache[29] = (0, vue.createElementVNode)("h2", null, "下载设置", -1)), (0, vue.createVNode)((0, vue.unref)(CellGroup), { inset: "" }, {
							default: (0, vue.withCtx)(() => [(0, vue.createVNode)((0, vue.unref)(Cell), {
								center: "",
								title: "是否自动下载附件",
								label: "自动识别验证码，失败时可手动下载"
							}, {
								"right-icon": (0, vue.withCtx)(() => [(0, vue.createVNode)((0, vue.unref)(Switch), {
									modelValue: tuanweiAutoDownload.value,
									"onUpdate:modelValue": _cache[16] || (_cache[16] = ($event) => tuanweiAutoDownload.value = $event)
								}, null, 8, ["modelValue"])]),
								_: 1
							}), (0, vue.createVNode)((0, vue.unref)(Cell), {
								center: "",
								title: "是否自动关闭下载页面",
								label: "自动下载完成后关闭附件页"
							}, {
								"right-icon": (0, vue.withCtx)(() => [(0, vue.createVNode)((0, vue.unref)(Switch), {
									modelValue: tuanweiAutoDownloadClose.value,
									"onUpdate:modelValue": _cache[17] || (_cache[17] = ($event) => tuanweiAutoDownloadClose.value = $event),
									disabled: !tuanweiAutoDownload.value
								}, null, 8, ["modelValue", "disabled"])]),
								_: 1
							})]),
							_: 1
						})]),
						_: 1
					})])]),
					(0, vue.createElementVNode)("div", _hoisted_12$1, [(0, vue.createVNode)((0, vue.unref)(Empty), {
						style: {
							"width": "100%",
							"height": "100%"
						},
						description: "更多设置等待建设中..."
					}, {
						image: (0, vue.withCtx)(() => [..._cache[30] || (_cache[30] = [(0, vue.createElementVNode)("svg", {
							width: "160",
							viewBox: "0 0 24 24",
							xmlns: "http://www.w3.org/2000/svg"
						}, [(0, vue.createElementVNode)("g", {
							fill: "none",
							class: "nc-icon-wrapper"
						}, [
							(0, vue.createElementVNode)("path", {
								d: "M14.5489 8H9.4513L9.08052 19.9253C9.0382 21.0584 9.94529 22 11.0791 22H12.921C14.0549 22 14.962 21.0584 14.9197 19.9254L14.5489 8Z",
								fill: "url(#hammer_existing_0)",
								"data-glass": "origin",
								mask: "url(#hammer_mask)"
							}),
							(0, vue.createElementVNode)("path", {
								d: "M14.5489 8H9.4513L9.08052 19.9253C9.0382 21.0584 9.94529 22 11.0791 22H12.921C14.0549 22 14.962 21.0584 14.9197 19.9254L14.5489 8Z",
								fill: "url(#hammer_existing_0)",
								"data-glass": "clone",
								filter: "url(#hammer_filter)",
								"clip-path": "url(#hammer_clipPath)"
							}),
							(0, vue.createElementVNode)("path", {
								d: "M3 9V5C3 3.34315 4.34315 2 6 2H14.7393C15.4739 2 16.1833 2.26975 16.7324 2.75781L19.9932 5.65625C20.6335 6.22554 21 7.04162 21 7.89844V9.5C21 10.8807 19.8807 12 18.5 12H6C4.34315 12 3 10.6569 3 9Z",
								fill: "url(#hammer_existing_1)",
								"data-glass": "blur"
							}),
							(0, vue.createElementVNode)("path", {
								d: "M3 9V5C3 3.34315 4.34315 2 6 2H14.7393C15.4739 2 16.1833 2.26975 16.7324 2.75781L19.9932 5.65625C20.6335 6.22554 21 7.04162 21 7.89844V9.5C21 10.8807 19.8807 12 18.5 12V11.25C19.4665 11.25 20.25 10.4665 20.25 9.5V7.89844C20.25 7.33628 20.0393 6.79772 19.665 6.38574L19.4951 6.2168L16.2344 3.31836C15.8225 2.95228 15.2902 2.75 14.7393 2.75H6C4.75736 2.75 3.75 3.75736 3.75 5V9C3.75 10.2426 4.75736 11.25 6 11.25V12C4.34315 12 3 10.6569 3 9ZM18.5 11.25V12H6V11.25H18.5Z",
								fill: "url(#hammer_existing_2)"
							}),
							(0, vue.createElementVNode)("defs", null, [
								(0, vue.createElementVNode)("linearGradient", {
									id: "hammer_existing_0",
									x1: "12",
									y1: "8",
									x2: "12",
									y2: "22",
									gradientUnits: "userSpaceOnUse"
								}, [(0, vue.createElementVNode)("stop", {
									"stop-color": "rgba(87, 87, 87, 1)",
									"data-glass-11": "on"
								}), (0, vue.createElementVNode)("stop", {
									offset: "1",
									"stop-color": "rgba(21, 21, 21, 1)",
									"data-glass-12": "on"
								})]),
								(0, vue.createElementVNode)("linearGradient", {
									id: "hammer_existing_1",
									x1: "12",
									y1: "2",
									x2: "12",
									y2: "12",
									gradientUnits: "userSpaceOnUse"
								}, [(0, vue.createElementVNode)("stop", {
									"stop-color": "rgba(227, 227, 229, 0.6)",
									"data-glass-21": "on"
								}), (0, vue.createElementVNode)("stop", {
									offset: "1",
									"stop-color": "rgba(187, 187, 192, 0.6)",
									"data-glass-22": "on"
								})]),
								(0, vue.createElementVNode)("linearGradient", {
									id: "hammer_existing_2",
									x1: "12",
									y1: "2",
									x2: "12",
									y2: "7.791",
									gradientUnits: "userSpaceOnUse"
								}, [(0, vue.createElementVNode)("stop", {
									"stop-color": "rgba(255, 255, 255, 1)",
									"data-glass-light": "on"
								}), (0, vue.createElementVNode)("stop", {
									offset: "1",
									"stop-color": "rgba(255, 255, 255, 1)",
									"stop-opacity": "0",
									"data-glass-light": "on"
								})]),
								(0, vue.createElementVNode)("filter", {
									id: "hammer_filter",
									x: "-100%",
									y: "-100%",
									width: "400%",
									height: "400%",
									filterUnits: "objectBoundingBox",
									primitiveUnits: "userSpaceOnUse"
								}, [(0, vue.createElementVNode)("feGaussianBlur", {
									stdDeviation: "2",
									x: "0%",
									y: "0%",
									width: "100%",
									height: "100%",
									in: "SourceGraphic",
									edgeMode: "none",
									result: "blur"
								})]),
								(0, vue.createElementVNode)("clipPath", { id: "hammer_clipPath" }, [(0, vue.createElementVNode)("path", {
									d: "M3 9V5C3 3.34315 4.34315 2 6 2H14.7393C15.4739 2 16.1833 2.26975 16.7324 2.75781L19.9932 5.65625C20.6335 6.22554 21 7.04162 21 7.89844V9.5C21 10.8807 19.8807 12 18.5 12H6C4.34315 12 3 10.6569 3 9Z",
									fill: "url(#hammer_existing_1)"
								})]),
								(0, vue.createElementVNode)("mask", { id: "hammer_mask" }, [(0, vue.createElementVNode)("rect", {
									width: "100%",
									height: "100%",
									fill: "#FFF"
								}), (0, vue.createElementVNode)("path", {
									d: "M3 9V5C3 3.34315 4.34315 2 6 2H14.7393C15.4739 2 16.1833 2.26975 16.7324 2.75781L19.9932 5.65625C20.6335 6.22554 21 7.04162 21 7.89844V9.5C21 10.8807 19.8807 12 18.5 12H6C4.34315 12 3 10.6569 3 9Z",
									fill: "#000"
								})])
							])
						])], -1)])]),
						_: 1
					})])
				])], 64);
			};
		}
	};
	var app_page_default = ":root{--van-doc-black:#000;--van-doc-white:#fff;--van-doc-gray-1:#f7f8fa;--van-doc-gray-2:#f2f3f5;--van-doc-gray-3:#ebedf0;--van-doc-gray-4:#dcdee0;--van-doc-gray-5:#c8c9cc;--van-doc-gray-6:#969799;--van-doc-gray-7:#646566;--van-doc-gray-8:#323233;--van-doc-blue:#1989fa;--van-doc-green:#07c160;--van-doc-purple:#8e69d3;--van-doc-background:#eff2f5}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-corner{background-color:#0000}::-webkit-scrollbar-track{background:#f1f1f1;border-radius:100px}::-webkit-scrollbar-thumb{background:#c1c1c1;border-radius:100px}*{scrollbar-width:thin;scrollbar-color:#c1c1c1 #f1f1f1;box-sizing:border-box}html,body{background-color:var(--van-doc-background);width:100%;height:100%;overflow:hidden}";
	var _style = (b, a = document.createElement("style")) => (a.append(b), a);
	var app_page_css_default = _style(app_page_default);
	var settings_css_default = _style("#settings{background-color:var(--van-doc-background);flex-direction:column;gap:12px;width:100%;height:100%;padding:20px;display:flex;overflow:hidden}.settings-function-area{border:1px solid var(--van-doc-gray-3);background-color:var(--van-doc-white);border-radius:8px;flex-shrink:0;justify-content:space-between;align-items:center;gap:16px;min-width:0;padding:14px 16px;display:flex}.settings-function-copy{flex-direction:column;gap:4px;min-width:0;display:flex}.settings-function-title{color:var(--van-doc-gray-8);font-size:16px;font-weight:600;line-height:22px}.settings-function-description{color:var(--van-doc-gray-6);font-size:13px;line-height:18px}.settings-function-actions{flex-wrap:wrap;flex-shrink:0;justify-content:flex-end;gap:8px;display:flex}.settings-groups{scrollbar-width:auto;flex:1;gap:1em;min-height:0;display:flex;overflow-x:auto}.group{background-color:var(--van-doc-gray-1);scrollbar-width:auto;border-radius:20px;flex-shrink:0;width:400px;height:100%;overflow:hidden}.group-content{width:100%;height:calc(100% - 46px);padding-bottom:32px;overflow:hidden auto}.group h2{color:var(--van-doc-gray-6);margin:0;padding:32px 16px 16px;font-size:14px;font-weight:400;line-height:16px}.group h3{color:var(--van-doc-gray-6);margin:0;padding:16px 32px;font-size:14px;font-weight:400;line-height:14px}.login-setting-disabled{--van-cell-label-color:var(--van-doc-gray-6)}@media (width<=640px){#settings{padding:12px}.settings-function-area{flex-direction:column;align-items:stretch}.settings-function-actions{justify-content:flex-start}.group{width:calc(100vw - 24px)}}");
	var console$25 = MyConsole("[sslvpn.settings]");
	async function register$16() {
		console$25("进入设置页");
		const ctx = getContext();
		const { deployToast } = mountAppPage({
			id: "settings",
			title: "脚本设置 - H",
			extraSetup() {
				(document.head || document.documentElement).append(app_page_css_default, settings_css_default);
			}
		});
		mountVueApp({
			root: _sfc_main$8,
			id: "settings",
			rootProps: {
				scriptVersion: ctx.version,
				deployToast
			}
		});
	}
	function evaluatePageResource(resourceName, resolveGlobal) {
		if (typeof _GM_getResourceText !== "function") throw new Error(`GM_getResourceText 不可用，无法加载 ${resourceName}`);
		const source = _GM_getResourceText(resourceName);
		if (typeof source !== "string" || source.trim() === "") throw new Error(`资源 ${resourceName} 不存在或内容为空`);
		const pageWindow = _unsafeWindow ?? window;
		const parent = document.head || document.documentElement;
		if (typeof _GM_addElement !== "function" || !parent) throw new Error(`GM_addElement 不可用，无法加载 ${resourceName}`);
		_GM_addElement(parent, "script", { textContent: `${source}\n//# sourceURL=better-nxu-resource-${resourceName}.js` })?.remove();
		const runtime = resolveGlobal(pageWindow);
		if (!runtime) throw new Error(`资源 ${resourceName} 未暴露预期的全局对象`);
		return runtime;
	}
	var console$24 = MyConsole("[markdown]");
	var markdownRuntime;
	var runtimeLoadAttempted = false;
	function getMarkdownRuntime() {
		if (runtimeLoadAttempted) return markdownRuntime;
		runtimeLoadAttempted = true;
		try {
			markdownRuntime = {
				marked: evaluatePageResource("marked-js", (pageWindow) => typeof pageWindow.marked?.parse === "function" ? pageWindow.marked : null),
				DOMPurify: evaluatePageResource("dompurify-js", (pageWindow) => typeof pageWindow.DOMPurify?.sanitize === "function" ? pageWindow.DOMPurify : null)
			};
		} catch (error) {
			console$24("Markdown 运行时资源加载失败，降级为纯文本", error, "error");
			markdownRuntime = null;
		}
		return markdownRuntime;
	}
	var PURIFY_CONFIG = {
		ALLOWED_TAGS: [
			"a",
			"blockquote",
			"br",
			"code",
			"em",
			"h1",
			"h2",
			"h3",
			"h4",
			"h5",
			"h6",
			"hr",
			"li",
			"ol",
			"ul",
			"p",
			"pre",
			"strong",
			"span",
			"div",
			"img",
			"table",
			"thead",
			"tbody",
			"tr",
			"th",
			"td",
			"del",
			"sup",
			"sub"
		],
		ALLOWED_ATTR: [
			"class",
			"href",
			"rel",
			"target",
			"src",
			"alt",
			"title"
		],
		FORBID_ATTR: [
			"style",
			"onerror",
			"onload",
			"onclick"
		]
	};
	function renderMarkdown(target, markdown) {
		if (!target) return;
		const source = String(markdown || "");
		const runtime = getMarkdownRuntime();
		let rawHtml;
		if (runtime) try {
			rawHtml = runtime.marked.parse(source);
		} catch (error) {
			console$24("marked.parse 失败，降级 HTML 转义", error, "warn");
			rawHtml = escapeHtml(source);
		}
		else rawHtml = escapeHtml(source);
		const cleanHtml = runtime ? runtime.DOMPurify.sanitize(rawHtml, PURIFY_CONFIG) : rawHtml;
		const holder = document.createElement("div");
		holder.innerHTML = cleanHtml;
		for (const anchor of holder.querySelectorAll("a")) {
			const href = anchor.getAttribute("href") || "";
			if (/^https?:\/\//i.test(href)) {
				anchor.setAttribute("rel", "noopener noreferrer");
				anchor.setAttribute("target", "_blank");
			} else anchor.removeAttribute("href");
		}
		target.replaceChildren(...holder.childNodes);
	}
	function escapeHtml(text) {
		const amp = "&amp;";
		const lt = "&lt;";
		const gt = "&gt;";
		const quot = "&quot;";
		const apos = "&#39;";
		return String(text).replace(/[&<>"']/g, (ch) => ({
			"&": amp,
			"<": lt,
			">": gt,
			"\"": quot,
			"'": apos
		})[ch]);
	}
	var _hoisted_1$7 = { class: "group" };
	var _hoisted_2$6 = { class: "group" };
	var _hoisted_3$6 = { class: "group" };
	var _hoisted_4$4 = { class: "group-content" };
	var _hoisted_5$4 = {
		style: { "margin-right": "10px" },
		class: "logo",
		viewBox: "0 0 128 128",
		width: "24",
		height: "24",
		"data-v-35dc6318": ""
	};
	var _sfc_main$7 = {
		__name: "AboutPanel",
		props: {
			aboutMd: {
				type: String,
				default: ""
			},
			updateMd: {
				type: String,
				default: ""
			},
			deployToast: {
				type: null,
				default: null
			}
		},
		setup(__props) {
			const props = __props;
			const dialogH = (0, vue.ref)(false);
			(0, vue.onMounted)(() => {
				renderMarkdown(document.getElementById("aboutmd"), props.aboutMd);
				renderMarkdown(document.getElementById("updatemd"), props.updateMd);
				if (props.deployToast) removeToastHandle(props.deployToast);
				toast("success", "关于我们部署完毕", 2);
			});
			return (_ctx, _cache) => {
				return (0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, null, [
					(0, vue.createElementVNode)("div", _hoisted_1$7, [(0, vue.createVNode)((0, vue.unref)(NavBar), { title: "关于我们" }), _cache[2] || (_cache[2] = (0, vue.createElementVNode)("div", {
						id: "aboutmd",
						class: "group-content markdown-body"
					}, null, -1))]),
					(0, vue.createElementVNode)("div", _hoisted_2$6, [(0, vue.createVNode)((0, vue.unref)(NavBar), { title: "更新日志" }), _cache[3] || (_cache[3] = (0, vue.createElementVNode)("div", {
						id: "updatemd",
						class: "group-content markdown-body"
					}, null, -1))]),
					(0, vue.createElementVNode)("div", _hoisted_3$6, [(0, vue.createVNode)((0, vue.unref)(NavBar), { title: "致谢名单" }), (0, vue.createElementVNode)("div", _hoisted_4$4, [
						_cache[16] || (_cache[16] = (0, vue.createElementVNode)("h2", null, "特别鸣谢", -1)),
						(0, vue.createVNode)((0, vue.unref)(CellGroup), { inset: "" }, {
							default: (0, vue.withCtx)(() => [
								(0, vue.createVNode)((0, vue.unref)(Cell), {
									title: "H",
									label: "This is H",
									center: "",
									"is-link": "",
									onClick: _cache[0] || (_cache[0] = ($event) => dialogH.value = true)
								}, {
									icon: (0, vue.withCtx)(() => [..._cache[4] || (_cache[4] = [(0, vue.createElementVNode)("img", {
										style: {
											"margin-right": "10px",
											"width": "24px",
											"height": "24px",
											"border-radius": "999px"
										},
										referrerpolicy: "no-referrer",
										src: "https://raw.giteeusercontent.com/thisish/NXU-CDIG/raw/main/src/assets/img/h.png"
									}, null, -1)])]),
									_: 1
								}),
								(0, vue.createVNode)((0, vue.unref)(Cell), {
									title: "Smile232323",
									label: "日拱一卒，干就完事了",
									center: "",
									"is-link": "",
									url: "https://github.com/Smile232323"
								}, {
									icon: (0, vue.withCtx)(() => [..._cache[5] || (_cache[5] = [(0, vue.createElementVNode)("img", {
										style: {
											"margin-right": "10px",
											"width": "24px",
											"height": "24px",
											"border-radius": "999px"
										},
										referrerpolicy: "no-referrer",
										src: "https://raw.giteeusercontent.com/thisish/Better-NXU/raw/main/assets/img/Smile232323.png"
									}, null, -1)])]),
									_: 1
								}),
								(0, vue.createVNode)((0, vue.unref)(Cell), {
									title: "Karl",
									label: "Your Name Engraved Herein",
									center: ""
								}, {
									icon: (0, vue.withCtx)(() => [..._cache[6] || (_cache[6] = [(0, vue.createElementVNode)("img", {
										style: {
											"margin-right": "10px",
											"width": "24px",
											"height": "24px",
											"border-radius": "999px"
										},
										referrerpolicy: "no-referrer",
										src: "https://raw.giteeusercontent.com/thisish/Better-NXU/raw/main/assets/img/Karl.png"
									}, null, -1)])]),
									_: 1
								}),
								(0, vue.createVNode)((0, vue.unref)(Dialog), {
									show: dialogH.value,
									"onUpdate:show": _cache[1] || (_cache[1] = ($event) => dialogH.value = $event),
									title: "关注我们"
								}, {
									default: (0, vue.withCtx)(() => [..._cache[7] || (_cache[7] = [(0, vue.createElementVNode)("img", {
										referrerpolicy: "no-referrer",
										style: {
											"padding": "1em 0.5em",
											"width": "100%"
										},
										src: "https://gitee.com/thisish/NXU-CDIG/raw/main/src/assets/img/gzh-large.png"
									}, null, -1)])]),
									_: 1
								}, 8, ["show"])
							]),
							_: 1
						}),
						_cache[17] || (_cache[17] = (0, vue.createElementVNode)("h2", null, "项目支持", -1)),
						(0, vue.createVNode)((0, vue.unref)(CellGroup), { inset: "" }, {
							default: (0, vue.withCtx)(() => [
								(0, vue.createVNode)((0, vue.unref)(Cell), {
									title: "ScriptCat",
									label: "脚本猫脚本站,在这里你可以与全世界分享你的用户脚本",
									url: "https://scriptcat.org/zh-CN",
									center: "",
									"is-link": ""
								}, {
									icon: (0, vue.withCtx)(() => [..._cache[8] || (_cache[8] = [(0, vue.createElementVNode)("img", {
										style: {
											"margin-right": "10px",
											"width": "24px"
										},
										src: "https://scriptcat.org/_next/image?url=%2Fassets%2Flogo.png&w=64&q=75"
									}, null, -1)])]),
									_: 1
								}),
								(0, vue.createVNode)((0, vue.unref)(Cell), {
									title: "Vue",
									label: "一款用于构建用户界面的 JavaScript 框架",
									url: "https://cn.vuejs.org/",
									center: "",
									"is-link": ""
								}, {
									icon: (0, vue.withCtx)(() => [((0, vue.openBlock)(), (0, vue.createElementBlock)("svg", _hoisted_5$4, [..._cache[9] || (_cache[9] = [(0, vue.createElementVNode)("path", {
										fill: "#42b883",
										d: "M78.8,10L64,35.4L49.2,10H0l64,110l64-110C128,10,78.8,10,78.8,10z",
										"data-v-35dc6318": ""
									}, null, -1), (0, vue.createElementVNode)("path", {
										fill: "#35495e",
										d: "M78.8,10L64,35.4L49.2,10H25.6L64,76l38.4-66H78.8z",
										"data-v-35dc6318": ""
									}, null, -1)])]))]),
									_: 1
								}),
								(0, vue.createVNode)((0, vue.unref)(Cell), {
									title: "Vant",
									label: "一个轻量、可定制的移动端组件库",
									url: "https://vant-ui.github.io/vant/#/zh-CN",
									center: "",
									"is-link": ""
								}, {
									icon: (0, vue.withCtx)(() => [..._cache[10] || (_cache[10] = [(0, vue.createElementVNode)("img", {
										style: {
											"margin-right": "10px",
											"width": "24px"
										},
										src: "https://fastly.jsdelivr.net/npm/@vant/assets/logo.png"
									}, null, -1)])]),
									_: 1
								}),
								(0, vue.createVNode)((0, vue.unref)(Cell), {
									title: "Tesseract",
									label: "Tesseract is an open source text recognition (OCR) Engine, available under the Apache 2.0 license.",
									url: "https://github.com/tesseract-ocr/tessdoc",
									center: "",
									"is-link": ""
								}, {
									icon: (0, vue.withCtx)(() => [..._cache[11] || (_cache[11] = [(0, vue.createElementVNode)("span", { style: {
										"margin-right": "10px",
										"width": "24px",
										"text-align": "center",
										"font-weight": "bold"
									} }, "T", -1)])]),
									_: 1
								}),
								(0, vue.createVNode)((0, vue.unref)(Cell), {
									title: "SnapDOM",
									label: "SnapDOM is a next-generation DOM Capture Engine — ultra-fast, modular, and extensible.",
									url: "https://github.com/zumerlab/snapdom",
									center: "",
									"is-link": ""
								}, {
									icon: (0, vue.withCtx)(() => [..._cache[12] || (_cache[12] = [(0, vue.createElementVNode)("span", { style: {
										"margin-right": "10px",
										"width": "24px",
										"text-align": "center",
										"font-weight": "bold"
									} }, "S", -1)])]),
									_: 1
								}),
								(0, vue.createVNode)((0, vue.unref)(Cell), {
									title: "SheetJS",
									label: "SheetJS Tools for Excel Spreadsheets",
									url: "https://sheetjs.com/",
									center: "",
									"is-link": ""
								}, {
									icon: (0, vue.withCtx)(() => [..._cache[13] || (_cache[13] = [(0, vue.createElementVNode)("img", {
										style: {
											"margin-right": "10px",
											"width": "24px"
										},
										src: "https://sheetjs.com/sketch128.png"
									}, null, -1)])]),
									_: 1
								}),
								(0, vue.createVNode)((0, vue.unref)(Cell), {
									title: "Marked",
									label: "a low-level markdown compiler for parsing markdown without caching or blocking for long periods of time.",
									url: "https://marked.js.org/",
									center: "",
									"is-link": ""
								}, {
									icon: (0, vue.withCtx)(() => [..._cache[14] || (_cache[14] = [(0, vue.createElementVNode)("img", {
										style: {
											"margin-right": "10px",
											"width": "24px"
										},
										src: "https://marked.js.org/img/logo-black.svg"
									}, null, -1)])]),
									_: 1
								}),
								(0, vue.createVNode)((0, vue.unref)(Cell), {
									title: "一言（Hitokoto）",
									label: "动漫也好、小说也好、网络也好，不论在哪里，我们总会看到有那么一两个句子能穿透你的心。我们把这些句子汇聚起来，形成一言网络，以传递更多的感动。如果可以，我们希望我们没有停止服务的那一天。",
									url: "https://hitokoto.cn/",
									center: "",
									"is-link": ""
								}, {
									icon: (0, vue.withCtx)(() => [..._cache[15] || (_cache[15] = [(0, vue.createElementVNode)("img", {
										style: {
											"margin-right": "10px",
											"width": "24px"
										},
										src: "https://developer.hitokoto.cn/logo.png"
									}, null, -1)])]),
									_: 1
								})
							]),
							_: 1
						})
					])])
				], 64);
			};
		}
	};
	var about_css_default = _style("#about{background-color:var(--van-doc-background);scrollbar-width:auto;gap:1vw;width:100%;height:100%;padding:20px 1vw;display:flex;overflow-x:auto}ul{list-style-type:disc}:is(dir,menu,ol,ul) ul{list-style-type:circle}:is(dir,menu,ol,ul) :is(dir,menu,ol,ul) ul{list-style-type:square}.group{background-color:var(--van-doc-gray-1);scrollbar-width:auto;border-radius:20px;flex-shrink:0;width:32vw;height:100%;overflow:hidden}.group-content{width:100%;height:calc(100% - 46px);padding-bottom:32px;overflow:hidden auto}.group-content:not(.markdown-body)>h2{color:var(--van-doc-gray-6);margin:0;padding:32px 16px 16px;font-size:14px;font-weight:400;line-height:16px}.markdown-body{box-sizing:border-box;min-width:200px;max-width:980px;margin:0 auto;padding:25px}");
	var console$23 = MyConsole("[sslvpn.about]");
	function trimMarkdownHead(text) {
		return String(text || "").replace(/^(?:.*(?:\r\n|\n|\r)){2}/, "");
	}
	function readMarkdownResource(name, fallback) {
		const markdown = _GM_getResourceText?.(name);
		if (typeof markdown === "string" && markdown.trim() !== "") return trimMarkdownHead(markdown);
		console$23(`Markdown 资源 ${name} 不可用，使用降级内容`, "", "error");
		return fallback;
	}
	async function register$15() {
		console$23("进入关于页");
		const aboutMd = readMarkdownResource("about-md", "项目说明暂时无法加载，请稍后重新安装或更新脚本。");
		const updateMd = readMarkdownResource("update-md", "更新日志暂时无法加载，请稍后重新安装或更新脚本。");
		const { deployToast } = mountAppPage({
			id: "about",
			title: "关于我们 - H",
			extraSetup() {
				_GM_addStyle?.(_GM_getResourceText?.("github-markdown-css") || "");
				(document.head || document.documentElement).append(app_page_css_default, about_css_default);
			}
		});
		mountVueApp({
			root: _sfc_main$7,
			id: "about",
			rootProps: {
				aboutMd,
				updateMd,
				deployToast
			}
		});
	}
	var console$22 = MyConsole("[OCR]");
	var tesseractRuntime;
	function getTesseractRuntime() {
		if (tesseractRuntime) return tesseractRuntime;
		tesseractRuntime = evaluatePageResource("tesseract-js", (pageWindow) => typeof pageWindow.Tesseract?.createWorker === "function" ? pageWindow.Tesseract : null);
		return tesseractRuntime;
	}
	var OCR_MIRROR = {
		workerPath: "https://unpkg.com/tesseract.js@7.0.0/dist/worker.min.js",
		corePath: "https://unpkg.com/tesseract.js-core@7.0.0",
		langPathBase: "https://unpkg.com/@tesseract.js-data"
	};
	async function createOcrWorker(langs = "eng", oem = 1, extraOptions = {}) {
		const primaryLang = Array.isArray(langs) ? langs[0] || "eng" : String(langs).split("+")[0] || "eng";
		const langPath = `${OCR_MIRROR.langPathBase}/${primaryLang}@1.0.0/4.0.0_best_int`;
		const options = {
			workerPath: OCR_MIRROR.workerPath,
			corePath: OCR_MIRROR.corePath,
			langPath,
			...extraOptions
		};
		try {
			return await getTesseractRuntime().createWorker(langs, oem, options);
		} catch (error) {
			console$22("createWorker 失败（worker/core/lang 镜像或构造问题）", error, "error");
			throw scheduleOperationError(OCR_ENGINE_UNAVAILABLE, `验证码识别组件加载失败：${error?.message || error}`);
		}
	}
	var console$21 = MyConsole("[OCR]");
	var LoadMessage = {
		"loading tesseract core": "OCR核心加载",
		"initializing tesseract": "OCR初始化",
		"loading language traineddata": "加载OCR语言训练数据",
		"initializing api": "初始化OCR接口",
		"recognizing text": "识别验证码"
	};
	function withTimeout(promise, timeoutMs, message) {
		let timer;
		const timeout = new Promise((_, reject) => {
			timer = setTimeout(() => reject(new Error(message)), timeoutMs);
		});
		return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
	}
	async function readJwglCaptcha() {
		const url = new URL("captcha/image.action", window.location.href).href;
		console$21("开始加载验证码图片", { url }, "info");
		installNotification();
		let worker;
		let progressToast = null;
		let active = true;
		let workerPromise;
		try {
			workerPromise = createOcrWorker("eng", 1, { logger: (m) => {
				if (!active) return;
				const statusText = LoadMessage[m.status];
				if (statusText) console$21("识别进度", {
					status: statusText,
					progress: Number(m.progress || 0)
				}, "debug");
				const progress = Number(m.progress);
				if (progress === 0) {
					if (statusText) {
						if (progressToast) removeToastHandle(progressToast);
						progressToast = toast("info", statusText, 0);
					}
				} else if (progress === 1) {
					if (progressToast) removeToastHandle(progressToast);
					progressToast = null;
					toast("success", "验证码识别组件加载完成", 2);
				}
			} });
			worker = await withTimeout(workerPromise, 45e3, "验证码识别组件加载超时");
			const code = ((await withTimeout(worker.recognize(url), 3e4, "验证码识别超时"))?.data?.text || "").replace(/\s+/g, "");
			if (!code) throw scheduleOperationError(OCR_EMPTY_RESULT, "验证码识别结果为空");
			console$21("验证码识别完成", void 0, "info");
			return code;
		} finally {
			active = false;
			if (progressToast) removeToastHandle(progressToast);
			if (!worker && workerPromise) workerPromise.then(async (lateWorker) => {
				try {
					await lateWorker?.terminate?.();
				} catch (error) {
					console$21("迟到 worker 清理失败", error, "warn");
				}
			}).catch(() => {});
			if (worker) try {
				await worker.terminate();
			} catch (error) {
				console$21("worker 清理失败", error, "warn");
			}
		}
	}
	var console$20 = MyConsole("[教务登录]");
	async function jwglLogin() {
		if (!getGMValue("Jwgl.autoLogin")) return;
		installNotification();
		toast("info", "自动登录...", 3);
		if (!requireCredentials("Jwgl")) return;
		const errorEl = document.querySelector("div#errors.message");
		if (errorEl) {
			const errorText = errorEl.textContent.trim();
			if (errorText === "密码错误" || errorText === "账户不存在") {
				notifyCredentialsProblem("Jwgl", 0);
				return;
			}
		}
		const recognitionToast = toast("info", "正在识别验证码，首次使用需下载识别模型，请耐心等待...", 0);
		try {
			const verification = await readJwglCaptcha();
			const usernameInput = document.getElementsByName("loginForm.name")[0];
			const passwordInput = document.getElementsByName("loginForm.password")[0];
			const captchaInput = document.getElementsByName("loginForm.captcha")[0];
			const submitButton = document.querySelector("input#loginSubmit");
			if (!usernameInput || !passwordInput || !captchaInput || !submitButton) throw scheduleOperationError(JWGL_LOGIN_FORM_MISSING, "教务登录表单结构已变化");
			const fillInput = (input, value) => {
				input.value = value;
			};
			fillInput(usernameInput, getGMValue("Jwgl.username"));
			fillInput(passwordInput, getGMValue("Jwgl.password"));
			fillInput(captchaInput, verification);
			submitButton.click();
		} catch (error) {
			console$20("自动填写失败", error, "error");
			toast("error", "验证码识别失败，请手动输入后登录", 5);
		} finally {
			removeToastHandle(recognitionToast);
		}
	}
	var console$19 = MyConsole("[jwgl.login]");
	async function register$14() {
		console$19("进入登录页");
		installNotification();
		await jwglLogin();
	}
	var console$18 = MyConsole("[教务菜单]");
	function addMenu(menu, menu_dd, href, content) {
		const menuContainer = document.querySelectorAll("div.layui-side.layui-bg-black.layuimini-menu-left li.layui-nav-item.menu-li")[menu];
		const menuDdMyGrade = menuContainer?.querySelectorAll("dd.menu-dd")[menu_dd];
		const menuList = menuContainer?.querySelector("dl");
		if (!menuContainer || !menuList) throw scheduleOperationError("MENU_TARGET_MISSING", "教务菜单结构已变化，未添加自定义入口");
		const menu_dd_all_grade = document.createElement("dd");
		menu_dd_all_grade.className = "menu-dd";
		menu_dd_all_grade.innerHTML = `
    <a href="javascript:this.top.vpn_inject_script(this);vpn_eval((function () { ; }).toString().slice(14, -2))" layuimini-href="${href}" target="_self">
      <i class="fa fa-file-text-o"></i>
      <span class="layui-left-nav">${content}</span>
    </a>
  `;
		menuList.insertBefore(menu_dd_all_grade, menuDdMyGrade || null);
	}
	async function register$13() {
		console$18("进入主页");
		const jwglCustomMenu = getGMValue("Jwgl.customMenu");
		console$18("当前启用的自定义菜单", jwglCustomMenu, "debug");
		if (jwglCustomMenu.length === 0) return;
		if (!await waitOrToast("div.layui-side.layui-bg-black.layuimini-menu-left li.layui-nav-item.menu-li", {
			timeout: 15e3,
			predicate: (element) => element.textContent.trim().length > 0,
			level: "warning",
			duration: 4
		})) return;
		try {
			if (jwglCustomMenu.indexOf("全部学期成绩") !== -1) addMenu(1, 4, "personGrade.action?method=historyCourseGrade", "全部学期成绩");
		} catch (error) {
			toast("warning", error.message || "教务菜单加载超时，已跳过自定义菜单", 4);
		}
	}
	var installations$2 = new WeakMap();
	function installCourseFrameResize(iframe) {
		const existing = installations$2.get(iframe);
		if (existing) return existing;
		const pageWindow = iframe.ownerDocument.defaultView;
		const resize = () => {
			try {
				const table = (iframe.contentWindow?.document)?.querySelector("table");
				if (table) iframe.style.height = `${table.scrollHeight + 100}px`;
			} catch {}
		};
		const onMessage = (event) => {
			if (event.source === iframe.contentWindow && event.data?.type === "COURSE_BEAUTIFY_CHANGED") resize();
		};
		const onPageHide = (event) => {
			if (!event.persisted) cleanup();
		};
		const cleanup = () => {
			iframe.removeEventListener("load", resize);
			pageWindow.removeEventListener("message", onMessage);
			pageWindow.removeEventListener("pagehide", onPageHide);
			installations$2.delete(iframe);
		};
		iframe.addEventListener("load", resize);
		pageWindow.addEventListener("message", onMessage);
		pageWindow.addEventListener("pagehide", onPageHide);
		installations$2.set(iframe, cleanup);
		resize();
		return cleanup;
	}
	var console$17 = MyConsole("[jwgl CourseFrame]");
	async function register$12() {
		console$17("进入课表容器页");
		const iframe = await waitOrToast("#contentListFrame", {
			timeout: 15e3,
			level: "warning",
			duration: 4
		});
		if (iframe) installCourseFrameResize(iframe);
	}
	var JWGL_COURSE_TEXT_FILTERS = [(text) => text.replace(/,{2,}/g, "")];
	function filterJwglCourseText(value) {
		return JWGL_COURSE_TEXT_FILTERS.reduce((text, filter) => filter(text), String(value ?? ""));
	}
	function parseCourseCellFromJwgl(el, options = {}) {
		const missingPlaceholder = options.missingPlaceholder ?? "未定";
		let content = el?.getAttribute("title") || "";
		content = content.split(/\n|(?<!\n)\s{2,}?(?!\n)/);
		if (content.length === 3) content.splice(1, 0, missingPlaceholder);
		const contentArray = [];
		for (let i = 0; i < content.length; i += 4) if (/^[0-9\-()[\]单双周]*$/.test(content[i])) {
			contentArray.push(content.slice(i, i + 2));
			i -= 2;
		} else contentArray.push(content.slice(i, i + 4));
		return contentArray.map((items) => items.map(filterJwglCourseText));
	}
	function normalizeCellGroups(contentArray) {
		for (let i = 0; i < contentArray.length; i++) if (contentArray[i].length === 2 && /^[0-9\-()[\]单双周]*$/.test(contentArray[i][0])) {
			contentArray[i].unshift(contentArray[i - 1][1]);
			contentArray[i].unshift(contentArray[i - 1][0]);
		}
		return contentArray;
	}
	var webVpnCaptureTail = Promise.resolve();
	var STYLE_BATCH_SIZE = 32;
	var CAPTURE_STYLE_PROPERTIES = Object.freeze(`
  accent-color
  align-content align-items align-self
  alignment-baseline appearance aspect-ratio
  backdrop-filter backface-visibility baseline-shift
  background-attachment background-blend-mode background-clip background-color background-image
  background-origin background-position-x background-position-y background-repeat-x background-repeat-y background-size
  border-bottom-color border-bottom-left-radius border-bottom-right-radius border-bottom-style border-bottom-width
  border-collapse border-image-outset border-image-repeat border-image-slice border-image-source border-image-width
  border-left-color border-left-style border-left-width border-right-color border-right-style border-right-width border-spacing
  border-top-color border-top-left-radius border-top-right-radius border-top-style border-top-width
  bottom box-decoration-break box-shadow box-sizing
  caption-side caret-color clear clip clip-path clip-rule color color-interpolation color-rendering color-scheme
  column-count column-fill column-gap column-rule-color column-rule-style column-rule-width column-span column-width
  contain content-visibility counter-increment counter-reset counter-set cursor
  cx cy d direction display dominant-baseline empty-cells
  fill fill-opacity fill-rule filter flex-basis flex-direction flex-grow flex-shrink flex-wrap float
  flood-color flood-opacity
  font-family font-feature-settings font-kerning font-optical-sizing font-size font-size-adjust font-stretch font-style
  font-synthesis font-variant font-variant-caps font-variant-east-asian font-variant-ligatures font-variant-numeric
  font-variation-settings font-weight forced-color-adjust
  gap grid-auto-columns grid-auto-flow grid-auto-rows grid-column-end grid-column-start grid-row-end grid-row-start
  grid-template-areas grid-template-columns grid-template-rows
  height hyphens image-rendering isolation justify-content justify-items justify-self
  left letter-spacing lighting-color line-break line-height
  list-style-image list-style-position list-style-type
  margin-bottom margin-left margin-right margin-top
  marker-end marker-mid marker-start
  mask-clip mask-composite mask-image mask-mode mask-origin mask-position mask-repeat mask-size mask-type
  max-height max-width min-height min-width mix-blend-mode object-fit object-position opacity order orphans
  outline-color outline-offset outline-style outline-width
  overflow-wrap overflow-x overflow-y
  padding-bottom padding-left padding-right padding-top paint-order perspective perspective-origin pointer-events position
  quotes r resize right rotate row-gap rx ry scale scrollbar-color scrollbar-gutter scrollbar-width
  shape-rendering stop-color stop-opacity
  stroke stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width
  table-layout tab-size
  text-align text-align-last text-anchor text-decoration-color text-decoration-line text-decoration-skip-ink
  text-decoration-style text-decoration-thickness text-emphasis-color text-emphasis-position text-emphasis-style
  text-indent text-justify text-orientation text-overflow text-rendering text-shadow text-transform
  text-underline-offset text-underline-position text-wrap-mode text-wrap-style
  top touch-action transform transform-box transform-origin transform-style translate
  unicode-bidi user-select vector-effect vertical-align visibility
  white-space white-space-collapse widows width word-break word-spacing writing-mode x y z-index zoom
  -webkit-font-smoothing -webkit-line-clamp -webkit-text-fill-color -webkit-text-size-adjust
  -webkit-text-stroke-color -webkit-text-stroke-width -webkit-writing-mode
`.trim().split(/\s+/));
	function enqueueWebVpnCapture(task) {
		const result = webVpnCaptureTail.then(task, task);
		webVpnCaptureTail = result.catch(() => void 0);
		return result;
	}
	function serializeComputedStyle(element, pageWindow, buffer) {
		const computed = pageWindow.getComputedStyle.call(pageWindow, element);
		buffer.cssText = "";
		for (const property of CAPTURE_STYLE_PROPERTIES) {
			let value = computed.getPropertyValue(property);
			if (!value) continue;
			if (property === "width" && /^\d+(?:\.\d+)?px$/.test(value)) value = `${Math.ceil(Number.parseFloat(value))}px`;
			try {
				buffer.setProperty(property, value);
			} catch {}
		}
		buffer.setProperty("animation", "none", "important");
		buffer.setProperty("transition", "none", "important");
		return buffer.cssText;
	}
	function yieldToMainThread(pageWindow) {
		return new Promise((resolve) => {
			if (typeof pageWindow?.setTimeout === "function") pageWindow.setTimeout(resolve, 0);
			else globalThis.setTimeout(resolve, 0);
		});
	}
	async function collectComputedStyles(elements, pageWindow) {
		const computedStyles = new Array(elements.length);
		const buffer = elements[0].ownerDocument.createElement("div").style;
		await yieldToMainThread(pageWindow);
		for (let index = 0; index < elements.length; index++) {
			computedStyles[index] = serializeComputedStyle(elements[index], pageWindow, buffer);
			if (index + 1 < elements.length && (index + 1) % STYLE_BATCH_SIZE === 0) await yieldToMainThread(pageWindow);
		}
		return computedStyles;
	}
	async function downloadWithWebVpnFix({ snapdom, target, options, pageWindow }) {
		const elements = [target, ...target.querySelectorAll("*")];
		const originalStyles = elements.map((element) => element.getAttribute("style"));
		const serializerPrototype = (pageWindow.XMLSerializer ?? globalThis.XMLSerializer)?.prototype;
		const originalSerialize = serializerPrototype?.serializeToString;
		if (typeof originalSerialize !== "function") throw new Error("当前浏览器不支持 XMLSerializer，无法导出图片");
		const fixedSerialize = function(node) {
			return originalSerialize.call(this, node).replace(/<(\/?)foreignobject(?=[\s>])/g, "<$1foreignObject");
		};
		try {
			const computedStyles = await collectComputedStyles(elements, pageWindow);
			elements.forEach((element, index) => {
				element.style.cssText = computedStyles[index];
			});
			serializerPrototype.serializeToString = fixedSerialize;
			return await snapdom.download(target, {
				...options,
				cache: "disabled",
				invalidate: true
			});
		} finally {
			elements.forEach((element, index) => {
				const originalStyle = originalStyles[index];
				if (originalStyle === null) element.removeAttribute("style");
				else element.setAttribute("style", originalStyle);
			});
			if (serializerPrototype.serializeToString === fixedSerialize) serializerPrototype.serializeToString = originalSerialize;
		}
	}
	function downloadSnapdomImage({ snapdom, target, options = {}, fixWebVpn = false, pageWindow = window }) {
		if (typeof snapdom?.download !== "function") return Promise.reject(new Error("snapdom 未加载，无法导出图片"));
		if (!target || typeof target.querySelectorAll !== "function") return Promise.reject(new Error("图片导出目标不存在"));
		const captureOptions = {
			embedFonts: false,
			...options
		};
		if (!fixWebVpn) return snapdom.download(target, captureOptions);
		return enqueueWebVpnCapture(() => downloadWithWebVpnFix({
			snapdom,
			target,
			options: captureOptions,
			pageWindow
		}));
	}
	var timezone = "Asia/Shanghai";
	var timezoneOffset = "+08:00";
	var periodTimes = [
		{
			period: 1,
			start: "08:10",
			end: "08:55"
		},
		{
			period: 2,
			start: "09:00",
			end: "09:45"
		},
		{
			period: 3,
			start: "10:15",
			end: "11:00"
		},
		{
			period: 4,
			start: "11:05",
			end: "11:50"
		},
		{
			period: 5,
			start: "14:00",
			end: "14:45"
		},
		{
			period: 6,
			start: "14:50",
			end: "15:35"
		},
		{
			period: 7,
			start: "15:55",
			end: "16:40"
		},
		{
			period: 8,
			start: "16:45",
			end: "17:30"
		},
		{
			period: 9,
			start: "19:00",
			end: "19:45"
		},
		{
			period: 10,
			start: "19:50",
			end: "20:35"
		}
	];
	function normalizeText(value) {
		return String(value || "").trim().replace(/\s+/g, " ");
	}
	function uniqueInOrder(values) {
		return [...new Set((values || []).filter(Boolean))];
	}
	function uniqueSorted(values) {
		return [...new Set((values || []).filter(Boolean))].sort();
	}
	function uniqueNumbers(values) {
		return [...new Set((values || []).filter(Number.isFinite))].sort((left, right) => left - right);
	}
	function uniqueBy(values, key) {
		const seen = new Set();
		return values.filter((value) => {
			const id = key(value);
			if (seen.has(id)) return false;
			seen.add(id);
			return true;
		});
	}
	function addManyUnique(target, values) {
		(values || []).forEach((value) => {
			const text = normalizeText(value);
			if (text && !target.includes(text)) target.push(text);
		});
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
	function parseDateOnly(value) {
		const [year, month, day] = value.split("-").map(Number);
		return new Date(Date.UTC(year, month - 1, day));
	}
	function formatDateOnly(date) {
		return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
	}
	function getWeekdayNumber(year, month, day) {
		return new Date(Date.UTC(year, month - 1, day)).getUTCDay() || 7;
	}
	function weekdayText(value) {
		return [
			"",
			"周一",
			"周二",
			"周三",
			"周四",
			"周五",
			"周六",
			"周日"
		][value] || "";
	}
	function getTermStartMonday(lessons) {
		const firstDate = lessons.map((item) => item.date).filter(Boolean).sort()[0];
		if (!firstDate) return "";
		const date = parseDateOnly(firstDate);
		const weekday = getWeekdayNumber(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
		date.setUTCDate(date.getUTCDate() - weekday + 1);
		return formatDateOnly(date);
	}
	function getWeekIndex(dateString, termStartDate) {
		if (!dateString || !termStartDate) return null;
		const days = Math.floor((parseDateOnly(dateString) - parseDateOnly(termStartDate)) / 864e5);
		return days < 0 ? null : Math.floor(days / 7) + 1;
	}
	function getWeekRange(lessons) {
		const weeks = uniqueNumbers(lessons.map((item) => Number(item.week)));
		return {
			start: weeks[0] || null,
			end: weeks[weeks.length - 1] || null,
			weeks
		};
	}
	function getDateRange(lessons) {
		return rangeFromValues(lessons.map((item) => item.date).filter(Boolean));
	}
	function rangeFromValues(values) {
		const sorted = uniqueSorted(values);
		return {
			start: sorted[0] || "",
			end: sorted[sorted.length - 1] || ""
		};
	}
	function formatWeeks(weeks, totalWeeks = 0) {
		const values = uniqueNumbers((weeks || []).map(Number));
		if (!values.length) return "无";
		if (totalWeeks && values.length === totalWeeks && values[0] === 1 && values[values.length - 1] === totalWeeks) return "全学期";
		if (values.length >= 3 && values.every((value, index) => index === 0 || value - values[index - 1] === 2)) return `${values[0]}-${values[values.length - 1]}周${values[0] % 2 ? "单" : "双"}`;
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
		return values.length > 1 && values.every((value, index) => index === 0 || value === values[index - 1] + 1) ? `${values[0]}-${values[values.length - 1]}` : values.join(",");
	}
	function buildSlotKey(week, weekday, period) {
		return [
			week,
			weekday,
			period
		].every(Number.isFinite) ? `${week}-${weekday}-${period}` : "";
	}
	function compareSlotKeys(left, right) {
		const a = left.split("-").map(Number);
		const b = right.split("-").map(Number);
		return a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
	}
	function buildLocalDateTime(date, time) {
		return date && time ? `${date}T${time}:00` : "";
	}
	async function requestText(url) {
		const startedAt = Date.now();
		let timedOut = false;
		try {
			const response = await _GM.xmlHttpRequest({
				method: "GET",
				url,
				responseType: "text",
				timeout: 2e4,
				ontimeout() {
					timedOut = true;
				}
			});
			if (response.status < 200 || response.status >= 300) {
				response.status, Date.now() - startedAt;
				throw new Error(`课表请求失败：HTTP ${response.status}`);
			}
			const responseText = response.responseText || response.response || "";
			response.status, Date.now() - startedAt, String(responseText).length;
			return responseText;
		} catch (error) {
			if (error instanceof Error && error.message.startsWith("课表请求失败：HTTP ")) throw error;
			if (timedOut || error?.type === "timeout" || error?.error === "timeout") {
				Date.now() - startedAt;
				throw new Error("课表请求超时，请稍后重试", { cause: error });
			}
			Date.now() - startedAt;
			throw new Error("课表请求失败，请检查网络或登录状态", { cause: error });
		}
	}
	function parseIcsProperty(line) {
		const colonIndex = findUnquoted(line, ":");
		if (colonIndex < 0) return null;
		const [rawName, ...paramParts] = splitUnquoted(line.slice(0, colonIndex), ";");
		const params = {};
		paramParts.forEach((part) => {
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
			if (text[index] === "\"") quoted = !quoted;
			if (text[index] === target && !quoted) return index;
		}
		return -1;
	}
	function splitUnquoted(text, delimiter) {
		const values = [];
		let quoted = false;
		let start = 0;
		for (let index = 0; index < text.length; index++) {
			if (text[index] === "\"") quoted = !quoted;
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
		return String(text).replace(/\\\\/g, "\\").replace(/\\n/gi, "\n").replace(/\\,/g, ",").replace(/\\;/g, ";");
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
		return {
			id: stableId([
				getFirst(event, "UID") || `event-${context.index + 1}`,
				start.dateTimeLocal,
				end.dateTimeLocal,
				detail.name,
				detail.teacherText,
				detail.room
			].join("|")),
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
		for (let index = items.length - 1; index >= 0; index--) if (isLikelyTeacherText(items[index])) teacherIndex = index;
		else break;
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
		return names.length > 0 && names.every((name) => {
			const text = normalizeText(name);
			return text.length >= 2 && text.length <= 8 && /^[㐀-鿿·•A-Za-z.' -]+$/.test(text) && !/[班组级课馆楼室院系专业方向文凭工程师实验实训中心]/.test(text);
		});
	}
	function splitTeacherNames(text) {
		return uniqueInOrder(String(text || "").split(/\s*(?:、|,|，|;|；|&|和|与)\s*/).map(normalizeText).filter((name) => name && name !== "等"));
	}
	function parsePeriodText(text) {
		const result = [];
		String(text || "").split(/[,\s，、]+/).forEach((part) => {
			const range = part.match(/^(\d+)\s*-\s*(\d+)$/);
			if (range) for (let value = Number(range[1]); value <= Number(range[2]); value++) result.push(value);
			else if (Number.isFinite(Number(part)) && part !== "") result.push(Number(part));
		});
		return uniqueNumbers(result);
	}
	function periodsFromTimes(startTime, endTime) {
		return periodTimes.filter((item) => item.start >= startTime && item.end <= endTime).map((item) => item.period);
	}
	function parseIcsDateTime(value, eventTimezone) {
		const raw = String(value || "");
		const match = raw.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?)?(Z)?$/);
		if (!match) return {
			raw,
			timezone: eventTimezone,
			date: "",
			time: "",
			dateTimeLocal: raw,
			weekday: null,
			weekdayText: ""
		};
		let [, year, month, day, hour = "00", minute = "00", second = "00", utc] = match;
		if (utc) {
			const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second)) + 288e5);
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
	function parseIcsText(icsText) {
		const text = String(icsText || "");
		if (!/BEGIN:VCALENDAR/i.test(text)) throw new Error("返回内容不是有效的 ICS 日历");
		const calendar = {};
		const events = [];
		const stack = [];
		let currentEvent = null;
		const lines = text.replace(/\r\n[ \t]/g, "").replace(/\n[ \t]/g, "").replace(/\r[ \t]/g, "").split(/\r\n|\n|\r/);
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
		return {
			calendar,
			events
		};
	}
	function parseIcs(icsText, options = {}) {
		const parsed = parseIcsText(icsText);
		const calendarTimezone = parsed.calendar["X-WR-TIMEZONE"]?.[0]?.value || findTimezone(parsed) || "Asia/Shanghai";
		const rawLessons = uniqueBy(parsed.events.map((event, index) => eventToLesson(event, {
			index,
			timezone: calendarTimezone
		})).filter(Boolean).sort(compareRawLesson), (item) => item.id);
		if (rawLessons.length === 0) throw new Error("ICS 课表中没有可识别的课程");
		const termStartDate = options.termStartDate || getTermStartMonday(rawLessons);
		const merged = mergeLessonsToCourses(rawLessons, termStartDate);
		const scheduleMap = buildScheduleMap(merged.courses);
		const lessons = buildLessonRecords(rawLessons, merged.lessonLinks, scheduleMap);
		return normalize({
			schemaVersion: "2.0",
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
		});
	}
	function mergeLessonsToCourses(lessons, termStartDate) {
		const courseMap = new Map();
		const lessonLinks = new Map();
		lessons.forEach((lesson) => {
			const courseId = stableId(`${normalizeText(lesson.name)}|${stableArrayText(lesson.groups)}`);
			if (!courseMap.has(courseId)) courseMap.set(courseId, {
				id: courseId,
				name: lesson.name,
				teachers: [],
				teacherText: "",
				groups: lesson.groups,
				lessonCount: 0,
				dateRange: {
					start: "",
					end: ""
				},
				dates: [],
				schedules: []
			});
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
			let schedule = course.schedules.find((item) => item.id === scheduleId);
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
					dateRange: {
						start: "",
						end: ""
					}
				};
				course.schedules.push(schedule);
			}
			addManyUnique(schedule.teachers, lesson.teachers);
			const week = getWeekIndex(lesson.date, termStartDate);
			schedule.dates.push(lesson.date);
			if (week) schedule.weeks.push(week);
			schedule.lessonIds.push(lesson.id);
			lessonLinks.set(lesson.id, {
				courseId,
				scheduleId,
				week
			});
		});
		const courses = [...courseMap.values()];
		courses.forEach((course) => {
			course.dates = uniqueSorted(course.dates);
			course.teacherText = course.teachers.join("、");
			course.dateRange = rangeFromValues(course.dates);
			course.schedules.forEach((schedule) => {
				schedule.dates = uniqueSorted(schedule.dates);
				schedule.weeks = uniqueNumbers(schedule.weeks);
				schedule.lessonIds = uniqueInOrder(schedule.lessonIds);
				schedule.teacherText = schedule.teachers.join("、");
				schedule.dateRange = rangeFromValues(schedule.dates);
			});
			course.schedules.sort(compareSchedule);
		});
		courses.sort((left, right) => left.name.localeCompare(right.name, "zh-Hans-CN"));
		return {
			courses,
			lessonLinks
		};
	}
	function buildScheduleMap(courses) {
		const map = new Map();
		courses.forEach((course) => course.schedules.forEach((schedule) => map.set(schedule.id, schedule)));
		return map;
	}
	function buildLessonRecords(rawLessons, lessonLinks, scheduleMap) {
		return rawLessons.map((lesson) => {
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
				slotKeys: lesson.periods.map((period) => buildSlotKey(link.week, lesson.weekday, period)).filter(Boolean)
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
		entries.forEach((entry) => {
			const teachers = Array.isArray(entry.teachers) ? entry.teachers : splitTeacherNames(entry.teacher);
			const courseId = stableId(normalizeText(entry.name));
			if (!courseMap.has(courseId)) courseMap.set(courseId, {
				id: courseId,
				name: normalizeText(entry.name),
				teachers: [],
				teacherText: "",
				groups: [],
				lessonCount: 0,
				dateRange: {
					start: "",
					end: ""
				},
				dates: [],
				schedules: []
			});
			const course = courseMap.get(courseId);
			addManyUnique(course.teachers, teachers);
			const periods = uniqueNumbers(entry.periods || []);
			const startTime = periodTimes.find((item) => item.period === periods[0])?.start || "";
			const endTime = periodTimes.find((item) => item.period === periods[periods.length - 1])?.end || "";
			const scheduleId = stableId([
				courseId,
				entry.weekday,
				startTime,
				endTime,
				formatPeriods(periods),
				entry.room
			].join("|"));
			let schedule = course.schedules.find((item) => item.id === scheduleId);
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
					dateRange: {
						start: "",
						end: ""
					}
				};
				course.schedules.push(schedule);
			}
			addManyUnique(schedule.teachers, teachers);
			uniqueNumbers(entry.weeks || []).forEach((week) => {
				const key = `${courseId}|${scheduleId}|${week}`;
				if (!occurrenceMap.has(key)) occurrenceMap.set(key, {
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
				addManyUnique(occurrenceMap.get(key).teachers, teachers);
			});
		});
		occurrenceMap.forEach((occurrence) => {
			const id = stableId(`jwgl|${occurrence.key}`);
			const course = courseMap.get(occurrence.courseId);
			const schedule = course.schedules.find((item) => item.id === occurrence.scheduleId);
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
				slotKeys: occurrence.periods.map((period) => buildSlotKey(occurrence.week, occurrence.weekday, period)),
				teachers: occurrence.teachers,
				teacherText: occurrence.teachers.join("、")
			});
		});
		const courses = [...courseMap.values()];
		courses.forEach((course) => {
			course.teacherText = course.teachers.join("、");
			course.schedules.forEach((schedule) => {
				schedule.teachers = uniqueInOrder(schedule.teachers);
				schedule.teacherText = schedule.teachers.join("、");
				schedule.weeks = uniqueNumbers(schedule.weeks);
				schedule.lessonIds = uniqueInOrder(schedule.lessonIds);
			});
			course.schedules.sort(compareSchedule);
		});
		lessons.forEach((lesson) => {
			const schedule = courseMap.get(lesson.courseId)?.schedules.find((item) => item.id === lesson.scheduleId);
			if (schedule && sameTextArray(lesson.teachers, schedule.teachers)) {
				delete lesson.teachers;
				delete lesson.teacherText;
			}
		});
		const weeks = uniqueNumbers(lessons.map((item) => item.week));
		return normalize({
			schemaVersion: "2.0",
			sourceUrl: "",
			source: {
				type: "jwgl",
				input: window.location.href
			},
			owner: {
				id: "",
				name: normalizeText(ownerName)
			},
			meta: {
				calendarName: "教务系统课表",
				calendarDescription: "由 Better NXU 从教务系统导出",
				timezone,
				timezoneOffset,
				termStartDate: "",
				weekRange: {
					start: weeks[0] || null,
					end: weeks[weeks.length - 1] || null,
					weeks
				},
				dateRange: {
					start: "",
					end: ""
				},
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
		if (!input || input.schemaVersion !== "2.0" || !Array.isArray(input.courses) || !Array.isArray(input.lessons)) throw new Error("仅支持 Better NXU 2.0 课表 JSON");
		const data = JSON.parse(JSON.stringify(input));
		const courseIds = new Set(data.courses.map((course) => course.id));
		if (courseIds.size !== data.courses.length) throw new Error("课表 JSON 存在重复的课程 ID");
		const scheduleIdsByCourse = new Map();
		data.courses.forEach((course) => {
			if (!Array.isArray(course.schedules)) throw new Error("课表 JSON 缺少课程安排");
			const ids = new Set(course.schedules.map((schedule) => schedule.id));
			if (ids.size !== course.schedules.length) throw new Error("课表 JSON 存在重复的安排 ID");
			scheduleIdsByCourse.set(course.id, ids);
		});
		if (new Set(data.lessons.map((lesson) => lesson.id)).size !== data.lessons.length) throw new Error("课表 JSON 存在重复的课次 ID");
		data.lessons.forEach((lesson) => {
			if (!courseIds.has(lesson.courseId) || !scheduleIdsByCourse.get(lesson.courseId)?.has(lesson.scheduleId)) throw new Error("课表 JSON 存在无效的课程或安排引用");
			lesson.week = Number(lesson.week);
			lesson.weekday = Number(lesson.weekday);
			lesson.periods = uniqueNumbers((lesson.periods || []).map(Number));
			if (!Number.isInteger(lesson.week) || lesson.week < 1 || !Number.isInteger(lesson.weekday) || lesson.weekday < 1 || lesson.weekday > 7 || !lesson.periods.length || lesson.periods.some((period) => !Number.isInteger(period) || period < 1 || period > 10)) throw new Error("课表 JSON 存在无效的周次、星期或节次");
			lesson.slotKeys = lesson.periods.map((period) => buildSlotKey(lesson.week, lesson.weekday, period));
		});
		data.lessons.sort(compareLesson);
		data.sourceUrl = data.sourceUrl || "";
		data.source = data.source || {
			type: "text",
			input: data.sourceUrl
		};
		data.owner = normalizeOwner(data.owner);
		data.meta = data.meta || {};
		data.meta.timezone = data.meta.timezone || "Asia/Shanghai";
		data.meta.timezoneOffset = data.meta.timezoneOffset || "+08:00";
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
		lessons.forEach((lesson) => {
			if (!lesson.date) return;
			if (!result[lesson.date]) result[lesson.date] = [];
			result[lesson.date].push(lesson.id);
		});
		return result;
	}
	function buildBusySlots(lessons) {
		const result = {};
		const seen = new Set();
		lessons.forEach((lesson) => lesson.periods.forEach((period) => {
			const key = buildSlotKey(lesson.week, lesson.weekday, period);
			if (!key) return;
			const dedupeKey = `${key}|${lesson.id}`;
			if (seen.has(dedupeKey)) return;
			seen.add(dedupeKey);
			if (!result[key]) result[key] = [];
			result[key].push(lesson.id);
		}));
		return Object.fromEntries(Object.entries(result).sort(([left], [right]) => compareSlotKeys(left, right)));
	}
	function getMaps(data) {
		const courses = new Map(data.courses.map((course) => [course.id, course]));
		const schedules = new Map();
		data.courses.forEach((course) => (course.schedules || []).forEach((schedule) => {
			schedules.set(`${course.id}|${schedule.id}`, schedule);
			if (!schedules.has(schedule.id)) schedules.set(schedule.id, schedule);
		}));
		return {
			courses,
			schedules,
			lessons: new Map(data.lessons.map((lesson) => [lesson.id, lesson]))
		};
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
	function classifyScheduleSlot(lessons, isOnline) {
		const values = Array.isArray(lessons) ? lessons : [];
		if (!values.length) return "free";
		return values.some((lesson) => !isOnline(lesson)) ? "busy" : "online";
	}
	function summarizePeopleAvailability(states) {
		const values = Array.isArray(states) ? states : [];
		if (!values.length) return {
			status: "empty",
			text: "尚未添加课表"
		};
		if (values.every((status) => status === "free")) return {
			status: "free",
			text: "全部人员全时段完全空闲"
		};
		if (values.every((status) => status === "free" || status === "online")) return {
			status: "online",
			text: "全部人员可协调（含线上课程）"
		};
		const availableCount = values.filter((status) => status !== "busy").length;
		return availableCount ? {
			status: "partial",
			text: `${availableCount}/${values.length} 人存在空闲或可协调时段`
		} : {
			status: "none",
			text: "无人空闲"
		};
	}
	function normalizeOwner(owner) {
		if (!owner) return {
			id: "",
			name: ""
		};
		if (typeof owner === "string") return {
			id: owner,
			name: owner
		};
		return {
			id: normalizeText(owner.id),
			name: normalizeText(owner.name)
		};
	}
	function compareRawLesson(left, right) {
		return left.start.dateTimeLocal.localeCompare(right.start.dateTimeLocal) || left.id.localeCompare(right.id);
	}
	function compareLesson(left, right) {
		return String(left.date || "").localeCompare(String(right.date || "")) || Number(left.week) - Number(right.week) || Number(left.weekday) - Number(right.weekday) || (left.periods?.[0] || 999) - (right.periods?.[0] || 999) || String(left.id).localeCompare(String(right.id));
	}
	function compareSchedule(left, right) {
		return left.weekday - right.weekday || (left.periods?.[0] || 999) - (right.periods?.[0] || 999) || String(left.room || "").localeCompare(String(right.room || ""), "zh-Hans-CN");
	}
	function buildJwglExcelTables(schedule) {
		const data = normalize(schedule);
		const totalWeeks = Number(data.meta?.weekRange?.end) || Math.max(0, ...data.lessons.map((lesson) => Number(lesson.week) || 0));
		const lessonWeeksBySchedule = new Map();
		data.lessons.forEach((lesson) => {
			if (!lessonWeeksBySchedule.has(lesson.scheduleId)) lessonWeeksBySchedule.set(lesson.scheduleId, []);
			lessonWeeksBySchedule.get(lesson.scheduleId).push(Number(lesson.week));
		});
		const arrangements = data.courses.flatMap((course) => (course.schedules || []).map((item) => {
			const periods = [...new Set((item.periods || []).map(Number))].filter((period) => Number.isInteger(period) && period >= 1 && period <= 10).sort((left, right) => left - right);
			const weeks = [...new Set((item.weeks?.length ? item.weeks : lessonWeeksBySchedule.get(item.id) || []).map(Number))].filter((week) => Number.isInteger(week) && week > 0).sort((left, right) => left - right);
			return {
				courseName: course.name || "未命名课程",
				teacherText: item.teacherText || course.teacherText || "未注明教师",
				room: item.room || item.location || "未注明教室",
				weekday: Number(item.weekday),
				weekdayText: item.weekdayText || weekdayText(Number(item.weekday)),
				periods,
				periodText: item.periodText || formatPeriods(periods),
				startTime: item.startTime || "",
				endTime: item.endTime || "",
				weeks,
				weeksText: formatWeeks(weeks, totalWeeks)
			};
		})).filter((item) => Number.isInteger(item.weekday) && item.weekday >= 1 && item.weekday <= 7 && item.periods.length).sort((left, right) => left.weekday - right.weekday || left.periods[0] - right.periods[0] || left.courseName.localeCompare(right.courseName, "zh-Hans-CN"));
		if (!arrangements.length) throw new Error("当前课表没有可导出的课程安排");
		const weekdays = Array.from({ length: 7 }, (_, index) => weekdayText(index + 1));
		const periodGroups = Array.from({ length: 5 }, (_, index) => {
			const first = periodTimes[index * 2];
			const second = periodTimes[index * 2 + 1];
			return {
				label: `${first.period}-${second.period}`,
				periods: [first.period, second.period],
				time: `${first.start}-${second.end}`
			};
		});
		const timetableRows = [["节次 / 时间", ...weekdays]];
		periodGroups.forEach((group) => {
			const row = [`第 ${group.label} 节\n${group.time}`];
			for (let weekday = 1; weekday <= 7; weekday++) {
				const values = arrangements.filter((item) => item.weekday === weekday && item.periods.some((period) => group.periods.includes(period))).map((item) => [
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
		const detailRows = [[
			"课程名称",
			"教师",
			"教室",
			"星期",
			"节次",
			"上课时间",
			"周次"
		]];
		arrangements.forEach((item) => detailRows.push([
			item.courseName,
			item.teacherText,
			item.room,
			item.weekdayText,
			item.periodText,
			[item.startTime, item.endTime].filter(Boolean).join("-") || "未注明",
			item.weeksText
		]));
		return {
			timetableRows,
			detailRows,
			arrangementCount: arrangements.length
		};
	}
	async function fetchFromUrl(url, options = {}) {
		return parseIcs(await requestText(url), {
			...options,
			sourceType: "ics",
			sourceUrl: url,
			sourceInput: url
		});
	}
	var INVALID_KEY = "INVALID_KEY";
	var INVALID_ENVELOPE = "INVALID_ENVELOPE";
	var UNSUPPORTED_ENCRYPTION = "UNSUPPORTED_ENCRYPTION";
	var FILE_TOO_LARGE = "FILE_TOO_LARGE";
	var DECRYPT_FAILED = "DECRYPT_FAILED";
	function cryptoError(code, message, cause) {
		const error = new Error(message);
		error.code = code;
		if (cause) error.cause = cause;
		return error;
	}
	var textEncoder = new TextEncoder();
	function getCryptoApi() {
		const cryptoApi = globalThis.crypto;
		if (!cryptoApi?.subtle || typeof cryptoApi.getRandomValues !== "function") throw cryptoError("CRYPTO_UNAVAILABLE", "当前页面不支持安全加密，请使用 HTTPS 地址或更新浏览器后重试");
		return cryptoApi;
	}
	function byteLength(text) {
		return textEncoder.encode(String(text ?? "")).byteLength;
	}
	function bytesToBase64(bytes) {
		const values = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
		let binary = "";
		for (let index = 0; index < values.length; index += 32768) binary += String.fromCharCode(...values.subarray(index, index + 32768));
		return btoa(binary);
	}
	function base64ToBytes(value, fieldName = "密钥") {
		const text = String(value || "").replace(/\s+/g, "");
		if (!text || !/^[A-Za-z0-9+/]+={0,2}$/.test(text) || text.length % 4 === 1) throw cryptoError(INVALID_KEY, `${fieldName}格式不正确`);
		try {
			const binary = atob(text);
			return Uint8Array.from(binary, (char) => char.charCodeAt(0));
		} catch (error) {
			throw cryptoError(INVALID_KEY, `${fieldName}格式不正确`, error);
		}
	}
	function bytesToBase64Url(bytes) {
		return bytesToBase64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
	}
	function base64UrlToBytes(value, fieldName) {
		const text = String(value || "");
		if (!text || !/^[A-Za-z0-9_-]+$/.test(text) || text.length % 4 === 1) throw cryptoError(INVALID_ENVELOPE, `加密文件的 ${fieldName} 字段无效`);
		const padding = "=".repeat((4 - text.length % 4) % 4);
		try {
			const binary = atob(text.replace(/-/g, "+").replace(/_/g, "/") + padding);
			const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
			if (bytesToBase64Url(bytes) !== text) throw new Error("Non-canonical Base64URL");
			return bytes;
		} catch (error) {
			throw cryptoError(INVALID_ENVELOPE, `加密文件的 ${fieldName} 字段无效`, error);
		}
	}
	function arrayBufferToPem(buffer, label) {
		return `-----BEGIN ${label}-----\n${(bytesToBase64(new Uint8Array(buffer)).match(/.{1,64}/g) || []).join("\n")}\n-----END ${label}-----`;
	}
	function pemToBytes(pem, label) {
		const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		const match = String(pem || "").trim().match(new RegExp(`^-----BEGIN ${escapedLabel}-----\\s+([A-Za-z0-9+/=\\s]+?)\\s+-----END ${escapedLabel}-----$`));
		if (!match) throw cryptoError(INVALID_KEY, `请输入完整的${label === "PUBLIC KEY" ? "加密密钥（公钥）" : "解密密钥（私钥）"}`);
		return base64ToBytes(match[1], label === "PUBLIC KEY" ? "加密密钥" : "解密密钥");
	}
	async function getKeyId(spkiBytes) {
		const { subtle } = getCryptoApi();
		const digest = await subtle.digest("SHA-256", spkiBytes);
		return `sha256-${bytesToBase64Url(new Uint8Array(digest))}`;
	}
	function assertRsaStrength(key, keyName) {
		const publicExponent = Array.from(key?.algorithm?.publicExponent || []);
		if (Number(key?.algorithm?.modulusLength) < 3072 || key?.algorithm?.hash?.name !== "SHA-256") throw cryptoError(INVALID_KEY, `${keyName}不符合当前课表加密要求，请使用“课表密钥管理”生成的密钥`);
		if (publicExponent.join(",") !== "1,0,1") throw cryptoError(INVALID_KEY, `${keyName}使用了不受支持的参数，请使用“课表密钥管理”生成的密钥`);
	}
	async function importPublicKey(pem) {
		const { subtle } = getCryptoApi();
		const spki = pemToBytes(pem, "PUBLIC KEY");
		try {
			const cryptoKey = await subtle.importKey("spki", spki, {
				name: "RSA-OAEP",
				hash: "SHA-256"
			}, false, ["encrypt"]);
			assertRsaStrength(cryptoKey, "加密密钥");
			return {
				cryptoKey,
				keyId: await getKeyId(spki)
			};
		} catch (error) {
			if (error.code) throw error;
			throw cryptoError(INVALID_KEY, "加密密钥无法识别，请粘贴完整的课表加密密钥", error);
		}
	}
	async function importPrivateKey(pem) {
		const { subtle } = getCryptoApi();
		const pkcs8 = pemToBytes(pem, "PRIVATE KEY");
		try {
			const cryptoKey = await subtle.importKey("pkcs8", pkcs8, {
				name: "RSA-OAEP",
				hash: "SHA-256"
			}, false, ["decrypt"]);
			assertRsaStrength(cryptoKey, "解密密钥");
			return cryptoKey;
		} catch (error) {
			if (error.code) throw error;
			throw cryptoError(INVALID_KEY, "解密密钥无法识别，请粘贴完整的课表解密密钥", error);
		}
	}
	async function generateKeyPair() {
		const { subtle } = getCryptoApi();
		const keyPair = await subtle.generateKey({
			name: "RSA-OAEP",
			modulusLength: 3072,
			publicExponent: new Uint8Array([
				1,
				0,
				1
			]),
			hash: "SHA-256"
		}, true, ["encrypt", "decrypt"]);
		const [spki, pkcs8] = await Promise.all([subtle.exportKey("spki", keyPair.publicKey), subtle.exportKey("pkcs8", keyPair.privateKey)]);
		return {
			publicKey: arrayBufferToPem(spki, "PUBLIC KEY"),
			privateKey: arrayBufferToPem(pkcs8, "PRIVATE KEY"),
			keyId: await getKeyId(new Uint8Array(spki)),
			createdAt: new Date().toISOString()
		};
	}
	var protectedHeaderType = "better-nxu-schedule+jwe";
	var protectedContentType = "application/vnd.better-nxu.schedule+json";
	var textDecoder = new TextDecoder("utf-8", { fatal: true });
	function isEncryptedEnvelope(value) {
		if (!value || typeof value !== "object" || Array.isArray(value)) return false;
		return [
			"protected",
			"encrypted_key",
			"iv",
			"ciphertext",
			"tag"
		].some((field) => Object.prototype.hasOwnProperty.call(value, field));
	}
	function inspectEnvelope(envelope) {
		if (!envelope || typeof envelope !== "object" || Array.isArray(envelope)) throw cryptoError(INVALID_ENVELOPE, "加密课表文件结构无效");
		const requiredFields = [
			"protected",
			"encrypted_key",
			"iv",
			"ciphertext",
			"tag"
		];
		if (Object.keys(envelope).sort().join("|") !== [...requiredFields].sort().join("|") || requiredFields.some((field) => typeof envelope[field] !== "string" || !envelope[field])) throw cryptoError(INVALID_ENVELOPE, "加密课表文件缺少必要字段");
		const protectedBytes = base64UrlToBytes(envelope.protected, "protected");
		if (protectedBytes.byteLength > 2048) throw cryptoError(INVALID_ENVELOPE, "加密课表文件头过大");
		let header;
		try {
			header = JSON.parse(textDecoder.decode(protectedBytes));
		} catch (error) {
			throw cryptoError(INVALID_ENVELOPE, "加密课表文件头无效", error);
		}
		if (!header || typeof header !== "object" || Array.isArray(header) || Object.keys(header).sort().join("|") !== [
			"alg",
			"bnxv",
			"cty",
			"enc",
			"kid",
			"typ"
		].sort().join("|") || header.alg !== "RSA-OAEP-256" || header.enc !== "A256GCM" || header.typ !== protectedHeaderType || header.cty !== protectedContentType || header.bnxv !== 1 || !/^sha256-[A-Za-z0-9_-]{43}$/.test(header.kid || "")) throw cryptoError(UNSUPPORTED_ENCRYPTION, "该文件使用了不受支持的课表加密格式");
		return {
			header,
			protectedText: envelope.protected
		};
	}
	async function encryptSchedule(schedule, publicKeyPem) {
		const { subtle } = getCryptoApi();
		const normalized = normalize(schedule);
		const plaintext = JSON.stringify(normalized);
		const plaintextBytes = textEncoder.encode(plaintext);
		if (plaintextBytes.byteLength > 5242880) throw cryptoError(FILE_TOO_LARGE, "课表内容不能超过 5 MB");
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
		const aesKey = await subtle.generateKey({
			name: "AES-GCM",
			length: 256
		}, true, ["encrypt"]);
		const rawAesKey = await subtle.exportKey("raw", aesKey);
		const [encryptedKey, encryptedContent] = await Promise.all([subtle.encrypt({ name: "RSA-OAEP" }, publicKey, rawAesKey), subtle.encrypt({
			name: "AES-GCM",
			iv,
			additionalData: textEncoder.encode(protectedText),
			tagLength: 128
		}, aesKey, plaintextBytes)]);
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
		if (iv.byteLength !== 12 || tag.byteLength !== 16 || !ciphertext.byteLength) throw cryptoError(INVALID_ENVELOPE, "加密课表文件参数无效");
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
			if (plaintext.byteLength > 5242880) throw cryptoError(FILE_TOO_LARGE, "解密后的课表内容不能超过 5 MB");
			return textDecoder.decode(plaintext);
		} catch (error) {
			if (error.code === "FILE_TOO_LARGE") throw error;
			throw cryptoError(DECRYPT_FAILED, "解密密钥不匹配或加密文件已损坏", error);
		}
	}
	function parseScheduleJson(text, encrypted = false) {
		let data;
		try {
			data = JSON.parse(text);
		} catch {
			throw scheduleOperationError(encrypted ? INVALID_DECRYPTED_SCHEDULE : INVALID_JSON, encrypted ? "文件已解密，但其中不是有效的课表 JSON" : "文件不是有效的 JSON");
		}
		try {
			return normalize(data);
		} catch (error) {
			throw scheduleOperationError(encrypted ? INVALID_DECRYPTED_SCHEDULE : INVALID_SCHEDULE, `${encrypted ? "文件已解密，但课表内容无效" : "课表文件无效"}：${error.message}`);
		}
	}
	var storageKey = "Schedule.encryptionKeyPair";
	async function requestScheduleKey(type, options = {}) {
		const isPublic = type === "public";
		const value = (0, vue.ref)(String(options.initialValue || ""));
		let importedKey = null;
		try {
			if (await showConfirmDialog({
				title: isPublic ? "粘贴接收方的加密密钥" : "需要对应的解密密钥",
				messageAlign: "left",
				confirmButtonText: isPublic ? "使用此加密密钥" : "解密文件",
				cancelButtonText: "取消",
				closeOnClickOverlay: false,
				message: () => (0, vue.h)("div", null, [(0, vue.h)("div", { style: "padding:0 16px 8px;color:#646566;font-size:13px;line-height:1.6;" }, isPublic ? "发给谁查看，就粘贴谁发给你的加密密钥。加密密钥可以分享，请不要让对方发送解密密钥。" : `${options.filename ? `文件“${options.filename}”无法用当前解密密钥打开。` : "当前解密密钥无法打开这个文件。"}请粘贴你自己的对应解密密钥备份；如果没有，请取消并让对方使用本页当前加密密钥重新导出。`), (0, vue.h)(Field, {
					modelValue: value.value,
					type: "textarea",
					rows: 7,
					autosize: false,
					clearable: true,
					autocomplete: "off",
					placeholder: isPublic ? "-----BEGIN PUBLIC KEY-----" : "-----BEGIN PRIVATE KEY-----",
					"onUpdate:modelValue": (input) => value.value = String(input || "")
				})]),
				async beforeClose(action) {
					if (action !== "confirm") return true;
					if (!value.value.trim()) {
						showToast(isPublic ? "请粘贴加密密钥" : "请粘贴解密密钥");
						return false;
					}
					try {
						importedKey = isPublic ? await importPublicKey(value.value.trim()) : await importPrivateKey(value.value.trim());
						return true;
					} catch (error) {
						showToast(error.message || "密钥格式无效");
						return false;
					}
				}
			}) !== "confirm") return null;
			return {
				pem: value.value.trim(),
				importedKey
			};
		} catch {
			return null;
		}
	}
	async function selectScheduleExportPublicKey() {
		const currentKeyPair = getGMValue(storageKey);
		if (currentKeyPair?.publicKey) try {
			if (await showConfirmDialog({
				title: "选择接收人的加密密钥",
				message: "使用当前加密密钥：只有本页当前解密密钥能打开。\n\n粘贴接收方加密密钥：把加密课表发给对方时使用。",
				messageAlign: "left",
				confirmButtonText: "使用当前加密密钥",
				cancelButtonText: "粘贴接收方加密密钥",
				closeOnClickOverlay: false
			}) === "confirm") return currentKeyPair.publicKey;
		} catch {}
		const provided = await requestScheduleKey("public");
		if (!provided) throw scheduleOperationError(EXPORT_CANCELLED, "已取消加密导出");
		return provided.pem;
	}
	async function prepareScheduleExport(schedule) {
		const normalized = normalize(schedule);
		let encrypt = false;
		try {
			encrypt = await showConfirmDialog({
				title: "导出课表 JSON",
				message: "直接导出可被任何拿到文件的人查看；加密导出只有持有对应解密密钥的人可以打开。",
				messageAlign: "left",
				confirmButtonText: "加密导出",
				cancelButtonText: "直接导出",
				closeOnClickOverlay: false
			}) === "confirm";
		} catch {}
		if (!encrypt) return {
			encrypted: false,
			content: JSON.stringify(normalized)
		};
		const envelope = await encryptSchedule(normalized, await selectScheduleExportPublicKey());
		return {
			encrypted: true,
			content: JSON.stringify(envelope)
		};
	}
	var _hoisted_1$6 = {
		class: "h-course-toolbar",
		style: {
			"width": "100%",
			"display": "flex",
			"align-items": "center",
			"justify-content": "center",
			"gap": "1em"
		}
	};
	var _sfc_main$6 = {
		__name: "CourseToolbar",
		props: {
			onExportImage: {
				type: Function,
				required: true
			},
			onExportJson: {
				type: Function,
				required: true
			},
			onExportExcel: {
				type: Function,
				required: true
			}
		},
		setup(__props) {
			const props = __props;
			const exportImage = () => props.onExportImage();
			const exportJson = () => props.onExportJson();
			const exportExcel = () => props.onExportExcel();
			return (_ctx, _cache) => {
				return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", _hoisted_1$6, [
					_cache[3] || (_cache[3] = (0, vue.createElementVNode)("span", null, "H - 将课表导出为", -1)),
					(0, vue.createVNode)((0, vue.unref)(Button), {
						plain: "",
						type: "primary",
						size: "small",
						onClick: exportImage
					}, {
						default: (0, vue.withCtx)(() => [..._cache[0] || (_cache[0] = [(0, vue.createTextVNode)("图片", -1)])]),
						_: 1
					}),
					(0, vue.createVNode)((0, vue.unref)(Button), {
						plain: "",
						type: "primary",
						size: "small",
						onClick: exportJson
					}, {
						default: (0, vue.withCtx)(() => [..._cache[1] || (_cache[1] = [(0, vue.createTextVNode)("json文件", -1)])]),
						_: 1
					}),
					(0, vue.createVNode)((0, vue.unref)(Button), {
						plain: "",
						type: "primary",
						size: "small",
						onClick: exportExcel
					}, {
						default: (0, vue.withCtx)(() => [..._cache[2] || (_cache[2] = [(0, vue.createTextVNode)("Excel表格", -1)])]),
						_: 1
					})
				]);
			};
		}
	};
	var console$16 = MyConsole("[教务课表]");
	var pageWindow$2 = _unsafeWindow ?? window;
	function getJwglExportFilename(schedule, extension) {
		return `${(schedule?.owner?.name || "未命名用户").replace(/[\\/:*?"<>|]/g, "_")} - 教务系统课表.${extension}`;
	}
	var NUMBER_JSON = {
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
		十二: 12
	};
	function parseRangeString(str, filterType = null) {
		let result = [];
		(String(str || "").match(/\d+\s*-\s*\d+|\d+/g) || []).forEach((token) => {
			const values = token.split("-").map(Number);
			if (values.length === 2) for (let week = values[0]; week <= values[1]; week++) result.push(week);
			else if (Number.isFinite(values[0])) result.push(values[0]);
		});
		if (filterType === "单") result = result.filter((num) => num % 2 !== 0);
		else if (filterType === "双") result = result.filter((num) => num % 2 === 0);
		return new Set(result.filter((week) => week > 0));
	}
	function getAccurateColumnIndex(cell) {
		const row = cell.parentElement;
		const tbody = row.parentElement;
		const rows = Array.from(tbody.rows);
		const rowIndex = row.rowIndex;
		const colOccupied = [];
		for (let i = 0; i < rows.length; i++) {
			const currentRow = rows[i];
			const cells = Array.from(currentRow.cells);
			if (!colOccupied[i]) colOccupied[i] = [];
			let colIndex = 0;
			for (let j = 0; j < cells.length; j++) {
				const currentCell = cells[j];
				while (colOccupied[i][colIndex]) colIndex++;
				if (i === rowIndex && currentCell === cell) return colIndex;
				const rowspan = currentCell.rowSpan || 1;
				const colspan = currentCell.colSpan || 1;
				for (let k = 0; k < rowspan; k++) {
					if (!colOccupied[i + k]) colOccupied[i + k] = [];
					for (let l = 0; l < colspan; l++) colOccupied[i + k][colIndex + l] = true;
				}
				colIndex += colspan;
			}
		}
		return cell.cellIndex;
	}
	function readJwglTableToJson() {
		const entries = [];
		document.querySelectorAll("td > div").forEach((div) => {
			const numberMatch = div.parentElement.parentElement.querySelector("td")?.innerHTML.match(/[一二三四五六七八九十][一二]?/);
			if (!numberMatch) return;
			let number = numberMatch[0];
			number = NUMBER_JSON[number];
			const day = getAccurateColumnIndex(div.parentElement);
			const duration = parseInt(div.parentElement.getAttribute("rowspan"), 10) || 1;
			const content_array = parseCourseCellFromJwgl(div, { missingPlaceholder: "未定" });
			normalizeCellGroups(content_array);
			for (let i = 0; i < content_array.length; i++) {
				const weekText = content_array[i][2] || "";
				const variation = weekText.match(/[单双]/)?.[0] || null;
				const hasRole = /\(外聘|助理|教授\)|\(讲师\)|\(\)/.test(content_array[i][0]);
				const name = content_array.length > 1 || hasRole ? content_array[i][1] : content_array[i][0];
				const teacher = content_array.length > 1 || hasRole ? content_array[i][0] : content_array[i][1];
				const periods = Array.from({ length: duration }, (_, index) => number + index).filter((period) => period >= 1 && period <= 10);
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
		return JSON.stringify(buildFromJwgl(entries, ownerName));
	}
	async function hExportImage({ fixWebVpn = false } = {}) {
		console$16("[图片导出] 开始生成课表图片", "", "info");
		showNotify({
			type: "primary",
			message: "正在生成课表图片，请稍候",
			duration: 0
		});
		try {
			const snapdom = pageWindow$2.snapdom;
			const schedule = JSON.parse(readJwglTableToJson());
			await downloadSnapdomImage({
				snapdom,
				target: document.querySelector("table"),
				options: {
					format: "png",
					filename: getJwglExportFilename(schedule, "png"),
					scale: 2.5,
					quality: 1
				},
				fixWebVpn,
				pageWindow: pageWindow$2
			});
			console$16("[图片导出] 导出完成", "", "info");
			showNotify({
				type: "success",
				message: "课表图片已导出"
			});
		} catch (error) {
			console$16("[图片导出] 导出失败", error, "error");
			showNotify({
				type: "danger",
				message: error.message || "课表图片导出失败"
			});
		}
	}
	async function hExportJson() {
		console$16("[JSON 导出] 开始解析当前课表", "", "info");
		try {
			const schedule = JSON.parse(readJwglTableToJson());
			console$16("[JSON 导出] 课表解析完成", {
				courseCount: schedule.courses.length,
				lessonCount: schedule.lessons.length
			}, "debug");
			const result = await prepareScheduleExport(schedule);
			await downloadTextFile(result.content, getJwglExportFilename(schedule, "json"));
			console$16("[JSON 导出] 导出完成", { encrypted: result.encrypted }, "info");
			showNotify({
				type: "success",
				message: result.encrypted ? "加密课表已导出" : "课表 JSON 已导出"
			});
		} catch (error) {
			if (error.code === "EXPORT_CANCELLED") {
				console$16("[JSON 导出] 用户取消导出", "", "info");
				return;
			}
			console$16("[JSON 导出] 导出失败", error, "error");
			showNotify({
				type: "danger",
				message: error.message || "课表导出失败"
			});
		}
	}
	var jwglExcelExporting = false;
	async function hExportExcel() {
		if (jwglExcelExporting) {
			console$16("[Excel 导出] 忽略重复点击", "已有导出任务正在执行", "warn");
			showNotify({
				type: "warning",
				message: "课表 Excel 正在生成，请稍候"
			});
			return;
		}
		jwglExcelExporting = true;
		console$16("[Excel 导出] 开始生成工作簿", "", "info");
		showNotify({
			type: "primary",
			message: "正在生成课表 Excel"
		});
		try {
			const XLSX = pageWindow$2.XLSX;
			const schedule = JSON.parse(readJwglTableToJson());
			const tables = buildJwglExcelTables(schedule);
			const workbook = XLSX.utils.book_new();
			const timetableSheet = XLSX.utils.aoa_to_sheet(tables.timetableRows);
			const detailSheet = XLSX.utils.aoa_to_sheet(tables.detailRows);
			const baseCellStyle = {
				alignment: {
					wrapText: true,
					vertical: "top"
				},
				border: {
					top: {
						style: "thin",
						color: { rgb: "D9E1F2" }
					},
					bottom: {
						style: "thin",
						color: { rgb: "D9E1F2" }
					},
					left: {
						style: "thin",
						color: { rgb: "D9E1F2" }
					},
					right: {
						style: "thin",
						color: { rgb: "D9E1F2" }
					}
				}
			};
			[timetableSheet, detailSheet].forEach((sheet) => Object.keys(sheet).forEach((address) => {
				if (!address.startsWith("!")) sheet[address].s = baseCellStyle;
			}));
			timetableSheet["!cols"] = [{ wch: 18 }, ...Array.from({ length: 7 }, () => ({ wch: 24 }))];
			timetableSheet["!rows"] = [{ hpt: 24 }, ...Array.from({ length: 5 }, () => ({ hpt: 100 }))];
			detailSheet["!cols"] = [
				{ wch: 28 },
				{ wch: 18 },
				{ wch: 20 },
				{ wch: 10 },
				{ wch: 10 },
				{ wch: 16 },
				{ wch: 24 }
			];
			detailSheet["!autofilter"] = { ref: `A1:G${tables.detailRows.length}` };
			XLSX.utils.book_append_sheet(workbook, timetableSheet, "课表");
			XLSX.utils.book_append_sheet(workbook, detailSheet, "课程明细");
			const filename = getJwglExportFilename(schedule, "xlsx");
			await Promise.resolve(XLSX.writeFile(workbook, filename));
			console$16("[Excel 导出] 导出完成", {
				arrangementCount: tables.arrangementCount,
				worksheetCount: workbook.SheetNames.length
			}, "info");
			showNotify({
				type: "success",
				message: "课表 Excel 已导出"
			});
		} catch (error) {
			console$16("[Excel 导出] 导出失败", error, "error");
			showNotify({
				type: "danger",
				message: error.message || "课表 Excel 导出失败"
			});
		} finally {
			jwglExcelExporting = false;
		}
	}
	function installCourseToolbar() {
		if (!document.querySelector("table")) return;
		const ctx = getContext();
		const isWebvpn = !(ctx.host === "jwgl.nxu.edu.cn" || ctx.isJwglIp);
		let container = document.getElementById("h-export");
		if (!container) {
			container = document.createElement("div");
			container.id = "h-export";
			container.style.cssText = "width:100%;padding:1em 2em;box-sizing:border-box;";
			document.querySelector("table").insertAdjacentElement("beforebegin", container);
		}
		mountVueApp({
			root: _sfc_main$6,
			id: "h-export",
			rootProps: {
				onExportImage: () => hExportImage({ fixWebVpn: isWebvpn }),
				onExportJson: hExportJson,
				onExportExcel: hExportExcel
			}
		});
	}
	var console$15 = MyConsole("[教务课表美化]");
	var pageWindow$1 = _unsafeWindow ?? window;
	function notifyCourseBeautifyChanged() {
		pageWindow$1.parent.postMessage({ type: "COURSE_BEAUTIFY_CHANGED" }, "*");
	}
	function createJwglClassNode(content_array, mode = -1) {
		const main = document.createElement("div");
		main.className = "class_main";
		Object.assign(main.style, {
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			marginBottom: "1em"
		});
		const teacherIndex = mode >= 0 ? 0 : 1;
		const subjectIndex = mode >= 0 ? 1 : 0;
		if (/^\s*$/.test(content_array[teacherIndex])) content_array[teacherIndex] = "未知教师";
		if (mode <= 0) {
			const subject = document.createElement("div");
			subject.className = "subject";
			subject.textContent = content_array[subjectIndex];
			main.appendChild(subject);
		}
		const teacher = document.createElement("div");
		teacher.className = "teacher";
		const teacherName = document.createElement("span");
		teacherName.textContent = content_array[teacherIndex];
		const room = document.createElement("mark");
		room.textContent = content_array[3];
		const week = document.createElement("span");
		week.textContent = content_array[2];
		teacher.append(teacherName, room, week);
		main.appendChild(teacher);
		return main;
	}
	function stripNoneprintStyle() {
		const target = ".noneprint{\n	display:none\n}    \n\n";
		pageWindow$1.document.querySelectorAll("style").forEach((styleEl) => {
			const text = styleEl.textContent || "";
			if (text.indexOf(target) === -1) return;
			styleEl.textContent = text.split(target).join("");
		});
	}
	async function beautifyJwglCourseTable() {
		installCourseToolbar();
		if (!getGMValue("Jwgl.courseBeautify") || !document.querySelector("table")) {
			notifyCourseBeautifyChanged();
			return;
		}
		if (typeof _GM_addStyle === "function") _GM_addStyle(`
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
      }
      .subject {
        font-size: 16px;
        font-weight: bold;
        padding: 0.5em 0;
      }
    `);
		else console$15("GM_addStyle 不可用，跳过样式注入", void 0, "warn");
		stripNoneprintStyle();
		const mainTable = document.querySelector("table.listTable#contentListFrame");
		if (mainTable) mainTable.classList.add("optimized");
		document.querySelectorAll("table").forEach((el) => el.style.setProperty("margin-bottom", "3em"));
		document.querySelectorAll("tr").forEach((el) => {
			el.setAttribute("height", "auto");
			el.style.setProperty("min-height", "45px");
		});
		document.querySelectorAll("td").forEach((el) => el.style.setProperty("padding-left", "0"));
		document.querySelectorAll("td > div").forEach((div) => {
			div.style.setProperty("height", "auto");
			div.style.setProperty("padding", "1em 0.5em 0");
			const content_array = parseCourseCellFromJwgl(div, { missingPlaceholder: "空" });
			normalizeCellGroups(content_array);
			div.style.setProperty("display", "flex");
			div.style.setProperty("flex-direction", "column");
			div.style.setProperty("justify-content", "center");
			div.style.setProperty("align-items", "center");
			div.style.setProperty("text-align", "center");
			div.replaceChildren();
			let temp_var;
			for (let i = 0; i < content_array.length; i++) if (content_array.length > 1) {
				if (i === 0 || content_array[i][1] === content_array[i - 1][1]) div.appendChild(createJwglClassNode(content_array[i], i));
				else {
					const separator = document.createElement("div");
					Object.assign(separator.style, {
						height: "1px",
						backgroundColor: "grey",
						width: "90%",
						marginBottom: "1em"
					});
					div.append(separator, createJwglClassNode(content_array[i], 0));
				}
			} else {
				if (/\(外聘|助理|教授\)|\(讲师\)|\(\)/.test(content_array[i][0])) {
					temp_var = content_array[i][0];
					content_array[i][0] = content_array[i][1];
					content_array[i][1] = temp_var;
				}
				div.appendChild(createJwglClassNode(content_array[i]));
			}
		});
		notifyCourseBeautifyChanged();
	}
	var console$14 = MyConsole("[jwgl CourseTable]");
	async function register$11() {
		console$14("进入课表内容页");
		await beautifyJwglCourseTable();
	}
	function normalizeConfigVersion(value) {
		if (typeof value !== "number" && typeof value !== "string") return 0;
		const version = Number(value);
		return Number.isSafeInteger(version) && version >= 0 ? version : 0;
	}
	var _hoisted_1$5 = { style: {
		"font-size": "16px",
		"color": "var(--van-dialog-has-title-message-text-color)",
		"margin": "0.5em 0",
		"padding": "0 2em",
		"display": "flex",
		"flex-direction": "column",
		"justify-content": "center"
	} };
	var _hoisted_2$5 = { style: {
		"text-align": "center",
		"line-height": "23px"
	} };
	var _hoisted_3$5 = { style: { "font-weight": "bold" } };
	var _sfc_main$5 = {
		__name: "VersionDialog",
		props: {
			firstSet: {
				type: [Boolean, Number],
				default: false
			},
			configVersion: {
				type: Number,
				default: 0
			},
			scriptVersion: {
				type: String,
				default: ""
			},
			configVersionLatest: {
				type: Number,
				default: 7
			}
		},
		setup(__props) {
			const props = __props;
			const isFirstSet = !props.firstSet;
			const isVersionUpdate = props.configVersion < props.configVersionLatest;
			const show = (0, vue.ref)(isFirstSet || isVersionUpdate);
			const floatingBubbleContent = (0, vue.ref)("关闭\n搜索栏");
			const searchDom = document.querySelector(".portal-search-wrap");
			const cardDom = document.querySelector(".portal-content");
			const closeSearch = () => {
				searchDom?.classList.add("better-nxu-style-hidden");
				cardDom?.classList.add("better-nxu-style-height-full");
				floatingBubbleContent.value = "打开\n搜索栏";
			};
			const openSearch = () => {
				searchDom?.classList.remove("better-nxu-style-hidden");
				cardDom?.classList.remove("better-nxu-style-height-full");
				floatingBubbleContent.value = "关闭\n搜索栏";
			};
			if (getGMValue("WebVPN.searchClose")) closeSearch();
			const goConfig = () => {
				_GM_openInTab?.("https://sslvpn.nxu.edu.cn/h/settings");
			};
			const closeFunc = async () => {
				await setGMValue("firstSet", true);
				await setGMValue("configVersion", Math.max(props.configVersion, props.configVersionLatest));
			};
			const changeSearch = () => {
				if (searchDom?.classList.contains("better-nxu-style-hidden")) openSearch();
				else closeSearch();
			};
			return (_ctx, _cache) => {
				return (0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, null, [isFirstSet ? ((0, vue.openBlock)(), (0, vue.createBlock)((0, vue.unref)(Dialog), {
					key: 0,
					show: show.value,
					"onUpdate:show": _cache[0] || (_cache[0] = ($event) => show.value = $event),
					title: "Better NXU 首次配置",
					"show-cancel-button": "",
					"confirm-button-text": "前往配置",
					style: {
						"--van-dialog-font-size": "1.5em",
						"--van-dialog-header-padding-top": "18px"
					},
					onConfirm: goConfig,
					onClose: closeFunc
				}, {
					default: (0, vue.withCtx)(() => [..._cache[2] || (_cache[2] = [(0, vue.createElementVNode)("div", { style: {
						"font-size": "16px",
						"color": "var(--van-dialog-has-title-message-text-color)",
						"margin": "0.5em 0",
						"padding": "0 2em",
						"display": "flex",
						"flex-direction": "column",
						"justify-content": "center"
					} }, [(0, vue.createElementVNode)("p", { style: {
						"text-align": "center",
						"line-height": "22px"
					} }, [
						(0, vue.createElementVNode)("span", { style: { "font-weight": "bold" } }, [
							(0, vue.createTextVNode)("这好像是你"),
							(0, vue.createElementVNode)("span", { style: { "color": "#0283ef" } }, "第一次"),
							(0, vue.createTextVNode)("使用本插件")
						]),
						(0, vue.createElementVNode)("br"),
						(0, vue.createTextVNode)(" 我们需要一些配置信息"),
						(0, vue.createElementVNode)("br"),
						(0, vue.createTextVNode)(" 你可以选择"),
						(0, vue.createElementVNode)("span", { style: { "color": "#32ae57" } }, "前往配置"),
						(0, vue.createElementVNode)("br"),
						(0, vue.createTextVNode)(" 或点击"),
						(0, vue.createElementVNode)("span", { style: { "color": "#ff7b35" } }, "取消"),
						(0, vue.createTextVNode)("不进行配置"),
						(0, vue.createElementVNode)("br"),
						(0, vue.createTextVNode)(" 后续自行前往设置页面进行配置 ")
					])], -1)])]),
					_: 1
				}, 8, ["show"])) : isVersionUpdate ? ((0, vue.openBlock)(), (0, vue.createBlock)((0, vue.unref)(Dialog), {
					key: 1,
					show: show.value,
					"onUpdate:show": _cache[1] || (_cache[1] = ($event) => show.value = $event),
					title: "Better NXU 配置更新",
					"show-cancel-button": "",
					"confirm-button-text": "前往配置",
					"cancel-button-text": "稍后",
					style: {
						"--van-dialog-font-size": "1.5em",
						"--van-dialog-header-padding-top": "18px"
					},
					onConfirm: goConfig,
					onClose: closeFunc
				}, {
					default: (0, vue.withCtx)(() => [(0, vue.createElementVNode)("div", _hoisted_1$5, [(0, vue.createElementVNode)("p", _hoisted_2$5, [
						(0, vue.createElementVNode)("span", _hoisted_3$5, "V " + (0, vue.toDisplayString)(__props.scriptVersion), 1),
						_cache[3] || (_cache[3] = (0, vue.createElementVNode)("br", null, null, -1)),
						_cache[4] || (_cache[4] = (0, vue.createTextVNode)(" 我们更新了一些配置信息", -1)),
						_cache[5] || (_cache[5] = (0, vue.createElementVNode)("br", null, null, -1)),
						_cache[6] || (_cache[6] = (0, vue.createTextVNode)(" 建议前往配置页面查看新增或调整项", -1)),
						_cache[7] || (_cache[7] = (0, vue.createElementVNode)("br", null, null, -1)),
						_cache[8] || (_cache[8] = (0, vue.createTextVNode)(" 也可以稍后从 Better NXU 设置中查看 ", -1))
					])])]),
					_: 1
				}, 8, ["show"])) : (0, vue.createCommentVNode)("", true), (0, vue.createVNode)((0, vue.unref)(FloatingBubble), {
					class: "better-nxu-style-floating-bubble",
					onClick: changeSearch
				}, {
					default: (0, vue.withCtx)(() => [(0, vue.createTextVNode)((0, vue.toDisplayString)(floatingBubbleContent.value), 1)]),
					_: 1
				})], 64);
			};
		}
	};
	var _hoisted_1$4 = {
		id: "betternxu-settings",
		class: "wrdvpn-navbar__user"
	};
	var _hoisted_2$4 = { class: "wrdvpn-navbar__user__menu" };
	var _hoisted_3$4 = { class: "wrdvpn-navbar__user__menuitem" };
	var BetterMenu_default = _plugin_vue_export_helper_default({
		__name: "BetterMenu",
		props: { scriptVersion: {
			type: String,
			default: ""
		} },
		setup(__props) {
			return (_ctx, _cache) => {
				return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", _hoisted_1$4, [
					_cache[2] || (_cache[2] = (0, vue.createElementVNode)("svg", {
						viewBox: "0 0 1024 1024",
						version: "1.1",
						xmlns: "http://www.w3.org/2000/svg"
					}, [(0, vue.createElementVNode)("path", {
						d: "M510.37806 337.803609c-98.010221 0-177.748287 78.842673-177.748287 175.75284 0 96.91426 79.738066 175.763073 177.748287 175.763073 9.537214 0 19.620873-0.978281 31.797194-3.088338 18.196431-3.281743 30.290887-20.538779 26.963095-38.471197-2.924609-15.732309-16.693194-27.152407-32.747845-27.152407-2.071172 0-4.15974 0.196475-6.123464 0.563842-7.937786 1.402953-14.233166 2.056845-19.807115 2.056845-61.159942 0-110.915136-49.201585-110.915136-109.671819 0-60.467163 49.679469-109.661585 110.747313-109.661585 61.116963 0 110.832248 49.194422 110.832248 109.661585 0 5.892197-0.656963 12.0832-2.088568 19.531845-3.327792 17.928325 8.769734 35.189454 26.959002 38.464033 2.006703 0.360204 4.045129 0.546446 6.070252 0.546446 16.204054 0 30.019711-11.43033 32.832779-27.116591 2.13871-11.45182 3.13848-21.435195 3.13848-31.41857 0.042979-46.873564-18.435884-90.990341-52.033074-124.223233C602.407056 356.106464 557.790906 337.803609 510.37806 337.803609z",
						fill: "#FFFFFF"
					}), (0, vue.createElementVNode)("path", {
						d: "M938.476161 432.79917c-2.185782-11.426237-11.037381-20.499893-22.563902-23.12058-41.909505-9.508561-76.781734-34.929534-98.185206-71.550593-21.334911-36.560684-26.191522-79.099523-13.68979-119.709429 3.52836-11.123338 0.007163-23.235191-8.951883-30.840402-41.860387-35.721573-89.536222-62.938448-141.695163-80.885192-3.152806-1.088798-6.437619-1.639337-9.776667-1.639337-8.256034 0-16.182564 3.431146-21.724791 9.376555-29.236881 31.04404-68.840878 48.140417-111.5107 48.140417-42.673915 0-82.305541-17.125029-111.607914-48.230468-7.877411-8.333806-20.510126-11.512195-31.580253-7.726985-52.483328 18.171871-100.131535 45.416376-141.640927 80.988546-8.815783 7.591909-12.322653 19.620873-8.934486 30.67258 12.586666 40.645722 7.759731 83.180468-13.597693 119.78106-21.306258 36.5965-56.149834 62.006216-98.17395 71.561849-11.540847 2.709715-20.396539 11.812023-22.559808 23.166629-5.228071 27.169803-7.877411 54.346769-7.877411 80.770582 0 26.426883 2.64934 53.603849 7.873318 80.763418 2.174526 11.411911 11.023054 20.488637 22.552645 23.12058 41.913599 9.512654 76.785827 34.922371 98.19237 71.547523 21.349237 36.59343 26.177196 79.128175 13.583366 119.795387-3.363607 10.969842 0.121773 23.013133 8.973372 30.758538 41.84913 35.707246 89.494267 62.920028 141.662417 80.902588 11.466146 3.885494 23.738657 0.549515 31.454386-7.680936 29.29828-31.091112 68.925812-48.216141 111.593588-48.216141s82.302471 17.125029 111.560842 48.183396c5.556553 5.955642 13.494339 9.380648 21.782096 9.380648 3.27765 0 6.537903-0.520863 9.829879-1.599428 52.126194-17.968234 99.774401-45.184085 141.652184-80.912821 8.791224-7.577582 12.308327-19.628036 8.94165-30.758538-12.597923-40.678468-7.745405-83.20605 13.672394-119.773897 21.324678-36.625152 56.192813-62.030775 98.19237-71.547523 11.390421-2.592035 20.23588-11.633968 22.549575-23.106254 5.223978-27.184129 7.870248-54.358025 7.870248-80.770582C946.342316 487.171522 943.697069 459.965903 938.476161 432.79917zM728.572524 789.878798c-26.02677 20.157085-54.736649 36.553521-85.487 48.818869-36.682457-32.144094-83.60207-49.779753-132.792399-49.779753-48.926316 0-95.838765 17.635659-132.767839 49.786916-30.744211-12.262278-59.45716-28.655643-85.491093-48.812729 9.894348-47.441499 1.889023-96.449679-22.763446-138.627291-24.448832-41.966811-63.427588-73.339332-110.186542-88.840374-2.381234-16.343223-3.584642-32.758078-3.584642-48.869011 0-16.043395 1.203408-32.451086 3.584642-48.851615 46.612621-15.389502 85.584214-46.758953 110.186542-88.850607 24.523533-42.024116 32.525788-91.033319 22.74912-138.620128 26.0237-20.149922 54.735625-36.543288 85.494163-48.815799 36.821627 32.201399 83.73817 49.861618 132.778072 49.861618 49.194422 0 96.109941-17.635659 132.792399-49.779753 30.751375 12.269441 59.45716 28.662807 85.48086 48.812729-9.809413 47.63388-1.835811 96.634898 22.667256 138.620128 24.445762 41.966811 63.416332 73.343425 110.182448 88.850607 2.381234 16.386202 3.584642 32.801057 3.584642 48.940642 0.143263 15.443737-1.031493 31.797194-3.499707 48.701189-46.763047 15.504112-85.73771 46.873564-110.186542 88.836281C726.84416 693.189665 718.845998 742.190683 728.572524 789.878798z",
						fill: "#FFFFFF"
					})], -1)),
					_cache[3] || (_cache[3] = (0, vue.createTextVNode)(" Better NXU ", -1)),
					(0, vue.createElementVNode)("ul", _hoisted_2$4, [(0, vue.createElementVNode)("li", _hoisted_3$4, [(0, vue.createElementVNode)("a", {
						href: "javascript:void(0)",
						onClick: _cache[0] || (_cache[0] = (...args) => (0, vue.unref)(betterNXUVersionClick) && (0, vue.unref)(betterNXUVersionClick)(...args))
					}, "V " + (0, vue.toDisplayString)(__props.scriptVersion), 1)]), _cache[1] || (_cache[1] = (0, vue.createStaticVNode)("<li class=\"wrdvpn-navbar__user__menuitem\" data-v-d0855931><a href=\"https://sslvpn.nxu.edu.cn/h/settings\" target=\"_blank\" rel=\"noopener noreferrer\" data-v-d0855931>设置</a></li><li class=\"wrdvpn-navbar__user__menuitem\" data-v-d0855931><a href=\"https://sslvpn.nxu.edu.cn/h/about\" target=\"_blank\" rel=\"noopener noreferrer\" data-v-d0855931>关于我们</a></li><li class=\"wrdvpn-navbar__user__menuitem\" data-v-d0855931><a href=\"https://github.com/this-is-h/Better-NXU\" target=\"_blank\" rel=\"noopener noreferrer\" data-v-d0855931>Github</a></li>", 3))])
				]);
			};
		}
	}, [["__scopeId", "data-v-d0855931"]]);
	var _hoisted_1$3 = ["href"];
	var _hoisted_2$3 = ["innerHTML"];
	var _hoisted_3$3 = { class: "block-group__item__content" };
	var _hoisted_4$3 = ["title"];
	var _hoisted_5$3 = ["title"];
	var _sfc_main$3 = {
		__name: "CourseGrabCard",
		setup(__props) {
			const cards = [];
			for (let i = 0; i <= 3; i++) cards.push({
				href: `http://202.201.128.234:${8080 + i}`,
				icon: "<div class=\"block-group__item__logo\" style=\"background-color: rgb(80, 135, 229);\">抢</div>",
				title: `备用${i + 1}`,
				content: "仅校园网可用"
			});
			for (let i = 0; i <= 3; i++) {
				const vpnLink = buildWebVpnUrl(`http://202.201.128.234:${8080 + i}/index.action`);
				if (!vpnLink) continue;
				cards.push({
					href: vpnLink,
					icon: "<div class=\"block-group__item__logo\" style=\"background-color: rgb(80, 135, 229);\">抢</div>",
					title: `备用${i + 5}`,
					content: "校外可用"
				});
			}
			return (_ctx, _cache) => {
				return (0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, null, (0, vue.renderList)(cards, (card, index) => {
					return (0, vue.createElementVNode)("div", {
						key: index,
						class: "block-group__item__wrap"
					}, [(0, vue.createElementVNode)("a", {
						target: "_blank",
						href: card.href,
						class: "block-group__item is-active"
					}, [(0, vue.createElementVNode)("div", {
						class: "block-group__item__logo__wrap",
						innerHTML: card.icon
					}, null, 8, _hoisted_2$3), (0, vue.createElementVNode)("div", _hoisted_3$3, [(0, vue.createElementVNode)("h2", {
						title: card.title,
						class: "block-group__item__name"
					}, (0, vue.toDisplayString)(card.title), 9, _hoisted_4$3), (0, vue.createElementVNode)("div", {
						title: card.content,
						class: "block-group__item__desc"
					}, (0, vue.toDisplayString)(card.content), 9, _hoisted_5$3)])], 8, _hoisted_1$3)]);
				}), 64);
			};
		}
	};
	var _hoisted_1$2 = ["href"];
	var _hoisted_2$2 = ["innerHTML"];
	var _hoisted_3$2 = { class: "block-group__item__content" };
	var _hoisted_4$2 = ["title"];
	var _hoisted_5$2 = ["title"];
	var _sfc_main$2 = {
		__name: "CustomToolCard",
		setup(__props) {
			const cards = [
				{
					href: "https://webvpn.nxu.edu.cn/h/tools",
					icon: "<div class=\"block-group__item__logo\" style=\"background-color: #4472c4;\">工</div>",
					title: "站内小工具",
					content: "一些方便的自制小工具"
				},
				{
					href: "https://nxu-cdig.thisish.cn",
					icon: "<div class=\"block-group__item__logo\" style=\"background-color: #95c2fb;\">猫</div>",
					title: "猫狗图鉴",
					content: "猫猫狗狗们的线上家园"
				},
				{
					href: "https://campus-charge.thisish.cn/",
					icon: "<div class=\"block-group__item__logo\" style=\"background-color: #95c2fb;\">猫</div>",
					title: "NXU Charge",
					content: "充电桩状态查看"
				}
			];
			return (_ctx, _cache) => {
				return (0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, null, (0, vue.renderList)(cards, (card, index) => {
					return (0, vue.createElementVNode)("div", {
						key: index,
						class: "block-group__item__wrap"
					}, [(0, vue.createElementVNode)("a", {
						target: "_blank",
						href: card.href,
						class: "block-group__item is-active"
					}, [(0, vue.createElementVNode)("div", {
						class: "block-group__item__logo__wrap",
						innerHTML: card.icon
					}, null, 8, _hoisted_2$2), (0, vue.createElementVNode)("div", _hoisted_3$2, [(0, vue.createElementVNode)("h2", {
						title: card.title,
						class: "block-group__item__name"
					}, (0, vue.toDisplayString)(card.title), 9, _hoisted_4$2), (0, vue.createElementVNode)("div", {
						title: card.content,
						class: "block-group__item__desc"
					}, (0, vue.toDisplayString)(card.content), 9, _hoisted_5$2)])], 8, _hoisted_1$2)]);
				}), 64);
			};
		}
	};
	var _hoisted_1$1 = ["href"];
	var _hoisted_2$1 = ["innerHTML"];
	var _hoisted_3$1 = { class: "block-group__item__content" };
	var _hoisted_4$1 = ["title"];
	var _hoisted_5$1 = ["title"];
	var _sfc_main$1 = {
		__name: "CustomCards",
		props: { customCard: {
			type: Array,
			default: () => []
		} },
		setup(__props) {
			const props = __props;
			const cards = [
				{
					name: "教务管理",
					href: buildWebVpnUrl("https://jwgl.nxu.edu.cn/cas.action", { forceHttps443: true }),
					icon: "<div class=\"block-group__item__logo\" style=\"background-color: rgb(235, 94, 94);\">教</div>",
					title: "教务平台",
					content: "教务管理平台"
				},
				{
					name: "学工系统",
					href: buildWebVpnUrl("https://xsfw.nxu.edu.cn/"),
					icon: "<div class=\"block-group__item__logo\" style=\"background-color: #95c2fb;\">学</div>",
					title: "学工系统",
					content: "学工平台"
				},
				{
					name: "信息门户",
					href: buildWebVpnUrl("https://portal.nxu.edu.cn/"),
					icon: "<div class=\"block-group__item__logo\"><img src=\"/wengine-vpn/js/image/portal_logos/系统集成.png\"></div>",
					title: "信息门户",
					content: "综合信息服务门户"
				},
				{
					name: "中国知网",
					href: buildWebVpnUrl("https://www.cnki.net/"),
					icon: "<div class=\"block-group__item__logo\" style=\"background-color: #1b66e6;\">知</div>",
					title: "中国知网",
					content: "中国期刊全文数据库"
				},
				{
					name: "万方数据",
					href: buildWebVpnUrl("https://www.wanfangdata.com.cn/"),
					icon: "<div class=\"block-group__item__logo\" style=\"background-color: #00417e;\">万</div>",
					title: "万方数据",
					content: "万方数据知识服务平台"
				}
			].filter((c) => props.customCard.indexOf(c.name) !== -1 && c.href);
			return (_ctx, _cache) => {
				return (0, vue.openBlock)(true), (0, vue.createElementBlock)(vue.Fragment, null, (0, vue.renderList)((0, vue.unref)(cards), (card, index) => {
					return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
						key: index,
						class: "block-group__item__wrap"
					}, [(0, vue.createElementVNode)("a", {
						target: "_blank",
						href: card.href,
						class: "block-group__item is-active"
					}, [(0, vue.createElementVNode)("div", {
						class: "block-group__item__logo__wrap",
						innerHTML: card.icon
					}, null, 8, _hoisted_2$1), (0, vue.createElementVNode)("div", _hoisted_3$1, [(0, vue.createElementVNode)("h2", {
						title: card.title,
						class: "block-group__item__name"
					}, (0, vue.toDisplayString)(card.title), 9, _hoisted_4$1), (0, vue.createElementVNode)("div", {
						title: card.content,
						class: "block-group__item__desc"
					}, (0, vue.toDisplayString)(card.content), 9, _hoisted_5$1)])], 8, _hoisted_1$1)]);
				}), 128);
			};
		}
	};
	var console$13 = MyConsole("[webvpn.home]");
	function titleCard(title, id) {
		const group = document.createElement("div");
		group.className = "block-group";
		group.dataset.id = id;
		const h1 = document.createElement("h1");
		h1.className = "block-group__title";
		h1.textContent = title;
		const content = document.createElement("div");
		content.className = "block-group__content";
		group.appendChild(h1);
		group.appendChild(content);
		return {
			group,
			content
		};
	}
	function mountCardGroup(contentEl, hostId, sfc, rootProps) {
		const host = document.createElement("div");
		host.id = hostId;
		contentEl.appendChild(host);
		mountVueApp({
			root: sfc,
			id: hostId,
			rootProps
		});
	}
	async function register$10() {
		const scriptVersion = getContext().version;
		installNotification();
		if (!await waitOrToast("div[title=教务管理平台]", {
			timeout: 15e3,
			predicate: (el) => el.textContent.trim().length > 0,
			level: "error",
			timeoutMessage: "主页加载超时，请刷新后重试",
			errorMessage: "主页加载超时，请刷新后重试",
			duration: 4
		})) return;
		installVantStyle();
		_GM_addStyle?.(`
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
  `);
		const firstSet = getGMValue("firstSet");
		const configVersion = normalizeConfigVersion(getGMValue("configVersion"));
		console$13("检查首次配置与版本提示状态", {
			firstSet,
			configVersion,
			ConfigVersion: 8
		});
		mountVueApp({
			root: _sfc_main$5,
			id: "update",
			rootProps: {
				firstSet,
				configVersion,
				scriptVersion,
				configVersionLatest: 8
			}
		});
		const rtEl = document.querySelector("header .rt");
		if (rtEl) {
			const wrapper = document.createElement("div");
			wrapper.style.cssText = "position:fixed;left:-99999px;top:-99999px;opacity:0";
			document.body.appendChild(wrapper);
			wrapper.id = "better-nxu-menu-host";
			mountVueApp({
				root: BetterMenu_default,
				id: "better-nxu-menu-host",
				rootProps: { scriptVersion }
			});
			if (wrapper.firstElementChild) rtEl.appendChild(wrapper.firstElementChild);
			wrapper.remove();
		} else console$13("未找到 header .rt，BetterMenu 菜单跳过", void 0, "warn");
		const mainDiv = document.querySelector(".portal-content__block .el-scrollbar__view");
		if (mainDiv) {
			if (getGMValue("WebVPN.courseGrab")) {
				const { group, content } = titleCard("抢课备用网址", "classes");
				mainDiv.prepend(group);
				mountCardGroup(content, "better-nxu-coursegrab-host", _sfc_main$3);
			}
			if (getGMValue("WebVPN.customTool")) {
				const { group, content } = titleCard("H - 小工具", "h-tools");
				mainDiv.prepend(group);
				mountCardGroup(content, "better-nxu-customtool-host", _sfc_main$2);
			}
			const customCard = getGMValue("WebVPN.customCard");
			if (Array.isArray(customCard) && customCard.length !== 0) {
				const { group, content } = titleCard("自定义", "custom-cards");
				mainDiv.prepend(group);
				mountCardGroup(content, "better-nxu-customcards-host", _sfc_main$1, { customCard });
			}
		} else console$13("未找到卡片组容器 .portal-content__block .el-scrollbar__view，跳过卡片注入", void 0, "warn");
	}
	var console$12 = MyConsole("[reader.copy]");
	var installations$1 = new WeakMap();
	function installReaderCopy(doc = document) {
		const existing = installations$1.get(doc);
		if (existing) return existing;
		installNotification();
		const style = doc.createElement("style");
		style.textContent = "h1.Chapter { user-select: text !important; -webkit-user-select: text !important; }";
		(doc.head || doc.documentElement).appendChild(style);
		const copy = (event) => {
			if (!event.isTrusted || event.button !== 0) return;
			const selection = doc.defaultView.getSelection();
			if (!selection?.rangeCount) return;
			const text = selection.toString();
			if (!text.trim()) return;
			try {
				_GM_setClipboard?.(text);
			} catch (error) {
				console$12("自动复制失败", { name: error?.name }, "warn");
				toast("warning", "自动复制失败，请使用浏览器复制功能", 3);
			}
		};
		const onPageHide = (event) => {
			if (!event.persisted) cleanup();
		};
		const cleanup = () => {
			doc.removeEventListener("mouseup", copy, true);
			doc.defaultView.removeEventListener("pagehide", onPageHide);
			style.remove();
			installations$1.delete(doc);
		};
		installations$1.set(doc, cleanup);
		doc.addEventListener("mouseup", copy, true);
		doc.defaultView.addEventListener("pagehide", onPageHide);
		toast("success", "已开启复制，选中文字即可自动复制到剪贴板~", 3);
		return cleanup;
	}
	function createLibraryReaderRegistration(id, installSlider) {
		return async () => {
			const platform = resolveLibraryReader(getContext());
			if (platform?.id !== id) return;
			if (platform.copy) installReaderCopy();
			if (platform.slider && installSlider) installSlider({ onError: () => toast("warning", "阅读滑块自动拖动失败，请手动完成验证", 4) });
		};
	}
	var installations = new WeakMap();
	var MAX_ATTEMPTS = 3;
	function installCnkiSlider({ doc = document, drag = dragSlider, onError = () => {} } = {}) {
		const existing = installations.get(doc);
		if (existing) return existing;
		const view = doc.defaultView;
		const handled = new WeakSet();
		let attempts = 0;
		let active = null;
		let frame = null;
		let stopped = false;
		const scan = () => {
			frame = null;
			if (stopped || active || attempts >= MAX_ATTEMPTS || doc.hidden) return;
			const handle = doc.querySelector(".slider-wrapper #js-handler.handler");
			const track = handle?.closest(".slider-wrapper");
			if (!track || handled.has(handle) || !handle.getClientRects().length) return;
			if (!handle.classList.contains("handler_bg")) return;
			const rect = handle.getBoundingClientRect();
			const trackRect = track.getBoundingClientRect();
			const scale = track.offsetWidth ? trackRect.width / track.offsetWidth : 1;
			const left = trackRect.left + (track.clientLeft || 0) * scale;
			const distance = (track.clientWidth ? track.clientWidth * scale : trackRect.width) - rect.width;
			if (distance <= 0 || rect.width <= 0 || Math.abs(rect.left - left) > 1) return;
			handled.add(handle);
			attempts++;
			const controller = new AbortController();
			active = controller;
			Promise.resolve().then(() => drag({
				handle,
				track,
				distance,
				eventTarget: doc,
				signal: controller.signal
			})).catch((error) => {
				if (!controller.signal.aborted) onError(error);
			}).finally(() => {
				if (active === controller) active = null;
				schedule();
			});
		};
		const schedule = () => {
			if (!stopped && !active && attempts < MAX_ATTEMPTS && frame === null) frame = view.requestAnimationFrame(scan);
		};
		const observer = new view.MutationObserver(schedule);
		const onUserPress = (event) => {
			if (event.isTrusted && event.target?.closest(".slider-wrapper")) stop();
		};
		const onPageHide = (event) => {
			active?.abort();
			if (!event.persisted) stop();
		};
		const stop = () => {
			if (stopped) return;
			stopped = true;
			observer.disconnect();
			if (frame !== null) view.cancelAnimationFrame(frame);
			frame = null;
			active?.abort();
			doc.removeEventListener("mousedown", onUserPress, true);
			doc.removeEventListener("touchstart", onUserPress, true);
			doc.removeEventListener("visibilitychange", schedule);
			view.removeEventListener("resize", schedule);
			view.removeEventListener("pageshow", schedule);
			view.removeEventListener("pagehide", onPageHide);
		};
		installations.set(doc, stop);
		observer.observe(doc.documentElement, {
			subtree: true,
			childList: true,
			attributes: true,
			attributeFilter: [
				"class",
				"style",
				"hidden"
			]
		});
		doc.addEventListener("mousedown", onUserPress, true);
		doc.addEventListener("touchstart", onUserPress, true);
		doc.addEventListener("visibilitychange", schedule);
		view.addEventListener("resize", schedule);
		view.addEventListener("pageshow", schedule);
		view.addEventListener("pagehide", onPageHide);
		schedule();
		return stop;
	}
	var register$9 = createLibraryReaderRegistration("cnki", installCnkiSlider);
	var register$8 = createLibraryReaderRegistration("wanfang");
	var console$11 = MyConsole("[webvpn.failed]");
	async function register$7() {
		if (!getGMValue("WebVPN.autoClose")) return;
		console$11("按 WebVPN.autoClose 配置自动关闭失败页");
		closeCurrentTab();
	}
	var tools_css_default = _style("#main,#main .schedule-manager,#main .schedule-manager *{box-sizing:border-box}#main{width:calc(100% - 80px);height:calc(100% - 46px);padding-right:20px;position:absolute;top:46px;left:80px;overflow:hidden}#main>div{box-sizing:border-box;width:100%;height:100%;display:none}#main>div.show{display:block}#searchTeacher>.credits-bar{box-sizing:border-box;color:#000;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);z-index:1000;white-space:nowrap;background:#ffffff1a;border-radius:30px;align-items:center;gap:8px;margin:0;padding:10px 25px;font-size:.9rem;animation:.6s ease-out slideUp;display:flex;position:fixed;bottom:20px;left:calc(50% + 64px);transform:translate(-50%);box-shadow:0 4px 12px #00000026}#searchTeacher .van-cell-group{padding-bottom:60px}.schedule-manager{flex-direction:column;height:100%;display:flex;overflow:hidden}.schedule-manager-tab{background:#f7f8fa;padding:12px}.schedule-manager-actions{border-bottom:1px solid #e1e4e8;flex:none;justify-content:space-between;align-items:center;gap:12px;padding:4px 8px 12px;display:flex}.schedule-manager-hint{color:#6b7280;font-size:13px}.add-btn{color:#fff;cursor:pointer;background:#4a6bdf;border:none;border-radius:6px;align-items:center;gap:5px;padding:8px 12px;font-size:14px;transition:background-color .2s;display:flex}.add-btn:hover{background:#3a5bc7}.add-btn:disabled{cursor:not-allowed;opacity:.55}.export-container{margin-right:15px;position:relative}.export-btn{color:#fff;cursor:pointer;background:#a0a0a0;border:none;border-radius:6px;align-items:center;gap:5px;margin-right:5px;padding:8px 12px;font-size:14px;transition:background-color .2s;display:flex}.export-btn:hover{background:#5b5b5b}.export-dropdown{z-index:100;background:#fff;border-radius:6px;min-width:120px;padding:8px 0;position:absolute;top:100%;right:0;box-shadow:0 4px 12px #0000001a}.export-dropdown div{cursor:pointer;color:#4a5568;padding:8px 16px;transition:background-color .2s}.export-dropdown div:hover{color:#4a6bdf;background-color:#f0f4ff}.file-list-header{background:0 0;border-bottom:1px solid #e1e4e8;padding:15px 20px}.file-list-header h3{color:#4a5568;margin-top:0;margin-bottom:10px;font-size:16px;font-weight:600}.files-display{flex-wrap:wrap;gap:8px;display:flex}.file-tag{color:#4a5568;background:#edf2f7;border-radius:20px;align-items:center;gap:6px;padding:6px 12px;font-size:13px;display:flex}.tag-delete-btn{color:#718096;cursor:pointer;background:0 0;border:none;border-radius:50%;justify-content:center;align-items:center;width:16px;height:16px;font-size:14px;display:flex}.tag-delete-btn:hover{color:#e53e3e;background:#fff5f5}.main-content{flex-direction:column;flex:1;display:flex;overflow:hidden}.schedule-container{flex:1;padding:12px 0 0;overflow:auto}.schedule-table{border-collapse:collapse;table-layout:fixed;background:#fff;width:100%}.schedule-table th,.schedule-table td{text-align:center;border:1px solid #e1e4e8;padding:12px}.schedule-table th{color:#4a5568;background-color:#f8f9ff;font-size:14px;font-weight:600}.schedule-table th.time-header{width:80px;font-weight:600;background-color:#f0f4ff!important}.period-cell{background-color:#f8f9ff;font-size:14px;font-weight:600}.schedule-cell{vertical-align:top;min-height:80px;padding:8px}.file-item-display{color:#2b6cb0;word-break:break-all;background:#ebf4ff;border-radius:4px;margin-bottom:4px;padding:6px 8px;font-size:13px}.file-item-display.file-item-all-free{color:#07c160;background:#e8f8ef;font-weight:600}.file-item-display.file-item-online-only{color:#ad6800;background:#fff7e6;font-weight:600}.availability-summary{color:#646566;margin-top:6px;font-size:11px;font-weight:600}.availability-summary.status-free{color:#078b47}.availability-summary.status-online{color:#ad6800}.availability-summary.status-none{color:#c41d7f}.empty-cell{color:#a0aec0;justify-content:center;align-items:center;height:100%;font-size:12px;display:flex}.visually-hidden{clip:rect(0, 0, 0, 0)!important;white-space:nowrap!important;border:0!important;width:1px!important;height:1px!important;margin:-1px!important;padding:0!important;position:absolute!important;overflow:hidden!important}@media (width<=768px){.schedule-table{font-size:12px}.schedule-table th,.schedule-table td{padding:6px}}.personal-schedule-page{background:#f7f8fa;flex-direction:column;min-width:0;height:100%;display:flex;overflow:hidden}#main>.personal-schedule-page.show{display:flex}.personal-schedule-toolbar{background:#fff;border-bottom:1px solid #ebedf0;flex-wrap:wrap;flex:none;align-items:center;gap:12px;padding:8px 12px;display:flex}.personal-link-search-form{flex:420px;min-width:240px}.personal-link-search{width:100%;padding:0}.personal-schedule-actions{flex-wrap:wrap;flex:none;align-items:center;gap:8px;display:flex}.personal-schedule-tabs{flex-direction:column;flex:1;min-height:0;display:flex;overflow:hidden}.personal-schedule-tabs>.van-tabs__wrap{flex:none}.personal-schedule-tabs>.van-tabs__content{flex:1;min-height:0}.personal-schedule-tabs>.van-tabs__content>.van-tab__panel{height:100%;overflow:hidden}.schedule-key-page{background:#f7f8fa;height:100%;padding:12px 16px;overflow:auto}.schedule-key-content{width:100%;max-width:100%}.schedule-key-guide{color:#4b5563;border-left:4px solid #1989fa;margin-bottom:18px;padding:8px 12px;line-height:1.65}.schedule-key-guide p{margin:4px 0}.schedule-key-empty{flex-direction:column;align-items:center;padding-bottom:24px;display:flex}.schedule-key-section{border-top:1px solid #ebedf0;padding:16px 0}.schedule-private-key-section{border-color:#ebedf0}.schedule-key-section-title{justify-content:space-between;align-items:center;gap:12px;margin-bottom:10px;display:flex}.schedule-key-section-title strong,.schedule-key-section-title span{display:block}.schedule-key-section-title span{color:#6b7280;margin-top:3px;font-size:13px}.schedule-key-buttons{flex-wrap:wrap;justify-content:flex-end;gap:8px;display:flex}.schedule-key-text{resize:vertical;color:#334155;word-break:break-all;background:#f8fafc;border:1px solid #dcdfe6;border-radius:8px;width:100%;padding:10px;font:12px/1.5 Consolas,Monaco,monospace}.schedule-private-key-text{background:#fff}.schedule-private-key-hidden{color:#6b7280;text-align:center;background:#f3f4f6;padding:24px 12px}.schedule-key-regenerate{justify-content:flex-end;margin-top:18px;display:flex}.personal-panel-shell{flex-direction:column;height:100%;min-height:0;display:flex}.personal-week-filter{background:#fff;border-bottom:1px solid #f0f1f2;flex:none;padding:6px 12px;overflow:hidden}.personal-week-axis{--van-radius-sm:var(--van-radius-max);--van-tabs-card-height:32px}.personal-week-axis>.van-tabs__wrap{justify-content:center;align-items:center;display:flex}.personal-week-axis .van-tabs__nav--card{max-width:100%;margin:0}.personal-week-axis .van-tabs__nav--card .van-tab{min-width:64px}.personal-schedule-capture{background:#f7f8fa;flex:1;min-height:0;padding:12px;overflow:auto}.personal-table-capture{width:100%;min-width:1002px;min-height:100%}.personal-stats-capture{min-height:100%}.personal-course-grid{background:#ebedf0;border-radius:8px;grid-template-rows:38px repeat(10,minmax(52px,auto));grid-template-columns:92px repeat(7,minmax(130px,1fr));gap:1px;width:100%;min-width:1002px;padding:1px;display:grid;box-shadow:0 2px 10px #0000000d}.personal-course-grid-corner,.personal-course-grid-day,.personal-course-grid-period,.personal-course-grid-cell{box-sizing:border-box;min-width:0}.personal-course-grid-corner,.personal-course-grid-day{color:#4a5568;background:#f0f4ff;justify-content:center;align-items:center;font-size:13px;font-weight:600;display:flex}.personal-course-grid-corner{grid-area:1/1}.personal-course-grid-period{color:#4a5568;text-align:center;background:#f8f9ff;flex-direction:column;justify-content:center;align-items:center;padding:4px;font-size:11px;display:flex}.personal-course-grid-cell{z-index:1;background:#fff}.personal-table{table-layout:fixed;border-spacing:0;border-collapse:separate;background:#fff;border-radius:8px;width:100%;min-width:980px;overflow:hidden;box-shadow:0 2px 10px #0000000d}.personal-table th,.personal-table td{text-align:center;vertical-align:top;border-bottom:1px solid #ebedf0;border-right:1px solid #ebedf0;padding:6px}.personal-table thead th{color:#4a5568;background:#f0f4ff;height:38px;font-size:13px}.personal-table .personal-period-cell{color:#4a5568;vertical-align:middle;background:#f8f9ff;width:92px;min-width:92px;font-size:12px}.personal-course-card{color:#2d3748;text-align:left;word-break:break-word;background:#edf3ff;border-left:3px solid #4a6bdf;border-radius:6px;margin-bottom:5px;padding:7px 6px;line-height:1.35}.personal-course-card:last-child{margin-bottom:0}.personal-course-stack{z-index:2;box-sizing:border-box;flex-direction:column;justify-content:flex-start;align-self:stretch;gap:4px;min-width:0;margin:3px;display:flex}.personal-course-stack>.personal-course-card{box-sizing:border-box;flex:none;width:100%;min-height:0;margin-bottom:0}.personal-course-name{color:#2949b8;flex:1;min-width:0;font-size:13px;font-weight:600}.personal-course-header{justify-content:space-between;align-items:flex-start;gap:5px;display:flex}.personal-course-variant-count{color:#4a6bdf;white-space:nowrap;background:#dfe7ff;border-radius:999px;flex:none;padding:1px 5px;font-size:10px;line-height:1.5}.personal-course-variant-count.overlap{color:#d46b08;background:#fff3e0}.personal-course-variants{border-top:1px solid #d9e1f2;margin-top:5px}.personal-course-variant{padding:5px 0}.personal-course-variant+.personal-course-variant{border-top:1px dashed #d9e1f2}.personal-course-variant-weeks{color:#4a6bdf;font-size:11px;font-weight:600}.personal-course-variant-detail{color:#646566;margin-top:1px;font-size:11px}.personal-course-meta{color:#646566;margin-top:2px;font-size:11px}.personal-free-cell{color:#1989fa;white-space:pre-line;justify-content:center;align-items:center;min-height:52px;font-size:12px;line-height:1.45;display:flex}.personal-not-free{color:#c8c9cc}.personal-all-term-free{color:#07c160;font-weight:600}.personal-online-only{color:#ad6800;font-weight:600}.personal-empty-state{justify-content:center;align-items:center;height:100%;min-height:260px;display:flex}.personal-stats{height:100%;padding:12px;overflow:auto}.personal-stat-grid{grid-template-columns:repeat(4,minmax(130px,1fr));gap:10px;margin-bottom:12px;display:grid}.personal-stat-card,.personal-chart-card{background:#fff;border-radius:8px;padding:14px;box-shadow:0 2px 10px #0000000d}.personal-stat-value{color:#4a6bdf;margin-top:4px;font-size:26px;font-weight:700}.personal-stat-label,.personal-stat-unit{color:#969799;font-size:12px}.personal-chart-card h3{color:#323233;margin:0 0 12px;font-size:16px}.personal-week-bars{align-items:flex-end;gap:8px;min-height:210px;padding:8px 4px 0;display:flex;overflow-x:auto}.personal-week-bar-item{text-align:center;color:#969799;flex:1 0 36px;min-width:36px;font-size:11px}.personal-week-bar-track{justify-content:center;align-items:flex-end;height:160px;display:flex}.personal-week-bar{background:linear-gradient(#6f8df3,#4a6bdf);border-radius:5px 5px 0 0;width:22px;min-height:2px}.personal-week-bar-value{color:#4a6bdf;margin-bottom:3px;font-weight:600}@media (width<=900px){.personal-schedule-toolbar{flex-direction:column;align-items:stretch;gap:6px}.personal-link-search-form{flex-basis:auto;width:100%;min-width:0}.schedule-manager-actions{flex-direction:column;align-items:stretch}.schedule-manager-actions>div{justify-content:flex-start!important}.personal-stat-grid{grid-template-columns:repeat(2,minmax(120px,1fr))}.schedule-key-page{padding:10px}.schedule-key-section-title{flex-direction:column;align-items:stretch}.schedule-key-buttons{justify-content:flex-start}}");
	var personalDays = Array.from({ length: 7 }, (_, index) => ({
		number: index + 1,
		text: weekdayText(index + 1)
	}));
	var personalPeriodRows = periodTimes.map(({ period, start, end }) => ({
		key: String(period),
		label: String(period),
		period,
		periods: [period],
		time: `${start}-${end}`
	}));
	function getTotalWeeks(data) {
		if (!data) return 0;
		return Number(data.meta?.weekRange?.end) || Math.max(0, ...data.lessons.map((lesson) => Number(lesson.week) || 0));
	}
	function courseColor(id) {
		const colors = [
			"#4a6bdf",
			"#07c160",
			"#ee0a24",
			"#ff976a",
			"#7232dd",
			"#1989fa",
			"#8b5a2b"
		];
		return colors[String(id || "").split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) % colors.length];
	}
	function splitConsecutivePeriods(periods) {
		const values = [...new Set((periods || []).map(Number))].filter((period) => Number.isInteger(period) && period >= 1 && period <= 10).sort((left, right) => left - right);
		const segments = [];
		values.forEach((period) => {
			const segment = segments[segments.length - 1];
			if (!segment || period !== segment[segment.length - 1] + 1) segments.push([period]);
			else segment.push(period);
		});
		return segments;
	}
	function buildPersonalCourseEntries(data, week = 0) {
		const maps = getMaps(data);
		const groups = new Map();
		data.lessons.filter((lesson) => !week || lesson.week === week).forEach((lesson) => {
			const detail = getLessonDetail(maps, lesson);
			const teachers = detail.teachers || [];
			const periods = [...lesson.periods].sort((left, right) => left - right);
			const groupKey = [
				lesson.courseId,
				lesson.weekday,
				periods.join(",")
			].join("|");
			if (!groups.has(groupKey)) groups.set(groupKey, {
				key: groupKey,
				name: detail.course.name || "未命名课程",
				weekday: lesson.weekday,
				periods,
				periodText: lesson.periodText || formatPeriods(periods),
				color: courseColor(lesson.courseId),
				variants: new Map()
			});
			const group = groups.get(groupKey);
			const teacherKey = [...teachers].sort().join("、");
			const variantKey = [
				lesson.scheduleId,
				teacherKey,
				detail.room
			].join("|");
			if (!group.variants.has(variantKey)) group.variants.set(variantKey, {
				key: variantKey,
				teacherText: detail.teacherText || "",
				room: detail.room || "",
				weeks: []
			});
			group.variants.get(variantKey).weeks.push(lesson.week);
		});
		const totalWeeks = getTotalWeeks(data);
		return [...groups.values()].map((group) => {
			const variants = [...group.variants.values()].map((variant) => {
				const weeks = [...new Set(variant.weeks)].sort((left, right) => left - right);
				return {
					...variant,
					weeks,
					weeksText: formatWeeks(weeks, totalWeeks),
					detailText: [variant.teacherText, variant.room].filter(Boolean).join(" · ") || "未注明教师与教室"
				};
			}).sort((left, right) => (left.weeks[0] || 0) - (right.weeks[0] || 0) || left.teacherText.localeCompare(right.teacherText, "zh-Hans-CN") || left.room.localeCompare(right.room, "zh-Hans-CN"));
			const seenWeeks = new Set();
			const hasOverlappingVariants = variants.some((variant) => variant.weeks.some((item) => {
				if (seenWeeks.has(item)) return true;
				seenWeeks.add(item);
				return false;
			}));
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
	}
	function buildPersonalCourseLayout(entries) {
		const blocksByDay = new Map();
		entries.forEach((entry) => splitConsecutivePeriods(entry.periods).forEach((segment) => {
			const startPeriod = segment[0];
			const endPeriod = segment[segment.length - 1];
			const block = {
				...entry,
				key: `${entry.key}|${startPeriod}-${endPeriod}`,
				periods: segment,
				periodText: formatPeriods(segment),
				startPeriod,
				endPeriod
			};
			if (!blocksByDay.has(entry.weekday)) blocksByDay.set(entry.weekday, []);
			blocksByDay.get(entry.weekday).push(block);
		}));
		const result = [];
		[...blocksByDay.keys()].sort((left, right) => left - right).forEach((weekday) => {
			const dayBlocks = blocksByDay.get(weekday).sort((left, right) => left.startPeriod - right.startPeriod || left.endPeriod - right.endPeriod || left.name.localeCompare(right.name, "zh-Hans-CN"));
			const components = [];
			let component = [];
			let componentEnd = 0;
			dayBlocks.forEach((block) => {
				if (component.length && block.startPeriod > componentEnd) {
					components.push(component);
					component = [];
					componentEnd = 0;
				}
				component.push(block);
				componentEnd = Math.max(componentEnd, block.endPeriod);
			});
			if (component.length) components.push(component);
			components.forEach((items) => {
				const startPeriod = Math.min(...items.map((item) => item.startPeriod));
				const endPeriod = Math.max(...items.map((item) => item.endPeriod));
				result.push({
					key: [
						weekday,
						startPeriod,
						endPeriod,
						...items.map((item) => item.key)
					].join("|"),
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
	}
	function isOnlineLesson(maps, lesson) {
		const detail = getLessonDetail(maps, lesson);
		return /尔雅/.test(`${detail.course.name || ""} ${detail.room || ""}`);
	}
	function getLessonAvailability(data, maps, week, weekday, period) {
		return classifyScheduleSlot((data.busySlots[`${week}-${weekday}-${period}`] || []).map((id) => maps.lessons.get(id)).filter(Boolean), (lesson) => isOnlineLesson(maps, lesson));
	}
	function formatAvailabilityWeeks(freeWeeks, onlineWeeks, totalWeeks) {
		const parts = [];
		if (freeWeeks.length) parts.push(`${formatWeeks(freeWeeks, totalWeeks)}完全空闲`);
		if (onlineWeeks.length) parts.push(`${formatWeeks(onlineWeeks, totalWeeks)}仅有线上课程（可协调）`);
		return parts.length ? parts.join("\n") : "有课";
	}
	function buildPersonalFreeGrid(data, selectedWeek = 0) {
		const grid = Object.fromEntries(personalPeriodRows.map((row) => [row.key, Object.fromEntries(personalDays.map((day) => [day.number, {
			isFree: false,
			isAllTermFree: false,
			hasOnline: false,
			text: "有课",
			ariaLabel: `${day.text}第${row.label}节：有课`
		}]))]));
		if (!data) return grid;
		const maps = getMaps(data);
		const totalWeeks = getTotalWeeks(data);
		const weeks = selectedWeek ? [selectedWeek] : Array.from({ length: totalWeeks }, (_, index) => index + 1);
		personalPeriodRows.forEach((row) => personalDays.forEach((day) => {
			const periodStates = row.periods.map((period) => {
				const states = weeks.map((week) => ({
					week,
					status: getLessonAvailability(data, maps, week, day.number, period)
				}));
				return {
					period,
					freeWeeks: states.filter((item) => item.status === "free").map((item) => item.week),
					onlineWeeks: states.filter((item) => item.status === "online").map((item) => item.week)
				};
			});
			let text;
			if (selectedWeek) {
				const labels = periodStates.map((state) => state.freeWeeks.length ? "完全空闲" : state.onlineWeeks.length ? "仅有线上课程（可协调）" : "有课");
				text = labels.every((label) => label === labels[0]) ? labels[0] : periodStates.map((state, index) => `第${state.period}节${labels[index]}`).join("\n");
			} else {
				const signatures = periodStates.map((state) => `${state.freeWeeks.join(",")}|${state.onlineWeeks.join(",")}`);
				if (signatures.every((value) => value === signatures[0])) text = formatAvailabilityWeeks(periodStates[0].freeWeeks, periodStates[0].onlineWeeks, totalWeeks);
				else text = periodStates.map((state) => `第${state.period}节：${formatAvailabilityWeeks(state.freeWeeks, state.onlineWeeks, totalWeeks)}`).join("\n");
			}
			const hasOnline = periodStates.some((state) => state.onlineWeeks.length);
			grid[row.key][day.number] = {
				isFree: periodStates.some((state) => state.freeWeeks.length || state.onlineWeeks.length),
				isAllTermFree: !selectedWeek && totalWeeks > 0 && periodStates.every((state) => state.freeWeeks.length === totalWeeks),
				hasOnline,
				text,
				ariaLabel: `${day.text}第${row.label}节：${text.replace(/\n/g, "；")}`
			};
		}));
		return grid;
	}
	var console$10 = MyConsole("[教师查询]");
	function xmlToJson(xml) {
		const xmlDoc = new DOMParser().parseFromString(xml, "application/xml");
		if (xmlDoc.querySelector("parsererror")) throw new Error("教师查询接口返回了无效 XML");
		return parseElement(xmlDoc.documentElement);
	}
	function parseElement(element) {
		let obj = {};
		if (element.nodeType === 1) {
			if (element.attributes.length > 0) {
				obj["@attributes"] = {};
				for (let j = 0; j < element.attributes.length; j++) {
					const attribute = element.attributes.item(j);
					obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
				}
			}
		} else if (element.nodeType === 3) obj = element.nodeValue;
		if (element.hasChildNodes()) for (let i = 0; i < element.childNodes.length; i++) {
			const item = element.childNodes.item(i);
			const nodeName = item.nodeName;
			if (typeof obj[nodeName] === "undefined") obj[nodeName] = parseElement(item);
			else {
				if (typeof obj[nodeName].push === "undefined") {
					const old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(parseElement(item));
			}
		}
		return obj;
	}
	function searchTeachers(name, page = 1, options = {}) {
		return new Promise((resolve, reject) => {
			const data = new URLSearchParams({
				word: String(name || ""),
				index: "0",
				currentPage: String(page),
				sql: "teacher",
				tea: "1",
				srtp_teacher_project_num: "4",
				planyear: "null",
				planid: "undefined",
				university_en_name: "undefined"
			}).toString();
			console$10("开始请求分页数据", { page }, "debug");
			const xhr = new XMLHttpRequest();
			xhr.withCredentials = true;
			xhr.timeout = Math.max(1e3, Number(options.timeout || 15e3));
			let settled = false;
			const abortError = () => {
				const error = new Error("教师查询已取消");
				error.name = "AbortError";
				return error;
			};
			const onAbortSignal = () => xhr.abort();
			const cleanup = () => options.signal?.removeEventListener("abort", onAbortSignal);
			const resolveOnce = (value) => {
				if (settled) return;
				settled = true;
				cleanup();
				resolve(value);
			};
			const rejectOnce = (error) => {
				if (settled) return;
				settled = true;
				cleanup();
				reject(error);
			};
			if (options.signal?.aborted) {
				rejectOnce(abortError());
				return;
			}
			options.signal?.addEventListener("abort", onAbortSignal, { once: true });
			xhr.addEventListener("readystatechange", function() {
				if (this.readyState !== this.DONE || settled) return;
				if (options.signal?.aborted) {
					rejectOnce(abortError());
					return;
				}
				if (this.status >= 200 && this.status < 300) try {
					const raw_result = xmlToJson(this.responseText);
					if (!raw_result.page?.["#text"]) {
						console$10("WebVPN 登录状态已失效", { page }, "warn");
						resolveOnce({
							success: false,
							msg: "webvpn登录已过期"
						});
						return;
					}
					const pages = raw_result.page["#text"].match(/第(\d+)\/(\d+)页/);
					if (!pages) {
						console$10("无法识别分页信息", { page }, "error");
						resolveOnce({
							success: false,
							msg: "教师查询结果格式异常"
						});
						return;
					}
					const now_page = Number.parseInt(pages[1], 10);
					const all_page = Number.parseInt(pages[2], 10);
					if (all_page === 0) {
						console$10("当前关键词没有结果", { page }, "info");
						resolveOnce({
							success: false,
							msg: "查询不到该教师"
						});
						return;
					}
					const result = {
						success: true,
						page: [now_page, all_page],
						data: []
					};
					const val = raw_result.val;
					const word = raw_result.word;
					const remind = raw_result.remind;
					if (!val || !word || !remind) {
						console$10("教师查询结果字段缺失", { page }, "error");
						resolveOnce({
							success: false,
							msg: "教师查询结果格式异常"
						});
						return;
					}
					const values = Array.isArray(val) ? val : [val];
					const words = Array.isArray(word) ? word : [word];
					const reminders = Array.isArray(remind) ? remind : [remind];
					if (values.length !== words.length || values.length !== reminders.length) {
						resolveOnce({
							success: false,
							msg: "教师查询结果格式异常"
						});
						return;
					}
					for (let i = 0; i < values.length; i++) {
						const number = String(values[i]?.["#text"] || "");
						const rawName = String(words[i]?.["#text"] || "");
						const unit = String(reminders[i]?.["#text"] || "");
						if (!number || !rawName) {
							resolveOnce({
								success: false,
								msg: "教师查询结果格式异常"
							});
							return;
						}
						result.data.push({
							name: rawName.replace(`${number}-`, ""),
							number,
							unit
						});
					}
					console$10("分页数据解析完成", {
						page: now_page,
						totalPages: all_page,
						resultCount: result.data.length
					}, "debug");
					resolveOnce(result);
				} catch (error) {
					console$10("教师查询结果解析失败", {
						page,
						error
					}, "error");
					rejectOnce(new Error("教师查询结果解析失败"));
				}
				else {
					console$10("接口返回异常状态", {
						page,
						status: this.status
					}, "error");
					rejectOnce(new Error(`Request failed with status ${this.status}`));
				}
			});
			xhr.addEventListener("error", function() {
				console$10("请求发生网络错误", { page }, "error");
				rejectOnce(new Error("Network error"));
			});
			xhr.addEventListener("timeout", function() {
				console$10("请求超时", {
					page,
					timeout: xhr.timeout
				}, "warn");
				rejectOnce(new Error("教师查询请求超时"));
			});
			xhr.addEventListener("abort", function() {
				rejectOnce(abortError());
			});
			xhr.open("POST", "https://webvpn.nxu.edu.cn/http/77726476706e69737468656265737421a2a713d27560391e2f5ad1e2c90171/StuExpbook/AutoCompleteServletSrtp?vpn-12-o1-202.201.128.142=");
			xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
			try {
				xhr.send(data);
			} catch (err) {
				console$10("请求发送失败", {
					page,
					error: err
				}, "error");
				rejectOnce(err);
			}
		});
	}
	async function fetchWithTimeout(fetchImpl, input, init = {}, options = {}) {
		if (typeof fetchImpl !== "function") throw new TypeError("fetch 实现不可用");
		const requestedTimeout = Number(options.timeoutMs);
		const timeoutMs = Number.isFinite(requestedTimeout) && requestedTimeout > 0 ? requestedTimeout : 15e3;
		const externalSignal = options.signal ?? init.signal;
		const controller = new AbortController();
		let timedOut = false;
		const abortFromCaller = () => controller.abort(externalSignal?.reason);
		if (externalSignal?.aborted) {
			const abortError = new Error("请求已取消");
			abortError.name = "AbortError";
			throw abortError;
		}
		externalSignal?.addEventListener("abort", abortFromCaller, { once: true });
		const timer = setTimeout(() => {
			timedOut = true;
			controller.abort();
		}, timeoutMs);
		let rejectOnAbort;
		const interrupted = new Promise((_resolve, reject) => {
			rejectOnAbort = () => reject(controller.signal.reason);
			controller.signal.addEventListener("abort", rejectOnAbort, { once: true });
		});
		const execute = async () => {
			const response = await fetchImpl(input, {
				...init,
				signal: controller.signal
			});
			controller.signal.throwIfAborted();
			return typeof options.consumeResponse === "function" ? options.consumeResponse(response) : response;
		};
		try {
			const result = await Promise.race([execute(), interrupted]);
			controller.signal.throwIfAborted();
			return result;
		} catch (error) {
			if (timedOut) {
				const timeoutError = new Error(`请求在 ${timeoutMs}ms 内未完成`, { cause: error });
				timeoutError.name = "TimeoutError";
				throw timeoutError;
			}
			if (externalSignal?.aborted && error?.name !== "AbortError") {
				const abortError = new Error("请求已取消", { cause: error });
				abortError.name = "AbortError";
				throw abortError;
			}
			throw error;
		} finally {
			clearTimeout(timer);
			controller.signal.removeEventListener("abort", rejectOnAbort);
			externalSignal?.removeEventListener("abort", abortFromCaller);
		}
	}
	var pageWindow = _unsafeWindow ?? window;
	function extractIcsId(payload) {
		const visited = new Set();
		const candidates = new Set();
		const preferredKeys = /^(?:icsId|icsid|shareId|shareid|calendarId|calendarid|calUrl|calurl|shareUrl|shareurl|url)$/;
		function walk(value, key = "") {
			if (typeof value === "string") {
				const urlMatch = value.replace(/\\\//g, "/").match(/portal\.nxu\.edu\.cn\/cal\/(\d{6,})/i);
				if (urlMatch) return urlMatch[1];
				if (preferredKeys.test(key) && /^\d{6,}$/.test(value.trim())) return value.trim();
				if (/^\d{6,}$/.test(value.trim()) && !["20284725165199735", "1384527242405474304"].includes(value.trim())) candidates.add(value.trim());
				if (/^[[{]/.test(value.trim())) try {
					return walk(JSON.parse(value), key);
				} catch {
					return "";
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
		return walk(payload) || (candidates.size === 1 ? [...candidates][0] : "");
	}
	async function getIcsId(options = {}) {
		let responseText;
		try {
			responseText = await fetchWithTimeout(pageWindow.fetch.bind(pageWindow), buildWebVpnUrl("https://portal.nxu.edu.cn/execCardMethod/20284725165199735/SYS_CARD_CALENDAR"), {
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
					param: {
						calId: "1384527242405474304",
						lang: "zh_CN"
					},
					n: String(Math.random())
				})
			}, {
				signal: options.signal,
				timeoutMs: options.timeoutMs || 15e3,
				consumeResponse(response) {
					if (!response.ok) throw new Error(`个人课表 ID 获取失败：HTTP ${response.status}`);
					return response.text();
				}
			});
		} catch (error) {
			if (error?.name === "TimeoutError") throw new Error("个人课表 ID 获取超时，请稍后重试", { cause: error });
			throw error;
		}
		let payload = responseText;
		try {
			payload = JSON.parse(responseText);
		} catch {}
		const icsId = extractIcsId(responseText) || extractIcsId(payload);
		if (!icsId) throw new Error("响应中未找到个人课表 ID，请确认信息门户登录状态");
		options.signal?.throwIfAborted();
		await setGMValue("icsId", icsId);
		return icsId;
	}
	async function getStudentOwner(studentId, options = {}) {
		const normalizedId = String(studentId || "").trim();
		let result;
		try {
			result = await fetchWithTimeout(pageWindow.fetch.bind(pageWindow), buildWebVpnUrl("https://xsfw.nxu.edu.cn/xsfw/sys/jbxxapp/modules/infoStudent/getStuBaseInfo.do?vpn-12-o2-xsfw.nxu.edu.cn"), {
				method: "POST",
				credentials: "include",
				headers: { Accept: "application/json, text/plain, */*" },
				body: new URLSearchParams({ requestParamStr: JSON.stringify({ XSBH: normalizedId }) })
			}, {
				signal: options.signal,
				timeoutMs: options.timeoutMs || 15e3,
				consumeResponse(response) {
					if (!response.ok) throw new Error(`身份信息获取失败：HTTP ${response.status}`);
					return response.json();
				}
			});
		} catch (error) {
			if (error?.name === "TimeoutError") throw new Error("身份信息获取超时，请稍后重试", { cause: error });
			throw error;
		}
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
	async function parseScheduleFileContent(text, options = {}) {
		const content = String(text || "");
		const outerSize = byteLength(content);
		if (outerSize > 7340032) throw scheduleOperationError(FILE_TOO_LARGE, "课表文件不能超过 7 MB");
		let parsed;
		try {
			parsed = JSON.parse(content);
		} catch {
			throw scheduleOperationError(INVALID_JSON, "文件不是有效的 JSON");
		}
		if (parsed?.schemaVersion === "2.0") {
			if (outerSize > 5242880) throw scheduleOperationError(FILE_TOO_LARGE, "课表内容不能超过 5 MB");
			return normalize(parsed);
		}
		if (!isEncryptedEnvelope(parsed)) return normalize(parsed);
		const { header } = inspectEnvelope(parsed);
		getCryptoApi();
		const keyCache = options.keyCache || new Map();
		const declinedKeyIds = options.declinedKeyIds || new Set();
		const tryDecrypt = async (privateKey) => {
			return parseScheduleJson(await decryptEnvelope(parsed, privateKey), true);
		};
		if (keyCache.has(header.kid)) return await tryDecrypt(keyCache.get(header.kid));
		const currentKeyPair = getGMValue(storageKey);
		if (currentKeyPair?.privateKey && (!currentKeyPair.keyId || currentKeyPair.keyId === header.kid)) try {
			const currentPrivateKey = await importPrivateKey(currentKeyPair.privateKey);
			const schedule = await tryDecrypt(currentPrivateKey);
			keyCache.set(header.kid, currentPrivateKey);
			return schedule;
		} catch (error) {
			if (error.code !== "DECRYPT_FAILED" && error.code !== "INVALID_KEY") throw error;
		}
		if (declinedKeyIds.has(header.kid)) throw scheduleOperationError(KEY_REQUIRED, "未提供对应解密密钥，该文件已跳过");
		while (true) {
			const provided = await requestScheduleKey("private", { filename: options.filename });
			if (!provided) {
				declinedKeyIds.add(header.kid);
				throw scheduleOperationError(KEY_REQUIRED, "未提供对应解密密钥，该文件已跳过");
			}
			try {
				const privateKey = provided.importedKey;
				const schedule = await tryDecrypt(privateKey);
				keyCache.set(header.kid, privateKey);
				return schedule;
			} catch (error) {
				if (error.code !== "DECRYPT_FAILED") throw error;
				toast("error", error.message || "解密密钥不匹配或文件已损坏", 4);
			}
		}
	}
	function personalScheduleFilename(name, extension) {
		return `${String(name || "").trim().replace(/[\\/:*?"<>|\p{Cc}]/gu, "_") || "未命名用户"} - 课表.${extension}`;
	}
	async function selectImageExportName({ studentId, owner, confirmAccountName, requestName, getOwner, onLookupError }) {
		const id = String(studentId || "").trim();
		if (id && await confirmAccountName(id, owner)) try {
			const account = owner?.id === id && owner?.name?.trim() ? owner : await getOwner(id);
			const name = String(account?.name || "").trim();
			if (!name) throw new Error("当前学号未返回姓名");
			return name;
		} catch (error) {
			if (error?.name === "AbortError") throw error;
			onLookupError?.(error);
		}
		const name = String(await requestName(owner?.name || "") || "").trim();
		if (!name) {
			const error = new Error("已取消图片导出");
			error.code = "EXPORT_CANCELLED";
			throw error;
		}
		return name;
	}
	async function prepareCurrentScheduleImageExport({ getSchedule, getViewKey, getName }) {
		const original = getSchedule();
		const viewKey = getViewKey();
		const assertCurrent = () => {
			if (!original || getSchedule() !== original || getViewKey() !== viewKey) {
				const error = new Error("课表或视图已切换，请重新导出图片");
				error.code = "SCHEDULE_CHANGED";
				throw error;
			}
		};
		assertCurrent();
		const name = await getName(original);
		assertCurrent();
		return {
			filename: personalScheduleFilename(name, "png"),
			assertCurrent
		};
	}
	async function prepareCurrentScheduleExport({ getSchedule, getOwner, prepareExport }) {
		const original = getSchedule();
		const assertCurrent = () => {
			if (!original || getSchedule() !== original) {
				const error = new Error("课表已切换，请重新发起导出");
				error.code = "SCHEDULE_CHANGED";
				throw error;
			}
		};
		assertCurrent();
		const owner = await getOwner();
		assertCurrent();
		const data = normalize({
			...original,
			owner
		});
		const result = await prepareExport(data);
		assertCurrent();
		return {
			data,
			result
		};
	}
	var _hoisted_1 = { id: "main" };
	var _hoisted_2 = {
		id: "searchTeacher",
		class: "show",
		style: {
			"width": "100%",
			"height": "100%",
			"padding": "10px"
		}
	};
	var _hoisted_3 = { style: {
		"width": "100%",
		"display": "flex",
		"align-content": "center",
		"justify-content": "center",
		"overflow": "auto",
		"height": "calc(100% - 54px)"
	} };
	var _hoisted_4 = { class: "personal-schedule-page" };
	var _hoisted_5 = { class: "personal-schedule-toolbar" };
	var _hoisted_6 = { class: "personal-schedule-actions" };
	var _hoisted_7 = { class: "personal-stats" };
	var _hoisted_8 = { class: "personal-stat-grid" };
	var _hoisted_9 = { class: "personal-stat-card" };
	var _hoisted_10 = { class: "personal-stat-value" };
	var _hoisted_11 = { class: "personal-stat-card" };
	var _hoisted_12 = { class: "personal-stat-value" };
	var _hoisted_13 = { class: "personal-stat-card" };
	var _hoisted_14 = { class: "personal-stat-value" };
	var _hoisted_15 = { class: "personal-stat-card" };
	var _hoisted_16 = { class: "personal-stat-value" };
	var _hoisted_17 = { class: "personal-chart-card" };
	var _hoisted_18 = { class: "personal-week-bars" };
	var _hoisted_19 = { class: "personal-week-bar-value" };
	var _hoisted_20 = { class: "personal-week-bar-track" };
	var _hoisted_21 = { class: "personal-panel-shell" };
	var _hoisted_22 = {
		key: 0,
		class: "personal-week-filter"
	};
	var _hoisted_23 = { class: "personal-schedule-capture" };
	var _hoisted_24 = {
		key: 0,
		class: "personal-empty-state"
	};
	var _hoisted_25 = {
		key: 2,
		class: "personal-course-grid"
	};
	var _hoisted_26 = { class: "personal-course-header" };
	var _hoisted_27 = { class: "personal-course-name" };
	var _hoisted_28 = {
		key: 0,
		class: "personal-course-meta"
	};
	var _hoisted_29 = {
		key: 1,
		class: "personal-course-meta"
	};
	var _hoisted_30 = { class: "personal-course-meta" };
	var _hoisted_31 = {
		key: 1,
		class: "personal-course-variants"
	};
	var _hoisted_32 = { class: "personal-course-variant-weeks" };
	var _hoisted_33 = { class: "personal-course-variant-detail" };
	var _hoisted_34 = {
		key: 2,
		class: "personal-course-meta"
	};
	var _hoisted_35 = { class: "personal-panel-shell" };
	var _hoisted_36 = {
		key: 0,
		class: "personal-week-filter"
	};
	var _hoisted_37 = { class: "personal-schedule-capture" };
	var _hoisted_38 = {
		key: 1,
		class: "personal-table",
		"aria-label": "个人空闲时间表"
	};
	var _hoisted_39 = {
		scope: "row",
		class: "personal-period-cell"
	};
	var _hoisted_40 = ["aria-label"];
	var _hoisted_41 = { class: "schedule-manager schedule-manager-tab" };
	var _hoisted_42 = { class: "schedule-manager-actions" };
	var _hoisted_43 = { style: {
		"display": "flex",
		"align-items": "center"
	} };
	var _hoisted_44 = { class: "export-container" };
	var _hoisted_45 = {
		key: 0,
		class: "export-dropdown"
	};
	var _hoisted_46 = ["disabled"];
	var _hoisted_47 = { class: "main-content" };
	var _hoisted_48 = {
		key: 0,
		class: "file-list-header"
	};
	var _hoisted_49 = { class: "files-display" };
	var _hoisted_50 = ["onClick"];
	var _hoisted_51 = { class: "schedule-container" };
	var _hoisted_52 = {
		scope: "row",
		class: "period-cell"
	};
	var _hoisted_53 = { key: 0 };
	var _hoisted_54 = {
		key: 1,
		class: "empty-cell"
	};
	var _hoisted_55 = { class: "schedule-key-page" };
	var _hoisted_56 = { class: "schedule-key-content" };
	var _hoisted_57 = {
		key: 0,
		class: "schedule-key-empty"
	};
	var _hoisted_58 = { class: "schedule-key-section" };
	var _hoisted_59 = { class: "schedule-key-section-title" };
	var _hoisted_60 = ["value"];
	var _hoisted_61 = { class: "schedule-key-section schedule-private-key-section" };
	var _hoisted_62 = { class: "schedule-key-section-title" };
	var _hoisted_63 = { class: "schedule-key-buttons" };
	var _hoisted_64 = ["value"];
	var _hoisted_65 = {
		key: 1,
		class: "schedule-private-key-hidden"
	};
	var _hoisted_66 = { class: "schedule-key-regenerate" };
	var MAX_TEACHER_PAGES = 100;
	var _sfc_main = {
		__name: "ToolsApp",
		setup(__props) {
			const console = MyConsole("[小工具]");
			const setClipboard = _GM_setClipboard;
			const pageWindow = _unsafeWindow ?? window;
			const active = (0, vue.ref)(0);
			const onClickLeft = () => {
				closeCurrentTab();
			};
			const onChange = (index) => {
				document.querySelector("div#main > div.show").classList.remove("show");
				document.querySelectorAll("div#main > div")[index].classList.add("show");
				if (index === 1) {
					ensurePersonalSchedule();
					resizePersonalTabs();
				}
			};
			const searchValue = (0, vue.ref)("");
			const teacherList = (0, vue.ref)([]);
			let teacherSearchVersion = 0;
			let teacherSearchController = null;
			const onSearch = (val) => {
				searchTeacher(val);
			};
			const onSearchClick = () => {
				searchTeacher(searchValue.value);
			};
			const searchTeacher = async (val) => {
				const keyword = String(val || "").trim();
				teacherSearchController?.abort();
				teacherSearchController = null;
				const requestVersion = ++teacherSearchVersion;
				if (!keyword) {
					teacherList.value = [];
					return;
				}
				if (keyword.toLowerCase() === "moss") {
					toast("info", decodeURI("%E6%81%AD%E5%96%9C%E4%BD%A0%E5%8F%91%E7%8E%B0%E4%BA%86%E8%BF%99%E4%B8%AA%E5%B0%8F%E5%BD%A9%E8%9B%8B~"), 0);
					_GM_openInTab("https://moss.thisish.cn", {
						active: true,
						insert: true,
						setParent: false
					});
					return;
				}
				const controller = new AbortController();
				teacherSearchController = controller;
				const rows = [
					[],
					[],
					[]
				];
				let nowPage = 1;
				let allPages = 1;
				let nowRow = 0;
				try {
					while (nowPage <= allPages) {
						const list = await searchTeachers(keyword, nowPage, { signal: controller.signal });
						if (requestVersion !== teacherSearchVersion) return;
						if (!list.success) {
							toast("error", list.msg);
							return;
						}
						if (!Array.isArray(list.data)) throw new Error("教师查询结果格式异常");
						for (let i = 0; i < list.data.length; i++) rows[(nowRow + i) % 3].push(list.data[i]);
						nowRow = (nowRow + list.data.length) % 3;
						const responsePage = Number(list.page?.[0]);
						allPages = Number(list.page?.[1]);
						if (!Number.isInteger(responsePage) || !Number.isInteger(allPages) || responsePage !== nowPage || allPages < responsePage || allPages > MAX_TEACHER_PAGES) throw new Error("教师查询分页信息异常");
						nowPage = responsePage + 1;
					}
					if (requestVersion === teacherSearchVersion) teacherList.value = rows;
				} catch (error) {
					if (error?.name !== "AbortError" && requestVersion === teacherSearchVersion) {
						console("教师查询失败", error, "error");
						toast("error", error?.message || "教师查询失败，请稍后重试", 4);
					}
				} finally {
					if (requestVersion === teacherSearchVersion) teacherSearchController = null;
				}
			};
			const teacherClick = (teacher) => {
				const number = String(teacher?.number || "");
				if (!number) return;
				setClipboard?.(number);
				showToast("工号已复制");
			};
			const scheduleManagerPeriodRows = [
				{
					key: "1-2",
					label: "1-2",
					periods: [1, 2],
					time: "08:10-09:45"
				},
				{
					key: "3-4",
					label: "3-4",
					periods: [3, 4],
					time: "10:15-11:50"
				},
				{
					key: "5-6",
					label: "5-6",
					periods: [5, 6],
					time: "14:00-15:35"
				},
				{
					key: "7-8",
					label: "7-8",
					periods: [7, 8],
					time: "15:55-17:30"
				},
				{
					key: "9-10",
					label: "9-10",
					periods: [9, 10],
					time: "19:00-20:35"
				}
			];
			const personalLink = (0, vue.ref)("");
			const personalSchedule = (0, vue.ref)(null);
			const personalSource = (0, vue.ref)("");
			const personalLoading = (0, vue.ref)(false);
			const personalError = (0, vue.ref)("");
			const personalTab = (0, vue.ref)("personal");
			const personalScheduleToolbarVisible = (0, vue.computed)(() => [
				"overview",
				"personal",
				"personal-free"
			].includes(personalTab.value));
			const selectedCourseWeek = (0, vue.ref)(0);
			const selectedFreeWeek = (0, vue.ref)(0);
			const personalTabsRef = (0, vue.ref)(null);
			const personalCourseWeekTabsRef = (0, vue.ref)(null);
			const personalFreeWeekTabsRef = (0, vue.ref)(null);
			const personalCourseCapture = (0, vue.ref)(null);
			const personalStatsCapture = (0, vue.ref)(null);
			const personalFreeCapture = (0, vue.ref)(null);
			let personalInitialized = false;
			let personalRequestVersion = 0;
			let personalMetadataController = null;
			let ownerRequestController = null;
			const importedSchedulePrivateKeys = new Map();
			const savedScheduleKeyPair = getGMValue(storageKey);
			const scheduleKeyPair = (0, vue.ref)(savedScheduleKeyPair?.publicKey && savedScheduleKeyPair?.privateKey ? savedScheduleKeyPair : null);
			const scheduleKeyGenerating = (0, vue.ref)(false);
			const showSchedulePrivateKey = (0, vue.ref)(false);
			const generateScheduleKeyPair = async () => {
				if (scheduleKeyPair.value) try {
					if (await showConfirmDialog({
						title: "重新生成课表密钥？",
						message: "重新生成后，当前解密密钥会被替换。以前的加密课表仍需要旧解密密钥才能打开，请先复制并妥善备份旧解密密钥。",
						messageAlign: "left",
						confirmButtonText: "确认重新生成",
						confirmButtonColor: "#ee0a24",
						cancelButtonText: "取消",
						closeOnClickOverlay: false
					}) !== "confirm") return;
				} catch {
					return;
				}
				scheduleKeyGenerating.value = true;
				try {
					const keyPair = await generateKeyPair();
					await setGMValue(storageKey, keyPair);
					scheduleKeyPair.value = keyPair;
					showSchedulePrivateKey.value = false;
					importedSchedulePrivateKeys.clear();
					toast("success", "课表密钥已生成，请立即备份解密密钥", 4);
				} catch (error) {
					toast("error", error.message || "课表密钥生成失败", 4);
				} finally {
					scheduleKeyGenerating.value = false;
				}
			};
			const copyScheduleKey = (type) => {
				const isPrivate = type === "private";
				const value = isPrivate ? scheduleKeyPair.value?.privateKey : scheduleKeyPair.value?.publicKey;
				if (!value) return;
				setClipboard?.(value);
				toast("success", isPrivate ? "解密密钥已复制，请勿发送给他人" : "加密密钥已复制，可以发给他人", 3);
			};
			const resizePersonalTabs = () => (0, vue.nextTick)(() => {
				personalTabsRef.value?.resize();
				(personalTab.value === "personal" ? personalCourseWeekTabsRef : personalTab.value === "personal-free" ? personalFreeWeekTabsRef : null)?.value?.resize();
			});
			(0, vue.watch)(personalTab, resizePersonalTabs);
			const personalWeekOptions = (0, vue.computed)(() => {
				const options = [{
					text: "总体",
					value: 0
				}];
				for (let week = 1; week <= getTotalWeeks(personalSchedule.value); week++) options.push({
					text: `第${week}周`,
					value: week
				});
				return options;
			});
			const canExportPersonalJson = (0, vue.computed)(() => {
				if (!personalSchedule.value || personalSource.value === "upload") return false;
				if (personalSource.value === "personal") return true;
				const ownIcsId = String(getGMValue("icsId") || "");
				const displayedIcsId = personalSchedule.value.sourceUrl?.match(/\/cal\/(\d+)/)?.[1] || "";
				return personalSource.value === "link" && Boolean(ownIcsId) && displayedIcsId === ownIcsId;
			});
			const canViewMySchedule = (0, vue.computed)(() => personalSource.value !== "personal");
			const setPersonalSchedule = (data, source, url = "") => {
				personalSchedule.value = normalize(data);
				personalSource.value = source;
				personalError.value = "";
				selectedCourseWeek.value = 0;
				selectedFreeWeek.value = 0;
				if (url) personalLink.value = url;
				console("数据已提交到页面状态", {
					source,
					courseCount: personalSchedule.value.courses.length,
					lessonCount: personalSchedule.value.lessons.length
				}, "info");
			};
			const loadPersonalScheduleById = async (icsId, source) => {
				personalMetadataController?.abort();
				personalMetadataController = null;
				const requestVersion = ++personalRequestVersion;
				const url = `https://portal.nxu.edu.cn/cal/${icsId}`;
				personalLoading.value = true;
				personalError.value = "";
				console("开始加载课表", {
					source,
					requestVersion
				}, "info");
				try {
					const data = await fetchFromUrl(url, { owner: {
						id: "",
						name: ""
					} });
					if (requestVersion !== personalRequestVersion) {
						console("丢弃已过期的加载结果", {
							source,
							requestVersion
						}, "debug");
						return;
					}
					setPersonalSchedule(data, source, url);
				} catch (error) {
					if (requestVersion !== personalRequestVersion) {
						console("丢弃已过期请求的错误", {
							source,
							requestVersion
						}, "debug");
						return;
					}
					personalSchedule.value = null;
					personalSource.value = "";
					personalError.value = error.message || "课表加载失败";
					console("课表加载失败", {
						source,
						requestVersion,
						error
					}, "error");
					toast("error", personalError.value, 4);
				} finally {
					if (requestVersion === personalRequestVersion) personalLoading.value = false;
				}
			};
			const ensurePersonalSchedule = async () => {
				if (personalInitialized) {
					console("跳过重复初始化", "已有初始化任务或数据", "debug");
					return;
				}
				personalInitialized = true;
				const requestVersion = ++personalRequestVersion;
				personalMetadataController?.abort();
				const controller = new AbortController();
				personalMetadataController = controller;
				personalLoading.value = true;
				console("开始初始化当前账号课表", { requestVersion }, "info");
				try {
					let icsId = getGMValue("icsId");
					if (!icsId) icsId = await getIcsId({ signal: controller.signal });
					if (requestVersion !== personalRequestVersion) {
						console("初始化结果已过期", { requestVersion }, "debug");
						return;
					}
					await loadPersonalScheduleById(String(icsId), "personal");
				} catch (error) {
					if (requestVersion !== personalRequestVersion) return;
					personalInitialized = false;
					personalLoading.value = false;
					personalError.value = error.message || "个人课表初始化失败";
					console("当前账号课表初始化失败", {
						requestVersion,
						error
					}, "error");
					toast("error", personalError.value, 4);
				} finally {
					if (personalMetadataController === controller) personalMetadataController = null;
				}
			};
			const parsePersonalLink = (input) => {
				const match = String(input || "").trim().match(/^(?:https?:\/\/portal\.nxu\.edu\.cn\/cal\/)?(\d{6,})\/?(?:[?#].*)?$/i);
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
					console("用户输入的课表链接无效", error, "warn");
					toast("warning", error.message, 3);
				}
			};
			const viewMySchedule = async () => {
				const requestVersion = ++personalRequestVersion;
				personalMetadataController?.abort();
				const controller = new AbortController();
				personalMetadataController = controller;
				personalLoading.value = true;
				try {
					let icsId = getGMValue("icsId");
					if (!icsId) icsId = await getIcsId({ signal: controller.signal });
					if (requestVersion !== personalRequestVersion) return;
					await loadPersonalScheduleById(String(icsId), "personal");
				} catch (error) {
					if (requestVersion !== personalRequestVersion || error?.name === "AbortError") return;
					personalError.value = error.message || "个人课表加载失败";
					console("返回当前账号课表失败", error, "error");
					toast("error", personalError.value, 4);
				} finally {
					if (personalMetadataController === controller) personalMetadataController = null;
					if (requestVersion === personalRequestVersion) personalLoading.value = false;
				}
			};
			const handlePersonalUpload = async (fileInfo) => {
				personalMetadataController?.abort();
				personalMetadataController = null;
				const requestVersion = ++personalRequestVersion;
				personalLoading.value = true;
				personalError.value = "";
				try {
					const file = fileInfo.file;
					if (!file || !file.name.toLowerCase().endsWith(".json")) throw new Error("请选择 JSON 课表文件");
					if (personalSource.value === "upload") {
						personalSchedule.value = null;
						personalSource.value = "";
					}
					if (file.size > 7340032) throw new Error("课表文件不能超过 7 MB");
					console("开始解析上传文件", {
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
						console("丢弃已过期的上传解析结果", { requestVersion }, "debug");
						return;
					}
					setPersonalSchedule(data, "upload");
					console("上传文件解析完成", {
						requestVersion,
						courseCount: data.courses.length,
						lessonCount: data.lessons.length
					}, "info");
					toast("success", `已加载 ${file.name}`, 2);
				} catch (error) {
					if (requestVersion !== personalRequestVersion) return;
					personalError.value = error.message || "JSON 文件解析失败";
					console("上传文件解析失败", {
						requestVersion,
						error
					}, "error");
					toast("error", personalError.value, 4);
				} finally {
					if (requestVersion === personalRequestVersion) personalLoading.value = false;
				}
			};
			const requestStudentId = async (initialValue = "") => {
				const value = (0, vue.ref)(String(initialValue || ""));
				try {
					return await showConfirmDialog({
						title: "输入学号",
						messageAlign: "left",
						confirmButtonText: "验证",
						message: () => (0, vue.h)("div", null, [(0, vue.h)("div", { style: "padding: 0 16px 8px;color:#646566;font-size:13px;" }, "只能获取当前 WebVPN 登录账号的身份信息，请输入与登录账号一致的学号。"), (0, vue.h)(Field, {
							modelValue: value.value,
							label: "学号",
							clearable: true,
							autocomplete: "off",
							placeholder: "请输入学号",
							"onUpdate:modelValue": (input) => value.value = String(input || "")
						})]),
						beforeClose(action) {
							if (action === "confirm" && !/^\d{6,}$/.test(value.value.trim())) {
								showToast("请输入有效学号");
								return false;
							}
							return true;
						}
					}) === "confirm" ? value.value.trim() : "";
				} catch {
					return "";
				}
			};
			const lookupStudentOwner = async (studentId) => {
				ownerRequestController?.abort();
				const controller = new AbortController();
				ownerRequestController = controller;
				try {
					return await getStudentOwner(studentId, { signal: controller.signal });
				} finally {
					if (ownerRequestController === controller) ownerRequestController = null;
				}
			};
			const getVerifiedStudentOwner = async () => {
				const existingOwner = personalSchedule.value?.owner;
				if (existingOwner?.id && existingOwner?.name) return existingOwner;
				const savedStudentId = String(getGMValue("WebVPN.username") || "").trim();
				let studentId = "";
				if (savedStudentId) try {
					if (await showConfirmDialog({
						title: "确认学号",
						message: `是否使用学号 ${savedStudentId} 获取身份信息？\n\n学号必须与当前 WebVPN 登录账号一致；只能导出登录账号本人的课表，其他账号的课表只能查看。`,
						messageAlign: "left",
						confirmButtonText: "确认使用",
						cancelButtonText: "重新输入"
					}) === "confirm") studentId = savedStudentId;
				} catch {}
				while (true) {
					if (!studentId) studentId = await requestStudentId();
					if (!studentId) {
						const error = new Error("已取消课表导出");
						error.code = "EXPORT_CANCELLED";
						throw error;
					}
					try {
						return await lookupStudentOwner(studentId);
					} catch (error) {
						if (error.code !== "STUDENT_ID_MISMATCH") throw error;
						toast("warning", `${error.message}，请重新输入学号`, 4);
						studentId = "";
					}
				}
			};
			const requestImageName = async (initialName = "") => {
				const name = (0, vue.ref)(String(initialName));
				try {
					await showConfirmDialog({
						title: "填写图片姓名",
						messageAlign: "left",
						confirmButtonText: "导出图片",
						cancelButtonText: "取消",
						closeOnClickOverlay: false,
						message: () => (0, vue.h)("div", null, [(0, vue.h)("p", { style: "padding:0 16px;font-size:13px;" }, "请输入真实姓名，用于图片文件名，无需提供学号。"), (0, vue.h)(Field, {
							modelValue: name.value,
							label: "姓名",
							placeholder: "请输入真实姓名",
							clearable: true,
							autocomplete: "off",
							"onUpdate:modelValue": (value) => name.value = String(value || "")
						})]),
						beforeClose(action) {
							if (action === "confirm" && !name.value.trim()) {
								showToast("请输入姓名");
								return false;
							}
							return true;
						}
					});
					return name.value.trim();
				} catch {
					return "";
				}
			};
			const getImageExportName = (schedule) => selectImageExportName({
				studentId: getGMValue("WebVPN.username"),
				owner: schedule.owner,
				async confirmAccountName(studentId, owner) {
					const knownName = owner?.id === studentId ? owner.name : "";
					try {
						await showConfirmDialog({
							title: "确认图片姓名",
							message: knownName ? `是否使用学号 ${studentId} 对应的姓名“${knownName}”命名图片？也可自行填写姓名。` : `是否使用当前学号 ${studentId} 对应的姓名命名图片？确认后将查询当前 WebVPN 账号的姓名，也可自行填写姓名。`,
							messageAlign: "left",
							confirmButtonText: "使用当前姓名",
							cancelButtonText: "填写姓名",
							closeOnClickOverlay: false
						});
						return true;
					} catch {
						return false;
					}
				},
				requestName: requestImageName,
				getOwner: lookupStudentOwner,
				onLookupError: () => showToast("获取姓名失败，请直接填写姓名")
			});
			const personalExportPending = (0, vue.ref)(false);
			const exportPersonalJson = async () => {
				if (personalExportPending.value || personalLoading.value) return;
				if (!canExportPersonalJson.value) {
					toast("warning", "只能导出当前登录账号本人的课表", 3);
					return;
				}
				personalExportPending.value = true;
				console("开始导出", {
					courseCount: personalSchedule.value.courses.length,
					lessonCount: personalSchedule.value.lessons.length
				}, "info");
				try {
					const { data, result } = await prepareCurrentScheduleExport({
						getSchedule: () => personalSchedule.value,
						getOwner: getVerifiedStudentOwner,
						prepareExport: prepareScheduleExport
					});
					personalSchedule.value = data;
					await downloadTextFile(result.content, personalScheduleFilename(data.owner?.name, "json"));
					console("导出完成", { encrypted: result.encrypted }, "info");
					toast("success", result.encrypted ? "加密课表已导出" : "课表 JSON 已导出", 2);
				} catch (error) {
					if (error.code === "SCHEDULE_CHANGED") {
						toast("warning", error.message, 4);
						return;
					}
					if (error.code === "EXPORT_CANCELLED" || error?.name === "AbortError") {
						console("用户取消导出", "", "info");
						return;
					}
					console("导出失败", error, "error");
					toast("error", error.message || "课表导出失败", 4);
				} finally {
					personalExportPending.value = false;
				}
			};
			const exportPersonalImage = async () => {
				if (personalExportPending.value || personalLoading.value || !personalSchedule.value) return;
				personalExportPending.value = true;
				try {
					const { filename, assertCurrent } = await prepareCurrentScheduleImageExport({
						getSchedule: () => personalLoading.value ? null : personalSchedule.value,
						getViewKey: () => `${personalRequestVersion}:${personalTab.value}:${selectedCourseWeek.value}:${selectedFreeWeek.value}`,
						getName: getImageExportName
					});
					await (0, vue.nextTick)();
					assertCurrent();
					const target = {
						overview: personalStatsCapture.value,
						personal: personalCourseCapture.value,
						"personal-free": personalFreeCapture.value
					}[personalTab.value];
					if (!target) {
						toast("warning", "当前页面尚未完成渲染", 2);
						return;
					}
					console("开始导出", { tab: personalTab.value }, "info");
					const progressToast = toast("info", "正在生成课表图片，请稍候", 0);
					try {
						await downloadSnapdomImage({
							snapdom: pageWindow.snapdom,
							target,
							options: {
								format: "png",
								filename,
								scale: 2.5,
								quality: 1
							},
							fixWebVpn: true,
							pageWindow
						});
					} finally {
						removeToastHandle(progressToast);
					}
					console("导出完成", { tab: personalTab.value }, "info");
					toast("success", "课表图片已导出", 3);
				} catch (error) {
					if (error.code === "EXPORT_CANCELLED" || error?.name === "AbortError") return;
					if (error.code === "SCHEDULE_CHANGED") {
						toast("warning", error.message, 4);
						return;
					}
					console("导出失败", {
						tab: personalTab.value,
						error
					}, "error");
					toast("error", "导出图片失败，请重试", 3);
				} finally {
					personalExportPending.value = false;
				}
			};
			const personalCourseLayout = (0, vue.computed)(() => {
				const data = personalSchedule.value;
				if (!data) return [];
				return buildPersonalCourseLayout(buildPersonalCourseEntries(data, Number(selectedCourseWeek.value)));
			});
			const personalStats = (0, vue.computed)(() => {
				const data = personalSchedule.value;
				if (!data) return {
					totalCourses: 0,
					totalHours: 0,
					totalLessons: 0,
					totalWeeks: 0,
					weekly: []
				};
				const totalWeeks = getTotalWeeks(data);
				const weekly = Array.from({ length: totalWeeks }, (_, index) => {
					const week = index + 1;
					return {
						week,
						hours: data.lessons.filter((lesson) => lesson.week === week).reduce((sum, lesson) => sum + lesson.periods.length, 0)
					};
				});
				const maxHours = Math.max(1, ...weekly.map((item) => item.hours));
				weekly.forEach((item) => item.percent = Math.max(2, Math.round(item.hours / maxHours * 100)));
				return {
					totalCourses: data.courses.length,
					totalHours: data.lessons.reduce((sum, lesson) => sum + lesson.periods.length, 0),
					totalLessons: data.lessons.length,
					totalWeeks,
					weekly
				};
			});
			const personalFreeGrid = (0, vue.computed)(() => {
				return buildPersonalFreeGrid(personalSchedule.value, Number(selectedFreeWeek.value));
			});
			const uploadedFiles = (0, vue.reactive)({});
			const daysOfWeek = [
				"周一",
				"周二",
				"周三",
				"周四",
				"周五",
				"周六",
				"周日"
			];
			const classPeriods = scheduleManagerPeriodRows.map((row) => `第 ${row.label} 节`);
			const showExportMenu = (0, vue.ref)(false);
			const multiEmptyTable = (0, vue.ref)(null);
			const multiScheduleLoading = (0, vue.ref)(false);
			const fileList = (0, vue.computed)(() => Object.keys(uploadedFiles).map((filename) => ({
				filename,
				name: filename.replace(".json", ""),
				...uploadedFiles[filename]
			})));
			const allFilesSchedule = (0, vue.computed)(() => {
				const result = Object.fromEntries(daysOfWeek.map((day) => [day, Object.fromEntries(classPeriods.map((period, index) => [index, []]))]));
				Object.keys(uploadedFiles).forEach((filename) => {
					const data = uploadedFiles[filename]?.content;
					if (!data) return;
					const maps = getMaps(data);
					const totalWeeks = getTotalWeeks(data);
					const weeks = Array.from({ length: totalWeeks }, (_, index) => index + 1);
					const displayName = data.owner?.name || "未命名用户";
					daysOfWeek.forEach((cnDay, index) => {
						scheduleManagerPeriodRows.forEach((row, periodIndex) => {
							const states = row.periods.map((period) => {
								const availability = weeks.map((week) => ({
									week,
									status: getLessonAvailability(data, maps, week, index + 1, period)
								}));
								return {
									period,
									freeWeeks: availability.filter((item) => item.status === "free").map((item) => item.week),
									onlineWeeks: availability.filter((item) => item.status === "online").map((item) => item.week)
								};
							});
							if (!states.some((state) => state.freeWeeks.length || state.onlineWeeks.length)) return;
							const sameAvailability = states.every((state) => state.freeWeeks.join(",") === states[0].freeWeeks.join(",") && state.onlineWeeks.join(",") === states[0].onlineWeeks.join(","));
							let label = displayName;
							if (sameAvailability) label += `（${formatAvailabilityWeeks(states[0].freeWeeks, states[0].onlineWeeks, totalWeeks).replace(/\n/g, "；")}）`;
							else label += `（${states.map((state) => `第${state.period}节：${formatAvailabilityWeeks(state.freeWeeks, state.onlineWeeks, totalWeeks).replace(/\n/g, "；")}`).join("；")}）`;
							const fullyFree = totalWeeks > 0 && states.every((state) => state.freeWeeks.length === totalWeeks);
							const neverBusy = totalWeeks > 0 && states.every((state) => state.freeWeeks.length + state.onlineWeeks.length === totalWeeks);
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
			const multiAvailabilitySummary = (0, vue.computed)(() => {
				const result = Object.fromEntries(daysOfWeek.map((day) => [day, Object.fromEntries(classPeriods.map((period, index) => [index, {
					status: "empty",
					text: "尚未添加课表"
				}]))]));
				const people = Object.values(uploadedFiles).map((file) => file?.content).filter(Boolean).map((data) => ({
					data,
					maps: getMaps(data),
					totalWeeks: getTotalWeeks(data)
				}));
				if (!people.length) return result;
				daysOfWeek.forEach((day, dayIndex) => scheduleManagerPeriodRows.forEach((row, periodIndex) => {
					const states = people.map(({ data, maps, totalWeeks }) => {
						if (totalWeeks <= 0) return "busy";
						const availability = Array.from({ length: totalWeeks }, (_, index) => index + 1).flatMap((week) => row.periods.map((period) => getLessonAvailability(data, maps, week, dayIndex + 1, period)));
						if (availability.every((status) => status === "free")) return "free";
						if (availability.every((status) => status !== "busy")) return "online";
						if (availability.some((status) => status !== "busy")) return "partial";
						return "busy";
					});
					result[day][periodIndex] = summarizePeopleAvailability(states);
				}));
				return result;
			});
			const triggerFileInput = () => {
				if (multiScheduleLoading.value) return;
				const input = document.createElement("input");
				input.type = "file";
				input.accept = ".json";
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
						if (!file.name.toLowerCase().endsWith(".json")) {
							toast("error", "请只上传JSON文件", 3);
							continue;
						}
						delete uploadedFiles[file.name];
						if (file.size > 7340032) {
							toast("error", `文件 "${file.name}" 超过 7 MB`, 3);
							continue;
						}
						if (await readFile(file, declinedKeyIds)) successCount++;
					}
					if (successCount) toast("success", `已成功读取 ${successCount} 个课表文件`, 3);
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
					toast("error", `文件 "${file.name}" 已跳过：${error.message || "格式错误"}`, 4);
					return false;
				}
			};
			const removeFile = (filename, event) => {
				event.stopPropagation();
				delete uploadedFiles[filename];
			};
			const toggleExportMenu = () => {
				showExportMenu.value = !showExportMenu.value;
			};
			let exportBtn, exportDropdown;
			const handleClickOutside = (e) => {
				if (!exportBtn) exportBtn = document.querySelector(".export-btn");
				if (!exportDropdown) exportDropdown = document.querySelector(".export-dropdown");
				if (showExportMenu.value && !exportBtn?.contains(e.target) && !exportDropdown?.contains(e.target)) showExportMenu.value = false;
			};
			document.addEventListener("click", handleClickOutside);
			(0, vue.onUnmounted)(() => {
				teacherSearchController?.abort();
				personalMetadataController?.abort();
				ownerRequestController?.abort();
				personalRequestVersion++;
				document.removeEventListener("click", handleClickOutside);
				exportBtn = null;
				exportDropdown = null;
			});
			const exportToExcel = () => {
				if (!fileList.value.length) {
					toast("error", "请先上传文件", 3);
					return;
				}
				try {
					const wsData = [["时间/星期", ...daysOfWeek]];
					classPeriods.forEach((period, periodIndex) => {
						const row = [period];
						daysOfWeek.forEach((day) => {
							const items = allFilesSchedule.value[day]?.[periodIndex] || [];
							const summary = multiAvailabilitySummary.value[day][periodIndex].text;
							const cellData = items.length ? [...items.map((item) => item.text), summary].join("\n") : summary;
							row.push(cellData);
						});
						wsData.push(row);
					});
					const XLSX = pageWindow.XLSX;
					const wb = XLSX.utils.book_new();
					const ws = XLSX.utils.aoa_to_sheet(wsData);
					ws["!cols"] = [{ wch: 10 }, ...daysOfWeek.map(() => ({ wch: 20 }))];
					const wrapTextStyle = { alignment: {
						wrapText: true,
						vertical: "top"
					} };
					Object.keys(ws).forEach((key) => {
						if (!key.startsWith("!")) ws[key].s = wrapTextStyle;
					});
					XLSX.utils.book_append_sheet(wb, ws, "空课表");
					XLSX.writeFile(wb, "空课表.xlsx");
					showExportMenu.value = false;
					toast("success", "空课表 Excel 已导出", 3);
				} catch (error) {
					toast("error", error.message || "空课表 Excel 导出失败", 4);
				}
			};
			const exportToImage = async () => {
				if (!fileList.value.length) {
					toast("error", "请先上传文件", 3);
					return;
				}
				if (multiScheduleLoading.value) return;
				multiScheduleLoading.value = true;
				try {
					const progressToast = toast("info", "正在生成空课表图片，请稍候", 0);
					try {
						await (0, vue.nextTick)();
						await downloadSnapdomImage({
							snapdom: pageWindow.snapdom,
							target: multiEmptyTable.value,
							options: {
								format: "png",
								filename: "空课表.png",
								scale: 2.5,
								quality: 1
							},
							fixWebVpn: true,
							pageWindow
						});
					} finally {
						removeToastHandle(progressToast);
					}
					showExportMenu.value = false;
					toast("success", "空课表图片已导出", 3);
				} catch (error) {
					toast("error", error.message || "导出图片失败，请重试", 3);
				} finally {
					multiScheduleLoading.value = false;
				}
			};
			return (_ctx, _cache) => {
				return (0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, null, [
					(0, vue.createVNode)((0, vue.unref)(NavBar), {
						title: "小工具 - H",
						"left-text": "返回",
						"left-arrow": "",
						onClickLeft
					}),
					(0, vue.createVNode)((0, vue.unref)(Sidebar), {
						modelValue: active.value,
						"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => active.value = $event),
						style: { "z-index": "9999" },
						onChange
					}, {
						default: (0, vue.withCtx)(() => [
							(0, vue.createVNode)((0, vue.unref)(SidebarItem), { title: "在职教师工号查询" }),
							(0, vue.createVNode)((0, vue.unref)(SidebarItem), { title: "课表信息" }),
							(0, vue.createVNode)((0, vue.unref)(SidebarItem), { title: "🚧等待⚠️施工" })
						]),
						_: 1
					}, 8, ["modelValue"]),
					(0, vue.createElementVNode)("div", _hoisted_1, [
						(0, vue.createElementVNode)("div", _hoisted_2, [
							(0, vue.createElementVNode)("form", {
								action: "/",
								onSubmit: _cache[2] || (_cache[2] = (0, vue.withModifiers)(() => {}, ["prevent"]))
							}, [(0, vue.createVNode)((0, vue.unref)(Search), {
								modelValue: searchValue.value,
								"onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => searchValue.value = $event),
								"show-action": "",
								placeholder: "请输入需要查询的教师姓名",
								onSearch
							}, {
								action: (0, vue.withCtx)(() => [(0, vue.createElementVNode)("div", { onClick: onSearchClick }, "搜索")]),
								_: 1
							}, 8, ["modelValue"])], 32),
							(0, vue.createElementVNode)("div", _hoisted_3, [((0, vue.openBlock)(true), (0, vue.createElementBlock)(vue.Fragment, null, (0, vue.renderList)(teacherList.value, (teachers, columnIndex) => {
								return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
									key: columnIndex,
									style: { "width": "33%" }
								}, [(0, vue.createVNode)((0, vue.unref)(CellGroup), { inset: "" }, {
									default: (0, vue.withCtx)(() => [((0, vue.openBlock)(true), (0, vue.createElementBlock)(vue.Fragment, null, (0, vue.renderList)(teachers, (teacher) => {
										return (0, vue.openBlock)(), (0, vue.createBlock)((0, vue.unref)(Cell), {
											key: `${teacher.number}-${teacher.name}`,
											title: teacher.name,
											value: teacher.number,
											label: teacher.unit,
											clickable: "",
											onClick: ($event) => teacherClick(teacher)
										}, null, 8, [
											"title",
											"value",
											"label",
											"onClick"
										]);
									}), 128))]),
									_: 2
								}, 1024)]);
							}), 128))]),
							_cache[11] || (_cache[11] = (0, vue.createElementVNode)("div", { class: "credits-bar" }, [
								(0, vue.createElementVNode)("span", null, "数据来源："),
								(0, vue.createElementVNode)("a", {
									href: "https://cxcy.nxu.edu.cn/",
									target: "_blank",
									rel: "noopener"
								}, " 宁夏大学创新创业学院 "),
								(0, vue.createElementVNode)("span", null, "宁夏大学创新创业服务平台")
							], -1))
						]),
						(0, vue.createElementVNode)("div", _hoisted_4, [(0, vue.createVNode)((0, vue.unref)(Tabs), {
							ref_key: "personalTabsRef",
							ref: personalTabsRef,
							active: personalTab.value,
							"onUpdate:active": _cache[10] || (_cache[10] = ($event) => personalTab.value = $event),
							class: "personal-schedule-tabs"
						}, {
							"nav-bottom": (0, vue.withCtx)(() => [(0, vue.withDirectives)((0, vue.createElementVNode)("div", _hoisted_5, [(0, vue.createElementVNode)("form", {
								action: "/",
								class: "personal-link-search-form",
								onSubmit: _cache[4] || (_cache[4] = (0, vue.withModifiers)(() => {}, ["prevent"]))
							}, [(0, vue.createVNode)((0, vue.unref)(Search), {
								modelValue: personalLink.value,
								"onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => personalLink.value = $event),
								class: "personal-link-search",
								"show-action": "",
								clearable: "",
								placeholder: "输入课表链接，如 https://portal.nxu.edu.cn/cal/xxxx",
								onSearch: loadScheduleFromInput
							}, {
								action: (0, vue.withCtx)(() => [(0, vue.createElementVNode)("div", { onClick: loadScheduleFromInput }, "查看课表")]),
								_: 1
							}, 8, ["modelValue"])], 32), (0, vue.createElementVNode)("div", _hoisted_6, [
								canViewMySchedule.value ? ((0, vue.openBlock)(), (0, vue.createBlock)((0, vue.unref)(Button), {
									key: 0,
									size: "small",
									icon: "user-o",
									type: "primary",
									plain: "",
									loading: personalLoading.value,
									onClick: viewMySchedule
								}, {
									default: (0, vue.withCtx)(() => [..._cache[12] || (_cache[12] = [(0, vue.createTextVNode)("查看我的", -1)])]),
									_: 1
								}, 8, ["loading"])) : (0, vue.createCommentVNode)("", true),
								(0, vue.createVNode)((0, vue.unref)(Uploader), {
									accept: ".json,application/json",
									"result-type": "file",
									disabled: personalLoading.value,
									"after-read": handlePersonalUpload
								}, {
									default: (0, vue.withCtx)(() => [(0, vue.createVNode)((0, vue.unref)(Button), {
										size: "small",
										icon: "upgrade",
										type: "primary",
										plain: ""
									}, {
										default: (0, vue.withCtx)(() => [..._cache[13] || (_cache[13] = [(0, vue.createTextVNode)("上传 JSON", -1)])]),
										_: 1
									})]),
									_: 1
								}, 8, ["disabled"]),
								(0, vue.createVNode)((0, vue.unref)(Button), {
									size: "small",
									icon: "down",
									type: "primary",
									plain: "",
									disabled: !canExportPersonalJson.value || personalLoading.value || personalExportPending.value,
									onClick: exportPersonalJson
								}, {
									default: (0, vue.withCtx)(() => [..._cache[14] || (_cache[14] = [(0, vue.createTextVNode)("导出 JSON", -1)])]),
									_: 1
								}, 8, ["disabled"]),
								(0, vue.createVNode)((0, vue.unref)(Button), {
									size: "small",
									icon: "photo-o",
									type: "primary",
									disabled: !personalSchedule.value || personalLoading.value || personalExportPending.value,
									onClick: exportPersonalImage
								}, {
									default: (0, vue.withCtx)(() => [..._cache[15] || (_cache[15] = [(0, vue.createTextVNode)("导出图片", -1)])]),
									_: 1
								}, 8, ["disabled"])
							])], 512), [[vue.vShow, personalScheduleToolbarVisible.value]])]),
							default: (0, vue.withCtx)(() => [
								(0, vue.createVNode)((0, vue.unref)(Tab), {
									title: "课程总览",
									name: "overview"
								}, {
									default: (0, vue.withCtx)(() => [(0, vue.createElementVNode)("div", _hoisted_7, [(0, vue.createElementVNode)("div", {
										ref_key: "personalStatsCapture",
										ref: personalStatsCapture,
										class: "personal-stats-capture"
									}, [!personalSchedule.value ? ((0, vue.openBlock)(), (0, vue.createBlock)((0, vue.unref)(Empty), {
										key: 0,
										description: "暂无可统计的课表"
									})) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [(0, vue.createElementVNode)("div", _hoisted_8, [
										(0, vue.createElementVNode)("div", _hoisted_9, [
											_cache[16] || (_cache[16] = (0, vue.createElementVNode)("div", { class: "personal-stat-label" }, "本学期课程", -1)),
											(0, vue.createElementVNode)("div", _hoisted_10, (0, vue.toDisplayString)(personalStats.value.totalCourses), 1),
											_cache[17] || (_cache[17] = (0, vue.createElementVNode)("div", { class: "personal-stat-unit" }, "门", -1))
										]),
										(0, vue.createElementVNode)("div", _hoisted_11, [
											_cache[18] || (_cache[18] = (0, vue.createElementVNode)("div", { class: "personal-stat-label" }, "总课时", -1)),
											(0, vue.createElementVNode)("div", _hoisted_12, (0, vue.toDisplayString)(personalStats.value.totalHours), 1),
											_cache[19] || (_cache[19] = (0, vue.createElementVNode)("div", { class: "personal-stat-unit" }, "节", -1))
										]),
										(0, vue.createElementVNode)("div", _hoisted_13, [
											_cache[20] || (_cache[20] = (0, vue.createElementVNode)("div", { class: "personal-stat-label" }, "实际课次", -1)),
											(0, vue.createElementVNode)("div", _hoisted_14, (0, vue.toDisplayString)(personalStats.value.totalLessons), 1),
											_cache[21] || (_cache[21] = (0, vue.createElementVNode)("div", { class: "personal-stat-unit" }, "次", -1))
										]),
										(0, vue.createElementVNode)("div", _hoisted_15, [
											_cache[22] || (_cache[22] = (0, vue.createElementVNode)("div", { class: "personal-stat-label" }, "教学周", -1)),
											(0, vue.createElementVNode)("div", _hoisted_16, (0, vue.toDisplayString)(personalStats.value.totalWeeks), 1),
											_cache[23] || (_cache[23] = (0, vue.createElementVNode)("div", { class: "personal-stat-unit" }, "周", -1))
										])
									]), (0, vue.createElementVNode)("div", _hoisted_17, [_cache[24] || (_cache[24] = (0, vue.createElementVNode)("h3", null, "每周课时分布", -1)), (0, vue.createElementVNode)("div", _hoisted_18, [((0, vue.openBlock)(true), (0, vue.createElementBlock)(vue.Fragment, null, (0, vue.renderList)(personalStats.value.weekly, (item) => {
										return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
											key: item.week,
											class: "personal-week-bar-item"
										}, [
											(0, vue.createElementVNode)("div", _hoisted_19, (0, vue.toDisplayString)(item.hours), 1),
											(0, vue.createElementVNode)("div", _hoisted_20, [(0, vue.createElementVNode)("div", {
												class: "personal-week-bar",
												style: (0, vue.normalizeStyle)({ height: item.percent + "%" })
											}, null, 4)]),
											(0, vue.createElementVNode)("div", null, "第" + (0, vue.toDisplayString)(item.week) + "周", 1)
										]);
									}), 128))])])], 64))], 512)])]),
									_: 1
								}),
								(0, vue.createVNode)((0, vue.unref)(Tab), {
									title: "个人课表",
									name: "personal"
								}, {
									default: (0, vue.withCtx)(() => [(0, vue.createElementVNode)("div", _hoisted_21, [personalSchedule.value ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", _hoisted_22, [(0, vue.createVNode)((0, vue.unref)(Tabs), {
										ref_key: "personalCourseWeekTabsRef",
										ref: personalCourseWeekTabsRef,
										active: selectedCourseWeek.value,
										"onUpdate:active": _cache[5] || (_cache[5] = ($event) => selectedCourseWeek.value = $event),
										type: "card",
										shrink: "",
										class: "personal-week-axis"
									}, {
										default: (0, vue.withCtx)(() => [((0, vue.openBlock)(true), (0, vue.createElementBlock)(vue.Fragment, null, (0, vue.renderList)(personalWeekOptions.value, (option) => {
											return (0, vue.openBlock)(), (0, vue.createBlock)((0, vue.unref)(Tab), {
												key: option.value,
												name: option.value,
												title: option.text
											}, null, 8, ["name", "title"]);
										}), 128))]),
										_: 1
									}, 8, ["active"])])) : (0, vue.createCommentVNode)("", true), (0, vue.createElementVNode)("div", _hoisted_23, [(0, vue.createElementVNode)("div", {
										ref_key: "personalCourseCapture",
										ref: personalCourseCapture,
										class: "personal-table-capture"
									}, [personalLoading.value ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", _hoisted_24, [(0, vue.createVNode)((0, vue.unref)(Loading), {
										size: "28px",
										vertical: ""
									}, {
										default: (0, vue.withCtx)(() => [..._cache[25] || (_cache[25] = [(0, vue.createTextVNode)("正在获取课表", -1)])]),
										_: 1
									})])) : !personalSchedule.value ? ((0, vue.openBlock)(), (0, vue.createBlock)((0, vue.unref)(Empty), {
										key: 1,
										description: personalError.value || "暂无课表，请输入链接或上传 JSON"
									}, null, 8, ["description"])) : ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", _hoisted_25, [
										_cache[26] || (_cache[26] = (0, vue.createElementVNode)("div", { class: "personal-course-grid-corner" }, "节次 / 时间", -1)),
										((0, vue.openBlock)(true), (0, vue.createElementBlock)(vue.Fragment, null, (0, vue.renderList)((0, vue.unref)(personalDays), (day) => {
											return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
												key: "header-" + day.number,
												class: "personal-course-grid-day",
												style: (0, vue.normalizeStyle)({
													gridColumn: String(day.number + 1),
													gridRow: "1"
												})
											}, (0, vue.toDisplayString)(day.text), 5);
										}), 128)),
										((0, vue.openBlock)(true), (0, vue.createElementBlock)(vue.Fragment, null, (0, vue.renderList)((0, vue.unref)(personalPeriodRows), (row) => {
											return (0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: row.key }, [(0, vue.createElementVNode)("div", {
												class: "personal-course-grid-period",
												style: (0, vue.normalizeStyle)({
													gridColumn: "1",
													gridRow: String(row.period + 1)
												})
											}, [(0, vue.createElementVNode)("div", null, "第 " + (0, vue.toDisplayString)(row.label) + " 节", 1), (0, vue.createElementVNode)("div", null, (0, vue.toDisplayString)(row.time), 1)], 4), ((0, vue.openBlock)(true), (0, vue.createElementBlock)(vue.Fragment, null, (0, vue.renderList)((0, vue.unref)(personalDays), (day) => {
												return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
													key: row.key + "-" + day.number,
													class: "personal-course-grid-cell",
													style: (0, vue.normalizeStyle)({
														gridColumn: String(day.number + 1),
														gridRow: String(row.period + 1)
													})
												}, null, 4);
											}), 128))], 64);
										}), 128)),
										((0, vue.openBlock)(true), (0, vue.createElementBlock)(vue.Fragment, null, (0, vue.renderList)(personalCourseLayout.value, (group) => {
											return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
												key: group.key,
												class: "personal-course-stack",
												style: (0, vue.normalizeStyle)(group.gridStyle)
											}, [((0, vue.openBlock)(true), (0, vue.createElementBlock)(vue.Fragment, null, (0, vue.renderList)(group.entries, (entry) => {
												return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
													key: entry.key,
													class: "personal-course-card",
													style: (0, vue.normalizeStyle)({ borderLeftColor: entry.color })
												}, [
													(0, vue.createElementVNode)("div", _hoisted_26, [(0, vue.createElementVNode)("div", _hoisted_27, (0, vue.toDisplayString)(entry.name), 1)]),
													entry.variants.length === 1 ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [
														entry.variants[0].teacherText ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", _hoisted_28, " 教师：" + (0, vue.toDisplayString)(entry.variants[0].teacherText), 1)) : (0, vue.createCommentVNode)("", true),
														entry.variants[0].room ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", _hoisted_29, " 教室：" + (0, vue.toDisplayString)(entry.variants[0].room), 1)) : (0, vue.createCommentVNode)("", true),
														(0, vue.createElementVNode)("div", _hoisted_30, "周次：" + (0, vue.toDisplayString)(entry.variants[0].weeksText), 1)
													], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", _hoisted_31, [((0, vue.openBlock)(true), (0, vue.createElementBlock)(vue.Fragment, null, (0, vue.renderList)(entry.variants, (variant) => {
														return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
															key: variant.key,
															class: "personal-course-variant"
														}, [(0, vue.createElementVNode)("div", _hoisted_32, (0, vue.toDisplayString)(variant.weeksText), 1), (0, vue.createElementVNode)("div", _hoisted_33, (0, vue.toDisplayString)(variant.detailText), 1)]);
													}), 128))])),
													entry.periodText ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", _hoisted_34, " 节次：" + (0, vue.toDisplayString)(entry.periodText), 1)) : (0, vue.createCommentVNode)("", true)
												], 4);
											}), 128))], 4);
										}), 128))
									]))], 512)])])]),
									_: 1
								}),
								(0, vue.createVNode)((0, vue.unref)(Tab), {
									title: "个人空课表",
									name: "personal-free"
								}, {
									default: (0, vue.withCtx)(() => [(0, vue.createElementVNode)("div", _hoisted_35, [personalSchedule.value ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", _hoisted_36, [(0, vue.createVNode)((0, vue.unref)(Tabs), {
										ref_key: "personalFreeWeekTabsRef",
										ref: personalFreeWeekTabsRef,
										active: selectedFreeWeek.value,
										"onUpdate:active": _cache[6] || (_cache[6] = ($event) => selectedFreeWeek.value = $event),
										type: "card",
										shrink: "",
										class: "personal-week-axis"
									}, {
										default: (0, vue.withCtx)(() => [((0, vue.openBlock)(true), (0, vue.createElementBlock)(vue.Fragment, null, (0, vue.renderList)(personalWeekOptions.value, (option) => {
											return (0, vue.openBlock)(), (0, vue.createBlock)((0, vue.unref)(Tab), {
												key: option.value,
												name: option.value,
												title: option.text
											}, null, 8, ["name", "title"]);
										}), 128))]),
										_: 1
									}, 8, ["active"])])) : (0, vue.createCommentVNode)("", true), (0, vue.createElementVNode)("div", _hoisted_37, [(0, vue.createElementVNode)("div", {
										ref_key: "personalFreeCapture",
										ref: personalFreeCapture,
										class: "personal-table-capture"
									}, [!personalSchedule.value ? ((0, vue.openBlock)(), (0, vue.createBlock)((0, vue.unref)(Empty), {
										key: 0,
										description: "暂无课表数据"
									})) : ((0, vue.openBlock)(), (0, vue.createElementBlock)("table", _hoisted_38, [
										_cache[28] || (_cache[28] = (0, vue.createElementVNode)("caption", { class: "visually-hidden" }, " 按星期和节次展示完全空闲、仅有线上课程可协调或有课状态 ", -1)),
										(0, vue.createElementVNode)("thead", null, [(0, vue.createElementVNode)("tr", null, [_cache[27] || (_cache[27] = (0, vue.createElementVNode)("th", {
											scope: "col",
											class: "personal-period-cell"
										}, "节次 / 时间", -1)), ((0, vue.openBlock)(true), (0, vue.createElementBlock)(vue.Fragment, null, (0, vue.renderList)((0, vue.unref)(personalDays), (day) => {
											return (0, vue.openBlock)(), (0, vue.createElementBlock)("th", {
												key: day.number,
												scope: "col"
											}, (0, vue.toDisplayString)(day.text), 1);
										}), 128))])]),
										(0, vue.createElementVNode)("tbody", null, [((0, vue.openBlock)(true), (0, vue.createElementBlock)(vue.Fragment, null, (0, vue.renderList)((0, vue.unref)(personalPeriodRows), (row) => {
											return (0, vue.openBlock)(), (0, vue.createElementBlock)("tr", { key: row.key }, [(0, vue.createElementVNode)("th", _hoisted_39, [(0, vue.createElementVNode)("div", null, "第 " + (0, vue.toDisplayString)(row.label) + " 节", 1), (0, vue.createElementVNode)("div", null, (0, vue.toDisplayString)(row.time), 1)]), ((0, vue.openBlock)(true), (0, vue.createElementBlock)(vue.Fragment, null, (0, vue.renderList)((0, vue.unref)(personalDays), (day) => {
												return (0, vue.openBlock)(), (0, vue.createElementBlock)("td", { key: day.number }, [(0, vue.createElementVNode)("div", {
													class: (0, vue.normalizeClass)(["personal-free-cell", {
														"personal-not-free": !personalFreeGrid.value[row.key][day.number].isFree,
														"personal-all-term-free": personalFreeGrid.value[row.key][day.number].isAllTermFree,
														"personal-online-only": personalFreeGrid.value[row.key][day.number].hasOnline
													}]),
													"aria-label": personalFreeGrid.value[row.key][day.number].ariaLabel
												}, (0, vue.toDisplayString)(personalFreeGrid.value[row.key][day.number].text), 11, _hoisted_40)]);
											}), 128))]);
										}), 128))])
									]))], 512)])])]),
									_: 1
								}),
								(0, vue.createVNode)((0, vue.unref)(Tab), {
									title: "空课表生成",
									name: "multi-free"
								}, {
									default: (0, vue.withCtx)(() => [(0, vue.createElementVNode)("div", _hoisted_41, [(0, vue.createElementVNode)("div", _hoisted_42, [_cache[31] || (_cache[31] = (0, vue.createElementVNode)("span", { class: "schedule-manager-hint" }, "前往教务系统导出 JSON 文件后在此添加", -1)), (0, vue.createElementVNode)("div", _hoisted_43, [(0, vue.createElementVNode)("div", _hoisted_44, [(0, vue.createElementVNode)("div", {
										class: "export-btn",
										onClick: toggleExportMenu
									}, [_cache[29] || (_cache[29] = (0, vue.createElementVNode)("span", null, "导出", -1)), showExportMenu.value ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", _hoisted_45, [(0, vue.createElementVNode)("div", { onClick: exportToExcel }, "导出为Excel"), (0, vue.createElementVNode)("div", { onClick: exportToImage }, "导出为图片")])) : (0, vue.createCommentVNode)("", true)])]), (0, vue.createElementVNode)("button", {
										class: "add-btn",
										disabled: multiScheduleLoading.value,
										onClick: triggerFileInput
									}, [..._cache[30] || (_cache[30] = [(0, vue.createElementVNode)("span", null, "+", -1), (0, vue.createTextVNode)(" 添加人员 ", -1)])], 8, _hoisted_46)])]), (0, vue.createElementVNode)("div", _hoisted_47, [fileList.value.length > 0 ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", _hoisted_48, [(0, vue.createElementVNode)("h3", null, "成员管理 (" + (0, vue.toDisplayString)(fileList.value.length) + ")", 1), (0, vue.createElementVNode)("div", _hoisted_49, [((0, vue.openBlock)(true), (0, vue.createElementBlock)(vue.Fragment, null, (0, vue.renderList)(fileList.value, (file) => {
										return (0, vue.openBlock)(), (0, vue.createElementBlock)("span", {
											key: file.filename,
											class: "file-tag"
										}, [(0, vue.createTextVNode)((0, vue.toDisplayString)(file.name) + " ", 1), (0, vue.createElementVNode)("button", {
											class: "tag-delete-btn",
											onClick: ($event) => removeFile(file.filename, $event)
										}, "×", 8, _hoisted_50)]);
									}), 128))])])) : (0, vue.createCommentVNode)("", true), (0, vue.createElementVNode)("div", _hoisted_51, [(0, vue.createElementVNode)("table", {
										ref_key: "multiEmptyTable",
										ref: multiEmptyTable,
										class: "schedule-table",
										"aria-label": "多人空闲时间表"
									}, [
										_cache[33] || (_cache[33] = (0, vue.createElementVNode)("caption", { class: "visually-hidden" }, " 按星期和节次展示各成员的完全空闲、仅有线上课程可协调、部分可用或无人空闲状态 ", -1)),
										(0, vue.createElementVNode)("thead", null, [(0, vue.createElementVNode)("tr", null, [_cache[32] || (_cache[32] = (0, vue.createElementVNode)("th", {
											scope: "col",
											class: "time-header"
										}, "节次", -1)), ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, null, (0, vue.renderList)(daysOfWeek, (day) => {
											return (0, vue.createElementVNode)("th", {
												key: day,
												scope: "col"
											}, (0, vue.toDisplayString)(day), 1);
										}), 64))])]),
										(0, vue.createElementVNode)("tbody", null, [((0, vue.openBlock)(true), (0, vue.createElementBlock)(vue.Fragment, null, (0, vue.renderList)((0, vue.unref)(classPeriods), (period, index) => {
											return (0, vue.openBlock)(), (0, vue.createElementBlock)("tr", { key: index }, [(0, vue.createElementVNode)("th", _hoisted_52, (0, vue.toDisplayString)(period), 1), ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, null, (0, vue.renderList)(daysOfWeek, (day) => {
												return (0, vue.createElementVNode)("td", {
													key: day,
													class: "schedule-cell"
												}, [allFilesSchedule.value[day] && allFilesSchedule.value[day][index].length > 0 ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", _hoisted_53, [((0, vue.openBlock)(true), (0, vue.createElementBlock)(vue.Fragment, null, (0, vue.renderList)(allFilesSchedule.value[day][index], (item, i) => {
													return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
														key: item.key || i,
														class: (0, vue.normalizeClass)(["file-item-display", {
															"file-item-all-free": item.status === "free",
															"file-item-online-only": item.status === "online"
														}])
													}, (0, vue.toDisplayString)(item.text), 3);
												}), 128)), (0, vue.createElementVNode)("div", { class: (0, vue.normalizeClass)(["availability-summary", "status-" + multiAvailabilitySummary.value[day][index].status]) }, (0, vue.toDisplayString)(multiAvailabilitySummary.value[day][index].text), 3)])) : ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", _hoisted_54, (0, vue.toDisplayString)(multiAvailabilitySummary.value[day][index].text), 1))]);
											}), 64))]);
										}), 128))])
									], 512)])])])]),
									_: 1
								}),
								(0, vue.createVNode)((0, vue.unref)(Tab), {
									title: "课表密钥管理",
									name: "keys"
								}, {
									default: (0, vue.withCtx)(() => [(0, vue.createElementVNode)("div", _hoisted_55, [(0, vue.createElementVNode)("div", _hoisted_56, [_cache[40] || (_cache[40] = (0, vue.createElementVNode)("div", { class: "schedule-key-guide" }, [
										(0, vue.createElementVNode)("p", null, [(0, vue.createElementVNode)("strong", null, "加密密钥（公钥）可以分享："), (0, vue.createTextVNode)("对方导出课表时使用你的加密密钥，生成的文件只能由你的解密密钥打开。 ")]),
										(0, vue.createElementVNode)("p", null, [(0, vue.createElementVNode)("strong", null, "解密密钥（私钥）必须保密："), (0, vue.createTextVNode)("不要发给同学、群聊或任何其他人。解密密钥丢失后无法恢复，旧加密文件也无法打开。 ")]),
										(0, vue.createElementVNode)("p", null, "换浏览器、清理脚本数据、重装脚本或重新生成密钥前，请先自行备份解密密钥。")
									], -1)), !scheduleKeyPair.value ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", _hoisted_57, [(0, vue.createVNode)((0, vue.unref)(Empty), { description: "尚未生成课表密钥" }), (0, vue.createVNode)((0, vue.unref)(Button), {
										type: "primary",
										loading: scheduleKeyGenerating.value,
										onClick: generateScheduleKeyPair
									}, {
										default: (0, vue.withCtx)(() => [..._cache[34] || (_cache[34] = [(0, vue.createTextVNode)("生成课表密钥", -1)])]),
										_: 1
									}, 8, ["loading"])])) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [
										(0, vue.createElementVNode)("section", _hoisted_58, [(0, vue.createElementVNode)("div", _hoisted_59, [_cache[36] || (_cache[36] = (0, vue.createElementVNode)("div", null, [(0, vue.createElementVNode)("strong", null, "加密密钥（公钥，可分享）"), (0, vue.createElementVNode)("span", null, "可以复制并发送给需要向你提供课表的人")], -1)), (0, vue.createVNode)((0, vue.unref)(Button), {
											size: "small",
											type: "primary",
											plain: "",
											onClick: _cache[7] || (_cache[7] = ($event) => copyScheduleKey("public"))
										}, {
											default: (0, vue.withCtx)(() => [..._cache[35] || (_cache[35] = [(0, vue.createTextVNode)("复制加密密钥", -1)])]),
											_: 1
										})]), (0, vue.createElementVNode)("textarea", {
											class: "schedule-key-text",
											value: scheduleKeyPair.value.publicKey,
											rows: "8",
											readonly: ""
										}, null, 8, _hoisted_60)]),
										(0, vue.createElementVNode)("section", _hoisted_61, [(0, vue.createElementVNode)("div", _hoisted_62, [_cache[38] || (_cache[38] = (0, vue.createElementVNode)("div", null, [(0, vue.createElementVNode)("strong", null, "解密密钥（私钥，请保密）"), (0, vue.createElementVNode)("span", null, "只由你本人保管，任何人索要都不要发送")], -1)), (0, vue.createElementVNode)("div", _hoisted_63, [(0, vue.createVNode)((0, vue.unref)(Button), {
											size: "small",
											plain: "",
											onClick: _cache[8] || (_cache[8] = ($event) => showSchedulePrivateKey.value = !showSchedulePrivateKey.value)
										}, {
											default: (0, vue.withCtx)(() => [(0, vue.createTextVNode)((0, vue.toDisplayString)(showSchedulePrivateKey.value ? "隐藏解密密钥" : "显示解密密钥"), 1)]),
											_: 1
										}), (0, vue.createVNode)((0, vue.unref)(Button), {
											size: "small",
											type: "danger",
											plain: "",
											onClick: _cache[9] || (_cache[9] = ($event) => copyScheduleKey("private"))
										}, {
											default: (0, vue.withCtx)(() => [..._cache[37] || (_cache[37] = [(0, vue.createTextVNode)("复制解密密钥", -1)])]),
											_: 1
										})])]), showSchedulePrivateKey.value ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("textarea", {
											key: 0,
											class: "schedule-key-text schedule-private-key-text",
											value: scheduleKeyPair.value.privateKey,
											rows: "12",
											readonly: ""
										}, null, 8, _hoisted_64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", _hoisted_65, " 解密密钥已隐藏，查看前请确认周围无人窥视屏幕。 "))]),
										(0, vue.createElementVNode)("div", _hoisted_66, [(0, vue.createVNode)((0, vue.unref)(Button), {
											type: "danger",
											plain: "",
											loading: scheduleKeyGenerating.value,
											onClick: generateScheduleKeyPair
										}, {
											default: (0, vue.withCtx)(() => [..._cache[39] || (_cache[39] = [(0, vue.createTextVNode)("重新生成密钥", -1)])]),
											_: 1
										}, 8, ["loading"])])
									], 64))])])]),
									_: 1
								})
							]),
							_: 1
						}, 8, ["active"])]),
						_cache[41] || (_cache[41] = (0, vue.createElementVNode)("div", null, [(0, vue.createElementVNode)("h3", { style: {
							"width": "100%",
							"text-align": "center"
						} }, "静候佳音...")], -1))
					])
				], 64);
			};
		}
	};
	var console$9 = MyConsole("[webvpn.tools]");
	function openWarmupTab(openInTab, url) {
		if (typeof openInTab !== "function" || !url) return;
		try {
			const tab = openInTab(url, { active: false });
			if (typeof tab?.close === "function") setTimeout(() => {
				try {
					tab.close();
				} catch (error) {
					console$9("后台预热标签页关闭失败", error, "warn");
				}
			}, 5e3);
		} catch (error) {
			console$9("后台预热标签页打开失败", error, "warn");
		}
	}
	async function register$6() {
		openWarmupTab(_GM_openInTab, buildWebVpnUrl("https://portal.nxu.edu.cn/index.html"));
		openWarmupTab(_GM_openInTab, buildWebVpnUrl("https://xsfw.nxu.edu.cn/xsfw/sys/jbxxapp/*default/index.do#/wdxx"));
		const { deployToast } = mountAppPage({
			id: "tools",
			title: "小工具 - H"
		});
		(document.head || document.documentElement).appendChild(tools_css_default);
		mountVueApp({
			root: _sfc_main,
			id: "tools"
		});
		removeToastHandle(deployToast);
		toast("success", "小工具部署完毕", 2);
		toast("info", "由于获取课表信息需要，我们正在后台打开信息门户和学工系统页面，请稍后再打开\"课表信息\"页面，以免获取信息失败", 6);
		console$9("小工具页部署完毕");
	}
	var console$8 = MyConsole("[sysaq.login]");
	async function register$5() {
		installNotification();
		console$8("进入实验室安全教育平台登录页");
		if (!document.evaluate("//button[.//span[contains(., '点击登录')]]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue) return;
		toast("success", "自动登录…", 3);
		console$8("识别到\"点击登录\"按钮，自动跳转认证页");
		const url = new URL(window.location.href);
		url.pathname = url.pathname.replace(/\/$/, "") + "/login";
		window.location.href = url.toString();
	}
	var console$7 = MyConsole("[sysaq.auth]");
	async function register$4() {
		installNotification();
		console$7("进入实验室安全教育平台认证页");
		const button = document.evaluate(".//a[contains(., '统一身份认证登录')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
		if (!button) return;
		toast("success", "自动登录…", 3);
		console$7("识别到\"统一身份认证登录\"链接，自动点击");
		simulateClick(button);
	}
	var console$6 = MyConsole("[评教]");
	async function register$3() {
		installNotification();
		console$6("进入评教系统", "注入未实现提示");
		const message = "评教自动填写功能暂未实现，请手动完成当前页面操作。";
		if (toast) toast("info", message, 5);
		else window.alert(message);
	}
	async function withAbort(promise, signal) {
		let abort;
		const interrupted = new Promise((_, reject) => {
			abort = () => reject(signal.reason);
			signal.addEventListener("abort", abort, { once: true });
			if (signal.aborted) abort();
		});
		try {
			return await Promise.race([promise, interrupted]);
		} finally {
			signal.removeEventListener("abort", abort);
		}
	}
	var LOCAL_OCR_ASSETS = Object.freeze({
		worker: {
			url: "https://unpkg.com/tesseract.js@7.0.0/dist/worker.min.js",
			sha384: "iUyp1FxLBc4DYaSwxT1/G6elMdSh3vvQffNSmMiySoXDpk2XfS9ZcM4RjPSiqiw3"
		},
		core: {
			url: "https://unpkg.com/tesseract.js-core@7.0.0/tesseract-core-lstm.wasm.js",
			sha384: "ljppwjVnA7rpAU/v9enQiR6pXDStaEAYw9I+7ddiEynJcmDNnjHCmcvizBeO3cSA"
		},
		language: {
			url: "https://unpkg.com/@tesseract.js-data/eng@1.0.0/4.0.0_best_int/eng.traineddata.gz",
			sha384: "JI+fraGAoc5GBGIliuqzHRnP1nJyrukg5ggNSBv/TO+YOVj+6Te6XXQOx7ia10xq"
		}
	});
	async function fetchOcrAsset({ url, sha384 }, signal) {
		signal.throwIfAborted();
		if (typeof _GM?.xmlHttpRequest !== "function") throw new Error("OCR 资源下载 API 不可用");
		const request = _GM.xmlHttpRequest({
			method: "GET",
			url,
			responseType: "arraybuffer",
			anonymous: true,
			timeout: 6e4
		});
		const abort = () => request.abort?.();
		signal.addEventListener("abort", abort, { once: true });
		try {
			const response = await withAbort(request, signal);
			signal.throwIfAborted();
			const bytes = response.response;
			if (response.status !== 200 || Object.prototype.toString.call(bytes) !== "[object ArrayBuffer]" || !bytes.byteLength) throw new Error("OCR 资源下载失败");
			const digest = await crypto.subtle.digest("SHA-384", bytes);
			signal.throwIfAborted();
			if (btoa(String.fromCharCode(...new Uint8Array(digest))) !== sha384) throw new Error("OCR 资源完整性校验失败");
			return bytes;
		} finally {
			signal.removeEventListener("abort", abort);
		}
	}
	async function createLocalOcrWorker(signal, { page = _unsafeWindow ?? window, loadAsset = fetchOcrAsset, createWorker = createOcrWorker } = {}) {
		const controller = new AbortController();
		const cancel = () => controller.abort(signal.reason);
		signal.addEventListener("abort", cancel, { once: true });
		if (signal.aborted) cancel();
		let timer = setTimeout(() => controller.abort(new Error("OCR 初始化超时")), 9e4);
		const urls = [];
		let worker;
		let pendingWorker;
		let disposed = false;
		const terminate = (value) => Promise.resolve().then(() => value?.terminate()).catch(() => {});
		const dispose = () => {
			if (disposed) return;
			disposed = true;
			clearTimeout(timer);
			signal.removeEventListener("abort", cancel);
			controller.signal.removeEventListener("abort", dispose);
			if (worker) terminate(worker);
			else if (pendingWorker) pendingWorker.then(terminate, () => {});
			for (const url of urls) page.URL.revokeObjectURL(url);
		};
		controller.signal.addEventListener("abort", dispose, { once: true });
		try {
			const assets = await Promise.all(Object.values(LOCAL_OCR_ASSETS).map((asset) => loadAsset(asset, controller.signal)));
			controller.signal.throwIfAborted();
			for (const [index, bytes] of assets.entries()) urls.push(page.URL.createObjectURL(new page.Blob([bytes], { type: index === 2 ? "application/octet-stream" : "text/javascript" })));
			pendingWorker = createWorker("eng", 1, {
				workerPath: urls[0],
				workerBlobURL: false,
				corePath: `${urls[1]}#.js`,
				langPath: `${urls[2]}#`,
				cacheMethod: "none"
			});
			worker = await withAbort(pendingWorker, controller.signal);
			await withAbort(worker.setParameters({
				tessedit_char_whitelist: "0123456789",
				tessedit_pageseg_mode: "7"
			}), controller.signal);
			clearTimeout(timer);
			return {
				async recognize(image) {
					controller.signal.throwIfAborted();
					timer = setTimeout(() => controller.abort(new Error("验证码识别超时")), 3e4);
					try {
						return await withAbort(worker.recognize(image), controller.signal);
					} finally {
						clearTimeout(timer);
					}
				},
				dispose
			};
		} catch (error) {
			controller.abort(error);
			dispose();
			throw error;
		}
	}
	function attachmentName(response) {
		const disposition = response.headers.get("content-disposition") || "";
		if (!response.ok || !/^attachment(?:\s*;|\s*$)/i.test(disposition)) return null;
		if (/^(?:text\/html|application\/xhtml\+xml)(?:;|$)/i.test(response.headers.get("content-type") || "")) return null;
		const extended = disposition.match(/(?:^|;)\s*filename\*\s*=\s*UTF-8'[^']*'([^;]+)/i);
		const basic = disposition.match(/(?:^|;)\s*filename\s*=\s*(?:"([^"]*)"|([^;]*))/i);
		let name = extended?.[1] || basic?.[1] || basic?.[2] || "团委附件";
		try {
			name = decodeURIComponent(name.trim());
		} catch {}
		return name.replace(/[\x00-\x1f\x7f/\\:*?"<>|]/g, "_").replace(/^[.\s]+|[.\s]+$/g, "") || "团委附件";
	}
	function fetchAttachment(url, signal, fetchImpl = window.fetch.bind(window)) {
		return fetchWithTimeout(fetchImpl, url, {
			credentials: "same-origin",
			cache: "no-store",
			redirect: "error"
		}, {
			signal,
			timeoutMs: 12e4,
			async consumeResponse(response) {
				const name = attachmentName(response);
				if (!name) {
					await response.body?.cancel();
					if (response.ok && /^text\/html(?:;|$)/i.test(response.headers.get("content-type") || "")) return null;
					throw new Error("服务器未返回有效附件");
				}
				const blob = await response.blob();
				if (!blob.size) throw new Error("附件内容为空");
				return {
					name,
					blob
				};
			}
		});
	}
	async function saveAttachment({ name, blob }, signal) {
		signal.throwIfAborted();
		if (typeof _GM_download !== "function") throw new Error("下载 API 不可用，请更新脚本并允许下载权限");
		const reader = new FileReader();
		const abortReader = () => reader.abort();
		signal.addEventListener("abort", abortReader, { once: true });
		let url;
		try {
			url = await withAbort(new Promise((resolve, reject) => {
				reader.onload = () => resolve(reader.result);
				reader.onerror = () => reject(new Error("附件读取失败"));
				reader.readAsDataURL(blob);
			}), signal);
		} finally {
			signal.removeEventListener("abort", abortReader);
		}
		signal.throwIfAborted();
		let handle;
		let timer;
		const abort = () => handle?.abort?.();
		signal.addEventListener("abort", abort, { once: true });
		try {
			await withAbort(new Promise((resolve, reject) => {
				timer = setTimeout(() => {
					abort();
					reject(new Error("等待下载完成超时，请检查浏览器下载列表"));
				}, 12e4);
				handle = _GM_download({
					url,
					name,
					downloadMode: "browser",
					saveAs: false,
					onload: resolve,
					onerror: () => reject(new Error("附件下载失败，请检查下载权限或手动下载")),
					ontimeout: () => reject(new Error("附件下载超时"))
				});
			}), signal);
			signal.throwIfAborted();
		} finally {
			clearTimeout(timer);
			signal.removeEventListener("abort", abort);
		}
	}
	var BUTTON = "body > div.code > div > div.code_but > input[type=\"button\"]";
	var IMAGE_PATH = "/system/resource/js/filedownload/createimage.jsp";
	function normalizeCaptcha(text) {
		const code = String(text || "").replace(/\s+/g, "");
		return /^\d{4}$/.test(code) ? code : null;
	}
	function waitForImage(image, signal) {
		if (image.complete && image.naturalWidth) return Promise.resolve();
		let loaded;
		let failed;
		let timer;
		return withAbort(new Promise((resolve, reject) => {
			loaded = () => image.naturalWidth ? resolve() : reject(new Error("验证码图片为空"));
			failed = () => reject(new Error("验证码图片加载失败"));
			image.addEventListener("load", loaded, { once: true });
			image.addEventListener("error", failed, { once: true });
			timer = setTimeout(failed, 1e4);
		}), signal).finally(() => {
			clearTimeout(timer);
			image.removeEventListener("load", loaded);
			image.removeEventListener("error", failed);
		});
	}
	function snapshot(doc, image) {
		const canvas = doc.createElement("canvas");
		canvas.width = image.naturalWidth * 3;
		canvas.height = image.naturalHeight * 3;
		canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
		return canvas;
	}
	async function autoDownloadAttachment({ doc = document, page = window, autoClose = false, report = () => {}, createWorker = createLocalOcrWorker, request = fetchAttachment, save = saveAttachment, close = closeCurrentTab } = {}) {
		const url = new URL(page.location.href);
		if (!isTuanweiDownloadRoute({ url: url.href })) return "ignored";
		const input = doc.querySelector("#codeValue");
		const button = doc.querySelector(BUTTON);
		const image = doc.querySelector("#codeimg");
		if (!input || !button || !image) throw new Error("未找到附件验证码控件，请手动下载");
		const imageUrl = new URL(image.src, url);
		if (imageUrl.origin !== url.origin || imageUrl.pathname !== IMAGE_PATH) throw new Error("验证码图片地址不匹配");
		if (input.value.trim()) return "manual";
		const controller = new AbortController();
		const { signal } = controller;
		let worker;
		let automaticClick = false;
		let downloadTask;
		const originalDisabled = button.disabled;
		const stop = () => controller.abort();
		const manual = (event) => {
			if (event.isTrusted) stop();
		};
		const intercept = (event) => {
			if (!automaticClick) return;
			event.preventDefault();
			event.stopImmediatePropagation();
			const target = new URL(url);
			target.searchParams.set("codeValue", input.value);
			downloadTask = request(target.href, signal);
		};
		input.addEventListener("input", manual);
		image.addEventListener("click", manual, true);
		button.addEventListener("click", manual, true);
		button.addEventListener("click", intercept, true);
		page.addEventListener("pagehide", stop, { once: true });
		try {
			report("正在加载验证码识别组件…");
			worker = await createWorker(signal);
			for (let attempt = 0; attempt < 3; attempt++) {
				signal.throwIfAborted();
				if (attempt) image.src = new URL(`${IMAGE_PATH}?randnum=${Date.now()}`, url).href;
				await waitForImage(image, signal);
				const source = image.src;
				report(`正在识别验证码（${attempt + 1}/3）…`);
				const result = await withAbort(worker.recognize(snapshot(doc, image)), signal);
				signal.throwIfAborted();
				if (!input.isConnected || !button.isConnected || !image.isConnected || image.src !== source || input.value.trim()) return "manual";
				const code = normalizeCaptcha(result?.data?.text);
				if (!code) continue;
				input.value = code;
				input.dispatchEvent(new page.Event("input", { bubbles: true }));
				input.dispatchEvent(new page.Event("change", { bubbles: true }));
				downloadTask = void 0;
				automaticClick = true;
				try {
					button.click();
				} finally {
					automaticClick = false;
				}
				if (!downloadTask) throw new Error("无法提交附件下载");
				button.disabled = true;
				report("正在验证并接收附件…");
				const attachment = await withAbort(downloadTask, signal);
				signal.throwIfAborted();
				if (attachment) {
					report("正在保存附件，请等待下载完成…");
					await withAbort(save(attachment, signal), signal);
					signal.throwIfAborted();
					report("附件下载完成", "success");
					if (autoClose) close();
					return "downloaded";
				}
				button.disabled = originalDisabled;
				if (input.value !== code) return "manual";
				input.value = "";
			}
			throw new Error("验证码识别未通过，请点击验证码图片后手动输入并下载");
		} catch (error) {
			if (signal.aborted) return "manual";
			throw error;
		} finally {
			controller.abort();
			worker?.dispose();
			button.disabled = originalDisabled;
			input.removeEventListener("input", manual);
			image.removeEventListener("click", manual, true);
			button.removeEventListener("click", manual, true);
			button.removeEventListener("click", intercept, true);
			page.removeEventListener("pagehide", stop);
		}
	}
	var task;
	function register$2() {
		if (!isTuanweiDownloadRoute(getContext()) || !getGMValue("TuanWei.autoDownload")) return;
		if (task) return task;
		installNotification();
		let progressToast = null;
		let active = true;
		const clearProgress = () => {
			if (progressToast) removeToastHandle(progressToast);
			progressToast = null;
		};
		const onPageHide = () => {
			active = false;
			clearProgress();
		};
		window.addEventListener("pagehide", onPageHide, { once: true });
		task = autoDownloadAttachment({
			autoClose: getGMValue("TuanWei.autoDownloadClose") === true,
			report: (message, type = "info") => {
				if (!active) return;
				clearProgress();
				if (type === "success") toast("success", message, 3);
				else progressToast = toast("info", message, 0);
			}
		}).then((result) => {
			if (active && result === "manual") {
				clearProgress();
				toast("info", "已停止自动下载，请手动完成", 4);
			}
		}).catch((error) => {
			if (!active) return;
			clearProgress();
			toast("error", `${error?.message || "自动下载失败"}；页面已保留，可手动下载。`, 6);
		}).finally(() => {
			clearProgress();
			window.removeEventListener("pagehide", onPageHide);
		});
		return task;
	}
	var console$5 = MyConsole("[portal-spa]");
	var capturedPushState = null;
	var capturedReplaceState = null;
	var navigateCallbacks = new Set();
	var popstateHandler = null;
	function patchPortalHistory({ onNavigate } = {}) {
		if (typeof onNavigate === "function") navigateCallbacks.add(onNavigate);
		if (capturedPushState !== null && capturedReplaceState !== null) return;
		capturedPushState = history.pushState;
		capturedReplaceState = history.replaceState;
		let navigating = false;
		let rerunRequested = false;
		const fireCallbacks = () => {
			if (navigating) {
				rerunRequested = true;
				return;
			}
			navigating = true;
			const tasks = [...navigateCallbacks].map((cb) => Promise.resolve().then(() => cb()).catch((error) => console$5("onNavigate 回调抛错", error, "warn")));
			Promise.all(tasks).finally(() => {
				navigating = false;
				if (rerunRequested) {
					rerunRequested = false;
					fireCallbacks();
				}
			});
		};
		history.pushState = function(...args) {
			const result = capturedPushState.apply(this, args);
			fireCallbacks();
			return result;
		};
		history.replaceState = function(...args) {
			const result = capturedReplaceState.apply(this, args);
			fireCallbacks();
			return result;
		};
		popstateHandler = fireCallbacks;
		window.addEventListener("popstate", popstateHandler);
	}
	var libraryCard = (title, url) => ({
		title,
		navigation: "system",
		url: {
			campus: `https://zylib.nxu.edu.cn/-----${url}`,
			webvpn: url
		}
	});
	var PORTAL_CARDS = [
		{
			title: "Better NXU - 常用",
			id: "betternxu-h-main",
			items: [
				{
					title: "学工系统",
					url: "https://xsfw.nxu.edu.cn"
				},
				{
					title: "双创平台",
					url: "http://202.201.128.142/nxu1"
				},
				{
					title: "实验室安全教育平台",
					url: "https://sysaq.nxu.edu.cn"
				}
			]
		},
		{
			title: "Better NXU - 教务系统",
			id: "betternxu-h-jwgl",
			items: [{
				title: "教务系统",
				url: "https://jwgl.nxu.edu.cn"
			}, ...[
				8080,
				8081,
				8082,
				8083
			].map((port, index) => ({
				title: `备用${index + 1}`,
				url: `http://202.201.128.234:${port}`
			}))]
		},
		{
			title: "Better NXU - 图书馆",
			id: "betternxu-h-lib",
			items: [
				{
					title: "图书馆",
					url: "https://zylib.nxu.edu.cn/login"
				},
				libraryCard("中国知网", "https://www.cnki.net/"),
				libraryCard("万方数据", "https://www.wanfangdata.com.cn/"),
				libraryCard("维普资讯", "https://qikan.cqvip.com/"),
				libraryCard("Web of Science", "https://www.webofscience.com/wos/alldb/basic-search"),
				{
					title: "PubScholar公益学术平台(校外)",
					navigation: "direct",
					url: "https://pubscholar.cn/"
				}
			]
		},
		{
			title: "Better NXU - H 小工具",
			id: "betternxu-h-tools",
			items: [
				{
					title: "H 小工具",
					navigation: "direct",
					url: "https://webvpn.nxu.edu.cn/h/tools"
				},
				{
					title: "宁夏大学猫狗图鉴",
					navigation: "direct",
					url: "https://nxu-cdig.thisish.cn/"
				},
				{
					title: "NXU Charge（已废弃）",
					navigation: "direct",
					url: "https://campus-charge.thisish.cn/"
				}
			]
		}
	];
	function resolvePortalCardLink(card, portalUrl) {
		const context = parseWebVpnContext(portalUrl);
		const viaVpn = context?.viaVpn && context.realHost === "portal.nxu.edu.cn";
		const url = typeof card.url === "string" ? card.url : card.url?.[viaVpn ? "webvpn" : "campus"];
		const navigation = card.navigation ?? "system";
		if (!["system", "direct"].includes(navigation)) throw new Error("门户卡片跳转模式无效");
		let parsed;
		try {
			parsed = new URL(url);
		} catch {
			throw new Error("当前环境的门户卡片地址未配置");
		}
		if (!["http:", "https:"].includes(parsed.protocol) || parsed.username || parsed.password) throw new Error("门户卡片地址必须为 HTTP(S) 地址");
		return {
			url,
			navigation
		};
	}
	function openPortalCard(card, { portalUrl, pageWindow, openInTab }) {
		const { url, navigation } = resolvePortalCardLink(card, portalUrl);
		if (navigation === "direct") {
			if (typeof openInTab !== "function") throw new Error("直接打开链接需要 ScriptCat 的 GM_openInTab 权限");
			return openInTab(url, {
				active: true,
				insert: true
			});
		}
		return pageWindow.open(url, "_blank", "noopener,noreferrer");
	}
	var console$4 = MyConsole("[portal.hall]");
	var inflightPortalInject = null;
	async function injectPortalHall() {
		if (inflightPortalInject) return inflightPortalInject;
		inflightPortalInject = (async () => {
			const iframe = await waitOrToast("iframe#template-container", {
				timeout: 15e3,
				predicate: (element) => Boolean(element.contentWindow?.document),
				level: "error",
				duration: 4
			});
			if (!iframe) return;
			const mainIframe = iframe.contentWindow;
			const startedAt = Date.now();
			while (Date.now() - startedAt <= 15e3) {
				if (mainIframe.document.querySelector("div.city_sort")?.querySelector("div.sortItem")) break;
				await WaitTime(200, 0, false);
			}
			const list = mainIframe.document.querySelector("div.city_sort");
			if (!list?.querySelector("div.sortItem")) {
				toast("warning", "门户分类加载超时，已跳过自定义卡片", 4);
				return;
			}
			const listFirst = list.querySelector("div.sortItem");
			const dataVValue = Array.from(list.attributes).find((attr) => attr.name.startsWith("data-v-"))?.name || "";
			const generateDiv = ({ title, id, items }) => {
				const liList = items.map((item, index) => {
					const msg = item.title;
					const firstChar = msg.charAt(0);
					return `<li ${dataVValue}>
                    <div ${dataVValue} class="li-item portal-font-color-lv1 portal-primary-color-hover-lv1 favoriteapp-list-hover portal-primary-backgroundcolor-hover-lv5" role="link" tabindex="0" data-card-index="${index}">
                        <div ${dataVValue} class="favoriteapp-left">
                            <div style="width:100%;height:100%;display:flex;justify-content:center;align-items:center;font-size:x-large;font-weight:bold;color:#38727F">
                                ${firstChar}
                            </div>
                        </div>
                        <div ${dataVValue} class="favoriteapp-center">
                            <div ${dataVValue} class="we-tooltip item" style="overflow: hidden;">
                                <span style="box-shadow: transparent 0px 0px;">
                                    <span aria-label="${msg}"> ${msg} </span>
                                </span>
                            </div>
                        </div>
                    </div>
                </li>`;
				});
				const template = `<h2 class="portal-font-color-lv1" ${dataVValue}> ${title} </h2>
            <div class="favoriteapp" ${dataVValue}>
                <ul class="asul" ${dataVValue}>
                    ${liList.join("\n")}
                </ul>
            </div>`;
				const div = mainIframe.document.createElement("div");
				div.className = "sortItem";
				div.id = id;
				div.innerHTML = template;
				for (const card of div.querySelectorAll("[data-card-index]")) {
					const item = items[Number(card.dataset.cardIndex)];
					const reportError = (error) => toast("warning", error.message || "门户链接打开失败", 4);
					const open = () => {
						try {
							const result = openPortalCard(item, {
								portalUrl: window.location.href,
								pageWindow: mainIframe,
								openInTab: _GM_openInTab
							});
							if (item.navigation === "direct") Promise.resolve(result).catch(reportError);
						} catch (error) {
							reportError(error);
						}
					};
					card.addEventListener("click", open);
					card.addEventListener("keydown", (event) => {
						if (event.key === "Enter" && !event.repeat) {
							event.preventDefault();
							open();
						}
					});
				}
				return div;
			};
			for (const { title, id, items } of PORTAL_CARDS) if (!mainIframe.document.querySelector(`#${id}`)) list.insertBefore(generateDiv({
				title,
				id,
				items
			}), listFirst);
		})().finally(() => {
			inflightPortalInject = null;
		});
		return inflightPortalInject;
	}
	function buildPortalOnNavigate(resolveCurrentPath) {
		return async () => {
			const currentPath = resolveCurrentPath();
			const currentUrl = window.location.href;
			if (currentPath === "/index.html" || currentPath === "/default/index.html") {
				if (currentUrl.indexOf("#/hall") !== -1) {
					console$4("识别到门户应用中心（#/hall）");
					await injectPortalHall();
				}
			}
		};
	}
	var console$3 = MyConsole("[portal.hall]");
	async function register$1() {
		installNotification();
		console$3("进入新版信息门户");
		const onNavigate = buildPortalOnNavigate(() => {
			const current = parseWebVpnContext(window.location.href);
			return current?.realHost === "portal.nxu.edu.cn" ? current.realPath : window.location.pathname;
		});
		patchPortalHistory({ onNavigate });
		await onNavigate();
	}
	function isJwglSite(ctx) {
		if (ctx.host === "jwgl.nxu.edu.cn" || ctx.isJwglIp) return true;
		if (ctx.isWebvpn && (isWebVpnRealHost(ctx.vpnContext, "jwgl.nxu.edu.cn") || isWebVpnRealHost(ctx.vpnContext, "202.201.128.234"))) return true;
		return false;
	}
	function jwglPathOrUrl(ctx) {
		if (ctx.isWebvpn) return ctx.vpnContext?.realPath || "";
		return ctx.url;
	}
	var console$2 = MyConsole("[路由]");
	var readerRegistrations = new Map([["cnki", register$9], ["wanfang", register$8]]);
	var JUDGE_TABLE = [
		{
			site: "sslvpn",
			page: "settings",
			register: register$16,
			test: (c) => c.host === "sslvpn.nxu.edu.cn" && c.path === "/h/settings"
		},
		{
			site: "sslvpn",
			page: "about",
			register: register$15,
			test: (c) => c.host === "sslvpn.nxu.edu.cn" && c.path === "/h/about"
		},
		{
			site: "jwgl",
			page: "login",
			register: register$14,
			test: (c) => {
				if (!isJwglSite(c)) return false;
				if (c.isWebvpn) {
					const p = c.vpnContext?.realPath || "";
					return p.indexOf("index.action") !== -1 || p.indexOf("login.action") !== -1;
				}
				return c.path === "/index.action" || c.path === "/login.action";
			}
		},
		{
			site: "jwgl",
			page: "home",
			register: register$13,
			test: (c) => {
				if (!isJwglSite(c)) return false;
				const p = jwglPathOrUrl(c);
				return p.indexOf("cas.action") !== -1 || p.indexOf("home.action") !== -1;
			}
		},
		{
			site: "jwgl",
			page: "course-table-container",
			register: register$12,
			test: (c) => isJwglSite(c) && c.url.indexOf("courseTableForStd.action") !== -1 && c.query.get("method") === "stdHome"
		},
		{
			site: "jwgl",
			page: "course-table",
			register: register$11,
			test: (c) => isJwglSite(c) && c.url.indexOf("courseTableForStd.action") !== -1 && c.query.get("method") === "courseTable"
		},
		{
			site: "weixin",
			page: "fast-login",
			register: register$17,
			test: (c) => c.host === "open.weixin.qq.com" && c.url.indexOf("nxu.edu") !== -1
		},
		{
			site: "ids",
			page: "login",
			register: register$20,
			test: (c) => c.host === "ids.nxu.edu.cn" && c.path.indexOf("/authserver/login") !== -1
		},
		{
			site: "ids",
			page: "re-auth",
			register: register$19,
			test: (c) => c.host === "ids.nxu.edu.cn" && c.url.indexOf("/authserver/reAuthCheck/") !== -1
		},
		{
			site: "ids",
			page: "callback",
			register: register$18,
			test: (c) => c.host === "ids.nxu.edu.cn" && (c.path === "/authserver/callback" || c.url.indexOf(`/${WEBVPN_HOST_TOKENS["open.weixin.qq.com"]}/connect/qrconnect`) !== -1)
		},
		{
			site: "ids",
			page: "login",
			register: register$20,
			test: isWebVpnIdsLoginRoute
		},
		{
			site: "ids",
			page: "re-auth",
			register: register$19,
			test: isWebVpnIdsReAuthRoute
		},
		{
			site: "ids",
			page: "callback",
			register: register$18,
			test: (c) => c.isWebvpn && isWebVpnRealHost(c.vpnContext, "open.weixin.qq.com")
		},
		{
			site: "webvpn",
			page: "home",
			register: register$10,
			test: (c) => c.isWebvpnHost && (c.url === "https://webvpn.nxu.edu.cn/" || c.path === "/")
		},
		...LIBRARY_READER_PLATFORMS.map(({ id }) => ({
			site: id,
			page: "reader",
			register: readerRegistrations.get(id) || createLibraryReaderRegistration(id),
			test: (c) => resolveLibraryReader(c)?.id === id
		})),
		{
			site: "webvpn",
			page: "tools",
			register: register$6,
			test: (c) => isWebVpnToolsRoute(c, document.body?.innerHTML || "")
		},
		{
			site: "webvpn",
			page: "failed",
			register: register$7,
			test: (c) => isWebVpnFailedRoute(c, document.body?.innerHTML || "")
		},
		{
			site: "sysaq",
			page: "login",
			register: register$5,
			test: (c) => c.isWebvpn && isWebVpnRealHost(c.vpnContext, "sysaq.nxu.edu.cn") && (c.vpnContext?.realPath || "") === "/lab-platform/"
		},
		{
			site: "sysaq",
			page: "auth",
			register: register$4,
			test: (c) => c.isWebvpn && isWebVpnRealHost(c.vpnContext, "sysaq.nxu.edu.cn") && (c.vpnContext?.realPath || "").indexOf("/lab-platform/login") !== -1
		},
		{
			site: "portal",
			page: "hall",
			register: register$1,
			test: (c) => c.isWebvpn && isWebVpnRealHost(c.vpnContext, "portal.nxu.edu.cn")
		},
		{
			site: "sysaq",
			page: "login",
			register: register$5,
			test: (c) => c.host === "sysaq.nxu.edu.cn" && c.path === "/lab-platform/"
		},
		{
			site: "sysaq",
			page: "auth",
			register: register$4,
			test: (c) => c.host === "sysaq.nxu.edu.cn" && c.path.indexOf("/lab-platform/login") !== -1
		},
		{
			site: "pingjiao",
			page: "notify",
			register: register$3,
			test: (c) => c.host === "jsfzyjxzlxt.nxu.edu.cn" && c.path === "/quality/student/evaluate/item_tasks"
		},
		{
			site: "pingjiao",
			page: "notify",
			register: register$3,
			test: (c) => c.host === "jsfzyjxzlxt.nxu.edu.cn" && c.path === "/quality/student/evaluate/item_tasks_text"
		},
		{
			site: "portal",
			page: "hall",
			register: register$1,
			test: (c) => c.host === "portal.nxu.edu.cn"
		},
		{
			site: "tuanwei",
			page: "download",
			register: register$2,
			test: isTuanweiDownloadRoute
		}
	];
	function resolveRoute() {
		const ctx = getContext();
		console$2("开始识别当前页面", {
			host: ctx.host,
			path: ctx.path,
			isWebvpn: ctx.isWebvpn
		}, "debug");
		for (const entry of JUDGE_TABLE) try {
			if (entry.test(ctx)) {
				console$2(`命中 ${entry.site}/${entry.page}`);
				return entry.register;
			}
		} catch (error) {
			console$2(`${entry.site}/${entry.page} 判定异常`, error, "warn");
		}
		console$2("未命中任何路由（当前页面 2.0 暂不处理）", {
			host: ctx.host,
			path: ctx.path
		}, "info");
		return null;
	}
	var console$1 = MyConsole("[初始化]");
	console$1("Better NXU 开始运行");
	initContext();
	var register = resolveRoute();
	if (typeof register === "function") try {
		await(register());
	} catch (error) {
		console$1("页面注册执行异常", error, "error");
	}
})(Vue);
