/* STEAL THE OIL TYCOON — internal release changelog */
/* Newest release must stay first. Dates are null where an exact historical release date was not recorded here. */
window.STOT_CHANGELOG=Object.freeze([
  Object.freeze({version:"5.75",date:"Sep 2 2026",changes:Object.freeze([
    "Added a compact sticky Current Production card to Oil / Hour",
    "Sticky Oil/s stays visible while building and jumps to the full result details when tapped"
  ])}),
  Object.freeze({version:"5.74",date:"Sep 2 2026",changes:Object.freeze([
    "Refined the visual 5×5 map to blend with the dark site theme",
    "Area colors now emphasize borders, titles and multipliers instead of filling every empty cell",
    "Kept all Forest, Desert, Volcano and Mountain color identities"
  ])}),
  Object.freeze({version:"5.73",date:"Sep 2 2026",changes:Object.freeze([
    "Corrected the visual map order to match the in-game plot layout",
    "Plot 11 is Volcano Core ×5, Plot 12 is Volcano Sides ×3, and Plot 14 is Mountain Summit ×10"
  ])}),
  Object.freeze({version:"5.72",date:"Sep 2 2026",changes:Object.freeze([
    "Added a visual 2D 5×5 plot builder for all 15 Oil plots",
    "Plot colors now match Forest, Desert, Volcano and Mountain areas",
    "Tapping a plot opens a compact editor and placed drills are drawn with their footprint and name"
  ])}),
  Object.freeze({version:"5.71",date:"Sep 2 2026",changes:Object.freeze([
    "Added a centralized release changelog",
    "Added build and browser checks that require the changelog version and date to match STOT_CONFIG",
    "Kept the website UI and calculator behavior unchanged"
  ])}),
  Object.freeze({version:"5.70",date:"Sep 2 2026",changes:Object.freeze([
    "Centralized the visible Last updated footer date",
    "Footer now reads its release date from STOT_CONFIG"
  ])}),
  Object.freeze({version:"5.69",date:null,changes:Object.freeze([
    "Centralized runtime site settings, version, page badges, language default, and storage namespace"
  ])}),
  Object.freeze({version:"5.68",date:null,changes:Object.freeze([
    "Separated the Oil / Hour runtime into js/pages/oil.js"
  ])}),
  Object.freeze({version:"5.67",date:null,changes:Object.freeze([
    "Separated the Sale Calculator runtime into js/pages/sale.js"
  ])}),
  Object.freeze({version:"5.66",date:null,changes:Object.freeze([
    "Separated the Drills runtime and picker into js/pages/drills.js"
  ])}),
  Object.freeze({version:"5.65",date:null,changes:Object.freeze([
    "Separated the Drill Compare base runtime into js/pages/compare.js"
  ])}),
  Object.freeze({version:"5.64",date:null,changes:Object.freeze([
    "Fixed Database pet atlas thumbnails being hidden by a CSS background shorthand"
  ])}),
  Object.freeze({version:"5.63",date:null,changes:Object.freeze([
    "Separated Codes into its own page runtime and stylesheet"
  ])}),
  Object.freeze({version:"5.62",date:null,changes:Object.freeze([
    "Separated Events into its own page runtime and stylesheet"
  ])}),
  Object.freeze({version:"5.61",date:null,changes:Object.freeze([
    "Scoped saved Preset state to the current build version"
  ])}),
  Object.freeze({version:"5.60",date:null,changes:Object.freeze([
    "Separated Database into page-owned runtime and styles"
  ])}),
  Object.freeze({version:"5.59",date:null,changes:Object.freeze([
    "Separated mutable game and database values into js/game-data.js"
  ])}),
  Object.freeze({version:"5.58",date:null,changes:Object.freeze([
    "Removed the remote public runtime bootstrap and switched Beta to a local consolidated runtime"
  ])})
]);
