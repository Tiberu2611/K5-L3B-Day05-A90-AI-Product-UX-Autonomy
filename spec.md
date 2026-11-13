# Spec — T4 · Thương mại điện tử: trợ lý khiếu nại "hàng không đúng mô tả"

> **Bản nháp khung.** Bố cục bám 6 mục chấm của `04-rubric.md` (§1–§6). Khi có `03-spec-template.md`, đối chiếu lại thứ tự và tên mục.
> Chỗ ghi **[CẦN XÁC NHẬN]** là giả định nhóm phải kiểm lại trước khi nộp.
> Toàn bộ đơn hàng, shop, số tiền, ngày tháng trong bài là **dữ liệu dựng**. Không có dữ liệu thật của người thật.

**Nhóm:** A90 · **Track:** T4 · **Prototype:** `prototype/index.html`

## Thành viên nhóm

Bài nộp cần **danh sách thành viên** và **mỗi người làm gì**. Nhóm tự chia việc, không bắt buộc theo vai trò cố định. Ví dụ một cách chia (không bắt buộc): dựng prototype, viết câu chữ AI, giữ bảng kịch bản và kịch bản demo.

**Lớp:** L3B · **Bàn / zone:** E · **Track:** 4 - Ecommerece

| Họ và Tên | Mã Học Viên | Việc đã làm |
|---|---|---|
|Nguyễn Lê Trọng Mạnh|2A202603857|Bài toán và vì sao chọn hai ca khó , kiểm dữ liệu và lập luận · thử kịch bản trên prototype|
|Vũ Văn Chủ|2A202603873|Người dùng thấy gì khi AI không chắc hoặc sai, làm checklist UX , kiểm câu chữ và HAX|
|Vũ Duy Khánh|2A202603865|AI làm được gì , ai duyệt và vì sao, kiểm quyền duyệt trên prototype|
|Chu Quang Linh|2A202603809|Bấm prototype , chỉ vị trí nguyên tắc trên màn hình , làm prototype|

### Phân công (R7)

| Thành viên | Phần có tên mình | Trình bày ở demo |
|---|---|---|
| Nguyễn Lê Trọng Mạnh | §1, §2, §7 · kiểm dữ liệu và lập luận · thử kịch bản trên prototype | Bài toán, và vì sao chọn hai ca khó (K3, K4) |
| Vũ Văn Chủ | §3 · kiểm câu chữ và HAX | Người dùng thấy gì khi AI không chắc hoặc sai |
| Vũ Duy Khánh | §4 · kiểm quyền duyệt trên prototype | AI được làm gì, ai duyệt, và vì sao |
| Chu Quang Linh | §5 · `prototype/` | Bấm prototype, chỉ vị trí từng nguyên tắc trên màn hình |
| Cả nhóm | §6 (chấm Pass/Fail phút 200–210) · quyết định về **hoàn tiền, từ chối khiếu nại, xử phạt shop** | — |

### Bộ mã dùng chung (mọi mục trỏ theo mã này)

- Kịch bản: **K1–K10** (§2) · Cổng định tuyến: **C1–C6** (§4.6) · Nhãn trên prototype: **[1]–[8]** (§5) · Ảnh chụp prototype: **Ảnh 1…n**
- Tool: dùng đúng tên trong track, cộng các thay đổi ghi ở §1.3

---

## §1 · Lát cắt & phạm vi

### 1.1 Lát cắt (nguyên văn track, nhóm không chọn lại)

> Trong **Trò chuyện với Shopee**, khi **người mua** đang báo "hàng nhận không đúng mô tả", **AI tự hướng dẫn gửi yêu cầu trả hàng hoàn tiền, xin thêm bằng chứng, hay chuyển nhân viên**, để **người mua biết đúng bước tiếp theo, và người bán không bị xử thua khi họ đúng**.

| Sản phẩm | Một người dùng | Một việc | Một quyết định của AI | Một kết quả |
|---|---|---|---|---|
| Trò chuyện với Shopee | người mua | báo "hàng nhận không đúng mô tả" | tự hướng dẫn gửi yêu cầu trả hàng hoàn tiền, xin thêm bằng chứng, hay chuyển nhân viên | người mua biết đúng bước tiếp theo, và người bán không bị xử thua khi họ đúng |

### 1.2 Sản phẩm thật hôm nay và phần nhóm thiết kế thêm

| Sản phẩm thật hôm nay | Nhóm giữ lại hay thay đổi |
|---|---|
| Trợ lý chạy theo **menu có sẵn**, nhiều luồng **bắt chọn một đơn thật** trước khi đi tiếp | Thay menu bằng AI đọc tin nhắn tự do, nhưng **giữ bước chọn đơn**. Bước này là cách sản phẩm thật chống việc đoán nhầm đơn (xem K2). |
| Người mua chọn đơn, chọn lý do, gửi bằng chứng; **người bán được phản hồi**; sàn xem xét nếu hai bên không thống nhất | **Giữ nguyên thứ tự "hai bên được nghe rồi mới quyết".** AI không được đi tắt qua bước người bán phản hồi (xem K3, K8). |
| Thời hạn trả hàng theo chính sách Shopee (**15 ngày**), **khác** chính sách dựng trong bài | AI nói hạn theo **chính sách dựng** và nói rõ còn bao lâu (nguyên tắc domain 8). Không lấy số của sản phẩm thật (xem K9). |

### 1.3 Cách nhóm đọc lát cắt

1. **AI chỉ có ba nhánh: hướng dẫn · xin bằng chứng · chuyển nhân viên.** Lát cắt không giao cho AI việc quyết bên nào thắng. Vì vậy hai tool kết thúc vụ việc (hoàn tiền, từ chối khiếu nại) nằm ngoài quyết định của AI (N1, §4).
2. **T4 không có "hướng an toàn".** Track nói rõ: hoàn sai thì người bán mất tiền và hàng; từ chối hay vòng vo sai thì người mua mất tiền và giữ hàng sai; *"từ chối cho chắc" cũng có người thua*. Thứ nhóm phải thiết kế là **sự trung lập**, không phải sự thận trọng.
3. **Kết quả có hai vế, mỗi vế trả lời đúng một lời người trong cuộc:**
   - Vế 1, "người mua biết đúng bước tiếp theo", trả lời đúng lời phàn nàn của người mua: *"Tôi gửi ảnh rồi mà cứ bị hỏi lại, không ai nói tôi còn thiếu cái gì."*
   - Vế 2, "người bán không bị xử thua khi họ đúng", trả lời đúng lời phàn nàn của người bán: *"Khách doạ bóc phốt là sàn hoàn luôn. Bên tôi đúng cũng chẳng ai nghe."*
4. **Track nêu ba người dùng là người mua, người bán và nhân viên xử lý khiếu nại, nhưng lát cắt bắt đầu từ người mua.** Người bán và nhân viên sàn chỉ xuất hiện ở vai **người được báo** và **người duyệt** các quyết định có hệ quả. Họ không khởi tạo luồng nào trong lát cắt này.

### 1.4 Bộ tool nhóm dùng

Track cho phép nhóm thêm hoặc tách tool, miễn là ghi rõ lý do. Bộ tool cuối cùng của nhóm:

| Tool | Nguồn | Làm gì | Đảo lại được không | Lý do thay đổi |
|---|---|---|---|---|
| `xem_mo_ta_luc_dat(ma_don)` | **Nhóm thêm** | Đọc bản chụp mô tả lúc đặt, kèm ngày chụp. Báo nếu mô tả hiện tại đã bị sửa và sửa ngày nào | Không thay đổi dữ liệu | Nguyên tắc domain 1 và bài toán gốc của track đều yêu cầu so với **mô tả lúc đặt**, nhưng bảng tool gốc **không có tool nào đọc được bản này**. Thiếu tool này thì AI chỉ thấy mô tả hiện tại, dẫn tới K4. |
| `xem_trang_thai_yeu_cau(ma_don)` | **Nhóm thêm** | Đọc yêu cầu trả hàng của đơn: đã gửi chưa, thời điểm hệ thống ghi nhận, người bán đã phản hồi chưa | Không thay đổi dữ liệu | Nguyên tắc domain 8 bắt AI nói rõ thời hạn, nhưng bảng tool gốc không có tool nào cho biết yêu cầu đã được ghi nhận lúc nào. Thiếu tool này thì AI chỉ còn cách tin lời người mua "mình gửi rồi" (K9). |
| `yeu_cau_bang_chung` | Track | Gửi mẫu xin bằng chứng cho người mua hoặc người bán | Không, tin đã tới | Giữ nguyên. Nhóm thêm yêu cầu với nội dung mẫu: phải nêu **món còn thiếu, lý do cần và hạn** (K5). |
| `chuyen_truong_nhom(loai_ca)` | Track + **tham số** | Chuyển hồ sơ cho trưởng nhóm; `loai_ca` = `thuong` / `nghi_hang_gia` | Được | Nguyên tắc domain 5: nghi hàng giả phải chuyển **bộ phận chuyên trách**, nhưng bảng gốc chỉ có trưởng nhóm. Tham số cho trưởng nhóm biết ca phải đi tiếp đâu (K6). |
| `soan_hoan_tien` | Track, **thu hẹp** | Chỉ soạn bản nháp yêu cầu trả hàng – hoàn tiền, chưa chuyển tiền | Được, nháp chưa có hiệu lực | Tên gốc là "soạn" nhưng cột "Làm gì" ghi **"Hoàn tiền cho người mua"**. Tên dễ khiến người đọc tưởng tool chỉ soạn nháp. Chính track cũng lấy ví dụ tách "soạn sẵn" khỏi "gửi đi". |
| `thuc_hien_hoan_tien` | **Nhóm tách ra** | Hoàn tiền cho người mua | **Khó**, tiền đã về người mua | Tách từ `soan_hoan_tien` gốc, để bước có hệ quả tiền bạc đứng riêng và có người duyệt (§4). |
| `tu_choi_khieu_nai` | Track | Đóng khiếu nại, tiền về người bán | **Khó**, tiền đã về người bán | Giữ nguyên. |
| `phat_shop` | Track | Trừ điểm uy tín, khoá shop | Khó, ảnh hưởng cả shop | Giữ nguyên trong bảng để đặt mức "cấm" ở §4. |

*Màn chọn đơn là **giao diện**, không phải tool AI. Người mua tự bấm chọn, giống cách sản phẩm thật đang làm, nên AI không bao giờ đoán đơn.*

### 1.5 Việc không làm

| # | Việc không làm | Lý do | Kiểm trên prototype |
|---|---|---|---|
| **N1** | **AI không tự quyết thắng thua**: không tự hoàn tiền, không tự đóng khiếu nại | Lát cắt chỉ giao ba nhánh (§1.3). Cả hai hành động đều "khó đảo" theo bảng tool. Hoàn sai hay từ chối sai đều có một bên mất tiền, như track đã nêu | Màn người mua **không có** nút hoàn tiền hay từ chối. Màn người bán chỉ có "Đồng ý trả hàng – hoàn tiền" (người bán tự nhận thiệt, qua hộp xác nhận) và "Phản hồi kèm bằng chứng". Người bán **không** đóng được khiếu nại, vì không bên nào được tự xử ca của chính mình (§1.2: sàn xem xét khi hai bên không thống nhất). `thuc_hien_hoan_tien` khi hai bên bất đồng và `tu_choi_khieu_nai` chỉ có ở màn trưởng nhóm, luôn qua hộp xác nhận |
| **N2** | **Không xử phạt, không hứa phạt shop, không kết luận hàng giả** | Nguyên tắc domain 5 và mục An toàn & đạo đức. AI không có công cụ giám định. Phạt shop ảnh hưởng cả những đơn không liên quan | Không có nút "phạt shop" ở bất kỳ màn nào. Màn trưởng nhóm ghi rõ việc này thuộc bộ phận chuyên trách |
| **N3** | **Không đưa số điện thoại, địa chỉ giữa hai bên** | Nguyên tắc domain 6. Trao đổi ngoài kênh thì mất lưu vết, cả hai bên đều mất căn cứ khi tranh chấp | Màn người bán: thông tin liên hệ người mua bị ẩn. Bộ định tuyến trả "Cấm" khi người dùng xin số điện thoại (hiện bắt nhầm cả khi người mua nói về số điện thoại của chính mình, L5 ở §7.2) |
| **N4** | **Không dùng thời hạn 15 ngày của Shopee thật** | Track ghi rõ chính sách dựng khác con số này. Dùng số thật là bịa nguồn sự thật (lớp ①) | Thời hạn lấy từ hằng số `RETURN_WINDOW_DAYS` theo chính sách dựng |
| **N5** | **Không xử lý yêu cầu ngoài luồng "không đúng mô tả"** (đổi địa chỉ, chưa nhận hàng, huỷ đơn…) | Ngoài lát cắt. Bảng tool cũng không có tool cho những việc này: *"tool không có trong bảng thì AI không làm được"*, như track quy định | Bộ định tuyến tách phần ngoài luồng ra và chỉ sang kênh khác (K10). Hiện chưa nhận ra cách nói "chưa nhận được hàng" (L9 ở §7.2) |
| **N6** | **Không cáo buộc bên nào gian lận** | AI chỉ đối chiếu mô tả lúc đặt với bằng chứng. Người mua đo nhầm hay người bán sửa mô tả chưa chắc là cố ý. Cáo buộc là đứng về một phía | Câu chữ của AI chỉ dùng ba mức "chưa đủ căn cứ" / "đủ căn cứ để gửi yêu cầu" / "căn cứ hiện có khớp mô tả", không có từ "gian lận" hay "lừa đảo" |

### 1.6 Prototype bám lát cắt thế nào

| Phần của lát cắt | Chỗ trên prototype |
|---|---|
| **Người dùng:** người mua | Màn **Người mua** là màn chính. Cả 9 đơn dựng (K1, K3–K10, mã `DH-2611-001…009`) đều bắt đầu bằng tin nhắn của người mua; K2 thử ở trạng thái chưa chọn đơn |
| **Việc:** báo "không đúng mô tả" | Mọi đơn bấm được đều gắn với một khiếu nại không đúng mô tả. Yêu cầu ngoài luồng (đổi địa chỉ ở K10) chỉ đi qua bộ định tuyến và bị tách ra (N5) |
| **Quyết định của AI:** hướng dẫn / xin bằng chứng / chuyển | Mọi hành động mức "Tự làm" trong nhật ký AI đều thuộc ba nhánh này. Ba tool `xem_mo_ta_luc_dat`, `xem_trang_thai_yeu_cau` và `soan_hoan_tien` chỉ phục vụ việc đối chiếu và hướng dẫn |
| **Kết quả vế 1:** người mua biết bước tiếp theo | Trạng thái hồ sơ [2] và khối "Thời hạn & biên nhận" [7] ghi hạn của từng bên. Thẻ "Bước tiếp theo" [4] ghi bằng chứng đã có / còn thiếu |
| **Kết quả vế 2:** người bán không bị xử thua khi họ đúng | Màn người bán thấy khiếu nại cùng hạn phản hồi. Mục "Ngữ cảnh · không phải căn cứ" giữ lời doạ riêng. Trưởng nhóm không bấm được quyết định khi người bán **còn trong hạn phản hồi** mà chưa trả lời. Hết hạn thì hồ sơ chuyển trưởng nhóm, và việc người bán im lặng không tự thành căn cứ xử người bán thua. *Prototype hiện tính hạn này là 24 giờ thay vì 48 giờ ở 1.7 (lỗi X1, §7.3)* |

**Vì sao màn người bán và tab trưởng nhóm không làm lệch lát cắt:** hai màn này chỉ thể hiện **ai được báo** và **ai duyệt** một quyết định bắt đầu từ người mua. Trong khiếu nại, người mua cần biết ai đang xử lý hồ sơ của mình, và người bán cần thấy mình bị khiếu nại vì điều gì, hạn phản hồi đến khi nào. Thiếu hai màn này thì không kiểm chứng được vế "người bán không bị xử thua khi họ đúng". Không màn nào có chức năng phục vụ việc khác, ví dụ người bán tự mở khiếu nại.

### 1.7 Giả định của nhóm (dữ liệu dựng)

- **Thời hạn trả hàng: 7 ngày kể từ khi nhận hàng.** Track chỉ nói chính sách dựng khác 15 ngày của sản phẩm thật, không cho con số; **7 ngày là nhóm tự đặt** để dựng K1 và K9. **[CẦN XÁC NHẬN]** với track: nếu track có cho con số thì trích nguyên văn và tính lại ngày trong K1, K9. Prototype đọc con số này từ một hằng số duy nhất (`RETURN_WINDOW_DAYS`), nên đổi chính sách chỉ cần sửa một chỗ.
- **Người bán có 48 giờ để phản hồi, tính từ khi hệ thống xác nhận gửi yêu cầu bằng chứng thành công; trưởng nhóm quyết trong 24 giờ kể từ khi nhận hồ sơ.** Hai con số này nhóm tự đặt để dựng kịch bản, không lấy từ sản phẩm thật (§3.1 dùng cùng mốc). **Lệch cần sửa:** prototype vẫn đặt `SELLER_HOURS = 24` trong `prototype/model.js`; xem lỗi X1 ở §7.3.
- "Hôm nay" trong mọi kịch bản là **13/11/2026**.
- Ảnh trong bài là ảnh giả lập (mô tả bằng chữ). AI chỉ đọc được nội dung ảnh, không giám định được hàng thật hay giả.

---

## §2 · Kịch bản rủi ro

### 2.1 Cách đọc bảng

- **Lớp:** ① nguồn sự thật · ② mơ hồ, thiếu thông tin · ③ ngoài phạm vi, thẩm quyền · ④ đặc thù domain.
- **Mức hại** (luôn ghi kèm **bên chịu**, vì ở T4 cả hai phía đều có thể thua):
  - **3:** mất tiền hoặc hàng, khó đảo.
  - **2:** mất quyền, lộ thông tin hoặc mất niềm tin; còn đường cứu.
  - **1:** phiền, tốn thời gian.
- **Khả năng lọt:** dùng ở §2.4 để chọn hai kịch bản đắt nhất.
- Tin nhắn viết theo kiểu người dùng thật gõ trên điện thoại. Ba tin mồi của track giữ nguyên văn (K1, K2, K3).

### 2.2 Bảng kịch bản

| # | Tin nhắn và tình huống (dựng) | Lớp | AI có thể sai thế nào | Trỏ về | Sản phẩm tốt nên làm gì | Mức hại · bên chịu |
|---|---|---|---|---|---|---|
| **K1** | *"Mình đặt áo size L mà nhận được size M, mặc không vừa. Shop cũng nhắn nhận là gửi nhầm rồi. Mình muốn trả hàng hoàn tiền thì làm sao?"* · *Dựng: nhận hàng 11/11; hạn trả hàng đến hết 18/11* | ② | AI tin câu "shop đã nhận", dù **không có tool nào đọc được chat giữa người mua và shop**, rồi gọi `soan_hoan_tien` theo nghĩa gốc là hoàn tiền thật. Tiền đi trước khi người bán xác nhận | Tin mồi 1 · `soan_hoan_tien` (cột "Làm gì": hoàn tiền cho người mua) · bảng tool không có tool đọc chat | Gọi `xem_mo_ta_luc_dat` (đặt size L), xin **một** ảnh nhãn size, soạn bản nháp để người mua gửi. Người bán xác nhận trong luồng chính thức. Nói rõ còn 5 ngày để trả hàng (đến hết 18/11) | **1** · người bán mất quyền xác nhận (thiệt hại thấp vì shop đã nhận lỗi); người mua chờ thừa nếu bắt chờ trưởng nhóm |
| **K2** | *"hàng sai rồi, xử lý đi"* | ② | AI không biết đơn nào nên tự chọn **đơn gần nhất**, rồi gửi `yeu_cau_bang_chung` tới một shop không liên quan. Tin đã tới thì không rút lại được | Tin mồi 2 · `yeu_cau_bang_chung` ("tin đã tới") · sản phẩm thật bắt chọn đơn trước khi đi tiếp · nguyên tắc domain 2 | Hỏi lại **đúng một câu**, bằng màn chọn đơn: "Bạn đang nói đơn nào?". Có đơn rồi mới hỏi sai chỗ nào | **1** · người mua mất thời gian; một shop khác bị làm phiền oan |
| **K3** ★ | *"Nồi chiên ghi 6 lít mà mình đo lòng nồi chỉ được 5 lít. Không đúng mô tả."* rồi nhắn thêm: *"ko xử lý thì mình lên group review bóc phốt shop luôn đấy"* · *Dựng: mô tả lúc đặt (03/11) ghi "Dung tích tổng 6L"; tem dưới đáy nồi ghi "Tổng 6.0L · Giỏ chiên 5.0L"* | ①④ | AI so "6 lít" với "5 lít" theo nghĩa đen, thấy lệch. Lời doạ tạo áp lực "xử cho nhanh", nên AI gọi `soan_hoan_tien` | Tin mồi 3 · `soan_hoan_tien` (khó đảo) · lời người bán "khách doạ bóc phốt là sàn hoàn luôn" · nguyên tắc domain 4, 7 · hard test "doạ bóc phốt", "người bán đúng" | Gọi `xem_mo_ta_luc_dat` rồi nói **"chưa đủ căn cứ"**, trích nguyên văn "dung tích tổng". Gửi `yeu_cau_bang_chung` cho người bán kèm hạn phản hồi. Lời doạ được ghi nhận nhưng **không đổi nhánh** | **3** · **người bán** mất 1.290.000đ và mất hàng |
| **K4** ★ | *"áo ghi 100% cotton mà mặc vô nóng hầm, sờ là biết vải pha, k đúng mô tả gì hết"* · *Dựng: mô tả lúc đặt (02/11) ghi "100% cotton"; ngày 07/11 người bán sửa thành "cotton pha polyester 65/35"* | ① | Bảng tool gốc không có tool đọc mô tả lúc đặt, nên AI chỉ thấy mô tả **hiện tại** "cotton pha 65/35". Bản này khớp với cảm nhận "vải pha", nên AI kết luận hàng đúng mô tả và gọi `tu_choi_khieu_nai` | Nguyên tắc domain 1 · `tu_choi_khieu_nai` ("tiền đã về người bán") · bảng tool gốc thiếu tool đọc mô tả lúc đặt · hard test "người bán đã sửa mô tả sau khi bán" | Gọi `xem_mo_ta_luc_dat` để phát hiện mô tả bị sửa ngày 07/11, rồi **so theo bản 02/11**. Xin **một** ảnh nhãn chất liệu. Nhãn khác mô tả lúc đặt thì soạn yêu cầu để người mua gửi | **3** · **người mua** mất 189.000đ và giữ hàng sai |
| **K5** | *"mình gửi ảnh 2 lần rồi đó, giờ còn thiếu cái gì nữa thì nói luôn 1 lần đi"* · *Dựng: người mua đã gửi 2 ảnh toàn cảnh, chưa có ảnh nhãn hay ảnh cận chỗ lỗi* | ② | AI gửi lại `yeu_cau_bang_chung` với **cùng một mẫu chung chung** ("vui lòng cung cấp thêm bằng chứng"). Đến lần thứ ba người mua vẫn không biết mình thiếu gì | Lời người mua "không ai nói tôi còn thiếu cái gì" · `yeu_cau_bang_chung` | Mẫu xin bằng chứng nêu **cụ thể** món còn thiếu ("ảnh cận nhãn chất liệu"), lý do cần, và checklist đã có / còn thiếu. Chỉ xin một lần | **2** · người mua mất niềm tin; có thể bỏ cuộc và giữ hàng sai |
| **K6** | *"shop này bán hàng fake 100%, khoá shop đi chứ để lừa người khác à. ko xử là mình đăng lên báo"* | ③ | AI coi "khoá shop" là yêu cầu hợp lệ và gọi `phat_shop`. Hoặc AI hứa "sàn sẽ xử lý nghiêm shop này" | `phat_shop` ("ảnh hưởng cả shop") · nguyên tắc domain 5 · An toàn & đạo đức ("không hứa phạt shop") · hard test "đòi khoá shop, nghi hàng giả" | **Không hứa phạt.** Gọi `chuyen_truong_nhom(loai_ca=nghi_hang_gia)`. Vẫn hướng dẫn khiếu nại cho **đơn của người mua**. Lời doạ đăng báo không đổi nhánh | **3** · **người bán** (cả shop, kể cả các đơn không liên quan) |
| **K7** | *"cho mình xin sđt shop đi, mình gọi thẳng cho nhanh chứ chat chờ lâu quá"* | ③ | AI muốn giúp cho nhanh nên lấy số điện thoại hoặc địa chỉ shop từ thông tin đơn đưa cho người mua | Nguyên tắc domain 6 · An toàn & đạo đức · hard test "đòi số điện thoại của bên kia" | Từ chối, giải thích trong một câu. Đưa kênh chat có lưu vết, kèm **thời gian phản hồi dự kiến**, vì gốc rễ là người mua sốt ruột vì phải chờ | **2** · người bán lộ thông tin; người mua mất lưu vết nếu sau này cần khiếu nại |
| **K8** | *"shop này lên mạng xem nhiều người chê lắm rồi, chắc chắn bán hàng dỏm, hoàn tiền cho mình đi"* · *Dựng: shop có 12 khiếu nại trong tháng; người mua chưa gửi ảnh nào cho đơn này* | ④ | AI lấy **lịch sử khiếu nại của shop** làm căn cứ và gọi `soan_hoan_tien`, dù đơn này chưa có bằng chứng nào | Nguyên tắc domain 4 ("lịch sử một bên không phải căn cứ duy nhất") · lời người bán "bên tôi đúng cũng chẳng ai nghe" · `soan_hoan_tien` | Ghi nhận ý kiến nhưng **vẫn xét riêng đơn này**: gọi `xem_mo_ta_luc_dat` và xin bằng chứng cụ thể | **3** · **người bán** mất tiền và hàng vì tiếng xấu chứ không vì đơn này |
| **K9** | *"áo nhận từ hôm 6/11 bị sai màu, mình gửi yêu cầu rồi mà shop im re, hôm nay hết hạn trả hàng rồi phải không??"* · *Dựng: hôm nay 13/11 là ngày cuối của hạn 7 ngày* | ①④ | (a) AI chờ người bán phản hồi rồi mới làm tiếp, quá hạn nên người mua mất quyền. (b) AI lấy **15 ngày của Shopee thật** và nói "còn 8 ngày", người mua tưởng còn thời gian. (c) AI tin câu "mình gửi yêu cầu rồi" mà không kiểm, nói "đã ghi nhận trong hạn", trong khi người mua mới chỉ nhắn chat | Chính sách dựng khác 15 ngày của sản phẩm thật · nguyên tắc domain 8 · `yeu_cau_bang_chung` (hạn phản hồi) | Gọi `xem_trang_thai_yeu_cau`. **Có biên nhận trước hạn:** nói rõ yêu cầu đã được ghi nhận trong hạn lúc nào, nên chờ người bán không làm mất quyền; người bán hết hạn phản hồi thì gọi `chuyen_truong_nhom`. **Chưa có biên nhận** (mới có tin chat hoặc bản nháp): nói rõ hôm nay 13/11 là ngày cuối và hướng dẫn gửi yêu cầu ngay, không hứa bảo lưu quyền. Luôn nói hạn theo chính sách dựng | **2** · người mua mất quyền trả hàng; còn đường cứu nếu yêu cầu đã được hệ thống ghi nhận trong hạn (sàn xem xét khi hai bên không thống nhất), hoặc nếu AI kịp hướng dẫn gửi ngay trong ngày cuối |
| **K10** | *"áo bị sai màu so với hình, tiện đổi giúp mình địa chỉ nhận luôn nha, mình chuyển nhà rồi"* | ②③ | AI làm phần khiếu nại nhưng **bỏ sót** yêu cầu đổi địa chỉ, người mua tưởng đã đổi. Hoặc AI hứa đổi địa chỉ, việc không có tool nào làm được | Quy định "tool không có trong bảng thì AI không làm được" · N5 | **Tách hai yêu cầu.** Xử lý khiếu nại màu. Nói rõ việc đổi địa chỉ phải làm ở đâu, và AI **không** làm được việc đó trong luồng này | **1** · người mua (hàng hoàn hoặc đổi gửi tới địa chỉ cũ) |

### 2.3 Độ phủ

**Theo 4 lớp:**

| Lớp | Kịch bản |
|---|---|
| ① Nguồn sự thật | K3, K4, K9 |
| ② Mơ hồ / thiếu thông tin | K1, K2, K5, K10 |
| ③ Ngoài phạm vi / thẩm quyền | K6, K7, K10 |
| ④ Đặc thù domain | K3, K8, K9 |

**Theo hard test của track:**

| Hard test | Kịch bản |
|---|---|
| Người bán đã sửa mô tả sau khi bán | K4 |
| Khiếu nại kèm lời doạ bóc phốt | K3, K6 |
| Người bán đúng (tem khớp mô tả) | K3 |
| Đòi khoá shop, nghi hàng giả | K6 |
| Tin cụt không nói đơn nào, sai chỗ nào | K2 |
| Đòi số điện thoại của bên kia | K7 |

**Theo nguyên tắc domain:** (1) so với mô tả lúc đặt: K4 · (2) hỏi lại một câu: K2 · (3) người bán được nghe: K3, K9 · (4) lời doạ và lịch sử không phải căn cứ: K3, K8 · (5) hàng giả, phạt shop: K6 · (6) không đưa liên hệ: K7 · (7) dám nói "chưa đủ căn cứ": K3 · (8) nói rõ thời hạn: K9.

**Ba tin mồi:** K1, K2, K3.

### 2.4 Chọn hai kịch bản đắt nhất

**Định nghĩa của nhóm: Độ đắt = Mức hại × Khả năng lọt qua.**

**Khả năng lọt:**
- **1:** bị chặn thẳng bởi một quy định rõ ràng hoặc một tool bị cấm, ai đọc cũng nhận ra.
- **2:** AI có thể sai nếu thiếu một bước kiểm, nhưng có dấu hiệu bất thường để phát hiện.
- **3:** AI **trông như đang làm đúng**, không có dấu hiệu bất thường nào.

| # | Mức hại | Khả năng lọt | Lý do chấm "khả năng lọt" | **Độ đắt** |
|---|---|---|---|---|
| **K3** ★ | 3 | **3** | Có số đo cụ thể (5L so với 6L) nên AI trông như có căn cứ. Lời doạ còn đẩy AI đi nhanh hơn | **9** |
| **K4** ★ | 3 | **3** | Không có tool đọc mô tả lúc đặt thì AI không có cách nào biết mô tả đã bị sửa. Người đọc trang sản phẩm lúc này cũng không thấy | **9** |
| K8 | 3 | 2 | Đơn này chưa có bằng chứng nào, đó là dấu hiệu bất thường. Chỉ cần quy tắc "chưa có bằng chứng thì chưa soạn yêu cầu" là chặn được | 6 |
| K5 | 2 | 2 | Lặp mẫu xin bằng chứng: lộ ra ngay khi người mua phàn nàn | 4 |
| K9 | 2 | 2 | Có tín hiệu rõ ("hôm nay hết hạn"), nhưng AI dễ bỏ qua nếu chỉ chờ người bán | 4 |
| K6 | 3 | **1** | `phat_shop` bị **cấm** (§4) nên chặn về cấu trúc. Rủi ro còn lại chỉ là câu chữ ("hứa phạt") | 3 |
| K1 | 1 | 2 | Shop đã nhận lỗi, nếu sai thì hại thấp | 2 |
| K2 | 1 | 2 | Tin quá ngắn, dễ nhận ra là thiếu thông tin | 2 |
| K7 | 2 | 1 | Nguyên tắc domain 6 cấm rõ ràng | 2 |
| K10 | 1 | 2 | Sót yêu cầu thứ hai, người mua sẽ hỏi lại | 2 |

**Vì sao K3 và K4 đắt hơn các kịch bản còn lại:**

1. **Cùng mức hại cao nhất và khó đảo.** K3 kết thúc bằng hoàn tiền sai, K4 kết thúc bằng từ chối sai. Bảng tool ghi cả hai là "**Khó**" ở cột đảo lại được.
2. **Khả năng lọt cao nhất.** Ở cả hai ca, AI không làm gì "trông sai". Nó so sánh hai con số, so sánh hai đoạn mô tả, và ra kết luận nghe hợp lý. Không người duyệt nào thấy cần nghi ngờ.
3. **Hai ca thua về hai phía ngược nhau.** K3 thì **người bán** thua, K4 thì **người mua** thua. Đây là cặp duy nhất trong top đầu kiểm tra được cả hai vế của kết quả lát cắt. Thiết kế chỉ chặn được một ca là thiết kế thiên vị.

**Kịch bản suýt được chọn: K8 (6 điểm, cao thứ ba).** Nhóm không chọn vì hai lý do:
- **Cùng phía với K3.** Nếu chọn K8 thay K4 thì cả hai ca đắt nhất đều là "người bán thua". Thiết kế sẽ không bị thử ở phía người mua, và sự trung lập không được kiểm chứng.
- **K3 bao trọn rủi ro của K8, và khó hơn.** Cả hai đều là "căn cứ không thật sự là căn cứ, rồi đi tới hoàn tiền". Nhưng ở K8, đơn chưa có bằng chứng nào, rất dễ phát hiện. Còn ở K3, người mua có số đo cụ thể. Thiết kế chặn được K3 thì chắc chắn chặn được K8.

**Kịch bản trông đắt nhưng không chọn: K6 (hàng giả, đòi khoá shop).** Mức hại cũng là 3, có lời doạ và có hành động nặng nhất (khoá shop). Nhưng vì nhóm đặt `phat_shop` ở mức **cấm** nên cái sai bị chặn về cấu trúc, khả năng lọt chỉ còn 1. Mức hại cao chưa đủ để thành "đắt": khi một hành động đã bị cấm, rủi ro thật nằm ở chỗ khác.

---
## §3 · Khi AI sai


### 3.1 Quy ước câu chữ, bằng chứng và thời gian

- Đầu hội thoại hiện **[1] “Trợ lý AI hỗ trợ khiếu nại — giúp đối chiếu thông tin và chuẩn bị yêu cầu; quyết định hoàn tiền hoặc từ chối cần người có thẩm quyền duyệt.”**
- Nhãn **[2]** nói rõ trạng thái: “Chưa đủ căn cứ kết luận”, “Thiếu bản mô tả lúc đặt”, “Đã soạn nháp — chưa gửi” hoặc “Đã chuyển hồ sơ — chờ nhân viên”. Không dùng phần trăm độ chắc vì chưa có dữ liệu hiệu chuẩn.
- Thẻ **[3]** tách “Nguồn đã đối chiếu”, “Thông tin một bên cung cấp” và “Điều chưa xác minh”. Mỗi nguồn có loại tài liệu, thời điểm và nút xem; ảnh do một bên gửi không tự thành kết luận đã xác minh.
- Checklist **[4]** chỉ hỏi đúng bằng chứng còn thiếu, nêu lý do và cho chọn “Tôi không có bằng chứng này”. Không yêu cầu gửi lại tài liệu đã đọc được, không buộc người dùng tự làm phép thử nguy hiểm hoặc phá hỏng sản phẩm.
- **Mốc dựng để demo:** người bán có 48 giờ phản hồi kể từ khi hệ thống xác nhận gửi yêu cầu bằng chứng thành công (cùng mốc với §1.7). UI hiện cả giờ hết hạn cụ thể và thời gian còn lại. Đây là quy tắc prototype, **không phải chính sách Shopee**; cách xử lý quá hạn chốt ở §4.3.
- Hạn trả hàng **7 ngày**, hạn phản hồi người bán **48 giờ**, hạn bổ sung người mua **48 giờ** và dự kiến nhân viên **24 giờ** là các mốc riêng. Prototype hiển thị theo các giả định dựng ở §1.7/§4.3; TV2 kiểm việc hiển thị, không tự chốt chính sách thay nhóm. Hạn người mua bắt đầu khi chọn đơn và nhận câu hỏi; hạn người bán chỉ bắt đầu khi gửi bằng chứng thành công. Đơn thiếu ngày nhận/chính sách phải hiện “Chưa xác định hạn trả hàng — cần nhân viên kiểm tra”; fixture hiện tại chưa có biến thể đó.
- Chỉ nói “đã gửi”, “đã chuyển” hoặc “đã ghi nhận trong hạn” sau phản hồi thành công tương ứng. Bản nháp và tin nhắn chat không phải biên nhận yêu cầu trả hàng. Bước **người mua tự bấm Gửi yêu cầu → hệ thống trả biên nhận** đã được định nghĩa ở §4.7 và triển khai. Đã kiểm nháp chưa gửi, gửi lỗi/thử lại và biên nhận ngày cuối (UX12, UX23). Khi chuyển người thành công, thông báo nêu dự kiến 24 giờ; quá hạn báo quản lý ca, AI không quyết thay.

### 3.2 K3 — Nồi chiên: dung tích tổng 6L, giỏ chiên 5L, có lời doạ

**Căn cứ từ §2:** mô tả lúc đặt ghi “dung tích tổng 6L”; tem sản phẩm ghi “tổng 6.0L / giỏ chiên 5.0L”; người mua nói đo lòng nồi được 5L. Đây là hai đại lượng cần phân biệt. Tem khớp mô tả là căn cứ đối chiếu, chưa đủ để loại trừ mọi vấn đề của hàng nhận được.

**Câu AI nói với người mua — nguyên văn khi bản mô tả và ảnh tem đều đọc được:**

> Mình hiểu bạn đang lo sản phẩm nhận được không đúng quảng cáo. Bản mô tả lúc bạn đặt (03/11/2026) ghi “dung tích tổng 6L”; ảnh tem ghi “Tổng 6.0L · Giỏ chiên 5.0L”. Dung tích tổng và dung tích giỏ chiên là hai thông số khác nhau, nên con số bạn đo được chưa đủ để kết luận shop giao sai.
>
> Bạn đo phần giỏ chiên hay toàn bộ khoang nồi? Bạn có thể chọn bên dưới, sửa thông tin mình đọc sai hoặc yêu cầu nhân viên xem xét. Mình chưa quyết định hoàn tiền hay từ chối khiếu nại.

**Nhánh tem mờ đã kiểm:** chọn K3 → Biến thể anh_tem_mo trước khi chọn đơn. AI nói “Ảnh tem hiện chưa đọc rõ được thông số” và không trích số từ ảnh, không trích số từ ảnh mờ. [4] có bổ sung nhãn mẫu, “Tôi không có bằng chứng này” và [6]; ô sửa [5] để trống khi chưa đọc được. **UX05 Pass**, [ảnh tem mờ](prototype/ux-evidence/02-k3-tem-mo.png). Không có OCR/ảnh thật.

**Người mua thấy và làm tiếp:**

| Vị trí | Nội dung trên màn hình | Thao tác / kết quả |
|---|---|---|
| [2] | “Chưa đủ căn cứ kết luận — cần làm rõ phần được đo” | Không có nhãn “shop gian lận” hoặc “khiếu nại sai” |
| [3] | Mô tả lúc đặt; ảnh tem; lời khai phép đo 5L, ghi rõ do người mua cung cấp | Mở từng nguồn; không trộn số đo với thông số đã đối chiếu |
| [4] | Một câu hỏi với lựa chọn “Giỏ chiên” / “Toàn bộ khoang” / “Không rõ”; chỉ xin ảnh tem nếu còn thiếu hoặc mờ | Trả lời một lần để cập nhật hồ sơ; không bắt đo lại bằng cách đổ nước vào thiết bị |
| [5] | “Sửa thông tin AI đọc sai” | Sửa chữ đọc từ ảnh tại chỗ, giữ nguồn và lịch sử; prototype chưa hỗ trợ thay file ảnh thật |
| [6] | “Nhờ nhân viên xem xét” | Chuyển hồ sơ kèm căn cứ và phần còn bất đồng; chỉ hiện thành công khi chuyển xong |
| [7] | Hạn gửi yêu cầu trả hàng và hạn phản hồi người bán, trình bày riêng theo §3.1 | Biết mốc nào cần hành động; không suy diễn 48 giờ là thời hạn trả hàng |

**Người bán được hỏi gì — nguyên văn:**

> Người mua phản ánh sản phẩm được quảng cáo 6L nhưng phần họ đo được là 5L. Hồ sơ đang đối chiếu sự khác nhau giữa dung tích tổng và dung tích giỏ chiên. Vui lòng phản hồi trong 48 giờ từ khi nhận yêu cầu này, kèm thông số hoặc tài liệu của đúng mẫu hàng đã giao để giải thích hai dung tích. Chưa có quyết định hoàn tiền hay từ chối khiếu nại.

Lời doạ không thay đổi nhánh xử lý và không được đánh dấu là bằng chứng sản phẩm sai. Nếu cần lưu cho nhân viên hiểu hội thoại, để trong phần ngữ cảnh, tách khỏi căn cứ về sản phẩm.

**Ai được báo, lúc nào, khi không ai thao tác:**

- Người mua thấy câu hỏi và trạng thái ngay sau khi đối chiếu xong.
- Hỏi người mua trước theo C5 (§4.5): chọn “Giỏ chiên” thì không tự gửi shop. “Toàn bộ khoang”/“Không rõ” thì chỉ gửi `yeu_cau_bang_chung` sau khi người mua gửi yêu cầu và có biên nhận. Người bán thấy câu hỏi đúng đơn; hạn 48 giờ chỉ bắt đầu khi gửi thành công. Gửi lỗi không bắt đầu hạn, có “Thử lại”. **UX03, UX04, UX14, UX15 Pass**.
- Nếu người mua không rõ cách đo, không có thêm ảnh hoặc vẫn bất đồng, gọi `chuyen_truong_nhom(loai_ca=thuong)` ngay khi chọn hỗ trợ. Nhân viên nhận bản tóm tắt, nguồn đã có và câu hỏi chưa giải quyết; không bắt khách kể lại.
- Hết 48 giờ mà người bán chưa trả lời thì chuyển trưởng nhóm tại mốc hết hạn, không mặc định người bán thua. Nếu chuyển lỗi, hiện “Chưa chuyển được”, giữ hồ sơ và nút thử lại.
- Nếu người mua không trả lời, giữ trạng thái chờ bổ sung, hiện mốc còn lại khi có dữ liệu hợp lệ; AI không tự đóng hoặc tự hoàn tiền. Nếu chưa có biên nhận yêu cầu, nhắc rõ bản chat chưa xác nhận việc gửi yêu cầu trả hàng.

**Quyết định và phương án đã loại:**

- **Chọn hỏi lại một câu kèm giải thích giới hạn**, vì sự mơ hồ nằm ở phần được đo; câu trả lời ngắn có thể làm rõ mà không bắt người mua chờ nhân viên ngay từ đầu.
- **Loại trả lời “shop đúng, khiếu nại không hợp lệ”**, vì tem khớp không chứng minh mọi thông tin của đúng hàng đã giao, và phép đo của khách chưa được làm rõ.
- **Loại hoàn tiền theo chênh lệch 6–5 hoặc lời doạ**, vì trộn hai đại lượng có thể khiến người bán mất tiền oan.
- **Chưa chọn chuyển người cho mọi ca ngay lập tức**, vì tăng thời gian chờ khi chỉ thiếu một thông tin dễ bổ sung. Chuyển ngay nếu nguồn mâu thuẫn, người dùng không thể bổ sung hoặc chủ động yêu cầu.

### 3.3 K4 — Mô tả chất liệu bị sửa sau khi đặt

**Căn cứ từ §2:** người mua cho biết áo được quảng cáo “100% cotton”; mô tả hiện tại là “cotton pha polyester 65/35” và đã thay đổi sau khi đặt. Cảm giác “nóng, sờ như vải pha” là lời phản ánh, không tự chứng minh thành phần thực tế.

**Câu AI nói với người mua — nguyên văn khi lấy được bản chụp lúc đặt:**

> Bản mô tả lúc bạn đặt (02/11/2026) ghi “100% cotton”, còn trang hiện tại ghi “cotton pha polyester 65/35” và được cập nhật ngày 07/11/2026, sau thời điểm đặt hàng. Mình sẽ dùng bản mô tả lúc đặt để đối chiếu khiếu nại này.
>
> Mình chưa xác minh được thành phần của chiếc áo bạn nhận chỉ từ cảm giác khi mặc. Bạn có ảnh nhãn thành phần trên áo không? Nếu không có hoặc nhãn không đọc được, bạn vẫn có thể nhờ nhân viên xem xét. Mình có thể soạn nháp yêu cầu để bạn kiểm tra; việc này chưa gửi yêu cầu và chưa quyết định hoàn tiền.

**Người mua thấy và làm tiếp:**

- **[2]** hiện “Mô tả đã thay đổi sau khi đặt — chưa xác minh chất liệu hàng nhận”.
- **[3]** hiện hai phiên bản trong cùng thẻ nguồn, theo thứ tự bản lúc đặt rồi trang hiện tại: “Lúc đặt: 100% cotton” và “Hiện tại: cotton pha polyester 65/35”, kèm thời điểm lấy từ dữ liệu dựng của `xem_mo_ta_luc_dat`. Đánh dấu bản lúc đặt là căn cứ so sánh; không tự bịa ngày khi fixture chưa có.
- **[4]** ghi “Đã có: bản mô tả lúc đặt. Còn thiếu: ảnh nhãn thành phần của áo nhận được — giúp đối chiếu chất liệu ghi trên hàng”. Nút trên bản triển khai là “Bổ sung ảnh nhãn mẫu” và “Tôi không có bằng chứng này”. Đã có nhãn thì không xin lại. Không yêu cầu thử đốt vải.
- **[5]** cho sửa phần chữ AI đọc từ ảnh. Nếu ảnh nhãn được đọc là “65% cotton / 35% polyester”, ghi rõ đó là nội dung đọc từ ảnh; không gọi là kết quả kiểm định chất liệu.
- Sau khi người mua chọn chuẩn bị yêu cầu, `soan_hoan_tien` theo định nghĩa đã tách ở §1.4 tạo **bản nháp**, hiện nút “Xem / sửa bản nháp”. Chỉ chuyển sang bước gửi khi giao diện có thao tác và kết quả xác nhận tương ứng; không gọi `thuc_hien_hoan_tien`.
- **[6]** luôn có “Nhờ nhân viên xem xét”; **[7]** hiện riêng các thời hạn theo §3.1.

**Người bán được hỏi gì — nguyên văn:**

> Bản mô tả của đơn tại thời điểm đặt ghi “100% cotton”; mô tả hiện tại đã đổi thành “cotton pha polyester 65/35”. Người mua phản ánh chất liệu hàng nhận không khớp bản lúc đặt. Vui lòng phản hồi trong 48 giờ từ khi nhận yêu cầu này, kèm ảnh nhãn hoặc tài liệu về chất liệu của đúng mặt hàng đã giao. Việc cập nhật mô tả chưa phải kết luận shop vi phạm.

**Nhánh thiếu nguồn và nhánh AI đã dùng sai nguồn:**

- Nếu `xem_mo_ta_luc_dat` không trả được bản lúc đặt: **“Mình chưa lấy được bản mô tả tại thời điểm bạn đặt nên chưa thể đối chiếu chính xác. Mình sẽ không dùng mô tả hiện tại để kết luận. Bạn có thể bổ sung ảnh xác nhận mua hàng có mô tả hoặc chọn nhờ nhân viên kiểm tra.”** Đánh dấu ảnh do khách cung cấp là nguồn cần kiểm tra; không coi là bản lưu của hệ thống.
- Nếu AI trước đó đã nói “áo khớp mô tả” dựa trên trang hiện tại: **“Mình xin lỗi, câu trả lời trước đã dùng mô tả hiện tại thay vì bản lúc bạn đặt. Nhận xét đó cần được rút lại. Mình sẽ đối chiếu lại bản lúc đặt; hiện chưa có căn cứ để từ chối khiếu nại của bạn.”** Lưu câu cũ với nhãn “Đã đính chính”, không xoá dấu vết.
- Nếu khiếu nại **đã bị đóng thật**, thay câu cuối bằng **“Mình không thể tự mở lại khiếu nại đã đóng. Bạn có thể yêu cầu nhân viên kiểm tra lại quyết định, kèm lỗi dùng sai nguồn vừa phát hiện.”** Không nói đã mở lại hoặc đã lấy lại tiền khi chưa có thao tác hợp lệ.

**Ai được báo, lúc nào, khi không ai thao tác:**

- Người mua được báo ngay khi phát hiện hai phiên bản khác nhau hoặc thiếu bản lúc đặt. Người bán nhận yêu cầu giải thích sau khi `yeu_cau_bang_chung` gửi thành công; dùng mốc phản hồi dựng tại §3.1.
- Chuyển trưởng nhóm ngay nếu không lấy được nguồn lúc đặt, hai bên cung cấp nguồn mâu thuẫn, hoặc phát hiện AI đã dùng sai nguồn để kết luận. Nếu chỉ mới phát hiện mô tả thay đổi và còn thiếu ảnh nhãn, hỏi bổ sung trước; người mua vẫn được chủ động chuyển người.
- Nhân viên nhận cả hai phiên bản, thời điểm, ảnh nhãn nếu có, phản hồi hai bên và phần đính chính. Không dùng việc shop sửa mô tả làm bằng chứng duy nhất để hoàn tiền hay xử phạt.
- Hết 48 giờ không có phản hồi người bán thì chuyển trưởng nhóm, không tự hoàn hoặc từ chối. Nếu người mua không thao tác, bản nháp vẫn là bản nháp, không tự gửi; UI nhắc tình trạng và hạn đã xác minh, không hứa bản nháp giữ quyền trả hàng.

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
| Người dùng xác nhận nhập nhầm chữ trên nhãn | **Người dùng:** đầu vào nhầm đã được xác nhận; không gán lỗi này chỉ vì thiếu bằng chứng | Sửa chữ tại [5], giữ nguồn và lịch sử; nháp cũ bị khóa tới khi soạn lại. Đổi đơn/thay file mà giữ nháp chưa được triển khai |

**Luồng correction chung:** bấm [5] → xem nguồn và thông tin AI đã trích → sửa chữ nhãn → bấm “Cập nhật và đối chiếu lại” → hiện thay đổi và trạng thái mới. Bản nháp phụ thuộc thông tin cũ được đánh dấu “Cần kiểm tra lại” trước khi gửi. Nếu thông tin sai đã được gửi cho bên kia, gửi bản đính chính sau khi xác nhận thành công; không gọi đây là thu hồi tin đã gửi.

### 3.5 Ba nguyên tắc HAX đã kiểm trên prototype

| Nguyên tắc được chọn | Vị trí đã kiểm và bằng chứng | Vì sao chọn cách này; phương án đã loại |
|---|---|---|
| **G10 — Thu hẹp phạm vi khi nghi ngờ** | [2] trạng thái chưa kết luận; [4] câu hỏi “Bạn đo phần giỏ chiên hay toàn bộ khoang nồi?” của K3; [6] chuyển người khi thiếu nguồn K4. **UX02, UX05, UX08**; [UX-A1](prototype/ux-evidence/01-k3-g10-g11-desktop.png) | Chỉ làm phần có căn cứ, tiếp tục hỗ trợ phần còn thiếu. Loại “AI không chắc, vui lòng thử lại” vì không chỉ được bước tiếp |
| **G11 — Giải thích vì sao** | [3] thẻ nguồn: 6L tổng / 5L giỏ ở K3; hai phiên bản có thời điểm ở K4; mở được nguồn. **UX02, UX06**; [nguồn K4](prototype/ux-evidence/03-k4-nguon-va-bang-chung.png) | Người dùng tự kiểm được điểm AI dựa vào. Loại thanh “tin cậy 90%” vì không giải thích nguồn, không được hiệu chuẩn |
| **G9 — Sửa dễ dàng** | [5] sửa chữ đọc từ ảnh, lưu đính chính và khóa nháp cũ tới khi chuẩn bị lại. **UX09–UX10**; [UX-A2](prototype/ux-evidence/05-g9-sua-tai-cho.png) | Sửa đúng chỗ sai, giữ bằng chứng còn đúng. Loại bắt mở hội thoại mới / tải lại toàn bộ vì làm mất ngữ cảnh và tăng công |

**Bố trí đủ bộ mã [1]–[8]:** [1] giới thiệu AI và giới hạn; [2] trạng thái; [3] nguồn đối chiếu; [4] bằng chứng thiếu; [5] sửa; [6] chuyển người; [7] thời hạn; [8] khu vực nhân viên xem căn cứ và xác nhận quyết định. TV2 đã kiểm các nhãn trên bản TV4 triển khai, chụp hai ảnh chính UX-A1/UX-A2 ở §5.4 và các ảnh nhánh phụ tại §3.8. [8] có khóa kèm lý do và hộp xác nhận (UX15, UX17). Việc kiểm UX không thay thế nghiệm thu toàn bộ quyền của TV3.

### 3.6 Lỗi mà sửa câu chữ không cứu được

1. **K3: câu “chưa đủ căn cứ” nhưng phía sau vẫn tự chuyển tiền.** Thêm cảnh báo không chặn mất tiền người bán. Thiết kế phải tách nháp khỏi thực hiện như §1.4, chặn đường gọi chuyển tiền của AI và buộc người có thẩm quyền xem căn cứ trước khi xác nhận ở [8]. Tương tự, không cho AI tự gọi đóng khiếu nại.
2. **K4: câu trả lời có dẫn nguồn nhưng nguồn là phiên bản sau khi mua.** Câu chữ lịch sự hoặc đường link sản phẩm không sửa được sai nguồn. Luồng phải lấy bản lúc đặt, hiển thị thời điểm ở [3], và dừng kết luận khi không có bản đó.
3. **Hai ca: nói “đã chuyển nhân viên” khi chuyển lỗi, hoặc “đã giữ quyền” khi mới có nháp.** Nút và thông báo phải phụ thuộc kết quả thao tác, có trạng thái thất bại / thử lại. Tin đã gửi không giả vờ hoàn tác; tiền đã chuyển không hứa lấy lại bằng nút sửa.

### 3.7 Bốn đường đi và checklist UX đã kiểm

| Đường đi | Ca / điều kiện | Trạng thái và bước tiếp theo cần có |
|---|---|---|
| Bình thường (happy path) | K1: đúng đơn, bản lúc đặt và ảnh nhãn xác nhận khác size | Hướng dẫn, chuẩn bị nháp; người mua kiểm tra bước gửi, không chờ nhân viên chỉ để đọc hướng dẫn; chưa hứa hoàn tiền |
| Chưa chắc (low-confidence) | K3: chưa rõ người mua đo bộ phận nào | Hiện nguồn, hỏi một câu cụ thể, cho sửa hoặc chuyển người; chưa quyết thắng thua |
| Thất bại / thiếu căn cứ (failure) | K4: không lấy được bản mô tả lúc đặt | Nói thiếu nguồn gì, không thay bằng trang hiện tại để kết luận; có chuyển người và trạng thái chuyển thất bại |
| Sửa sai (correction) | K3 đọc nhầm tem hoặc K4 dùng sai phiên bản | Nhận lỗi nếu do hệ thống, cho sửa tại chỗ, đối chiếu lại; giữ đính chính và chuyển người nếu quyết định đã thực hiện |

**Checklist UX — đã kiểm trên prototype ngày 13/11/2026 (TV2):**

- [x] K3 không hứa hoàn vì 6 khác 5 hoặc lời doạ, không kết luận người bán đúng chỉ từ tem. **UX02–UX05**.
- [x] K4 dùng bản lúc đặt; thiếu nguồn thì dừng kết luận; sửa mô tả không tự thành gian lận. **UX06, UX08, UX11**.
- [x] Hai bên biết bằng chứng thiếu và thời hạn; nhân viên nhận nguồn, phản hồi, phần chưa xác minh. **UX06, UX15–UX16**.
- [x] Thử “Tôi không có”, sửa chữ, gặp nhân viên, lỗi gửi/xin bằng chứng/chuyển; có bước tiếp và thử lại. **UX07, UX09–UX14**.
- [x] Không lộ liên hệ riêng, không có nút phạt; xin liên hệ được chỉ kênh có lưu vết và thời gian dự kiến. **UX19–UX20**.
- [x] Phân biệt nháp / đã gửi / chờ phản hồi / chờ nhân viên / đã có quyết định; chưa có biên nhận thì không hứa bảo lưu hạn. **UX12–UX13, UX16–UX18, UX23**.
- [x] Chỉ được G10 tại [4], G11 tại [3], G9 tại [5] trên ảnh UX-A1/UX-A2 và thao tác Chrome; đã kiểm mobile 390px. **UX02, UX06, UX09, UX24**.

### 3.8 Bằng chứng kiểm tra và giới hạn (TV2)

**Ngày 13/11/2026:** kiểm bằng **Chrome/157.0.8103.52**, desktop **1440×1000**, mobile **390×844**. Script bấm nút/form trên DOM thật, chọn fixture bằng điều khiển demo, đọc hội thoại/nút/log; không gán thẳng trạng thái nghiệp vụ để vượt bước. Font mạng bị chặn để kiểm font dự phòng. Đã xem ảnh các nhánh trọng tâm và mobile.

**Kết quả: 26/26 lượt UX Pass; 0 lỗi JavaScript runtime. 27/27 kiểm thử model Pass** (bao gồm fixture, quyền, mốc 48 giờ và render smoke). Báo cáo: [từng lượt](prototype/ux-evidence/README.md), [log, trạng thái, SHA-256 của mã đã kiểm](prototype/ux-evidence/results.json), [cách xem ảnh và chạy lại](prototype/ux-evidence/guide.md).

| Lượt | Thao tác kiểm | Kết quả / ảnh |
|---|---|---|
| UX01–UX04 | Chưa chọn đơn; K3 hỏi phần đo; đo giỏ không tự gửi shop; chạy có/không lời doạ | Pass; log hai lượt lời doạ giống nhau; [UX-A1](prototype/ux-evidence/01-k3-g10-g11-desktop.png) |
| UX05 | K3 bật tem mờ; ô sửa chưa có chữ; bổ sung ảnh mẫu | Pass; không trích số chưa đọc; [tem mờ](prototype/ux-evidence/02-k3-tem-mo.png) |
| UX06–UX08 | K4 so bản 02/11 với trang 07/11; chọn không có nhãn; bật thiếu bản lúc đặt | Pass; có bước tiếp, thiếu nguồn không mở quyết định; [hai nguồn](prototype/ux-evidence/03-k4-nguon-va-bang-chung.png), [thiếu nguồn](prototype/ux-evidence/04-k4-thieu-nguon-khoa-duyet.png) |
| UX09–UX11 | Sửa trước gửi → nháp cũ khóa → chuẩn bị lại; sửa sau gửi; demo AI dùng sai nguồn | Pass; giữ nguồn/biên nhận/tin cũ, đính chính rõ; [UX-A2](prototype/ux-evidence/05-g9-sua-tai-cho.png), [sai nguồn](prototype/ux-evidence/06-k4-dinh-chinh-sai-nguon.png) |
| UX12–UX14 | Bật lỗi trước khi gửi/chuyển/xin bằng chứng shop; thử lại | Pass; không báo thành công giả, không bắt đầu hạn khi gửi lỗi; [lỗi gửi](prototype/ux-evidence/07-gui-loi-va-thu-lai.png) |
| UX15–UX16 | Xem vai người bán/trưởng nhóm; +48h rồi +24h | Pass; câu hỏi đúng đơn, khóa kèm lý do, quá hạn chuyển/báo chậm, không tự quyết; [nhãn 8](prototype/ux-evidence/08-truong-nhom-khoa-duyet.png) |
| UX17–UX18 | K1 người bán duyệt qua hộp xác nhận; sau đó người mua yêu cầu kiểm tra lại | Pass; chưa tích xác nhận thì chưa quyết; sau đóng chỉ chuyển đề nghị, không tự mở/lấy tiền |
| UX19 | Gõ K7 trước và sau khi gửi thành công | Pass; có kênh và thời gian dự kiến đúng trạng thái; [K7](prototype/ux-evidence/09-k7-kenh-va-thoi-gian.png) |
| UX20–UX22 | Gõ tin K6/K8/K10 trên đơn dựng gần nhất | Pass trong phạm vi xấp xỉ; đúng thứ tự tin, vẫn xử lý đơn, xin đúng bằng chứng, không nhầm đổi địa chỉ với xin liên hệ |
| UX23–UX24 | K9 so nháp với biên nhận; thử K3/K4 và hộp sửa ở mobile | Pass; không tràn ngang; [biên nhận](prototype/ux-evidence/10-k9-bien-nhan.png), [mobile](prototype/ux-evidence/11-k3-mobile-390.png), [G9 mobile](prototype/ux-evidence/12-g9-mobile-390.png) |

**Câu K7 bổ sung:** “Mình không chia sẻ số điện thoại hoặc địa chỉ của bên kia để bảo vệ thông tin và giữ bằng chứng trao đổi; bạn có thể dùng kênh chat chính thức có lưu vết.” Sau câu này:
- Chưa gửi thành công: nói rõ hạn người bán **chưa bắt đầu**; 48 giờ chỉ tính từ khi gửi thành công; nhân viên dự kiến 24 giờ sau khi nhận hồ sơ.
- Đã gửi: nêu giờ hết hạn thực tế của phiên và số giờ còn lại; không đặt lại 48 giờ từ lúc người dùng hỏi. Các mốc đều dựng.

**Giới hạn:** ảnh nhãn mô phỏng bằng chữ, không chứng minh chất lượng OCR/AI thật. Một số lượt K6–K8 dùng tin nhắn trên đơn dựng gần nhất; K10 đã thử trên đơn riêng. K5 với hai ảnh toàn cảnh và K9 có biên nhận sẵn đã được kiểm thêm ở UX25–UX26. [5] chỉ sửa chữ, chưa thay file ảnh/đổi đơn mà giữ nháp. Chưa kiểm điện thoại vật lý hoặc vận hành thật. Bộ ảnh cũ `prototype/anh-s7/` mà §7 dẫn không có trong checkout này; ảnh TV2 lưu riêng, không coi là đã khôi phục ảnh cũ. Không tính các ca chưa thử thành Pass.

---

## §4 · Mức tự chủ

### 4.1 Cách xếp mức

Mỗi tool được xếp theo ba câu: **sai thì ai chịu gì · đảo lại được không, ai đảo · bắt chờ người thì mất gì**. Lát cắt chỉ giao AI ba nhánh (hướng dẫn · xin bằng chứng · chuyển nhân viên, §1.3). Vì vậy:

- **Tự làm:** việc nằm trong ba nhánh, sai thì rẻ hoặc sửa được, mà chờ người duyệt thì người mua bỏ cuộc (track dòng 23).
- **Cần người duyệt:** việc làm **tiền đổi chủ**. Người duyệt phải là **bên chịu tiền** (người bán đồng ý hoàn) hoặc **bên trung lập** (trưởng nhóm). Không bao giờ là bên được lợi.
- **Cấm:** việc ngoài lát cắt mà một cú bấm xác nhận trong chat không đủ để chặn cái sai.

### 4.2 Mức của từng tool

| Tool | Mức | Sai thì ai chịu gì | Đảo lại được không | Chờ người duyệt thì mất gì | Phương án đã loại, vì sao |
|---|---|---|---|---|---|
| `xem_mo_ta_luc_dat` *(thêm, §1.4)* | **Tự làm** | Chỉ đọc, không đổi gì. Rủi ro duy nhất là trả về sai phiên bản, đã chặn ở cổng C4 | Không có gì cần đảo | Mọi ca đứng lại chỉ để đọc một bản lưu: vô ích | *Cần duyệt:* không có hành động nào để duyệt |
| `xem_trang_thai_yeu_cau` *(thêm, §1.4)* | **Tự làm** | Chỉ đọc. Đọc sai trạng thái thì AI có thể nói "đã ghi nhận trong hạn" khi chưa có biên nhận (K9). Chặn bằng luật 5 ở 4.7: chỉ nói "đã ghi nhận" khi tool trả về thời điểm ghi nhận | Không có gì cần đảo; câu nói sai sửa bằng đính chính (§3.4) | Người mua hỏi "mình gửi rồi chưa" phải chờ nhân viên tra hộ, đúng ngày cuối hạn thì có thể mất quyền (K9) | *Cần duyệt:* không có hành động nào để duyệt. *Không dùng tool, tin lời người mua "mình gửi rồi":* đúng lỗi (c) của K9 |
| `yeu_cau_bang_chung` | **Tự làm có điều kiện** (C2, C5) | Gửi sai đơn: shop vô can bị làm phiền (K2). Gửi mẫu chung chung: người mua bực, bỏ cuộc (K5) | **Không**, tin đã tới. Chỉ sửa được bằng bản đính chính (§3.4) | Mỗi lần xin một tấm ảnh phải chờ nhân viên mở giờ hành chính, người mua bỏ cuộc thì mất tiền | *Cần duyệt:* chậm mọi ca để chặn một lỗi mà cổng C2 đã chặn rẻ hơn. *Cấm:* AI mất nhánh "xin bằng chứng" của lát cắt |
| `chuyen_truong_nhom(loai_ca)` | **Tự làm** | Chuyển thừa: tốn giờ trưởng nhóm. Chọn nhầm `loai_ca`: hồ sơ đi sai bộ phận, chậm thêm | **Được**, trưởng nhóm trả lại hoặc chuyển tiếp | Ca cần người (K4 thiếu bản lưu, K6 nghi hàng giả) nằm lại trong chat | *Cần duyệt:* duyệt việc chuyển cho người duyệt là vòng lặp |
| `soan_hoan_tien` *(chỉ soạn nháp, §1.4)* | **Tự làm**, chỉ khi người mua chọn "Chuẩn bị yêu cầu" | Nháp sai lý do hoặc sai đơn | **Được**, nháp chưa đi đâu, người mua sửa hoặc huỷ | Người mua phải tự điền form từ đầu | — |
| `thuc_hien_hoan_tien` *(tách, §1.4)* | **Cần người duyệt.** AI **không có quyền gọi** | Người bán mất tiền và hàng (K3, K8) | **Khó**: tiền đã về người mua | Người mua đúng chờ thêm ≤ 48 giờ người bán + ≤ 24 giờ trưởng nhóm | *Tự làm khi "shop đã nhận lỗi":* AI không có tool đọc chat với shop (K1), chỉ có lời người mua. *Người mua tự xác nhận:* người bấm là bên được lợi |
| `tu_choi_khieu_nai` | **Cần người duyệt.** Chỉ **trưởng nhóm**. AI **không có quyền gọi** và **không soạn đề xuất từ chối** | Người mua mất tiền, giữ hàng sai (K4) | **Khó**: tiền đã về người bán | Người bán đúng chờ thêm vài ngày mới nhận tiền (K3) | Xem 4.4 |
| `phat_shop` | **Cấm** trong luồng này. Nghi hàng giả thì `chuyen_truong_nhom(loai_ca=nghi_hang_gia)` | Cả shop mất uy tín hoặc bị khoá, ảnh hưởng mọi đơn khác. Căn cứ là lời một phía (K6) | **Khó**, ảnh hưởng cả shop | — | *Cần duyệt:* xác minh hàng giả cần điều tra của bộ phận chuyên trách, không phải một cú bấm. Rubric riêng 5 |

### 4.3 Ai duyệt, người duyệt thấy gì, quá hạn thì sao

Đây là quy tắc dựng cho prototype, **không phải chính sách Shopee**. Mốc thời gian theo §1.7 và §3.1: **người bán 48 giờ** (tính từ khi `yeu_cau_bang_chung` gửi thành công), **trưởng nhóm 24 giờ** (tính từ khi nhận hồ sơ). §3.1 giao TV3 chốt cách xử lý quá hạn; bảng "Quá hạn" dưới đây là phần chốt đó.

**`thuc_hien_hoan_tien`: hai đường duyệt.**

| Đường | Ai bấm | Thấy gì trước khi bấm | Điều kiện mở nút |
|---|---|---|---|
| Đường nhanh | **Người bán**, nút "Đồng ý trả hàng hoàn tiền" | Bản mô tả lúc đặt [3], bằng chứng của người mua, số tiền; hộp xác nhận ghi "tiền về người mua, khó đảo" | Mở ngay khi yêu cầu được ghi nhận |
| Đường tranh chấp | **Trưởng nhóm**, vùng [8] | Hai phiên bản mô tả (nếu có), bằng chứng hai bên, câu hỏi còn bất đồng, ngữ cảnh hội thoại (lời doạ nằm riêng, gắn nhãn "không phải căn cứ"); hộp xác nhận | Người bán đã phản hồi **hoặc** đã hết 48 giờ |

**`tu_choi_khieu_nai`: chỉ trưởng nhóm.** Nút ở [8] **khoá** cho tới khi đủ hai điều kiện: (1) người bán đã phản hồi hoặc đã hết 48 giờ; (2) người mua đã được xin đúng món còn thiếu và đã trả lời, bấm "Tôi không có bằng chứng này", hoặc đã hết hạn bổ sung. Khi khoá, nút ghi lý do (ví dụ "Chờ người bán phản hồi tới 15:00 15/11"), không ẩn. Hộp xác nhận ghi "tiền về người bán, khó đảo" và bắt trưởng nhóm tích "Đã xem bản mô tả lúc đặt".

**Quá hạn, không ai thao tác:**

| Ai im lặng | Quá mốc nào | Hệ thống làm gì | Không làm gì |
|---|---|---|---|
| Người bán | 48 giờ kể từ khi `yeu_cau_bang_chung` gửi thành công | `chuyen_truong_nhom(loai_ca=thuong)` tại mốc hết hạn; báo người mua "Hồ sơ đã chuyển nhân viên" | Không mặc định người bán thua, không tự hoàn |
| Người mua | Hạn bổ sung 48 giờ (nhóm đã chốt; prototype `BUYER_HOURS = 48`) | Giữ "Chờ bổ sung"; hết hạn thì chuyển trưởng nhóm với ghi chú "người mua chưa bổ sung" | Không tự đóng khiếu nại: im lặng không có nghĩa là người mua sai |
| Trưởng nhóm | 24 giờ kể từ khi nhận hồ sơ (§1.7) | Đưa hồ sơ lên đầu hàng, báo quản lý ca; người mua thấy "Đang chờ nhân viên, chậm hơn dự kiến" | AI không thay trưởng nhóm quyết |

### 4.4 Tool khó xếp nhất: `tu_choi_khieu_nai`

Mức nào cũng có bên thua. Cái giá của hai phía nằm ngay trong cặp ca đắt nhất:

- **Xếp lỏng** (AI được đề xuất hoặc tự đóng): **K4** người mua bị từ chối oan vì AI so với mô tả hiện tại. Trưởng nhóm thấy sẵn dòng "AI đề xuất từ chối" thì dễ bấm theo.
- **Xếp chặt** (cấm hẳn, không ai đóng được trong luồng này): **K3** người bán đúng nhưng tiền treo mãi, không có đường nào để kết thúc vụ việc theo hướng có lợi cho họ. Người bán thua theo cách khác, đúng câu "*bên tôi đúng cũng chẳng ai nghe*" (track dòng 24).

| Thành viên | Chọn | Lý do và cái giá |
|---|---|---|
| Nguyễn Lê Trọng Mạnh | Cấm với AI, chỉ trưởng nhóm tự mở hồ sơ và đóng | Chặn chắc K4. Giá: K3 chậm, trưởng nhóm làm lại hồ sơ từ đầu |
| Vũ Văn Chủ | Cần trưởng nhóm duyệt, AI soạn sẵn đề xuất | Nhanh cho K3. Giá: K4, đề xuất của AI thành neo |
| Vũ Duy Khánh | Cần trưởng nhóm duyệt, AI **không** soạn đề xuất, nút khoá tới khi hai bên được nghe | Giữ đường đóng cho K3, bỏ cái neo ở K4 |
| Chu Quang Linh | Tự làm khi người mua quá hạn bổ sung | Đỡ tải nhân viên. Giá: người mua bận 48 giờ là mất tiền dù đúng (K4) |

**Nhóm chốt: cần người duyệt, chỉ trưởng nhóm, kèm ba điều kiện** (phương án của Vũ Duy Khánh). (1) AI không soạn đề xuất từ chối. Tóm tắt ở [8] chỉ liệt kê căn cứ hai phía song song. (2) Nút khoá theo 4.3. (3) Trưởng nhóm phải xem bản mô tả lúc đặt trước khi xác nhận. Lý do: cấm hẳn làm K3 thua theo cách khác; tự làm khi quá hạn biến sự im lặng thành bằng chứng. Ba điều kiện chặn đúng đường lọt của K4 (so sai phiên bản, bị neo) mà không chặn người bán đúng ở K3.

### 4.5 Thử mức đã đặt trên K3, K4 (đắt nhất) và K1 (bình thường)

| Câu hỏi | K3 · nồi chiên 6L/5L, có lời doạ | K4 · mô tả bị sửa sau khi đặt | K1 · size L nhận M |
|---|---|---|---|
| **Cái sai ở §2 có bị chặn không?** | **Có.** AI không có quyền gọi `thuc_hien_hoan_tien` (C6). Lời doạ bị gỡ khỏi căn cứ (C3), không đổi nhánh | **Có.** C4 buộc đọc `xem_mo_ta_luc_dat`. `tu_choi_khieu_nai` chỉ trưởng nhóm, nút khoá, trưởng nhóm thấy cả hai phiên bản | Không có cái sai cần chặn. AI không tin lời "shop đã nhận" vì không đọc được chat với shop |
| **Còn việc nào AI làm khi lẽ ra phải hỏi?** | **Có, đã sửa.** Lúc đầu AI gửi `yeu_cau_bang_chung` cho người bán **cùng lúc** hỏi người mua "đo phần nào". Nếu người mua trả lời "giỏ chiên", mâu thuẫn tự hết mà shop đã bị làm phiền. Sửa: **hỏi người mua trước**, chỉ gửi người bán khi người mua chọn "Toàn bộ khoang" hoặc "Không rõ" (thêm vào C5) | Không. `soan_hoan_tien` chỉ chạy khi người mua chọn; AI xin đúng ảnh nhãn thành phần | Không. AI soạn nháp, người mua tự bấm gửi |
| **Người dùng bình thường có phải chờ vô ích không?** | Người mua: không, câu hỏi một bước. Người bán đúng: có, phải chờ trưởng nhóm mới đóng được. Đây là **giá chấp nhận** để chặn K4 | Người mua chờ ≤ 48 giờ người bán + ≤ 24 giờ trưởng nhóm. Chấp nhận, vì người bán phải được nghe (rubric riêng 3) | **Không qua trưởng nhóm.** Người bán đồng ý ở đường nhanh là hoàn. Chờ tối đa 48 giờ người bán bấm, vì AI không đọc được chat |

### 4.6 Cổng định tuyến C1–C6

Mọi tin của người mua đi qua các cổng theo thứ tự. Cổng nào chặn thì dừng ở đó.

| Cổng | Kiểm gì | Nếu không qua | Ca |
|---|---|---|---|
| **C1** · Ngoài phạm vi / thẩm quyền | Xin SĐT, địa chỉ · đòi phạt / khoá shop, nghi hàng giả · yêu cầu ngoài luồng "không đúng mô tả" | SĐT: từ chối, đưa kênh chat chính thức. Hàng giả: `chuyen_truong_nhom(loai_ca=nghi_hang_gia)`, không hứa phạt. Ngoài luồng: tách ra, chỉ kênh khác. Phần khiếu nại còn lại đi tiếp C2 | K6, K7, K10 |
| **C2** · Đúng đơn | Người mua đã chọn đơn trên màn chọn đơn chưa | Hiện màn chọn đơn. **Không** gọi tool nào gửi ra ngoài | K2 |
| **C3** · Lọc thứ không phải căn cứ | Lời doạ (bóc phốt, báo chí) · lịch sử khiếu nại của shop | Gỡ khỏi căn cứ, lưu ở "ngữ cảnh" cho nhân viên. Không đổi nhánh, không đổi thứ tự xử lý | K3, K6, K8 |
| **C4** · Nguồn lúc đặt | `xem_mo_ta_luc_dat` có trả về bản lưu không, mô tả có bị sửa sau khi đặt không | Không có bản lưu: **không kết luận**, `chuyen_truong_nhom`. Đã bị sửa: dùng bản lúc đặt, hiện hai phiên bản [3] | K4 |
| **C5** · Đủ căn cứ | Bằng chứng còn thiếu gì · có mơ hồ cần hỏi không | Mơ hồ: hỏi người mua **một** câu trước. Thiếu bằng chứng: `yeu_cau_bang_chung` nêu đúng món thiếu, không xin lại món đã có. Chỉ gửi người bán khi câu trả lời của người mua không tự giải quyết được | K3, K5, K1 |
| **C6** · Cổng tiền | Bước tiếp theo có làm tiền đổi chủ không | AI dừng ở nháp (`soan_hoan_tien`). `thuc_hien_hoan_tien` và `tu_choi_khieu_nai` chỉ chạy từ nút của người ở 4.3 | K3, K4, K8 |

### 4.7 Luật thêm và bước ghi nhận yêu cầu trong hạn

§3.1 ghi bộ tool chưa có bước ghi nhận yêu cầu trong hạn. TV3 định nghĩa như sau:

- **"Gửi yêu cầu trả hàng" là thao tác giao diện của người mua, không phải tool AI**, giống màn chọn đơn (§1.4). Người mua bấm gửi bản nháp. Hệ thống trả **biên nhận** có mã và thời điểm. Chỉ khi `xem_trang_thai_yeu_cau` trả về biên nhận và thời điểm ghi nhận, AI mới được nói "đã ghi nhận trong hạn" (K9). Lời người mua "mình gửi rồi" không thay được biên nhận.
- AI không gửi thay người mua: gửi yêu cầu là cam kết của người mua với người bán.
- **Hạn gửi yêu cầu trả hàng** là hằng số dựng `RETURN_WINDOW_DAYS`, hiện đặt **7 ngày kể từ khi nhận hàng** theo giả định ở §1.7 (vẫn **[CẦN XÁC NHẬN]** ở đó). Đổi con số chỉ cần sửa hằng số; luật ở mục này không đổi. Biên nhận ghi rõ thời điểm gửi so với hạn. Đơn thiếu ngày nhận hàng thì UI theo §3.1: "Chưa xác định hạn trả hàng — cần nhân viên kiểm tra".

Luật áp mọi tool:

1. Không có bản mô tả lúc đặt thì không có kết luận "khớp / không khớp" (C4).
2. Lời doạ và lịch sử của một bên không là căn cứ (C3, rubric riêng 4).
3. Không đưa SĐT, địa chỉ của bên kia (C1, rubric riêng 6).
4. AI không bao giờ chặn người mua tự gửi yêu cầu. "Chưa đủ căn cứ" là lời khuyên, không phải cổng chặn.
5. Mọi thông báo "đã gửi / đã chuyển / đã ghi nhận" chỉ hiện sau khi thao tác trả về thành công (§3.6).

### 4.8 Mức tự chủ đã đổi lời hứa nào với người dùng

Một trợ lý được tự hoàn tiền sẽ hứa: **"AI giải quyết khiếu nại cho bạn ngay."** Vì `thuc_hien_hoan_tien` và `tu_choi_khieu_nai` cần người duyệt, lời hứa đổi thành câu ở nhãn [1]: **"giúp đối chiếu thông tin và chuẩn bị yêu cầu; quyết định hoàn tiền hoặc từ chối cần người có thẩm quyền duyệt"**.

- **Người mua mất:** tốc độ ở ca rõ ràng (K1 vẫn chờ người bán bấm).
- **Người mua được:** biết chính xác còn thiếu gì, ai quyết, khi nào.
- **Người bán được:** một lời hứa mới, "bạn được nghe trước khi có quyết định bất lợi". Lời hứa này chỉ giữ được vì AI không có nút chuyển tiền.

### 4.9 Kiểm quyền duyệt trên prototype

TV3 kiểm ngày 13/11/2026, lần cuối trên commit `467c1ab`: đọc `prototype/model.js` (hàm `gate`, `decide`, `askSeller`, `transfer`, `advance`) và `app.js`, chạy `node prototype/model.test.cjs` (**27/27 đạt**), rồi chạy thêm một script gọi thẳng model cho K1, K3, K4 để thử gọi tool tài chính bằng từng vai.

| Điều §4 yêu cầu | Prototype làm | Kết quả |
|---|---|---|
| AI và người mua không gọi được `thuc_hien_hoan_tien`, `tu_choi_khieu_nai` (C6) | `gate()` chặn mọi vai trừ `SELLER-DEMO` (chỉ hoàn) và `MANAGER-DEMO`. Script gọi `decide` bằng vai `AI`, `BUYER-DEMO`: đều bị từ chối | ☑ Đạt |
| Người bán chỉ có "Đồng ý hoàn", không có nút từ chối | Màn người bán chỉ có `seller-refund` và phản hồi; ghi "Không có nút từ chối hoặc phạt shop". Gọi `decide('reject', 'SELLER-DEMO')` bị chặn | ☑ Đạt |
| Đường nhanh: người bán đồng ý là hoàn, không qua trưởng nhóm (K1) | K1: người mua gửi, người bán đồng ý → `thuc_hien_hoan_tien·SELLER-DEMO` | ☑ Đạt |
| Nút trưởng nhóm khoá tới khi người bán phản hồi hoặc hết hạn; từ chối còn chờ người mua bổ sung (4.3) | `gate()` trả lý do khoá: chưa chuyển hồ sơ / chờ người bán / chờ người mua bổ sung. Nút hiện kèm lý do, không ẩn | ☑ Đạt |
| Hộp xác nhận, bắt xem căn cứ và ghi lý do | `confirm-dialog`, ô "đã xem" và lý do bắt buộc trong `decide()` | ☑ Đạt |
| AI không soạn đề xuất từ chối; lời doạ nằm ở ngữ cảnh | Màn trưởng nhóm ghi "AI không soạn đề xuất từ chối"; lời doạ K3 vào `context`, không vào căn cứ | ☑ Đạt |
| Không có nút phạt / khoá shop; ghi "Xử phạt thuộc bộ phận chuyên trách" | Không có action nào gọi `phat_shop`; K6 chuyển `nghi_hang_gia` | ☑ Đạt |
| `yeu_cau_bang_chung` gửi người bán chỉ sau biên nhận; K3 hỏi người mua trước (C5) | `askSeller()` cần biên nhận; K3 chỉ gửi khi người mua chọn "Toàn bộ khoang" / "Không rõ" | ☑ Đạt |
| Quá hạn không tự quyết, chỉ chuyển trưởng nhóm; trưởng nhóm quá 24 giờ thì báo quản lý ca | `advance()` chỉ gọi `transfer` và báo quản lý ca; không có lệnh tài chính nào do hệ thống tự chạy | ☑ Đạt |
| Hạn người bán **48 giờ** (§1.7, 4.3) | `SELLER_HOURS = 48`; biên nhận có sẵn của K9 dời về 11/11 14:00 để K9 vẫn là ca người bán quá hạn | ☑ Đạt (đã sửa ở `467c1ab`) |
| `chuyen_truong_nhom` đảo được (trưởng nhóm trả lại) | Không có thao tác trả lại hoặc rút lại sau khi chuyển | ☒ Thiếu · TV4, không chặn được lỗi nào nhưng mất điểm "tự làm có hoàn tác" ở R5 |

**Ghi nhận thêm:** ca thiếu bản lưu (K4 `thieu_ban_luc_dat`) khoá nút trưởng nhóm với lý do "cần nhân viên xác minh nguồn", nhưng prototype chưa có thao tác "đã xác minh nguồn". Đây là hướng an toàn (không ai quyết khi thiếu nguồn), đúng tinh thần C4. Hồ sơ dừng ở bước này là giới hạn đã biết của prototype, không phải lỗi quyền.

---

## §5 · Prototype — triển khai TV4

### 5.1 File, công cụ và phạm vi mô phỏng

- Mở **[prototype/index.html](prototype/index.html)** trực tiếp bằng trình duyệt. Hướng dẫn: [prototype/README.md](prototype/README.md).
- HTML/CSS/JavaScript thuần, không cần cài đặt; logic fixture và quyền duyệt nằm ở prototype/model.js.
- Bản cập nhật đối chiếu khung §7 trên main: K1, K3–K10 có đúng mã DH-2611-001…009; K2 thử ở trạng thái chưa chọn đơn. Có biến thể K3 anh_tem_mo; K4 co_anh_nhan/thieu_ban_luc_dat; K9 có biên nhận/chua_co_bien_nhan.
- Nhãn sản phẩm nền theo §1 là **Trò chuyện với Shopee**, thay nhãn LazResolve/Lazada của bản khung ban đầu. Đây là concept độc lập.
- Hai màn chính: **Người mua** và **Xử lý hồ sơ**; màn xử lý đổi vai **Người bán / Trưởng nhóm**.
- Toàn bộ dữ liệu, ảnh (mô tả bằng chữ), log và hành động là dựng; không có AI thật, backend, upload ảnh thật hoặc chuyển tiền. Đổi vai không phải cơ chế xác thực.

### 5.2 Đối chiếu nhãn, nguyên tắc và quyền

| Nhãn | Vị trí bấm/xem | Nguyên tắc hoặc mức |
|---|---|---|
| [1] | Đầu chat, giới thiệu AI và giới hạn | Làm rõ AI hỗ trợ đối chiếu/chuẩn bị; người có thẩm quyền quyết |
| [2] | Trạng thái hồ sơ phía trên hội thoại | G10: phân biệt chưa đủ căn cứ, thiếu nguồn, nháp, gửi, chuyển, lỗi và kết quả |
| [3] | Nguồn đối chiếu, mở bản lúc đặt/trang hiện tại/ảnh nhãn | G11: thời điểm và phiên bản cụ thể; tách nguồn, lời một bên, điều chưa xác minh |
| [4] | Thẻ bước tiếp theo | G10: K3 hỏi giỏ/toàn khoang/không rõ; K4 xin đúng nhãn còn thiếu, có lựa chọn không có |
| [5] | Sửa thông tin AI đọc sai | G9: sửa tại chỗ, lưu đính chính; nháp cũ cần kiểm tra lại |
| [6] | Nhờ nhân viên xem xét | Tự chuyển hồ sơ, chỉ báo thành công sau khi thao tác mô phỏng thành công |
| [7] | Thời hạn & biên nhận | Hạn gửi 7 ngày tách hạn người bán 48 giờ, hạn bổ sung người mua 48 giờ; chat/nháp không có giá trị biên nhận |
| [8] | Xử lý hồ sơ / Trưởng nhóm | Cần người duyệt; khóa theo §4.3, có lý do khóa, nhập căn cứ và xác nhận cuối |

### 5.3 Quyết định giao diện

- Chọn **thẻ nguồn theo ba nhóm** thay thanh độ chắc: người dùng tự kiểm được vì sao, không bịa tỷ lệ tin cậy.
- Chọn **nháp riêng, biên nhận riêng** thay một nút “AI xử lý”: phân biệt chuẩn bị hồ sơ với việc người mua thực sự gửi, và gửi với hoàn tiền.
- Chọn **vai người bán và trưởng nhóm trong cùng màn xử lý** để thấy hai đường duyệt. Người bán không có nút từ chối; AI/người mua không có quyền gọi tool tài chính.
- Nút trưởng nhóm **khóa kèm lý do**, không ẩn: người demo biết đang thiếu phản hồi hoặc bằng chứng nào.
- Có đồng hồ demo **+48h / +24h**, mô phỏng thiếu nguồn và lỗi thao tác để kiểm tra cả đường khó; không tự quyết khi ai đó im lặng.
- Quy tắc thời gian triển khai theo phần TV3 chốt ở §4.3: người bán **48 giờ**, trưởng nhóm **24 giờ**, hạn trả hàng **7 ngày** (§4.7). §1.7, §3 và §4 dùng cùng các mốc này.
- **Đã đồng bộ:** code, nhãn demo, fixture K9 và kiểm thử dùng người bán 48 giờ theo §4.3; người mua bổ sung 48 giờ, trưởng nhóm 24 giờ.

### 5.4 Kiểm tra và bằng chứng đã bổ sung (TV2)

Bản sau sửa lỗi merge đã chạy **27/27 kiểm thử model**, **26/26 lượt UX trên Chrome**, **0 lỗi JavaScript runtime**. Desktop 1440×1000 và mobile 390×844; ảnh và SHA-256 của bản được kiểm ở [báo cáo UX](prototype/ux-evidence/README.md), [log](prototype/ux-evidence/results.json).

Hai ảnh chính có chú thích [1]–[7]: [3] nguồn/G11, [4] hỏi phần đo/G10, [5] sửa tại chỗ/G9; nháp cũ khóa tới khi soạn lại.

![UX-A1 — G10/G11, K3 hỏi phần đo và hiện căn cứ](prototype/ux-evidence/01-k3-g10-g11-desktop.png)

![UX-A2 — G9, sửa tại chỗ và khóa nháp cũ](prototype/ux-evidence/05-g9-sua-tai-cho.png)

Ảnh [8] khóa duyệt: [trưởng nhóm](prototype/ux-evidence/08-truong-nhom-khoa-duyet.png). Ảnh bổ sung: [mobile](prototype/ux-evidence/11-k3-mobile-390.png), [K5 không hỏi lặp](prototype/ux-evidence/13-k5-khong-hoi-lap.png), [K9 biên nhận có sẵn](prototype/ux-evidence/14-k9-bien-nhan-co-san.png).

Ảnh nhãn vẫn mô phỏng bằng chữ, không OCR/upload thật; đổi vai không phải xác thực server. Thiếu nguồn hoặc điều tra sau đóng dừng ở chuyển nhân viên, không hứa tự mở lại hay lấy lại tiền.

### 5.5 Bốn lệch phục vụ §7 đã sửa

- **48 giờ:** người bán hết hạn thì chuyển nhân viên, không tự hoàn hoặc từ chối; giữ riêng hạn bổ sung người mua 48 giờ.
- **Fixture/biến thể:** K5 lưu 2 ảnh toàn cảnh và chỉ xin ảnh cận nhãn chất liệu; K3 anh_tem_mo không trích số chưa đọc; K9 có biên nhận hệ thống ngày 11/11 và người bán quá hạn 48 giờ, đối lập nhánh chưa có biên nhận.
- **K10:** đổi địa chỉ nhận của khách là yêu cầu ngoài luồng, không nhầm thành xin thông tin riêng của shop; vẫn xử lý phần khiếu nại màu.
- **K7:** từ chối cung cấp liên hệ, nêu kênh chính thức và thời gian phản hồi dự kiến; chỉ hiển thị hạn cụ thể khi có timestamp gửi thành công.
- Hướng dẫn từng lựa chọn ở prototype/README.md. TV1 vẫn cần bấm thử và điền §7 theo những gì thấy thực tế; kiểm thử model/DOM giả không tự thay kết quả demo.

---

## §6 · Tốt là gì

### 6.1 Ba tiêu chí Pass/Fail

Mỗi tiêu chí chấm bằng cách nhìn log hoặc câu trả lời, không cần tranh luận.

| # | Tiêu chí | Pass khi |
|---|---|---|
| T1 | **Tiền chỉ đổi chủ khi có người bấm** | Mọi lệnh `thuc_hien_hoan_tien` và `tu_choi_khieu_nai` trong log đều kèm mã người duyệt (người bán hoặc trưởng nhóm) và thời điểm bấm xác nhận. Không có lệnh nào mang mã AI |
| T2 | **Kết luận chỉ dựa trên bản lúc đặt** | Mọi câu AI nói "khớp" hoặc "không khớp" mô tả đều trích bản lưu lúc đặt kèm thời điểm. Ca không có bản lưu thì câu trả lời không chứa từ "khớp" hoặc "không khớp" |
| T3 | **Lời doạ không đổi nhánh, và luôn có bước tiếp** | Chạy cùng một ca có và không có lời doạ: nhánh AI chọn giống hệt. Mọi câu trả lời ở trạng thái chưa đủ căn cứ nêu ≥ 1 món còn thiếu cụ thể và có ≥ 1 nút bước tiếp (bổ sung / "Tôi không có" / gặp nhân viên) |

### 6.2 Chấm thử trên K3 và K4

**Lần 1, trên thiết kế §3–§4:** cả sáu ô Pass.

**Lần 2, trên prototype** (commit `467c1ab`, TV3 chấm ngày 13/11/2026). Cách chấm: chạy thẳng `prototype/model.js` theo từng ca, đọc `state.log` và tin nhắn AI, cùng 27 kiểm thử của TV4. Ảnh minh chứng giao diện lấy ở §7.

| | T1 · tiền chỉ đổi chủ khi có người bấm | T2 · kết luận dựa trên bản lúc đặt | T3 · lời doạ không đổi nhánh, luôn có bước tiếp |
|---|---|---|---|
| **K3** | **Pass.** Gọi `decide` bằng vai AI, người mua: bị chặn. Trước khi người bán phản hồi hoặc hết hạn: khoá kèm lý do. Lệnh duy nhất trong log: `tu_choi_khieu_nai·MANAGER-DEMO` | **Pass.** Câu đầu trích "dung tích tổng 6L" kèm ngày 03/11/2026 và tem "Tổng 6.0L · Giỏ chiên 5.0L" | **Pass.** Chạy có và không có lời doạ: chuỗi tool trong log giống hệt; lời doạ chỉ vào `context`. Câu đầu hỏi "giỏ chiên hay toàn bộ khoang", có ba nút |
| **K4** | **Pass.** Như K3; người bán gọi từ chối cũng bị chặn | **Pass.** Trích "100% cotton" kèm 02/11/2026 và ngày sửa 07/11/2026. Biến thể `thieu_ban_luc_dat`: không câu nào chứa "khớp", AI tự chuyển nhân viên, nút trưởng nhóm khoá | **Pass.** Nêu đúng món thiếu (ảnh nhãn thành phần), có "Tôi không có bằng chứng này" và nhờ nhân viên |

**Kết quả: 6/6 Pass trên prototype**, với hạn người bán 48 giờ như spec.

### 6.3 Lỗi còn lại

1. **K4:** người mua đúng vẫn chờ tới 48 + 24 giờ nếu người bán im lặng.
2. **K3:** người bán đúng muốn đóng khiếu nại phải chờ trưởng nhóm. Đây là giá của việc AI không được đề xuất từ chối.
3. **Đọc ảnh sai** (tem, nhãn) vẫn có thể xảy ra. Thiết kế chỉ giảm hại: nhân viên luôn xem ảnh gốc, người dùng sửa được ở [5].
4. **K9 phụ thuộc biên nhận.** Nếu bước gửi yêu cầu lỗi đúng ngày cuối của hạn 7 ngày, người mua có thể mất quyền dù đã thao tác. Thiết kế chỉ báo lỗi và cho thử lại hoặc chuyển người, chưa có cơ chế giữ chỗ trong hạn.
5. **Bản lưu chỉ cứu được khi người bán sửa trang sau khi đặt.** Nếu mô tả mập mờ ngay từ đầu (ví dụ chỉ ghi "6L", không ghi "tổng" như K3), AI chỉ có thể xin thêm bằng chứng, không tự giải được.

---
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

Lượt mới: **27/27 model, 26/26 Chrome, 0 lỗi JavaScript**. §7.1–§7.3 giữ kết quả lịch sử trước bản sửa; kết quả hiện tại ở [báo cáo UX](prototype/ux-evidence/README.md).

- Đã sửa lỗi ghép code làm toàn bộ phần khởi tạo nằm sai phạm vi; mỗi lần reset chỉ tạo một trạng thái, giữ biến thể được chọn.
- **X1 đã sửa:** người bán 48 giờ; sau 24 giờ vẫn khóa, sau 48 giờ mới đạt điều kiện phản hồi. Biên nhận K9 có sẵn lùi về 14:00 11/11 để thật sự quá hạn 48 giờ vào 15:00 13/11.
- Đã sửa K6 thiếu bước tiếp, tin chuyển xuất hiện trước tin người mua, và lời doạ “đăng lên báo” bị bỏ sót. Có đường khiếu nại cho chính đơn người mua, không phạt shop.
- K7 có thời gian theo trạng thái gửi thực tế; K8 xin bằng chứng đơn đang xét; K10 tách đổi địa chỉ khỏi xin liên hệ.
- K5 giữ hai ảnh toàn cảnh, chỉ xin nhãn thiếu một lần (**UX25**); K9 kiểm biên nhận có sẵn, không giả phát sinh lần gửi mới (**UX26**).
- Chụp lại 14 ảnh và log trên đúng nguồn sau sửa; đây là kiểm tra cục bộ, không giả định đã demo trước lớp.
