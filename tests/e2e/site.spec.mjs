import { test, expect } from '@playwright/test'
import { fileURLToPath } from 'node:url'

const axePath = fileURLToPath(import.meta.resolve('axe-core/axe.min.js'))
const routes = ['/', '/overlays', '/overlays/recovery', '/overlays/build', '/resources', '/about', '/privacy']

test.beforeEach(async ({ page }) => {
  await page.route('https://usercom.babbage.systems/**', route => route.fulfill({ status: 204 }))
  await page.addInitScript({ path: axePath })
})

for (const route of routes) {
  test(`${route} is accessible and has no horizontal overflow`, async ({ page }) => {
    await page.goto(route)
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /^https:\/\/metanet\.fyi/)
    const violations = await page.evaluate(async () => (await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } })).violations)
    expect(violations, JSON.stringify(violations, null, 2)).toEqual([])
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(overflow).toBeLessThanOrEqual(1)
  })
}

test('recovery checklist updates, persists, and resets', async ({ page }) => {
  await page.goto('/overlays/recovery')
  await expect(page.locator('#recovery-score')).toHaveText('0')
  await page.locator('[data-recovery-check]').first().check()
  await expect(page.locator('#recovery-score')).toHaveText('1')
  await page.reload()
  await expect(page.locator('#recovery-score')).toHaveText('1')
  await page.locator('#reset-checks').click()
  await expect(page.locator('#recovery-score')).toHaveText('0')
})

test('mobile navigation reaches the flagship guide', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.locator('.feature-card').click()
  await expect(page).toHaveURL(/\/overlays$/)
  await expect(page.locator('h1')).toContainText('The chain proves it')
})

test('mobile 30-second model exposes a working role route', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/overlays')
  await page.getByRole('link', { name: 'Get the 30-second model' }).click()
  await expect(page.locator('#quick-model')).toBeInViewport()
  const publisherRoute = page.getByRole('link', { name: /Publisher: test survival/ })
  await expect(publisherRoute).toBeVisible()
  await publisherRoute.click()
  await expect(page).toHaveURL(/\/overlays\/recovery$/)
  await expect(page.getByRole('link', { name: /Start the seven checks/ })).toBeVisible()
})
