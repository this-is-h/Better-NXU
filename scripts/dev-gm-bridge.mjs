const apiNames = [
  'GM',
  'GM_info',
  'GM_getValue',
  'GM_setValue',
  'GM_setValues',
  'GM_addElement',
  'GM_addStyle',
  'GM_download',
  'GM_getResourceText',
  'GM_openInTab',
  'GM_setClipboard',
  'unsafeWindow',
];
const assignment = 'document[key] = window;';
const bridge = `document[key] = {
${apiNames.map((name) => `  ${name}: typeof ${name} !== "undefined" ? ${name} : window.${name},`).join('\n')}
  close: () => window.close()
};`;

export function bridgeDevUserscript(source) {
  if (source.split(assignment).length !== 2) {
    throw new Error('vite-plugin-monkey development GM bridge injection point changed');
  }
  return source.replace(assignment, bridge);
}

export function scriptCatDevBridge() {
  return {
    name: 'better-nxu:scriptcat-dev-bridge',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.method !== 'GET' || req.url?.split('?')[0] !== '/__vite-plugin-monkey.install.user.js') {
          next();
          return;
        }
        const end = res.end;
        res.end = function (source, ...args) {
          try {
            source = bridgeDevUserscript(Buffer.isBuffer(source) ? source.toString('utf8') : source);
          } catch (error) {
            res.statusCode = 500;
            res.setHeader('content-type', 'text/plain; charset=utf-8');
            source = error.message;
          }
          return end.call(this, source, ...args);
        };
        next();
      });
    },
  };
}
