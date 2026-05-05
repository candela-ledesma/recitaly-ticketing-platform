import { Recital, Photo } from '../../types/recital';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

const RecitalCard = React.memo(function RecitalCard({ recital }: { recital: Recital }) {

  const imageSrc  = recital.images?.[0]?.url ?? '/placeholder-event.webp';
  const artistName = recital.artist?.name ?? 'Unknown Artist';
  const venueName  = recital.venue?.name  ?? 'Unknown Venue';
  const city       = recital.venue?.city  ?? 'Unknown City';
  const dateLabel  = new Date(recital.date).toLocaleString();

  return (
    <Link href={`/home/recitals/${recital.id}`} className="block">
      <div className="flex items-center bg-[#2e2e38] rounded-xl p-4 shadow-lg transition-colors hover:bg-pink-200 hover:text-[#23232b] group cursor-pointer">
        <div className="flex-shrink-0 w-20 h-20 mr-6 relative" style={{ minWidth: 80, minHeight: 80 }}>
          <Image
            src={imageSrc}
            alt={recital.name || 'Recital Image'}
            fill
            sizes="200px"
            className="rounded-lg object-cover"
          />
        </div>

        <div className="flex-1">
          <div className="text-xl font-bold text-white group-hover:text-[#23232b]">
            {recital.name || 'Untitled Event'}
          </div>
          <div className="text-pink-200 text-lg group-hover:text-[#23232b]">
            {artistName}
          </div>
        </div>

        <div className="hidden sm:block text-right ml-6 min-w-[140px]">
          <div className="text-[#fff0f6] text-sm group-hover:text-[#23232b]">
            {dateLabel}
          </div>
          <div className="text-pink-200 text-sm group-hover:text-[#23232b]">
            {venueName}
          </div>
          <div className="text-[#fff0f6] text-xs group-hover:text-[#23232b]">
            {city}
          </div>
        </div>
      </div>
    </Link>
  );
}
);
export default RecitalCard;