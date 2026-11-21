import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Check,
  Copy,
  Loader2,
  Send,
  Settings2,
  Terminal,
  Trash2,
  X,
} from 'lucide-react';
import {
  DEFAULT_GITHUB_BASE_URL,
  SLASH_COMMAND_LIST,
  fetchGithubRawCommand,
  normalizeBaseUrl,
  normalizeCommandInput,
  resolveGithubCommandFilename,
  type SlashCommandMeta,
} from '../config/githubCommands';

const BASE_URL_STORAGE_KEY = 'valeroth-github-raw-base-url-v1';

interface CommandFeedEntry {
  id: string;
  commandText: string;
  filename?: string;
  sourceUrl?: string;
  status: 'loading' | 'success' | 'error';
  content: string;
  errorMessage?: string;
}

interface SlashCommandDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerMap: () => void;
}

function loadSavedBaseUrl(): string {
  try {
    const saved = localStorage.getItem(BASE_URL_STORAGE_KEY);
    if (saved && saved.trim()) {
      return normalizeBaseUrl(saved);
    }
  } catch {
    // Ignore storage errors
  }
  return DEFAULT_GITHUB_BASE_URL;
}

export default function SlashCommandDrawer({
  isOpen,
  onClose,
  onTriggerMap,
}: SlashCommandDrawerProps) {
  const [githubBaseUrl, setGithubBaseUrl] = useState<string>(() => loadSavedBaseUrl());
  const [showSettings, setShowSettings] = useState(false);
  const [input, setInput] = useState('');
  const [entries, setEntries] = useState<CommandFeedEntry[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const feedEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(BASE_URL_STORAGE_KEY, normalizeBaseUrl(githubBaseUrl));
    } catch {
      // Ignore storage quota errors
    }
  }, [githubBaseUrl]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [isOpen]);

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [entries]);

  const trimmedStart = input.trimStart();
  const showSuggestions = trimmedStart.startsWith('/');

  const filteredSuggestions = useMemo(() => {
    if (!showSuggestions) return [];
    const query = trimmedStart.toLowerCase();
    return SLASH_COMMAND_LIST.filter(
      (item) =>
        item.command.toLowerCase().startsWith(query) ||
        (query === '/' && true) ||
        item.label.toLowerCase().includes(query.slice(1))
    );
  }, [showSuggestions, trimmedStart]);

  useEffect(() => {
    setSelectedSuggestionIndex(0);
  }, [trimmedStart]);

  const executeCommand = async (rawCommand: string) => {
    const cleaned = normalizeCommandInput(rawCommand);
    if (!cleaned) return;

    setInput('');

    // Local /map command — never sent to AI
    if (cleaned === '/map') {
      onTriggerMap();
      const entryId = `cmd-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setEntries((prev) => [
        ...prev,
        {
          id: entryId,
          commandText: '/map',
          status: 'success',
          content: 'Đã định vị vị trí hiện tại của bạn trực tiếp trên bản đồ.',
        },
      ]);
      return;
    }

    // Intercept configured GitHub Raw Slash Commands — ZERO AI / Gemini API call, ZERO chat history pollution
    const filename = resolveGithubCommandFilename(cleaned);
    if (filename) {
      const entryId = `cmd-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setEntries((prev) => [
        ...prev,
        {
          id: entryId,
          commandText: cleaned,
          filename,
          status: 'loading',
          content: '',
        },
      ]);

      try {
        const { text, url } = await fetchGithubRawCommand(githubBaseUrl, filename);
        setEntries((prev) =>
          prev.map((item) =>
            item.id === entryId
              ? {
                  ...item,
                  status: 'success',
                  content: text,
                  sourceUrl: url,
                }
              : item
          )
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Không thể tải tệp văn bản từ GitHub Raw.';
        setEntries((prev) =>
          prev.map((item) =>
            item.id === entryId
              ? {
                  ...item,
                  status: 'error',
                  errorMessage,
                }
              : item
          )
        );
      }
      return;
    }

    // Unrecognized command/text — strictly kept local without calling Gemini API
    const entryId = `cmd-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setEntries((prev) => [
      ...prev,
      {
        id: entryId,
        commandText: rawCommand.trim(),
        status: 'error',
        content: '',
        errorMessage:
          'Lệnh chưa được cấu hình. Hãy gõ "/" để chọn /transfer, /recap (tải nguyên văn từ GitHub Raw) hoặc /map.',
      },
    ]);
  };

  const handleSelectSuggestion = (item: SlashCommandMeta) => {
    void executeCommand(item.command);
    inputRef.current?.focus();
  };

  const handleCopyEntry = async (entry: CommandFeedEntry) => {
    if (!entry.content) return;
    try {
      await navigator.clipboard.writeText(entry.content);
      setCopiedId(entry.id);
      setTimeout(() => {
        setCopiedId((cur) => (cur === entry.id ? null : cur));
      }, 1800);
    } catch {
      setCopiedId(null);
    }
  };

  const handleDeleteEntry = (entryId: string) => {
    setEntries((prev) => prev.filter((item) => item.id !== entryId));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showSuggestions && filteredSuggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedSuggestionIndex((prev) => (prev + 1) % filteredSuggestions.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedSuggestionIndex(
          (prev) => (prev - 1 + filteredSuggestions.length) % filteredSuggestions.length
        );
        return;
      }
      if (e.key === 'Tab') {
        e.preventDefault();
        const picked = filteredSuggestions[selectedSuggestionIndex];
        if (picked) {
          setInput(picked.command);
        }
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        const exactMatch =
          resolveGithubCommandFilename(input) !== null || normalizeCommandInput(input) === '/map';
        if (exactMatch) {
          void executeCommand(input);
        } else {
          const picked = filteredSuggestions[selectedSuggestionIndex];
          if (picked) {
            void executeCommand(picked.command);
          } else {
            void executeCommand(input);
          }
        }
        return;
      }
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      void executeCommand(input);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <aside
      aria-label="Bảng lệnh Slash Command GitHub Raw"
      className="absolute top-16 right-3 bottom-4 z-30 flex w-[calc(100vw-1.5rem)] max-w-md flex-col border border-[#111111] bg-[#FAF8F4]/98 text-[#111111] shadow-[6px_6px_0_rgba(17,17,17,0.18)] backdrop-blur-xs"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-[#111111] bg-[#F2EFE8] px-3.5 py-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <Terminal size={14} className="shrink-0 text-[#8B1E1E]" />
          <span className="truncate font-display text-xs font-bold tracking-wide uppercase">
            Lệnh Nhanh · GitHub Raw
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setShowSettings((v) => !v)}
            className={`p-1 transition-colors ${
              showSettings
                ? 'bg-[#111111] text-[#FAF8F4]'
                : 'text-[#3D3A35] hover:bg-[#E4E0D6]'
            }`}
            title="Cấu hình nguồn GitHub Raw"
            aria-label="Cấu hình nguồn GitHub Raw"
          >
            <Settings2 size={14} />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#3D3A35] hover:bg-[#E4E0D6]"
            title="Đóng bảng lệnh"
            aria-label="Đóng bảng lệnh"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Collapsible GitHub Raw Base URL Setting */}
      {showSettings && (
        <div className="border-b border-[#111111]/25 bg-[#F5F3EE] px-3.5 py-2.5 text-xs space-y-2">
          <div className="flex items-center justify-between gap-2">
            <label htmlFor="github-raw-base-url" className="font-semibold text-[#111111]">
              GITHUB_BASE_URL
            </label>
            <button
              type="button"
              onClick={() => setGithubBaseUrl(DEFAULT_GITHUB_BASE_URL)}
              className="text-[11px] font-semibold text-[#8B1E1E] hover:underline"
            >
              Mặc định
            </button>
          </div>
          <input
            id="github-raw-base-url"
            type="text"
            value={githubBaseUrl}
            onChange={(e) => setGithubBaseUrl(e.target.value)}
            placeholder="https://raw.githubusercontent.com/<USER>/<REPO>/main/"
            spellCheck={false}
            className="w-full border border-[#111111]/40 bg-white px-2.5 py-1.5 font-mono text-[11px] focus:border-[#111111] focus:outline-none"
          />
          <p className="text-[11px] leading-relaxed text-[#55524B]">
            Tải thẳng <code className="font-mono text-[#111111]">transfer.txt</code> và{' '}
            <code className="font-mono text-[#111111]">recap.txt</code> từ GitHub Raw, không gọi AI
            và không ghi vào lịch sử hội thoại.
          </p>
        </div>
      )}

      {/* Command Output Stream */}
      <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-3">
        {entries.length === 0 ? (
          <div className="space-y-3 pt-2">
            <div className="border-l-2 border-[#8B1E1E] bg-[#F2EFE8]/70 px-3 py-2.5 text-xs leading-relaxed text-[#3D3A35]">
              Gõ <code className="font-mono font-semibold text-[#111111]">/transfer</code> hoặc{' '}
              <code className="font-mono font-semibold text-[#111111]">/recap</code> để tải và in
              nguyên văn tệp gốc từ GitHub Raw — <strong>không qua AI, 0 token</strong>.
            </div>

            <div className="space-y-1.5">
              <p className="font-mono text-[10px] font-semibold tracking-wider text-[#6B665D] uppercase">
                Bấm nhanh lệnh có sẵn
              </p>
              <div className="flex flex-wrap gap-1.5">
                {SLASH_COMMAND_LIST.map((item) => (
                  <button
                    key={item.command}
                    type="button"
                    onClick={() => void executeCommand(item.command)}
                    className="border border-[#111111]/40 bg-white px-2.5 py-1 font-mono text-xs font-semibold text-[#111111] transition-colors hover:border-[#8B1E1E] hover:bg-[#8B1E1E] hover:text-[#FAF8F4]"
                  >
                    {item.command}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="space-y-1.5">
              {/* Typed command bubble (paired for clean 1-click deletion) */}
              <div className="flex items-center justify-end">
                <span className="border border-[#111111] bg-[#111111] px-2.5 py-1 font-mono text-[11px] font-semibold text-[#FAF8F4]">
                  {entry.commandText}
                </span>
              </div>

              {/* Verbatim System Output Card */}
              <div className="border border-[#111111]/85 bg-white shadow-[2px_2px_0_rgba(17,17,17,0.12)]">
                <div className="flex items-center justify-between gap-2 border-b border-[#111111]/20 bg-[#F2EFE8] px-2.5 py-1.5">
                  <div className="flex items-center gap-1.5 min-w-0 font-mono text-[10px] text-[#55524B]">
                    <span className="font-bold text-[#8B1E1E] uppercase">Hệ thống</span>
                    {entry.filename && (
                      <>
                        <span>·</span>
                        <span className="truncate text-[#111111]">{entry.filename}</span>
                      </>
                    )}
                  </div>

                  {/* Compact Copy & Xóa corner actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {entry.status === 'success' && entry.content && (
                      <button
                        type="button"
                        onClick={() => void handleCopyEntry(entry)}
                        className="flex items-center gap-1 border border-[#111111]/35 bg-[#FAF8F4] px-2 py-0.5 text-[11px] font-medium text-[#111111] transition-colors hover:bg-[#111111] hover:text-[#FAF8F4]"
                        title="Sao chép toàn bộ văn bản"
                      >
                        {copiedId === entry.id ? <Check size={11} /> : <Copy size={11} />}
                        <span>{copiedId === entry.id ? 'Đã chép' : 'Copy'}</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="flex items-center gap-1 border border-[#8B1E1E]/40 bg-[#FAF8F4] px-2 py-0.5 text-[11px] font-medium text-[#8B1E1E] transition-colors hover:bg-[#8B1E1E] hover:text-[#FAF8F4]"
                      title="Xóa cả dòng lệnh và nội dung vừa in"
                    >
                      <Trash2 size={11} />
                      <span>Xóa</span>
                    </button>
                  </div>
                </div>

                <div className="p-3">
                  {entry.status === 'loading' && (
                    <div className="flex items-center gap-2 text-xs text-[#55524B]">
                      <Loader2 size={13} className="animate-spin text-[#8B1E1E]" />
                      <span>Đang tải {entry.filename} từ GitHub Raw...</span>
                    </div>
                  )}

                  {entry.status === 'error' && (
                    <p className="text-xs leading-relaxed text-[#8B1E1E]">{entry.errorMessage}</p>
                  )}

                  {entry.status === 'success' && (
                    <pre className="max-h-80 overflow-auto whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-[#111111]">
                      {entry.content}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={feedEndRef} />
      </div>

      {/* Input Area + Upward `/` Autocomplete Popover */}
      <div className="relative border-t border-[#111111] bg-[#F2EFE8] p-2.5">
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div
            role="listbox"
            aria-label="Gợi ý lệnh Slash Command"
            className="absolute right-2.5 bottom-full left-2.5 mb-1.5 border border-[#111111] bg-[#FAF8F4] shadow-[4px_4px_0_rgba(17,17,17,0.18)]"
          >
            <div className="border-b border-[#111111]/15 bg-[#F2EFE8] px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wider text-[#6B665D] uppercase">
              Gợi ý lệnh nhanh
            </div>
            <div className="divide-y divide-[#111111]/10">
              {filteredSuggestions.map((item, idx) => {
                const isActive = idx === selectedSuggestionIndex;
                return (
                  <button
                    key={item.command}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onMouseEnter={() => setSelectedSuggestionIndex(idx)}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelectSuggestion(item);
                    }}
                    className={`flex w-full items-start justify-between gap-2 px-2.5 py-2 text-left transition-colors ${
                      isActive ? 'bg-[#111111] text-[#FAF8F4]' : 'text-[#111111] hover:bg-[#E7E3DA]'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold">{item.command}</span>
                        {item.filename && (
                          <span
                            className={`font-mono text-[10px] ${
                              isActive ? 'text-[#EAE6DC]' : 'text-[#8B1E1E]'
                            }`}
                          >
                            → {item.filename}
                          </span>
                        )}
                      </div>
                      <p
                        className={`mt-0.5 text-[11px] ${
                          isActive ? 'text-[#DCD7CB]' : 'text-[#55524B]'
                        }`}
                      >
                        {item.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void executeCommand(input);
          }}
          className="flex items-center gap-1.5"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Gõ "/" để chọn lệnh (/transfer, /recap)...'
            autoComplete="off"
            spellCheck={false}
            className="flex-1 border border-[#111111]/55 bg-white px-2.5 py-1.5 font-mono text-xs text-[#111111] placeholder:font-sans placeholder:text-[#6B665D] focus:border-[#111111] focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="flex items-center gap-1 bg-[#111111] px-3 py-1.5 text-xs font-semibold text-[#FAF8F4] transition-colors hover:bg-[#8B1E1E] disabled:opacity-40"
            title="Chạy lệnh"
          >
            <Send size={12} />
            <span>Gửi</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
