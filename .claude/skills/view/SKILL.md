---
name: view
description: Start the Live Research App and open in browser
user-invocable: true
allowed-tools: Bash, Read
---

# /view — Live Research App

Start the PD-Spec Live Research App — a local web viewer that reads Work layer files directly and shows live research state in the browser.

## Behavior

1. **Check dependencies:** If `app/node_modules/` doesn't exist, run `npm install` in `app/`.
2. **Find available port:** Check ports 3000-3009 in order. Use the first free port.
   - Check with: `lsof -i :PORT -t 2>/dev/null` (empty = free)
   - If an existing PD-Spec server is already running for THIS worktree (check `lsof -p PID | grep cwd` matches current project root), just open the browser to that port.
3. **Build frontend:** Run `cd app && npx vite build` to build the React SPA.
4. **Start server:** Run `cd app && PORT=XXXX node server/index.js &` in background.
5. **Wait for ready:** Poll `http://localhost:XXXX` until it responds (max 10 seconds).
6. **Open browser:** `open http://localhost:XXXX`
7. **Report:** Tell the user the app is running and watching for changes.

## Output

```
🌐 Live Research App running at http://localhost:XXXX
   Watching: 01_Sources/, 02_Work/, 03_Outputs/
   Press Ctrl+C in terminal to stop the server.
```

## Notes

- The app is **read-only** — it never writes to PD-Spec files.
- File changes in 02_Work/ and 03_Outputs/ trigger live updates via WebSocket.
- Output files (PRD.html, etc.) open in new browser tabs, not inside the app.
- The app works on `main` branch too (shows empty state with guidance).
- Multiple projects can run simultaneously on different ports (3000-3009).
- To stop: kill the Node process or close the terminal.
