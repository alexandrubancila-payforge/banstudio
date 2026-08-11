/**
 * Calea canonică a paginii curente, așa cum e servită public.
 *
 * `build.format: 'file'` face ca `Astro.url.pathname` să fie `/servicii.html` la
 * build (în dev rămâne `/servicii`). Cloudflare Pages servește fișierul la
 * `/servicii` și redirecționează `/servicii.html` → `/servicii`, deci forma
 * publică — cea care trebuie să ajungă în canonical, hreflang, og:url și JSON-LD
 * — e mereu fără extensie.
 *
 * Folosește ASTA, nu `Astro.url.pathname`, oriunde calea ajunge într-un URL
 * public.
 */
export function routePath(url: URL): string {
  const path = url.pathname.replace(/\.html$/, '').replace(/\/index$/, '/');
  return path === '' ? '/' : path;
}
