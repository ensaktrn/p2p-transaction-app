"use client";

import { useRouter } from "next/navigation";
import { useFriends, FRIENDS_KEY } from "@/hooks/useFriends";
import { removeFriend } from "@/services/friends";
import { toast } from "sonner";
import { mutate } from "swr";

type Friend = {
  id: number;
  email: string;
  name?: string | null;
  since?: string;
};

export default function FriendsList() {
  const router = useRouter();
  const { friends, isLoading, error, mutateLocal } = useFriends();

  if (isLoading) return <p>Loading friends...</p>;
  if (error) return <p className="text-red-600 text-sm">Failed to load friends.</p>;

  const handleRemove = async (friendUserId: number) => {
    // optimistic UI
    mutateLocal((prev) => prev.filter((f: Friend) => f.id !== friendUserId));
    try {
      await removeFriend(friendUserId);
      toast.success("Friend removed");
      mutate(FRIENDS_KEY); // revalidate
    } catch (e: any) {
      toast.error(e.message || "Failed to remove");
      mutate(FRIENDS_KEY); // rollback/revalidate
    }
  };

  const handleSendMoney = (email: string) => {
    // Transfer sayfasına yönlendir ve alıcı emailini önceden doldur
    router.push(`/dashboard/transfer?to=${encodeURIComponent(email)}`);
  };

  if (!friends.length) {
    return (
      <div className="bg-white dark:bg-gray-300 shadow rounded-xl p-4">
        <h2 className="text-lg font-semibold mb-3">Friends</h2>
        <p className="text-gray-500 text-sm">No friends yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-300 shadow rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-3">Friends</h2>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {friends.map((f: Friend) => (
          <li key={f.id} className="py-3 flex items-center justify-between">
            <div className="text-sm">
              <p className="font-medium">{f.name ?? f.email}</p>
              <p className="text-gray-500">{f.email}</p>
            </div>
            <div className="flex items-center gap-2">
              {/* Send Money (solda) */}
              <button
                onClick={() => handleSendMoney(f.email)}
                className="text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg px-3 py-2"
              >
                Send Money
              </button>
              {/* Request Money (ortada) */}
              <button
                onClick={() => router.push(`/dashboard/requests?to=${encodeURIComponent(f.email)}`)}
                className="text-sm bg-amber-600 hover:bg-amber-700 text-white rounded-lg px-3 py-2"
              >
                Request Money
              </button>
              {/* Remove (sağda) */}
              <button
                onClick={() => handleRemove(f.id)}
                className="text-sm bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-2"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
