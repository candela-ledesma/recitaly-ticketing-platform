'use client';

import { useEffect, useState } from 'react';
import { LogoutButton } from '../logout/LogoutButton';
import  PushButton  from './pushButton';

type Image = {
    id: number;
    url: string;
    ratio?: string;
    height?: number;
    width?: number;
    fallback?: boolean;
};

type Venue = {
    id: number;
    tmId: string;
    name: string;
    type: string;
    locate?: string;
    location?: string;
    url?: string;
    address?: string;
    city?: string;
    country?: string;
    images?: Image[];
};

type Artist = {
    id: number;
    name: string;
    images?: Image[];
};

type Event = {
    id: number;
    tmId: string;
    name: string;
    artist: Artist;
    date: string;
    price: number;
    info?: string;
    venue: Venue;
    images: Image[];
};
const sendPush = async () => {
  await fetch('/api/send-push', {
    method: 'POST',
    body: JSON.stringify({
      title: '🎉 Nueva oferta!',
      message: 'Hay nuevos recitales para vos.',
    }),
  });
};


function RecitalTable({ 
    events, 
    onEdit, 
    onDelete, 
    onDeleteAll 
}: { 
    events: Event[]; 
    onEdit: (event: Event) => void; 
    onDelete: (event: Event) => void;
    onDeleteAll: () => void;
}) {
    const [search, setSearch] = useState('');
    
    const filtered = events.filter(ev => {
        const s = search.toLowerCase();
        return (
            ev.name.toLowerCase().includes(s) ||
            ev.artist?.name?.toLowerCase().includes(s) ||
            ev.venue?.name?.toLowerCase().includes(s) ||
            ev.id.toString().includes(s)
        );
    });
    const sorted = [...filtered].sort((a, b) => b.id - a.id);

    return (
        <div className="overflow-x-auto bg-[#2e2e38] rounded-xl shadow-lg p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Recitals in Database</h2>
                <div className="flex gap-4 items-center">
                    <input
                        type="text"
                        placeholder="Filter..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="px-3 py-2 rounded bg-[#23232b] border border-pink-200 text-[#fff0f6]"
                    />
                    
                </div>
            </div>
            {sorted.length === 0 ? (
                <div className="text-center text-pink-200 py-8">No recitals found.</div>
            ) : (
                <div className="overflow-auto max-w-full">
                    <table className="min-w-full text-[#fff0f6]">
                        <thead>
                            <tr className="bg-pink-200 text-[#23232b]">
                                <th className="py-2 px-4">ID</th>
                                <th className="py-2 px-4">Name</th>
                                <th className="py-2 px-4">Artist</th>
                                <th className="py-2 px-4">Date</th>
                                <th className="py-2 px-4">Price</th>
                                <th className="py-2 px-4">Venue</th>
                                <th className="py-2 px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sorted.map(ev => (
                                <tr key={ev.id} className="border-b border-pink-200 hover:bg-pink-100 hover:text-[#23232b] transition">
                                    <td className="py-2 px-4">{ev.id}</td>
                                    <td className="py-2 px-4">{ev.name}</td>
                                    <td className="py-2 px-4">{ev.artist?.name}</td>
                                    <td className="py-2 px-4">{new Date(ev.date).toLocaleString()}</td>
                                    <td className="py-2 px-4">${ev.price}</td>
                                    <td className="py-2 px-4">{ev.venue?.name}</td>
                                    <td className="py-2 px-4 flex gap-2">
                                        <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600" onClick={() => onEdit(ev)}>Edit</button>
                                        <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700" onClick={() => onDelete(ev)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function EditModal({ event, onClose, onSave }: { event: Event | null; onClose: () => void; onSave: (updated: Partial<Event>) => void }) {
    const [name, setName] = useState(event?.name || '');
    const [artistName, setArtistName] = useState(event?.artist?.name || '');
    const [venueName, setVenueName] = useState(event?.venue?.name || '');

    useEffect(() => {
        setName(event?.name || '');
        setArtistName(event?.artist?.name || '');
        setVenueName(event?.venue?.name || '');
    }, [event]);

    if (!event) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-[#2e2e38] p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Edit Recital #{event.id}</h2>
                <input
                    className="block w-full mt-1 mb-2 px-3 py-2 rounded bg-[#23232b] border border-pink-200 text-[#fff0f6]"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Recital name"
                />
                <input
                    className="block w-full mt-1 mb-2 px-3 py-2 rounded bg-[#23232b] border border-pink-200 text-[#fff0f6]"
                    value={artistName}
                    onChange={e => setArtistName(e.target.value)}
                    placeholder="Artist name"
                />
                <input
                    className="block w-full mt-1 mb-4 px-3 py-2 rounded bg-[#23232b] border border-pink-200 text-[#fff0f6]"
                    value={venueName}
                    onChange={e => setVenueName(e.target.value)}
                    placeholder="Venue name"
                />
                <div className="flex gap-4 justify-end">
                    <button className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500" onClick={onClose}>Cancel</button>
                    <button className="bg-pink-200 text-[#23232b] px-4 py-2 rounded hover:bg-pink-300 font-bold" onClick={() => onSave({
                        name,
                        artist: { ...event.artist, name: artistName },
                        venue: { ...event.venue, name: venueName }
                    })}>Save</button>
                </div>
            </div>
        </div>
    );
}

function DeleteModal({ event, onClose, onConfirm }: { event: Event | null; onClose: () => void; onConfirm: () => void }) {
    if (!event) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-[#2e2e38] p-8 rounded-xl shadow-lg w-full max-w-md text-center">
                <h2 className="text-xl font-bold mb-4">Delete Recital #{event.id}?</h2>
                <p className="mb-6">Are you sure you want to delete <b>{event.name}</b> by <b>{event.artist?.name}</b>?</p>
                <div className="flex gap-4 justify-center">
                    <button className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500" onClick={onClose}>Cancel</button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 font-bold" onClick={onConfirm}>Delete</button>
                </div>
            </div>
        </div>
    );
}
function MarkInactiveModal({ open, onClose, onConfirm, isMarkingInactive }: 
    { open: boolean; onClose: () => void; onConfirm: () => void, isMarkingInactive: boolean }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-[#2e2e38] p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        <h2 className="text-xl font-bold mb-4 text-pink-200">Hide Past Recitals?</h2>
        <p className="mb-6 text-white">
          This will mark all recitals with a date before today as <b>INACTIVE</b>.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
            onClick={onClose}
            disabled={isMarkingInactive}
          >
            Cancel
          </button>
          <button
            className="bg-pink-200 text-[#23232b] px-6 py-2 rounded font-bold hover:bg-pink-300 disabled:opacity-50"
            onClick={onConfirm}
            disabled={isMarkingInactive}
          >
            {isMarkingInactive ? 'Processing...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
function DeleteAllModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    count, 
    isDeleting 
}: { 
    isOpen: boolean; 
    onClose: () => void; 
    onConfirm: () => void; 
    count: number;
    isDeleting: boolean;
}) {
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#2e2e38] p-8 rounded-xl shadow-lg w-full max-w-md text-center">
                <h2 className="text-xl font-bold mb-4 text-red-400">
                    ⚠️ Delete ALL Recitals?
                </h2>
                <p className="mb-6 text-white">
                    This will permanently delete <strong className="text-red-400">{count} recitals</strong> and all related data (bookings, cart items).
                </p>
                <p className="mb-6 text-red-300 text-sm">
                    This action cannot be undone!
                </p>
                <div className="flex gap-4 justify-center">
                    <button 
                        className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500 disabled:opacity-50" 
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        Cancel
                    </button>
                    <button 
                        className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 font-bold disabled:opacity-50 flex items-center gap-2" 
                        onClick={onConfirm}
                        disabled={isDeleting}
                    >
                        {isDeleting && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        )}
                        {isDeleting ? 'Deleting...' : 'Delete All'}
                    </button>
                </div>
            </div>
        </div>
    );
}

function AddRecitalPanel({ onDone }: { onDone: () => void }) {
    const [keyword, setKeyword] = useState('');
    const [artist, setArtist] = useState('');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [count, setCount] = useState(1);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleAdd = async () => {
        setLoading(true);
        setMessage('');
        const params = new URLSearchParams();
        if (keyword) params.append('keyword', keyword);
        if (artist) params.append('keyword', artist);
        if (from) params.append('from', from);
        if (to) params.append('to', to);
        params.append('count', count.toString());

        try {
            const res = await fetch(`/api/fetch-random-events?${params.toString()}`, { method: 'POST' });
            const data = await res.json();
            setMessage(data.message || 'Done!');
        } catch (error) {
            setMessage('Error adding recitals');
            console.error('Error adding recitals:', error);
        } finally {
            setLoading(false);
            onDone();
        }
    };

    return (
        <div className="bg-[#2e2e38] p-6 rounded-xl shadow-lg mb-8">
            <h2 className="text-xl font-bold mb-4">Add Recital from TicketMaster, fill any parameters you'd like</h2>
            <div className="flex flex-wrap gap-4">
                <input 
                    type="text" 
                    placeholder="Keyword" 
                    value={keyword} 
                    onChange={e => setKeyword(e.target.value)} 
                    className="flex-1 px-3 py-2 rounded bg-[#23232b] border border-pink-200 text-[#fff0f6]" 
                />
                <input 
                    type="text" 
                    placeholder="Artist" 
                    value={artist} 
                    onChange={e => setArtist(e.target.value)} 
                    className="flex-1 px-3 py-2 rounded bg-[#23232b] border border-pink-200 text-[#fff0f6]" 
                />
                <input 
                    type="date" 
                    aria-label="From date"
                    value={from} 
                    onChange={e => setFrom(e.target.value)} 
                    className="px-3 py-2 rounded bg-[#23232b] border border-pink-200 text-[#fff0f6]" 
                />
                <input 
                    type="date" 
                    aria-label="To date"
                    value={to} 
                    onChange={e => setTo(e.target.value)} 
                    className="px-3 py-2 rounded bg-[#23232b] border border-pink-200 text-[#fff0f6]" 
                />
                <input 
                    type="number" 
                    aria-label="Amount of recitals to add"
                    min={1} 
                    value={count} 
                    onChange={e => setCount(Number(e.target.value))} 
                    className="w-24 px-3 py-2 rounded bg-[#23232b] border border-pink-200 text-[#fff0f6]" 
                />
                <button 
                    onClick={handleAdd} 
                    disabled={loading} 
                    className="bg-pink-200 text-[#23232b] font-bold py-2 px-6 rounded-lg hover:bg-pink-300 transition disabled:bg-pink-100"
                >
                    {loading ? 'Adding...' : 'Add Recitals'}
                </button>
            </div>
            {message && <p className="mt-4 text-pink-200">{message}</p>}
        </div>
    );
}

export default function AdminPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [editEvent, setEditEvent] = useState<Event | null>(null);
    const [deleteEvent, setDeleteEvent] = useState<Event | null>(null);
    const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showMarkInactiveModal, setShowMarkInactiveModal] = useState(false);
    const [isMarkingInactive, setIsMarkingInactive] = useState(false);

    const [showInactive, setShowInactive] = useState(false);


    const fetchEvents = async () => {
        try {
            const response = await fetch(`/api/recitals?status=${showInactive ? 'INACTIVE' : 'ACTIVE'}`);
            if (!response.ok) {
                throw new Error('Failed to fetch recitals');
            }
            const data = await response.json();
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [showInactive]);

    const handleSaveEdit = async (updated: Partial<Event>) => {
        if (!editEvent) return;
        
        try {
            const response = await fetch(`/api/recitals/${editEvent.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updated),
            });
            
            if (!response.ok) {
                throw new Error('Failed to update recital');
            }
            
            const updatedEvent = await response.json();
            
            // Actualizar el estado local inmediatamente
            setEvents(prev => prev.map(event => 
                event.id === editEvent.id ? { ...event, ...updatedEvent } : event
            ));
            
            setEditEvent(null);
            
            // Refresh desde el servidor para estar seguro
            await fetchEvents();
            
        } catch (error) {
            console.error('Error updating event:', error);
            alert('Failed to update recital');
        }
    };

    
    const handleDeleteAll = async () => {
        setIsDeleting(true);
        
        try {
            const response = await fetch('/api/recitals', { 
                method: 'DELETE' 
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete all recitals');
            }
            
            const result = await response.json();
            
            // Limpiar el estado local
            setEvents([]);
            setShowDeleteAllModal(false);
            
            alert(`Successfully deleted ${result.deletedCount} recitals`);
            
            // Refresh para estar seguro
            await fetchEvents();
            
        } catch (error) {
            console.error('Error deleting all recitals:', error);
            alert('Failed to delete all recitals');
        } finally {
            setIsDeleting(false);
        }
    };
    const  handleMarkInactive = async () => {
  setIsMarkingInactive(true);
  try {
    const res = await fetch('/api/recitals/mark-past-inactive', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to mark past recitals inactive');
    const result = await res.json();
    alert(`Marked ${result.count} recitals as INACTIVE`);
    await fetchEvents();
  } catch (err) {
    alert('Error marking recitals inactive');
    console.error(err);
  } finally {
    setIsMarkingInactive(false);
    setShowMarkInactiveModal(false);
  }
};
    const handleConfirmDelete = async () => {
        if (!deleteEvent) return;
        
        try {
            const response = await fetch(`/api/recitals/${deleteEvent.id}`, { 
                method: 'DELETE' 
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete recital');
            }
            
            // Actualizar el estado local inmediatamente
            setEvents(prev => prev.filter(event => event.id !== deleteEvent.id));
            
            setDeleteEvent(null);
            
            // Refresh desde el servidor
            await fetchEvents();
            
        } catch (error) {
            console.error('Error deleting event:', error);
            alert('Failed to delete recital');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="hidden sm:inline text-2xl font-bold">Admin Panel</h1>
                <div className="flex gap-4 items-center">
                    <button
                        onClick={() => setShowMarkInactiveModal(true)}
                        className="bg-pink-200 text-[#23232b] px-4 py-2 rounded-lg font-semibold hover:bg-pink-300 transition"
                        >
                        Hide Past Recitals
                    </button>
                    <button
                        onClick={() => setShowInactive(v => !v)}
                        className={`px-4 py-2 rounded-lg font-semibold transition ${showInactive ? 'bg-red-200 text-red-900' : 'bg-pink-200 text-[#23232b]'}`}
                    >
                        {showInactive ? 'Show Active Recitals' : 'Show Inactive Recitals'}
                    </button>
                    <PushButton />
                    

                </div>
            </div>
            
            <AddRecitalPanel onDone={fetchEvents} />
            <RecitalTable 
                events={events} 
                onEdit={setEditEvent} 
                onDelete={setDeleteEvent}
                onDeleteAll={() => setShowDeleteAllModal(true)}
            />
            
            {/* Modales */}
            <EditModal 
                event={editEvent} 
                onClose={() => setEditEvent(null)} 
                onSave={handleSaveEdit} 
            />
            <DeleteModal 
                event={deleteEvent} 
                onClose={() => setDeleteEvent(null)} 
                onConfirm={handleConfirmDelete} 
            />
            <DeleteAllModal 
                isOpen={showDeleteAllModal}
                onClose={() => setShowDeleteAllModal(false)}
                onConfirm={handleDeleteAll}
                count={events.length}
                isDeleting={isDeleting}
            />
            <MarkInactiveModal
                open={showMarkInactiveModal}
                onClose={() => setShowMarkInactiveModal(false)}
                onConfirm={ handleMarkInactive }
                isMarkingInactive={isMarkingInactive}
            />
        </div>
    );
}