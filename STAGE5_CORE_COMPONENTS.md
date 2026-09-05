# Stage 5 — Core & Components Consolidation

Status: **implementation complete — final regression pending**

## Goal
Reduce duplicated calculation/helper logic under Oil / Hour and Compare Presets while keeping each page's mutable DOM and state completely isolated.

## Non-negotiable boundaries
- Oil keeps sole ownership of `layoutPlots` and its Oil DOM.
- Compare keeps sole ownership of `compareStates.A/B` and its Compare DOM.
- No Visual Builder DOM, Sticky DOM, Quick Fill DOM, or Advanced Tools DOM is shared between pages.
- Shared code must be pure/data-only or an isolated component factory that creates a separate instance per page.
- Storage keys/schema remain compatible unless an explicit migration is introduced and tested.
- Existing calculations and user-visible behavior must remain unchanged.

## Current shared core
### `STOT_LAYOUT_GEOMETRY`
Frozen, DOM-free, state-free helpers for:
- footprint parsing
- piece area
- true 5x5 geometric packing with rotation

### `STOT_LAYOUT_ROWS`
Frozen, DOM-free, state-free helpers for:
- Oil-compatible and Compare-compatible row normalization through explicit options
- row-to-footprint piece expansion
- footprint quantity expansion
- lowest-loss reserve-fit search for refinery space

### `STOT_LAYOUT_PRODUCTION`
Frozen, DOM-free, state-free helpers for:
- behavior-identical special-drill base rate selection for Normal, Heart, Hacker and Clock rows
- tier × pet production-loss arithmetic used by refinery reserve fitting

The production core receives already-sanitized values as plain data. Oil still reads Oil controls/state and Compare still reads its active A/B setup; no mutable state or DOM crosses the page boundary.

## Formatting/calculation audit result
- The duplicated Quick Fill reserve `rowLoss` arithmetic was behavior-identical after state values were extracted, so it moved to `STOT_LAYOUT_PRODUCTION`.
- Existing site-level numeric formatters (`fmt` / `rateFmt`) are already centralized rather than duplicated between Oil and Compare, so Stage 5 does not create another formatter layer.
- View-only HTML escaping/rendering stays page-local; sharing it would not materially simplify ownership.
- Broader calculator/state extraction is not forced where Oil and Compare obtain inputs differently. Any later extraction must remain pure and prove exact parity first.

## Component-factory audit result
No shared mutable UI component factory is introduced in Stage 5.

The Quick Fill, Visual Builder, Sticky result and Advanced Tools surfaces look similar, but their lifecycle and ownership contracts are intentionally different:
- Oil binds directly to Oil-only controls, `layoutPlots`, Oil reserve metadata and Oil render hooks.
- Compare binds to active Preset A/B, `compareStates.A/B`, Compare reserve metadata and Compare-only editor events.
- A parameterized shared DOM factory would move a small amount of markup duplication into a large callback/configuration surface and increase coupling without reducing the underlying state-specific logic.
- Keeping separate DOM instances and page-local event adapters is therefore the lower-risk architecture and directly preserves the project's isolation requirement.

The audit did not find another behavior-identical page-local helper in the targeted Quick Fill path that should be retired after the geometry, row/reserve and production-loss cutovers. Remaining page-local helpers either extract page-specific state or render page-specific UI.

## Ownership after current cutover
- Oil Quick Fill owns its own DOM, `layoutPlots` writes, reserve metadata, boost input reads and UI events.
- Compare Quick Fill owns its own DOM, `compareStates.A/B` writes, reserve metadata, boost setup reads and UI events.
- Both consume the same pure geometry + row/template + production-loss APIs.
- No mutable DOM or state crosses the page boundary.

## Planned sequence
1. Extract shared pure layout geometry and migrate Oil + Compare Quick Fill. **Done.**
2. Lock geometry core with Stage 5 regression coverage. **Done.**
3. Consolidate row cloning/normalization and reserve-fit search where semantics are behavior-identical. **Done.**
4. Audit formatting/calculation helpers and extract only behavior-identical pure functions. **Done.**
5. Introduce component factories only where each page receives an independent instance and where the factory materially reduces duplication. **Done — audit found no factory with a favorable isolation/complexity tradeoff.**
6. Remove duplicated page-local helpers only after parity tests prove each cutover. **Done — targeted pure duplicates are retired; state/UI adapters remain page-local by design.**
7. Full Chromium + Mobile Chromium + Mobile WebKit regression before release. **Next.**

## Slice 1 — Geometry
Created `STOT_LAYOUT_GEOMETRY` and migrated Oil + Compare Quick Fill to it.

## Slice 2 — Rows and reserve fitting
Created `STOT_LAYOUT_ROWS` and migrated both Quick Fill implementations to shared normalization/piece expansion/reserve-fit helpers. Stage 5 regression verifies frozen/pure contracts, input immutability, compatibility normalization, lowest-loss reserve fitting, and persisted-state isolation.

## Slice 3 — Production-loss calculation
Created `STOT_LAYOUT_PRODUCTION` and migrated Oil + Compare Quick Fill reserve-loss calculation to it. State extraction remains page-local, while regression verifies regular/Heart/Hacker/Clock arithmetic, tier/pet multiplication, immutability and Oil/Compare ownership markers.

## Release gate
Stage 5 is not releasable until the final PR-head regression workflow completes successfully. After that, the PR can move out of Draft, merge to `main`, and must pass main-branch CI plus GitHub Pages deployment before Stage 5 is called complete.
