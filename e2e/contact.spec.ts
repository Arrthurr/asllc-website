import { test, expect } from '@playwright/test';

test.describe('Contact page', () => {
  test('renders warm contact copy and form fields', async ({ page }) => {
    await page.goto('/contact');

    await expect(page.getByRole('heading', { level: 1 })).toContainText('stuck');
    await expect(page.getByLabel('Full Name*')).toBeVisible();
    await expect(page.getByLabel('Email Address*')).toBeVisible();
    await expect(page.getByLabel('Company Name*')).toBeVisible();
    await expect(page.getByLabel(/What are you interested in/)).toBeVisible();
    await expect(page.getByRole('button', { name: /Send the bottleneck/i })).toBeVisible();
  });

  test('shows validation errors for empty required fields', async ({ page }) => {
    await page.goto('/contact');
    await page.getByRole('button', { name: /Send the bottleneck/i }).click();
    await expect(page.getByRole('alert').first()).toBeVisible();
  });
});
