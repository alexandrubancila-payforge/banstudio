#!/usr/bin/env node
// Adaugă `?v=<hash>` la fiecare referință /images/… din src/.
//
// De ce: public/_headers servește /images/* cu `max-age=31536000, immutable`.
// `immutable` înseamnă că browserul NU mai verifică fișierul deloc — nici la
// reload normal. Dacă înlocuiești o imagine păstrând același nume, oricine a
// deschis site-ul înainte rămâne cu poza veche până la un an.
// Tokenul e primii 8 hex din sha256-ul fișierului: se schimbă doar când se
// schimbă imaginea, deci URL nou = poză nouă imediat, cache la fel de agresiv.
//
// Rulează după orice modificare de imagine:  node scripts/stamp-images.mjs
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const IMAGES_DIR = join(root, 'public', 'images');
const SRC_DIR = join(root, 'src');
const TEXT_EXT = /\.(md|mdx|astro|ts|tsx|js|mjs|json)$/;
const IMG_REF = /\/images\/[A-Za-z0-9._\-/]+?\.(?:webp|png|jpe?g|avif|gif|svg)(?:\?v=[a-f0-9]{8})?/g;

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (name.startsWith('.') || name === 'node_modules') return [];
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const hashes = new Map();
for (const file of walk(IMAGES_DIR)) {
  const url = '/images/' + relative(IMAGES_DIR, file).split(sep).join('/');
  hashes.set(url, createHash('sha256').update(readFileSync(file)).digest('hex').slice(0, 8));
}

const missing = new Set();
let touched = 0;

for (const file of walk(SRC_DIR).filter((f) => TEXT_EXT.test(f))) {
  const before = readFileSync(file, 'utf8');
  const after = before.replace(IMG_REF, (match) => {
    const path = match.split('?')[0];
    const hash = hashes.get(path);
    if (!hash) {
      missing.add(path);
      return match;
    }
    return `${path}?v=${hash}`;
  });
  if (after !== before) {
    writeFileSync(file, after);
    touched++;
    console.log(`  ${relative(root, file)}`);
  }
}

console.log(`\n${hashes.size} imagini în public/images, ${touched} fișiere actualizate.`);
if (missing.size) {
  console.error(`\nReferințe către imagini inexistente:\n  ${[...missing].join('\n  ')}`);
  process.exit(1);
}
