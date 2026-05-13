# Project Constitution & State Tracking

## Data Schemas
*(See `gemini.md` for specific JSON Data Schema shapes)*

## Behavioral Rules
- System Pilot operates with B.L.A.S.T. protocol.
- Reliability > Speed.
- No guessing at business logic.
- Data-First rule: Define JSON schema before building tools.
- Self-Annealing rule: Analyze -> Patch -> Test -> Update Architecture.

## Architectural Invariants
- Layer 1 (`architecture/`): SOPs in Markdown.
- Layer 2: Navigation layer.
- Layer 3 (`tools/`): Python scripts.
- Intermediates go to `.tmp/`.
