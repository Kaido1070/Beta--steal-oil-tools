/* STEAL THE OIL TYCOON — central site settings */
window.STOT_CONFIG=Object.freeze({
  version:"5.69",
  sourceCommit:"aec48cd084062e3791d523b72cb65618948508c7",
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
