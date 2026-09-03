# Overlay source atlas research notes

Reviewed: 2026-09-03

## Editorial finding

The ecosystem already has primary specifications, package documentation, code examples, and social explanations. Its underserved need is a durable public bridge between them: a visual entry point that begins with a human continuity question, makes the blockchain/overlay/application boundary explicit, distinguishes current guidance from historical vocabulary, and ends in a practical reader, publisher, builder, or operator path.

Metanet.fyi therefore occupies the “concept → proof → action” layer. It does not attempt to replace protocol specifications or SDK documentation.

## Accuracy model

- The blockchain supplies ordering, settlement, transaction validity, and block commitments.
- An overlay applies application-specific topic rules, retains selected transactions and state, and exposes useful lookup answers.
- Proof is not storage. Merkle evidence can authenticate transaction bytes a recipient has; it cannot reproduce bytes no reachable custodian retained.
- SHIP and SLAP in BRC-88 are discovery protocols: SHIP advertisements help find hosts supporting topics, while SLAP advertisements help find lookup services. The broader stack uses discovered peers for propagation and queries.
- GASP began in exploratory BRC-76. Current implementation behavior should be sourced to the maintained `@bsv/gasp` package.
- BRC-23 and BRC-25 are historical discovery designs superseded in that role by BRC-88. BRC-101 is aspirational. The older BSV Go overlay repository is archived; the TypeScript stack is the current official implementation route.
- BASM adds block-aligned sparse Merkle roots and per-block topic anchors so peers can compare confirmed topic state and efficiently locate differences.
- CHIRP is content resolution, not transaction relay. BRC-167 defines a chunked Merkle-object layer above UHRP for immutable ordered byte streams. It reuses `tm_uhrp` and `ls_uhrp` while adding bounded chunks, concurrent multi-host retrieval, per-chunk verification, retry, resume, and logical byte-range selection.

## Primary references

- [BSV Overlay Services overview](https://docs.bsvblockchain.org/network-topology/overlay-services)
- [BRC repository](https://github.com/bsv-blockchain/BRCs)
- [BRC-22 Topic Manager API](https://github.com/bsv-blockchain/BRCs/blob/master/overlays/0022.md)
- [BRC-24 Overlay Lookup Services](https://github.com/bsv-blockchain/BRCs/blob/master/overlays/0024.md)
- [BRC-62 BEEF](https://github.com/bsv-blockchain/BRCs/blob/master/transactions/0062.md)
- [BRC-74 BUMP](https://github.com/bsv-blockchain/BRCs/blob/master/transactions/0074.md)
- [BRC-76 GASP](https://github.com/bsv-blockchain/BRCs/blob/master/transactions/0076.md)
- [BRC-81 Private Overlays](https://github.com/bsv-blockchain/BRCs/blob/master/overlays/0081.md)
- [BRC-87 Overlay Names](https://github.com/bsv-blockchain/BRCs/blob/master/overlays/0087.md)
- [BRC-88 SHIP and SLAP](https://github.com/bsv-blockchain/BRCs/blob/master/overlays/0088.md)
- [BRC-95 Atomic BEEF](https://github.com/bsv-blockchain/BRCs/blob/master/transactions/0095.md)
- [BRC-100 Wallet Toolbox](https://github.com/bsv-blockchain/BRCs/blob/master/wallet/0100.md)
- [BRC-136 BASM](https://github.com/bsv-blockchain/BRCs/blob/master/overlays/0136.md)
- [BRC-167 CHIRP](https://github.com/bsv-blockchain/BRCs/blob/master/overlays/0167.md)
- [Current TypeScript stack](https://github.com/bsv-blockchain/ts-stack)
- [`@bsv/overlay`](https://github.com/bsv-blockchain/ts-stack/tree/main/packages/overlays/overlay)
- [`@bsv/overlay-express`](https://github.com/bsv-blockchain/ts-stack/tree/main/packages/overlays/overlay-express)
- [`@bsv/overlay-discovery-services`](https://github.com/bsv-blockchain/ts-stack/tree/main/packages/overlays/overlay-discovery-services)
- [`@bsv/gasp`](https://github.com/bsv-blockchain/ts-stack/tree/main/packages/overlays/gasp-core)
- [`@bsv/overlay-topics`](https://github.com/bsv-blockchain/ts-stack/tree/main/packages/overlays/topics)

## Concrete examples

- [BirdSV sighting transaction](https://bananablocks.com/tx/22d4d18d4b3147c9b2621b0d56fb940ec00dc1f714d7ebbff0cd4e2e836bf312): mined transaction with a `birdsv` structured record and JPEG output. Used as a recovery thought experiment, not as evidence that a BirdSV overlay currently exists.
- [Treechat](https://treechat.io): live on-chain social reader with legacy Twetch/Hodlocker archive claims.
- [Metanet Apps](https://metanetapps.com): live BRC-100 ecosystem directory.
- [Dynamic supply chains](https://github.com/bsv-blockchain-demos/dynamic-supplychains): example code for specialized state and provenance.
- [OpenClaw overlay plugin](https://github.com/bsv-blockchain/openclaw-overlay-plugin): current integration example.

The public `/resources` route and `/resources.json` expose the larger curated list with status labels and short routing notes.
