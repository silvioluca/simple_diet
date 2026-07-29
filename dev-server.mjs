// Server statico per lo sviluppo locale. Nessuna dipendenza: node dev-server.mjs
// Serve public/ su http://localhost:5000 (stessa porta di `firebase serve`).
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, 'public');
const PORT = Number(process.env.PORT) || 5000;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon'
};

const server = createServer(async (req, res) => {
  let path = decodeURIComponent(req.url.split('?')[0]);
  if (path.endsWith('/')) path += 'index.html';

  let file = normalize(join(ROOT, path));
  // Nessuna uscita dalla cartella public/.
  if (!file.startsWith(ROOT)) {
    res.writeHead(403).end('403');
    return;
  }

  try {
    if (!(await stat(file)).isFile()) throw new Error('not a file');
  } catch {
    file = join(ROOT, 'index.html'); // fallback SPA
  }

  try {
    const body = await readFile(file);
    res.writeHead(200, {
      'Content-Type': TYPES[extname(file)] || 'application/octet-stream',
      // Niente cache: le modifiche si vedono al refresh senza svuotare nulla.
      'Cache-Control': 'no-store'
    });
    res.end(body);
  } catch (err) {
    res.writeHead(500).end(String(err));
  }
});

server.listen(PORT, () => {
  console.log(`Simple Diet in ascolto su http://localhost:${PORT}`);
  console.log('Ctrl+C per fermare.');
});
