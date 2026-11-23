/**
 * WORLD PACK TEMPLATE — Sao chép tệp này thành worlds/<ten-nhan-vat>.js cho nhân vật/thế giới mới!
 *
 * Cách tạo nhân vật mới trong 3 bước:
 *   1. Copy file này thành worlds/nhan-vat-b.js và đổi `id: 'nhan-vat-b'`.
 *   2. Tải ảnh bản đồ của nhân vật đó vào assets/nhan-vat-b/map.jpg.
 *   3. Trong System Instructions của bot nhân vật B, dùng:
 *        window.RP_DATA = { world: "nhan-vat-b", mode: "map", ... };
 *        <script src="https://cdn.jsdelivr.net/gh/<USER>/<REPO>@<SHA>/worlds/nhan-vat-b.js"></script>
 *        <script src="https://cdn.jsdelivr.net/gh/<USER>/<REPO>@<SHA>/engine.js"></script>
 */
(function (global) {
  'use strict';

  var currentScript = document.currentScript;
  var repoBase = '';
  if (currentScript && currentScript.src) {
    repoBase = currentScript.src.replace(/\/worlds\/[^/?#]+(?:[?#].*)?$/, '');
  }

  var worldDef = {
    id: 'ten-the-gioi-moi',
    name: 'Tên Thế Giới Mới',
    width: 1000,
    height: 562,
    assetBase: repoBase,
    defaultPlayerLoc: 'loc-start',
    layers: [
      {
        id: 'main',
        label: 'Toàn cảnh',
        titlePlate: '· TÊN BẢN ĐỒ ·',
        image: 'assets/ten-the-gioi-moi/map.jpg',
      },
    ],
    parentLayerLinks: {},
    locations: [
      {
        id: 'loc-start',
        scope: 'main',
        name: 'Điểm Khởi Đầu',
        altName: 'Khu Trung Tâm',
        ruler: 'Người cai quản',
        x: 500,
        y: 280,
        zonePath: 'M 400 200 L 600 200 L 600 360 L 400 360 Z',
        summary: 'Mô tả ngắn về khu vực này.',
      },
    ],
  };

  global.RP_WORLDS = global.RP_WORLDS || {};
  global.RP_WORLDS[worldDef.id] = worldDef;
  if (global.RPEngine && typeof global.RPEngine.registerWorld === 'function') {
    global.RPEngine.registerWorld(worldDef);
  }
})(typeof window !== 'undefined' ? window : globalThis);
