import { useState } from 'react'
import { Trash2, Play, Pause, Heart, HeartOff } from 'lucide-react'

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
interface Props {
  songs: Song[]
  currentSongId?: string | null
  onPause?: () => void
  onPlay?: (song: Song) => void
  onDelete?: (id: string) => void
  onUpdate?: (id: string, liked: boolean) => void
  showActions?: boolean
}

const SongList = ({
  songs,
  currentSongId,
  onPause,
  onPlay,
  onDelete,
  onUpdate,
  showActions = true,
}: Props) => {
  const [songToDelete, setSongToDelete] = useState<Song | null>(null)

  const confirmDelete = () => {
    if (songToDelete && onDelete) {
      if (songToDelete.id === currentSongId && onPause) {
        onPause()
      }
      onDelete(songToDelete.id)
      setSongToDelete(null)
    }
  }

  return (
    <>
      <ul className="w-full text-sm text-gray-800">
        {songs.map((song, index) => {
          const isPlaying = currentSongId === song.id

          return (
            <li
              key={song.id}
              className="group grid grid-cols-[3rem_1fr_3rem_auto] sm:grid-cols-[2rem_3rem_1fr_1fr_3rem_auto] items-center gap-4 py-2 px-4 hover:bg-pink-50 transition"
            >
              <span className="text-white group-hover:text-black hidden sm:block">{index + 1}</span>
              <img
                src={song.coverUrl}
                alt={`Cover for ${song.title}`}
                className="w-10 h-10 rounded object-cover"
              />
              <div>
                <p className="font-medium text-[#f7a1b0] group-hover:text-pink-600">{song.title}</p>
                <p className="text-xs text-white group-hover:text-black ">{song.artist}</p>
              </div>
              <p className="text-sm text-white group-hover:text-black hidden sm:block">{song.album}</p>
              <p className="text-sm text-white group-hover:text-black text-right">{song.duration}</p>
              {showActions && (
                <div className="flex items-center justify-end space-x-2">
                  {isPlaying && onPause ? (
                    <button
                      onClick={onPause}
                      className="text-white group-hover:text-black hover:text-green-700 transition"
                      title="Pause Song"
                    >
                      <Pause size={16} />
                    </button>
                  ) : (
                    onPlay && (
                      <button
                        onClick={() => onPlay(song)}
                        className="text-white group-hover:text-black hover:text-green-700 transition"
                        title="Play Song"
                      >
                        <Play size={16} />
                      </button>
                    )
                  )}
                  {onDelete && (
                    <button
                      onClick={() => setSongToDelete(song)}
                      className="text-white hover:text-red-500 transition justify-self-end"
                      title="Delete song"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                  {onUpdate && (
                    <button
                      onClick={() => onUpdate(song.id, !song.liked)}
                      className="text-white hover:text-pink-400 transition"
                      title={song.liked ? 'Unlike' : 'Like'}
                    >
                      {song.liked ? (
                        <Heart size={16} className="fill-pink-400" />
                      ) : (
                        <HeartOff size={16} />
                      )}
                    </button>
                  )}
                </div>
              )}
            </li>
          )
        })}
      </ul>
      {songToDelete && onDelete && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
          <div className="bg-[#2b2b2b] text-white p-6 rounded-2xl shadow-xl w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold text-[#f7a1b0]">Confirm delete</h3>
            <p className="text-sm">
              Are you sure you want to delete the song{' '}
              <strong className="text-[#f7a1b0]">{songToDelete.title}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSongToDelete(null)}
                className="px-4 py-2 text-white text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-[#f7a1b0] text-[#2b2b2b] font-semibold rounded hover:brightness-110"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SongList