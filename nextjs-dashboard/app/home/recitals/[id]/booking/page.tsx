import { getRecitalById } from '@/app/lib/recital';
import BookingForm from '@/app/home/recitals/[id]/booking/BookingForm';
import { redirect } from 'next/navigation';
import { auth } from '@/app/auth/auth';
import { CartProvider } from '@/app/context/CartContext';
import Image from 'next/image';

type Params = { id: string };

export default async function BookingPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const recital = await getRecitalById(Number(id));

  if (!recital) {
    return <div>Recital not found</div>;
  }

  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const mainImage = recital.images?.[0]?.url ?? '/placeholder-event.webp';

  return (
    <div className="max-w-5xl mx-auto p-6 bg-[#23232b] text-[#fff0f6] rounded-lg shadow-lg mt-8 flex flex-col md:flex-row gap-10">
      
      <div className="md:w-1/2 w-full">
        <h1 className="text-2xl font-bold mb-6">Book Your Ticket</h1>
        <CartProvider>
          <BookingForm recital={recital} />
        </CartProvider>
      </div>

      
      <div className="md:w-1/2 w-full flex flex-col items-center gap-4">
        <Image
          src={mainImage}
          alt={recital.name}
          width={300}
          height={200}
          className="rounded-lg border-4 border-pink-200 shadow-md object-cover"
        />
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-pink-200">{recital.name}</h2>
          <p className="text-md">Artist: {recital.artist?.name}</p>
          <p className="text-md">Date: {new Date(recital.date).toLocaleString()}</p>
          <p className="text-md">Price: ${recital.price}</p>
          {recital.info && <p className="text-sm mt-2 text-gray-300">{recital.info}</p>}
          <div className="mt-4 text-sm text-gray-400">
            <div>{recital.venue?.name}</div>
            <div>{recital.venue?.address}</div>
            <div>{recital.venue?.city}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
