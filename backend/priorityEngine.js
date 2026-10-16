/**
 * PriorityEngine - FollowUp Radar
 * คำนวณลำดับความสำคัญและสร้างเหตุผลประกอบตามเกณฑ์ภารกิจที่ 1:
 * 1. การขอความช่วยเหลือ (Requested help)
 * 2. การยังไม่เริ่มดำเนินการ (Hasn't started)
 * 3. การขาดการรายงาน (Missing reports)
 * 4. การยังไม่บรรลุผล / ติดอุปสรรค (Blocked / Not achieving)
 * 5. ตรวจสอบข้อมูลไม่ครบถ้วน -> แสดง "ต้องตรวจสอบข้อมูล" แทนการสรุปว่าเป็นผู้มีปัญหา
 */

function calculatePriority(learner) {
  // ตรวจสอบกรณีข้อมูลไม่ครบถ้วน
  if (
    learner.is_data_incomplete ||
    !learner.full_name ||
    learner.missing_days === undefined ||
    learner.missing_days === null
  ) {
    return {
      score: 0,
      level: 'NEEDS_CHECK',
      label: 'ต้องตรวจสอบข้อมูล',
      badgeClass: 'badge-needs-check',
      reasons: [
        'ข้อมูลผู้เรียนยังไม่ครบถ้วนในระบบ จำเป็นต้องตรวจสอบหรืออัปเดตข้อมูลเพิ่มเติมก่อนสรุปผล'
      ],
      recommendedAction: 'ประสานงานตรวจสอบข้อมูลพื้นฐานหรือสอบถามสถานะล่าสุดของผู้เรียน'
    };
  }

  // หากเรื่องได้รับการปิดงานแล้ว (RESOLVED)
  if (learner.status === 'RESOLVED') {
    return {
      score: 0,
      level: 'RESOLVED',
      label: 'ปิดเรื่องแล้ว',
      badgeClass: 'badge-resolved',
      reasons: ['เสร็จสิ้นกระบวนการติดตามผลตามเป้าหมาย 14 วันเรียบร้อยแล้ว'],
      recommendedAction: 'ตรวจทานสรุปผลสำเร็จและปิดแฟ้มบันทึก'
    };
  }

  let score = 0;
  const reasons = [];

  // สัญญาณที่ 1: การขอความช่วยเหลือ
  if (learner.requested_help) {
    score += 40;
    const detail = learner.help_request_detail
      ? `: "${learner.help_request_detail}"`
      : '';
    reasons.push(`ผู้เรียนส่งสัญญาณขอความช่วยเหลือโดยตรง${detail}`);
  }

  // สัญญาณที่ 2: การยังไม่เริ่มดำเนินการ
  if (learner.has_started === false) {
    score += 25;
    reasons.push('ยังไม่ได้เริ่มลงมือปฏิบัติงานจริงในโครงการ เสี่ยงต่อการหลุดออกจากกิจกรรม');
  }

  // สัญญาณที่ 3: การขาดการรายงาน
  if (learner.missing_days >= 5) {
    score += 35;
    reasons.push(`ขาดการส่งรายงานความคืบหน้าติดต่อกัน ${learner.missing_days} วัน (เกินกรอบเฝ้าระวัง)`);
  } else if (learner.missing_days >= 3) {
    score += 20;
    reasons.push(`ขาดการส่งรายงานความคืบหน้า ${learner.missing_days} วัน`);
  }

  // สัญญาณที่ 4: การยังไม่บรรลุผล / ติดอุปสรรค
  if (learner.is_blocked) {
    score += 25;
    const blockDetail = learner.blocked_detail
      ? `: "${learner.blocked_detail}"`
      : '';
    reasons.push(`ติดอุปสรรคในการนำทักษะไปประยุกต์ใช้ในสถานการณ์จริง${blockDetail}`);
  }

  // ปัจจัยเสริม: ความมั่นใจต่ำ (กลุ่มเป้าหมายที่ลังเลหรือขาดความมั่นใจ)
  if (learner.confidence_level === 'LOW') {
    score += 10;
    reasons.push('ประเมินความมั่นใจตนเองอยู่ในระดับต่ำ อาจลังเลและไม่กล้าแจ้งปัญหา');
  }

  // สรุประดับความสำคัญ (คำนึงถึงการไม่ตีตราผู้เรียน: แสดงเป็น "ควรติดตาม" ไม่ใช่การตัดสินความสามารถ)
  let level = 'NORMAL';
  let label = 'ปกติ';
  let badgeClass = 'badge-normal';
  let recommendedAction = 'ติดตามความคืบหน้าตามรอบกำหนดการปกติ';

  if (score >= 50 || (learner.requested_help && learner.missing_days >= 3)) {
    level = 'CRITICAL';
    label = 'เร่งด่วนมาก';
    badgeClass = 'badge-critical';
    recommendedAction = 'ติดต่อพูดคุยรายบุคคลผ่านโทรศัพท์หรือ LINE ทันทีภายใน 24 ชม.';
  } else if (score >= 25) {
    level = 'MEDIUM';
    label = 'ควรติดตาม';
    badgeClass = 'badge-medium';
    recommendedAction = 'ส่งข้อความสอบถามความคืบหน้าและเสนอคำปรึกษาเพิ่มเติม';
  } else if (reasons.length === 0) {
    reasons.push('การเรียนรู้และการส่งรายงานดำเนินไปตามกำหนดการปกติ');
  }

  return {
    score,
    level,
    label,
    badgeClass,
    reasons,
    recommendedAction
  };
}

module.exports = {
  calculatePriority
};
