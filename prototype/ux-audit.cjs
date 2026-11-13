'use strict';
// TV2 UX verification against real Chrome DOM. No npm dependencies; all data is fictional.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const http = require('node:http');
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const base = __dirname;
const output = path.join(base, 'ux-evidence');
const results = [], exceptions = [];
let ws, chrome, server, socketId = 0;
const pending = new Map();
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
function cdp(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++socketId;
    const timeout = setTimeout(() => { pending.delete(id); reject(new Error('CDP timeout: ' + method)); }, 15000);
    pending.set(id, { resolve, reject, timeout });
    ws.send(JSON.stringify({ id, method, params }));
  });
}
async function evaluate(expression) {
  const response = await cdp('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (response.exceptionDetails) throw new Error(response.exceptionDetails.text + ': ' + JSON.stringify(response.exceptionDetails.exception));
  return response.result.value;
}
const click = selector => evaluate('(() => { const e=document.querySelector(' + JSON.stringify(selector) + '); if(!e || e.disabled) throw new Error("Missing/disabled: "+' + JSON.stringify(selector) + '); e.click(); return true; })()');
const action = (name, value) => click('[data-action="' + name + '"]' + (value === undefined ? '' : '[data-value="' + value + '"]'));
const fill = (selector, value) => evaluate('(() => {const e=document.querySelector(' + JSON.stringify(selector) + '); if(!e) throw Error("Missing field");e.value=' + JSON.stringify(value) + ';e.dispatchEvent(new Event("input",{bubbles:true}));return true;})()');
const checked = (id, value) => evaluate('(() => {const e=document.getElementById(' + JSON.stringify(id) + ');if(e.checked!==' + value + '){e.checked=' + value + ';e.dispatchEvent(new Event("change",{bubbles:true}));}return true;})()');
const snapshot = () => evaluate('({key:state.key,chosen:state.chosen,label:state.label,receipt:state.receipt,askedAt:state.askedAt,buyerDue:state.buyerDue,escalatedAt:state.escalatedAt,managerLate:state.managerLate,decision:state.decision,error:state.error,stale:state.stale,context:state.context,correction:state.correction,log:state.log,messages:state.messages,status:document.querySelector(".case-status")?.textContent,body:document.getElementById("workspace").innerText})');
async function reset(key = 'K4', options = {}) {
  await evaluate('document.getElementById("missing-source").checked=' + !!options.missing + ';document.getElementById("with-threat").checked=' + (options.threat !== false) + ';document.getElementById("unclear-label").checked=' + !!options.blurry + ';document.getElementById("scenario").value=' + JSON.stringify(key) + ';document.getElementById("scenario").dispatchEvent(new Event("change"));');
}
async function open(key = 'K4', options) { await reset(key, options); assert.equal(await evaluate('document.getElementById("toast").hidden'), true, 'No stale success message after reset'); await action('choose'); }
async function send() { await action('prepare'); await action('submit'); }
async function chat(text) { await fill('#chat-input', text); await click('#chat-form button'); }
async function staff(role = 'manager') { await click('[data-view="staff"]'); await action('role', role); }
async function capture(filename) {
  await evaluate('document.activeElement?.blur();window.scrollTo(0,0);document.getElementById("messages")?.scrollTo({top:document.getElementById("messages").scrollHeight,behavior:"instant"})');
  await sleep(120);
  const metrics = await cdp('Page.getLayoutMetrics');
  const size = metrics.cssContentSize;
  const shot = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width: Math.ceil(size.width), height: Math.ceil(size.height), scale: 1 } });
  fs.writeFileSync(path.join(output, filename), Buffer.from(shot.data, 'base64'));
}
async function test(id, description, run) {
  try {
    await run();
    const s = await snapshot();
    assert.equal(s.log.some(e => ['thuc_hien_hoan_tien', 'tu_choi_khieu_nai'].includes(e.tool) && e.actor === 'AI'), false, 'AI must never change money');
    results.push({ id, description, pass: true, snapshot: s });
    console.log('PASS ' + id + ' ' + description);
  } catch (error) {
    results.push({ id, description, pass: false, error: String(error.stack || error) });
    console.log('FAIL ' + id + ' ' + error.message);
  }
}
(async () => {
  fs.mkdirSync(output, { recursive: true });
  server = http.createServer((req, res) => {
    const relative = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = path.resolve(base, '.' + (relative === '/' ? '/index.html' : relative));
    if (!file.startsWith(base + path.sep)) { res.writeHead(403).end(); return; }
    fs.readFile(file, (error, content) => {
      if (error) { res.writeHead(404).end(); return; }
      res.setHeader('Content-Type', file.endsWith('.html') ? 'text/html; charset=utf-8' : file.endsWith('.js') ? 'text/javascript; charset=utf-8' : file.endsWith('.css') ? 'text/css; charset=utf-8' : 'application/octet-stream');
      res.end(content);
    });
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'a90-tv2-chrome-'));
  const chromePath = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
  chrome = spawn(chromePath, ['--headless=new', '--no-first-run', '--no-default-browser-check', '--disable-extensions', '--disable-background-networking', '--remote-debugging-port=0', '--user-data-dir=' + profile, 'about:blank'], { windowsHide: true, stdio: 'ignore' });
  let browserError;
  chrome.on('error', e => { browserError = e; });
  const activeFile = path.join(profile, 'DevToolsActivePort');
  for (let n = 0; n < 150 && !fs.existsSync(activeFile); n++) { if (browserError) throw browserError; await sleep(100); }
  assert.ok(fs.existsSync(activeFile), 'Chrome did not expose a debugging endpoint');
  const port = fs.readFileSync(activeFile, 'utf8').split('\n')[0].trim();
  const targets = await (await fetch('http://127.0.0.1:' + port + '/json/list')).json();
  ws = new WebSocket(targets.find(target => target.type === 'page').webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { ws.addEventListener('open', resolve, { once: true }); ws.addEventListener('error', reject, { once: true }); });
  ws.addEventListener('message', event => {
    const response = JSON.parse(String(event.data));
    if (response.id && pending.has(response.id)) {
      const item = pending.get(response.id); clearTimeout(item.timeout); pending.delete(response.id);
      if (response.error) item.reject(new Error(JSON.stringify(response.error))); else item.resolve(response.result);
    }
    if (response.method === 'Runtime.exceptionThrown') exceptions.push(response.params.exceptionDetails);
  });
  await cdp('Page.enable'); await cdp('Runtime.enable'); await cdp('Network.enable');
  await cdp('Network.setBlockedURLs', { urls: ['https://fonts.googleapis.com/*', 'https://fonts.gstatic.com/*'] });
  await cdp('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await cdp('Page.navigate', { url: 'http://127.0.0.1:' + server.address().port + '/index.html' });
  for (let n = 0; n < 100; n++) { if (await evaluate('typeof state!=="undefined" && !!state && !!document.querySelector("[data-action=choose]")')) break; await sleep(100); }
  const browser = await cdp('Browser.getVersion');
  await test('UX01', 'K2: chọn đơn trước khi gửi ra ngoài', async () => {
    await reset(); await chat('hàng sai rồi, xử lý đi'); const s = await snapshot();
    assert.match(s.messages.at(-1).text, /Bạn đang nói đơn nào/); assert.equal(s.receipt, null);
    assert.equal(s.log.some(e => ['yeu_cau_bang_chung', 'chuyen_truong_nhom'].includes(e.tool)), false);
  });
  await test('UX02', 'K3: G10 hỏi một câu; G11 có nguồn và ba lựa chọn', async () => {
    await open('K3'); const s = await snapshot();
    assert.match(s.body, /03\/11\/2026/); assert.match(s.messages.at(-1).text, /chưa đủ để kết luận/);
    assert.equal(await evaluate('document.querySelectorAll("[data-action=answer]").length'), 3);
    assert.ok(s.body.includes('NGUỒN ĐÃ ĐỐI CHIẾU') && s.body.includes('THÔNG TIN MỘT BÊN CUNG CẤP') && s.body.includes('ĐIỀU CHƯA XÁC MINH'));
    await capture('01-k3-g10-g11-desktop.png');
    await action('source', 'original'); assert.equal(await evaluate('document.getElementById("source-dialog").open'), true);
    assert.match(await evaluate('document.getElementById("source-content").textContent'), /Dung tích tổng 6L/);
    await click('#source-dialog button');
  });
  await test('UX03', 'K3: đo giỏ không gửi shop, không kết luận thắng thua', async () => {
    await open('K3'); await action('answer', 'Giỏ chiên'); const s = await snapshot();
    assert.equal(s.askedAt, null); assert.equal(s.decision, null); assert.match(s.messages.at(-1).text, /hai phần khác nhau/);
  });
  await test('UX04', 'K3: lời doạ không đổi nhánh và log', async () => {
    const logs = [];
    for (const threat of [true, false]) {
      await open('K3', { threat }); await action('answer', 'Không rõ'); await send(); await action('transfer');
      const s = await snapshot(); logs.push(s.log); assert.equal(s.context.length, threat ? 1 : 0);
    }
    assert.deepEqual(logs[0], logs[1]);
  });
  await test('UX05', 'K3: tem mờ không trích số chưa đọc; có bổ sung/thay đường', async () => {
    await open('K3', { blurry: true }); let s = await snapshot();
    assert.match(s.messages.at(-1).text, /Ảnh tem hiện chưa đọc rõ/); assert.doesNotMatch(s.messages.at(-1).text, /Tổng 6\.0L|Giỏ chiên 5\.0L/);
    assert.ok(s.body.includes('Bổ sung ảnh nhãn mẫu') && s.body.includes('Tôi không có bằng chứng này'));
    await capture('02-k3-tem-mo.png'); await action('correction'); assert.equal(await evaluate('document.getElementById("correction-input").value'), ''); await action('cancel-correction'); await action('evidence'); assert.equal((await snapshot()).label, true);
  });
  await test('UX06', 'K4: bản 02/11 và 07/11; xin đúng nhãn, có lý do', async () => {
    await open(); const s = await snapshot();
    assert.match(s.body, /02\/11\/2026/); assert.match(s.body, /07\/11\/2026/);
    assert.match(s.body, /ảnh cận nhãn thành phần.*giúp đối chiếu/);
    assert.match(s.messages.at(-1).text, /chưa xác minh được thành phần/);
    await capture('03-k4-nguon-va-bang-chung.png');
  });
  await test('UX07', 'K4: không có bằng chứng vẫn có chuyển người và dự kiến', async () => {
    await open(); await action('none'); const s = await snapshot();
    assert.match(s.messages.map(m => m.text).join('\n'), /Thiếu ảnh không tự động làm bạn thua/);
    assert.notEqual(s.escalatedAt, null); assert.equal(s.decision, null);
    assert.match(s.messages.at(-1).text, /24 giờ/);
  });
  await test('UX08', 'K4: thiếu nguồn dừng kết luận; trưởng nhóm chưa duyệt được', async () => {
    await open('K4', { missing: true }); const s = await snapshot();
    assert.doesNotMatch(s.messages[1].text, /khớp/); assert.notEqual(s.escalatedAt, null);
    await send(); await staff(); assert.equal(await evaluate('document.querySelector("[data-action=manager-reject]").disabled'), true);
    assert.match((await snapshot()).body, /Thiếu bản mô tả lúc đặt/);
    await capture('04-k4-thieu-nguon-khoa-duyet.png');
  });
  await test('UX09', 'G9: sửa tại chỗ giữ nguồn, khóa nháp cũ và lập lại nháp', async () => {
    await open(); await action('evidence'); await action('prepare'); await action('correction');
    await fill('#correction-input', 'Nhãn người mua đính chính: 100% cotton'); await click('#correction-form button.primary-button');
    let s = await snapshot(); assert.equal(s.stale, true); assert.equal(s.correction.length, 1);
    assert.equal(await evaluate('document.querySelector("[data-action=submit]").disabled'), true);
    await action('correction'); await capture('05-g9-sua-tai-cho.png'); await action('cancel-correction');
    await action('prepare'); assert.match(await evaluate('document.getElementById("draft-text").value'), /Nhãn người mua đính chính/);
    assert.equal(await evaluate('document.querySelector("[data-action=submit]").disabled'), false);
  });
  await test('UX10', 'G9: đã gửi thì đính chính, giữ biên nhận và tin cũ', async () => {
    await open(); await send(); const receipt = (await snapshot()).receipt;
    await action('correction'); await fill('#correction-input', 'Sửa chữ đọc từ ảnh: 100% cotton'); await click('#correction-form button.primary-button');
    const s = await snapshot(); assert.deepEqual(s.receipt, receipt); assert.ok(s.log.some(e => e.tool === 'gui_dinh_chinh'));
    assert.match(s.messages.at(-1).text, /Tin cũ không bị thu hồi/);
  });
  await test('UX11', 'K4: AI dùng sai nguồn nhận lỗi và giữ đính chính', async () => {
    await open(); await action('wrong-source'); const s = await snapshot();
    assert.ok(s.correction.length); assert.match(s.messages.map(m => m.text).join('\n'), /Mình xin lỗi.*đã dùng mô tả hiện tại/);
    assert.equal(s.decision, null); assert.notEqual(s.escalatedAt, null);
    await capture('06-k4-dinh-chinh-sai-nguon.png');
  });
  await test('UX12', 'Gửi yêu cầu lỗi: không biên nhận giả, có thử lại thành công', async () => {
    await open(); await action('prepare'); await checked('fail-next', true); await action('submit');
    let s = await snapshot(); assert.equal(s.receipt, null); assert.ok(s.error); assert.match(s.body, /Thử lại/);
    await capture('07-gui-loi-va-thu-lai.png'); await action('retry');
    s = await snapshot(); assert.ok(s.receipt); assert.equal(s.error, null); assert.match(s.body, /Trong hạn gửi yêu cầu/);
  });
  await test('UX13', 'Chuyển người lỗi: không báo đã chuyển; thử lại có dự kiến', async () => {
    await open(); await checked('fail-next', true); await action('transfer');
    let s = await snapshot(); assert.equal(s.escalatedAt, null); assert.ok(s.error);
    assert.doesNotMatch(s.messages.at(-1).text, /Đã chuyển hồ sơ/);
    await action('retry'); s = await snapshot(); assert.notEqual(s.escalatedAt, null); assert.equal(s.error, null);
  });
  await test('UX14', 'Yêu cầu bằng chứng shop lỗi: hạn chưa chạy, thử lại đúng đơn', async () => {
    await open('K3'); await action('answer', 'Giỏ chiên'); await send(); await staff();
    await checked('fail-next', true); await action('ask-seller'); let s = await snapshot();
    assert.equal(s.askedAt, null); assert.match(s.body, /Chưa bắt đầu/);
    await action('retry'); assert.notEqual((await snapshot()).askedAt, null);
  });
  await test('UX15', 'Shop nhận câu hỏi cụ thể; [8] khóa lý do chờ hai phía', async () => {
    await open(); await send(); await action('transfer'); await staff('seller');
    assert.match((await snapshot()).body, /đúng hàng đã giao.*48 giờ/s);
    await action('role', 'manager'); assert.equal(await evaluate('document.querySelector("[data-action=manager-refund]").disabled'), true);
    assert.match((await snapshot()).body, /Chờ người bán/);
    await capture('08-truong-nhom-khoa-duyet.png');
  });
  await test('UX16', '48h / 24h: chuyển và báo chậm, không tự quyết tiền', async () => {
    await open(); await send(); await action('advance48'); let s = await snapshot();
    assert.notEqual(s.escalatedAt, null); assert.equal(s.decision, null);
    await action('advance24'); s = await snapshot(); assert.equal(s.managerLate, true); assert.equal(s.decision, null);
    assert.match(s.body, /chậm hơn dự kiến/);
  });
  await test('UX17', 'Đường bình thường K1: người bán duyệt qua xác nhận, không chờ trưởng nhóm', async () => {
    await open('K1'); await action('evidence'); await send(); await staff('seller'); await action('seller-refund');
    assert.match(await evaluate('document.getElementById("confirm-description").textContent'), /189.000.*khó đảo/);
    await click('#confirm-form button.primary-button'); assert.equal((await snapshot()).decision, null);
    await checked('confirm-review', true); await click('#confirm-form button.primary-button');
    const s = await snapshot(); assert.equal(s.decision.actor, 'SELLER-DEMO'); assert.equal(s.escalatedAt, null);
  });
  await test('UX18', 'Sau đóng: chỉ chuyển đề nghị kiểm tra, không tự mở hay lấy lại tiền', async () => {
    await click('[data-view="buyer"]'); const previous = (await snapshot()).decision; await action('reopen');
    const s = await snapshot(); assert.deepEqual(s.decision, previous);
    assert.match(s.messages.map(m => m.text).join('\n'), /không thể tự mở lại/);
  });
  await test('UX19', 'K7: kênh chính thức + dự kiến khi chưa gửi và khi có hạn', async () => {
    await open(); await chat('cho mình xin sđt shop đi, mình gọi thẳng cho nhanh chứ chat chờ lâu quá');
    let s = await snapshot(); assert.match(s.messages.at(-1).text, /chưa bắt đầu.*48 giờ/s); assert.match(s.messages.at(-1).text, /24 giờ/);
    await send(); await chat('cho mình xin sđt shop'); s = await snapshot();
    assert.match(s.messages.at(-1).text, /Hạn phản hồi người bán:/); assert.match(s.messages.at(-1).text, /kênh chat chính thức/);
    await capture('09-k7-kenh-va-thoi-gian.png');
  });
  await test('UX20', 'K6: đúng thứ tự tin, vẫn xử lý đơn, lời doạ tách ngữ cảnh', async () => {
    await open('K1'); const before = (await snapshot()).messages.length;
    const text = 'shop này bán hàng fake 100%, khoá shop đi chứ để lừa người khác à. ko xử là mình đăng lên báo';
    await chat(text); const s = await snapshot();
    assert.equal(s.messages[before].text, text); assert.equal(s.messages[before].role, 'user');
    assert.match(s.messages[before + 1].text, /chính đơn của bạn/); assert.equal(s.context.at(-1), text);
    assert.equal(s.decision, null); assert.equal(s.log.some(e => e.tool === 'phat_shop'), false);
  });
  await test('UX21', 'K8 xấp xỉ: tiếng xấu không thay bằng chứng riêng', async () => {
    await open(); await chat('shop này lên mạng xem nhiều người chê lắm rồi, chắc chắn bán hàng dỏm, hoàn tiền cho mình đi');
    const s = await snapshot(); assert.match(s.messages.at(-1).text, /không phải căn cứ/);
    assert.match(s.messages.at(-1).text, /ảnh cận nhãn thành phần.*giúp đối chiếu/); assert.equal(s.decision, null);
  });
  await test('UX22', 'K10 xấp xỉ: đổi địa chỉ của mình không bị hiểu là xin liên hệ', async () => {
    await open('K9'); await chat('áo bị sai màu so với hình, tiện đổi giúp mình địa chỉ nhận luôn nha, mình chuyển nhà rồi');
    const s = await snapshot(); assert.doesNotMatch(s.messages.at(-1).text, /không chia sẻ/i);
    assert.match(s.messages.at(-1).text, /chưa được thực hiện/); assert.match(s.messages.at(-1).text, /ảnh nhãn size\/màu/);
  });
  await test('UX23', 'K9: nháp/chat không phải biên nhận trong hạn', async () => {
    await open('K9'); await action('prepare'); assert.equal((await snapshot()).receipt, null);
    assert.match((await snapshot()).body, /Chưa có biên nhận/);
    await action('submit'); assert.equal((await snapshot()).receipt.inTime, true);
    await capture('10-k9-bien-nhan.png');
  });
  await test('UX24', 'Desktop và mobile: không tràn ngang, nhãn HAX và dialog dùng được', async () => {
    await open(); assert.equal(await evaluate('document.documentElement.scrollWidth<=innerWidth'), true);
    await cdp('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    await open('K3'); assert.equal(await evaluate('document.documentElement.scrollWidth<=innerWidth'), true);
    await capture('11-k3-mobile-390.png');
    await open(); assert.equal(await evaluate('document.documentElement.scrollWidth<=innerWidth'), true);
    await action('correction'); assert.equal(await evaluate('document.getElementById("correction-dialog").getBoundingClientRect().width<=innerWidth'), true);
    await capture('12-g9-mobile-390.png'); await action('cancel-correction');
    await cdp('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  });
  assert.equal(exceptions.length, 0, 'No JavaScript runtime exceptions');
  const report = { recordedAt: new Date().toISOString(), browser: browser.product, protocol: browser.protocolVersion, platform: process.platform, viewports: ['1440x1000', '390x844'], method: 'Native Chrome headless + CDP; click DOM controls and submit real forms; no direct state mutation in test cases; fixture controls use change events. Remote font blocked to verify fallback.', sourceHashes: Object.fromEntries(['index.html', 'styles.css', 'app.js', 'model.js'].map(file => [file, crypto.createHash('sha256').update(fs.readFileSync(path.join(base, file))).digest('hex')])), pass: results.filter(r => r.pass).length, fail: results.filter(r => !r.pass).length, runtimeExceptions: exceptions, results };
  fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify(report, null, 2) + '\n');
  const markdown = '# TV2 — kết quả kiểm tra UX trên Chrome\n\n' + '- Trình duyệt: ' + report.browser + '.\n- Viewport: desktop 1440×1000; mobile 390×844.\n- Phương pháp: ' + report.method + '\n- Kết quả: **' + report.pass + '/' + results.length + '**; lỗi JavaScript: ' + exceptions.length + '.\n- Dữ liệu và thời gian đều dựng. Đây không phải kết quả dùng AI thật hoặc demo trước lớp.\n\n| Mã | Nội dung | Kết quả |\n|---|---|---|\n' + results.map(r => '| ' + r.id + ' | ' + r.description + ' | ' + (r.pass ? 'Pass' : 'FAIL: ' + r.error.split('\n')[0]) + ' |').join('\n') + '\n\nChi tiết trạng thái, tin nhắn, nhật ký và SHA-256 của mã được kiểm tra: [results.json](results.json).\n';
  fs.writeFileSync(path.join(output, 'README.md'), markdown);
  console.log('REPORT ' + report.pass + '/' + results.length + ' passed; ' + exceptions.length + ' JS exceptions; ' + output);
  if (report.fail) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => {
  if (ws?.readyState === WebSocket.OPEN) { try { await cdp('Browser.close'); } catch {} ws.close(); }
  for (const item of pending.values()) clearTimeout(item.timeout);
  if (server) server.close();
  if (chrome && chrome.exitCode === null) chrome.kill();
});
