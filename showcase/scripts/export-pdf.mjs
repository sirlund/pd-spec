#!/usr/bin/env node
/**
 * Export v2-boceto deck to PDF via Playwright + optional iLovePDF compression.
 *
 * Requires: playwright (devDep), dev server running on :4321
 * Optional: @ilovepdf/ilovepdf-nodejs + ILOVEPDF_PUBLIC_KEY / ILOVEPDF_SECRET_KEY env vars
 *
 * Usage:
 *   node showcase/scripts/export-pdf.mjs --light
 *   node showcase/scripts/export-pdf.mjs --light --compress
 *   node showcase/scripts/export-pdf.mjs --url http://localhost:4321/v2-boceto --output out.pdf
 */

import { chromium } from 'playwright';
import { mkdirSync, readFileSync, statSync } from 'fs';
import { basename, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

// Load .env from showcase root
const __filename = fileURLToPath(import.meta.url);
const envPath = resolve(dirname(__filename), '../.env');
try {
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch {}

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Args ────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const param = (name) => { const i = args.indexOf(name); return i !== -1 ? args[i + 1] : null; };

const DEFAULT_URL = 'http://localhost:4321/v2-boceto';
const DEFAULT_OUTPUT = resolve(__dirname, '../exports/v2-boceto.pdf');

const URL = param('--url') ?? DEFAULT_URL;
const OUTPUT = param('--output') ? resolve(param('--output')) : DEFAULT_OUTPUT;
const LIGHT = flag('--light');
const COMPRESS = flag('--compress');

// Slide viewport
const WIDTH = 1400;
const HEIGHT = 960;

// ─── Print CSS injection ─────────────────────────────────────────────────────

const PRINT_CSS = `
  .slide-container {
    height: auto !important;
    position: static !important;
    overflow: visible !important;
  }
  .slide {
    position: relative !important;
    opacity: 1 !important;
    visibility: visible !important;
    transform: none !important;
    pointer-events: auto !important;
    width: 100% !important;
    height: 100vh !important;
    page-break-after: always !important;
    break-after: page !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
    flex-shrink: 0 !important;
    transition: none !important;
  }
  .slide:last-child {
    page-break-after: auto !important;
    break-after: auto !important;
  }
  .pres-footer, .no-export, .slide-slug, #theme-toggle {
    display: none !important;
  }
  /* Fix gradient-clip text (invisible in Chromium PDF renderer) */
  h1, .cover-content h1, .content-title {
    -webkit-text-fill-color: currentColor !important;
    background: none !important;
    -webkit-background-clip: unset !important;
    background-clip: unset !important;
  }
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
  }
`;

// ─── PDF Generation ──────────────────────────────────────────────────────────

async function generatePdf() {
  const steps = COMPRESS ? 5 : 4;

  console.log(`[1/${steps}] Launching browser...`);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT } });

  console.log(`[2/${steps}] Loading ${URL}`);
  const resp = await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
  if (!resp?.ok()) {
    console.error(`ERROR: Failed to load (status ${resp?.status()}). Is the dev server running?`);
    await browser.close();
    process.exit(1);
  }

  const slideCount = await page.evaluate(() => document.querySelectorAll('.slide').length);
  console.log(`       ${slideCount} slides`);

  if (LIGHT) {
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
    console.log('       Light mode');
  }

  await page.waitForTimeout(1500);

  console.log(`[3/${steps}] Generating PDF...`);
  await page.addStyleTag({ content: PRINT_CSS });
  await page.waitForTimeout(500);

  mkdirSync(dirname(OUTPUT), { recursive: true });

  await page.pdf({
    path: OUTPUT,
    width: `${WIDTH}px`,
    height: `${HEIGHT}px`,
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    preferCSSPageSize: false,
  });

  await browser.close();

  const rawSize = statSync(OUTPUT).size;
  console.log(`[4/${steps}] Saved: ${OUTPUT} (${fmt(rawSize)})`);

  if (COMPRESS) {
    await compressPdf(OUTPUT);
  }

  console.log('Done!');
}

// ─── iLovePDF Compression ────────────────────────────────────────────────────

async function compressPdf(filePath) {
  const pubKey = process.env.ILOVEPDF_PUBLIC_KEY;
  const secKey = process.env.ILOVEPDF_SECRET_KEY;

  if (!pubKey || !secKey) {
    console.error('\nERROR: --compress requires ILOVEPDF_PUBLIC_KEY and ILOVEPDF_SECRET_KEY env vars.');
    console.error('Get free keys at: https://developer.ilovepdf.com\n');
    process.exit(1);
  }

  console.log(`  Compressing via iLovePDF...`);

  const { default: ILovePDFApi } = await import('@ilovepdf/ilovepdf-nodejs');
  const { default: ILovePDFFile } = await import('@ilovepdf/ilovepdf-nodejs/ILovePDFFile.js');

  const instance = new ILovePDFApi(pubKey, secKey);
  const task = instance.newTask('compress');

  await task.start();
  const file = new ILovePDFFile(filePath);
  await task.addFile(file);
  await task.process({ compression_level: 'recommended' });

  const rawSize = statSync(filePath).size;
  const data = await task.download();
  const { writeFileSync } = await import('fs');
  writeFileSync(filePath, data);

  const newSize = statSync(filePath).size;
  console.log(`       ${fmt(rawSize)} → ${fmt(newSize)} (${Math.round((1 - newSize / rawSize) * 100)}% reduction)`);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── Run ─────────────────────────────────────────────────────────────────────

generatePdf().catch((err) => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
