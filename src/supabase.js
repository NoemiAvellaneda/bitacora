import { createClient } from "@supabase/supabase-js";
  const SUPABASE_URL = "https://bsbvzqedpcwuutimlwwf.supabase.co";
  const SUPABASE_KEY = "sb_publishable_dRMPsKqXHo0PL4vTcHbsaA_D37oXDpp";
  export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  