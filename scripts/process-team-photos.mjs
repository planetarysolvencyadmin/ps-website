#!/usr/bin/env node
// Builds square team profile photos from the originals in _uploads/team/.
//
//   node scripts/process-team-photos.mjs [--force]
//
// For each image in _uploads/team/ it writes, to assets/images/team/:
//   <id>-320.webp and <id>-320.jpg
// The id is the filename without its extension, lower case and hyphenated, so `Jesse Abrams.jpg` becomes `jesse-abrams`.
// Put that id in the person's `photo:` field in _data/team.yml. Photos are cropped to a square from the centre
// (crop the original first if the face is off-centre), never upscaled beyond their own size, with metadata stripped
// and colour converted to sRGB. Re-running only processes photos that are new or changed; --force redoes everything.
//
// Needs ImageMagick 7 (`magick`) or 6 (`convert`) with WebP support. No npm packages.

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SIZE = 320;
const WEBP_QUALITY = 82;
const JPEG_QUALITY = 84;
const SOURCE_TYPES = new Set(['.png', '.jpg', '.jpeg', '.tif', '.tiff', '.webp']);

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = join(root, '_uploads', 'team');
const outDir = join(root, 'assets', 'images', 'team');
const force = process.argv.includes('--force');

function fail(msg) { console.error(`process-team-photos: ${msg}`); process.exit(1); }
function run(cmd, args) { return execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); }

let im;
for (const c of [['magick'], ['convert']]) {
  try { run(c[0], ['-version']); im = c[0]; break; } catch { /* try next */ }
}
if (!im) fail('ImageMagick not found. Install it from https://imagemagick.org and try again.');

const slug = (name) => name.toLowerCase().replace(/\.[^.]+$/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
if (!existsSync(srcDir)) { console.log('No _uploads/team/ folder, nothing to do.'); process.exit(0); }
mkdirSync(outDir, { recursive: true });

const seen = new Set();
let written = 0;
for (const file of readdirSync(srcDir).sort()) {
  const src = join(srcDir, file);
  if (!statSync(src).isFile() || !SOURCE_TYPES.has(extname(file).toLowerCase())) continue;
  const id = slug(file);
  if (seen.has(id)) fail(`two photos would both become "${id}". Rename one.`);
  seen.add(id);
  for (const ext of ['webp', 'jpg']) {
    const out = join(outDir, `${id}-${SIZE}.${ext}`);
    if (!force && existsSync(out) && statSync(out).mtimeMs >= statSync(src).mtimeMs) continue;
    const q = ext === 'webp' ? WEBP_QUALITY : JPEG_QUALITY;
    const args = [`${src}[0]`, '-auto-orient', '-strip', '-colorspace', 'sRGB', '-gravity', 'center',
      '-resize', `${SIZE}x${SIZE}^`, '-extent', `${SIZE}x${SIZE}`, '-quality', String(q), out];
    run(im, args);
    written++;
  }
  console.log(`${id}: ok`);
}
console.log(`Done. ${written} file(s) written to assets/images/team/. Put the id above in the person's \`photo:\` in _data/team.yml.`);
