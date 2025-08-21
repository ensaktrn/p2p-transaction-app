"use client";

import { useFriends, FRIENDS_KEY } from "@/hooks/useFriends";
import { removeFriend } from "@/services/friends";
import { toast } from "sonner";
import { mutate } from "swr";

export default function FriendsList() {
  const { friends, isLoading, error, mutateLocal } = useFriends();

  if (isLoading) return <p>Loading friends...</p>;
  if (error) return <p className="text-red-600 text-sm">Failed to load friends.</p>;

  const handleRemove = async (friendUserId: number) => {
    // optimistic
    mutateLocal(prev => prev.filter(f => f.id !== friendUserId));
    try {
      await removeFriend(friendUserId);
      toast.success("Friend removed");
      mutate(FRIENDS_KEY);
    } catch (e:any) {
      toast.error(e.message || "Failed to remove");
      mutate(FRIENDS_KEY); // rollback/revalidate
    }
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
      <ul className="divide-y divide-gray-200">
        {friends.map((f:any) => (
          <li key={f.id} className="py-3 flex items-center justify-between">
            <div className="text-sm">
              <p className="font-medium">{f.name ?? f.email}</p>
              <p className="text-gray-500">{f.email}</p>
            </div>
            <button
              onClick={()=>handleRemove(f.id)}
              className="text-sm bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-2"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
