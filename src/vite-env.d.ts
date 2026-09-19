/// <reference types="vite/client" />
/// <reference types="vite-plugin-monkey/client" />
/// <reference types="vite-plugin-monkey/style" />

declare module '#gm' {
  export * from 'vite-plugin-monkey/dist/client';
}

// 2.0 项目类型提示入口。GM API 只通过 #gm 模块取得；未启用 mountGmApi，
// 因此不加载 vite-plugin-monkey/global，避免裸 GM_* 在编辑器中被误判为合法。
// （1.x 单文件无类型声明，2.0 多模块化后引入此声明，仅用于类型，不影响运行时。）
