# Stage 4 — Oil / Hour Consolidation

Status: **implementation complete — PR regression passed; release pending**

## Goal
Make Oil / Hour have one authoritative page controller without changing user-visible behavior, calculations, storage schema, or Compare Presets ownership.

## Non-negotiable boundaries
- Oil continues to own `layoutPlots` and `#layoutVisualBuilder`.
- Compare continues to own `compareStates.A/B` and `#layoutVisualBuilderCompare`.
- No mutable DOM or mutable page state is shared between Oil and Compare.
- Storage keys/schema remain compatible.
- Existing Oil calculations, dynamic drills, refinery reserve, and 5×5 packing behavior remain unchanged.

## Final responsibility map
- `STOT_OIL_PAGE_CONTROLLER`: authoritative Oil shell, DOM order, calculator/boost presentation, Advanced Tools shell/behavior, plot duplicate action, and Oil-only presentation ownership.
- `STOT_OIL_QUICK_FILL`: authoritative Oil Quick Fill, multi-row template packing, refinery reservation, and Fill Empty Plots behavior.
- `js/pages/oil-visual-builder.js`: Oil-only Visual Plot Builder and production UI component.
- `js/pages/oil-grid-editor-v585.js`: manual Oil grid positioning.
- Existing core Oil runtime: calculations, `layoutPlots`, persistence compatibility, and shared pure helpers.
- Compare Presets remains isolated under its Stage 3 controller and independent A/B state.

## Retired Stage 4 Oil runtimes
The following legacy Oil-only ownership layers are blocked from running by Stage 4 guards:
- `beta-oil-order`
- `beta-first-visit`
- `v539-10-oil-compat`
- `oil-advanced-inline-v594`
- `v537-quick-fill`
- `v536-build-ux`

The final `v536-build-ux` dependency was removed by making Stage 4 create the Quick Fill and Advanced shells/buttons itself. Stage 4 no longer needs the old bootstrap to preserve `Paste Empty`, `Paste All`, or `Clear All`.

## Completed migration sequence
1. Established `STOT_OIL_PAGE_CONTROLLER` as the authoritative Oil shell/order owner.
2. Locked Oil behavior with dedicated Stage 4 regression coverage.
3. Moved Advanced Tools ownership into the controller.
4. Moved Quick Fill ownership into the Stage 4 component while preserving 5×5/refinery behavior.
5. Moved calculator/boost presentation ownership into the controller.
6. Retired all targeted Oil-only legacy ordering/polish/bootstrap runtimes.
7. Preserved Compare A/B isolation and Oil Visual Builder ownership.

## Regression
Final PR regression passed on Desktop Chromium, Mobile Chromium, and Mobile WebKit, including Stage 4 ownership checks, Compare isolation, Visual Builder ownership, deployment regression, Quick Fill, refinery reservation, and Advanced Tools behavior.

## Release gate
After merge, Stage 4 is complete only when main regression and GitHub Pages deployment both pass.
