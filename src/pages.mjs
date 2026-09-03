import { currentResourceCount, resources, routes, site } from './data.mjs'

const esc = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])

const brand = `<span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span><span>metanet<span>.fyi</span></span>`

function breadcrumbJsonLd (path) {
  if (path === '/') return null
  const names = { overlays: 'Overlays', recovery: 'Recovery test', build: 'Build path', resources: 'Source atlas', about: 'About', privacy: 'Privacy' }
  const parts = path.split('/').filter(Boolean)
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: site.origin }].concat(parts.map((part, index) => ({
      '@type': 'ListItem',
      position: index + 2,
      name: names[part] || part,
      item: `${site.origin}/${parts.slice(0, index + 1).join('/')}`
    })))
  }
}

function shell ({ path, body, nonce, jsonLd = [], article = false }) {
  const meta = routes[path]
  const canonical = `${site.origin}${path === '/' ? '' : path}`
  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: site.name,
      url: site.origin,
      description: site.description,
      inLanguage: 'en'
    },
    breadcrumbJsonLd(path),
    ...jsonLd
  ].filter(Boolean)

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(meta.title)}</title>
  <meta name="description" content="${esc(meta.description)}">
  <meta name="author" content="Metanet.fyi editorial">
  <meta name="theme-color" content="#101112">
  <meta name="color-scheme" content="dark light">
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="stylesheet" href="/styles.css">
  <meta property="og:site_name" content="Metanet.fyi">
  <meta property="og:type" content="${article ? 'article' : 'website'}">
  <meta property="og:title" content="${esc(meta.title)}">
  <meta property="og:description" content="${esc(meta.description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${site.origin}${meta.image}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${esc(meta.label)} — Metanet.fyi">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(meta.title)}">
  <meta name="twitter:description" content="${esc(meta.description)}">
  <meta name="twitter:image" content="${site.origin}${meta.image}">
  ${article ? `<meta property="article:published_time" content="${site.published}T12:00:00-07:00"><meta property="article:modified_time" content="${site.reviewed}T12:00:00-07:00"><meta property="article:section" content="BSV education">` : ''}
  ${schemas.map(schema => `<script type="application/ld+json" nonce="${nonce}">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>`).join('\n  ')}
  <script src="/site.js" defer></script>
</head>
<body data-path="${path}">
  <a class="skip-link" href="#content">Skip to content</a>
  <header class="site-header">
    <a class="brand" href="/" aria-label="Metanet.fyi home">${brand}</a>
    <nav aria-label="Primary navigation">
      <a href="/overlays"${path.startsWith('/overlays') ? ' aria-current="page"' : ''}>Overlays</a>
      <a href="/resources"${path === '/resources' ? ' aria-current="page"' : ''}>Source atlas</a>
      <a class="nav-action" href="/overlays/recovery">Test resilience <span aria-hidden="true">↗</span></a>
    </nav>
  </header>
  <main id="content">${body}</main>
  <footer class="site-footer">
    <a class="brand" href="/">${brand}</a>
    <p>Understand the system.<br>Verify the claim. Build the next path.</p>
    <div class="footer-links"><a href="/about">About</a><a href="/privacy">Privacy</a><a href="/resources">Sources</a></div>
    <span>Independent field notes for the Metanet.<br>Content licensed CC BY 4.0.</span>
  </footer>
</body>
</html>`
}

const topology = `<div class="topology" role="img" aria-label="A contrast between scanning an entire blockchain and sharing only topic-specific, proven transactions">
  <div class="topology-label scan-label">The old instinct</div>
  <div class="scan-stack" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><strong>scan<br>everything</strong></div>
  <div class="topology-divider" aria-hidden="true"><span>not this</span></div>
  <div class="topic-network" aria-hidden="true">
    <div class="node node-a">A</div><div class="node node-b">B</div><div class="node node-c">C</div>
    <svg viewBox="0 0 600 310" preserveAspectRatio="none"><path d="M105 180 C220 30 360 60 493 142"/><path d="M105 180 C220 270 365 270 493 142"/><path d="M105 180 C240 160 320 170 493 142" class="active"/></svg>
    <div class="packet packet-one"><b>tx</b><small>topic</small></div><div class="packet packet-two"><b>✓</b><small>proof</small></div>
    <p>Share what matters.<br><strong>Verify every piece.</strong></p>
  </div>
  <div class="topology-label network-label">The overlay model</div>
</div>`

function home () {
  return `<section class="hero home-hero" aria-labelledby="hero-title">
    <div class="eyebrow"><span>Field notes</span><span>Independent</span><span>Open sources</span></div>
    <h1 id="hero-title">The Metanet,<br><em>made legible.</em></h1>
    <p class="hero-deck">Metanet.fyi publishes independent visual explainers for curious readers, data publishers, builders, and operators. First up: an overlay is a shared index where a community keeps and finds the Bitcoin records it cares about without searching the whole history.</p>
    <div class="hero-actions"><a class="button button-primary" href="/overlays" data-event="guide.started">Read: Overlays, explained <span aria-hidden="true">↗</span></a><a class="text-link" href="/resources">Browse the source atlas <span aria-hidden="true">→</span></a></div>
    <a class="feature-card" href="/overlays" data-event="guide.started">
      <span class="feature-index">001</span><span class="feature-kicker">New field guide · 18 min</span>
      <h2>Overlays</h2><p>How applications find, share, preserve, and prove the particular transactions they care about—without scanning the world.</p>
      <span class="feature-action">Read the visual guide <b aria-hidden="true">↗</b></span>
      <span class="feature-orbit" aria-hidden="true"><i></i><i></i><i></i></span>
    </a>
  </section>
  <section class="home-principles">
    <p class="section-number">The editorial promise</p>
    <div><h2>Clarity without <em>hand-waving.</em></h2>
      <div class="truth-grid"><article><span>01</span><h3>Plain language</h3><p>We begin with the problem a person is actually trying to solve.</p></article><article><span>02</span><h3>Source-aware</h3><p>Current, historical, and aspirational material are labeled—not blended.</p></article><article><span>03</span><h3>Actionable</h3><p>Every guide opens a route for readers, publishers, builders, and operators.</p></article></div>
    </div>
  </section>
  <section class="question-band"><p>Begin with the question beneath the technology.</p><a href="/overlays/recovery">“If the app disappears, can the data survive?” <span aria-hidden="true">→</span></a></section>`
}

function overlays () {
  return `<article>
  <section class="hero guide-hero" aria-labelledby="hero-title">
    <div class="eyebrow"><span>Field guide 001</span><span>Overlays</span><span>18 min</span><span>Reviewed Sep 2026</span></div>
    <h1 id="hero-title">The chain proves it.<br><em>The network keeps it useful.</em></h1>
    <p class="hero-deck">Think of a shared specialist library. The blockchain—the public ledger—orders transactions. The overlay—the specialist network—uses a published filter to choose relevant records, and separately run services keep copies. The app shows them. A Merkle proof is a cryptographic receipt, not a backup: it checks a record you received but cannot restore anything nobody saved.</p>
    <div class="hero-actions"><a class="button button-primary" href="#quick-model" data-event="guide.started">Get the 30-second model <span aria-hidden="true">↓</span></a><a class="text-link" href="/overlays/recovery">Can my data survive an app? <span aria-hidden="true">↗</span></a></div>
    <aside class="quick-model" id="quick-model" aria-labelledby="quick-model-title">
      <span id="quick-model-title">The 30-second model</span>
      <p><b>Public ledger: order.</b> <b>Specialist network: choose and keep.</b> <b>App: make useful.</b></p>
      <p>A proof is a receipt, not a backup. Multiple independent keepers, a catch-up path, and a portable copy make recovery possible.</p>
      <nav aria-label="Choose a role"><a href="/overlays/recovery" data-event="pathway.selected">Publisher: test survival →</a><a href="/overlays/build" data-event="pathway.selected">Builder: follow the build path →</a><a href="/resources" data-event="pathway.selected">Reader: open the sources →</a></nav>
    </aside>
    ${topology}
  </section>

  <nav class="chapter-nav" aria-label="Guide chapters"><a href="#shift">01 The shift</a><a href="#anatomy">02 Anatomy</a><a href="#protocols">03 Protocols</a><a href="#proof">04 Proof</a><a href="#recovery">05 Recovery</a><a href="#action">06 Action</a></nav>

  <section class="manifesto" id="shift">
    <p class="section-number">01 / The shift</p>
    <div><h2>A blockchain is a truth machine.<br>It is not your app’s <em>filing cabinet.</em></h2>
      <p class="lead">At scale, your birdwatching app should not search the history of world commerce to find Canada goose sightings. People who care about bird sightings should exchange those transactions, keep the records they value, and retain the evidence that lets anyone verify them.</p>
      <aside class="plain-callout"><b>Overlay</b><p>A network and index over a selected class of transactions. Participants share the same rules for what belongs and make useful answers available to one another.</p></aside>
      <div class="truth-grid"><article><span>01</span><h3>Specific</h3><p>Each topic defines exactly which outputs belong.</p></article><article><span>02</span><h3>Shared</h3><p>Independent hosts replicate what they choose to support.</p></article><article><span>03</span><h3>Proven</h3><p>SPV evidence validates records without replaying the whole chain.</p></article></div>
    </div>
  </section>

  <section class="model" id="anatomy">
    <div class="model-copy"><p class="section-number">02 / The anatomy</p><h2>Think <em>neighborhood library</em>, not global warehouse.</h2><p>The blockchain supplies shared ordering and settlement. An overlay behaves like a group of specialized librarians: each follows the same cataloguing rule, keeps the material it has agreed to preserve, and can show where an item came from.</p></div>
    <ol class="flow" aria-label="The overlay flow"><li><b>Publish</b><span>A user creates a transaction.</span><i>01</i></li><li><b>Admit</b><span>Topic rules decide whether outputs belong.</span><i>02</i></li><li><b>Share</b><span>Interested hosts exchange them directly.</span><i>03</i></li><li><b>Prove</b><span>Evidence anchors them to valid history.</span><i>04</i></li><li><b>Find</b><span>Lookup services answer useful questions.</span><i>05</i></li></ol>
  </section>

  <section class="roles-section">
    <p class="section-number">What belongs where?</p>
    <div class="roles-grid"><article><span class="role-icon">◆</span><h3>Blockchain</h3><p>Global ordering, transaction validity, double-spend prevention, and block commitment.</p><small>Shared consensus</small></article><article class="role-focus"><span class="role-icon">◎</span><h3>Overlay</h3><p>Application admission rules, chosen records, state transitions, replication, and useful indexes.</p><small>Shared interest</small></article><article><span class="role-icon">▤</span><h3>Application</h3><p>Experience, permissions, workflows, identity choices, and the questions people need answered.</p><small>User context</small></article></div>
    <p class="caption">The boundaries matter: an overlay does not replace mining, and mining does not promise that every application byte will remain conveniently retrievable forever.</p>
  </section>

  <section class="protocol-section" id="protocols">
    <div class="protocol-intro"><p class="section-number">03 / The coordination layer</p><h2>Four jobs.<br><em>Four memorable handles.</em></h2><p>These names are coordination conventions, not magic availability. They work when people operate compatible services and actually retain what a topic needs.</p></div>
    <div class="protocol-grid">
      <article><span class="protocol-code">SHIP</span><h3>Who hosts this topic?</h3><p>Service Host Interconnect Protocol advertisements let services discover hosts interested in a topic. The overlay stack can then propagate relevant transactions among them.</p><a href="https://github.com/bsv-blockchain/BRCs/blob/master/overlays/0088.md" rel="external" data-event="resource.clicked">Read BRC-88 <span aria-hidden="true">↗</span></a></article>
      <article><span class="protocol-code">SLAP</span><h3>Who can answer this query?</h3><p>Service Lookup Availability Protocol advertisements expose lookup services and the questions they know how to answer.</p><a href="https://github.com/bsv-blockchain/BRCs/blob/master/overlays/0088.md" rel="external" data-event="resource.clicked">Read BRC-88 <span aria-hidden="true">↗</span></a></article>
      <article><span class="protocol-code">GASP</span><h3>How do I catch up?</h3><p>Graph-aware synchronization finds outputs a peer is missing, walks unknown transaction ancestry, validates the graph, and brings a new or returning host into useful alignment.</p><a href="https://github.com/bsv-blockchain/ts-stack/tree/main/packages/overlays/gasp-core" rel="external" data-event="resource.clicked">See the current package <span aria-hidden="true">↗</span></a></article>
      <article><span class="protocol-code">BASM</span><h3>Do I have the confirmed set?</h3><p>Block-Aligned Sparse Merkle trees anchor admitted transaction positions to a block so peers can compare confirmed topic state and efficiently locate differences.</p><a href="https://github.com/bsv-blockchain/BRCs/blob/master/overlays/0136.md" rel="external" data-event="resource.clicked">Read BRC-136 <span aria-hidden="true">↗</span></a></article>
    </div>
    <aside class="accuracy-note"><b>A useful correction</b><p>SHIP and SLAP are discovery conventions: they help you find relevant hosts and lookup services. They do not, by themselves, store your data or guarantee that a community has enough independent copies.</p></aside>
  </section>

  <section class="proof-section" id="proof">
    <div><p class="section-number">04 / Proof travels with the record</p><h2>Trust less.<br><em>Verify the piece.</em></h2><p class="lead">An overlay answer is useful because the recipient can validate the transaction and its evidence—not because the server asks to be believed.</p></div>
    <div class="proof-stack" aria-label="A transaction proof stack"><div><span>What you asked for</span><b>Selected output + transaction</b></div><div><span>What makes it valid</span><b>Required transaction ancestry</b></div><div><span>What anchors it</span><b>Merkle path → block header</b></div><div class="proof-foundation"><span>What miners agree</span><b>Ordered block commitments</b></div></div>
    <div class="proof-facts"><p><b>BEEF</b> can package a transaction with the ancestry evidence needed for validation.</p><p><b>BUMP</b> compactly represents Merkle paths.</p><p><b>SPV</b> lets a recipient check inclusion and transaction history without mirroring every unrelated transaction.</p></div>
  </section>

  <section class="case-section" id="recovery">
    <p class="section-number">05 / A real recovery question</p>
    <div class="case-header"><div><span class="case-label">Case note · BirdSV</span><h2>There is a goose<br><em>inside this transaction.</em></h2></div><p>A real BirdSV transaction contains structured sighting data and an image. It was mined. But what would make that sighting easy for someone else to recover years after the original site disappeared?</p></div>
    <div class="artifact"><div class="artifact-meta"><span>Transaction</span><code>22d4d18d…e836bf312</code><span>Observed record</span><b>Canada Goose</b><span>Protocol marker</span><b>birdsv</b></div><div class="artifact-question"><span aria-hidden="true">?</span><p>The proof can authenticate retained bytes. It cannot summon an image or schema that no accessible archive still holds.</p></div></div>
    <div class="case-steps"><article><i>1</i><h3>Name the topic</h3><p>Publish a stable, versioned definition for what counts as a BirdSV sighting.</p></article><article><i>2</i><h3>Keep full artifacts</h3><p>Retain raw transactions, content, validation ancestry, Merkle proofs, and the headers needed to check them.</p></article><article><i>3</i><h3>Multiply custodians</h3><p>Run independent hosts and test that a newcomer can rebuild the useful index without the original app.</p></article></div>
    <div class="case-actions"><a class="button button-primary" href="/overlays/recovery" data-event="pathway.selected">Run the data survival test <span aria-hidden="true">↗</span></a><a class="text-link" href="https://bananablocks.com/tx/22d4d18d4b3147c9b2621b0d56fb940ec00dc1f714d7ebbff0cd4e2e836bf312" rel="external" data-event="resource.clicked">Inspect the example transaction <span aria-hidden="true">↗</span></a></div>
  </section>

  <section class="myths-section"><p class="section-number">Keep these distinctions</p><div class="myths"><article><b>“It is on-chain.”</b><span>does not automatically mean</span><strong>“It is easy to retrieve forever.”</strong></article><article><b>“I have a Merkle proof.”</b><span>does not automatically mean</span><strong>“I have the original bytes.”</strong></article><article><b>“There is an overlay.”</b><span>does not automatically mean</span><strong>“There are independent custodians.”</strong></article></div></section>

  <section class="action-section" id="action"><p class="section-number">06 / Choose your next move</p><h2>Understanding is useful.<br><em>Coordination is durable.</em></h2><div class="next-grid"><a href="/overlays/recovery" data-event="pathway.selected"><small>I publish data</small><b>Run the survival test</b><span>Find your single points of failure →</span></a><a href="/overlays/build" data-event="pathway.selected"><small>I build systems</small><b>Follow the build path</b><span>Move from topic rules to recovery drills →</span></a><a href="/resources" data-event="pathway.selected"><small>I need sources</small><b>Open the source atlas</b><span>Current specs, code, examples, and history →</span></a></div></section>
  </article>`
}

function recovery () {
  const checks = [
    ['01', 'Open format', 'Can a stranger decode the record without your original UI or private database?', 'Publish schemas, media encodings, protocol prefixes, and version changes.'],
    ['02', 'Deterministic topic', 'Can two independent implementations agree on what belongs?', 'Document admission, spend, deletion, and conflict rules with test vectors.'],
    ['03', 'Complete artifact', 'Do custodians retain the transaction bytes and the evidence needed to validate them?', 'Export raw transactions or Atomic BEEF plus required headers—not screenshots or database rows alone.'],
    ['04', 'Independent copies', 'Would the dataset remain reachable if the original operator and cloud account vanished?', 'Recruit multiple organizations or individuals with separate infrastructure and keys.'],
    ['05', 'Catch-up path', 'Can a clean host join from zero and converge on the useful state?', 'Run GASP or a documented equivalent; measure and rehearse full recovery.'],
    ['06', 'Lookup contract', 'Can a replacement reader ask the questions people actually need?', 'Publish lookup queries, response formats, pagination, and canonical identifiers.'],
    ['07', 'Exit route', 'Can each person export the records they care about with proofs?', 'Offer portable, documented, integrity-checkable archives before an emergency.']
  ]
  return `<article class="kit-page"><header class="kit-hero"><div class="eyebrow"><span>Publisher route</span><span>Recovery</span><span>7 checks</span></div><h1>Will your data<br><em>outlive your app?</em></h1><p class="hero-deck">A mined transaction proves where a commitment was made. This publisher’s test asks the harder question: could another person still retrieve, interpret, validate, and serve the record if you disappeared?</p><a class="button button-primary" href="#survival-checklist" data-event="guide.started">Start the seven checks <span aria-hidden="true">↓</span></a><div class="score-card"><span>Your working score</span><strong><output id="recovery-score">0</output><small>/ 7</small></strong><p>No data leaves this page. This checklist is stored only in your browser.</p></div></header>
  <section class="checklist-section" id="survival-checklist"><div class="checklist-intro"><p class="section-number">The survival test</p><h2>Seven “yes” answers<br>make a <em>credible path.</em></h2><p>This is an operational test, not a badge. A resilient system periodically proves these claims from a clean machine.</p><div class="kit-tools"><button class="scenario-button" type="button" id="load-fragile-example">Load a fragile 2/7 example</button><a href="#continuity-packet">Review the continuity packet ↓</a><a href="/overlays/build" data-event="pathway.selected">Fix the gaps: open build path →</a><button class="reset-button" type="button" id="reset-checks">Reset checks</button></div></div><ol class="survival-checklist">${checks.map(([number, title, question, action]) => `<li><input type="checkbox" id="check-${number}" data-recovery-check><label for="check-${number}"><span>${number}</span><span><b>${title}</b><strong>${question}</strong><small>${action}</small></span><i aria-hidden="true">✓</i></label></li>`).join('')}</ol></section>
  <section class="score-meaning"><p class="section-number">How to read the result</p><div class="score-grid"><article><b>0–2</b><h3>Commitment without continuity</h3><p>Your records may be authentic, but continued access still depends heavily on the original application.</p></article><article><b>3–5</b><h3>A recoverable design</h3><p>The pieces exist. Now remove hidden dependencies and prove that independent catch-up works.</p></article><article><b>6–7</b><h3>A rehearsed pathway</h3><p>You have the shape of durable stewardship. Keep testing operators, exports, and protocol evolution.</p></article></div></section>
  <section class="handoff-section" id="continuity-packet"><div><p class="section-number">Make the promise testable</p><h2>Write a <em>continuity packet.</em></h2><p class="lead">One short public document should tell a future maintainer how to understand the data, obtain a complete proof-bearing copy, rebuild the index, join peers, and verify that nothing important is missing.</p></div><div class="packet-list"><span>01 Topic and schema specification</span><span>02 Reference implementation + test vectors</span><span>03 Bootstrap peers and discovery method</span><span>04 Export format and integrity manifest</span><span>05 Clean-room recovery procedure</span><span>06 Maintainer and succession policy</span></div></section>
  <section class="action-section"><p class="section-number">Next</p><div class="next-grid two"><a href="/overlays/build" data-event="pathway.selected"><small>Turn gaps into a system</small><b>Follow the overlay build path</b><span>Rules → proof → peers → recovery →</span></a><a href="/overlays" data-event="pathway.selected"><small>Return to the model</small><b>Read the complete guide</b><span>Overlays from first principles →</span></a></div></section></article>`
}

function build () {
  const stages = [
    ['01', 'Write the sentence', 'Define the public interest before the code.', '“This topic contains ___ when ___, and stops tracking it when ___.”', ['Name one bounded dataset', 'Name who benefits from sharing it', 'Name what must never be admitted']],
    ['02', 'Specify admission', 'Make belonging deterministic and versioned.', 'Implement a BRC-22 topic manager and publish test vectors for accepted, rejected, and spent outputs.', ['Validate scripts and payloads', 'Define state transitions', 'Reject ambiguous versions']],
    ['03', 'Specify questions', 'Design for the reader, not the database.', 'Implement BRC-24 lookup queries with stable parameters, pagination, and proof-bearing responses.', ['List real user questions', 'Set canonical identifiers', 'Document empty and error states']],
    ['04', 'Carry evidence', 'Treat proofs as part of the record.', 'Exchange transactions using current BEEF/Atomic BEEF conventions and retain the block evidence needed for SPV validation.', ['Validate transaction ancestry', 'Upgrade proofs after mining', 'Keep raw artifacts portable']],
    ['05', 'Find and synchronize', 'Let compatible peers discover and catch up.', 'Advertise through SHIP/SLAP where appropriate; use current GASP behavior for graph-aware synchronization and BASM when confirmed completeness matters.', ['Authenticate peer policy', 'Bound resource use', 'Make sync observable']],
    ['06', 'Rehearse disappearance', 'Prove the system without its creator.', 'From a clean host, recover through independent peers, rebuild lookups, verify a known record, and publish the evidence.', ['Remove original infrastructure', 'Time the recovery', 'Repeat after schema changes']]
  ]
  return `<article class="build-page"><header class="kit-hero build-hero"><div class="eyebrow"><span>Overlay field kit</span><span>Build</span><span>6 stages</span></div><h1>Build the path,<br><em>not just the endpoint.</em></h1><p class="hero-deck">An overlay is a social agreement made executable: what belongs, who keeps it, how newcomers catch up, which questions can be answered, and what evidence travels with each answer.</p><a class="button button-primary" href="#roadmap" data-event="guide.started">Open the roadmap <span aria-hidden="true">↓</span></a></header>
  <section class="build-principle"><p class="section-number">The design order</p><div class="build-equation"><span>Interest</span><i>→</i><span>Rules</span><i>→</i><span>Evidence</span><i>→</i><span>Peers</span><i>→</i><strong>Continuity</strong></div><p>Start with shared interest. Technology cannot create a stewardship community that does not exist.</p></section>
  <section class="roadmap" id="roadmap"><p class="section-number">A production-minded path</p>${stages.map(([number, title, subtitle, detail, items]) => `<article class="roadmap-step"><span class="roadmap-number">${number}</span><div><h2>${title}</h2><p class="roadmap-subtitle">${subtitle}</p></div><div class="roadmap-detail"><p>${detail}</p><ul>${items.map(item => `<li>${item}</li>`).join('')}</ul></div></article>`).join('')}</section>
  <section class="starter-section"><div><p class="section-number">Current implementation route</p><h2>The shortest path<br>into <em>working code.</em></h2><p>The actively maintained TypeScript stack is the safest starting point today. Evaluate versions and deployment requirements from the repositories themselves before production use.</p></div><div class="starter-links"><a href="https://github.com/bsv-blockchain/ts-stack/tree/main/packages/overlays/overlay" rel="external" data-event="resource.clicked"><b>@bsv/overlay</b><span>Core engine →</span></a><a href="https://github.com/bsv-blockchain/ts-stack/tree/main/packages/overlays/overlay-express" rel="external" data-event="resource.clicked"><b>@bsv/overlay-express</b><span>HTTP service host →</span></a><a href="https://github.com/bsv-blockchain/ts-stack/tree/main/packages/overlays/overlay-discovery-services" rel="external" data-event="resource.clicked"><b>Discovery services</b><span>SHIP + SLAP →</span></a><a href="https://github.com/bsv-blockchain/ts-stack/tree/main/packages/overlays/gasp-core" rel="external" data-event="resource.clicked"><b>@bsv/gasp</b><span>Catch-up and sync →</span></a></div></section>
  <section class="guardrails-section"><p class="section-number">Before production</p><h2>Operational questions<br><em>are protocol questions.</em></h2><div class="guardrail-grid"><article><h3>Abuse</h3><p>What limits submissions, lookups, graph traversal, and peer fan-out?</p></article><article><h3>Privacy</h3><p>Does replication expose data or relationship metadata people did not expect?</p></article><article><h3>Evolution</h3><p>How do old and new rule versions coexist without silently changing history?</p></article><article><h3>Completeness</h3><p>Can a host distinguish “I found nothing” from “I do not have everything”?</p></article><article><h3>Exit</h3><p>Can users take a verifiable copy without permission from the original operator?</p></article><article><h3>Succession</h3><p>Who can operate and explain the network when its first author leaves?</p></article></div></section>
  <section class="action-section"><p class="section-number">Keep going</p><div class="next-grid two"><a href="/resources" data-event="pathway.selected"><small>Implementation sources</small><b>Open the source atlas</b><span>${currentResourceCount} reviewed references →</span></a><a href="/overlays/recovery" data-event="pathway.selected"><small>Continuity discipline</small><b>Run the survival test</b><span>Seven checks for durable data →</span></a></div></section></article>`
}

function resourceGroups () {
  return resources.map((group, groupIndex) => `<section class="resource-group" aria-labelledby="resource-group-${groupIndex}"><div class="resource-group-title"><span>${String(groupIndex + 1).padStart(2, '0')}</span><h2 id="resource-group-${groupIndex}">${group.group}</h2><small>${group.items.length} references</small></div><div class="resource-list">${group.items.map(item => `<a href="${item.url}" rel="external" data-event="resource.clicked"><span class="resource-status">${item.status}</span><div><h3>${item.title}</h3><p>${item.note}</p></div><span class="resource-owner">${item.owner}</span><b aria-hidden="true">↗</b></a>`).join('')}</div></section>`).join('')
}

function resourcePage () {
  return `<article class="resources-page"><header class="resource-hero"><div class="eyebrow"><span>Source atlas</span><span>${currentResourceCount} links</span><span>Reviewed Sep 2026</span></div><h1>Follow the claim<br><em>to its source.</em></h1><p class="hero-deck">A status-labeled map of the specifications, maintained code, examples, and historical material behind BSV overlays. This is a reading route—not a pile of links.</p><div class="hero-actions"><a class="button button-primary" href="https://docs.bsvblockchain.org/network-topology/overlay-services" rel="external" data-event="resource.clicked">Start with the official overview <span aria-hidden="true">↗</span></a><a class="text-link" href="/overlays/build">Follow the implementation route <span aria-hidden="true">→</span></a></div><div class="legend"><span><i class="live"></i>Current / maintained</span><span><i class="context"></i>Context / example</span><span><i class="history"></i>Historical / aspirational</span></div></header>
  <section class="atlas-note"><p class="section-number">How this atlas is curated</p><div><h2>Status is part<br>of the <em>meaning.</em></h2><p>Overlay vocabulary has evolved. Earlier “confederacy” discovery documents help explain the lineage, but BRC-88 is the current SHIP/SLAP source. BRC-76 introduced GASP; current package documentation describes the behavior people actually implement. Archived repositories are labeled so old examples do not masquerade as present guidance.</p><a href="/overlays/build">See the recommended implementation route →</a></div></section>
  ${resourceGroups()}
  <section class="atlas-close"><p>Know a durable primary source or working public overlay we should review?</p><a href="https://github.com/p2ppsr/metanet-fyi/issues" rel="external">Propose an addition on GitHub <span aria-hidden="true">↗</span></a></section></article>`
}

function about () {
  return `<article class="prose-page"><header><div class="eyebrow"><span>About</span><span>Independent</span><span>Open source</span></div><h1>Technology needs<br><em>better doorways.</em></h1><p class="hero-deck">Metanet.fyi turns difficult infrastructure ideas into inspectable mental models, durable source trails, and practical next actions.</p></header><section><p class="section-number">The niche</p><div><h2>Between the slogan<br>and the specification.</h2><p class="lead">Official documentation must be precise. Social posts can make an idea vivid. Code proves what is implementable. Metanet.fyi connects those layers for the person who is not yet sure which one they need.</p><h3>Our editorial rules</h3><ul><li>Begin with a real human or operational question.</li><li>Separate consensus, overlay, and application responsibilities.</li><li>Link important technical claims to primary sources.</li><li>Label current, historical, archived, and aspirational material.</li><li>Prefer a useful correction over a comfortable simplification.</li><li>End with routes for readers, publishers, builders, and operators.</li></ul><h3>Independence and licensing</h3><p>Metanet.fyi is an independent educational project. It is not an official BSV Association publication and does not imply endorsement by linked projects. Site code is MIT licensed; original editorial content and diagrams are available under CC BY 4.0.</p></div></section></article>`
}

function privacy () {
  return `<article class="prose-page privacy-page"><header><div class="eyebrow"><span>Privacy</span><span>Short by design</span></div><h1>Measure the path.<br><em>Not the person.</em></h1><p class="hero-deck">Metanet.fyi uses small, first-party interaction signals to understand whether the field guides help. It does not need an advertising profile to do that.</p></header><section><p class="section-number">The policy</p><div><h2>Restraint is the<br><em>default setting.</em></h2><h3>What may be sent</h3><p>We may send the page path, a coarse event name such as “guide started” or “resource clicked,” a timestamp, and a short session identifier. Resource events record only the destination host—not query strings, page content, form text, wallet data, names, or email addresses.</p><h3>What is not used</h3><p>There are no advertising pixels, cross-site profiles, fingerprinting scripts, or third-party font requests. Checklist state remains in your browser’s local storage.</p><h3>Your signals</h3><p>If your browser sends Global Privacy Control or Do Not Track, measurement is disabled. You can also block the measurement endpoint without affecting any guide.</p><h3>Retention and contact</h3><p>Measurements are used for aggregate product improvement and operational health. Questions or deletion requests can be opened in the project’s public issue tracker; do not include sensitive information in a public issue.</p><p class="reviewed">Policy reviewed: September 3, 2026.</p></div></section></article>`
}

export function renderPage (path, nonce) {
  const bodyByPath = { '/': home, '/overlays': overlays, '/overlays/recovery': recovery, '/overlays/build': build, '/resources': resourcePage, '/about': about, '/privacy': privacy }
  const renderer = bodyByPath[path]
  if (!renderer) return null
  const article = path.startsWith('/overlays')
  const articleSchema = article ? [{
    '@context': 'https://schema.org',
    '@type': path === '/overlays' ? 'Article' : 'HowTo',
    headline: routes[path].title.replace(' — Metanet.fyi', ''),
    description: routes[path].description,
    image: `${site.origin}${routes[path].image}`,
    datePublished: site.published,
    dateModified: site.reviewed,
    author: { '@type': 'Organization', name: 'Metanet.fyi editorial' },
    publisher: { '@type': 'Organization', name: site.name, url: site.origin },
    mainEntityOfPage: `${site.origin}${path}`,
    inLanguage: 'en'
  }] : []
  return shell({ path, body: renderer(), nonce, jsonLd: articleSchema, article })
}
