#!/usr/bin/env node
/**
 * Audit SEO pe build-ul din dist/.
 *
 *   npm run build && node scripts/seo-audit.mjs
 *
 * Verifică pentru fiecare pagină indexabilă:
 *   - exact un <link rel="canonical">, self-referencing
 *   - exact un <h1>
 *   - hreflang: self-reference, x-default prezent, fiecare țintă există în dist,
 *     reciprocitate (dacă A → B, atunci B → A cu același set)
 *   - <title> prezent și unic între pagini (+ avertisment peste 60 de caractere)
 *   - meta description (avertisment peste 155 de caractere)
 *   - JSON-LD parsabil
 * Și pentru sitemap: toate paginile indexabile sunt listate, iar xhtml:link din
 * sitemap coincide cu hreflang-ul din <head>.
 *
 * Iese cu cod 1 dacă găsește erori (nu și la avertismente).
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = process.argv[2] ?? 'dist';
const SITE = 'https://banstudio.dev';

const errors = [];
const warnings = [];
const err = (page, msg) => errors.push(`${page}: ${msg}`);
const warn = (page, msg) => warnings.push(`${page}: ${msg}`);

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const decode = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}=(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
  return m ? decode(m[1] ?? m[2] ?? m[3]) : null;
};

/** dist/servicii/creare-site-web.html → /servicii/creare-site-web */
function fileToPath(file) {
  let p = '/' + relative(DIST, file).replace(/\\/g, '/').replace(/\.html$/, '');
  if (p === '/index') return '/';
  return p.replace(/\/index$/, '');
}

const pages = new Map(); // path → info

for (const file of walk(DIST).filter((f) => f.endsWith('.html'))) {
  const path = fileToPath(file);
  const html = readFileSync(file, 'utf8');
  const head = html.split(/<\/head>/i)[0];

  const robots = head.match(/<meta[^>]+name=["']robots["'][^>]*>/i);
  const noindex = robots ? /noindex/i.test(attr(robots[0], 'content') ?? '') : false;
  const is404 = /(^|\/)404$/.test(path);

  const canonicals = [...head.matchAll(/<link[^>]+rel=["']canonical["'][^>]*>/gi)].map((m) => attr(m[0], 'href'));
  const h1s = [...html.matchAll(/<h1[\s>][\s\S]*?<\/h1>/gi)].map((m) =>
    decode(m[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()),
  );
  const titles = [...head.matchAll(/<title>([\s\S]*?)<\/title>/gi)].map((m) => decode(m[1].trim()));
  const descTag = head.match(/<meta[^>]+name=["']description["'][^>]*>/i);
  const description = descTag ? attr(descTag[0], 'content') : null;

  const hreflang = new Map();
  for (const m of head.matchAll(/<link[^>]+rel=["']alternate["'][^>]*>/gi)) {
    const lang = attr(m[0], 'hreflang');
    if (!lang) continue;
    if (hreflang.has(lang)) err(path, `hreflang "${lang}" duplicat`);
    hreflang.set(lang, attr(m[0], 'href'));
  }

  const jsonld = [];
  for (const m of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      jsonld.push(JSON.parse(m[1]));
    } catch (e) {
      err(path, `JSON-LD invalid: ${e.message}`);
    }
  }

  pages.set(path, { path, noindex, is404, canonicals, h1s, titles, description, hreflang, jsonld });
}

const indexable = [...pages.values()].filter((p) => !p.noindex && !p.is404);
const urlToPath = (url) => (url?.startsWith(SITE) ? url.slice(SITE.length) || '/' : null);

// ── Per pagină ─────────────────────────────────────────────────────────────
const titleOwners = new Map();
for (const p of indexable) {
  const self = SITE + (p.path === '/' ? '' : p.path);
  const selfAlt = p.path === '/' ? SITE + '/' : self;

  if (p.canonicals.length !== 1) err(p.path, `${p.canonicals.length} canonical-uri`);
  else if (p.canonicals[0] !== self && p.canonicals[0] !== selfAlt)
    err(p.path, `canonical nu e self-referencing: ${p.canonicals[0]}`);

  if (p.h1s.length !== 1) err(p.path, `${p.h1s.length} H1`);

  if (p.titles.length !== 1) err(p.path, `${p.titles.length} <title>`);
  const title = p.titles[0] ?? '';
  if (title.length > 60) warn(p.path, `title de ${title.length} caractere: "${title}"`);
  titleOwners.set(title, [...(titleOwners.get(title) ?? []), p.path]);

  if (!p.description) err(p.path, 'lipsește meta description');
  else if (p.description.length > 155) warn(p.path, `description de ${p.description.length} caractere`);

  if (p.hreflang.size === 0) {
    err(p.path, 'fără hreflang');
    continue;
  }
  if (!p.hreflang.has('x-default')) err(p.path, 'lipsește x-default');
  const targets = [...p.hreflang.entries()];
  if (!targets.some(([l, u]) => l !== 'x-default' && (u === self || u === selfAlt)))
    err(p.path, 'hreflang fără self-reference');

  for (const [lang, url] of targets) {
    const target = urlToPath(url);
    const tp = target && pages.get(target);
    if (!tp) {
      err(p.path, `hreflang ${lang} → ${url} nu există în dist`);
      continue;
    }
    if (lang === 'x-default') continue;
    // Reciprocitate: ținta trebuie să trimită înapoi la pagina asta, cu același set.
    const back = [...tp.hreflang.values()];
    if (!back.includes(self) && !back.includes(selfAlt))
      err(p.path, `hreflang ${lang} → ${target} nu e reciproc (ținta nu trimite înapoi)`);
    const a = JSON.stringify([...p.hreflang.entries()].sort());
    const b = JSON.stringify([...tp.hreflang.entries()].sort());
    if (a !== b) err(p.path, `setul hreflang diferă de cel al lui ${target}`);
  }
}

for (const [title, owners] of titleOwners) {
  if (owners.length > 1) err(owners.join(', '), `title duplicat: "${title}"`);
}

// ── Sitemap ────────────────────────────────────────────────────────────────
const sitemapFiles = readdirSync(DIST).filter((f) => /^sitemap-\d+\.xml$/.test(f));
const sitemap = new Map(); // url → Map(lang → href)
for (const f of sitemapFiles) {
  const xml = readFileSync(join(DIST, f), 'utf8');
  for (const m of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = decode(m[1].match(/<loc>([^<]+)<\/loc>/)[1]);
    const alts = new Map();
    for (const l of m[1].matchAll(/<xhtml:link[^>]*>/g)) alts.set(attr(l[0], 'hreflang'), attr(l[0], 'href'));
    sitemap.set(loc, alts);
  }
}

for (const p of indexable) {
  const self = SITE + (p.path === '/' ? '' : p.path);
  const entry = sitemap.get(self) ?? sitemap.get(SITE + '/');
  if (!entry) {
    err(p.path, 'lipsește din sitemap');
    continue;
  }
  const head = JSON.stringify([...p.hreflang.entries()].sort());
  const sm = JSON.stringify([...entry.entries()].sort());
  if (head !== sm) err(p.path, `xhtml:link din sitemap diferă de hreflang din <head>\n    head:    ${head}\n    sitemap: ${sm}`);
}
for (const url of sitemap.keys()) {
  const path = urlToPath(url);
  const p = path && pages.get(path);
  if (!p) err(url, 'în sitemap, dar nu există în dist');
  else if (p.noindex || p.is404) err(url, 'în sitemap, dar e noindex/404');
}

// ── Raport ─────────────────────────────────────────────────────────────────
const withLd = indexable.filter((p) => p.jsonld.length).length;
console.log(`Pagini HTML: ${pages.size} (indexabile: ${indexable.length}, cu JSON-LD: ${withLd})`);
console.log(`URL-uri în sitemap: ${sitemap.size}`);
if (warnings.length) {
  console.log(`\nAvertismente (${warnings.length}):`);
  for (const w of warnings) console.log('  ⚠ ' + w);
}
if (errors.length) {
  console.log(`\nErori (${errors.length}):`);
  for (const e of errors) console.log('  ✘ ' + e);
  process.exit(1);
}
console.log('\n✔ Nicio eroare.');
