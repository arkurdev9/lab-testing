'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect ke dashboard setelah sedikit delay untuk memastikan cookie disetel
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 100); // Delay kecil untuk memastikan cookie disetel

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Login Successful
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    </div>
  );
}