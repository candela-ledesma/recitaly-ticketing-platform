'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import NavLinks from '@/app/ui/home/nav-links';
import { PowerIcon } from '@heroicons/react/24/outline';
import { ShoppingCart } from 'lucide-react';
import LoginButton from './loginButton';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline'; // Add an icon for admin


export default function TopNav() {
  const { data: session, status } = useSession();

  const isLoggedIn = status === 'authenticated';
  const isAdmin = session?.user?.role === 'ADMIN';
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-[#23232b] border-b border-pink-200">
      {/* Navigation links */}
      <div className="flex gap-6">
        <NavLinks />
        {isAdmin && (
          <a
            href="/admin"
            className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition text-[#fff0f6] hover:bg-pink-100 hover:text-[#23232b]"
          >
            <DocumentDuplicateIcon className="w-6" />
            <span className="hidden sm:inline ml-1">Admin Panel</span>
          </a>
        )}
      </div>

      {/* Auth button */}
      <div className="flex items-center gap-4">
      {isLoggedIn ? (
        
         <button
         onClick={() => window.location.href = '/home/cart'}
          className="p-3 rounded-md bg-pink-200 text-[#23232b] p-2 px-4 text-sm font-medium hover:bg-pink-300 hover:text-[#23232b] transition"
          aria-label="Open cart">
    
            <ShoppingCart className="w-6 h-6" />
          </button>
          
        ) : (
          <div></div> )
         }<LoginButton /> </div>
    </nav>
  );
}
