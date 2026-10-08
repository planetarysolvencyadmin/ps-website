#!/usr/bin/env node
// Builds the responsive image library from full-size originals.
//
//   node scripts/process-images.mjs [originals-folder] [--force] [--only hero|section] [--no-treatment]
//
// The originals folder is read from the first argument, then the PS_ORIGINALS
// environment variable, then the default below. Originals are never committed.
//
// For every original it writes, to assets/images/library/:
//   <name>-2400.webp|jpg, <name>-1600.*, <name>-800.*     hero widths (not cropped)
//   <name>-sq-600.webp|jpg, <name>-sq-300.*                section images (centre-cropped square)
// Sizes larger than the original are skipped (no upscaling); an original smaller than every size is kept at its own width. Metadata, including GPS,
// is stripped. Filenames are lowercased and hyphenated. Re-running only processes
// originals that are new or changed, or whose settings (sizes, quality, treatment) have changed.
// Use --force to redo everything.
// It then rewrites _data/image_files.yml, listing the sizes that exist, and prints a
// stub for any image that is missing from _data/images.yml (alt text, credit, licence).
//
// By default every derivative also gets the brand "orbit" treatment (see TREATMENT below): a frosted
// circular lens in the centre (a blurred copy of the picture with a white ring), crossed by two thin
// white orbit lines, one solid and one dashed. There is no logo in the lens. Use --no-treatment for plain
// resized images; do NOT commit those unless you hold a licence for the untreated picture.
//
// Needs ImageMagick 7 (`magick`) or 6 (`convert` and `identify`) with WebP support. No npm packages.

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, extname, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULT_ORIGINALS = 'C:\\src\\ChosenImages';
const HERO_WIDTHS = [2400, 1600, 800];
const SQUARE_WIDTHS = [600, 300];
const WEBP_QUALITY = 78;
const JPEG_QUALITY = 80;
// The orbit treatment. All measurements are fractions of the image (width for line weights and orbit length,
// height for orbit depth, the shorter side for the lens), so it looks the same at every size. Tweak and re-run.
const TREATMENT = {
  lens: 0.81,            // lens diameter as a fraction of the shorter side
  blur: 0.03,            // blur strength as a fraction of the lens diameter
  modulate: '106,95',    // brightness %, saturation % inside the lens (a slight frosted lift)
  ring: 0.003,           // ring weight as a fraction of width (never thinner than ringMin px)
  ringMin: 2,
  orbit: 0.0012,         // orbit line weight as a fraction of width (never thinner than orbitMin px)
  orbitMin: 1,
  dash: [0.005, 0.007],  // dashed orbit: dash and gap, as fractions of width
  orbits: [              // a, b: half-length (of width) and half-depth (of height); tilt in degrees, clockwise
    { a: 0.5, b: 0.4, tilt: 5, dashed: false },
    { a: 0.58, b: 0.3, tilt: -30, dashed: true },
  ],
  // Small section pictures are shown in a circle, so the lens is made smaller to leave more of the photo visible.
  square: { lens: 0.5 },
};
const SOURCE_TYPES = new Set(['.jpg', '.jpeg', '.png', '.tif', '.tiff', '.webp']);

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'assets', 'images', 'library');
const manifestPath = join(root, '_data', 'image_files.yml');
const dataPath = join(root, '_data', 'images.yml');

const args = process.argv.slice(2);
const force = args.includes('--force');
const plain = args.includes('--no-treatment');
const onlyIdx = args.indexOf('--only');
const only = onlyIdx >= 0 ? args[onlyIdx + 1] : null;
if (only && !['hero', 'section'].includes(only)) fail('--only must be "hero" or "section"');
const positional = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--only');
const originals = resolve(positional[0] || process.env.PS_ORIGINALS || DEFAULT_ORIGINALS);

function fail(msg) { console.error(`process-images: ${msg}`); process.exit(1); }

function run(cmd, cmdArgs) { return execFileSync(cmd, cmdArgs, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); }

// ImageMagick 7 is `magick`; v6 is `convert`/`identify`. Prefer v7 (on Windows `convert` is a different tool).
let im;
for (const candidate of [{ convert: ['magick'], identify: ['magick', 'identify'] }, { convert: ['convert'], identify: ['identify'] }]) {
  try { run(candidate.convert[0], [...candidate.convert.slice(1), '-version']); im = candidate; break; } catch { /* try next */ }
}
if (!im) fail('ImageMagick not found. Install it from https://imagemagick.org and try again.');
const convert = (a) => run(im.convert[0], [...im.convert.slice(1), ...a]);
const identify = (file) => run(im.identify[0], [...im.identify.slice(1), '-format', '%w %h', `${file}[0]`]).trim().split(' ').map(Number);

if (!existsSync(originals)) fail(`originals folder not found: ${originals}\nPass it as the first argument or set PS_ORIGINALS.`);

// Safety net: originals must never be committed if they sit inside the repo.
const rel = relative(root, originals);
if (rel && !rel.startsWith('..') && !isAbsolute(rel)) {
  try { run('git', ['-C', root, 'check-ignore', '-q', originals]); }
  catch { fail(`${originals} is inside the repository but not in .gitignore. Add it there first.`); }
}

const slug = (name) => name.toLowerCase().replace(/\.[^.]+$/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const mtime = (f) => statSync(f).mtimeMs;
const upToDate = (src, out) => !force && existsSync(out) && mtime(out) >= mtime(src);

mkdirSync(outDir, { recursive: true });

// Build the ImageMagick arguments that draw the treatment onto a w x h image.
const f = (n) => Number(n.toFixed(2));
function treatment(kind, w, h) {
  const t = { ...TREATMENT, ...(kind === 'square' ? TREATMENT.square : {}) };
  const cx = w / 2, cy = h / 2, r = (t.lens * Math.min(w, h)) / 2;
  const orbits = t.orbits.flatMap((o) => [
    '-fill', 'none', '-stroke', 'white', '-strokewidth', String(f(Math.max(t.orbitMin, t.orbit * w))),
    '-draw', `translate ${f(cx)},${f(cy)} rotate ${o.tilt} ${o.dashed ? `stroke-dasharray ${f(t.dash[0] * w)} ${f(t.dash[1] * w)} ` : ''}ellipse 0,0 ${f(o.a * w)},${f(o.b * h)} 0,360`,
  ]);
  const lens = [
    '(', '+clone', '-blur', `0x${f(t.blur * 2 * r)}`, '-modulate', t.modulate, ')',
    '(', '-size', `${w}x${h}`, 'xc:black', '-fill', 'white', '-stroke', 'none', '-draw', `circle ${f(cx)},${f(cy)} ${f(cx + r)},${f(cy)}`, ')',
    '-composite',
  ];
  const ring = ['-fill', 'none', '-stroke', 'white', '-strokewidth', String(f(Math.max(t.ringMin, t.ring * w))), '-draw', `circle ${f(cx)},${f(cy)} ${f(cx + r)},${f(cy)}`];
  return [...orbits, ...lens, ...ring];
}

// Settings that affect the output. If they change, that kind of image is rebuilt even if the original has not.
const settingsPath = join(outDir, '.process-settings.json');
const shared = { webp: WEBP_QUALITY, jpeg: JPEG_QUALITY, treatment: plain ? null : TREATMENT };
const settings = { hero: { widths: HERO_WIDTHS, ...shared }, square: { widths: SQUARE_WIDTHS, ...shared } };
let previous = {};
try { previous = JSON.parse(readFileSync(settingsPath, 'utf8')); } catch { /* first run */ }
const stale = (kind) => JSON.stringify(previous[kind]) !== JSON.stringify(settings[kind]);
if (plain) console.warn('WARNING: --no-treatment writes plain images. Do not commit them unless you are licensed to use the untreated pictures.\n');

const seen = new Map();
let written = 0, skipped = 0;

for (const file of readdirSync(originals).sort()) {
  const src = join(originals, file);
  if (!statSync(src).isFile() || !SOURCE_TYPES.has(extname(file).toLowerCase())) continue;
  const id = slug(file);
  if (!id) continue;
  if (seen.has(id)) fail(`"${file}" and "${seen.get(id)}" both become "${id}". Rename one.`);
  seen.set(id, file);

  const [srcWidth, srcHeight] = identify(src);
  const jobs = [];
  // Never upscale. If the original is smaller than every target, use its own width so there is always one size.
  const fit = (widths) => { const ok = widths.filter((w) => w <= srcWidth); return ok.length ? ok : [srcWidth]; };
  if (only !== 'section') for (const w of fit(HERO_WIDTHS)) jobs.push({ kind: 'hero', w, h: Math.round((w * srcHeight) / srcWidth), base: `${id}-${w}` });
  if (only !== 'hero') for (const w of fit(SQUARE_WIDTHS)) jobs.push({ kind: 'square', w, h: w, base: `${id}-sq-${w}` });

  for (const { kind, w, h, base } of jobs) {
    for (const [ext, quality] of [['webp', WEBP_QUALITY], ['jpg', JPEG_QUALITY]]) {
      const out = join(outDir, `${base}.${ext}`);
      if (!stale(kind) && upToDate(src, out)) { skipped++; continue; }
      const op = kind === 'square' ? ['-resize', `${w}x${w}^`, '-gravity', 'center', '-extent', `${w}x${w}`, '+gravity'] : ['-resize', `${w}x${h}!`];
      const fmt = ext === 'webp'
        ? ['-define', 'webp:method=6', '-quality', String(quality)]
        : ['-interlace', 'Plane', '-sampling-factor', '4:2:0', '-quality', String(quality)];
      convert([`${src}[0]`, '-auto-orient', '-colorspace', 'sRGB', ...op, ...(plain ? [] : treatment(kind, w, h)), '-strip', ...fmt, out]);
      console.log(`write  ${base}.${ext}`);
      written++;
    }
  }
}

writeFileSync(settingsPath, JSON.stringify({ ...previous, ...(only === 'section' ? { square: settings.square } : only === 'hero' ? { hero: settings.hero } : settings) }, null, 2) + '\n');

// Rebuild the manifest from what is actually in the library, so it stays right after partial re-runs.
const sizes = {};
for (const f of readdirSync(outDir)) {
  const m = f.match(/^([a-z0-9-]+?)(-sq)?-(\d+)\.(webp|jpg)$/);
  if (!m) continue;
  const [, id, sq, w, ext] = m;
  if (ext !== 'webp') continue;
  sizes[id] ??= { hero: [], square: [] };
  sizes[id][sq ? 'square' : 'hero'].push(Number(w));
}
let yaml = '# Generated by scripts/process-images.mjs. Do not edit by hand.\n# Which sizes exist for each image in assets/images/library/.\n';
for (const id of Object.keys(sizes).sort()) {
  const s = sizes[id];
  s.hero.sort((a, b) => b - a); s.square.sort((a, b) => b - a);
  yaml += `${id}:\n`;
  yaml += `  hero: [${s.hero.join(', ')}]\n`;
  if (s.hero.length) {
    const [w, h] = identify(join(outDir, `${id}-${s.hero[0]}.webp`));
    yaml += `  hero_ratio: [${w}, ${h}]\n`;
  }
  yaml += `  square: [${s.square.join(', ')}]\n`;
}
writeFileSync(manifestPath, yaml);

console.log(`\n${written} written, ${skipped} already up to date. Manifest: ${relative(root, manifestPath)}`);

const known = existsSync(dataPath) ? new Set([...readFileSync(dataPath, 'utf8').matchAll(/^([a-z0-9-]+):/gm)].map((m) => m[1])) : new Set();
const missing = Object.keys(sizes).filter((id) => !known.has(id));
if (missing.length) {
  console.log(`\nAdd these to _data/images.yml (alt text, credit and licence are needed):\n`);
  for (const id of missing) console.log(`${id}:\n  alt: ""\n  credit: ""\n  licence: ""\n`);
}
