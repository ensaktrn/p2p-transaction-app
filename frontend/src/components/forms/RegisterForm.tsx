'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/services/auth';

export default function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false); // ✅ Başarı durumu

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      await registerUser(form);
      setSuccess(true); // ✅ Kayıt başarılı mesajı göster

      setTimeout(() => {
        router.push('/login'); // 🔁 1.5 saniye sonra login'e git
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
    >
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Register</h1>

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">Registration successful! Redirecting to login...</p>}

      <input
        name="name"
        type="text"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        required
        className="w-full mb-3 p-2 border border-gray-300 rounded text-black"
      />

      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
        className="w-full mb-3 p-2 border border-gray-300 rounded text-black"
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
        className="w-full mb-4 p-2 border border-gray-300 rounded text-black"
      />

      <button
        type="submit"
        className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800"
      >
        Register
      </button>

      <p className="text-sm text-gray-700 mt-4 text-center">
        Already have an account?{' '}
        <a href="/login" className="text-blue-700 hover:underline font-medium">
          Log in
        </a>
      </p>
    </form>
  );
}
