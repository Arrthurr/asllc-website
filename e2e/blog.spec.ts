import { test, expect } from '@playwright/test';

test.describe('Blog', () => {
  test('returns 200 with empty-state copy when no posts', async ({ page }) => {
    const response = await page.goto('/blog');
    expect(response?.status()).toBe(200);
    await expect(page.getByText('Posts coming soon')).toBeVisible();
  });
});
