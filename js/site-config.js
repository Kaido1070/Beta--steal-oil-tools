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

/* Stage 4 strangler cutover: the authoritative Oil controller/Quick Fill now
   replace every targeted Oil-only runtime patch, including the old v536 shell bootstrap. */
window.__STOT_STAGE4_RETIRED_OIL_PATCHES__=Object.freeze([
  'beta-oil-order',
  'beta-first-visit',
  'v539-10-oil-compat',
  'oil-advanced-inline-v594',
  'v537-quick-fill',
  'v536-build-ux'
]);
window.__STOT_BETA_OIL_ORDER__=true;
window.__STOT_BETA_FIRST_VISIT__=true;
window.__STOT_V539_UI__=true;
window.__STOT_ADVANCED_INLINE_V594__=true;
window.__STOT_V537_QUICK_FILL__=true;
window.__STOT_V536_BUILD_UX__=true;

/* Stage 5 pure layout geometry core. Consumers below use async=false so this
   shared data-only module executes first without sharing page DOM/state. */
(()=>{
  if(window.STOT_LAYOUT_GEOMETRY||document.querySelector('script[data-stot-layout-geometry]'))return;
  const script=document.createElement('script');script.src='js/core/layout-geometry.js';script.async=false;script.dataset.stotLayoutGeometry='stage5';document.head.appendChild(script);
})();

/* Stage 5 pure row/template core. It depends only on layout geometry and owns
   normalization, row-to-piece conversion and reserve-fit search as data helpers. */
(()=>{
  if(window.STOT_LAYOUT_ROWS||document.querySelector('script[data-stot-layout-rows]'))return;
  const script=document.createElement('script');script.src='js/core/layout-rows.js';script.async=false;script.dataset.stotLayoutRows='stage5';document.head.appendChild(script);
})();

/* Stage 5 pure production-loss core. Oil and Compare still obtain their own
   state/DOM values; only behavior-identical row-rate arithmetic is shared. */
(()=>{
  if(window.STOT_LAYOUT_PRODUCTION||document.querySelector('script[data-stot-layout-production]'))return;
  const script=document.createElement('script');script.src='js/core/layout-production.js';script.async=false;script.dataset.stotLayoutProduction='stage5';document.head.appendChild(script);
})();

/* Compare Presets UI skin: visual parity with Oil / Hour without sharing DOM/state. */
(()=>{
  const href='css/pages/compare-oil-match.css';
  if(document.querySelector('link[data-stot-compare-oil-ui]'))return;
  const link=document.createElement('link');link.rel='stylesheet';link.href=href;link.dataset.stotCompareOilUi='1';document.head.appendChild(link);
})();

/* Compare Presets feature parity: copied/adapted behavior with isolated A/B state. */
(()=>{
  const css='css/pages/compare-feature-parity.css';
  if(!document.querySelector('link[data-stot-compare-feature-parity]')){
    const link=document.createElement('link');link.rel='stylesheet';link.href=css;link.dataset.stotCompareFeatureParity='1';document.head.appendChild(link);
  }
  const src='js/pages/compare-feature-parity.js';
  if(document.querySelector('script[data-stot-compare-feature-parity]'))return;
  const script=document.createElement('script');script.src=src;script.async=false;script.dataset.stotCompareFeatureParity='1';document.head.appendChild(script);
})();

/* Known-good Compare responsive guard. */
(()=>{
  const href='css/pages/compare-known-good-ui.css';
  if(document.querySelector('link[data-stot-compare-known-good-ui]'))return;
  const link=document.createElement('link');link.rel='stylesheet';link.href=href;link.dataset.stotCompareKnownGoodUi='1';document.head.appendChild(link);
})();

/* Compare Presets A/B selector position. */
(()=>{
  const src='js/pages/compare-preset-switch-position.js';
  if(document.querySelector('script[data-stot-compare-preset-switch-position]'))return;
  const script=document.createElement('script');script.src=src;script.dataset.stotComparePresetSwitchPosition='1';document.head.appendChild(script);
})();

/* Compare Presets boost images. */
(()=>{
  const href='css/pages/compare-boost-icons.css';
  if(!document.querySelector('link[data-stot-compare-boost-icons]')){
    const link=document.createElement('link');link.rel='stylesheet';link.href=href;link.dataset.stotCompareBoostIcons='1';document.head.appendChild(link);
  }
  const src='js/pages/compare-boost-icons.js';
  if(document.querySelector('script[data-stot-compare-boost-icons]'))return;
  const script=document.createElement('script');script.src=src;script.dataset.stotCompareBoostIcons='1';document.head.appendChild(script);
})();

/* Stage 4 Oil controller-owned CSS. */
(()=>{
  const href='css/pages/oil-stage4-controller.css';
  if(document.querySelector('link[data-stot-oil-stage4-ui]'))return;
  const link=document.createElement('link');link.rel='stylesheet';link.href=href;link.dataset.stotOilStage4Ui='1';document.head.appendChild(link);
})();

/* Stage 4 Oil / Hour authoritative shell/order + Advanced owner. */
(()=>{
  const src='js/pages/oil-page-controller.js';
  if(document.querySelector('script[data-stot-oil-page-controller]'))return;
  const script=document.createElement('script');script.src=src;script.dataset.stotOilPageController='stage4';document.head.appendChild(script);
})();

/* Stage 4 Oil / Hour authoritative Quick Fill owner, now consuming Stage 5 pure cores. */
(()=>{
  const src='js/pages/oil-quick-fill-stage4.js';
  if(document.querySelector('script[data-stot-oil-quick-fill-stage4]'))return;
  const script=document.createElement('script');script.src=src;script.async=false;script.dataset.stotOilQuickFillStage4='1';document.head.appendChild(script);
})();