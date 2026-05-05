// app/lib/recital.ts
import { prisma } from './prisma';

/** Devuelve un recital por id (con artista, venue e imagen principal) */
export async function getRecitalById(id: number) {
  return prisma.recital.findUnique({
    where: { id },
    include: {
      artist: true,
      venue:  true,
      images: { take: 1 },     // primera imagen
    },
  });
}

/** Lista todos los recitales ordenados */
export async function getAllRecitals() {
  return prisma.recital.findMany({
    include: {
      artist: true,
      venue:  true,
      images: { take: 1 },
    },
    orderBy: { date: 'asc' },
  });
}

export async function getArtistsNames() {
  const artists = await prisma.artist.findMany({
    select: { name: true },
    orderBy: { name: 'asc' },
  });
  return artists.map(a => a.name);
}


export async function getBookingsOfUser(userId: number) {
  return await prisma.booking.findMany({
    where: { userId },
    include: {
      recital: {
        include: {
          artist: true,
          venue: true,
          images: { take: 1 },
        },
      },
    },
    orderBy: { date: 'desc' },
  });
}

export async function getCartItemsOfUser(userId: number) {
  return await prisma.cart.findMany({
      where: { userId: userId },
      include: {
        recital: {
          include: {
            artist: true,
            venue: true,
            images: { take: 1 },
          },
        },
      },
    });

}
export async function addBookings(userId: number, recitalId: number, amount: number) {
  return await prisma.booking.create({
    data: {
      userId,
      recitalId,
      amount,
      date: new Date(), // Fecha actual
    },
    include: {
      recital: {
        include: {
          artist: true,
          venue: true,
          images: { take: 1 },
        },
      },
    },
  });
}

export async function getUserInfo(userId: number) {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      adress: true,
      phoneNumber: true,
      name: true,
      email: true,
    },
  });
}