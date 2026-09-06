import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function prerender() {
  const distDir = path.resolve(__dirname, '../dist');
  const indexPath = path.resolve(distDir, 'index.html');
  const serverEntryPath = path.resolve(distDir, 'server/entry-server.js');

  if (!fs.existsSync(indexPath) || !fs.existsSync(serverEntryPath)) {
    console.log('[Prerender] Skipping: dist/index.html or dist/server/entry-server.js not found.');
    return;
  }

  try {
    const template = fs.readFileSync(indexPath, 'utf8');
    const { render } = await import(`file://${serverEntryPath}`);
    const { html } = render();

    if (html && html.trim().length > 0) {
      const finalHtml = template.replace(
        '<div id="root"></div>',
        `<div id="root">${html}</div>`
      );
      fs.writeFileSync(indexPath, finalHtml, 'utf8');
      console.log(`[Prerender] ✅ Pre-rendered SSR markup injected into dist/index.html (${html.length} bytes)`);
    } else {
      console.warn('[Prerender] ⚠️ Render returned empty HTML, keeping template untouched.');
    }
  } catch (err) {
    console.warn('[Prerender] ⚠️ Prerender warning, falling back to standard index.html:', err.message);
  }
}

prerender();
