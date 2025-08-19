"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/dashboard/Header";
import BalanceCard from "@/components/dashboard/BalanceCard";
import BottomNav from "@/components/dashboard/BottomNav";

type UserResp = { id: number; email: string; balance: number; name?: string | null };

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserResp | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Tek seferlik auth + kullanıcı çekme
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) { router.push("/login"); return; }

    const run = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) { router.push("/login"); return; }
        setUser(await res.json());
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []); // sabit tut

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    router.push("/login");
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
    <div className="min-h-screen bg-gray-100 text-gray-900 pb-16"> 
      {/* pb-16: BottomNav için boşluk */}
      <div className="max-w-xl mx-auto p-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Header name={user.name ?? user.email} onLogout={handleLogout} />
          <BalanceCard balance={Number(user.balance ?? 0)} />
          {/* Tab içerikleri */}
          {children}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
