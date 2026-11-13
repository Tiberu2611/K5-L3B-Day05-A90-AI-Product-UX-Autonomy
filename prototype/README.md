# Resolve / T4 — hướng dẫn bản final

Mở **index.html** bằng Chrome/Edge. Không cần dependency hoặc API key; font mạng có font dự phòng. Hướng dẫn tổng thể: [README gốc](../README.md), [spec](../spec.md), [checklist nộp](../SUBMISSION.md).

Toàn bộ dữ liệu và thao tác là dựng. Không AI thật, OCR, upload ảnh thật, backend hoặc chuyển tiền. Tải lại trang / Bắt đầu lại sẽ đặt lại phiên.

## Chọn ca và biến thể

| Ca | Mã đơn | Nội dung / biến thể |
|---|---|---|
| K1 | DH-2611-001 | Size L nhận M; shop xác nhận trong luồng chính thức |
| K2 | Chưa chọn đơn | Dùng nút “K2 · Thử hỏi khi chưa chọn đơn” |
| K3 | DH-2611-002 | Tổng 6L / giỏ 5L; tem rõ hoặc anh_tem_mo; có/không lời doạ |
| K4 | DH-2611-003 | Cotton: bản 02/11 khác trang 07/11; chưa có nhãn / co_anh_nhan / thieu_ban_luc_dat |
| K5 | DH-2611-004 | Đã có hai ảnh toàn cảnh, chỉ thiếu ảnh cận nhãn chất liệu |
| K6 | DH-2611-005 | Nghi hàng giả: chuyển chuyên trách, không phạt |
| K7 | DH-2611-006 | Xin liên hệ: giữ riêng tư, kênh và thời gian phản hồi |
| K8 | DH-2611-007 | Lịch sử shop không thay bằng chứng của đơn |
| K9 | DH-2611-008 | Có biên nhận sẵn ngày 11/11 / chua_co_bien_nhan |
| K10 | DH-2611-009 | Sai màu và đổi địa chỉ: xử lý riêng hai yêu cầu |

Chọn tình huống/biến thể rồi **Chọn đơn**. Không có thao tác gửi cho shop trước khi người mua xác định đơn.

## Luồng demo chính

1. **Người mua:** xem [3] nguồn lúc đặt, [4] thông tin còn thiếu. Bổ sung nhãn mẫu hoặc chọn không có. Ảnh mẫu được biểu diễn bằng chữ.
2. **Chuẩn bị yêu cầu:** AI chỉ soạn nháp. Người mua xem/sửa rồi tự bấm Gửi để có biên nhận. Chat và nháp chưa gửi không bảo lưu hạn.
3. **Xử lý hồ sơ / Người bán:** đọc câu hỏi, bằng chứng và số tiền. Có phản hồi hoặc Đồng ý trả hàng–hoàn tiền qua hộp xác nhận; không có quyền từ chối khiếu nại.
4. **Trưởng nhóm [8]:** quyết định khóa kèm lý do tới khi đúng quyền và đủ điều kiện. Điền căn cứ và tích xác nhận trước khi hoàn/từ chối mô phỏng.
5. **Đính chính [5]:** giữ nguồn và lịch sử, khóa nháp cũ tới khi chuẩn bị lại; đã gửi thì gửi bản đính chính, không giả vờ thu hồi tin/tiền.

## Rút / trả lại hồ sơ

- Chuyển tự nguyện ở ca thường: người mua có **Rút yêu cầu chuyển đang chờ**; trưởng nhóm có **Trả hồ sơ về luồng bổ sung**.
- Không thay biên nhận, bằng chứng, hạn người bán hoặc log đã có.
- Thiếu nguồn, ca chuyên trách, chuyển bắt buộc do quá hạn, nhân viên đã trễ hoặc đã có quyết định: không rút để bỏ qua kiểm tra; nút khóa kèm lý do ở [8].
- Đây là hoàn tác trạng thái hàng chờ, không hoàn tác chuyển tiền hay xóa thông báo.

## Ca lạ và giới hạn phạm vi

- “mình chưa nhận được hàng mà app báo giao rồi” → hướng dẫn giao nhận; không xin ảnh sản phẩm chưa nhận.
- “đổi số điện thoại nhận hàng của mình” → hướng dẫn kênh đổi thông tin, nói chưa đổi.
- “cho mình địa chỉ kho shop để gửi trả” → hướng dẫn gửi trả chính thức, không đoán địa chỉ riêng.
- “sai màu, tiện đổi địa chỉ” → xử lý khiếu nại màu và tách yêu cầu đổi địa chỉ.
- Tin chỉ nhắc tiếng xấu shop không bị gọi là lời doạ.
- Câu ngoài luồng thuần túy hiện hướng dẫn riêng. Người mua chủ động bấm **Tiếp tục khiếu nại của đơn đã chọn** để quay lại luồng gốc.

## Lỗi và thời gian

Bật lỗi trước thao tác gửi/chuyển/xin bằng chứng/rút hồ sơ. Thất bại không có biên nhận hoặc thông báo thành công giả; Thử lại thành công có xác nhận.

Đồng hồ nghiệp vụ bắt đầu 15:00 13/11/2026. Chính sách dựng: trả hàng 7 ngày kể từ nhận; người bán 48 giờ sau khi gửi thành công; người mua bổ sung 48 giờ; trưởng nhóm 24 giờ sau khi nhận hồ sơ.

+24h không đủ làm người bán hết hạn. +48h chỉ chuyển xử lý, không tự quyết tiền. Sau 24h nhân viên chưa quyết: báo quản lý ca. Biên nhận K9 sẵn lúc 14:00 11/11, nên thật sự quá 48h vào lúc demo.

## Bằng chứng và kiểm thử

- [Final](final-evidence/README.md): 38/38 kiểm thử hồi quy, 14/14 nghiệm thu model, 9/9 ca lạ model; có hash nguồn.
- [Ảnh/báo cáo Chrome baseline](ux-evidence/README.md): 26/26 lượt và 14 ảnh của TV2 trước lượt sửa final.
- Final chưa được chạy lại trên trình duyệt vì công cụ browser không khả dụng; không tính Chrome baseline thành kiểm final. Cần bấm lại nhanh trước demo.
- Lịch sử kết quả cũ đã tách khỏi spec: [verification-before-final](../docs/history/verification-before-final.md).

Chạy từ gốc repo:

    node prototype/model.test.cjs > prototype/final-evidence/model-tests.tap
    node prototype/verify-final.cjs

Giới hạn: bộ định tuyến minh họa theo quy tắc; không đảm bảo hiểu mọi cách nói. Thiếu nguồn và kiểm tra lại sau đóng dừng ở chuyển người. Không có bonus AI thật hoặc xác nhận đã demo trước lớp.
