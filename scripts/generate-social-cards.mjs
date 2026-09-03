import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { routes } from '../src/data.mjs'

const root = fileURLToPath(new URL('..', import.meta.url))
const outputDirectory = join(root, 'public', 'social')

const cards = {
  '/': ['THE METANET,', 'MADE LEGIBLE.', 'FIELD NOTES · OPEN SOURCES'],
  '/overlays': ['THE CHAIN PROVES IT.', 'THE NETWORK KEEPS IT USEFUL.', 'FIELD GUIDE 001 · OVERLAYS'],
  '/overlays/recovery': ['WILL YOUR DATA', 'OUTLIVE YOUR APP?', 'OVERLAY FIELD KIT · RECOVERY'],
  '/overlays/build': ['BUILD THE PATH,', 'NOT JUST THE ENDPOINT.', 'OVERLAY FIELD KIT · BUILD'],
  '/resources': ['FOLLOW THE CLAIM', 'TO ITS SOURCE.', 'BSV OVERLAY SOURCE ATLAS'],
  '/about': ['TECHNOLOGY NEEDS', 'BETTER DOORWAYS.', 'ABOUT METANET.FYI'],
  '/privacy': ['MEASURE THE PATH.', 'NOT THE PERSON.', 'PRIVACY BY RESTRAINT']
}

function escapeXml (value) {
  return value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[character])
}

function cardSvg ([lineOne, lineTwo, kicker]) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="#101112"/>
    <defs><pattern id="grid" width="46" height="46" patternUnits="userSpaceOnUse"><path d="M46 0H0V46" fill="none" stroke="#303233" stroke-width="1"/></pattern><radialGradient id="glow"><stop stop-color="#6b8cff" stop-opacity=".26"/><stop offset="1" stop-color="#6b8cff" stop-opacity="0"/></radialGradient></defs>
    <rect x="650" width="550" height="630" fill="url(#grid)"/><circle cx="920" cy="310" r="270" fill="url(#glow)"/>
    <circle cx="960" cy="302" r="204" fill="none" stroke="#d9ff43" stroke-opacity=".75"/><circle cx="960" cy="302" r="142" fill="none" stroke="#6b8cff" stroke-dasharray="5 10"/><circle cx="960" cy="302" r="62" fill="#d9ff43"/>
    <circle cx="804" cy="172" r="13" fill="#ff6b57"/><circle cx="1115" cy="348" r="13" fill="#6b8cff"/><circle cx="858" cy="488" r="13" fill="#f1efe8"/>
    <g fill="#d9ff43"><rect x="62" y="48" width="9" height="20"/><rect x="78" y="38" width="9" height="30"/><rect x="94" y="46" width="9" height="22"/></g>
    <text x="120" y="65" fill="#f1efe8" font-family="Arial, Helvetica, sans-serif" font-size="25" font-weight="700">metanet<tspan fill="#d9ff43">.fyi</tspan></text>
    <text x="62" y="166" fill="#d9ff43" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="700" letter-spacing="3">${escapeXml(kicker)}</text>
    <text x="62" y="278" fill="#f1efe8" font-family="Arial, Helvetica, sans-serif" font-size="70" font-weight="800" letter-spacing="-4">${escapeXml(lineOne)}</text>
    <text x="62" y="357" fill="#d9ff43" font-family="Georgia, Times, serif" font-size="68" font-style="italic" letter-spacing="-3">${escapeXml(lineTwo)}</text>
    <path d="M62 516H598" stroke="#3a3c3d"/><text x="62" y="552" fill="#b7b6ae" font-family="Arial, Helvetica, sans-serif" font-size="18">CONCEPT → PROOF → ACTION</text>
  </svg>`
}

await mkdir(outputDirectory, { recursive: true })
for (const [path, copy] of Object.entries(cards)) {
  const filename = routes[path].image.split('/').pop()
  await sharp(Buffer.from(cardSvg(copy))).png({ compressionLevel: 9 }).toFile(join(outputDirectory, filename))
}
console.log(`Generated ${Object.keys(cards).length} social cards in ${outputDirectory}`)
