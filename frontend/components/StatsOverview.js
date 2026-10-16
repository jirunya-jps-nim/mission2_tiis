'use client';

import React from 'react';

export default function StatsOverview({ stats, onSelectPriorityFilter }) {
  if (!stats) return null;

  const total = stats.total || 60;
  const critical = stats.critical || 0;
  const medium = stats.medium || 0;
  const needsCheck = stats.needsCheck || 0;
  const normal = stats.normal || 0;

  const pending = stats.statusCounts?.pending || 0;
  const contacted = stats.statusCounts?.contacted || 0;
  const resolved = stats.statusCounts?.resolved || 0;

  const mobileUsers = stats.indicators?.mobileUsers || 0;
  const resolvedPct = stats.indicators?.fourteenDaysResolvedPercent || Math.round((resolved / total) * 100);

  return (
    <div id="services-section" className="reveal-up" style={{ marginBottom: '4rem' }}>
      {/* 14-Day Protocol Timeline Banner Strip */}
      <div id="timeline-section" className="timeline-strip">
        <div className="timeline-info">
          <div className="timeline-badge-circle">
            ⏱️
          </div>
          <div>
            <div className="utility-label-pink" style={{ marginBottom: '0.2rem' }}>
              MANDATORY REQUIREMENT // 14-DAY FOLLOW-UP PROTOCOL
            </div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-charcoal)' }}>
              การติดตามผลหลังกิจกรรมหลัก (เกณฑ์ขั้นต่ำ 14 วัน)
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-charcoal-70)' }}>
              ปิดเรื่องสำเร็จแล้ว <strong>{resolved}</strong> จาก {total} คน ({resolvedPct}%) • กำลังติดต่อ <strong>{contacted}</strong> คน • รอติดต่อ <strong>{pending}</strong> คน
            </div>
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-charcoal-70)', textAlign: 'right' }}>
            📱 ผู้เรียนใช้สมาร์ทโฟนเป็นหลัก: <strong style={{ color: 'var(--text-charcoal)' }}>{mobileUsers} คน ({Math.round((mobileUsers/total)*100)}%)</strong>
          </div>
          <div className="timeline-progress-track">
            <div 
              className="timeline-progress-fill" 
              style={{ width: `${Math.max(5, resolvedPct)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Services Grid per Prompt Specification: Background #f5f0eb, Headline 8xl, 1px borders, 40px padding, hover shifts from #fdf8f3 to #e4a4bd */}
      <section className="services-section">
        <div className="services-header">
          <div>
            <div className="utility-label-pink" style={{ marginBottom: '0.5rem' }}>
              SERVICES & RADAR METRICS
            </div>
            <h2 className="heading-8xl">
              COHORT<br />
              <span className="accent-italic-word">matrix</span>
            </h2>
          </div>
          <div style={{ maxWidth: '420px' }}>
            <p className="body-relaxed">
              จำแนกลำดับความสำคัญของผู้เรียน 60 คนตาม 4 สัญญาณความเสี่ยง โดยคลิกที่การ์ดเพื่อกรองรายชื่อผู้เรียนทันที
            </p>
          </div>
        </div>

        <div className="services-grid">
          {/* Card 1: Total */}
          <div 
            className="service-card"
            onClick={() => onSelectPriorityFilter('ALL')}
            title="ดูผู้เข้าร่วมทั้งหมด 60 คน"
          >
            <div>
              <div className="service-icon">👥</div>
              <h3>TOTAL PARTICIPANTS</h3>
              <div className="service-value">{total}</div>
            </div>
            <p>ผู้เข้าร่วมทั้งหมด (นักศึกษาและผู้เริ่มต้นทำงานเป้าหมาย 60 คน)</p>
          </div>

          {/* Card 2: Critical */}
          <div 
            className="service-card"
            onClick={() => onSelectPriorityFilter('CRITICAL')}
            title="กรองเฉพาะกลุ่มเร่งด่วนมาก"
          >
            <div>
              <div className="service-icon">🚨</div>
              <h3 style={{ color: 'var(--critical-text)' }}>CRITICAL RISK</h3>
              <div className="service-value" style={{ color: 'var(--critical-text)' }}>{critical}</div>
            </div>
            <p>เร่งด่วนมาก: ร้องขอความช่วยเหลือ หรือ ขาดส่งรายงานเกิน 3 วัน</p>
          </div>

          {/* Card 3: Medium */}
          <div 
            className="service-card"
            onClick={() => onSelectPriorityFilter('MEDIUM')}
            title="กรองเฉพาะกลุ่มควรติดตาม"
          >
            <div>
              <div className="service-icon">⚠️</div>
              <h3 style={{ color: 'var(--medium-text)' }}>MONITORING</h3>
              <div className="service-value" style={{ color: 'var(--medium-text)' }}>{medium}</div>
            </div>
            <p>ควรติดตาม: ยังไม่เริ่มลงมือทำ หรือ ติดปัญหาขาดความมั่นใจ</p>
          </div>

          {/* Card 4: Needs Check */}
          <div 
            className="service-card"
            onClick={() => onSelectPriorityFilter('NEEDS_CHECK')}
            title="กรองกลุ่มต้องตรวจสอบข้อมูล"
          >
            <div>
              <div className="service-icon">🔍</div>
              <h3 style={{ color: 'var(--needscheck-text)' }}>NEEDS AUDIT</h3>
              <div className="service-value" style={{ color: 'var(--needscheck-text)' }}>{needsCheck}</div>
            </div>
            <p>ต้องตรวจสอบข้อมูล: ข้อมูลยังไม่ครบถ้วน (ไม่สรุปว่าเป็นผู้มีปัญหา)</p>
          </div>

          {/* Card 5: Normal */}
          <div 
            className="service-card"
            onClick={() => onSelectPriorityFilter('NORMAL')}
            title="กรองกลุ่มปกติ"
          >
            <div>
              <div className="service-icon">🟢</div>
              <h3 style={{ color: 'var(--normal-text)' }}>ON TRACK</h3>
              <div className="service-value" style={{ color: 'var(--normal-text)' }}>{normal}</div>
            </div>
            <p>ปกติ: มีความคืบหน้าและส่งรายงานตามแผนอย่างต่อเนื่อง</p>
          </div>
        </div>
      </section>
    </div>
  );
}
