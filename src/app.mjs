import { createHash, randomBytes } from 'node:crypto'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize, resolve } from 'node:path'
import { brotliCompressSync, gzipSync } from 'node:zlib'
import { fileURLToPath } from 'node:url'
import { resources, routes, site } from './data.mjs'
import { renderPage } from './pages.mjs'

const root = fileURLToPath(new URL('..', import.meta.url))
const publicDirectory = join(root, 'public')

const assetTypes = {
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.txt': 'text/plain; charset=utf-8'
}

function contentHeaders (nonce) {
  return {
    'Content-Security-Policy': `default-src 'self'; base-uri 'none'; connect-src 'self' https://usercom.babbage.systems; font-src 'self'; form-action 'self'; frame-ancestors 'none'; img-src 'self' data:; object-src 'none'; script-src 'self' 'nonce-${nonce}'; style-src 'self'; upgrade-insecure-requests`,
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin',
    'Permissions-Policy': 'camera=(), geolocation=(), microphone=(), payment=(), usb=()',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY'
  }
}

function send (request, response, status, body, headers = {}, nonce = '') {
  let output = Buffer.isBuffer(body) ? body : Buffer.from(body)
  const acceptEncoding = request.headers['accept-encoding'] || ''
  const contentType = headers['Content-Type'] || ''
  const shouldCompress = output.length > 1024 && (/^text\//.test(contentType) || /json|javascript|svg|manifest/.test(contentType))

  if (shouldCompress && acceptEncoding.includes('br')) {
    output = brotliCompressSync(output)
    headers['Content-Encoding'] = 'br'
  } else if (shouldCompress && acceptEncoding.includes('gzip')) {
    output = gzipSync(output)
    headers['Content-Encoding'] = 'gzip'
  }

  const etag = `"${createHash('sha256').update(output).digest('base64url').slice(0, 20)}"`
  if (request.headers['if-none-match'] === etag) {
    response.writeHead(304, { ...contentHeaders(nonce), ETag: etag, Vary: 'Accept-Encoding', ...headers })
    response.end()
    return
  }

  response.writeHead(status, { ...contentHeaders(nonce), 'Content-Length': output.length, ETag: etag, Vary: 'Accept-Encoding', ...headers })
  if (request.method === 'HEAD') response.end()
  else response.end(output)
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${Object.entries(routes).map(([path, meta]) => `  <url><loc>${site.origin}${path === '/' ? '' : path}</loc><lastmod>${site.reviewed}</lastmod><image:image><image:loc>${site.origin}${meta.image}</image:loc><image:title>${meta.title}</image:title><image:caption>${meta.label} — Metanet.fyi</image:caption></image:image></url>`).join('\n')}
</urlset>`

const resourceJson = JSON.stringify({ name: 'Metanet.fyi BSV Overlay Source Atlas', reviewed: site.reviewed, license: 'CC BY 4.0', resources }, null, 2)

const llms = `# Metanet.fyi

> Independent visual field guides connecting plain-language Metanet concepts to primary sources and practical next actions.

## Primary guide
- [BSV Overlays, Explained](${site.origin}/overlays): Topics, proof, SHIP, SLAP, GASP, BASM, and the boundary between blockchain, overlay, and application.
- [Data Survival Test](${site.origin}/overlays/recovery): Seven operational checks for recoverable on-chain application data.
- [Overlay Build Path](${site.origin}/overlays/build): A six-stage, production-minded roadmap.
- [Overlay Source Atlas](${site.origin}/resources): Status-labeled primary specifications, current code, examples, and historical context.

## Editorial notes
- Important protocol claims link to primary sources.
- Historical, archived, current, and aspirational materials are distinguished.
- Original editorial content is CC BY 4.0; site code is MIT.
`

async function sendAsset (request, response, pathname, nonce) {
  const decoded = decodeURIComponent(pathname).replace(/^\/+/, '')
  if (decoded.includes('\0') || normalize(decoded).startsWith('..')) return false
  const candidate = resolve(publicDirectory, decoded)
  if (!candidate.startsWith(`${resolve(publicDirectory)}/`)) return false
  const extension = extname(candidate)
  if (!assetTypes[extension]) return false
  try {
    const info = await stat(candidate)
    if (!info.isFile()) return false
    const body = await readFile(candidate)
    const versioned = /\/social\/[a-z-]+-v\d+\.jpg$/.test(pathname)
    const socialAsset = pathname.startsWith('/social/')
    send(request, response, 200, body, {
      'Content-Type': assetTypes[extension],
      'Cache-Control': versioned
        ? 'public, max-age=31536000, immutable'
        : socialAsset || pathname === '/favicon.svg' || pathname.endsWith('-icon.png') || pathname.startsWith('/icon-')
          ? 'public, max-age=86400, stale-while-revalidate=604800'
          : 'public, max-age=3600, stale-while-revalidate=86400',
      ...(socialAsset ? { 'Access-Control-Allow-Origin': '*', 'Cross-Origin-Resource-Policy': 'cross-origin' } : {})
    }, nonce)
    return true
  } catch {
    return false
  }
}

export function createHandler () {
  return async function handler (request, response) {
    const nonce = randomBytes(18).toString('base64')
    const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`)
    const pathname = url.pathname.length > 1 && url.pathname.endsWith('/') ? url.pathname.slice(0, -1) : url.pathname

    if (!['GET', 'HEAD'].includes(request.method || 'GET')) {
      send(request, response, 405, 'Method not allowed', { 'Content-Type': 'text/plain; charset=utf-8', Allow: 'GET, HEAD', 'Cache-Control': 'no-store' }, nonce)
      return
    }
    if ((request.headers.host || '').toLowerCase().startsWith('www.metanet.fyi')) {
      response.writeHead(308, { Location: `${site.origin}${pathname}${url.search}`, ...contentHeaders(nonce) })
      response.end()
      return
    }
    if (pathname !== url.pathname) {
      response.writeHead(308, { Location: `${pathname}${url.search}`, ...contentHeaders(nonce) })
      response.end()
      return
    }
    if (pathname === '/healthz') {
      send(request, response, 200, JSON.stringify({ ok: true, service: 'metanet-fyi', version: process.env.APP_VERSION || 'dev' }), { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }, nonce)
      return
    }
    if (pathname === '/robots.txt') {
      send(request, response, 200, `User-agent: *\nAllow: /\nSitemap: ${site.origin}/sitemap.xml\n`, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }, nonce)
      return
    }
    if (pathname === '/sitemap.xml') {
      send(request, response, 200, sitemap, { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }, nonce)
      return
    }
    if (pathname === '/llms.txt') {
      send(request, response, 200, llms, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }, nonce)
      return
    }
    if (pathname === '/resources.json') {
      send(request, response, 200, resourceJson, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=3600', 'Access-Control-Allow-Origin': '*' }, nonce)
      return
    }
    if (pathname === '/.well-known/security.txt') {
      send(request, response, 200, `Contact: https://github.com/p2ppsr/metanet-fyi/security/advisories/new\nCanonical: ${site.origin}/.well-known/security.txt\nExpires: 2027-09-03T23:59:59Z\nPreferred-Languages: en\n`, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=86400' }, nonce)
      return
    }

    const html = renderPage(pathname, nonce)
    if (html) {
      send(request, response, 200, html, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400' }, nonce)
      return
    }
    if (await sendAsset(request, response, pathname, nonce)) return

    send(request, response, 404, `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Not found — Metanet.fyi</title><link rel="stylesheet" href="/styles.css"></head><body><main class="not-found"><p class="section-number">404 / Lost path</p><h1>This route is not<br><em>in the topic.</em></h1><a class="button button-primary" href="/">Return home →</a></main></body></html>`, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }, nonce)
  }
}
