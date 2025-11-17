// src/utils/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

// Lee las variables del entorno (Vite las pone automáticamente)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Faltan variables de entorno de Supabase')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)