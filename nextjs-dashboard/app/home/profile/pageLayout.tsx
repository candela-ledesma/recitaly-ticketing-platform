// app/home/profile/layout.tsx
import React from 'react';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    return (
        <section className="p-8 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-center">User Profile</h2>
        <div className="bg-zinc-900 rounded-xl p-6 shadow-md border border-zinc-700">
            {children}
        </div>
        </section>
    );
}
