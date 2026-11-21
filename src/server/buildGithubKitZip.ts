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

const README_CONTENT = `# VALEROTH — Unified RP Engine (/map · /recap · /transfer)

Gộp toàn bộ 3 lệnh RP + World Building vào **1 kho GitHub duy nhất** và **1 link jsDelivr (\`@COMMIT_SHA\`)**:
**Google AI Studio → link jsDelivr (@SHA) → mã trên GitHub → Bản đồ / Biên bản Recap / Hồ sơ Transfer hiển thị trực tiếp**

## Cấu trúc tệp
- \`valeroth-map-engine.js\`: Engine hợp nhất v2.1 hỗ trợ 3 chế độ theo \`window.VALEROTH_DATA.mode\`:
  - \`mode: "map"\`: Bản đồ khắc mực Toàn cảnh Valeroth / Bên trong Bắc Ải, 14 khoanh vùng SVG, dấu Location đỏ tự di chuyển theo hội thoại, **hiển thị NPC có sẵn & NPC tạo mới (chỉ hiện khi chạm trán hoặc được nhắc đến)**, và hệ thống gắn tag RP.
  - \`mode: "recap"\`: Biên bản \`TÓM TẮT DIỄN BIẾN\` [HARD_LOCK] theo phong cách khắc mực cổ + nút **Sao chép Markdown nguyên bản**.
  - \`mode: "transfer"\`: \`NARRATIVE TRANSFER PACK\` [HARD_LOCK] tự nhúng sẵn \`NEW CHAT RESTORATION PROTOCOL [ABSOLUTE]\` + nút 1-bấm **Sao chép Transfer Pack (New Chat)** để dán thẳng sang chat mới.
- \`index.html\`: Bản đồ cố định độc lập có sẵn nút \`+ Gắn tag / NPC\`.
- \`commands/world-and-chessboard.md\`: Toàn bộ Section 3 (World Building) & Section 4 (The Chessboard NPCs).
- \`commands/recap.md\`: Đặc tả chuẩn nguyên bản của lệnh \`/recap\`.
- \`commands/transfer.md\`: Đặc tả chuẩn nguyên bản của lệnh \`/transfer\`.
- \`assets/valeroth.jpg\` & \`assets/norsvale.jpg\`: 2 họa đồ khắc mực châu Âu cổ (tự động nạp theo đúng \`@COMMIT_SHA\`).

## Cách cài đặt 3 bước
1. Tạo 1 repository **Public** trên GitHub (ví dụ \`valeroth-rp\`) và đẩy toàn bộ các tệp này lên đúng cấu trúc thư mục.
2. Mở mục **Commits** trên GitHub, sao chép mã **Commit SHA** (ví dụ \`a1b2c3d\`). Mỗi lần sửa giao diện trên GitHub, chỉ cần đổi \`@SHA\` mới là cả 3 lệnh đồng loạt tải bản mới, không dính cache.
3. Dán System Instructions (copy trực tiếp từ ứng dụng Valeroth) vào Google AI Studio với link:
   \`https://cdn.jsdelivr.net/gh/<USER>/<REPO>@<COMMIT_SHA>/valeroth-map-engine.js\`
`;

export function buildGithubKitZip(rootDir: string): Buffer {
  const engineJs = readFirstExisting([
    path.resolve(rootDir, 'public/github-kit/valeroth-map-engine.js'),
    path.resolve(rootDir, 'dist/github-kit/valeroth-map-engine.js'),
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

  return createZipBuffer([
    { name: 'valeroth-map-engine.js', data: engineJs },
    { name: 'index.html', data: indexHtml },
    { name: 'commands/world-and-chessboard.md', data: Buffer.from(VALEROTH_WORLD_AND_CHESSBOARD_PROMPT, 'utf8') },
    { name: 'commands/recap.md', data: Buffer.from(RECAP_COMMAND_MARKDOWN, 'utf8') },
    { name: 'commands/transfer.md', data: Buffer.from(TRANSFER_COMMAND_MARKDOWN, 'utf8') },
    { name: 'README.md', data: Buffer.from(README_CONTENT, 'utf8') },
    { name: 'assets/valeroth.jpg', data: valerothJpg },
    { name: 'assets/norsvale.jpg', data: norsvaleJpg },
  ]);
}
