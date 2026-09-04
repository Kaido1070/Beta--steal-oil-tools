# Stage 3 Compare isolation

Compare Presets owns its own DOM, A/B state, calculator controls, boosts, Quick Fill, Advanced Tools, and Visual Plot Builder.

Oil / Hour retains its existing DOM and state. No Oil-owned node is transferred into Compare Presets.

The legacy Oil Visual Plot Builder mount path is blocked while the Stage 3 Compare controller is active, so `#layoutVisualBuilderCompare` remains owned and rendered only by Compare.

Shared code is limited to calculation helpers and game data; UI nodes and mutable page state are not shared.
