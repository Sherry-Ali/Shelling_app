"use client";

import React from 'react';

export default function TideChart({ currentTide }: { currentTide: number }) {
  // A beautiful SVG sine wave to represent the daily tide cycle
  return (
    <div style={{ width: '100%', overflowX: 'auto', padding: '10px 0', borderTop: '1px solid var(--card-border)' }}>
      <h3 style={{ fontSize: '1rem', color: '#64748b', marginBottom: '16px' }}>Daily Tide Forecast</h3>
      
      <div style={{ position: 'relative', width: '100%', minWidth: '500px' }}>
        <svg viewBox="0 0 800 200" style={{ width: '100%', height: '140px', display: 'block' }}>
          
          {/* Light Grid Lines */}
          <line x1="0" y1="50" x2="800" y2="50" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="0" y1="150" x2="800" y2="150" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
          
          <text x="10" y="45" fontSize="12" fill="#94a3b8">High</text>
          <text x="10" y="145" fontSize="12" fill="#94a3b8">Low</text>

          {/* Water Fill */}
          <path 
            d="M 0 100 Q 100 0, 200 100 T 400 100 T 600 100 T 800 100 L 800 220 L 0 220 Z" 
            fill="rgba(59, 130, 246, 0.1)"
          />
          
          {/* Continuous Tide Line */}
          <path 
            d="M 0 100 Q 100 0, 200 100 T 400 100 T 600 100 T 800 100" 
            fill="none" 
            stroke="#3b82f6" 
            strokeWidth="3"
            strokeLinecap="round"
          />
          
          {/* Labels */}
          <text x="100" y="30" fontSize="14" fill="#334155" fontWeight="600" textAnchor="middle">5:30 AM</text>
          <text x="100" y="15" fontSize="12" fill="#64748b" textAnchor="middle">3.2ft</text>

          <text x="300" y="180" fontSize="14" fill="#334155" fontWeight="600" textAnchor="middle">11:45 AM</text>
          <text x="300" y="195" fontSize="12" fill="#64748b" textAnchor="middle">0.4ft</text>

          <text x="500" y="30" fontSize="14" fill="#334155" fontWeight="600" textAnchor="middle">6:15 PM</text>
          <text x="500" y="15" fontSize="12" fill="#64748b" textAnchor="middle">2.8ft</text>

          <text x="700" y="180" fontSize="14" fill="#334155" fontWeight="600" textAnchor="middle">11:50 PM</text>
          <text x="700" y="195" fontSize="12" fill="#64748b" textAnchor="middle">0.6ft</text>
          
          {/* Current Tide Marker */}
          <circle cx="200" cy="100" r="8" fill="var(--accent)" stroke="white" strokeWidth="2" />
          <text x="200" y="80" fontSize="15" fontWeight="bold" fill="var(--accent)" textAnchor="middle">Now ({currentTide}ft)</text>
          
          <line x1="200" y1="100" x2="200" y2="200" stroke="var(--accent)" strokeWidth="1" strokeDasharray="4 4" />
        </svg>
      </div>
    </div>
  );
}
