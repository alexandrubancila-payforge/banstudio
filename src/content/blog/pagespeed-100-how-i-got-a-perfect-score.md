---
title: "PageSpeed 100/100 — how I got a perfect score on banstudio.dev"
description: "I scored 100 on Performance, Accessibility, Best Practices and SEO in Google PageSpeed Insights. Here is exactly what I did and why it matters for your business."
date: 2026-05-28
image: "/images/blog/pagespeed-100-how-i-got-a-perfect-score.webp?v=e787d46e"
imageAlt: "PageSpeed 100 / 100"
tags: ["Performance", "SEO", "Web Development"]
draft: false
lang: en
---

![PageSpeed Insights — a score of 100 across all four categories for banstudio.dev](/images/blog/pagespeed-100-banstudio.png?v=39ddd353)

## A perfect score: 100 / 100 / 100 / 100

On 28 May 2026, the Ban Studio website earned a **perfect score in Google PageSpeed Insights** — 100 in all four categories, on mobile as well as desktop:

- **Performance: 100** — the site loads almost instantly
- **Accessibility: 100** — accessible to every user
- **Best Practices: 100** — it respects every modern web standard
- **SEO: 100** — fully optimised for search engines

You can verify it any time on [PageSpeed Insights](https://pagespeed.web.dev/analysis/https-banstudio-dev/).

## Why site speed matters

Speed isn't just a nice-looking number. It has a direct impact on your business:

- **53% of visitors** leave if a site takes more than 3 seconds to load
- Google uses speed as a **ranking factor** — fast sites appear higher
- A fast site means **more conversions** — every extra second cuts the conversion rate by 7%

## The techniques I used

### 1. Zero external CSS — everything inline

The site's CSS is included directly in the HTML rather than in a separate file. That removes one extra HTTP request that would block the page from rendering. The result: the page appears immediately, without waiting for a CSS file to download.

### 2. Optimised WebP images

Every image is in WebP format, compressed and resized to exactly the dimensions it is displayed at. Compared to JPEG, WebP saves 70-80% of the file size at the same visual quality.

### 3. Self-hosted fonts

The fonts are hosted on the same server rather than loaded from Google Fonts. Zero external connections means zero DNS and TLS delays.

### 4. Semantic, accessible HTML

Every element plays its proper role: `h1`-`h6` tags in the correct order, `alt` attributes on images, `aria-label` on buttons, and colour contrast high enough to stay readable.

### 5. Schema.org structured data

The site includes structured data (JSON-LD) that helps Google understand which services I offer, where I am based and how I can be reached.

### 6. A static site — zero unnecessary JavaScript

The site is built with Astro, a framework that generates static HTML. No heavy JavaScript frameworks are loaded — just HTML, CSS and the bare minimum of JS.

## What this means for my clients

Every site I build follows the same principles. This isn't only about banstudio.dev — **your site can get the same results**.

A fast, well-optimised website means:
- Your clients don't leave frustrated
- Google places you higher in search
- More visits turn into calls and orders

## Want a site that scores 100?

If you need a professional website that is fast and properly optimised, [get in touch](/en/contact) for a free quote. I build every site from scratch, with no templates, focused on performance and results.
