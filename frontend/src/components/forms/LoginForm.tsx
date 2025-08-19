'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/services/auth';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
  
    try {
      const { token, user } = await loginUser({ email, password });
  
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user)); // ✅ EKLENDİ
  
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };
  
  return (
    <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Login</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        className="w-full mb-3 p-2 border border-gray-300 rounded text-black"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full mb-4 p-2 border border-gray-300 rounded text-black"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Log In
      </button>
      <p className="text-sm text-gray-600 mt-4 text-center">
        Don't have an account?{" "}
        <a href="/register" className="text-blue-700 hover:underline font-medium">
            Register here
        </a>
        </p>
    </form>
    
  );
}
