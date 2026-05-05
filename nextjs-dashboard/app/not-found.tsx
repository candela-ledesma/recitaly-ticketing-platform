'use client';

import Link from 'next/link';
import { FaGuitar, FaSadTear } from 'react-icons/fa';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1e1e28] text-[#fff0f6] text-center px-4">
      <FaSadTear className="text-6xl text-pink-300 mb-4 animate-bounce" />
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-pink-200">
        404 - This Page Missed the Gig
      </h1>
      <p className="text-lg md:text-xl mb-6 max-w-xl">
        We looked backstage, under the drums, and even behind the amps… but we couldn’t find the page you’re looking for.
      </p>
      <div className="mb-6">
        <FaGuitar className="text-5xl text-pink-300 animate-pulse inline-block mr-2" />
        <span className="text-pink-100 font-semibold text-lg">It might’ve gone on tour 🚐🎶</span>
      </div>
      <Link
        href="/"
        className="mt-4 px-6 py-3 rounded-2xl bg-pink-200 text-[#23232b] font-bold hover:bg-pink-300 transition"
      >
        Take me home 🎤
      </Link>
    </div>
  );
}
