"use client";

import Header from "@/components/dashboard/Header";
import BalanceCard from "@/components/dashboard/BalanceCard";
import BottomNav from "@/components/dashboard/BottomNav";
import { useUser } from "@/hooks/useUser";

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 text-gray-900 p-6">
        <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 pb-16">
      <div className="max-w-xl mx-auto p-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Header name={user.name ?? user.email} onLogout={handleLogout} />
          <BalanceCard balance={Number(user.balance ?? 0)} />
          {children}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
