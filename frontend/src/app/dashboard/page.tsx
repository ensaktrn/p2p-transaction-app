'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/dashboard/Header';
import TransactionList from '@/components/dashboard/TransactionList';
import BalanceCard from '@/components/dashboard/BalanceCard';

type UserResp = { id: number; email: string; balance: number; name?: string | null };

export default function DashboardPage() {
  const [user, setUser] = useState<UserResp | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    let userId = localStorage.getItem('userId');

    // Eski oturumlarda sadece "user" olabilir: oradan id’yi çıkarıp kurtaralım.
    if (!userId) {
      const stored = localStorage.getItem('user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed?.id) {
            userId = String(parsed.id);
            localStorage.setItem('userId', userId);
          }
        } catch {}
      }
    }

    if (!token || !userId) {
      router.push('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('userId');
          router.push('/login');
          return;
        }

        if (!res.ok) throw new Error(await res.text());
        const data: UserResp = await res.json();
        setUser(data);
      } catch (e) {
        console.error('Fetch user error:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []); // ❗️Sabit bırak: “dependency array size changed” hatasını önler

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 text-gray-900 p-6">
        <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <Header name={user.name ?? user.email} onLogout={handleLogout} />
        <BalanceCard balance={Number(user.balance ?? 0)} />
        <TransactionList />
      </div>
    </div>
  );
}
