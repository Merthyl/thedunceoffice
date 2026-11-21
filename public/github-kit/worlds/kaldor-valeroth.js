/**
 * WORLD PACK: Kaldor Oakhart — The Kingdom of Valeroth & Norsvale
 * World ID: "kaldor-valeroth"
 *
 * Load this file together with engine.js ONLY for Kaldor's RP bot:
 *   <script src="https://cdn.jsdelivr.net/gh/<USER>/<REPO>@<SHA>/worlds/kaldor-valeroth.js"></script>
 *   <script src="https://cdn.jsdelivr.net/gh/<USER>/<REPO>@<SHA>/engine.js"></script>
 */
(function (global) {
  'use strict';

  var currentScript = document.currentScript;
  var repoBase = '';
  if (currentScript && currentScript.src) {
    repoBase = currentScript.src.replace(/\/worlds\/[^/?#]+(?:[?#].*)?$/, '');
  }

  var worldDef = {
    id: 'kaldor-valeroth',
    name: 'Valeroth',
    width: 1000,
    height: 562,
    assetBase: repoBase,
    defaultPlayerLoc: 'loc-nors-southgate',
    layers: [
      {
        id: 'valeroth',
        label: 'Toàn cảnh Valeroth',
        titlePlate: '· VALEROTH ·',
        image: 'assets/kaldor/valeroth.jpg',
        assetFile: 'valeroth.jpg',
      },
      {
        id: 'norsvale',
        label: 'Bên trong Bắc Ải',
        titlePlate: '· BẮC ẢI ·',
        image: 'assets/kaldor/norsvale.jpg',
        assetFile: 'norsvale.jpg',
      },
    ],
    parentLayerLinks: {
      norsvale: {
        parentScope: 'valeroth',
        parentLocId: 'loc-norsvale',
        defaultChildLocId: 'loc-nors-northgate',
        enterLabel: 'Vào bên trong Bắc Ải →',
      },
    },
    locations: [
      // --- LAYER 1: TOÀN CẢNH VALEROTH ---
      {
        id: 'loc-valerius',
        scope: 'valeroth',
        name: 'Vương Đô',
        altName: 'Valerius',
        ruler: 'Hoàng gia & Đại Giáo Đường',
        x: 566,
        y: 238,
        zonePath: 'M 416 206 L 478 134 L 614 148 L 718 206 L 718 294 L 622 342 L 496 342 L 414 294 Z',
        summary: 'Trung tâm quyền lực với Hoàng Cung mái vòm dát vàng và những ngọn tháp Đại Giáo Đường.',
      },
      {
        id: 'loc-zarath',
        scope: 'valeroth',
        name: 'Hắc Nham',
        altName: 'Zarath',
        ruler: 'Công tước Vayne Gillet',
        x: 736,
        y: 120,
        zonePath: 'M 514 114 L 584 24 L 912 24 L 948 158 L 832 214 L 718 206 L 614 148 L 516 144 Z',
        summary: 'Thành lũy luyện sắt và khai khoáng tựa sát dãy núi đá phía bắc, chìm trong khói than và mùi lưu huỳnh.',
      },
      {
        id: 'loc-corinth',
        scope: 'valeroth',
        name: 'Lam Vịnh',
        altName: 'Corinth',
        ruler: 'Công tước Diocles Ingelrandus',
        x: 318,
        y: 178,
        zonePath: 'M 192 224 L 204 114 L 368 44 L 468 96 L 478 134 L 416 206 L 414 294 L 224 304 L 182 266 Z',
        summary: 'Đô thị thương cảng sầm uất trải dài bên trái Vương Đô, hướng thẳng ra Biển Tây.',
      },
      {
        id: 'loc-norsvale',
        scope: 'valeroth',
        name: 'Bắc Ải',
        altName: 'Norsvale',
        ruler: 'Kaldor Oakhart',
        x: 374,
        y: 360,
        zonePath: 'M 266 312 L 414 294 L 482 340 L 476 416 L 382 430 L 264 398 Z',
        summary: 'Pháo đài đá xám lạnh giá dưới Lam Vịnh, tiếp giáp trực tiếp với U Lâm, Cấm Địa và Hoang Vực.',
      },
      {
        id: 'loc-sylva',
        scope: 'valeroth',
        name: 'U Lâm',
        altName: 'Sylva',
        ruler: 'Công tước Artur Houtmann',
        x: 866,
        y: 310,
        zonePath: 'M 832 214 L 948 158 L 986 184 L 986 548 L 834 548 L 866 436 L 786 382 L 622 396 L 476 416 L 482 340 L 622 342 L 718 294 L 718 206 Z',
        summary: 'Dải rừng già mạn phải vươn tới giáp tường đông Bắc Ải và hòa liền Cấm Địa.',
      },
      {
        id: 'loc-morvath',
        scope: 'valeroth',
        name: 'Cấm Địa',
        altName: 'Morvath',
        ruler: 'Tin đồn về Phù Thủy',
        x: 668,
        y: 478,
        zonePath: 'M 476 416 L 622 396 L 786 382 L 866 436 L 834 548 L 492 548 L 486 462 Z',
        softBlend: true,
        summary: 'Rừng cổ thụ chết khô chìm trong sương độc hòa lẫn vào U Lâm, áp sát mạn đông nam Bắc Ải.',
      },
      {
        id: 'loc-kaldrak',
        scope: 'valeroth',
        name: 'Hoang Vực',
        altName: 'Kaldrak',
        ruler: 'Vô chủ',
        x: 205,
        y: 470,
        zonePath: 'M 14 334 L 182 320 L 266 312 L 264 398 L 382 430 L 486 462 L 492 548 L 14 548 Z',
        summary: 'Vùng khe nứt đá vỡ trải rộng mạn tây nam dưới chân Bắc Ải, lãnh địa quái vật.',
      },

      // --- LAYER 2: BÊN TRONG BẮC ẢI ---
      {
        id: 'loc-nors-keep',
        scope: 'norsvale',
        name: 'Tháp Oakhart',
        altName: 'Dinh thự & Đại Sảnh',
        ruler: 'Kaldor Oakhart',
        x: 548,
        y: 178,
        zonePath: 'M 412 36 L 584 28 L 692 162 L 694 278 L 574 314 L 412 214 Z',
        summary: 'Pháo đài đá xám lạnh lẽo là bản doanh của Kaldor Oakhart, gồm Đại Sảnh, phòng Công tước trên tháp chính và sa bàn quân sự.',
      },
      {
        id: 'loc-nors-northgate',
        scope: 'norsvale',
        name: 'Cổng Bắc & Chợ Tiếp Vận',
        altName: 'Bếp & Kho Tiếp Vận',
        ruler: 'Đội quản kho biên ải',
        x: 262,
        y: 126,
        zonePath: 'M 164 32 L 412 42 L 412 204 L 294 210 L 114 198 L 116 112 Z',
        summary: 'Cửa ngõ đón đoàn xe lương thực từ Lam Vịnh và khu bếp lửa hậu cần của dinh thự.',
      },
      {
        id: 'loc-nors-forge',
        scope: 'norsvale',
        name: 'Xưởng Rèn & Kho Quân Nhu',
        altName: 'Lò Thiết Nhẫn',
        ruler: 'Thợ rèn Bắc Ải',
        x: 794,
        y: 186,
        zonePath: 'M 656 122 L 732 48 L 932 108 L 946 276 L 848 296 L 694 278 L 692 162 Z',
        summary: 'Tiếng búa sắt vang nhịp ngày đêm; nơi nung than Hắc Nham, sửa giáp và trữ vũ khí chống quái vật.',
      },
      {
        id: 'loc-nors-barracks',
        scope: 'norsvale',
        name: 'Trại Lính & Sân Tập',
        altName: 'Sân Kỵ Binh & Doanh Trại',
        ruler: 'Đội trưởng tuần biên',
        x: 268,
        y: 274,
        zonePath: 'M 94 196 L 294 210 L 412 204 L 494 316 L 444 344 L 314 316 L 106 346 L 84 264 Z',
        summary: 'Sân tập lầy bùn vây quanh bởi doanh trại đá ẩm lạnh và chuồng ngựa chiến.',
      },
      {
        id: 'loc-nors-tavern',
        scope: 'norsvale',
        name: 'Quán Rượu Mũi Đao',
        altName: 'Quán Lính Đánh Thuê',
        ruler: 'Chủ quán biên ải',
        x: 302,
        y: 404,
        zonePath: 'M 106 346 L 314 316 L 444 344 L 462 456 L 254 504 L 114 426 Z',
        summary: 'Quán rượu khói bếp mù mịt, ồn ã lính đánh thuê; bữa ăn nóng và cốc bia ấm giá 2 Xu bạc.',
      },
      {
        id: 'loc-nors-apothecary',
        scope: 'norsvale',
        name: 'Trạm Y Dược & Luyện Kim',
        altName: 'Nhà Thuốc Biên Ải',
        ruler: 'Y sĩ & Học giả',
        x: 786,
        y: 356,
        zonePath: 'M 656 296 L 694 278 L 848 296 L 934 282 L 926 392 L 788 440 L 656 404 Z',
        summary: 'Nhà đá chuyên băng bó thương binh, chưng cất thuốc giải sương độc và lưu mẫu xác quái vật.',
      },
      {
        id: 'loc-nors-southgate',
        scope: 'norsvale',
        name: 'Cổng Hoang Vực & Tường Nam',
        altName: 'Cửa Ải Tuyến Đầu',
        ruler: 'Đội trực chiến cổng nam',
        x: 566,
        y: 462,
        zonePath: 'M 444 344 L 574 314 L 656 336 L 672 414 L 702 518 L 486 550 L 456 462 Z',
        summary: 'Hai tháp canh đốt lửa báo hiệu cùng cổng sắt nặng hướng thẳng ra Hoang Vực và sương độc Cấm Địa.',
      },
    ],
    routes: [
      { scope: 'valeroth', from: 'loc-valerius', to: 'loc-corinth', type: 'road' },
      { scope: 'valeroth', from: 'loc-valerius', to: 'loc-zarath', type: 'road' },
      { scope: 'valeroth', from: 'loc-valerius', to: 'loc-sylva', type: 'road' },
      { scope: 'valeroth', from: 'loc-zarath', to: 'loc-sylva', type: 'road' },
      { scope: 'valeroth', from: 'loc-corinth', to: 'loc-norsvale', type: 'road' },
      { scope: 'valeroth', from: 'loc-norsvale', to: 'loc-valerius', type: 'road' },
      { scope: 'valeroth', from: 'loc-norsvale', to: 'loc-sylva', type: 'secret' },
      { scope: 'valeroth', from: 'loc-norsvale', to: 'loc-morvath', type: 'secret' },
      { scope: 'valeroth', from: 'loc-norsvale', to: 'loc-kaldrak', type: 'portal' },
      { scope: 'valeroth', from: 'loc-sylva', to: 'loc-morvath', type: 'secret' },

      { scope: 'norsvale', from: 'loc-nors-northgate', to: 'loc-nors-keep', type: 'road' },
      { scope: 'norsvale', from: 'loc-nors-northgate', to: 'loc-nors-barracks', type: 'road' },
      { scope: 'norsvale', from: 'loc-nors-keep', to: 'loc-nors-forge', type: 'road' },
      { scope: 'norsvale', from: 'loc-nors-keep', to: 'loc-nors-southgate', type: 'road' },
      { scope: 'norsvale', from: 'loc-nors-barracks', to: 'loc-nors-tavern', type: 'road' },
      { scope: 'norsvale', from: 'loc-nors-tavern', to: 'loc-nors-southgate', type: 'road' },
      { scope: 'norsvale', from: 'loc-nors-forge', to: 'loc-nors-apothecary', type: 'road' },
      { scope: 'norsvale', from: 'loc-nors-apothecary', to: 'loc-nors-southgate', type: 'road' },
    ],
  };

  global.RP_WORLDS = global.RP_WORLDS || {};
  global.RP_WORLDS[worldDef.id] = worldDef;
  if (global.RPEngine && typeof global.RPEngine.registerWorld === 'function') {
    global.RPEngine.registerWorld(worldDef);
  }
})(typeof window !== 'undefined' ? window : globalThis);
