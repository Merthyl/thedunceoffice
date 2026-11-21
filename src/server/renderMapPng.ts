import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import {
  applyMapQueryParams,
  getLocationScope,
  getRouteScope,
  INITIAL_STORY_WORLD,
  MAP_HEIGHT,
  MAP_WIDTH,
  resolvePlayerPosition,
} from '../data/storyEngine.ts';
import type { MapScope, StoryLocation } from '../types/story.ts';

const INK = '#111111';
const INK_SOFT = '#3D3A35';
const PAPER = '#FAF8F4';
const WAX_CRIMSON = '#8B1E1E';

const ARTWORK_FILENAME: Record<MapScope, string> = {
  valeroth: 'valeroth_map_v2_1795197882349.jpg',
  norsvale: 'norsvale_interior_1795197881444.jpg',
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function resolveArtworkPath(rootDir: string, scope: MapScope): string {
  const filename = ARTWORK_FILENAME[scope];
  const candidates = [
    path.resolve(rootDir, 'src/assets/images', filename),
    path.resolve(rootDir, 'dist/src/assets/images', filename),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  throw new Error(`Không tìm thấy ảnh bản đồ: ${filename}`);
}

function computeCurvedRoad(from: StoryLocation, to: StoryLocation): string {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.hypot(dx, dy) || 1;
  const bend = Math.min(20, dist * 0.09);
  const mx = (from.x + to.x) / 2 - (dy / dist) * bend;
  const my = (from.y + to.y) / 2 + (dx / dist) * bend;
  return `M ${from.x} ${from.y} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${to.x} ${to.y}`;
}

export async function renderValerothMapPng(
  rootDir: string,
  searchQuery: string
): Promise<Buffer> {
  const applied = applyMapQueryParams(INITIAL_STORY_WORLD, searchQuery);
  const world = applied?.world ?? INITIAL_STORY_WORLD;
  const scope: MapScope = applied?.scope ?? resolvePlayerPosition(world).recommendedScope;

  const scopedLocations = world.locations.filter((l) => getLocationScope(l) === scope);
  const scopedRoutes = world.routes.filter((r) => getRouteScope(r, world.locations) === scope);
  const locationMap = new Map(scopedLocations.map((l) => [l.id, l]));

  const playerPos = resolvePlayerPosition(world);
  const playerDisplayLoc = playerPos.displayLocationForScope(scope);
  const titlePlateLabel = scope === 'valeroth' ? '· VALEROTH ·' : '· BẮC ẢI ·';

  const zonesSvg = scopedLocations
    .map((loc) => {
      if (!loc.zonePath) return '';
      const isPlayerHere = playerDisplayLoc?.id === loc.id;
      const isSoftBlend = Boolean(loc.softBlend);
      const fill = isPlayerHere
        ? 'rgba(139, 30, 30, 0.16)'
        : isSoftBlend
        ? 'rgba(17, 17, 17, 0.04)'
        : 'none';
      const stroke = isPlayerHere ? WAX_CRIMSON : INK;
      const haloStroke = isSoftBlend ? 'rgba(250, 248, 244, 0.65)' : 'rgba(250, 248, 244, 0.88)';
      const haloWidth = isPlayerHere ? 5.2 : isSoftBlend ? 2.8 : 3.8;
      const strokeWidth = isPlayerHere ? 2.3 : isSoftBlend ? 1.15 : 1.4;
      const dash = isPlayerHere ? '10 4' : isSoftBlend ? '2.5 5.5' : '6 4';

      return `
        <path d="${loc.zonePath}" fill="${fill}" stroke="${haloStroke}" stroke-width="${haloWidth}" stroke-linejoin="round" />
        <path d="${loc.zonePath}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-dasharray="${dash}" stroke-linejoin="round" opacity="${isSoftBlend && !isPlayerHere ? 0.72 : 1}" />
      `;
    })
    .join('\n');

  const routesSvg = scopedRoutes
    .map((route) => {
      const from = locationMap.get(route.fromId);
      const to = locationMap.get(route.toId);
      if (!from || !to) return '';
      const d = computeCurvedRoad(from, to);
      const isTraversed = route.status === 'traversed';
      const stroke = isTraversed ? WAX_CRIMSON : INK;
      const dash =
        route.type === 'secret' ? '2 4' : route.type === 'portal' ? '6 3 2 3' : '5 4';

      return `
        ${
          isTraversed
            ? `<path d="${d}" fill="none" stroke="rgba(250, 248, 244, 0.9)" stroke-width="4.2" stroke-linecap="round" />`
            : ''
        }
        <path d="${d}" fill="none" stroke="${stroke}" stroke-width="${isTraversed ? 2 : 1.05}" ${
          isTraversed ? '' : `stroke-dasharray="${dash}"`
        } opacity="${isTraversed ? 0.92 : 0.4}" stroke-linecap="round" />
      `;
    })
    .join('\n');

  const labelsAndPinSvg = scopedLocations
    .map((loc) => {
      const isPlayerHere = playerDisplayLoc?.id === loc.id;
      const titleText = `· ${loc.name.toUpperCase()} ·`;
      const bannerWidth = Math.max(96, titleText.length * 6.5 + 22);
      const borderColor = isPlayerHere ? WAX_CRIMSON : INK;

      const altBadge = loc.altName
        ? `
          <g transform="translate(0, 22)">
            <rect x="${-(loc.altName.length * 3.3 + 9)}" y="-8.5" width="${
              loc.altName.length * 6.6 + 18
            }" height="13" fill="rgba(250, 248, 244, 0.92)" />
            <text text-anchor="middle" y="0.8" font-size="8.8" font-style="italic" fill="${INK_SOFT}" font-family="Liberation Serif, DejaVu Serif, serif">${escapeXml(
              loc.altName
            )}</text>
          </g>
        `
        : '';

      const locationPin = isPlayerHere
        ? `
          <g transform="translate(0, -10)">
            <ellipse cx="0" cy="0" rx="18" ry="6.5" fill="none" stroke="${WAX_CRIMSON}" stroke-width="1.3" stroke-dasharray="3.5 2.5" opacity="0.9" />
            <ellipse cx="0" cy="0" rx="25" ry="9" fill="none" stroke="${WAX_CRIMSON}" stroke-width="0.75" opacity="0.5" />
            <ellipse cx="0" cy="0.5" rx="6.5" ry="2.3" fill="${INK}" opacity="0.3" />
            <path d="M 0 0 C -4.8 -7.2, -11.5 -13.2, -11.5 -20.5 A 11.5 11.5 0 1 1 11.5 -20.5 C 11.5 -13.2, 4.8 -7.2, 0 0 Z" fill="${PAPER}" stroke="${PAPER}" stroke-width="3.6" stroke-linejoin="round" />
            <path d="M 0 0 C -4.8 -7.2, -11.5 -13.2, -11.5 -20.5 A 11.5 11.5 0 1 1 11.5 -20.5 C 11.5 -13.2, 4.8 -7.2, 0 0 Z" fill="${WAX_CRIMSON}" stroke="${INK}" stroke-width="1.25" stroke-linejoin="round" />
            <circle cx="0" cy="-20.5" r="4.3" fill="${PAPER}" stroke="${INK}" stroke-width="0.95" />
          </g>
        `
        : '';

      return `
        <g transform="translate(${loc.x}, ${loc.y})">
          <g transform="translate(0, 6)">
            <path d="M ${-bannerWidth / 2 + 6} -6 L ${-bannerWidth / 2 - 10} -6 L ${
              -bannerWidth / 2 - 4
            } 2.5 L ${-bannerWidth / 2 - 10} 11 L ${
              -bannerWidth / 2 + 6
            } 11 Z" fill="#EAE5DB" stroke="${borderColor}" stroke-width="1.05" />
            <path d="M ${bannerWidth / 2 - 6} -6 L ${bannerWidth / 2 + 10} -6 L ${
              bannerWidth / 2 + 4
            } 2.5 L ${bannerWidth / 2 + 10} 11 L ${
              bannerWidth / 2 - 6
            } 11 Z" fill="#EAE5DB" stroke="${borderColor}" stroke-width="1.05" />
            <rect x="${-bannerWidth / 2 + 2}" y="-8" width="${bannerWidth}" height="23" fill="${INK}" opacity="0.2" />
            <rect x="${-bannerWidth / 2}" y="-10" width="${bannerWidth}" height="23" fill="${PAPER}" stroke="${borderColor}" stroke-width="${
              isPlayerHere ? 1.9 : 1.25
            }" />
            <rect x="${-bannerWidth / 2 + 2.5}" y="-7.5" width="${
              bannerWidth - 5
            }" height="18" fill="none" stroke="${borderColor}" stroke-width="0.45" opacity="0.65" />
            <text text-anchor="middle" y="5" font-size="10.2" font-weight="700" fill="${borderColor}" font-family="Liberation Serif, DejaVu Serif, serif">${escapeXml(
              titleText
            )}</text>
            ${altBadge}
          </g>
          ${locationPin}
        </g>
      `;
    })
    .join('\n');

  const overlaySvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${MAP_WIDTH}" height="${MAP_HEIGHT}" viewBox="0 0 ${MAP_WIDTH} ${MAP_HEIGHT}">
      ${zonesSvg}
      ${routesSvg}
      ${labelsAndPinSvg}
      <rect x="7" y="7" width="${MAP_WIDTH - 14}" height="${MAP_HEIGHT - 14}" fill="none" stroke="${INK}" stroke-width="2.2" />
      <rect x="12" y="12" width="${MAP_WIDTH - 24}" height="${MAP_HEIGHT - 24}" fill="none" stroke="${INK}" stroke-width="0.75" />
      <g transform="translate(26, 24)">
        <rect x="2" y="2" width="164" height="36" fill="${INK}" opacity="0.16" />
        <rect x="0" y="0" width="164" height="36" fill="${PAPER}" stroke="${INK}" stroke-width="1.5" />
        <rect x="3.5" y="3.5" width="157" height="29" fill="none" stroke="${INK}" stroke-width="0.6" />
        <circle cx="9" cy="9" r="1.2" fill="${INK}" />
        <circle cx="155" cy="9" r="1.2" fill="${INK}" />
        <circle cx="9" cy="27" r="1.2" fill="${INK}" />
        <circle cx="155" cy="27" r="1.2" fill="${INK}" />
        <text x="82" y="23" text-anchor="middle" font-size="13.5" font-weight="700" fill="${INK}" font-family="Liberation Serif, DejaVu Serif, serif" letter-spacing="1.4">${escapeXml(
          titlePlateLabel
        )}</text>
      </g>
    </svg>
  `;

  const baseImagePath = resolveArtworkPath(rootDir, scope);
  return sharp(baseImagePath)
    .resize(MAP_WIDTH, MAP_HEIGHT, { fit: 'cover' })
    .composite([{ input: Buffer.from(overlaySvg), top: 0, left: 0 }])
    .png({ compressionLevel: 8 })
    .toBuffer();
}
