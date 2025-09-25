-- STEP 4: Verify foreign keys were corrected
-- Execute this after step 3

-- Check if foreign keys now point to auth.users
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

-- Test if we can now insert manually
INSERT INTO user_profiles (user_id, full_name)
VALUES (
  '00000000-0000-0000-0000-000000000003'::uuid, 
  'Test User 3'
)
ON CONFLICT (user_id) DO UPDATE SET
  full_name = EXCLUDED.full_name;

-- Check if the manual insert worked
SELECT 'Manual insert test successful' as status, COUNT(*) as count FROM user_profiles WHERE user_id = '00000000-0000-0000-0000-000000000003'::uuid;

-- Clean up test data
DELETE FROM user_profiles WHERE user_id = '00000000-0000-0000-0000-000000000003'::uuid;
