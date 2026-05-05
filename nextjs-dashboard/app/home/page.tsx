'use client';

import { useEffect, useState } from 'react';
import { Recital } from '../types/recital';
import RecitalCard from '../ui/home/RecitalCard';
import { PiCaretLeft, PiCaretRight } from 'react-icons/pi';
import { FiFilter } from 'react-icons/fi'; 
import PushSubscription from '../ui/home/pushSubscribe';
import FrontFilters from '../ui/home/frontFilters';
import SearchBar from '../ui/home/searchBar';
import { useRouter } from 'next/navigation'; 

const PAGE_SIZE = 20;

export default function Page() {
  const [recitals, setRecitals] = useState<Recital[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [message,  setMessage]  = useState('');
  const [filtered, setFiltered] = useState(recitals); 
  const [artist,   setArtist]   = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo,   setDateTo]   = useState('');
  const [page, setPage] = useState(0); 
  const [artistsNames, setArtistsNames] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const router = useRouter(); 

  useEffect(() => {
  (async () => {
    setLoading(true);
    try {
      fetchRecitals( { artist, dateFrom, dateTo, page });

      if (artistsNames.length == 0) {
        const res2 = await fetch('/api/artists');
        if (!res2.ok) throw new Error(`HTTP ${res2.status}`);
        const artists = await res2.json();
        if (Array.isArray(artists)) {
          setArtistsNames(artists);
        } else {
          throw new Error('Artists response is not an array');
        }
      }

    } catch (err) {
      console.error(err);
      setMessage('Failed to load recitals.');
      setRecitals([]);              
    } finally {
      setLoading(false);
    }
  })();
}, [page]);

async function fetchRecitals({
  artist,
  dateFrom,
  dateTo,
  page,
}: {
  artist: string;
  dateFrom: string;
  dateTo: string;
  page: number;
}) {
  setLoading(true);
  try {
    const res = await fetch(`/api/recitals?limit=${PAGE_SIZE}&skip=${page * PAGE_SIZE}&artist=${artist}&dateFrom=${dateFrom}&dateTo=${dateTo}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
     const data = await res.json();
    setRecitals(data);
    setMessage(data.length === 0 ? 'No recitals found. Try another search!' : '');
    setFiltered(data); 
  } catch (err) {
    setMessage('Failed to load recitals. Please try again');
    setRecitals([]);
  } finally {
    setLoading(false);
  }
}




  /* ---------- UI ---------- */
  return (
    
    <div className="min-h-screen flex flex-col items-center px-4">
      <PushSubscription />
      {/* ----------------- filtrosBack ----------------- */}

        <div className="w-full max-w-2xl flex items-center gap-4 mb-4">
        <SearchBar
        artists={artistsNames}
        onArtistSearch={(artist: string) => {
          setArtist(artist);
          setDateFrom('');
          setDateTo('');
          setPage(0);
          fetchRecitals( { artist, dateFrom: '', dateTo: '', page: 0});
        }}
        onDateSearch={(from: string, to: string) => {
          setDateFrom(from);
          setDateTo(to);
          setArtist('');
          setPage(0);
         
          fetchRecitals( { artist: '', dateFrom: from, dateTo: to, page: 0 });
        }}
      />
      <div className="flex items-center  mb-6 "><button
          onClick={() => setFiltersOpen(o => !o)}
          className=" h-12 aspect-square flex items-center justify-center rounded-lg bg-pink-200 text-[#23232b] hover:bg-pink-300 transition "
          aria-label="Toggle filters"
        >
          <FiFilter className="text-2xl" />
        </button></div>
      
      </div>
      {/* ----------------- Side filter panel ----------------- */}
      {filtersOpen && (
        <div className="fixed top-20 right-4 z-50 bg-[#2e2e38] border border-pink-200 rounded-lg p-4 w-80 shadow-lg">
          <FrontFilters recitals={recitals} onFilteredChange={setFiltered} />
          <button
            onClick={() => setFiltersOpen(false)}
            className="mt-2 w-full px-4 py-2 rounded-lg bg-pink-200 text-[#23232b] font-bold hover:bg-pink-300 transition"
          >
            Close
          </button>
        </div>
      )}
      {/* ----------------- listado ----------------- */}
      <div className="w-full max-w-2xl">
        {message && <p className="mb-4 text-pink-200">{message}</p>}
        <h2 className="text-2xl font-bold mb-6 text-[#fff0f6]">
          {loading ? 'Loading recitals…' : 'Recitals'}
        </h2>

        <div className="flex flex-col gap-6">
          {filtered.map(r => (
            <RecitalCard key={r.id} recital={r} />
          ))}
        </div>
     </div>
           
          <div className="flex justify-between items-center mt-8 w-full max-w-2xl">
  <button
    onClick={() => setPage(p => Math.max(0, p - 1))}
    disabled={page === 0}
    className="flex items-center justify-center w-10 h-10 rounded-full bg-pink-200 text-[#23232b] text-2xl font-bold hover:bg-pink-300 transition disabled:opacity-50"
    aria-label="Previous page"
  >
    <PiCaretLeft />
  </button>
  <span className="text-[#fff0f6] font-semibold">
    Page {page + 1}
  </span>
  <button
    onClick={() => setPage(p => recitals.length === PAGE_SIZE ? p + 1 : p)}
    disabled={recitals.length < PAGE_SIZE}
    className="flex items-center justify-center w-10 h-10 rounded-full bg-pink-200 text-[#23232b] text-2xl font-bold hover:bg-pink-300 transition disabled:opacity-50"
    aria-label="Next page"
  >
    <PiCaretRight />
  </button>
</div>
    </div>
  );
}

