/**
 * WORLD PACK: Kaldor Oakhart — Vương quốc Valeroth & Thành Bắc Ải
 * World ID: "kaldor-valeroth"
 *
 * Load this file together with engine.js ONLY for Kaldor's RP bot:
 *   <script src="https://cdn.jsdelivr.net/gh/<USER>/<REPO>@<SHA>/public/github-kit/worlds/kaldor-valeroth.js"></script>
 *   <script src="https://cdn.jsdelivr.net/gh/<USER>/<REPO>@<SHA>/public/github-kit/engine.js"></script>
 */
(function (global) {
  'use strict';

  var currentScript = document.currentScript;
  var repoBase = '';
  var isAiStudioRepo = false;
  if (currentScript && currentScript.src) {
    if (/\/public\/github-kit\/worlds\/[^/?#]+(?:[?#].*)?$/.test(currentScript.src)) {
      isAiStudioRepo = true;
      repoBase = currentScript.src.replace(/\/public\/github-kit\/worlds\/[^/?#]+(?:[?#].*)?$/, '');
    } else {
      repoBase = currentScript.src.replace(/\/worlds\/[^/?#]+(?:[?#].*)?$/, '');
    }
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
        label: 'Vương quốc Valeroth',
        titlePlate: '· VALEROTH ·',
        image: isAiStudioRepo
          ? 'src/assets/images/valeroth_master_v40_1795441016467.jpg'
          : 'assets/kaldor/valeroth.jpg',
        assetFile: 'valeroth.jpg',
      },
      {
        id: 'norsvale',
        label: 'Thành Bắc Ải',
        titlePlate: '· THÀNH BẮC ẢI ·',
        image: isAiStudioRepo
          ? 'src/assets/images/norsvale_ink_v20_1795432498475.jpg'
          : 'assets/kaldor/norsvale.jpg',
        assetFile: 'norsvale.jpg',
      },
    ],
    parentLayerLinks: {
      norsvale: {
        parentScope: 'valeroth',
        parentLocId: 'loc-norsvale',
        defaultChildLocId: 'loc-nors-northgate',
        enterLabel: 'Vào Thành Bắc Ải →',
      },
    },
    locations: [
      // --- LAYER 1: VƯƠNG QUỐC VALEROTH (7 VÙNG ĐẤT) ---
      {
        id: 'loc-valerius',
        scope: 'valeroth',
        name: 'Vương Đô',
        altName: 'Valerius',
        ruler: 'Hoàng gia & Đại Giáo Đường',
        summary:
          'Đại kinh thành tường bát giác rộng lớn với tháp đôi Đại Giáo Đường, mái vòm hoàng cung uy nghiêm và các khu dân cư san sát, phía tây bắc mở ra vựa đồng ruộng cối xay gió trù phú nối tới Lam Vịnh.',
        x: 682,
        y: 242,
        zonePath:
          'M 548 286 L 548 180 L 664 108 L 742 138 L 816 180 L 816 288 L 740 338 L 630 338 Z',
      },
      {
        id: 'loc-zarath',
        scope: 'valeroth',
        name: 'Hắc Nham',
        altName: 'Zarath',
        ruler: 'Công tước Vayne Gillet',
        summary:
          'Dãy núi đá hiểm trở bao bọc phía bắc và đông bắc vương quốc ngay sát mạn bắc Vương Đô; trên mỏm đá cao sừng sững pháo đài của Công tước Vayne Gillet nối cầu vòm đá xuống mỏ lộ thiên bậc thang cùng thị trấn thợ mỏ, cụm lò nung và khu nhà đá bậc thang đông đúc.',
        x: 842,
        y: 112,
        zonePath:
          'M 684 6 L 994 6 L 994 234 L 892 224 L 832 204 L 822 166 L 764 134 L 714 120 L 672 78 Z',
      },
      {
        id: 'loc-corinth',
        scope: 'valeroth',
        name: 'Lam Vịnh',
        altName: 'Corinth',
        ruler: 'Công tước Diocles Ingelrandus',
        summary:
          'Đại đô thị thương cảng sầm uất mở rộng ra Vùng Biển Xa với đê chắn sóng vòng cung cùng hải đăng đá, hàng loạt cầu cảng tấp nập tàu buôn, phố thương nhân san sát và các thương sảnh mái vòm uy nghi.',
        x: 296,
        y: 148,
        zonePath:
          'M 152 206 L 158 152 L 206 56 L 368 46 L 468 114 L 474 196 L 424 244 L 306 268 L 194 250 Z',
      },
      {
        id: 'loc-norsvale',
        scope: 'valeroth',
        name: 'Bắc Ải',
        altName: 'Norsvale',
        ruler: 'Công tước Kaldor Oakhart',
        summary:
          'Tòa thành biên ải kiên cố. Cổng Bắc tháp đôi mở lên vùng đồng cỏ, mặt đông khép kín ôm sát dải rừng U Lâm ngăn cách với Vương Đô, và Cổng Nam tháp đôi là cửa ngõ duy nhất dẫn sang Hoang Vực.',
        x: 362,
        y: 364,
        zonePath:
          'M 232 356 L 234 270 L 274 270 L 344 282 L 408 288 L 478 302 L 472 422 L 406 454 L 336 448 L 252 422 L 252 368 Z',
      },
      {
        id: 'loc-sylva',
        scope: 'valeroth',
        name: 'U Lâm',
        altName: 'Sylva',
        ruler: 'Công tước Artur Houtmann',
        summary:
          'Cánh rừng cổ thụ dày đặc trải rộng từ mạn đông nam; nổi bật giữa vùng lãnh địa rộng lớn là quần thể lâu đài của Công tước Artur Houtmann cùng thị trấn lâm nghiệp đông đúc.',
        x: 842,
        y: 382,
        zonePath:
          'M 714 404 L 740 354 L 794 344 L 822 336 L 860 258 L 944 260 L 974 322 L 974 384 L 904 424 L 850 444 L 784 468 L 726 446 Z',
      },
      {
        id: 'loc-morvath',
        scope: 'valeroth',
        name: 'Cấm Địa',
        altName: 'Morvath',
        ruler: 'Vô chủ',
        summary:
          'Góc rừng chết tối tăm và khuất lấp hoàn toàn ở cực đông nam, không hề có đường mòn nào từ U Lâm dẫn tới; ẩn sâu dưới tán cây khô rậm rạp gần như khó nhận ra chỉ có một căn nhà gỗ nhỏ cũ kỹ gắn với lời đồn về Phù Thủy.',
        x: 928,
        y: 500,
        zonePath:
          'M 892 556 L 892 514 L 914 468 L 994 452 L 994 556 Z',
        softBlend: true,
      },
      {
        id: 'loc-kaldrak',
        scope: 'valeroth',
        name: 'Hoang Vực',
        altName: 'Kaldrak',
        ruler: 'Vô chủ',
        summary:
          'Vùng đất chết hiểm ác chỉ mở lối duy nhất từ cổng Nam Bắc Ải — địa hình đá nứt lởm chởm với rặng núi lửa sắc nhọn, khe nứt sâu hẹp sắc lẹm giữa mặt đất vỡ nát, phế tích đá đổ nát, cây gai khô chết cùng xương thú và hài cốt trắng hếu rải rác giữa các hốc đá.',
        x: 344,
        y: 508,
        zonePath:
          'M 6 556 L 6 446 L 110 410 L 252 424 L 336 450 L 404 456 L 438 438 L 696 556 Z',
      },

      // --- LAYER 2: THÀNH BẮC ẢI (NỘI THÀNH CÔNG TƯỚC TÁCH BIỆT BẰNG TƯỜNG ĐÁ · BIỂN BÊN TRÁI · BẮC TRÊN · HOANG VỰC DƯỚI · RỪNG BÊN PHẢI) ---
      {
        id: 'loc-nors-keep',
        scope: 'norsvale',
        name: 'Tháp Chính',
        altName: 'Phòng Công tước',
        summary:
          'Ngọn tháp đá vuông rất cao xây liền vào tường tây nội thành, chỉ chớm mép vách đá nhìn ra Vùng Biển Xa và thông thẳng sang Đại Sảnh; bên trong tối giản với giường phủ da thú, bàn bản đồ quân sự và rượu mạnh.',
        x: 242,
        y: 124,
        zonePath: 'M 194 46 L 242 20 L 292 46 L 286 192 L 252 258 L 194 244 Z',
      },
      {
        id: 'loc-nors-hall',
        scope: 'norsvale',
        name: 'Đại Sảnh',
        altName: 'Sảnh Tiệc & Hội Nghị',
        summary:
          'Tòa đại sảnh Gothic mái dốc bề thế nằm ngay sát Tháp Chính bên trong tường nội thành tách biệt với dân thường; nổi bật với lò sưởi khổng lồ và dãy bàn sồi thô nơi Công tước cùng hiệp sĩ họp bàn.',
        x: 374,
        y: 132,
        zonePath: 'M 292 134 L 414 42 L 452 88 L 448 148 L 360 212 L 292 192 Z',
      },
      {
        id: 'loc-nors-kitchen',
        scope: 'norsvale',
        name: 'Bếp & Hậu Cần',
        altName: 'Bếp Lửa & Kho Lương',
        summary:
          'Cụm nhà bếp đỏ lửa, lò nướng bánh, giếng nước và kho lương thực nằm kín đáo bên trong tường nội thành ngay cánh đông Đại Sảnh, do người hầu cùng thương binh cựu chiến vận hành.',
        x: 514,
        y: 142,
        zonePath: 'M 454 74 L 590 76 L 562 204 L 438 178 L 454 128 Z',
      },
      {
        id: 'loc-nors-barracks',
        scope: 'norsvale',
        name: 'Trại Huấn Luyện',
        altName: 'Sân Kỵ Binh & Chuồng Ngựa',
        summary:
          'Sân tập quân sự có tường nội thành và cổng gác tách biệt hẳn khỏi khu dân cư, gồm chuồng ngựa chiến, bia bắn cung, giá binh khí và bãi luyện kỵ binh.',
        x: 382,
        y: 262,
        zonePath:
          'M 258 264 L 266 210 L 516 256 L 492 318 L 366 324 L 328 286 L 262 304 Z',
      },
      {
        id: 'loc-nors-forge',
        scope: 'norsvale',
        name: 'Xưởng Quân Nhu',
        altName: 'Lò Rèn & Kho Vũ Khí',
        summary:
          'Khu xưởng rèn và kho quân nhu nằm trong nội thành sát tường Nam, rực lửa lò bễ, đe sắt và giá binh khí phục vụ trực tiếp cho phòng tuyến chống quái vật.',
        x: 374,
        y: 364,
        zonePath:
          'M 262 304 L 328 286 L 366 324 L 492 318 L 456 420 L 264 388 Z',
      },
      {
        id: 'loc-nors-northgate',
        scope: 'norsvale',
        name: 'Cổng Bắc & Chợ Tiếp Vận',
        x: 656,
        y: 98,
        labelOnly: true,
      },
      {
        id: 'loc-nors-tavern',
        scope: 'norsvale',
        name: 'Quán Rượu Mũi Đao',
        altName: 'Quán Lính Đánh Thuê',
        summary:
          'Quán rượu khung gỗ lớn nằm ngay quảng trường Thành Ngoại đối diện cổng gác nội thành, nồng mùi bia ấm, thịt nướng và tiếng cười thô ráp của lính đánh thuê.',
        x: 672,
        y: 266,
        zonePath: 'M 620 250 L 680 198 L 722 232 L 724 298 L 664 354 L 620 310 Z',
      },
      {
        id: 'loc-nors-town',
        scope: 'norsvale',
        name: 'Khu Dân Cư & Chợ Đêm',
        altName: 'Nhà Dân · Chợ · Nhà Thổ',
        summary:
          'Khu thị trấn dân sự đông đúc nằm bên ngoài tường nội thành với hàng chục dãy nhà khung gỗ san sát, ngõ đá chợ đêm cùng quán trọ biên ải.',
        x: 816,
        y: 180,
        zonePath:
          'M 688 190 L 726 76 L 928 78 L 912 294 L 780 276 L 726 232 Z',
      },
      {
        id: 'loc-nors-apothecary',
        scope: 'norsvale',
        name: 'Trạm Y Dược & Luyện Kim',
        altName: 'Nhà Thuốc Biên Ải',
        summary:
          'Khu nhà đá mái vòm có tường bao kín đáo cùng vườn thảo dược nằm tách giữa khu dân cư và tường Nam.',
        x: 798,
        y: 362,
        zonePath:
          'M 690 344 L 780 280 L 908 300 L 898 366 L 786 452 L 690 404 Z',
      },
      {
        id: 'loc-nors-southgate',
        scope: 'norsvale',
        name: 'Cổng Hoang Vực & Tường Nam',
        x: 598,
        y: 456,
        labelOnly: true,
      },
    ],
  };

  global.RP_WORLDS = global.RP_WORLDS || {};
  global.RP_WORLDS[worldDef.id] = worldDef;
  if (global.RPEngine && typeof global.RPEngine.registerWorld === 'function') {
    global.RPEngine.registerWorld(worldDef);
  }
})(typeof window !== 'undefined' ? window : globalThis);
