'use client'
import { useEffect, useState, useRef } from 'react'
import { searchSongs } from './itunes'
import SongList from './SongList'
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

type Props = {
  artist: string
  recital: string
}

const RecitalPlaylist = ({ artist, recital }: Props) => {
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentSongId, setCurrentSongId] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    setLoading(true)
    setError('')
    searchSongs(artist, recital)
      .then(setSongs)
      .catch(() => setError('Could not load playlist'))
      .finally(() => setLoading(false))
  }, [artist, recital])
 // Play selected song
  const handlePlay = (song: Song) => {
    setCurrentSongId(song.id)
    if (audioRef.current) {
      audioRef.current.src = song.audioUrl
      audioRef.current.play()
    }
  }

  // Pause playback
  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
    setCurrentSongId(null)
  }

  return (
    <div className="bg-[#2e2e38] rounded-xl p-4 mt-8 shadow-lg max-w-xl mx-auto">
      <h2 className="text-xl font-bold text-pink-200 mb-4">Recital Playlist</h2>
      <audio ref={audioRef} />
      {loading && <div className="text-pink-200">Loading playlist...</div>}
      {error && <div className="text-red-400">{error}</div>}
      {!loading && !error && songs.length === 0 && (
        <div className="text-zinc-400">No songs found for this recital.</div>
      )}
      {!loading && songs.length > 0 && (
        <SongList songs={songs.slice(0, 5)} currentSongId={currentSongId}
          onPlay={handlePlay}
          onPause={handlePause}
          showActions={true} />
      )}
    </div>
  )
}

export default RecitalPlaylist;