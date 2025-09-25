-- Check Email Settings and Auth Configuration
-- This will help identify email-related issues

-- Check if there are any email-related configurations
SELECT 
  name,
  value
FROM pg_settings 
WHERE name LIKE '%email%' 
   OR name LIKE '%smtp%'
   OR name LIKE '%mail%';

-- Check if there are any auth-related configurations
SELECT 
  name,
  value
FROM pg_settings 
WHERE name LIKE '%auth%'
   OR name LIKE '%jwt%'
   OR name LIKE '%token%';

-- Check if there are any functions related to email
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND (routine_name LIKE '%email%' 
       OR routine_name LIKE '%mail%'
       OR routine_name LIKE '%auth%');

-- Check if there are any policies that might be blocking auth
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'auth'
ORDER BY tablename, policyname;
