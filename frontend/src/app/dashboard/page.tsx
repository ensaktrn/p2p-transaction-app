'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/dashboard/Header';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // ❗️Sadece token varsa basic bilgilerle gösterim (dummy)
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
  
        {user && (
          <Header name={user.name} onLogout={handleLogout} />
        )}
  
        {user ? (
          <>
            <p className="text-lg mb-2">
              💰 Balance: <span className="font-semibold">${user.balance}</span>
            </p>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}
