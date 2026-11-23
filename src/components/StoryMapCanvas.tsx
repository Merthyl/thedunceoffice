import React, { useEffect, useRef, useState } from 'react';
import { Eye, EyeOff, Maximize2, Minus, Plus } from 'lucide-react';
import {
  getLocationScope,
  MAP_HEIGHT,
  MAP_WIDTH,
  resolvePlayerPosition,
} from '../data/storyEngine';
import type { MapScope, StoryLocation, StoryWorldState } from '../types/story';

interface StoryMapCanvasProps {
  world: StoryWorldState;
  activeScope: MapScope;
  selectedLocationId: string | null;
  highlightedLocationIds: string[];
  focusLocationId: string | null;
  isPlayerMapHighlighted: boolean;
  onClearFocus: () => void;
  onSelectLocation: (id: string | null) => void;
  onEnterNorsvale?: () => void;
}

const MAP_ARTWORK_BY_SCOPE: Record<MapScope, string> = {
  valeroth: '/src/assets/images/valeroth_master_v40_1795441016467.jpg',
  norsvale: '/src/assets/images/norsvale_ink_v20_1795432498475.jpg',
};

const INK = '#111111';
const INK_SOFT = '#3D3A35';
const PAPER = '#FAF8F4';
const WAX_CRIMSON = '#8B1E1E';

export default function StoryMapCanvas({
  world,
  activeScope,
  selectedLocationId,
  highlightedLocationIds,
  focusLocationId,
  isPlayerMapHighlighted,
  onClearFocus,
  onSelectLocation,
  onEnterNorsvale,
}: StoryMapCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [imgError, setImgError] = useState(false);

  const [showZones, setShowZones] = useState(true);
  const [hoveredLocationId, setHoveredLocationId] = useState<string | null>(null);

  const [isPanning, setIsPanning] = useState(false);
  const panOriginRef = useRef<{ startX: number; startY: number; panX: number; panY: number } | null>(
    null
  );

  // Reset pan/zoom cleanly when switching between Toàn cảnh Valeroth and Bên trong Bắc Ải
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setImgError(false);
    setHoveredLocationId(null);
  }, [activeScope]);

  const scopedLocations = world.locations.filter((l) => getLocationScope(l) === activeScope);

  useEffect(() => {
    if (!focusLocationId) return;
    const loc = scopedLocations.find((l) => l.id === focusLocationId);
    const el = containerRef.current;
    if (loc && el) {
      const rect = el.getBoundingClientRect();
      const targetZoom = 1.28;
      const scaleX = rect.width / MAP_WIDTH;
      const scaleY = rect.height / MAP_HEIGHT;
      const baseScale = Math.min(scaleX, scaleY);
      const offsetX = (MAP_WIDTH / 2 - loc.x) * baseScale * targetZoom;
      const offsetY = (MAP_HEIGHT / 2 - loc.y) * baseScale * targetZoom;
      setZoom(targetZoom);
      setPan({ x: offsetX, y: offsetY });
    }
    onClearFocus();
  }, [focusLocationId, scopedLocations, onClearFocus]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 0.91;
    setZoom((prev) => Math.max(0.75, Math.min(2.6, Number((prev * factor).toFixed(2)))));
  };

  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('[data-map-interactive="true"]')) return;

    onSelectLocation(null);

    setIsPanning(true);
    panOriginRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isPanning && panOriginRef.current) {
      const dx = e.clientX - panOriginRef.current.startX;
      const dy = e.clientY - panOriginRef.current.startY;
      setPan({
        x: panOriginRef.current.panX + dx,
        y: panOriginRef.current.panY + dy,
      });
    }
  };

  const handlePointerUp = () => {
    setIsPanning(false);
    panOriginRef.current = null;
  };

  const handleLocationClick = (e: React.MouseEvent, loc: StoryLocation) => {
    if (loc.labelOnly) return;
    e.stopPropagation();
    onSelectLocation(loc.id);
  };

  const handleLocationDoubleClick = (e: React.MouseEvent, loc: StoryLocation) => {
    if (loc.labelOnly) return;
    e.stopPropagation();
    if (activeScope === 'valeroth' && loc.id === 'loc-norsvale' && onEnterNorsvale) {
      onEnterNorsvale();
    }
  };

  const resetViewport = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const playerPos = resolvePlayerPosition(world);
  const playerDisplayLoc = playerPos.displayLocationForScope(activeScope);

  const activeBgUrl = MAP_ARTWORK_BY_SCOPE[activeScope];
  const titlePlateLabel = activeScope === 'valeroth' ? '· VALEROTH ·' : '· THÀNH BẮC ẢI ·';
  const titlePlateWidth = activeScope === 'valeroth' ? 164 : 196;

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onPointerDown={handleCanvasPointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className={`relative h-full w-full overflow-hidden select-none bg-[#EDEAE3] ${
        isPanning ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      {/* Pan & Zoom Engraving Plate */}
      <div
        className="flex h-full w-full items-center justify-center p-2 sm:p-4"
        style={{
          transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
          transformOrigin: 'center center',
          transition: isPanning ? 'none' : 'transform 180ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div className="archival-paper relative aspect-[1000/562] w-full max-w-[1380px] overflow-hidden border border-[#111111] shadow-[0_10px_36px_rgba(17,17,17,0.18)]">
          {/* Pure Black-Ink Engraved Artwork */}
          {!imgError && (
            <img
              src={activeBgUrl}
              alt={activeScope === 'valeroth' ? 'Bản đồ khắc mực Valeroth' : 'Sơ đồ bên trong Bắc Ải'}
              referrerPolicy="no-referrer"
              draggable={false}
              onError={() => setImgError(true)}
              className="pointer-events-none absolute inset-0 h-full w-full object-cover saturate-[0.62] brightness-[1.03] contrast-[1.01]"
            />
          )}

          {/* Interactive Territorial Zones, Location Pin & Engraved Scroll Labels */}
          <svg
            data-story-map="true"
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            className="relative z-10 h-full w-full"
          >
            <defs>
              <pattern
                id="zone-diagonal-hatch"
                width="8"
                height="8"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(45)"
              >
                <line x1="0" y1="0" x2="0" y2="8" stroke={WAX_CRIMSON} strokeWidth="0.9" opacity="0.2" />
              </pattern>
              <pattern
                id="zone-ink-hatch"
                width="9"
                height="9"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(-45)"
              >
                <line x1="0" y1="0" x2="0" y2="9" stroke={INK} strokeWidth="0.65" opacity="0.11" />
              </pattern>
              <pattern
                id="zone-mist-stipple"
                width="10"
                height="10"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="2.5" cy="2.5" r="0.85" fill={INK} opacity="0.14" />
                <circle cx="7.5" cy="7.5" r="0.7" fill={INK} opacity="0.1" />
              </pattern>
            </defs>

            {/* 1. TERRITORIAL DEMARCATION LAYER (KHOANH VÙNG) */}
            {showZones &&
              scopedLocations.map((loc) => {
                if (!loc.zonePath) return null;
                const isSelected = selectedLocationId === loc.id;
                const isHovered = hoveredLocationId === loc.id;
                const isPlayerHere = playerDisplayLoc?.id === loc.id;
                const isHighlighted = highlightedLocationIds.includes(loc.id);
                const isLocked = loc.status === 'locked';
                const isSoftBlend = Boolean(loc.softBlend);

                const isActiveEmphasis =
                  isSelected || isHighlighted || (isPlayerHere && isPlayerMapHighlighted);

                const fill = isActiveEmphasis
                  ? 'rgba(139, 30, 30, 0.14)'
                  : isPlayerHere
                  ? 'url(#zone-diagonal-hatch)'
                  : isHovered
                  ? 'rgba(17, 17, 17, 0.08)'
                  : isSoftBlend
                  ? 'url(#zone-mist-stipple)'
                  : isLocked
                  ? 'url(#zone-ink-hatch)'
                  : 'rgba(250, 248, 244, 0.02)';

                const stroke = isActiveEmphasis || isPlayerHere ? WAX_CRIMSON : INK;

                const dashPattern = isActiveEmphasis
                  ? '10 4'
                  : isSoftBlend
                  ? '2.5 5.5'
                  : '6 4';

                return (
                  <g
                    key={`zone-${loc.id}`}
                    data-map-interactive="true"
                    onMouseEnter={() => setHoveredLocationId(loc.id)}
                    onMouseLeave={() => setHoveredLocationId((cur) => (cur === loc.id ? null : cur))}
                    onClick={(e) => handleLocationClick(e, loc)}
                    onDoubleClick={(e) => handleLocationDoubleClick(e, loc)}
                    className="cursor-pointer transition-opacity"
                  >
                    <path
                      d={loc.zonePath}
                      fill={fill}
                      stroke={isSoftBlend ? 'rgba(250, 248, 244, 0.62)' : 'rgba(250, 248, 244, 0.86)'}
                      strokeWidth={isActiveEmphasis ? 5.2 : isSoftBlend ? 2.8 : 3.8}
                      strokeLinejoin="round"
                    />
                    <path
                      d={loc.zonePath}
                      fill="none"
                      stroke={stroke}
                      strokeWidth={
                        isActiveEmphasis ? 2.2 : isHovered ? 1.8 : isSoftBlend ? 1.1 : 1.35
                      }
                      strokeDasharray={dashPattern}
                      strokeLinejoin="round"
                      opacity={isSoftBlend && !isHovered && !isActiveEmphasis ? 0.72 : 1}
                    />
                  </g>
                );
              })}

            {/* 2. ENGRAVED VICTORIAN SCROLL BANNERS & USER LOCATION PIN ONLY */}
            {scopedLocations.map((loc) => {
              const isLabelOnly = Boolean(loc.labelOnly);
              const isSelected = !isLabelOnly && selectedLocationId === loc.id;
              const isHovered = !isLabelOnly && hoveredLocationId === loc.id;
              const isHighlighted = highlightedLocationIds.includes(loc.id);
              const isPlayerHere = playerDisplayLoc?.id === loc.id;

              const titleText = `· ${loc.name.toUpperCase()} ·`;
              const bannerWidth = Math.max(96, titleText.length * 6.5 + 22);

              return (
                <g
                  key={loc.id}
                  data-map-interactive={isLabelOnly ? undefined : 'true'}
                  transform={`translate(${loc.x}, ${loc.y})`}
                  onMouseEnter={isLabelOnly ? undefined : () => setHoveredLocationId(loc.id)}
                  onMouseLeave={
                    isLabelOnly
                      ? undefined
                      : () => setHoveredLocationId((cur) => (cur === loc.id ? null : cur))
                  }
                  onClick={isLabelOnly ? undefined : (e) => handleLocationClick(e, loc)}
                  onDoubleClick={isLabelOnly ? undefined : (e) => handleLocationDoubleClick(e, loc)}
                  className={isLabelOnly ? 'pointer-events-none' : 'cursor-pointer'}
                >
                  {/* Folded Black-Ink Victorian Scroll Ribbon */}
                  <g transform="translate(0, 6)">
                    {/* Swallowtail ribbon folds */}
                    <path
                      d={`M ${-bannerWidth / 2 + 6} -6 L ${-bannerWidth / 2 - 10} -6 L ${
                        -bannerWidth / 2 - 4
                      } 2.5 L ${-bannerWidth / 2 - 10} 11 L ${-bannerWidth / 2 + 6} 11 Z`}
                      fill="#EAE5DB"
                      stroke={isPlayerHere || isSelected || isHighlighted ? WAX_CRIMSON : INK}
                      strokeWidth="1.05"
                    />
                    <path
                      d={`M ${bannerWidth / 2 - 6} -6 L ${bannerWidth / 2 + 10} -6 L ${
                        bannerWidth / 2 + 4
                      } 2.5 L ${bannerWidth / 2 + 10} 11 L ${bannerWidth / 2 - 6} 11 Z`}
                      fill="#EAE5DB"
                      stroke={isPlayerHere || isSelected || isHighlighted ? WAX_CRIMSON : INK}
                      strokeWidth="1.05"
                    />
                    {/* Crisp ink drop offset */}
                    <rect
                      x={-bannerWidth / 2 + 2}
                      y={-8}
                      width={bannerWidth}
                      height={23}
                      fill={INK}
                      opacity={isHovered || isSelected ? 0.28 : 0.18}
                    />
                    {/* Main Archival-White Scroll Plate */}
                    <rect
                      x={-bannerWidth / 2}
                      y={-10}
                      width={bannerWidth}
                      height={23}
                      fill={PAPER}
                      stroke={isPlayerHere || isSelected || isHighlighted ? WAX_CRIMSON : INK}
                      strokeWidth={isSelected || isPlayerHere || isHighlighted ? 1.85 : 1.25}
                    />
                    {/* Inner hairline book-plate rule */}
                    <rect
                      x={-bannerWidth / 2 + 2.5}
                      y={-7.5}
                      width={bannerWidth - 5}
                      height={18}
                      fill="none"
                      stroke={isPlayerHere || isSelected ? WAX_CRIMSON : INK}
                      strokeWidth="0.45"
                      opacity="0.65"
                    />
                    <text
                      textAnchor="middle"
                      y={5}
                      fontSize="10.2"
                      fontWeight="700"
                      fill={isPlayerHere || isSelected ? WAX_CRIMSON : INK}
                      style={{
                        fontFamily: '"Playfair Display", "Spectral", Georgia, serif',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {titleText}
                    </text>

                    {/* Subtle italic subtitle below scroll */}
                    {loc.altName && (
                      <g transform="translate(0, 22)">
                        <rect
                          x={-(loc.altName.length * 3.3 + 9)}
                          y={-8.5}
                          width={loc.altName.length * 6.6 + 18}
                          height={13}
                          fill="rgba(250, 248, 244, 0.92)"
                        />
                        <text
                          textAnchor="middle"
                          y={0.8}
                          fontSize="8.8"
                          fontStyle="italic"
                          fill={INK_SOFT}
                          style={{ fontFamily: '"Spectral", Georgia, serif' }}
                        >
                          {loc.altName}
                        </text>
                      </g>
                    )}
                  </g>

                  {/* User Current Position: Classic Engraved Wax-Crimson Location Pin */}
                  {isPlayerHere && (
                    <g transform="translate(0, -10)">
                      <title>
                        Vị trí của bạn: {playerPos.exactLocation?.name ?? loc.name}
                      </title>
                      {/* Engraved target rings around pin base when /map is triggered */}
                      {isPlayerMapHighlighted && (
                        <g className="pointer-events-none">
                          <ellipse
                            cx="0"
                            cy="0"
                            rx="18"
                            ry="6.5"
                            fill="none"
                            stroke={WAX_CRIMSON}
                            strokeWidth="1.25"
                            strokeDasharray="3.5 2.5"
                            opacity="0.85"
                          />
                          <ellipse
                            cx="0"
                            cy="0"
                            rx="25"
                            ry="9"
                            fill="none"
                            stroke={WAX_CRIMSON}
                            strokeWidth="0.7"
                            opacity="0.45"
                          />
                        </g>
                      )}
                      {/* Ground shadow under pin tip */}
                      <ellipse cx="0" cy="0.5" rx="6.5" ry="2.3" fill={INK} opacity="0.28" />
                      {/* Archival-white outer halo so pin stands out sharply over dark crosshatching */}
                      <path
                        d="M 0 0 C -4.8 -7.2, -11.5 -13.2, -11.5 -20.5 A 11.5 11.5 0 1 1 11.5 -20.5 C 11.5 -13.2, 4.8 -7.2, 0 0 Z"
                        fill={PAPER}
                        stroke={PAPER}
                        strokeWidth="3.4"
                        strokeLinejoin="round"
                      />
                      {/* Primary Crimson Ink Location Teardrop Pin */}
                      <path
                        d="M 0 0 C -4.8 -7.2, -11.5 -13.2, -11.5 -20.5 A 11.5 11.5 0 1 1 11.5 -20.5 C 11.5 -13.2, 4.8 -7.2, 0 0 Z"
                        fill={WAX_CRIMSON}
                        stroke={INK}
                        strokeWidth="1.2"
                        strokeLinejoin="round"
                      />
                      {/* Inner archival-white hole */}
                      <circle
                        cx="0"
                        cy="-20.5"
                        r="4.3"
                        fill={PAPER}
                        stroke={INK}
                        strokeWidth="0.95"
                      />
                    </g>
                  )}
                </g>
              );
            })}

            {/* 3. ORNATE DOUBLE-RULED ANTIQUE BOOK-PLATE FRAME */}
            <rect
              x="7"
              y="7"
              width={MAP_WIDTH - 14}
              height={MAP_HEIGHT - 14}
              fill="none"
              stroke={INK}
              strokeWidth="2.2"
              className="pointer-events-none"
            />
            <rect
              x="12"
              y="12"
              width={MAP_WIDTH - 24}
              height={MAP_HEIGHT - 24}
              fill="none"
              stroke={INK}
              strokeWidth="0.75"
              className="pointer-events-none"
            />

            {/* 4. ENGRAVED TITLE PLATE */}
            <g transform="translate(26, 24)" className="pointer-events-none">
              <rect x="2" y="2" width={titlePlateWidth} height="36" fill={INK} opacity="0.16" />
              <rect
                x="0"
                y="0"
                width={titlePlateWidth}
                height="36"
                fill={PAPER}
                stroke={INK}
                strokeWidth="1.5"
              />
              <rect
                x="3.5"
                y="3.5"
                width={titlePlateWidth - 7}
                height="29"
                fill="none"
                stroke={INK}
                strokeWidth="0.6"
              />
              <circle cx="9" cy="9" r="1.2" fill={INK} />
              <circle cx={titlePlateWidth - 9} cy="9" r="1.2" fill={INK} />
              <circle cx="9" cy="27" r="1.2" fill={INK} />
              <circle cx={titlePlateWidth - 9} cy="27" r="1.2" fill={INK} />
              <text
                x={titlePlateWidth / 2}
                y="23"
                textAnchor="middle"
                fontSize="13.5"
                fontWeight="700"
                fill={INK}
                style={{
                  fontFamily: '"Playfair Display", "Spectral", Georgia, serif',
                  letterSpacing: '0.1em',
                }}
              >
                {titlePlateLabel}
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* Bottom-Left Minimal View-Only Map Controls */}
      <div
        data-map-interactive="true"
        className="absolute bottom-4 left-4 z-20 flex items-center gap-1 border border-[#111111] bg-[#FAF8F4]/96 p-1 text-[#111111] shadow-sm backdrop-blur-xs"
      >
        <button
          type="button"
          onClick={() => setShowZones((v) => !v)}
          className={`flex items-center gap-1 px-2 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
            showZones ? 'bg-[#111111]/10 text-[#111111]' : 'text-[#6B665D] hover:bg-[#E7E3DA]'
          }`}
          title="Bật/tắt đường khoanh vùng"
        >
          {showZones ? <Eye size={13} /> : <EyeOff size={13} />}
          <span>Khoanh vùng</span>
        </button>

        <div className="mx-0.5 h-4 w-px bg-[#111111]/25" />

        <button
          type="button"
          onClick={() => setZoom((z) => Math.max(0.75, Number((z - 0.15).toFixed(2))))}
          className="p-1 hover:bg-[#E7E3DA]"
          aria-label="Thu nhỏ"
          title="Thu nhỏ"
        >
          <Minus size={13} />
        </button>
        <span className="w-10 text-center font-mono text-[11px] tabular-nums">
          {Math.round(zoom * 100)}%
        </span>
        <button
          type="button"
          onClick={() => setZoom((z) => Math.min(2.6, Number((z + 0.15).toFixed(2))))}
          className="p-1 hover:bg-[#E7E3DA]"
          aria-label="Phóng to"
          title="Phóng to"
        >
          <Plus size={13} />
        </button>
        <button
          type="button"
          onClick={resetViewport}
          className="p-1 hover:bg-[#E7E3DA]"
          aria-label="Vừa khung"
          title="Vừa khung"
        >
          <Maximize2 size={13} />
        </button>
      </div>
    </div>
  );
}
