const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Fetch all learners with optional filters (search, status, priority, staff)
 */
export async function fetchLearners(filters = {}) {
  const query = new URLSearchParams();
  if (filters.status && filters.status !== 'ALL') query.set('status', filters.status);
  if (filters.priority && filters.priority !== 'ALL') query.set('priority', filters.priority);
  if (filters.staff && filters.staff !== 'ALL') query.set('staff', filters.staff);
  if (filters.search) query.set('search', filters.search);

  const res = await fetch(`${API_BASE}/learners?${query.toString()}`, {
    cache: 'no-store'
  });
  if (!res.ok) {
    throw new Error('ไม่สามารถดึงข้อมูลรายชื่อผู้เรียนได้');
  }
  return res.json();
}

/**
 * Fetch single learner detail with followup history
 */
export async function fetchLearnerDetail(id) {
  const res = await fetch(`${API_BASE}/learners/${id}`, {
    cache: 'no-store'
  });
  if (!res.ok) {
    throw new Error(`ไม่พบข้อมูลผู้เรียนรหัส ${id}`);
  }
  return res.json();
}

/**
 * Record a followup log with duplicate detection and status change
 */
export async function submitFollowup(data) {
  const res = await fetch(`${API_BASE}/followups`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  const body = await res.json();
  if (!res.ok) {
    const error = new Error(body.message || 'เกิดข้อผิดพลาดในการบันทึก');
    error.status = res.status;
    error.type = body.error_type;
    throw error;
  }
  return body;
}

/**
 * Fetch dashboard overview metrics and staff workload
 */
export async function fetchStats() {
  const res = await fetch(`${API_BASE}/stats`, {
    cache: 'no-store'
  });
  if (!res.ok) {
    throw new Error('ไม่สามารถดึงข้อมูลสถิติได้');
  }
  return res.json();
}

/**
 * Reset data back to 60 original seed records
 */
export async function resetLearnersData() {
  const res = await fetch(`${API_BASE}/learners/reset`, {
    method: 'POST'
  });
  if (!res.ok) {
    throw new Error('ไม่สามารถรีเซ็ตข้อมูลได้');
  }
  return res.json();
}

/**
 * Run automated 4 test cases on backend and return execution report
 */
export async function runAutomatedTests() {
  const res = await fetch(`${API_BASE}/run-tests`, {
    method: 'POST'
  });
  if (!res.ok) {
    throw new Error('ไม่สามารถรันชุดการทดสอบได้');
  }
  return res.json();
}
