// app/home/profile/edit-profile.tsx
'use client';

import { useState } from 'react';

export default function EditProfileForm({ defaultName }: { defaultName: string }) {
    const [name, setName] = useState(defaultName);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

    const res = await fetch('/api/user/update', {
        method: 'POST',
        body: JSON.stringify({ name }),
    });

    setLoading(false);
    if (res.ok) {
        alert('Profile updated!');
    } else {
        alert('Update failed.');
    }
    };

return (
<form onSubmit={handleSubmit} className="mt-8 space-y-4 w-full max-w-md">
    <label className="block">
    <span className="text-white">Name</span>
    <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        className="w-full mt-1 p-2 rounded bg-zinc-800 text-white border border-zinc-700"
    />
    </label>
    <button
    type="submit"
    className="px-4 py-2 bg-pink-500 hover:bg-pink-400 rounded text-white"
    disabled={loading}
    >
    {loading ? 'Saving...' : 'Save Changes'}
    </button>
</form>
);
}
