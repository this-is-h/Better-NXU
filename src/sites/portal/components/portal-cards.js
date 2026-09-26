/**
 * navigation: system 交给门户 window.open（WebVPN 自动转换）；direct 经 GM_openInTab 原样打开。
 * url 可为统一地址，也可为 { campus, webvpn }；两种模式均支持按当前门户环境选址。
 */
const libraryCard = (title, url) => ({
  title,
  navigation: 'system',
  url: { campus: `https://zylib.nxu.edu.cn/-----${url}`, webvpn: url },
});

export const PORTAL_CARDS = [
  {
    title: 'Better NXU - 常用',
    id: 'betternxu-h-main',
    items: [
      { title: '学工系统', url: 'https://xsfw.nxu.edu.cn' },
      { title: '双创平台', url: 'http://202.201.128.142/nxu1' },
      { title: '实验室安全教育平台', url: 'https://sysaq.nxu.edu.cn' },
    ],
  },
  {
    title: 'Better NXU - 教务系统',
    id: 'betternxu-h-jwgl',
    items: [
      { title: '教务系统', url: 'https://jwgl.nxu.edu.cn' },
      ...[8080, 8081, 8082, 8083].map((port, index) => ({
        title: `备用${index + 1}`,
        url: `http://202.201.128.234:${port}`,
      })),
    ],
  },
  {
    title: 'Better NXU - 图书馆',
    id: 'betternxu-h-lib',
    items: [
      { title: '图书馆', url: 'https://zylib.nxu.edu.cn/login' },
      libraryCard('中国知网', 'https://www.cnki.net/'),
      libraryCard('万方数据', 'https://www.wanfangdata.com.cn/'),
      libraryCard('维普资讯', 'https://qikan.cqvip.com/'),
      libraryCard('Web of Science', 'https://www.webofscience.com/wos/alldb/basic-search'),
      { title: 'PubScholar公益学术平台(校外)', navigation: 'direct', url: 'https://pubscholar.cn/' },
    ],
  },
  {
    title: 'Better NXU - H 小工具',
    id: 'betternxu-h-tools',
    items: [
      { title: 'H 小工具', navigation: 'direct', url: 'https://webvpn.nxu.edu.cn/h/tools' },
      { title: '宁夏大学猫狗图鉴', navigation: 'direct', url: 'https://nxu-cdig.thisish.cn/' },
      { title: 'NXU Charge（已废弃）', navigation: 'direct', url: 'https://campus-charge.thisish.cn/' },
    ],
  },
];
