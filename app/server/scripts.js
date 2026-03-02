/**
 * Script endpoints — REST wrappers for verify-insight.sh and resolve-conflict.sh.
 * No API key needed. These execute bash scripts and return results.
 */

import { Router } from 'express';
import { execFile } from 'child_process';
import { resolve } from 'path';

export function createScriptRoutes(projectRoot) {
  const router = Router();

  const scriptsDir = resolve(projectRoot, 'scripts');
  const insightsFile = resolve(projectRoot, '02_Work/INSIGHTS_GRAPH.md');
  const conflictsFile = resolve(projectRoot, '02_Work/CONFLICTS.md');

  /**
   * POST /api/scripts/verify-insight
   * Body: { id: "IG-03", action: "verify"|"invalidate"|"merge"|"freeze"|"unfreeze"|"supersede", reason?: string, target?: string }
   */
  router.post('/verify-insight', (req, res) => {
    const { id, action, reason, target } = req.body || {};

    if (!id || !action) {
      return res.status(400).json({ error: 'Missing required fields: id, action' });
    }

    const validActions = ['verify', 'invalidate', 'merge', 'freeze', 'unfreeze', 'supersede'];
    if (!validActions.includes(action)) {
      return res.status(400).json({ error: `Invalid action: ${action}. Valid: ${validActions.join(', ')}` });
    }

    if (action === 'invalidate' && !reason) {
      return res.status(400).json({ error: 'Missing required field: reason (required for invalidate)' });
    }

    if ((action === 'merge' || action === 'supersede') && !target) {
      return res.status(400).json({ error: `Missing required field: target (required for ${action})` });
    }

    const args = [`--${action}`, id, insightsFile, '--force'];
    if (reason) args.push('--reason', reason);
    if (target) args.push('--target', target);
    args.push('--project', projectRoot);

    execFile(resolve(scriptsDir, 'verify-insight.sh'), args, (err, stdout, stderr) => {
      if (err) {
        const code = err.code === 2 ? 404 : err.code === 1 ? 400 : 500;
        return res.status(code).json({ error: (stderr || stdout || err.message).trim() });
      }
      res.json({ ok: true, message: stdout.trim() });
    });
  });

  /**
   * POST /api/scripts/resolve-conflict
   * Body: { id: "CF-03", resolution?: string }
   */
  router.post('/resolve-conflict', (req, res) => {
    const { id, resolution } = req.body || {};

    if (!id) {
      return res.status(400).json({ error: 'Missing required field: id' });
    }

    const args = [id, conflictsFile];
    if (resolution) args.push('--resolution', resolution);

    execFile(resolve(scriptsDir, 'resolve-conflict.sh'), args, (err, stdout, stderr) => {
      if (err) {
        const code = err.code === 2 ? 404 : err.code === 1 ? 400 : 500;
        return res.status(code).json({ error: (stderr || stdout || err.message).trim() });
      }
      res.json({ ok: true, message: stdout.trim() });
    });
  });

  return router;
}
