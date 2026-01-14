import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
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

  if (!userData || userData.role !== 'Admin') {
    redirect('/unauthorized');
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md">
          <div className="p-4">
            <h2 className="text-xl font-semibold text-gray-800">Admin Panel</h2>
          </div>
          <nav className="mt-5 px-2">
            <div className="space-y-1">
              <a
                href="/admin/dashboard"
                className="flex items-center px-4 py-2 text-base font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-100"
              >
                Dashboard
              </a>
              <a
                href="/admin/users"
                className="flex items-center px-4 py-2 text-base font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-100"
              >
                User Management
              </a>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}