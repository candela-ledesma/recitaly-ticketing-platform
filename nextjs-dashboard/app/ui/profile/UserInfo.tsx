'use client';

import { useState } from 'react';

export default function UserInfo({ name, email, address, phone }: { name: string; email: string; address: string; phone: string }) {
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({
        name,
        phone,
        address,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // A futuro: enviar datos al backend
        alert('Changes saved (not persisted)');
        setIsEditing(false);
    };

    return (
        <div className="space-y-3 bg-zinc-900 p-6 rounded-xl shadow-md border border-zinc-800">
        <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-pink-200">User Info</h2>
            <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-sm text-pink-300 hover:underline"
            >
            {isEditing ? 'Cancel' : 'Edit'}
            </button>
        </div>

        {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-2">
            <div>
                <label className="block text-zinc-400">Name</label>
                <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
                />
            </div>
            <div>
                <label className="block text-zinc-400">Phone</label>
                <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
                />
            </div>
            <div>
                <label className="block text-zinc-400">Address</label>
                <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
                />
            </div>
            <button
                type="submit"
                className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-200 via-pink-300 to-pink-200 hover:from-pink-300 hover:to-pink-400 text-gray-900 font-semibold px-4 py-2 rounded-lg shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-200"
            >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                    />
                </svg>
                Save Changes
            </button>
            </form>
        ) : (
            <>
            <p><span className="text-zinc-400">Name:</span> {form.name}</p>
            <p><span className="text-zinc-400">Email:</span> {email}</p>
            <p><span className="text-zinc-400">Phone:</span> {form.phone || 'Not provided'}</p>
            <p><span className="text-zinc-400">Address:</span> {form.address || 'Not provided'}</p>
            </>
        )}
        </div>
    );
}
