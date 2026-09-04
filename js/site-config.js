/* STEAL THE OIL TYCOON — central site settings */
window.STOT_CONFIG=Object.freeze({
  version:"5.77",
  sourceCommit:"aec48cd084062e3791d523b72cb65618948508c7",
  lastUpdated:"Sep 2 2026",
  storageNamespace:"stot",
  storageSchema:1,
  defaultLanguage:"en",
  pageBadges:Object.freeze({
    sale:"Sale Calculator",
    oil:"Oil Layout",
    drills:"Drill Calculator",
    compare:"Drill Compare",
    layoutcompare:"Layout Compare",
    database:"Game Database",
    events:"Events",
    codes:"Codes"
  }),
  storageKey(scope,suffix="v1"){return `${this.storageNamespace}-v${this.version}-${scope}-${suffix}`;}
});

/* Compare Presets UI skin: visual parity with Oil / Hour without sharing DOM/state. */
(()=>{
  const href='css/pages/compare-oil-match.css';
  if(document.querySelector('link[data-stot-compare-oil-ui]'))return;
  const link=document.createElement('link');
  link.rel='stylesheet';
  link.href=href;
  link.dataset.stotCompareOilUi='1';
  document.head.appendChild(link);
})();

/* Compare Presets feature parity: copied/adapted behavior with isolated A/B state. */
(()=>{
  const css='css/pages/compare-feature-parity.css';
  if(!document.querySelector('link[data-stot-compare-feature-parity]')){
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href=css;
    link.dataset.stotCompareFeatureParity='1';
    document.head.appendChild(link);
  }
  const src='js/pages/compare-feature-parity.js';
  if(document.querySelector('script[data-stot-compare-feature-parity]'))return;
  const script=document.createElement('script');
  script.src=src;
  script.dataset.stotCompareFeatureParity='1';
  document.head.appendChild(script);
})();

/* Known-good Compare responsive guard. Loaded last and scoped to Compare only. */
(()=>{
  const href='css/pages/compare-known-good-ui.css';
  if(document.querySelector('link[data-stot-compare-known-good-ui]'))return;
  const link=document.createElement('link');
  link.rel='stylesheet';
  link.href=href;
  link.dataset.stotCompareKnownGoodUi='1';
  document.head.appendChild(link);
})();

/* Compare Presets A/B selector position: place it where the redundant editor-status panel used to be. */
(()=>{
  const src='js/pages/compare-preset-switch-position.js';
  if(document.querySelector('script[data-stot-compare-preset-switch-position]'))return;
  const script=document.createElement('script');
  script.src=src;
  script.dataset.stotComparePresetSwitchPosition='1';
  document.head.appendChild(script);
})();
