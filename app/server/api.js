/**
 * REST API routes for PD-Spec Live Research App.
 * All endpoints return parsed Work layer data as JSON.
 */

import { Router } from 'express';
import { readFile, readdir, stat } from 'fs/promises';
import { resolve, join, extname } from 'path';
import { execFile } from 'child_process';
import { parseInsights } from './parsers/insights.js';
import { parseConflicts } from './parsers/conflicts.js';
import { parseSourceMap } from './parsers/source-map.js';
import { parseSystemMap } from './parsers/system-map.js';
import { renderMarkdown, parseExtractions } from './parsers/markdown.js';

// MIME types for raw file serving
const MIME_TYPES = {
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml',
  '.heic': 'image/heic', '.pdf': 'application/pdf',
  '.html': 'text/html', '.txt': 'text/plain', '.csv': 'text/csv',
  '.json': 'application/json', '.md': 'text/markdown',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};

export function createApi(projectRoot) {
  const router = Router();
  const parseCache = new Map();

  // Helper: read a file safely
  async function readSafe(relativePath) {
    try {
      return await readFile(resolve(projectRoot, relativePath), 'utf-8');
    } catch {
      return null;
    }
  }

  // Helper: read + parse with mtime-validated cache
  async function readAndParse(relativePath, parseFn) {
    const fullPath = resolve(projectRoot, relativePath);
    let stats;
    try {
      stats = await stat(fullPath);
    } catch {
      return parseFn(null);
    }
    const cached = parseCache.get(relativePath);
    if (cached && cached.mtimeMs === stats.mtimeMs) return cached.result;

    const content = await readFile(fullPath, 'utf-8');
    const result = parseFn(content);
    parseCache.set(relativePath, { result, mtimeMs: stats.mtimeMs });
    return result;
  }

  // Helper: validate path (security)
  function isValidPath(filePath) {
    if (!filePath || filePath.includes('..') || filePath.startsWith('/')) return false;
    // Only allow access within project directories
    const allowed = ['01_Sources/', '02_Work/', '03_Outputs/', 'PROJECT.md'];
    return allowed.some(prefix => filePath.startsWith(prefix) || filePath === prefix);
  }

  // GET /api/project — project metadata from PROJECT.md
  router.get('/project', async (req, res) => {
    try {
      const content = await readSafe('PROJECT.md');
      if (!content) return res.json({ name: 'Unknown', language: 'en', one_liner: '', version: '' });

      const name = content.match(/\*\*project_name:\*\*\s*(.+)/)?.[1]?.trim() || 'Unknown';
      const language = content.match(/\*\*output_language:\*\*\s*(\w+)/)?.[1] || 'en';
      const one_liner = content.match(/\*\*one_liner:\*\*\s*(.+)/)?.[1]?.trim() || '';
      const maturity = content.match(/\*\*Maturity:\*\*\s*(.+)/)?.[1]?.trim() || '';
      const status = content.match(/\*\*Status:\*\*\s*(.+)/)?.[1]?.trim() || '';
      const insights_count = parseInt(content.match(/\*\*Insights count:\*\*\s*(\d+)/)?.[1] || '0');
      const conflicts_count = parseInt(content.match(/\*\*Conflicts count:\*\*\s*(\d+)/)?.[1] || '0');

      // Engine version from CHANGELOG.md (PROJECT.md's engine_version is stale in project branches — merge=ours)
      const version = await readAndParse('docs/CHANGELOG.md', (c) =>
        c?.match(/^## \[(.+?)\]/m)?.[1] || ''
      ) || content.match(/\*\*engine_version:\*\*\s*(.+)/)?.[1]?.trim() || '';

      res.json({ name, language, one_liner, version, maturity, status, insights_count, conflicts_count });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/insights — parsed INSIGHTS_GRAPH.md
  router.get('/insights', async (req, res) => {
    try {
      res.json(await readAndParse('02_Work/INSIGHTS_GRAPH.md', parseInsights));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/conflicts — parsed CONFLICTS.md
  router.get('/conflicts', async (req, res) => {
    try {
      res.json(await readAndParse('02_Work/CONFLICTS.md', parseConflicts));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/sources — parsed SOURCE_MAP.md
  router.get('/sources', async (req, res) => {
    try {
      res.json(await readAndParse('02_Work/SOURCE_MAP.md', parseSourceMap));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/system-map — parsed SYSTEM_MAP.md
  router.get('/system-map', async (req, res) => {
    try {
      res.json(await readAndParse('02_Work/SYSTEM_MAP.md', parseSystemMap));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/extractions — parsed EXTRACTIONS.md
  router.get('/extractions', async (req, res) => {
    try {
      res.json(await readAndParse('02_Work/EXTRACTIONS.md', parseExtractions));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/file/:path — render any markdown file as HTML
  router.get('/file/{*filePath}', async (req, res) => {
    try {
      const filePath = [].concat(req.params.filePath).join('/');
      if (!isValidPath(filePath)) {
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

  // GET /api/raw/:path — serve raw binary files with correct MIME type
  router.get('/raw/{*filePath}', async (req, res) => {
    try {
      const filePath = [].concat(req.params.filePath).join('/');
      if (!isValidPath(filePath)) {
        return res.status(403).json({ error: 'Invalid path' });
      }

      const fullPath = resolve(projectRoot, filePath);
      const ext = extname(filePath).toLowerCase();
      const mime = MIME_TYPES[ext] || 'application/octet-stream';

      res.setHeader('Content-Type', mime);
      res.sendFile(fullPath);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST /api/open — open a file with system default application (macOS)
  router.post('/open', (req, res) => {
    const { path: filePath } = req.body || {};
    if (!filePath || !isValidPath(filePath)) {
      return res.status(403).json({ error: 'Invalid path' });
    }

    const fullPath = resolve(projectRoot, filePath);
    execFile('open', [fullPath], (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ ok: true });
      }
    });
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
          if (entry.name.startsWith('.')) continue;
          if (entry.name === '_templates' || entry.name === '_schemas' || entry.name === '_README.md') continue;

          const fullPath = join(dir, entry.name);
          const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;

          if (entry.isDirectory()) {
            await scanDir(fullPath, relativePath);
          } else {
            const stats = await stat(fullPath);
            const ext = extname(entry.name).replace('.', '') || 'unknown';
            outputs.push({
              path: `03_Outputs/${relativePath}`,
              name: entry.name,
              folder: prefix || null,
              format: ext,
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
          if (entry.name.startsWith('.')) continue;
          if (entry.name.includes('TEMPLATE') || entry.name === '_README.md') continue;
          const fullPath = join(dir, entry.name);
          const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;

          if (entry.isDirectory()) {
            if (entry.name.startsWith('_')) continue;
            await scanDir(fullPath, relativePath);
          } else {
            const stats = await stat(fullPath);
            files.push({
              path: relativePath,
              name: entry.name,
              folder: prefix || null,
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

  // GET /api/work-files — list browseable files in 02_Work/
  router.get('/work-files', async (req, res) => {
    try {
      const workDir = resolve(projectRoot, '02_Work');
      const files = [];
      // Files with dedicated views — exclude from browser
      const DEDICATED_VIEW_FILES = new Set([
        'INSIGHTS_GRAPH.md', 'CONFLICTS.md', 'SYSTEM_MAP.md',
        'RESEARCH_BRIEF.md', 'EXTRACTIONS.md', 'SOURCE_MAP.md',
      ]);
      const HIDDEN_FILES = new Set(['_README.md', '.gitkeep', 'status_data.json']);

      async function scanDir(dir, prefix = '') {
        let entries;
        try { entries = await readdir(dir, { withFileTypes: true }); } catch { return; }

        for (const entry of entries) {
          if (entry.name.startsWith('.')) continue;
          if (!prefix && DEDICATED_VIEW_FILES.has(entry.name)) continue;
          if (HIDDEN_FILES.has(entry.name)) continue;
          // Skip _assets dir (intake, not knowledge)
          if (!prefix && entry.name === '_assets') continue;

          const fullPath = join(dir, entry.name);
          const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;

          if (entry.isDirectory()) {
            await scanDir(fullPath, relativePath);
          } else {
            // In _temp/, only show normalized transcripts — skip SESSION_CHECKPOINT.md
            if (prefix.startsWith('_temp') && entry.name === 'SESSION_CHECKPOINT.md') continue;
            const stats = await stat(fullPath);
            files.push({
              path: relativePath,
              name: entry.name,
              folder: prefix || null,
              format: extname(entry.name).replace('.', '') || 'unknown',
              size: stats.size,
              modified: stats.mtime.toISOString(),
            });
          }
        }
      }

      await scanDir(workDir);
      res.json({ files });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/evidence-gaps — auto-computed evidence gaps
  router.get('/evidence-gaps', async (req, res) => {
    try {
      const [insights, sourceMap] = await Promise.all([
        readAndParse('02_Work/INSIGHTS_GRAPH.md', parseInsights),
        readAndParse('02_Work/SOURCE_MAP.md', parseSourceMap),
      ]);
      const gaps = [];

      // Claim-level gaps: insights with convergence 1/N (single source support)
      for (const ig of insights.insights) {
        if (ig.convergence_ratio && ig.convergence_ratio.matched === 1 && ig.convergence_ratio.total > 1) {
          gaps.push({
            type: 'claim-level',
            description: `${ig.id} "${ig.concept || ig.title}" has single-source evidence (${ig.convergence})`,
            suggestion: 'Consider cross-referencing with additional sources to strengthen this insight.',
            refs: [ig.id],
          });
        }
      }

      // Category gaps: categories with fewer than 2 verified insights
      const catCounts = {};
      for (const ig of insights.insights) {
        if (ig.status === 'VERIFIED' && ig.category_group) {
          catCounts[ig.category_group] = (catCounts[ig.category_group] || 0) + 1;
        }
      }
      for (const [cat, count] of Object.entries(catCounts)) {
        if (count < 2) {
          gaps.push({
            type: 'category-gap',
            description: `Category "${cat}" has only ${count} verified insight${count !== 1 ? 's' : ''}`,
            suggestion: 'This category may need additional research to be well-supported.',
          });
        }
      }

      // Source diversity: check folder names for expected types
      const sourceFolders = (sourceMap.sources || []).map(s => s.path.split('/')[0]?.toLowerCase() || '');
      const uniqueFolders = [...new Set(sourceFolders)];
      const expectedTypes = ['entrevista', 'workshop', 'benchmark', 'analytic', 'documento', 'financier'];
      for (const expected of expectedTypes) {
        const found = uniqueFolders.some(f => f.includes(expected));
        if (!found && sourceMap.sources?.length > 0) {
          gaps.push({
            type: 'source-diversity',
            description: `No source folder matching "${expected}" detected`,
            suggestion: `Consider adding ${expected}-type sources to broaden evidence coverage.`,
          });
        }
      }

      res.json({ gaps, count: gaps.length });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/search?q=term — cross-layer search
  router.get('/search', async (req, res) => {
    try {
      const q = (req.query.q || '').trim().toLowerCase();
      if (q.length < 2) return res.json({ insights: [], conflicts: [], modules: [], claims: [], sources: [] });

      const [insights, conflicts, systemMap, extractions, sourcePaths] = await Promise.all([
        readAndParse('02_Work/INSIGHTS_GRAPH.md', parseInsights),
        readAndParse('02_Work/CONFLICTS.md', parseConflicts),
        readAndParse('02_Work/SYSTEM_MAP.md', parseSystemMap),
        readAndParse('02_Work/EXTRACTIONS.md', parseExtractions),
        scanSourceFiles(),
      ]);

      const LIMIT = 5;
      const result = { insights: [], conflicts: [], modules: [], claims: [], sources: [] };

      // Search insights
      for (const ig of (insights.insights || [])) {
        if (result.insights.length >= LIMIT) break;
        const hay = [ig.id, ig.title, ig.concept, ig.narrative, ig.category].filter(Boolean).join(' ').toLowerCase();
        if (hay.includes(q)) {
          result.insights.push({ id: ig.id, text: ig.title || ig.concept || ig.id, status: ig.status });
        }
      }

      // Search conflicts
      for (const cf of (conflicts.conflicts || [])) {
        if (result.conflicts.length >= LIMIT) break;
        const hay = [cf.id, cf.title, cf.description].filter(Boolean).join(' ').toLowerCase();
        if (hay.includes(q)) {
          result.conflicts.push({ id: cf.id, text: cf.title || cf.description || cf.id, status: cf.status });
        }
      }

      // Search system map modules
      for (const mod of (systemMap.modules || [])) {
        if (result.modules.length >= LIMIT) break;
        const hay = [mod.name, mod.status, ...(mod.implications || [])].filter(Boolean).join(' ').toLowerCase();
        if (hay.includes(q)) {
          result.modules.push({ id: mod.name, text: mod.name + (mod.status ? ` (${mod.status})` : '') });
        }
      }

      // Search extraction claims
      for (const file of (extractions.files || [])) {
        if (result.claims.length >= LIMIT) break;
        for (const claim of file.claims) {
          if (result.claims.length >= LIMIT) break;
          if (claim.text.toLowerCase().includes(q)) {
            result.claims.push({ id: `claim-${claim.number}`, text: claim.text, source: file.path });
          }
        }
      }

      // Search source filenames
      for (const path of sourcePaths) {
        if (result.sources.length >= LIMIT) break;
        if (path.toLowerCase().includes(q)) {
          result.sources.push({ id: path, text: path.split('/').pop(), folder: path.split('/').slice(0, -1).join('/') });
        }
      }

      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Helper: scan 01_Sources/ filesystem for actual file count
  async function scanSourceFiles() {
    const sourceDir = resolve(projectRoot, '01_Sources');
    const HIDDEN = new Set(['_SOURCE_TEMPLATE.md', '_CONTEXT_TEMPLATE.md', '_README.md']);
    const paths = [];

    async function walk(dir, prefix = '') {
      let entries;
      try { entries = await readdir(dir, { withFileTypes: true }); } catch { return; }
      for (const entry of entries) {
        if (entry.name.startsWith('.')) continue;
        if (HIDDEN.has(entry.name)) continue;
        const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
        if (entry.isDirectory()) {
          if (entry.name.startsWith('_')) continue;
          await walk(join(dir, entry.name), rel);
        } else {
          paths.push(rel);
        }
      }
    }

    await walk(sourceDir);
    return paths;
  }

  // GET /api/dashboard — aggregated dashboard data
  router.get('/dashboard', async (req, res) => {
    try {
      const [insights, conflicts, sourceMap, extractions, fsSourcePaths] = await Promise.all([
        readAndParse('02_Work/INSIGHTS_GRAPH.md', parseInsights),
        readAndParse('02_Work/CONFLICTS.md', parseConflicts),
        readAndParse('02_Work/SOURCE_MAP.md', parseSourceMap),
        readAndParse('02_Work/EXTRACTIONS.md', parseExtractions),
        scanSourceFiles(),
      ]);

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

      // Cross-reference filesystem vs SOURCE_MAP (normalize for comparison)
      const mapPaths = new Set((sourceMap.sources || []).map(s => s.path.normalize('NFC').trim()));
      const untracked = fsSourcePaths.filter(p => !mapPaths.has(p.normalize('NFC').trim())).length;

      // Pipeline progress — use real filesystem count for total sources
      const pipeline = {
        sources: fsSourcePaths.length,
        extracted: sourceMap.summary.processed || 0,
        claims: extractions.total_claims || 0,
        insights: insights.insights.length,
        conflicts: conflicts.conflicts.length,
        conflicts_resolved: conflicts.summary.resolved || 0,
        untracked,
      };

      // Source folder names for diversity display
      const sourceFolders = [...new Set(
        fsSourcePaths
          .map(p => p.split('/')[0])
          .filter(Boolean)
      )];

      // Compute evidence gap count (all types, not just claim-level)
      let gapCount = 0;
      // Claim-level: single-source insights
      for (const ig of insights.insights) {
        if (ig.convergence_ratio && ig.convergence_ratio.matched === 1 && ig.convergence_ratio.total > 1) {
          gapCount++;
        }
      }
      // Category gaps: categories with < 2 verified insights
      const catCounts = {};
      for (const ig of insights.insights) {
        if (ig.status === 'VERIFIED' && ig.category_group) {
          catCounts[ig.category_group] = (catCounts[ig.category_group] || 0) + 1;
        }
      }
      for (const count of Object.values(catCounts)) {
        if (count < 2) gapCount++;
      }
      // Source diversity gaps
      const uniqueFolders = [...new Set(
        (sourceMap.sources || []).map(s => s.path.split('/')[0]?.toLowerCase() || '')
      )];
      const expectedTypes = ['entrevista', 'workshop', 'benchmark', 'analytic', 'documento', 'financier'];
      for (const expected of expectedTypes) {
        if (!uniqueFolders.some(f => f.includes(expected)) && sourceMap.sources?.length > 0) {
          gapCount++;
        }
      }

      res.json({
        pipeline,
        authority_distribution: authorityDist,
        status_distribution: statusDist,
        categories: insights.categories,
        source_folders: sourceFolders,
        evidence_gap_count: gapCount,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return { router, parseCache };
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
