type Song = {
  id: string
  title: string
  artist: string
  album: string
  duration: string
  coverUrl: string
  audioUrl: string
  liked: boolean
}
export const searchSongs = async (artist: string, recital: string): Promise<Song[]> => {
  console.log('Searching songs for:', artist, recital);
  const res = await fetch(`/api/itunes?artist=${encodeURIComponent(artist)}&recital=${encodeURIComponent(recital)}`);
  const tracks = await res.json();
  console.log('Fetched tracks:', tracks);
  return tracks.map((track: any) => ({
    id: track.trackId?.toString() ?? track.collectionId?.toString() ?? Math.random().toString(),
    title: track.trackName,
    artist: track.artistName,
    album: track.collectionName,
    duration: `${Math.floor(track.trackTimeMillis / 60000)}:${Math.floor((track.trackTimeMillis % 60000) / 1000).toString().padStart(2, '0')}`,
    coverUrl: track.artworkUrl100?.replace('100x100bb.jpg', '300x300bb.jpg') ?? '',
    audioUrl: track.previewUrl,
    liked: false,
  }));
}

