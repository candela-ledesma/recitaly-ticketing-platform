import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { SessionProvider } from 'next-auth/react';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Recitaly',
  description: 'Discover your next favorite concert',
  icons: {
    icon: '/Ticket.jpeg',
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <SessionProvider>
          {children}
        </SessionProvider></body>
    </html>
  );
}
