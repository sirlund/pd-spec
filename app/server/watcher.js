/**
 * File watcher for PD-Spec Work and Output layers.
 * Uses chokidar to watch for changes and notifies via callback.
 */

import chokidar from 'chokidar';
import { resolve } from 'path';

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

  watcher.on('change', (filePath) => {
    const relative = filePath.replace(projectRoot + '/', '');
    onChange({ type: 'change', path: relative });
  });

  watcher.on('add', (filePath) => {
    const relative = filePath.replace(projectRoot + '/', '');
    onChange({ type: 'add', path: relative });
  });

  watcher.on('unlink', (filePath) => {
    const relative = filePath.replace(projectRoot + '/', '');
    onChange({ type: 'unlink', path: relative });
  });

  return watcher;
}
