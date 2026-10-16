const express = require('express');
const router = express.Router();
const dataStore = require('../dataStore');

// GET /api/learners - List with filters & calculated priority
router.get('/', async (req, res) => {
  try {
    const filters = {
      status: req.query.status || 'ALL',
      priority: req.query.priority || 'ALL',
      staff: req.query.staff || 'ALL',
      search: req.query.search || ''
    };
    const learners = await dataStore.getAllLearners(filters);
    res.json({
      success: true,
      count: learners.length,
      data: learners
    });
  } catch (err) {
    console.error('Error fetching learners:', err);
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้เรียน' });
  }
});

// GET /api/learners/:id - Detail by ID
router.get('/:id', async (req, res) => {
  try {
    const learner = await dataStore.getLearnerById(req.params.id);
    if (!learner) {
      return res.status(404).json({ success: false, message: 'ไม่พบข้อมูลผู้เรียนรายนี้' });
    }
    const logs = await dataStore.getFollowupLogs(req.params.id);
    res.json({
      success: true,
      data: {
        ...learner,
        followup_history: logs
      }
    });
  } catch (err) {
    console.error('Error fetching learner by ID:', err);
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
  }
});

// PATCH /api/learners/:id - Update learner info
router.patch('/:id', async (req, res) => {
  try {
    const updated = await dataStore.updateLearner(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'ไม่พบผู้เรียนที่ต้องการแก้ไข' });
    }
    res.json({
      success: true,
      message: 'อัปเดตข้อมูลผู้เรียนสำเร็จ',
      data: updated
    });
  } catch (err) {
    console.error('Error updating learner:', err);
    res.status(500).json({ success: false, message: 'ไม่สามารถอัปเดตข้อมูลได้' });
  }
});

// POST /api/learners/reset - Reset to seed data
router.post('/reset', (req, res) => {
  try {
    const result = dataStore.resetData();
    res.json({
      success: true,
      message: 'รีเซ็ตข้อมูลผู้เรียนทั้ง 60 คนเรียบร้อยแล้ว',
      count: result.count
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'ไม่สามารถรีเซ็ตข้อมูลได้' });
  }
});

module.exports = router;
