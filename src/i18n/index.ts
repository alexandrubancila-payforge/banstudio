import ro from './ro.json';
import ru from './ru.json';
import en from './en.json';
import { LOCALES, route, type Locale } from './routes';

export * from './routes';


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
