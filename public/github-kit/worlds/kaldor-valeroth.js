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
          ? 'src/assets/images/valeroth_overworld_v22_1795283743457.jpg'
          : 'assets/kaldor/valeroth.jpg',
        assetFile: 'valeroth.jpg',
      },
      {
        id: 'norsvale',
        label: 'Thành Bắc Ải',
        titlePlate: '· THÀNH BẮC ẢI ·',
        image: isAiStudioRepo
          ? 'src/assets/images/norsvale_interior_v12_1795283643903.jpg'
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
          'Kinh thành tường bát giác đồ sộ với tháp nhọn Đại Giáo Đường và mái vòm hoàng cung uy nghiêm giữa lòng đồng bằng trù phú; bao quanh bởi cối xay gió và đồng ruộng nối liền sang thương lộ Lam Vịnh.',
        x: 572,
        y: 278,
        zonePath:
          'M 310 218 L 414 196 L 496 138 L 538 158 L 718 228 L 728 346 L 638 410 L 586 468 L 456 446 L 434 364 L 408 264 Z',
      },
      {
        id: 'loc-zarath',
        scope: 'valeroth',
        name: 'Hắc Nham',
        altName: 'Zarath',
        ruler: 'Công tước Vayne Gillet',
        summary:
          'Dãy núi đá hiểm trở bao bọc phía bắc và đông bắc vương quốc như tường thành tự nhiên; trên mỏm đá cao sừng sững pháo đài của Công tước Vayne Gillet nhìn xuống mỏ lộ thiên, cửa hầm, cầu gỗ tải quặng, cụm lò nung và làng thợ mỏ.',
        x: 742,
        y: 162,
        zonePath:
          'M 520 10 L 992 10 L 992 246 L 866 266 L 718 228 L 538 158 L 496 138 Z',
      },
      {
        id: 'loc-corinth',
        scope: 'valeroth',
        name: 'Lam Vịnh',
        altName: 'Corinth',
        ruler: 'Công tước Diocles Ingelrandus',
        summary:
          'Đô thị thương cảng sầm uất mở ra The Far Sea với cầu cảng đá tấp nập tàu buôn, khu phố thương nhân san sát cùng các thương sảnh mái vòm và hành lang cột mang dấu ấn giao thoa phương Đông; phía đông nối qua đồng ruộng vào Vương Đô, phía nam áp sát trục thương lộ xuống Bắc Ải.',
        x: 348,
        y: 98,
        zonePath:
          'M 196 144 L 200 66 L 284 10 L 520 10 L 496 138 L 414 196 L 310 218 L 260 198 Z',
      },
      {
        id: 'loc-norsvale',
        scope: 'valeroth',
        name: 'Bắc Ải',
        altName: 'Norsvale',
        ruler: 'Công tước Kaldor Oakhart',
        summary:
          'Tòa thành biên ải quy mô đồ sộ án ngữ ngay dưới chân Lam Vịnh, nổi bật với Tháp Công Tước sừng sững trên vách đá giáp biển The Far Sea nối cầu vòm đá vào Đại Sảnh, Thành Nội và khu phố ngoại thành — chắn kín mọi lối tiến từ Hoang Vực vào Valeroth.',
        x: 326,
        y: 344,
        zonePath:
          'M 164 368 L 180 198 L 260 198 L 310 218 L 408 264 L 434 364 L 456 446 L 316 440 Z',
      },
      {
        id: 'loc-sylva',
        scope: 'valeroth',
        name: 'U Lâm',
        altName: 'Sylva',
        ruler: 'Công tước Artur Houtmann',
        summary:
          'Dải rừng cổ thụ rộng lớn ôm trọn mạn đông với tòa lâu đài Gothic ẩn sâu trong tán lá, đồng thời kéo dài liền mạch về phía tây nam dưới chân Bắc Ải giáp ranh Hoang Vực.',
        x: 842,
        y: 344,
        zonePath:
          'M 586 468 L 638 410 L 728 346 L 718 228 L 866 266 L 992 246 L 992 430 L 848 438 L 802 496 L 814 554 L 598 554 Z',
      },
      {
        id: 'loc-morvath',
        scope: 'valeroth',
        name: 'Cấm Địa',
        altName: 'Morvath',
        ruler: 'Vô chủ (Tin đồn về Phù Thủy)',
        summary:
          'Vùng trũng cây khô héo lẩn khuất sâu kín dưới tán rừng đông nam của U Lâm; ẩn khuất bên trong là một căn nhà gỗ nhỏ đơn độc gắn với lời đồn về Phù Thủy.',
        x: 896,
        y: 514,
        zonePath:
          'M 802 496 L 848 438 L 992 430 L 992 554 L 814 554 Z',
        softBlend: true,
      },
      {
        id: 'loc-kaldrak',
        scope: 'valeroth',
        name: 'Hoang Vực',
        altName: 'Kaldrak',
        ruler: 'Vô chủ',
        summary:
          'Ngoại vực hiểm ác trải rộng ngay ngoài cổng Nam Bắc Ải — đá đen lởm chởm, cây chết trơ cành, phế tích tháp canh đổ nát, bia cự thạch và những bộ xương khổng lồ phơi mình giữa đất hoang đầy quái vật.',
        x: 274,
        y: 472,
        zonePath:
          'M 8 554 L 8 386 L 164 368 L 316 440 L 456 446 L 586 468 L 598 554 Z',
      },

      // --- LAYER 2: THÀNH BẮC ẢI (ĐỒNG BỘ HƯỚNG VỚI VALEROTH: BIỂN BÊN TRÁI · BẮC TRÊN · HOANG VỰC DƯỚI · RỪNG BÊN PHẢI) ---
      {
        id: 'loc-nors-keep',
        scope: 'norsvale',
        name: 'Tháp Công Tước',
        altName: 'Tháp Vách Biển · Phòng Công tước',
        summary:
          'Ngọn tháp đá vuông cao tách biệt hoàn toàn trên mỏm vách đá giáp biển The Far Sea ở cực tây Thành Nội, chỉ nối sang Đại Sảnh qua cây cầu đá vòm lộng gió biển; bên trong tối giản với giường phủ da thú, bàn bản đồ quân sự và rượu mạnh.',
        x: 118,
        y: 158,
        zonePath: 'M 68 48 L 162 44 L 236 146 L 236 226 L 154 294 L 68 286 Z',
      },
      {
        id: 'loc-nors-hall',
        scope: 'norsvale',
        name: 'Đại Sảnh',
        altName: 'Sảnh Tiệc & Hội Nghị',
        summary:
          'Tòa sảnh đá mái dốc đồ sộ tọa lạc bên trong Thành Nội và nối thẳng hành lang cầu đá hướng tây ra Tháp Công Tước giáp biển; nổi bật với lò sưởi khổng lồ và dãy bàn sồi thô nơi Công tước cùng hiệp sĩ họp bàn.',
        x: 292,
        y: 186,
        zonePath: 'M 224 128 L 324 98 L 364 166 L 352 258 L 228 242 Z',
      },
      {
        id: 'loc-nors-kitchen',
        scope: 'norsvale',
        name: 'Bếp & Hậu Cần',
        altName: 'Bếp Lửa & Kho Lương',
        summary:
          'Cụm nhà bếp đỏ lửa, lò nướng bánh và kho lương thực nằm kín đáo cạnh Đại Sảnh dọc tường bắc Thành Nội, do người hầu cùng thương binh cựu chiến vận hành.',
        x: 454,
        y: 124,
        zonePath: 'M 332 82 L 570 84 L 568 184 L 364 166 Z',
      },
      {
        id: 'loc-nors-barracks',
        scope: 'norsvale',
        name: 'Trại Huấn Luyện',
        altName: 'Sân Kỵ Binh & Chuồng Ngựa',
        summary:
          'Sân tập rộng mở giữa lòng Thành Nội với bia bắn cung, chuồng ngựa chiến và bãi luyện kỵ binh, suốt ngày vang tiếng hò hét thao luyện cùng vó ngựa tuần biên.',
        x: 422,
        y: 248,
        zonePath: 'M 352 258 L 364 166 L 568 184 L 520 318 L 434 344 L 348 290 Z',
      },
      {
        id: 'loc-nors-forge',
        scope: 'norsvale',
        name: 'Xưởng Quân Nhu',
        altName: 'Lò Rèn & Kho Vũ Khí',
        summary:
          'Khu xưởng rèn và kho quân nhu nằm sát tường nam Thành Nội nhìn ra vách biển, rực lửa lò bễ, đe sắt và giá binh khí phục vụ sửa giáp trụ chống quái vật.',
        x: 318,
        y: 334,
        zonePath: 'M 204 260 L 228 242 L 352 258 L 434 344 L 444 416 L 266 392 L 204 320 Z',
      },
      {
        id: 'loc-nors-northgate',
        scope: 'norsvale',
        name: 'Cổng Bắc & Chợ Tiếp Vận',
        altName: 'Cổng Quan Lộ Lam Vịnh',
        summary:
          'Cửa ngõ phía bắc đón đoàn xe ngựa từ Lam Vịnh và Vương Đô, mở thẳng ra quảng trường chợ tiếp vận tấp nập sạp vải, thùng hàng và thương nhân.',
        x: 656,
        y: 162,
        zonePath: 'M 570 46 L 688 46 L 786 116 L 764 232 L 664 238 L 568 220 Z',
      },
      {
        id: 'loc-nors-tavern',
        scope: 'norsvale',
        name: 'Quán Rượu Mũi Đao',
        altName: 'Quán Lính Đánh Thuê',
        summary:
          'Quán rượu khung gỗ lớn nằm ngay ngã tư đường đá đối diện cổng tháp đôi Thành Nội, nồng mùi bia ấm, thịt nướng và tiếng cười thô ráp của lính đánh thuê.',
        x: 656,
        y: 282,
        zonePath: 'M 578 232 L 704 224 L 732 296 L 696 350 L 584 328 Z',
      },
      {
        id: 'loc-nors-town',
        scope: 'norsvale',
        name: 'Khu Dân Cư & Chợ Đêm',
        altName: 'Nhà Dân · Chợ · Nhà Thổ',
        summary:
          'Khu thị trấn ngoại thành rộng lớn trải dài về mạn đông giáp rìa rừng U Lâm với dãy nhà dân khung gỗ san sát, ngõ đá buôn bán tấp nập, chợ đêm treo đèn lồng cùng dãy nhà thổ và quán trọ biên ải.',
        x: 856,
        y: 344,
        zonePath:
          'M 704 224 L 764 232 L 786 116 L 992 172 L 992 554 L 692 554 L 758 450 L 696 350 L 732 296 Z',
      },
      {
        id: 'loc-nors-apothecary',
        scope: 'norsvale',
        name: 'Trạm Y Dược & Luyện Kim',
        altName: 'Nhà Thuốc Biên Ải',
        summary:
          'Ngôi nhà đá mái vòm yên tĩnh cùng khu vườn thảo dược có tường bao nằm ở phía nam khu phố, chuyên băng bó thương binh từ tường Nam và bào chế thuốc giải độc.',
        x: 634,
        y: 454,
        zonePath: 'M 508 446 L 642 356 L 758 450 L 642 554 L 568 554 Z',
      },
      {
        id: 'loc-nors-southgate',
        scope: 'norsvale',
        name: 'Cổng Hoang Vực & Tường Nam',
        altName: 'Cửa Ải Tuyến Đầu',
        summary:
          'Hai tháp canh đá dày kẹp cửa sắt nặng ở mạn nam hướng thẳng ra những mỏm đá đen lởm chởm và cây chết Hoang Vực — chốt gác tuyến đầu khắc nghiệt nhất Thành Bắc Ải.',
        x: 386,
        y: 486,
        zonePath: 'M 266 392 L 444 416 L 568 554 L 244 554 L 248 444 Z',
      },
    ],
    routes: [],
  };

  global.RP_WORLDS = global.RP_WORLDS || {};
  global.RP_WORLDS[worldDef.id] = worldDef;
  if (global.RPEngine && typeof global.RPEngine.registerWorld === 'function') {
    global.RPEngine.registerWorld(worldDef);
  }
})(typeof window !== 'undefined' ? window : globalThis);
