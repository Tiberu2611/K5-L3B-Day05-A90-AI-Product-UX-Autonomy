# TV2 — kết quả kiểm tra UX trên Chrome

- Trình duyệt: Chrome/157.0.8103.52.
- Viewport: desktop 1440×1000; mobile 390×844.
- Phương pháp: Native Chrome headless + CDP; click DOM controls and submit real forms; no direct state mutation in test cases; fixture controls use change events. Remote font blocked to verify fallback.
- Kết quả: **26/26**; lỗi JavaScript: 0.
- Dữ liệu và thời gian đều dựng. Đây không phải kết quả dùng AI thật hoặc demo trước lớp.

| Mã | Nội dung | Kết quả |
|---|---|---|
| UX01 | K2: chọn đơn trước khi gửi ra ngoài | Pass |
| UX02 | K3: G10 hỏi một câu; G11 có nguồn và ba lựa chọn | Pass |
| UX03 | K3: đo giỏ không gửi shop, không kết luận thắng thua | Pass |
| UX04 | K3: lời doạ không đổi nhánh và log | Pass |
| UX05 | K3: tem mờ không trích số chưa đọc; có bổ sung/thay đường | Pass |
| UX06 | K4: bản 02/11 và 07/11; xin đúng nhãn, có lý do | Pass |
| UX07 | K4: không có bằng chứng vẫn có chuyển người và dự kiến | Pass |
| UX08 | K4: thiếu nguồn dừng kết luận; trưởng nhóm chưa duyệt được | Pass |
| UX09 | G9: sửa tại chỗ giữ nguồn, khóa nháp cũ và lập lại nháp | Pass |
| UX10 | G9: đã gửi thì đính chính, giữ biên nhận và tin cũ | Pass |
| UX11 | K4: AI dùng sai nguồn nhận lỗi và giữ đính chính | Pass |
| UX12 | Gửi yêu cầu lỗi: không biên nhận giả, có thử lại thành công | Pass |
| UX13 | Chuyển người lỗi: không báo đã chuyển; thử lại có dự kiến | Pass |
| UX14 | Yêu cầu bằng chứng shop lỗi: hạn chưa chạy, thử lại đúng đơn | Pass |
| UX15 | Shop nhận câu hỏi cụ thể; [8] khóa lý do chờ hai phía | Pass |
| UX16 | 48h / 24h: chuyển và báo chậm, không tự quyết tiền | Pass |
| UX17 | Đường bình thường K1: người bán duyệt qua xác nhận, không chờ trưởng nhóm | Pass |
| UX18 | Sau đóng: chỉ chuyển đề nghị kiểm tra, không tự mở hay lấy lại tiền | Pass |
| UX19 | K7: kênh chính thức + dự kiến khi chưa gửi và khi có hạn | Pass |
| UX20 | K6: đúng thứ tự tin, vẫn xử lý đơn, lời doạ tách ngữ cảnh | Pass |
| UX21 | K8 xấp xỉ: tiếng xấu không thay bằng chứng riêng | Pass |
| UX22 | K10 xấp xỉ: đổi địa chỉ của mình không bị hiểu là xin liên hệ | Pass |
| UX23 | K9: nháp/chat không phải biên nhận trong hạn | Pass |
| UX24 | Desktop và mobile: không tràn ngang, nhãn HAX và dialog dùng được | Pass |
| UX25 | K5: giữ hai ảnh toàn cảnh, chỉ xin đúng nhãn thiếu một lần | Pass |
| UX26 | K9: biên nhận có sẵn từ 11/11 và người bán quá hạn 48h | Pass |

Chi tiết trạng thái, tin nhắn, nhật ký và SHA-256 của mã được kiểm tra: [results.json](results.json).
