# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Plain static HTML, CSS and a little vanilla JS (chosen by Shandré, 2026-11-26). No build step. All changeable content lives in `content.json` so a non-technical owner can edit it. Built by Coppice (the agency); Coppice's own PRODUCT.md, DESIGN.md, colours, tone and Astro stack do not apply here.

## Users

- **Regulars:** Southern Suburbs locals who already know the food. They arrive from a Facebook post or Google Maps on a phone, often on mobile data, and want today's special and the WhatsApp number, fast.
- **Newcomers:** people nearby who found the shop on Google. They want to know what it is, whether it's halaal, how ordering works and whether to trust it.

Both are one-handed phone users on slow 4G.

## Product Purpose

Website for **Rowie's Indian Eatarii & Spices**, 6 Cecil Road, Plumstead, Cape Town, 7800. Job one: get a hungry person from Google or Facebook to a WhatsApp order in as few taps as possible (two taps from the home page). Job two: show the spice shop and make people trust the place enough to walk in.

Success: a WhatsApp order in two taps; the owner can change today's special without help; nothing on the site is invented.

## Positioning

A one-owner neighbourhood eatery and spice shop in Plumstead making Durban-style Indian food (curries, biryani, rotis), with lamb curry on the bone as the hero. Orders come in on WhatsApp, food is made fresh and collected in the shop, and there's a shelf of spices to buy. The daily special rotates and often sells out early.

## Operating Context

- Ordering: WhatsApp 082 725 1918 (links use `27827251918`). Pre-filled messages for general orders, today's special and per spice.
- Collection only until the owner confirms delivery.
- Halaal, shop-wide. Not a vegetarian place.
- South African English, rand pricing, SAST (Africa/Johannesburg).
- Owner updates the special, hours, menu, spices, prices and sold-out flags in `content.json`, guided by `HOW-TO-UPDATE.md`.

## Capabilities and Constraints

- Static, fast: first load under about 1 MB on mobile; Lighthouse mobile 90+ in all four categories.
- Open/closed status computed in Africa/Johannesburg from one hours config.
- No cart, no online payment, no tracking.
- **Undecided (placeholders until the owner confirms):** opening hours (draft online: Tue–Fri 09:00–18:00, Sat–Sun 09:30–14:00, Mon closed; the live badge runs on this draft, flagged "to be confirmed"), delivery, full menu and prices, spice list, owner's name and story, payment methods, parking, halaal certifying body, allergen notes, catering, social links, domain.

## Brand Commitments

- Name: "Rowie's Indian Eatarii & Spices" (two i's, as on the shop sign; keep it).
- Logo: cream badge, red chilli on top, "Rowie's", "INDIAN EATARII & SPICES". Use the real file only; never redraw it. Not yet supplied: the header shows a marked slot at `assets/logo.png` with the name set in type until it arrives.
- Voice: a person from Plumstead talking. Short plain sentences, warm, a bit cheeky, never fluffy. Customers say it feels like home and the spices are "just right" (tone guide only, not for quoting).

## Evidence on Hand

- Real and confirmed: 4.5 stars from 10 reviews. Show exactly that, nothing higher. No individual review quoted without permission.
- No photos, no logo file, no prices, no menu yet.
- Never fabricate reviews, awards, founding year, owner name, backstory, prices, allergen info or vegetarian tags.

## Product Principles

1. The order button is always one tap away and nothing gets in its way.
2. Honest over full: every unknown is a visible placeholder, never filler.
3. It should look like it belongs to this shop in Plumstead and nowhere else.
4. The owner must be able to run it from one file.

## Accessibility & Inclusion

WCAG 2.1 AA, 44 px minimum tap targets, visible focus, real headings and landmarks, alt text, labels that make sense read aloud, `prefers-reduced-motion` respected.
