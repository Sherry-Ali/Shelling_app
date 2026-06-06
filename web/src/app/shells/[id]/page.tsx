/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import ShellImage from '@/components/ShellImage';

export const revalidate = 60;

export default async function ShellDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  // 1. Fetch shell details
  const { data: shell, error: shellError } = await supabase
    .from('shells')
    .select('*')
    .eq('id', resolvedParams.id)
    .single();

  if (!shell || shellError) {
    return <div style={{ padding: '24px', textAlign: 'center' }}>Shell not found</div>;
  }

  // 2. Fetch best beaches (joining beach_shell_likelihood -> beaches -> conditions)
  const { data: likelihoods } = await supabase
    .from('beach_shell_likelihood')
    .select(`
      likelihood_score,
      beaches (
        id,
        name,
        conditions (
          shelling_score
        )
      )
    `)
    .eq('shell_id', resolvedParams.id)
    .order('likelihood_score', { ascending: false })
    .limit(5);

  const getRarityColor = (rarity: string) => {
    if (!rarity) return '#3b82f6';
    if (rarity.includes('Very Rare')) return '#ef4444';
    if (rarity.includes('Uncommon')) return '#f59e0b';
    if (rarity.includes('Rare')) return '#ec4899';
    return '#3b82f6';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'var(--score-excellent)';
    if (score >= 60) return 'var(--score-good)';
    if (score >= 40) return 'var(--score-fair)';
    return 'var(--score-poor)';
  };

  const getConditionLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <Link href="/shells" style={{ color: 'var(--primary)', marginBottom: '16px', display: 'inline-block', fontWeight: 500 }}>&larr; Back to Encyclopedia</Link>
      
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '32px' }}>
        <h1 className="heading-gradient" style={{ fontSize: '3rem', marginBottom: '4px' }}>{shell.common_name}</h1>
        <div style={{ fontStyle: 'italic', color: '#64748b', fontSize: '1.2rem', marginBottom: '16px' }}>{shell.name}</div>
        
        <span style={{ 
          display: 'inline-block', 
          padding: '6px 16px', 
          borderRadius: '20px', 
          fontSize: '1rem', 
          fontWeight: 'bold', 
          color: 'white',
          backgroundColor: getRarityColor(shell.rarity),
          marginBottom: '32px'
        }}>
          {shell.rarity}
        </span>

        <h2 style={{ fontSize: '1.8rem', marginBottom: '24px' }}>Best Beaches Today</h2>
        
        {likelihoods && likelihoods.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
            {likelihoods.map((row, idx) => {
              const beachData: any = row.beaches;
              if (!beachData) return null;
              
              const latestCondition = Array.isArray(beachData.conditions) ? beachData.conditions[0] : beachData.conditions;
              const shellingScore = latestCondition?.shelling_score || 0;
              const conditionLabel = getConditionLabel(shellingScore);

              return (
                <Link href={`/beaches/${beachData.id}`} key={idx} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}>
                    <div>
                      <h3 style={{ margin: '0 0 8px 0', fontSize: '1.3rem' }}>{beachData.name}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ 
                          backgroundColor: getScoreColor(shellingScore), 
                          color: 'white', 
                          padding: '6px 12px', 
                          borderRadius: '16px',
                          fontWeight: 'bold',
                          fontSize: '0.9rem'
                        }}>
                          {shellingScore} • {conditionLabel}
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '4px' }}>Likelihood</div>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[1, 2, 3, 4, 5].map(star => (
                          <span key={star} style={{ color: star <= row.likelihood_score ? 'var(--accent)' : '#334155', fontSize: '1.4rem' }}>★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <p style={{ color: 'white', marginBottom: '40px' }}>No beaches have a high likelihood of finding this shell today.</p>
        )}

        {/* Shell Feature Image */}
        <ShellImage shellId={shell.id} commonName={shell.common_name} isFeature={true} />

        <p style={{ color: 'white', fontSize: '1.15rem', lineHeight: '1.7', marginBottom: '32px' }}>
          {shell.description}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '20px', borderRadius: '12px' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '8px' }}>Size Range</div>
            <div style={{ fontWeight: '600', fontSize: '1.1rem', color: 'white' }}>{shell.size_range}</div>
          </div>
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '20px', borderRadius: '12px' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '8px' }}>Habitat</div>
            <div style={{ fontWeight: '600', fontSize: '1.1rem', color: 'white' }}>{shell.habitat}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
