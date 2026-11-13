/* Policy and fixtures for the T4 prototype. Every action is simulated. */
(function (root) {
  'use strict';
  const RETURN_WINDOW_DAYS = 7;
  const SELLER_HOURS = 48;
  const BUYER_HOURS = 48;
  const MANAGER_HOURS = 24;
  const HOUR = 3600000;
  const FIXTURES = {
    K1: { id: 'T4-DEMO-101', name: 'Áo thun Basic Cotton · Size L', price: 189000, ordered: '08/11/2026', received: '2026-11-11', original: 'Áo thun Basic Cotton · Size L', current: 'Áo thun Basic Cotton · Size L', updated: '08/11/2026', label: 'Size M', buyer: 'Mình đặt áo size L mà nhận được size M, mặc không vừa. Shop cũng nhắn nhận là gửi nhầm rồi. Mình muốn trả hàng hoàn tiền thì làm sao?', seller: 'Đơn đặt size L; shop xác nhận giao size M trong luồng chính thức.' },
    K3: { id: 'T4-DEMO-103', name: 'Nồi chiên AirHome · Dung tích tổng 6L', price: 1290000, ordered: '03/11/2026', received: '2026-11-10', original: 'Dung tích tổng 6L', current: 'Dung tích tổng 6L', updated: '03/11/2026', label: 'Tổng 6.0L · Giỏ chiên 5.0L', buyer: 'Nồi chiên ghi 6 lít mà mình đo lòng nồi chỉ được 5 lít. Không đúng mô tả.', threat: 'ko xử lý thì mình lên group review bóc phốt shop luôn đấy', seller: 'Thông số đúng mẫu: tổng 6.0L, giỏ chiên 5.0L. Đề nghị đối chiếu phần người mua đã đo.' },
    K4: { id: 'T4-DEMO-104', name: 'Áo thun Cotton · Màu trắng', price: 189000, ordered: '02/11/2026', received: '2026-11-09', original: '100% cotton', current: 'cotton pha polyester 65/35', updated: '07/11/2026', label: '65% cotton · 35% polyester', buyer: 'áo ghi 100% cotton mà mặc vô nóng hầm, sờ là biết vải pha, k đúng mô tả gì hết', seller: 'Trang đã được cập nhật ngày 07/11. Shop cung cấp nhãn ghi 65% cotton / 35% polyester; cần đối chiếu đúng hàng đã giao.' },
    K9: { id: 'T4-DEMO-109', name: 'Áo thun · Đặt màu xanh, nhận màu đỏ', price: 189000, ordered: '02/11/2026', received: '2026-11-06', original: 'Màu xanh', current: 'Màu xanh', updated: '02/11/2026', label: 'Màu đỏ (ảnh mẫu)', buyer: 'áo nhận từ hôm 6/11 bị sai màu, mình gửi yêu cầu rồi mà shop im re, hôm nay hết hạn trả hàng rồi phải không??', seller: 'Shop cần kiểm tra ảnh màu hàng đã giao.' }
  };
  function create(key, options) {
    options = options || {};
    return { key: key, fixture: FIXTURES[key], now: Date.parse('2026-11-13T15:00:00+07:00'), chosen: false, label: key === 'K3', labelText: FIXTURES[key].label, answer: '', noEvidence: false, missingSource: !!options.missingSource, threat: options.threat !== false, draft: null, stale: false, receipt: null, askedAt: null, sellerReply: null, escalatedAt: null, type: 'thuong', decision: null, buyerDue: null, managerLate: false, failNext: false, error: null, context: [], correction: [], messages: [], log: [] };
  }
  function stamp(s) { return new Date(s.now).toISOString(); }
  function log(s, tool, actor, note) { s.log.push({ tool: tool, actor: actor, at: stamp(s), note: note }); }
  function say(s, text, role) { s.messages.push({ text: text, role: role || 'assistant' }); }
  function source(s) { return s.chosen && !s.missingSource; }
  function deadline(s) { const d = new Date(s.fixture.received + 'T23:59:59+07:00'); return d.getTime() + RETURN_WINDOW_DAYS * 24 * HOUR; }
  function buyerDone(s) { return s.noEvidence || !!s.answer || s.label && s.key !== 'K3' || s.buyerDue !== null && s.now >= s.buyerDue; }
  function sellerDone(s) { return !!s.sellerReply || s.askedAt !== null && s.now >= s.askedAt + SELLER_HOURS * HOUR; }
  function gate(s, type, actor) {
    if (s.decision) return 'Hồ sơ đã có quyết định.';
    if (!s.receipt) return 'Chưa có biên nhận yêu cầu trả hàng.';
    if (actor === 'SELLER-DEMO' && type === 'refund') return '';
    if (actor !== 'MANAGER-DEMO') return 'Chỉ trưởng nhóm hoặc người bán đúng quyền được xác nhận.';
    if (s.escalatedAt === null) return 'Hồ sơ chưa được chuyển tới trưởng nhóm.';
    if (!source(s)) return 'Thiếu bản mô tả lúc đặt — cần nhân viên xác minh nguồn trước khi quyết định.';
    if (!sellerDone(s)) return s.askedAt === null ? 'Chưa gửi thành công yêu cầu phản hồi cho người bán.' : 'Chờ người bán phản hồi hoặc hết 48 giờ.';
    if (type === 'reject' && !buyerDone(s)) return 'Chờ người mua bổ sung, chọn Tôi không có, hoặc hết hạn bổ sung 48 giờ.';
    return '';
  }
  function op(s, retry, tool, actor, note, fn) {
    if (s.failNext) { s.failNext = false; s.error = { retry: retry, tool: tool }; say(s, 'Chưa thực hiện được thao tác ' + tool + '. Hồ sơ được giữ nguyên; bạn có thể thử lại. Chưa có xác nhận thành công.', 'system'); return false; }
    fn(); s.error = null; log(s, tool, actor, note); return true;
  }
  function explain(s) {
    if (!source(s)) return 'Mình chưa lấy được bản mô tả tại thời điểm bạn đặt nên chưa thể đối chiếu chính xác. Mình sẽ không dùng mô tả hiện tại để kết luận. Bạn có thể bổ sung ảnh xác nhận mua hàng có mô tả hoặc chọn nhờ nhân viên kiểm tra.';
    if (s.key === 'K3') return 'Mình hiểu bạn đang lo sản phẩm nhận được không đúng quảng cáo. Bản mô tả lúc bạn đặt (' + s.fixture.ordered + ') ghi “dung tích tổng 6L”; ảnh tem ghi “' + s.labelText + '”. Dung tích tổng và dung tích giỏ chiên là hai thông số khác nhau, nên con số bạn đo được chưa đủ để kết luận shop giao sai.\n\nBạn đo phần giỏ chiên hay toàn bộ khoang nồi? Bạn có thể chọn bên dưới, sửa thông tin mình đọc sai hoặc yêu cầu nhân viên xem xét. Mình chưa quyết định hoàn tiền hay từ chối khiếu nại.';
    if (s.key === 'K4') return 'Bản mô tả lúc bạn đặt (' + s.fixture.ordered + ') ghi “100% cotton”, còn trang hiện tại ghi “cotton pha polyester 65/35” và được cập nhật ngày 07/11/2026, sau thời điểm đặt hàng. Mình sẽ dùng bản mô tả lúc đặt để đối chiếu khiếu nại này.\n\nMình chưa xác minh được thành phần của chiếc áo bạn nhận chỉ từ cảm giác khi mặc. Bạn có ảnh nhãn thành phần trên áo không? Nếu không có hoặc nhãn không đọc được, bạn vẫn có thể nhờ nhân viên xem xét. Mình có thể soạn nháp yêu cầu để bạn kiểm tra; việc này chưa gửi yêu cầu và chưa quyết định hoàn tiền.';
    if (s.key === 'K9') return 'Trang đơn ghi nhận ngày nhận hàng 06/11/2026. Theo chính sách dựng 7 ngày, hạn gửi yêu cầu là hết 13/11/2026. Hiện hệ thống chưa có biên nhận; câu “mình gửi rồi”, chat và bản nháp không xác nhận việc gửi yêu cầu trả hàng. Bạn có thể chuẩn bị và gửi ngay. Mình chưa thể hứa bảo lưu quyền nếu chưa có biên nhận.';
    return 'Bản mô tả lúc đặt (' + s.fixture.ordered + ') ghi size L. Mình chưa có xác nhận chính thức của shop trong luồng này, dù bạn cho biết shop đã nhận lỗi qua chat. Bạn có thể bổ sung một ảnh nhãn size, chuẩn bị nháp rồi tự gửi yêu cầu. Chưa có thao tác hoàn tiền.';
  }
  function askSeller(s) {
    if (!s.receipt || s.askedAt !== null || s.key === 'K3' && !s.answer) return;
    op(s, 'askSeller', 'yeu_cau_bang_chung', 'AI', 'Gửi đúng đơn; cần phản hồi về ' + (s.key === 'K3' ? 'dung tích tổng và giỏ' : s.key === 'K4' ? 'nhãn thành phần và hai phiên bản mô tả' : 'hàng đã giao') + '. Hạn 48 giờ từ lúc gửi thành công.', function () { s.askedAt = s.now; say(s, 'Đã gửi yêu cầu phản hồi cho người bán. Hạn phản hồi: 48 giờ từ lúc hệ thống xác nhận gửi thành công. Chưa có quyết định.', 'system'); });
  }
  function transfer(s, type) {
    if (!s.chosen || s.escalatedAt !== null) return;
    op(s, 'transfer', 'chuyen_truong_nhom', 'AI', 'Chuyển hồ sơ cùng nguồn, đính chính và phần bất đồng. Loại ca: ' + (type || s.type), function () { s.escalatedAt = s.now; s.type = type || s.type; say(s, 'Đã chuyển hồ sơ — chờ nhân viên. Nhân viên nhận nguồn đã có và phần chưa xác minh; chưa hoàn tiền hoặc từ chối.', 'system'); });
  }
  function choose(s) {
    if (s.chosen) return;
    s.chosen = true; s.buyerDue = s.now + BUYER_HOURS * HOUR;
    log(s, 'chon_don', 'BUYER-DEMO', s.fixture.id);
    log(s, 'xem_mo_ta_luc_dat', 'AI', source(s) ? 'Bản lúc đặt: ' + s.fixture.ordered : 'Không có bản lúc đặt');
    log(s, 'xem_trang_thai_yeu_cau', 'AI', 'Chưa có biên nhận');
    say(s, s.fixture.buyer, 'user');
    if (s.key === 'K3' && s.threat) { s.context.push(s.fixture.threat); say(s, s.fixture.threat, 'user'); }
    say(s, explain(s));
    if (!source(s)) transfer(s);
  }
  function answer(s, value) {
    if (!s.chosen || s.decision) return;
    s.answer = value; say(s, 'Phần tôi đo: ' + value, 'user');
    say(s, value === 'Giỏ chiên' ? 'Số 5L bạn đo ở giỏ và số 6L tổng trong bản lúc đặt (' + s.fixture.ordered + ') nói về hai phần khác nhau. Chưa đủ căn cứ kết luận có lỗi sản phẩm khác. Bạn vẫn có thể tự gửi yêu cầu hoặc nhờ nhân viên xem xét.' : 'Đã ghi nhận phần bạn đo. Cần phản hồi kỹ thuật của shop và nhân viên nếu còn bất đồng; chưa có quyết định hoàn hoặc từ chối.');
    if (value !== 'Giỏ chiên') askSeller(s);
  }
  function evidence(s, none) {
    if (!s.chosen || s.decision) return;
    s.noEvidence = !!none; if (!none) s.label = true;
    say(s, none ? 'Tôi không có bằng chứng này.' : 'Tôi bổ sung ảnh nhãn mẫu: ' + s.labelText, 'user');
    log(s, 'bo_sung_bang_chung', 'BUYER-DEMO', none ? 'Không có bằng chứng' : 'Ảnh mẫu; chưa kiểm định sản phẩm');
    say(s, none ? 'Bạn vẫn có thể gửi yêu cầu và nhờ nhân viên xem xét. Thiếu ảnh không tự động làm bạn thua.' : 'Đã nhận ảnh mẫu. Nội dung đọc từ ảnh chưa phải kết quả kiểm định hàng thật.');
    s.stale = !!s.draft; if (none) transfer(s);
  }
  function prepare(s) {
    if (!s.chosen || s.decision || s.receipt) return;
    s.draft = 'Đơn ' + s.fixture.id + '\nPhản ánh: ' + s.fixture.buyer + '\nNguồn lúc đặt: ' + (source(s) ? s.fixture.original + ' (' + s.fixture.ordered + ')' : 'Chưa lấy được') + '\nNhãn: ' + (s.label ? s.labelText : s.noEvidence ? 'Người mua không có ảnh nhãn' : 'Chưa có') + '\nPhần đo: ' + (s.answer || 'Chưa xác định') + '\nĐề nghị xem xét yêu cầu trả hàng/hoàn tiền; chưa có quyết định.';
    s.stale = false; log(s, 'soan_hoan_tien', 'AI', 'Chỉ soạn nháp theo lựa chọn người mua; chưa gửi'); say(s, 'Đã soạn nháp — chưa gửi. Bạn kiểm tra hoặc sửa nội dung trước khi bấm Gửi yêu cầu. Nháp chưa bảo lưu hạn trả hàng.', 'system');
  }
  function submit(s, text) {
    if (!s.chosen || !s.draft || s.stale || s.receipt || s.decision || !String(text || s.draft).trim()) return false;
    const ok = op(s, 'submit', 'gui_yeu_cau_giao_dien', 'BUYER-DEMO', 'Người mua bấm gửi, không phải AI', function () { s.draft = text || s.draft; s.receipt = { id: 'BN-' + s.fixture.id, at: s.now, inTime: s.now <= deadline(s) }; say(s, 'Đã gửi yêu cầu. Biên nhận ' + s.receipt.id + '. ' + (s.receipt.inTime ? 'Hệ thống đã ghi nhận trong hạn chính sách dựng.' : 'Yêu cầu gửi sau hạn chính sách dựng — cần nhân viên kiểm tra điều kiện.') + ' Chưa có quyết định hoàn tiền.', 'system'); });
    if (ok && !(s.key === 'K3' && s.answer === 'Giỏ chiên')) askSeller(s);
    return ok;
  }
  function sellerReply(s, text) {
    if (!s.receipt || s.decision || !String(text).trim()) return;
    op(s, 'sellerReply', 'phan_hoi_nguoi_ban', 'SELLER-DEMO', text, function () { s.sellerReply = text; say(s, 'Người bán đã phản hồi kèm bằng chứng trong hồ sơ. Đây chưa phải quyết định của sàn.', 'system'); });
  }
  function correct(s, text) {
    if (!s.chosen || !String(text).trim()) return;
    if (s.decision) { say(s, 'Mình không thể tự mở lại khiếu nại đã đóng hoặc thu hồi tiền. Có thể chuyển nhân viên kiểm tra quyết định cùng nội dung đính chính.'); op(s, 'reviewClosed', 'chuyen_kiem_tra_quyet_dinh', 'BUYER-DEMO', text, function () { say(s, 'Đã chuyển đề nghị kiểm tra lại cho nhân viên. Quyết định cũ vẫn giữ nguyên cho tới khi có kết quả xử lý hợp lệ.', 'system'); }); return; }
    const old = s.labelText; s.labelText = text; s.label = true; s.correction.push({ old: old, text: text, at: stamp(s) }); s.stale = !!s.draft;
    say(s, 'Đính chính thông tin đọc từ ảnh: “' + old + '” → “' + text + '”. Nội dung cũ được giữ trong lịch sử, đánh dấu đã đính chính. Cần kiểm tra lại nháp trước khi gửi.', 'system');
    log(s, 'dinh_chinh', 'BUYER-DEMO', 'Đã đính chính: ' + old + ' → ' + text);
    if (s.receipt) op(s, 'correction', 'gui_dinh_chinh', 'BUYER-DEMO', text, function () { say(s, 'Đã gửi bản đính chính cho các bên trong phiên mô phỏng. Tin cũ không bị thu hồi.', 'system'); });
  }
  function advance(s, hours) {
    s.now += hours * HOUR; log(s, 'dong_ho_demo', 'SYSTEM', 'Tăng ' + hours + ' giờ');
    if (s.decision) return;
    if (s.askedAt !== null && !s.sellerReply && sellerDone(s)) transfer(s);
    if (s.buyerDue !== null && s.now >= s.buyerDue && !s.noEvidence && !s.answer && !(s.label && s.key !== 'K3')) transfer(s);
    if (s.escalatedAt !== null && s.now >= s.escalatedAt + MANAGER_HOURS * HOUR && !s.managerLate) { s.managerLate = true; log(s, 'bao_quan_ly_ca', 'SYSTEM', 'Đưa hồ sơ lên đầu hàng'); say(s, 'Đang chờ nhân viên, chậm hơn dự kiến. Đã báo quản lý ca và ưu tiên hồ sơ. AI không thay người duyệt quyết định.', 'system'); }
  }
  function decide(s, type, actor, reason, reviewed) {
    const blocked = gate(s, type, actor);
    if (blocked || !String(reason).trim() || !reviewed) return false;
    return op(s, 'decision', type === 'refund' ? 'thuc_hien_hoan_tien' : 'tu_choi_khieu_nai', actor, reason, function () { s.decision = { type: type, actor: actor, reason: reason, at: stamp(s) }; say(s, (type === 'refund' ? 'Đã xác nhận trả hàng/hoàn tiền mô phỏng.' : 'Trưởng nhóm đã từ chối khiếu nại mô phỏng.') + '\nNgười duyệt: ' + actor + '\nLý do: ' + reason + '\nKhông có tiền thật được chuyển. Kết quả đã hiển thị cho hai bên.', 'system'); });
  }

  function correctSource(s) {
    if (!s.chosen || s.key !== 'K4' || s.decision) return;
    say(s, 'Áo đúng mô tả theo trang hiện tại. [Đã đính chính — rút lại kết luận]', 'assistant');
    s.correction.push({ old: 'Áo đúng mô tả theo trang hiện tại. [Đã đính chính]', text: 'Rút lại kết luận dùng sai phiên bản nguồn', at: stamp(s) });
    say(s, 'Mình xin lỗi, câu trả lời trước đã dùng mô tả hiện tại thay vì bản lúc bạn đặt. Nhận xét đó cần được rút lại. Mình sẽ đối chiếu lại bản lúc đặt; hiện chưa có căn cứ để từ chối khiếu nại của bạn. Câu cũ được giữ và đánh dấu đã đính chính.', 'system');
    s.stale = !!s.draft;
    log(s, 'dinh_chinh_nguon', 'AI', 'Rút lại kết luận dùng trang hiện tại; không thực hiện quyết định tài chính.');
    transfer(s);
  }
  function route(s, text) {
    const result = [];
    if (/sđt|số điện thoại|địa chỉ/i.test(text)) result.push('Không chia sẻ số điện thoại hoặc địa chỉ của bên kia. Bạn có thể trao đổi trong kênh chính thức có lưu vết.');
    if (/fake|hàng giả|khóa shop|khoá shop|phạt shop/i.test(text)) { result.push('AI không giám định hàng giả, không phạt hoặc hứa khóa shop. Chuyển trưởng nhóm để đi tới bộ phận chuyên trách.'); s.type = 'nghi_hang_gia'; if (s.chosen) transfer(s, s.type); }
    if (/đổi.*địa chỉ|huỷ đơn|hủy đơn|chưa nhận hàng/i.test(text)) result.push('Yêu cầu đổi địa chỉ/hủy đơn/chưa nhận hàng nằm ngoài luồng này. Hãy mở Trợ giúp của đơn hàng để chọn đúng mục; thao tác đó chưa được thực hiện tại đây.');
    if (/bóc phốt|báo chí|nhiều người chê|lịch sử khiếu nại/i.test(text)) { s.context.push(text); result.push('Lời doạ và lịch sử một bên được giữ ở ngữ cảnh, không phải căn cứ để hoàn tiền hay từ chối.'); }
    if (!s.chosen) result.push('Bạn đang nói đơn nào? Hãy chọn đơn trước khi gửi thông tin cho shop.');
    else if (!result.length) result.push('Đã ghi nhận lời bạn bổ sung, chưa tự xác minh nội dung mới. ' + (!source(s) ? 'Thiếu bản lúc đặt: hãy nhờ nhân viên kiểm tra.' : s.key === 'K3' && !s.answer ? 'Bạn đo giỏ chiên hay toàn bộ khoang? Chọn một câu trả lời bên dưới.' : !buyerDone(s) ? 'Cần ảnh nhãn của hàng nhận; có thể bổ sung hoặc chọn Tôi không có.' : 'Bạn có thể chuẩn bị yêu cầu hoặc nhờ nhân viên xem xét.'));
    say(s, text, 'user'); say(s, result.join('\n\n')); log(s, 'dinh_tuyen_C1_C6', 'AI', 'Chỉ hướng dẫn/thu thập/chuyển; không gọi tool tài chính');
  }
  const api = { RETURN_WINDOW_DAYS: RETURN_WINDOW_DAYS, SELLER_HOURS: SELLER_HOURS, HOUR: HOUR, FIXTURES: FIXTURES, create: create, source: source, deadline: deadline, buyerDone: buyerDone, sellerDone: sellerDone, gate: gate, choose: choose, answer: answer, evidence: evidence, prepare: prepare, submit: submit, askSeller: askSeller, transfer: transfer, sellerReply: sellerReply, correct: correct, correctSource: correctSource, advance: advance, decide: decide, route: route };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.T4 = api;
})(globalThis);
