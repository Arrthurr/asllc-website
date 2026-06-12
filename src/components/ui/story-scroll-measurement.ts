export const panelContentExceedsViewport = (panel: HTMLDivElement | undefined) => {
  if (!panel) return false;
  const section = panel.querySelector('section');
  if (!section) return false;
  return section.scrollHeight > document.documentElement.clientHeight;
};

export const anyPanelExceedsViewport = (panels: HTMLDivElement[]) =>
  panels.some(panelContentExceedsViewport);
