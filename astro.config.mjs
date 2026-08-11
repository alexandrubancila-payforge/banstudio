// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://banstudio.dev',
  trailingSlash: 'never',

  i18n: {
    defaultLocale: 'ro',
    locales: ['ro', 'ru'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'ro',
        locales: { ro: 'ro-MD', ru: 'ru-RU' },
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
