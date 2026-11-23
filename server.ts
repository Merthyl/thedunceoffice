import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { buildGithubKitZip } from './src/server/buildGithubKitZip.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

const GITHUB_KIT_ASSET_MAP: Record<string, string> = {
  'valeroth.jpg': 'valeroth_master_v40_1795441016467.jpg',
  'norsvale.jpg': 'norsvale_ink_v20_1795432498475.jpg',
};

async function startServer() {
  const app = express();

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
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
    console.log(`Valeroth Atlas đang chạy tại http://localhost:${PORT}`);
  });
}

startServer();
