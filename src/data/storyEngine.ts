import type { MapScope, StoryLocation, StoryWorldState } from '../types/story';

export const MAP_WIDTH = 1000;
export const MAP_HEIGHT = 562;

export const MAP_SCOPE_LABELS: Record<MapScope, string> = {
  valeroth: 'Vương quốc Valeroth',
  norsvale: 'Thành Bắc Ải',
};

/**
 * Pixel-aligned territorial zones (khoanh vùng) synced with:
 * 1) Vương quốc Valeroth (valeroth_v10_1795365600000.jpg)
 * 2) Thành Bắc Ải (norsvale_v14_1795367887097.jpg)
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
      region: 'Trung tâm Vương quốc',
      ruler: 'Hoàng gia & Đại Giáo Đường',
      summary:
        'Kinh thành tường bát giác đồ sộ với tháp nhọn Đại Giáo Đường và mái vòm hoàng cung uy nghiêm giữa lòng đồng bằng trù phú; bao quanh bởi cối xay gió và đồng ruộng nối liền sang thương lộ Lam Vịnh.',
      status: 'visited',
      x: 546,
      y: 256,
      zonePath:
        'M 424 202 L 498 154 L 594 154 L 664 202 L 668 294 L 594 338 L 494 338 L 424 296 Z',
    },
    {
      id: 'loc-zarath',
      scope: 'valeroth',
      name: 'Hắc Nham',
      altName: 'Zarath',
      region: 'Dãy núi tường thành Bắc – Đông Bắc',
      ruler: 'Công tước Vayne Gillet',
      summary:
        'Dãy núi đá hiểm trở bao bọc phía bắc và đông bắc vương quốc như tường thành tự nhiên; trên mỏm đá cao sừng sững pháo đài của Công tước Vayne Gillet nhìn xuống mỏ lộ thiên, cửa hầm, cầu gỗ tải quặng, cụm lò nung và làng thợ mỏ.',
      status: 'visited',
      x: 758,
      y: 92,
      zonePath:
        'M 514 12 L 988 12 L 988 224 L 936 208 L 844 210 L 756 200 L 716 172 L 648 154 L 564 140 Z',
    },
    {
      id: 'loc-corinth',
      scope: 'valeroth',
      name: 'Lam Vịnh',
      altName: 'Corinth',
      region: 'Duyên hải Vùng Biển Xa · Giao thoa Phương Đông',
      ruler: 'Công tước Diocles Ingelrandus',
      summary:
        'Đô thị thương cảng sầm uất mở ra Vùng Biển Xa với cầu cảng đá tấp nập tàu buôn, khu phố thương nhân san sát cùng các thương sảnh mái vòm và hành lang cột mang dấu ấn giao thoa phương Đông; phía đông nối qua đồng ruộng vào Vương Đô, phía nam áp sát trục thương lộ xuống Bắc Ải.',
      status: 'unexplored',
      x: 368,
      y: 112,
      zonePath:
        'M 284 12 L 506 12 L 554 96 L 554 144 L 496 152 L 444 192 L 410 206 L 376 196 L 324 174 L 326 152 L 288 158 L 278 166 L 234 134 L 226 86 L 258 42 Z',
    },
    {
      id: 'loc-norsvale',
      scope: 'valeroth',
      name: 'Bắc Ải',
      altName: 'Norsvale',
      region: 'Thành lũy biên ải',
      ruler: 'Công tước Kaldor Oakhart',
      summary:
        'Tòa thành biên ải quy mô rộng lớn án ngữ giữa biển tây và bìa rừng U Lâm, nổi bật với Tháp Công Tước sừng sững trên vách đá đất liền áp sát Đại Sảnh cùng khu đô thị ngoại thành đông đúc nhà dân — kéo dài bức tường thành kín bưng nối sang U Lâm để bịt chặt hoàn toàn lối từ Hoang Vực vào Valeroth.',
      status: 'current',
      x: 302,
      y: 294,
      zonePath:
        'M 196 222 L 234 222 L 236 240 L 298 212 L 402 274 L 402 344 L 324 378 L 242 336 L 196 304 Z',
    },
    {
      id: 'loc-sylva',
      scope: 'valeroth',
      name: 'U Lâm',
      altName: 'Sylva',
      region: 'Dải rừng cổ thụ Đông – Nam',
      ruler: 'Công tước Artur Houtmann',
      summary:
        'Dải rừng cổ thụ rộng lớn ôm trọn mạn đông với tòa thành lâu đài Gothic bề thế của Công tước Artur Houtmann cùng khu thị trấn cư dân lâm nghiệp trù phú giữa khoảng rừng quang, nối liền bằng trục đường về Vương Đô và được bức tường đá kín bưng của Bắc Ải che chắn hoàn toàn khỏi Hoang Vực.',
      status: 'unexplored',
      x: 840,
      y: 356,
      zonePath:
        'M 504 406 L 542 368 L 622 344 L 678 304 L 700 258 L 748 210 L 850 212 L 936 208 L 988 224 L 988 462 L 928 464 L 894 494 L 896 550 L 732 550 L 686 526 L 582 466 Z',
    },
    {
      id: 'loc-morvath',
      scope: 'valeroth',
      name: 'Cấm Địa',
      altName: 'Morvath',
      region: 'Rừng sương độc · Lẩn khuất trong U Lâm',
      ruler: 'Vô chủ (Tin đồn về Phù Thủy)',
      summary:
        'Vùng trũng cây khô héo lẩn khuất sâu kín dưới tán rừng đông nam của U Lâm; ẩn khuất bên trong là một căn nhà gỗ nhỏ đơn độc gắn với lời đồn về Phù Thủy.',
      status: 'locked',
      x: 928,
      y: 506,
      zonePath:
        'M 896 550 L 894 494 L 928 464 L 988 462 L 988 550 Z',
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
        'Ngoại vực hiểm ác trải rộng ngay ngoài cổng Nam Bắc Ải — mỏm đá bazan đen sắc lẹm, khe đá nứt gãy lởm chởm, cây chết trơ cành vặn vẹo, phế tích tháp canh đổ nát, bia cự thạch đen và bộ xương rồng khổng lồ phơi mình giữa vùng đất chết đầy quái vật.',
      status: 'locked',
      x: 344,
      y: 478,
      zonePath:
        'M 12 550 L 12 424 L 48 366 L 98 420 L 184 374 L 242 344 L 324 384 L 368 366 L 478 414 L 582 478 L 682 538 L 704 550 Z',
    },

    // =========================================================================
    // LAYER 2: THÀNH BẮC ẢI (ĐỒNG BỘ HƯỚNG VỚI VALEROTH: BIỂN TRÁI · BẮC TRÊN · HOANG VỰC DƯỚI · RỪNG PHẢI)
    // =========================================================================
    {
      id: 'loc-nors-keep',
      scope: 'norsvale',
      name: 'Tháp Công Tước',
      altName: 'Tháp Vách Biển · Phòng Công tước',
      region: 'Thành nội Công tước',
      summary:
        'Ngọn tháp đá vuông cao đứng vững trên mỏm vách đá giáp Vùng Biển Xa ngay sát mạn tây Thành Nội, nối liền sang Đại Sảnh qua nhịp cầu đá ngắn lộng gió biển; bên trong tối giản với giường phủ da thú, bàn bản đồ quân sự và rượu mạnh.',
      status: 'visited',
      x: 222,
      y: 102,
      zonePath: 'M 192 68 L 254 68 L 254 240 L 192 224 Z',
    },
    {
      id: 'loc-nors-hall',
      scope: 'norsvale',
      name: 'Đại Sảnh',
      altName: 'Sảnh Tiệc & Hội Nghị',
      region: 'Thành nội Công tước',
      summary:
        'Tòa đại sảnh Gothic mái dốc bề thế tọa lạc bên trong Thành Nội và nối thẳng hành lang cầu đá ngắn hướng tây sang Tháp Công Tước giáp biển; nổi bật với lò sưởi khổng lồ và dãy bàn sồi thô nơi Công tước cùng hiệp sĩ họp bàn.',
      status: 'visited',
      x: 344,
      y: 136,
      zonePath: 'M 256 96 L 398 22 L 428 22 L 432 156 L 316 224 L 256 202 Z',
    },
    {
      id: 'loc-nors-kitchen',
      scope: 'norsvale',
      name: 'Bếp & Hậu Cần',
      altName: 'Bếp Lửa & Kho Lương',
      region: 'Thành nội Công tước',
      summary:
        'Cụm nhà bếp đỏ lửa, lò nướng bánh và kho lương thực nằm kín đáo ngay sát cánh đông Đại Sảnh dọc tường bắc Thành Nội, do người hầu cùng thương binh cựu chiến vận hành.',
      status: 'visited',
      x: 472,
      y: 118,
      zonePath: 'M 434 58 L 512 58 L 512 184 L 462 154 L 434 168 Z',
    },
    {
      id: 'loc-nors-barracks',
      scope: 'norsvale',
      name: 'Trại Huấn Luyện',
      altName: 'Sân Kỵ Binh & Chuồng Ngựa',
      region: 'Thành nội Công tước',
      summary:
        'Sân tập rộng mở giữa lòng Thành Nội với bia bắn cung, chuồng ngựa chiến và bãi luyện kỵ binh, suốt ngày vang tiếng hò hét thao luyện cùng vó ngựa tuần biên.',
      status: 'visited',
      x: 398,
      y: 266,
      zonePath:
        'M 294 242 L 460 164 L 510 198 L 510 222 L 530 222 L 530 266 L 462 308 L 386 336 L 348 314 L 294 288 Z',
    },
    {
      id: 'loc-nors-forge',
      scope: 'norsvale',
      name: 'Xưởng Quân Nhu',
      altName: 'Lò Rèn & Kho Vũ Khí',
      region: 'Thành nội Công tước',
      summary:
        'Khu xưởng rèn và kho quân nhu nằm sát tường nam Thành Nội nhìn ra vách biển, rực lửa lò bễ, đe sắt và giá binh khí phục vụ sửa giáp trụ chống quái vật.',
      status: 'visited',
      x: 416,
      y: 392,
      zonePath:
        'M 308 308 L 346 322 L 386 344 L 518 344 L 518 424 L 408 424 L 308 386 Z',
    },
    {
      id: 'loc-nors-northgate',
      scope: 'norsvale',
      name: 'Cổng Bắc & Chợ Tiếp Vận',
      altName: 'Cổng Quan Lộ Lam Vịnh',
      region: 'Thành ngoại phía Bắc',
      summary:
        'Cửa ngõ phía bắc đón đoàn xe ngựa từ Lam Vịnh và Vương Đô, mở thẳng ra quảng trường chợ tiếp vận tấp nập sạp vải, thùng hàng và thương nhân.',
      status: 'visited',
      x: 584,
      y: 88,
      zonePath: 'M 522 24 L 646 24 L 646 136 L 624 148 L 624 218 L 514 218 L 514 148 L 522 140 Z',
    },
    {
      id: 'loc-nors-tavern',
      scope: 'norsvale',
      name: 'Quán Rượu Mũi Đao',
      altName: 'Quán Lính Đánh Thuê',
      region: 'Quảng trường Thành ngoại',
      summary:
        'Quán rượu khung gỗ lớn nằm ngay ngã tư đường đá đối diện cổng tháp đôi Thành Nội, nồng mùi bia ấm, thịt nướng và tiếng cười thô ráp của lính đánh thuê.',
      status: 'visited',
      x: 595,
      y: 298,
      zonePath: 'M 536 226 L 626 226 L 650 282 L 650 358 L 536 358 Z',
    },
    {
      id: 'loc-nors-town',
      scope: 'norsvale',
      name: 'Khu Dân Cư & Chợ Đêm',
      altName: 'Nhà Dân · Chợ · Nhà Thổ',
      region: 'Thị trấn Thành ngoại',
      summary:
        'Khu thị trấn ngoại thành rộng lớn và đông đúc trải dài toàn bộ mạn đông giáp rìa rừng U Lâm với hàng chục dãy nhà dân khung gỗ san sát, ngõ đá buôn bán tấp nập, chợ đêm treo đèn lồng cùng dãy nhà thổ và quán trọ biên ải.',
      status: 'visited',
      x: 766,
      y: 214,
      zonePath:
        'M 628 148 L 656 82 L 764 82 L 906 174 L 906 376 L 848 376 L 836 312 L 780 312 L 758 340 L 668 298 L 628 242 Z',
    },
    {
      id: 'loc-nors-apothecary',
      scope: 'norsvale',
      name: 'Trạm Y Dược & Luyện Kim',
      altName: 'Nhà Thuốc Biên Ải',
      region: 'Thành ngoại phía Nam',
      summary:
        'Ngôi nhà đá mái vòm yên tĩnh cùng khu vườn thảo dược có tường bao nằm ở phía nam khu phố, chuyên băng bó thương binh từ tường Nam và bào chế thuốc giải độc.',
      status: 'unexplored',
      x: 762,
      y: 386,
      zonePath:
        'M 662 390 L 758 342 L 782 316 L 832 316 L 844 368 L 844 394 L 762 436 L 662 414 Z',
    },
    {
      id: 'loc-nors-southgate',
      scope: 'norsvale',
      name: 'Cổng Hoang Vực & Tường Nam',
      altName: 'Cửa Ải Tuyến Đầu',
      region: 'Tường Nam Thành Bắc Ải',
      summary:
        'Hai tháp canh đá dày kẹp cửa sắt nặng ở mạn nam hướng thẳng ra những mỏm đá bazan đen sắc lẹm và cây chết Hoang Vực — chốt gác tuyến đầu khắc nghiệt nhất Thành Bắc Ải.',
      status: 'current',
      x: 592,
      y: 452,
      zonePath: 'M 522 374 L 662 374 L 662 514 L 522 514 Z',
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
