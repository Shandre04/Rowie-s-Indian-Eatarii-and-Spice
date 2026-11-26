# Rowie-s-Indian-Eatarii-and-Spice
1st Client 

Website for **Rowie's Indian Eatarii & Spices**, 6 Cecil Road, Plumstead. Built by Coppice. Preview only: not yet launched, and hidden from search engines.

Live preview: https://shandre04.github.io/Rowie-s-Indian-Eatarii-and-Spice/

## What's here

- `index.html`, `menu.html`, `spices.html`: the site (plain HTML, CSS and a little JS, no build step)
- `content.json`: everything the owner changes (special, hours, menu, spices). See `HOW-TO-UPDATE.md`

## Run it locally

```
npx http-server . -p 4380 -c-1
```
Then open http://localhost:4380. `content.json` loads by `fetch`, so it needs a server, not a double-clicked file.
