import { test, expect } from '@playwright/test';

test.describe('Auth Page', () => {
  test('should display auth forms and new UX elements', async ({ page }) => {
    // Go to home (will redirect to /auth if not logged in, or we go directly to /auth)
    await page.goto('/auth');

    // Check Title
    await expect(page).toHaveTitle(/PocketFlow/);

    // Check for Email Input
    const emailInput = page.getByPlaceholder('name@example.com');
    await expect(emailInput).toBeVisible();

    // Check for Password Toggle (Eye icon)
    // We used aria-label 'Show password' in previous step
    const showPasswordBtn = page.getByLabel('Show password');
    await expect(showPasswordBtn).toBeVisible();

    // Check for Bug Icon in Navbar
    // We added title='Report Bug / Feedback'
    const bugIcon = page.locator('a[title="Report Bug / Feedback"]');
    await expect(bugIcon).toBeVisible();
    await expect(bugIcon).toHaveAttribute('href', /mailto:ayomidekay7@gmail.com/);
  });

  test('should toggle password visibility', async ({ page }) => {
    await page.goto('/auth');

    const passwordInput = page.getByPlaceholder('••••••••').first();
    const showBtn = page.getByLabel('Show password');

    // Initial state
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Click toggle
    await showBtn.click();

    // Check state change
    await expect(passwordInput).toHaveAttribute('type', 'text');
    await expect(page.getByLabel('Hide password')).toBeVisible();
  });
});
