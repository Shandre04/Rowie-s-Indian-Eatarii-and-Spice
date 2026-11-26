# Design: Rowie's Indian Eatarii & Spices

The shop's own painted sign and order docket. Not a restaurant template. Written from the built site on 2026-11-26.

## World
- **Signboard:** a chilli-red field owns the top of every page and the footer, with a torn-paper edge where it meets the cream counter paper. Two hand-drawn chillies hang off the home sign.
- **Kitchen docket:** today's special (or the house favourite) is a waiter's-pad slip: perforated top, faint ruled lines, the dish name in handwriting, tilted -1.2°, and a SOLD OUT rubber stamp when it's finished.
- **Price board:** the menu is a dark cumin board with handwritten group names in turmeric, dotted leaders, and "Price on WhatsApp" when no price is set.
- **Spice shelf:** a turmeric section with drawn jars on a plank. On the spices page, each spice is a jar label with a red lid and a heat meter made of 0–5 drawn chillies.
- **Placeholders:** masking-tape notes (dashed border, Kalam handwriting, `[square brackets]`). Every unknown uses one. Never fake content.

## Colour (tokens in `assets/site.css :root`)
| Token | Hex | Role |
|---|---|---|
| `--chilli` | #B8231B | Dominant field (sign), primary buttons on cream. Cream on it: 5.3:1 |
| `--chilli-deep` | #8E1A14 | Footer, button hover, order bar |
| `--turmeric` | #EBA51C | The one sharp accent: the order button on red (cumin text 6.9:1); spice-shelf field |
| `--turmeric-soft` | #F4CD72 | Headline highlight on red (large text only) |
| `--cream` | #F5E9D0 | Page ground |
| `--paper` | #FBF4E4 | Docket and jar labels |
| `--cumin` | #3A2416 | Text (12:1 on cream) |
| `--cumin-soft` | #6E5341 | Secondary text (5.9:1 on cream) |
| `--board` | #2E1C12 | Menu board |
| `--cardamom` | #4A6629 | "Open now" only |
| `--paprika` | #C2491A | Illustration only, never text |

## Type
- **Display:** Bricolage Grotesque 700–800 (opsz 12–96): headlines, prices, numerals, the phone number and times (its zero isn't slashed).
- **Hand:** Kalam 700: dish names on the docket, jar names, menu group names, placeholders.
- **Body:** Atkinson Hyperlegible 400/700, from 17px.
- Loaded from Google Fonts with `display=swap` (latin subsets are served automatically).

## Components
- `.btn` pill, 48px minimum (58px for `.btn--order`). Variants: chilli (default), `--order` (turmeric), `--ghost` (outlined). Press: scale .97 in 140ms. Hover only under `(hover: hover) and (pointer: fine)`.
- `.status` chip: green on cream when open, dark translucent when closed. Says "(usual hours)" while `hours.confirmed` is false.
- `.orderbar`: phones only. Slides up once the hero button scrolls away, hides over the footer, and is `inert` while hidden.

## Motion
One page-load rise on the hero text (the order button never waits), a swing-in for the hanging chillies, a drop-in for today's special docket, and press feedback. All off under `prefers-reduced-motion`.

## Rules to keep
- No photos until the owner's own arrive (see PHOTO-SHOT-LIST.md). No stock images, no landmarks, no mandalas, no neon, no gradients-as-decoration.
- Halaal is stated once, shop-wide. No vegetarian tags.
- Show only "4.5 stars from 10 reviews". No review quotes without permission, and no rating in the structured data.
