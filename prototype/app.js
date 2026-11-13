'use strict';
const $ = id => document.getElementById(id);
const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
let state, view = 'buyer', staffRole = 'seller', pending, toastTimer;
const money = amount => amount.toLocaleString('vi-VN') + ' ₫';
const date = value => new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(value));
const num = n => '<span class="annotation">' + n + '</span>';
function button(label, action, options) {
  options = options || {};
  return '<button type="button" class="' + (options.className || 'outline-button') + '" data-action="' + action + '"' + (options.disabled ? ' disabled' : '') + (options.value ? ' data-value="' + esc(options.value) + '"' : '') + '>' + label + '</button>';
}
function badge(text) { return '<span class="status-chip">' + esc(text) + '</span>'; }
function notify(text) { $('toast').textContent = text; $('toast').hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => $('toast').hidden = true, 4000); }
function status() {
  if (state.decision) return 'Đã có quyết định mô phỏng';
  if (state.error) return 'Thao tác chưa thành công — có thể thử lại';
  if (state.managerLate) return 'Đang chờ nhân viên, chậm hơn dự kiến';
  if (state.escalatedAt !== null) return 'Đã chuyển hồ sơ — chờ nhân viên';
  if (state.receipt) return 'Đã gửi yêu cầu — chờ phản hồi';
  if (state.stale) return 'Bản nháp cần kiểm tra lại';
  if (state.draft) return 'Đã soạn nháp — chưa gửi';
  if (!state.chosen) return 'Chọn đúng đơn trước khi tiếp tục';
  if (!T4.source(state)) return 'Thiếu bản mô tả lúc đặt';
  return state.key === 'K4' ? 'Mô tả đã thay đổi — chưa xác minh chất liệu' : 'Chưa đủ căn cứ kết luận';
}
function section(title, content, classes) { return '<section class="card ' + (classes || 'panel') + '"><div class="section-heading"><h2>' + title + '</h2></div>' + content + '</section>'; }
function evidence() {
  const f = state.fixture;
  if (!state.chosen) return '<p class="muted">Hãy chọn đơn. Chưa đọc hoặc gửi thông tin tới shop.</p>';
  return '<div class="evidence-group"><p class="eyebrow">NGUỒN ĐÃ ĐỐI CHIẾU</p>' +
    (T4.source(state) ? '<strong>Bản lúc đặt · ' + esc(f.ordered) + '</strong><p>' + esc(f.original) + '</p>' + button('Xem bản lưu', 'source', { value: 'original', className: 'text-button' }) : '<p class="warning-text">Chưa lấy được bản lúc đặt. Không dùng trang hiện tại để kết luận.</p>') +
    '<p>Trang hiện tại · ' + esc(f.updated) + '</p><p>' + esc(f.current) + '</p>' + button('Xem trang hiện tại', 'source', { value: 'current', className: 'text-button' }) + '</div>' +
    '<div class="evidence-group"><p class="eyebrow">THÔNG TIN MỘT BÊN CUNG CẤP</p><p>' + (state.label ? state.labelReadable ? 'Ảnh nhãn mẫu: ' + esc(state.labelText) : 'Ảnh tem mờ — chưa đọc rõ thông số' : 'Chưa có ảnh nhãn') + '</p>' +
    (state.label ? button('Xem ảnh nhãn giả lập', 'source', { value: 'label', className: 'text-button' }) : '') +
    (state.overviewImages ? '<p>Đã có: ' + state.overviewImages + ' ảnh toàn cảnh, không cần gửi lại.</p>' : '') + '<p>Người mua: ' + esc(state.key === 'K3' ? 'đo được 5L · phần đo: ' + (state.answer || 'chưa rõ') : 'phản ánh chưa được kiểm định') + '</p></div>' +
    '<div class="evidence-group"><p class="eyebrow">ĐIỀU CHƯA XÁC MINH</p><p>' + esc(state.key === 'K3' ? 'Phần được đo và tình trạng thực tế của đúng mẫu hàng.' : 'Thành phần / tình trạng thực tế của hàng đã giao. Ảnh nhãn không phải kiểm định.') + '</p></div>' +
    '<p class="evidence-note">G11 · Căn cứ có phiên bản và thời điểm. Không có phần trăm độ chắc chưa hiệu chuẩn.</p>';
}
function deadlines() {
  const sellerDue = state.askedAt === null ? null : state.askedAt + T4.SELLER_HOURS * T4.HOUR;
  const remaining = due => state.now >= due ? 'Đã hết hạn' : 'Còn ' + Math.ceil((due - state.now) / T4.HOUR) + ' giờ';
  return '<div class="deadline-row"><strong>Hạn gửi yêu cầu trả hàng</strong><span>' + date(T4.deadline(state)) + '</span><small>Quy tắc dựng ' + T4.RETURN_WINDOW_DAYS + ' ngày từ ngày nhận hàng. ' + remaining(T4.deadline(state)) + '.</small></div>' +
    '<div class="deadline-row"><strong>Hạn phản hồi người bán</strong><span>' + (sellerDue === null ? 'Chưa bắt đầu — chưa gửi thành công' : date(sellerDue) + ' · ' + remaining(sellerDue)) + '</span><small>' + T4.SELLER_HOURS + ' giờ kể từ xác nhận gửi thành công. Không phải hạn trả hàng.</small></div>' +
    '<div class="deadline-row"><strong>Hạn bổ sung của người mua</strong><span>' + (state.buyerDue === null ? 'Chưa bắt đầu' : date(state.buyerDue) + ' · ' + remaining(state.buyerDue)) + '</span><small>48 giờ giả định theo §4.3. Im lặng không tự thành bằng chứng sai.</small></div>' +
    (state.escalatedAt !== null ? '<div class="deadline-row"><strong>Nhân viên xử lý dự kiến</strong><span>' + date(state.escalatedAt + 24 * T4.HOUR) + '</span><small>Quá 24 giờ: báo quản lý ca, AI không quyết thay.</small></div>' : '') +
    (state.receipt ? '<div class="receipt"><strong>Biên nhận ' + esc(state.receipt.id) + '</strong><p>' + date(state.receipt.at) + ' · ' + (state.receipt.inTime ? 'Trong hạn gửi yêu cầu' : 'Sau hạn — cần nhân viên kiểm tra') + '</p></div>' : '<p class="support-note">Chưa có biên nhận. Tin chat và bản nháp chưa xác nhận việc gửi trong hạn.</p>');
}
function needed() {
  if (!state.chosen) return '<p>Chọn đúng đơn trước khi yêu cầu bằng chứng.</p>';
  let text = '';
  if (!T4.source(state)) text += '<p>Thiếu bản mô tả lúc đặt — cần nhân viên kiểm tra nguồn. Bạn vẫn có thể gửi yêu cầu.</p>';
  if (state.key === 'K3' && !state.labelReadable && !state.noEvidence) {
    text += '<p>Ảnh tem hiện chưa đọc rõ. Cần ảnh rõ phần dung tích để đối chiếu, không trích số từ ảnh mờ.</p>' + button('＋ Bổ sung ảnh tem rõ mẫu', 'evidence');
  } else if (state.key === 'K7') {
    text += '<p>Trao đổi qua kênh chat chính thức, không cần chia sẻ liên hệ riêng. ' + esc(T4.responseTime(state)) + '</p>';
  } else if (state.key === 'K3' && !state.answer && !state.noEvidence) {
    text += '<p>Bạn đo phần giỏ chiên hay toàn bộ khoang nồi?</p><div class="button-row">' + ['Giỏ chiên', 'Toàn bộ khoang', 'Không rõ'].map(value => button(esc(value), 'answer', { value: value })).join('') + '</div><p class="small muted">Không yêu cầu đổ nước vào thiết bị hay thực hiện phép thử nguy hiểm.</p>';
  } else {
    if (state.overviewImages) text += '<p>Đã có: ' + state.overviewImages + ' ảnh toàn cảnh. Giữ nguyên, không gửi lại.</p>';
    text += '<p>' + (state.label ? 'Đã có ảnh nhãn. Không cần gửi lại ảnh đã đọc được.' : state.noEvidence ? 'Đã ghi nhận bạn không có ảnh nhãn; có thể chuyển nhân viên.' : 'Còn thiếu: ' + (state.key === 'K4' || state.key === 'K5' ? 'ảnh cận nhãn thành phần của áo, giúp đối chiếu chất liệu ghi trên hàng.' : 'ảnh nhãn size/màu của hàng đã giao, giúp đối chiếu đúng đơn.')) + '</p>';
  if (state.key === 'K3' && !state.answer) {
    if (!state.label) text += '<p>Ảnh tem chưa đọc rõ: bổ sung ảnh rõ phần dung tích để đối chiếu đúng thông số.</p>' + button('＋ Bổ sung ảnh nhãn mẫu', 'evidence');
    text += '<p>Bạn đo phần giỏ chiên hay toàn bộ khoang nồi?</p><div class="button-row">' + ['Giỏ chiên', 'Toàn bộ khoang', 'Không rõ'].map(value => button(esc(value), 'answer', { value: value })).join('') + '</div><p class="small muted">Không yêu cầu đổ nước vào thiết bị hay thực hiện phép thử nguy hiểm.</p>';
  } else {
    text += '<p>' + (state.label ? 'Đã có ảnh nhãn. Không cần gửi lại ảnh đã đọc được.' : state.noEvidence ? 'Đã ghi nhận bạn không có ảnh nhãn; có thể chuyển nhân viên.' : 'Còn thiếu: ' + (state.key === 'K4' ? 'ảnh cận nhãn thành phần của áo, giúp đối chiếu chất liệu ghi trên hàng.' : state.key === 'K3' ? 'ảnh rõ phần dung tích trên tem, giúp đối chiếu dung tích tổng và giỏ chiên.' : 'ảnh nhãn size/màu của hàng đã giao, giúp đối chiếu đúng đơn.')) + '</p>';
    if (!state.label && !state.noEvidence) text += button('＋ Bổ sung ảnh nhãn mẫu', 'evidence');
  }
  if (!state.noEvidence) text += button('Tôi không có bằng chứng này', 'none', { className: 'text-button' });
  return text;
}
function buyer() {
  const f = state.fixture;
  const messages = state.messages.map(m => '<div class="message ' + esc(m.role) + '">' + (m.role === 'user' ? '' : '<span class="message-avatar">✦</span>') + '<div><div class="bubble">' + esc(m.text) + '</div><div class="message-caption">' + (m.role === 'user' ? 'Người mua · dữ liệu dựng' : m.role === 'system' ? 'Trạng thái thao tác · mô phỏng' : 'AI · phản hồi theo fixture') + '</div></div></div>').join('');
  let draft = '';
  if (state.draft && !state.receipt) draft = section('Bản nháp yêu cầu ' + badge(state.stale ? 'Cần kiểm tra lại' : 'Chưa gửi'), '<label for="draft-text" class="field-label">Xem và sửa trước khi gửi</label><textarea id="draft-text" rows="7" maxlength="3000">' + esc(state.draft) + '</textarea><p class="small muted">Gửi yêu cầu không đồng nghĩa với chuyển tiền.</p><div class="button-row">' + button('Gửi yêu cầu trả hàng', 'submit', { className: 'primary-button', disabled: state.stale }) + button('Hủy nháp', 'discard') + '</div>');
  return '<div class="buyer-grid"><div class="main-column"><section class="card conversation"><div class="card-header"><div class="assistant-icon">✦</div><div><h2>Trợ lý hỗ trợ khiếu nại ' + num(1) + '<span class="ai-badge">AI</span></h2><p>Giúp đối chiếu thông tin và chuẩn bị yêu cầu</p></div></div><div class="ai-intro">[1] Quyết định hoàn tiền hoặc từ chối cần người có thẩm quyền duyệt.</div><div class="case-status" role="status">' + num(2) + ' ' + esc(status()) + '</div><div class="messages" id="messages"><div class="day-divider">PHIÊN MÔ PHỎNG · ' + date(state.now) + '</div>' + (messages || '<div class="empty-state"><span>▤</span><h3>Bắt đầu từ đúng đơn hàng.</h3><p>AI không tự chọn đơn gần nhất và không gửi gì cho shop trước khi bạn chọn.</p></div>') + '</div><div class="quick-actions">' +
    (!state.chosen ? button('Chọn đơn ' + esc(f.id), 'choose', { className: 'primary-button' }) : !state.decision ? (!state.receipt ? button('Chuẩn bị yêu cầu' + (state.stale ? ' mới' : ''), 'prepare') : '') + button('Sửa thông tin AI đọc sai [5]', 'correction') + button('Nhờ nhân viên xem xét [6]', 'transfer') + (state.key === 'K4' ? button('Demo AI dùng sai nguồn', 'wrong-source', { className: 'text-button' }) : '') : button('Yêu cầu kiểm tra lại quyết định [6]', 'reopen')) +
    '</div><form id="chat-form" class="composer"><label class="sr-only" for="chat-input">Tin nhắn bổ sung</label><input id="chat-input" maxlength="1000" placeholder="Bổ sung thông tin, hỏi ngoài phạm vi hoặc thử ca lạ…"><button type="submit" aria-label="Gửi">↑</button></form><div class="composer-note">Không gửi thông tin riêng tư. Chat dùng bộ định tuyến mô phỏng, không gọi AI thật.</div></section>' +
    (state.chosen && !state.decision ? section('Bước tiếp theo ' + num(4), needed()) : '') + draft + '</div><div class="detail-column">' +
    section('Đơn hàng của bạn', '<div class="product-row"><div class="product-art">' + (state.key === 'K3' ? '▥' : '♧') + '</div><div><span class="small muted">Shop mẫu · dữ liệu dựng</span><h3>' + esc(f.name) + '</h3><p>' + money(f.price) + '</p></div></div><div class="order-meta"><span>Mã đơn<strong>' + esc(f.id) + '</strong></span><span>Đặt ngày<strong>' + esc(f.ordered) + '</strong></span></div><div class="order-footer">Ngày nhận <span>' + esc(f.received.split('-').reverse().join('/')) + '</span></div>') +
    section('Nguồn đối chiếu ' + num(3) + ' <span class="tiny-badge">G11</span>', evidence()) +
    section('Thời hạn & biên nhận ' + num(7), deadlines()) + '</div></div>';
}
function staff() {
  const f = state.fixture;
  const roleBar = '<div class="role-tabs">' + button('Người bán', 'role', { value: 'seller', className: staffRole === 'seller' ? 'primary-button' : 'outline-button' }) + button('Trưởng nhóm [8]', 'role', { value: 'manager', className: staffRole === 'manager' ? 'primary-button' : 'outline-button' }) + '<span class="small muted">Đổi vai để demo · không phải phân quyền thật</span></div>';
  const context = state.context.length ? state.context.map(esc).join('<br>') : 'Không có lời doạ hoặc lịch sử một bên được dùng làm căn cứ.';
  const logs = state.log.map(e => '<li><strong>' + esc(e.tool) + '</strong><span>' + esc(e.actor) + ' · ' + date(e.at) + '</span><p>' + esc(e.note) + '</p></li>').join('');
  const left = section('Hồ sơ ' + esc(f.id) + ' ' + badge(status()), '<p class="small muted">Người mua: AN-DEMO · số điện thoại và địa chỉ bị ẩn.</p>' + evidence() +
    '<div class="two-statements"><div><p class="eyebrow">NGƯỜI MUA</p><p>' + esc(f.buyer) + '</p></div><div><p class="eyebrow">NGƯỜI BÁN</p><p>' + esc(state.sellerReply || 'Chưa có phản hồi chính thức. Không tin lời “shop đã nhận” thay cho phản hồi.') + '</p></div></div>' +
    '<div class="review-warning"><strong>Ngữ cảnh · không phải căn cứ</strong><p>' + context + '</p><small>Lời doạ và lịch sử của một bên không thay đổi nhánh xử lý.</small></div>' +
    (state.correction.length ? '<div class="correction-list"><h3>Đã đính chính · giữ dấu vết</h3>' + state.correction.map(c => '<p><s>' + esc(c.old) + '</s> → ' + esc(c.text) + ' · ' + date(c.at) + '</p>').join('') + '</div>' : '') +
    '<details open><summary>Nhật ký tool & người thực hiện</summary><ul class="history">' + (logs || '<li>Chưa có thao tác.</li>') + '</ul></details>');
  let right;
  if (staffRole === 'seller') {
    right = section('Phản hồi từ người bán', '<p class="review-warning">' + esc(state.sellerRequest || 'Chưa gửi yêu cầu phản hồi chính thức; hạn phản hồi chưa bắt đầu.') + '</p><p class="muted">Xem khiếu nại, bản lúc đặt và số tiền ' + money(f.price) + '. Bạn có quyền đồng ý hoàn; chỉ trưởng nhóm được đóng khiếu nại theo hướng từ chối.</p><label class="field-label" for="seller-text">Phản hồi kèm bằng chứng mẫu</label><textarea id="seller-text" rows="5" maxlength="2000">' + esc(state.sellerReply || f.seller) + '</textarea><div class="decision-actions">' +
      button('Phản hồi kèm bằng chứng', 'seller-reply', { disabled: !state.receipt || !!state.decision }) +
      button('Đồng ý trả hàng – hoàn tiền', 'seller-refund', { className: 'primary-button', disabled: !!T4.gate(state, 'refund', 'SELLER-DEMO') }) +
      '</div><p class="small muted">Chỉ mở khi có biên nhận yêu cầu. Không có nút từ chối hoặc phạt shop.</p>') + section('Thời hạn ' + num(7), deadlines());
  } else {
    const refundBlock = T4.gate(state, 'refund', 'MANAGER-DEMO');
    const rejectBlock = T4.gate(state, 'reject', 'MANAGER-DEMO');
    right = section('Quyết định của trưởng nhóm ' + num(8), '<p class="muted">Căn cứ hai phía được đặt song song. AI không soạn đề xuất từ chối.</p><label class="field-label" for="decision-reason">Lý do và nguồn quyết định</label><textarea id="decision-reason" rows="4" maxlength="1500" placeholder="Nêu căn cứ cụ thể sau khi xem hồ sơ…"></textarea><div class="decision-actions">' +
      button('Duyệt hoàn tiền mô phỏng', 'manager-refund', { className: 'primary-button', disabled: !!refundBlock }) +
      '<p class="lock-reason">' + esc(refundBlock || 'Có thể duyệt — cần lý do và hộp xác nhận cuối.') + '</p>' +
      button('Từ chối khiếu nại mô phỏng', 'manager-reject', { disabled: !!rejectBlock }) +
      '<p class="lock-reason">' + esc(rejectBlock || 'Có thể từ chối — cần lý do và xác nhận đã xem bản lúc đặt.') + '</p>' +
      button('Yêu cầu người bán phản hồi', 'ask-seller', { disabled: !state.receipt || state.askedAt !== null || state.key === 'K3' && !state.answer || !!state.decision }) +
      '</div><div class="policy-note"><strong>Giới hạn</strong><p>Xử phạt thuộc bộ phận chuyên trách. Im lặng của một bên không tự thành bằng chứng. Thiếu nguồn lúc đặt: giữ hồ sơ để nhân viên xác minh.</p><p>Loại ca: ' + esc(state.type) + '</p></div>') + section('Thời hạn ' + num(7), deadlines());
  }
  return roleBar + '<div class="agent-grid"><div class="main-column">' + left + '</div><div class="detail-column">' + right + '</div></div>';
}
function render() {
  $('case-id').textContent = state.fixture.id;
  $('demo-clock').textContent = 'Đồng hồ demo: ' + date(state.now) + ' (Việt Nam) · hạn trả hàng 7 ngày, người bán 24h, người mua bổ sung 48h, trưởng nhóm 24h — chính sách dựng.';
  $('fail-next').checked = state.failNext;
  $('missing-source').disabled = state.key !== 'K4';
  $('with-threat').disabled = state.key !== 'K3';
  $('unclear-label').disabled = state.key !== 'K3';
  $('workspace').innerHTML = (state.error ? '<div class="error-banner" role="alert">Chưa thực hiện được: ' + esc(state.error.tool) + '. Hồ sơ chưa xác nhận thành công. ' + button('Thử lại', 'retry') + '</div>' : '') + (view === 'buyer' ? buyer() : staff());
  $('page-title').textContent = view === 'buyer' ? 'Cùng làm rõ vấn đề của bạn.' : 'Mỗi quyết định, một căn cứ rõ ràng.';
  document.querySelectorAll('[data-view]').forEach(b => b.classList.toggle('active', b.dataset.view === view));
  const box = $('messages'); if (box) box.scrollTop = box.scrollHeight;
}
function reset() {
  state = T4.create($('scenario').value, { missingSource: $('missing-source').checked && $('scenario').value === 'K4', threat: $('with-threat').checked, variant: $('variant').value });
  clearTimeout(toastTimer); $('toast').hidden = true;
  state = T4.create($('scenario').value, { missingSource: $('missing-source').checked && $('scenario').value === 'K4', threat: $('with-threat').checked, unclearLabel: $('unclear-label').checked && $('scenario').value === 'K3' });
  pending = null; view = 'buyer'; staffRole = 'seller'; render();
}
function openSource(which) {
  const f = state.fixture;
  $('source-title').textContent = which === 'original' ? 'Bản lưu tại thời điểm đặt · ' + f.ordered : which === 'current' ? 'Trang hiện tại · ' + f.updated : 'Ảnh nhãn giả lập · người mua cung cấp';
  $('source-content').textContent = which === 'original' ? T4.source(state) ? f.original : 'Không có bản lưu.' : which === 'current' ? f.current : (state.labelReadable ? state.labelText : 'Ảnh tem mờ: chưa đọc rõ thông số') + '\n[Ảnh được mô phỏng bằng chữ; chưa kiểm định sản phẩm thực tế.]';
  $('source-dialog').showModal();
}
function confirm(type, actor) {
  const block = T4.gate(state, type, actor); if (block) { notify(block); return; }
  const reason = actor === 'SELLER-DEMO' ? $('seller-text').value.trim() : $('decision-reason').value.trim();
  if (!reason) { notify('Vui lòng nhập lý do và căn cứ trước khi quyết định.'); return; }
  pending = { type: type, actor: actor, reason: reason };
  $('confirm-title').textContent = type === 'refund' ? 'Đồng ý trả hàng – hoàn tiền?' : 'Từ chối và đóng khiếu nại?';
  $('confirm-description').textContent = 'Đơn ' + state.fixture.id + ' · ' + money(state.fixture.price) + '. ' + (type === 'refund' ? 'Tiền về người mua, khó đảo. Người bán chịu ảnh hưởng.' : 'Tiền về người bán, khó đảo. Người mua chịu ảnh hưởng.');
  $('confirm-reason').textContent = reason;
  $('confirm-review-label').textContent = actor === 'SELLER-DEMO' ? 'Tôi xác nhận là người bán, đã xem mô tả lúc đặt và số tiền; đồng ý phương án hoàn.' : 'Tôi là trưởng nhóm, đã xem bản mô tả lúc đặt, bằng chứng hai bên và các điều kiện mở quyết định.';
  $('confirm-review').checked = false; $('confirm-dialog').showModal();
}
function perform(action, value) {
  const draftBox = $('draft-text'); if (draftBox && state.draft && !state.stale) state.draft = draftBox.value;
  switch (action) {
    case 'reset': reset(); return;
    case 'no-order': $('scenario').value = 'K1'; configureVariants(); reset(); T4.route(state, 'hàng sai rồi, xử lý đi'); break;
    case 'choose': T4.choose(state); break;
    case 'answer': T4.answer(state, value); break;
    case 'evidence': T4.evidence(state, false); break;
    case 'none': T4.evidence(state, true); break;
    case 'prepare': T4.prepare(state); break;
    case 'discard': state.draft = null; state.stale = false; break;
    case 'submit': T4.submit(state, draftBox ? draftBox.value : state.draft); break;
    case 'transfer': T4.transfer(state); break;
    case 'ask-seller': T4.askSeller(state); break;
    case 'seller-reply': T4.sellerReply(state, $('seller-text').value); break;
    case 'seller-refund': confirm('refund', 'SELLER-DEMO'); return;
    case 'manager-refund': confirm('refund', 'MANAGER-DEMO'); return;
    case 'manager-reject': confirm('reject', 'MANAGER-DEMO'); return;
    case 'role': staffRole = value; break;
    case 'advance48': T4.advance(state, 48); break;
    case 'advance24': T4.advance(state, 24); break;
    case 'source': openSource(value); return;
    case 'wrong-source': T4.correctSource(state); break;
    case 'correction': $('correction-input').value = state.label ? state.labelText : ''; $('correction-dialog').showModal(); return;
    case 'cancel-correction': $('correction-dialog').close(); return;
    case 'cancel-confirm': $('confirm-dialog').close(); pending = null; return;
    case 'reopen': T4.correct(state, 'Người mua yêu cầu kiểm tra lại quyết định.'); break;
    case 'retry': {
      if (!state.error) return;
      const retry = state.error.retry;
      if (retry === 'submit') T4.submit(state);
      else if (retry === 'buyerEvidence') T4.requestBuyerEvidence(state);
      else if (retry === 'askSeller') T4.askSeller(state);
      else if (retry === 'transfer') T4.transfer(state);
      else if (retry === 'sellerReply') { staffRole = 'seller'; view = 'staff'; notify('Kiểm tra nội dung rồi bấm gửi phản hồi lại.'); }
      else if (retry === 'decision' && pending) { const box = pending.actor === 'SELLER-DEMO' ? $('seller-text') : $('decision-reason'); if (box) box.value = pending.reason; confirm(pending.type, pending.actor); return; }
      else if (retry === 'reviewClosed') { T4.correct(state, 'Người mua yêu cầu kiểm tra lại quyết định.'); }
      else if (retry === 'correction') { notify('Mở Sửa thông tin để gửi lại bản đính chính.'); }
      break;
    }
  }
  render();
}
document.addEventListener('click', event => {
  const b = event.target.closest('button'); if (!b || b.disabled) return;
  if (b.dataset.view) { const draft = $('draft-text'); if (draft && state.draft && !state.stale) state.draft = draft.value; view = b.dataset.view; render(); }
  else if (b.dataset.action) perform(b.dataset.action, b.dataset.value);
});
document.addEventListener('submit', event => {
  if (event.target.id === 'chat-form') { event.preventDefault(); const text = $('chat-input').value.trim(); if (!text) return; T4.route(state, text); render(); }
  if (event.target.id === 'correction-form') { event.preventDefault(); const text = $('correction-input').value.trim(); if (!text) return; T4.correct(state, text); $('correction-dialog').close(); render(); }
  if (event.target.id === 'confirm-form') { event.preventDefault(); if (!pending || !$('confirm-review').checked) return; const ok = T4.decide(state, pending.type, pending.actor, pending.reason, true); $('confirm-dialog').close(); if (ok) { pending = null; notify('Quyết định mô phỏng đã được ghi log với mã người duyệt.'); } render(); }
});
function configureVariants() {
  const variants = { K3: [['default', 'tem đọc rõ'], ['anh_tem_mo', 'anh_tem_mo · chưa đọc được']], K4: [['default', 'chưa có nhãn'], ['co_anh_nhan', 'co_anh_nhan · đã có ảnh'], ['thieu_ban_luc_dat', 'thieu_ban_luc_dat']], K9: [['co_bien_nhan', 'có biên nhận · người bán quá hạn'], ['chua_co_bien_nhan', 'chua_co_bien_nhan · mới nhắn chat']] };
  const items = variants[$('scenario').value] || [['default', 'mặc định theo spec']];
  $('variant').innerHTML = items.map(item => '<option value="' + esc(item[0]) + '">' + esc(item[1]) + '</option>').join('');
  $('variant').value = items[0][0];
}
$('scenario').onchange = () => { $('missing-source').checked = false; configureVariants(); reset(); };
$('variant').onchange = reset;
$('missing-source').onchange = reset;
$('with-threat').onchange = reset;
$('unclear-label').onchange = reset;
$('fail-next').onchange = () => { state.failNext = $('fail-next').checked; };
configureVariants();
reset();}
