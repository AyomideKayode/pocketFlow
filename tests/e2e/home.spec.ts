import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/PocketFlow/);
});

test('redirects to auth if not logged in', async ({ page }) => {
  await page.goto('/');
  // Should redirect to /auth
  await expect(page).toHaveURL(/.*\/auth/);
  // Check for the "Sign In" text on the button or header
  await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
});
