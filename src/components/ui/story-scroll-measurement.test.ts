import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  anyPanelExceedsViewport,
  panelContentExceedsViewport,
} from './story-scroll-measurement';

const createPanelWithSectionHeight = (height: number) => {
  const panel = document.createElement('div');
  const section = document.createElement('section');
  Object.defineProperty(section, 'scrollHeight', {
    configurable: true,
    value: height,
  });
  panel.appendChild(section);
  return panel;
};

describe('story-scroll measurement', () => {
  beforeEach(() => {
    Object.defineProperty(document.documentElement, 'clientHeight', {
      configurable: true,
      value: 800,
    });
  });

  afterEach(() => {
    document.documentElement.innerHTML = '';
  });

  it('returns false when the inner section is shorter than the viewport', () => {
    const panel = createPanelWithSectionHeight(799);
    expect(panelContentExceedsViewport(panel)).toBe(false);
  });

  it('returns false when the inner section exactly matches the viewport height', () => {
    const panel = createPanelWithSectionHeight(800);
    expect(panelContentExceedsViewport(panel)).toBe(false);
  });

  it('returns true when the inner section exceeds the viewport by one pixel', () => {
    const panel = createPanelWithSectionHeight(801);
    expect(panelContentExceedsViewport(panel)).toBe(true);
  });

  it('returns false when the panel has no inner section', () => {
    const panel = document.createElement('div');
    expect(panelContentExceedsViewport(panel)).toBe(false);
  });

  it('returns false for an undefined panel', () => {
    expect(panelContentExceedsViewport(undefined)).toBe(false);
  });

  it('returns true when any panel in the array exceeds the viewport', () => {
    const panels = [
      createPanelWithSectionHeight(700),
      createPanelWithSectionHeight(801),
      createPanelWithSectionHeight(750),
    ];
    expect(anyPanelExceedsViewport(panels)).toBe(true);
  });

  it('returns false when no panel exceeds the viewport', () => {
    const panels = [
      createPanelWithSectionHeight(700),
      createPanelWithSectionHeight(800),
      createPanelWithSectionHeight(750),
    ];
    expect(anyPanelExceedsViewport(panels)).toBe(false);
  });
});
