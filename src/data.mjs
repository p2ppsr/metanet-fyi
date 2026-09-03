export const site = {
  name: 'Metanet.fyi',
  origin: 'https://metanet.fyi',
  description: 'Visual field guides to the protocols that make BSV applications scalable, verifiable, and resilient.',
  published: '2026-09-03',
  reviewed: '2026-09-03'
}

export const routes = {
  '/': {
    title: 'Metanet.fyi — The Metanet, made legible',
    description: 'Visual field guides that connect plain-language Metanet concepts to proofs, standards, code, and the next useful action.',
    image: '/social/home-v3.jpg',
    label: 'Field notes for a verifiable internet'
  },
  '/overlays': {
    title: 'BSV Overlays, Explained — Metanet.fyi',
    description: 'A visual, plain-language guide to BSV overlay networks: topics, SHIP, SLAP, GASP, proofs, recovery, and the path from concept to code.',
    image: '/social/overlays-v3.jpg',
    label: 'Field guide 001 · Overlays'
  },
  '/overlays/recovery': {
    title: 'Can Your On-Chain Data Survive the App? — Metanet.fyi',
    description: 'A practical resilience test for publishers and communities: what must remain open, replicated, proven, discoverable, and exportable.',
    image: '/social/recovery-v3.jpg',
    label: 'Overlay field kit · Recovery'
  },
  '/overlays/build': {
    title: 'Build an Overlay Path — Metanet.fyi',
    description: 'Choose a topic, define deterministic admission and lookup rules, replicate with proofs, test recovery, and move into current BSV overlay tooling.',
    image: '/social/build-v3.jpg',
    label: 'Overlay field kit · Build'
  },
  '/resources': {
    title: 'The BSV Overlay Source Atlas — Metanet.fyi',
    description: 'A curated, status-labeled map of current overlay specifications, implementations, examples, learning material, and historical proposals.',
    image: '/social/resources-v3.jpg',
    label: 'Source atlas · Reviewed September 2026'
  },
  '/about': {
    title: 'About Metanet.fyi',
    description: 'Metanet.fyi is an independent editorial field guide connecting understandable concepts to verifiable primary sources and useful next actions.',
    image: '/social/about-v3.jpg',
    label: 'About this field guide'
  },
  '/privacy': {
    title: 'Privacy — Metanet.fyi',
    description: 'The compact, privacy-bounded measurement policy for Metanet.fyi.',
    image: '/social/privacy-v3.jpg',
    label: 'Privacy by restraint'
  }
}

export const resources = [
  {
    group: 'Start here',
    items: [
      { title: 'Overlay Services overview', url: 'https://docs.bsvblockchain.org/network-topology/overlay-services', owner: 'BSV Association', status: 'Current overview', note: 'The shortest official introduction to topic managers, lookup services, and overlay architecture.' },
      { title: 'BRC repository', url: 'https://github.com/bsv-blockchain/BRCs', owner: 'BSV Blockchain', status: 'Primary source', note: 'The canonical index for BSV request-for-comments documents. Always check each document’s status.' },
      { title: 'TypeScript overlay stack', url: 'https://github.com/bsv-blockchain/ts-stack', owner: 'BSV Blockchain', status: 'Current implementation', note: 'The actively maintained monorepo containing the overlay engine, server, discovery, GASP, and topic packages.' }
    ]
  },
  {
    group: 'Core specifications',
    items: [
      { title: 'BRC-22 · Topic Manager API', url: 'https://github.com/bsv-blockchain/BRCs/blob/master/overlays/0022.md', owner: 'BRCs', status: 'Current', note: 'How an overlay decides which outputs belong to a topic and what happens when they are spent.' },
      { title: 'BRC-24 · Overlay Lookup Services', url: 'https://github.com/bsv-blockchain/BRCs/blob/master/overlays/0024.md', owner: 'BRCs', status: 'Current', note: 'A standard query interface for retrieving topic-specific data from overlay services.' },
      { title: 'BRC-62 · BEEF', url: 'https://github.com/bsv-blockchain/BRCs/blob/master/transactions/0062.md', owner: 'BRCs', status: 'Current', note: 'A compact envelope for transactions and the evidence required to validate their ancestry.' },
      { title: 'BRC-74 · BUMP', url: 'https://github.com/bsv-blockchain/BRCs/blob/master/transactions/0074.md', owner: 'BRCs', status: 'Current', note: 'A compact Merkle path format used to prove transaction inclusion.' },
      { title: 'BRC-76 · GASP', url: 'https://github.com/bsv-blockchain/BRCs/blob/master/transactions/0076.md', owner: 'BRCs', status: 'Exploratory origin', note: 'The original graph-aware synchronization proposal. Use the current GASP package docs for implementation behavior.' },
      { title: 'BRC-81 · Private Overlays', url: 'https://github.com/bsv-blockchain/BRCs/blob/master/overlays/0081.md', owner: 'BRCs', status: 'Current', note: 'Patterns for overlay services whose membership or data access is restricted.' },
      { title: 'BRC-87 · Overlay Names', url: 'https://github.com/bsv-blockchain/BRCs/blob/master/overlays/0087.md', owner: 'BRCs', status: 'Current', note: 'Naming conventions for overlay topics and lookup services.' },
      { title: 'BRC-88 · SHIP and SLAP', url: 'https://github.com/bsv-blockchain/BRCs/blob/master/overlays/0088.md', owner: 'BRCs', status: 'Current', note: 'Discover hosts for topics and discover lookup services through on-chain advertisements.' },
      { title: 'BRC-95 · Atomic BEEF', url: 'https://github.com/bsv-blockchain/BRCs/blob/master/transactions/0095.md', owner: 'BRCs', status: 'Current', note: 'A self-contained, atomic transaction proof envelope used in modern transaction exchange.' },
      { title: 'BRC-100 · Wallet Toolbox', url: 'https://github.com/bsv-blockchain/BRCs/blob/master/wallet/0100.md', owner: 'BRCs', status: 'Current', note: 'The wallet interface context around user-controlled transactions, identity, baskets, and services.' },
      { title: 'BRC-136 · BASM', url: 'https://github.com/bsv-blockchain/BRCs/blob/master/overlays/0136.md', owner: 'BRCs', status: 'Current extension', note: 'Block-aligned sparse Merkle roots help peers compare confirmed topic state and localize differences.' },
      { title: 'BRC-167 · CHIRP', url: 'https://github.com/bsv-blockchain/BRCs/blob/master/overlays/0167.md', owner: 'BRCs', status: 'Current extension', note: 'A chunked Merkle-object layer above UHRP for immutable ordered byte streams, with concurrent multi-host retrieval, per-chunk verification, retry, resume, and range selection.' }
    ]
  },
  {
    group: 'Current TypeScript stack',
    items: [
      { title: '@bsv/overlay', url: 'https://github.com/bsv-blockchain/ts-stack/tree/main/packages/overlays/overlay', owner: 'BSV Blockchain', status: 'Current implementation', note: 'Core engine for admission, UTXO state, lookups, propagation, and synchronization.' },
      { title: '@bsv/overlay-express', url: 'https://github.com/bsv-blockchain/ts-stack/tree/main/packages/overlays/overlay-express', owner: 'BSV Blockchain', status: 'Current implementation', note: 'A production-oriented HTTP host for the overlay engine and its standard protocols.' },
      { title: '@bsv/overlay-discovery-services', url: 'https://github.com/bsv-blockchain/ts-stack/tree/main/packages/overlays/overlay-discovery-services', owner: 'BSV Blockchain', status: 'Current implementation', note: 'SHIP and SLAP discovery using overlay advertisements.' },
      { title: '@bsv/gasp', url: 'https://github.com/bsv-blockchain/ts-stack/tree/main/packages/overlays/gasp-core', owner: 'BSV Blockchain', status: 'Current implementation', note: 'Graph-aware synchronization that discovers unknown outputs and recursively retrieves required ancestors.' },
      { title: '@bsv/overlay-topics', url: 'https://github.com/bsv-blockchain/ts-stack/tree/main/packages/overlays/topics', owner: 'BSV Blockchain', status: 'Reference topics', note: 'Canonical and demonstration topic implementations, including identity, messagebox, supply chain, UHRP, and KVStore.' }
    ]
  },
  {
    group: 'Examples in the wild',
    items: [
      { title: 'BirdSV sighting transaction', url: 'https://bananablocks.com/tx/22d4d18d4b3147c9b2621b0d56fb940ec00dc1f714d7ebbff0cd4e2e836bf312', owner: 'BirdSV / BananaBlocks', status: 'Concrete artifact', note: 'A useful recovery thought experiment: structured sighting data and an image committed in a BSV transaction.' },
      { title: 'Treechat', url: 'https://treechat.io', owner: 'Treechat', status: 'Live application', note: 'An on-chain social reader that also exposes legacy Twetch and Hodlocker archives.' },
      { title: 'Metanet Apps', url: 'https://metanetapps.com', owner: 'Babbage Systems', status: 'Live directory', note: 'An application directory demonstrating discoverable services in the BRC-100 ecosystem.' },
      { title: 'Dynamic supply chains', url: 'https://github.com/bsv-blockchain-demos/dynamic-supplychains', owner: 'BSV Blockchain Demos', status: 'Example code', note: 'A worked example where specialized state and verifiable provenance are more useful than global chain scanning.' },
      { title: 'OpenClaw overlay plugin', url: 'https://github.com/bsv-blockchain/openclaw-overlay-plugin', owner: 'BSV Blockchain', status: 'Example code', note: 'A current integration example showing how an agent-facing plugin can work with overlay services.' }
    ]
  },
  {
    group: 'History and context',
    items: [
      { title: 'BRC-23 · Confederacy Host Interconnect', url: 'https://github.com/bsv-blockchain/BRCs/blob/master/overlays/0023.md', owner: 'BRCs', status: 'Historical · superseded', note: 'An earlier host discovery design. BRC-88 supersedes its discovery role.' },
      { title: 'BRC-25 · Confederacy Lookup Availability', url: 'https://github.com/bsv-blockchain/BRCs/blob/master/overlays/0025.md', owner: 'BRCs', status: 'Historical · superseded', note: 'An earlier lookup discovery design. BRC-88 supersedes its discovery role.' },
      { title: 'BRC-59 · Overlay benefits', url: 'https://github.com/bsv-blockchain/BRCs/blob/master/opinions/0059.md', owner: 'BRCs', status: 'Opinion / rationale', note: 'The scalability and security case for application-specific overlay networks.' },
      { title: 'BRC-101 · Overlay transport alternatives', url: 'https://github.com/bsv-blockchain/BRCs/blob/master/overlays/0101.md', owner: 'BRCs', status: 'Aspirational', note: 'Ideas for transports beyond ordinary HTTP. Read as direction, not a deployment requirement.' },
      { title: 'Go overlay library', url: 'https://github.com/b-open-io/overlay', owner: 'b-open-io', status: 'Community implementation', note: 'A community Go implementation; evaluate version and compatibility before production use.' },
      { title: 'Archived Go overlay services', url: 'https://github.com/bsv-blockchain/overlay-services', owner: 'BSV Blockchain', status: 'Archived', note: 'Historically useful, but not the current recommended implementation path.' }
    ]
  }
]

export const currentResourceCount = resources.reduce((count, group) => count + group.items.length, 0)
