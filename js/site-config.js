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
