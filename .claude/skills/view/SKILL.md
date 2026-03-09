---
name: view
description: Start, stop, or restart the Live Research App
user-invocable: true
allowed-tools: Bash, Read
---

# /view — Live Research App

Start the PD-Spec Live Research App — a local web viewer that reads Work layer files directly and shows live research state in the browser.

## Flags

- **`--stop`** — Kill the server running for this worktree.
- **`--restart`** — Kill existing server, rebuild, and start fresh.
- **`--dev`** — Start in Vite dev mode with HMR. CSS and JSX changes appear instantly without rebuild.
- Default (no flag) — Start in production mode.

## How to find this worktree's server

Use `lsof -i :3000-3009 -t` to get PIDs, then for each: `lsof -p PID | grep cwd` to check if cwd matches current project root. That PID owns this worktree's server.

## Behavior

### `--stop`

1. Find the PID for this worktree (see above).
2. If found: `kill PID` and report port killed.
3. If not found: report "No server running for this project."

### `--restart`

1. Stop existing server (same as `--stop`, silent if none running).
2. Rebuild frontend: `cd app && npx vite build`.
3. Start server on the same port (or next free if port is now taken).
4. Open browser.

### Default (production)

1. **Check dependencies:** If `app/node_modules/` doesn't exist, run `npm install` in `app/`.
2. **Find available port:** Check ports 3000-3009. If this worktree's server is already running, just open the browser to that port — skip rebuild and restart.
3. **Build frontend:** `cd app && npx vite build`.
4. **Start server:** `cd app && PORT=XXXX node server/index.js &` in background.
5. **Wait for ready:** Poll `http://localhost:XXXX` until it responds (max 10 seconds).
6. **Open browser:** `open http://localhost:XXXX`
7. **Report:** Tell the user the URL and port.

### `--dev`

1. Check dependencies.
2. Find available port (for Express backend).
3. Skip `vite build`.
4. `cd app && PORT=XXXX npm run dev &` — starts Express + Vite dev server on port 5173.
5. Poll `http://localhost:5173` (max 15 seconds).
6. Open `http://localhost:5173`.

## Output

### Production
```
🌐 Live Research App running at http://localhost:XXXX
   Watching: 01_Sources/, 02_Work/, 03_Outputs/
```

### Stop
```
🛑 Server on port XXXX stopped.
```

### Restart
```
🔄 Server restarted at http://localhost:XXXX
```

### Dev mode
```
🔧 Live Research App (dev mode) at http://localhost:5173
   Express API on port XXXX (proxied by Vite)
   HMR active — CSS/JSX changes appear instantly.
```

## Notes

- Multiple projects can run simultaneously on different ports (3000-3009).
- In dev mode, `vite.config.js` reads `PORT` env var to proxy API/WebSocket to the correct Express port.
