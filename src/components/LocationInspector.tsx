import React from 'react';
import { ArrowRight, MapPin, X } from 'lucide-react';
import {
  LOCATION_STATUS_LABELS,
  LOCATION_TYPE_LABELS,
  ROUTE_STATUS_LABELS,
  ROUTE_TYPE_LABELS,
} from '../data/storyEngine';
import type { StoryLocation, StoryRoute, StoryWorldState } from '../types/story';

interface LocationInspectorProps {
  world: StoryWorldState;
  selectedLocation: StoryLocation | null;
  selectedRoute: StoryRoute | null;
  onClose: () => void;
  onSetPlayerHere: (locationId: string) => void;
  onEnterNorsvale?: () => void;
}

export default function LocationInspector({
  world,
  selectedLocation,
  selectedRoute,
  onClose,
  onSetPlayerHere,
  onEnterNorsvale,
}: LocationInspectorProps) {
  if (!selectedLocation && !selectedRoute) return null;

  if (selectedLocation) {
    const presentCharacters = world.characters.filter((c) => c.locationId === selectedLocation.id);
    const isNorsvaleOverworld = selectedLocation.id === 'loc-norsvale';

    return (
      <aside className="absolute top-14 right-3 z-30 w-76 max-h-[calc(100%-6rem)] overflow-y-auto border border-[#111111] bg-[#FAF8F4] text-[#111111] shadow-[4px_4px_0_rgba(17,17,17,0.16)]">
        <div className="flex items-center justify-between border-b border-[#111111] bg-[#F2EFE8] px-4 py-2.5">
          <div>
            {selectedLocation.altName && (
              <p className="text-[11px] italic text-[#55524B]">{selectedLocation.altName}</p>
            )}
            <h2 className="font-display text-sm font-bold tracking-wide uppercase text-[#111111]">
              · {selectedLocation.name} ·
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#3D3A35] hover:bg-[#E4E0D6] hover:text-[#111111]"
            aria-label="Đóng"
          >
            <X size={15} />
          </button>
        </div>

        <div className="space-y-3 p-4 text-xs">
          {isNorsvaleOverworld && onEnterNorsvale && (
            <button
              type="button"
              onClick={onEnterNorsvale}
              className="flex w-full items-center justify-between border border-[#111111] bg-[#111111] px-3 py-2 text-xs font-semibold text-[#FAF8F4] transition-colors hover:bg-[#8B1E1E]"
            >
              <span>Vào sơ đồ bên trong Bắc Ải</span>
              <ArrowRight size={14} />
            </button>
          )}

          <div className="grid grid-cols-2 gap-2 border-b border-[#111111]/15 pb-2.5 text-[11px]">
            <div>
              <p className="text-[#6B665D]">Loại hình</p>
              <p className="font-semibold text-[#111111]">
                {LOCATION_TYPE_LABELS[selectedLocation.type]}
              </p>
            </div>
            <div>
              <p className="text-[#6B665D]">Trạng thái</p>
              <p className="font-semibold text-[#111111]">
                {LOCATION_STATUS_LABELS[selectedLocation.status]}
              </p>
            </div>
            {selectedLocation.ruler && (
              <div className="col-span-2 pt-1">
                <p className="text-[#6B665D]">Kiểm soát / Lãnh chúa</p>
                <p className="font-semibold text-[#111111]">{selectedLocation.ruler}</p>
              </div>
            )}
          </div>

          <p className="leading-relaxed text-[#2A2824]">{selectedLocation.summary}</p>

          <div className="border-t border-[#111111]/15 pt-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold">Hiện diện ({presentCharacters.length})</span>
              <button
                type="button"
                onClick={() => onSetPlayerHere(selectedLocation.id)}
                className="flex items-center gap-1 font-semibold text-[#8B1E1E] hover:underline whitespace-nowrap shrink-0"
              >
                <MapPin size={12} />
                <span>Đặt dấu vị trí tại đây</span>
              </button>
            </div>
            {presentCharacters.length > 0 ? (
              <ul className="mt-1.5 space-y-1 text-[#3D3A35]">
                {presentCharacters.map((c) => (
                  <li key={c.id} className="truncate">
                    <span
                      className={`font-semibold ${
                        c.isPlayer ? 'text-[#8B1E1E]' : 'text-[#111111]'
                      }`}
                    >
                      {c.name}
                    </span>{' '}
                    · {c.role}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-[#6B665D]">Chưa có nhân vật tại khu vực này.</p>
            )}
          </div>
        </div>
      </aside>
    );
  }

  if (selectedRoute) {
    const fromLoc = world.locations.find((l) => l.id === selectedRoute.fromId);
    const toLoc = world.locations.find((l) => l.id === selectedRoute.toId);

    return (
      <aside className="absolute top-14 right-3 z-30 w-72 border border-[#111111] bg-[#FAF8F4] text-[#111111] shadow-[4px_4px_0_rgba(17,17,17,0.16)]">
        <div className="flex items-center justify-between border-b border-[#111111] bg-[#F2EFE8] px-4 py-2.5">
          <div>
            <p className="text-[10px] text-[#55524B]">Tuyến đường</p>
            <h2 className="font-display text-sm font-bold text-[#111111]">
              {fromLoc?.name ?? '?'} → {toLoc?.name ?? '?'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#3D3A35] hover:bg-[#E4E0D6]"
            aria-label="Đóng"
          >
            <X size={15} />
          </button>
        </div>

        <div className="space-y-2 p-4 text-xs">
          <p className="font-semibold text-[#111111]">{selectedRoute.label}</p>
          <div className="flex items-center justify-between text-[11px] text-[#55524B]">
            <span>{ROUTE_TYPE_LABELS[selectedRoute.type]}</span>
            <span className="font-semibold text-[#111111]">
              {ROUTE_STATUS_LABELS[selectedRoute.status]}
            </span>
          </div>
        </div>
      </aside>
    );
  }

  return null;
}
