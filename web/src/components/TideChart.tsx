"use client";

import React from 'react';

export default function TideChart({ currentTide, forecasts = [] }: { currentTide: number, forecasts?: any[] }) {
  // Format the time from "YYYY-MM-DD HH:MM" to "h:mm AM/PM"
  const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    try {
      const date = new Date(timeStr);
      // Return short time like '5:30 AM'
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } catch {
      return timeStr;
    }
  };

  // Get current time formatted
  const currentTimeStr = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  // We only show up to 4 forecasts to fit the chart neatly
  const displayForecasts = forecasts.slice(0, 4);

  // Pad the array if there are less than 4 forecasts
  while (displayForecasts.length < 4) {
    displayForecasts.push({ prediction_time: '', water_level: 0 });
  }
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
          
          {/* Labels dynamically generated */}
          <text x="100" y={displayForecasts[0].type === 'H' ? 30 : 180} fontSize="14" fill="#334155" fontWeight="600" textAnchor="middle">
            {formatTime(displayForecasts[0].prediction_time) || "5:30 AM"}
          </text>
          <text x="100" y={displayForecasts[0].type === 'H' ? 15 : 195} fontSize="12" fill="#64748b" textAnchor="middle">
            {displayForecasts[0].prediction_time ? `${displayForecasts[0].water_level}ft` : "3.2ft"}
          </text>

          <text x="300" y={displayForecasts[1].type === 'H' ? 30 : 180} fontSize="14" fill="#334155" fontWeight="600" textAnchor="middle">
            {formatTime(displayForecasts[1].prediction_time) || "11:45 AM"}
          </text>
          <text x="300" y={displayForecasts[1].type === 'H' ? 15 : 195} fontSize="12" fill="#64748b" textAnchor="middle">
            {displayForecasts[1].prediction_time ? `${displayForecasts[1].water_level}ft` : "0.4ft"}
          </text>

          <text x="500" y={displayForecasts[2].type === 'H' ? 30 : 180} fontSize="14" fill="#334155" fontWeight="600" textAnchor="middle">
            {formatTime(displayForecasts[2].prediction_time) || "6:15 PM"}
          </text>
          <text x="500" y={displayForecasts[2].type === 'H' ? 15 : 195} fontSize="12" fill="#64748b" textAnchor="middle">
            {displayForecasts[2].prediction_time ? `${displayForecasts[2].water_level}ft` : "2.8ft"}
          </text>

          <text x="700" y={displayForecasts[3].type === 'H' ? 30 : 180} fontSize="14" fill="#334155" fontWeight="600" textAnchor="middle">
            {formatTime(displayForecasts[3].prediction_time) || "11:50 PM"}
          </text>
          <text x="700" y={displayForecasts[3].type === 'H' ? 15 : 195} fontSize="12" fill="#64748b" textAnchor="middle">
            {displayForecasts[3].prediction_time ? `${displayForecasts[3].water_level}ft` : "0.6ft"}
          </text>
          
          {/* Current Tide Marker */}
          <circle cx="200" cy="100" r="8" fill="var(--accent)" stroke="white" strokeWidth="2" />
          <text x="200" y="80" fontSize="15" fontWeight="bold" fill="var(--accent)" textAnchor="middle">{currentTimeStr} ({currentTide}ft)</text>
          
          <line x1="200" y1="100" x2="200" y2="200" stroke="var(--accent)" strokeWidth="1" strokeDasharray="4 4" />
        </svg>
      </div>
    </div>
  );
}
