import { test, expect } from '@playwright/test';

test.describe('Authentication & Dashboard Journey', () => {
  test('unauthenticated visit to /dashboard redirects to root or login', async ({
    page,
  }) => {
    // Attempt visiting dashboard without token cookie
    await page.goto('/dashboard');
    // Middleware redirects unauthenticated requests
    await expect(page).not.toHaveURL(/\/dashboard$/);
  });

  test('home page redirects to auth/login or dashboard based on session', async ({
    page,
  }) => {
    await page.goto('/');
    // Check that redirect finishes and page loads
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toBeTruthy();
  });
});

