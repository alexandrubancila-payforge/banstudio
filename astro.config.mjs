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
