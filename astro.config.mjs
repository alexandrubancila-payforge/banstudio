// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { getHreflangLinks } from './src/i18n/routes.ts';

export default defineConfig({
  site: 'https://banstudio.dev',
  trailingSlash: 'never',

  i18n: {
    defaultLocale: 'ro',
    locales: ['ro', 'ru', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  integrations: [
    // Fără opțiunea `i18n` a pluginului: ea potrivește variantele doar după căi
    // identice (/blog ↔ /en/blog), iar slug-urile noastre sunt traduse
    // (/portofoliu ↔ /en/portfolio, articole, studii de caz). Legăturile alternate
    // vin din aceeași hartă ca hreflang-ul din <head>, deci cele două coincid mereu.
    sitemap({
      filter: (page) => !/\/404$/.test(new URL(page).pathname),
      serialize(item) {
        const path = new URL(item.url).pathname;
        item.links = getHreflangLinks(path).map(({ hreflang, href }) => ({ lang: hreflang, url: href }));
        return item;
      },
    }),
  ],

  // Inline tot CSS-ul — elimină render-blocking stylesheet
  build: {
    inlineStylesheets: 'always',
    // format: 'file' → emite `servicii.html`, nu `servicii/index.html`.
    // Cloudflare Pages servește fișierul la /servicii cu 200 și redirecționează
    // /servicii/ → /servicii. Cu formatul 'directory' (default) se întâmpla exact
    // invers: /servicii dădea 308 → /servicii/, deci TOATE cele 66 de URL-uri din
    // sitemap și toate canonical-urile (generate cu trailingSlash: 'never')
    // trimiteau Google pe un redirect. Nu schimba asta fără să schimbi și
    // trailingSlash.
    format: 'file',
  },

  vite: {
    plugins: [tailwindcss()],
  },

  // Markdown optimizat pentru blog
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
});
