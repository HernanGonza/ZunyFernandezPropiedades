// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://iahqqebglgzfjskzidrs.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhaHFxZWJnbGd6Zmpza3ppZHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4Mjg3MTQsImV4cCI6MjA3MjQwNDcxNH0.mE70nSXOChA6CGytAEr2RpFYt0irtV0Qs9BQljpoQIM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)