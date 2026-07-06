import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('renders builder positioning language', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1 })).toContainText('Working AI');
    await expect(page.getByText('In your business')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'AI Jumpstart' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Custom AI Build' })).toBeVisible();
    await expect(page.getByText('Why Arturo')).toBeVisible();
  });
});
