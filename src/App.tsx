import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Code2, Map as MapIcon, MapPin, RotateCcw, Shield, Terminal, X } from 'lucide-react';
import {
  INITIAL_STORY_WORLD,
  MAP_SCOPE_LABELS,
  resolvePlayerPosition,
} from './data/storyEngine';
import StoryMapCanvas from './components/StoryMapCanvas';
import LocationInspector from './components/LocationInspector';
import PlaygroundBridgeView from './components/PlaygroundBridgeView';
import SlashCommandDrawer from './components/SlashCommandDrawer';
import type { MapScope, StoryWorldState } from './types/story';

const STORAGE_KEY = 'valeroth-engraving-map-v28';

function loadInitialWorld(): StoryWorldState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as StoryWorldState;
      if (parsed && Array.isArray(parsed.locations) && parsed.locations.length >= 17) {
        return parsed;
      }
    }
  } catch {
    // Ignore storage errors
  }
  return INITIAL_STORY_WORLD;
}

export default function App() {
  const [world, setWorld] = useState<StoryWorldState>(() => loadInitialWorld());
  const [activeScope, setActiveScope] = useState<MapScope>(() => world.activeMapScope ?? 'valeroth');
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [highlightedLocationIds, setHighlightedLocationIds] = useState<string[]>([]);
  const [focusLocationId, setFocusLocationId] = useState<string | null>(null);
  const [showPlayerMapCard, setShowPlayerMapCard] = useState(false);
  const [isBridgeOpen, setIsBridgeOpen] = useState(false);
  const [isCommandDrawerOpen, setIsCommandDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...world, activeMapScope: activeScope }));
    } catch {
      // Ignore storage quota errors
    }
  }, [world, activeScope]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || target?.isContentEditable) return;
      e.preventDefault();
      setIsCommandDrawerOpen(true);
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const playerPosition = useMemo(() => resolvePlayerPosition(world), [world]);

  const flashHighlights = useCallback((ids: string[]) => {
    if (ids.length === 0) return;
    setHighlightedLocationIds(ids);
    setTimeout(() => {
      setHighlightedLocationIds([]);
    }, 4200);
  }, []);

  const handleScopeChange = useCallback((nextScope: MapScope) => {
    setActiveScope(nextScope);
    setSelectedLocationId(null);
    setWorld((prev) => ({ ...prev, activeMapScope: nextScope }));
  }, []);

  const triggerPlayerMap = useCallback(() => {
    const nextScope = playerPosition.recommendedScope;
    setActiveScope(nextScope);
    setSelectedLocationId(null);
    setShowPlayerMapCard(true);

    const focusLoc = playerPosition.displayLocationForScope(nextScope) ?? playerPosition.exactLocation;
    if (focusLoc) {
      setTimeout(() => {
        setFocusLocationId(focusLoc.id);
        flashHighlights([focusLoc.id]);
      }, 40);
    }
  }, [playerPosition, flashHighlights]);

  const handleResetWorld = () => {
    setWorld(INITIAL_STORY_WORLD);
    setActiveScope('valeroth');
    setShowPlayerMapCard(false);
    setSelectedLocationId(null);
  };

  const selectedLocation = world.locations.find((l) => l.id === selectedLocationId) ?? null;

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#EAE6DC] text-[#111111]">
      {/* Full-Viewport Ink-Engraved Map (Valeroth ↔ Bên trong Bắc Ải) */}
      <StoryMapCanvas
        world={world}
        activeScope={activeScope}
        selectedLocationId={selectedLocationId}
        highlightedLocationIds={highlightedLocationIds}
        focusLocationId={focusLocationId}
        isPlayerMapHighlighted={showPlayerMapCard}
        onClearFocus={() => setFocusLocationId(null)}
        onSelectLocation={setSelectedLocationId}
        onEnterNorsvale={() => handleScopeChange('norsvale')}
      />

      {/* Top-Center Layer Switcher: Toàn cảnh Valeroth | Bên trong Bắc Ải */}
      <div className="absolute top-3 left-1/2 z-20 -translate-x-1/2 flex items-center border border-[#111111] bg-[#FAF8F4]/96 p-0.5 shadow-[3px_3px_0_rgba(17,17,17,0.14)] backdrop-blur-xs">
        <button
          type="button"
          onClick={() => handleScopeChange('valeroth')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
            activeScope === 'valeroth'
              ? 'bg-[#111111] text-[#FAF8F4]'
              : 'text-[#111111] hover:bg-[#E7E3DA]'
          }`}
        >
          <MapIcon size={13} />
          <span>Vương quốc Valeroth</span>
          {playerPosition.recommendedScope === 'valeroth' && (
            <MapPin size={12} className="text-[#B83232]" />
          )}
        </button>

        <div className="h-4 w-px bg-[#111111]/25" />

        <button
          type="button"
          onClick={() => handleScopeChange('norsvale')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
            activeScope === 'norsvale'
              ? 'bg-[#111111] text-[#FAF8F4]'
              : 'text-[#111111] hover:bg-[#E7E3DA]'
          }`}
        >
          <Shield size={13} />
          <span>Thành Bắc Ải</span>
          {playerPosition.recommendedScope === 'norsvale' && (
            <MapPin size={12} className="text-[#B83232]" />
          )}
        </button>
      </div>

      {/* Minimal Top-Right Controls: Lệnh / + /map + GitHub jsDelivr + Reset */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1 border border-[#111111] bg-[#FAF8F4]/96 p-1 shadow-sm backdrop-blur-xs">
        <button
          type="button"
          onClick={() => setIsCommandDrawerOpen((v) => !v)}
          className={`flex items-center gap-1 border px-2.5 py-1.5 font-mono text-[11px] font-semibold transition-colors whitespace-nowrap shrink-0 ${
            isCommandDrawerOpen
              ? 'border-[#111111] bg-[#111111] text-[#FAF8F4]'
              : 'border-[#111111]/45 bg-[#FAF8F4] text-[#111111] hover:bg-[#E7E3DA]'
          }`}
          title="Mở bảng Slash Command kết nối GitHub Raw (/transfer, /recap)"
        >
          <Terminal size={12} />
          <span>Lệnh /</span>
        </button>

        <button
          type="button"
          onClick={triggerPlayerMap}
          className="flex items-center gap-1 border border-[#8B1E1E] bg-[#FAF8F4] px-2.5 py-1.5 font-mono text-[11px] font-semibold text-[#8B1E1E] transition-colors hover:bg-[#8B1E1E] hover:text-[#FAF8F4] whitespace-nowrap shrink-0"
          title="Hiển thị vị trí đứng hiện tại của bạn (/map)"
        >
          <MapPin size={12} />
          <span>/map</span>
        </button>

        <button
          type="button"
          onClick={() => setIsBridgeOpen(true)}
          className="flex items-center gap-1.5 bg-[#111111] px-3 py-1.5 text-xs font-semibold text-[#FAF8F4] transition-colors hover:bg-[#8B1E1E] whitespace-nowrap shrink-0"
        >
          <Code2 size={13} />
          <span>GitHub · jsDelivr</span>
        </button>

        <button
          type="button"
          onClick={handleResetWorld}
          className="p-1.5 text-[#111111] hover:bg-[#E7E3DA]"
          title="Đặt lại bản đồ gốc"
          aria-label="Đặt lại"
        >
          <RotateCcw size={13} />
        </button>
      </div>

      {/* Clean Territory Inspector on Click */}
      <LocationInspector
        world={world}
        selectedLocation={selectedLocation}
        onClose={() => setSelectedLocationId(null)}
        onEnterNorsvale={() => handleScopeChange('norsvale')}
      />

      {/* Floating Bottom-Center `/map` Current Position Card */}
      {showPlayerMapCard && playerPosition.exactLocation && (
        <div className="pointer-events-none absolute right-4 bottom-4 left-4 z-20 flex flex-col items-center">
          <div className="pointer-events-auto w-full max-w-lg border border-[#111111] bg-[#FAF8F4]/98 text-[#111111] shadow-[4px_4px_0_rgba(17,17,17,0.18)]">
            <div className="flex items-center justify-between border-b border-[#111111]/25 bg-[#F2EFE8] px-3.5 py-2">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-[#8B1E1E]" />
                <span className="font-mono text-[11px] font-semibold text-[#8B1E1E]">/map</span>
                <span className="font-display text-xs font-bold tracking-wide uppercase">
                  {playerPosition.exactLocation.name}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowPlayerMapCard(false)}
                className="p-0.5 text-[#55524B] hover:text-[#111111]"
                aria-label="Đóng thẻ vị trí"
              >
                <X size={14} />
              </button>
            </div>

            <div className="space-y-2 px-3.5 py-2.5 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#55524B]">
                <span>
                  Lớp bản đồ:{' '}
                  <strong className="text-[#111111]">
                    {MAP_SCOPE_LABELS[playerPosition.recommendedScope]}
                  </strong>
                  {playerPosition.interiorLocation && ' · Thành Bắc Ải'}
                </span>
                {playerPosition.interiorLocation && (
                  <button
                    type="button"
                    onClick={() =>
                      handleScopeChange(activeScope === 'norsvale' ? 'valeroth' : 'norsvale')
                    }
                    className="font-semibold text-[#8B1E1E] hover:underline whitespace-nowrap"
                  >
                    {activeScope === 'norsvale'
                      ? 'Xem trên Vương quốc Valeroth'
                      : 'Phóng vào Thành Bắc Ải'}
                  </button>
                )}
              </div>

              <p className="leading-relaxed text-[#111111]">{playerPosition.status}</p>
            </div>
          </div>
        </div>
      )}

      {/* GitHub Raw Slash Command Drawer (/transfer, /recap, /map) */}
      <SlashCommandDrawer
        isOpen={isCommandDrawerOpen}
        onClose={() => setIsCommandDrawerOpen(false)}
        onTriggerMap={triggerPlayerMap}
      />

      {/* GitHub + jsDelivr Modal */}
      {isBridgeOpen && (
        <PlaygroundBridgeView
          world={{ ...world, activeMapScope: activeScope }}
          onClose={() => setIsBridgeOpen(false)}
        />
      )}
    </div>
  );
}
