'use client'
import { useState, useEffect, useRef } from 'react';
import { DateRange } from 'react-date-range';
import { FiSearch, FiCalendar } from 'react-icons/fi';
import 'react-date-range/dist/styles.css'; // main style
import 'react-date-range/dist/theme/default.css'; // theme css
import { useRouter } from 'next/navigation';
import { ca } from 'date-fns/locale';


type Props = {
  artists: string[];
  onArtistSearch: (artist: string) => void;
  onDateSearch: (from: string, to: string) => void;
 
};

export default function SearchBar({ artists, onArtistSearch, onDateSearch }: Props) {
  const [mode, setMode] = useState<'artist' | 'date'>('artist');
  const [artistInput, setArtistInput] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
   useEffect(() => {
    const filtered = artistInput
      ? artists.filter(name =>
          name.toLowerCase().includes(artistInput.toLowerCase())
        )
      : [];
    setSuggestions(filtered);
  }, [artistInput, artists]);

  const handleArtistSearch = (value?: string) => {
    const selected = value || suggestions[0] || artistInput;
    setArtistInput(selected); // Replace text with selected suggestion
    onArtistSearch(selected);
    setShowSuggestions(false);
    try{
        router.push(`/home?artist=${encodeURIComponent(selected)}`);
    }catch (error) {
      console.error('Error navigating to recitals:', error);
      alert('Failed to navigate to recitals. Please try again.');
    }
    
  };


 const handleArtistKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleArtistSearch(); 
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleArtistSearch(suggestion);
  };

  const [showPicker, setShowPicker] = useState(false);
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);

  const handleApply = () => {
    const from = range[0].startDate.toISOString().slice(0, 10);
    const to = range[0].endDate.toISOString().slice(0, 10);
    onDateSearch(from, to);
    setDateFrom(from);
    setDateTo(to);
    setShowPicker(false);
    try{
      router.push(`/home?dateFrom=${encodeURIComponent(from)}&dateTo=${encodeURIComponent(to)}`);
    }catch (error) {
      console.error('Error navigating to recitals:', error);
      alert('Failed to navigate to recitals. Please try again.');
    }
    
  };
  return (
    <div className="flex items-center gap-4 mb-6 w-full max-w-2xl">
      {mode === 'artist' ? (
        <>
           <div className="relative flex w-full">
            <input
              ref={inputRef}
              type="text"
              value={artistInput}
              onChange={e => {
                setArtistInput(e.target.value);
                setShowSuggestions(true);
              }}
              onKeyDown={handleArtistKeyDown}
              placeholder="Search by artist..."
              className="w-full px-4 py-2 rounded-l-lg bg-[#2e2e38] border border-pink-200 text-[#fff0f6] focus:outline-none"
            />
            <button
              onClick={() => handleArtistSearch()}
              className="px-4 py-2 rounded-r-lg bg-pink-200 text-[#23232b] hover:bg-pink-300 transition flex items-center"
              aria-label="Search"
            >
              <FiSearch className="text-xl" />
            </button>

            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute top-full left-0 right-0 z-10 bg-[#2e2e38] border border-pink-200 text-[#fff0f6] rounded-b-lg max-h-48 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-pink-200 hover:text-[#23232b] cursor-pointer"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            onClick={() => setMode('date')}
            className="px-4 py-2 rounded-lg bg-pink-200 text-[#23232b] font-bold hover:bg-pink-300 transition"
          >
            Search by date
          </button>
        </>
      ) : (
        <>
        
           <div className="relative flex item-center gap-2 text-center">
        <button
    onClick={() => setShowPicker(!showPicker)}
    className="sm:hidden  flex items-center gap-2 px-4 py-2 rounded-md bg-pink-200 text-[#23232b] font-bold hover:bg-pink-300 transition">
    <FiCalendar  />
    Select Range
  </button>
  
      <div className='hidden sm:flex relative flex item-center gap-2 text-center py-3 px-2'>
        <div className="px-4 py-1 text-[#fff0f6] font-bold whitespace-nowrap" >Search between dates:</div>
        <div
            onClick={() => setShowPicker(!showPicker)}
            className="px-3 py-1.5 h-9 rounded-md bg-[#2e2e38] border border-pink-200 text-[#fff0f6] cursor-pointer text-sm leading-tight flex items-center"
        >
            {range[0].startDate.toLocaleDateString()}
        </div>
         <div className="px-1 py-1 text-[#fff0f6] font-bold" > and </div>
        <div
            onClick={() => setShowPicker(!showPicker)}
            className="px-3 py-1.5 h-9 rounded-md bg-[#2e2e38] border border-pink-200 text-[#fff0f6] cursor-pointer text-sm leading-tight flex items-center"
        >
            {range[0].endDate.toLocaleDateString()}
        </div>
      
      </div>
      
      {showPicker && (
        <div className="absolute z-50 top-[100%] mt-2">
          <DateRange
            editableDateInputs={true}
            onChange={item => setRange([{
              startDate: item.selection.startDate ?? new Date(),
              endDate: item.selection.endDate ?? new Date(),
              key: item.selection.key ?? 'selection',
            }])}
            moveRangeOnFirstSelection={false}
            ranges={range}
            rangeColors={['#FBCFE8']}
          />
          <button
            onClick={handleApply}
            className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-pink-200 text-[#23232b] font-bold hover:bg-pink-300 transition"
          >
            <FiSearch className="text-xl" />
            Search
          </button>
        </div>
      )}


    <button
      onClick={() => setMode('artist')}
      className="px-4 py-2 rounded-lg bg-pink-200 text-[#23232b] font-bold hover:bg-pink-300 transition"
    >
      Search by Artist
    </button>
    </div>
    
        </>
      )}
    </div>
  );
}