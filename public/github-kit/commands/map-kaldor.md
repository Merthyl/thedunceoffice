(1) BẢN ĐỒ RP (/map) — KALDOR / VALEROTH MODULAR ENGINE [HARD_LOCK]
* COMMAND PRIORITY [ABSOLUTE]: Khi người chơi gõ `/map` (hoặc `/map valeroth`, `/map bắc ải`), lập tức tạm dừng mạch kể (KHÔNG tự ý thúc đẩy sự kiện hay hành động mới của {{user}}), đọc đúng ĐOẠN HỘI THOẠI / DIỄN BIẾN HIỆN TẠI và xuất DUY NHẤT 1 khối mã ```html ... ``` hoàn chỉnh (có thể chạy Preview HTML ngay) theo đúng khung bên dưới — KHÔNG tự viết lại CSS, SVG hay giao diện bản đồ, KHÔNG viết thêm lời giải thích bên ngoài khối HTML.
* QUY TẮC THAY `<CDN_BASE>`: Lấy chính phần đầu URL của tệp `map-kaldor.md` này (bỏ đuôi `/commands/map-kaldor.md`) để điền vào `<CDN_BASE>` trong 2 thẻ `<script>` bên dưới.
  - Ví dụ nếu tệp này nằm tại `https://cdn.jsdelivr.net/gh/Merthyl/thedunceoffice@abc123/public/github-kit/commands/map-kaldor.md` thì `<CDN_BASE>` là `https://cdn.jsdelivr.net/gh/Merthyl/thedunceoffice@abc123/public/github-kit`.

```html
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Valeroth · Bản Đồ RP</title>
  <style>html,body{margin:0;padding:8px;background:#EAE6DC;}</style>
</head>
<body>
  <div id="rp-app"></div>
  <script>
  window.RP_DATA = {
    world: "kaldor-valeroth",
    mode: "map",
    view: "valeroth hoặc norsvale",
    playerLoc: "mã_vị_trí_đứng_hiện_tại_theo_hội_thoại",
    fromLoc: "mã_vị_trí_vừa_di_chuyển_từ_đó_hoặc_chuỗi_rỗng",
    chapter: "Mốc thời gian / bối cảnh hiện tại",
    status: "Tóm tắt 1 câu vị trí đứng và tình huống hiện tại của {{user}} đúng theo hội thoại.",
    npcs: [
      {
        name: "Tên NPC (có sẵn trong Section 4 HOẶC mới tạo bởi {{user}}/cốt truyện)",
        loc: "mã_địa_điểm_hiện_tại_của_NPC",
        role: "Vai trò công khai đã biết (CẤM tiết lộ bí mật HARD_LOCKED)",
        status: "Tình trạng ngắn gọn đã thể hiện trong truyện",
        source: "canon hoặc custom",
        visibility: "encountered hoặc mentioned"
      }
    ],
    tags: [
      { loc: "mã_địa_điểm", label: "Sự kiện / cảnh báo đã xảy ra", tone: "ink" }
    ]
  };
  </script>
  <script src="<CDN_BASE>/worlds/kaldor-valeroth.js"></script>
  <script src="<CDN_BASE>/engine.js"></script>
</body>
</html>
```

DANH SÁCH MÃ ĐỊA ĐIỂM HỢP LỆ (world: "kaldor-valeroth"):
[Lớp 1 — Toàn cảnh Valeroth (view: "valeroth")]
- "loc-valerius" : Vương Đô (Valerius)
- "loc-zarath" : Hắc Nham (Zarath)
- "loc-corinth" : Lam Vịnh (Corinth)
- "loc-norsvale" : Bắc Ải (Norsvale)
- "loc-sylva" : U Lâm (Sylva)
- "loc-morvath" : Cấm Địa (Morvath)
- "loc-kaldrak" : Hoang Vực (Kaldrak)

[Lớp 2 — Bên trong Bắc Ải / Dinh thự Kaldor Oakhart (view: "norsvale")]
- "loc-nors-keep" : Tháp Oakhart (Dinh thự & Đại Sảnh)
- "loc-nors-northgate" : Cổng Bắc & Chợ Tiếp Vận (Bếp & Kho Tiếp Vận)
- "loc-nors-forge" : Xưởng Rèn & Kho Quân Nhu (Lò Thiết Nhẫn)
- "loc-nors-barracks" : Trại Lính & Sân Tập (Sân Kỵ Binh & Doanh Trại)
- "loc-nors-tavern" : Quán Rượu Mũi Đao (Quán Lính Đánh Thuê)
- "loc-nors-apothecary" : Trạm Y Dược & Luyện Kim (Nhà Thuốc Biên Ải)
- "loc-nors-southgate" : Cổng Hoang Vực & Tường Nam (Cửa Ải Tuyến Đầu)

QUY TẮC BẮT BUỘC CHO /map:
1. VỊ TRÍ NGƯỜI CHƠI THEO HỘI THOẠI [ABSOLUTE]: `playerLoc` và `fromLoc` PHẢI phản ánh chính xác nơi {{user}} đang đứng và nơi vừa rời đi dựa trên đoạn hội thoại tại thời điểm gõ `/map`. Nếu {{user}} chưa di chuyển sang địa điểm mới, giữ `fromLoc: ""`. Nếu {{user}} đang ở bên trong Bắc Ải và không yêu cầu xem toàn cảnh, đặt `view: "norsvale"`; ngược lại đặt `view: "valeroth"`.
2. HIỂN THỊ NPC [HARD_LOCK — KHÔNG SPOIL]:
   - Mảng `npcs` hỗ trợ CẢ **NPC có sẵn** (`source: "canon"`) lẫn **NPC mới được tạo bởi {{user}} hoặc cốt truyện** (`source: "custom"`).
   - **CHỈ HIỂN THỊ KHI ĐƯỢC NHẮC ĐẾN HOẶC CHẠM TRÁN**: Tuyệt đối KHÔNG điền trước các NPC chưa xuất hiện hay chưa được nhắc tới trong đoạn hội thoại. Nếu chưa có NPC nào được nhắc đến hoặc chạm trán, đặt `npcs: []`.
   - `visibility: "encountered"` khi {{user}} đang/đã chạm trán trực tiếp; `visibility: "mentioned"` khi NPC mới chỉ được nhắc tên trong lời thoại/thư từ/tin đồn.
   - **KNOWLEDGE & NAME LOCK**: Tuyệt đối không rò rỉ thông tin `[HARD_LOCKED]` vào `name`, `role`, `status` (ví dụ: chỉ ghi `"Rowan"` chứ KHÔNG ghi `"Rowan Valerius"` nếu chưa lộ thân phận; Silas Venn / Maelle Voss chỉ hiện vỏ bọc người hầu nếu chưa bị phát hiện; không lộ bí mật Giáo Hoàng, Cedric, Elmira...).
3. `tags` dùng để đánh dấu sự kiện hoặc cảnh báo trên bản đồ (`tone: "ink"` mực đen bình thường, `tone: "crimson"` cảnh báo/nguy hiểm).
4. Giữ nguyên cấu trúc `<!DOCTYPE html>`, `world: "kaldor-valeroth"`, và đúng 2 thẻ `<script>` trỏ về jsDelivr.
