// Builds the static pages from shared parts. Run: node tools/build.cjs
// GitHub Pages serves the generated .html files; edit here, not there.
//
// Every business fact on the site lives in FACTS. Only put something there
// if the business itself has published it (Google listing, its own profiles).
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const FACTS = {
  name: 'Estelis Electrical LLC',
  short: 'Estelis Electrical',
  category: 'Electrician',
  street: '385 E Cleveland St',
  city: 'Apopka', state: 'FL', zip: '32703',
  plusCode: 'MF5X+4G Apopka, Florida',
  rating: '5.0', reviewCount: 11,
  // Google showed only this much of the schedule.
  hoursShown: 'Opens 8 AM Thursday',
  hoursNote: 'That is all of the schedule Google shows. Check the listing for today’s hours.',
  // Google lists no phone number. Leave null unless the business publishes one.
  phone: null, tel: null,
  // Areas the business itself says it serves. Leave empty unless published.
  areas: [],
  areaQuote: null, areaSource: null,
  mapsUrl: 'https://www.google.com/maps/search/?api=1&amp;query=Estelis+Electrical+LLC+385+E+Cleveland+St+Apopka+FL+32703',
  directionsUrl: 'https://www.google.com/maps/dir/?api=1&amp;destination=385+E+Cleveland+St+Apopka+FL+32703',
  ownerPost: { date: 'Sep 3, 2026', text: 'replace old clothe range wire for an up to date wire install new breaker and plug for insurance purpose' },
  snippets: [
    'Estelis was able to complete the wiring and setting up the power box quickly.',
    'Excellence service and excellent communication.',
    'Amazing service from start to finish!',
  ],
  topics: [['kitchen electrical work', 2], ['work quality', 2], ['renovation', 2], ['pricing', 2]],
  topicsMore: 5,
  reviews: [
    { name: 'Rachel Garcia', meta: '5 reviews · 2 photos', age: '4 months ago', cut: true,
      text: 'I just want to give a shout out to Estelis. I live in a duplex that didn’t have an outlet for a dryer (different 3 prong outlet than the oven). Estelis was able to complete the wiring and setting up the power box quickly. He is also very',
      reply: 'thank you so much' },
    { name: 'Lorena Garcia', meta: '2 reviews', age: '4 months ago', cut: true,
      text: 'I highly recommend this electrician! He recently installed a new breaker box for us and ran electricity to both our garage and shed. The quality of work was excellent and he was a true professional throughout the entire process. The pricing',
      reply: 'i always try my best to make my customers happy thank you' },
    { name: 'Arlene Volz', meta: '2 reviews', age: '2 months ago', cut: false,
      text: 'Francisco is a skilled electrician,efficient and worked with us to complete the project to our satisfaction. Cleaned up after completion! Highly recommend Francisco.',
      reply: 'thank you so much' },
  ],
  reviewsAsOf: 'September 2026',
};

/* ---------------- circuits = only work the owner or reviewers describe ---------------- */
const CIRCUITS = [
  {
    key: 'panels', n: '01', file: 'panels-breakers.html', name: 'Panels &amp; breakers', card: 'Panels &amp; breakers',
    sub: 'New breaker boxes, new breakers, setting up the power box.',
    title: 'Breaker box &amp; panel work',
    desc: 'Breaker box installs, new breakers and power box setup by Estelis Electrical LLC in Apopka, FL.',
    evidence: [
      { q: 'He recently installed a new breaker box for us', by: 'Lorena Garcia · Google review · 4 months ago' },
      { q: 'Estelis was able to complete the wiring and setting up the power box quickly.', by: 'Rachel Garcia · Google review · 4 months ago' },
      { q: 'install new breaker', by: 'From the owner · Google update · Sep 3, 2026' },
    ],
    hero: 'assets/img/breakers-wired.jpg',
    tips: ['Where the panel is (garage, outside wall, closet) and roughly how old it is.', 'What you want it to run: a new appliance, a shed, a workshop.', 'A photo of the panel with the door open, if you can.'],
    media: `
      <div class="gal g-panels">
        <figure class="gf gf-a"><video class="lazyvid" muted loop playsinline preload="none" poster="assets/vid/switches.jpg" aria-label="A finger switching circuits on at a panel"><source src="assets/vid/switches.mp4" type="video/mp4"></video></figure>
        <figure class="gf gf-b"><img src="assets/img/panel-open.jpg" alt="An open breaker panel with its wiring visible" loading="lazy" width="1100" height="1650"></figure>
        <figure class="gf gf-c"><img src="assets/img/meter-test.jpg" alt="An electrician testing connections in an open panel with a multimeter" loading="lazy" width="1000" height="667"></figure>
      </div>`,
  },
  {
    key: 'dryer', n: '02', file: 'dryer-range.html', name: 'Dryer &amp; range circuits', card: 'Dryer &amp; range',
    sub: 'The heavy-appliance outlets: dryer plugs, range wire, the breaker behind them.',
    title: 'Dryer outlet &amp; range wiring',
    desc: 'Dryer outlets and range wiring by Estelis Electrical LLC in Apopka, FL.',
    evidence: [
      { q: 'I live in a duplex that didn’t have an outlet for a dryer (different 3 prong outlet than the oven).', by: 'Rachel Garcia · Google review · 4 months ago' },
      { q: 'replace old clothe range wire for an up to date wire install new breaker and plug for insurance purpose', by: 'From the owner · Google update · Sep 3, 2026' },
    ],
    hero: 'assets/img/laundry.jpg',
    tips: ['Which appliance, and the plug it has (a photo of the plug helps).', 'Where it sits relative to the breaker panel.', 'If an insurer or inspector asked for the work, what they asked for.'],
    media: `
      <div class="gal g-dryer">
        <figure class="gf gf-a"><img src="assets/img/socket-pliers.jpg" alt="Hands fitting wires into a wall socket with pliers" loading="lazy" width="1200" height="800"></figure>
        <figure class="gf gf-b"><img src="assets/img/kitchen-oven.jpg" alt="A kitchen wall oven and microwave" loading="lazy" width="1200" height="1800"></figure>
        <figure class="gf gf-c"><img src="assets/img/outlet-drill.jpg" alt="A gloved hand drilling to mount an outlet on a wall" loading="lazy" width="1100" height="733"></figure>
      </div>`,
  },
  {
    key: 'garage', n: '03', file: 'garage-shed.html', name: 'Garage &amp; shed power', card: 'Garage &amp; shed',
    sub: 'Running electricity out to the garage and the shed.',
    title: 'Garage &amp; shed power',
    desc: 'Running power to garages and sheds, by Estelis Electrical LLC in Apopka, FL.',
    evidence: [
      { q: 'ran electricity to both our garage and shed. The quality of work was excellent and he was a true professional throughout the entire process.', by: 'Lorena Garcia · Google review · 4 months ago' },
    ],
    hero: 'assets/img/shed.jpg',
    tips: ['How far the shed or garage is from the house.', 'What it needs to power: lights, outlets, tools, a fridge.', 'Whether a new breaker box went in too, or is needed.'],
    media: `
      <div class="gal g-garage">
        <figure class="gf gf-a"><img src="assets/img/garage.jpg" alt="A clean garage with shelving and a work area" loading="lazy" width="1300" height="867"></figure>
        <figure class="gf gf-b"><video class="lazyvid" muted loop playsinline preload="none" poster="assets/vid/wall-wiring.jpg" aria-label="A worker running electrical wiring along a block wall"><source src="assets/vid/wall-wiring.mp4" type="video/mp4"></video></figure>
      </div>`,
  },
  {
    key: 'kitchen', n: '04', file: 'kitchen-renovation.html', name: 'Kitchen &amp; renovation', card: 'Kitchen &amp; reno',
    sub: 'Electrical work for kitchens and renovations.',
    title: 'Kitchen &amp; renovation electrical',
    desc: 'Kitchen and renovation electrical work by Estelis Electrical LLC in Apopka, FL.',
    evidence: [
      { q: 'Google lists “kitchen electrical work” and “renovation” among the topics reviewers mention, two reviews each.', by: 'Google review topics', plain: true },
      { q: 'Francisco is a skilled electrician,efficient and worked with us to complete the project to our satisfaction. Cleaned up after completion!', by: 'Arlene Volz · Google review · 2 months ago' },
    ],
    hero: 'assets/img/kitchen-reno.jpg',
    tips: ['Which rooms are being renovated, and how far along the work is.', 'Lights, outlets or appliances you’re adding or moving.', 'Who else is on the job (contractor, cabinet installer) and their timing.'],
    media: `
      <div class="gal g-kitchen">
        <figure class="gf gf-a"><video class="lazyvid" muted loop playsinline preload="none" poster="assets/vid/ceiling-light.jpg" aria-label="A man wiring a light fitting into a ceiling"><source src="assets/vid/ceiling-light.mp4" type="video/mp4"></video></figure>
        <figure class="gf gf-b"><img src="assets/img/kitchen-lamps.jpg" alt="Geometric pendant lamps over a kitchen counter" loading="lazy" width="1200" height="800"></figure>
        <figure class="gf gf-c"><img src="assets/img/boxes-red.jpg" alt="New electrical boxes set into a wall during a renovation" loading="lazy" width="1100" height="733"></figure>
      </div>`,
  },
];

const NAV = [
  ...CIRCUITS.map((c) => ({ file: c.file, label: c.name.replace(' circuits', '').replace(' power', ''), key: c.key })),
  { file: 'reviews.html', label: 'Reviews', key: 'reviews' },
  { file: 'contact.html', label: 'Contact', key: 'contact' },
];

/* ---------------- helpers ---------------- */
const addr1 = `${FACTS.street}, ${FACTS.city}, ${FACTS.state} ${FACTS.zip}`;
const hasPhone = !!FACTS.phone;
const primaryCta = (cls = 'btn btn-copper') => hasPhone
  ? `<a class="${cls}" href="${FACTS.tel}">Call ${FACTS.phone}</a>`
  : `<a class="${cls}" href="${FACTS.mapsUrl}" target="_blank" rel="noopener">Open on Google Maps</a>`;
const areaLine = () => FACTS.areas.length
  ? FACTS.areas.join(' · ')
  : `Based in ${FACTS.city}, ${FACTS.state}`;

const head = ({ title, desc }) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="theme-color" content="#15191C">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Albert+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Anybody:wdth,wght@50..150,400..900&family=Caveat:wght@500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/site.css">
<script type="application/ld+json">
${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Electrician',
    name: FACTS.name,
    address: { '@type': 'PostalAddress', streetAddress: FACTS.street, addressLocality: FACTS.city, addressRegion: FACTS.state, postalCode: FACTS.zip, addressCountry: 'US' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: FACTS.rating, reviewCount: String(FACTS.reviewCount) },
    ...(hasPhone ? { telephone: FACTS.phone } : {}),
    ...(FACTS.areas.length ? { areaServed: FACTS.areas.map((a) => ({ '@type': 'Place', name: a })) } : {}),
  }, null, 2)}
</script>
</head>`;

const header = (active) => `
<a class="skip" href="#main">Skip to content</a>
<div class="wire" aria-hidden="true"><span class="wire-fill" id="wireFill"></span><span class="wire-spark" id="wireSpark"></span></div>

<header class="bar">
  <a class="mark" href="index.html" aria-label="${FACTS.short}, home">
    <span class="mark-glyph" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg></span>
    <span class="mark-text">Estelis<span class="mark-sub">Electrical</span></span>
  </a>
  <nav class="nav" id="siteNav" aria-label="Site">
    <p class="nav-k">Circuits</p>
${NAV.map((p, i) => `    <a href="${p.file}"${p.key === active ? ' aria-current="page"' : ''}${i >= CIRCUITS.length ? ` class="nav-sec${i === CIRCUITS.length ? ' nav-first-sec' : ''}"` : ''}>${i < CIRCUITS.length ? `<span class="nav-n">${CIRCUITS[i].n}</span>` : ''}${p.label}</a>`).join('\n')}
  </nav>
  ${primaryCta('bar-cta')}
  <button class="menu-btn" type="button" aria-expanded="false" aria-controls="siteNav"><span class="menu-lines" aria-hidden="true"></span><span class="menu-word">Menu</span></button>
</header>`;

const footer = () => `
<footer class="foot">
  <div class="foot-in">
    <div class="foot-id">
      <p class="foot-mark">${FACTS.name}</p>
      <p>${FACTS.category} · ${addr1}${hasPhone ? ` · <a href="${FACTS.tel}">${FACTS.phone}</a>` : ''}</p>
    </div>
    <nav class="foot-nav" aria-label="Footer">
      <a href="index.html">Home</a>
${NAV.map((p) => `      <a href="${p.file}">${p.label}</a>`).join('\n')}
    </nav>
    <div class="foot-fine">
      <p>Images are illustrative. Reviews are quoted as written on Google, as of ${FACTS.reviewsAsOf}.</p>
      <p><strong>Hiring an electrician in Florida?</strong> You can look up any contractor’s licence at <a href="https://www.myfloridalicense.com/" target="_blank" rel="noopener">myfloridalicense.com</a>.</p>
    </div>
  </div>
</footer>

${hasPhone ? `<a class="dock" href="${FACTS.tel}">Call ${FACTS.phone}</a>` : `<a class="dock" href="${FACTS.directionsUrl}" target="_blank" rel="noopener">Directions to ${FACTS.city}</a>`}

<script src="assets/site.js" defer></script>
</body>
</html>
`;

const directoryCard = (active, linked = true) => `
      <ol class="dir">
        <li class="dir-h">Circuit directory</li>
${CIRCUITS.map((c) => `        <li${c.key === active ? ' class="is-on"' : ''}><span class="dir-n">${Number(c.n)}</span>${linked ? `<a href="${c.file}"${c.key === active ? ' aria-current="page"' : ''}>${c.card}</a>` : `<span>${c.card}</span>`}</li>`).join('\n')}
        <li${active === 'reviews' ? ' class="is-on"' : ''}><span class="dir-n">5</span>${linked ? `<a href="reviews.html">Reviews</a>` : '<span>Reviews</span>'}</li>
        <li${active === 'contact' ? ' class="is-on"' : ''}><span class="dir-n">6</span>${linked ? `<a href="contact.html">Contact</a>` : '<span>Contact</span>'}</li>
        <li class="dir-spare"><span class="dir-n">7</span><span>spare</span></li>
        <li class="dir-spare"><span class="dir-n">8</span><span>spare</span></li>
      </ol>`;

const breaker = (n, href) => href === '#'
  ? `<span class="bk bk-spare" aria-hidden="true" data-n="${n}"><span class="bk-n">${n}</span><span class="bk-body"><span class="bk-h"></span></span><span class="bk-led"></span></span>`
  : `<a class="bk" href="${href}" tabindex="-1" aria-hidden="true" data-n="${n}"><span class="bk-n">${n}</span><span class="bk-body"><span class="bk-h"></span></span><span class="bk-led"></span></a>`;

const evidenceList = (ev) => ev.map((e) => e.plain
  ? `<p class="ev-plain">${e.q}</p>`
  : `<blockquote class="ev"><p>&ldquo;${e.q}&rdquo;</p><footer>${e.by}</footer></blockquote>`).join('\n          ');

/* ---------------- pages ---------------- */
function home() {
  const targets = [...CIRCUITS.map((c) => c.file), 'reviews.html', 'contact.html', '#', '#'];
  return `${head({ title: `${FACTS.short} · Electrician in Apopka, FL`, desc: `${FACTS.name}, an electrician in Apopka, Florida. Breaker boxes, dryer and range circuits, garage and shed power, kitchen and renovation electrical. Rated ${FACTS.rating} from ${FACTS.reviewCount} Google reviews.` })}
<body class="pg-home">
${header('home')}

<main id="main">

<section class="hero">
  <div class="hero-copy">
    <p class="kicker rv">${FACTS.category} · ${FACTS.city}, Florida</p>
    <h1 class="hero-h rv"><span class="hh-1">Amazing service</span> <span class="hh-2">from start</span> <span class="hh-3">to finish!</span></h1>
    <p class="hero-attr rv">From Google’s summary of ${FACTS.reviewCount} reviews for <strong>${FACTS.name}</strong>: breaker boxes, dryer and range circuits, power out to garages and sheds, and kitchen and renovation work.</p>
    <div class="hero-cta rv">
      ${primaryCta()}
      <a class="btn btn-line" href="#circuits">See the circuits</a>
    </div>
    <dl class="readout rv">
      <div><dt>Google rating</dt><dd><span class="ro-big" data-count="${FACTS.rating}">${FACTS.rating}</span><span class="ro-unit">/ 5</span></dd></div>
      <div><dt>Reviews</dt><dd><span class="ro-big">${FACTS.reviewCount}</span></dd></div>
      <div><dt>Hours shown</dt><dd><span class="ro-mid">${FACTS.hoursShown.replace('Thursday', 'Thu')}</span></dd></div>
    </dl>
  </div>

  <div class="rig" id="rig">
    <div class="panel">
      <div class="deadfront">
        <div class="main-bk"><span class="main-k">Main</span>${breaker('M', '#circuits', 'Main')}</div>
        <div class="bk-grid">
          ${targets.map((t, i) => breaker(i + 1, t, '')).join('\n          ')}
        </div>
        <span class="screw s1"></span><span class="screw s2"></span><span class="screw s3"></span><span class="screw s4"></span>
      </div>
      <div class="door">
        <div class="door-front"><span class="door-latch"></span><span class="door-name">Estelis</span><span class="door-sub">Electrical LLC</span></div>
        <div class="door-back">${directoryCard(null)}
        </div>
      </div>
    </div>
  </div>
</section>

<section class="post" aria-labelledby="postH">
  <div class="post-in">
    <figure class="post-photo rv"><img src="assets/img/hero-panel.jpg" alt="An electrician drilling at an open breaker panel" loading="lazy" width="1800" height="1200"></figure>
    <div class="post-copy">
    <p class="kicker kicker-copper rv">Latest from the owner</p>
    <h2 id="postH" class="h2 rv">A real job, in the owner’s own words.</h2>
    <article class="ticket rv">
      <header class="ticket-top"><span>Google update</span><time>${FACTS.ownerPost.date}</time></header>
      <p class="ticket-text">&ldquo;${FACTS.ownerPost.text}&rdquo;</p>
      <ul class="ticket-tags"><li>range wire</li><li>new breaker</li><li>new plug</li></ul>
    </article>
    </div>
  </div>
</section>

<section class="circuits" id="circuits" aria-labelledby="cirH">
  <div class="cir-head">
    <p class="kicker kicker-copper rv">Four circuits</p>
    <h2 id="cirH" class="h2 h2-light rv">The work customers and the owner actually describe.</h2>
  </div>
  <ol class="run">
${CIRCUITS.map((c) => `    <li class="run-item rv">
      <a class="run-card" href="${c.file}">
        <span class="run-node" aria-hidden="true"></span>
        <span class="run-photo"><img src="${c.hero}" alt="" loading="lazy"></span>
        <span class="run-n">Circuit ${c.n}</span>
        <span class="run-name">${c.name}</span>
        <span class="run-sub">${c.sub}</span>
        <span class="run-go" aria-hidden="true">Switch on &rarr;</span>
      </a>
    </li>`).join('\n')}
  </ol>
</section>

<section class="voices" aria-labelledby="voiH">
  <div class="voices-in">
    <div class="voi-score rv">
      <p class="kicker">On Google</p>
      <p class="voi-big"><span data-count="${FACTS.rating}">${FACTS.rating}</span></p>
      <p class="voi-of">from ${FACTS.reviewCount} reviews</p>
      <a class="link-arrow" href="reviews.html">Read the reviews</a>
    </div>
    <div class="voi-list">
      <h2 id="voiH" class="sr">What reviewers say</h2>
${FACTS.snippets.map((s) => `      <p class="voi-q rv">&ldquo;${s}&rdquo;</p>`).join('\n')}
    </div>
  </div>
</section>

<section class="where" aria-label="Location">
  <div class="where-in">
    <div><p class="kicker kicker-copper">Shop</p><p class="where-v">${addr1}</p></div>
    <div><p class="kicker kicker-copper">Hours shown</p><p class="where-v">${FACTS.hoursShown}</p></div>
    <div><p class="kicker kicker-copper">Area</p><p class="where-v">${areaLine()}</p></div>
    <a class="btn btn-copper" href="contact.html">Contact &amp; directions</a>
  </div>
</section>

</main>
${footer()}`;
}

function circuitPage(c, i) {
  const prev = CIRCUITS[(i + CIRCUITS.length - 1) % CIRCUITS.length];
  const next = CIRCUITS[(i + 1) % CIRCUITS.length];
  return `${head({ title: `${c.title.replace('&amp;', '&')} · ${FACTS.short}, Apopka FL`, desc: c.desc })}
<body class="pg-circuit">
${header(c.key)}

<main id="main" class="circuit-layout">
  <aside class="rail" aria-label="Circuit directory">
    <div class="rail-card">${directoryCard(c.key)}
    </div>
  </aside>

  <div class="circuit-main">
    <section class="c-hero" aria-labelledby="cH">
      <div class="c-photo" id="cPhoto"><img src="${c.hero}" alt="" width="1400" height="933"></div>
      <div class="c-copy">
        <div class="c-switch">
          <button class="big-bk" id="bigBk" type="button" aria-pressed="false" aria-label="Circuit ${c.n} breaker"><span class="big-bk-h"></span></button>
          <p class="c-n">Circuit ${c.n}</p>
        </div>
        <h1 id="cH" class="c-h">${c.name}</h1>
        <p class="c-sub">${c.sub}</p>
        <div class="c-cta">${primaryCta()}<a class="btn btn-line-light" href="contact.html">Contact &amp; directions</a></div>
      </div>
    </section>

    <section class="c-evidence" aria-labelledby="evH">
      <p class="kicker kicker-copper rv">In their words</p>
      <h2 id="evH" class="h2 rv">Where this circuit comes from.</h2>
      <div class="ev-list rv">
          ${evidenceList(c.evidence)}
      </div>
    </section>

    <section class="c-gallery" aria-label="Pictures">${c.media}
    </section>

    <section class="c-tips" aria-labelledby="tipH">
      <p class="kicker kicker-copper rv">Before the visit</p>
      <h2 id="tipH" class="h2 rv">Three things worth having ready.</h2>
      <ol class="tips">
${c.tips.map((t, k) => `        <li class="rv"><span class="tip-n">${k + 1}</span><p>${t}</p></li>`).join('\n')}
      </ol>
    </section>

    <nav class="pager" aria-label="Other circuits">
      <a class="pg" href="${prev.file}"><span class="pg-k">&larr; Circuit ${prev.n}</span><span class="pg-name">${prev.name}</span></a>
      <a class="pg pg-next" href="${next.file}"><span class="pg-k">Circuit ${next.n} &rarr;</span><span class="pg-name">${next.name}</span></a>
    </nav>
  </div>
</main>
${footer()}`;
}

function reviewsPage() {
  return `${head({ title: `Reviews · ${FACTS.short}, Apopka FL`, desc: `${FACTS.name} is rated ${FACTS.rating} from ${FACTS.reviewCount} Google reviews.` })}
<body class="pg-reviews">
${header('reviews')}

<main id="main" class="circuit-layout">
  <aside class="rail" aria-label="Circuit directory">
    <div class="rail-card">${directoryCard('reviews')}
    </div>
  </aside>
  <div class="circuit-main">
    <section class="rv-head">
      <p class="kicker kicker-copper rv">Circuit 5 · Reviews</p>
      <h1 class="c-h c-h-ink rv">${FACTS.rating} from ${FACTS.reviewCount} Google reviews.</h1>
      <p class="rv-topics-h rv">What reviewers mention</p>
      <ul class="topics rv">
${FACTS.topics.map(([t, n]) => `        <li><span>${t}</span><b>${n}</b></li>`).join('\n')}
        <li class="topics-more"><span>+${FACTS.topicsMore} more topics</span></li>
      </ul>
    </section>
    <section class="rv-list" aria-label="Reviews">
${FACTS.reviews.map((r) => `      <article class="rvw rv">
        <p class="rvw-q">${r.text}${r.cut ? '<span class="rvw-cut">&hellip; (shortened by Google)</span>' : ''}</p>
        <p class="rvw-by"><strong>${r.name}</strong>${r.meta} · ${r.age}</p>
        ${r.reply ? `<div class="rvw-reply"><p class="rvw-reply-k">Response from the owner</p><p>${r.reply}</p></div>` : ''}
      </article>`).join('\n')}
      <div class="rvw-snips rv">
        <p class="rv-topics-h">From Google’s review summary</p>
${FACTS.snippets.map((s) => `        <p class="voi-q">&ldquo;${s}&rdquo;</p>`).join('\n')}
      </div>
      <p class="rv-note rv">Showing the reviews Google displays in full or in part. All ${FACTS.reviewCount} are on <a href="${FACTS.mapsUrl}" target="_blank" rel="noopener">Google Maps</a>.</p>
    </section>
  </div>
</main>
${footer()}`;
}

function contactPage() {
  const areaBlock = FACTS.areas.length
    ? `<div class="ct-row"><p class="kicker kicker-copper">Areas served</p>
          <ul class="areas">${FACTS.areas.map((a) => `<li>${a}</li>`).join('')}</ul>
          ${FACTS.areaQuote ? `<p class="ct-s">&ldquo;${FACTS.areaQuote}&rdquo; · ${FACTS.areaSource}</p>` : ''}
        </div>`
    : `<div class="ct-row"><p class="kicker kicker-copper">Areas served</p>
          <p class="ct-v">Based in ${FACTS.city}, ${FACTS.state}.</p>
          <p class="ct-s">The business doesn’t publish a service area, so ask whether they cover your town.</p>
        </div>`;
  return `${head({ title: `Contact &amp; directions · ${FACTS.short}, Apopka FL`, desc: `Find ${FACTS.name} at ${addr1}.` })}
<body class="pg-contact">
${header('contact')}

<main id="main" class="circuit-layout">
  <aside class="rail" aria-label="Circuit directory">
    <div class="rail-card">${directoryCard('contact')}
    </div>
  </aside>
  <div class="circuit-main">
    <section class="ct">
      <p class="kicker kicker-copper rv">Circuit 6 · Contact</p>
      <h1 class="c-h c-h-ink rv">Get Estelis out to the job.</h1>
      <div class="ct-grid">
        <div class="ct-card rv">
          ${hasPhone ? `<div class="ct-row"><p class="kicker kicker-copper">Call</p><a class="ct-phone" href="${FACTS.tel}">${FACTS.phone}</a></div>` : `<div class="ct-row"><p class="kicker kicker-copper">Phone</p><p class="ct-v">Not published on Google yet.</p><p class="ct-s">Use the Google Maps listing to get in touch.</p></div>`}
          <div class="ct-row"><p class="kicker kicker-copper">Shop</p><p class="ct-v">${FACTS.street}<br>${FACTS.city}, ${FACTS.state} ${FACTS.zip}</p><p class="ct-s">Plus code ${FACTS.plusCode}</p></div>
          <div class="ct-row"><p class="kicker kicker-copper">Hours</p><p class="ct-v">${FACTS.hoursShown}</p><p class="ct-s">${FACTS.hoursNote}</p></div>
          ${areaBlock}
          <div class="ct-btns">${primaryCta('btn btn-copper btn-wide')}<a class="btn btn-line-light btn-wide" href="${FACTS.directionsUrl}" target="_blank" rel="noopener">Get directions</a></div>
        </div>
        <figure class="ct-photo rv"><img src="assets/img/breaker-rows.jpg" alt="Rows of breakers in a panel" loading="lazy" width="1400" height="933"></figure>
      </div>
    </section>
  </div>
</main>
${footer()}`;
}

/* ---------------- write ---------------- */
const out = { 'index.html': home(), 'reviews.html': reviewsPage(), 'contact.html': contactPage() };
CIRCUITS.forEach((c, i) => { out[c.file] = circuitPage(c, i); });
for (const [f, html] of Object.entries(out)) {
  fs.writeFileSync(path.join(ROOT, f), html.replace(/\n{3,}/g, '\n\n'));
  console.log('wrote', f);
}
