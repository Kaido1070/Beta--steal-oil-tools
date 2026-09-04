# Stage 5 — Core & Components Consolidation

Status: **in progress**

## Goal
Reduce duplicated calculation/helper logic under Oil / Hour and Compare Presets while keeping each page's mutable DOM and state completely isolated.

## Non-negotiable boundaries
- Oil keeps sole ownership of `layoutPlots` and its Oil DOM.
- Compare keeps sole ownership of `compareStates.A/B` and its Compare DOM.
- No Visual Builder DOM, Sticky DOM, Quick Fill DOM, or Advanced Tools DOM is shared between pages.
- Shared code must be pure/data-only or an isolated component factory that creates a separate instance per page.
- Storage keys/schema remain compatible unless an explicit migration is introduced and tested.
- Existing calculations and user-visible behavior must remain unchanged.

## Initial duplication audit
The safest first extraction is layout geometry used by both Oil Quick Fill and Compare Quick Fill:
- footprint parsing
- 5x5 piece area
- 5x5 geometric packing with rotation

Both pages currently carry their own copies of that logic. Stage 5 moves it to `js/core/layout-geometry.js` and makes both pages consume the same pure API.

## Planned sequence
1. Extract shared pure layout geometry and migrate Oil + Compare Quick Fill to it.
2. Lock the new core contract with Stage 5 regression coverage.
3. Audit and consolidate row cloning/normalization where semantics are truly identical.
4. Audit formatting/calculation helpers and extract only behavior-identical pure functions.
5. Introduce component factories only where each page receives an independent instance.
6. Remove duplicated page-local helpers after parity tests prove the cutover.
7. Full Chromium + Mobile Chromium + Mobile WebKit regression before release.

## Slice 1
Create `STOT_LAYOUT_GEOMETRY` as a frozen, DOM-free, state-free core API and migrate the two Quick Fill implementations to it. Existing Stage 3/4 ownership tests remain release gates.
