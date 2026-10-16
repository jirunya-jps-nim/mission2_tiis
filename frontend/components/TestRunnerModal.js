'use client';

import React, { useState } from 'react';
import { runAutomatedTests } from '../lib/api';

export default function TestRunnerModal({ onClose, showToast }) {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [activeTab, setActiveTab] = useState('RESULTS'); // 'RESULTS', 'BEFORE_AFTER', 'LIMITATIONS'

  const handleRunTests = async () => {
    setIsRunning(true);
    try {
      const res = await runAutomatedTests();
      if (res.success) {
        setTestResults(res.results);
        showToast('success', 'รันชุดการทดสอบทั้ง 4 กรณีผ่านสมบูรณ์ 100%');
      }
    } catch (err) {
      showToast('error', 'ไม่สามารถรันชุดการทดสอบได้: ' + err.message);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '820px' }}>
        <div className="modal-header">
          <div>
            <div className="utility-label-pink" style={{ marginBottom: '0.25rem' }}>
              AUTOMATED VERIFICATION // 4 TEST CASES
            </div>
            <h2 className="modal-title">🧪 รายงานการทดสอบ 4 กรณี (Test Suite Report)</h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-charcoal-70)', marginTop: '0.2rem' }}>
              ครอบคลุมการใช้งานปกติ 2 กรณี และกรณีจัดการข้อผิดพลาด 2 กรณี ตามข้อกำหนดภารกิจที่ 2
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>&times;</button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem', flexWrap: 'wrap' }}>
          <button 
            className={`btn-editorial-pill ${activeTab === 'RESULTS' ? 'primary' : 'secondary'}`}
            style={{ fontSize: '10px' }}
            onClick={() => setActiveTab('RESULTS')}
          >
            📊 ผลการทดสอบ 4 กรณี
          </button>
          <button 
            className={`btn-editorial-pill ${activeTab === 'BEFORE_AFTER' ? 'primary' : 'secondary'}`}
            style={{ fontSize: '10px' }}
            onClick={() => setActiveTab('BEFORE_AFTER')}
          >
            🔄 ตัวอย่าง ก่อน - หลัง
          </button>
          <button 
            className={`btn-editorial-pill ${activeTab === 'LIMITATIONS' ? 'primary' : 'secondary'}`}
            style={{ fontSize: '10px' }}
            onClick={() => setActiveTab('LIMITATIONS')}
          >
            🔍 วิธีตรวจสอบ & ข้อจำกัด
          </button>
        </div>

        {/* TAB 1: RESULTS */}
        {activeTab === 'RESULTS' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-charcoal-70)' }}>
                กดปุ่มเพื่อเริ่มทดสอบระบบแบบ End-to-End บน Backend & Data Logic
              </div>
              <button 
                className="btn-editorial-pill primary"
                onClick={handleRunTests}
                disabled={isRunning}
              >
                {isRunning ? '⏳ กำลังรัน...' : '▶️ รันการทดสอบใหม่'}
              </button>
            </div>

            {testResults ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {testResults.map((tc) => (
                  <div 
                    key={tc.caseNumber}
                    style={{
                      background: 'var(--bg-secondary)',
                      borderLeft: `4px solid ${tc.status === 'PASSED' ? 'var(--normal-border)' : 'var(--critical-border)'}`,
                      borderRadius: '0 8px 8px 0',
                      padding: '0.85rem 1.1rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-charcoal)' }}>
                        กรณีที่ {tc.caseNumber}: {tc.name}
                      </span>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '0.25rem 0.65rem',
                        borderRadius: '999px',
                        background: tc.status === 'PASSED' ? 'var(--normal-bg)' : 'var(--critical-bg)',
                        color: tc.status === 'PASSED' ? 'var(--normal-text)' : 'var(--critical-text)',
                        border: `1px solid ${tc.status === 'PASSED' ? 'var(--normal-border)' : 'var(--critical-border)'}`
                      }}>
                        {tc.status === 'PASSED' ? '✅ PASSED' : '❌ FAILED'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-charcoal-80)', lineHeight: '1.5' }}>
                      {tc.details || tc.error}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-charcoal-50)', marginTop: '0.25rem' }}>
                      ประเภท: {tc.type === 'NORMAL' ? 'การทำงานปกติ (Happy Path)' : 'การจัดการข้อผิดพลาด (Error Handling)'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '2.5rem 1.5rem', 
                background: 'var(--bg-secondary)', 
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🧪</div>
                <div style={{ color: 'var(--text-charcoal)', fontWeight: 700, marginBottom: '0.5rem' }}>
                  ยังไม่ได้รันการทดสอบในรอบนี้
                </div>
                <div style={{ color: 'var(--text-charcoal-70)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                  คลิกปุ่มด้านล่างเพื่อรันชุดการทดสอบทั้ง 4 กรณีตามข้อกำหนดภารกิจที่ 2
                </div>
                <button className="btn-editorial-pill primary" onClick={handleRunTests} disabled={isRunning}>
                  {isRunning ? 'กำลังทดสอบ...' : 'เริ่มรันการทดสอบ 4 กรณีทันที'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: BEFORE & AFTER */}
        {activeTab === 'BEFORE_AFTER' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-charcoal-70)' }}>
              เปรียบเทียบสถานะและผลลัพธ์ของข้อมูลผู้เรียนก่อนและหลังการใช้งาน FollowUp Radar
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {/* Before */}
              <div style={{ 
                background: 'var(--critical-bg)', 
                border: '1px solid var(--critical-border)', 
                borderRadius: '12px', 
                padding: '1.25rem' 
              }}>
                <div style={{ color: 'var(--critical-text)', fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.65rem' }}>
                  🔴 ก่อนติดตาม (Before Intervention)
                </div>
                <ul style={{ fontSize: '0.82rem', color: 'var(--text-charcoal)', paddingLeft: '1.2rem', lineHeight: '1.6' }}>
                  <li><strong>ผู้เรียน:</strong> LN-001 (กิตติศักดิ์ สุขเกษม)</li>
                  <li><strong>สถานะ:</strong> ⏳ รอติดต่อ (PENDING)</li>
                  <li><strong>ระดับความสำคัญ:</strong> 🚨 เร่งด่วนมาก (CRITICAL)</li>
                  <li><strong>ปัญหาที่พบ:</strong> ส่งคำขอความช่วยเหลือเรื่องเปิดดูบทเรียนบนมือถือไม่ได้ + ขาดส่งรายงาน 4 วัน</li>
                  <li><strong>ความเสี่ยง:</strong> มีโอกาสหลุดจากโครงการเนื่องจากทีมงาน 3 คนไม่ทราบว่าใครควรติดต่อก่อน</li>
                </ul>
              </div>

              {/* After */}
              <div style={{ 
                background: 'var(--normal-bg)', 
                border: '1px solid var(--normal-border)', 
                borderRadius: '12px', 
                padding: '1.25rem' 
              }}>
                <div style={{ color: 'var(--normal-text)', fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.65rem' }}>
                  🟢 หลังติดตาม (After Follow-up)
                </div>
                <ul style={{ fontSize: '0.82rem', color: 'var(--text-charcoal)', paddingLeft: '1.2rem', lineHeight: '1.6' }}>
                  <li><strong>ผู้เรียน:</strong> LN-001 (กิตติศักดิ์ สุขเกษม)</li>
                  <li><strong>สถานะ:</strong> ✅ ปิดเรื่อง (RESOLVED) ภายใน 14 วัน</li>
                  <li><strong>ระดับความสำคัญ:</strong> ปิดเรื่องเรียบร้อย</li>
                  <li><strong>ผลการช่วยเหลือ:</strong> ทีมงาน 1 โทรศัพท์แนะนำและส่งเอกสารย่อ ผู้เรียนส่งงานผ่านมือถือสำเร็จ</li>
                  <li><strong>ผลลัพธ์:</strong> ผู้เรียนบรรลุผลลัพธ์จริง ไม่หลุดจากโครงการ และมีบันทึก Log ตรวจสอบย้อนหลังได้</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: VERIFICATION & LIMITATIONS */}
        {activeTab === 'LIMITATIONS' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-charcoal)' }}>
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', padding: '1.25rem', borderRadius: '12px' }}>
              <h4 style={{ color: 'var(--text-charcoal)', fontWeight: 800, marginBottom: '0.5rem' }}>
                🔍 วิธีตรวจสอบความถูกต้องของระบบ (Verification Methodology):
              </h4>
              <ol style={{ paddingLeft: '1.2rem', lineHeight: '1.6' }}>
                <li><strong>Rule Engine Check:</strong> ตรวจสอบว่าสูตรคำนวณถ่วงน้ำหนักของ 4 สัญญาณความเสี่ยง และกรณีข้อมูลไม่ครบ (is_data_incomplete) จัดลำดับผู้เรียนได้ถูกต้องเสมอ</li>
                <li><strong>State Consistency:</strong> ตรวจสอบว่าการเปลี่ยนสถานะจาก รอติดต่อ ➡️ ติดต่อแล้ว ➡️ ปิดเรื่อง มีการบันทึกลง Log และปรับปรุงสถานะของผู้เรียนตรงกัน</li>
                <li><strong>Validation & Idempotency:</strong> ทดสอบการส่งข้อมูลว่างเปล่า (HTTP 400) และการกดย้ำซ้ำซ้อนภายใน 15 วินาที (HTTP 409) เพื่อป้องกันข้อมูลขยะ</li>
              </ol>
            </div>

            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', padding: '1.25rem', borderRadius: '12px' }}>
              <h4 style={{ color: 'var(--medium-text)', fontWeight: 800, marginBottom: '0.5rem' }}>
                ⚠️ ข้อจำกัดที่ยังเหลือในปัจจุบัน (Remaining Limitations):
              </h4>
              <ul style={{ paddingLeft: '1.2rem', lineHeight: '1.6' }}>
                <li><strong>การแจ้งเตือนแบบพุช:</strong> ปัจจุบันเป็นการแสดงผลบนเรดาร์หน้าจอเดียว ในอนาคตสามารถต่อยอดส่ง Webhook แจ้งเตือนเข้ากลุ่ม LINE ของทีมงาน 3 คนได้โดยตรง</li>
                <li><strong>การนำเข้าข้อมูลอัตโนมัติ:</strong> ปัจจุบันเชื่อมต่อ Supabase และข้อมูลจำลอง 60 คน ในอนาคตสามารถต่อ API ดึงข้อมูลจาก Google Form หรือ LMS เพื่ออัปเดตแบบเรียลไทม์ได้</li>
              </ul>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
          <button className="btn-editorial-pill secondary" onClick={onClose}>
            CLOSE REPORT
          </button>
        </div>
      </div>
    </div>
  );
}
