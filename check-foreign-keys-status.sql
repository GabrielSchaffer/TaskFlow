-- Check Foreign Keys Status
-- Verify if the foreign key corrections were applied

-- Check current foreign key constraints
SELECT 
  tc.table_name,
  tc.constraint_name,
  tc.constraint_type,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
  AND tc.table_name IN ('user_profiles', 'user_settings', 'categories', 'tasks')
ORDER BY tc.table_name, tc.constraint_name;

-- Check if our trigger function exists and is working
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name = 'handle_new_user';

-- Check if our trigger exists
SELECT 
  trigger_name,
  event_object_table,
  action_timing,
  event_manipulation
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
  AND trigger_name = 'on_auth_user_created';

-- Test if we can manually insert (this should work now)
INSERT INTO user_profiles (user_id, full_name)
VALUES (
  '00000000-0000-0000-0000-000000000002'::uuid, 
  'Test User 2'
)
ON CONFLICT (user_id) DO UPDATE SET
  full_name = EXCLUDED.full_name;

-- Check if the manual insert worked
SELECT 'Manual insert test' as status, COUNT(*) as count FROM user_profiles WHERE user_id = '00000000-0000-0000-0000-000000000002'::uuid;

-- Clean up test data
DELETE FROM user_profiles WHERE user_id = '00000000-0000-0000-0000-000000000002'::uuid;
