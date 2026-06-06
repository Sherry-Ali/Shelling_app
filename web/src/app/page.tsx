"use client";

import dynamic from 'next/dynamic';

const BeachMap = dynamic(() => import("@/components/BeachMap"), { 
  ssr: false,
  loading: () => <div style={{ height: 'calc(100vh - 80px)', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold' }}>Loading Interactive Map... (If this stays here, please restart your server)</div>
});

export default function Home() {
  return (
    <div style={{ position: 'relative', height: 'calc(100vh - 80px)', width: '100%' }}>
      <BeachMap />
      
      {/* Overlay to tell users about premium features / shelling score */}
      <div 
        className="glass-panel"
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '24px',
          padding: '16px',
          zIndex: 1000,
          width: '300px'
        }}
      >
        <h2 style={{ margin: '0 0 12px 0', fontSize: '18px' }}>Today's Shelling Outlook</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--score-excellent)' }}></span>
            <span>Excellent (80-100)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--score-good)' }}></span>
            <span>Good (60-79)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--score-fair)' }}></span>
            <span>Fair (40-59)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--score-poor)' }}></span>
            <span>Poor (0-39)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
