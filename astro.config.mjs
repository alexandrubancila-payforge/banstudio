// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Schimbă cu domeniul tău real înainte de deploy
  site: 'https://banstudio.dev',

  // URL-uri fără trailing slash: /servicii nu /servicii/
  trailingSlash: 'never',

  integrations: [sitemap()],

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
