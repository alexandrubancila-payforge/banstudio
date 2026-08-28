import ro from './ro.json';
import ru from './ru.json';
import en from './en.json';

export type Locale = 'ro' | 'ru' | 'en';

/** Ordinea din schimbătorul de limbă și din adnotările hreflang. */
export const LOCALES: Locale[] = ['ro', 'ru', 'en'];

export const LOCALE_NAMES: Record<Locale, string> = {
  ro: 'Română',
  ru: 'Русский',
  en: 'English',
};

const dictionaries = { ro, ru, en } as const;

/**
 * Get translation by dotted key path: t('ro', 'nav.services') → 'Servicii'
 */
export function t(locale: Locale, key: string): any {
  const dict = dictionaries[locale] || dictionaries.ro;
  return key.split('.').reduce((obj: any, k) => obj?.[k], dict);
}

/**
 * Get the full dictionary for a locale
 */
export function getDict(locale: Locale) {
  return dictionaries[locale] || dictionaries.ro;
}

/**
 * Tabelul de rute: o cheie canonică per pagină statică → calea ei în fiecare limbă.
 * Slug-urile sunt traduse, deci nu pot fi derivate — orice pagină nouă se adaugă aici,
 * altfel hreflang-ul o ignoră și schimbătorul de limbă cade pe indexul secțiunii.
 */
export type RouteKey =
  | 'home'
  | 'services'
  | 'services.web'
  | 'services.wordpress'
  | 'services.redesign'
  | 'services.cards'
  | 'services.brand'
  | 'portfolio'
  | 'blog'
  | 'contact';

const ROUTES: Record<RouteKey, Record<Locale, string>> = {
  home:                 { ro: '/',                            ru: '/ru',                       en: '/en' },
  services:             { ro: '/servicii',                    ru: '/ru/uslugi',                en: '/en/services' },
  'services.web':       { ro: '/servicii/creare-site-web',    ru: '/ru/uslugi/sozdanie-sayta', en: '/en/services/web-development' },
  'services.wordpress': { ro: '/servicii/site-wordpress',     ru: '/ru/uslugi/sayt-wordpress', en: '/en/services/wordpress-website' },
  'services.redesign':  { ro: '/servicii/redesign-site',      ru: '/ru/uslugi/redizayn-sayta', en: '/en/services/website-redesign' },
  'services.cards':     { ro: '/servicii/carti-de-vizita',    ru: '/ru/uslugi/vizitki',        en: '/en/services/business-cards' },
  'services.brand':     { ro: '/servicii/identitate-vizuala', ru: '/ru/uslugi/firmennyy-stil', en: '/en/services/brand-identity' },
  portfolio:            { ro: '/portofoliu',                  ru: '/ru/portfolio',             en: '/en/portfolio' },
  blog:                 { ro: '/blog',                        ru: '/ru/blog',                  en: '/en/blog' },
  contact:              { ro: '/contact',                     ru: '/ru/kontakt',               en: '/en/contact' },
};

/**
 * Calea unei pagini statice într-o limbă: route('contact', 'en') → '/en/contact'
 * Folosește-o în locul șirurilor hardcodate, ca linkurile să nu se desincronizeze
 * de tabelul de rute.
 */
export function route(key: RouteKey, locale: Locale): string {
  return ROUTES[key][locale];
}

// Index invers: cale → { cheie, limbă }
const PATH_INDEX = new Map<string, { key: RouteKey; locale: Locale }>();
for (const key of Object.keys(ROUTES) as RouteKey[]) {
  for (const locale of LOCALES) {
    PATH_INDEX.set(ROUTES[key][locale], { key, locale });
  }
}

/** Prefixele secțiunilor cu pagini generate din colecții. */
const SECTIONS = {
  blog: { ro: '/blog', ru: '/ru/blog', en: '/en/blog' },
  portfolio: { ro: '/portofoliu', ru: '/ru/portfolio', en: '/en/portfolio' },
} as const satisfies Record<string, Record<Locale, string>>;

type Section = keyof typeof SECTIONS;

/**
 * Blog: slug canonic (cel românesc) → slug-ul tradus în fiecare limbă.
 * Când adaugi un articol nou tradus, adaugă-l și aici.
 */
const BLOG_SLUGS: Record<string, Partial<Record<Locale, string>>> = {
  'cat-costa-un-site-web-in-moldova': {
    ru: 'skolko-stoit-sayt-v-moldove',
    en: 'how-much-does-a-website-cost-in-moldova',
  },
  'ce-este-seo-si-de-ce-conteaza': {
    ru: 'chto-takoe-seo-i-pochemu-vazhno',
    en: 'what-is-seo-and-why-it-matters',
  },
  'cum-sa-alegi-web-developer': {
    ru: 'kak-vybrat-web-razrabotchika',
    en: 'how-to-choose-a-web-developer',
  },
  'de-ce-afacerea-ta-are-nevoie-de-site': {
    ru: 'zachem-biznesu-sayt',
    en: 'why-your-business-needs-a-website',
  },
  'pagespeed-100-cum-am-obtinut-scor-perfect': {
    ru: 'pagespeed-100-kak-poluchit-idealnyy-rezultat',
    en: 'pagespeed-100-how-i-got-a-perfect-score',
  },
  'site-in-cod-sau-wordpress': {
    ru: 'sayt-v-kode-ili-wordpress',
    en: 'custom-coded-website-or-wordpress',
  },
};

/** slug tradus → slug canonic, per limbă */
const BLOG_SLUGS_REVERSE: Record<string, string> = {};
for (const [canonical, translations] of Object.entries(BLOG_SLUGS)) {
  for (const slug of Object.values(translations)) {
    if (slug) BLOG_SLUGS_REVERSE[slug] = canonical;
  }
}

/**
 * Portofoliu: slug-urile traduse sunt slug-ul canonic + un sufix de limbă.
 * (Fișierele din colecție: `wishdrop.md`, `wishdrop-ru.md`, `wishdrop-en.md`.)
 */
const PORTFOLIO_SUFFIX: Record<Locale, string> = { ro: '', ru: '-ru', en: '-en' };

const stripSlash = (path: string) => path.replace(/\/$/, '') || '/';

function blogSlug(canonical: string, locale: Locale): string | null {
  if (locale === 'ro') return canonical;
  return BLOG_SLUGS[canonical]?.[locale] ?? null;
}

/** Descompune o cale în ce reprezintă, ca s-o putem re-compune în altă limbă. */
function parsePath(path: string):
  | { kind: 'route'; key: RouteKey; locale: Locale }
  | { kind: 'entry'; section: Section; slug: string; locale: Locale }
  | { kind: 'unknown'; locale: Locale } {
  const clean = stripSlash(path);

  const known = PATH_INDEX.get(clean);
  if (known) return { kind: 'route', ...known };

  for (const section of Object.keys(SECTIONS) as Section[]) {
    for (const locale of LOCALES) {
      const prefix = `${SECTIONS[section][locale]}/`;
      if (clean.startsWith(prefix)) {
        return { kind: 'entry', section, slug: clean.slice(prefix.length), locale };
      }
    }
  }

  return { kind: 'unknown', locale: localeFromPath(clean) };
}

function localeFromPath(path: string): Locale {
  if (path === '/ru' || path.startsWith('/ru/')) return 'ru';
  if (path === '/en' || path.startsWith('/en/')) return 'en';
  return 'ro';
}

/**
 * Traducerea exactă 1:1 a paginii curente, sau null dacă nu există.
 * Folosește-o pentru hreflang: o adnotare care indică un 404 e ignorată de Google
 * pentru toată perechea de pagini.
 */
export function getTranslatedPath(currentPath: string, targetLocale: Locale): string | null {
  const parsed = parsePath(currentPath);

  if (parsed.kind === 'route') return ROUTES[parsed.key][targetLocale];

  if (parsed.kind === 'entry') {
    const prefix = SECTIONS[parsed.section][targetLocale];

    if (parsed.section === 'blog') {
      const canonical =
        parsed.locale === 'ro' ? parsed.slug : BLOG_SLUGS_REVERSE[parsed.slug];
      if (!canonical) return null;
      const slug = blogSlug(canonical, targetLocale);
      return slug ? `${prefix}/${slug}` : null;
    }

    // portofoliu
    const suffix = PORTFOLIO_SUFFIX[parsed.locale];
    const base = suffix && parsed.slug.endsWith(suffix)
      ? parsed.slug.slice(0, -suffix.length)
      : suffix
        ? null
        : parsed.slug;
    if (!base) return null;
    return `${prefix}/${base}${PORTFOLIO_SUFFIX[targetLocale]}`;
  }

  return null;
}

/**
 * URL-ul limbii alternative pentru o cale.
 * Pentru schimbătorul de limbă: întoarce mereu un URL valid, căzând pe indexul
 * secțiunii (sau home) când pagina nu are traducere.
 */
export function getAlternatePath(currentPath: string, targetLocale: Locale): string {
  const translated = getTranslatedPath(currentPath, targetLocale);
  if (translated) return translated;

  const parsed = parsePath(currentPath);
  if (parsed.kind === 'entry') return SECTIONS[parsed.section][targetLocale];

  const clean = stripSlash(currentPath);
  const sourceLocale = localeFromPath(clean);
  for (const key of ['blog', 'portfolio', 'services'] as RouteKey[]) {
    const prefix = ROUTES[key][sourceLocale];
    if (clean === prefix || clean.startsWith(`${prefix}/`)) {
      return ROUTES[key][targetLocale];
    }
  }

  return ROUTES.home[targetLocale];
}

/**
 * Toate limbile cu calea corespunzătoare paginii curente — pentru schimbătorul
 * de limbă din header.
 */
export function getLocaleLinks(currentPath: string, currentLocale: Locale) {
  return LOCALES.map((locale) => ({
    locale,
    label: locale.toUpperCase(),
    name: LOCALE_NAMES[locale],
    href: locale === currentLocale ? stripSlash(currentPath) : getAlternatePath(currentPath, locale),
    current: locale === currentLocale,
  }));
}

/**
 * Localize a Romanian path for a given locale
 */
export function localizePath(path: string, locale: Locale): string {
  if (locale === 'ro') return path;
  return getAlternatePath(path, locale);
}

/**
 * Get locale from Astro.currentLocale or path
 */
export function resolveLocale(astroLocale: string | undefined): Locale {
  return (LOCALES as string[]).includes(astroLocale ?? '') ? (astroLocale as Locale) : 'ro';
}

/**
 * Get navigation links for a locale
 */
export function getNavLinks(locale: Locale) {
  const dict = getDict(locale);

  return [
    { label: dict.nav.services, href: route('services', locale) },
    { label: dict.nav.portfolio, href: route('portfolio', locale) },
    { label: dict.nav.blog, href: route('blog', locale) },
    { label: dict.nav.contact, href: route('contact', locale) },
  ];
}

/**
 * Get site config for a locale
 */
export function getSiteConfig(locale: Locale) {
  const configs = {
    ro: {
      name: 'Ban Studio',
      url: 'https://banstudio.dev',
      description: 'Creare site-uri web profesionale in Chisinau si Bucuresti. Design modern, performanta excelenta, SEO optimizat.',
      author: 'Alexandru Bancila',
      locale: 'ro_MD',
      language: 'ro',
    },
    ru: {
      name: 'Ban Studio',
      url: 'https://banstudio.dev',
      description: 'Создание профессиональных веб-сайтов в Кишиневе и Бухаресте. Современный дизайн, отличная производительность, SEO оптимизация.',
      author: 'Александр Банчилэ',
      locale: 'ru_RU',
      language: 'ru',
    },
    en: {
      name: 'Ban Studio',
      url: 'https://banstudio.dev',
      description: 'Professional website development in Chisinau and Bucharest. Modern design, excellent performance, SEO optimised.',
      author: 'Alexandru Bancila',
      locale: 'en_US',
      language: 'en',
    },
  };
  return configs[locale] || configs.ro;
}
