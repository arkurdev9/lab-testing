import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function DashboardPage() {
  // Ambil data pengguna dari cookie
  const cookieStore = await cookies(); // Tambahkan await
  const userDataCookie = cookieStore.get('current_user');

  if (!userDataCookie) {
    // Jika tidak login, redirect ke halaman login
    redirect('/auth/login');
  }

  let userData;
  try {
    userData = JSON.parse(userDataCookie.value || '{}');
  } catch (error) {
    console.error('Error parsing user data from cookie:', error);
    redirect('/auth/login');
  }

  // Redirect ke halaman dashboard berdasarkan role
  if (userData.role === 'Admin') {
    redirect('/admin/dashboard');
  } else if (['Petugas Lapangan', 'Kepala Lab'].includes(userData.role)) {
    redirect('/user/dashboard');
  } else {
    // Jika role tidak dikenal, redirect ke halaman unauthorized
    redirect('/unauthorized');
  }
}