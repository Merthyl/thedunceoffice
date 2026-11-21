import fs from 'fs';
import path from 'path';
import {
  RECAP_COMMAND_MARKDOWN,
  TRANSFER_COMMAND_MARKDOWN,
  VALEROTH_WORLD_AND_CHESSBOARD_PROMPT,
} from '../data/rpCommands.ts';

interface ZipEntry {
  name: string;
  data: Buffer;
}

const CRC32_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) !== 0 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c >>> 0;
  }
  return table;
})();

function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = CRC32_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

/**
 * Pure zero-dependency standard ZIP (store method 0) builder.
 */
function createZipBuffer(entries: ZipEntry[]): Buffer {
  const localParts: Buffer[] = [];
  const centralParts: Buffer[] = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBuf = Buffer.from(entry.name, 'utf8');
    const data = entry.data;
    const crc = crc32(data);
    const size = data.length;

    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(0x0800, 6);
    localHeader.writeUInt16LE(0, 8);
    localHeader.writeUInt16LE(0, 10);
    localHeader.writeUInt16LE(0, 12);
    localHeader.writeUInt32LE(crc, 14);
    localHeader.writeUInt32LE(size, 18);
    localHeader.writeUInt32LE(size, 22);
    localHeader.writeUInt16LE(nameBuf.length, 26);
    localHeader.writeUInt16LE(0, 28);

    localParts.push(localHeader, nameBuf, data);

    const centralHeader = Buffer.alloc(46);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(0x0800, 8);
    centralHeader.writeUInt16LE(0, 10);
    centralHeader.writeUInt16LE(0, 12);
    centralHeader.writeUInt16LE(0, 14);
    centralHeader.writeUInt32LE(crc, 16);
    centralHeader.writeUInt32LE(size, 20);
    centralHeader.writeUInt32LE(size, 24);
    centralHeader.writeUInt16LE(nameBuf.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE(0, 38);
    centralHeader.writeUInt32LE(offset, 42);

    centralParts.push(centralHeader, nameBuf);
    offset += localHeader.length + nameBuf.length + data.length;
  }

  const centralDir = Buffer.concat(centralParts);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(centralDir.length, 12);
  eocd.writeUInt32LE(offset, 16);
  eocd.writeUInt16LE(0, 20);

  return Buffer.concat([...localParts, centralDir, eocd]);
}

function readFirstExisting(paths: string[]): Buffer {
  for (const p of paths) {
    if (fs.existsSync(p)) {
      return fs.readFileSync(p);
    }
  }
  throw new Error(`Không tìm thấy tệp nguồn: ${paths[0]}`);
}

const README_CONTENT = `# DUNCE RP ENGINE — Modular Multi-Character Kit (GitHub + jsDelivr + Google AI Studio)

Kho mã nguồn **tách lõi dùng chung & gói bản đồ từng nhân vật** trên **1 kho GitHub duy nhất** và **1 mã \`@COMMIT_SHA\`**:
- Mọi nhân vật/bot đều dùng chung \`engine.js\` cho \`/recap\`, \`/transfer\` và các lệnh mới về sau.
- Mỗi nhân vật/thế giới có file \`worlds/<ten-bot>.js\` riêng — **tuyệt đối không lẫn bản đồ của Kaldor sang nhân vật khác**.

## Cấu trúc thư mục
\`\`\`text
├── engine.js                         ← Lõi dùng chung mọi bot (/recap, /transfer, bộ vẽ /map, API mở rộng registerMode)
├── worlds/
│   ├── kaldor-valeroth.js            ← Gói bản đồ riêng của Kaldor (Valeroth & Bắc Ải, 14 khoanh vùng)
│   └── _template.js                  ← Mẫu trống để copy tạo thêm nhân vật / thế giới mới
├── assets/
│   └── kaldor/
│       ├── valeroth.jpg              ← Họa đồ toàn cảnh Valeroth
│       └── norsvale.jpg              ← Họa đồ bên trong Bắc Ải
├── commands/
│   ├── world-and-chessboard.md       ← Section 3 & Section 4 của Kaldor
│   ├── recap.md                      ← Đặc tả chuẩn lệnh /recap (dùng chung)
│   └── transfer.md                   ← Đặc tả chuẩn lệnh /transfer (dùng chung)
├── index.html                        ← Bản đồ cố định độc lập của Kaldor có sẵn + Gắn tag / NPC
└── README.md
\`\`\`

## Cách đẩy lên GitHub & gắn vào Google AI Studio (KHÔNG cần API Key)
1. Tạo 1 repository **Public** trên GitHub (ví dụ \`dunce-rp-kit\`) và đẩy toàn bộ thư mục này lên (giữ nguyên cấu trúc \`worlds/\`, \`assets/kaldor/\`, \`commands/\`).
   - **Không cần API key hay token**: chỉ cần repo ở chế độ **Public** là jsDelivr tự phân phối miễn phí.
2. Vào mục **Commits** trên GitHub → sao chép mã **Commit SHA** (ví dụ \`a1b2c3d\`).
   - Khi nâng cấp \`engine.js\` hay thêm nhân vật mới, chỉ cần đổi \`@SHA\` mới vào System Instructions là jsDelivr tải ngay bản mới, không bị dính cache cũ.
3. Trong **Google AI Studio**:
   - **Lệnh \`/recap\` & \`/transfer\`**: In **thuần text / Markdown trực tiếp ra màn hình** theo đúng mẫu trong \`commands/recap.md\` và \`commands/transfer.md\` (dùng chung cho mọi nhân vật, không cần tải HTML).
   - **Lệnh \`/map\` của Kaldor**: Xuất 1 đoạn HTML gọn gọi 2 link \`...@SHA/worlds/kaldor-valeroth.js\` và \`...@SHA/engine.js\`.
   - **Bot nhân vật khác (có bản đồ riêng)**: Copy \`worlds/_template.js\` → \`worlds/<ten-bot>.js\`, thêm ảnh vào \`assets/<ten-bot>/\`, rồi gắn \`worlds/<ten-bot>.js\` + \`engine.js\` (tuyệt đối không lẫn sang bản đồ của Kaldor).

## Mở rộng thêm lệnh mới (/status, /inventory, /relationship...)
Tạo thêm tệp \`modes/<ten-lenh>.js\` gọi \`window.RPEngine.registerMode('ten_lenh', function(container, data) { ... })\` hoặc bổ sung trực tiếp vào \`engine.js\`, commit và đổi \`@SHA\`.
`;

export function buildGithubKitZip(rootDir: string): Buffer {
  const engineJs = readFirstExisting([
    path.resolve(rootDir, 'public/github-kit/engine.js'),
    path.resolve(rootDir, 'dist/github-kit/engine.js'),
  ]);
  const kaldorWorldJs = readFirstExisting([
    path.resolve(rootDir, 'public/github-kit/worlds/kaldor-valeroth.js'),
    path.resolve(rootDir, 'dist/github-kit/worlds/kaldor-valeroth.js'),
  ]);
  const templateWorldJs = readFirstExisting([
    path.resolve(rootDir, 'public/github-kit/worlds/_template.js'),
    path.resolve(rootDir, 'dist/github-kit/worlds/_template.js'),
  ]);
  const indexHtml = readFirstExisting([
    path.resolve(rootDir, 'public/github-kit/index.html'),
    path.resolve(rootDir, 'dist/github-kit/index.html'),
  ]);
  const valerothJpg = readFirstExisting([
    path.resolve(rootDir, 'src/assets/images/valeroth_map_v2_1795197882349.jpg'),
    path.resolve(rootDir, 'dist/src/assets/images/valeroth_map_v2_1795197882349.jpg'),
  ]);
  const norsvaleJpg = readFirstExisting([
    path.resolve(rootDir, 'src/assets/images/norsvale_interior_1795197881444.jpg'),
    path.resolve(rootDir, 'dist/src/assets/images/norsvale_interior_1795197881444.jpg'),
  ]);

  const mapKaldorMd = readFirstExisting([
    path.resolve(rootDir, 'public/github-kit/commands/map-kaldor.md'),
    path.resolve(rootDir, 'dist/github-kit/commands/map-kaldor.md'),
  ]);

  return createZipBuffer([
    { name: 'engine.js', data: engineJs },
    { name: 'worlds/kaldor-valeroth.js', data: kaldorWorldJs },
    { name: 'worlds/_template.js', data: templateWorldJs },
    { name: 'index.html', data: indexHtml },
    { name: 'commands/map-kaldor.md', data: mapKaldorMd },
    { name: 'commands/world-and-chessboard.md', data: Buffer.from(VALEROTH_WORLD_AND_CHESSBOARD_PROMPT, 'utf8') },
    { name: 'commands/recap.md', data: Buffer.from(RECAP_COMMAND_MARKDOWN, 'utf8') },
    { name: 'commands/transfer.md', data: Buffer.from(TRANSFER_COMMAND_MARKDOWN, 'utf8') },
    { name: 'README.md', data: Buffer.from(README_CONTENT, 'utf8') },
    { name: 'assets/kaldor/valeroth.jpg', data: valerothJpg },
    { name: 'assets/kaldor/norsvale.jpg', data: norsvaleJpg },
  ]);
}
