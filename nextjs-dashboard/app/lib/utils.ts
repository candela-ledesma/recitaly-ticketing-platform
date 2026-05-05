import { prisma } from './prisma';

export async function saveTicketmasterEvent(event: any) {
  const existing = await prisma.recital.findUnique({
  where: { tmId: event.id },
});

if (existing) {
  return false; // Event already exists
}
  // --- ARTIST ---
  const artistData = event._embedded?.attractions?.[0];
  let artist = null;
  if (artistData) {
    artist = await prisma.artist.upsert({
      where: { name: artistData.name },
      update: {},
      create: {
        name: artistData.name,
        images: {
          create: (artistData.images || []).map((img: any) => ({
            url: img.url,
            ratio: img.ratio,
            height: img.height,
            width: img.width,
            fallback: img.fallback,
          })),
        },
      },
      include: { images: true },
    });
  }

  // --- VENUE ---
  const venueData = event._embedded?.venues?.[0];
  let venue = null;
  if (venueData) {
    venue = await prisma.venue.upsert({
      where: { tmId: venueData.id  },
      update: {},
      create: {
        tmId: venueData.id || '',
        name: venueData.name,
        type: venueData.type || '',
        locate: venueData.locate || '',
        location: venueData.location?.longitude && venueData.location?.latitude
          ? `${venueData.location.latitude},${venueData.location.longitude}`
          : '',
        url: venueData.url || '',
        address: venueData.address?.line1 || '',
        city: venueData.city?.name || '',
        country: venueData.country?.name || '',
        images: {
          create: (venueData.images || []).map((img: any) => ({
            url: img.url,
            ratio: img.ratio,
            height: img.height,
            width: img.width,
            fallback: img.fallback,
          })),
        },
      },
      include: { images: true },
    });
  }

  // --- RECITAL IMAGES ---
  const recitalImages = (event.images || []).map((img: any) => ({
    url: img.url,
    ratio: img.ratio,
    height: img.height,
    width: img.width,
    fallback: img.fallback,
  }));

  // --- RECITAL ---
  if (artist && venue) {
    //Generate a random price between 15.0 and 150.0
    const price = event.priceRanges?.[0]?.min || Math.floor(Math.random() * (150 - 15 + 1) + 15);

    await prisma.recital.upsert({
      where: { tmId: event.id}, 
      update: {},
      create: {
        tmId: event.id,
        name: event.name,
        artist: { connect: { id: artist.id } },
        date: event.dates?.start?.dateTime ? new Date(event.dates.start.dateTime) : new Date(),
        price: price,
        info: event.info || '',
        venue: { connect: { id: venue.id } },
        images: { create: recitalImages },
      },
    });
  }
  return true ;
}