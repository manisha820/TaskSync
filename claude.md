# Project Constitution & State Tracking

## Data Schemas
*(See `gemini.md` for specific JSON Data Schema shapes for PostgreSQL/Supabase)*

## Behavioral Rules
- System Pilot operates with B.L.A.S.T. protocol.
- Reliability > Speed.
- No guessing at business logic.
- Data-First rule: Define JSON schema before building tools.
- Self-Annealing rule: Analyze -> Patch -> Test -> Update Architecture.
- Clean, Reliable, Fast, Minimal, Professional, User-focused.
- Never lose user data (always autosave notes and tasks).
- Maintain realtime synchronization.
- Prioritize performance and responsiveness.
- Use deterministic backend logic for all critical operations.
- Keep the UI distraction-free and productivity-focused.
- AI suggestions must remain assistive, not intrusive.
- Avoid unnecessary popups or clutter.
- All features must work seamlessly in dark and light mode.
- Maintain scalable architecture and modular code structure.
- Ensure accessibility and mobile responsiveness.

## Explicit "Do Not" Rules
- Do not hardcode API keys.
- Do not block users with unnecessary onboarding.
- Do not overload the interface with excessive animations.
- Do not use unstable experimental dependencies in production.
- Do not allow destructive actions without confirmation.
- Do not compromise data consistency during realtime updates.

## Architectural Invariants
- Layer 1 (`architecture/`): SOPs in Markdown.
- Layer 2: Navigation layer.
- Layer 3 (`tools/`): Python scripts / Core Utilities.
- Intermediates go to `.tmp/`.
