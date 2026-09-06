import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Load Environment Variables from .env.local or process.env
const envPath = path.resolve(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...vals] = trimmed.split('=');
      if (key && vals.length > 0) {
        process.env[key.trim()] = vals.join('=').trim();
      }
    }
  });
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://baslrzduqfqrrozbwgwh.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhc2xyemR1cWZxcnJvemJ3Z3doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2NjgzOTIsImV4cCI6MjEwNDI0NDM5Mn0.ZKhJ3efXOxOEuiemzZ56w1WJVuqrJ41KaJ9ezVqynUM';
const PORT = process.env.PORT || 3000;

const app = express();

// 2. Automated Supabase 7-Day Inactivity Keep-Alive Worker
async function runKeepAlivePing() {
  const cleanUrl = SUPABASE_URL.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
  const timestamp = new Date().toISOString();
  try {
    const res = await fetch(`${cleanUrl}/rest/v1/site_settings?select=key&limit=1`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });
    if (res.ok) {
      console.log(`[Supabase Keep-Alive] ✅ Ping sukses (${res.status} OK) pada ${timestamp} - Counter 7 hari di-reset.`);
      return { success: true, timestamp, status: res.status };
    } else {
      console.warn(`[Supabase Keep-Alive] ⚠️ Ping status ${res.status} pada ${timestamp}`);
      return { success: false, timestamp, status: res.status };
    }
  } catch (err) {
    console.error(`[Supabase Keep-Alive] ❌ Ping gagal pada ${timestamp}:`, err.message);
    return { success: false, timestamp, error: err.message };
  }
}

// Jalankan keepalive saat server start
runKeepAlivePing();
// Jadwalkan otomatis setiap 6 jam (4 kali sehari) untuk menjamin Supabase Free Tier selalu aktif 24/7/365
const SIX_HOURS = 6 * 60 * 60 * 1000;
setInterval(runKeepAlivePing, SIX_HOURS);

// 3. API Endpoints
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    server: 'Pandu Motor Group SSR Hydration Server',
  });
});

app.get('/api/keepalive', async (req, res) => {
  const result = await runKeepAlivePing();
  res.json(result);
});

// 4. Static Assets Handling with Optimized Cache-Control
const distDir = path.resolve(__dirname, 'dist');
const distClientDir = fs.existsSync(path.resolve(distDir, 'client'))
  ? path.resolve(distDir, 'client')
  : distDir;

app.use(
  express.static(distClientDir, {
    index: false,
    maxAge: '1y',
    immutable: true,
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache, must-revalidate');
      }
    },
  })
);

// Serve public directory if needed
app.use(express.static(path.resolve(__dirname, 'public'), { maxAge: '7d' }));

// 5. Server-Side Hydration (SSR) Handler
app.get('*', async (req, res) => {
  const url = req.originalUrl;

  try {
    let template = '';
    const templatePath = path.resolve(distClientDir, 'index.html');
    
    if (fs.existsSync(templatePath)) {
      template = fs.readFileSync(templatePath, 'utf8');
    } else {
      const devIndex = path.resolve(__dirname, 'index.html');
      template = fs.readFileSync(devIndex, 'utf8');
    }

    let appHtml = '';
    const serverEntryPath = path.resolve(distDir, 'server', 'entry-server.js');

    // Load compiled SSR bundle if available
    if (fs.existsSync(serverEntryPath)) {
      try {
        const { render } = await import(`file://${serverEntryPath}`);
        if (typeof render === 'function') {
          const rendered = await render(url);
          appHtml = rendered.html || '';
        }
      } catch (ssrErr) {
        console.warn('[SSR Warning] Gagal me-render server-side, fallback ke client hydration:', ssrErr.message);
      }
    }

    // Inject SSR markup into root container for zero-delay hydration
    const finalHtml = template.replace(
      '<div id="root"></div>',
      `<div id="root">${appHtml}</div>`
    );

    res.status(200).set({ 'Content-Type': 'text/html; charset=utf-8' }).end(finalHtml);
  } catch (err) {
    console.error('[Server Error]:', err.stack);
    res.status(500).end('Internal Server Error: ' + err.message);
  }
});

// Start Server
app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🚀 Pandu Motor Group SSR Server berjalan di port ${PORT}`);
  console.log(`🌐 Akses: http://localhost:${PORT}`);
  console.log(`🛡️ Supabase Keep-Alive: AKTIF (interval 6 jam)`);
  console.log('====================================================');
});
