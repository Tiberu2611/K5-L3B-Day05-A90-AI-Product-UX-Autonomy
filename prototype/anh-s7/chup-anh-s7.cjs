/*
 * TV1 · §7 — chạy lại K1–K10, các nút ở §3.7, quyền duyệt và ca lạ trên prototype hiện tại.
 * Ghi ảnh (anh-XX-*.png) và nhật ký (ket-qua-s7.txt) vào chính thư mục này.
 *
 * Cách chạy (cần Playwright + Chromium):  node prototype/anh-s7/chup-anh-s7.cjs
 * Ảnh desktop 1360px bỏ giới hạn chiều cao khung chat để thấy đủ hội thoại; ảnh mobile 390px giữ nguyên CSS.
 * Ảnh chụp ở deviceScaleFactor 2, sau đó nén bằng Pillow (128 màu, không dither) để repo nhẹ:
 *   python3 -c "import glob;from PIL import Image;[Image.open(f).convert('RGB').quantize(128,dither=0).save(f,optimize=True) for f in glob.glob('prototype/anh-s7/anh-*.png')]"
 * Đồng hồ demo của prototype cố định 15:00 13/11/2026, nên kết quả không phụ thuộc giờ chạy.
 */
'use strict';
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const OUT = __dirname;
const URL = 'file://' + path.resolve(__dirname, '..', 'index.html');
const lines = [];
const out = s => { lines.push(s); console.log(s); };
let n = 0;

(async () => {
  for (const f of fs.readdirSync(OUT)) if (/^anh-\d+.*\.png$/.test(f)) fs.unlinkSync(path.join(OUT, f));
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1360, height: 900 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', e => errors.push(e.message));
  await p.goto(URL);
  await p.addStyleTag({ content: '.messages,.conversation .messages{height:auto!important;max-height:none!important;overflow:visible!important}' });

  const act = (a, v) => p.click(v ? `button[data-action="${a}"][data-value="${v}"]` : `button[data-action="${a}"]`);
  const view = v => p.click(`button[data-view="${v}"]`);
  const chat = async t => { await p.fill('#chat-input', t); await p.press('#chat-input', 'Enter'); };
  async function start(key, variant, opts) {
    opts = opts || {};
    await p.selectOption('#scenario', key);
    if (variant) await p.selectOption('#variant', variant);
    const threat = opts.threat !== false;
    if ((await p.isChecked('#with-threat')) !== threat) await p.click('#with-threat');
  }
  async function shot(slug) {
    n += 1;
    const file = 'anh-' + String(n).padStart(2, '0') + '-' + slug + '.png';
    await p.evaluate(() => { const t = document.getElementById('toast'); if (t) t.hidden = true; });
    await p.screenshot({ path: path.join(OUT, file), fullPage: true });
    out('  → Ảnh ' + n + ': ' + file);
    return n;
  }
  async function dump(title) {
    const s = await p.evaluate(() => ({
      id: state.fixture.id, variant: state.variant, type: state.type, context: state.context,
      msgs: state.messages.map(m => ({ role: m.role, text: m.text })),
      log: state.log.map(l => l.tool + '·' + l.actor),
      status: document.querySelector('.case-status, .status-chip') ? document.querySelector('.case-status, .status-chip').textContent.trim() : '',
      buttons: [...document.querySelectorAll('#workspace button')].map(b => b.textContent.trim() + (b.disabled ? ' (khoá)' : '')),
      locks: [...document.querySelectorAll('.lock-reason')].map(x => x.textContent.trim()),
      deadlines: [...document.querySelectorAll('.deadline-row')].map(r => r.innerText.replace(/\s*\n\s*/g, ' · '))
    }));
    out('\n===== ' + title + ' =====');
    out('  Đơn: ' + s.id + ' · biến thể: ' + s.variant + ' · loai_ca: ' + s.type + ' · trạng thái [2]: ' + s.status);
    s.msgs.forEach((m, i) => out('  ' + (i + 1) + '. [' + ({ user: 'Người mua', assistant: 'AI', system: 'Hệ thống' }[m.role]) + '] ' + m.text.replace(/\n+/g, ' ⏎ ')));
    out('  Nhật ký tool: ' + s.log.join(', '));
    out('  Ngữ cảnh (không phải căn cứ): ' + (s.context.length ? JSON.stringify(s.context) : '(trống)'));
    out('  Nút: ' + [...new Set(s.buttons)].join(' | '));
    if (s.locks.length) out('  Lý do khoá [8]: ' + s.locks.join(' / '));
    out('  [7]: ' + s.deadlines.join(' || '));
    return s;
  }
  const ai = s => s.msgs.filter(m => m.role !== 'user').map(m => m.text);

  out('Prototype: prototype/index.html · đồng hồ demo bắt đầu 15:00 13/11/2026 (giờ Việt Nam)');

  // ---------- 7.1 · K1–K10 ----------
  await start('K1'); await act('choose'); await act('evidence'); await act('prepare'); await act('submit');
  await dump('K1 · người mua: chọn đơn → ảnh nhãn → nháp → tự gửi'); await shot('k1-nguoi-mua-gui-yeu-cau');
  await view('staff'); await act('seller-refund'); await shot('k1-nguoi-ban-hop-xac-nhan');
  await p.check('#confirm-review'); await p.click('#confirm-form button.primary-button');
  await dump('K1 · người bán đồng ý trả hàng – hoàn tiền'); await view('buyer');

  await p.selectOption('#scenario', 'K3'); await act('no-order');
  await dump('K2 · "hàng sai rồi, xử lý đi" khi chưa chọn đơn'); await shot('k2-chua-chon-don');

  await start('K3', 'default'); await act('choose'); await shot('k3-tem-ro-co-loi-doa');
  await act('answer', 'Giỏ chiên'); const k3a = await dump('K3 · tem rõ · có lời doạ · chọn Giỏ chiên'); await shot('k3-chon-gio-chien');
  await start('K3', 'default', { threat: false }); await act('choose'); await act('answer', 'Giỏ chiên');
  const k3b = await dump('K3 · tem rõ · KHÔNG lời doạ · chọn Giỏ chiên'); await shot('k3-khong-loi-doa');
  const aiA = ai(k3a), aiB = ai(k3b);
  out('  So sánh có/không lời doạ: câu AI giống hệt = ' + (JSON.stringify(aiA) === JSON.stringify(aiB)) + ' · nhật ký tool giống hệt = ' + (JSON.stringify(k3a.log) === JSON.stringify(k3b.log)));
  await start('K3', 'default');

  await start('K3', 'anh_tem_mo'); await act('choose'); await dump('K3 · anh_tem_mo'); await shot('k3-anh-tem-mo');
  await start('K4', 'default'); await act('choose'); await dump('K4 · chưa có nhãn'); await shot('k4-chua-co-nhan');
  await start('K4', 'co_anh_nhan'); await act('choose'); await act('prepare'); await act('submit');
  await dump('K4 · co_anh_nhan → nháp → tự gửi'); await shot('k4-co-anh-nhan-gui');
  await start('K4', 'thieu_ban_luc_dat'); await act('choose'); const k4c = await dump('K4 · thieu_ban_luc_dat');
  out('  Có chữ "khớp" trong câu AI: ' + ai(k4c).some(t => /khớp/i.test(t))); await shot('k4-thieu-ban-luc-dat');
  await start('K5'); await act('choose'); await dump('K5 · đã gửi 2 ảnh toàn cảnh'); await shot('k5-chi-xin-mon-thieu');
  await start('K6'); await act('choose'); await dump('K6 · nghi hàng giả, đòi khoá shop, doạ đăng báo'); await shot('k6-nghi-hang-gia');
  await start('K7'); await act('choose'); await dump('K7 · xin số điện thoại shop'); await shot('k7-xin-sdt');
  await start('K8'); await act('choose'); await dump('K8 · lịch sử shop, chưa có bằng chứng'); await shot('k8-lich-su-shop');
  await start('K9', 'co_bien_nhan'); await act('choose'); await dump('K9 · có biên nhận 11/11'); await shot('k9-co-bien-nhan');
  await start('K9', 'chua_co_bien_nhan'); await act('choose'); await dump('K9 · chưa có biên nhận'); await shot('k9-chua-co-bien-nhan');
  await start('K10'); await act('choose'); await dump('K10 · sai màu + đổi địa chỉ'); await shot('k10-tach-yeu-cau');

  // ---------- 7.1 · nút ở §3.7 và lỗi thao tác ----------
  await start('K4', 'default'); await act('choose'); await act('none'); await dump('§3.7 · K4 "Tôi không có bằng chứng này"'); await shot('nut-toi-khong-co');
  await start('K3', 'default'); await act('choose'); await act('answer', 'Toàn bộ khoang'); await act('prepare');
  await act('correction'); await p.fill('#correction-input', 'Tổng 6.0L · Giỏ chiên 4.5L'); await p.click('#correction-form button.primary-button');
  await dump('§3.7 · K3 [5] sửa thông tin AI đọc sai sau khi có nháp'); await shot('nut-sua-thong-tin');
  await start('K4', 'default'); await act('choose'); await act('wrong-source'); await dump('§3.7 · K4 Demo AI dùng sai nguồn'); await shot('nut-ai-dung-sai-nguon');
  await start('K3', 'default'); await act('choose'); await act('transfer'); await dump('§3.7 · K3 [6] nhờ nhân viên'); await shot('nut-nho-nhan-vien');
  await start('K1'); await act('choose'); await act('evidence'); await act('prepare'); await p.check('#fail-next'); await act('submit');
  await dump('§3.7 · K1 gửi yêu cầu trả hàng thất bại'); await shot('loi-gui-yeu-cau');
  await act('retry'); await dump('§3.7 · K1 bấm Thử lại');
  await start('K5'); await p.check('#fail-next'); await act('choose'); await dump('§3.7 · K5 gửi yêu cầu bằng chứng thất bại'); await shot('loi-yeu-cau-bang-chung');
  await act('retry'); await dump('§3.7 · K5 bấm Thử lại');
  await start('K4', 'default'); await act('choose'); await p.check('#fail-next'); await act('transfer'); await dump('§3.7 · K4 chuyển nhân viên thất bại'); await shot('loi-chuyen-nhan-vien');
  await act('retry'); await dump('§3.7 · K4 bấm Thử lại');

  // ---------- 7.1 · quyền duyệt và quá hạn ----------
  await start('K4', 'co_anh_nhan'); await act('choose'); await act('prepare'); await act('submit');
  await view('staff'); await dump('Quyền · K4 màn người bán (sau khi người mua gửi)');
  await act('role', 'manager'); await dump('Quyền · K4 trưởng nhóm, hồ sơ chưa chuyển');
  await view('buyer'); await act('transfer'); await view('staff'); await act('role', 'manager');
  await dump('Quyền · K4 trưởng nhóm, đã chuyển, người bán chưa phản hồi'); await shot('quyen-truong-nhom-khoa');
  await act('role', 'seller'); await act('seller-reply'); await act('role', 'manager');
  await dump('Quyền · K4 trưởng nhóm, người bán đã phản hồi');
  await p.fill('#decision-reason', 'Bản lúc đặt 02/11 ghi 100% cotton; nhãn đọc được 65/35; người bán đã phản hồi.');
  await act('manager-refund'); await p.check('#confirm-review'); await p.click('#confirm-form button.primary-button');
  await dump('Quyền · K4 trưởng nhóm duyệt hoàn tiền'); await shot('quyen-truong-nhom-duyet');
  await view('buyer');
  await start('K4', 'co_anh_nhan'); await act('choose'); await act('prepare'); await act('submit'); await act('advance24');
  await view('staff'); await act('role', 'manager');
  await dump('Quá hạn · K4 người bán im lặng, bấm +24h (người bán còn 24 giờ)'); await shot('qua-han-24h-con-khoa');
  await view('buyer'); await act('advance24'); await view('staff'); await act('role', 'manager');
  await dump('Quá hạn · K4 người bán im lặng, bấm +24h lần hai (đủ 48 giờ)'); await shot('qua-han-48h-mo-nut');
  await view('buyer');

  // ---------- 7.2 · ca lạ ----------
  await start('K1'); await act('choose'); await chat('ko xử là mình đăng lên báo'); await dump('Ca lạ · "ko xử là mình đăng lên báo"');
  await start('K1'); await act('choose'); await chat('shop này bán hàng fake 100%, khoá shop đi chứ để lừa người khác à');
  await dump('Ca lạ · gõ tin nghi hàng giả vào chat'); await shot('ca-la-thu-tu-tin');
  await start('K1'); await act('choose'); await chat('tiện đổi giúp mình số điện thoại nhận hàng luôn nha');
  await dump('Ca lạ · đổi số điện thoại nhận hàng của chính mình'); await shot('ca-la-sdt-cua-minh');
  await start('K1'); await act('choose'); await chat('cho mình địa chỉ kho của shop để gửi trả hàng'); await dump('Ca lạ · xin địa chỉ kho để gửi trả');
  await start('K1'); await act('choose'); await chat('mình chưa nhận được hàng mà app báo giao rồi'); await dump('Ca lạ · chưa nhận hàng');

  // ---------- mobile ----------
  const m = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const mp = await m.newPage(); mp.on('pageerror', e => errors.push(e.message));
  await mp.goto(URL); await mp.selectOption('#scenario', 'K3'); await mp.click('button[data-action="choose"]');
  const sw = await mp.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
  out('\n===== Mobile 390px · K3 =====\n  scrollWidth=' + sw.scroll + ' · clientWidth=' + sw.client + ' · tràn ngang: ' + (sw.scroll > sw.client));
  n += 1; const mf = 'anh-' + String(n).padStart(2, '0') + '-mobile-390-k3.png';
  await mp.screenshot({ path: path.join(OUT, mf), fullPage: true }); out('  → Ảnh ' + n + ': ' + mf);

  out('\nLỗi JavaScript: ' + (errors.length ? errors.join(' | ') : 'không có'));
  fs.writeFileSync(path.join(OUT, 'ket-qua-s7.txt'), lines.join('\n') + '\n');
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
