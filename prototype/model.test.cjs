'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const T = require('./model.js');
const reason = 'Đã đối chiếu bản lúc đặt và bằng chứng hai bên.';
function opened(key = 'K4', options) { const s = T.create(key, options); T.choose(s); return s; }
function sent(key = 'K4', options) { const s = opened(key, options); T.prepare(s); assert.equal(T.submit(s), true); return s; }

test('C2: no tools with external effects before explicit order choice', () => {
  const s = T.create('K4');
  T.route(s, 'hàng sai rồi, xử lý đi'); T.transfer(s); T.prepare(s); T.submit(s);
  assert.equal(s.receipt, null);
  assert.equal(s.escalatedAt, null);
  assert.equal(s.log.some(e => ['yeu_cau_bang_chung', 'chuyen_truong_nhom'].includes(e.tool)), false);
});
test('K1: draft and chat do not issue a receipt; seller can approve through fast path', () => {
  const s = opened('K1');
  T.evidence(s, false); T.prepare(s);
  assert.equal(s.receipt, null);
  T.route(s, 'mình gửi rồi'); assert.equal(s.receipt, null);
  T.submit(s);
  assert.equal(T.gate(s, 'refund', 'SELLER-DEMO'), '');
  assert.equal(T.decide(s, 'refund', 'SELLER-DEMO', reason, false), false);
  assert.equal(T.decide(s, 'refund', 'SELLER-DEMO', reason, true), true);
  assert.equal(s.escalatedAt, null);
  assert.equal(s.log.at(-1).actor, 'SELLER-DEMO');
  assert.equal(s.log.at(-1).tool, 'thuc_hien_hoan_tien');
  assert.ok(s.log.at(-1).at);
});
test('AI and buyer cannot approve; seller cannot reject', () => {
  const s = sent();
  for (const actor of ['AI', 'BUYER-DEMO']) {
    assert.equal(T.decide(s, 'refund', actor, reason, true), false);
    assert.equal(T.decide(s, 'reject', actor, reason, true), false);
  }
  assert.equal(T.decide(s, 'reject', 'SELLER-DEMO', reason, true), false);
});
test('K3: basket question happens before messaging seller', () => {
  const s = sent('K3');
  assert.equal(s.askedAt, null);
  T.answer(s, 'Giỏ chiên');
  assert.equal(s.askedAt, null);
  assert.equal(s.decision, null);
});
test('K3: whole chamber or unclear answer triggers request only after actual receipt', () => {
  for (const answer of ['Toàn bộ khoang', 'Không rõ']) {
    const s = opened('K3');
    T.answer(s, answer);
    assert.equal(s.askedAt, null);
    T.prepare(s); T.submit(s);
    assert.equal(s.askedAt, s.now);
    assert.equal(s.decision, null);
  }
});
test('K3: threat does not change routing, tool actions or financial outcome', () => {
  const states = [true, false].map(threat => {
    const s = opened('K3', { threat });
    T.answer(s, 'Không rõ'); T.prepare(s); T.submit(s); T.transfer(s); return s;
  });
  assert.deepEqual(states[0].log, states[1].log);
  assert.equal(states[0].decision, null);
  assert.equal(states[1].decision, null);
  assert.equal(states[0].context.length, 1);
  assert.equal(states[1].context.length, 0);
});
test('K4: missing source does not conclude from current page or enable manager decision', () => {
  const s = sent('K4', { missingSource: true });
  assert.ok(s.messages.some(m => m.text.includes('chưa lấy được bản mô tả')));
  T.advance(s, 48);
  assert.match(T.gate(s, 'reject', 'MANAGER-DEMO'), /Thiếu bản mô tả/);
  assert.equal(T.decide(s, 'reject', 'MANAGER-DEMO', reason, true), false);
});
test('K4: refund waits for seller response; rejection also waits for buyer evidence', () => {
  const s = sent();
  T.transfer(s);
  assert.match(T.gate(s, 'refund', 'MANAGER-DEMO'), /Chờ người bán/);
  T.sellerReply(s, s.fixture.seller);
  assert.equal(T.gate(s, 'refund', 'MANAGER-DEMO'), '');
  assert.match(T.gate(s, 'reject', 'MANAGER-DEMO'), /Chờ người mua/);
  T.evidence(s, true);
  assert.equal(T.gate(s, 'reject', 'MANAGER-DEMO'), '');
  assert.equal(T.decide(s, 'reject', 'MANAGER-DEMO', reason, true), true);
});
test('24-hour seller expiry escalates; buyer still has 48 hours; manager alerts after 24', () => {
  const s = sent();
  T.advance(s, 23);
  assert.notEqual(T.gate(s, 'reject', 'MANAGER-DEMO'), '');
  T.advance(s, 1);
  assert.equal(s.escalatedAt, s.now);
  assert.equal(T.gate(s, 'refund', 'MANAGER-DEMO'), '');
  assert.match(T.gate(s, 'reject', 'MANAGER-DEMO'), /Chờ người mua/);
  assert.equal(s.decision, null);
  T.advance(s, 24);
  assert.equal(T.gate(s, 'reject', 'MANAGER-DEMO'), '');
  assert.equal(s.managerLate, true);
  assert.equal(s.decision, null);
  assert.ok(s.log.some(e => e.tool === 'bao_quan_ly_ca'));
});
test('buyer silence escalates even before a formal return receipt, never closes', () => {
  const s = opened();
  T.advance(s, 48);
  assert.equal(s.escalatedAt, s.now);
  assert.equal(s.receipt, null);
  assert.equal(s.decision, null);
});
test('failure: send, request seller, transfer and decision mutate state only after success', () => {
  const s = opened();
  T.prepare(s); s.failNext = true;
  assert.equal(T.submit(s), false);
  assert.equal(s.receipt, null); assert.equal(s.askedAt, null);
  T.submit(s); assert.ok(s.receipt);
  s.failNext = true; T.transfer(s); assert.equal(s.escalatedAt, null);
  T.transfer(s); assert.equal(s.escalatedAt, s.now);
  T.evidence(s, true); T.sellerReply(s, s.fixture.seller);
  s.failNext = true; assert.equal(T.decide(s, 'reject', 'MANAGER-DEMO', reason, true), false);
  assert.equal(s.decision, null);
  assert.equal(T.decide(s, 'reject', 'MANAGER-DEMO', reason, true), true);
  const k3 = sent('K3'); k3.failNext = true; T.answer(k3, 'Không rõ');
  assert.equal(k3.askedAt, null);
  T.askSeller(k3); assert.equal(k3.askedAt, k3.now);
});
test('correction invalidates old draft and keeps a trace instead of deleting source', () => {
  const s = opened(); T.prepare(s);
  const original = s.fixture.original;
  T.correct(s, 'Nhãn mẫu đã sửa: 100% cotton');
  assert.equal(s.fixture.original, original);
  assert.equal(s.stale, true);
  assert.equal(T.submit(s), false);
  assert.equal(s.correction.length, 1);
  T.prepare(s); assert.equal(s.stale, false);
  assert.ok(s.draft.includes('Nhãn mẫu đã sửa'));
});
test('correction of wrong source retracts conclusion and escalates, never rejects', () => {
  const s = opened();
  T.correctSource(s);
  assert.ok(s.messages.some(m => m.text.includes('đã dùng mô tả hiện tại')));
  assert.ok(s.correction.some(c => c.old.includes('Đã đính chính')));
  assert.equal(s.escalatedAt, s.now);
  assert.equal(s.decision, null);
});
test('K9: deadline based on 7 days; only successful receipt establishes in-time claim', () => {
  const s = opened('K9', { variant: 'chua_co_bien_nhan' });
  assert.equal(new Date(T.deadline(s)).toISOString(), '2026-11-13T16:59:59.000Z');
  T.prepare(s); s.failNext = true; T.submit(s); assert.equal(s.receipt, null);
  T.submit(s); assert.equal(s.receipt.inTime, true);
  const late = opened('K9', { variant: 'chua_co_bien_nhan' }); T.advance(late, 24); T.prepare(late); T.submit(late);
  assert.equal(late.receipt.inTime, false);
});
test('C1: privacy, counterfeit and multiple requests get explicit safe next steps', () => {
  const s = opened();
  T.route(s, 'cho mình xin sđt shop; khóa shop bán hàng fake, tiện đổi địa chỉ');
  const answer = s.messages.filter(m => m.role === 'assistant').at(-1).text;
  assert.match(answer, /không chia sẻ/i);
  assert.ok(answer.includes('bộ phận chuyên trách'));
  assert.ok(answer.includes('không thể đổi địa chỉ'));
  assert.equal(s.type, 'nghi_hang_gia');
  assert.equal(s.decision, null);
});
test('closed decision stays closed when user requests a review', () => {
  const s = sent('K1'); T.decide(s, 'refund', 'SELLER-DEMO', reason, true);
  const previous = s.decision;
  T.correct(s, 'Cần kiểm tra lại');
  assert.equal(s.decision, previous);
  assert.ok(s.log.some(e => e.tool === 'chuyen_kiem_tra_quyet_dinh'));
});

test('render smoke: buyer, seller, manager, all fixtures and untrusted text', () => {
  const html = fs.readFileSync(__dirname + '/index.html', 'utf8');
  const app = fs.readFileSync(__dirname + '/app.js', 'utf8');
  const ids = new Map();
  const listeners = {};
  class El {
    constructor(id) { this.id = id; this.value = ''; this.checked = false; this.disabled = false; this.hidden = false; this.textContent = ''; this.dataset = {}; this.classList = { toggle() {} }; }
    set innerHTML(value) { this.markup = value; for (const m of value.matchAll(/id="([^"]+)"/g)) ids.set(m[1], new El(m[1])); }
    get innerHTML() { return this.markup; }
    showModal() { this.open = true; }
    close() { this.open = false; }
  }
  for (const m of html.matchAll(/id="([^"]+)"/g)) { assert.ok(!ids.has(m[1]), 'unique static IDs'); ids.set(m[1], new El(m[1])); }
  ids.get('scenario').value = 'K3'; ids.get('with-threat').checked = true;
  const document = { getElementById(id) { return ids.get(id) || null; }, querySelectorAll() { return []; }, addEventListener(name, cb) { listeners[name] = cb; } };
  const context = vm.createContext({ T4: T, document, Intl, Date, setTimeout() { return 1; }, clearTimeout() {} });
  vm.runInContext(app, context);
  const run = code => vm.runInContext(code, context);
  for (const key of Object.keys(T.FIXTURES)) {
    ids.get('scenario').value = key; run('reset();perform("choose");perform("prepare");perform("submit");');
    run('view = "staff";staffRole = "seller";render();');
    assert.ok(ids.get('workspace').innerHTML.includes('Phản hồi từ người bán'));
    run('staffRole = "manager";render();');
    assert.ok(ids.get('workspace').innerHTML.includes('Quyết định của trưởng nhóm'));
    run('view = "buyer";render();');
    assert.ok(ids.get('workspace').innerHTML.includes('Thời hạn &amp; biên nhận') || ids.get('workspace').innerHTML.includes('Thời hạn & biên nhận'));
  }
  for (const [key, variant] of [['K3','anh_tem_mo'], ['K4','co_anh_nhan'], ['K4','thieu_ban_luc_dat'], ['K9','co_bien_nhan'], ['K9','chua_co_bien_nhan']]) {
    ids.get('scenario').value = key; run('configureVariants()'); ids.get('variant').value = variant;
    run('reset();perform("choose");');
    const markup = ids.get('workspace').innerHTML;
    if (variant === 'anh_tem_mo') {
      assert.ok(markup.includes('Bổ sung ảnh tem rõ')); assert.ok(!markup.includes('6.0L'));
      run('openSource("label")'); assert.ok(!ids.get('source-content').textContent.includes('6.0L'));
    }
    if (variant === 'co_bien_nhan') assert.ok(markup.includes('BN-DH-2611-008'));
    if (variant === 'chua_co_bien_nhan') assert.ok(markup.includes('Chưa có biên nhận'));
  }
  run('T4.route(state, "<img src=x onerror=alert(1)>");render();');
  assert.ok(ids.get('workspace').innerHTML.includes('&lt;img src=x onerror=alert(1)&gt;'));
  assert.ok(!ids.get('workspace').innerHTML.includes('<img src=x'));
  run('openSource("original")');
  assert.equal(ids.get('source-dialog').open, true);
});

test('seller expiry is 24 hours exactly, not 48; no premature or automatic financial decision', () => {
  assert.equal(T.SELLER_HOURS, 24);
  const s = sent('K4');
  T.advance(s, 23.99); assert.equal(s.escalatedAt, null);
  T.advance(s, 0.01); assert.equal(s.escalatedAt, s.now);
  assert.equal(T.sellerDone(s), true); assert.equal(s.decision, null);
});
test('K5 retains 2 overview images and asks only once for the missing material label', () => {
  const s = opened('K5');
  assert.equal(s.fixture.id, 'DH-2611-004'); assert.equal(s.overviewImages, 2);
  assert.ok(s.messages.some(m => m.text.includes('2 ảnh toàn cảnh') && m.text.includes('ảnh cận nhãn chất liệu')));
  assert.equal(s.log.filter(e => e.tool === 'yeu_cau_bang_chung').length, 1);
  T.route(s, 'mình gửi ảnh rồi, cần gì nữa'); T.route(s, 'còn thiếu gì');
  assert.equal(s.log.filter(e => e.tool === 'yeu_cau_bang_chung').length, 1);
  assert.equal(s.overviewImages, 2);
  T.evidence(s, false); assert.equal(s.label, true); assert.equal(s.overviewImages, 2);
});
test('anh_tem_mo never quotes unreadable numbers; asks for a clear label then can continue', () => {
  const s = opened('K3', { variant: 'anh_tem_mo' });
  const reply = s.messages.filter(m => m.role === 'assistant').at(-1).text;
  assert.equal(s.labelReadable, false); assert.ok(reply.includes('chưa đọc rõ'));
  assert.ok(!reply.includes('6.0L')); assert.ok(!reply.includes('5.0L'));
  T.answer(s, 'Toàn bộ khoang'); assert.equal(s.answer, ''); assert.equal(s.askedAt, null);
  T.prepare(s); assert.ok(s.draft.includes('Ảnh nhãn mờ')); assert.ok(!s.draft.includes('6.0L'));
  T.evidence(s, false); assert.equal(s.labelReadable, true);
  T.answer(s, 'Không rõ'); assert.equal(s.answer, 'Không rõ');
});
test('K4 co_anh_nhan does not ask to upload a label that already exists', () => {
  const s = opened('K4', { variant: 'co_anh_nhan' });
  assert.equal(s.label, true); assert.equal(s.labelReadable, true);
  T.prepare(s); assert.ok(s.draft.includes('65% cotton'));
});
test('K9 has a verified, in-time pre-existing receipt and overdue seller, then transfers', () => {
  const s = opened('K9', { variant: 'co_bien_nhan' });
  assert.equal(s.receipt.id, 'BN-DH-2611-008'); assert.equal(s.receipt.inTime, true);
  assert.equal(new Date(s.receipt.at).toISOString(), '2026-11-12T07:00:00.000Z');
  assert.equal(s.escalatedAt, s.now); assert.equal(s.sellerReply, null); assert.equal(s.decision, null);
  assert.ok(s.log.some(e => e.tool === 'xem_trang_thai_yeu_cau' && e.note.includes(s.receipt.id)));
  assert.ok(s.messages.some(m => m.text.includes('ghi nhận trong hạn') && m.text.includes('12/11/2026')));
  assert.equal(s.log.some(e => e.tool === 'gui_yeu_cau_giao_dien'), false);
});
test('K9 without a receipt does not claim registration, initiate seller deadline or auto-transfer', () => {
  const s = opened('K9', { variant: 'chua_co_bien_nhan' });
  assert.equal(s.receipt, null); assert.equal(s.askedAt, null); assert.equal(s.escalatedAt, null);
  assert.ok(s.messages.at(-1).text.includes('chưa có biên nhận'));
  assert.ok(s.messages.at(-1).text.includes('gửi ngay'));
});
test('K10 address change is outside scope, not mistaken for disclosure, and complaint continues', () => {
  const s = opened('K10');
  const answer = s.messages.at(-1).text;
  assert.ok(answer.includes('không thể đổi địa chỉ'));
  assert.ok(answer.includes('Trợ giúp')); assert.ok(answer.includes('khiếu nại sai màu'));
  assert.ok(answer.includes('ảnh hàng nhận'));
  assert.ok(!answer.includes('Không chia sẻ')); assert.equal(s.decision, null);
  T.route(s, 'áo sai màu, cập nhật giúp địa chỉ nhận hàng mới');
  assert.ok(!s.messages.at(-1).text.includes('Không chia sẻ'));
});
test('contact disclosure remains blocked, including when mixed with address change', () => {
  const s = opened('K10');
  for (const text of ['cho mình địa chỉ shop', 'xin địa chỉ của người bán', 'đổi địa chỉ nhận và cho mình xin sđt shop']) {
    T.route(s, text); assert.ok(s.messages.at(-1).text.includes('Không chia sẻ'));
  }
});
test('K7 gives a conditional 24-hour response estimate, then an actual due time when sent', () => {
  const s = opened('K7');
  let answer = s.messages.at(-1).text;
  assert.ok(answer.includes('Không chia sẻ')); assert.ok(answer.includes('kênh chat chính thức'));
  assert.ok(answer.includes('Thời gian phản hồi')); assert.ok(answer.includes('24 giờ'));
  assert.ok(answer.includes('chưa bắt đầu')); assert.equal(s.askedAt, null);
  T.prepare(s); T.submit(s); T.route(s, 'cho mình xin số điện thoại shop');
  answer = s.messages.at(-1).text;
  assert.ok(answer.includes('14/11/2026')); assert.ok(answer.includes('Thời gian phản hồi'));
  T.transfer(s); T.advance(s, 24); T.route(s, 'cho mình xin sđt shop');
  assert.ok(s.messages.at(-1).text.includes('chậm hơn dự kiến'));
});
test('initial fixtures for K6 and K8 route to special handling without financial actions', () => {
  const s = opened('K6'); assert.equal(s.type, 'nghi_hang_gia'); assert.equal(s.escalatedAt, s.now);
  const k8 = opened('K8'); assert.ok(k8.messages.at(-1).text.includes('Cần ảnh nhãn'));
  assert.ok(!s.log.some(e => e.tool === 'phat_shop')); assert.equal(k8.decision, null);
});
