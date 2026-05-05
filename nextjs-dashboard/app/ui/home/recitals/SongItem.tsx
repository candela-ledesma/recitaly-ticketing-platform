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
  song: Song
  onPlay: (song: Song) => void
}

const SongItem = ({ song, onPlay }: Props) => (
  <li
    className="flex items-center gap-4 p-4 hover:bg-pink-50 transition cursor-pointer"
    onClick={() => onPlay(song)}
  >
    <div>
      <p className="font-medium text-gray-700">{song.title}</p>
      <p className="text-xs text-gray-400">
        {song.artist} • {song.duration}
      </p>
    </div>
  </li>
)
export default SongItem
