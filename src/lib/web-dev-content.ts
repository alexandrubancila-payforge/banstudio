/**
 * Conținutul suplimentar al paginii „Creare site web" (RO / RU / EN):
 * introducere, tipuri de site cu prețuri orientative, proiecte, întrebări frecvente.
 *
 * Toate faptele vin din ce e deja publicat pe site — nu adăuga cifre noi aici
 * fără să le schimbi și la sursă:
 *   - prețurile: articolul „Cât costă un site web în Moldova" (+ FAQ de pe home)
 *   - durata 1–3 săptămâni, oferta în 24h, zona de lucru: FAQ de pe home
 *   - ce include / hosting / suport: secțiunile „Ce primești" și „Procesul de lucru"
 *   - proiectele și limbile lor: colecția portofoliu
 */
import type { Locale, RouteKey } from '@/i18n';

interface SiteType {
  name: string;
  price: string;
  desc: string;
  /** slug RO al unui proiect din portofoliu dat ca exemplu */
  example?: string;
  /** sau o pagină de serviciu dedicată */
  service?: RouteKey;
}

interface WebDevContent {
  intro: { title: string; paragraphs: string[] };
  types: {
    title: string;
    subtitle: string;
    exampleLabel: string;
    serviceLabel: string;
    items: SiteType[];
    note: { before: string; link: string; after: string };
  };
  projects: { title: string; subtitle: string; slugs: string[] };
  faq: { title: string; items: { q: string; a: string }[] };
}

/** Articolul despre prețuri, în fiecare limbă. */
export const PRICING_ARTICLE: Record<Locale, string> = {
  ro: '/blog/cat-costa-un-site-web-in-moldova',
  ru: '/ru/blog/skolko-stoit-sayt-v-moldove',
  en: '/en/blog/how-much-does-a-website-cost-in-moldova',
};

const PROJECTS = ['kinetoterra', 'avocat-pro', 'jurist-chisinau', 'anastasia-solomon'];

export const WEB_DEV_CONTENT: Record<Locale, WebDevContent> = {
  ro: {
    intro: {
      title: 'Creare și elaborare site-uri web în Chișinău',
      paragraphs: [
        'Creez site-uri web pentru afaceri din Chișinău și din toată Moldova: site-uri de prezentare, landing page-uri, magazine online și site-uri multilingve. Fiecare proiect pornește de la zero, fără template-uri cumpărate, și e construit în cod, ca să se încarce rapid și să fie găsit pe Google.',
        'Fie că îi spui creare site, elaborare site sau dezvoltare web, scopul e același: un site care îți aduce clienți. Lucrezi direct cu mine, fără intermediari, de la prima discuție până la lansare, iar oferta detaliată o primești în 24 de ore.',
        'Sunt în Chișinău, dar lucrez la distanță și cu clienți din restul Moldovei, din România și din alte țări din Europa — în portofoliu găsești proiecte pentru Verona sau Germania.',
      ],
    },
    types: {
      title: 'Ce tip de site îți trebuie — și cât costă',
      subtitle: 'Prețuri orientative pentru un site construit profesional, cu design unic și cod curat.',
      exampleLabel: 'Exemplu',
      serviceLabel: 'Detalii',
      items: [
        { name: 'Landing page', price: '€150–€400', desc: 'O singură pagină pentru o campanie, un serviciu sau un eveniment: prezentare, beneficii, formular de contact.', example: 'taxi-hincesti' },
        { name: 'Site de prezentare (4–8 pagini)', price: '€400–€1.200', desc: 'Cel mai cerut: acasă, servicii, despre, portofoliu, contact, blog. Potrivit pentru majoritatea afacerilor mici.', example: 'kinetoterra' },
        { name: 'Site WordPress administrabil', price: '€500–€1.500', desc: 'Când vrei să-ți editezi singur conținutul. Cu temă custom, nu cu un page builder lent.', service: 'services.wordpress' },
        { name: 'Magazin online', price: '€1.000–€4.000+', desc: 'Catalog, coș, plăți, livrare, conturi. Costul crește cu numărul de funcții.', example: 'spiridon-vangheli' },
      ],
      note: { before: 'Ce influențează prețul și de ce un site „ieftin" iese de obicei scump explic în ghidul ', link: 'Cât costă un site web în Moldova', after: '.' },
    },
    projects: {
      title: 'Site-uri create pentru afaceri din Chișinău',
      subtitle: 'Câteva dintre proiectele recente — fiecare cu studiu de caz.',
      slugs: PROJECTS,
    },
    faq: {
      title: 'Întrebări frecvente despre crearea unui site',
      items: [
        { q: 'Cât costă crearea unui site web în Chișinău?', a: 'Un landing page costă de obicei €150–€400, un site de prezentare €400–€1.200, iar un magazin online pornește de la €1.000. Prețul exact depinde de design, numărul de pagini și funcții — îți trimit o ofertă detaliată în 24 de ore.' },
        { q: 'În cât timp e gata un site?', a: 'Un site de prezentare durează în medie 1–3 săptămâni. Termenul depinde de complexitate și de cât de repede primesc conținutul (texte și poze).' },
        { q: 'Ce include prețul?', a: 'Design unic, dezvoltare în cod, versiune pentru telefon și tabletă, optimizare SEO de bază (meta tags, schema markup, sitemap, viteză), ajutor la publicarea pe hosting și suport după lansare.' },
        { q: 'Trebuie să plătesc separat pentru hosting?', a: 'Site-urile în cod le public pe Cloudflare Pages sau Vercel: hosting rapid, cu CDN global, gratuit pentru majoritatea site-urilor de prezentare. Te ajut eu cu toată configurarea.' },
        { q: 'Pot modifica singur conținutul site-ului?', a: 'Dacă vrei să schimbi des texte, poze sau articole, potrivit e un site WordPress administrabil. Un site în cod e mai rapid și mai sigur, dar modificările se fac în cod. Alegem împreună varianta care ți se potrivește.' },
        { q: 'Faci și site-uri în rusă sau engleză?', a: 'Da. Mai multe proiecte din portofoliu sunt multilingve, de exemplu AnonXmd (EN/RO/RU) sau ProExperTrans (RO/RU/EN). Fiecare limbă în plus înseamnă conținut și structură suplimentare, deci se reflectă în preț.' },
        { q: 'Lucrezi doar cu clienți din Chișinău?', a: 'Sunt în Chișinău, dar lucrez la distanță cu clienți din toată Moldova și din România. Totul se poate face online.' },
      ],
    },
  },

  ru: {
    intro: {
      title: 'Создание и разработка сайтов в Кишинёве',
      paragraphs: [
        'Я создаю сайты для бизнеса в Кишинёве и по всей Молдове: сайты-визитки, лендинги, интернет-магазины и мультиязычные сайты. Каждый проект делается с нуля, без купленных шаблонов, и пишется в коде — чтобы сайт быстро загружался и находился в Google.',
        'Создание сайта, разработка сайта или веб-разработка — цель одна: сайт, который приводит клиентов. Вы работаете напрямую со мной, без посредников, от первого разговора до запуска, а подробное предложение получаете в течение 24 часов.',
        'Я нахожусь в Кишинёве, но работаю удалённо и с клиентами из других городов Молдовы, из Румынии и других стран Европы — в портфолио есть проекты для Вероны и Германии.',
      ],
    },
    types: {
      title: 'Какой сайт вам нужен — и сколько он стоит',
      subtitle: 'Ориентировочные цены на профессионально сделанный сайт с уникальным дизайном и чистым кодом.',
      exampleLabel: 'Пример',
      serviceLabel: 'Подробнее',
      items: [
        { name: 'Лендинг', price: '€150–€400', desc: 'Одна страница для кампании, услуги или события: презентация, преимущества, форма заявки.', example: 'taxi-hincesti' },
        { name: 'Сайт-визитка (4–8 страниц)', price: '€400–€1.200', desc: 'Самый востребованный: главная, услуги, о нас, портфолио, контакты, блог. Подходит большинству малых бизнесов.', example: 'kinetoterra' },
        { name: 'Сайт на WordPress', price: '€500–€1.500', desc: 'Когда хотите редактировать контент самостоятельно. С кастомной темой, а не медленным конструктором.', service: 'services.wordpress' },
        { name: 'Интернет-магазин', price: '€1.000–€4.000+', desc: 'Каталог, корзина, оплата, доставка, личные кабинеты. Цена растёт вместе с количеством функций.', example: 'spiridon-vangheli' },
      ],
      note: { before: 'Что влияет на цену и почему «дешёвый» сайт обычно обходится дороже, я разбираю в статье ', link: 'Сколько стоит сайт в Молдове', after: '.' },
    },
    projects: {
      title: 'Сайты для бизнеса в Кишинёве',
      subtitle: 'Несколько недавних проектов — у каждого есть подробный кейс.',
      slugs: PROJECTS,
    },
    faq: {
      title: 'Частые вопросы о создании сайта',
      items: [
        { q: 'Сколько стоит создание сайта в Кишинёве?', a: 'Лендинг обычно стоит €150–€400, сайт-визитка — €400–€1.200, интернет-магазин — от €1.000. Точная цена зависит от дизайна, количества страниц и функций — подробное предложение пришлю в течение 24 часов.' },
        { q: 'Сколько времени занимает разработка сайта?', a: 'Сайт-визитка в среднем занимает 1–3 недели. Срок зависит от сложности и от того, как быстро я получу контент (тексты и фото).' },
        { q: 'Что входит в стоимость?', a: 'Уникальный дизайн, разработка в коде, версия для телефона и планшета, базовая SEO-оптимизация (мета-теги, schema-разметка, sitemap, скорость), помощь с публикацией на хостинге и поддержка после запуска.' },
        { q: 'Нужно ли отдельно платить за хостинг?', a: 'Сайты в коде я публикую на Cloudflare Pages или Vercel: быстрый хостинг с глобальным CDN, бесплатный для большинства сайтов-визиток. Всю настройку беру на себя.' },
        { q: 'Смогу ли я сам менять контент на сайте?', a: 'Если вы хотите часто менять тексты, фото или статьи, подойдёт сайт на WordPress. Сайт в коде быстрее и надёжнее, но правки вносятся в код. Вместе выберем подходящий вариант.' },
        { q: 'Делаете ли вы сайты на русском или английском?', a: 'Да. Многие проекты в портфолио мультиязычные, например AnonXmd (EN/RO/RU) или ProExperTrans (RO/RU/EN). Каждый дополнительный язык — это дополнительный контент и структура, поэтому он отражается в цене.' },
        { q: 'Вы работаете только с клиентами из Кишинёва?', a: 'Я в Кишинёве, но работаю удалённо с клиентами по всей Молдове и из Румынии. Всё можно сделать онлайн.' },
      ],
    },
  },

  en: {
    intro: {
      title: 'Website development and web design in Chisinau',
      paragraphs: [
        'I build websites for businesses in Chisinau and across Moldova: presentation websites, landing pages, online shops and multilingual sites. Every project starts from scratch, with no bought templates, and is built in code so it loads fast and gets found on Google.',
        'Whether you call it website creation, web design or web development, the goal is the same: a website that brings you clients. You work directly with me, with no middlemen, from the first conversation to launch, and you get a detailed quote within 24 hours.',
        'I am based in Chisinau, but I also work remotely with clients from the rest of Moldova, Romania and elsewhere in Europe — the portfolio includes projects for Verona and Germany.',
      ],
    },
    types: {
      title: 'Which website you need — and what it costs',
      subtitle: 'Indicative prices for a professionally built website with a unique design and clean code.',
      exampleLabel: 'Example',
      serviceLabel: 'Details',
      items: [
        { name: 'Landing page', price: '€150–€400', desc: 'A single page for a campaign, a service or an event: introduction, benefits, contact form.', example: 'taxi-hincesti' },
        { name: 'Presentation website (4–8 pages)', price: '€400–€1,200', desc: 'The most requested: home, services, about, portfolio, contact, blog. Right for most small businesses.', example: 'kinetoterra' },
        { name: 'Manageable WordPress website', price: '€500–€1,500', desc: 'For when you want to edit the content yourself. With a custom theme, not a slow page builder.', service: 'services.wordpress' },
        { name: 'Online shop', price: '€1,000–€4,000+', desc: 'Catalogue, cart, payments, delivery, accounts. The cost grows with the number of features.', example: 'spiridon-vangheli' },
      ],
      note: { before: 'What drives the price, and why a "cheap" website usually ends up expensive, is covered in ', link: 'How much does a website cost in Moldova', after: '.' },
    },
    projects: {
      title: 'Websites built for businesses in Chisinau',
      subtitle: 'A few recent projects — each with a full case study.',
      slugs: PROJECTS,
    },
    faq: {
      title: 'Frequently asked questions about getting a website',
      items: [
        { q: 'How much does a website cost in Chisinau?', a: 'A landing page usually costs €150–€400, a presentation website €400–€1,200, and an online shop starts at €1,000. The exact price depends on the design, the number of pages and the features — I will send you a detailed quote within 24 hours.' },
        { q: 'How long does it take to build a website?', a: 'A presentation website takes 1–3 weeks on average, depending on complexity and on how quickly I receive your content (copy and photos).' },
        { q: 'What is included in the price?', a: 'A unique design, development in code, a phone and tablet version, basic SEO (meta tags, schema markup, sitemap, speed), help publishing it on hosting, and support after launch.' },
        { q: 'Do I have to pay separately for hosting?', a: 'I publish code-built websites on Cloudflare Pages or Vercel: fast hosting with a global CDN, free for most presentation websites. I take care of the whole setup.' },
        { q: 'Can I edit the website content myself?', a: 'If you want to change copy, photos or articles often, a manageable WordPress website is the right fit. A code-built site is faster and more secure, but changes are made in the code. We will pick the option that suits you together.' },
        { q: 'Do you build websites in Romanian or Russian too?', a: 'Yes. Several projects in the portfolio are multilingual, for example AnonXmd (EN/RO/RU) and ProExperTrans (RO/RU/EN). Every extra language means extra content and structure, so it is reflected in the price.' },
        { q: 'Do you only work with clients in Chisinau?', a: 'I am based in Chisinau, but I work remotely with clients across Moldova, Romania and the rest of Europe. Everything can be done online.' },
      ],
    },
  },
};
