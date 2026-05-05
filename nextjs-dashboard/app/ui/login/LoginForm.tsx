'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { getSession } from 'next-auth/react';

export default function LoginForm() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError('Invalid email or password');
    } else {
      const session = await getSession();

      if (session?.user.role === 'ADMIN') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/home'; // or wherever your client page is
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        autoComplete="username"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full px-4 py-2 rounded bg-[#23232b] border border-pink-200 text-[#fff0f6] focus:outline-none focus:ring-2 focus:ring-pink-300"
        required
      />

      <input
        type="password"
        placeholder="Password"
        autoComplete="current-password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full px-4 py-2 rounded bg-[#23232b] border border-pink-200 text-[#fff0f6] focus:outline-none focus:ring-2 focus:ring-pink-300"
        required
      />

      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-pink-200 text-[#23232b] font-bold py-2 rounded hover:bg-pink-300 transition disabled:bg-pink-100"
      >
        {loading ? 'Signing in…' : 'Login'}
      </button>
    </form>
  );
}
