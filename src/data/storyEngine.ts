import type {
  LocationStatus,
  LocationType,
  MapScope,
  RouteStatus,
  RouteType,
  StoryLocation,
  StoryRoute,
  StoryWorldState,
} from '../types/story';

export const MAP_WIDTH = 1000;
export const MAP_HEIGHT = 562;

export const LOCATION_TYPE_LABELS: Record<LocationType, string> = {
  city: 'Đô thành / Công quốc',
  port: 'Hải cảng / Cổng tiếp vận',
  landmark: 'Lãnh địa / Khu vực',
  ruins: 'Hoang vực',
  camp: 'Pháo đài / Quân doanh',
  mystery: 'Cấm địa / Y dược',
};

export const LOCATION_STATUS_LABELS: Record<LocationStatus, string> = {
  current: 'Đang hiện diện',
  visited: 'Đã đặt chân',
  unexplored: 'Chưa khảo sát',
  locked: 'Nguy hiểm / Phong tỏa',
};

export const ROUTE_TYPE_LABELS: Record<RouteType, string> = {
  road: 'Quan lộ / Đường đá',
  sea: 'Hải trình',
  secret: 'Lối mòn Ám vệ',
  portal: 'Đường tuần biên',
};

export const ROUTE_STATUS_LABELS: Record<RouteStatus, string> = {
  traversed: 'Đã đi qua',
  open: 'Thông thương',
  blocked: 'Bị phong tỏa',
};

export const MAP_SCOPE_LABELS: Record<MapScope, string> = {
  valeroth: 'Toàn cảnh Valeroth',
  norsvale: 'Bên trong Bắc Ải',
};

export const VALEROTH_LORE_CODEX = `# SECTION 4 | WORLD BUILDING

(1) THE KINGDOM OF VALEROTH & SENSORY ANCHORS
* STRICT FICTIONAL INTEGRITY: This is an ENTIRELY FICTIONAL universe. STRICTLY FORBIDDEN from using real-world historical names, countries, religions, or events (e.g., no Roman Empire, no Catholic Church). Adapt and invent original concepts fitting the lore.
* DYNAMIC NAMING (Localization): Use either the Vietnamese or Valerothian name naturally according to narrative context (e.g., Vương Đô / Valerius; U Lâm / Sylva; Hắc Nham / Zarath; Lam Vịnh / Corinth; Bắc Ải / Norsvale). Do not mechanically pair both.
* DYNAMIC SCENE SHIFTING: Organically transition scenes to reflect escalating drama.

(1.1) Atmosphere & Aesthetics (Sensory Anchors):
* Heavy, damp grey stone castles, muddy cobblestone streets, flickering candlelight, cold glint of scratched armor. Audio of military orders, iron-nailed boots, blacksmith hammers. Smell of rusted iron, damp leather, hearth ash, wet pine needles, and blood.
* Climate & Vibe of The North (Bắc Ải / Norsvale): Always several degrees colder; summer brings heavy rains, dense fog, and moss; winter brings brutal snowdrifts. Practical, harsh, devoid of rigid aristocratic etiquette.

(1.2) The Five Pillars of Valeroth & Outer Realms:
* Vương Đô (Valerius): Central walled royal heartland. Gold-plated domes of the Royal Palace and Grand Chantry spires.
* Hắc Nham (Zarath): Upper-right feudal stone-foundry & mining stronghold behind Vương Đô, backed by rugged mountains. Medieval stone blast-furnaces, dark quarries, coal smoke, sulfur, iron & ore extraction. Led by Duke Vayne Gillet.
* Lam Vịnh (Corinth): Entire western coastal zone beside Vương Đô, facing the Western Sea. Bustling trade port blending Valeroth's culture with Eastern aesthetics. Led by Duke Diocles Ingelrandus.
* Bắc Ải (Norsvale): Below Lam Vịnh, bordering Lam Vịnh, Vương Đô, U Lâm, Cấm Địa, and Hoang Vực. Commanded by Kaldor Oakhart. Grim stone fortress serving as Valeroth's primary defensive chokepoint against monster incursions.
  - Interior zones of Bắc Ải: Tháp Oakhart (Sảnh Chỉ Huy), Cổng Bắc & Chợ Tiếp Vận, Xưởng Rèn & Kho Quân Nhu, Trại Lính & Sân Tập, Quán Rượu Mũi Đao, Trạm Y Dược & Luyện Kim, Cổng Hoang Vực & Tường Nam.
* U Lâm (Sylva): Long ancient dark woodland along the entire right flank, bordering Hắc Nham, Vương Đô, Bắc Ải, and blending seamlessly into Cấm Địa. Ancient timber, rare beasts, secretly harbors Ám vệ assassins cultivated by Duke Artur Houtmann.
* Outer Realms:
  - Cấm Địa (Morvath): Gnarled ancient trees in toxic mist bordering Bắc Ải and blending seamlessly into U Lâm. Rumored refuge of Witches.
  - Hoang Vực (Kaldrak): Vast, wide desolate craggy wasteland spanning the lower-left beyond Bắc Ải. Territory of monsters; myths state Dragons (Cổ Long / Draconis Primus) lie at its far end.

(1.4) Economy & Currency: 1 Xu vàng (Gold) = 50 Xu bạc (Silver). 2 Silver = tavern meal; 15 Silver = iron sword; 1 Gold = commoner month's living; 5 Gold = war-trained horse.

(2) THÁNH ÂN & MONSTER TAXONOMY:
* Traditional magic does NOT exist. "Thánh Ân" is a rare anomalous biological faculty ("Ấn") awakened by exposure to Vaelor, with severe physiological costs (e.g., Ấn Mắt Quạ, Ấn Da Gấu). Do not explain Vaelor unless plot-relevant.
* Monsters: Biến Dị (Mutants), Thi Thể (Corpseborn), Ký Sinh (Parasites), Thực Thể Ảo (Specters - neurological/environmental, not ghosts), Dị Tượng (Phenomena), Cổ Sinh (Ancient Beasts).
* Dragons (Cổ Long / Draconis Primus): Strictly myth to living people; characters react with skepticism/mockery. Biological apex predators (45–60m, frost-condensing pressure drop "Breath of Death", NOT fire).

(3) WORLD ENGINE GUARDRAILS [HARD_LOCK]
* LORE PRIORITY: Use only what the current scene and causal chain require.
* BACKGROUND LORE RULE: Activate Outer Realms, monsters, Thánh Ân, and hidden lore only when causally relevant.
* CONSERVATIVE EXPANSION: Invent the smallest plausible addition necessary for the current scene; do not create unrequested factions or systems.`;

/**
 * Pixel-aligned territorial zones (khoanh vùng) for BOTH:
 * 1) Toàn cảnh Valeroth (scope: 'valeroth')
 * 2) Bên trong Bắc Ải (scope: 'norsvale')
 * Coordinate space: 1000 x 562.
 */
export const INITIAL_STORY_WORLD: StoryWorldState = {
  title: 'Valeroth',
  premise:
    'Vương Đô ngự tại trung tâm; góc trên phải là thành lò luyện trung cổ Hắc Nham tựa vào dãy núi; bên trái là cảng Lam Vịnh nhìn ra biển; dưới Lam Vịnh là pháo đài Bắc Ải tiếp giáp trực tiếp U Lâm, Cấm Địa và vùng Hoang Vực rộng lớn phía tây nam.',
  currentChapter: 1,
  activeMapScope: 'valeroth',
  playerLocationId: 'loc-nors-southgate',
  playerStatus:
    'Đang đứng trực trên tường đá gần Cổng Hoang Vực bên trong Bắc Ải, dõi mắt qua màn sương lạnh tràn về từ Hoang Vực và Cấm Địa.',
  loreDirectives: VALEROTH_LORE_CODEX,
  locations: [
    // =========================================================================
    // LAYER 1: TOÀN CẢNH VALEROTH (valeroth_map_v2_1795197882349.jpg)
    // =========================================================================
    {
      id: 'loc-valerius',
      scope: 'valeroth',
      name: 'Vương Đô',
      altName: 'Valerius',
      region: 'Trung tâm Vương quốc',
      ruler: 'Hoàng gia & Đại Giáo Đường',
      type: 'city',
      status: 'visited',
      x: 566,
      y: 238,
      zonePath:
        'M 416 206 L 478 134 L 614 148 L 718 206 L 718 294 L 622 342 L 496 342 L 414 294 Z',
      chapter: 1,
      summary:
        'Trung tâm quyền lực và nghi lễ với Hoàng Cung mái vòm dát vàng cùng những ngọn tháp uy nghi của Đại Giáo Đường.',
    },
    {
      id: 'loc-zarath',
      scope: 'valeroth',
      name: 'Hắc Nham',
      altName: 'Zarath',
      region: 'Đông Bắc · Chân núi khoáng thạch',
      ruler: 'Công tước Vayne Gillet',
      type: 'city',
      status: 'visited',
      x: 736,
      y: 120,
      zonePath:
        'M 514 114 L 584 24 L 912 24 L 948 158 L 832 214 L 718 206 L 614 148 L 516 144 Z',
      chapter: 1,
      summary:
        'Thành lũy luyện sắt và khai khoáng trung cổ tựa sát dãy núi đá phía bắc, nổi bật với các tháp lò nung đá đen, hầm mỏ gỗ và khói than đặc quánh.',
    },
    {
      id: 'loc-corinth',
      scope: 'valeroth',
      name: 'Lam Vịnh',
      altName: 'Corinth',
      region: 'Duyên hải phía Tây',
      ruler: 'Công tước Diocles Ingelrandus',
      type: 'port',
      status: 'unexplored',
      x: 318,
      y: 178,
      zonePath:
        'M 192 224 L 204 114 L 368 44 L 468 96 L 478 134 L 416 206 L 414 294 L 224 304 L 182 266 Z',
      chapter: 1,
      summary:
        'Đô thị thương cảng sầm uất trải dài bên trái Vương Đô, hướng thẳng ra Biển Tây với cầu gỗ và thương thuyền tấp nập.',
    },
    {
      id: 'loc-norsvale',
      scope: 'valeroth',
      name: 'Bắc Ải',
      altName: 'Norsvale',
      region: 'Pháo đài biên ải',
      ruler: 'Kaldor Oakhart',
      type: 'camp',
      status: 'current',
      x: 374,
      y: 360,
      zonePath:
        'M 266 312 L 414 294 L 482 340 L 476 416 L 382 430 L 264 398 Z',
      chapter: 1,
      summary:
        'Pháo đài đá xám lạnh giá do Kaldor Oakhart trấn giữ dưới Lam Vịnh, tiếp giáp trực tiếp với U Lâm, Cấm Địa và Hoang Vực.',
    },
    {
      id: 'loc-sylva',
      scope: 'valeroth',
      name: 'U Lâm',
      altName: 'Sylva',
      region: 'Dải rừng cổ thụ phía Đông',
      ruler: 'Công tước Artur Houtmann',
      type: 'landmark',
      status: 'unexplored',
      x: 866,
      y: 310,
      zonePath:
        'M 832 214 L 948 158 L 986 184 L 986 548 L 834 548 L 866 436 L 786 382 L 622 396 L 476 416 L 482 340 L 622 342 L 718 294 L 718 206 Z',
      chapter: 1,
      summary:
        'Dải rừng già rậm rạp trải dọc toàn bộ mạn phải, vươn tới giáp tường đông Bắc Ải và hòa liền ranh giới với Cấm Địa; nơi ẩn giấu lực lượng Ám vệ.',
    },
    {
      id: 'loc-morvath',
      scope: 'valeroth',
      name: 'Cấm Địa',
      altName: 'Morvath',
      region: 'Rừng sương độc · Giao hòa U Lâm',
      ruler: 'Tin đồn về Phù Thủy',
      type: 'mystery',
      status: 'locked',
      x: 668,
      y: 478,
      zonePath:
        'M 476 416 L 622 396 L 786 382 L 866 436 L 834 548 L 492 548 L 486 462 Z',
      softBlend: true,
      chapter: 1,
      summary:
        'Vùng cây cổ thụ chết khô chìm trong sương độc hòa lẫn dần vào rừng U Lâm, áp sát mạn đông nam Bắc Ải — nơi đồn đại là chốn ẩn náu của Phù Thủy.',
    },
    {
      id: 'loc-kaldrak',
      scope: 'valeroth',
      name: 'Hoang Vực',
      altName: 'Kaldrak',
      region: 'Ngoại vực Tây Nam rộng lớn',
      ruler: 'Vô chủ',
      type: 'ruins',
      status: 'locked',
      x: 205,
      y: 470,
      zonePath:
        'M 14 334 L 182 320 L 266 312 L 264 398 L 382 430 L 486 462 L 492 548 L 14 548 Z',
      chapter: 1,
      summary:
        'Vùng khe nứt đá vỡ hoang tàn trải rộng toàn bộ mạn tây nam dưới chân Bắc Ải, hang ổ của Biến Dị, Thi Thể và Cổ Sinh.',
    },

    // =========================================================================
    // LAYER 2: BÊN TRONG BẮC ẢI (norsvale_interior_1795197881444.jpg)
    // =========================================================================
    {
      id: 'loc-nors-keep',
      scope: 'norsvale',
      name: 'Tháp Oakhart',
      altName: 'Sảnh Chỉ Huy',
      region: 'Trung tâm Bắc Ải',
      ruler: 'Kaldor Oakhart',
      type: 'camp',
      status: 'visited',
      x: 548,
      y: 178,
      zonePath:
        'M 412 36 L 584 28 L 692 162 L 694 278 L 574 314 L 412 214 Z',
      chapter: 1,
      summary:
        'Tháp đá xám hai tầng lạnh lẽo là bản doanh của Kaldor Oakhart, nơi trải bàn sa bàn quân sự và tiếp nhận báo cáo tuần biên.',
    },
    {
      id: 'loc-nors-northgate',
      scope: 'norsvale',
      name: 'Cổng Bắc & Chợ Tiếp Vận',
      altName: 'Cổng Quan Lộ',
      region: 'Mạn Bắc thành nội',
      ruler: 'Đội quản kho biên ải',
      type: 'port',
      status: 'visited',
      x: 262,
      y: 126,
      zonePath:
        'M 164 32 L 412 42 L 412 204 L 294 210 L 114 198 L 116 112 Z',
      chapter: 1,
      summary:
        'Cửa ngõ đón đoàn xe ngựa chở lương thực, vải dày từ Lam Vịnh và quân nhu từ Vương Đô; tập trung vài sạp trao đổi thực dụng.',
    },
    {
      id: 'loc-nors-forge',
      scope: 'norsvale',
      name: 'Xưởng Rèn & Kho Quân Nhu',
      altName: 'Lò Thiết Nhẫn',
      region: 'Mạn Đông Bắc thành nội',
      ruler: 'Thợ rèn trưởng Bắc Ải',
      type: 'city',
      status: 'visited',
      x: 794,
      y: 186,
      zonePath:
        'M 656 122 L 732 48 L 932 108 L 946 276 L 848 296 L 694 278 L 692 162 Z',
      chapter: 1,
      summary:
        'Tiếng búa đập sắt vang nhịp cả ngày đêm; nơi nung than Hắc Nham, sửa giáp trầy xước và trữ mũi tên bọc thép chống quái vật.',
    },
    {
      id: 'loc-nors-barracks',
      scope: 'norsvale',
      name: 'Trại Lính & Sân Tập',
      altName: 'Doanh Trại Bùn Lầy',
      region: 'Mạn Tây thành nội',
      ruler: 'Đội trưởng tuần biên',
      type: 'camp',
      status: 'visited',
      x: 268,
      y: 274,
      zonePath:
        'M 94 196 L 294 210 L 412 204 L 494 316 L 444 344 L 314 316 L 106 346 L 84 264 Z',
      chapter: 1,
      summary:
        'Sân tập lầy lội bùn đất và mùi phân ngựa chiến, vây quanh bởi dãy doanh trại đá ẩm lạnh và chuồng ngựa tuần tra.',
    },
    {
      id: 'loc-nors-tavern',
      scope: 'norsvale',
      name: 'Quán Rượu Mũi Đao',
      altName: 'Quán Lính Đánh Thuê',
      region: 'Mạn Tây Nam thành nội',
      ruler: 'Chủ quán biên ải',
      type: 'landmark',
      status: 'visited',
      x: 302,
      y: 404,
      zonePath:
        'M 106 346 L 314 316 L 444 344 L 462 456 L 254 504 L 114 426 Z',
      chapter: 1,
      summary:
        'Quán rượu khói bếp mù mịt, ồn ã tiếng cười thô kệch của lính đánh thuê; một bữa ăn nóng và cốc bia ấm giá 2 Xu bạc.',
    },
    {
      id: 'loc-nors-apothecary',
      scope: 'norsvale',
      name: 'Trạm Y Dược & Luyện Kim',
      altName: 'Nhà Thuốc Biên Ải',
      region: 'Mạn Đông Nam thành nội',
      ruler: 'Học giả & Dược sư',
      type: 'mystery',
      status: 'unexplored',
      x: 786,
      y: 356,
      zonePath:
        'M 656 296 L 694 278 L 848 296 L 934 282 L 926 392 L 788 440 L 656 404 Z',
      chapter: 1,
      summary:
        'Ngôi nhà đá yên tĩnh gần tường đông nam chuyên băng bó thương binh, chưng cất thuốc giải sương độc và lưu mẫu xác quái vật.',
    },
    {
      id: 'loc-nors-southgate',
      scope: 'norsvale',
      name: 'Cổng Hoang Vực & Tường Nam',
      altName: 'Cửa Ải Tuyến Đầu',
      region: 'Tường Nam Bắc Ải',
      ruler: 'Đội trực chiến cổng nam',
      type: 'camp',
      status: 'current',
      x: 566,
      y: 462,
      zonePath:
        'M 444 344 L 574 314 L 656 336 L 672 414 L 702 518 L 486 550 L 456 462 Z',
      chapter: 1,
      summary:
        'Hai tháp canh đốt chậu lửa báo hiệu cùng cổng sắt nặng hướng thẳng ra khe đá Hoang Vực và sương độc Cấm Địa — chốt chặn sinh tử của Valeroth.',
    },
  ],
  routes: [
    // Valeroth Overworld Routes
    {
      id: 'route-valerius-corinth',
      scope: 'valeroth',
      fromId: 'loc-valerius',
      toId: 'loc-corinth',
      label: 'Đại lộ Tây Hải',
      type: 'road',
      status: 'open',
    },
    {
      id: 'route-valerius-zarath',
      scope: 'valeroth',
      fromId: 'loc-valerius',
      toId: 'loc-zarath',
      label: 'Quan lộ Lò Rèn',
      type: 'road',
      status: 'traversed',
    },
    {
      id: 'route-valerius-sylva',
      scope: 'valeroth',
      fromId: 'loc-valerius',
      toId: 'loc-sylva',
      label: 'Đường Đông Lĩnh',
      type: 'road',
      status: 'open',
    },
    {
      id: 'route-zarath-sylva',
      scope: 'valeroth',
      fromId: 'loc-zarath',
      toId: 'loc-sylva',
      label: 'Tuyến chân núi',
      type: 'road',
      status: 'open',
    },
    {
      id: 'route-corinth-norsvale',
      scope: 'valeroth',
      fromId: 'loc-corinth',
      toId: 'loc-norsvale',
      label: 'Đường tiếp vận duyên hải',
      type: 'road',
      status: 'traversed',
    },
    {
      id: 'route-norsvale-valerius',
      scope: 'valeroth',
      fromId: 'loc-norsvale',
      toId: 'loc-valerius',
      label: 'Quân lộ Bắc Ải',
      type: 'road',
      status: 'open',
    },
    {
      id: 'route-norsvale-sylva',
      scope: 'valeroth',
      fromId: 'loc-norsvale',
      toId: 'loc-sylva',
      label: 'Rìa rừng U Lâm',
      type: 'secret',
      status: 'open',
    },
    {
      id: 'route-norsvale-morvath',
      scope: 'valeroth',
      fromId: 'loc-norsvale',
      toId: 'loc-morvath',
      label: 'Rìa sương độc',
      type: 'secret',
      status: 'blocked',
    },
    {
      id: 'route-norsvale-kaldrak',
      scope: 'valeroth',
      fromId: 'loc-norsvale',
      toId: 'loc-kaldrak',
      label: 'Cửa ải Hoang Vực',
      type: 'portal',
      status: 'blocked',
    },
    {
      id: 'route-sylva-morvath',
      scope: 'valeroth',
      fromId: 'loc-sylva',
      toId: 'loc-morvath',
      label: 'Vùng giao hòa sương rừng',
      type: 'secret',
      status: 'open',
    },

    // Norsvale Interior Routes
    {
      id: 'route-nors-north-keep',
      scope: 'norsvale',
      fromId: 'loc-nors-northgate',
      toId: 'loc-nors-keep',
      label: 'Trục đá Cổng Bắc',
      type: 'road',
      status: 'traversed',
    },
    {
      id: 'route-nors-north-barracks',
      scope: 'norsvale',
      fromId: 'loc-nors-northgate',
      toId: 'loc-nors-barracks',
      label: 'Lối chuồng ngựa',
      type: 'road',
      status: 'open',
    },
    {
      id: 'route-nors-keep-forge',
      scope: 'norsvale',
      fromId: 'loc-nors-keep',
      toId: 'loc-nors-forge',
      label: 'Đường kho quân nhu',
      type: 'road',
      status: 'open',
    },
    {
      id: 'route-nors-keep-south',
      scope: 'norsvale',
      fromId: 'loc-nors-keep',
      toId: 'loc-nors-southgate',
      label: 'Đại lộ Trực Chiến',
      type: 'road',
      status: 'traversed',
    },
    {
      id: 'route-nors-barracks-tavern',
      scope: 'norsvale',
      fromId: 'loc-nors-barracks',
      toId: 'loc-nors-tavern',
      label: 'Ngõ bùn Quán Rượu',
      type: 'road',
      status: 'open',
    },
    {
      id: 'route-nors-tavern-south',
      scope: 'norsvale',
      fromId: 'loc-nors-tavern',
      toId: 'loc-nors-southgate',
      label: 'Chân tường Tây Nam',
      type: 'road',
      status: 'open',
    },
    {
      id: 'route-nors-forge-apothecary',
      scope: 'norsvale',
      fromId: 'loc-nors-forge',
      toId: 'loc-nors-apothecary',
      label: 'Lối tường Đông',
      type: 'road',
      status: 'open',
    },
    {
      id: 'route-nors-apothecary-south',
      scope: 'norsvale',
      fromId: 'loc-nors-apothecary',
      toId: 'loc-nors-southgate',
      label: 'Lối chuyển thương binh',
      type: 'road',
      status: 'open',
    },
  ],
  characters: [
    {
      id: 'char-player',
      name: 'Bạn',
      role: 'Người chơi · Nhân vật chính',
      locationId: 'loc-nors-southgate',
      status: 'Đang trực gác tại Cổng Hoang Vực bên trong Bắc Ải',
      isParty: true,
      isPlayer: true,
    },
    {
      id: 'char-kaldor',
      name: 'Kaldor Oakhart',
      role: 'Thống lĩnh Bắc Ải',
      locationId: 'loc-nors-keep',
      status: 'Đang xem bản đồ tuần biên tại Tháp Oakhart',
      isParty: false,
    },
    {
      id: 'char-vayne',
      name: 'Vayne Gillet',
      role: 'Công tước Hắc Nham',
      locationId: 'loc-zarath',
      status: 'Giám sát các lò luyện sắt dưới chân núi',
      isParty: false,
    },
    {
      id: 'char-artur',
      name: 'Artur Houtmann',
      role: 'Công tước U Lâm',
      locationId: 'loc-sylva',
      status: 'Điều phối Ám vệ dọc dải rừng phía đông',
      isParty: false,
    },
    {
      id: 'char-diocles',
      name: 'Diocles Ingelrandus',
      role: 'Công tước Lam Vịnh',
      locationId: 'loc-corinth',
      status: 'Kiểm soát bến cảng phía tây',
      isParty: false,
    },
  ],
  events: [
    {
      id: 'evt-valeroth-1',
      chapter: 1,
      title: 'Phiên gác mùa sương tại Cổng Hoang Vực',
      description:
        'Sương lạnh từ Cấm Địa và Hoang Vực tràn sát chân tường đá Bắc Ải; đoàn xe tiếp vận từ Hắc Nham vừa qua Cổng Bắc.',
      locationId: 'loc-nors-southgate',
      timestampLabel: 'Chương 1 · Bắc Ải',
    },
  ],
};

export function getLocationScope(loc: StoryLocation): MapScope {
  return loc.scope ?? 'valeroth';
}

export function getRouteScope(route: StoryRoute, locations: StoryLocation[]): MapScope {
  if (route.scope) return route.scope;
  const fromLoc = locations.find((l) => l.id === route.fromId);
  return fromLoc ? getLocationScope(fromLoc) : 'valeroth';
}

export interface ResolvedPlayerPosition {
  exactLocation: StoryLocation | null;
  displayLocationForScope: (scope: MapScope) => StoryLocation | null;
  overworldLocation: StoryLocation | null;
  interiorLocation: StoryLocation | null;
  recommendedScope: MapScope;
  status: string;
  nearbyLocations: StoryLocation[];
}

export function resolvePlayerPosition(world: StoryWorldState): ResolvedPlayerPosition {
  const playerChar = world.characters.find((c) => c.isPlayer) ?? world.characters.find((c) => c.isParty);
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
      // If standing at Bắc Ải on overworld, reflect entry gate when user zooms into Bắc Ải interior
      interiorLocation = exactLocation.id === 'loc-norsvale' ? norsvaleEntryGate : null;
      recommendedScope = 'valeroth';
    }
  }

  const nearbyIds = new Set<string>();
  if (exactLocation) {
    for (const r of world.routes) {
      if (r.fromId === exactLocation.id) nearbyIds.add(r.toId);
      if (r.toId === exactLocation.id) nearbyIds.add(r.fromId);
    }
  }
  const nearbyLocations = world.locations.filter((l) => nearbyIds.has(l.id));

  const status =
    world.playerStatus ||
    playerChar?.status ||
    (exactLocation ? `Đang có mặt tại ${exactLocation.name}.` : 'Chưa xác định vị trí.');

  return {
    exactLocation,
    overworldLocation,
    interiorLocation,
    recommendedScope,
    status,
    nearbyLocations,
    displayLocationForScope: (scope: MapScope) =>
      scope === 'norsvale' ? interiorLocation : overworldLocation,
  };
}

export interface ToolDeclarationParamSchema {
  type: 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object';
  description: string;
  enum?: readonly string[];
}

export interface StoryToolDeclarationJson {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, ToolDeclarationParamSchema>;
    required?: readonly string[];
  };
}

export const STORY_TOOL_DECLARATIONS_JSON: readonly StoryToolDeclarationJson[] = [
  {
    name: 'set_player_location',
    description:
      'Cập nhật vị trí đứng hiện tại của người chơi ("Bạn" / user) theo diễn biến truyện — hỗ trợ cả 7 vùng Toàn cảnh Valeroth lẫn 7 khu vực Bên trong Bắc Ải, tự động chuyển lớp bản đồ phù hợp và đánh dấu tuyến đã đi.',
    parameters: {
      type: 'object',
      properties: {
        targetLocationName: {
          type: 'string',
          description:
            'Tên địa điểm người chơi đang đứng (Toàn cảnh: Vương Đô, Hắc Nham, Lam Vịnh, Bắc Ải, U Lâm, Cấm Địa, Hoang Vực; hoặc Bên trong Bắc Ải: Tháp Oakhart, Cổng Bắc & Chợ Tiếp Vận, Xưởng Rèn & Kho Quân Nhu, Trại Lính & Sân Tập, Quán Rượu Mũi Đao, Trạm Y Dược & Luyện Kim, Cổng Hoang Vực & Tường Nam).',
        },
        status: {
          type: 'string',
          description: 'Mô tả ngắn trạng thái/hành động hiện tại của người chơi tại địa điểm này.',
        },
        markRouteTraversed: {
          type: 'boolean',
          description: 'True để đánh dấu tuyến đường vừa đi qua.',
        },
      },
      required: ['targetLocationName'],
    },
  },
  {
    name: 'show_player_map',
    description:
      'Gọi khi người chơi gõ lệnh /map hoặc hỏi mình đang đứng ở đâu: trả về vị trí đứng hiện tại theo diễn biến, các khu vực lân cận và hiển thị dấu location lên bản đồ.',
    parameters: {
      type: 'object',
      properties: {
        preferredView: {
          type: 'string',
          enum: ['valeroth', 'norsvale'],
          description:
            'Tùy chọn lớp bản đồ muốn xem: "valeroth" (Toàn cảnh Valeroth) hoặc "norsvale" (Bên trong Bắc Ải). Để trống để tự động theo vị trí hiện tại.',
        },
      },
    },
  },
  {
    name: 'switch_map_view',
    description:
      'Chuyển chế độ hiển thị giữa toàn cảnh Vương Quốc Valeroth ("valeroth") và sơ đồ bên trong pháo đài Bắc Ải ("norsvale").',
    parameters: {
      type: 'object',
      properties: {
        scope: {
          type: 'string',
          enum: ['valeroth', 'norsvale'],
          description: '"valeroth" (Toàn cảnh Valeroth) hoặc "norsvale" (Bên trong Bắc Ải).',
        },
      },
      required: ['scope'],
    },
  },
  {
    name: 'move_character',
    description:
      'Di chuyển một nhân vật (hoặc người chơi nếu characterName là "Bạn", "Tôi", "nhóm chính", "party") sang địa điểm khác trên bản đồ Valeroth hoặc bên trong Bắc Ải.',
    parameters: {
      type: 'object',
      properties: {
        characterName: {
          type: 'string',
          description: 'Tên nhân vật cần di chuyển (vd: "Bạn", "Kaldor Oakhart", "Vayne Gillet").',
        },
        targetLocationName: {
          type: 'string',
          description: 'Tên tiếng Việt hoặc Valerothian của địa điểm đích.',
        },
        newStatus: {
          type: 'string',
          description: 'Trạng thái hành động ngắn gọn sau khi tới nơi (tùy chọn).',
        },
        markRouteTraversed: {
          type: 'boolean',
          description: 'True để đánh dấu tuyến đường nối giữa điểm cũ và điểm mới là đã đi qua.',
        },
      },
      required: ['characterName', 'targetLocationName'],
    },
  },
  {
    name: 'add_location',
    description:
      'Thêm địa điểm mới vào bản đồ (chỉ dùng khi cảnh truyện thực sự đòi hỏi điểm nhỏ phát sinh theo quy tắc CONSERVATIVE EXPANSION).',
    parameters: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Tên địa điểm mới.' },
        altName: { type: 'string', description: 'Tên phụ hoặc tên Valerothian (tùy chọn).' },
        scope: {
          type: 'string',
          enum: ['valeroth', 'norsvale'],
          description: 'Lớp bản đồ: "valeroth" hoặc "norsvale" (mặc định theo lớp hiện tại).',
        },
        region: { type: 'string', description: 'Tên vùng trực thuộc.' },
        type: {
          type: 'string',
          enum: ['city', 'port', 'landmark', 'ruins', 'camp', 'mystery'],
          description: 'Loại địa điểm.',
        },
        status: {
          type: 'string',
          enum: ['visited', 'current', 'unexplored', 'locked'],
          description: 'Trạng thái địa điểm.',
        },
        x: { type: 'number', description: 'Tọa độ X (60..940).' },
        y: { type: 'number', description: 'Tọa độ Y (60..515).' },
        chapter: { type: 'number', description: 'Số chương xuất hiện.' },
        summary: { type: 'string', description: 'Mô tả ngắn gọn theo lore Valeroth.' },
        connectFromLocationName: {
          type: 'string',
          description: 'Tên địa điểm gốc để nối tuyến đường tới điểm mới (tùy chọn).',
        },
        routeType: {
          type: 'string',
          enum: ['road', 'sea', 'secret', 'portal'],
          description: 'Loại tuyến đường.',
        },
      },
      required: ['name', 'region', 'type', 'summary'],
    },
  },
  {
    name: 'connect_locations',
    description: 'Tạo hoặc cập nhật tuyến đường giữa hai địa điểm cùng lớp bản đồ.',
    parameters: {
      type: 'object',
      properties: {
        fromLocationName: { type: 'string', description: 'Tên địa điểm xuất phát.' },
        toLocationName: { type: 'string', description: 'Tên địa điểm đích.' },
        label: { type: 'string', description: 'Tên tuyến hành trình.' },
        type: {
          type: 'string',
          enum: ['road', 'sea', 'secret', 'portal'],
          description: 'Loại tuyến đường.',
        },
        status: {
          type: 'string',
          enum: ['open', 'traversed', 'blocked'],
          description: 'Trạng thái tuyến đường.',
        },
      },
      required: ['fromLocationName', 'toLocationName'],
    },
  },
  {
    name: 'update_location_status',
    description: 'Cập nhật trạng thái hoặc ghi chú mới của một địa điểm.',
    parameters: {
      type: 'object',
      properties: {
        locationName: { type: 'string', description: 'Tên hoặc ID địa điểm.' },
        status: {
          type: 'string',
          enum: ['visited', 'current', 'unexplored', 'locked'],
          description: 'Trạng thái mới của địa điểm.',
        },
        summary: { type: 'string', description: 'Ghi chú diễn biến mới (tùy chọn).' },
      },
      required: ['locationName'],
    },
  },
  {
    name: 'get_map_snapshot',
    description:
      'Đọc lại vị trí đứng hiện tại của người chơi, danh sách địa điểm, tuyến đường và nhân vật trên cả hai lớp bản đồ.',
    parameters: {
      type: 'object',
      properties: {
        scope: {
          type: 'string',
          enum: ['valeroth', 'norsvale'],
          description: 'Lọc theo lớp bản đồ: "valeroth" hoặc "norsvale" (tùy chọn).',
        },
      },
    },
  },
];

function normalizeText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');
}

/**
 * 3-pass prioritized location lookup so specific sub-names like
 * "Cổng Hoang Vực" always resolve to "Cổng Hoang Vực & Tường Nam"
 * instead of matching "Hoang Vực" early.
 */
function findLocation(locations: StoryLocation[], query: string): StoryLocation | undefined {
  const target = normalizeText(query);
  if (!target) return undefined;

  // Pass 1: Exact ID, name, or altName match
  const exact = locations.find(
    (l) =>
      l.id === query ||
      normalizeText(l.name) === target ||
      (l.altName && normalizeText(l.altName) === target)
  );
  if (exact) return exact;

  // Pass 2: Location name / altName contains the query (e.g. "Cổng Hoang Vực" -> "Cổng Hoang Vực & Tường Nam")
  const containedInName = locations.find(
    (l) =>
      normalizeText(l.name).includes(target) ||
      (l.altName ? normalizeText(l.altName).includes(target) : false)
  );
  if (containedInName) return containedInName;

  // Pass 3: Query contains the location name / altName (prefer longest matching name)
  const reverseMatches = locations
    .map((l) => {
      const nName = normalizeText(l.name);
      const nAlt = l.altName ? normalizeText(l.altName) : '';
      const score = Math.max(
        nName && target.includes(nName) ? nName.length : 0,
        nAlt && target.includes(nAlt) ? nAlt.length : 0
      );
      return { loc: l, score };
    })
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score);

  return reverseMatches[0]?.loc;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function sanitizeLocationType(input: unknown): LocationType {
  const valid: LocationType[] = ['city', 'port', 'landmark', 'ruins', 'camp', 'mystery'];
  return typeof input === 'string' && valid.includes(input as LocationType)
    ? (input as LocationType)
    : 'landmark';
}

function sanitizeLocationStatus(input: unknown): LocationStatus {
  const valid: LocationStatus[] = ['visited', 'current', 'unexplored', 'locked'];
  return typeof input === 'string' && valid.includes(input as LocationStatus)
    ? (input as LocationStatus)
    : 'unexplored';
}

function sanitizeRouteType(input: unknown): RouteType {
  const valid: RouteType[] = ['road', 'sea', 'secret', 'portal'];
  return typeof input === 'string' && valid.includes(input as RouteType)
    ? (input as RouteType)
    : 'road';
}

function sanitizeRouteStatus(input: unknown): RouteStatus {
  const valid: RouteStatus[] = ['open', 'traversed', 'blocked'];
  return typeof input === 'string' && valid.includes(input as RouteStatus)
    ? (input as RouteStatus)
    : 'open';
}

function sanitizeMapScope(input: unknown, fallback: MapScope = 'valeroth'): MapScope {
  if (typeof input !== 'string') return fallback;
  const norm = normalizeText(input);
  if (norm.includes('norsvale') || norm.includes('bac ai') || norm.includes('ben trong')) {
    return 'norsvale';
  }
  if (norm.includes('valeroth') || norm.includes('toan canh') || norm.includes('vuong quoc')) {
    return 'valeroth';
  }
  return fallback;
}

function makeId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

function markScopeCurrentLocation(locations: StoryLocation[], targetId: string) {
  const target = locations.find((l) => l.id === targetId);
  if (!target) return;
  const scope = getLocationScope(target);
  for (const l of locations) {
    if (getLocationScope(l) === scope && l.status === 'current' && l.id !== target.id) {
      l.status = 'visited';
    }
  }
  target.status = 'current';
}

export interface ToolExecutionOutcome {
  updatedWorld: StoryWorldState;
  result: Record<string, unknown>;
  summary: string;
  affectedLocationIds: string[];
  switchScope?: MapScope;
  showPlayerMap?: boolean;
}

export function executeStoryToolCall(
  world: StoryWorldState,
  name: string,
  args: Record<string, unknown> = {}
): ToolExecutionOutcome {
  const next: StoryWorldState = {
    ...world,
    locations: world.locations.map((l) => ({ ...l })),
    routes: world.routes.map((r) => ({ ...r })),
    characters: world.characters.map((c) => ({ ...c })),
    events: world.events.map((e) => ({ ...e })),
  };

  if (name === 'switch_map_view') {
    const scope = sanitizeMapScope(args.scope, next.activeMapScope ?? 'valeroth');
    next.activeMapScope = scope;
    return {
      updatedWorld: next,
      result: { ok: true, activeMapScope: scope, label: MAP_SCOPE_LABELS[scope] },
      summary: `Chuyển bản đồ → ${MAP_SCOPE_LABELS[scope]}`,
      affectedLocationIds: [],
      switchScope: scope,
    };
  }

  if (name === 'show_player_map') {
    const pos = resolvePlayerPosition(next);
    const preferredScope =
      typeof args.preferredView === 'string' && args.preferredView.trim()
        ? sanitizeMapScope(args.preferredView, pos.recommendedScope)
        : pos.recommendedScope;

    next.activeMapScope = preferredScope;
    const focusLoc = pos.displayLocationForScope(preferredScope) ?? pos.exactLocation;

    return {
      updatedWorld: next,
      result: {
        ok: true,
        activeMapScope: preferredScope,
        playerLocation: pos.exactLocation
          ? {
              id: pos.exactLocation.id,
              name: pos.exactLocation.name,
              altName: pos.exactLocation.altName,
              scope: getLocationScope(pos.exactLocation),
              region: pos.exactLocation.region,
            }
          : null,
        overworldRegion: pos.overworldLocation?.name ?? null,
        playerStatus: pos.status,
        nearbyLocations: pos.nearbyLocations.map((l) => l.name),
      },
      summary: pos.exactLocation
        ? `/map · Vị trí hiện tại: ${pos.exactLocation.name}`
        : '/map · Hiển thị vị trí hiện tại',
      affectedLocationIds: focusLoc ? [focusLoc.id] : [],
      switchScope: preferredScope,
      showPlayerMap: true,
    };
  }

  if (name === 'set_player_location') {
    const targetQuery = String(args.targetLocationName ?? '').trim();
    const targetLoc = findLocation(next.locations, targetQuery);

    if (!targetLoc) {
      return {
        updatedWorld: next,
        result: {
          ok: false,
          error: `Không tìm thấy địa điểm "${targetQuery}". Danh sách hợp lệ: ${next.locations
            .map((l) => l.name)
            .join(', ')}.`,
        },
        summary: `Không tìm thấy "${targetQuery}"`,
        affectedLocationIds: [],
      };
    }

    const prevLocId = next.playerLocationId;
    const targetScope = getLocationScope(targetLoc);

    next.playerLocationId = targetLoc.id;
    next.activeMapScope = targetScope;

    const statusText =
      typeof args.status === 'string' && args.status.trim()
        ? args.status.trim()
        : `Đang có mặt tại ${targetLoc.name}.`;
    next.playerStatus = statusText;

    const playerChar = next.characters.find((c) => c.isPlayer);
    if (playerChar) {
      playerChar.locationId = targetLoc.id;
      playerChar.status = statusText;
    } else {
      next.characters.unshift({
        id: 'char-player',
        name: 'Bạn',
        role: 'Người chơi · Nhân vật chính',
        locationId: targetLoc.id,
        status: statusText,
        isParty: true,
        isPlayer: true,
      });
    }

    markScopeCurrentLocation(next.locations, targetLoc.id);
    if (targetScope === 'norsvale') {
      markScopeCurrentLocation(next.locations, 'loc-norsvale');
    }

    const markRoute = args.markRouteTraversed !== false;
    if (markRoute && prevLocId && prevLocId !== targetLoc.id) {
      const prevLoc = next.locations.find((l) => l.id === prevLocId);
      if (prevLoc && getLocationScope(prevLoc) === targetScope) {
        const route = next.routes.find(
          (r) =>
            (r.fromId === prevLocId && r.toId === targetLoc.id) ||
            (r.fromId === targetLoc.id && r.toId === prevLocId)
        );
        if (route) {
          route.status = 'traversed';
        } else {
          next.routes.push({
            id: makeId('route'),
            scope: targetScope,
            fromId: prevLocId,
            toId: targetLoc.id,
            label: `Lối đi tới ${targetLoc.name}`,
            type: 'road',
            status: 'traversed',
          });
        }
      }
    }

    return {
      updatedWorld: next,
      result: {
        ok: true,
        playerLocation: {
          id: targetLoc.id,
          name: targetLoc.name,
          scope: targetScope,
          region: targetLoc.region,
        },
        playerStatus: statusText,
        activeMapScope: targetScope,
      },
      summary: `Vị trí của bạn → ${targetLoc.name}`,
      affectedLocationIds: prevLocId ? [prevLocId, targetLoc.id] : [targetLoc.id],
      switchScope: targetScope,
    };
  }

  if (name === 'get_map_snapshot') {
    const scopeFilter =
      typeof args.scope === 'string' && args.scope.trim()
        ? sanitizeMapScope(args.scope, next.activeMapScope ?? 'valeroth')
        : null;
    const filteredLocations = scopeFilter
      ? next.locations.filter((l) => getLocationScope(l) === scopeFilter)
      : next.locations;
    const pos = resolvePlayerPosition(next);

    return {
      updatedWorld: next,
      result: {
        ok: true,
        title: next.title,
        activeMapScope: next.activeMapScope ?? 'valeroth',
        playerPosition: pos.exactLocation
          ? {
              location: pos.exactLocation.name,
              scope: getLocationScope(pos.exactLocation),
              overworldRegion: pos.overworldLocation?.name ?? null,
              status: pos.status,
              nearby: pos.nearbyLocations.map((l) => l.name),
            }
          : null,
        locations: filteredLocations.map((l) => ({
          id: l.id,
          name: l.name,
          altName: l.altName,
          scope: getLocationScope(l),
          region: l.region,
          ruler: l.ruler,
          status: l.status,
        })),
        characters: next.characters.map((c) => ({
          name: c.name,
          role: c.role,
          location: next.locations.find((l) => l.id === c.locationId)?.name ?? c.locationId,
          status: c.status,
        })),
      },
      summary: scopeFilter
        ? `Đọc bản đồ ${MAP_SCOPE_LABELS[scopeFilter]}`
        : 'Đọc trạng thái bản đồ Valeroth & Bắc Ải',
      affectedLocationIds: [],
    };
  }

  if (name === 'add_location') {
    const locName = String(args.name ?? '').trim();
    if (!locName) {
      return {
        updatedWorld: next,
        result: { ok: false, error: 'Thiếu tên địa điểm (name).' },
        summary: 'Không thể tạo địa điểm: thiếu tên',
        affectedLocationIds: [],
      };
    }

    const existing = findLocation(next.locations, locName);
    if (existing) {
      if (typeof args.summary === 'string' && args.summary.trim()) {
        existing.summary = args.summary.trim();
      }
      if (args.status) {
        existing.status = sanitizeLocationStatus(args.status);
      }
      return {
        updatedWorld: next,
        result: { ok: true, action: 'updated_existing', location: existing },
        summary: `Cập nhật địa điểm: ${existing.name}`,
        affectedLocationIds: [existing.id],
      };
    }

    const scope = sanitizeMapScope(args.scope, next.activeMapScope ?? 'valeroth');
    const rawX = typeof args.x === 'number' ? args.x : 260 + ((next.locations.length * 137) % 580);
    const rawY = typeof args.y === 'number' ? args.y : 140 + ((next.locations.length * 97) % 320);

    const newLoc: StoryLocation = {
      id: makeId('loc'),
      scope,
      name: locName,
      altName: typeof args.altName === 'string' && args.altName.trim() ? args.altName.trim() : undefined,
      region:
        typeof args.region === 'string' && args.region.trim()
          ? args.region.trim()
          : scope === 'norsvale'
          ? 'Bên trong Bắc Ải'
          : 'Valeroth',
      type: sanitizeLocationType(args.type),
      status: sanitizeLocationStatus(args.status),
      x: clamp(rawX, 55, MAP_WIDTH - 55),
      y: clamp(rawY, 55, MAP_HEIGHT - 55),
      chapter: typeof args.chapter === 'number' ? Math.max(1, Math.round(args.chapter)) : next.currentChapter,
      summary: typeof args.summary === 'string' && args.summary.trim() ? args.summary.trim() : 'Địa điểm mới được phát hiện.',
    };

    next.locations.push(newLoc);
    if (newLoc.status === 'current') {
      markScopeCurrentLocation(next.locations, newLoc.id);
    }

    const affected = [newLoc.id];
    let autoConnectedRoute: StoryRoute | null = null;
    if (typeof args.connectFromLocationName === 'string' && args.connectFromLocationName.trim()) {
      const origin = findLocation(next.locations, args.connectFromLocationName);
      if (origin && origin.id !== newLoc.id && getLocationScope(origin) === scope) {
        autoConnectedRoute = {
          id: makeId('route'),
          scope,
          fromId: origin.id,
          toId: newLoc.id,
          label: `Đường tới ${newLoc.name}`,
          type: sanitizeRouteType(args.routeType),
          status: 'open',
        };
        next.routes.push(autoConnectedRoute);
        affected.push(origin.id);
      }
    }

    return {
      updatedWorld: next,
      result: { ok: true, location: newLoc, connectedRoute: autoConnectedRoute },
      summary: `Thêm địa điểm "${newLoc.name}"`,
      affectedLocationIds: affected,
      switchScope: scope,
    };
  }

  if (name === 'connect_locations') {
    const fromQuery = String(args.fromLocationName ?? '');
    const toQuery = String(args.toLocationName ?? '');
    const fromLoc = findLocation(next.locations, fromQuery);
    const toLoc = findLocation(next.locations, toQuery);

    if (!fromLoc || !toLoc) {
      return {
        updatedWorld: next,
        result: {
          ok: false,
          error: `Không tìm thấy địa điểm (${!fromLoc ? fromQuery : toQuery}).`,
        },
        summary: `Không thể nối tuyến: thiếu địa điểm`,
        affectedLocationIds: [],
      };
    }

    if (getLocationScope(fromLoc) !== getLocationScope(toLoc)) {
      return {
        updatedWorld: next,
        result: {
          ok: false,
          error: `Hai địa điểm "${fromLoc.name}" và "${toLoc.name}" nằm ở hai lớp bản đồ khác nhau.`,
        },
        summary: `Không thể nối tuyến khác lớp bản đồ`,
        affectedLocationIds: [],
      };
    }

    const existingRoute = next.routes.find(
      (r) =>
        (r.fromId === fromLoc.id && r.toId === toLoc.id) ||
        (r.fromId === toLoc.id && r.toId === fromLoc.id)
    );

    if (existingRoute) {
      if (typeof args.label === 'string' && args.label.trim()) existingRoute.label = args.label.trim();
      if (args.type) existingRoute.type = sanitizeRouteType(args.type);
      if (args.status) existingRoute.status = sanitizeRouteStatus(args.status);

      return {
        updatedWorld: next,
        result: { ok: true, action: 'updated', route: existingRoute },
        summary: `Cập nhật tuyến ${fromLoc.name} → ${toLoc.name}`,
        affectedLocationIds: [fromLoc.id, toLoc.id],
      };
    }

    const routeScope = getLocationScope(fromLoc);
    const newRoute: StoryRoute = {
      id: makeId('route'),
      scope: routeScope,
      fromId: fromLoc.id,
      toId: toLoc.id,
      label:
        typeof args.label === 'string' && args.label.trim()
          ? args.label.trim()
          : `${fromLoc.name} – ${toLoc.name}`,
      type: sanitizeRouteType(args.type),
      status: sanitizeRouteStatus(args.status),
    };
    next.routes.push(newRoute);

    return {
      updatedWorld: next,
      result: { ok: true, action: 'created', route: newRoute },
      summary: `Nối tuyến: ${fromLoc.name} → ${toLoc.name}`,
      affectedLocationIds: [fromLoc.id, toLoc.id],
      switchScope: routeScope,
    };
  }

  if (name === 'move_character') {
    const charQuery = String(args.characterName ?? '').trim();
    const targetQuery = String(args.targetLocationName ?? '').trim();
    const targetLoc = findLocation(next.locations, targetQuery);

    if (!targetLoc) {
      return {
        updatedWorld: next,
        result: { ok: false, error: `Không tìm thấy địa điểm "${targetQuery}".` },
        summary: `Di chuyển thất bại: không thấy "${targetQuery}"`,
        affectedLocationIds: [],
      };
    }

    const normChar = normalizeText(charQuery);
    const isPlayerAlias =
      normChar === 'ban' ||
      normChar === 'toi' ||
      normChar === 'user' ||
      normChar === 'player' ||
      normChar.includes('nguoi choi') ||
      normChar.includes('nhan vat chinh') ||
      normChar === 'party' ||
      normChar.includes('nhom');

    if (isPlayerAlias) {
      return executeStoryToolCall(next, 'set_player_location', {
        targetLocationName: targetLoc.name,
        status: args.newStatus,
        markRouteTraversed: args.markRouteTraversed,
      });
    }

    const matchedChars = next.characters.filter(
      (c) =>
        normalizeText(c.name) === normChar ||
        normalizeText(c.name).includes(normChar) ||
        normChar.includes(normalizeText(c.name))
    );

    if (matchedChars.length === 0) {
      return {
        updatedWorld: next,
        result: {
          ok: false,
          error: `Không tìm thấy nhân vật "${charQuery}". Danh sách: ${next.characters
            .map((c) => c.name)
            .join(', ')}.`,
        },
        summary: `Không tìm thấy nhân vật "${charQuery}"`,
        affectedLocationIds: [],
      };
    }

    const prevLocationIds = new Set<string>();
    const markRoute = args.markRouteTraversed !== false;
    const targetScope = getLocationScope(targetLoc);

    for (const ch of matchedChars) {
      prevLocationIds.add(ch.locationId);
      ch.locationId = targetLoc.id;
      if (typeof args.newStatus === 'string' && args.newStatus.trim()) {
        ch.status = args.newStatus.trim();
      }
      if (ch.isPlayer) {
        next.playerLocationId = targetLoc.id;
        next.playerStatus = ch.status;
        next.activeMapScope = targetScope;
        markScopeCurrentLocation(next.locations, targetLoc.id);
      }
    }

    if (targetLoc.status === 'unexplored') {
      targetLoc.status = 'visited';
    }

    if (markRoute) {
      for (const prevId of prevLocationIds) {
        if (prevId === targetLoc.id) continue;
        const prevLoc = next.locations.find((l) => l.id === prevId);
        if (!prevLoc || getLocationScope(prevLoc) !== targetScope) continue;

        const route = next.routes.find(
          (r) =>
            (r.fromId === prevId && r.toId === targetLoc.id) ||
            (r.fromId === targetLoc.id && r.toId === prevId)
        );
        if (route) {
          route.status = 'traversed';
        } else {
          next.routes.push({
            id: makeId('route'),
            scope: targetScope,
            fromId: prevId,
            toId: targetLoc.id,
            label: `Hành quân tới ${targetLoc.name}`,
            type: 'road',
            status: 'traversed',
          });
        }
      }
    }

    const movedNames = matchedChars.map((c) => c.name).join(', ');
    return {
      updatedWorld: next,
      result: {
        ok: true,
        movedCharacters: matchedChars.map((c) => ({ name: c.name, location: targetLoc.name, status: c.status })),
        destination: { id: targetLoc.id, name: targetLoc.name, scope: targetScope },
      },
      summary: `Di chuyển ${movedNames} → ${targetLoc.name}`,
      affectedLocationIds: [...Array.from(prevLocationIds), targetLoc.id],
      switchScope: targetScope,
    };
  }

  if (name === 'update_location_status') {
    const locQuery = String(args.locationName ?? '');
    const loc = findLocation(next.locations, locQuery);
    if (!loc) {
      return {
        updatedWorld: next,
        result: { ok: false, error: `Không tìm thấy địa điểm "${locQuery}".` },
        summary: `Không tìm thấy "${locQuery}"`,
        affectedLocationIds: [],
      };
    }

    if (args.status) {
      const sanitized = sanitizeLocationStatus(args.status);
      if (sanitized === 'current') {
        markScopeCurrentLocation(next.locations, loc.id);
      } else {
        loc.status = sanitized;
      }
    }
    if (typeof args.summary === 'string' && args.summary.trim()) {
      loc.summary = args.summary.trim();
    }

    return {
      updatedWorld: next,
      result: { ok: true, location: loc },
      summary: `Cập nhật "${loc.name}" → ${LOCATION_STATUS_LABELS[loc.status]}`,
      affectedLocationIds: [loc.id],
      switchScope: getLocationScope(loc),
    };
  }

  return {
    updatedWorld: next,
    result: { ok: false, error: `Hàm "${name}" chưa được hỗ trợ.` },
    summary: `Hàm không hợp lệ: ${name}`,
    affectedLocationIds: [],
  };
}

export interface AppliedQueryParamsResult {
  world: StoryWorldState;
  scope: MapScope;
  autoOpenMap: boolean;
  focusLocationId: string | null;
}

/**
 * Applies URL query parameters (e.g. ?loc=loc-nors-tavern&from=loc-nors-southgate&view=norsvale&status=...&map=1)
 * so links generated by Gemini inside Google AI Studio Playground open the exact map layer
 * with the crimson Location Pin planted right on the player's current position.
 */
export function applyMapQueryParams(
  baseWorld: StoryWorldState,
  search: string
): AppliedQueryParamsResult | null {
  if (!search || search.length <= 1) return null;
  const params = new URLSearchParams(search);
  const locParam = params.get('loc') || params.get('location') || params.get('pos');
  const viewParam = params.get('view') || params.get('scope');
  const fromParam = params.get('from');
  const statusParam = params.get('status');
  const mapParam = params.get('map');

  if (!locParam && !viewParam && !mapParam) return null;

  let working: StoryWorldState = {
    ...baseWorld,
    locations: baseWorld.locations.map((l) => ({ ...l })),
    routes: baseWorld.routes.map((r) => ({ ...r })),
    characters: baseWorld.characters.map((c) => ({ ...c })),
    events: baseWorld.events.map((e) => ({ ...e })),
  };

  let focusLocationId: string | null = null;
  let scope: MapScope = working.activeMapScope ?? 'valeroth';

  if (locParam && locParam.trim()) {
    const targetLoc = findLocation(working.locations, locParam.trim());
    if (targetLoc) {
      if (fromParam && fromParam.trim()) {
        const fromLoc = findLocation(working.locations, fromParam.trim());
        if (fromLoc && fromLoc.id !== targetLoc.id) {
          working.playerLocationId = fromLoc.id;
        }
      }
      const outcome = executeStoryToolCall(working, 'set_player_location', {
        targetLocationName: targetLoc.id,
        status: statusParam?.trim() || undefined,
        markRouteTraversed: Boolean(fromParam),
      });
      working = outcome.updatedWorld;
      scope = outcome.switchScope ?? getLocationScope(targetLoc);
      focusLocationId = targetLoc.id;
    }
  }

  if (viewParam && viewParam.trim()) {
    scope = sanitizeMapScope(viewParam.trim(), scope);
    working.activeMapScope = scope;
    const pos = resolvePlayerPosition(working);
    const displayLoc = pos.displayLocationForScope(scope);
    if (displayLoc) {
      focusLocationId = displayLoc.id;
    }
  }

  const autoOpenMap =
    mapParam === '1' || mapParam === 'true' || Boolean(locParam && locParam.trim());

  if (!focusLocationId && autoOpenMap) {
    const pos = resolvePlayerPosition(working);
    const displayLoc = pos.displayLocationForScope(scope) ?? pos.exactLocation;
    focusLocationId = displayLoc?.id ?? null;
  }

  return {
    world: working,
    scope,
    autoOpenMap,
    focusLocationId,
  };
}

export function buildWorldSystemPrompt(
  world: StoryWorldState,
  appBaseUrl = 'https://ais-pre-z522nwy7cfc3uy72tmc3kw-598064208672.asia-east1.run.app'
): string {
  const cleanBaseUrl = appBaseUrl.replace(/\/+$/, '');
  const overworldLocs = world.locations.filter((l) => getLocationScope(l) === 'valeroth');
  const norsvaleLocs = world.locations.filter((l) => getLocationScope(l) === 'norsvale');
  const pos = resolvePlayerPosition(world);

  const formatLocs = (list: StoryLocation[]) =>
    list
      .map(
        (l) =>
          `- id="${l.id}" | ${l.name}${l.altName ? ` (${l.altName})` : ''} [${l.region}${
            l.ruler ? `, kiểm soát: ${l.ruler}` : ''
          }]: ${l.summary}`
      )
      .join('\n');

  const charLines = world.characters
    .map((c) => {
      const loc = world.locations.find((l) => l.id === c.locationId)?.name ?? c.locationId;
      return `- ${c.name} (${c.role}) @ ${loc}: ${c.status}`;
    })
    .join('\n');

  const loreBlock = world.loreDirectives?.trim() ? `${world.loreDirectives.trim()}\n\n` : '';

  return `${loreBlock}HỆ THỐNG BẢN ĐỒ TƯƠNG TÁC — VALEROTH (2 LỚP BẢN ĐỒ):
Link web bản đồ chính thức: ${cleanBaseUrl}

VỊ TRÍ KHỞI ĐIỂM CỦA NGƯỜI CHƠI ("Bạn"):
- Địa điểm: ${pos.exactLocation?.name ?? 'Chưa rõ'} (id="${pos.exactLocation?.id ?? 'loc-nors-southgate'}")
- Trạng thái: ${pos.status}

LỚP 1 — TOÀN CẢNH VALEROTH (view=valeroth):
${formatLocs(overworldLocs)}

LỚP 2 — BÊN TRONG BẮC ẢI (view=norsvale):
${formatLocs(norsvaleLocs)}

NHÂN VẬT:
${charLines}

QUY TẮC XỬ LÝ LỆNH /map TRONG AI STUDIO PLAYGROUND:
1. LUÔN âm thầm theo dõi vị trí đứng hiện tại của người chơi (dùng đúng mã \`id\` trong danh sách 2 lớp bản đồ phía trên) và vị trí trước đó (\`from\`) xuyên suốt diễn biến truyện.
2. Khi người chơi gõ \`/map\` (hoặc \`/map valeroth\`, \`/map bắc ải\`, hay hỏi "tôi đang ở đâu"):
   - BẮT BUỘC hiển thị ngay ảnh bản đồ trực tiếp trong tin nhắn bằng cú pháp ảnh Markdown:
     \`![Bản đồ VALEROTH — <Tên vị trí>](${cleanBaseUrl}/api/map.png?loc=<id_hiện_tại>&from=<id_trước_đó>&view=<valeroth_hoặc_norsvale>)\`
   - Ngay bên dưới ảnh, luôn gắn kèm đường link mở bản đồ tương tác đầy đủ (để phóng to/bấm xem vùng nếu khung chat chặn hiển thị ảnh ngoài):
     \`[Mở bản đồ tương tác VALEROTH — <Tên vị trí>](${cleanBaseUrl}/?loc=<id_hiện_tại>&from=<id_trước_đó>&view=<valeroth_hoặc_norsvale>&map=1)\`
   - Ví dụ khi đang ở Quán Rượu Mũi Đao (vừa đi từ Cổng Hoang Vực):
     \`![Bản đồ VALEROTH — Quán Rượu Mũi Đao](${cleanBaseUrl}/api/map.png?loc=loc-nors-tavern&from=loc-nors-southgate&view=norsvale)\`
     \`[Mở bản đồ tương tác VALEROTH — Quán Rượu Mũi Đao](${cleanBaseUrl}/?loc=loc-nors-tavern&from=loc-nors-southgate&view=norsvale&map=1)\`
   - Kèm tóm tắt ngắn vị trí đang đứng, bối cảnh xung quanh và các lối đi lân cận.
3. Nếu phiên chat có bật công cụ Function Calling: gọi \`set_player_location\` khi người chơi di chuyển, gọi \`show_player_map\` khi gõ \`/map\`, và gọi \`switch_map_view\` khi đổi lớp bản đồ.
4. Tuân thủ [HARD_LOCK] CONSERVATIVE EXPANSION; giữ văn phong tiếng Việt lạnh, thực tế đúng tinh thần Valeroth.`;
}

