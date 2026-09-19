/**
 * sites/webvpn/components/tools/teacher-search — 在职教师工号查询（XHR 拉分页 XML→JSON）
 * 对应 1.x：Better NXU.user.js 行 4775-4889（webvpnHTools 内部 searchTeachers + xmlToJson/parseElement）
 * 依赖：utils/console（MyConsole）
 * 入口/被谁调用：sites/webvpn/components/tools/ToolsApp.vue（教师查询 tab 的 searchTeacher 循环分页调用）
 *
 * 与 1.x 等价点（C5）：
 *  - xmlToJson/parseElement（行 4776-4815）：DOMParser 解析 XML→JSON（@attributes/数组折叠），逐字迁移。
 *  - searchTeachers（行 4817-4888）：POST webvpn 代理 AutoCompleteServletSrtp（XHR 裸用，page 模型下
 *    页面 XHR 可达，与 1.x 同形）。分页信息从 raw_result.page["#text"] 的 `第N/M页` 提取；无 page 文本
 *    →"webvpn登录已过期"；all_page==0 →"查询不到该教师"；val.length 判断单/多结果。
 *  - 失败/网络错误 reject(new Error(...))，调用方（SFC searchTeacher）catch 兜底。
 *
 * 注：1.x 请求 URL 硬编码 `vpn-12-o1-202.201.128.142=` 尾参，逐字保留（C5 不 rewrite 代理地址）。
 */
import { MyConsole } from '../../../../utils/console.js';

const console = MyConsole('[教师查询]');

/**
 * XML 字符串 → JSON 对象（1.x 行 4776-4815 逐字）。
 * @param {string} xml
 * @returns {object}
 */
function xmlToJson(xml) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xml, 'application/xml');
  if (xmlDoc.querySelector('parsererror')) {
    throw new Error('教师查询接口返回了无效 XML');
  }
  const json = parseElement(xmlDoc.documentElement);
  // return JSON.stringify(json, null, 2);
  return json;
}

/**
 * 递归解析 XML 元素为 JSON（1.x 行 4784-4815 逐字）。
 * @param {Node} element
 * @returns {*}
 */
function parseElement(element) {
  let obj = {};
  if (element.nodeType === 1) {
    // Element
    if (element.attributes.length > 0) {
      obj['@attributes'] = {};
      for (let j = 0; j < element.attributes.length; j++) {
        const attribute = element.attributes.item(j);
        obj['@attributes'][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (element.nodeType === 3) {
    // Text
    obj = element.nodeValue;
  }

  if (element.hasChildNodes()) {
    for (let i = 0; i < element.childNodes.length; i++) {
      const item = element.childNodes.item(i);
      const nodeName = item.nodeName;
      if (typeof obj[nodeName] === 'undefined') {
        obj[nodeName] = parseElement(item);
      } else {
        if (typeof obj[nodeName].push === 'undefined') {
          const old = obj[nodeName];
          obj[nodeName] = [];
          obj[nodeName].push(old);
        }
        obj[nodeName].push(parseElement(item));
      }
    }
  }
  return obj;
}

/**
 * 按姓名分页查询在职教师。对应 1.x searchTeachers（行 4817-4888）。
 * @param {string} name 教师姓名
 * @param {number} [page=1] 页码（从 1 起）
 * @param {{signal?:AbortSignal,timeout?:number}} [options]
 * @returns {Promise<{success:boolean, page?:[number,number], data?:Array, msg?:string}>}
 *   success=true → {page:[now_page, all_page], data:[{name,number,unit}]}；
 *   success=false → {msg}（"webvpn登录已过期"/"教师查询结果格式异常"/"查询不到该教师"）。
 */
export function searchTeachers(name, page = 1, options = {}) {
  return new Promise((resolve, reject) => {
    const data = new URLSearchParams({
      word: String(name || ''),
      index: '0',
      currentPage: String(page),
      sql: 'teacher',
      tea: '1',
      srtp_teacher_project_num: '4',
      planyear: 'null',
      planid: 'undefined',
      university_en_name: 'undefined',
    }).toString();
    console('开始请求分页数据', { page }, 'debug');

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.timeout = Math.max(1000, Number(options.timeout || 15000));
    let settled = false;
    const abortError = () => {
      const error = new Error('教师查询已取消');
      error.name = 'AbortError';
      return error;
    };
    const onAbortSignal = () => xhr.abort();
    const cleanup = () => options.signal?.removeEventListener('abort', onAbortSignal);
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
    options.signal?.addEventListener('abort', onAbortSignal, { once: true });

    xhr.addEventListener('readystatechange', function () {
      if (this.readyState !== this.DONE || settled) return;
      if (options.signal?.aborted) {
        rejectOnce(abortError());
        return;
      }
      if (this.status >= 200 && this.status < 300) {
        try {
          const raw_result = xmlToJson(this.responseText);
          if (!raw_result.page?.['#text']) {
            console('WebVPN 登录状态已失效', { page }, 'warn');
            resolveOnce({ success: false, msg: 'webvpn登录已过期' });
            return;
          }
          const pages = raw_result.page['#text'].match(/第(\d+)\/(\d+)页/);
          if (!pages) {
            console('无法识别分页信息', { page }, 'error');
            resolveOnce({ success: false, msg: '教师查询结果格式异常' });
            return;
          }
          const now_page = Number.parseInt(pages[1], 10);
          const all_page = Number.parseInt(pages[2], 10);
          if (all_page === 0) {
            console('当前关键词没有结果', { page }, 'info');
            resolveOnce({ success: false, msg: '查询不到该教师' });
            return;
          }
          const result = { success: true, page: [now_page, all_page], data: [] };
          const val = raw_result.val;
          const word = raw_result.word;
          const remind = raw_result.remind;
          if (!val || !word || !remind) {
            console('教师查询结果字段缺失', { page }, 'error');
            resolveOnce({ success: false, msg: '教师查询结果格式异常' });
            return;
          }
          const values = Array.isArray(val) ? val : [val];
          const words = Array.isArray(word) ? word : [word];
          const reminders = Array.isArray(remind) ? remind : [remind];
          if (values.length !== words.length || values.length !== reminders.length) {
            resolveOnce({ success: false, msg: '教师查询结果格式异常' });
            return;
          }
          for (let i = 0; i < values.length; i++) {
            const number = String(values[i]?.['#text'] || '');
            const rawName = String(words[i]?.['#text'] || '');
            const unit = String(reminders[i]?.['#text'] || '');
            if (!number || !rawName) {
              resolveOnce({ success: false, msg: '教师查询结果格式异常' });
              return;
            }
            result.data.push({ name: rawName.replace(`${number}-`, ''), number, unit });
          }
          console(
            '分页数据解析完成',
            {
              page: now_page,
              totalPages: all_page,
              resultCount: result.data.length,
            },
            'debug'
          );
          resolveOnce(result);
        } catch (error) {
          console('教师查询结果解析失败', { page, error }, 'error');
          rejectOnce(new Error('教师查询结果解析失败'));
        }
      } else {
        console('接口返回异常状态', { page, status: this.status }, 'error');
        rejectOnce(new Error(`Request failed with status ${this.status}`));
      }
    });

    xhr.addEventListener('error', function () {
      console('请求发生网络错误', { page }, 'error');
      rejectOnce(new Error('Network error'));
    });
    xhr.addEventListener('timeout', function () {
      console('请求超时', { page, timeout: xhr.timeout }, 'warn');
      rejectOnce(new Error('教师查询请求超时'));
    });
    xhr.addEventListener('abort', function () {
      rejectOnce(abortError());
    });

    xhr.open(
      'POST',
      'https://webvpn.nxu.edu.cn/http/77726476706e69737468656265737421a2a713d27560391e2f5ad1e2c90171/StuExpbook/AutoCompleteServletSrtp?vpn-12-o1-202.201.128.142='
    );
    xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');

    try {
      xhr.send(data);
    } catch (err) {
      console('请求发送失败', { page, error: err }, 'error');
      rejectOnce(err);
    }
  });
}
