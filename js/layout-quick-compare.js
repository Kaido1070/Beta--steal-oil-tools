(() => {
  const styles = ["css/v539-01.css", "css/v539-02.css", "css/v539-03.css"];
  for (const href of styles) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }

  const scripts = [
    ...Array.from({length: 10}, (_, i) => `js/v539-${String(i + 1).padStart(2, "0")}.js`),
    "js/v539-11.js"
  ];
  let index = 0;
  const loadNext = () => {
    if (index >= scripts.length) {
      document.documentElement.dataset.stotBetaReady = "5.39";
      console.info("STOT Beta v5.39 loaded");
      return;
    }
    const script = document.createElement("script");
    script.src = scripts[index++];
    script.onload = loadNext;
    script.onerror = () => console.error("Failed to load STOT beta update:", script.src);
    document.body.appendChild(script);
  };
  loadNext();
})();
