'use client';

import React, { useState } from 'react';
import { submitFollowup } from '../lib/api';

const CHANNELS = [
  { id: 'PHONE', label: '📞 โทรศัพท์โดยตรง (แนะนำสำหรับเคสด่วน/มือถือ)' },
  { id: 'LINE', label: '💬 LINE Official / LINE Chat' },
  { id: 'ONLINE_MEETING', label: '💻 นัดพบออนไลน์ (Google Meet / Zoom)' },
  { id: 'ONSITE', label: '🏢 ปรึกษาตัวต่อตัว ณ สถานที่' }
];

export default function FollowupModal({ 
  learner, 
  staffList, 
  onClose, 
  onSuccess, 
  showToast 
}) {
  const [staffName, setStaffName] = useState(learner.assigned_staff || (staffList && staffList[0]) || '');
  const [channel, setChannel] = useState('PHONE');
  const [newStatus, setNewStatus] = useState(learner.status === 'PENDING' ? 'CONTACTED' : learner.status);
  const [note, setNote] = useState('');
  const [nextAction, setNextAction] = useState('ติดตามความคืบหน้าการนำทักษะไปใช้ในอีก 3 วัน');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [warningMessage, setWarningMessage] = useState('');

  if (!learner) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setWarningMessage('');

    // Client-side Validation
    if (!note.trim()) {
      setErrorMessage('กรุณากรอกบันทึกผลการติดตาม (ห้ามเว้นว่าง)');
      return;
    }

    if (note.trim().length < 5) {
      setErrorMessage('บันทึกผลการติดตามต้องมีความยาวอย่างน้อย 5 ตัวอักษร เพื่อให้เป็นข้อมูลอ้างอิงที่มีประโยชน์');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await submitFollowup({
        learner_id: learner.id,
        staff_name: staffName,
        channel,
        note: note.trim(),
        new_status: newStatus,
        next_action: nextAction.trim()
      });

      showToast('success', `บันทึกการติดตาม "${learner.full_name}" สำเร็จเรียบร้อย`);
      onSuccess(response.data);
      onClose();
    } catch (err) {
      if (err.status === 409 || err.type === 'DUPLICATE_ENTRY') {
        setWarningMessage(`⚠️ ${err.message || 'ตรวจพบการบันทึกซ้ำซ้อน'}`);
      } else {
        setErrorMessage(err.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="utility-label-pink" style={{ marginBottom: '0.25rem' }}>
              PROTOCOL ACTION // FOLLOW-UP LOG
            </div>
            <h2 className="modal-title">📞 บันทึกการติดตามผลผู้เรียน</h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-charcoal-70)', marginTop: '0.2rem' }}>
              ผู้เรียน: <strong style={{ color: 'var(--text-charcoal)' }}>{learner.full_name}</strong> ({learner.id}) • {learner.phone}
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>&times;</button>
        </div>

        {errorMessage && (
          <div className="form-error-alert">
            <span>❌</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {warningMessage && (
          <div className="form-warning-alert">
            <span>⚠️</span>
            <span>{warningMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Staff Member */}
          <div className="form-group">
            <label className="form-label">ผู้ดูแลที่ทำการติดต่อ (ทีมหลัก 3 คน)</label>
            <select 
              className="form-control"
              value={staffName}
              onChange={(e) => setStaffName(e.target.value)}
              required
            >
              {staffList.map((st, i) => (
                <option key={i} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Contact Channel */}
          <div className="form-group">
            <label className="form-label">ช่องทางการติดต่อ</label>
            <select 
              className="form-control"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              required
            >
              {CHANNELS.map((ch) => (
                <option key={ch.id} value={ch.id}>{ch.label}</option>
              ))}
            </select>
          </div>

          {/* New Follow-up Status */}
          <div className="form-group">
            <label className="form-label">ปรับเปลี่ยนสถานะการติดตาม</label>
            <select 
              className="form-control"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              required
            >
              <option value="PENDING">⏳ รอติดต่อ (ยังไม่ได้ข้อสรุปหรือติดต่อไม่ได้)</option>
              <option value="CONTACTED">📞 ติดต่อแล้ว (อยู่ระหว่างช่วยเหลือและติดตามผล)</option>
              <option value="RESOLVED">✅ ปิดเรื่อง (ผู้เรียนนำทักษะไปใช้สำเร็จตามกรอบ 14 วัน)</option>
            </select>
          </div>

          {/* Detailed Note */}
          <div className="form-group">
            <label className="form-label">
              บันทึกผลการพูดคุย / การให้ความช่วยเหลือ <span style={{ color: 'var(--critical-text)' }}>*</span>
            </label>
            <textarea 
              className="form-control"
              rows={4}
              placeholder="เช่น โทรศัพท์พูดคุยเรื่องการประยุกต์ใช้ทักษะ ผู้เรียนติดปัญหาการส่งงานผ่านมือถือ ได้ส่งคู่มือย่อและนัดส่งงานวันพรุ่งนี้..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              required
            />
            <div style={{ fontSize: '0.75rem', color: 'var(--text-charcoal-50)', marginTop: '0.25rem' }}>
              ความยาว: {note.trim().length} ตัวอักษร (ขั้นต่ำ 5 ตัวอักษรตามเงื่อนไข Validation)
            </div>
          </div>

          {/* Next Action Plan */}
          <div className="form-group">
            <label className="form-label">แผนขั้นตอนถัดไป (Next Action)</label>
            <input 
              type="text"
              className="form-control"
              placeholder="เช่น นัดตรวจผลงานใน 3 วัน หรือ ส่งเอกสารเพิ่มเติม"
              value={nextAction}
              onChange={(e) => setNextAction(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
            <button 
              type="button" 
              className="btn-editorial-pill secondary" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              CANCEL
            </button>
            <button 
              type="submit" 
              className="btn-editorial-pill primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'กำลังบันทึก...' : '💾 บันทึกผลการติดตาม'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
