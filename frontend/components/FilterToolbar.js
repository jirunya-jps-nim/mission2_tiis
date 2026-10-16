'use client';

import React from 'react';

export default function FilterToolbar({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  staffFilter,
  setStaffFilter,
  staffList = []
}) {
  const hasActiveFilters = search || statusFilter !== 'ALL' || priorityFilter !== 'ALL' || staffFilter !== 'ALL';

  return (
    <div className="toolbar-section reveal-up">
      {/* Search Bar with Search Icon */}
      <div className="search-input-wrap">
        <span className="search-icon-pos">🔍</span>
        <input 
          type="text" 
          className="search-input"
          placeholder="ค้นหาชื่อผู้เรียน, รหัส LN-xxx, หรือเบอร์โทรศัพท์..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Filter Dropdowns */}
      <div className="filter-group">
        {/* Status filter */}
        <select 
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="กรองตามสถานะ"
        >
          <option value="ALL">สถานะทั้งหมด (ALL STATUS)</option>
          <option value="PENDING">⏳ รอติดต่อ (PENDING)</option>
          <option value="CONTACTED">📞 ติดต่อแล้ว (CONTACTED)</option>
          <option value="RESOLVED">✅ ปิดเรื่อง (RESOLVED)</option>
        </select>

        {/* Priority filter */}
        <select 
          className="filter-select"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          aria-label="กรองตามลำดับความสำคัญ"
        >
          <option value="ALL">ความสำคัญทั้งหมด (ALL PRIORITY)</option>
          <option value="CRITICAL">🚨 เร่งด่วนมาก (CRITICAL)</option>
          <option value="MEDIUM">⚠️ ควรติดตาม (MONITORING)</option>
          <option value="NEEDS_CHECK">🔍 ต้องตรวจสอบ (AUDIT)</option>
          <option value="NORMAL">🟢 ปกติ (ON TRACK)</option>
        </select>

        {/* Staff filter */}
        <select 
          className="filter-select"
          value={staffFilter}
          onChange={(e) => setStaffFilter(e.target.value)}
          aria-label="กรองตามผู้ดูแลรับผิดชอบ"
        >
          <option value="ALL">ทีมหลัก 3 คนทั้งหมด (ALL STAFF)</option>
          {staffList.map((staff, idx) => (
            <option key={idx} value={staff}>{staff}</option>
          ))}
        </select>

        {hasActiveFilters && (
          <button 
            className="btn-editorial-pill dark"
            style={{ fontSize: '10px', padding: '0.5rem 1.1rem' }}
            onClick={() => {
              setSearch('');
              setStatusFilter('ALL');
              setPriorityFilter('ALL');
              setStaffFilter('ALL');
            }}
          >
            CLEAR FILTERS &times;
          </button>
        )}
      </div>
    </div>
  );
}
