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
  '/despre': '/ru/o-nas',
  '/contact': '/ru/kontakt',
};

// Reverse map: Russian path → Romanian path
const reverseRouteMap: Record<string, string> = {};
for (const [roPath, ruPath] of Object.entries(routeMap)) {
  reverseRouteMap[ruPath] = roPath;
}

/**
 * Get the alternate language URL for a given path
 */
export function getAlternatePath(currentPath: string, targetLocale: Locale): string {
  // Clean trailing slashes
  const clean = currentPath.replace(/\/$/, '') || '/';

  if (targetLocale === 'ru') {
    // Romanian → Russian
    if (routeMap[clean]) return routeMap[clean];
    // Portfolio/blog dynamic pages: /portofoliu/slug → /ru/portfolio/slug
    if (clean.startsWith('/portofoliu/')) return clean.replace('/portofoliu/', '/ru/portfolio/');
    if (clean.startsWith('/blog/')) return clean.replace('/blog/', '/ru/blog/');
    return '/ru';
  } else {
    // Russian → Romanian
    if (reverseRouteMap[clean]) return reverseRouteMap[clean];
    if (clean.startsWith('/ru/portfolio/')) return clean.replace('/ru/portfolio/', '/portofoliu/');
    if (clean.startsWith('/ru/blog/')) return clean.replace('/ru/blog/', '/blog/');
    return '/';
  }
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
    ? { services: '/ru/uslugi', portfolio: '/ru/portfolio', blog: '/ru/blog', about: '/ru/o-nas', contact: '/ru/kontakt' }
    : { services: '/servicii', portfolio: '/portofoliu', blog: '/blog', about: '/despre', contact: '/contact' };

  return [
    { label: dict.nav.services, href: paths.services },
    { label: dict.nav.portfolio, href: paths.portfolio },
    { label: dict.nav.blog, href: paths.blog },
    { label: dict.nav.about, href: paths.about },
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
