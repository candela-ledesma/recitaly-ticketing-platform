import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const artist = searchParams.get('artist') ?? '';
  const recital = searchParams.get('recital') ?? '';
  const term = `${artist}`;
 
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&limit=5`;
  const res = await fetch(url);
  const data = await res.json();
  return NextResponse.json(data.results);
}