/**
 * Playwright E2E smoke: visitor can open the landing page.
 * Run: pnpm --filter web test:e2e
*/
import { test, expect } from '@playwright/test';

test('landing page renders', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.status()).toBeLessThan(400);
});
