# Standard Operating Procedure: Realtime Sync & State Management

## Goal
Ensure the UI perfectly reflects the cloud database state in real-time, enforcing the "Never lose user data" and "Deterministic backend logic" rules.

## Inputs
- Supabase Realtime Channels (`supabase.channel()`)
- Database Tables (`tasks`, `boards`, `notes`, `work_sessions`)
- React State (e.g., Zustand or standard React Context)

## Tool Logic
1. **Initial Load**:
   - Upon component mount, call utility functions (e.g., `fetchTasks()`) from `src/lib/api.ts`.
   - Populate local React state.
2. **Realtime Subscription**:
   - Subscribe to Postgres changes on the user's specific `board_id` or `user_id`.
   - E.g., `supabase.channel('custom-all-channel').on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, payload => { ... })`.
   - When a payload arrives (INSERT, UPDATE, DELETE), deterministically update the local React state without needing a full re-fetch.
3. **Mutations (Writes)**:
   - When a user moves a task in the Kanban board, optimistically update the local UI state for responsiveness.
   - Immediately call the backend utility `updateTaskStatus(taskId, newStatus)`.
   - If the backend call fails, revert the local UI state (Self-healing).

## Edge Cases
- **Concurrent Edits**: Rely on the Supabase payload `updated_at` timestamp. Last write wins.
- **Connection Drop**: Supabase realtime client automatically attempts reconnection. Local state remains cached until connection is restored.
