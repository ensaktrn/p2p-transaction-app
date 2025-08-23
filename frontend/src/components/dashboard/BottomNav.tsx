"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const items = [
    { href: "/dashboard/transactions", label: "History" },
    { href: "/dashboard/topup",        label: "Top-Up"  },
    { href: "/dashboard/transfer",     label: "Transfer"},
    { href: "/dashboard/requests",     label: "Requests" },
    { href: "/dashboard/friends",      label: "Friends" },
    { href: "/dashboard/account",      label: "Account" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 text-gray-300 border-t border-slate-800">
      <div className="mx-auto max-w-xl">
        {/* 5 sütun = tek satır, wrap yok */}
        <ul className="grid grid-cols-6">
          {items.map((it) => {
            const active = pathname.startsWith(it.href);
            return (
              <li key={it.href} className="text-center">
                <Link
                  href={it.href}
                  className={`block py-3 text-sm ${
                    active ? "text-blue-400 font-medium" : "text-gray-300"
                  }`}
                >
                  {it.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
