/**
 * Title, meta description, H1 și linkurile spre servicii pentru paginile de
 * portofoliu — generate din datele proiectului, nu scrise manual pe fiecare pagină.
 *
 * Formula (RO): "<serviciu> pentru <tip de afacere> <locație>"
 *   → "Creare site pentru taxi în Hîncești"
 * Title-ul încearcă variantele de mai jos și o păstrează pe prima de cel mult
 * 60 de caractere; description-ul pornește de la aceeași formulă și adaugă
 * descrierea proiectului tăiată la o limită de propoziție, sub 155 de caractere.
 *
 * Câmpurile vin din frontmatter (src/content.config.ts → portofoliu):
 *   service    — serviciul livrat (cheia de rută a paginii de serviciu)
 *   business   — tipul de afacere, în forma care urmează după "pentru" / "for" / "для"
 *   location   — opțional, cu prepoziție: "în Hîncești" / "in Hincesti" / "в Хынчештах"
 *   relatedServices — opțional, alte servicii relevante (link suplimentar)
 */
import { route, type Locale, type RouteKey } from '@/i18n';

export const SERVICE_KEYS = [
  'services.web',
  'services.wordpress',
  'services.redesign',
  'services.cards',
  'services.brand',
] as const satisfies readonly RouteKey[];

export type ServiceKey = (typeof SERVICE_KEYS)[number];

const BRAND = 'BanStudio';
const TITLE_MAX = 60;
const DESCRIPTION_MAX = 155;

/** Serviciul, ca început de frază: "Creare site pentru …" */
const SERVICE_LABEL: Record<ServiceKey, Record<Locale, string>> = {
  'services.web':       { ro: 'Creare site',        en: 'Website',           ru: 'Создание сайта' },
  'services.wordpress': { ro: 'Site WordPress',     en: 'WordPress website', ru: 'Сайт на WordPress' },
  'services.redesign':  { ro: 'Redesign site',      en: 'Website redesign',  ru: 'Редизайн сайта' },
  'services.cards':     { ro: 'Carte de vizită',    en: 'Business card',     ru: 'Визитка' },
  'services.brand':     { ro: 'Identitate vizuală', en: 'Brand identity',    ru: 'Фирменный стиль' },
};

/** Numele paginii de serviciu — textul linkului spre ea. */
const SERVICE_PAGE: Record<ServiceKey, Record<Locale, string>> = {
  'services.web':       { ro: 'Creare site web',    en: 'Website development', ru: 'Создание сайта' },
  'services.wordpress': { ro: 'Site WordPress',     en: 'WordPress website',   ru: 'Сайт на WordPress' },
  'services.redesign':  { ro: 'Redesign site',      en: 'Website redesign',    ru: 'Редизайн сайта' },
  'services.cards':     { ro: 'Cărți de vizită',    en: 'Business cards',      ru: 'Визитки' },
  'services.brand':     { ro: 'Identitate vizuală', en: 'Brand identity',      ru: 'Фирменный стиль' },
};

const FOR: Record<Locale, string> = { ro: 'pentru', en: 'for', ru: 'для' };
const CASE_STUDY: Record<Locale, string> = { ro: 'Studiu de caz', en: 'Case study', ru: 'Кейс' };

interface ProjectData {
  title: string;
  description: string;
  service: ServiceKey;
  business: string;
  location?: string;
  relatedServices: ServiceKey[];
}

const lcfirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

/** Numele proiectului, așa cum apare în titlul din frontmatter: "Taxi Hîncești — …" → "Taxi Hîncești". */
export const projectName = (title: string) => title.split(' — ')[0].trim();

const trimEnd = (s: string) => s.replace(/[\s.,;:—]+$/, '');
const CONJUNCTION = /(^|\s)(and|or|și|sau|и|или)(\s|$)/u;

/** Cele mai multe bucăți de la început care, unite, încap în `max` (cu punctul final). */
function takeParts(parts: string[], max: number): string[] {
  const kept: string[] = [];
  for (const part of parts) {
    if (trimEnd([...kept, part].join(' ')).length + 1 > max) break;
    kept.push(part);
  }
  return kept;
}

/**
 * Descrierea proiectului scurtată la `max` caractere, fără să rupă o frază:
 *   1. la o limită tare (punct, două puncte, punct și virgulă, linie de dialog);
 *   2. altfel la o virgulă — dar nu în mijlocul unei enumerări
 *      ("tipper, crane and excavation" nu devine "tipper.");
 *   3. altfel la un cuvânt, cu "…".
 */
function fitSentence(text: string, max: number): string {
  const clean = text.trim();
  if (clean.length <= max) return clean;

  const strong = takeParts(clean.split(/(?<=[.:;])\s+|\s+(?=—)/), max);
  if (strong.length) return trimEnd(strong.join(' ')) + '.';

  const parts = clean.split(/(?<=,)\s+/);
  const weak = takeParts(parts, max);
  // Dacă prima bucată tăiată încheie o enumerare, renunțăm și la începutul ei.
  while (weak.length > 1 && CONJUNCTION.test(parts[weak.length])) weak.pop();
  if (weak.length) return trimEnd(weak.join(' ')) + '.';

  const words = takeParts(clean.split(/\s+/), max - 1);
  return words.length ? trimEnd(words.join(' ')) + '…' : '';
}

export function portfolioSeo(data: ProjectData, locale: Locale) {
  const base = `${SERVICE_LABEL[data.service][locale]} ${FOR[locale]} ${data.business}`;
  const core = data.location ? `${base} ${data.location}` : base;

  // Ordinea preferințelor: cu locație înainte de fără; locația cade doar când
  // nici formula goală nu încape în 60 de caractere.
  const titleCandidates = [core, base].flatMap((c) => [
    `${c} — ${CASE_STUDY[locale]} | ${BRAND}`,
    `${c} | ${BRAND}`,
    `${c} — ${CASE_STUDY[locale]}`,
    c,
  ]);
  const title = titleCandidates.find((t) => t.length <= TITLE_MAX) ?? base;

  const lead = `${CASE_STUDY[locale]}: ${lcfirst(core)}.`;
  const rest = fitSentence(data.description, DESCRIPTION_MAX - lead.length - 1);
  const description = rest ? `${lead} ${rest}` : lead;

  const h1 = `${projectName(data.title)} — ${lcfirst(core)}`;

  const services = [
    { key: data.service, label: SERVICE_PAGE[data.service][locale] },
    ...data.relatedServices
      .filter((key) => key !== data.service)
      .map((key) => ({
        key,
        label: `${SERVICE_LABEL[key][locale]} ${FOR[locale]} ${data.business}`,
      })),
  ].map(({ key, label }) => ({ label, href: route(key, locale) }));

  return { title, description, h1, services };
}
