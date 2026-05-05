//Simple button to recital/id/booking/page
'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

export  function BookButton({ recitalId }: { recitalId: number }) {
  const { data: session } = useSession();

  return (
    <Link
      href={`/home/recitals/${recitalId}/booking`}
      className="flex items-center justify-center gap-2 bg-pink-200 text-[#23232b] hover:bg-pink-300 hover:text-[#23232b] font-semibold px-4 py-2 rounded-lg transition text-sm"
      aria-label="Book Recital"
    >
      {session ? 'Book Now' : 'Sign In to Book'}
    </Link>
  );
}