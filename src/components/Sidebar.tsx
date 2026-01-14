'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Tutup sidebar saat pindah halaman
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Sidebar */}
        <div 
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b lg:block">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold text-gray-800">Admin Panel</h2>
            </div>
            <button 
              type="button" 
              className="p-2 text-gray-600 lg:hidden ml-auto"
              onClick={() => setSidebarOpen(false)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <nav className="mt-5 px-2">
            <div className="space-y-1">
              <a
                href="/admin/dashboard"
                className={`flex items-center px-4 py-2 text-base font-medium rounded-md ${
                  pathname === '/admin/dashboard' 
                    ? 'text-white bg-indigo-600' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </a>
              <a
                href="/admin/users"
                className={`flex items-center px-4 py-2 text-base font-medium rounded-md ${
                  pathname === '/admin/users' 
                    ? 'text-white bg-indigo-600' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                User Management
              </a>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          {/* Top navigation bar */}
          <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white shadow-sm lg:hidden">
            <button 
              type="button" 
              className="p-2 text-gray-600"
              onClick={() => setSidebarOpen(true)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-gray-800">
              {pathname === '/admin/dashboard' ? 'Admin Dashboard' : 
               pathname === '/admin/users' ? 'User Management' :
               pathname === '/admin/users/add' ? 'Add User' :
               pathname.startsWith('/admin/users/edit') ? 'Edit User' : 'Admin Panel'}
            </h1>
            <div className="w-10"></div> {/* Spacer for alignment */}
          </header>

          <div className="p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}