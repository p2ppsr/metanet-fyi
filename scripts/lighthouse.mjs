import { createServer } from 'node:http'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'
import { launch } from 'chrome-launcher'
import lighthouse from 'lighthouse'
import { createHandler } from '../src/app.mjs'

const root = fileURLToPath(new URL('..', import.meta.url))
const artifactDirectory = join(root, 'artifacts', 'lighthouse')
const server = createServer(createHandler())
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
const port = server.address().port
const chrome = await launch({ chromePath: chromium.executablePath(), chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'] })
const thresholds = { performance: 0.95, accessibility: 1, 'best-practices': 1, seo: 1 }
const results = {}

try {
  await mkdir(artifactDirectory, { recursive: true })
  for (const [name, path] of [['home', '/'], ['overlays', '/overlays'], ['recovery', '/overlays/recovery'], ['resources', '/resources']]) {
    const run = await lighthouse(`http://127.0.0.1:${port}${path}`, {
      port: chrome.port,
      output: 'json',
      logLevel: 'error',
      onlyCategories: Object.keys(thresholds),
      formFactor: 'mobile',
      screenEmulation: { mobile: true, width: 390, height: 844, deviceScaleFactor: 2, disabled: false }
    })
    const report = run.lhr
    const scores = Object.fromEntries(Object.keys(thresholds).map(category => [category, report.categories[category].score]))
    results[name] = scores
    await writeFile(join(artifactDirectory, `${name}.json`), JSON.stringify(report, null, 2))
    for (const [category, minimum] of Object.entries(thresholds)) {
      if (scores[category] < minimum) throw new Error(`${name} ${category} score ${scores[category]} is below ${minimum}`)
    }
  }
  await writeFile(join(artifactDirectory, 'summary.json'), JSON.stringify({ generatedAt: new Date().toISOString(), thresholds, results }, null, 2))
  console.log(JSON.stringify(results, null, 2))
} finally {
  await chrome.kill()
  await new Promise(resolve => server.close(resolve))
}
