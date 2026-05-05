'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';
import { Recital } from '@/app/types/recital';
import { AddToCartButton } from '@/app/ui/cart/cartButton';

export default function BookingForm({ recital }: { recital: Recital }) {
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();
  const { add } = useCart();

  useEffect(() => {
      fetch('/api/user/me') // Asegurate de tener este endpoint
        .then(res => res.json())
        .then(data => {
          if (data.adress) setAddress(data.adress);
          if (data.phoneNumber) setPhone(data.phoneNumber.toString());
          if (data.adress && data.phoneNumber) {
            setIsSaved(true);
          }
        });
        
    }, []);


  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setIsSaved(false);

    console.log('Saving address:', address, 'and phone:', phone);
    const res = await fetch('/api/user/save-changes', {
      method: 'POST',
      body: JSON.stringify({ address, phone }),
    });

    if (!res.ok) {
      const msg = await res.text();
      setError(msg || 'Error saving data');
      setSaving(false);
      return;
    }

    setSaving(false);
    setIsSaved(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!isSaved || quantity < 1) return;

      await add(recital.id, quantity);
      router.push('/home/cart');
    };
  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

 const isFormValid = address.length > 4 && phone.length > 6;

  return (
    <form onSubmit={handleSaveInfo} className="space-y-6">
    
      <div>
        <label htmlFor="quantity" className="block text-sm font-medium mb-2">
          Quantity
        </label>
        <div className="flex items-center gap-3">
          <button type="button" onClick={decrement} className="w-8 h-8 rounded-full bg-pink-200 text-[#23232b] font-bold text-lg hover:bg-pink-300">-</button>
          <input type="number" id="quantity" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} min="1" className="w-16 text-center px-2 py-1 rounded bg-[#1e1e26] border border-pink-200 text-[#fff0f6]" />
          <button type="button" onClick={increment} className="w-8 h-8 rounded-full bg-pink-200 text-[#23232b] font-bold text-lg hover:bg-pink-300">+</button>
        </div>
      </div>

    
      <div>
        <label htmlFor="address" className="block text-sm font-medium mb-2">Address</label>
        <input
          id="address"
          type="text"
          value={address}
          onChange={e => {setAddress(e.target.value); setIsSaved(false)}}
          className="w-full px-3 py-2 rounded bg-[#1e1e26] border border-pink-200 text-[#fff0f6]"
        />
      </div>

     
      <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-2">Phone</label>
        <input
          id="phone"
          type="text"
          value={phone}
          onChange={e => {setPhone(e.target.value); setIsSaved(false)}}
          className="w-full px-3 py-2 rounded bg-[#1e1e26] border border-pink-200 text-[#fff0f6]"
        />
      </div>

      
      <button
        type="button"
        onClick={handleSaveInfo}
        disabled={!isFormValid || saving}
        className="w-full px-4 py-2 rounded-lg bg-pink-200 text-[#23232b] font-bold hover:bg-pink-300 transition disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Info'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
      {isSaved && <p className="text-green-400 font-bold">✔ Info saved</p>}

      {/* Only show AddToCart if info was saved */}
      <div className={`${isSaved ? 'block' : 'opacity-30 pointer-events-none'}`}>
        <AddToCartButton recitalId={recital.id} quantity={quantity} />
      </div>
    </form>
  );
}
