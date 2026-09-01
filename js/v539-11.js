(() => {
  const replacements = [
    [/\bLayouts\b/g, "Presets"],
    [/\bLayout\b/g, "Preset"],
    [/\blayouts\b/g, "presets"],
    [/\blayout\b/g, "preset"]
  ];

  const replaceText = (value) => {
    let next = value;
    for (const [pattern, replacement] of replacements) next = next.replace(pattern, replacement);
    return next;
  };

  const updateElement = (el) => {
    if (!(el instanceof Element)) return;
    for (const attr of ["title", "aria-label", "placeholder", "value"]) {
      if (!el.hasAttribute(attr)) continue;
      const current = el.getAttribute(attr);
      const next = replaceText(current);
      if (next !== current) el.setAttribute(attr, next);
    }
  };

  const updateTree = (root) => {
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
      } else {
        updateElement(node);
      }
    }
  };

  const apply = () => updateTree(document.body);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", apply, { once: true });
  else apply();

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "characterData") updateTree(mutation.target);
      for (const node of mutation.addedNodes) updateTree(node);
    }
  });
  observer.observe(document.documentElement, { subtree: true, childList: true, characterData: true });
})();
