'use client';

import React from 'react';

export default function Header({ 
  stats, 
  onOpenTestModal, 
  onOpenMissionModal, 
  onResetData, 
  isResetting 
}) {
  const isSupabaseLive = stats?.supabase_status?.connected;

  return (
    <header className="nav-fixed">
      <div className="nav-container">
        {/* Left Side: Brand Logo & Title per Specification */}
        <div className="nav-brand">
          <div className="nav-brand-title">
            SUPER TRAVEL
          </div>
          <span className="nav-brand-badge">
            TIIS // RADAR 01
          </span>
        </div>

        {/* Center Menu: 10px uppercase tracking-widest (0.2em) */}
        <nav className="nav-center-menu">
          <a href="#hero-section" className="nav-link">OVERVIEW</a>
          <a href="#timeline-section" className="nav-link">14-DAY PROTOCOL</a>
          <a href="#services-section" className="nav-link">METRICS GRID</a>
          <a href="#portfolio-section" className="nav-link">LEARNERS 60</a>
          <button 
            onClick={onOpenMissionModal} 
            className="nav-link"
            style={{ cursor: 'pointer', background: 'none', border: 'none' }}
          >
            MISSION 01 SPECS
          </button>
        </nav>

        {/* Far Right: Pill-shaped CTA Button (#e4a4bd background, #262626 text, 32px x 12px) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <button 
            className="btn-editorial-pill secondary btn-sm"
            onClick={onResetData}
            disabled={isResetting}
            title="รีเซ็ตข้อมูลทั้ง 60 คนกลับเป็นค่าเริ่มต้น"
            style={{ padding: '8px 18px', fontSize: '10px' }}
          >
            {isResetting ? 'RESETTING...' : 'RESET 60'}
          </button>

          <button 
            className="nav-cta-pill"
            onClick={onOpenTestModal}
            title="รันชุดทดสอบ 4 กรณีตามเงื่อนไขภารกิจ"
          >
            TEST SUITE 04
          </button>
        </div>
      </div>
    </header>
  );
}
