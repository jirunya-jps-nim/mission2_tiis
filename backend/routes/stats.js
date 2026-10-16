const express = require('express');
const router = express.Router();
const dataStore = require('../dataStore');
const { getIsSupabaseAvailable, checkSupabaseHealth } = require('../supabaseClient');

// GET /api/stats - Dashboard summary metrics
router.get('/', async (req, res) => {
  try {
    const isSupabaseActive = await checkSupabaseHealth();
    const stats = await dataStore.getStats();

    // Staff workload breakdown
    const allLearners = await dataStore.getAllLearners();
    const staffWorkload = dataStore.CORE_STAFF.map(staff => {
      const assigned = allLearners.filter(l => l.assigned_staff === staff);
      const pending = assigned.filter(l => l.status === 'PENDING').length;
      const contacted = assigned.filter(l => l.status === 'CONTACTED').length;
      const resolved = assigned.filter(l => l.status === 'RESOLVED').length;
      return {
        staff_name: staff,
        total_assigned: assigned.length,
        pending,
        contacted,
        resolved
      };
    });

    res.json({
      success: true,
      data: {
        ...stats,
        staffWorkload,
        supabase_status: {
          connected: isSupabaseActive,
          url: 'https://cwglopfaevserbrmcgpw.supabase.co',
          mode: isSupabaseActive ? 'LIVE_SUPABASE' : 'LOCAL_PERSISTENT_STORE (SEEDED 60 PARTICIPANTS)'
        }
      }
    });
  } catch (err) {
    console.error('Error getting stats:', err);
    res.status(500).json({ success: false, message: 'ไม่สามารถดึงข้อมูลสถิติได้' });
  }
});

module.exports = router;
