# How to update your website

Everything you'll want to change lives in **one file: `content.json`**. Open it in Notepad (or any text editor), change the words between the quote marks, save it, and upload it. That's it. No other file needs touching.

**Golden rules**
- Only change the words **inside** the quote marks `"like this"`.
- Keep every comma, colon and bracket where it is. If the site stops showing the special or the menu, a comma has probably gone missing. Undo your last change and try again.
- To check your file before uploading, paste it into https://jsonlint.com. It tells you exactly which line has a problem.

---

## 1. Today's special (every morning)

Find the `"special"` part at the top:

```json
"special": {
  "show": true,
  "date": "2026-11-27",
  "dish": "Mutton curry",
  "comesWith": "With basmati rice or roti, and salad.",
  "price": "R95",
  "soldOut": false
},
```

- **date:** today's date as year-month-day. The special only shows on that date, so if you forget to update it, the site won't show yesterday's food. It shows the lamb curry as the "house favourite" instead.
- **dish:** the name of the special.
- **comesWith:** what's on the plate.
- **price:** for example `"R95"`. Leave it as `""` and the site says "Price on WhatsApp".
- **soldOut:** change to `true` when it's finished. The site stamps it SOLD OUT and the button changes to "Ask what's next".
- **show:** change to `false` to hide the special completely.

## 2. Sold out on the menu or a spice

Every menu item and spice has `"soldOut": false`. Change it to `true` and the site crosses it out. Change it back tomorrow.

## 3. Opening hours

```json
"hours": {
  "confirmed": false,
  "monday": "closed",
  "tuesday": "09:00-18:00",
  ...
  "note": ""
}
```

- Write times as `"09:00-18:00"` (24-hour clock) or `"closed"`.
- Once the hours are right, change `"confirmed"` to `true`. That removes the "to be confirmed" note.
- **note:** anything extra, for example `"Closed on public holidays."` or `"Closing early on 24 December."`
- The "Open now / Closed" badge works itself out from these times, in Cape Town time.

## 4. Menu

Each group (Curries, Biryani, Rotis and sides) has a list of items:

```json
{ "name": "Lamb curry", "description": "Lamb on the bone. With basmati rice or roti, and salad.", "price": "R110", "signature": true, "soldOut": false }
```

- **signature: true** means it also shows on the home page board. Keep it to two to four dishes.
- To **add** a dish, copy a whole line from `{` to `}`, paste it under the last one, and put a comma between them.
- To **remove** a dish, delete its whole line from `{` to `}` and the comma before it.
- Lines with a `"placeholder"` are the gaps we're waiting to fill. Fill in the name and delete the `"placeholder": "..."` part.

## 5. Spices

```json
{ "name": "Kashmiri chilli powder", "description": "Bright red, gentle heat.", "heat": 2, "goodFor": "Curries and marinades", "size": "100 g", "price": "R35", "soldOut": false }
```

- **heat:** a number from 0 (no heat) to 5 (very hot). The site draws that many red chillies.
- Every spice gets an "Ask about this spice" button that opens WhatsApp with the spice name already typed.

## 6. Logo

Put the logo file in the `assets` folder (for example `assets/logo.png`) and set `"logo": "assets/logo.png"`. Until then, the site shows the name in type.

---

## Testing a change before customers see it

Add `?preview=soldout`, `?preview=special` or `?preview=none` to the end of the web address to see how those states look. These are test views only and don't change anything for customers.

Stuck? Send Coppice a WhatsApp with a screenshot.
