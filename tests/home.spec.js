import { test, expect } from '@playwright/test';

test('homepage has correct title', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page).toHaveTitle(/Note File - By Machine Name/);
//   await expect(page.locator('a[href="/about"]')).toHaveText('About');
});
