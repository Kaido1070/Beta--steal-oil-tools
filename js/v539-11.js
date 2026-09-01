(() => {
  if (window.__STOT_PRESET_TERMINOLOGY__) return;
  window.__STOT_PRESET_TERMINOLOGY__ = true;

  const replacements = [
    [/\bLayouts\b/g, "Presets"],
    [/\bLayout\b/g, "Preset"],
    [/\blayouts\b/g, "presets"],
    [/\blayout\b/g, "preset"]
  ];

  const replaceText = value => {
    let next = String(value ?? "");
    for (const [pattern, replacement] of replacements) next = next.replace(pattern, replacement);
    return next;
  };

  const updateElement = el => {
    if (!(el instanceof Element)) return;
    for (const attr of ["title", "aria-label", "placeholder", "value"]) {
      if (!el.hasAttribute(attr)) continue;
      const current = el.getAttribute(attr) || "";
      const next = replaceText(current);
      if (next !== current) el.setAttribute(attr, next);
    }
  };

  const updateTree = root => {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) {
      const next = replaceText(root.nodeValue || "");
      if (next !== root.nodeValue) root.nodeValue = next;
      return;
    }
    if (root.nodeType === Node.ELEMENT_NODE) updateElement(root);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeType === Node.TEXT_NODE) {
        const next = replaceText(node.nodeValue || "");
        if (next !== node.nodeValue) node.nodeValue = next;
      } else updateElement(node);
    }
  };

  let queued = false;
  const apply = () => updateTree(document.body);
  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      apply();
    });
  };

  // Run after the consolidated UI has been built and after the few delayed
  // compatibility passes. User interactions schedule another lightweight pass;
  // no permanent whole-document MutationObserver is needed anymore.
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", apply, {once:true});
  else apply();
  [0, 80, 220, 520].forEach(ms => setTimeout(apply, ms));
  document.addEventListener("click", schedule, true);
  document.addEventListener("change", schedule, true);
  document.addEventListener("input", schedule, true);
})();
