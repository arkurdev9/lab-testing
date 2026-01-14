import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

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

export default async function UserManagementPage() {
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

  // Ambil semua pengguna kecuali admin saat ini
  const users = await prisma.user.findMany({
    where: {
      id: { not: user.id }
    },
    select: {
      id: true,
      nama_lengkap: true,
      email: true,
      role: true,
      aktif: true
    }
  });

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
              <h1 className="text-xl font-semibold text-gray-900">User Management</h1>
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
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">User List</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage system users and their roles</p>
              </div>
              
              <div className="px-4 py-5 sm:p-6">
                <div className="mb-6">
                  <a 
                    href="/admin/users/add"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add New User
                  </a>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{user.nama_lengkap}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{user.role}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.aktif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {user.aktif ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <a href={`/admin/users/edit/${user.id}`} className="text-indigo-600 hover:text-indigo-900">
                              Edit
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}