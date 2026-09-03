# Stage 3 — Compare runtime ownership

Stage 3 consolidates Compare Presets layout ownership under `js/pages/compare-preset-sticky.js` (`STOT_COMPARE_PRESETS_CONTROLLER`).

Runtime notes:

- `index.html` executes `js/beta-patches.bundle.js`; standalone `js/v539-*.js` files are source inputs for that bundle.
- Legacy Compare ordering in `v539-08` and `v539-10` delegates to the Stage 3 controller once it is available.
- Oil behavior in `v539-10` remains independent and preserved.
- Compare and Oil must keep separate Visual Plot Builder DOM nodes.
- `#v601CompareSticky` remains a direct child of `document.body` and fixed to the visual viewport bottom.
- Stage 3 is not considered complete until the full regression workflow passes on the synchronized runtime bundle.
