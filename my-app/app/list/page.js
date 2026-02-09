'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';

export default function DormDashboard() {
  const [captions, setCaptions] = useState([]);
  const [dorms, setDorms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // 1. Fetch data from BOTH tables
      const { data: captionsData } = await supabase.from('captions').select('*');
      const { data: dormsData } = await supabase.from('dorms').select('*');
      
      setCaptions(captionsData || []);
      setDorms(dormsData || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  // Helper function to count mentions
  const getMentionCount = (dormName) => {
    return captions.filter(cap => 
      cap.text?.toLowerCase().includes(dormName.toLowerCase())
    ).length;
  };

  if (loading) return <div style={styles.loader}>Loading Analytics...</div>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>🏫 Dorm Mention Dashboard</h1>
        <p style={styles.subtitle}>Analyzing {captions.length} total captions from the database</p>
      </header>

      <div style={styles.grid}>
        {dorms.map((dorm) => {
          const count = getMentionCount(dorm.name);
          return (
            <div key={dorm.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <h2 style={styles.dormName}>{dorm.name}</h2>
                <span style={styles.badge}>{count} mentions</span>
              </div>
              <p style={styles.dormLocation}>📍 {dorm.location || 'Campus'}</p>
              <div style={styles.progressBarContainer}>
                <div style={{...styles.progressBar, width: `${Math.min(count * 10, 100)}%`}}></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 2. The "Pretty" Styles (CSS-in-JS)
const styles = {
  container: {
    padding: '40px 20px',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  title: {
    fontSize: '2.5rem',
    color: '#1e293b',
    marginBottom: '10px',
  },
  subtitle: {
    color: '#64748b',
    fontSize: '1.1rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    transition: 'transform 0.2s',
    border: '1px solid #e2e8f0',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  dormName: {
    fontSize: '1.25rem',
    color: '#0f172a',
    margin: 0,
  },
  badge: {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    padding: '4px 12px',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    fontWeight: '600',
  },
  dormLocation: {
    color: '#64748b',
    fontSize: '0.9rem',
    marginBottom: '20px',
  },
  progressBarContainer: {
    height: '8px',
    backgroundColor: '#e2e8f0',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3b82f6',
    transition: 'width 1s ease-in-out',
  },
  loader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '1.2rem',
    color: '#64748b',
  }
};