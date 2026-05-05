'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const links = [
  { name: 'Home', href: '/home', icon: HomeIcon },
  { name: 'profile', href: '/home/profile', icon: UserGroupIcon },
  
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <div className="flex gap-4">
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition',
              pathname === link.href
                ? 'bg-pink-200 text-[#23232b]'
                : 'text-[#fff0f6] hover:bg-pink-100 hover:text-[#23232b]'
            )}
          >
            <LinkIcon className="w-6" />
            <span className='hidden sm:inline ml-1' >{link.name}</span>
          </Link>
        );
      })}
    </div>
  );
}