-- Additional Supabase Settings
-- Execute this after database-setup.sql

-- Enable real-time for tables
ALTER PUBLICATION supabase_realtime ADD TABLE categories;
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE user_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE user_profiles;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);

-- Create function to automatically move overdue tasks
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

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
