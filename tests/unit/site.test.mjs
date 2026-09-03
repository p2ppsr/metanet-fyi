import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import test from 'node:test'
import { createHandler } from '../../src/app.mjs'
import { routes } from '../../src/data.mjs'
import { renderPage } from '../../src/pages.mjs'

test('every public route renders complete, page-specific metadata', () => {
  for (const [path, meta] of Object.entries(routes)) {
    const html = renderPage(path, 'test-nonce')
    assert.match(html, /^<!doctype html>/)
    assert.ok(html.includes(`<title>${meta.title}</title>`))
    assert.ok(html.includes(`content="https://metanet.fyi${meta.image}"`))
    assert.ok(html.includes(`rel="canonical" href="https://metanet.fyi${path === '/' ? '' : path}"`))
    assert.ok(html.includes('application/ld+json'))
    assert.ok(html.includes('id="content"'))
  }
})

test('HTTP surface serves health, discovery files, assets, and compression', async () => {
  const server = createServer(createHandler())
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const origin = `http://127.0.0.1:${server.address().port}`
  try {
    const health = await fetch(`${origin}/healthz`)
    assert.equal(health.status, 200)
    assert.equal((await health.json()).service, 'metanet-fyi')
    for (const path of ['/robots.txt', '/sitemap.xml', '/llms.txt', '/resources.json', '/styles.css']) {
      const response = await fetch(`${origin}${path}`)
      assert.equal(response.status, 200, path)
      assert.equal(response.headers.get('x-content-type-options'), 'nosniff')
    }
    const compressed = await fetch(`${origin}/overlays`, { headers: { 'accept-encoding': 'br' } })
    assert.equal(compressed.headers.get('content-encoding'), 'br')
    assert.match(await compressed.text(), /The chain proves it/)
    assert.equal((await fetch(`${origin}/missing`)).status, 404)
  } finally {
    await new Promise(resolve => server.close(resolve))
  }
})
