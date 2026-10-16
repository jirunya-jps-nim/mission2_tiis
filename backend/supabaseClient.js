const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://cwglopfaevserbrmcgpw.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'sb_publishable_xFsMO-l4Iv_aDI6uvtSesw_pX9kjijB';

let supabase = null;
let isSupabaseAvailable = false;

try {
  if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });
  }
} catch (err) {
  console.warn('[Supabase] Initialization warning:', err.message);
}

/**
 * Check if Supabase connection & tables are accessible
 */
async function checkSupabaseHealth() {
  if (!supabase) return false;
  try {
    const { data, error } = await supabase.from('learners').select('id').limit(1);
    if (error) {
      // 404 or table not found
      isSupabaseAvailable = false;
      return false;
    }
    isSupabaseAvailable = true;
    return true;
  } catch (err) {
    isSupabaseAvailable = false;
    return false;
  }
}

module.exports = {
  supabase,
  supabaseUrl,
  checkSupabaseHealth,
  getIsSupabaseAvailable: () => isSupabaseAvailable
};
