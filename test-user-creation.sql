-- Test User Creation Process
-- This script will help debug the user creation issue

-- First, let's check if we can manually create a user profile
-- (This should work if the tables and policies are correct)

-- Test inserting into user_profiles
INSERT INTO user_profiles (user_id, full_name)
VALUES (
  '00000000-0000-0000-0000-000000000000'::uuid, 
  'Test User'
)
ON CONFLICT (user_id) DO NOTHING;

-- Test inserting into user_settings  
INSERT INTO user_settings (user_id, theme, default_view)
VALUES (
  '00000000-0000-0000-0000-000000000000'::uuid,
  'light',
  'kanban'
)
ON CONFLICT (user_id) DO NOTHING;

-- Check if the inserts worked
SELECT 'user_profiles' as table_name, COUNT(*) as count FROM user_profiles
UNION ALL
SELECT 'user_settings' as table_name, COUNT(*) as count FROM user_settings;

-- Clean up test data
DELETE FROM user_settings WHERE user_id = '00000000-0000-0000-0000-000000000000'::uuid;
DELETE FROM user_profiles WHERE user_id = '00000000-0000-0000-0000-000000000000'::uuid;
