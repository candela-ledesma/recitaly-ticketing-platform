'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { FaSkullCrossbones, FaRedoAlt } from 'react-icons/fa';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('💥 Caught error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1e1e28] text-[#fff0f6] text-center px-4">
      <FaSkullCrossbones className="text-6xl text-pink-300 mb-4 animate-spin-slow" />
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-pink-200">
        Oops! The Stage Collapsed
      </h1>
      <p className="text-lg md:text-xl mb-6 max-w-xl">
        Something went horribly, spectacularly wrong. It might’ve been a tech fail... or maybe the drummer spilled coffee on the server.
      </p>
      <button
        onClick={() => reset()}
        className="mt-4 px-6 py-3 rounded-2xl bg-pink-200 text-[#23232b] font-bold hover:bg-pink-300 transition flex items-center gap-2"
      >
        <FaRedoAlt className="text-xl" />
        Try Again, Rockstar
      </button>
      <Link
        href="/"
        className="mt-4 px-6 py-3 rounded-2xl bg-pink-200 text-[#23232b] font-bold hover:bg-pink-300 transition"
      >
        Take me home 🎤
      </Link>
    </div>
  );
}
