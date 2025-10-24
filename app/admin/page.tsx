

"use client";
import AdminEntriesClient from './AdminEntriesClient';

export default function AdminPage() {
  return (
    <div className="admin-root p-8 max-w-5xl mx-auto bg-white/90 rounded-xl shadow-lg mt-8 mb-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Raffle Entries</h1>
      <AdminEntriesClient />
    </div>
  );
}