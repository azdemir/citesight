import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:3002',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: [
    {
      command: 'PORT=3002 npm run dev',
      url: 'http://localhost:3002',
      reuseExistingServer: true,
      timeout: 120000,
    },
    {
      command: 'python3 edge/server.py',
      url: 'http://localhost:8000/health',
      reuseExistingServer: true,
      timeout: 60000,
    },
  ],
});
