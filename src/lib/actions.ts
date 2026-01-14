'use server'

import { cookies } from 'next/headers';
import { signInWithCredentials } from '@/lib/auth';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    // Ambil data dari form
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Validasi input
    if (!email || !password) {
      return { error: 'Email dan password wajib diisi.' };
    }

    // Lakukan proses login
    const result = await signInWithCredentials(email, password);

    // Set cookie untuk menyimpan data pengguna
    const cookieStore = await cookies(); // Tambahkan await
    cookieStore.set('current_user', JSON.stringify(result.user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    // Return success status
    return { success: true, message: 'Login successful' };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Terjadi kesalahan saat login.' };
  }
}