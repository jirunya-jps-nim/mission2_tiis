'use client';

import React from 'react';

export default function HeroSection({ stats, onOpenTestModal, onOpenMissionModal }) {
  const isSupabaseLive = stats?.supabase_status?.connected;
  const total = stats?.total || 60;
  const critical = stats?.critical || 0;
  const resolved = stats?.statusCounts?.resolved || 0;

  return (
    <section id="hero-section" className="hero-section reveal-up">
      {/* Left Column: Massive Headline, Body Text, Arrow-CTA */}
      <div className="hero-left">
        <div className="hero-status-pill">
          <span className={`hero-dot ${isSupabaseLive ? 'green' : 'amber'}`}></span>
          <span>TIIS 6-WEEK PILOT // 60 LEARNERS • 3 CORE STAFF</span>
        </div>

        <h1 className="heading-massive" style={{ marginBottom: '1.5rem' }}>
          FOLLOW<br />
          <span className="accent-italic-word">radar</span>
        </h1>

        <p className="body-2xl" style={{ marginBottom: '2.5rem', maxWidth: '620px' }}>
          ระบบจัดลำดับความสำคัญและติดตามผู้เรียน 60 คน โครงการนำร่อง TIIS ภายใต้กรอบเวลา 6 สัปดาห์ และงบประมาณ 30,000 บาท 
          โดยทีมงานหลัก 3 คน พร้อมกลไกเฝ้าระวัง 4 สัญญาณความเสี่ยงและติดตามผลต่อเนื่องไม่น้อยกว่า 14 วัน
        </p>

        <div className="hero-actions-row">
          <a href="#portfolio-section" className="arrow-cta">
            EXPLORE 60 LEARNERS &rarr;
          </a>

          <button 
            onClick={onOpenMissionModal}
            className="btn-editorial-pill secondary"
          >
            📋 MISSION 01 ALIGNMENT
          </button>
        </div>

        {/* Quick Summary Strip */}
        <div style={{ 
          display: 'flex', 
          gap: '2.5rem', 
          marginTop: '3.5rem', 
          paddingTop: '2rem', 
          borderTop: '1px solid var(--border-subtle)',
          flexWrap: 'wrap'
        }}>
          <div>
            <div className="utility-label">TOTAL LEARNERS</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-charcoal)' }}>{total}</div>
          </div>
          <div>
            <div className="utility-label-pink">CRITICAL ATTENTION</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--critical-text)' }}>{critical}</div>
          </div>
          <div>
            <div className="utility-label">14-DAY RESOLVED</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--normal-text)' }}>{resolved}</div>
          </div>
        </div>
      </div>

      {/* Right Column: Large Card (24px radius, Grayscale-to-Color) & Floating Concierge Badge (160px, '01' italic) */}
      <div className="hero-right">
        <div className="hero-card">
          <img 
            src="/hero-showcase.jpg" 
            alt="Super Travel Editorial Sanctuary" 
            className="hero-image"
          />
        </div>

        {/* Floating Concierge Badge (160px diameter, background #e4a4bd, '01' italic text, bounce-slow 4s) */}
        <div className="floating-concierge-badge">
          <span className="badge-number">01</span>
          <span className="badge-text">
            CONCIERGE RADAR<br />
            14-DAY PROTOCOL
          </span>
        </div>
      </div>
    </section>
  );
}
