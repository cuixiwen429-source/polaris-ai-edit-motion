import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync } from 'node:fs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outArg = process.argv[2] || 'out/polaris_ai_edit_motion.mp4';
const output = path.resolve(root, outArg);
mkdirSync(path.dirname(output), { recursive: true });

const remotionBin = path.join(root, 'node_modules/.bin/remotion');
const r = spawnSync(
  remotionBin,
  [
    'render',
    'src/index.ts',
    'PolarisAIEditMotion',
    output,
    '--concurrency=4',
    '--crf=16',
    '--pixel-format=yuv420p',
  ],
  { cwd: root, stdio: 'inherit' }
);

if (r.error) throw r.error;
if (r.status !== 0) process.exit(r.status || 1);
