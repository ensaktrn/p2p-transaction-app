'use client';

type Props = {
  name: string;
  onLogout: () => void;
};

export default function Header({ name, onLogout }: Props) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Welcome, {name}</h1>
      <button
        onClick={onLogout}
        className="text-sm text-red-600 hover:underline"
      >
        Logout
      </button>
    </div>
  );
}
