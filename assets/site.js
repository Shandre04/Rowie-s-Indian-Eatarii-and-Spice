/* Rowie's: reads content.json and fills in the special, hours, menu and spices.
   Nothing here needs a build step. */
(() => {
  "use strict";

  const PHONE = "27827251918";
  const TZ = "Africa/Johannesburg";
  const DAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const DAY_LABEL = { monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday", thursday: "Thursday", friday: "Friday", saturday: "Saturday", sunday: "Sunday" };
  const DAY_SHORT = { monday: "Mon", tuesday: "Tue", wednesday: "Wed", thursday: "Thu", friday: "Fri", saturday: "Sat", sunday: "Sun" };
  const JSONLD_DAY = { monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday", thursday: "Thursday", friday: "Friday", saturday: "Saturday", sunday: "Sunday" };

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const has = (s) => typeof s === "string" && s.trim() !== "";
  const ph = (text) => `<span class="ph">${esc(text)}</span>`;

  const wa = (msg) => `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`;
  const MSG_GENERAL = "Hi Rowie's, I'd like to place an order.";

  const WA_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3 1 2.6 1.1 2.8.1.2 1.9 2.9 4.6 4 1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.5-.3Z"/></svg>';
  const CHILLI = (on) => `<svg viewBox="0 0 24 24" class="${on ? "on" : "off"}" aria-hidden="true"><path fill="currentColor" d="M18.6 6.2c-1.3-.4-2.4.4-3 1.6-1.3 2.6-3.6 5.9-7.7 7.9-1.9.9-3.8 1.3-5.3 1.4-.6 0-.8.8-.2 1.1 2.6 1.4 6.6 1.6 10.3-.3 4.4-2.3 6.6-6.4 7.2-8.6.4-1.4-.1-2.7-1.3-3.1Z"/><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M18.3 6.3c.3-1.6 1.3-2.7 2.9-3"/></svg>`;

  /* ---------- time in Cape Town ---------- */
  function nowInSA() {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: TZ, weekday: "long", hour: "2-digit", minute: "2-digit", hour12: false, year: "numeric", month: "2-digit", day: "2-digit",
    }).formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t)?.value;
    const hour = Number(get("hour")) % 24;
    return {
      day: get("weekday").toLowerCase(),
      minutes: hour * 60 + Number(get("minute")),
      date: `${get("year")}-${get("month")}-${get("day")}`,
    };
  }
  const toMin = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + (m || 0); };
  function parseRange(v) {
    if (!has(v) || v.trim().toLowerCase() === "closed") return null;
    const m = v.match(/(\d{1,2}:\d{2})\s*[-–]\s*(\d{1,2}:\d{2})/);
    if (!m) return null;
    return { open: m[1].padStart(5, "0"), close: m[2].padStart(5, "0") };
  }

  function computeStatus(hours) {
    if (!hours) return null;
    const now = nowInSA();
    const today = parseRange(hours[now.day]);
    if (today && now.minutes >= toMin(today.open) && now.minutes < toMin(today.close)) {
      return { open: true, text: `Open now · until ${today.close}` };
    }
    if (today && now.minutes < toMin(today.open)) {
      return { open: false, text: `Closed · opens ${today.open} today` };
    }
    const idx = DAYS.indexOf(now.day);
    for (let i = 1; i <= 7; i++) {
      const d = DAYS[(idx + i) % 7];
      const r = parseRange(hours[d]);
      if (r) return { open: false, text: `Closed · opens ${i === 1 ? "tomorrow" : DAY_SHORT[d]} ${r.open}` };
    }
    return { open: false, text: "Closed" };
  }

  /* ---------- preview modes for testing (?preview=...) ---------- */
  function applyPreview(c) {
    const p = new URLSearchParams(location.search).get("preview");
    if (!p) return c;
    const today = nowInSA().date;
    if (p === "special" || p === "soldout" || p === "long") {
      c.special = {
        show: true, date: today,
        dish: p === "long" ? "Slow-cooked lamb and potato curry with extra gravy and a double portion of rotis (preview)" : "Lamb curry (preview)",
        comesWith: p === "long" ? "Lamb on the bone, potato, basmati rice or two rotis, sambals and salad. Uitstekend vir 'n groot honger middagete saam met die hele familie. (preview text)" : "Lamb on the bone, with basmati rice or roti, and salad.",
        price: p === "long" ? "R1 250" : "", soldOut: p === "soldout",
      };
    }
    if (p === "none") { c.special = { show: false }; c.favourite = null; }
    if (p === "long") {
      c.menu = [{ group: "Curries met 'n baie lang naam vir die groep (preview)", items: [
        { name: "Durban-style mutton and potato curry with extra-thick gravy (preview)", description: "Very long description to test wrapping. Lamb on the bone, potato, basmati rice or roti, sambals and salad, made fresh in the shop every morning. (preview)", price: "R1 250", signature: true, soldOut: false },
        { name: "Lamb curry (preview)", description: "Sold-out state.", price: "R95", signature: true, soldOut: true },
      ] }];
      c.spices = [
        { name: "Kashmiri chilli powder extra-fine super-long-name (preview)", description: "Long description to test the jar label. Bright red, gentle heat, good colour. (preview)", heat: 5, goodFor: "Curries, marinades, braai rubs, roast potatoes and pretty much everything else (preview)", size: "500 g", price: "R1 250", soldOut: false },
        { name: "Sold-out spice (preview)", description: "", heat: 2, goodFor: "", size: "", price: "", soldOut: true },
      ];
    }
    if (p === "nodata") return null;
    return c;
  }

  /* ---------- renderers ---------- */
  function renderStatus(c) {
    const st = computeStatus(c?.hours);
    $$("[data-status]").forEach((el) => {
      if (!st) { el.textContent = ""; return; }
      const usual = c.hours.confirmed ? "" : " (usual hours)";
      el.dataset.open = String(st.open);
      el.textContent = st.text + usual;
      el.title = c.hours.confirmed ? "" : "Going by our usual hours, still to be confirmed";
    });
  }

  function renderHours(c) {
    const el = $("[data-hours]");
    if (!el) return;
    if (!c?.hours) { el.innerHTML = `<p class="notice">Hours aren't loading right now. Message us on WhatsApp to check.</p>`; return; }
    const today = nowInSA().day;
    const order = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    const rows = order.map((d) => {
      const r = parseRange(c.hours[d]);
      return `<tr data-today="${d === today}"><th scope="row">${DAY_LABEL[d]}</th><td>${r ? `${r.open} – ${r.close}` : "Closed"}</td></tr>`;
    }).join("");
    const note = [
      c.hours.confirmed ? "" : `${ph("HOURS: to be confirmed with Rowie")}`,
      has(c.hours.note) ? esc(c.hours.note) : ph("PUBLIC HOLIDAYS: opening rules to confirm"),
    ].filter(Boolean).join(" ");
    el.innerHTML = `<table class="hours"><caption>Opening hours</caption><tbody>${rows}</tbody></table><p class="hours__note">${note}</p>`;
  }

  function renderSpecial(c) {
    const host = $("[data-special]");
    if (!host) return;
    const section = host.closest("section");
    const sp = c?.special;
    const today = nowInSA().date;
    const isToday = sp && sp.show !== false && has(sp.dish) && (!has(sp.date) || sp.date === today) && has(sp.date);
    const fav = c?.favourite && has(c.favourite.dish) ? c.favourite : null;

    if (!isToday && !fav) { section.hidden = true; return; }
    section.hidden = false;

    const heading = $("[data-special-heading]");
    const lede = $("[data-special-lede]");
    let html;
    if (isToday) {
      const sold = !!sp.soldOut;
      heading.textContent = sold ? "Today's special has sold out." : "Today's special is on.";
      lede.textContent = sold
        ? "Message us for what's next."
        : "It often sells out, so get your order in early.";
      html = `
        <div class="docket" data-soldout="${sold}">
          <div class="docket__top"><span>Today's special</span><span>${esc(formatDate(today))}</span></div>
          ${sold ? `<span class="docket__stamp" aria-hidden="true">Sold out</span>` : ""}
          <p class="docket__dish">${esc(sp.dish)}${sold ? '<span class="sr-only"> (sold out)</span>' : ""}</p>
          ${has(sp.comesWith) ? `<p class="docket__with">${esc(sp.comesWith)}</p>` : ""}
          <p class="docket__price">${has(sp.price) ? esc(sp.price) : `<small>Price on WhatsApp</small>`}</p>
          <div class="docket__act">
            ${sold
              ? `<a class="btn" href="${wa(`Hi Rowie's, I saw the ${sp.dish} is sold out. What else is on today?`)}" target="_blank" rel="noopener">${WA_ICON}Ask what's next</a>`
              : `<a class="btn" href="${wa(`Hi Rowie's, I'd like to order today's special: ${sp.dish}.`)}" target="_blank" rel="noopener">${WA_ICON}Order this on WhatsApp</a>`}
          </div>
        </div>`;
    } else {
      heading.textContent = "The one to try first.";
      lede.textContent = "The special changes every day and often sells out. Ask what's on today, or go straight for the lamb.";
      html = `
        <div class="docket">
          <div class="docket__top"><span>House favourite</span><span>Every day*</span></div>
          <p class="docket__dish">${esc(fav.dish)}</p>
          ${has(fav.comesWith) ? `<p class="docket__with">${esc(fav.comesWith)}</p>` : ""}
          <p class="docket__price"><small>Price on WhatsApp</small></p>
          <div class="docket__act">
            <a class="btn" href="${wa(`Hi Rowie's, I'd like to order the ${fav.dish}.`)}" target="_blank" rel="noopener">${WA_ICON}Order this on WhatsApp</a>
            <a class="btn btn--ghost" href="${wa("Hi Rowie's, what's today's special?")}" target="_blank" rel="noopener">What's today's special?</a>
          </div>
          <p class="docket__note">*${ph("Confirm lamb curry is on every day")}</p>
        </div>`;
    }
    host.innerHTML = html;
    if (isToday) requestAnimationFrame(() => host.firstElementChild?.classList.add("is-in"));
  }

  function formatDate(iso) {
    const d = new Date(iso + "T12:00:00");
    return new Intl.DateTimeFormat("en-ZA", { weekday: "short", day: "numeric", month: "short", timeZone: TZ }).format(d);
  }

  function dishRow(item) {
    const name = has(item.name) ? esc(item.name) : ph(item.placeholder || "Dish name");
    const priceHtml = has(item.price)
      ? `<span class="dish__price">${esc(item.price)}</span>`
      : `<span class="dish__price dish__price--ask">Price on WhatsApp</span>`;
    const desc = has(item.description)
      ? esc(item.description)
      : (has(item.name) && item.placeholder ? ph(item.placeholder) : "");
    const sold = !!item.soldOut;
    return `<li class="dish" data-soldout="${sold}">
      <span class="dish__name"><span>${name}</span>${sold ? '<span class="tag">Sold out</span>' : ""}</span>
      ${priceHtml}
      ${desc ? `<p class="dish__desc">${desc}</p>` : ""}
    </li>`;
  }

  function renderMenu(c, { signatureOnly }) {
    const host = $(signatureOnly ? "[data-menu-short]" : "[data-menu]");
    if (!host) return;
    if (!c?.menu?.length) {
      host.innerHTML = `<p class="notice">The menu isn't loading right now. Message us on WhatsApp and we'll tell you what's cooking.</p>`;
      return;
    }
    if (signatureOnly) {
      const items = c.menu.flatMap((g) => g.items.filter((i) => i.signature && has(i.name)));
      host.innerHTML = `<ul class="menu-list">${items.map(dishRow).join("")}</ul>`;
      return;
    }
    host.innerHTML = c.menu.map((g) => `
      <div class="menu-group">
        <h3>${has(g.group) ? esc(g.group) : ph("Group name")}</h3>
        <ul class="menu-list">${(g.items || []).map(dishRow).join("")}</ul>
      </div>`).join("");
  }

  function heatMeter(n) {
    const v = Math.max(0, Math.min(5, Number(n) || 0));
    return `<span class="heat" role="img" aria-label="Heat ${v} out of 5">${[1, 2, 3, 4, 5].map((i) => CHILLI(i <= v)).join("")}</span>`;
  }

  function renderSpices(c) {
    const host = $("[data-spices]");
    if (!host) return;
    const list = c?.spices || [];
    if (!list.length) {
      host.innerHTML = `<p class="notice">The shelf list isn't up yet. Message us on WhatsApp to ask what's in stock.</p>`;
      return;
    }
    host.innerHTML = `<ul class="jars">${list.map((s) => {
      if (!has(s.name)) {
        return `<li class="jar jar--empty"><p class="jar__name">${ph("Spice name")}</p><p class="jar__desc">${ph(s.placeholder || "Name, size, price and heat, from Rowie")}</p></li>`;
      }
      const sold = !!s.soldOut;
      return `<li class="jar" data-soldout="${sold}">
        <h3 class="jar__name">${esc(s.name)}${sold ? '<span class="sr-only"> (sold out)</span>' : ""}</h3>
        ${has(s.description) ? `<p class="jar__desc">${esc(s.description)}</p>` : ""}
        <dl class="jar__meta">
          <dt>Heat</dt><dd>${heatMeter(s.heat)}</dd>
          ${has(s.goodFor) ? `<dt>Good for</dt><dd>${esc(s.goodFor)}</dd>` : ""}
          ${has(s.size) ? `<dt>Size</dt><dd>${esc(s.size)}</dd>` : ""}
          <dt>Price</dt><dd>${has(s.price) ? esc(s.price) : "Price on WhatsApp"}</dd>
        </dl>
        ${sold ? `<p class="jar__foot"><span class="tag">Sold out</span></p>`
          : `<a class="btn" href="${wa(`Hi Rowie's, I'd like to ask about the ${s.name}.`)}" target="_blank" rel="noopener" aria-label="Ask about ${esc(s.name)} on WhatsApp">${WA_ICON}Ask about this spice</a>`}
      </li>`;
    }).join("")}</ul>`;
  }

  function renderLogo(c) {
    if (!c || !has(c.logo)) return;
    $$("[data-brand]").forEach((a) => {
      a.innerHTML = `<img src="${esc(c.logo)}" alt="Rowie's Indian Eatarii &amp; Spices" width="104" height="52">`;
    });
  }

  function injectJsonLd(c) {
    const data = {
      "@context": "https://schema.org",
      "@type": ["Restaurant", "LocalBusiness"],
      name: "Rowie's Indian Eatarii & Spices",
      telephone: "+27827251918",
      servesCuisine: ["Indian"],
      address: { "@type": "PostalAddress", streetAddress: "6 Cecil Road", addressLocality: "Plumstead", addressRegion: "Western Cape", postalCode: "7800", addressCountry: "ZA" },
    };
    if (c?.hours && c.hours.confirmed) {
      data.openingHoursSpecification = Object.keys(JSONLD_DAY).map((d) => {
        const r = parseRange(c.hours[d]);
        return r ? { "@type": "OpeningHoursSpecification", dayOfWeek: JSONLD_DAY[d], opens: r.open, closes: r.close } : null;
      }).filter(Boolean);
    }
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(data);
    document.head.appendChild(s);
  }

  /* ---------- sticky order bar: shows once the main button scrolls away, hides over the footer ---------- */
  function orderBar() {
    const bar = $(".orderbar");
    const hero = $("[data-hero-order]");
    const foot = $(".foot");
    if (!bar) return;
    let heroVisible = !!hero, footVisible = false;
    const update = () => { const show = !heroVisible && !footVisible; bar.dataset.show = String(show); bar.inert = !show; };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.target === hero) heroVisible = e.isIntersecting;
        if (e.target === foot) footVisible = e.isIntersecting;
      });
      update();
    }, { rootMargin: "0px 0px -40px 0px" });
    if (hero) io.observe(hero);
    if (foot) io.observe(foot);
    update();
  }

  /* ---------- hanging chillies: they sway, you can pull one down, and a different one drops in ----------
     Track phase: the chilli follows the pointer 1:1 (rubber-band resistance on the string).
     Release: a spring seeded with the release velocity. Pull far or fast enough and it snaps off. */
  const CHILLI_KINDS = [
    { color: "#8E1A14", vars: { "--stem": "#4A6629" }, scale: 1 },     // red
    { color: "#4F7A26", vars: { "--stem": "#2F4A16" }, scale: .92 },   // green
    { color: "#EBA51C", vars: { "--stem": "#4A6629" }, scale: .8 },    // yellow
    { color: "#4A0E0B", vars: { "--stem": "#3A2416" }, scale: .86 },   // dried
    { color: "#D2561E", vars: { "--stem": "#4A6629" }, scale: .72 },   // orange
    { color: "#C1201A", vars: { "--stem": "#4A6629" }, scale: .55 },   // little bird's-eye
  ];
  // spice packets: pouch colour and the colour of the spice showing through the window
  const PACKET_KINDS = [
    { vars: { "--pk": "#C1201A", "--sp": "#E8A317" }, scale: 1 },    // red pouch, turmeric
    { vars: { "--pk": "#4A6629", "--sp": "#B8231B" }, scale: .94 },  // green pouch, chilli powder
    { vars: { "--pk": "#6B4A2B", "--sp": "#9A7440" }, scale: .9 },   // brown pouch, cumin
    { vars: { "--pk": "#D2561E", "--sp": "#5A3A22" }, scale: .96 },  // orange pouch, garam masala
    { vars: { "--pk": "#3A2416", "--sp": "#7E8C3A" }, scale: .88 },  // dark pouch, coriander
    { vars: { "--pk": "#8E1A14", "--sp": "#C2491A" }, scale: .92 },  // deep red pouch, paprika
  ];

  function hangers(root, KINDS, startKind) {
    if (!root) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    let kindCursor = 0;
    const SNAP_AT = 115;
    const rubber = (d) => (d <= 0 ? d * 0.18 : 200 * (1 - Math.exp(-d / 200)));
    // inverse of rubber(): where the "finger" would be for a given pull, so a grab starts exactly where the chilli is
    const unrubber = (p) => (p <= 0 ? p / 0.18 : -200 * Math.log(1 - Math.min(p, 199.5) / 200));

    const chillies = $$(".hc", root).map((el, i) => {
      const s = {
        el, rot: $(".hc__rot", el), str: $(".hc__string", el), body: $(".hc__body", el),
        len: parseFloat(getComputedStyle(el).getPropertyValue("--len")) || 90,
        a: 0, va: 0,                    // extra swing from a pull (deg); the idle sway is CSS
        p: 0, vp: 0,                    // pull on the string (px)
        fy: 0, fv: 0, spin: 0, fade: 1, // the falling chilli
        state: "hang",                  // hang | drag | fall | drop
        phase: i * 1.7, kind: startKind(i), scale: 1,
        drag: null, tapPull: false,
      };
      kindCursor = Math.max(kindCursor, s.kind);
      paint(s);
      return s;
    });

    function paint(s) {
      const k = KINDS[s.kind % KINDS.length];
      if (k.color) s.body.style.color = k.color;
      for (const [name, value] of Object.entries(k.vars || {})) s.body.style.setProperty(name, value);
      s.scale = k.scale;
    }

    function render(s) {
      s.rot.style.transform = "rotate(" + s.a.toFixed(2) + "deg)";
      const strLen = Math.max(0, s.len + s.p);
      s.str.style.transform = "scaleY(" + (strLen / s.len).toFixed(4) + ")";
      const y = s.state === "fall" ? s.fy : s.p;
      s.body.style.transform = "translateY(" + y.toFixed(1) + "px) rotate(" + s.spin.toFixed(1) + "deg) scale(" + s.scale + ")";
      s.body.style.opacity = s.fade.toFixed(3);
    }

    function snap(s) {
      s.state = "fall";
      s.fy = s.p; s.fv = Math.max(200, s.vp * 0.6); s.spin = 0;  // the chilli leaves the string where it is
      s.drag = null; s.tapPull = false;
    }
    function dropNew(s) {
      // next kind not already hanging (and never the one that just fell)
      for (let tries = 0; tries < KINDS.length; tries++) {
        kindCursor = (kindCursor + 1) % KINDS.length;
        if (kindCursor !== s.kind && !chillies.some((o) => o !== s && o.kind === kindCursor)) break;
      }
      s.kind = kindCursor; paint(s);
      s.state = "drop"; s.fy = 0; s.fv = 0; s.spin = 0; s.fade = 1;
      s.p = -(s.len + 40); s.vp = 0; s.va += (Math.random() - 0.5) * 30;
    }
    // a tap, or Enter, gives the chilli a firm tug and it snaps off
    function tug(s) {
      if (s.state === "fall") return;
      if (reduce.matches) { s.vp = 0; snap(s); wake(); return; }  // no tug animation: just swap
      s.state = "hang"; s.vp = 1600; s.tapPull = true;
      wake();
    }

    chillies.forEach((s) => {
      s.body.addEventListener("pointerdown", (e) => {
        if (s.drag || s.state === "fall") return;   // one finger at a time
        if (s.state === "drop" && s.p < -20) return; // still on its way down: let it land
        s.body.setPointerCapture(e.pointerId);
        s.state = "drag"; s.tapPull = false;
        const raw0 = unrubber(s.p) + 6;              // the string gives a little the moment you grab it
        s.p = rubber(raw0);
        s.drag = { x0: e.clientX, y0: e.clientY, raw0, a0: s.a, moved: 0, samples: [{ t: e.timeStamp, p: s.p, a: s.a }] };
        render(s);
        wake();
      });
      s.body.addEventListener("pointermove", (e) => {
        const d = s.drag;
        if (!d || s.state !== "drag") return;
        const dx = e.clientX - d.x0, dy = e.clientY - d.y0;
        d.moved = Math.max(d.moved, Math.hypot(dx, dy));
        s.p = rubber(d.raw0 + dy);
        // rotating clockwise swings the bottom left, so a drag to the right is a negative angle
        s.a = Math.max(-35, Math.min(35, d.a0 - Math.atan2(dx, s.len + 160 + s.p) * 57.3));
        d.samples.push({ t: e.timeStamp, p: s.p, a: s.a });
        if (d.samples.length > 6) d.samples.shift();
        render(s);
      });
      const release = (e) => {
        const d = s.drag;
        if (!d || s.state !== "drag") return;
        s.drag = null;
        const first = d.samples[0], last = d.samples[d.samples.length - 1];
        const dt = Math.max(16, last.t - first.t) / 1000;
        s.vp = (last.p - first.p) / dt;                    // leave the finger at the speed it was moving
        s.va = Math.max(-200, Math.min(200, (last.a - first.a) / dt * 0.6));
        if (d.moved < 6 && e.type !== "pointercancel") { tug(s); return; }
        if (s.p > SNAP_AT || (s.vp > 600 && s.p > 30)) snap(s); else s.state = "hang";
        wake();
      };
      s.body.addEventListener("pointerup", release);
      s.body.addEventListener("pointercancel", release);
      s.body.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tug(s); }
      });
    });

    // physics loop: runs only while the sign is on screen and the tab is visible
    let raf = 0, last = 0, visible = true;
    function step(t) {
      raf = 0;
      // fixed small sub-steps keep the springs stable and on time, even on a slow phone
      const total = Math.min(0.1, last ? (t - last) / 1000 : 0.016);
      last = t;
      const n = Math.max(1, Math.ceil(total / 0.008));
      const dt = total / n;
      const still = reduce.matches;
      let busy = false;
      for (const s of chillies) {
        if (s.state === "drag") { busy = true; continue; }
        for (let k = 0; k < n; k++) busy = integrate(s, dt, t / 1000 - (n - 1 - k) * dt, still) || busy;
        render(s);
      }
      if (visible && busy) raf = requestAnimationFrame(step);  // sleeps when nothing is moving
      else last = 0;
    }
    function integrate(s, dt, sec, still) {
      let busy = false;
      {
        if (s.state === "drag") return true;
        // swing left over from a pull: a soft pendulum back to rest (the idle sway itself is CSS)
        s.va += (-28 * s.a - (still ? 12 : 2.2) * s.va) * dt;
        s.a += s.va * dt;
        if (Math.abs(s.a) > 0.02 || Math.abs(s.va) > 0.05) busy = true;
        else { s.a = 0; s.va = 0; }

        if (s.state === "fall") {
          if (still) s.fade = Math.max(0, s.fade - dt * 7);
          else {
            s.fv += 2600 * dt; s.fy += s.fv * dt;
            s.spin += (s.a >= 0 ? 1 : -1) * 260 * dt;
            s.fade = Math.max(0, 1 - Math.max(0, s.fy) / 480);
          }
          // the empty string springs back up
          s.vp += (-420 * (s.p + s.len) - 30 * s.vp) * dt; s.p += s.vp * dt;
          if (s.fade <= 0) dropNew(s);
          busy = true;
        } else {
          // the string springs back to rest: bouncy after a pull, no bounce for reduced motion
          const damp = still ? 32 : s.state === "drop" ? 13 : 16;
          s.vp += (-260 * s.p - damp * s.vp) * dt;
          s.p += s.vp * dt;
          if (still && s.state === "drop") { s.p = 0; s.vp = 0; }
          if (s.tapPull && s.p > 40) snap(s);
          else if (Math.abs(s.p) < 0.3 && Math.abs(s.vp) < 2) { s.p = 0; s.vp = 0; s.state = "hang"; s.tapPull = false; }
          if (s.state !== "hang" || s.p) busy = true;
        }
      }
      return busy;
    }
    function wake() { if (!raf && visible) { last = 0; raf = requestAnimationFrame(step); } }

    new IntersectionObserver(([e]) => { visible = e.isIntersecting && !document.hidden; if (visible) wake(); })
      .observe(root.closest("section, header") || root);
    document.addEventListener("visibilitychange", () => { visible = !document.hidden; if (visible) wake(); });
    if (reduce.addEventListener) reduce.addEventListener("change", wake);
    chillies.forEach(render);
    wake();
  }

  /* ---------- static WhatsApp links ---------- */
  function wireLinks() {
    $$("[data-wa]").forEach((a) => {
      a.href = wa(a.dataset.wa || MSG_GENERAL);
      a.target = "_blank";
      a.rel = "noopener";
    });
  }

  async function load() {
    try {
      const res = await fetch("content.json", { cache: "no-cache" });
      if (!res.ok) throw new Error(res.status);
      return await res.json();
    } catch (e) {
      return null;
    }
  }

  async function init() {
    wireLinks();
    orderBar();
    hangers($("[data-hanger]"), CHILLI_KINDS, () => 0);        // both chillies start red
    hangers($("[data-packets]"), PACKET_KINDS, (i) => i);    // four different packets
    const raw = await load();
    const c = applyPreview(raw);
    renderLogo(c);
    renderStatus(c);
    renderHours(c);
    renderSpecial(c);
    renderMenu(c, { signatureOnly: true });
    renderMenu(c, { signatureOnly: false });
    renderSpices(c);
    injectJsonLd(c);
    setInterval(() => renderStatus(c), 60000);
  }

  init();
})();
