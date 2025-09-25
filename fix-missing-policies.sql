-- Fix Missing Policies and Functions
-- Execute this script to complete the setup

-- Add missing policies for user_settings (only if they don't exist)
DO $$
BEGIN
  -- Check and create "Users can view their own settings" policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'user_settings' 
    AND policyname = 'Users can view their own settings'
  ) THEN
    CREATE POLICY "Users can view their own settings" ON user_settings
      FOR SELECT USING (auth.uid() = user_id);
  END IF;

  -- Check and create "Users can insert their own settings" policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'user_settings' 
    AND policyname = 'Users can insert their own settings'
  ) THEN
    CREATE POLICY "Users can insert their own settings" ON user_settings
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Check and create "Users can update their own settings" policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'user_settings' 
    AND policyname = 'Users can update their own settings'
  ) THEN
    CREATE POLICY "Users can update their own settings" ON user_settings
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create missing function handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create user profile
  INSERT INTO public.user_profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)));
  
  -- Create default settings
  INSERT INTO public.user_settings (user_id, theme, default_view, color_theme)
  VALUES (NEW.id, 'light', 'kanban', 'blue-purple');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create missing function move_overdue_tasks
CREATE OR REPLACE FUNCTION public.move_overdue_tasks()
RETURNS void AS $$
BEGIN
  -- Move overdue tasks to today and increase priority
  UPDATE tasks 
  SET 
    due_date = CURRENT_DATE,
    priority = CASE 
      WHEN priority = 'baixa' THEN 'média'
      WHEN priority = 'média' THEN 'alta'
      WHEN priority = 'alta' THEN 'urgente'
      ELSE 'urgente'
    END,
    updated_at = NOW()
  WHERE 
    due_date < CURRENT_DATE 
    AND status NOT IN ('concluída', 'cancelada')
    AND user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration (if not exists)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.move_overdue_tasks() TO authenticated;
