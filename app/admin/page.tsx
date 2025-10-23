

"use client";
import AdminEntriesClient from './AdminEntriesClient';

export default function AdminPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Raffle Entries</h1>
      <AdminEntriesClient />
    </div>
  );
}