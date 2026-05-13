# TaskSync: B.L.A.S.T. Implementation Plan

This document outlines the architectural blueprint and execution plan for TaskSync, the AI-powered all-in-one productivity platform.

## User Review Required
> [!IMPORTANT]
> Please review the proposed integrations and JSON Data Schema in `gemini.md`. If the Blueprint aligns with your vision, please approve so we can move to Phase 2: Link.

## Open Questions
> [!NOTE]
> 1. For the database, do you prefer we initialize Supabase right now or use a mock local database until the Link phase is ready for the cloud?
> 2. Should we start by building the UI scaffolding (Phase 4 Stylize) concurrently with Phase 2 (Link), or strictly follow backend -> frontend?

## Proposed Changes

### Phase 1: Blueprint (Vision & Logic)
- [x] Answer Discovery Questions
- [x] Define JSON Data Schema in `gemini.md`
- [ ] Approve Blueprint (Pending User Approval)

### Phase 2: Link (Connectivity)
- [ ] Initialize Supabase project and database schema.
- [ ] Configure `.env` variables for Supabase, OpenAI, and Google OAuth.
- [ ] Verify API connectivity with minimal Node/Python scripts in `tools/`.

### Phase 3: Architect (The 3-Layer Build)
- [ ] Write SOPs in `architecture/` for:
  - Authentication Flow
  - Realtime Sync (Supabase Realtime)
  - AI Assistant Integration
  - Task & Kanban state management
- [ ] Build deterministic backend utility functions.

### Phase 4: Stylize (Refinement & UI)
- [ ] Configure Tailwind CSS / UI library (e.g. Shadcn UI) for a premium, minimal, dark/light mode compatible design.
- [ ] Build interactive Dashboard, Kanban Board, and Notes workspace.
- [ ] Implement autosave and realtime updates in the UI.
- [ ] Present for UI/UX feedback.

### Phase 5: Trigger (Deployment)
- [ ] Deploy frontend to Vercel/Netlify (PWA enabled).
- [ ] Configure production database and backend triggers.
- [ ] Finalize Maintenance Log in `gemini.md`.

## Verification Plan
### Automated Tests
- Connectivity checks in `tools/` for Supabase and OpenAI APIs.
- Unit tests for core deterministic backend functions.

### Manual Verification
- Testing the Task creation and Realtime sync across two browser windows.
- Verifying the responsive layout on mobile viewport sizes.
- Testing Dark/Light mode toggles.
