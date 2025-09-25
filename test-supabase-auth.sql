-- Test Supabase Auth Configuration
-- Execute this to check auth settings

-- Check if auth.users table exists and is accessible
SELECT COUNT(*) as user_count FROM auth.users;

-- Check if we can see the auth schema
SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'auth';

-- Check if there are any auth-related functions
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines 
WHERE routine_schema = 'auth'
ORDER BY routine_name;

-- Check if there are any triggers on auth.users
SELECT 
  trigger_name,
  event_object_table,
  action_timing,
  event_manipulation
FROM information_schema.triggers 
WHERE trigger_schema = 'auth'
ORDER BY event_object_table, trigger_name;

-- Check if RLS is enabled on auth.users
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'auth' 
  AND tablename = 'users';
