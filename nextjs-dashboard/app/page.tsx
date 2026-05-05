'use client';

import Link from 'next/link';
import Image from 'next/image';
import { lusitana } from '@/app/ui/fonts';
import { useEffect, useState } from 'react';
import { Pagination, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Recital } from '@/app/types/recital';
import LoginButton from './ui/home/loginButton';



export default function HomePage() {
  const [recitals, setRecitals] = useState<Recital[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/recitals?limit=30&skip=0`);
        if (!res.ok) {
          console.error('Failed to load recitals, status', res.status);
          setRecitals([]);
          return;
        }
        const data = await res.json();
        setRecitals(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch recitals', err);
        setRecitals([]);
      }
    })();
  }, []);


  const uniqueArtistRecitals = Array.from(
    new Map(
        recitals
          .filter((r) => r.artist && r.images.length > 0) // Must have artist + image
          .map((r) => [r.artist.id, r])                   // Key: artist ID
      ).values()
    );

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#1a1a1a] text-[#fff0f6] p-6">

        {/* ─── NEW button ─────────────────────────────── */}
        <div className="absolute top-4 right-4">
      <LoginButton />
        </div>
      {/* ────────────────────────────────────────────── */}
      {/* Logo con icono de ticket */}
<div className="flex items-center justify-center  mb-6 mt-6">
  <Image
    src="/RecitalyLogo.png" // o el path correcto de tu ícono
    alt="Recitaly Ticket Logo"
    width={250}
    height={48}
    priority={true}
  />
  
</div>

      {/* Hero Section */}
      <section className="text-center pt-4 pb-12 max-w-3xl">
        <h1 className={`${lusitana.className} text-5xl font-bold mb-6`}>
          Discover Live Music Experiences
        </h1>
        <p className="text-xl text-pink-200 mb-8">
          Your next favorite concert is just a few clicks away.
        </p>
        <Link
          href="/home"
          className="bg-pink-200 hover:bg-pink-300 text-[#23232b] font-semibold px-6 py-3 rounded-lg transition text-lg"
        >
          Browse Recitals
        </Link>
      </section>

      {/* Slider de artistas */}
      <section className="w-full max-w-5xl mt-4">
        <div className="swiper-wrapper">
        {uniqueArtistRecitals.length > 0 && (<Swiper
  modules={[Pagination, Navigation]}
  spaceBetween={20}
  slidesPerView={2}
  navigation
  pagination={{ clickable: true }}
  breakpoints={{
    640: { slidesPerView: 2 },
    768: { slidesPerView: 3 },
    1024: { slidesPerView: 4 },
  }}
>
  {uniqueArtistRecitals.map((recital) => (
    <SwiperSlide key={recital.artist.id}>
      <div className="flex flex-col items-center bg-[#2e2e38] p-4 rounded-lg shadow-md">
        <Image
          src={recital.images[0].url} // assuming Photo has a `.url`
          alt={recital.artist.name}
          width={200}
          height={200}
          className="rounded-full object-cover w-40 h-40 border-4 border-pink-200"
        />
        <span className="mt-4 text-lg font-semibold">{recital.artist.name}</span>
      </div>
    </SwiperSlide>
  ))}
</Swiper>)}</div>
      </section>
    </main>
  );
}
