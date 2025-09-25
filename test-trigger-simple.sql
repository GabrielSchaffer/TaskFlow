-- Simple Trigger Test
-- Test if our trigger function works correctly

-- Check if our function exists
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

-- Test if we can manually insert into user_profiles (simulate what the trigger should do)
-- This will help us see if the issue is with the trigger or with the table permissions
INSERT INTO user_profiles (user_id, full_name)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid, 
  'Test User Manual'
)
ON CONFLICT (user_id) DO UPDATE SET
  full_name = EXCLUDED.full_name;

-- Test if we can manually insert into user_settings
INSERT INTO user_settings (user_id, theme, default_view)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'light',
  'kanban'
)
ON CONFLICT (user_id) DO UPDATE SET
  theme = EXCLUDED.theme,
  default_view = EXCLUDED.default_view;

-- Check if the manual inserts worked
SELECT 'Manual test successful' as status, COUNT(*) as user_profiles_count FROM user_profiles WHERE user_id = '00000000-0000-0000-0000-000000000001'::uuid
UNION ALL
SELECT 'Manual test successful' as status, COUNT(*) as user_settings_count FROM user_settings WHERE user_id = '00000000-0000-0000-0000-000000000001'::uuid;

-- Clean up test data
DELETE FROM user_settings WHERE user_id = '00000000-0000-0000-0000-000000000001'::uuid;
DELETE FROM user_profiles WHERE user_id = '00000000-0000-0000-0000-000000000001'::uuid;
