import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  reporter: [['line']],
  use: {
    baseURL: 'http://127.0.0.1:4390',
    browserName: 'chromium',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  webServer: {
    command: 'PORT=4390 node src/server.mjs',
    url: 'http://127.0.0.1:4390/healthz',
    reuseExistingServer: false,
    timeout: 15_000
  }
})
