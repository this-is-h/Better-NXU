// vite-plugin-monkey's client module reads these globals at module evaluation.
// Production builds resolve #gm through the plugin; this setup only supports Node tests.
globalThis.window = globalThis;
globalThis.document = {};
globalThis.__MONKEY_WINDOW_KEY__ = '__monkeyWindow-node-test';
