'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/client-auth';

const DynamicAuthForm = () => {
  const [isChecking, setIsChecking] = useState(true);
  const [hasAdmin, setHasAdmin] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });
  const [registerForm, setRegisterForm] = useState({
    nama_lengkap: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Cek apakah sudah ada admin saat komponen dimuat
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await fetch('/api/check-admin');
        const data = await response.json();
        setHasAdmin(data.hasAdmin);
      } catch (err) {
        console.error('Error checking admin status:', err);
        setError('Failed to check admin status');
      } finally {
        setIsChecking(false);
      }
    };

    checkAdminStatus();
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Set cookie untuk menyimpan data pengguna agar bisa digunakan oleh middleware
      document.cookie = `current_user=${JSON.stringify(data.user)}; path=/;`;

      // Redirect berdasarkan role pengguna setelah login
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin-register/first', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Setelah registrasi berhasil, login otomatis
      setHasAdmin(true);

      // Set cookie untuk menyimpan data pengguna agar bisa digunakan oleh middleware
      document.cookie = `current_user=${JSON.stringify(data.user)}; path=/;`;

      // Redirect ke dashboard
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <p className="text-lg text-gray-700">Checking admin status...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {hasAdmin ? (
          // Form Login
          <>
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Sign in to your account
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Access your admin or user panel
              </p>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleLoginSubmit}>
              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="text-sm text-red-700">{error}</div>
                </div>
              )}
              <input type="hidden" name="remember" defaultValue="true" />
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="email-address" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>
          </>
        ) : (
          // Form Registrasi Admin Pertama
          <>
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Create First Admin Account
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Register the first admin for this system
              </p>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleRegisterSubmit}>
              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="text-sm text-red-700">{error}</div>
                </div>
              )}
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="full-name" className="sr-only">
                    Full Name
                  </label>
                  <input
                    id="full-name"
                    name="nama_lengkap"
                    type="text"
                    autoComplete="name"
                    required
                    value={registerForm.nama_lengkap}
                    onChange={(e) => setRegisterForm({...registerForm, nama_lengkap: e.target.value})}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Full Name"
                  />
                </div>
                <div>
                  <label htmlFor="reg-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="reg-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <label htmlFor="reg-password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="reg-password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {loading ? 'Creating account...' : 'Create Admin Account'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default DynamicAuthForm;