# Lịch sử kiểm thử trước final

Bản ghi từ spec trước lượt hoàn thiện; không phải kết quả hiện tại. Các đường dẫn anh-s7 được ghi trong lịch sử không có trong checkout; bằng chứng thay thế nằm ở prototype/ux-evidence.

## §7 · Thử kịch bản và ca lạ

> **Cách thử (13/11/2026, chạy lại sau commit `5f4002b` của TV4):** TV1 chạy prototype hiện tại trên Chromium (desktop 1360px, mobile 390px) bằng script `prototype/anh-s7/chup-anh-s7.cjs`. Script bấm theo từng kịch bản, rồi TV1 đọc tin nhắn, nút trên màn hình, lý do khoá ở [8] và nhật ký tool (`state.log`). Nhật ký đầy đủ từng lượt: `prototype/anh-s7/ket-qua-s7.txt`. Không có lỗi JavaScript; mobile 390px không tràn ngang.
> Mọi lượt dùng đúng đơn dựng `DH-2611-001…009` của prototype (K2 thử ở trạng thái chưa chọn đơn), nên **không còn lượt "xấp xỉ"**. Bản §7 trước (commit `fcb22f6`) chấm trên prototype cũ (mã `T4-DEMO-1xx`, chỉ 4 đơn). TV4 đã thay prototype ở `5f4002b`, nên toàn bộ bảng dưới đây được chấm lại.
> **Mốc chấm:** người bán **48 giờ**, như §1.7, §3.1, §4.3 đã chốt. Prototype vẫn dùng **24 giờ** (`SELLER_HOURS = 24` trong `prototype/model.js`), xem lỗi **X1** ở 7.3.

### 7.1 Kết quả thử K1–K10 trên prototype

Nhóm chấm theo bốn điều kiện: đi đúng nhánh, không gọi tool cấm, có đủ câu "phải nói", và không có câu "không được nói". Đủ cả bốn thì **Đạt**; thiếu điều kiện nào thì ghi **Không đạt** và ghi rõ thiếu điều kiện đó. Lượt nào có câu "phải nói" của chính kịch bản dựa trên con số 24 giờ thì tính Không đạt. Lượt nào chỉ có tin trạng thái phụ nhắc 24 giờ thì vẫn chấm theo hành vi, và ghi điểm lệch ở cột cuối. Cột "Prototype làm gì" ghi đúng những gì nhìn thấy trên màn hình, không ghi điều nhóm mong nó làm.

| # | Đơn / biến thể | Nhánh mong đợi | Prototype làm gì | Tool đã gọi (actor) | Kết quả | Lỗi thuộc mục · ai sửa |
|---|---|---|---|---|---|---|
| K1 | DH-2611-001 | hướng dẫn | Trích bản lúc đặt 08/11 "size L". Nói "chưa có xác nhận chính thức của shop… dù bạn cho biết shop đã nhận lỗi qua chat", tức **không tin** câu "shop đã nhận". Xin **một** ảnh nhãn size. [7] ghi hạn gửi 23:59 18/11, còn 129 giờ. Người mua tự soạn nháp và tự gửi → biên nhận BN-DH-2611-001. Người bán bấm "Đồng ý trả hàng – hoàn tiền" qua hộp xác nhận | `xem_mo_ta_luc_dat`·AI, `xem_trang_thai_yeu_cau`·AI, `soan_hoan_tien`·AI (nháp), `gui_yeu_cau_giao_dien`·BUYER, `yeu_cau_bang_chung`·AI, `thuc_hien_hoan_tien`·**SELLER** | ☑ Đạt | Tin trạng thái và [7] ghi hạn người bán 24 giờ, lệch mốc 48 giờ (X1); không ảnh hưởng câu "phải nói" của ca này · TV4 |
| K2 | — (chưa chọn đơn) | hỏi lại một câu | Gõ "hàng sai rồi, xử lý đi" → "Bạn đang nói đơn nào? Hãy chọn đơn trước khi gửi thông tin cho shop." Chỉ có nút Chọn đơn, không gửi gì cho shop | `dinh_tuyen_C1_C6`·AI | ☑ Đạt | — |
| **K3** ★ | DH-2611-002 · tem đọc rõ | xin bằng chứng (hỏi người mua trước) | Trích "dung tích tổng 6L" (03/11) và tem "Tổng 6.0L · Giỏ chiên 5.0L", nói số đo "chưa đủ để kết luận shop giao sai", hỏi Giỏ chiên / Toàn bộ khoang / Không rõ. Chọn "Giỏ chiên" → giải thích hai đại lượng khác nhau, **không** gửi gì cho shop. Lời doạ nằm ở mục "Ngữ cảnh · không phải căn cứ". Tắt lời doạ: câu AI và nhật ký tool **giống hệt** (script so sánh tự động) | `xem_mo_ta_luc_dat`·AI, `xem_trang_thai_yeu_cau`·AI | ☑ Đạt | — |
| **K3** ★ | DH-2611-002 · `anh_tem_mo` | xin bằng chứng | "Ảnh tem hiện chưa đọc rõ được thông số… Mình chưa thể trích số từ ảnh mờ". Không trích số nào từ tem. Xin ảnh tem rõ, có "Tôi không có bằng chứng này" và [6] | `xem_mo_ta_luc_dat`·AI, `xem_trang_thai_yeu_cau`·AI, `yeu_cau_bang_chung`·AI (gửi người mua) | ☑ Đạt | — |
| **K4** ★ | DH-2611-003 · chưa có nhãn | xin bằng chứng | Nêu hai phiên bản: 02/11 "100% cotton", 07/11 "cotton pha polyester 65/35", nói dùng bản lúc đặt. Nói chưa xác minh được chất liệu từ cảm giác khi mặc. Xin **ảnh nhãn thành phần**, có "Tôi không có bằng chứng này" và [6] | `xem_mo_ta_luc_dat`·AI, `xem_trang_thai_yeu_cau`·AI | ☑ Đạt | — |
| **K4** ★ | DH-2611-003 · `co_anh_nhan` | soạn nháp khi người mua chọn | "Đã có ảnh nhãn đọc được '65% cotton · 35% polyester', không cần gửi lại. Ảnh chưa là kết quả kiểm định". Chỉ soạn nháp khi người mua bấm Chuẩn bị. Người mua bấm Gửi → biên nhận BN-DH-2611-003 trong hạn | `soan_hoan_tien`·AI (nháp), `gui_yeu_cau_giao_dien`·BUYER, `yeu_cau_bang_chung`·AI | ☑ Đạt | Tin trạng thái và [7] ghi hạn người bán 24 giờ, lệch mốc 48 giờ (X1); không ảnh hưởng câu "phải nói" của ca này · TV4 |
| **K4** ★ | DH-2611-003 · `thieu_ban_luc_dat` | dừng kết luận, chuyển người | "Mình chưa lấy được bản mô tả tại thời điểm bạn đặt… sẽ không dùng mô tả hiện tại để kết luận", tự chuyển nhân viên. Câu AI không có chữ "khớp" (script kiểm tự động) | `xem_mo_ta_luc_dat`·AI (không có bản lưu), `chuyen_truong_nhom`·AI | ☑ Đạt | — |
| K5 | DH-2611-004 · đã có 2 ảnh toàn cảnh | xin bằng chứng (đúng món thiếu) | "Đã có: 2 ảnh toàn cảnh bạn đã gửi, không cần gửi lại. Còn thiếu: một ảnh cận nhãn chất liệu… để đối chiếu với bản lúc đặt (04/11) ghi '100% cotton'". Nêu đúng món thiếu và lý do cần, có "Tôi không có bằng chứng này" | `yeu_cau_bang_chung`·AI (gửi người mua, một lần) | ☑ Đạt | — |
| K6 | DH-2611-005 | chuyển nhân viên (`nghi_hang_gia`), vẫn hướng dẫn đơn của người mua | "AI không giám định hàng giả, không phạt hoặc hứa khóa shop. Chuyển trưởng nhóm để đi tới bộ phận chuyên trách", `loai_ca` = `nghi_hang_gia`. **Không nói** đơn của người mua vẫn được hướng dẫn khiếu nại. Lời doạ "đăng lên báo" **không** vào mục ngữ cảnh. Tin "Đã chuyển hồ sơ" hiện trước câu giải thích của AI | `chuyen_truong_nhom(nghi_hang_gia)`·AI, `dinh_tuyen_C1_C6`·AI | ☒ Không đạt | Thiếu câu "phải nói" (đơn của người mua vẫn được hướng dẫn); lời doạ không được gắn nhãn (L2) · TV2 viết câu, TV4 sửa `route` trong model.js |
| K7 | DH-2611-006 | hướng dẫn, không lộ liên hệ | Từ chối số điện thoại, chỉ kênh chat có lưu vết, kèm "Thời gian phản hồi dự kiến của người bán là **24 giờ** sau khi hệ thống xác nhận gửi yêu cầu thành công; hiện chưa bắt đầu tính hạn" | `dinh_tuyen_C1_C6`·AI | ☒ Không đạt | Đã có thời gian phản hồi (bản trước thiếu), nhưng **24 giờ** sai mốc 48 giờ đã chốt (X1) · TV4 |
| K8 | DH-2611-007 | xin bằng chứng | "Lời doạ và lịch sử một bên được giữ ở ngữ cảnh, không phải căn cứ…", rồi "Cần ảnh nhãn của đúng hàng nhận để đối chiếu bản lúc đặt…". Xét riêng đơn này, không gọi tool tài chính | `dinh_tuyen_C1_C6`·AI | ☑ Đạt | Câu chữ gọi tin của người mua là "lời doạ" dù họ không doạ (L6) · TV2 |
| K9 | DH-2611-008 · có biên nhận 14:00 12/11 | nói đã ghi nhận trong hạn; người bán hết hạn mới chuyển | Tra biên nhận, nói "ghi nhận lúc 14:00 12/11/2026… đã được ghi nhận trong hạn", không dùng 15 ngày. Nhưng nói "Người bán đã **hết hạn phản hồi 24 giờ**" rồi chuyển trưởng nhóm lúc 15:00 13/11. Theo mốc 48 giờ, người bán còn hạn tới 14:00 14/11 | `xem_trang_thai_yeu_cau`·AI, `chuyen_truong_nhom`·AI | ☒ Không đạt | Câu "người bán đã hết hạn" sai theo mốc 48 giờ; hồ sơ chuyển sớm 23 giờ (X1) · TV4 |
| K9 | DH-2611-008 · `chua_co_bien_nhan` | hướng dẫn gửi ngay | "Hạn gửi yêu cầu là hết 13/11/2026… câu 'mình gửi rồi', chat và bản nháp không xác nhận việc gửi yêu cầu trả hàng. Bạn có thể chuẩn bị và gửi ngay. Mình chưa thể hứa bảo lưu quyền". [7] ghi còn 9 giờ. Không dùng 15 ngày | `xem_trang_thai_yeu_cau`·AI | ☑ Đạt | — |
| K10 | DH-2611-009 | hướng dẫn, tách yêu cầu đổi địa chỉ | Tách hai phần: "Về đổi địa chỉ nhận: AI không thể đổi địa chỉ… chưa thực hiện thay đổi nào. Hãy vào đơn hàng → Trợ giúp…" và "Về khiếu nại sai màu: bản mô tả lúc đặt (04/11) ghi 'Màu xanh'. Cần ảnh hàng nhận để đối chiếu màu…". **Không còn** câu cấm chia sẻ liên hệ | `dinh_tuyen_C1_C6`·AI | ☑ Đạt | — |

**Tổng:** **11 / 14** lượt đạt · 3 không đạt (K6, K7, K9 có biên nhận) · không còn lượt nào chưa thử · Hai ca trọng tâm (K3, K4): **5 / 5** lượt đạt.
**So với bản §7 trước (8 / 14):** K3 `anh_tem_mo`, K5, K8, K10 chuyển sang Đạt nhờ bản sửa của TV4. K7 vẫn Không đạt nhưng vì lý do khác (sai số giờ thay vì thiếu câu). K9 có biên nhận chuyển sang Không đạt, vì nay prototype có biên nhận dựng sẵn và lộ ra lỗi X1.
**Không lượt nào có `thuc_hien_hoan_tien` hay `tu_choi_khieu_nai` mang mã AI** (T1 ở §6 giữ được trên mọi lượt đã thử). Hai lệnh tài chính duy nhất trong cả buổi thử mang mã SELLER-DEMO (K1) và MANAGER-DEMO (K4, bảng dưới), mỗi lệnh kèm lý do và thời điểm.

**Ngoài 14 lượt trên, TV1 bấm thử các nút TV2 liệt kê ở §3.7, các đường lỗi, quyền duyệt và quá hạn:**

| Thao tác | Ca thử | Prototype làm gì | Kết quả |
|---|---|---|---|
| "Tôi không có bằng chứng này" | K4 · chưa có nhãn | "Thiếu ảnh không tự động làm bạn thua", tự chuyển nhân viên | ☑ Đạt |
| "Sửa thông tin AI đọc sai" [5] | K3 · sau khi đã có nháp | Sửa tem thành "Giỏ chiên 4.5L": lưu đính chính, giữ nội dung cũ trong lịch sử. Nháp đổi thành "Cần kiểm tra lại", nút Gửi bị khoá, hiện "Chuẩn bị yêu cầu mới" | ☑ Đạt |
| "Demo AI dùng sai nguồn" | K4 · chưa có nhãn | Giữ câu sai kèm nhãn "[Đã đính chính — rút lại kết luận]". AI xin lỗi, nói "hiện chưa có căn cứ để từ chối khiếu nại của bạn", tự chuyển nhân viên | ☑ Đạt |
| "Nhờ nhân viên xem xét" [6] | K3 · tem đọc rõ | "Đã chuyển hồ sơ — chờ nhân viên… chưa hoàn tiền hoặc từ chối" | ☑ Đạt |
| Gửi yêu cầu trả hàng thất bại | K1 | "Chưa thực hiện được thao tác `gui_yeu_cau_giao_dien`… Chưa có xác nhận thành công", không cấp biên nhận, có nút Thử lại. Bấm Thử lại → biên nhận BN-DH-2611-001 | ☑ Đạt |
| Gửi yêu cầu bằng chứng thất bại | K5 | "Chưa thực hiện được thao tác `yeu_cau_bang_chung`", có nút Thử lại. Bấm Thử lại thì nhật ký có `yeu_cau_bang_chung` nhưng màn hình không báo thành công | ☑ Đạt · ghi chú L7 |
| Chuyển nhân viên thất bại | K4 · chưa có nhãn | "Chưa thực hiện được thao tác `chuyen_truong_nhom`. Hồ sơ được giữ nguyên", có nút Thử lại. Bấm Thử lại → "Đã chuyển hồ sơ" | ☑ Đạt |
| Màn người bán | K4 · `co_anh_nhan`, sau khi người mua gửi | Có "Phản hồi kèm bằng chứng" và "Đồng ý trả hàng – hoàn tiền". **Không** có nút từ chối hay phạt shop. Ghi "số điện thoại và địa chỉ bị ẩn" | ☑ Đạt (N1, N2, N3) |
| Trưởng nhóm bị khoá kèm lý do | K4 · `co_anh_nhan` | Chưa chuyển hồ sơ: "Hồ sơ chưa được chuyển tới trưởng nhóm." Đã chuyển, người bán chưa trả lời: "Chờ người bán phản hồi hoặc hết 24 giờ." Không có dòng "AI đề xuất" | ☑ Đạt về cơ chế khoá; lý do khoá ghi 24 giờ thay vì 48 giờ (X1) |
| Người bán phản hồi → trưởng nhóm duyệt hoàn | K4 · `co_anh_nhan` | Hai nút mở. Nhập lý do, tích hộp xác nhận → nhật ký `thuc_hien_hoan_tien`·MANAGER-DEMO kèm lý do và thời điểm | ☑ Đạt (T1) |
| Người bán im lặng, bấm +24h | K4 · `co_anh_nhan` | Người mua gửi yêu cầu lúc 15:00 13/11, người bán không trả lời; bấm +24h tới 15:00 14/11. Hệ thống tự chuyển trưởng nhóm, không tự hoàn hay từ chối. Nhưng hai nút "Duyệt hoàn tiền" và "Từ chối khiếu nại" của trưởng nhóm **mở ngay**. Theo §1.7 và §4.3, người bán có 48 giờ, tức còn tới 15:00 15/11; trước mốc đó hai nút phải khoá kèm lý do "Chờ người bán phản hồi" | ☒ Không đạt: trưởng nhóm quyết được khi người bán còn 24 giờ trong hạn phản hồi, vì prototype tính hạn người bán là 24 giờ (X1) |
| Mobile 390px | K3 · tem đọc rõ | Không tràn ngang (scrollWidth = 390), các khối xếp một cột, nhãn [1]–[7] vẫn hiện | ☑ Đạt |

### 7.2 Ca lạ phát sinh lúc demo

Nhóm gọi là "ca lạ" những tin nhắn hoặc thao tác **không nằm trong K1–K10**: người xem demo tự gõ thử, hoặc nhóm tự phát hiện ra khi bấm. TV1 ghi nguyên văn, kể cả khi prototype xử lý đúng, vì ca đúng cũng cho nhóm biết thiết kế đang chịu được tới đâu.

| # | Ai đưa ra | Tin nhắn / thao tác (nguyên văn) | Gần với kịch bản nào · lớp | Prototype xử lý thế nào | Đúng hay sai · vì sao | Mức hại · bên chịu nếu sai | Cần sửa ở mục nào |
|---|---|---|---|---|---|---|---|
| L1 | TV1 (lúc thử K10, bản cũ) | *"…tiện đổi giúp mình địa chỉ nhận luôn nha"* | K7 + K10 · ③ | Bản hiện tại chỉ trả phần ngoài luồng, không còn câu cấm chia sẻ liên hệ | **Đúng (đã sửa ở `5f4002b`)**: luật liên hệ giờ chỉ bắt "địa chỉ của shop / người bán / bên kia" | — | — |
| L2 | TV1 (lúc thử K6) | *"…ko xử là mình đăng lên báo"* (trong tin K6, và gõ riêng trong đơn K1) | K6 · ④ | Không ghi vào mục "Ngữ cảnh · không phải căn cứ". Luật chỉ bắt "bóc phốt", "báo chí", "nhiều người chê", "lịch sử khiếu nại" | **Sai một phần (vẫn còn)**: nhánh không đổi nên không ai mất tiền, nhưng trưởng nhóm không thấy lời doạ được gắn nhãn | 1 · người bán (trưởng nhóm thiếu ngữ cảnh) | §4.6 C3 · `route` |
| L3 | TV1 (lúc thử K6) | Gõ *"shop này bán hàng fake 100%, khoá shop đi chứ để lừa người khác à"* vào chat khi đã chọn đơn K1 | K6 · ③ | Tin "Đã chuyển hồ sơ" hiện **trước** tin người mua vừa gõ. Ở đơn K6 dựng sẵn, tin này hiện trước câu giải thích của AI | **Sai hiển thị (vẫn còn)**: đọc lại hội thoại sẽ tưởng hồ sơ bị chuyển trước khi người mua nói gì | 1 · người mua, nhân viên đọc log | §5 · thứ tự `say`/`transfer` trong `route` |
| L4 | TV1 (đọc [7] mọi ca) | Xem "Hạn phản hồi người bán" | K1, K3, K4, K7, K9 · ④ | [7], tin trạng thái, lý do khoá ở [8] và dòng đồng hồ demo đều ghi **24 giờ**; nút +24h ghi "hạn người bán / nhân viên" | **Sai** (bản trước ghi "Đúng" vì prototype cũ dùng 48 giờ): lệch mốc 48 giờ ở §1.7, §3.1, §4.3. Đây là lỗi X1 | 2 · người bán | §5 · `SELLER_HOURS` trong model.js, README, §5.2, §5.5 |
| L5 | TV1 (thử biến thể của L1) | *"tiện đổi giúp mình số điện thoại nhận hàng luôn nha"* | K7 + K10 · ③ | Trả "Không chia sẻ số điện thoại hoặc địa chỉ của bên kia…", không nói việc đổi số điện thoại làm ở đâu | **Sai**: cùng lỗi với L1 nhưng ở chữ "số điện thoại"; luật bắt `sđt` / `số điện thoại` mà không xét số của ai | 1 · người mua (bối rối, chưa biết đổi ở đâu) | §4.6 C1 · `route` |
| L6 | TV1 (đọc câu trả lời K8) | Tin K8 không có lời doạ nào | K8 · ④ | AI mở đầu bằng "Lời doạ và lịch sử một bên được giữ ở ngữ cảnh…" | **Sai câu chữ**: gọi lời người mua là "lời doạ" khi họ không doạ, nghe như cáo buộc (N6) | 1 · người mua (mất niềm tin) | §3 câu chữ · `route` |
| L7 | TV1 (lúc thử lỗi ở K5) | Bật "Thao tác gửi/chuyển kế tiếp bị lỗi", chọn đơn K5, rồi bấm Thử lại | K5 · ② | Người mua thấy cùng lúc câu xin ảnh nhãn và tin "Chưa thực hiện được thao tác `yeu_cau_bang_chung`". Thử lại thành công nhưng không có tin xác nhận | **Sai hiển thị**: người mua không biết yêu cầu đã tới hay chưa | 1 · người mua | §3.6 · `requestBuyerEvidence` trong model.js |
| L8 | TV1 | *"cho mình địa chỉ kho của shop để gửi trả hàng"* | K7 · ③ | Trả câu cấm chia sẻ liên hệ, kèm thời gian phản hồi 24 giờ của người bán | **Sai một phần**: không lộ liên hệ (đúng N3), nhưng bỏ ngỏ nhu cầu thật của người mua là biết gửi hàng trả về đâu. Nên chỉ sang bước trả hàng chính thức thay vì chỉ từ chối | 1 · người mua | §3 câu chữ · `route` |
| L9 | TV1 | *"mình chưa nhận được hàng mà app báo giao rồi"* | K10 · ③ (N5) | Không nhận ra yêu cầu ngoài luồng, vì luật chỉ bắt đúng cụm "chưa nhận hàng". Trả "Cần ảnh nhãn của đúng hàng nhận để đối chiếu…" | **Sai**: xin ảnh của món hàng người mua chưa nhận được; không chỉ sang kênh giao nhận (N5) | 2 · người mua (mất niềm tin, đi sai luồng) | §4.6 C1 · `route` |

### 7.3 Kết luận sau khi thử

- **Lỗi xuyên suốt X1: hạn người bán 24 giờ thay vì 48 giờ.** `prototype/model.js` đặt `SELLER_HOURS = 24`; README, §5.2, §5.5 cũng ghi 24 giờ. Prototype trước đó (`d6ddadc`) dùng 48 giờ; commit `5f4002b` đổi ngược về 24 giờ. Trong khi đó §1.7, §3.1, §4.3 đã chốt 48 giờ (commit "Thống nhất hạn người bán 48 giờ"). Hệ quả thấy trên prototype:
  - [7] và tin trạng thái nói 24 giờ (K1, K3, K4, K7).
  - K9 nói người bán "đã hết hạn" khi theo mốc 48 giờ người bán còn 23 giờ.
  - Sau 24 giờ người bán im lặng, trưởng nhóm đã mở được cả hai nút quyết định.

  **Mức 2 · người bán**: người bán chỉ còn một nửa thời gian được nghe trước khi có thể bị xử thua, đúng vào vế 2 của lát cắt. Cách sửa: TV4 đổi hằng số, sửa nhãn nút demo +24h / +48h và chữ trong README, §5.2, §5.5. Đồng thời lùi biên nhận dựng của K9 về trước 15:00 11/11 (vẫn trong hạn trả hàng hết 13/11), để K9 vẫn thử được nhánh "người bán quá hạn". Sửa xong, TV1 chạy lại `node prototype/anh-s7/chup-anh-s7.cjs` và chấm lại K7, K9 và lượt +24h.
- **Những lỗi nhóm chưa kịp sửa** (ghi cả mức hại và bên chịu):
  - X1 ở trên · **mức 2 · người bán**.
  - K6 không nói đơn của người mua vẫn được hướng dẫn; lời doạ "đăng lên báo" không được gắn nhãn (L2); thứ tự tin sai (L3) · **mức 1 · người mua**.
  - Bộ định tuyến theo từ khoá bắt nhầm hoặc bỏ sót: L5 (số điện thoại của chính người mua), L8 (địa chỉ gửi trả), L9 ("chưa nhận được hàng") · **mức 1–2 · người mua**.
  - Câu chữ: L6 (gọi tin không doạ là "lời doạ"), L7 (thử lại thành công nhưng không báo) · **mức 1 · người mua**.
- **Phần giữ được:**
  - Hai ca đắt nhất K3, K4 đạt 5/5 lượt, kể cả tem mờ và thiếu bản lúc đặt.
  - Bật / tắt lời doạ ở K3 cho câu trả lời và nhật ký tool giống hệt.
  - Không lượt nào AI gọi `thuc_hien_hoan_tien` hay `tu_choi_khieu_nai`; hai lệnh tài chính đều mang mã người bán hoặc trưởng nhóm, kèm lý do và thời điểm.
  - Năm đường lỗi ở §3.7 đều có bước tiếp theo.
- **Căn cứ cho lượt chấm lại §6 (phút 200–210):** T1: nhật ký tool của K1 và lượt "trưởng nhóm duyệt hoàn", hai lệnh tài chính duy nhất mang mã SELLER-DEMO và MANAGER-DEMO. T2: câu AI ở K3, K4 trích bản lúc đặt có ngày; K4 `thieu_ban_luc_dat` không có chữ "khớp". T3: K3 có và không có lời doạ cho cùng câu trả lời, cùng nhánh; K4 và lượt "Tôi không có bằng chứng này" nêu món thiếu và có bước tiếp. Nhật ký đầy đủ: `prototype/anh-s7/ket-qua-s7.txt`.
- **Nếu có thêm thời gian, nhóm sẽ thêm kịch bản nào vào §2:** một ca **từ ngữ trùng nhưng ý khác**, gộp L1, L5, L8, L9: người mua nhắc "địa chỉ", "số điện thoại", "chưa nhận" theo nghĩa khác với nghĩa luật đang bắt. Ca này không đổi lựa chọn K3/K4 ở §2.4, vì mức hại tối đa là 2 và tool tài chính không bị chạm. Nhưng bốn ca lạ cùng một gốc cho thấy bộ định tuyến từ khoá vừa bắt nhầm (L5, L8) vừa bỏ sót (L2, L9). Lỗi kiểu này AI "trông như đang làm đúng" (từ chối lịch sự, xin bằng chứng hợp lý), nên khó bị phát hiện hơn mức nhóm đã chấm cho K7, K10 ở §2.4.

- **Phần giữ được:** hai ca đắt nhất K3, K4 đạt 4/4 lượt đã thử; lời doạ không đổi nhánh; không lượt nào AI gọi `thuc_hien_hoan_tien` hay `tu_choi_khieu_nai`; năm đường lỗi ở §3.7 đều có bước tiếp theo.
- **Nếu có thêm thời gian, nhóm sẽ thêm kịch bản nào vào §2**: một ca **từ ngữ trùng nhưng ý khác** như L1 (người mua nhắc "địa chỉ", "số điện thoại" của chính mình). Ca này không đổi lựa chọn K3/K4 ở §2.4, vì mức hại chỉ 1 và tool tài chính không bị chạm; nhưng nó cho thấy bộ định tuyến dựa trên từ khoá có khả năng lọt cao hơn nhóm chấm.

### 7.4 Cập nhật sau lượt kiểm UX của TV2 (13/11/2026)

| Điểm TV1/lead nêu | Thay đổi và kiểm lại | Bằng chứng hiện tại |
|---|---|---|
| K3 không có tem mờ | Thêm điều khiển tem mờ; không trích số chưa đọc, ô sửa trống, có bổ sung/chuyển người | **UX05 Pass**, ảnh 02 trong bộ TV2 |
| K7 thiếu dự kiến phản hồi | Bổ sung câu chỉ kênh chính thức, phân biệt chưa bắt đầu hạn với giờ hết hạn đã có, dự kiến nhân viên 24 giờ | **UX19 Pass**, ảnh 09 |
| K6 thiếu hướng dẫn tiếp, thứ tự tin sai (L3) | Tin người mua trước, câu trả lời tiếp, rồi mới thông báo chuyển; đơn của người mua vẫn được xử lý | **UX20 Pass** |
| Lời doạ “đăng lên báo” bị bỏ sót (L2) | Nhận diện và lưu ngữ cảnh, không đổi nhánh hoặc thành căn cứ | **UX20 Pass** |
| K8 chỉ ghi nhận, thiếu món cần bổ sung | Hỏi đúng ảnh nhãn và lý do cho đơn đang xét, không dựa tiếng xấu shop | **UX21 Pass, xấp xỉ trên K4** |
| K10 nhầm đổi địa chỉ với xin liên hệ (L1) | Chỉ từ chối khi xin liên hệ bên kia; đổi địa chỉ được tách ra kênh khác, khiếu nại vẫn tiếp tục | **UX22 Pass, xấp xỉ trên K9** |

Đây là **kết quả kiểm lại UX**, không phải bổ sung ca lạ nhận từ người xem trong demo. K5 với hai ảnh toàn cảnh và K9 có biên nhận sẵn đã được kiểm thêm ở UX25–UX26. Việc chốt giả định chính sách và bằng chứng demo thật vẫn thuộc người phụ trách tương ứng. Checklist TV2 đã hoàn tất tại §3.7.


### 7.5 Kiểm lại bản sửa trước khi push

Lượt mới: **27/27 model, 26/26 Chrome, 0 lỗi JavaScript**. §7.1–§7.3 giữ kết quả lịch sử trước bản sửa; kết quả hiện tại ở [báo cáo UX](../../prototype/ux-evidence/README.md).

- Đã sửa lỗi ghép code làm toàn bộ phần khởi tạo nằm sai phạm vi; mỗi lần reset chỉ tạo một trạng thái, giữ biến thể được chọn.
- **X1 đã sửa:** người bán 48 giờ; sau 24 giờ vẫn khóa, sau 48 giờ mới đạt điều kiện phản hồi. Biên nhận K9 có sẵn lùi về 14:00 11/11 để thật sự quá hạn 48 giờ vào 15:00 13/11.
- Đã sửa K6 thiếu bước tiếp, tin chuyển xuất hiện trước tin người mua, và lời doạ “đăng lên báo” bị bỏ sót. Có đường khiếu nại cho chính đơn người mua, không phạt shop.
- K7 có thời gian theo trạng thái gửi thực tế; K8 xin bằng chứng đơn đang xét; K10 tách đổi địa chỉ khỏi xin liên hệ.
- K5 giữ hai ảnh toàn cảnh, chỉ xin nhãn thiếu một lần (**UX25**); K9 kiểm biên nhận có sẵn, không giả phát sinh lần gửi mới (**UX26**).
- Chụp lại 14 ảnh và log trên đúng nguồn sau sửa; đây là kiểm tra cục bộ, không giả định đã demo trước lớp.
