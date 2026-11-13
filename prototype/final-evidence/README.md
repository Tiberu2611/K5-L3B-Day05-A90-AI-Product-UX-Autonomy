# Bằng chứng final — A90 / T4

Ngày ghi nhận: 2026-11-13T05:43:40.134Z. Thời gian nghiệp vụ và dữ liệu đều dựng.

**38/38 kiểm thử hồi quy đạt; 14/14 lượt nghiệm thu model đạt.** Có kiểm tra dựng HTML trong DOM giả. Không coi đây là kết quả bấm lại trên trình duyệt hoặc demo trước lớp.

| Mã | Ca | Điều đã kiểm | Kết quả |
|---|---|---|---|
| F01 | K1 · default | Hướng dẫn, nháp, người mua gửi, người bán xác nhận | Pass tự động |
| F02 | K2 · default | Hỏi đúng đơn, không gửi cho shop | Pass tự động |
| F03 | K3 · default | Phân biệt tổng/giỏ; hỏi trước, không hoàn theo lời doạ | Pass tự động |
| F04 | K3 · anh_tem_mo | Không trích thông số chưa đọc, chỉ xin ảnh rõ | Pass tự động |
| F05 | K4 · default | Dùng bản lúc đặt, xin đúng nhãn còn thiếu | Pass tự động |
| F06 | K4 · co_anh_nhan | Không xin lại nhãn; chỉ soạn khi người mua chọn | Pass tự động |
| F07 | K4 · thieu_ban_luc_dat | Thiếu nguồn thì dừng kết luận, chuyển người | Pass tự động |
| F08 | K5 · default | Giữ hai ảnh toàn cảnh, chỉ xin nhãn một lần | Pass tự động |
| F09 | K6 · default | Chuyển chuyên trách; vẫn hỗ trợ đơn, không phạt | Pass tự động |
| F10 | K7 · default | Giữ liên hệ riêng tư, nêu kênh và dự kiến 48 giờ | Pass tự động |
| F11 | K8 · default | Xét bằng chứng riêng, không gọi đánh giá shop là lời doạ | Pass tự động |
| F12 | K9 · co_bien_nhan | Tra biên nhận 11/11 trong hạn, chuyển khi quá 48 giờ | Pass tự động |
| F13 | K9 · chua_co_bien_nhan | Chat/nháp không thay biên nhận; hướng dẫn gửi ngay | Pass tự động |
| F14 | K10 · default | Tách đổi địa chỉ, vẫn xử lý khiếu nại sai màu | Pass tự động |

**9/9 ca lạ L1–L9 đã kiểm lại ở model: Pass.** Chi tiết và log riêng được lưu trong JSON.

Nguồn, tin nhắn, actor, tool và thời điểm từng lượt: [results.json](results.json). Kết quả kiểm thử: [model-tests.tap](model-tests.tap).

Bộ ảnh [UX baseline](../ux-evidence/README.md) được tạo trước lượt sửa final. Các vị trí [1]–[8] và bố cục chính giữ nguyên; nút rút/trả hồ sơ và câu chữ final chưa được chụp lại vì công cụ browser không khả dụng trong phiên hoàn thiện. Không gán 26/26 lượt Chrome cũ thành lượt kiểm của nguồn final.

Chạy lại từ gốc repo (có Node.js):

    node prototype/model.test.cjs > prototype/final-evidence/model-tests.tap
    node prototype/verify-final.cjs

Mọi hash ở results.json được chuẩn hóa LF để không báo lệch chỉ vì Windows đổi CRLF. Nếu sửa nguồn, cần chạy lại hai lệnh trên.
