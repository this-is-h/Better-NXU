// https://eslint.style / flat config。规则目标：拦截真实错误和明显坏味道，
// 不追求风格统一（格式交给 Prettier，见 .prettierrc.json + eslint-config-prettier）。
import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import configPrettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      '*.user.js',
      'src/libraries/**',
      // 本地 ICS 解析参照实现（.gitignore 已忽略），非发布代码
      'schedule/**',
      // 本地验证码参考实现（.gitignore 已忽略），非发布代码
      'captcha/**',
    ],
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  configPrettier,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.userscript,
        // vite-plugin-monkey 注入的全局与测试 setup 中的模拟全局
        GM: 'readonly',
        GM_addElement: 'readonly',
        GM_addStyle: 'readonly',
        GM_download: 'readonly',
        GM_getResourceText: 'readonly',
        GM_getResourceURL: 'readonly',
        GM_getValue: 'readonly',
        GM_setValue: 'readonly',
        GM_deleteValue: 'readonly',
        GM_listValues: 'readonly',
        GM_addValueChangeListener: 'readonly',
        GM_removeValueChangeListener: 'readonly',
        GM_registerMenuCommand: 'readonly',
        GM_unregisterMenuCommand: 'readonly',
        GM_notification: 'readonly',
        GM_xmlhttpRequest: 'readonly',
        GM_setClipboard: 'readonly',
        GM_info: 'readonly',
        unsafeWindow: 'readonly',
      },
    },
    rules: {
      'no-console': 'off',
      'no-var': 'error',
      'prefer-const': 'error',
      eqeqeq: ['error', 'smart'],
    },
  },
  {
    // Node 脚本（校验脚本与测试）允许 console、require 语义全局
    files: ['scripts/**/*.mjs', 'test/**/*.js', 'vite.config.js', 'commitlint.config.js', 'eslint.config.js'],
    languageOptions: {
      globals: { ...globals.node },
    },
    rules: {
      'no-console': 'off',
    },
  },
  {
    files: ['src/sites/webvpn/components/home/*.vue'],
    rules: {
      // icon 是源码内的静态 HTML 字符串（非用户输入/远程数据），v-html 安全。
      'vue/no-v-html': 'off',
    },
  },
  {
    files: ['*.vue'],
    languageOptions: {
      parserOptions: {
        // Vue SFC 内使用 template compiler 解析
        parser: pluginVue.parser,
      },
    },
  },
];
