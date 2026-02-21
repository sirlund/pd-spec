/**
 * REST API routes for PD-Spec Live Research App.
 * All endpoints return parsed Work layer data as JSON.
 */

import { Router } from 'express';
import { readFile, readdir, stat } from 'fs/promises';
import { resolve, join, extname } from 'path';
import { parseInsights } from './parsers/insights.js';
import { parseConflicts } from './parsers/conflicts.js';
import { parseSourceMap } from './parsers/source-map.js';
import { parseSystemMap } from './parsers/system-map.js';
import { renderMarkdown, parseExtractions } from './parsers/markdown.js';

export function createApi(projectRoot) {
  const router = Router();

  // Helper: read a file safely
  async function readSafe(relativePath) {
    try {
      return await readFile(resolve(projectRoot, relativePath), 'utf-8');
    } catch {
      return null;
    }
  }

  // GET /api/project — project metadata from PROJECT.md
  router.get('/project', async (req, res) => {
    try {
      const content = await readSafe('PROJECT.md');
      if (!content) return res.json({ name: 'Unknown', language: 'en', one_liner: '', version: '' });

      const name = content.match(/\*\*project_name:\*\*\s*(.+)/)?.[1]?.trim() || 'Unknown';
      const language = content.match(/\*\*output_language:\*\*\s*(\w+)/)?.[1] || 'en';
      const one_liner = content.match(/\*\*one_liner:\*\*\s*(.+)/)?.[1]?.trim() || '';
      const version = content.match(/\*\*engine_version:\*\*\s*(.+)/)?.[1]?.trim() || '';
      const maturity = content.match(/\*\*Maturity:\*\*\s*(.+)/)?.[1]?.trim() || '';
      const status = content.match(/\*\*Status:\*\*\s*(.+)/)?.[1]?.trim() || '';
      const insights_count = parseInt(content.match(/\*\*Insights count:\*\*\s*(\d+)/)?.[1] || '0');
      const conflicts_count = parseInt(content.match(/\*\*Conflicts count:\*\*\s*(\d+)/)?.[1] || '0');

      res.json({ name, language, one_liner, version, maturity, status, insights_count, conflicts_count });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/insights — parsed INSIGHTS_GRAPH.md
  router.get('/insights', async (req, res) => {
    try {
      const content = await readSafe('02_Work/INSIGHTS_GRAPH.md');
      res.json(parseInsights(content));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/conflicts — parsed CONFLICTS.md
  router.get('/conflicts', async (req, res) => {
    try {
      const content = await readSafe('02_Work/CONFLICTS.md');
      res.json(parseConflicts(content));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/sources — parsed SOURCE_MAP.md
  router.get('/sources', async (req, res) => {
    try {
      const content = await readSafe('02_Work/SOURCE_MAP.md');
      res.json(parseSourceMap(content));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/system-map — parsed SYSTEM_MAP.md
  router.get('/system-map', async (req, res) => {
    try {
      const content = await readSafe('02_Work/SYSTEM_MAP.md');
      res.json(parseSystemMap(content));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/extractions — parsed EXTRACTIONS.md
  router.get('/extractions', async (req, res) => {
    try {
      const content = await readSafe('02_Work/EXTRACTIONS.md');
      res.json(parseExtractions(content));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/file/:path — render any markdown file as HTML
  router.get('/file/{*filePath}', async (req, res) => {
    try {
      const filePath = req.params.filePath;
      // Security: only allow reading from project directories
      if (filePath.includes('..') || filePath.startsWith('/')) {
        return res.status(403).json({ error: 'Invalid path' });
      }
      const content = await readSafe(filePath);
      if (!content) return res.status(404).json({ error: 'File not found' });

      const ext = extname(filePath).toLowerCase();
      if (ext === '.md') {
        res.json({ path: filePath, html: renderMarkdown(content), raw: content });
      } else {
        res.json({ path: filePath, raw: content });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/outputs — list files in 03_Outputs/
  router.get('/outputs', async (req, res) => {
    try {
      const outputDir = resolve(projectRoot, '03_Outputs');
      const outputs = [];

      async function scanDir(dir, prefix = '') {
        let entries;
        try { entries = await readdir(dir, { withFileTypes: true }); } catch { return; }

        for (const entry of entries) {
          const fullPath = join(dir, entry.name);
          const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;

          // Skip templates and schemas directories
          if (entry.name === '_templates' || entry.name === '_schemas' || entry.name === '_README.md') continue;

          if (entry.isDirectory()) {
            await scanDir(fullPath, relativePath);
          } else if (entry.name.endsWith('.html')) {
            const stats = await stat(fullPath);
            outputs.push({
              path: `03_Outputs/${relativePath}`,
              name: entry.name,
              size: stats.size,
              modified: stats.mtime.toISOString(),
              type: inferOutputType(entry.name),
            });
          }
        }
      }

      await scanDir(outputDir);
      res.json({ outputs });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/source-files — list files in 01_Sources/
  router.get('/source-files', async (req, res) => {
    try {
      const sourceDir = resolve(projectRoot, '01_Sources');
      const files = [];

      async function scanDir(dir, prefix = '') {
        let entries;
        try { entries = await readdir(dir, { withFileTypes: true }); } catch { return; }

        for (const entry of entries) {
          if (entry.name.startsWith('_')) continue; // skip templates
          const fullPath = join(dir, entry.name);
          const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;

          if (entry.isDirectory()) {
            await scanDir(fullPath, relativePath);
          } else {
            const stats = await stat(fullPath);
            files.push({
              path: relativePath,
              name: entry.name,
              folder: prefix || '(root)',
              format: extname(entry.name).replace('.', '') || 'unknown',
              size: stats.size,
              modified: stats.mtime.toISOString(),
            });
          }
        }
      }

      await scanDir(sourceDir);
      res.json({ files });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/dashboard — aggregated dashboard data
  router.get('/dashboard', async (req, res) => {
    try {
      const [insightsContent, conflictsContent, sourceMapContent, extractionsContent, projectContent] =
        await Promise.all([
          readSafe('02_Work/INSIGHTS_GRAPH.md'),
          readSafe('02_Work/CONFLICTS.md'),
          readSafe('02_Work/SOURCE_MAP.md'),
          readSafe('02_Work/EXTRACTIONS.md'),
          readSafe('PROJECT.md'),
        ]);

      const insights = parseInsights(insightsContent);
      const conflicts = parseConflicts(conflictsContent);
      const sourceMap = parseSourceMap(sourceMapContent);
      const extractions = parseExtractions(extractionsContent);

      // Authority distribution
      const authorityDist = {};
      for (const ig of insights.insights) {
        const auth = ig.authority || 'unknown';
        authorityDist[auth] = (authorityDist[auth] || 0) + 1;
      }

      // Status distribution
      const statusDist = {};
      for (const ig of insights.insights) {
        statusDist[ig.status] = (statusDist[ig.status] || 0) + 1;
      }

      // Pipeline progress
      const pipeline = {
        sources: sourceMap.summary.total || 0,
        extracted: sourceMap.summary.processed || 0,
        claims: extractions.total_claims || 0,
        insights: insights.insights.length,
        conflicts: conflicts.conflicts.length,
        conflicts_resolved: conflicts.summary.resolved || 0,
      };

      res.json({
        pipeline,
        authority_distribution: authorityDist,
        status_distribution: statusDist,
        categories: insights.categories,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}

function inferOutputType(filename) {
  const name = filename.toLowerCase().replace('.html', '');
  const types = {
    prd: 'PRD', status: 'Dashboard', presentation: 'Presentation',
    personas: 'Personas', journey_map: 'Journey Map', 'journey-map': 'Journey Map',
    lean_canvas: 'Lean Canvas', 'lean-canvas': 'Lean Canvas',
    user_stories: 'User Stories', 'user-stories': 'User Stories',
    benchmark: 'Benchmark', report: 'Report', audit: 'Audit',
  };
  return types[name] || 'Document';
}
