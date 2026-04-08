# Step 4 Storage Setup

Run [supabase/migrations/20260408_step4_storage.sql](supabase/migrations/20260408_step4_storage.sql) in Supabase SQL Editor to create the public `memory-media` bucket and the object policies needed for uploads.

Then the create-memory flow can upload image files to:

- `memory-media/{user_id}/{timestamp}.{ext}`
