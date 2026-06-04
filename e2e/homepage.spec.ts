import { expect, test } from '@playwright/test';

test.describe('Homepage', () => {
  test('story promise and contact form are reachable', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /working ai/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /tell me where the work gets stuck/i })).toBeVisible();

    const contact = page.locator('#contact form[name="contact"]');
    await expect(contact).toHaveAttribute('action', '/success');
    await expect(contact.getByRole('button', { name: /send the bottleneck/i })).toBeVisible();

    await page.locator('#contact').scrollIntoViewIfNeeded();
    await expect(page.locator('#contact')).toBeInViewport();
  });

  test('reduced-motion visitors get a stacked story surface', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    await expect(page.locator('[data-story-mode="stacked"]')).toBeVisible();
    await expect(page.getByRole('heading', { name: /scope small/i })).toBeVisible();
  });
});