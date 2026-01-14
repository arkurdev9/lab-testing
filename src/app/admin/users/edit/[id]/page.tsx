import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createHash } from 'crypto';

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

export default async function EditUserPage({ params }: { params: { id: string } }) {
  const userId = parseInt(params.id);
  const userData = await getUserFromCookie();

  if (!userData || userData.role !== 'Admin') {
    redirect('/auth/login');
  }

  // Ambil data pengguna dari database
  const currentUser = await prisma.user.findUnique({
    where: {
      id: userData.id
    }
  });

  if (!currentUser || currentUser.role !== 'Admin') {
    redirect('/unauthorized');
  }

  // Ambil data user yang akan diedit
  const userToEdit = await prisma.user.findUnique({
    where: {
      id: userId
    }
  });

  if (!userToEdit) {
    redirect('/admin/users');
  }

  // Fungsi untuk memperbarui user
  const updateUser = async (formData: FormData) => {
    'use server';
    
    const nama_lengkap = formData.get('nama_lengkap') as string;
    const email = formData.get('email') as string;
    const newPassword = formData.get('password') as string;
    const role = formData.get('role') as string;
    const aktif = formData.get('aktif') === 'true';
    
    // Siapkan data untuk update
    const updateData: any = {
      nama_lengkap,
      email,
      role,
      aktif
    };
    
    // Jika password baru dimasukkan, tambahkan ke update data
    if (newPassword) {
      updateData.password_hash = createHash('sha256').update(newPassword).digest('hex');
    }
    
    // Update user
    await prisma.user.update({
      where: {
        id: userId
      },
      data: updateData
    });
    
    redirect('/admin/users');
  };

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
              <h1 className="text-xl font-semibold text-gray-900">Edit User</h1>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">Welcome, {currentUser.nama_lengkap}</span>
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
        <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <div className="px-4 sm:px-0">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">User Information</h3>
                  <p className="mt-1 text-sm text-gray-500">Update the details for the user account.</p>
                </div>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <form action={updateUser}>
                  <div className="shadow sm:rounded-md sm:overflow-hidden">
                    <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                      <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-6 sm:col-span-3">
                          <label htmlFor="nama_lengkap" className="block text-sm font-medium text-gray-700">
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="nama_lengkap"
                            id="nama_lengkap"
                            defaultValue={userToEdit.nama_lengkap}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-4">
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                          </label>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            defaultValue={userToEdit.email}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            New Password (optional)
                          </label>
                          <input
                            type="password"
                            name="password"
                            id="password"
                            minLength={6}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                            Role
                          </label>
                          <select
                            id="role"
                            name="role"
                            required
                            defaultValue={userToEdit.role}
                            className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          >
                            <option value="Admin">Admin</option>
                            <option value="Petugas Lapangan">Petugas Lapangan</option>
                            <option value="Kepala Lab">Kepala Lab</option>
                          </select>
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label htmlFor="aktif" className="block text-sm font-medium text-gray-700">
                            Status
                          </label>
                          <select
                            id="aktif"
                            name="aktif"
                            required
                            defaultValue={userToEdit.aktif.toString()}
                            className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          >
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                      <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Save Changes
                      </button>
                      <a
                        href="/admin/users"
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Cancel
                      </a>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}