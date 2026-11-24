---
title: "Alcont — Accounting and tax advice"
description: "A new website for Alcont, an accounting firm in Voluntari, Romania, a CECCAR member since 2009: moved off WordPress without losing its articles or old addresses, with secure forms and a tax-deadline calendar."
client: "Alcont Total Express SRL"
date: 2026-11-17
image: "/images/portofoliu/alcont.webp?v=1c279d25"
imageAlt: "Screenshot of the Alcont website with the headline about accounting and tax advice"
tags: ["Accounting", "WordPress migration", "Romania"]
url: "https://alcont.ro/"
featured: false
order: 0
lang: en
service: services.web
business: "an accounting firm"
location: "in Voluntari, Romania"
relatedServices: ["services.redesign"]
---

## About the project

Alcont has kept the books for companies in Voluntari, Ilfov and Bucharest since 2009, as a member of CECCAR, Romania's body of chartered accountants. The old site ran on WordPress and held more than 50 articles on tax news that brought in visitors from Google. The firm needed a clearer site for its clients without losing anything that already worked.

## What we built

- **A full move off WordPress**: all 55 articles were imported into Markdown and kept their addresses, and old addresses that no longer exist redirect to the right page
- **A page for each service**: accounting and reporting, payroll, tax advice and help during inspections, financial advice and accounting expertise, each with its steps explained
- **The next tax deadline**, shown right on the home page, plus a page with the monthly tax obligations
- **Client portal**: one page where clients send their documents each month instead of digging through email
- **Contact and careers forms** sent through the firm's own mail server and protected from spam with Cloudflare Turnstile
- **Cookies that are really optional**: the Google map only loads if the visitor agrees

## Technology

A static site built with Astro and Tailwind, served by a Cloudflare Worker that also receives the forms. Photos are generated automatically in AVIF and WebP at several sizes, and the animations respect the visitor's reduced-motion setting.
