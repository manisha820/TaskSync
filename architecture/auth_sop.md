# Standard Operating Procedure: Authentication Flow

## Goal
Securely authenticate users via Supabase and maintain their session state deterministically across the application.

## Inputs
- `email` and `password` (for standard email login)
- OAuth Providers (Google/GitHub) via Supabase Auth
- `supabase.auth.getSession()`

## Tool Logic
1. **Login/Signup**: 
   - User inputs credentials in the UI.
   - UI calls the deterministic utility function `signIn(email, password)` or `signInWithOAuth('google')` located in `src/lib/auth.ts`.
   - On success, Supabase updates the local session token and emits an `onAuthStateChange` event.
2. **Session Management**:
   - `App.tsx` (or an AuthProvider wrapper) listens to `supabase.auth.onAuthStateChange`.
   - The user context is updated in the global state.
   - If no session exists, the app renders the Login screen.
   - If a session exists, the app renders the Dashboard and injects `user_id` into all subsequent database queries.

## Edge Cases
- **Expired Token**: Supabase SDK handles auto-refresh. If it fails, the user is cleanly logged out.
- **Offline Mode**: If the user is offline during login, throw a clear network error.
- **First Time Login**: Upon first login, ensure a corresponding record is created/verified in the `public.users` table using a Supabase Postgres Trigger (Trigger handles this outside of UI logic to guarantee consistency).
