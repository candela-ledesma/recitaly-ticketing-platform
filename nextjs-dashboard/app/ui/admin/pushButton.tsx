'use client';

import { useState } from 'react';

export default function PushButton() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSendPush = async () => {
    setLoading(true);
    setSent(false);

    const res = await fetch('/api/send-push', {
      method: 'POST',
      body: JSON.stringify({
        title: '🎶 New recitals available!',
        message: '¡Check out your next adventure!',
      }),
    });

    setLoading(false);
    if (res.ok) setSent(true);
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleSendPush}
        disabled={loading}
        className="px-4 py-2 rounded-lg bg-pink-200 text-[#23232b] font-bold hover:bg-pink-300 transition disabled:opacity-50"
      >
        {loading ? 'Sending...' : 'Send new recital notification'}
      </button>
      {sent && <p className="text-green-400 font-bold">✅ Notificación enviada!</p>}
    </div>
  );
}
