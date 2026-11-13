# LAB5 — T4 · Nhóm A90 · Bản final

Prototype thiết kế trợ lý khiếu nại “hàng không đúng mô tả”, trong concept Trò chuyện với Shopee.

## Mở bài

1. Đọc [spec.md](spec.md).
2. Mở [prototype/index.html](prototype/index.html) bằng Chrome hoặc Edge.
3. Xem [hướng dẫn demo](prototype/README.md).
4. Kiểm tra [bằng chứng final](prototype/final-evidence/README.md).

Không cần cài dependency hoặc API key. Tất cả đơn hàng, ảnh mô tả bằng chữ, người dùng, shop, tiền và thời gian đều dựng. Không liên kết với Shopee; không có giao dịch, OCR hoặc AI thật.

## Kết quả của bản final

- 38/38 kiểm thử model, quyền, lỗi/thử lại và dựng HTML trong DOM giả.
- 14/14 ca nghiệm thu tự động K1–K10 và biến thể.
- 9/9 ca lạ L1–L9 đã kiểm lại bằng model.
- Nút rút yêu cầu chuyển / trưởng nhóm trả hồ sơ có điều kiện; không xóa lịch sử, không bỏ qua kiểm tra bắt buộc.
- Báo cáo cuối có log, actor, timestamp và hash nguồn chuẩn hóa LF tại prototype/final-evidence/results.json.

Bộ ảnh UX-A1/UX-A2 và 26 lượt Chrome của TV2 được giữ làm bằng chứng baseline cho bố cục và nguyên tắc HAX. Phiên hoàn thiện final không truy cập được công cụ browser, nên không khẳng định đã chạy lại 26 lượt Chrome hoặc chụp ảnh các nút mới. Cần bấm lại nhanh trước demo; checklist ở [SUBMISSION.md](SUBMISSION.md).

## Chạy kiểm thử

Cần Node.js 22+:

    node prototype/model.test.cjs > prototype/final-evidence/model-tests.tap
    node prototype/verify-final.cjs

Lệnh thứ hai xuất kết quả 14 ca, 9 ca lạ và hash nguồn; không dùng trình duyệt.

## Thành viên và nộp bài

Danh sách, mã học viên và phân công ở đầu spec. Người dùng đã xác nhận giảng viên chấp nhận nhóm 4 người.

Repo đã được kiểm qua GitHub API không đăng nhập: công khai, không phải fork. Tên repo hiện tại chưa theo mẫu có T4; tên đúng đề xuất: **K5-L3B-Day05-T4-A90**. Chưa đổi tên repo từ phiên hoàn thiện này.

Bằng chứng demo trước TA/lớp và ca lạ do người xem đưa: chờ nhóm xác nhận; không tính kiểm thử tự động là demo. Không có bonus AI thật.
