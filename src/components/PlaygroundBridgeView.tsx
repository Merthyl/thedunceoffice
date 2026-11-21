import React, { useMemo, useState } from 'react';
import {
  Check,
  Code2,
  Copy,
  Download,
  ExternalLink,
  Play,
  RotateCcw,
  Share2,
  Waypoints,
  X,
} from 'lucide-react';
import {
  buildWorldSystemPrompt,
  getLocationScope,
  STORY_TOOL_DECLARATIONS_JSON,
} from '../data/storyEngine';
import { buildUnifiedJsDelivrSystemPrompt } from '../data/rpCommands';
import type { StoryWorldState } from '../types/story';

interface PlaygroundBridgeModalProps {
  world: StoryWorldState;
  onExecuteRawCalls: (
    calls: Array<{ name: string; args?: Record<string, unknown> }>
  ) => {
    responses: Array<{ name: string; response: Record<string, unknown> }>;
    summaries: string[];
  };
  onClose: () => void;
}

const SAMPLE_VALEROTH_CALL = JSON.stringify(
  [
    {
      name: 'set_player_location',
      args: {
        targetLocationName: 'Quán Rượu Mũi Đao',
        status: 'Đang ngồi sưởi ấm bên lò than và nghe lính đánh thuê bàn về sương độc Cấm Địa',
        markRouteTraversed: true,
      },
    },
    {
      name: 'show_player_map',
      args: {},
    },
  ],
  null,
  2
);

const DEFAULT_RP_SAMPLE = JSON.stringify(
  {
    mode: 'map',
    view: 'norsvale',
    playerLoc: 'loc-nors-tavern',
    fromLoc: 'loc-nors-southgate',
    chapter: 'Đêm 14 · Bắc Ải',
    status: 'Vừa rời ca gác Cổng Hoang Vực vào Quán Rượu Mũi Đao, đang đối diện tay lính đánh thuê lạ mặt.',
    npcs: [
      {
        name: 'Vemor Gislebertus',
        loc: 'loc-nors-tavern',
        role: 'Cánh tay phải của Kaldor',
        status: 'Đang nâng cốc rượu mạnh ở bàn gần quầy, ánh mắt liếc qua đám lính.',
        source: 'canon',
        visibility: 'encountered',
      },
      {
        name: 'Gã lính đánh thuê áo da rách',
        loc: 'loc-nors-tavern',
        role: 'Kẻ đưa thư lạ mặt (NPC mới tạo)',
        status: 'Vừa đặt phong thư sáp đen lên bàn chờ {{user}} phản hồi.',
        source: 'custom',
        visibility: 'encountered',
      },
      {
        name: 'Quản gia Ervin',
        loc: 'loc-nors-keep',
        role: 'Quản gia dinh thự Bắc Ải',
        status: 'Vừa được nhắc đến trong lời than phiền về kho quân nhu.',
        source: 'canon',
        visibility: 'mentioned',
      },
    ],
    tags: [
      { loc: 'loc-nors-southgate', label: 'Sương độc áp sát', tone: 'crimson' },
    ],
  },
  null,
  2
);

const SAMPLE_RECAP_JSON = JSON.stringify(
  {
    mode: 'recap',
    title: 'TÓM TẮT DIỄN BIẾN',
    currentState:
      'Đêm muộn ngày 14 tháng Sương Mù · Quán Rượu Mũi Đao (Bên trong Bắc Ải). {{user}} vừa rời ca gác Cổng Hoang Vực, đang ngồi bàn góc cạnh lò than; tay lính đánh thuê vừa đặt lá thư niêm phong sáp đen xuống bàn và chờ phản ứng của {{user}}.',
    characterContinuity:
      'Vemor Gislebertus giữ phong thái lãng tử, hay trêu chọc nhưng quan sát rất kỹ. Kaldor Oakhart tin cậy năng lực tuần biên của {{user}}.',
    eventHistory:
      '1) {{user}} phát hiện dấu vết sương độc lan sát tường Nam Bắc Ải.\n2) Báo cáo lên Tháp Oakhart và được dặn để mắt tới người lạ từ hướng U Lâm.',
    knowledgeBoundaries:
      '{{user}} biết phong thư mang dấu sáp đen, chưa mở niêm phong. Kaldor chưa biết gã lính đánh thuê đã tiếp cận {{user}}.',
    ongoingThreads:
      '- Quyết định đang chờ {{user}}: mở lá thư ngay tại quán hay mang thẳng về Tháp Oakhart.\n- Điều tra nguồn sương độc rò rỉ từ ranh giới Cấm Địa.',
    microContinuity:
      'Nợ chủ quán Orla 2 Xu bạc tiền bia ấm; trên cổ tay {{user}} còn vết sẹo nhỏ từ lần chạm trán sinh vật Hoang Vực.',
    continuityWarnings:
      'Không tự ý mở niêm phong hoặc quyết định thay {{user}}. Giữ nghiêm ranh giới tri thức đã thiết lập.',
  },
  null,
  2
);

const SAMPLE_TRANSFER_JSON = JSON.stringify(
  {
    mode: 'transfer',
    metadata: {
      sequence: 'Transfer #1 / v1',
      previousRef: 'Không có (phiên đầu tiên)',
      timelineCoverage: 'Khởi hành tới Bắc Ải → Đêm 14 tại Quán Rượu Mũi Đao',
      gaps: 'Không có khoảng trống lớn.',
    },
    userProfileLock:
      'Cố định: Tuần biên trẻ tại Bắc Ải, điềm tĩnh, quan sát kỹ, nói ngắn gọn.\nTrạng thái tạm thời: Mệt sau ca gác đêm, áo choàng còn ẩm sương lạnh.',
    currentScene:
      'Đêm 14 tháng Sương Mù tại Quán Rượu Mũi Đao (Bắc Ải). Bàn gỗ góc lò than. Tay lính đánh thuê đặt phong thư sáp đen lên mặt bàn và nhìn thẳng chờ {{user}} đáp lại.',
    characterStates:
      'Kaldor Oakhart (Tháp Oakhart): tin cậy mức trung bình, chờ báo cáo sáng mai.\nVemor Gislebertus: đang uống rượu ở bàn gần quầy, quan sát từ xa.\nGã lính đánh thuê (đối diện): dè chừng, sẵn sàng bỏ đi nếu bị đe dọa.',
    worldPressures:
      'Sương độc từ Cấm Địa áp sát Cổng Hoang Vực; quân nhu Hắc Nham đến chậm 3 ngày; trong túi {{user}} còn 6 Xu bạc và đoản kiếm sắt.',
    knowledgeSealed:
      '{{user}} chỉ biết dấu sáp thuộc về người từ hướng U Lâm; nội dung bên trong thư chưa được tiết lộ.',
    microContinuity:
      'Lời hứa trả 2 Xu bạc cho Orla trước bình minh; thói quen gõ nhẹ ngón tay lên chuôi kiếm khi nghi ngờ.',
    activeThreads:
      '- [PENDING] Lựa chọn của {{user}} với phong thư sáp đen.\n- [ONGOING] Truy tìm kẻ tuồn tin từ U Lâm vào Bắc Ải.',
    cumulativeLedger: [
      {
        id: 'EV-01',
        time: 'Chiều ngày 14',
        whereWho: 'Cổng Hoang Vực · {{user}}, đội trực chiến',
        event: 'Sương độc bất thường dâng sát chân tường Nam.',
        changes: 'Tăng cường đèn báo hiệu và rút ca gác sớm.',
        knowledge: 'Toàn đội trực cổng Nam đều chứng kiến.',
        consequences: 'Cổng Nam khóa chặt sau hoàng hôn.',
      },
      {
        id: 'EV-02',
        time: 'Đêm ngày 14',
        whereWho: 'Quán Rượu Mũi Đao · {{user}}, gã lính đánh thuê áo da rách',
        event: 'Kẻ lạ đưa phong thư niêm phong sáp đen không ghi tên.',
        changes: 'Đặt ra lựa chọn trực tiếp đang chờ {{user}}.',
        knowledge: 'Chỉ {{user}} và kẻ lạ biết về phong thư.',
        consequences: 'Chưa giải quyết; cảnh dừng ngay tại khoảnh khắc chờ quyết định.',
      },
    ],
    persistentWarnings:
      'Giữ nguyên số tiền 6 Xu bạc, vết thương nhẹ ở cổ tay và không tự ý mở phong thư thay {{user}}.',
    sceneAnchor:
      'Phong thư sáp đen nằm im giữa bàn gỗ ẩm dưới ánh lửa lò than. Gã lính đánh thuê giữ tay gần cổ áo, im lặng chờ hành động hoặc câu hỏi tiếp theo của {{user}}.',
    lastUserInput: 'Ta ngồi xuống bàn góc gần lò than và ra hiệu cho hắn nói thẳng mục đích.',
    lastResponse:
      'Ánh than hồng hắt lên mặt bàn gỗ đầy vết chém cũ. Gã lính đánh thuê không đáp ngay, chỉ liếc nhanh qua đám đông ồn ã quanh quầy rượu rồi rút từ trong lớp áo da một phong thư niêm phong bằng sáp đen.\n\n"Đừng hỏi ai gửi," gã hạ giọng đủ để tiếng củi nổ lấn át. "Nếu sáng mai ngươi còn muốn giữ yên Cổng Nam, đọc nó trước khi chuông đổi gác điểm."\n\nBàn tay gã trượt khỏi phong thư, ánh mắt dừng lại chờ phản ứng của ngươi.',
  },
  null,
  2
);

function extractFunctionCallsFromJson(
  parsed: unknown
): Array<{ name: string; args?: Record<string, unknown> }> | null {
  if (!parsed || typeof parsed !== 'object') return null;

  if (Array.isArray(parsed)) {
    const mapped = parsed
      .map((item) => {
        if (!item || typeof item !== 'object') return null;
        const obj = item as Record<string, unknown>;
        const fc =
          obj.functionCall && typeof obj.functionCall === 'object'
            ? (obj.functionCall as Record<string, unknown>)
            : obj;
        if (typeof fc.name !== 'string' || !fc.name.trim()) return null;
        return {
          name: fc.name.trim(),
          args: (fc.args ?? fc.arguments ?? {}) as Record<string, unknown>,
        };
      })
      .filter((x): x is { name: string; args: Record<string, unknown> } => x !== null);
    return mapped.length > 0 ? mapped : null;
  }

  const record = parsed as Record<string, unknown>;

  if (Array.isArray(record.functionCalls)) {
    return extractFunctionCallsFromJson(record.functionCalls);
  }

  if (record.functionCall && typeof record.functionCall === 'object') {
    return extractFunctionCallsFromJson([record.functionCall]);
  }

  if (Array.isArray(record.candidates)) {
    const collected: Array<{ name: string; args?: Record<string, unknown> }> = [];
    for (const cand of record.candidates) {
      const parts = (cand as { content?: { parts?: unknown[] } })?.content?.parts;
      if (!Array.isArray(parts)) continue;
      for (const part of parts) {
        const fc = (part as { functionCall?: { name?: string; args?: Record<string, unknown> } })
          ?.functionCall;
        if (fc && typeof fc.name === 'string' && fc.name.trim()) {
          collected.push({ name: fc.name.trim(), args: fc.args ?? {} });
        }
      }
    }
    return collected.length > 0 ? collected : null;
  }

  if (typeof record.name === 'string' && record.name.trim()) {
    return [
      {
        name: record.name.trim(),
        args: (record.args ?? record.arguments ?? {}) as Record<string, unknown>,
      },
    ];
  }

  return null;
}

export default function PlaygroundBridgeView({
  world,
  onExecuteRawCalls,
  onClose,
}: PlaygroundBridgeModalProps) {
  const [activeTab, setActiveTab] = useState<'jsdelivr' | 'function'>('jsdelivr');
  const [copiedBlock, setCopiedBlock] = useState<string | null>(null);

  // GitHub + jsDelivr config state
  const [githubRepo, setGithubRepo] = useState('ten-tai-khoan/valeroth-rp');
  const [commitSha, setCommitSha] = useState('COMMIT_SHA');
  const [textCommandsMode, setTextCommandsMode] = useState<'engine' | 'markdown'>('engine');
  const [rpPreviewJson, setRpPreviewJson] = useState(DEFAULT_RP_SAMPLE);

  // Function Calling JSON state
  const [rawCallInput, setRawCallInput] = useState(SAMPLE_VALEROTH_CALL);
  const [responseOutput, setResponseOutput] = useState<string>('');
  const [executionSummaries, setExecutionSummaries] = useState<string[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);

  const cleanRepo = githubRepo.trim().replace(/^https?:\/\/github\.com\//, '').replace(/^\/+|\/+$/g, '') || 'ten-tai-khoan/valeroth-map';
  const cleanSha = commitSha.trim() || 'COMMIT_SHA';
  const jsDelivrScriptUrl = `https://cdn.jsdelivr.net/gh/${cleanRepo}@${cleanSha}/valeroth-map-engine.js`;

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

  const jsDelivrSystemPrompt = useMemo(() => {
    return buildUnifiedJsDelivrSystemPrompt({
      jsDelivrScriptUrl,
      overworldList,
      norsvaleList,
      textCommandsMode,
    });
  }, [jsDelivrScriptUrl, overworldList, norsvaleList, textCommandsMode]);

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
        valeroth: '/github-kit/assets/valeroth.jpg',
        norsvale: '/github-kit/assets/norsvale.jpg',
      },
    };

    const safeJson = JSON.stringify(injectedData).replace(/</g, '\\u003c');
    return `<!doctype html>
<html lang="vi">
<head><meta charset="UTF-8" /><style>body{margin:0;padding:8px;background:#EAE6DC;}</style></head>
<body>
  <div id="valeroth-app"></div>
  <script>window.VALEROTH_DATA = ${safeJson};</script>
  <script src="/github-kit/valeroth-map-engine.js"></script>
</body>
</html>`;
  }, [rpPreviewJson]);

  const declarationsText = useMemo(
    () => JSON.stringify(STORY_TOOL_DECLARATIONS_JSON, null, 2),
    []
  );

  const systemPromptText = useMemo(() => {
    const rawOrigin =
      typeof window !== 'undefined'
        ? window.location.origin.replace('://ais-dev-', '://ais-pre-')
        : undefined;
    return buildWorldSystemPrompt(world, rawOrigin);
  }, [world]);

  const handleCopy = async (id: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedBlock(id);
      setTimeout(() => setCopiedBlock((prev) => (prev === id ? null : prev)), 1800);
    } catch {
      setCopiedBlock(null);
    }
  };

  const handleCopyShareLink = async () => {
    try {
      const json = JSON.stringify(world);
      const bytes = new TextEncoder().encode(json);
      let binary = '';
      bytes.forEach((b) => {
        binary += String.fromCharCode(b);
      });
      const encoded = btoa(binary);
      const url = `${window.location.origin}${window.location.pathname}#world=${encodeURIComponent(encoded)}`;
      await handleCopy('share-link', url);
    } catch {
      await handleCopy('share-link', window.location.href);
    }
  };

  const handleRunBridge = () => {
    setParseError(null);
    try {
      const parsed = JSON.parse(rawCallInput);
      const normalized = extractFunctionCallsFromJson(parsed);

      if (!normalized || normalized.length === 0) {
        setParseError(
          'JSON cần là { "name": "...", "args": {...} }, mảng lời gọi hàm, { "functionCalls": [...] }, hoặc nguyên phản hồi JSON từ Playground.'
        );
        return;
      }

      const { responses, summaries } = onExecuteRawCalls(normalized);
      setResponseOutput(JSON.stringify(responses, null, 2));
      setExecutionSummaries(summaries);
    } catch (err) {
      setParseError(
        err instanceof Error ? `Lỗi cú pháp JSON: ${err.message}` : 'Không thể phân tích JSON.'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111111]/55 p-4 backdrop-blur-xs">
      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden border border-[#111111] bg-[#FAF8F4] text-[#111111] shadow-[8px_8px_0_rgba(17,17,17,0.22)]">
        {/* Modal Header with Tab Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#111111] bg-[#F2EFE8] px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="flex border border-[#111111] bg-[#FAF8F4] p-0.5">
              <button
                type="button"
                onClick={() => setActiveTab('jsdelivr')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold transition-colors whitespace-nowrap ${
                  activeTab === 'jsdelivr'
                    ? 'bg-[#111111] text-[#FAF8F4]'
                    : 'text-[#111111] hover:bg-[#E7E3DA]'
                }`}
              >
                <Code2 size={13} />
                <span>GitHub + jsDelivr</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('function')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold transition-colors whitespace-nowrap ${
                  activeTab === 'function'
                    ? 'bg-[#111111] text-[#FAF8F4]'
                    : 'text-[#111111] hover:bg-[#E7E3DA]'
                }`}
              >
                <Waypoints size={13} />
                <span>Function Calling</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyShareLink}
              className="flex items-center gap-1.5 border border-[#111111] bg-white px-3 py-1 text-xs font-medium hover:bg-[#E7E3DA] whitespace-nowrap"
            >
              {copiedBlock === 'share-link' ? <Check size={13} /> : <Share2 size={13} />}
              <span>{copiedBlock === 'share-link' ? 'Đã chép link' : 'Chép link bản đồ'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-[#3D3A35] hover:bg-[#E4E0D6]"
              aria-label="Đóng"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* TAB 1: GITHUB + JSDELIVR ENGINE WORKFLOW */}
        {activeTab === 'jsdelivr' && (
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Step 1: Download Ready-to-Push GitHub Package */}
            <section className="border border-[#111111] bg-white">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#111111]/25 bg-[#F2EFE8] px-4 py-2.5">
                <div>
                  <span className="font-display text-xs font-bold tracking-wide uppercase">
                    01. Bộ mã nguồn 1 GitHub Repo duy nhất (/map · /recap · /transfer)
                  </span>
                </div>
                <a
                  href="/api/github-kit.zip"
                  download="valeroth-github-jsdelivr-kit.zip"
                  className="flex items-center gap-1.5 bg-[#111111] px-3.5 py-1.5 text-xs font-semibold text-[#FAF8F4] transition-colors hover:bg-[#8B1E1E] whitespace-nowrap"
                >
                  <Download size={13} />
                  <span>Tải trọn bộ GitHub (.zip)</span>
                </a>
              </div>

              <div className="p-4 text-xs space-y-3">
                <p className="text-[#3D3A35] leading-relaxed">
                  Gói <code>.zip</code> gom trọn <strong>1 repo GitHub + 1 mã @SHA</strong> cho cả 3 lệnh:
                  <strong> <code>valeroth-map-engine.js</code></strong> (engine v2.1 xử lý <code>/map</code> với dấu vị trí theo hội thoại &amp; hiển thị NPC có sẵn/mới tạo chỉ khi chạm trán hoặc nhắc đến, <code>/recap</code> và <code>/transfer</code> kèm nút Sao chép Markdown),
                  <strong> <code>index.html</code></strong> (bản đồ cố định có <em>+ Gắn tag / NPC</em>),
                  <strong> <code>commands/*</code></strong> (Section 3–4, <code>recap.md</code>, <code>transfer.md</code>) và 2 họa đồ <strong><code>assets/*.jpg</code></strong>.
                </p>
                <div className="flex flex-wrap gap-2">
                  <a
                    href="/github-kit/valeroth-map-engine.js"
                    download="valeroth-map-engine.js"
                    className="flex items-center gap-1 border border-[#111111]/40 bg-[#FAF8F4] px-2.5 py-1 font-mono text-[11px] hover:bg-[#E7E3DA]"
                  >
                    <Download size={11} />
                    <span>valeroth-map-engine.js</span>
                  </a>
                  <a
                    href="/github-kit/index.html"
                    download="index.html"
                    className="flex items-center gap-1 border border-[#111111]/40 bg-[#FAF8F4] px-2.5 py-1 font-mono text-[11px] hover:bg-[#E7E3DA]"
                  >
                    <Download size={11} />
                    <span>index.html (map cố định)</span>
                  </a>
                  <a
                    href="/github-kit/assets/valeroth.jpg"
                    download="valeroth.jpg"
                    className="flex items-center gap-1 border border-[#111111]/40 bg-[#FAF8F4] px-2.5 py-1 font-mono text-[11px] hover:bg-[#E7E3DA]"
                  >
                    <Download size={11} />
                    <span>assets/valeroth.jpg</span>
                  </a>
                  <a
                    href="/github-kit/assets/norsvale.jpg"
                    download="norsvale.jpg"
                    className="flex items-center gap-1 border border-[#111111]/40 bg-[#FAF8F4] px-2.5 py-1 font-mono text-[11px] hover:bg-[#E7E3DA]"
                  >
                    <Download size={11} />
                    <span>assets/norsvale.jpg</span>
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

            {/* Step 2: jsDelivr Repo + Commit SHA Config */}
            <section className="border border-[#111111] bg-white">
              <div className="border-b border-[#111111]/25 bg-[#F2EFE8] px-4 py-2">
                <span className="font-display text-xs font-bold tracking-wide uppercase">
                  02. Gắn Repo & Commit SHA để tạo link jsDelivr
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
                      placeholder="vd: dunceinthedungeon/valeroth-map"
                      className="w-full border border-[#111111]/40 bg-[#FAF8F4] px-2.5 py-1.5 font-mono text-xs focus:border-[#111111] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-semibold">
                      Commit SHA (đổi SHA để tải bản engine mới)
                    </label>
                    <input
                      type="text"
                      value={commitSha}
                      onChange={(e) => setCommitSha(e.target.value)}
                      placeholder="vd: a1b2c3d"
                      className="w-full border border-[#111111]/40 bg-[#FAF8F4] px-2.5 py-1.5 font-mono text-xs focus:border-[#111111] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 border border-[#111111]/25 bg-[#F5F3EE] px-3 py-2 font-mono text-[11px]">
                  <span className="truncate">{jsDelivrScriptUrl}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy('jsdelivr-url', jsDelivrScriptUrl)}
                    className="flex items-center gap-1 font-sans text-xs font-semibold text-[#8B1E1E] hover:underline whitespace-nowrap shrink-0"
                  >
                    {copiedBlock === 'jsdelivr-url' ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedBlock === 'jsdelivr-url' ? 'Đã chép' : 'Sao chép'}</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Step 3: Unified System Prompt for Google AI Studio */}
            <section className="border border-[#111111] bg-white">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#111111]/25 bg-[#F2EFE8] px-4 py-2">
                <span className="font-display text-xs font-bold tracking-wide uppercase">
                  03. System Instructions hợp nhất (Section 3–4 · /map · /recap · /transfer)
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy('jsdelivr-prompt', jsDelivrSystemPrompt)}
                  className="flex items-center gap-1 border border-[#111111]/45 bg-white px-2.5 py-1 text-xs font-medium hover:bg-[#EAE6DC]"
                >
                  {copiedBlock === 'jsdelivr-prompt' ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedBlock === 'jsdelivr-prompt' ? 'Đã chép' : 'Sao chép Prompt'}</span>
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2 border-b border-[#111111]/15 bg-[#FAF8F4] px-4 py-2 text-xs">
                <span className="font-semibold text-[#3D3A35]">Cách xuất /recap & /transfer:</span>
                <div className="flex border border-[#111111]/50 bg-white p-0.5">
                  <button
                    type="button"
                    onClick={() => setTextCommandsMode('engine')}
                    className={`px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                      textCommandsMode === 'engine'
                        ? 'bg-[#111111] text-[#FAF8F4]'
                        : 'text-[#111111] hover:bg-[#EAE6DC]'
                    }`}
                  >
                    Dùng chung jsDelivr (khung mực cổ + nút Copy Markdown)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTextCommandsMode('markdown')}
                    className={`px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                      textCommandsMode === 'markdown'
                        ? 'bg-[#111111] text-[#FAF8F4]'
                        : 'text-[#111111] hover:bg-[#EAE6DC]'
                    }`}
                  >
                    Thuần Markdown nguyên bản (chỉ /map gọi jsDelivr)
                  </button>
                </div>
              </div>
              <pre className="max-h-60 overflow-auto whitespace-pre-wrap p-3.5 font-mono text-[11px] leading-relaxed">
                {jsDelivrSystemPrompt}
              </pre>
            </section>

            {/* Step 4: Live Preview of Engine across /map, /recap, /transfer */}
            <section className="border border-[#111111] bg-white">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#111111]/25 bg-[#F2EFE8] px-4 py-2">
                <span className="font-display text-xs font-bold tracking-wide uppercase">
                  04. Xem thử đầu ra HTML của Engine (cả 3 lệnh trên cùng 1 file JS)
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setRpPreviewJson(DEFAULT_RP_SAMPLE)}
                    className="border border-[#111111]/45 bg-white px-2.5 py-1 text-xs font-medium hover:bg-[#EAE6DC]"
                  >
                    Mẫu /map (có NPC)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRpPreviewJson(SAMPLE_RECAP_JSON)}
                    className="border border-[#111111]/45 bg-white px-2.5 py-1 text-xs font-medium hover:bg-[#EAE6DC]"
                  >
                    Mẫu /recap
                  </button>
                  <button
                    type="button"
                    onClick={() => setRpPreviewJson(SAMPLE_TRANSFER_JSON)}
                    className="border border-[#8B1E1E]/60 bg-white px-2.5 py-1 text-xs font-semibold text-[#8B1E1E] hover:bg-[#8B1E1E] hover:text-[#FAF8F4]"
                  >
                    Mẫu /transfer
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 divide-y divide-[#111111]/15 lg:grid-cols-12 lg:divide-x lg:divide-y-0">
                <div className="p-3 lg:col-span-4">
                  <p className="mb-1.5 text-[11px] font-semibold text-[#55524B]">
                    window.VALEROTH_DATA (phần GGAI điền theo từng lệnh)
                  </p>
                  <textarea
                    rows={14}
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
                      className="h-[370px] w-full border border-[#111111]/30 bg-[#EAE6DC]"
                    />
                  ) : (
                    <div className="flex h-[370px] items-center justify-center text-xs text-[#8B1E1E]">
                      JSON trong VALEROTH_DATA chưa đúng cú pháp.
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: FUNCTION CALLING (JSON) */}
        {activeTab === 'function' && (
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            <section className="border border-[#111111] bg-white">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#111111]/25 bg-[#F2EFE8] px-4 py-2.5">
                <span className="font-display text-xs font-bold tracking-wide uppercase">
                  01. Thực thi Function Call (JSON)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRawCallInput(SAMPLE_VALEROTH_CALL);
                      setParseError(null);
                    }}
                    className="flex items-center gap-1 border border-[#111111]/45 bg-white px-2.5 py-1 text-xs font-medium hover:bg-[#EAE6DC]"
                  >
                    <RotateCcw size={12} />
                    <span>Mẫu</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRunBridge}
                    className="flex items-center gap-1 bg-[#111111] px-3 py-1 text-xs font-semibold text-[#FAF8F4] hover:bg-[#8B1E1E]"
                  >
                    <Play size={12} />
                    <span>Chạy lên bản đồ</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 divide-y divide-[#111111]/15 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
                <div className="p-4">
                  <textarea
                    rows={9}
                    value={rawCallInput}
                    onChange={(e) => setRawCallInput(e.target.value)}
                    spellCheck={false}
                    className="w-full border border-[#111111]/30 bg-[#FAF8F4] p-2.5 font-mono text-xs focus:border-[#111111] focus:outline-none"
                  />
                  {parseError && <p className="mt-1.5 text-xs text-[#8B1E1E]">{parseError}</p>}
                </div>

                <div className="flex flex-col p-4">
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="font-semibold">Function Response</span>
                    {responseOutput && (
                      <button
                        type="button"
                        onClick={() => handleCopy('response', responseOutput)}
                        className="flex items-center gap-1 font-medium text-[#8B1E1E] hover:underline"
                      >
                        {copiedBlock === 'response' ? <Check size={12} /> : <Copy size={12} />}
                        <span>{copiedBlock === 'response' ? 'Đã chép' : 'Sao chép'}</span>
                      </button>
                    )}
                  </div>

                  {executionSummaries.length > 0 && (
                    <ul className="mb-2 list-disc pl-4 text-xs text-[#8B1E1E] space-y-0.5">
                      {executionSummaries.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  )}

                  <pre className="flex-1 min-h-[160px] overflow-auto border border-[#111111]/20 bg-[#F5F3EE] p-2.5 font-mono text-xs">
                    {responseOutput || '// Kết quả Function Response sẽ hiện ở đây.'}
                  </pre>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <section className="border border-[#111111] bg-white">
                <div className="flex items-center justify-between border-b border-[#111111]/25 bg-[#F2EFE8] px-4 py-2">
                  <span className="font-display text-xs font-bold tracking-wide uppercase">
                    02. Function Declarations
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy('schema', declarationsText)}
                    className="flex items-center gap-1 border border-[#111111]/45 bg-white px-2.5 py-1 text-xs font-medium hover:bg-[#EAE6DC]"
                  >
                    {copiedBlock === 'schema' ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedBlock === 'schema' ? 'Đã chép' : 'Sao chép'}</span>
                  </button>
                </div>
                <pre className="max-h-64 overflow-auto p-3.5 font-mono text-[11px] leading-relaxed">
                  {declarationsText}
                </pre>
              </section>

              <section className="border border-[#111111] bg-white">
                <div className="flex items-center justify-between border-b border-[#111111]/25 bg-[#F2EFE8] px-4 py-2">
                  <span className="font-display text-xs font-bold tracking-wide uppercase">
                    03. System Instructions
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy('system', systemPromptText)}
                    className="flex items-center gap-1 border border-[#111111]/45 bg-white px-2.5 py-1 text-xs font-medium hover:bg-[#EAE6DC]"
                  >
                    {copiedBlock === 'system' ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedBlock === 'system' ? 'Đã chép' : 'Sao chép'}</span>
                  </button>
                </div>
                <pre className="max-h-64 overflow-auto whitespace-pre-wrap p-3.5 font-mono text-[11px] leading-relaxed">
                  {systemPromptText}
                </pre>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
