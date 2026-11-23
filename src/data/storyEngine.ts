import type { MapScope, StoryLocation, StoryWorldState } from '../types/story';

export const MAP_WIDTH = 1000;
export const MAP_HEIGHT = 562;

export const MAP_SCOPE_LABELS: Record<MapScope, string> = {
  valeroth: 'Vương quốc Valeroth',
  norsvale: 'Thành Bắc Ải',
};

/**
 * Pixel-aligned territorial zones (khoanh vùng) synced with:
 * 1) Vương quốc Valeroth (valeroth_master_v40_1795441016467.jpg)
 * 2) Thành Bắc Ải (norsvale_ink_v20_1795432498475.jpg)
 * Coordinate space: 1000 x 562.
 */
export const INITIAL_STORY_WORLD: StoryWorldState = {
  title: 'Valeroth',
  activeMapScope: 'valeroth',
  playerLocationId: 'loc-nors-southgate',
  playerStatus:
    'Đang đứng trực trên tường đá gần Cổng Hoang Vực tại Thành Bắc Ải, dõi mắt qua màn sương lạnh tràn về từ Hoang Vực và Cấm Địa.',
  locations: [
    // =========================================================================
    // LAYER 1: VƯƠNG QUỐC VALEROTH (7 VÙNG ĐẤT)
    // =========================================================================
    {
      id: 'loc-valerius',
      scope: 'valeroth',
      name: 'Vương Đô',
      altName: 'Valerius',
      region: 'Đông – Trung tâm Vương quốc',
      ruler: 'Hoàng gia & Đại Giáo Đường',
      summary:
        'Đại kinh thành tường bát giác rộng lớn với tháp đôi Đại Giáo Đường, mái vòm hoàng cung uy nghiêm và các khu dân cư san sát, phía tây bắc mở ra vựa đồng ruộng cối xay gió trù phú nối tới Lam Vịnh.',
      status: 'visited',
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
      region: 'Dãy núi tường thành Bắc – Đông Bắc',
      ruler: 'Công tước Vayne Gillet',
      summary:
        'Dãy núi đá hiểm trở bao bọc phía bắc và đông bắc vương quốc ngay sát mạn bắc Vương Đô; trên mỏm đá cao sừng sững pháo đài của Công tước Vayne Gillet nối cầu vòm đá xuống mỏ lộ thiên bậc thang cùng thị trấn thợ mỏ, cụm lò nung và khu nhà đá bậc thang đông đúc.',
      status: 'visited',
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
      region: 'Duyên hải Vùng Biển Xa · Giao thoa Phương Đông',
      ruler: 'Công tước Diocles Ingelrandus',
      summary:
        'Đại đô thị thương cảng sầm uất mở rộng ra Vùng Biển Xa với đê chắn sóng vòng cung cùng hải đăng đá, hàng loạt cầu cảng tấp nập tàu buôn, phố thương nhân san sát và các thương sảnh mái vòm uy nghi.',
      status: 'unexplored',
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
      region: 'Thành lũy biên ải phía Tây',
      ruler: 'Công tước Kaldor Oakhart',
      summary:
        'Tòa thành biên ải kiên cố. Cổng Bắc tháp đôi mở lên vùng đồng cỏ, mặt đông khép kín ôm sát dải rừng U Lâm ngăn cách với Vương Đô, và Cổng Nam tháp đôi là cửa ngõ duy nhất dẫn sang Hoang Vực.',
      status: 'current',
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
      region: 'Dải rừng cổ thụ Trung – Đông Nam',
      ruler: 'Công tước Artur Houtmann',
      summary:
        'Cánh rừng cổ thụ dày đặc trải rộng từ mạn đông nam; nổi bật giữa vùng lãnh địa rộng lớn là quần thể lâu đài của Công tước Artur Houtmann cùng thị trấn lâm nghiệp đông đúc.',
      status: 'unexplored',
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
      region: 'Rừng sâu tách biệt · Không đường dẫn tới',
      ruler: 'Vô chủ',
      summary:
        'Góc rừng chết tối tăm và khuất lấp hoàn toàn ở cực đông nam, không hề có đường mòn nào từ U Lâm dẫn tới; ẩn sâu dưới tán cây khô rậm rạp gần như khó nhận ra chỉ có một căn nhà gỗ nhỏ cũ kỹ gắn với lời đồn về Phù Thủy.',
      status: 'locked',
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
      region: 'Ngoại vực Tây Nam',
      ruler: 'Vô chủ',
      summary:
        'Vùng đất chết hiểm ác chỉ mở lối duy nhất từ cổng Nam Bắc Ải — địa hình đá nứt lởm chởm với rặng núi lửa sắc nhọn, khe nứt sâu hẹp sắc lẹm giữa mặt đất vỡ nát, phế tích đá đổ nát, cây gai khô chết cùng xương thú và hài cốt trắng hếu rải rác giữa các hốc đá.',
      status: 'locked',
      x: 344,
      y: 508,
      zonePath:
        'M 6 556 L 6 446 L 110 410 L 252 424 L 336 450 L 404 456 L 438 438 L 696 556 Z',
    },

    // =========================================================================
    // LAYER 2: THÀNH BẮC ẢI (NỘI THÀNH CÔNG TƯỚC TÁCH BIỆT BẰNG TƯỜNG ĐÁ · BIỂN TRÁI · BẮC TRÊN · HOANG VỰC DƯỚI · RỪNG PHẢI)
    // =========================================================================
    {
      id: 'loc-nors-keep',
      scope: 'norsvale',
      name: 'Tháp Chính',
      altName: 'Phòng Công tước',
      region: 'Nội thành Công tước',
      summary:
        'Ngọn tháp đá vuông rất cao xây liền vào tường tây nội thành, chỉ chớm mép vách đá nhìn ra Vùng Biển Xa và thông thẳng sang Đại Sảnh; bên trong tối giản với giường phủ da thú, bàn bản đồ quân sự và rượu mạnh.',
      status: 'visited',
      x: 242,
      y: 124,
      zonePath: 'M 194 46 L 242 20 L 292 46 L 286 192 L 252 258 L 194 244 Z',
    },
    {
      id: 'loc-nors-hall',
      scope: 'norsvale',
      name: 'Đại Sảnh',
      altName: 'Sảnh Tiệc & Hội Nghị',
      region: 'Nội thành Công tước',
      summary:
        'Tòa đại sảnh Gothic mái dốc bề thế nằm ngay sát Tháp Chính bên trong tường nội thành tách biệt với dân thường; nổi bật với lò sưởi khổng lồ và dãy bàn sồi thô nơi Công tước cùng hiệp sĩ họp bàn.',
      status: 'visited',
      x: 374,
      y: 132,
      zonePath: 'M 292 134 L 414 42 L 452 88 L 448 148 L 360 212 L 292 192 Z',
    },
    {
      id: 'loc-nors-kitchen',
      scope: 'norsvale',
      name: 'Bếp & Hậu Cần',
      altName: 'Bếp Lửa & Kho Lương',
      region: 'Nội thành Công tước',
      summary:
        'Cụm nhà bếp đỏ lửa, lò nướng bánh, giếng nước và kho lương thực nằm kín đáo bên trong tường nội thành ngay cánh đông Đại Sảnh, do người hầu cùng thương binh cựu chiến vận hành.',
      status: 'visited',
      x: 514,
      y: 142,
      zonePath: 'M 454 74 L 590 76 L 562 204 L 438 178 L 454 128 Z',
    },
    {
      id: 'loc-nors-barracks',
      scope: 'norsvale',
      name: 'Trại Huấn Luyện',
      altName: 'Sân Kỵ Binh & Chuồng Ngựa',
      region: 'Nội thành Công tước',
      summary:
        'Sân tập quân sự có tường nội thành và cổng gác tách biệt hẳn khỏi khu dân cư, gồm chuồng ngựa chiến, bia bắn cung, giá binh khí và bãi luyện kỵ binh.',
      status: 'visited',
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
      region: 'Nội thành · Tuyến Nam',
      summary:
        'Khu xưởng rèn và kho quân nhu nằm trong nội thành sát tường Nam, rực lửa lò bễ, đe sắt và giá binh khí phục vụ trực tiếp cho phòng tuyến chống quái vật.',
      status: 'visited',
      x: 374,
      y: 364,
      zonePath:
        'M 262 304 L 328 286 L 366 324 L 492 318 L 456 420 L 264 388 Z',
    },
    {
      id: 'loc-nors-northgate',
      scope: 'norsvale',
      name: 'Cổng Bắc & Chợ Tiếp Vận',
      region: 'Thành ngoại phía Bắc',
      status: 'visited',
      x: 656,
      y: 98,
      labelOnly: true,
    },
    {
      id: 'loc-nors-tavern',
      scope: 'norsvale',
      name: 'Quán Rượu Mũi Đao',
      altName: 'Quán Lính Đánh Thuê',
      region: 'Quảng trường Thành ngoại',
      summary:
        'Quán rượu khung gỗ lớn nằm ngay quảng trường Thành Ngoại đối diện cổng gác nội thành, nồng mùi bia ấm, thịt nướng và tiếng cười thô ráp của lính đánh thuê.',
      status: 'visited',
      x: 672,
      y: 266,
      zonePath: 'M 620 250 L 680 198 L 722 232 L 724 298 L 664 354 L 620 310 Z',
    },
    {
      id: 'loc-nors-town',
      scope: 'norsvale',
      name: 'Khu Dân Cư & Chợ Đêm',
      altName: 'Nhà Dân · Chợ · Nhà Thổ',
      region: 'Hậu phương Đông Bắc Thành ngoại',
      summary:
        'Khu thị trấn dân sự đông đúc nằm bên ngoài tường nội thành với hàng chục dãy nhà khung gỗ san sát, ngõ đá chợ đêm cùng quán trọ biên ải.',
      status: 'visited',
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
      region: 'Khu đệm Đông Nam',
      summary:
        'Khu nhà đá mái vòm có tường bao kín đáo cùng vườn thảo dược nằm tách giữa khu dân cư và tường Nam.',
      status: 'unexplored',
      x: 798,
      y: 362,
      zonePath:
        'M 690 344 L 780 280 L 908 300 L 898 366 L 786 452 L 690 404 Z',
    },
    {
      id: 'loc-nors-southgate',
      scope: 'norsvale',
      name: 'Cổng Hoang Vực & Tường Nam',
      region: 'Phòng tuyến Nam Thành Bắc Ải',
      status: 'current',
      x: 598,
      y: 456,
      labelOnly: true,
    },
  ],
  characters: [
    {
      id: 'char-player',
      name: 'Bạn',
      role: 'Người chơi',
      locationId: 'loc-nors-southgate',
      status: 'Còn sống',
      isPlayer: true,
    },
  ],
};

export function getLocationScope(loc: StoryLocation): MapScope {
  return loc.scope ?? 'valeroth';
}

export interface ResolvedPlayerPosition {
  exactLocation: StoryLocation | null;
  displayLocationForScope: (scope: MapScope) => StoryLocation | null;
  overworldLocation: StoryLocation | null;
  interiorLocation: StoryLocation | null;
  recommendedScope: MapScope;
  status: string;
}

export function resolvePlayerPosition(world: StoryWorldState): ResolvedPlayerPosition {
  const playerChar = world.characters.find((c) => c.isPlayer);
  const rawLocId = world.playerLocationId || playerChar?.locationId || 'loc-nors-southgate';

  const exactLocation =
    world.locations.find((l) => l.id === rawLocId) ??
    world.locations.find((l) => l.status === 'current') ??
    world.locations[0] ??
    null;

  const norsvaleOverworld =
    world.locations.find((l) => l.id === 'loc-norsvale') ??
    world.locations.find((l) => getLocationScope(l) === 'valeroth') ??
    null;

  const norsvaleEntryGate =
    world.locations.find((l) => l.id === 'loc-nors-northgate') ??
    world.locations.find((l) => getLocationScope(l) === 'norsvale') ??
    null;

  let overworldLocation: StoryLocation | null = null;
  let interiorLocation: StoryLocation | null = null;
  let recommendedScope: MapScope = 'valeroth';

  if (exactLocation) {
    if (getLocationScope(exactLocation) === 'norsvale') {
      interiorLocation = exactLocation;
      overworldLocation = norsvaleOverworld;
      recommendedScope = 'norsvale';
    } else {
      overworldLocation = exactLocation;
      interiorLocation = exactLocation.id === 'loc-norsvale' ? norsvaleEntryGate : null;
      recommendedScope = 'valeroth';
    }
  }

  const status =
    world.playerStatus ||
    (exactLocation ? `Đang có mặt tại ${exactLocation.name}.` : 'Chưa xác định vị trí.');

  return {
    exactLocation,
    overworldLocation,
    interiorLocation,
    recommendedScope,
    status,
    displayLocationForScope: (scope: MapScope) =>
      scope === 'norsvale' ? interiorLocation : overworldLocation,
  };
}
