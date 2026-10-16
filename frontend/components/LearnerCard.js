'use client';

import React from 'react';

export default function LearnerCard({ learner, onOpenFollowup, onOpenDetail, index = 0 }) {
  const isCritical = learner.priority_level === 'CRITICAL';
  const isMedium = learner.priority_level === 'MEDIUM';
  const isCheck = learner.priority_level === 'NEEDS_CHECK';
  const isResolved = learner.status === 'RESOLVED';

  // Device icon & group
  const deviceText = learner.primary_device === 'MOBILE' ? '📱 สมาร์ทโฟน' : '💻 คอมพิวเตอร์';
  const groupText = learner.group_type === 'STUDENT' ? '🎓 นักศึกษา' : '💼 ผู้เริ่มทำงาน';

  // Status mapping
  const statusLabel = 
    learner.status === 'RESOLVED' ? '✅ ปิดเรื่อง (RESOLVED)' :
    learner.status === 'CONTACTED' ? '📞 ติดต่อแล้ว (CONTACTED)' : '⏳ รอติดต่อ (PENDING)';

  // Priority class for badge
  const priorityClass = 
    isCritical ? 'critical' :
    isMedium ? 'medium' :
    isCheck ? 'needscheck' : 'normal';

  // Curated 3:4 editorial imagery per specification
  const imageSrc = (index % 2 === 0) 
    ? '/editorial-portfolio-1.jpg' 
    : '/editorial-portfolio-2.jpg';

  return (
    <div className="portfolio-item reveal-up">
      {/* 3:4 Aspect-Ratio Image with 16px Radius & Grayscale Hover State */}
      <div 
        className="portfolio-image-wrapper"
        onClick={() => onOpenDetail(learner)}
        style={{ cursor: 'pointer' }}
      >
        <img 
          src={imageSrc} 
          alt={learner.full_name} 
          className="portfolio-image"
        />

        {/* Centered 96px Black Circle with White 'View Case' Text (10px font) */}
        <div className="portfolio-hover-circle">
          VIEW<br />CASE
        </div>

        {/* Floating Priority Tag on Image Corner */}
        <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 5 }}>
          <span className={`badge-editorial-priority ${priorityClass}`}>
            {isCritical && '🚨'}
            {isMedium && '⚠️'}
            {isCheck && '🔍'}
            {learner.priority_level === 'NORMAL' && '🟢'}
            {' '}{learner.priority_label}
          </span>
        </div>
      </div>

      {/* Details Below Image per Specification */}
      <div className="portfolio-details">
        {/* Category Label: 10px #e4a4bd Bold Tracking-Widest */}
        <div className="portfolio-category-label">
          {learner.priority_level} RADAR // {learner.id}
        </div>

        {/* 3xl Title: Learner Name */}
        <h3 className="portfolio-title">
          {learner.full_name}
        </h3>

        {/* Tag Metadata Separated by Bullet Points */}
        <div className="portfolio-metadata-row">
          <span>{groupText}</span>
          <span className="metadata-dot">•</span>
          <span>{deviceText}</span>
          <span className="metadata-dot">•</span>
          <span>{statusLabel}</span>
          <span className="metadata-dot">•</span>
          <span>{learner.phone || '08x-xxx-xxxx'}</span>
        </div>

        {/* 4 Risk Signals per TIIS Mission 1 Specification */}
        <div className="portfolio-signals">
          <div className={`signal-chip ${learner.requested_help ? 'active-danger' : ''}`}>
            <span>{learner.requested_help ? '🆘' : '⚪'}</span>
            <span>ขอความช่วยเหลือ: {learner.requested_help ? 'ใช่ (ด่วน)' : 'ไม่มี'}</span>
          </div>

          <div className={`signal-chip ${learner.has_started === false ? 'active-warning' : ''}`}>
            <span>{learner.has_started === false ? '⏱️' : '⚪'}</span>
            <span>เริ่มงาน: {learner.has_started === false ? 'ยังไม่เริ่ม' : 'เริ่มแล้ว'}</span>
          </div>

          <div className={`signal-chip ${learner.missing_days >= 3 ? 'active-danger' : ''}`}>
            <span>{learner.missing_days >= 3 ? '📅' : '⚪'}</span>
            <span>ขาดส่งรายงาน: {learner.missing_days !== null ? `${learner.missing_days} วัน` : 'ไม่ระบุ'}</span>
          </div>

          <div className={`signal-chip ${learner.is_blocked ? 'active-danger' : ''}`}>
            <span>{learner.is_blocked ? '🚧' : '⚪'}</span>
            <span>ติดอุปสรรค: {learner.is_blocked ? 'พบปัญหา' : 'ปกติ'}</span>
          </div>
        </div>

        {/* Reasoning Box (ความโปร่งใสของระบบจัดลำดับ ไม่ตีตราผู้เรียน) */}
        <div style={{ 
          background: 'var(--bg-secondary)', 
          borderLeft: `3px solid ${isCritical ? 'var(--critical-border)' : isMedium ? 'var(--medium-border)' : 'var(--accent-pink)'}`,
          padding: '0.65rem 0.9rem',
          borderRadius: '0 8px 8px 0',
          fontSize: '0.82rem',
          marginBottom: '1rem',
          color: 'var(--text-charcoal)'
        }}>
          <div style={{ fontSize: '9px', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-charcoal-70)', marginBottom: '0.25rem' }}>
            💡 REASONING & PROTOCOL
          </div>
          {learner.reasons && learner.reasons.length > 0 ? (
            learner.reasons.map((r, i) => (
              <div key={i} style={{ marginBottom: i < learner.reasons.length - 1 ? '0.2rem' : 0 }}>
                • {r}
              </div>
            ))
          ) : (
            <div>• ดำเนินงานตามแผนและเป้าหมายปกติ</div>
          )}
        </div>

        {/* Staff Assignment */}
        <div style={{ fontSize: '0.8rem', color: 'var(--text-charcoal-70)', marginBottom: '1.25rem' }}>
          👤 ผู้ดูแลรับผิดชอบ: <strong style={{ color: 'var(--text-charcoal)' }}>{learner.assigned_staff || 'ยังไม่ได้มอบหมาย'}</strong>
        </div>

        {/* Actions Row */}
        <div className="portfolio-actions">
          <button 
            className="btn-editorial-pill secondary"
            onClick={() => onOpenDetail(learner)}
            title="ดูประวัติการติดตามและไทม์ไลน์ 14 วัน"
          >
            HISTORY
          </button>

          <button 
            className="btn-editorial-pill primary"
            onClick={() => onOpenFollowup(learner)}
            title="บันทึกผลการติดตามหรืออัปเดตสถานะ"
          >
            📞 ติดตามผล (LOG)
          </button>
        </div>
      </div>
    </div>
  );
}
