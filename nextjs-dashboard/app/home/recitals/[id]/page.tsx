//app/home/recitals/[id]/page.tsx
import { getRecitalById } from '@/app/lib/recital';
import Image from 'next/image';
import { BookButton } from '@/app/ui/home/BookButton';
import RecitalPlaylist from '@/app/ui/home/recitals/RecitalPlaylist'


type Params = { id: string }

export default async function RecitalDetailPage({ params,
}: {

  params: Promise<Params>
}) {
  
  const { id } = await params
  const recital = await getRecitalById(Number(id))

  if (!recital) return <div>Recital not found</div>;

  const mainImage = recital.images?.[0]?.url ?? '/placeholder-event.webp';

  return (
    <div className="flex flex-col md:flex-row gap-10 bg-[#23232b] text-[#fff0f6] p-8 rounded-xl shadow-lg max-w-5xl mx-auto mt-8">
      {/* -------- lado izquierdo -------- */}
      <div className="flex-1 flex flex-col gap-6 justify-center">
        <h1 className="text-4xl font-bold mb-2">{recital.name}</h1>
        <div className="text-2xl text-pink-200 font-semibold mb-4">
          {recital.artist?.name}
        </div>

        <div className="text-lg">
          <span className="font-semibold">Date:</span>{' '}
          {new Date(recital.date).toLocaleString()}
        </div>

        <div className="text-lg">
          <span className="font-semibold">Price:</span>{' '}
          {recital.price ? `$${recital.price}` : 'See Ticketmaster'}
        </div>

        {recital.info && (
          <div className="text-md">
            <span className="font-semibold">Info:</span> {recital.info}
          </div>
        )}
        <RecitalPlaylist artist={recital.artist?.name ?? ''} recital={recital.name} />
      </div>

      {/* -------- lado derecho -------- */}
      <div className="flex flex-col items-center flex-1">
        <Image
          src={mainImage}
          alt={recital.name}
          width={320}
          height={256}
          className="w-full max-w-xs h-64 object-cover rounded-xl border-4 border-pink-200 shadow-md mb-4"
          placeholder="blur"
          blurDataURL="/placeholder-event.webp"
        />

        <BookButton recitalId={recital.id} />
        

        <div className="bg-[#2e2e38] rounded-lg p-4 w-full max-w-xs text-sm mt-6">
          <div className="font-semibold text-pink-200 mb-1">Venue</div>
          <div>{recital.venue?.name}</div>
          <div>{recital.venue?.address}</div>
          <div>{recital.venue?.city}</div>
        </div>

       

      </div>
      
    </div>
    
  );
}
