'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { LogoutButton } from '../ui/logout/LogoutButton';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#23232b] text-[#fff0f6] p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Panel</h1>
    <div className="absolute top-4 right-4 flex gap-4">
      <Link
          href="/home"
          className={clsx(
            'px-4 py-2 rounded font-semibold bg-pink-200 text-[#23232b] hover:bg-pink-300 transition',
            
          )}
        >
          Home
        </Link>
        <LogoutButton /></div>
      {/* Navegación entre secciones */}
      <div className="flex justify-center gap-4 mb-6">
        <Link
          href="/admin"
          className={clsx(
            'px-4 py-2 rounded font-semibold',
            pathname === '/admin'
              ? 'bg-pink-200 text-[#23232b]'
              : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600 transition'
          )}
        >
          CRUD Recitals
        </Link>
        <Link
          href="/admin/report"
          className={clsx(
            'px-4 py-2 rounded font-semibold',
            pathname === '/admin/report'
              ? 'bg-pink-200 text-[#23232b]'
              : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600 transition'
          )}
        >
          Reports
        </Link>
        
      </div>

      {/* Contenido dinámico */}
      <div className="flex flex-col md:flex-row gap-8">{children}</div>
    </div>
  );
}
