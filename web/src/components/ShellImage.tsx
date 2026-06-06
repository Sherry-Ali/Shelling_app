"use client";

import { useState } from 'react';

interface ShellImageProps {
  shellId: string;
  commonName: string;
  isFeature?: boolean;
}

export default function ShellImage({ shellId, commonName, isFeature = false }: ShellImageProps) {
  const [error, setError] = useState(false);

  if (error) {
    if (isFeature) {
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {[1, 2, 3].map((num) => (
            <div key={num} style={{ 
              width: '100%', 
              aspectRatio: '4/3', 
              backgroundColor: 'rgba(255, 255, 255, 0.05)', 
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px dashed #475569',
              color: '#94a3b8',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <span style={{ fontSize: '2rem' }}>📷</span>
              <span>Shell Image {num}</span>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div style={{ 
        width: '100%', 
        height: '160px', 
        backgroundColor: 'rgba(255, 255, 255, 0.05)', 
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px dashed #475569',
        color: '#94a3b8',
        marginBottom: '16px'
      }}>
        <span style={{ fontSize: '2rem' }}>📷</span>
      </div>
    );
  }

  return (
    <div style={{
      width: '100%',
      aspectRatio: isFeature ? '16/9' : undefined,
      height: isFeature ? undefined : '160px',
      borderRadius: isFeature ? '16px' : '12px',
      marginBottom: isFeature ? '32px' : '16px',
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.1)',
      boxShadow: isFeature ? '0 10px 30px rgba(0,0,0,0.3)' : undefined
    }}>
      <img 
        src={`/shells/${shellId}.png`} 
        alt={commonName} 
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        onError={() => setError(true)}
      />
    </div>
  );
}
