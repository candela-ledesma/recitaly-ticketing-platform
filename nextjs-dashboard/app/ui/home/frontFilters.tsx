  
  import { useState, useEffect } from 'react';

type Props = {
  recitals: any[];
  onFilteredChange: (filtered: any[]) => void;
};


  export default function FrontFilters({ recitals, onFilteredChange }: Props) {
    const [search,   setSearch]   = useState('');
    const [artist,   setArtist]   = useState('');
    const [place,    setPlace]    = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo,   setDateTo]   = useState('');

    
    /* ---- helpers for dropdowns ---- */
    const uniqueArtists = Array.from(
        new Set(recitals.map(r => r.artist?.name).filter(Boolean)),
    );
    const uniquePlaces = Array.from(
        new Set(recitals.map(r => r.venue?.name).filter(Boolean)),
    );

    const toLower = (s?: string | null) => (s ?? '').toLowerCase();

  // compute filtered recitals
  useEffect(() => {
    const q = toLower(search);
    const filtered = recitals.filter(r => {
      const matchesSearch =
        toLower(r.name).includes(q) ||
        toLower(r.artist?.name).includes(q) ||
        toLower(r.venue?.name).includes(q) ||
        toLower(r.venue?.city).includes(q);

      const matchesArtist = artist ? r.artist?.name === artist : true;
      const matchesPlace = place ? r.venue?.name === place : true;
      const recitalDate = new Date(r.date);
      const matchesDateFrom = dateFrom ? recitalDate >= new Date(dateFrom) : true;
      const matchesDateTo = dateTo ? recitalDate <= new Date(dateTo) : true;

      return (
        matchesSearch &&
        matchesArtist &&
        matchesPlace &&
        matchesDateFrom &&
        matchesDateTo
      );
    });

    onFilteredChange(filtered);
  }, [recitals, search, artist, place, dateFrom, dateTo, onFilteredChange]);

    return (
        <div className="w-full max-w-2xl flex flex-col md:flex-row flex-wrap gap-4 mb-8">
            {/* Búsqueda libre */}
            <input
            type="text"
            placeholder="Search recitals..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg bg-[#2e2e38] border border-pink-200 text-[#fff0f6] focus:outline-none"
            />

            {/* Filtrar por artista */}
            <select
            value={artist}
            onChange={e => setArtist(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg bg-[#2e2e38] border border-pink-200 text-[#fff0f6] focus:outline-none"
            >
            <option value="">All Artists</option>
            {uniqueArtists.map(a => (
                <option key={a} value={a}>
                {a}
                </option>
            ))}
            </select>

            {/* Filtrar por venue */}
            <select
            value={place}
            onChange={e => setPlace(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg bg-[#2e2e38] border border-pink-200 text-[#fff0f6] focus:outline-none"
            >
            <option value="">All Venues</option>
            {uniquePlaces.map(p => (
                <option key={p} value={p}>
                {p}
                </option>
            ))}
            </select>

            {/* Rango de fechas */}
            <input
            type="date"
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
            className="px-4 py-2 rounded-lg bg-[#2e2e38] border border-pink-200 text-[#fff0f6] focus:outline-none"
            />
            <input
            type="date"
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
            className="px-4 py-2 rounded-lg bg-[#2e2e38] border border-pink-200 text-[#fff0f6] focus:outline-none"
            />

            {/* Botón limpiar */}
            <button
            onClick={() => {
                setSearch('');
                setArtist('');
                setPlace('');
                setDateFrom('');
                setDateTo('');
            }}
            className="px-4 py-2 rounded-lg bg-pink-200 text-[#23232b] font-bold hover:bg-pink-300 transition"
            >
            Clear
            </button>
        </div>

            );
}