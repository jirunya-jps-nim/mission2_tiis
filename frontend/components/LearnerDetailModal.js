'use client';

import React, { useEffect, useState } from 'react';
import { fetchLearnerDetail } from '../lib/api';

export default function LearnerDetailModal({ learner, onClose, onOpenFollowup }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!learner) return;
    let isMounted = true;
    fetchLearnerDetail(learner.id)
      .then((res) => {
        if (isMounted) {
          setDetail(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching details:', err);
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, [learner]);

  if (!learner) return null;

  const current = detail || learner;
  const logs = current.followup_history || [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '720px' }}>
        <div className="modal-header">
          <div>
            <div className="utility-label-pink" style={{ marginBottom: '0.25rem' }}>
              LEARNER DOSSIER // 14-DAY HISTORY
            </div>
            <h2 className="modal-title">📄 รายละเอียดและประวัติการติดตาม 14 วัน</h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-charcoal-70)', marginTop: '0.2rem' }}>
              {current.full_name} ({current.id}) • {current.phone}
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>&times;</button>
        </div>

        {/* Profile Summary Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', 
          gap: '0.85rem', 
          marginBottom: '1.5rem',
          background: 'var(--bg-secondary)',
          padding: '1.25rem',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)'
        }}>
          <div>
            <div style={{ fontSize: '9px', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-charcoal-50)' }}>กลุ่มผู้เรียน</div>
            <div style={{ fontWeight: 700, color: 'var(--text-charcoal)' }}>
              {current.group_type === 'STUDENT' ? '🎓 นักศึกษา' : '💼 ผู้เริ่มทำงาน'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '9px', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-charcoal-50)' }}>อุปกรณ์หลักในการเรียน</div>
            <div style={{ fontWeight: 700, color: 'var(--text-charcoal)' }}>
              {current.primary_device === 'MOBILE' ? '📱 สมาร์ทโฟน' : '💻 คอมพิวเตอร์'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '9px', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-charcoal-50)' }}>ระดับความมั่นใจ</div>
            <div style={{ fontWeight: 700, color: 'var(--text-charcoal)' }}>
              {current.confidence_level === 'LOW' ? '⚠️ ขาดความมั่นใจ' : current.confidence_level === 'HIGH' ? '⭐ มั่นใจสูง' : 'ปกติ'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '9px', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-charcoal-50)' }}>สถานะการติดตาม</div>
            <div style={{ fontWeight: 700, color: 'var(--text-charcoal)' }}>
              {current.status === 'RESOLVED' ? '✅ ปิดเรื่องแล้ว' : current.status === 'CONTACTED' ? '📞 ติดต่อแล้ว' : '⏳ รอติดต่อ'}
            </div>
          </div>
        </div>

        {/* 4 Risk Signals Overview */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-charcoal)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            สัญญาณความเสี่ยงตามภารกิจที่ 1:
          </h4>
          <div className="portfolio-signals" style={{ margin: 0 }}>
            <div className={`signal-chip ${current.requested_help ? 'active-danger' : ''}`}>
              <span>{current.requested_help ? '🆘' : '⚪'}</span>
              <span>ขอความช่วยเหลือ: {current.requested_help ? 'ใช่' : 'ไม่'}</span>
            </div>
            <div className={`signal-chip ${current.has_started === false ? 'active-warning' : ''}`}>
              <span>{current.has_started === false ? '⏱️' : '⚪'}</span>
              <span>เริ่มปฏิบัติงาน: {current.has_started === false ? 'ยังไม่เริ่ม' : 'เริ่มแล้ว'}</span>
            </div>
            <div className={`signal-chip ${current.missing_days >= 3 ? 'active-danger' : ''}`}>
              <span>{current.missing_days >= 3 ? '📅' : '⚪'}</span>
              <span>ขาดส่งรายงาน: {current.missing_days !== null ? `${current.missing_days} วัน` : 'ไม่ระบุ'}</span>
            </div>
            <div className={`signal-chip ${current.is_blocked ? 'active-danger' : ''}`}>
              <span>{current.is_blocked ? '🚧' : '⚪'}</span>
              <span>ติดอุปสรรค: {current.is_blocked ? 'พบปัญหา' : 'ปกติ'}</span>
            </div>
          </div>
        </div>

        {/* Reason breakdown */}
        {current.reasons && (
          <div style={{ 
            background: 'var(--bg-secondary)', 
            borderLeft: '3px solid var(--accent-pink)',
            padding: '0.85rem 1.1rem',
            borderRadius: '0 8px 8px 0',
            fontSize: '0.85rem',
            marginBottom: '1.5rem',
            color: 'var(--text-charcoal)'
          }}>
            <div style={{ fontSize: '9px', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-charcoal-70)', marginBottom: '0.35rem' }}>
              💡 การประเมินและข้อแนะนำการติดตาม
            </div>
            {current.reasons.map((r, i) => (
              <div key={i} style={{ marginBottom: '0.2rem' }}>• {r}</div>
            ))}
            {current.recommended_action && (
              <div style={{ marginTop: '0.4rem', color: 'var(--text-charcoal)', fontWeight: 700 }}>
                คำแนะนำ: {current.recommended_action}
              </div>
            )}
          </div>
        )}

        {/* Followup History List */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-charcoal)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              📜 ประวัติบันทึกการติดตาม ({logs.length} ครั้ง)
            </h4>
            <button 
              className="btn-editorial-pill primary"
              style={{ fontSize: '10px', padding: '0.45rem 1rem' }}
              onClick={() => {
                onClose();
                onOpenFollowup(current);
              }}
            >
              + บันทึกเพิ่ม
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-charcoal-50)' }}>
              กำลังโหลดประวัติ...
            </div>
          ) : logs.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '1.75rem', 
              background: 'var(--bg-secondary)', 
              borderRadius: '12px', 
              color: 'var(--text-charcoal-70)',
              fontSize: '0.85rem',
              border: '1px solid var(--border-subtle)'
            }}>
              ยังไม่มีประวัติการติดต่อสำหรับผู้เรียนรายนี้ คลิกปุ่ม "+ บันทึกเพิ่ม" เพื่อเริ่มการติดตาม
            </div>
          ) : (
            <div>
              {logs.map((log) => (
                <div key={log.id} className="history-item">
                  <div className="history-item-header">
                    <span>👤 {log.staff_name} • ผ่าน {log.channel}</span>
                    <span>{new Date(log.created_at).toLocaleString('th-TH')}</span>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-charcoal)', fontWeight: 600, marginBottom: '0.35rem' }}>
                    "{log.note}"
                  </div>
                  {log.next_action && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--accent-pink-hover)', fontWeight: 600 }}>
                      ➡️ ขั้นตอนถัดไป: {log.next_action}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
          <button className="btn-editorial-pill secondary" onClick={onClose}>
            CLOSE DOSSIER
          </button>
        </div>
      </div>
    </div>
  );
}
