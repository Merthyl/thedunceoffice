import React, { useMemo, useState } from 'react';
import { Check, Code2, Copy, Download, ExternalLink, X } from 'lucide-react';
import { getLocationScope } from '../data/storyEngine';
import { buildUnifiedJsDelivrSystemPrompt } from '../data/rpCommands';
import type { StoryWorldState } from '../types/story';

interface PlaygroundBridgeModalProps {
  world: StoryWorldState;
  onClose: () => void;
}

const DEFAULT_RP_SAMPLE = JSON.stringify(
  {
    world: 'kaldor-valeroth',
    mode: 'map',
    view: 'norsvale',
    playerLoc: 'loc-nors-kitchen',
    chapter: 'Đêm 14 · Bắc Ải',
    status: 'Đang có mặt tại Bếp & Hậu Cần dưới dinh thự Bắc Ải.',
    npcs: [
      {
        name: 'Quản gia Ervin',
        loc: 'loc-nors-kitchen',
        role: 'Quản gia dinh thự Bắc Ải',
        status: 'Còn sống',
      },
      {
        name: 'Vemor Gislebertus',
        loc: 'loc-nors-tavern',
        role: 'Cánh tay phải của Kaldor',
        status: 'Còn sống',
      },
      {
        name: 'Sir Aldric',
        loc: 'loc-nors-keep',
        role: 'Cố sư phụ của Kaldor',
        status: 'Đã chết',
      },
    ],
  },
  null,
  2
);

export default function PlaygroundBridgeView({
  world,
  onClose,
}: PlaygroundBridgeModalProps) {
  const [copiedBlock, setCopiedBlock] = useState<string | null>(null);
  const [githubRepo, setGithubRepo] = useState('Merthyl/thedunceoffice');
  const [commitSha, setCommitSha] = useState('main');
  const [repoLayout, setRepoLayout] = useState<'aistudio' | 'zip'>('aistudio');
  const [promptMode, setPromptMode] = useState<'markdown' | 'url-context'>('markdown');
  const [includeWorldLore, setIncludeWorldLore] = useState(false);
  const [rpPreviewJson, setRpPreviewJson] = useState(DEFAULT_RP_SAMPLE);

  const cleanRepo =
    githubRepo
      .trim()
      .replace(/^https?:\/\/github\.com\//, '')
      .replace(/\.git$/i, '')
      .replace(/^\/+|\/+$/g, '') || 'Merthyl/thedunceoffice';
  const cleanSha = commitSha.trim() || 'main';
  const baseCdn = `https://cdn.jsdelivr.net/gh/${cleanRepo}@${cleanSha}`;
  const rawBase = `https://raw.githubusercontent.com/${cleanRepo}/${cleanSha}`;

  const jsDelivrEngineUrl =
    repoLayout === 'aistudio'
      ? `${baseCdn}/public/github-kit/engine.js`
      : `${baseCdn}/engine.js`;
  const jsDelivrWorldUrl =
    repoLayout === 'aistudio'
      ? `${baseCdn}/public/github-kit/worlds/kaldor-valeroth.js`
      : `${baseCdn}/worlds/kaldor-valeroth.js`;

  const overworldList = useMemo(
    () =>
      world.locations
        .filter((l) => getLocationScope(l) === 'valeroth')
        .map((l) => `- "${l.id}" : ${l.name} (${l.altName ?? l.region})`)
        .join('\n'),
    [world.locations]
  );

  const norsvaleList = useMemo(
    () =>
      world.locations
        .filter((l) => getLocationScope(l) === 'norsvale')
        .map((l) => `- "${l.id}" : ${l.name} (${l.altName ?? l.region})`)
        .join('\n'),
    [world.locations]
  );

  const jsDelivrSystemPrompt = useMemo(
    () =>
      buildUnifiedJsDelivrSystemPrompt({
        jsDelivrEngineUrl,
        jsDelivrWorldUrl,
        overworldList,
        norsvaleList,
        textCommandsMode: promptMode,
        includeWorldLore,
        commandDocsUrls: {
          mapKaldor: `${rawBase}/map-kaldor.txt`,
          recap: `${rawBase}/recap.txt`,
          transfer: `${rawBase}/transfer.txt`,
        },
      }),
    [
      jsDelivrEngineUrl,
      jsDelivrWorldUrl,
      overworldList,
      norsvaleList,
      promptMode,
      includeWorldLore,
      rawBase,
    ]
  );

  const chatTriggerLines = useMemo(
    () => [
      { id: 'trigger-map', label: '/map', text: `/map ${rawBase}/map-kaldor.txt` },
      { id: 'trigger-recap', label: '/recap', text: `/recap ${rawBase}/recap.txt` },
      { id: 'trigger-transfer', label: '/transfer', text: `/transfer ${rawBase}/transfer.txt` },
    ],
    [rawBase]
  );

  const livePreviewSrcDoc = useMemo(() => {
    let parsed: Record<string, unknown> = {};
    try {
      parsed = JSON.parse(rpPreviewJson) as Record<string, unknown>;
    } catch {
      return null;
    }

    const injectedData = {
      ...parsed,
      assets: {
        valeroth: '/github-kit/assets/kaldor/valeroth.jpg',
        norsvale: '/github-kit/assets/kaldor/norsvale.jpg',
      },
    };

    const safeJson = JSON.stringify(injectedData).replace(/</g, '\\u003c');
    return `<!doctype html>
<html lang="vi">
<head><meta charset="UTF-8" /><style>body{margin:0;padding:8px;background:#EAE6DC;}</style></head>
<body>
  <div id="rp-app"></div>
  <script>window.RP_DATA = ${safeJson};</script>
  <script src="/github-kit/worlds/kaldor-valeroth.js"></script>
  <script src="/github-kit/engine.js"></script>
</body>
</html>`;
  }, [rpPreviewJson]);

  const handleCopy = async (id: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedBlock(id);
      setTimeout(() => setCopiedBlock((prev) => (prev === id ? null : prev)), 1800);
    } catch {
      setCopiedBlock(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111111]/55 p-4 backdrop-blur-xs">
      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden border border-[#111111] bg-[#FAF8F4] text-[#111111] shadow-[8px_8px_0_rgba(17,17,17,0.22)]">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-[#111111] bg-[#F2EFE8] px-5 py-3">
          <div className="flex items-center gap-2">
            <Code2 size={15} />
            <span className="font-display text-sm font-bold tracking-wide uppercase">
              GitHub + jsDelivr · Valeroth RP Kit
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#3D3A35] hover:bg-[#E4E0D6]"
            aria-label="Đóng"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* 01. Modular GitHub Package */}
          <section className="border border-[#111111] bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#111111]/25 bg-[#F2EFE8] px-4 py-2.5">
              <span className="font-display text-xs font-bold tracking-wide uppercase">
                01. Bộ mã nguồn Modular (Tách lõi dùng chung &amp; Bản đồ Kaldor)
              </span>
              <a
                href="/api/github-kit.zip"
                download="dunce-rp-modular-github-kit.zip"
                className="flex items-center gap-1.5 bg-[#111111] px-3.5 py-1.5 text-xs font-semibold text-[#FAF8F4] transition-colors hover:bg-[#8B1E1E] whitespace-nowrap"
              >
                <Download size={13} />
                <span>Tải trọn bộ GitHub (.zip)</span>
              </a>
            </div>

            <div className="p-4 text-xs space-y-3">
              <p className="text-[#3D3A35] leading-relaxed">
                Gồm <strong><code>engine.js</code></strong> (lõi vẽ bản đồ dùng chung),{' '}
                <strong><code>worlds/kaldor-valeroth.js</code></strong> (7 vùng Valeroth &amp; 10 khu vực bên trong Bắc Ải),{' '}
                <strong><code>worlds/_template.js</code></strong> và 2 ảnh bản đồ khắc mực mới nhất.
              </p>
              <div className="flex flex-wrap gap-2">
                <a
                  href="/github-kit/engine.js"
                  download="engine.js"
                  className="flex items-center gap-1 border border-[#111111]/40 bg-[#FAF8F4] px-2.5 py-1 font-mono text-[11px] hover:bg-[#E7E3DA]"
                >
                  <Download size={11} />
                  <span>engine.js</span>
                </a>
                <a
                  href="/github-kit/worlds/kaldor-valeroth.js"
                  download="kaldor-valeroth.js"
                  className="flex items-center gap-1 border border-[#111111]/40 bg-[#FAF8F4] px-2.5 py-1 font-mono text-[11px] hover:bg-[#E7E3DA]"
                >
                  <Download size={11} />
                  <span>worlds/kaldor-valeroth.js</span>
                </a>
                <a
                  href="/github-kit/worlds/_template.js"
                  download="_template.js"
                  className="flex items-center gap-1 border border-[#111111]/40 bg-[#FAF8F4] px-2.5 py-1 font-mono text-[11px] hover:bg-[#E7E3DA]"
                >
                  <Download size={11} />
                  <span>worlds/_template.js</span>
                </a>
                <a
                  href="/github-kit/index.html"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 border border-[#8B1E1E] px-2.5 py-1 text-[11px] font-semibold text-[#8B1E1E] hover:bg-[#8B1E1E] hover:text-[#FAF8F4]"
                >
                  <ExternalLink size={11} />
                  <span>Mở thử index.html</span>
                </a>
              </div>
            </div>
          </section>

          {/* 02. Repo + Commit SHA */}
          <section className="border border-[#111111] bg-white">
            <div className="border-b border-[#111111]/25 bg-[#F2EFE8] px-4 py-2">
              <span className="font-display text-xs font-bold tracking-wide uppercase">
                02. Repo GitHub &amp; Commit SHA (jsDelivr)
              </span>
            </div>
            <div className="p-4 space-y-3 text-xs">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block font-semibold">GitHub User / Repo</label>
                  <input
                    type="text"
                    value={githubRepo}
                    onChange={(e) => setGithubRepo(e.target.value)}
                    placeholder="vd: Merthyl/thedunceoffice"
                    className="w-full border border-[#111111]/40 bg-[#FAF8F4] px-2.5 py-1.5 font-mono text-xs focus:border-[#111111] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold">Commit SHA</label>
                  <input
                    type="text"
                    value={commitSha}
                    onChange={(e) => setCommitSha(e.target.value)}
                    placeholder="Dán Commit SHA mới sau khi push"
                    className="w-full border border-[#111111]/40 bg-[#FAF8F4] px-2.5 py-1.5 font-mono text-xs focus:border-[#111111] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold text-[#3D3A35]">Cấu trúc Repo:</span>
                <div className="flex border border-[#111111]/50 bg-white p-0.5">
                  <button
                    type="button"
                    onClick={() => setRepoLayout('aistudio')}
                    className={`px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                      repoLayout === 'aistudio'
                        ? 'bg-[#111111] text-[#FAF8F4]'
                        : 'text-[#111111] hover:bg-[#EAE6DC]'
                    }`}
                  >
                    Đẩy từ AI Studio (public/github-kit/)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRepoLayout('zip')}
                    className={`px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                      repoLayout === 'zip'
                        ? 'bg-[#111111] text-[#FAF8F4]'
                        : 'text-[#111111] hover:bg-[#EAE6DC]'
                    }`}
                  >
                    Giải nén .zip (thư mục gốc)
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 border border-[#111111]/25 bg-[#F5F3EE] px-3 py-2 font-mono text-[11px]">
                  <span className="truncate">
                    <strong className="font-sans text-[#3D3A35]">Map Kaldor:</strong> {jsDelivrWorldUrl}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy('jsdelivr-world', jsDelivrWorldUrl)}
                    className="flex items-center gap-1 font-sans text-xs font-semibold text-[#8B1E1E] hover:underline whitespace-nowrap shrink-0"
                  >
                    {copiedBlock === 'jsdelivr-world' ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedBlock === 'jsdelivr-world' ? 'Đã chép' : 'Sao chép'}</span>
                  </button>
                </div>
                <div className="flex items-center justify-between gap-2 border border-[#111111]/25 bg-[#F5F3EE] px-3 py-2 font-mono text-[11px]">
                  <span className="truncate">
                    <strong className="font-sans text-[#3D3A35]">Lõi chung:</strong> {jsDelivrEngineUrl}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy('jsdelivr-engine', jsDelivrEngineUrl)}
                    className="flex items-center gap-1 font-sans text-xs font-semibold text-[#8B1E1E] hover:underline whitespace-nowrap shrink-0"
                  >
                    {copiedBlock === 'jsdelivr-engine' ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedBlock === 'jsdelivr-engine' ? 'Đã chép' : 'Sao chép'}</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 03. System Instructions */}
          <section className="border border-[#111111] bg-white">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#111111]/25 bg-[#F2EFE8] px-4 py-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-display text-xs font-bold tracking-wide uppercase">
                  03. System Instructions (/map · /recap · /transfer)
                </span>
                <div className="flex border border-[#111111]/45 bg-white p-0.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setPromptMode('markdown')}
                    className={`px-2 py-0.5 font-semibold transition-colors ${
                      promptMode === 'markdown'
                        ? 'bg-[#111111] text-[#FAF8F4]'
                        : 'text-[#111111] hover:bg-[#EAE6DC]'
                    }`}
                  >
                    Cách 1 · Inline (Ổn định nhất)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPromptMode('url-context')}
                    className={`px-2 py-0.5 font-semibold transition-colors ${
                      promptMode === 'url-context'
                        ? 'bg-[#111111] text-[#FAF8F4]'
                        : 'text-[#111111] hover:bg-[#EAE6DC]'
                    }`}
                  >
                    Cách 2 · Gọn (Kèm link chat)
                  </button>
                </div>
                {promptMode === 'markdown' && (
                  <label className="flex cursor-pointer items-center gap-1.5 text-[11px] text-[#3D3A35] select-none">
                    <input
                      type="checkbox"
                      checked={includeWorldLore}
                      onChange={(e) => setIncludeWorldLore(e.target.checked)}
                      className="accent-[#8B1E1E]"
                    />
                    <span>Kèm Lore Valeroth (Section 3–4)</span>
                  </label>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleCopy('jsdelivr-prompt', jsDelivrSystemPrompt)}
                className="flex items-center gap-1 border border-[#111111]/45 bg-white px-2.5 py-1 text-xs font-medium hover:bg-[#EAE6DC]"
              >
                {copiedBlock === 'jsdelivr-prompt' ? <Check size={12} /> : <Copy size={12} />}
                <span>{copiedBlock === 'jsdelivr-prompt' ? 'Đã chép' : 'Sao chép Prompt'}</span>
              </button>
            </div>

            {promptMode === 'markdown' ? (
              <div className="border-b border-[#111111]/15 bg-[#FAF8F4] px-4 py-2 text-[11px] leading-relaxed text-[#3D3A35]">
                <strong>Ổn định 100%:</strong> Dán thẳng vào cuối System Instructions. Khi chơi chỉ cần gửi riêng{' '}
                <code className="font-mono font-semibold text-[#111111]">/map</code>,{' '}
                <code className="font-mono font-semibold text-[#111111]">/recap</code> hoặc{' '}
                <code className="font-mono font-semibold text-[#111111]">/transfer</code> — AI không cần tự mở link GitHub nên không bao giờ bị chặn URL.
              </div>
            ) : (
              <div className="space-y-1.5 border-b border-[#111111]/15 bg-[#FAF8F4] px-4 py-2.5 text-[11px] text-[#3D3A35]">
                <p className="leading-relaxed">
                  <strong>Lưu ý bảo mật URL:</strong> Công cụ duyệt web chỉ được phép mở link xuất hiện trong{' '}
                  <strong>tin nhắn người dùng</strong> (và repo phải bật <strong>Public</strong>). Hãy lưu 3 dòng dưới đây vào phím tắt gõ nhanh (Text Replacement) để gửi khi gọi lệnh:
                </p>
                <div className="space-y-1">
                  {chatTriggerLines.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-2 border border-[#111111]/20 bg-white px-2.5 py-1 font-mono text-[11px]"
                    >
                      <span className="truncate text-[#111111]">{item.text}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(item.id, item.text)}
                        className="flex items-center gap-1 font-sans text-[11px] font-semibold text-[#8B1E1E] hover:underline whitespace-nowrap shrink-0"
                      >
                        {copiedBlock === item.id ? <Check size={11} /> : <Copy size={11} />}
                        <span>{copiedBlock === item.id ? 'Đã chép' : `Chép ${item.label}`}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <pre className="max-h-60 overflow-auto whitespace-pre-wrap p-3.5 font-mono text-[11px] leading-relaxed">
              {jsDelivrSystemPrompt}
            </pre>
          </section>

          {/* 04. Live Preview /map */}
          <section className="border border-[#111111] bg-white">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#111111]/25 bg-[#F2EFE8] px-4 py-2">
              <span className="font-display text-xs font-bold tracking-wide uppercase">
                04. Xem thử đầu ra /map (bấm vào từng vùng để xem NPC)
              </span>
              <button
                type="button"
                onClick={() => setRpPreviewJson(DEFAULT_RP_SAMPLE)}
                className="border border-[#111111]/45 bg-white px-2.5 py-1 text-xs font-medium hover:bg-[#EAE6DC]"
              >
                Khôi phục mẫu
              </button>
            </div>

            <div className="grid grid-cols-1 divide-y divide-[#111111]/15 lg:grid-cols-12 lg:divide-x lg:divide-y-0">
              <div className="p-3 lg:col-span-4">
                <p className="mb-1.5 text-[11px] font-semibold text-[#55524B]">
                  window.RP_DATA
                </p>
                <textarea
                  rows={15}
                  value={rpPreviewJson}
                  onChange={(e) => setRpPreviewJson(e.target.value)}
                  spellCheck={false}
                  className="w-full border border-[#111111]/30 bg-[#FAF8F4] p-2 font-mono text-[11px] leading-relaxed focus:border-[#111111] focus:outline-none"
                />
              </div>
              <div className="p-3 lg:col-span-8 bg-[#EAE6DC]">
                {livePreviewSrcDoc ? (
                  <iframe
                    title="Xem thử Valeroth jsDelivr Map Engine"
                    srcDoc={livePreviewSrcDoc}
                    className="h-[380px] w-full border border-[#111111]/30 bg-[#EAE6DC]"
                  />
                ) : (
                  <div className="flex h-[380px] items-center justify-center text-xs text-[#8B1E1E]">
                    JSON trong RP_DATA chưa đúng cú pháp.
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
