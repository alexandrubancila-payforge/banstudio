---
title: "WishDrop — Shareable gift lists"
description: "A web app for wish lists: you create a list, share it as a link, and the people close to you reserve gifts without spoiling the surprise. My own project, full-stack on Cloudflare."
client: "Personal project"
date: 2026-06-25
image: "/images/portofoliu/wishdrop.webp?v=f7956de0"
imageAlt: "WishDrop — a shareable gift list app"
tags: ["SaaS", "Full-stack", "Cloudflare"]
url: "https://wishdrop.site/"
featured: true
order: 0
lang: en
---

## About the project

WishDrop is a product of my own — a web app for shareable wish lists. You create an account, add the gifts you would like (photo, price and link), then share the list through a single link. The people close to you reserve what they want to give you, and a reserved gift disappears for everyone else — no duplicate gifts, and the surprise stays intact.

## What I built

- **Full-stack on Cloudflare** — Astro with SSR on Workers, a D1 database, images in R2, custom JWT authentication and Google sign-in.
- **Autofill from a link** — paste a product URL and the app pulls in the title, the price and the photo.
- **Surprise mode, priorities and reservations** — you mark the gifts you really want, and the owner can hide the reservations.
- **Multilingual (RO / EN / DE / RU), an installable PWA and 100% free** — the people reserving don't need an account.

## Result

A complete SaaS, fast and installable as an app, hosted entirely on Cloudflare's infrastructure.
