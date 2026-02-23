/**
 * File watcher for PD-Spec Work and Output layers.
 * Uses chokidar to watch for changes and notifies via callback.
 */

import chokidar from 'chokidar';
import { resolve, normalize } from 'path';

export function createWatcher(projectRoot, onChange) {
  const watchPaths = [
    resolve(projectRoot, '02_Work'),
    resolve(projectRoot, '03_Outputs'),
    resolve(projectRoot, '01_Sources'),
    resolve(projectRoot, 'PROJECT.md'),
  ];

  const watcher = chokidar.watch(watchPaths, {
    persistent: true,
    ignoreInitial: true,
    ignored: [
      '**/node_modules/**',
      '**/.git/**',
      '**/02_Work/_temp/**',
    ],
    awaitWriteFinish: {
      stabilityThreshold: 300,
      pollInterval: 100,
    },
  });

  function toRelative(filePath) {
    return normalize(filePath).replace(normalize(projectRoot) + '/', '');
  }

  watcher.on('change', (filePath) => {
    onChange({ type: 'change', path: toRelative(filePath) });
  });

  watcher.on('add', (filePath) => {
    onChange({ type: 'add', path: toRelative(filePath) });
  });

  watcher.on('unlink', (filePath) => {
    onChange({ type: 'unlink', path: toRelative(filePath) });
  });

  return watcher;
}
