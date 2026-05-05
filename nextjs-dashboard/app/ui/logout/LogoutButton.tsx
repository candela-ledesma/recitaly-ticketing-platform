'use client';
import { signOut } from 'next-auth/react';   // ✅ SAFE para el browser

export function LogoutButton() {
return (
    <button
        onClick={() => signOut({ redirectTo: '/login' })}
        className="bg-pink-200 text-[#23232b] px-4 py-2 rounded font-bold hover:bg-pink-300"
    >
        Log out
    </button>
    );
}
