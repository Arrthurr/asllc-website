import { expect, test } from '@playwright/test';
import { waitForStoryMeasurement } from './helpers/story-scroll';

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

  test('mobile visitors get stacked static story without kinetic scrub', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    await expect(page.locator('[data-story-mode="stacked"]')).toBeVisible();
    await expect(page.locator('[data-story-stack-reason="mobile"]')).toBeVisible();
    await expect(page.locator('[data-story-kinetic="stacked-scrub"]')).toHaveCount(0);
    await expect(page.getByRole('heading', { name: /working ai/i })).toBeVisible();
  });

  test('reduced-motion visitors get a stacked story surface', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    await expect(page.locator('[data-story-mode="stacked"]')).toBeVisible();
    await expect(page.locator('[data-story-kinetic="stacked-scrub"]')).toHaveCount(0);
    await expect(page.getByRole('heading', { name: /scope small/i })).toBeVisible();
  });

  test('desktop viewports with tall panels fall back to stacked story mode', async ({ page }) => {
    await page.setViewportSize({ width: 1512, height: 856 });
    await page.goto('/');

    await expect(page.locator('[data-story-mode="stacked"]')).toBeVisible();
    await expect(page.locator('[data-story-stack-reason="overflow"]')).toBeVisible();
    await expect(page.locator('[data-story-kinetic="stacked-scrub"]')).toBeVisible();

    await page.getByRole('heading', { name: /products, workflows, operations/i }).scrollIntoViewIfNeeded();
    await expect(page.getByAltText('HG Jones Associates')).toBeVisible();

    await page.getByRole('link', { name: /start the conversation/i }).scrollIntoViewIfNeeded();
    await expect(page.getByRole('link', { name: /start the conversation/i })).toBeVisible();

    await page.locator('#contact').scrollIntoViewIfNeeded();
    await expect(page.locator('#contact')).toBeInViewport();
    await expect(page.locator('#contact form[name="contact"]')).toBeVisible();
  });

  test('desktop overflow stacked story animates panels during scroll', async ({ page }) => {
    await page.setViewportSize({ width: 1512, height: 856 });
    await page.goto('/');

    await expect(page.locator('[data-story-kinetic="stacked-scrub"]')).toBeVisible();

    const panel1 = page.locator('[data-story-panel="1"]');
    const panel1Style = await panel1.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        opacity: Number.parseFloat(style.opacity),
        translateY: new DOMMatrix(style.transform).m42,
      };
    });
    expect(panel1Style.opacity).toBeGreaterThan(0.95);
    expect(Math.abs(panel1Style.translateY)).toBeLessThan(5);

    const panel2 = page.locator('[data-story-panel="2"]');

    const readPanelMotion = () =>
      panel2.evaluate((el) => {
        const style = window.getComputedStyle(el);
        const opacity = Number.parseFloat(style.opacity);
        const matrix = new DOMMatrix(style.transform);
        return { opacity, translateY: matrix.m42 };
      });

    const scrollInstant = (scrollY: number) =>
      page.evaluate((y) => {
        window.scrollTo({ top: y, behavior: 'instant' });
      }, scrollY);

    const settleFrames = () =>
      page.evaluate(
        () =>
          new Promise<void>((resolve) => {
            requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
          })
      );

    const scrollPositions = await page.evaluate(() => {
      const panel = document.querySelector('[data-story-panel="2"]') as HTMLElement | null;
      if (!panel) {
        throw new Error('Story panel 2 not found');
      }

      const panelTop = panel.getBoundingClientRect().top + window.scrollY;
      const viewportHeight = window.innerHeight;

      return {
        beforeEnter: Math.max(0, panelTop - viewportHeight * 0.95),
        midEnter: Math.max(0, panelTop - viewportHeight * 0.55),
      };
    });

    await scrollInstant(scrollPositions.beforeEnter);
    await settleFrames();
    const beforeEnter = await readPanelMotion();

    await scrollInstant(scrollPositions.midEnter);
    await settleFrames();
    const midEnter = await readPanelMotion();

    expect(midEnter.opacity).toBeGreaterThan(beforeEnter.opacity);
    expect(Math.abs(midEnter.translateY)).toBeLessThan(Math.abs(beforeEnter.translateY));
  });

  test('tall desktop viewports use pinned story mode without stacked scrub', async ({ page }) => {
    // 1600px height gives headroom for Linux CI font metrics after Inter loads.
    await page.setViewportSize({ width: 1512, height: 1600 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await waitForStoryMeasurement(page);

    await expect(page.locator('[data-story-mode="pinned"]')).toBeVisible();
    await expect(page.locator('[data-story-kinetic="stacked-scrub"]')).toHaveCount(0);
  });

  test('contact section retains CSS entrance after scrolling through the story', async ({ page }) => {
    await page.setViewportSize({ width: 1512, height: 856 });
    await page.goto('/');

    await page.locator('#contact').scrollIntoViewIfNeeded();
    await expect(page.locator('#contact .animate-in').first()).toBeVisible();
    await expect(page.locator('#contact form[name="contact"]')).toBeVisible();
  });
});
