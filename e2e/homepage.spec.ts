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

  test('desktop viewports with tall panels fall back to stacked story mode', async ({ page }) => {
    await page.setViewportSize({ width: 1512, height: 856 });
    await page.goto('/');

    await expect(page.locator('[data-story-mode="stacked"]')).toBeVisible();
    await expect(page.locator('[data-story-stack-reason="overflow"]')).toBeVisible();

    await page.getByRole('heading', { name: /products, workflows, operations/i }).scrollIntoViewIfNeeded();
    await expect(page.getByAltText('HG Jones Associates')).toBeVisible();

    await page.getByRole('link', { name: /start the conversation/i }).scrollIntoViewIfNeeded();
    await expect(page.getByRole('link', { name: /start the conversation/i })).toBeVisible();

    await page.locator('#contact').scrollIntoViewIfNeeded();
    await expect(page.locator('#contact')).toBeInViewport();
    await expect(page.locator('#contact form[name="contact"]')).toBeVisible();
  });
});
