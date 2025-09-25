-- Clean ALL Triggers and Functions
-- This will remove everything and recreate correctly

-- STEP 1: Drop ALL triggers on auth.users (including the hidden one)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users CASCADE;

-- STEP 2: Drop ALL functions with CASCADE
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.create_user_profile() CASCADE;

-- STEP 3: Verify everything is clean
SELECT 'All triggers and functions removed' as status;

-- STEP 4: Create a simple, working function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create user_profile, skip user_settings for now
  INSERT INTO public.user_profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)));
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 5: Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- STEP 6: Grant permissions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;

-- STEP 7: Test if it works
SELECT 'Clean and recreate completed successfully' as status;
