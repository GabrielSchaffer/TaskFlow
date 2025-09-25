-- Debug Trigger and User Creation
-- Execute this to check if the trigger is working

-- Check if the trigger exists
SELECT 
  trigger_name,
  event_object_table,
  action_timing,
  event_manipulation,
  action_statement
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
  AND trigger_name = 'on_auth_user_created';

-- Check if the function exists
SELECT 
  routine_name,
  routine_type,
  routine_definition
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name = 'handle_new_user';

-- Test the function manually (replace with a real user ID)
-- SELECT public.handle_new_user();

-- Check if there are any users in auth.users
SELECT 
  id,
  email,
  created_at,
  raw_user_meta_data
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- Check if user_profiles were created
SELECT 
  up.id,
  up.user_id,
  up.full_name,
  up.created_at
FROM user_profiles up
ORDER BY up.created_at DESC 
LIMIT 5;

-- Check if user_settings were created
SELECT 
  us.id,
  us.user_id,
  us.theme,
  us.default_view,
  us.created_at
FROM user_settings us
ORDER BY us.created_at DESC 
LIMIT 5;
