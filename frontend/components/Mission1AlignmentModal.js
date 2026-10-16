'use client';

import React from 'react';

export default function Mission1AlignmentModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '820px' }}>
        <div className="modal-header">
          <div>
            <div className="utility-label-pink" style={{ marginBottom: '0.25rem' }}>
              TIIS GOVERNANCE // MISSION 01 COMPLIANCE
            </div>
            <h2 className="modal-title">📋 ความสอดคล้องกับเอกสารภารกิจที่ 1</h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-charcoal-70)', marginTop: '0.2rem' }}>
              โครงการ: FollowUp Radar (ระบบคำนวณลำดับความสำคัญจากสัญญาณความเสี่ยง พร้อมแสดงเหตุผลประกอบ)
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>&times;</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.875rem', color: 'var(--text-charcoal)' }}>
          {/* Section 1 */}
          <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ color: 'var(--text-charcoal)', fontWeight: 800, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              1. กลุ่มเป้าหมายและปัญหาที่เลือก (ตรงตามเอกสารข้อ 1)
            </h4>
            <p style={{ lineHeight: '1.6', color: 'var(--text-charcoal-80)' }}>
              • <strong>กลุ่มเป้าหมาย:</strong> นักศึกษาและผู้เริ่มต้นทำงาน 60 คน ระยะเวลาโครงการ 6 สัปดาห์ งบดำเนินงาน 30,000 บาท ทีมหลัก 3 คน<br />
              • <strong>ปัญหา:</strong> ผู้เรียนติดขัดในการนำทักษะไปใช้จริง แต่มิได้แจ้งข้อมูล ส่งผลให้ทีมหลัก 3 คนไม่ทราบว่าผู้เรียนรายใดควรได้รับการติดตามก่อน<br />
              • <strong>เป้าหมายต้นแบบ:</strong> รวมศูนย์ข้อมูลไว้ในหน้าจอเดียว (Single Pane of Glass) ให้ทีม 3 คนคัดกรองได้ทันทีโดยไม่ซ้ำซ้อน
            </p>
          </div>

          {/* Section 2 */}
          <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ color: 'var(--text-charcoal)', fontWeight: 800, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              2. สัญญาณความเสี่ยง 4 ประการที่นำมาคำนวณ (ตรงตามเอกสารข้อ 2)
            </h4>
            <ul style={{ paddingLeft: '1.2rem', lineHeight: '1.6', color: 'var(--text-charcoal-80)' }}>
              <li><strong>การขอความช่วยเหลือ:</strong> หากผู้เรียนส่งคำร้องขอความช่วยเหลือ ระบบจะดันขึ้นลำดับต้นๆ ทันที</li>
              <li><strong>การยังไม่เริ่มดำเนินการ:</strong> ผู้เรียนที่ยังไม่เริ่มงานจะได้รับการเฝ้าระวังเพื่อไม่ให้หลุดตั้งแต่ต้น</li>
              <li><strong>การขาดการรายงาน:</strong> หากขาดส่งรายงานติดต่อกันเกิน 3-5 วัน ระบบจะแจ้งเตือนความเสี่ยง</li>
              <li><strong>การยังไม่บรรลุผล:</strong> ตรวจพบการติดอุปสรรคและแสดงรายละเอียดปัญหาจริงให้ทีมงานทราบ</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ color: 'var(--text-charcoal)', fontWeight: 800, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              3. การลดอุปสรรคสำหรับผู้ใช้งานทุกกลุ่ม (ตรงตามเอกสารข้อ 5)
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.85rem', marginTop: '0.75rem' }}>
              <div style={{ background: '#ffffff', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ color: 'var(--text-charcoal)' }}>📱 ผู้ใช้โทรศัพท์เป็นหลัก:</strong><br />
                <span style={{ color: 'var(--text-charcoal-70)', fontSize: '0.82rem' }}>
                  จัดหน้ารายการเป็นการ์ดต่อคนบนจอแคบ (Responsive Card View) ใช้งานง่าย ไม่ล้นจอ
                </span>
              </div>
              <div style={{ background: '#ffffff', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ color: 'var(--text-charcoal)' }}>🗣️ ผู้ดูแลที่ไม่ถนัดเทคนิค:</strong><br />
                <span style={{ color: 'var(--text-charcoal-70)', fontSize: '0.82rem' }}>
                  ใช้คำภาษาไทยสั้นๆ ชัดเจน: <em>"รอติดต่อ"</em>, <em>"ติดต่อแล้ว"</em>, <em>"ปิดเรื่อง"</em>
                </span>
              </div>
              <div style={{ background: '#ffffff', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ color: 'var(--text-charcoal)' }}>👁️ ผู้ที่แยกสีไม่ชัด:</strong><br />
                <span style={{ color: 'var(--text-charcoal-70)', fontSize: '0.82rem' }}>
                  ระดับความสำคัญมีทั้ง <em>ไอคอน + ข้อความ + สี</em> (Accessible Colorblind Design)
                </span>
              </div>
              <div style={{ background: '#ffffff', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ color: 'var(--text-charcoal)' }}>🤝 ผู้เรียนที่ไม่มั่นใจ:</strong><br />
                <span style={{ color: 'var(--text-charcoal-70)', fontSize: '0.82rem' }}>
                  แสดงเป็น <em>"ควรติดตาม"</em> ไม่ใช่คะแนนความสามารถ และให้ทีมเป็นผู้ตัดสินใจขั้นสุดท้าย
                </span>
              </div>
              <div style={{ background: '#ffffff', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ color: 'var(--text-charcoal)' }}>🔍 ข้อมูลไม่ครบ:</strong><br />
                <span style={{ color: 'var(--text-charcoal-70)', fontSize: '0.82rem' }}>
                  แสดง <em>"ต้องตรวจสอบข้อมูล"</em> แทนการสรุปว่าเป็นผู้มีปัญหา
                </span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
          <button className="btn-editorial-pill secondary" onClick={onClose}>
            CLOSE ALIGNMENT
          </button>
        </div>
      </div>
    </div>
  );
}
