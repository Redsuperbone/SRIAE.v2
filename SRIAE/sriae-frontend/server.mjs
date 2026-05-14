import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { networkInterfaces } from 'node:os';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('.', import.meta.url));
const preferredPort = Number.parseInt(process.env.PORT || '5500', 10);
const maxPort = preferredPort + 49;

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp'
};

function safePath(urlPath) {
  const decodedPath = decodeURIComponent(urlPath.split('?')[0]);
  const requestedPath = decodedPath === '/' ? '/index.html' : decodedPath;
  const normalizedPath = normalize(requestedPath).replace(/^(\.\.[/\\])+/, '');
  return join(rootDir, normalizedPath);
}

function send(response, statusCode, body, contentType = 'text/plain; charset=utf-8') {
  response.writeHead(statusCode, { 'Content-Type': contentType });
  response.end(body);
}

function requestHandler(request, response) {
  const filePath = safePath(request.url || '/');

  if (!filePath.startsWith(rootDir) || !existsSync(filePath) || !statSync(filePath).isFile()) {
    send(response, 404, 'Archivo no encontrado');
    return;
  }

  response.writeHead(200, {
    'Content-Type': mimeTypes[extname(filePath).toLowerCase()] || 'application/octet-stream'
  });
  createReadStream(filePath).pipe(response);
}

function getNetworkUrls(port) {
  const urls = [`http://localhost:${port}`];

  for (const addresses of Object.values(networkInterfaces())) {
    for (const address of addresses || []) {
      if (address.family === 'IPv4' && !address.internal) {
        urls.push(`http://${address.address}:${port}`);
      }
    }
  }

  return urls;
}

function listen(port) {
  const server = createServer(requestHandler);

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE' && port < maxPort) {
      listen(port + 1);
      return;
    }

    console.error(`No se pudo iniciar el servidor: ${error.message}`);
    process.exit(1);
  });

  server.listen(port, () => {
    console.log('SRIAE esta listo en:');
    for (const url of getNetworkUrls(port)) {
      console.log(`  ${url}`);
    }
    console.log('');
    console.log('Presiona Ctrl+C para detener el servidor.');
  });
}

listen(preferredPort);
