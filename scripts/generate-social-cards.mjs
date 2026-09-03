import { createRequire } from 'node:module'
import { mkdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import opentype from 'opentype.js'
import sharp from 'sharp'
import { routes } from '../src/data.mjs'

const require = createRequire(import.meta.url)
const root = fileURLToPath(new URL('..', import.meta.url))
const publicDirectory = join(root, 'public')
const outputDirectory = join(publicDirectory, 'social')

const palette = {
  ink: '#101112',
  inkSoft: '#17191b',
  paper: '#f1efe8',
  quiet: '#b7b6ae',
  line: '#303335',
  lime: '#d9ff43',
  blue: '#6b8cff',
  coral: '#ff6b57'
}

const cards = [
  { path: '/', slug: 'home', kicker: 'FIELD NOTES / OPEN SOURCES', lines: ['THE METANET,', 'MADE LEGIBLE.'], motif: 'orbit', accent: palette.lime },
  { path: '/overlays', slug: 'overlays', kicker: 'FIELD GUIDE 001 / OVERLAYS', lines: ['THE CHAIN PROVES IT.', 'THE NETWORK KEEPS IT USEFUL.'], motif: 'network', accent: palette.blue },
  { path: '/overlays/recovery', slug: 'recovery', kicker: 'OVERLAY FIELD KIT / RECOVERY', lines: ['WILL YOUR DATA', 'OUTLIVE YOUR APP?'], motif: 'recovery', accent: palette.coral },
  { path: '/overlays/build', slug: 'build', kicker: 'OVERLAY FIELD KIT / BUILD', lines: ['BUILD THE PATH,', 'NOT JUST THE ENDPOINT.'], motif: 'build', accent: palette.blue },
  { path: '/resources', slug: 'resources', kicker: 'BSV OVERLAY SOURCE ATLAS', lines: ['FOLLOW THE CLAIM', 'TO ITS SOURCE.'], motif: 'sources', accent: palette.lime },
  { path: '/about', slug: 'about', kicker: 'ABOUT METANET.FYI', lines: ['TECHNOLOGY NEEDS', 'BETTER DOORWAYS.'], motif: 'door', accent: palette.paper },
  { path: '/privacy', slug: 'privacy', kicker: 'PRIVACY BY RESTRAINT', lines: ['MEASURE THE PATH.', 'NOT THE PERSON.'], motif: 'privacy', accent: palette.blue }
]

async function loadFont (packagePath) {
  const bytes = await readFile(require.resolve(packagePath))
  return opentype.parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength))
}

const [displayFont, bodyFont, italicFont] = await Promise.all([
  loadFont('@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff'),
  loadFont('@fontsource/space-grotesk/files/space-grotesk-latin-400-normal.woff'),
  loadFont('@fontsource/newsreader/files/newsreader-latin-700-italic.woff')
])

function textWidth (font, value, size, tracking = 0) {
  const glyphs = font.stringToGlyphs(value)
  const scale = size / font.unitsPerEm
  let width = 0
  glyphs.forEach((glyph, index) => {
    width += glyph.advanceWidth * scale
    if (index < glyphs.length - 1) width += font.getKerningValue(glyph, glyphs[index + 1]) * scale + tracking
  })
  return width
}

function fitText (font, value, preferredSize, maxWidth, tracking = 0, minimumSize = 36) {
  let size = preferredSize
  while (size > minimumSize && textWidth(font, value, size, tracking) > maxWidth) size -= 1
  return size
}

function textPath ({ font, value, x, y, size, fill, tracking = 0 }) {
  const glyphs = font.stringToGlyphs(value)
  const scale = size / font.unitsPerEm
  let cursor = x
  const paths = glyphs.map((glyph, index) => {
    const path = glyph.getPath(cursor, y, size).toPathData(2)
    cursor += glyph.advanceWidth * scale
    if (index < glyphs.length - 1) cursor += font.getKerningValue(glyph, glyphs[index + 1]) * scale + tracking
    return path ? `<path d="${path}"/>` : ''
  }).join('')
  return `<g fill="${fill}">${paths}</g>`
}

function grid () {
  return `<defs>
    <pattern id="grid" width="42" height="42" patternUnits="userSpaceOnUse"><path d="M42 0H0V42" fill="none" stroke="${palette.line}" stroke-width="1"/></pattern>
    <radialGradient id="glow"><stop stop-color="${palette.blue}" stop-opacity=".24"/><stop offset="1" stop-color="${palette.blue}" stop-opacity="0"/></radialGradient>
  </defs><rect x="712" width="488" height="630" fill="url(#grid)"/><circle cx="960" cy="315" r="280" fill="url(#glow)"/>`
}

function motif (name, accent) {
  const shared = `stroke-linecap="round" stroke-linejoin="round"`
  if (name === 'network') return `<g fill="none" ${shared}>
    <path d="M814 335C876 214 1002 193 1091 284M814 335C887 436 1011 443 1091 284M814 335C906 320 994 316 1091 284" stroke="${palette.paper}" stroke-opacity=".32" stroke-width="3"/>
    <circle cx="814" cy="335" r="36" fill="${palette.inkSoft}" stroke="${accent}" stroke-width="4"/><circle cx="1091" cy="284" r="36" fill="${palette.inkSoft}" stroke="${accent}" stroke-width="4"/><circle cx="946" cy="205" r="25" fill="${palette.coral}" stroke="${palette.ink}" stroke-width="6"/><circle cx="957" cy="427" r="25" fill="${palette.lime}" stroke="${palette.ink}" stroke-width="6"/>
    <rect x="895" y="286" width="58" height="44" rx="8" fill="${accent}" stroke="${palette.ink}" stroke-width="6"/><path d="m913 308 9 9 16-20" stroke="${palette.ink}" stroke-width="6"/>
  </g>`
  if (name === 'recovery') return `<g ${shared}>
    <rect x="797" y="205" width="326" height="244" rx="8" fill="${palette.inkSoft}" stroke="${palette.paper}" stroke-opacity=".28" stroke-width="3"/>
    <rect x="820" y="180" width="326" height="244" rx="8" fill="${palette.inkSoft}" stroke="${palette.paper}" stroke-opacity=".52" stroke-width="3"/>
    <rect x="843" y="155" width="326" height="244" rx="8" fill="${palette.inkSoft}" stroke="${accent}" stroke-width="4"/>
    <path d="M882 215h164M882 256h202M882 297h128" stroke="${palette.paper}" stroke-opacity=".5" stroke-width="10"/>
    <circle cx="1100" cy="335" r="42" fill="${palette.lime}" stroke="${palette.ink}" stroke-width="7"/><path d="m1080 336 14 14 27-32" fill="none" stroke="${palette.ink}" stroke-width="9"/>
  </g>`
  if (name === 'build') return `<g ${shared}>
    <path d="M789 439h90v-72h90v-72h90v-72h90" fill="none" stroke="${palette.paper}" stroke-opacity=".3" stroke-width="4"/>
    <path d="M807 421h72v-72h90v-72h90v-72h76" fill="none" stroke="${accent}" stroke-width="14"/>
    <circle cx="807" cy="421" r="22" fill="${palette.coral}"/><circle cx="1135" cy="205" r="34" fill="${palette.lime}"/>
    <path d="m1120 205 11 11 21-25" fill="none" stroke="${palette.ink}" stroke-width="8"/>
  </g>`
  if (name === 'sources') return `<g ${shared}>
    <path d="M821 184h302v315H821z" fill="${palette.inkSoft}" stroke="${palette.paper}" stroke-opacity=".25" stroke-width="3"/>
    <path d="M846 158h302v315H846z" fill="${palette.inkSoft}" stroke="${accent}" stroke-width="4"/>
    <path d="M890 224h102M890 273h211M890 322h174M890 371h193" stroke="${palette.paper}" stroke-opacity=".58" stroke-width="12"/>
    <circle cx="1075" cy="224" r="17" fill="${palette.coral}"/><path d="M1088 393l56 56M1116 449h28v-28" fill="none" stroke="${palette.lime}" stroke-width="9"/>
  </g>`
  if (name === 'door') return `<g fill="none" ${shared}>
    <path d="M811 476V166h324v310" stroke="${palette.paper}" stroke-opacity=".22" stroke-width="3"/>
    <path d="M852 476V206h242v270" stroke="${palette.paper}" stroke-opacity=".52" stroke-width="4"/>
    <path d="M896 476V251h155v225" stroke="${palette.lime}" stroke-width="10"/>
    <path d="M972 252v224" stroke="${palette.coral}" stroke-width="5"/><circle cx="1020" cy="365" r="9" fill="${palette.paper}" stroke="none"/>
  </g>`
  if (name === 'privacy') return `<g fill="none" ${shared}>
    <circle cx="973" cy="316" r="170" stroke="${palette.paper}" stroke-opacity=".18" stroke-width="3"/><circle cx="973" cy="316" r="112" stroke="${accent}" stroke-dasharray="5 14" stroke-width="4"/>
    <path d="M973 185c61 25 102 22 102 22v99c0 76-46 121-102 145-56-24-102-69-102-145v-99s41 3 102-22Z" fill="${palette.inkSoft}" stroke="${palette.lime}" stroke-width="5"/>
    <path d="M921 316h104" stroke="${palette.paper}" stroke-width="18"/><circle cx="973" cy="316" r="16" fill="${palette.coral}" stroke="none"/>
  </g>`
  return `<g fill="none" ${shared}>
    <circle cx="972" cy="312" r="204" stroke="${accent}" stroke-opacity=".82" stroke-width="3"/><circle cx="972" cy="312" r="142" stroke="${palette.blue}" stroke-dasharray="5 11" stroke-width="3"/><circle cx="972" cy="312" r="62" fill="${accent}" stroke="none"/>
    <circle cx="816" cy="182" r="14" fill="${palette.coral}" stroke="none"/><circle cx="1127" cy="358" r="14" fill="${palette.blue}" stroke="none"/><circle cx="870" cy="498" r="14" fill="${palette.paper}" stroke="none"/>
  </g>`
}

function cardSvg (card) {
  const firstSize = fitText(displayFont, card.lines[0], 69, 642, -2.5, 48)
  const secondSize = fitText(italicFont, card.lines[1], 68, 665, -2, 38)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="${palette.ink}"/>${grid()}
    <g fill="${palette.lime}"><rect x="62" y="48" width="9" height="20"/><rect x="78" y="38" width="9" height="30"/><rect x="94" y="46" width="9" height="22"/></g>
    ${textPath({ font: displayFont, value: 'metanet', x: 120, y: 65, size: 25, fill: palette.paper })}
    ${textPath({ font: displayFont, value: '.fyi', x: 120 + textWidth(displayFont, 'metanet', 25), y: 65, size: 25, fill: palette.lime })}
    ${textPath({ font: displayFont, value: card.kicker, x: 62, y: 166, size: 16, fill: card.accent, tracking: 2.8 })}
    ${textPath({ font: displayFont, value: card.lines[0], x: 62, y: 278, size: firstSize, fill: palette.paper, tracking: -2.5 })}
    ${textPath({ font: italicFont, value: card.lines[1], x: 62, y: 357, size: secondSize, fill: card.accent, tracking: -2 })}
    <path d="M62 516H654" stroke="#3a3c3d"/>
    ${textPath({ font: bodyFont, value: 'CONCEPT  /  PROOF  /  ACTION', x: 62, y: 552, size: 18, fill: palette.quiet, tracking: 1 })}
    ${motif(card.motif, card.accent)}
  </svg>`
}

async function renderIcon (size, filename) {
  const markSize = Math.round(size * 0.66)
  const mark = await sharp(join(publicDirectory, 'favicon.svg')).resize(markSize, markSize).png().toBuffer()
  await sharp({ create: { width: size, height: size, channels: 3, background: palette.ink } })
    .composite([{ input: mark, gravity: 'centre' }])
    .png({ compressionLevel: 9, palette: true })
    .toFile(join(publicDirectory, filename))
}

await mkdir(outputDirectory, { recursive: true })
for (const card of cards) {
  const markup = cardSvg(card)
  if (/<text|@font-face|font-family/.test(markup)) throw new Error(`Card ${card.slug} must not depend on a font renderer`)
  const svg = Buffer.from(markup)
  const expectedImage = `/social/${card.slug}-v3.jpg`
  if (routes[card.path].image !== expectedImage) throw new Error(`Route ${card.path} must reference ${expectedImage}`)

  const rendered = sharp(svg).flatten({ background: palette.ink }).toColourspace('srgb').removeAlpha()
  await rendered.clone().jpeg({ quality: 92, chromaSubsampling: '4:4:4', progressive: false }).toFile(join(outputDirectory, `${card.slug}-v3.jpg`))
  await rendered.clone().png({ compressionLevel: 9 }).toFile(join(outputDirectory, `${card.slug}.png`))
}

await Promise.all([
  renderIcon(180, 'apple-touch-icon.png'),
  renderIcon(192, 'icon-192.png'),
  renderIcon(512, 'icon-512.png')
])

console.log(`Generated ${cards.length} font-independent social card pairs and app icons in ${publicDirectory}`)
