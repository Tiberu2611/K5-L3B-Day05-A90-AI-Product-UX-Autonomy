# TV2 — bằng chứng UX và cách chạy lại

Ngày kiểm: **13/11/2026**. **26/26 lượt Chrome Pass**, **27/27 kiểm thử model Pass**, **0 lỗi JavaScript runtime**. Tất cả dữ liệu và thời gian nghiệp vụ đều dựng.

Hai ảnh chính dùng trong spec §5.4:

- **UX-A1:** [01-k3-g10-g11-desktop.png](01-k3-g10-g11-desktop.png) — [1] giới hạn AI, [2] trạng thái, [3] nguồn/G11, [4] hỏi phần đo/G10, [5] sửa, [6] chuyển, [7] hạn riêng.
- **UX-A2:** [05-g9-sua-tai-cho.png](05-g9-sua-tai-cho.png) — [5] hộp sửa/G9, nháp cũ bị khóa gửi, nguồn vẫn giữ.

Ảnh bổ sung:

| File | Nội dung |
|---|---|
| [02](02-k3-tem-mo.png) | K3 tem mờ, không trích thông số chưa đọc |
| [03](03-k4-nguon-va-bang-chung.png) | K4 hai phiên bản và bằng chứng thiếu |
| [04](04-k4-thieu-nguon-khoa-duyet.png) | Thiếu nguồn thì không quyết |
| [06](06-k4-dinh-chinh-sai-nguon.png) | AI nhận lỗi dùng sai nguồn, giữ đính chính |
| [07](07-gui-loi-va-thu-lai.png) | Gửi thất bại, có thử lại, chưa có biên nhận |
| [08](08-truong-nhom-khoa-duyet.png) | [8] khóa quyết định, hiện lý do và hạn |
| [09](09-k7-kenh-va-thoi-gian.png) | K7 kênh có lưu vết và dự kiến theo trạng thái |
| [10](10-k9-bien-nhan.png) | K9 biên nhận và mốc trong hạn |
| [11](11-k3-mobile-390.png) | K3 ở 390×844, không tràn ngang |
| [12](12-g9-mobile-390.png) | Hộp sửa G9 trên mobile |

Chạy từ gốc repo:

```powershell
node prototype/model.test.cjs
node prototype/ux-audit.cjs
```

Cần Node.js 22+ và Chrome. Script mặc định dùng Chrome tại `C:/Program Files/Google/Chrome/Application/chrome.exe`; máy khác đặt `CHROME_PATH` tới trình duyệt. Script mở Chrome ẩn với profile demo riêng, phục vụ file chỉ trên 127.0.0.1, bấm các nút/form của DOM và tự đóng sau khi kiểm. Không cần tải thư viện; font mạng bị chặn để kiểm fallback. Chạy lại sẽ ghi đè báo cáo và ảnh trong thư mục này.

[Bảng 26 lượt](README.md) và [results.json](results.json) lưu tin nhắn/trạng thái/log cùng SHA-256 của model.js, app.js, styles.css, index.html đã được kiểm. Ảnh được chụp trực tiếp bằng Chrome, không dựng lại.

Giới hạn: mô phỏng ảnh bằng chữ, không OCR/AI thật hay upload; K6–K8/K10 chạy trên đơn dựng gần nhất. Đã kiểm fixture riêng K5 và K9 có biên nhận sẵn ở UX25–UX26. Chưa có đổi đơn/thay file mà vẫn giữ nháp. Viewport mobile không thay điện thoại vật lý. Đây là kiểm tra UX của TV2, không phải demo trước lớp hoặc xác nhận vận hành thật. Bộ ảnh `anh-s7` TV1 nhắc tới không có trong checkout; không gán các ảnh mới thành bộ ảnh cũ.
\nẢnh bổ sung: [K5 giữ hai ảnh và chỉ xin nhãn](13-k5-khong-hoi-lap.png), [K9 biên nhận có sẵn từ 11/11](14-k9-bien-nhan-co-san.png). Hạn người bán 48 giờ, người mua bổ sung 48 giờ, trưởng nhóm 24 giờ.\n