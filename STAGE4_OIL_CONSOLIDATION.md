# Stage 4 — Oil / Hour Consolidation

Status: **in progress**

## Goal
Make Oil / Hour have one authoritative page controller without changing user-visible behavior, calculations, storage schema, or Compare Presets ownership.

## Non-negotiable boundaries
- Oil continues to own `layoutPlots` and `#layoutVisualBuilder`.
- Compare continues to own `compareStates.A/B` and `#layoutVisualBuilderCompare`.
- No mutable DOM or mutable page state is shared between Oil and Compare.
- Storage keys/schema remain compatible.
- Existing Oil calculations, dynamic drills, refinery reserve, and 5×5 packing behavior remain unchanged.

## Current responsibility map
- Core Oil calculations / layout rows: existing Oil runtime.
- Visual builder + Oil sticky production bar: `js/pages/oil-visual-builder.js`.
- Manual grid positioning: `js/pages/oil-grid-editor-v585.js`.
- Advanced Tools + Oil flow polish: `js/pages/oil-advanced-inline-v590.js`.
- Legacy ordering / compatibility: bundled legacy patches plus historical `js/beta-oil-order.js`.
- First-visit behavior: legacy first-visit runtime.

## Migration sequence
1. Establish `STOT_OIL_PAGE_CONTROLLER` as the authoritative Oil shell/order owner.
2. Lock current Oil behavior with Stage 4 regression coverage.
3. Move Advanced Tools ownership into the controller.
4. Move Quick Fill shell ownership into the controller while preserving calculation helpers.
5. Move calculator/boost shell ownership into the controller.
6. Retire superseded Oil-only legacy ordering/polish patches.
7. Run full Chromium + Mobile Chromium + Mobile WebKit regression, then merge only on green CI.

## Slice 1
The Stage 4 controller becomes the final authority for Oil-only DOM ordering, calculator presentation, and Advanced Tools presentation. Legacy code can still run during migration, but the controller reapplies the canonical Oil shell after legacy timers finish. It does not mutate Oil calculation state and never touches Compare DOM/state.
