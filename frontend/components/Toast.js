'use client';

import React, { useEffect } from 'react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️'
  };

  return (
    <div className="toast-container">
      <div className={`toast ${toast.type}`}>
        <span>{icons[toast.type] || 'ℹ️'}</span>
        <span>{toast.message}</span>
        <button 
          onClick={onClose} 
          style={{ marginLeft: '0.75rem', color: '#94a3b8', fontSize: '1.1rem' }}
        >
          &times;
        </button>
      </div>
    </div>
  );
}
