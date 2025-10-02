import dotenv from 'dotenv';
dotenv.config();  // Must be first

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL or Key not found in backend environment variables!');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
