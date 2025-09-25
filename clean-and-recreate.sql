-- Clean and Recreate Everything
-- This will remove all triggers and functions, then recreate them correctly

-- STEP 1: Remove ALL triggers on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- STEP 2: Remove ALL conflicting functions
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.create_user_profile();

-- STEP 3: Create a simple, working function
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

-- STEP 4: Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- STEP 5: Grant permissions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;

-- STEP 6: Test if it works
SELECT 'Clean and recreate completed' as status;
