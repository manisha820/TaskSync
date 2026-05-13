# SOP: Task Synchronization Layer

## Purpose
To ensure deterministic state management between the local UI, the Supabase PostgreSQL backend, and the probabilistic AI intelligence layer.

## Architecture Invariants
1. **Source of Truth**: Supabase `tasks` table.
2. **Sync Strategy**: Optimistic updates in the UI followed by background persistence.
3. **Realtime**: Every component must subscribe to its relevant table via `supabase.channel` to ensure multi-device consistency.

## Handling Logic
- **Task Creation**: 
  - Input: `title`, `user_id`, `board_id`, `status` (Case-sensitive: 'Todo', 'In Progress', 'Done').
  - Trigger: Manual entry or Quick Add.
- **AI Categorization** (Proposed): 
  - Input: Raw text.
  - Process: Send to `gemini-1.5-flash` with a system prompt defining the JSON schema.
  - Output: Map to existing columns.

## Error Handling
- If persistence fails, revert UI state and show a toast notification.
- Log errors to the `Maintenance Log` in `gemini.md`.
