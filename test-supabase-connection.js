// Test Supabase Connection
// Run this in browser console to test connection

// Test 1: Check if Supabase client is loaded
console.log('Supabase URL:', process.env.REACT_APP_SUPABASE_URL);
console.log('Supabase Key:', process.env.REACT_APP_SUPABASE_ANON_KEY);

// Test 2: Try to connect to Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase credentials not found!');
} else {
  console.log('✅ Supabase credentials found');

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Test connection
  supabase.auth.getSession().then(({ data, error }) => {
    if (error) {
      console.error('❌ Supabase connection error:', error);
    } else {
      console.log('✅ Supabase connection successful');
    }
  });
}
