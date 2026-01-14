import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ambil data pengguna dari cookie
  const cookieStore = await cookies(); // Tambahkan await
  const userDataCookie = cookieStore.get('current_user');

  if (!userDataCookie) {
    redirect('/auth/login');
  }

  let userData;
  try {
    userData = JSON.parse(userDataCookie.value || '{}');
  } catch (error) {
    console.error('Error parsing user data from cookie:', error);
    redirect('/auth/login');
  }

  if (!userData || !['Petugas Lapangan', 'Kepala Lab'].includes(userData.role)) {
    redirect('/unauthorized');
  }

  return (
    <div>
      {children}
    </div>
  );
}