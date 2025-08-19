"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard/transactions", label: "History" },
  { href: "/dashboard/topup",        label: "Top-Up" },
  { href: "/dashboard/transfer",     label: "Transfer" },
  { href: "/dashboard/account",      label: "Account" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-white dark:bg-gray-900">
      <ul className="mx-auto max-w-xl grid grid-cols-4">
        {items.map((it) => {
          const active = pathname.startsWith(it.href);
          return (
            <li key={it.href}>
              <Link
                href={it.href}
                className={`block text-center py-3 text-sm ${
                  active
                    ? "font-semibold text-blue-700 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
