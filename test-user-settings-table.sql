-- Test user_settings table structure
-- Check if there are issues with the user_settings table

-- Check the exact structure of user_settings
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'user_settings'
ORDER BY ordinal_position;

-- Try to manually insert into user_settings
INSERT INTO user_settings (user_id, theme, default_view)
VALUES (
  '00000000-0000-0000-0000-000000000004'::uuid,
  'light',
  'kanban'
);

-- Check if it worked
SELECT 'user_settings test' as status, COUNT(*) as count FROM user_settings WHERE user_id = '00000000-0000-0000-0000-000000000004'::uuid;

-- Clean up
DELETE FROM user_settings WHERE user_id = '00000000-0000-0000-0000-000000000004'::uuid;
