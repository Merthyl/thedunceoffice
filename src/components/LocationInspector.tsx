import React from 'react';
import { ArrowRight, X } from 'lucide-react';
import { getLocationScope } from '../data/storyEngine';
import type { StoryLocation, StoryWorldState } from '../types/story';

interface LocationInspectorProps {
  world: StoryWorldState;
  selectedLocation: StoryLocation | null;
  onClose: () => void;
  onEnterNorsvale?: () => void;
}

function normalizeNpcStatusLabel(raw?: string): 'Còn sống' | 'Đã chết' | 'Mất tích' {
  const s = (raw ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');
  if (
    s.includes('chet') ||
    s.includes('dead') ||
    s.includes('deceased') ||
    s.includes('tu vong') ||
    s.includes('hy sinh')
  ) {
    return 'Đã chết';
  }
  if (
    s.includes('mat tich') ||
    s.includes('missing') ||
    s.includes('bien mat') ||
    s.includes('khong ro')
  ) {
    return 'Mất tích';
  }
  return 'Còn sống';
}

export default function LocationInspector({
  world,
  selectedLocation,
  onClose,
  onEnterNorsvale,
}: LocationInspectorProps) {
  if (!selectedLocation) return null;

  const isNorsvaleOverworld = selectedLocation.id === 'loc-norsvale';
  const norsvaleInteriorIds = new Set(
    world.locations.filter((l) => getLocationScope(l) === 'norsvale').map((l) => l.id)
  );

  const presentNpcs = world.characters.filter((c) => {
    if (c.isPlayer) return false;
    if (c.locationId === selectedLocation.id) return true;
    if (isNorsvaleOverworld && norsvaleInteriorIds.has(c.locationId)) return true;
    return false;
  });

  const heading = selectedLocation.altName
    ? `${selectedLocation.name} (${selectedLocation.altName})`
    : selectedLocation.name;

  return (
    <aside className="absolute top-14 right-3 z-30 w-76 max-h-[calc(100%-6rem)] overflow-y-auto border border-[#111111] bg-[#FAF8F4] text-[#111111] shadow-[4px_4px_0_rgba(17,17,17,0.16)]">
      <div className="flex items-center justify-between border-b border-[#111111] bg-[#F2EFE8] px-4 py-2.5">
        <h2 className="font-display text-sm font-bold tracking-wide text-[#111111]">{heading}</h2>
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
        {selectedLocation.ruler && (
          <div>
            <span className="text-[#55524B]">Dưới quyền cai quản của: </span>
            <strong className="text-[#111111]">{selectedLocation.ruler}</strong>
          </div>
        )}

        {selectedLocation.summary && (
          <p className="leading-relaxed text-[#2E2C28]">{selectedLocation.summary}</p>
        )}

        {isNorsvaleOverworld && onEnterNorsvale && (
          <button
            type="button"
            onClick={onEnterNorsvale}
            className="flex w-full items-center justify-between border border-[#111111] bg-[#111111] px-3 py-2 text-xs font-semibold text-[#FAF8F4] transition-colors hover:bg-[#8B1E1E]"
          >
            <span>Vào Thành Bắc Ải</span>
            <ArrowRight size={14} />
          </button>
        )}

        <div className="border-t border-[#111111]/15 pt-2.5">
          <div className="mb-2 font-semibold text-[#111111]">NPC tại đây:</div>
          {presentNpcs.length > 0 ? (
            <ul className="space-y-2.5">
              {presentNpcs.map((c) => {
                const npcStatus = normalizeNpcStatusLabel(c.status);
                const borderClass =
                  npcStatus === 'Đã chết'
                    ? 'border-[#8B1E1E]'
                    : npcStatus === 'Mất tích'
                    ? 'border-[#6B665D]'
                    : 'border-[#111111]';
                const badgeClass =
                  npcStatus === 'Đã chết'
                    ? 'border-[#8B1E1E] bg-[#FAF2F0] text-[#8B1E1E]'
                    : npcStatus === 'Mất tích'
                    ? 'border-dashed border-[#6B665D] bg-[#F5F2EA] text-[#55524B]'
                    : 'border-[#111111]/40 bg-[#EFECE4] text-[#111111]';
                return (
                  <li
                    key={c.id}
                    className={`border-l-[2.5px] pl-2.5 py-0.5 ${borderClass}`}
                  >
                    <div className="flex flex-wrap items-center gap-1.5 leading-snug">
                      <span className="font-bold text-[#111111]">{c.name}</span>
                      <span
                        className={`inline-block border px-1.5 py-px text-[9.5px] font-bold uppercase tracking-[0.03em] leading-tight ${badgeClass}`}
                      >
                        {npcStatus}
                      </span>
                    </div>
                    <div className="mt-0.5 text-[11.5px] text-[#3D3A35]">
                      {c.role || 'Chưa rõ chức vụ'}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="italic text-[#6B665D]">Chưa có dữ liệu</p>
          )}
        </div>
      </div>
    </aside>
  );
}
