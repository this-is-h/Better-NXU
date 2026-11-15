# 第三方声明

## 打包代码

以下组件的代码随 Better NXU 主脚本分发，统一适用下方的 MIT 许可声明。

| 组件                                  | 版本            | 来源                                                           |
| ------------------------------------- | --------------- | -------------------------------------------------------------- |
| captcha-recognizer-js                 | 1.0.4           | [项目源码](https://github.com/this-is-h/captcha-recognizer-js) |
| captcha-recognizer 的推理与后处理算法 | JavaScript 移植 | [上游项目](https://github.com/chenwei-zhao/captcha-recognizer) |
| Ding                                  | 0.0.6           | [项目源码](https://github.com/YusufCeng1z/ding)                |
| Vant                                  | 4.10.2          | [项目源码](https://github.com/youzan/vant)                     |
| @vant/use                             | 1.6.0           | [项目源码](https://github.com/youzan/vant)                     |
| @vant/popperjs                        | 1.3.0           | [项目源码](https://github.com/youzan/vant)                     |
| @vue/shared                           | 3.5.45          | [项目源码](https://github.com/vuejs/core)                      |

## 外部运行时资源

这些资源通过脚本管理器或匿名后台请求单独加载，不编入主脚本。固定版本、下载地址和完整性摘要分别见 `vite.config.js`、`src/libraries/slider-resources.js` 和 `src/libraries/tesseract-local.js`。各资源保留上游自身的许可声明。

| 资源                               | 版本   |
| ---------------------------------- | ------ |
| Vue                                | 3.5.45 |
| snapdom                            | 3.7.5  |
| SheetJS Community Edition          | 0.20.3 |
| Vant CSS                           | 4.10.2 |
| github-markdown-css                | 5.9.0  |
| marked                             | 18.2.0 |
| DOMPurify                          | 3.4.18 |
| Tesseract.js 与 tesseract.js-core  | 7.0.0  |
| @tesseract.js-data/eng             | 1.0.0  |
| ONNX Runtime Web                   | 1.31.1 |
| captcha-recognizer-js 量化滑块模型 | 1.0.4  |

量化滑块模型源于 captcha-recognizer 的 `slider.onnx`，保留 Zhao Chenwei 的 MIT 许可。Tesseract.js 使用 Apache-2.0；其底层组件的许可随各自上游资源保留。开发工具及传递依赖的准确版本见 `package.json` 和 `pnpm-lock.yaml`，不作为运行时代码分发。

## 合并许可声明

安装脚本为独立分发的代码副本，因此在末尾保留一次以下声明。只用于检查更新的元数据文件不重复附带这段内容。

```text
MIT License

Copyright (c) 2025 this-is-h
Copyright (c) 2026 slider-captcha-gap contributors
Copyright 2024 Zhao Chenwei
Copyright (c) 2026 Yusuf Cengiz
Copyright (c) Youzan
Copyright (c) Chen Jiahan and other contributors
Copyright (c) 2018-present, Yuxi (Evan) You

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
```
