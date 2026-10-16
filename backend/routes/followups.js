const express = require('express');
const router = express.Router();
const dataStore = require('../dataStore');

// POST /api/followups - Record a new follow-up interaction
router.post('/', async (req, res) => {
  try {
    const { learner_id, staff_name, channel, note, new_status, next_action } = req.body;

    // 1. Validation: Missing fields
    if (!learner_id || !staff_name || !channel || !note || !new_status) {
      return res.status(400).json({
        success: false,
        error_type: 'VALIDATION_ERROR',
        message: 'กรุณากรอกข้อมูลให้ครบถ้วน: ต้องระบุผู้เรียน, ผู้บันทึก, ช่องทาง, ผลการติดตาม และสถานะใหม่'
      });
    }

    // 2. Validation: Content quality / minimum length
    if (note.trim().length < 5) {
      return res.status(400).json({
        success: false,
        error_type: 'INVALID_NOTE',
        message: 'บันทึกการติดตามต้องมีความยาวอย่างน้อย 5 ตัวอักษร เพื่อให้มีสาระสำคัญที่ตรวจสอบย้อนหลังได้'
      });
    }

    // 3. Validation: Verify learner exists
    const learner = await dataStore.getLearnerById(learner_id);
    if (!learner) {
      return res.status(404).json({
        success: false,
        error_type: 'LEARNER_NOT_FOUND',
        message: `ไม่พบรหัสผู้เรียน "${learner_id}" ในระบบ`
      });
    }

    // 4. Validation: Status transition logic
    const validStatuses = ['PENDING', 'CONTACTED', 'RESOLVED'];
    if (!validStatuses.includes(new_status)) {
      return res.status(400).json({
        success: false,
        error_type: 'INVALID_STATUS',
        message: 'สถานะไม่ถูกต้อง อนุญาตเฉพาะ: รอติดต่อ (PENDING), ติดต่อแล้ว (CONTACTED), หรือ ปิดเรื่อง (RESOLVED)'
      });
    }

    // 5. Add follow-up log (handles duplicate prevention)
    const log = await dataStore.addFollowupLog({
      learner_id,
      staff_name,
      channel,
      note: note.trim(),
      new_status,
      next_action: next_action ? next_action.trim() : ''
    });

    // 6. Fetch updated learner
    const updatedLearner = await dataStore.getLearnerById(learner_id);

    return res.status(201).json({
      success: true,
      message: 'บันทึกการติดตามผลสำเร็จเรียบร้อยแล้ว',
      data: {
        log,
        learner: updatedLearner
      }
    });
  } catch (err) {
    if (err.status === 409) {
      return res.status(409).json({
        success: false,
        error_type: 'DUPLICATE_ENTRY',
        message: err.message
      });
    }
    console.error('Error adding followup log:', err);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง'
    });
  }
});

// GET /api/followups/:learnerId - Get logs for specific learner
router.get('/:learnerId', async (req, res) => {
  try {
    const logs = await dataStore.getFollowupLogs(req.params.learnerId);
    res.json({
      success: true,
      data: logs
    });
  } catch (err) {
    console.error('Error fetching logs:', err);
    res.status(500).json({
      success: false,
      message: 'ไม่สามารถดึงประวัติการติดตามได้'
    });
  }
});

module.exports = router;
