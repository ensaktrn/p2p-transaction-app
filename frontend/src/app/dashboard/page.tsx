'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/dashboard/Header';
import BalanceCard from '@/components/dashboard/BalanceCard';
import TopupForm from '@/components/forms/TopUpForm'; 
import AddCardForm from '@/components/forms/AddCardForm';
import TransactionList from '@/components/dashboard/TransactionList';

type UserResp = { id: number; email: string; balance: number; name?: string | null };

export default function DashboardPage() {
  const [user, setUser] = useState<UserResp | null>(null);
  const [loading, setLoading] = useState(true);
  const [txRefreshKey, setTxRefreshKey] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (!token || !userId) { router.push('/login'); return; }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) { router.push('/login'); return; }
        setUser(await res.json());
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []); // sabit

  const refreshUser = async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (!token || !userId) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) setUser(await res.json());
    setTxRefreshKey(k => k + 1); // transactions da yenilensin
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    router.push('/login');
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <p>Loading...</p>
      </div>
    </div>
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <Header name={user.name ?? user.email} onLogout={handleLogout} />
        <BalanceCard balance={Number(user.balance ?? 0)} />

        {/* Kart ekleme */}
        <AddCardForm onSuccess={() => { /* kart eklendiğinde bir şey yapmak istersen */ }} />

        {/* Top up */}
        <TopupForm onSuccess={refreshUser} />

        {/* Transaction history */}
        <TransactionList refreshKey={txRefreshKey} />
      </div>
    </div>
  );
}
