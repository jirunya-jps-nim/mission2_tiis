import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cwglopfaevserbrmcgpw.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_xFsMO-l4Iv_aDI6uvtSesw_pX9kjijB';

export const supabase = createClient(supabaseUrl, supabaseKey);
