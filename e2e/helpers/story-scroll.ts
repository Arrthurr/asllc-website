import type { Page } from '@playwright/test';

export async function waitForStoryMeasurement(page: Page) {
  await page.evaluate(async () => {
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }
  });

  await page.waitForFunction(
    () => {
      const root = document.querySelector('.story-scroll');
      if (!root) return false;

      const mode = root.getAttribute('data-story-mode');
      if (mode === 'pinned') return true;

      return mode === 'stacked' && root.hasAttribute('data-story-stack-reason');
    },
    undefined,
    { timeout: 15_000 }
  );
}
