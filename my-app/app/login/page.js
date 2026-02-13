// app/login/page.js
'use client';
import { supabase } from '@/utils/supabaseClient';
export default function LoginPage() {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // PUT IT HERE: This is the ID from your assignment
        queryParams: {
          client_id: '388960353527-fh4grc6mla425lg0e3g1hh67omtrdihd.apps.googleusercontent.com',
        },
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div>
      <button onClick={handleLogin}>Sign in with Google</button>
    </div>
  );
}