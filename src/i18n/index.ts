import ro from './ro.json';
import ru from './ru.json';

export type Locale = 'ro' | 'ru';

const dictionaries = { ro, ru } as const;

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
 * Route mapping: Romanian path → Russian path
 */
const routeMap: Record<string, string> = {
  '/': '/ru',
  '/servicii': '/ru/uslugi',
  '/servicii/creare-site-web': '/ru/uslugi/sozdanie-sayta',
  '/servicii/site-wordpress': '/ru/uslugi/sayt-wordpress',
  '/servicii/redesign-site': '/ru/uslugi/redizayn-sayta',
  '/servicii/carti-de-vizita': '/ru/uslugi/vizitki',
  '/servicii/identitate-vizuala': '/ru/uslugi/firmennyy-stil',
  '/portofoliu': '/ru/portfolio',
  '/blog': '/ru/blog',
  '/contact': '/ru/kontakt',
};

// Reverse map: Russian path → Romanian path
const reverseRouteMap: Record<string, string> = {};
for (const [roPath, ruPath] of Object.entries(routeMap)) {
  reverseRouteMap[ruPath] = roPath;
}

/**
 * Blog slug mapping: Romanian slug → Russian slug.
 * Slug-urile sunt traduse, nu identice — deci nu pot fi derivate. Când adaugi un
 * articol nou tradus, adaugă-l și aici, altfel hreflang-ul îl ignoră și
 * schimbătorul de limbă cade pe /ru/blog.
 */
const blogSlugMap: Record<string, string> = {
  'cat-costa-un-site-web-in-moldova': 'skolko-stoit-sayt-v-moldove',
  'ce-este-seo-si-de-ce-conteaza': 'chto-takoe-seo-i-pochemu-vazhno',
  'cum-sa-alegi-web-developer': 'kak-vybrat-web-razrabotchika',
  'de-ce-afacerea-ta-are-nevoie-de-site': 'zachem-biznesu-sayt',
  'pagespeed-100-cum-am-obtinut-scor-perfect': 'pagespeed-100-kak-poluchit-idealnyy-rezultat',
  'site-in-cod-sau-wordpress': 'sayt-v-kode-ili-wordpress',
};

const blogSlugMapReverse: Record<string, string> = {};
for (const [roSlug, ruSlug] of Object.entries(blogSlugMap)) {
  blogSlugMapReverse[ruSlug] = roSlug;
}

// Portofoliu: slug-urile RU sunt slug-ul RO + sufixul `-ru`
const PORTFOLIO_RU_SUFFIX = '-ru';

const stripSlash = (path: string) => path.replace(/\/$/, '') || '/';

/**
 * Traducerea exactă 1:1 a unei pagini, sau null dacă nu există.
 * Folosește-o pentru hreflang: o adnotare care indică un 404 e ignorată de Google
 * pentru toată perechea de pagini.
 */
export function getTranslatedPath(currentPath: string, targetLocale: Locale): string | null {
  const clean = stripSlash(currentPath);

  if (targetLocale === 'ru') {
    if (routeMap[clean]) return routeMap[clean];

    if (clean.startsWith('/blog/')) {
      const ruSlug = blogSlugMap[clean.slice('/blog/'.length)];
      return ruSlug ? `/ru/blog/${ruSlug}` : null;
    }
    if (clean.startsWith('/portofoliu/')) {
      return `/ru/portfolio/${clean.slice('/portofoliu/'.length)}${PORTFOLIO_RU_SUFFIX}`;
    }
    return null;
  }

  if (reverseRouteMap[clean]) return reverseRouteMap[clean];

  if (clean.startsWith('/ru/blog/')) {
    const roSlug = blogSlugMapReverse[clean.slice('/ru/blog/'.length)];
    return roSlug ? `/blog/${roSlug}` : null;
  }
  if (clean.startsWith('/ru/portfolio/')) {
    const ruSlug = clean.slice('/ru/portfolio/'.length);
    return ruSlug.endsWith(PORTFOLIO_RU_SUFFIX)
      ? `/portofoliu/${ruSlug.slice(0, -PORTFOLIO_RU_SUFFIX.length)}`
      : null;
  }
  return null;
}

/**
 * Get the alternate language URL for a given path.
 * Pentru schimbătorul de limbă: întoarce mereu un URL valid, căzând pe indexul
 * secțiunii (sau home) când pagina nu are traducere.
 */
export function getAlternatePath(currentPath: string, targetLocale: Locale): string {
  const translated = getTranslatedPath(currentPath, targetLocale);
  if (translated) return translated;

  const clean = stripSlash(currentPath);

  if (targetLocale === 'ru') {
    if (clean.startsWith('/blog')) return '/ru/blog';
    if (clean.startsWith('/portofoliu')) return '/ru/portfolio';
    if (clean.startsWith('/servicii')) return '/ru/uslugi';
    return '/ru';
  }

  if (clean.startsWith('/ru/blog')) return '/blog';
  if (clean.startsWith('/ru/portfolio')) return '/portofoliu';
  if (clean.startsWith('/ru/uslugi')) return '/servicii';
  return '/';
}

/**
 * Localize a Romanian path for a given locale
 */
export function localizePath(path: string, locale: Locale): string {
  if (locale === 'ro') return path;
  return getAlternatePath(path, 'ru');
}

/**
 * Get locale from Astro.currentLocale or path
 */
export function resolveLocale(astroLocale: string | undefined): Locale {
  return (astroLocale === 'ru' ? 'ru' : 'ro') as Locale;
}

/**
 * Get navigation links for a locale
 */
export function getNavLinks(locale: Locale) {
  const dict = getDict(locale);
  const prefix = locale === 'ru' ? '/ru' : '';

  const paths = locale === 'ru'
    ? { services: '/ru/uslugi', portfolio: '/ru/portfolio', blog: '/ru/blog', contact: '/ru/kontakt' }
    : { services: '/servicii', portfolio: '/portofoliu', blog: '/blog', contact: '/contact' };

  return [
    { label: dict.nav.services, href: paths.services },
    { label: dict.nav.portfolio, href: paths.portfolio },
    { label: dict.nav.blog, href: paths.blog },
    { label: dict.nav.contact, href: paths.contact },
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
  };
  return configs[locale] || configs.ro;
}
