import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Map as MapIcon,
  MapPin,
  RotateCcw,
  Shield,
  Terminal,
  Waypoints,
  X,
} from 'lucide-react';
import {
  applyMapQueryParams,
  executeStoryToolCall,
  getLocationScope,
  INITIAL_STORY_WORLD,
  MAP_SCOPE_LABELS,
  resolvePlayerPosition,
} from './data/storyEngine';
import StoryMapCanvas from './components/StoryMapCanvas';
import LocationInspector from './components/LocationInspector';
import PlaygroundBridgeView from './components/PlaygroundBridgeView';
import type { MapScope, StoryWorldState } from './types/story';

const STORAGE_KEY = 'valeroth-engraving-map-v5';

function hydrateWorld(parsed: StoryWorldState): StoryWorldState {
  const hasNorsvaleInterior = parsed.locations.some((l) => getLocationScope(l) === 'norsvale');
  const mergedLocations = hasNorsvaleInterior
    ? parsed.locations
    : [
        ...parsed.locations,
        ...INITIAL_STORY_WORLD.locations.filter((l) => getLocationScope(l) === 'norsvale'),
      ];

  const mergedRoutes = hasNorsvaleInterior
    ? parsed.routes
    : [
        ...parsed.routes,
        ...INITIAL_STORY_WORLD.routes.filter((r) => r.scope === 'norsvale'),
      ];

  return {
    ...parsed,
    activeMapScope: parsed.activeMapScope ?? 'valeroth',
    playerLocationId: parsed.playerLocationId ?? INITIAL_STORY_WORLD.playerLocationId,
    playerStatus: parsed.playerStatus ?? INITIAL_STORY_WORLD.playerStatus,
    locations: mergedLocations,
    routes: mergedRoutes,
  };
}

function decodeWorldFromHash(): StoryWorldState | null {
  try {
    const hash = window.location.hash;
    if (!hash || !hash.includes('world=')) return null;
    const rawParam = hash.split('world=')[1]?.split('&')[0];
    if (!rawParam) return null;
    const binary = atob(decodeURIComponent(rawParam));
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const json = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(json) as StoryWorldState;
    if (parsed && Array.isArray(parsed.locations) && Array.isArray(parsed.routes)) {
      return hydrateWorld(parsed);
    }
    return null;
  } catch {
    return null;
  }
}

function loadInitialBootstrap(): {
  world: StoryWorldState;
  scope: MapScope;
  autoOpenMap: boolean;
  focusLocationId: string | null;
} {
  let base: StoryWorldState = INITIAL_STORY_WORLD;
  const fromHash = decodeWorldFromHash();
  if (fromHash) {
    base = fromHash;
  } else {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StoryWorldState;
        if (parsed && Array.isArray(parsed.locations) && Array.isArray(parsed.routes)) {
          base = hydrateWorld(parsed);
        }
      }
    } catch {
      base = INITIAL_STORY_WORLD;
    }
  }

  const fromQuery = applyMapQueryParams(base, window.location.search);
  if (fromQuery) {
    return fromQuery;
  }

  return {
    world: base,
    scope: base.activeMapScope ?? 'valeroth',
    autoOpenMap: false,
    focusLocationId: null,
  };
}

export default function App() {
  const initialBootstrap = useMemo(() => loadInitialBootstrap(), []);
  const [world, setWorld] = useState<StoryWorldState>(initialBootstrap.world);
  const [activeScope, setActiveScope] = useState<MapScope>(initialBootstrap.scope);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [highlightedLocationIds, setHighlightedLocationIds] = useState<string[]>(
    initialBootstrap.focusLocationId ? [initialBootstrap.focusLocationId] : []
  );
  const [focusLocationId, setFocusLocationId] = useState<string | null>(
    initialBootstrap.focusLocationId
  );
  const [showPlayerMapCard, setShowPlayerMapCard] = useState(initialBootstrap.autoOpenMap);
  const [lastBridgeToast, setLastBridgeToast] = useState<string | null>(null);
  const [isBridgeOpen, setIsBridgeOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...world, activeMapScope: activeScope }));
    } catch {
      // Ignore storage quota errors
    }
  }, [world, activeScope]);

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
    setSelectedRouteId(null);
    setWorld((prev) => ({ ...prev, activeMapScope: nextScope }));
  }, []);

  const triggerPlayerMap = useCallback(
    (targetWorld: StoryWorldState, preferredView?: string) => {
      const outcome = executeStoryToolCall(targetWorld, 'show_player_map', {
        ...(preferredView ? { preferredView } : {}),
      });
      const nextScope =
        outcome.switchScope ?? resolvePlayerPosition(outcome.updatedWorld).recommendedScope;

      setWorld(outcome.updatedWorld);
      setActiveScope(nextScope);
      setSelectedLocationId(null);
      setSelectedRouteId(null);
      setShowPlayerMapCard(true);
      setLastBridgeToast(null);

      const pos = resolvePlayerPosition(outcome.updatedWorld);
      const focusLoc = pos.displayLocationForScope(nextScope) ?? pos.exactLocation;
      if (focusLoc) {
        setTimeout(() => {
          setFocusLocationId(focusLoc.id);
          flashHighlights([focusLoc.id]);
        }, 40);
      }
    },
    [flashHighlights]
  );

  const handleSetPlayerHere = useCallback(
    (locationId: string) => {
      const target = world.locations.find((l) => l.id === locationId);
      if (!target) return;
      const outcome = executeStoryToolCall(world, 'set_player_location', {
        targetLocationName: target.name,
        markRouteTraversed: true,
      });
      setWorld(outcome.updatedWorld);
      if (outcome.switchScope) {
        setActiveScope(outcome.switchScope);
      }
      flashHighlights([locationId]);
    },
    [world, flashHighlights]
  );

  const handleExecuteRawBridgeCalls = useCallback(
    (calls: Array<{ name: string; args?: Record<string, unknown> }>) => {
      let workingWorld = world;
      const responses: Array<{ name: string; response: Record<string, unknown> }> = [];
      const summaries: string[] = [];
      const affected: string[] = [];
      let nextScope: MapScope | undefined;
      let shouldShowMap = false;

      for (const call of calls) {
        const outcome = executeStoryToolCall(workingWorld, call.name, call.args ?? {});
        workingWorld = outcome.updatedWorld;
        responses.push({ name: call.name, response: outcome.result });
        summaries.push(outcome.summary);
        affected.push(...outcome.affectedLocationIds);
        if (outcome.switchScope) nextScope = outcome.switchScope;
        if (outcome.showPlayerMap) shouldShowMap = true;
      }

      setWorld(workingWorld);
      if (nextScope) {
        setActiveScope(nextScope);
      }
      if (shouldShowMap) {
        setShowPlayerMapCard(true);
        const pos = resolvePlayerPosition(workingWorld);
        const focusScope = nextScope ?? pos.recommendedScope;
        const focusLoc = pos.displayLocationForScope(focusScope) ?? pos.exactLocation;
        if (focusLoc) {
          setTimeout(() => {
            setFocusLocationId(focusLoc.id);
            flashHighlights([focusLoc.id]);
          }, 50);
        }
      } else if (affected.length > 0) {
        flashHighlights(affected);
      }

      setLastBridgeToast(summaries.join(' · ') || 'Đã thực thi hàm lên bản đồ.');

      return { responses, summaries };
    },
    [world, flashHighlights]
  );

  const handleResetWorld = () => {
    setWorld(INITIAL_STORY_WORLD);
    setActiveScope('valeroth');
    setLastBridgeToast(null);
    setShowPlayerMapCard(false);
    setSelectedLocationId(null);
    setSelectedRouteId(null);
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  const selectedLocation = world.locations.find((l) => l.id === selectedLocationId) ?? null;
  const selectedRoute = world.routes.find((r) => r.id === selectedRouteId) ?? null;

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#EAE6DC] text-[#111111]">
      {/* Full-Viewport Ink-Engraved Map (Valeroth ↔ Bên trong Bắc Ải) */}
      <StoryMapCanvas
        world={world}
        activeScope={activeScope}
        selectedLocationId={selectedLocationId}
        selectedRouteId={selectedRouteId}
        highlightedLocationIds={highlightedLocationIds}
        focusLocationId={focusLocationId}
        isPlayerMapHighlighted={showPlayerMapCard}
        onClearFocus={() => setFocusLocationId(null)}
        onSelectLocation={setSelectedLocationId}
        onSelectRoute={setSelectedRouteId}
        onEnterNorsvale={() => handleScopeChange('norsvale')}
      />

      {/* Top-Center Mode Switcher: Toàn cảnh Valeroth | Bên trong Bắc Ải */}
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
          <span>Toàn cảnh Valeroth</span>
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
          <span>Bên trong Bắc Ải</span>
          {playerPosition.recommendedScope === 'norsvale' && (
            <MapPin size={12} className="text-[#B83232]" />
          )}
        </button>
      </div>

      {/* Minimal Top-Right Controls: /map + Function + Reset */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1 border border-[#111111] bg-[#FAF8F4]/96 p-1 shadow-sm backdrop-blur-xs">
        <button
          type="button"
          onClick={() => triggerPlayerMap(world)}
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
          <Waypoints size={13} />
          <span>jsDelivr / Function</span>
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

      {/* Clean Read-Only Territory / Route Inspector on Click */}
      <LocationInspector
        world={world}
        selectedLocation={selectedLocation}
        selectedRoute={selectedRoute}
        onClose={() => {
          setSelectedLocationId(null);
          setSelectedRouteId(null);
        }}
        onSetPlayerHere={handleSetPlayerHere}
        onEnterNorsvale={() => handleScopeChange('norsvale')}
      />

      {/* Floating Bottom-Center `/map` Current Position Card & Function Execution Notice */}
      {(showPlayerMapCard || lastBridgeToast) && (
        <div className="pointer-events-none absolute right-4 bottom-4 left-4 z-20 flex flex-col items-center gap-2">
          {showPlayerMapCard && playerPosition.exactLocation && (
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
                    {playerPosition.interiorLocation && ' · Pháo đài Bắc Ải'}
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
                        ? 'Xem trên toàn cảnh Valeroth'
                        : 'Phóng vào bên trong Bắc Ải'}
                    </button>
                  )}
                </div>

                <p className="leading-relaxed text-[#111111]">{playerPosition.status}</p>

                {playerPosition.nearbyLocations.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 border-t border-[#111111]/15 pt-2">
                    <span className="text-[11px] font-semibold text-[#55524B]">Lối đi gần đây:</span>
                    {playerPosition.nearbyLocations.map((near) => (
                      <button
                        key={near.id}
                        type="button"
                        onClick={() => handleSetPlayerHere(near.id)}
                        className="border border-[#111111]/35 bg-white px-2 py-0.5 text-[11px] font-medium text-[#111111] transition-colors hover:border-[#8B1E1E] hover:text-[#8B1E1E]"
                      >
                        → {near.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {lastBridgeToast && (
            <div className="pointer-events-auto flex max-w-lg items-center gap-2 border border-[#111111] bg-[#FAF8F4]/98 px-3.5 py-2 text-xs text-[#111111] shadow-md">
              <Terminal size={13} className="shrink-0 text-[#8B1E1E]" />
              <span className="flex-1">{lastBridgeToast}</span>
              <button
                type="button"
                onClick={() => setLastBridgeToast(null)}
                className="text-[#55524B] hover:text-[#111111]"
                aria-label="Đóng"
              >
                <X size={13} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Function Calling Panel Modal */}
      {isBridgeOpen && (
        <PlaygroundBridgeView
          world={{ ...world, activeMapScope: activeScope }}
          onExecuteRawCalls={handleExecuteRawBridgeCalls}
          onClose={() => setIsBridgeOpen(false)}
        />
      )}
    </div>
  );
}
