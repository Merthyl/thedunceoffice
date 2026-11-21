import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type, type Content, type FunctionDeclaration } from '@google/genai';
import {
  buildWorldSystemPrompt,
  executeStoryToolCall,
  STORY_TOOL_DECLARATIONS_JSON,
} from './src/data/storyEngine.ts';
import { renderValerothMapPng } from './src/server/renderMapPng.ts';
import { buildGithubKitZip } from './src/server/buildGithubKitZip.ts';
import type { StoryWorldState, ToolCallTrace } from './src/types/story.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const MODEL_NAME = 'gemini-4-hydrogen';

function mapJsonTypeToSdkType(raw: string): Type {
  switch (raw.toUpperCase()) {
    case 'STRING':
      return Type.STRING;
    case 'NUMBER':
      return Type.NUMBER;
    case 'INTEGER':
      return Type.INTEGER;
    case 'BOOLEAN':
      return Type.BOOLEAN;
    case 'ARRAY':
      return Type.ARRAY;
    case 'OBJECT':
    default:
      return Type.OBJECT;
  }
}

const STORY_FUNCTION_DECLARATIONS: FunctionDeclaration[] = STORY_TOOL_DECLARATIONS_JSON.map(
  (decl) => {
    const properties: Record<
      string,
      { type: Type; description?: string; enum?: string[] }
    > = {};
    for (const [key, prop] of Object.entries(decl.parameters.properties)) {
      properties[key] = {
        type: mapJsonTypeToSdkType(prop.type),
        description: prop.description,
        ...(prop.enum ? { enum: [...prop.enum] } : {}),
      };
    }

    const required =
      decl.parameters.required && decl.parameters.required.length > 0
        ? [...decl.parameters.required]
        : undefined;

    return {
      name: decl.name,
      description: decl.description,
      parameters: {
        type: Type.OBJECT,
        properties,
        ...(required ? { required } : {}),
      },
    };
  }
);

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'Chưa cấu hình GEMINI_API_KEY trên máy chủ. Vui lòng kiểm tra khóa API trong Settings > Secrets.'
    );
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '2mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, model: MODEL_NAME });
  });

  app.get('/api/github-kit.zip', (_req, res) => {
    try {
      const zipBuffer = buildGithubKitZip(__dirname);
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="valeroth-github-jsdelivr-kit.zip"');
      res.send(zipBuffer);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Lỗi đóng gói bộ tệp GitHub.';
      res.status(500).json({ error: msg });
    }
  });

  const GITHUB_KIT_ASSET_MAP: Record<string, string> = {
    'valeroth.jpg': 'valeroth_map_v2_1795197882349.jpg',
    'norsvale.jpg': 'norsvale_interior_1795197881444.jpg',
  };

  function serveGithubKitAsset(req: express.Request, res: express.Response) {
    const mapped = GITHUB_KIT_ASSET_MAP[req.params.filename];
    if (!mapped) {
      res.status(404).send('Not found');
      return;
    }
    const candidates = [
      path.resolve(__dirname, 'src/assets/images', mapped),
      path.resolve(__dirname, 'dist/src/assets/images', mapped),
    ];
    const resolved = candidates.find((p) => fs.existsSync(p));
    if (!resolved) {
      res.status(404).send('Asset missing');
      return;
    }
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.sendFile(resolved);
  }

  app.get('/github-kit/assets/kaldor/:filename', serveGithubKitAsset);
  app.get('/github-kit/assets/:filename', serveGithubKitAsset);

  app.get('/api/map.png', async (req, res) => {
    try {
      const idx = req.originalUrl.indexOf('?');
      const search = idx >= 0 ? req.originalUrl.slice(idx) : '';
      const pngBuffer = await renderValerothMapPng(__dirname, search);
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cache-Control', 'public, max-age=60');
      res.send(pngBuffer);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Lỗi kết xuất ảnh bản đồ.';
      res.status(500).json({ error: msg });
    }
  });

  app.post('/api/story/turn', async (req, res) => {
    try {
      const { message, history, world, customInstruction } = req.body as {
        message?: string;
        history?: Array<{ role: 'user' | 'assistant'; content: string }>;
        world?: StoryWorldState;
        customInstruction?: string;
      };

      if (!message || !message.trim()) {
        res.status(400).json({ error: 'Vui lòng nhập nội dung diễn biến hoặc yêu cầu.' });
        return;
      }

      if (!world || !Array.isArray(world.locations)) {
        res.status(400).json({ error: 'Dữ liệu bản đồ hiện tại không hợp lệ.' });
        return;
      }

      const ai = getGeminiClient();
      let currentWorld: StoryWorldState = world;
      const toolTrace: ToolCallTrace[] = [];

      const systemParts = [buildWorldSystemPrompt(currentWorld)];
      if (customInstruction && customInstruction.trim()) {
        systemParts.push(`Chỉ dẫn bổ sung của tác giả:\n${customInstruction.trim()}`);
      }
      const systemInstruction = systemParts.join('\n\n');

      const recentHistory = Array.isArray(history) ? history.slice(-10) : [];
      const contents: Content[] = recentHistory.map((turn) => ({
        role: turn.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: turn.content }],
      }));
      contents.push({
        role: 'user',
        parts: [{ text: message.trim() }],
      });

      let finalReply = '';
      const maxToolRounds = 5;

      for (let round = 0; round < maxToolRounds; round++) {
        const response = await ai.models.generateContent({
          model: MODEL_NAME,
          contents,
          config: {
            systemInstruction,
            tools: [{ functionDeclarations: STORY_FUNCTION_DECLARATIONS }],
          },
        });

        const calls = response.functionCalls;
        const modelContent = response.candidates?.[0]?.content;

        if (!calls || calls.length === 0) {
          finalReply = (response.text ?? '').trim();
          break;
        }

        if (modelContent) {
          contents.push(modelContent);
        }

        const functionResponseParts = calls.map((call, idx) => {
          const callName = call.name ?? 'unknown';
          const callArgs = (call.args ?? {}) as Record<string, unknown>;
          const outcome = executeStoryToolCall(currentWorld, callName, callArgs);
          currentWorld = outcome.updatedWorld;

          const traceId = call.id || `call-${round}-${idx}-${Date.now()}`;
          toolTrace.push({
            id: traceId,
            name: callName,
            args: callArgs,
            result: outcome.result,
            summary: outcome.summary,
            affectedLocationIds: outcome.affectedLocationIds,
            ...(outcome.switchScope ? { switchScope: outcome.switchScope } : {}),
            ...(outcome.showPlayerMap ? { showPlayerMap: true } : {}),
          });

          return {
            functionResponse: {
              ...(call.id ? { id: call.id } : {}),
              name: callName,
              response: outcome.result,
            },
          };
        });

        contents.push({
          role: 'user',
          parts: functionResponseParts,
        });
      }

      if (!finalReply) {
        finalReply =
          toolTrace.length > 0
            ? 'Đã cập nhật bản đồ cốt truyện theo các thay đổi vừa thực thi.'
            : 'Không nhận được phản hồi văn bản từ mô hình.';
      }

      res.json({
        reply: finalReply,
        toolTrace,
        updatedWorld: currentWorld,
      });
    } catch (error) {
      const errMsg =
        error instanceof Error ? error.message : 'Đã xảy ra lỗi khi gọi Gemini API.';
      const status = errMsg.includes('403') || errMsg.includes('PERMISSION_DENIED')
        ? 403
        : errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED')
        ? 429
        : 500;
      res.status(status).json({ error: errMsg });
    }
  });

  const distDir = path.resolve(__dirname, 'dist');
  const isProd = process.env.NODE_ENV === 'production' && fs.existsSync(distDir);

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Atlas Cốt Truyện đang chạy tại http://localhost:${PORT}`);
  });
}

startServer();
