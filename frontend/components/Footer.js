'use client';

import React from 'react';

export default function Footer({ onOpenMissionModal, onOpenTestModal }) {
  return (
    <footer className="footer-editorial reveal-up">
      <div className="footer-container">
        {/* 12-Column Split Specification */}
        <div className="footer-grid-12">
          {/* Left 5 Columns: Brand Logo & Mission Statement */}
          <div className="footer-left-5">
            <div style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.04em', textTransform: 'uppercase', marginBottom: '1.25rem', color: 'var(--text-charcoal)' }}>
              SUPER TRAVEL<br />
              <span className="accent-italic-word" style={{ fontSize: '1.5rem', marginLeft: 0 }}>
                followup radar
              </span>
            </div>
            <p className="body-relaxed" style={{ maxWidth: '420px', marginBottom: '1.5rem' }}>
              โครงการนำร่อง TIIS (ภารกิจที่ 2 สอดคล้องตามภารกิจที่ 1): ระบบจัดลำดับความสำคัญและติดตามผู้เรียน 60 คน สำหรับทีมหลัก 3 คน 
              ระยะเวลา 6 สัปดาห์ พร้อมเกณฑ์ติดตามผลอย่างน้อย 14 วัน เพื่อสนับสนุนผู้เรียนโดยไม่ตีตรา
            </p>
            <div className="utility-label" style={{ color: 'var(--text-charcoal-50)' }}>
              DESIGNED WITH LEAGUE SPARTAN // #E4A4BD SIGNATURE
            </div>
          </div>

          {/* Right 7 Columns Split into 3 Sub-columns */}
          <div className="footer-right-7">
            {/* Sub-column 1: Navigation */}
            <div>
              <span className="footer-header-10px">NAVIGATION</span>
              <ul className="footer-links-list">
                <li><a href="#hero-section" className="footer-link-item">Hero Overview</a></li>
                <li><a href="#timeline-section" className="footer-link-item">14-Day Timeline</a></li>
                <li><a href="#services-section" className="footer-link-item">Services & Metrics</a></li>
                <li><a href="#portfolio-section" className="footer-link-item">Learner Portfolio</a></li>
                <li>
                  <button 
                    onClick={onOpenMissionModal}
                    className="footer-link-item"
                    style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer' }}
                  >
                    Mission 1 Alignment
                  </button>
                </li>
              </ul>
            </div>

            {/* Sub-column 2: 4 Risk Signals */}
            <div>
              <span className="footer-header-10px">RISK SIGNALS</span>
              <ul className="footer-links-list">
                <li className="footer-link-item">🆘 Help Requests</li>
                <li className="footer-link-item">⏱️ Non-Starters</li>
                <li className="footer-link-item">📅 Missing 3+ Days</li>
                <li className="footer-link-item">🚧 Project Blockers</li>
                <li className="footer-link-item">
                  <button 
                    onClick={onOpenTestModal}
                    className="footer-link-item"
                    style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer', color: 'var(--accent-pink)', fontWeight: 700 }}
                  >
                    Run 4 Test Cases &rarr;
                  </button>
                </li>
              </ul>
            </div>

            {/* Sub-column 3: Core Team 3 Staff & Location */}
            <div>
              <span className="footer-header-10px">TEAM & PILOT</span>
              <ul className="footer-links-list">
                <li className="footer-link-item">👤 สมชาย (หัวหน้าโครงการ)</li>
                <li className="footer-link-item">👤 วิภา (ผู้ประสานงาน)</li>
                <li className="footer-link-item">👤 อนันต์ (ผู้เชี่ยวชาญเทคนิค)</li>
                <li className="footer-link-item">🏢 TIIS Pilot HQ, Bangkok</li>
                <li className="footer-link-item">⚡ Supabase Hybrid Cache</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar: 1px Border, 9px Font Size, #262626/30 Color per Prompt */}
        <div className="footer-bottom-bar">
          <div>
            &copy; 2026 SUPER TRAVEL x TIIS MISSION 2. ALL RIGHTS RESERVED.
          </div>
          <div className="footer-legal-links">
            <a href="#hero-section">PRIVACY POLICY</a>
            <a href="#hero-section">TERMS OF SERVICE</a>
            <a href="#hero-section">ACCESSIBILITY STATEMENT</a>
            <a href="#hero-section">INCLUSIVE DESIGN</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
