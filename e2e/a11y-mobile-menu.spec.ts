import { test, expect } from '@playwright/test';

test.describe('Mobile menu accessibility', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('toggle exposes aria-expanded and aria-controls', async ({ page }) => {
    await page.goto('/');

    const toggle = page.getByRole('button', { name: 'Open menu' });
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toHaveAttribute('aria-controls', 'mobile-nav-menu');

    await toggle.click();
    const toggleOpen = page.getByRole('button', { name: 'Close menu' });
    await expect(toggleOpen).toHaveAttribute('aria-expanded', 'true');

    const mobileNav = page.getByRole('navigation', { name: 'Mobile navigation' });
    await expect(mobileNav).toBeVisible();
    await expect(mobileNav.getByRole('link', { name: 'Contact' })).toBeVisible();
  });

  test('keyboard user can open menu and activate a link', async ({ page }) => {
    await page.goto('/');
    const toggle = page.getByRole('button', { name: 'Open menu' });
    await toggle.focus();
    await page.keyboard.press('Enter');
    const toggleOpen = page.getByRole('button', { name: 'Close menu' });
    await expect(toggleOpen).toHaveAttribute('aria-expanded', 'true');

    const contactLink = page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Contact' });
    await contactLink.click();
    await expect(page).toHaveURL('/contact');
  });
});
