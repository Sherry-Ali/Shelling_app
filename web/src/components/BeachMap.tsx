"use client";

import { useState, useEffect } from 'react';
import Map, { Marker, Popup } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { supabase } from '@/lib/supabase';

interface Beach {
  id: string;
  name: string;
  county: string;
  latitude: number;
  longitude: number;
  conditions?: {
    shelling_score: number;
    wind_speed: number;
    wave_height: number;
    tide_level: number;
    water_temp: number;
  }[];
}

// Beautiful Carto Voyager map style without needing an API key!
const mapStyle = {
  version: 8,
  sources: {
    'raster-tiles': {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
        'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
        'https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
      ],
      tileSize: 256,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }
  },
  layers: [
    {
      id: 'simple-tiles',
      type: 'raster',
      source: 'raster-tiles',
      minzoom: 0,
      maxzoom: 22
    }
  ]
};

export default function BeachMap() {
  const [popupInfo, setPopupInfo] = useState<Beach | null>(null);
  const [beaches, setBeaches] = useState<Beach[]>([]);

  useEffect(() => {
    async function fetchBeaches() {
      const { data, error } = await supabase
        .from('beaches')
        .select(`
          *,
          conditions (
            shelling_score, wind_speed, wave_height, tide_level, water_temp
          )
        `);
      if (data) {
        setBeaches(data as Beach[]);
      }
    }
    fetchBeaches();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'var(--score-excellent)';
    if (score >= 60) return 'var(--score-good)';
    if (score >= 40) return 'var(--score-fair)';
    return 'var(--score-poor)';
  };

  return (
    <div style={{ height: 'calc(100vh - 80px)', width: '100%', position: 'relative', zIndex: 1 }}>
      <Map
        initialViewState={{
          longitude: -82.5,
          latitude: 27.5,
          zoom: 7
        }}
        mapStyle={mapStyle as any}
        style={{ width: '100%', height: '100%' }}
      >
        {beaches.map((beach) => {
          const score = beach.conditions?.[0]?.shelling_score || 0;
          return (
            <Marker
              key={beach.id}
              longitude={beach.longitude}
              latitude={beach.latitude}
              anchor="bottom"
              onClick={e => {
                e.originalEvent.stopPropagation();
                setPopupInfo(beach);
              }}
            >
              <div style={{
                backgroundColor: getScoreColor(score),
                color: 'white',
                padding: '6px',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                cursor: 'pointer',
                border: '2px solid white'
              }}>
                🐚
              </div>
            </Marker>
          );
        })}

        {popupInfo && (
          <Popup
            anchor="top"
            longitude={popupInfo.longitude}
            latitude={popupInfo.latitude}
            onClose={() => setPopupInfo(null)}
            closeOnClick={false}
            style={{ borderRadius: '12px', overflow: 'hidden' }}
          >
            <div style={{ padding: '4px', minWidth: '200px', fontFamily: 'var(--font-sans)', color: '#1e293b' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{popupInfo.name}</h3>
              
              <div style={{ 
                backgroundColor: getScoreColor(popupInfo.conditions?.[0]?.shelling_score || 0), 
                color: 'white', 
                padding: '4px 10px', 
                borderRadius: '16px',
                fontWeight: 'bold',
                fontSize: '12px',
                display: 'inline-block',
                marginBottom: '12px'
              }}>
                Shelling Score: {popupInfo.conditions?.[0]?.shelling_score || 0}
              </div>
              
              <div style={{ fontSize: '12px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>🌊 Waves</span>
                  <span style={{ fontWeight: 600, color: '#334155' }}>{popupInfo.conditions?.[0]?.wave_height}ft</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>🌬️ Wind</span>
                  <span style={{ fontWeight: 600, color: '#334155' }}>{popupInfo.conditions?.[0]?.wind_speed}mph</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>📈 Tide</span>
                  <span style={{ fontWeight: 600, color: '#334155' }}>{popupInfo.conditions?.[0]?.tide_level}ft</span>
                </div>
              </div>
              
              <a 
                href={`/beaches/${popupInfo.id}`} 
                style={{ 
                  display: 'block', 
                  textAlign: 'center', 
                  marginTop: '12px',
                  textDecoration: 'none',
                  padding: '8px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  fontWeight: 600
                }}
              >
                View Full Forecast &rarr;
              </a>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
