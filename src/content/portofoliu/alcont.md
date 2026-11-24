---
title: "Alcont — Contabilitate și consultanță fiscală"
description: "Site nou pentru Alcont, o firmă de contabilitate din Voluntari, membră CECCAR din 2009: migrat de pe WordPress fără să piardă articolele și adresele vechi, cu formulare sigure și un calendar al termenelor fiscale."
client: "Alcont Total Express SRL"
date: 2026-11-17
image: "/images/portofoliu/alcont.webp?v=1c279d25"
imageAlt: "Screenshot site Alcont cu titlul „Contabilitate și consultanță fiscală, pe înțelesul tău”"
tags: ["Contabilitate", "Migrare WordPress", "România"]
url: "https://alcont.ro/"
featured: false
order: 0
lang: ro
service: services.web
business: "firmă de contabilitate"
location: "în Voluntari"
relatedServices: ["services.redesign"]
---

## Despre proiect

Alcont ține contabilitatea firmelor din Voluntari, Ilfov și București din 2009, ca membru CECCAR. Vechiul site era pe WordPress și avea peste 50 de articole despre noutăți fiscale, care aduceau vizite din Google. Trebuia un site nou, mai clar pentru clienți, dar fără să pierdem nimic din ce funcționa deja.

## Ce am realizat

- **Migrare completă de pe WordPress**: cele 55 de articole au fost importate în Markdown și au rămas la aceleași adrese, iar adresele vechi care nu mai există redirecționează către pagina potrivită
- **Pagini dedicate pentru fiecare serviciu**: contabilitate și raportări, salarizare, consultanță fiscală și asistență la controale, consultanță financiar-contabilă, expertize contabile, fiecare cu pașii de lucru explicați
- **Următorul termen fiscal**, afișat chiar pe prima pagină, plus o pagină cu obligațiile fiscale lunare
- **Portal clienți**: o pagină de unde clienții trimit lunar documentele, fără să le mai caute pe email
- **Formulare de contact și de carieră** trimise prin serverul de email al firmei și protejate de spam cu Cloudflare Turnstile
- **Cookie-uri cu adevărat opționale**: harta Google se încarcă doar dacă vizitatorul acceptă

## Tehnologii

Site static construit cu Astro și Tailwind, servit de un Cloudflare Worker care primește și formularele. Fotografiile sunt generate automat în AVIF și WebP la mai multe dimensiuni, iar animațiile respectă setarea „reducere mișcare” a vizitatorului.
