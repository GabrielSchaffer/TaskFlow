-- Test User Creation Directly
-- This will help identify if the issue is with our trigger or Supabase auth

-- First, let's check if our trigger function exists and is working
SELECT 
  routine_name,
  routine_type,
  routine_definition
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name = 'handle_new_user';

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

-- Test if we can manually call the function (this might fail, but will show us the error)
-- DO $$
-- BEGIN
--   -- This is just to test if the function can be called
--   PERFORM public.handle_new_user();
-- END $$;

-- Check if there are any existing users in our tables
SELECT 'user_profiles' as table_name, COUNT(*) as count FROM user_profiles
UNION ALL
SELECT 'user_settings' as table_name, COUNT(*) as count FROM user_settings;

-- Check the latest users in auth.users (if accessible)
SELECT 
  id,
  email,
  created_at,
  email_confirmed_at,
  last_sign_in_at
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 3;
