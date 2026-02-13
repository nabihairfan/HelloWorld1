import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// This part checks if the variables actually exist
if (!supabaseUrl || !supabaseKey) {
  console.error("HEY! Your Supabase keys are missing. Check your .env.local file location.");
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.url', // prevent the crash
  supabaseKey || 'placeholder-key'
)