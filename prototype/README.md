# Resolve / T4 — prototype A90 theo spec

Mở **index.html** trực tiếp bằng trình duyệt. Không cần cài thư viện hoặc API key. Font có fallback khi offline.

Bản này theo spec A90 commit **52d8c1b** (§1–§4, §6). Sản phẩm nền trong spec là **Trò chuyện với Shopee**, nên nhãn LazResolve/Lazada của bản khung trước đã đổi thành Resolve / T4. Đây là concept độc lập, không liên kết với Shopee. Toàn bộ hồ sơ, shop, ảnh, thao tác và thời gian là dựng.

## Bố cục

- Màn người mua: chat, chọn đơn, [1] giới hạn AI, [2] trạng thái, [3] nguồn, [4] thông tin thiếu, [5] sửa, [6] chuyển người, [7] thời hạn.
- Màn xử lý hồ sơ: đổi vai **Người bán / Trưởng nhóm [8]**. Hai vai cùng làm việc trên một hồ sơ.
- Dữ liệu ở bộ nhớ; tải lại trang hoặc Bắt đầu lại sẽ xóa phiên demo. Không backend, không AI thật, không tiền thật, không upload ảnh thực. Ảnh nhãn được mô phỏng bằng chữ.

## Kịch bản demo

### K3 — dung tích tổng / giỏ, người bán có thể đúng

1. Chọn K3, bấm **Chọn đơn**.
2. Xem bản lúc đặt 03/11 “Dung tích tổng 6L”, ảnh tem “Tổng 6.0L · Giỏ chiên 5.0L”.
3. Chọn **Giỏ chiên**: AI giải thích khác đại lượng; không gửi yêu cầu bằng chứng cho shop chỉ vì lời doạ.
4. Chạy lại với **Toàn bộ khoang** hoặc **Không rõ**; chuẩn bị nháp và tự gửi.
5. Xem biên nhận, hạn người bán 48 giờ và nhật ký. Lời doạ chỉ nằm trong ngữ cảnh của màn xử lý.
6. So sánh khi tắt “K3: có lời doạ”: cùng câu trả lời về phép đo dẫn tới cùng nhánh tool và không có giao dịch tài chính tự động.

### K4 — mô tả chất liệu đổi sau khi đặt

1. Chọn K4, chọn đơn.
2. Xem hai nguồn: 02/11 “100% cotton”; 07/11 “cotton pha polyester 65/35”.
3. Bổ sung ảnh nhãn mẫu hoặc **Tôi không có bằng chứng này**. Không yêu cầu thử đốt vải.
4. Chuẩn bị nháp; sửa nội dung và bấm gửi để nhận biên nhận. Nháp/chat không giữ hạn thay cho biên nhận.
5. Nhờ nhân viên xem xét. Trong Xử lý hồ sơ / Trưởng nhóm, nút bị khóa kèm lý do khi người bán chưa phản hồi.
6. Đổi sang Người bán, gửi phản hồi mẫu. Trưởng nhóm có thể duyệt hoàn; từ chối còn cần điều kiện người mua đã trả lời/không có/hết hạn.
7. Điền lý do; bấm quyết định; tích xác nhận xem nguồn tại hộp cuối. Nhật ký lưu tool, người duyệt, thời điểm, căn cứ.

Nhánh phụ:
- Bật **K4: thiếu bản lúc đặt** trước khi chọn đơn: không kết luận từ trang hiện tại, chuyển nhân viên; trưởng nhóm chưa quyết được khi chưa xác minh nguồn.
- **Demo AI dùng sai nguồn**: giữ câu sai với nhãn đã đính chính, nhận lỗi chọn phiên bản, chuyển người.
- **Sửa thông tin AI đọc sai [5]**: lưu thay đổi; nháp cũ bị khóa gửi cho tới khi chuẩn bị lại. Đã gửi thì gửi đính chính, không giả vờ thu hồi tin.
- Sau quyết định, yêu cầu kiểm tra lại chỉ chuyển đề nghị, không tự mở khiếu nại hoặc lấy lại tiền.

### K1 — đường nhanh không cần trưởng nhóm

Chọn đơn → thêm ảnh size mẫu → chuẩn bị và gửi → màn Người bán → Đồng ý trả hàng–hoàn tiền → xác nhận. Không tin lời người mua nói “shop đã nhận” thay cho nút xác nhận chính thức.

### K9 — ngày cuối gửi yêu cầu

Đồng hồ khởi tạo 15:00 ngày 13/11/2026, nhận hàng 06/11. Hạn 7 ngày đến hết 13/11. Chỉ gửi thành công mới có biên nhận trong hạn; gửi sau hạn có nhãn cần nhân viên kiểm tra, không hứa chắc được hoàn.

## Thử lỗi và quá hạn

- Bật **Thao tác gửi/chuyển kế tiếp bị lỗi** rồi gửi yêu cầu / chuyển hồ sơ / gửi phản hồi / xác nhận quyết định. Không hiện thành công; có thử lại.
- **+48h**: hết hạn người bán thì chuyển trưởng nhóm; hết hạn bổ sung người mua không tự đóng. Im lặng không tự là bằng chứng bên nào sai.
- **+24h** sau khi chuyển trưởng nhóm: báo quản lý ca và hiển thị chậm dự kiến; AI không quyết thay.
- Các thời hạn 7 ngày (trả hàng) / 48 giờ (người bán, hạn bổ sung người mua) / 24 giờ (trưởng nhóm) là quy tắc dựng, khớp `spec.md` §1.7, §3 và §4.3.
- Chat có bộ quy tắc minh họa C1–C6 cho xin liên hệ, nghi hàng giả, lời doạ và yêu cầu ngoài luồng. Không phải bộ phân loại AI đầy đủ.

## Kiểm thử

Chạy từ gốc repo:

    node prototype/model.test.cjs

17 kiểm thử: cổng chọn đơn, nháp/biên nhận, đường người bán duyệt, cấm AI/người mua quyết, câu hỏi K3, lời doạ, thiếu nguồn K4, khóa hai bên, hết hạn, lỗi thao tác, đính chính, K9 và render smoke. Đây là kiểm thử model và dựng HTML trong DOM giả, chưa thay thế kiểm tra trình duyệt.

## Còn cần nhóm xác minh

- Chụp 1–2 ảnh giao diện có nhãn [1]–[8] và kiểm tra trực quan desktop/mobile; công cụ trình duyệt không khả dụng trong phiên triển khai.
- Quy trình nhân viên khôi phục nguồn lúc đặt, khiếu nại lại sau đóng và xử lý sự cố đúng ngày cuối chỉ được thể hiện bằng chuyển hồ sơ; chưa có hệ thống vận hành thật.
- Quyền theo vai chỉ để demo, không phải xác thực hoặc kiểm soát truy cập trên server.
