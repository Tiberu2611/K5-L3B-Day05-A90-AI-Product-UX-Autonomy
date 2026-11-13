# LazResolve — khung prototype Track 4

Mở `index.html` bằng trình duyệt. Không cần cài thư viện hoặc API key. Font trực tuyến có fallback khi offline.

Concept học tập độc lập lấy cảm hứng từ Lazada, không liên kết với Lazada. Tất cả đơn hàng, shop, bằng chứng và hành động đều là giả lập. Không có AI thật, backend, upload tệp hoặc giao dịch tài chính. Dữ liệu chỉ tồn tại trong bộ nhớ và được đặt lại khi tải trang.

## Luồng demo

1. Chọn K4 (mô tả bị sửa), K5 (tem đúng, cách đo khác nhau) hoặc K1 (giao sai size).
2. Tại màn hình người mua: xem bằng chứng, bổ sung bằng chứng mẫu, thử sửa thông tin bằng chat.
3. Bấm **Chuyển hồ sơ cho nhân viên**.
4. Mở **Bàn xử lý nhân viên**, xem hai phiên bản mô tả, lời hai bên và lịch sử.
5. Có thể yêu cầu bổ sung. Để quyết định, tích xác nhận đã xem bằng chứng và nhập lý do tối thiểu 12 ký tự.
6. Chọn hoàn tiền hoặc từ chối, xem hộp xác nhận. Hủy để quay lại; xác nhận để cập nhật kết quả mô phỏng.
7. Quay về người mua để thấy kết quả; **Bắt đầu lại** để chạy lại ca.

## Nguyên tắc và mức tự chủ

| Vị trí | Nguyên tắc | Thể hiện |
|---|---|---|
| ① Căn cứ đang có | G2 | Phân biệt dữ kiện có nguồn và phần chưa xác minh |
| ② Bổ sung bằng chứng / sửa thông tin | G9 | Người dùng có đường bổ sung, sửa sai |
| Bàn xử lý, khối cảnh báo | G10 | Mâu thuẫn hoặc thiếu nguồn thì thu hẹp kết luận |
| ③ Quyết định của nhân viên | Cần duyệt | Chỉ mở thao tác sau khi chuyển hồ sơ, xác nhận kiểm tra và ghi lý do; có hộp xác nhận lần cuối |
| Chuyển hồ sơ / ghi nhận thông tin | Tự làm | AI mô phỏng tiếp nhận và chuyển hồ sơ, không tự quyết định tài chính |
| Phạt shop / tiết lộ thông tin riêng | Cấm | Không có nút thực hiện |

Tin đã gửi không thể thu hồi: người dùng sửa bằng một nội dung bổ sung và lịch sử giữ dấu vết, không hứa hoàn tác việc đã thông báo.

## Phần thành viên khác cần chốt

- Đối chiếu chính sách tự chủ với `spec.md` §4; cơ chế phản hồi của người bán, thời hạn, người nhận và quá hạn chưa được triển khai.
- Fixture mô tả lúc đặt là giả định thiết kế; cần mô tả nguồn và trường hợp không có bản lưu trong spec.
- Quyết định nhân viên hiện là mô phỏng điều kiện UI, chưa có kiểm định tính đầy đủ của bằng chứng hoặc phân quyền thật.
- Chat ghi nhận văn bản bằng phản hồi cố định, không phân loại ý định hay trả lời ca lạ bằng AI.
- Thêm 1–2 ảnh chụp đánh số để hoàn thành bằng chứng bài nộp; repo công khai và việc đổi sản phẩm nền cần nhóm chốt riêng.
