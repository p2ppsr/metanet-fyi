import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { createServer } from 'node:http'
import test from 'node:test'
import sharp from 'sharp'
import { createHandler } from '../../src/app.mjs'
import { routes } from '../../src/data.mjs'
import { renderPage } from '../../src/pages.mjs'

test('every public route renders complete, page-specific metadata', () => {
  const images = new Set()
  for (const [path, meta] of Object.entries(routes)) {
    const html = renderPage(path, 'test-nonce')
    const canonical = `https://metanet.fyi${path === '/' ? '' : path}`
    const image = `https://metanet.fyi${meta.image}`
    assert.match(html, /^<!doctype html>/)
    assert.ok(html.includes(`<title>${meta.title}</title>`))
    assert.ok(html.includes(`property="og:image" content="${image}"`))
    assert.ok(html.includes(`property="og:image:secure_url" content="${image}"`))
    assert.ok(html.includes('property="og:image:type" content="image/jpeg"'))
    assert.ok(html.includes(`name="twitter:image" content="${image}"`))
    assert.ok(html.includes(`name="twitter:image:alt" content="${meta.label} — Metanet.fyi"`))
    assert.ok(html.includes(`rel="image_src" href="${image}"`))
    assert.ok(html.includes(`rel="canonical" href="${canonical}"`))
    assert.ok(html.includes(`hreflang="x-default" href="${canonical}"`))
    assert.ok(html.includes('application/ld+json'))
    assert.ok(html.includes('"@type":"ImageObject"'))
    assert.ok(html.includes(`"contentUrl":"${image}"`))
    assert.ok(html.includes('"license":"https://creativecommons.org/licenses/by/4.0/"'))
    assert.ok(html.includes('id="content"'))
    assert.match(meta.image, /^\/social\/[a-z-]+-v\d+\.jpg$/)
    images.add(meta.image)
  }
  assert.equal(images.size, Object.keys(routes).length, 'every route needs its own preview image')
})

test('HTTP surface serves health, discovery files, assets, and compression', async () => {
  const server = createServer(createHandler())
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const origin = `http://127.0.0.1:${server.address().port}`
  try {
    const health = await fetch(`${origin}/healthz`)
    assert.equal(health.status, 200)
    assert.equal((await health.json()).service, 'metanet-fyi')
    for (const path of ['/robots.txt', '/sitemap.xml', '/llms.txt', '/resources.json', '/styles.css', '/site.webmanifest', '/apple-touch-icon.png', '/icon-192.png', '/icon-512.png']) {
      const response = await fetch(`${origin}${path}`)
      assert.equal(response.status, 200, path)
      assert.equal(response.headers.get('x-content-type-options'), 'nosniff')
    }
    const sitemap = await (await fetch(`${origin}/sitemap.xml`)).text()
    for (const meta of Object.values(routes)) assert.ok(sitemap.includes(`<image:loc>https://metanet.fyi${meta.image}</image:loc>`))
    const compressed = await fetch(`${origin}/overlays`, { headers: { 'accept-encoding': 'br' } })
    assert.equal(compressed.headers.get('content-encoding'), 'br')
    assert.match(await compressed.text(), /The chain proves it/)
    assert.equal((await fetch(`${origin}/missing`)).status, 404)
  } finally {
    await new Promise(resolve => server.close(resolve))
  }
})

test('social images are platform-safe, unique, opaque, and cross-origin readable', async () => {
  const server = createServer(createHandler())
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const origin = `http://127.0.0.1:${server.address().port}`
  const hashes = new Set()
  try {
    for (const [path, meta] of Object.entries(routes)) {
      const response = await fetch(`${origin}${meta.image}`, { headers: { 'user-agent': 'Slackbot-LinkExpanding 1.0 (+https://api.slack.com/robots)' } })
      assert.equal(response.status, 200, path)
      assert.equal(response.headers.get('content-type'), 'image/jpeg')
      assert.equal(response.headers.get('cross-origin-resource-policy'), 'cross-origin')
      assert.equal(response.headers.get('access-control-allow-origin'), '*')
      assert.equal(response.headers.get('content-encoding'), null)
      assert.match(response.headers.get('cache-control'), /max-age=31536000, immutable/)
      const bytes = Buffer.from(await response.arrayBuffer())
      assert.ok(bytes.length < 300_000, `${meta.image} should remain crawler-friendly`)
      assert.equal(Number(response.headers.get('content-length')), bytes.length)
      const image = sharp(bytes)
      const metadata = await image.metadata()
      const stats = await image.stats()
      assert.equal(metadata.format, 'jpeg')
      assert.equal(metadata.width, 1200)
      assert.equal(metadata.height, 630)
      assert.equal(metadata.space, 'srgb')
      assert.equal(metadata.channels, 3)
      assert.equal(stats.isOpaque, true)
      hashes.add(createHash('sha256').update(bytes).digest('hex'))

      const head = await fetch(`${origin}${meta.image}`, { method: 'HEAD' })
      assert.equal(head.status, 200)
      assert.equal(Number(head.headers.get('content-length')), bytes.length)
      assert.equal(await head.text(), '')
    }
    assert.equal(hashes.size, Object.keys(routes).length, 'social cards must be page-specific')
  } finally {
    await new Promise(resolve => server.close(resolve))
  }
})

test('major link-preview crawlers can fetch every page and its declared card', async () => {
  const crawlers = [
    'Slackbot-LinkExpanding 1.0 (+https://api.slack.com/robots)',
    'Twitterbot/1.0',
    'facebookexternalhit/1.1',
    'LinkedInBot/1.0',
    'Discordbot/2.0'
  ]
  const server = createServer(createHandler())
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const origin = `http://127.0.0.1:${server.address().port}`
  try {
    for (const crawler of crawlers) {
      for (const [path, meta] of Object.entries(routes)) {
        const page = await fetch(`${origin}${path}`, { headers: { 'user-agent': crawler } })
        assert.equal(page.status, 200, `${crawler} ${path}`)
        assert.match(await page.text(), new RegExp(`content="https://metanet\\.fyi${meta.image.replaceAll('.', '\\.')}"`))
        const image = await fetch(`${origin}${meta.image}`, { headers: { 'user-agent': crawler } })
        assert.equal(image.status, 200, `${crawler} ${meta.image}`)
        assert.equal(image.headers.get('content-type'), 'image/jpeg')
      }
    }
  } finally {
    await new Promise(resolve => server.close(resolve))
  }
})
