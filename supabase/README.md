# Supabase Step 2

## Apply migration

1. Open Supabase Dashboard -> SQL Editor.
2. Run `supabase/migrations/20260407_step2_schema_rls.sql`.
3. Verify tables: `profiles`, `memories`, `likes`.
4. Verify RLS is enabled on all 3 tables.

## Notes

- New users get an auto-created `profiles` row from auth metadata via trigger.
- Delete policy supports owner or admin (`profiles.is_admin = true`).
- This is the backend baseline for Phase 3 feed read integration.
