'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function DormDashboard() {
  const [captions, setCaptions] = useState([]);
  const [dorms, setDorms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function checkUserAndFetch() {
      // 1. Check if a user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      // 2. Only fetch data if the user exists
      if (user) {
        const { data: captionsData } = await supabase.from('captions').select('*');
        const { data: dormsData } = await supabase.from('dorms').select('*');
        setCaptions(captionsData || []);
        setDorms(dormsData || []);
      }
      setLoading(false);
    }
    checkUserAndFetch();
  }, []);

  const getMentionCount = (dormShortName) => {
    return captions.filter(cap => 
      cap.content?.toLowerCase().includes(dormShortName.toLowerCase())
    ).length;
  };

  if (loading) return <div style={styles.container}>Loading security clearance...</div>;

  // --- GATED UI (If not logged in) ---
  if (!user) {
    return (
      <div style={styles.container}>
        <div style={styles.gatedCard}>
          <h1 style={{fontSize: '2rem', marginBottom: '10px'}}>🛑 Gated Access</h1>
          <p style={{marginBottom: '20px', color: '#666'}}>You must be signed in to view dorm analytics.</p>
          <a href="/login" style={styles.loginButton}>Sign in with Google</a>
        </div>
      </div>
    );
  }

  // --- PROTECTED DASHBOARD (If logged in) ---
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>🏫 Dorm Mention Dashboard</h1>
        <button onClick={() => supabase.auth.signOut()} style={styles.logoutBtn}>Logout</button>
      </header>

      <div style={styles.grid}>
        {dorms.map((dorm) => (
          <div key={dorm.id} style={styles.card}>
            <h2 style={styles.dormName}>{dorm.name}</h2>
            <div style={styles.countBadge}>
              {getMentionCount(dorm.short_name)} Mentions
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '40px', backgroundColor: '#f0f4f8', minHeight: '100vh', fontFamily: 'system-ui' },
  gatedCard: { backgroundColor: 'white', padding: '60px', borderRadius: '20px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', maxWidth: '400px', margin: '100px auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
  title: { fontSize: '28px', color: '#1a365d' },
  loginButton: { backgroundColor: '#3b82f6', color: 'white', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', display: 'inline-block' },
  logoutBtn: { backgroundColor: '#cbd5e0', border: 'none', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' },
  card: { backgroundColor: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', textAlign: 'center' },
  dormName: { fontSize: '20px', color: '#2d3748', marginBottom: '10px' },
  countBadge: { backgroundColor: '#ebf8ff', color: '#2b6cb0', padding: '5px 12px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold', display: 'inline-block' }
};