'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import StatsOverview from '../components/StatsOverview';
import FilterToolbar from '../components/FilterToolbar';
import LearnerCard from '../components/LearnerCard';
import Footer from '../components/Footer';
import FollowupModal from '../components/FollowupModal';
import LearnerDetailModal from '../components/LearnerDetailModal';
import TestRunnerModal from '../components/TestRunnerModal';
import Mission1AlignmentModal from '../components/Mission1AlignmentModal';
import Toast from '../components/Toast';
import { fetchLearners, fetchStats, resetLearnersData } from '../lib/api';

export default function HomePage() {
  const [learners, setLearners] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [staffFilter, setStaffFilter] = useState('ALL');

  // Modals & Popups
  const [activeFollowupLearner, setActiveFollowupLearner] = useState(null);
  const [activeDetailLearner, setActiveDetailLearner] = useState(null);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
  };

  // Fetch Learners & Stats
  const loadData = useCallback(async () => {
    try {
      const [learnersRes, statsRes] = await Promise.all([
        fetchLearners({
          search,
          status: statusFilter,
          priority: priorityFilter,
          staff: staffFilter
        }),
        fetchStats()
      ]);

      if (learnersRes.success) {
        setLearners(learnersRes.data);
      }
      if (statsRes.success) {
        setStats(statsRes.data);
      }
      setError(null);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ Backend ได้ กรุณาตรวจสอบว่า Backend กำลังทำงานที่พอร์ต 5000');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, priorityFilter, staffFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Scroll Triggered Reveal-Up Observer per Prompt Specification
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.15 }
    );

    const revealElements = document.querySelectorAll('.reveal-up');
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, [learners, loading]);

  // Handle Follow-up Success
  const handleFollowupSuccess = (data) => {
    if (data?.learner) {
      setLearners((prev) =>
        prev.map((l) => (l.id === data.learner.id ? data.learner : l))
      );
    }
    loadData();
  };

  // Handle Reset Data
  const handleResetData = async () => {
    if (!confirm('ต้องการรีเซ็ตข้อมูลผู้เรียนทั้ง 60 คนกลับเป็นค่าเริ่มต้นสำหรับการทดสอบหรือไม่?')) {
      return;
    }
    setIsResetting(true);
    try {
      await resetLearnersData();
      showToast('success', 'รีเซ็ตข้อมูลผู้เรียนทั้ง 60 คนเรียบร้อยแล้ว');
      await loadData();
    } catch (err) {
      showToast('error', 'ไม่สามารถรีเซ็ตข้อมูลได้: ' + err.message);
    } finally {
      setIsResetting(false);
    }
  };

  const staffList = stats?.staffList || [
    'ทีมงาน 1 (สมชาย - หัวหน้าโครงการ)',
    'ทีมงาน 2 (วิภา - ผู้ประสานงานการเรียนรู้)',
    'ทีมงาน 3 (อนันต์ - ผู้เชี่ยวชาญเทคนิค)'
  ];

  return (
    <>
      {/* Toast Notification Container */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Fixed Top Navigation (80px height + Glassmorphism) */}
      <Header 
        stats={stats}
        onOpenTestModal={() => setIsTestModalOpen(true)}
        onOpenMissionModal={() => setIsMissionModalOpen(true)}
        onResetData={handleResetData}
        isResetting={isResetting}
      />

      <main className="app-container">
        {/* Hero Section: Massive Headline 15vw, Lowercase Italic #e4a4bd Word, 2xl Body Text, Arrow CTA, Floating Badge '01' */}
        <HeroSection 
          stats={stats}
          onOpenTestModal={() => setIsTestModalOpen(true)}
          onOpenMissionModal={() => setIsMissionModalOpen(true)}
        />

        {/* Services Grid: Background #f5f0eb, Headline 8xl, 1px Borders, 40px Padding, Hover Shifts to #e4a4bd */}
        <StatsOverview 
          stats={stats} 
          onSelectPriorityFilter={(p) => setPriorityFilter(p)}
        />

        {/* Filter & Search Toolbar */}
        <FilterToolbar 
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          staffFilter={staffFilter}
          setStaffFilter={setStaffFilter}
          staffList={staffList}
        />

        {/* Portfolio Staggered Grid Section */}
        <section id="portfolio-section" style={{ minHeight: '600px' }}>
          <div className="portfolio-header reveal-up">
            <div>
              <div className="utility-label-pink" style={{ marginBottom: '0.5rem' }}>
                SIGNATURE STAGGERED GRID // 60 DOSSIERS
              </div>
              <h2 className="heading-8xl">
                LEARNER<br />
                <span className="accent-italic-word">portfolio</span>
              </h2>
            </div>
            <div style={{ maxWidth: '380px', textAlign: 'right' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-charcoal-70)' }}>
                แสดงผู้เรียน <strong style={{ color: 'var(--text-charcoal)' }}>{learners.length}</strong> คน
              </div>
              <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--accent-pink)', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '0.25rem' }}>
                STAGGERED 100PX OFFSET EDITORIAL VIEW
              </div>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '6rem 1rem', color: 'var(--text-charcoal-70)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⏱️</div>
              <div style={{ fontWeight: 800, fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                LOADING COHORT DATA...
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-charcoal-50)', marginTop: '0.5rem' }}>
                กำลังประมวลผลข้อมูลผู้เรียน 60 คน จากระบบ FollowUp Radar
              </div>
            </div>
          ) : error ? (
            <div style={{ 
              background: 'var(--critical-bg)', 
              border: '1px solid var(--critical-border)', 
              borderRadius: '20px', 
              padding: '3rem 2rem', 
              textAlign: 'center',
              color: 'var(--critical-text)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🔌</div>
              <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-charcoal)', fontWeight: 800 }}>
                ไม่สามารถเชื่อมต่อ Backend API ได้
              </h3>
              <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: '600px', margin: '0 auto 1.5rem auto' }}>
                {error}
              </p>
              <button className="btn-editorial-pill primary" onClick={loadData}>
                🔄 RETRY CONNECTION
              </button>
            </div>
          ) : learners.length === 0 ? (
            <div style={{ 
              background: '#ffffff', 
              border: '1px solid var(--border-subtle)', 
              borderRadius: '20px', 
              padding: '4rem 2rem', 
              textAlign: 'center',
              boxShadow: 'var(--shadow-editorial)'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔍</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-charcoal)', marginBottom: '0.35rem' }}>
                NO MATCHING LEARNERS FOUND
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-charcoal-70)', marginBottom: '1.5rem' }}>
                ไม่พบรายชื่อผู้เรียนที่ตรงกับเงื่อนไขการค้นหาหรือตัวกรองในขณะนี้
              </div>
              <button 
                className="btn-editorial-pill secondary"
                onClick={() => {
                  setSearch('');
                  setStatusFilter('ALL');
                  setPriorityFilter('ALL');
                  setStaffFilter('ALL');
                }}
              >
                RESET ALL FILTERS
              </button>
            </div>
          ) : (
            <div className="portfolio-staggered-grid">
              {learners.map((learner, idx) => (
                <LearnerCard 
                  key={learner.id}
                  learner={learner}
                  index={idx}
                  onOpenFollowup={(l) => setActiveFollowupLearner(l)}
                  onOpenDetail={(l) => setActiveDetailLearner(l)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* 12-Column Editorial Footer */}
      <Footer 
        onOpenMissionModal={() => setIsMissionModalOpen(true)}
        onOpenTestModal={() => setIsTestModalOpen(true)}
      />

      {/* Modals & Popups */}
      {activeFollowupLearner && (
        <FollowupModal 
          learner={activeFollowupLearner}
          staffList={staffList}
          onClose={() => setActiveFollowupLearner(null)}
          onSuccess={handleFollowupSuccess}
          showToast={showToast}
        />
      )}

      {activeDetailLearner && (
        <LearnerDetailModal 
          learner={activeDetailLearner}
          onClose={() => setActiveDetailLearner(null)}
          onOpenFollowup={(l) => setActiveFollowupLearner(l)}
        />
      )}

      {isTestModalOpen && (
        <TestRunnerModal 
          onClose={() => setIsTestModalOpen(false)}
          showToast={showToast}
        />
      )}

      {isMissionModalOpen && (
        <Mission1AlignmentModal 
          onClose={() => setIsMissionModalOpen(false)}
        />
      )}
    </>
  );
}
