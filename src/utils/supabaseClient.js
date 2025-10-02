import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sqtugyysrbyiekshixeo.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxdHVneXlzcmJ5aWVrc2hpeGVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5NzY4ODksImV4cCI6MjA3NDU1Mjg4OX0.CU668B4K9KwbVRpK1jifLdbmMiWoSbrXaGcxK_1YhNY'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});