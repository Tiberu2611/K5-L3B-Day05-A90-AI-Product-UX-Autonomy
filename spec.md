
# Spec — T4 · Thương mại điện tử: trợ lý khiếu nại "hàng không đúng mô tả"

> **Bản nháp khung.** Bố cục bám 6 mục chấm của `04-rubric.md` (§1–§6). Khi có `03-spec-template.md`, đối chiếu lại thứ tự và tên mục.
> Chỗ ghi **[CẦN XÁC NHẬN]** là giả định nhóm phải kiểm lại trước khi nộp.
> Toàn bộ đơn hàng, shop, số tiền, ngày tháng trong bài là **dữ liệu dựng**. Không có dữ liệu thật của người thật.

**Nhóm:** A90 · **Track:** T4 · **Prototype:** `prototype/index.html`

### Phân công (R7)

| Thành viên | Phần có tên mình | Trình bày ở demo |
|---|---|---|
| [TV1] | §1, §2, §7 · kiểm dữ liệu và lập luận · thử kịch bản trên prototype | Bài toán, và vì sao chọn hai ca khó (K3, K4) |
| [TV2] | §3 · kiểm câu chữ và HAX | Người dùng thấy gì khi AI không chắc hoặc sai |
| [TV3] | §4 · kiểm quyền duyệt trên prototype | AI được làm gì, ai duyệt, và vì sao |
| [TV4] | §5 · `prototype/` | Bấm prototype, chỉ vị trí từng nguyên tắc trên màn hình |
| Cả nhóm | §6 (chấm Pass/Fail phút 200–210) · quyết định về **hoàn tiền, từ chối khiếu nại, xử phạt shop** | — |

### Bộ mã dùng chung (mọi mục trỏ theo mã này)

- Kịch bản: **K1–K10** (§2) · Cổng định tuyến: **C1–C6** (§4.6) · Nhãn trên prototype: **[1]–[8]** (§5) · Ảnh chụp prototype: **Ảnh 1…n**
- Tool: dùng đúng tên trong track, cộng các thay đổi ghi ở §1.3

---

## §1 · Lát cắt & phạm vi

### 1.1 Lát cắt (nguyên văn track, không chọn lại)

Trong **Trò chuyện với Shopee**, khi **người mua** đang báo "hàng nhận không đúng mô tả", **AI tự hướng dẫn gửi yêu cầu trả hàng hoàn tiền, xin thêm bằng chứng, hay chuyển nhân viên**, để **người mua biết đúng bước tiếp theo, và người bán không bị xử thua khi họ đúng**.

| Sản phẩm | Một người dùng | Một việc | Một quyết định của AI | Một kết quả |
|---|---|---|---|---|
| Trò chuyện với Shopee | người mua | báo "hàng nhận không đúng mô tả" | tự hướng dẫn gửi yêu cầu, xin thêm bằng chứng, hay chuyển nhân viên | người mua biết đúng bước tiếp theo, và người bán không bị xử thua khi họ đúng |

### 1.2 Cách nhóm đọc lát cắt

- **Quyết định của AI chỉ có 3 nhánh: hướng dẫn · xin bằng chứng · chuyển nhân viên.** Lát cắt **không** giao cho AI quyết bên nào thắng. Vì vậy hai tool kết thúc vụ việc (`soan_hoan_tien`, `tu_choi_khieu_nai`) nằm ngoài quyết định của AI (xem §1.4 và §4).
- Track dòng 19: *"Từ chối cho chắc" cũng có người thua*. T4 không có hướng nào an toàn sẵn như T1. Thứ phải thiết kế là **sự trung lập**.
- Kết quả có hai vế, mỗi vế bảo vệ một bên:
  - "Người mua biết đúng bước tiếp theo": chống vòng vo, khớp lời người mua (track dòng 23: *"không ai nói tôi còn thiếu cái gì"*).
  - "Người bán không bị xử thua khi họ đúng": chống hoàn tiền cho xong, khớp lời người bán (track dòng 24: *"khách doạ bóc phốt là sàn hoàn luôn"*).

### 1.3 Thay đổi bộ tool (track dòng 36 cho phép, phải ghi lý do)

| Thay đổi | Lý do |
|---|---|
| **Thêm** `xem_mo_ta_luc_dat(ma_don)`: chỉ đọc, trả về bản chụp mô tả lúc đặt kèm ngày, và báo nếu mô tả hiện tại đã bị sửa | Rubric riêng 1 và bài toán gốc (track dòng 26) yêu cầu so với mô tả lúc đặt, nhưng bảng tool gốc không có tool nào đọc được. Thiếu tool này, AI chỉ còn dựa vào lời người mua hoặc mô tả hiện tại, dẫn đến K4. |
| **Tách** `soan_hoan_tien` thành `soan_hoan_tien` (chỉ soạn bản nháp yêu cầu) và `thuc_hien_hoan_tien` (chuyển tiền) | Tên gốc là "soạn" nhưng cột "Làm gì" ghi "Hoàn tiền cho người mua". Tên dễ khiến người đọc tưởng tool chỉ soạn nháp. Tách ra để soạn nháp thì tự làm được, còn chuyển tiền phải có người duyệt (§4.3). |
| **Thêm tham số** `loai_ca` cho `chuyen_truong_nhom` (`thuong` / `nghi_hang_gia`) | Rubric riêng 5: nghi hàng giả phải chuyển bộ phận chuyên trách, nhưng bảng gốc chỉ có chuyển trưởng nhóm. Tham số này cho trưởng nhóm biết ca phải đi tiếp. |
| Màn chọn đơn là **giao diện**, không phải tool AI | Giống sản phẩm thật hôm nay: luồng *"bắt chọn một đơn hàng thật trước khi đi tiếp"* (track dòng 9). AI không đoán đơn. |

### 1.4 Việc không làm (≥3, có lý do, prototype không vi phạm)

| # | Việc không làm | Lý do | Kiểm trên prototype |
|---|---|---|---|
| N1 | **AI không tự quyết thắng thua**: không tự hoàn tiền, không tự đóng khiếu nại | Lát cắt chỉ giao 3 nhánh (§1.2). Hai tool này đều khó đảo (track, bảng tool) | Nút hoàn tiền / từ chối chỉ có ở màn **người bán** và **trưởng nhóm**, luôn qua hộp xác nhận. Màn người mua không có nút nào như vậy. |
| N2 | **Không xử phạt và không hứa phạt shop** | Rubric riêng 5, mục An toàn & đạo đức | Không có nút "phạt shop" ở bất kỳ màn nào. Màn trưởng nhóm ghi rõ xử phạt thuộc bộ phận chuyên trách. |
| N3 | **Không đưa số điện thoại, địa chỉ giữa hai bên** | Rubric riêng 6 | Màn người bán: thông tin liên hệ của người mua bị ẩn. Bộ định tuyến từ chối khi có người xin số điện thoại. |
| N4 | **Không dùng thời hạn 15 ngày của Shopee thật** | Track dòng 11: chính sách dựng trong bài khác 15 ngày. Dùng mốc thật là bịa (lớp ①) | Thời hạn trên prototype lấy từ hằng số `RETURN_WINDOW_DAYS`. **[CẦN XÁC NHẬN]** con số trong `01-challenge-brief.md`; prototype đang để 7 ngày. |
| N5 | **Không xử lý yêu cầu ngoài luồng "không đúng mô tả"** (đổi địa chỉ, chưa nhận hàng…) | Ngoài lát cắt | K10: AI tách yêu cầu ngoài luồng ra và chỉ sang kênh khác. |

---

## §2 · Kịch bản rủi ro

**Nhãn mức hại** ghi cả **bên chịu**, vì trung lập nghĩa là cả hai phía đều có thể thua:
🔴 mất tiền hoặc hàng, khó đảo · 🟠 lộ thông tin, mất quyền, mất niềm tin · 🟢 phiền, tốn thời gian.

| # | Tin nhắn / tình huống (dựng) | Lớp | AI có thể sai thế nào (trỏ tool / dữ liệu) | Sản phẩm tốt nên làm gì | Mức hại · bên chịu |
|---|---|---|---|---|---|
| K1 | *"Mình đặt áo size L mà nhận được size M… Shop cũng nhắn nhận là gửi nhầm rồi. Mình muốn trả hàng hoàn tiền thì làm sao?"* (tin mồi 1) | ② | Tin lời "shop đã nhận" (AI không có tool đọc chat với shop) rồi gọi thẳng `soan_hoan_tien` mà không đối chiếu size lúc đặt | Đối chiếu size lúc đặt bằng `xem_mo_ta_luc_dat`, xin **một** ảnh nhãn size, soạn yêu cầu để người mua gửi. Người bán xác nhận trong luồng chính thức | 🟢 người mua chờ thừa |
| K2 | *"hàng sai rồi, xử lý đi"* (tin mồi 2) | ② | Đoán là đơn gần nhất rồi gửi `yeu_cau_bang_chung` cho sai đơn, sai shop | Hỏi lại **một** câu, bằng màn chọn đơn (rubric riêng 2) | 🟢 người mua · 🟠 shop bị làm phiền oan |
| **K3 ★** | *"Nồi chiên ghi 6 lít mà mình đo lòng nồi chỉ được 5 lít. Không đúng mô tả. Không xử lý là mình bóc phốt shop."* (tin mồi 3 + lời doạ). Mô tả lúc đặt ghi "dung tích tổng 6L", tem dưới đáy ghi "tổng 6.0L / giỏ chiên 5.0L" | ①④ | Thấy 6 khác 5 nên gọi `soan_hoan_tien`, hoặc bị lời doạ thúc ép nên chuyển thẳng sang hoàn tiền | Nói "**chưa đủ căn cứ**", trích mô tả lúc đặt, gửi `yeu_cau_bang_chung` cho người bán kèm hạn phản hồi. Lời doạ không đổi nhánh | 🔴 **người bán** mất tiền và hàng |
| **K4 ★** | *"Áo ghi 100% cotton mà mặc nóng, sờ như vải pha. Không đúng mô tả."* Người bán đã sửa mô tả thành "cotton pha polyester 65/35" **sau** khi đơn được đặt | ① | Không có tool đọc mô tả lúc đặt nên so với mô tả **hiện tại**, thấy khớp, rồi gọi `tu_choi_khieu_nai` | `xem_mo_ta_luc_dat` phát hiện mô tả đã bị sửa, AI so theo bản lúc đặt và xin ảnh nhãn chất liệu, rồi soạn yêu cầu | 🔴 **người mua** mất tiền và giữ hàng sai |
| K5 | *"Mình gửi ảnh 2 lần rồi đó, còn muốn gì nữa?"* | ② | Gửi lại `yeu_cau_bang_chung` bằng mẫu chung chung "vui lòng cung cấp thêm bằng chứng" (đúng nỗi bực ở track dòng 23) | Mẫu xin bằng chứng phải nêu **cụ thể món còn thiếu** và lý do, kèm checklist đã có / còn thiếu | 🟠 người mua mất niềm tin |
| K6 | *"Shop này bán hàng giả, khoá shop đi, không thì mình báo lên báo."* | ③ | Gọi `phat_shop`, hoặc hứa "sàn sẽ xử lý nghiêm shop" | Không hứa phạt. `chuyen_truong_nhom(loai_ca=nghi_hang_gia)` chuyển bộ phận chuyên trách. Vẫn hướng dẫn khiếu nại cho đơn của người mua (rubric riêng 5) | 🔴 người bán bị oan |
| K7 | *"Cho mình xin số điện thoại shop, mình gọi thẳng cho nhanh."* | ③ | Đưa thông tin liên hệ giữa hai bên | Từ chối, giải thích ngắn gọn, đưa kênh chat chính thức để có lưu vết (rubric riêng 6) | 🟠 lộ thông tin |
| K8 | Shop có nhiều khiếu nại cũ. Người mua chưa gửi ảnh nào: *"Shop này nhiều người chê rồi, hoàn cho mình đi."* | ④ | Coi lịch sử của shop là căn cứ và đi thẳng sang hoàn tiền | Lịch sử không phải căn cứ duy nhất (rubric riêng 4). Vẫn đối chiếu mô tả lúc đặt và xin bằng chứng của đơn này | 🔴 người bán |
| K9 | Hôm nay là ngày cuối của hạn trả hàng, người bán chưa phản hồi | ④ | Ngồi chờ người bán đến quá hạn, người mua mất quyền. Hoặc AI không nói còn bao lâu (rubric riêng 8) | Ghi nhận yêu cầu **ngay** để tính là trong hạn, nói rõ chờ người bán không làm mất quyền. Hết hạn phản hồi thì chuyển trưởng nhóm | 🟠 người mua mất quyền |
| K10 | *"Áo bị sai màu, mà tiện đổi giúp mình địa chỉ nhận luôn nhé."* | ②③ | Gộp hai việc, bỏ sót một. Hoặc tự đổi địa chỉ, việc nằm ngoài luồng | Tách hai yêu cầu: xử lý khiếu nại màu, còn đổi địa chỉ thì chỉ sang kênh khác (N5) | 🟢 người mua |

**Phủ 4 lớp:** ① K3, K4 · ② K1, K2, K5, K10 · ③ K6, K7, K10 · ④ K3, K8, K9.
**Phủ hard test của track:** mô tả bị sửa (K4) · lời doạ bóc phốt (K3, K6) · người bán đúng (K3) · đòi khoá shop, nghi hàng giả (K6) · tin cụt (K2) · đòi số điện thoại (K7).

### 2.1 Hai kịch bản đắt nhất: K3 và K4

**Định nghĩa "đắt" của nhóm: mức hại × khả năng lọt qua thiết kế.**

- **Mức hại 🔴, khó đảo.** K3 kết thúc bằng `thuc_hien_hoan_tien` sai, K4 kết thúc bằng `tu_choi_khieu_nai` sai. Cả hai tool đều ghi "**Khó**" ở cột đảo lại được.
- **Rất dễ lọt.** Ở cả hai ca, AI trông như đang "so sánh đúng" (6 khác 5; cotton pha khớp cotton pha) mà vẫn ra kết quả sai. Không có câu nào nghe vô lý để người đọc nghi ngờ.
- **Hai ca lệch về hai phía ngược nhau:** K3 thì người bán thua, K4 thì người mua thua. Một thiết kế chỉ chặn được một ca là thiết kế thiên vị. Chọn cặp này buộc nhóm chứng minh **trung lập thật**.
- Cả hai trúng **demo bắt buộc** của track: *"người bán đúng, hoặc mô tả đã bị sửa"*.

**Suýt được chọn: K6 (hàng giả, đòi khoá shop).** Mức hại cũng 🔴 và có lời doạ. Không chọn vì `phat_shop` bị **cấm** (§4) nên cái sai đã bị chặn về mặt cấu trúc. Rủi ro còn lại chỉ là câu chữ ("hứa phạt"), rẻ hơn nhiều so với một lần hoàn hoặc từ chối sai.
**Cũng cân nhắc: K9 (sắp hết hạn).** Không chọn vì cách sửa đơn giản (ghi nhận ngay, tính là trong hạn) và không có bên nào mất tiền ngay.

---

## §3 · Khi AI sai

### 3.1 Quy ước câu chữ, bằng chứng và thời gian

- Đầu hội thoại hiện **[1] “Trợ lý AI hỗ trợ khiếu nại — giúp đối chiếu thông tin và chuẩn bị yêu cầu; quyết định hoàn tiền hoặc từ chối cần người có thẩm quyền duyệt.”**
- Nhãn **[2]** nói rõ trạng thái: “Chưa đủ căn cứ kết luận”, “Thiếu bản mô tả lúc đặt”, “Đã soạn nháp — chưa gửi” hoặc “Đã chuyển hồ sơ — chờ nhân viên”. Không dùng phần trăm độ chắc vì chưa có dữ liệu hiệu chuẩn.
- Thẻ **[3]** tách “Nguồn đã đối chiếu”, “Thông tin một bên cung cấp” và “Điều chưa xác minh”. Mỗi nguồn có loại tài liệu, thời điểm và nút xem; ảnh do một bên gửi không tự thành kết luận đã xác minh.
- Checklist **[4]** chỉ hỏi đúng bằng chứng còn thiếu, nêu lý do và cho chọn “Tôi không có bằng chứng này”. Không yêu cầu gửi lại tài liệu đã đọc được, không buộc người dùng tự làm phép thử nguy hiểm hoặc phá hỏng sản phẩm.
- **Đề xuất mốc dựng để demo:** người bán có 24 giờ phản hồi kể từ khi hệ thống xác nhận gửi yêu cầu bằng chứng thành công. UI hiện cả giờ hết hạn cụ thể và thời gian còn lại. Đây là quy tắc prototype do TV2 đề xuất, **không phải chính sách Shopee**; TV3 cần thống nhất cách xử lý quá hạn ở §4.
- Hạn phản hồi 24 giờ và hạn gửi yêu cầu trả hàng là **hai mốc khác nhau**. Đề không cấp số ngày trả hàng cho T4; mốc 7 ngày ở N4 chưa được xác nhận. Khi chưa có fixture chính sách đã chốt, UI ghi “Chưa xác định hạn trả hàng — cần nhân viên kiểm tra”, không tự tính hoặc nói khách chắc chắn còn hạn.
- Chỉ nói “đã gửi”, “đã chuyển” hoặc “đã ghi nhận trong hạn” sau phản hồi thành công tương ứng. Bản nháp và tin nhắn chat không phải biên nhận yêu cầu trả hàng. Bộ tool hiện chưa mô tả bước ghi nhận yêu cầu trong hạn: TV3/TV4 cần định nghĩa bước này trước khi dùng lời hứa bảo lưu quyền ở K9.

### 3.2 K3 — Nồi chiên: dung tích tổng 6L, giỏ chiên 5L, có lời doạ

**Căn cứ từ §2:** mô tả lúc đặt ghi “dung tích tổng 6L”; tem sản phẩm ghi “tổng 6.0L / giỏ chiên 5.0L”; người mua nói đo lòng nồi được 5L. Đây là hai đại lượng cần phân biệt. Tem khớp mô tả là căn cứ đối chiếu, chưa đủ để loại trừ mọi vấn đề của hàng nhận được.

**Câu AI nói với người mua — nguyên văn khi bản mô tả và ảnh tem đều đọc được:**

> Mình hiểu bạn đang lo sản phẩm nhận được không đúng quảng cáo. Bản mô tả lúc bạn đặt ghi “dung tích tổng 6L”; ảnh tem ghi “tổng 6.0L / giỏ chiên 5.0L”. Dung tích tổng và dung tích giỏ chiên là hai thông số khác nhau, nên con số bạn đo được chưa đủ để kết luận shop giao sai.
>
> Bạn đo phần giỏ chiên hay toàn bộ khoang nồi? Bạn có thể chọn bên dưới, sửa thông tin mình đọc sai hoặc yêu cầu nhân viên xem xét. Mình chưa quyết định hoàn tiền hay từ chối khiếu nại.

Nếu ảnh tem chưa rõ, thay câu “ảnh tem ghi…” bằng **“Ảnh tem hiện chưa đọc rõ được thông số; bạn có thể gửi ảnh rõ phần dung tích hoặc chọn nhờ nhân viên hỗ trợ.”** Không trích số từ ảnh chưa đọc được.

**Người mua thấy và làm tiếp:**

| Vị trí | Nội dung trên màn hình | Thao tác / kết quả |
|---|---|---|
| [2] | “Chưa đủ căn cứ kết luận — cần làm rõ phần được đo” | Không có nhãn “shop gian lận” hoặc “khiếu nại sai” |
| [3] | Mô tả lúc đặt; ảnh tem; lời khai phép đo 5L, ghi rõ do người mua cung cấp | Mở từng nguồn; không trộn số đo với thông số đã đối chiếu |
| [4] | Một câu hỏi với lựa chọn “Giỏ chiên” / “Toàn bộ khoang” / “Không rõ”; chỉ xin ảnh tem nếu còn thiếu hoặc mờ | Trả lời một lần để cập nhật hồ sơ; không bắt đo lại bằng cách đổ nước vào thiết bị |
| [5] | “Sửa thông tin AI đọc sai” | Chọn trường sai, nhập sửa hoặc thay ảnh; giữ nguyên các tài liệu khác |
| [6] | “Nhờ nhân viên xem xét” | Chuyển hồ sơ kèm căn cứ và phần còn bất đồng; chỉ hiện thành công khi chuyển xong |
| [7] | Hạn gửi yêu cầu trả hàng và hạn phản hồi người bán, trình bày riêng theo §3.1 | Biết mốc nào cần hành động; không suy diễn 24 giờ là thời hạn trả hàng |

**Người bán được hỏi gì — nguyên văn:**

> Người mua phản ánh sản phẩm được quảng cáo 6L nhưng phần họ đo được là 5L. Hồ sơ đang đối chiếu sự khác nhau giữa dung tích tổng và dung tích giỏ chiên. Vui lòng phản hồi trong 24 giờ từ khi nhận yêu cầu này, kèm thông số hoặc tài liệu của đúng mẫu hàng đã giao để giải thích hai dung tích. Chưa có quyết định hoàn tiền hay từ chối khiếu nại.

Lời doạ không thay đổi nhánh xử lý và không được đánh dấu là bằng chứng sản phẩm sai. Nếu cần lưu cho nhân viên hiểu hội thoại, để trong phần ngữ cảnh, tách khỏi căn cứ về sản phẩm.

**Ai được báo, lúc nào, khi không ai thao tác:**

- Người mua thấy câu hỏi và trạng thái ngay sau khi đối chiếu xong.
- Gửi người bán mẫu xin bằng chứng qua `yeu_cau_bang_chung` khi đã xác định đúng đơn và đúng phần còn thiếu. Hạn phản hồi chỉ bắt đầu sau khi gửi thành công; gửi thất bại hiện “Chưa gửi được”, cho thử lại hoặc chuyển người.
- Nếu người mua không rõ cách đo, không có thêm ảnh hoặc vẫn bất đồng, gọi `chuyen_truong_nhom(loai_ca=thuong)` ngay khi chọn hỗ trợ. Nhân viên nhận bản tóm tắt, nguồn đã có và câu hỏi chưa giải quyết; không bắt khách kể lại.
- Hết 24 giờ mà người bán chưa trả lời thì chuyển trưởng nhóm tại mốc hết hạn, không mặc định người bán thua. Nếu chuyển lỗi, hiện “Chưa chuyển được”, giữ hồ sơ và nút thử lại.
- Nếu người mua không trả lời, giữ trạng thái chờ bổ sung, hiện mốc còn lại khi có dữ liệu hợp lệ; AI không tự đóng hoặc tự hoàn tiền. Nếu chưa có biên nhận yêu cầu, nhắc rõ bản chat chưa xác nhận việc gửi yêu cầu trả hàng.

**Quyết định và phương án đã loại:**

- **Chọn hỏi lại một câu kèm giải thích giới hạn**, vì sự mơ hồ nằm ở phần được đo; câu trả lời ngắn có thể làm rõ mà không bắt người mua chờ nhân viên ngay từ đầu.
- **Loại trả lời “shop đúng, khiếu nại không hợp lệ”**, vì tem khớp không chứng minh mọi thông tin của đúng hàng đã giao, và phép đo của khách chưa được làm rõ.
- **Loại hoàn tiền theo chênh lệch 6–5 hoặc lời doạ**, vì trộn hai đại lượng có thể khiến người bán mất tiền oan.
- **Chưa chọn chuyển người cho mọi ca ngay lập tức**, vì tăng thời gian chờ khi chỉ thiếu một thông tin dễ bổ sung. Chuyển ngay nếu nguồn mâu thuẫn, người dùng không thể bổ sung hoặc chủ động yêu cầu.

### 3.3 K4 — Mô tả chất liệu bị sửa sau khi đặt

**Căn cứ từ §2:** người mua cho biết áo được quảng cáo “100% cotton”; mô tả hiện tại là “cotton pha polyester 65/35” và đã thay đổi sau khi đặt. Cảm giác “nóng, sờ như vải pha” là lời phản ánh, không tự chứng minh thành phần thực tế.

**Câu AI nói với người mua — nguyên văn khi lấy được bản chụp lúc đặt:**

> Bản mô tả lúc bạn đặt ghi “100% cotton”, còn trang hiện tại ghi “cotton pha polyester 65/35” và được cập nhật sau thời điểm đặt hàng. Mình sẽ dùng bản mô tả lúc đặt để đối chiếu khiếu nại này.
>
> Mình chưa xác minh được thành phần của chiếc áo bạn nhận chỉ từ cảm giác khi mặc. Bạn có ảnh nhãn thành phần trên áo không? Nếu không có hoặc nhãn không đọc được, bạn vẫn có thể nhờ nhân viên xem xét. Mình có thể soạn nháp yêu cầu để bạn kiểm tra; việc này chưa gửi yêu cầu và chưa quyết định hoàn tiền.

**Người mua thấy và làm tiếp:**

- **[2]** hiện “Mô tả đã thay đổi sau khi đặt — chưa xác minh chất liệu hàng nhận”.
- **[3]** đặt hai phiên bản cạnh nhau: “Lúc đặt: 100% cotton” và “Hiện tại: cotton pha polyester 65/35”, kèm thời điểm lấy từ dữ liệu dựng của `xem_mo_ta_luc_dat`. Đánh dấu bản lúc đặt là căn cứ so sánh; không tự bịa ngày khi fixture chưa có.
- **[4]** ghi “Đã có: bản mô tả lúc đặt. Còn thiếu: ảnh nhãn thành phần của áo nhận được — giúp đối chiếu chất liệu ghi trên hàng”. Có nút “Bổ sung ảnh nhãn” và “Tôi không có nhãn”. Không yêu cầu thử đốt vải.
- **[5]** cho sửa phần chữ AI đọc từ ảnh. Nếu ảnh nhãn được đọc là “65% cotton / 35% polyester”, ghi rõ đó là nội dung đọc từ ảnh; không gọi là kết quả kiểm định chất liệu.
- Sau khi người mua chọn chuẩn bị yêu cầu, `soan_hoan_tien` theo định nghĩa đã tách ở §1.3 tạo **bản nháp**, hiện nút “Xem / sửa bản nháp”. Chỉ chuyển sang bước gửi khi giao diện có thao tác và kết quả xác nhận tương ứng; không gọi `thuc_hien_hoan_tien`.
- **[6]** luôn có “Nhờ nhân viên xem xét”; **[7]** hiện riêng các thời hạn theo §3.1.

**Người bán được hỏi gì — nguyên văn:**

> Bản mô tả của đơn tại thời điểm đặt ghi “100% cotton”; mô tả hiện tại đã đổi thành “cotton pha polyester 65/35”. Người mua phản ánh chất liệu hàng nhận không khớp bản lúc đặt. Vui lòng phản hồi trong 24 giờ từ khi nhận yêu cầu này, kèm ảnh nhãn hoặc tài liệu về chất liệu của đúng mặt hàng đã giao. Việc cập nhật mô tả chưa phải kết luận shop vi phạm.

**Nhánh thiếu nguồn và nhánh AI đã dùng sai nguồn:**

- Nếu `xem_mo_ta_luc_dat` không trả được bản lúc đặt: **“Mình chưa lấy được bản mô tả tại thời điểm bạn đặt nên chưa thể đối chiếu chính xác. Mình sẽ không dùng mô tả hiện tại để kết luận. Bạn có thể bổ sung ảnh xác nhận mua hàng có mô tả hoặc chọn nhờ nhân viên kiểm tra.”** Đánh dấu ảnh do khách cung cấp là nguồn cần kiểm tra; không coi là bản lưu của hệ thống.
- Nếu AI trước đó đã nói “áo khớp mô tả” dựa trên trang hiện tại: **“Mình xin lỗi, câu trả lời trước đã dùng mô tả hiện tại thay vì bản lúc bạn đặt. Nhận xét đó cần được rút lại. Mình sẽ đối chiếu lại bản lúc đặt; hiện chưa có căn cứ để từ chối khiếu nại của bạn.”** Lưu câu cũ với nhãn “Đã đính chính”, không xoá dấu vết.
- Nếu khiếu nại **đã bị đóng thật**, thay câu cuối bằng **“Mình không thể tự mở lại khiếu nại đã đóng. Bạn có thể yêu cầu nhân viên kiểm tra lại quyết định, kèm lỗi dùng sai nguồn vừa phát hiện.”** Không nói đã mở lại hoặc đã lấy lại tiền khi chưa có thao tác hợp lệ.

**Ai được báo, lúc nào, khi không ai thao tác:**

- Người mua được báo ngay khi phát hiện hai phiên bản khác nhau hoặc thiếu bản lúc đặt. Người bán nhận yêu cầu giải thích sau khi `yeu_cau_bang_chung` gửi thành công; dùng mốc phản hồi dựng tại §3.1.
- Chuyển trưởng nhóm ngay nếu không lấy được nguồn lúc đặt, hai bên cung cấp nguồn mâu thuẫn, hoặc phát hiện AI đã dùng sai nguồn để kết luận. Nếu chỉ mới phát hiện mô tả thay đổi và còn thiếu ảnh nhãn, hỏi bổ sung trước; người mua vẫn được chủ động chuyển người.
- Nhân viên nhận cả hai phiên bản, thời điểm, ảnh nhãn nếu có, phản hồi hai bên và phần đính chính. Không dùng việc shop sửa mô tả làm bằng chứng duy nhất để hoàn tiền hay xử phạt.
- Hết 24 giờ không có phản hồi người bán thì chuyển trưởng nhóm, không tự hoàn hoặc từ chối. Nếu người mua không thao tác, bản nháp vẫn là bản nháp, không tự gửi; UI nhắc tình trạng và hạn đã xác minh, không hứa bản nháp giữ quyền trả hàng.

**Quyết định và phương án đã loại:**

- **Chọn trả lời kèm giới hạn, xin đúng ảnh nhãn còn thiếu và soạn nháp khi người mua chọn**, vì bản lúc đặt giải quyết được câu hỏi “đã quảng cáo gì”, chưa giải quyết hết “đã giao gì”.
- **Loại dùng trang hiện tại để từ chối**, vì nguồn đúng ở hiện tại vẫn sai với giao dịch quá khứ; người mua có thể mất tiền dù đã mua theo mô tả khác.
- **Loại hoàn tiền ngay khi thấy shop sửa mô tả**, vì sửa trang chưa chứng minh chiếc áo giao sai; phải cho người bán phản hồi.
- **Chọn dừng kết luận và chuyển người khi thiếu nguồn hoặc đã có kết luận sai**, vì hỏi người mua lặp lại không khôi phục được dữ liệu hệ thống và không xử lý được quyết định đã đóng.

### 3.4 Phân loại lỗi và cách phục hồi

| Tình huống | Loại lỗi và lý do | Cách nói / cách sửa |
|---|---|---|
| K3: so trực tiếp 6L tổng với 5L giỏ | **Ngữ cảnh:** phép so số có thể đúng nhưng ý nghĩa hai thông số khác nhau | Giải thích khác biệt, hỏi phần được đo; không nói người mua cố tình khiếu nại sai |
| K3: AI đọc sai chữ trên tem | **Hệ thống:** nhận dạng ảnh hoặc trích thông tin sai | “Mình xin lỗi, mình đã đọc sai thông số trên ảnh.” Hiện [5] sửa trường sai và đối chiếu lại; huỷ hiệu lực kết luận dựa trên chữ đọc sai |
| K4: dùng mô tả hiện tại thay bản lúc đặt | **Hệ thống:** chọn sai phiên bản nguồn so với yêu cầu nghiệp vụ | Nhận lỗi cụ thể, đánh dấu đính chính, quay về bản lúc đặt; nếu đã đóng hồ sơ thì chuyển người, không hứa tự mở |
| K4: chỉ dựa vào cảm giác mặc nóng | **Ngữ cảnh:** cảm giác trải nghiệm không tương đương bằng chứng thành phần | Công nhận phản ánh, xin ảnh nhãn hoặc chuyển người; không khẳng định khách sai |
| Người dùng chọn nhầm đơn hoặc tải nhầm ảnh, tự xác nhận sau khi xem lại | **Người dùng:** dữ liệu đầu vào nhầm đã được xác nhận; không gán loại lỗi này chỉ vì thiếu bằng chứng | “Bạn có thể đổi đơn hoặc thay ảnh tại đây.” Giữ phần nội dung còn dùng được; chặn gửi cho shop trước khi xác định lại đúng đơn |

**Luồng correction chung:** bấm [5] → xem nguồn và thông tin AI đã trích → sửa / thay ảnh → bấm “Cập nhật và đối chiếu lại” → hiện thay đổi và trạng thái mới. Bản nháp phụ thuộc thông tin cũ được đánh dấu “Cần kiểm tra lại” trước khi gửi. Nếu thông tin sai đã được gửi cho bên kia, gửi bản đính chính sau khi xác nhận thành công; không gọi đây là thu hồi tin đã gửi.

### 3.5 Ba nguyên tắc HAX và vị trí bàn giao prototype

| Nguyên tắc được chọn | Vị trí cụ thể cần dựng ở §5 | Vì sao chọn cách này; phương án đã loại |
|---|---|---|
| **G10 — Thu hẹp phạm vi khi nghi ngờ** | [2] trạng thái chưa kết luận; [4] câu hỏi “Bạn đo phần giỏ chiên hay toàn bộ khoang nồi?” của K3; [6] chuyển người khi thiếu bản lúc đặt ở K4 | Chỉ làm phần có căn cứ, tiếp tục hỗ trợ phần còn thiếu. Loại “AI không chắc, vui lòng thử lại” vì không chỉ được bước tiếp |
| **G11 — Giải thích vì sao** | [3] thẻ nguồn: 6L tổng / 5L giỏ ở K3; hai phiên bản mô tả có thời điểm ở K4 | Người dùng tự kiểm được điểm AI dựa vào. Loại thanh “tin cậy 90%” vì không giải thích nguồn, không được hiệu chuẩn |
| **G9 — Sửa dễ dàng** | [5] sửa thông tin AI đọc sai, thay ảnh hoặc đổi đơn; xem trước nội dung cập nhật và đối chiếu lại | Sửa đúng chỗ sai, giữ bằng chứng còn đúng. Loại bắt mở hội thoại mới / tải lại toàn bộ vì làm mất ngữ cảnh và tăng công |

**Bố trí đủ bộ mã [1]–[8]:** [1] giới thiệu AI và giới hạn; [2] trạng thái; [3] nguồn đối chiếu; [4] bằng chứng thiếu; [5] sửa; [6] chuyển người; [7] thời hạn; [8] khu vực nhân viên xem căn cứ và xác nhận quyết định. TV3 chốt quyền ở [8]; TV4 triển khai và chụp ảnh có số. Ảnh và kết quả bấm thử được bổ sung ở §5 sau khi dựng, không đánh dấu đã đạt ở thời điểm viết §3.

### 3.6 Lỗi mà sửa câu chữ không cứu được

1. **K3: câu “chưa đủ căn cứ” nhưng phía sau vẫn tự chuyển tiền.** Thêm cảnh báo không chặn mất tiền người bán. Thiết kế phải tách nháp khỏi thực hiện như §1.3, chặn đường gọi chuyển tiền của AI và buộc người có thẩm quyền xem căn cứ trước khi xác nhận ở [8]. Tương tự, không cho AI tự gọi đóng khiếu nại.
2. **K4: câu trả lời có dẫn nguồn nhưng nguồn là phiên bản sau khi mua.** Câu chữ lịch sự hoặc đường link sản phẩm không sửa được sai nguồn. Luồng phải lấy bản lúc đặt, hiển thị thời điểm ở [3], và dừng kết luận khi không có bản đó.
3. **Hai ca: nói “đã chuyển nhân viên” khi chuyển lỗi, hoặc “đã giữ quyền” khi mới có nháp.** Nút và thông báo phải phụ thuộc kết quả thao tác, có trạng thái thất bại / thử lại. Tin đã gửi không giả vờ hoàn tác; tiền đã chuyển không hứa lấy lại bằng nút sửa.

### 3.7 Bốn đường đi và kiểm câu chữ trước khi giao TV4

| Đường đi | Ca / điều kiện | Trạng thái và bước tiếp theo cần có |
|---|---|---|
| Bình thường (happy path) | K1: đúng đơn, bản lúc đặt và ảnh nhãn xác nhận khác size | Hướng dẫn, chuẩn bị nháp; người mua kiểm tra bước gửi, không chờ nhân viên chỉ để đọc hướng dẫn; chưa hứa hoàn tiền |
| Chưa chắc (low-confidence) | K3: chưa rõ người mua đo bộ phận nào | Hiện nguồn, hỏi một câu cụ thể, cho sửa hoặc chuyển người; chưa quyết thắng thua |
| Thất bại / thiếu căn cứ (failure) | K4: không lấy được bản mô tả lúc đặt | Nói thiếu nguồn gì, không thay bằng trang hiện tại để kết luận; có chuyển người và trạng thái chuyển thất bại |
| Sửa sai (correction) | K3 đọc nhầm tem hoặc K4 dùng sai phiên bản | Nhận lỗi nếu do hệ thống, cho sửa tại chỗ, đối chiếu lại; giữ đính chính và chuyển người nếu quyết định đã thực hiện |

**Checklist bàn giao UX; chưa phải kết quả kiểm thử prototype:**

- [ ] K3 không hứa hoàn tiền vì 6 khác 5 hoặc vì lời doạ; không tự kết luận người bán đúng chỉ từ tem.
- [ ] K4 dùng bản lúc đặt; thiếu bản thì dừng kết luận; sửa mô tả không tự bị coi là gian lận.
- [ ] Hai bên biết bằng chứng nào còn thiếu, thời hạn phản hồi; nhân viên nhận sẵn nguồn và phần còn bất đồng.
- [ ] Thử “Tôi không có ảnh/nhãn”, “AI đọc sai”, “Gặp nhân viên”, lỗi gửi và lỗi chuyển; đều có bước tiếp theo.
- [ ] Không lộ số điện thoại, địa chỉ giữa hai bên; không có lời hứa phạt shop.
- [ ] Phân biệt nháp / đã gửi / chờ phản hồi / chờ nhân viên / đã có quyết định; không hứa bảo lưu hạn nếu chưa có biên nhận.
- [ ] Chỉ được đúng G10 tại [4], G11 tại [3], G9 tại [5] trên ảnh đánh số và khi bấm demo.

