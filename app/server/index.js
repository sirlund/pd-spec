/**
 * PD-Spec Live Research App — Server
 *
 * Express server that:
 * 1. Serves the React SPA (production build from dist/)
 * 2. Provides REST API endpoints for parsed Work layer data
 * 3. Watches files for changes via chokidar
 * 4. Pushes change notifications via WebSocket
 */

import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import { createApi } from './api.js';
import { createWatcher } from './watcher.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

// Project root is two levels up from server/
const projectRoot = resolve(__dirname, '../..');

const app = express();
const server = createServer(app);

// WebSocket server
const wss = new WebSocketServer({ server, path: '/ws' });

const clients = new Set();
wss.on('connection', (ws) => {
  clients.add(ws);
  ws.on('close', () => clients.delete(ws));
});

function broadcast(data) {
  const msg = JSON.stringify(data);
  for (const ws of clients) {
    if (ws.readyState === 1) ws.send(msg);
  }
}

// API routes
app.use('/api', createApi(projectRoot));

// Serve output files (for "Open in new tab")
app.use('/outputs', express.static(resolve(projectRoot, '03_Outputs'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
    }
  },
}));

// Serve built frontend (production)
const distDir = resolve(__dirname, '../dist');
if (existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get('{*path}', (req, res) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/ws') && !req.path.startsWith('/outputs')) {
      res.sendFile(resolve(distDir, 'index.html'));
    }
  });
}

// File watcher → WebSocket broadcast
createWatcher(projectRoot, (event) => {
  broadcast({ type: 'file-change', ...event });
});

server.listen(PORT, () => {
  console.log(`\n  PD-Spec Live Research App`);
  console.log(`  ────────────────────────`);
  console.log(`  Local:   http://localhost:${PORT}`);
  console.log(`  Project: ${projectRoot}`);
  console.log(`  Watching: 01_Sources/, 02_Work/, 03_Outputs/\n`);
});
