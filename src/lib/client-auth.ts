import { createClient } from '@supabase/supabase-js';

// Fungsi untuk membuat client Supabase di client side
export const createSupabaseClient = () => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return supabase;
};

// Fungsi untuk login - ini akan dipanggil dari server action
export const signIn = async (email: string, password: string) => {
  // Kita panggil server action untuk signIn
  const response = await fetch('/api/auth/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  return response.json();
};

// Fungsi untuk logout - ini akan dipanggil dari server action
export const signOut = async () => {
  const response = await fetch('/api/auth/signout', {
    method: 'POST',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Logout failed');
  }

  // Hapus cookie dari sisi klien juga
  document.cookie = 'current_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

  return response.json();
};