import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

async function getUserFromCookie() {
  const cookieStore = await cookies();
  const userDataCookie = cookieStore.get('current_user');

  if (!userDataCookie) {
    return null;
  }

  try {
    const userData = JSON.parse(userDataCookie.value || '{}');
    return userData;
  } catch (error) {
    console.error('Error parsing user data from cookie:', error);
    return null;
  }
}

export default async function AdminDashboard() {
  const userData = await getUserFromCookie();

  if (!userData || userData.role !== 'Admin') {
    redirect('/auth/login');
  }

  // Ambil data pengguna dari database
  const user = await prisma.user.findUnique({
    where: {
      id: userData.id
    }
  });

  if (!user || user.role !== 'Admin') {
    redirect('/unauthorized');
  }

  // Fungsi untuk logout
  const handleSignOut = async () => {
    'use server';

    const cookieStore = await cookies();
    cookieStore.delete('current_user');

    redirect('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">Welcome, {user.nama_lengkap}</span>
              <form action={handleSignOut}>
                <button
                  type="submit"
                  className="ml-4 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
                <p className="mt-2 text-gray-600">Manage customers, tests, and users</p>
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="text-3xl font-bold text-indigo-600">0</div>
                      <div className="mt-1 text-sm font-medium text-gray-500">Total Customers</div>
                    </div>
                  </div>
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="text-3xl font-bold text-indigo-600">0</div>
                      <div className="mt-1 text-sm font-medium text-gray-500">Pending Tests</div>
                    </div>
                  </div>
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="text-3xl font-bold text-indigo-600">0</div>
                      <div className="mt-1 text-sm font-medium text-gray-500">Total Users</div>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <a
                    href="/admin/users"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Manage Users
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}