'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function DormDashboard() {
  const [captions, setCaptions] = useState([]);
  const [dorms, setDorms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: captionsData } = await supabase.from('captions').select('*');
      const { data: dormsData } = await supabase.from('dorms').select('*');
      
      setCaptions(captionsData || []);
      setDorms(dormsData || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  // UPDATED LOGIC: Using 'short_name' and 'content'
  const getMentionCount = (dormShortName) => {
    return captions.filter(cap => 
      cap.content?.toLowerCase().includes(dormShortName.toLowerCase())
    ).length;
  };

  if (loading) return <div style={styles.loader}>Calculating Dorm Mentions...</div>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>🏫 Dorm Mention Dashboard</h1>
        <p style={styles.subtitle}>Analyzing {captions.length} total captions</p>
      </header>

      <div style={styles.grid}>
        {dorms.map((dorm) => {
          const count = getMentionCount(dorm.short_name); // Using short_name here
          return (
            <div key={dorm.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <h2 style={styles.dormName}>{dorm.short_name}</h2>
                <span style={styles.badge}>{count} mentions</span>
              </div>
              <div style={styles.progressBarContainer}>
                <div style={{...styles.progressBar, width: `${Math.min(count * 5, 100)}%`}}></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Styles remain the same as the previous "pretty" version
const styles = {
  container: { padding: '40px 20px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' },
  header: { textAlign: 'center', marginBottom: '40px' },
  title: { fontSize: '2.5rem', color: '#1e293b' },
  subtitle: { color: '#64748b' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', maxWidth: '1000px', margin: '0 auto' },
  card: { backgroundColor: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  dormName: { fontSize: '1.1rem', fontWeight: 'bold', margin: 0 },
  badge: { backgroundColor: '#eff6ff', color: '#2563eb', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' },
  progressBarContainer: { height: '6px', backgroundColor: '#f1f5f9', borderRadius: '3px' },
  progressBar: { height: '100%', backgroundColor: '#3b82f6', borderRadius: '3px' },
  loader: { textAlign: 'center', marginTop: '100px', color: '#64748b' }
};