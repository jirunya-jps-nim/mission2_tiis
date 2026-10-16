/**
 * DataStore - FollowUp Radar
 * Manages 60 participants and follow-up records.
 * Supports Supabase integration with automatic fallback to persistent in-memory store.
 */

const { supabase, checkSupabaseHealth, getIsSupabaseAvailable } = require('./supabaseClient');
const { calculatePriority } = require('./priorityEngine');

const CORE_STAFF = [
  'ทีมงาน 1 (สมชาย - หัวหน้าโครงการ)',
  'ทีมงาน 2 (วิภา - ผู้ประสานงานการเรียนรู้)',
  'ทีมงาน 3 (อนันต์ - ผู้เชี่ยวชาญเทคนิค)'
];

const THAI_FIRST_NAMES = [
  'กิตติศักดิ์', 'ณัฐวุฒิ', 'ธนากร', 'ปรเมศวร์', 'ศิรวิทย์', 'อัครเดช', 'ภานุพงศ์', 'ชวัลวิทย์', 'ธีรภัทร', 'วรัญญู',
  'กัญญารัตน์', 'ชลธิชา', 'ณภัทร', 'ธัญญารัตน์', 'ปวริศา', 'ศศิธร', 'อารียา', 'วริศรา', 'กัญญาณัฐ', 'พิมพ์ชนก',
  'จุฑามาศ', 'ธนภรณ์', 'พิชญา', 'สุภัสสรา', 'เบญจวรรณ', 'กมลชนก', 'กิตติภูมิ', 'ปรีชา', 'รังสิมันต์', 'อนุชา',
  'เกศรา', 'จิดาภา', 'ชาคริต', 'ณัฐชนน', 'ธราดล', 'นพรัตน์', 'ปิยวัฒน์', 'พงศ์พิชิต', 'เมธัส', 'รัชตะ',
  'วรรณวิภา', 'ศุภกร', 'สิทธิชัย', 'หทัยรัตน์', 'อติรุจ', 'เขมทัต', 'ชัญญา', 'ดวงใจ', 'ทัศนัย', 'นิชานันท์',
  'ปัทมา', 'พรรณวดี', 'มาโนช', 'ยลดา', 'ลภัสรดา', 'ศิริรัตน์', 'สมเจตน์', 'สิรินทร์', 'อุษณีย์', 'เอกชัย'
];

const THAI_LAST_NAMES = [
  'สุขเกษม', 'เจริญผล', 'จันทร์กระจ่าง', 'วงศ์สว่าง', 'พงษ์พิพัฒน์', 'ศิริโภค', 'ทองอยู่', 'ทรัพย์สิน', 'รัตนพันธ์', 'มีสุข',
  'บุญประเสริฐ', 'ศรีสวัสดิ์', 'วัฒนากุล', 'แก้ววิเชียร', 'สัจจา', 'ประเสริฐยิ่ง', 'วิเศษพงษ์', 'ภัทรากร', 'ธรรมรงค์', 'จันทร์เพ็ญ'
];

function generate60Learners() {
  const learners = [];

  const scenarios = [
    // 1. Critical cases (Need urgent follow-up)
    {
      fullName: 'กิตติศักดิ์ สุขเกษม',
      groupType: 'STUDENT',
      device: 'MOBILE',
      confidence: 'LOW',
      requestedHelp: true,
      helpDetail: 'ไม่เข้าใจวิธีการนำโปรเจกต์ไปเปิดใช้งานบนมือถือ และติดปัญหาส่งงานไม่ได้',
      hasStarted: true,
      missingDays: 4,
      isBlocked: true,
      blockedDetail: 'ไม่มีเครื่องคอมพิวเตอร์ ทำบนสมาร์ทโฟนแล้วหน้าจอแสดงผลติดขัด',
      status: 'PENDING',
      staff: CORE_STAFF[0]
    },
    {
      fullName: 'ชลธิชา บุญประเสริฐ',
      groupType: 'EARLY_CAREER',
      device: 'DESKTOP',
      confidence: 'LOW',
      requestedHelp: true,
      helpDetail: 'อยากปรึกษาการปรับทักษะเพื่อใช้กับงานจริงที่ออฟฟิศ แต่หัวหน้างานยังไม่อนุมัติ',
      hasStarted: false,
      missingDays: 5,
      isBlocked: true,
      blockedDetail: 'ติดภาระงานประจำ ไม่สามารถเริ่มงานโครงการได้ตามกำหนด',
      status: 'PENDING',
      staff: CORE_STAFF[1]
    },
    {
      fullName: 'ณัฐวุฒิ เจริญผล',
      groupType: 'STUDENT',
      device: 'MOBILE',
      confidence: 'LOW',
      requestedHelp: true,
      helpDetail: 'ขาดความมั่นใจ กลัวทำงานกลุ่มไม่ทันเพื่อน ต้องการโค้ชประกบตัวต่อตัว',
      hasStarted: true,
      missingDays: 3,
      isBlocked: true,
      blockedDetail: 'ระบบที่เขียนเกิดข้อผิดพลาดรันไม่ผ่านและไม่กล้าถามในกลุ่มใหญ่',
      status: 'PENDING',
      staff: CORE_STAFF[2]
    },
    {
      fullName: 'ธัญญารัตน์ ศรีสวัสดิ์',
      groupType: 'EARLY_CAREER',
      device: 'MOBILE',
      confidence: 'MEDIUM',
      requestedHelp: true,
      helpDetail: 'สัญญาณอินเทอร์เน็ตที่ทำงานช้ามาก ส่งรายงานประจำสัปดาห์ไม่สำเร็จ',
      hasStarted: true,
      missingDays: 6,
      isBlocked: false,
      blockedDetail: null,
      status: 'PENDING',
      staff: CORE_STAFF[0]
    },
    {
      fullName: 'ปรเมศวร์ วงศ์สว่าง',
      groupType: 'STUDENT',
      device: 'DESKTOP',
      confidence: 'LOW',
      requestedHelp: false,
      helpDetail: null,
      hasStarted: false,
      missingDays: 7,
      isBlocked: true,
      blockedDetail: 'ยังไม่ได้เริ่มสเต็ปแรกเลย และขาดการติดต่อมาเกิน 1 สัปดาห์แล้ว',
      status: 'PENDING',
      staff: CORE_STAFF[1]
    },
    {
      fullName: 'ศศิธร สัจจา',
      groupType: 'EARLY_CAREER',
      device: 'MOBILE',
      confidence: 'LOW',
      requestedHelp: true,
      helpDetail: 'ขอเอกสารสรุปทักษะแบบภาษาไทยสั้นๆ อ่านในโทรศัพท์ง่ายๆ',
      hasStarted: true,
      missingDays: 4,
      isBlocked: true,
      blockedDetail: 'เนื้อหายากเกินไป อ่านไม่ทัน',
      status: 'PENDING',
      staff: CORE_STAFF[2]
    },
    // Incomplete Data cases (ทดสอบระบบ: ต้องแสดง 'ต้องตรวจสอบข้อมูล')
    {
      fullName: 'ชาคริต แก้ววิเชียร',
      groupType: 'STUDENT',
      device: 'MOBILE',
      confidence: 'MEDIUM',
      requestedHelp: false,
      helpDetail: null,
      hasStarted: true,
      missingDays: null, // missing critical data
      isIncomplete: true,
      isBlocked: false,
      blockedDetail: null,
      status: 'PENDING',
      staff: CORE_STAFF[0]
    },
    {
      fullName: 'ดวงใจ ประเสริฐยิ่ง',
      groupType: 'EARLY_CAREER',
      device: 'MOBILE',
      confidence: 'LOW',
      requestedHelp: false,
      helpDetail: null,
      hasStarted: null, // missing start status
      isIncomplete: true,
      missingDays: 2,
      isBlocked: false,
      blockedDetail: null,
      status: 'PENDING',
      staff: CORE_STAFF[1]
    },
    // Contacted cases (อยู่ระหว่างการติดตาม)
    {
      fullName: 'วริศรา ภัทรากร',
      groupType: 'STUDENT',
      device: 'MOBILE',
      confidence: 'LOW',
      requestedHelp: true,
      helpDetail: 'สอบถามเรื่องการปรับใช้โปรแกรมบนโทรศัพท์',
      hasStarted: true,
      missingDays: 1,
      isBlocked: false,
      blockedDetail: null,
      status: 'CONTACTED',
      staff: CORE_STAFF[2],
      lastContacted: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
    },
    {
      fullName: 'ภานุพงศ์ ทองอยู่',
      groupType: 'EARLY_CAREER',
      device: 'DESKTOP',
      confidence: 'MEDIUM',
      requestedHelp: true,
      helpDetail: 'ปรึกษาแนวทางทำเคสโปรเจกต์งานขาย',
      hasStarted: true,
      missingDays: 0,
      isBlocked: false,
      blockedDetail: null,
      status: 'CONTACTED',
      staff: CORE_STAFF[0],
      lastContacted: new Date(Date.now() - 48 * 3600 * 1000).toISOString()
    },
    // Resolved cases (ปิดเรื่องแล้วภายใน 14 วัน)
    {
      fullName: 'พิมพ์ชนก จันทร์เพ็ญ',
      groupType: 'STUDENT',
      device: 'DESKTOP',
      confidence: 'HIGH',
      requestedHelp: false,
      helpDetail: null,
      hasStarted: true,
      missingDays: 0,
      isBlocked: false,
      blockedDetail: null,
      status: 'RESOLVED',
      staff: CORE_STAFF[1],
      lastContacted: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString()
    }
  ];

  // Fill in the rest up to 60 learners
  for (let i = 1; i <= 60; i++) {
    const id = `LN-${String(i).padStart(3, '0')}`;
    let base = scenarios[i - 1];

    if (!base) {
      const fName = THAI_FIRST_NAMES[(i - 1) % THAI_FIRST_NAMES.length];
      const lName = THAI_LAST_NAMES[(i - 1) % THAI_LAST_NAMES.length];
      const isStudent = i % 2 === 0;
      const isMobile = i % 3 === 0 || i % 5 === 0;
      const hasHelp = i % 7 === 0;
      const notStarted = i % 11 === 0;
      const missing = (i % 6);
      const isBlocked = i % 9 === 0;
      const staff = CORE_STAFF[(i - 1) % CORE_STAFF.length];

      base = {
        fullName: `${fName} ${lName}`,
        groupType: isStudent ? 'STUDENT' : 'EARLY_CAREER',
        device: isMobile ? 'MOBILE' : 'DESKTOP',
        confidence: i % 4 === 0 ? 'LOW' : (i % 3 === 0 ? 'HIGH' : 'MEDIUM'),
        requestedHelp: hasHelp,
        helpDetail: hasHelp ? 'ต้องการแนวทางเพิ่มเติมเกี่ยวกับการประยุกต์ใช้ทักษะ' : null,
        hasStarted: !notStarted,
        missingDays: missing,
        isBlocked: isBlocked,
        blockedDetail: isBlocked ? 'กำลังปรับแก้แผนงานให้เข้ากับเวลาเรียน/ทำงาน' : null,
        status: 'PENDING',
        staff: staff
      };
    }

    const learner = {
      id,
      full_name: base.fullName,
      phone: `08${(90000000 + i * 11111).toString().slice(0, 8)}`,
      primary_device: base.device,
      group_type: base.groupType,
      confidence_level: base.confidence,
      requested_help: Boolean(base.requestedHelp),
      help_request_detail: base.helpDetail || null,
      has_started: base.hasStarted !== undefined ? base.hasStarted : true,
      missing_days: base.missingDays !== undefined ? base.missingDays : 0,
      is_blocked: Boolean(base.isBlocked),
      blocked_detail: base.blockedDetail || null,
      status: base.status || 'PENDING',
      assigned_staff: base.staff || CORE_STAFF[(i - 1) % CORE_STAFF.length],
      last_contacted_at: base.lastContacted || null,
      followup_due_days: 14,
      is_data_incomplete: Boolean(base.isIncomplete),
      created_at: new Date(Date.now() - (60 - i) * 3600 * 1000).toISOString(),
      updated_at: new Date().toISOString()
    };

    learners.push(learner);
  }

  return learners;
}

// In-Memory store fallback
let inMemoryLearners = generate60Learners();
let inMemoryLogs = [
  {
    id: 'LOG-001',
    learner_id: 'LN-009',
    staff_name: CORE_STAFF[2],
    channel: 'LINE',
    note: 'ติดต่อแนะนำวิธีการบันทึกข้อมูลและส่งลิงก์คู่มือฉบับย่อบนมือถือ ผู้เรียนเข้าใจแล้วและจะส่งการบ้านภายในพรุ่งนี้',
    new_status: 'CONTACTED',
    next_action: 'นัดตรวจสอบผลการส่งงานอีกครั้งใน 3 วัน',
    created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'LOG-002',
    learner_id: 'LN-011',
    staff_name: CORE_STAFF[1],
    channel: 'PHONE',
    note: 'โทรศัพท์คุยเพื่อปิดเคส ผู้เรียนประยุกต์ทักษะจัดทำโปรเจกต์จริงเสร็จสมบูรณ์ และมีผลประเมินผ่านเกณฑ์ 14 วัน',
    new_status: 'RESOLVED',
    next_action: 'ออกใบรับรองการผ่านโครงการ',
    created_at: new Date(Date.now() - 72 * 3600 * 1000).toISOString()
  }
];

// Helper to enrich learner with calculated priority
function enrichLearner(learner) {
  const priority = calculatePriority(learner);
  return {
    ...learner,
    priority_score: priority.score,
    priority_level: priority.level,
    priority_label: priority.label,
    badge_class: priority.badgeClass,
    reasons: priority.reasons,
    recommended_action: priority.recommendedAction
  };
}

async function getAllLearners(filters = {}) {
  const isAvailable = await checkSupabaseHealth();
  let list = [];

  if (isAvailable && supabase) {
    try {
      const { data, error } = await supabase.from('learners').select('*');
      if (!error && data && data.length > 0) {
        list = data;
      } else {
        list = inMemoryLearners;
      }
    } catch (e) {
      list = inMemoryLearners;
    }
  } else {
    list = inMemoryLearners;
  }

  // Enrich with calculated priority
  let enriched = list.map(enrichLearner);

  // Sorting: By priority level severity and score descending
  const levelWeights = {
    'CRITICAL': 400,
    'NEEDS_CHECK': 300,
    'MEDIUM': 200,
    'NORMAL': 100,
    'RESOLVED': 0
  };

  enriched.sort((a, b) => {
    // If pending vs resolved
    if (a.status === 'RESOLVED' && b.status !== 'RESOLVED') return 1;
    if (b.status === 'RESOLVED' && a.status !== 'RESOLVED') return -1;

    const weightA = (levelWeights[a.priority_level] || 0) + a.priority_score;
    const weightB = (levelWeights[b.priority_level] || 0) + b.priority_score;
    return weightB - weightA;
  });

  // Apply filters
  if (filters.status && filters.status !== 'ALL') {
    enriched = enriched.filter(l => l.status === filters.status);
  }
  if (filters.priority && filters.priority !== 'ALL') {
    enriched = enriched.filter(l => l.priority_level === filters.priority);
  }
  if (filters.staff && filters.staff !== 'ALL') {
    enriched = enriched.filter(l => l.assigned_staff === filters.staff);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase().trim();
    enriched = enriched.filter(l =>
      l.full_name.toLowerCase().includes(q) ||
      l.id.toLowerCase().includes(q) ||
      (l.phone && l.phone.includes(q))
    );
  }

  return enriched;
}

async function getLearnerById(id) {
  const isAvailable = await checkSupabaseHealth();
  let learner = null;

  if (isAvailable && supabase) {
    try {
      const { data, error } = await supabase.from('learners').select('*').eq('id', id).single();
      if (!error && data) learner = data;
    } catch (e) {
      learner = null;
    }
  }

  if (!learner) {
    learner = inMemoryLearners.find(l => l.id === id);
  }

  if (!learner) return null;
  return enrichLearner(learner);
}

async function updateLearner(id, updates) {
  const isAvailable = await checkSupabaseHealth();
  updates.updated_at = new Date().toISOString();

  if (isAvailable && supabase) {
    try {
      await supabase.from('learners').update(updates).eq('id', id);
    } catch (e) {
      console.warn('[DataStore] Supabase update failed, fallback to memory');
    }
  }

  const idx = inMemoryLearners.findIndex(l => l.id === id);
  if (idx !== -1) {
    inMemoryLearners[idx] = { ...inMemoryLearners[idx], ...updates };
    return enrichLearner(inMemoryLearners[idx]);
  }
  return null;
}

async function addFollowupLog(logData) {
  // Validate duplicate
  const recentDuplicate = inMemoryLogs.find(log =>
    log.learner_id === logData.learner_id &&
    log.note.trim() === logData.note.trim() &&
    Math.abs(new Date(log.created_at).getTime() - Date.now()) < 15000 // within 15 seconds
  );

  if (recentDuplicate) {
    const err = new Error('ตรวจพบรายการบันทึกซ้ำซ้อน กรุณารอสักครู่หรือตรวจสอบประวัติด้านล่าง');
    err.status = 409;
    throw err;
  }

  const newLog = {
    id: `LOG-${Date.now().toString().slice(-6)}`,
    learner_id: logData.learner_id,
    staff_name: logData.staff_name,
    channel: logData.channel,
    note: logData.note,
    new_status: logData.new_status,
    next_action: logData.next_action || '',
    created_at: new Date().toISOString()
  };

  const isAvailable = await checkSupabaseHealth();
  if (isAvailable && supabase) {
    try {
      await supabase.from('followup_logs').insert([newLog]);
    } catch (e) {
      console.warn('[DataStore] Supabase insert log failed, fallback to memory');
    }
  }

  inMemoryLogs.unshift(newLog);

  // Update learner status and last_contacted_at
  await updateLearner(logData.learner_id, {
    status: logData.new_status,
    last_contacted_at: newLog.created_at,
    assigned_staff: logData.staff_name
  });

  return newLog;
}

async function getFollowupLogs(learnerId) {
  const isAvailable = await checkSupabaseHealth();
  if (isAvailable && supabase) {
    try {
      const { data, error } = await supabase
        .from('followup_logs')
        .select('*')
        .eq('learner_id', learnerId)
        .order('created_at', { ascending: false });
      if (!error && data) return data;
    } catch (e) {
      // fallback
    }
  }

  return inMemoryLogs
    .filter(log => log.learner_id === learnerId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

async function getStats() {
  const all = await getAllLearners();
  const total = all.length;
  const critical = all.filter(l => l.priority_level === 'CRITICAL' && l.status !== 'RESOLVED').length;
  const medium = all.filter(l => l.priority_level === 'MEDIUM' && l.status !== 'RESOLVED').length;
  const needsCheck = all.filter(l => l.priority_level === 'NEEDS_CHECK').length;
  const normal = all.filter(l => l.priority_level === 'NORMAL' && l.status !== 'RESOLVED').length;

  const pending = all.filter(l => l.status === 'PENDING').length;
  const contacted = all.filter(l => l.status === 'CONTACTED').length;
  const resolved = all.filter(l => l.status === 'RESOLVED').length;

  const mobileUsers = all.filter(l => l.primary_device === 'MOBILE').length;
  const requestedHelp = all.filter(l => l.requested_help).length;

  return {
    total,
    critical,
    medium,
    normal,
    needsCheck,
    statusCounts: {
      pending,
      contacted,
      resolved
    },
    indicators: {
      mobileUsers,
      requestedHelp,
      fourteenDaysResolvedPercent: total > 0 ? Math.round((resolved / total) * 100) : 0
    },
    staffList: CORE_STAFF
  };
}

function resetData() {
  inMemoryLearners = generate60Learners();
  inMemoryLogs = [
    {
      id: 'LOG-001',
      learner_id: 'LN-009',
      staff_name: CORE_STAFF[2],
      channel: 'LINE',
      note: 'ติดต่อแนะนำวิธีการบันทึกข้อมูลและส่งลิงก์คู่มือฉบับย่อบนมือถือ ผู้เรียนเข้าใจแล้วและจะส่งการบ้านภายในพรุ่งนี้',
      new_status: 'CONTACTED',
      next_action: 'นัดตรวจสอบผลการส่งงานอีกครั้งใน 3 วัน',
      created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
    },
    {
      id: 'LOG-002',
      learner_id: 'LN-011',
      staff_name: CORE_STAFF[1],
      channel: 'PHONE',
      note: 'โทรศัพท์คุยเพื่อปิดเคส ผู้เรียนประยุกต์ทักษะจัดทำโปรเจกต์จริงเสร็จสมบูรณ์ และมีผลประเมินผ่านเกณฑ์ 14 วัน',
      new_status: 'RESOLVED',
      next_action: 'ออกใบรับรองการผ่านโครงการ',
      created_at: new Date(Date.now() - 72 * 3600 * 1000).toISOString()
    }
  ];
  return { success: true, count: inMemoryLearners.length };
}

module.exports = {
  getAllLearners,
  getLearnerById,
  updateLearner,
  addFollowupLog,
  getFollowupLogs,
  getStats,
  resetData,
  CORE_STAFF
};
