/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import ShellImage from '@/components/ShellImage';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function ShellsDirectory() {
  const { data: shells, error } = await supabase
    .from('shells')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching shells:', error);
  }

  const getRarityColor = (rarity: string) => {
    if (!rarity) return '#3b82f6';
    if (rarity.includes('Very Rare')) return '#ef4444';
    if (rarity.includes('Uncommon')) return '#f59e0b';
    if (rarity.includes('Rare')) return '#ec4899';
    return '#3b82f6';
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 className="heading-gradient" style={{ fontSize: '2.5rem', marginBottom: '8px', textAlign: 'center' }}>Shell Encyclopedia</h1>
      <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '32px', textAlign: 'center' }}>Discover Florida's most sought-after treasures.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {shells?.map((shell) => (
          <Link href={`/shells/${shell.id}`} key={shell.id} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
            <div className="glass-panel hover-lift" style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
              
              <ShellImage shellId={shell.id} commonName={shell.common_name} />

              <div style={{ flexGrow: 1 }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '4px', color: 'white' }}>{shell.common_name}</h2>
                <div style={{ fontStyle: 'italic', color: '#94a3b8', marginBottom: '16px', fontSize: '0.9rem' }}>{shell.name}</div>
                
                <span style={{ 
                  display: 'inline-block', 
                  padding: '4px 12px', 
                  borderRadius: '16px', 
                  fontSize: '0.85rem', 
                  fontWeight: 'bold', 
                  color: 'white',
                  backgroundColor: getRarityColor(shell.rarity),
                  marginBottom: '16px'
                }}>
                  {shell.rarity}
                </span>

                <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '16px' }}>
                  {shell.description}
                </p>
              </div>
              
              <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '16px', color: 'var(--primary)', fontWeight: '600', textAlign: 'center' }}>
                View details &rarr;
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
