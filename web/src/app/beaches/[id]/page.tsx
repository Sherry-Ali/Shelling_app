import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import TideChart from '@/components/TideChart';

export const revalidate = 60;

export default async function BeachDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  // 1. Fetch beach details and latest conditions
  const { data: beach, error: beachError } = await supabase
    .from('beaches')
    .select(`
      *,
      conditions (
        shelling_score, wind_speed, wind_direction, wave_height, tide_level, water_temp, clarity_score
      )
    `)
    .eq('id', resolvedParams.id)
    .single();

  if (!beach || beachError) {
    return <div style={{ padding: '24px', textAlign: 'center' }}>Beach not found</div>;
  }

  // 2. Fetch likely shells at this beach
  const { data: shellLikelihoods } = await supabase
    .from('beach_shell_likelihood')
    .select(`
      likelihood_score,
      shells (
        id,
        name,
        common_name,
        rarity
      )
    `)
    .eq('beach_id', resolvedParams.id)
    .order('likelihood_score', { ascending: false });

  // 3. Fetch tide forecasts
  const { data: tideForecasts } = await supabase
    .from('tide_forecasts')
    .select('*')
    .eq('beach_id', resolvedParams.id)
    .order('prediction_time', { ascending: true });

  // Get latest conditions
  const latestCondition = beach.conditions && beach.conditions.length > 0 ? beach.conditions[0] : null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'var(--score-excellent)';
    if (score >= 60) return 'var(--score-good)';
    if (score >= 40) return 'var(--score-fair)';
    return 'var(--score-poor)';
  };

  const scoreLabel = !latestCondition ? 'Unknown' : latestCondition.shelling_score >= 80 ? 'Excellent' : latestCondition.shelling_score >= 60 ? 'Good' : latestCondition.shelling_score >= 40 ? 'Fair' : 'Poor';
  const displayScore = latestCondition ? latestCondition.shelling_score : '--';

  const formatTime = (timeStr: string) => {
    const date = new Date(timeStr);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto', fontFamily: 'var(--font-sans)' }}>
      <Link href="/" style={{ color: 'var(--primary)', marginBottom: '24px', display: 'inline-flex', alignItems: 'center', fontWeight: 600, textDecoration: 'none', transition: 'opacity 0.2s' }} className="hover-opacity">
        <span style={{ marginRight: '8px', fontSize: '1.2em' }}>&larr;</span> Back to Map
      </Link>
      
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-50%', right: '-10%', width: '300px', height: '300px', background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)', opacity: 0.1, borderRadius: '50%', zIndex: 0 }}></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 className="heading-gradient" style={{ fontSize: '3rem', marginBottom: '8px', letterSpacing: '-0.02em' }}>{beach.name}</h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.15rem', marginBottom: '32px', fontWeight: 500 }}>{beach.county} County • {beach.access_info}</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            
            <div className="glass-panel hover-lift" style={{ padding: '32px', textAlign: 'center', border: `2px solid ${latestCondition ? getScoreColor(latestCondition.shelling_score) : '#e2e8f0'}`, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h2 style={{ margin: '0 0 12px 0', fontSize: '1.2rem', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Today's Score</h2>
              <div style={{ fontSize: '5rem', fontWeight: 800, color: latestCondition ? getScoreColor(latestCondition.shelling_score) : '#cbd5e1', lineHeight: 1 }}>
                {displayScore}
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '8px', color: 'white' }}>{scoreLabel}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="glass-panel" style={{ padding: '24px' }}>
                <h2 style={{ margin: '0 0 20px 0', fontSize: '1.3rem', color: 'white' }}>Current Conditions</h2>
                {latestCondition ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                      <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px' }}>🌊 Waves</span>
                      <strong style={{ color: 'white', fontSize: '1.1rem' }}>{latestCondition.wave_height} ft</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
                      <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px' }}>📈 Tide Level</span>
                      <strong style={{ color: 'white', fontSize: '1.1rem' }}>{latestCondition.tide_level} ft</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px' }}>🌬️ Wind</span>
                      <strong style={{ color: 'white', fontSize: '1.1rem' }}>{latestCondition.wind_speed} mph {latestCondition.wind_direction}</strong>
                    </div>
                  </div>
                ) : (
                  <p style={{ color: '#94a3b8' }}>No current conditions available.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TIDE FORECAST TIMELINE */}
      <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: 'white', letterSpacing: '-0.02em' }}>Tide Forecast</h2>
      <div className="glass-panel" style={{ padding: '0px', marginBottom: '32px', overflowX: 'auto', backgroundColor: 'rgba(255, 255, 255, 0.7)' }}>
        <TideChart currentTide={latestCondition?.tide_level || 0} />
      </div>

      <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: 'white', letterSpacing: '-0.02em' }}>Top Shells to Find Here</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {shellLikelihoods?.map((row, idx) => {
          const shellData: any = row.shells;
          if (!shellData) return null;
          return (
            <Link href={`/shells/${shellData.id}`} key={idx} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="glass-panel hover-lift" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}>
                <div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '1.4rem', color: 'white' }}>{shellData.common_name}</h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--primary)', background: 'rgba(239, 68, 68, 0.1)', padding: '6px 12px', borderRadius: '20px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{shellData.rarity}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '6px' }}>Likelihood</div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <span key={star} style={{ color: star <= row.likelihood_score ? 'var(--accent)' : '#334155', fontSize: '1.4rem', filter: star <= row.likelihood_score ? 'drop-shadow(0 2px 4px rgba(245, 158, 11, 0.3))' : 'none' }}>★</span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

    </div>
  );
}
