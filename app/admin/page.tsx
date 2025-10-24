

"use client";
import AdminEntriesClient from './AdminEntriesClient';

export default function AdminPage() {
  return (
    <section className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md mt-8 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Raffle Entries</h2>
        <div className="flex gap-2">
          <a href="/api/admin/export.csv" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Export CSV</a>
          <a href="/api/admin/export.xlsx" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">Export XLSX</a>
        </div>
      </div>
      <div className="mb-4 text-sm text-gray-600">Manage all entries below</div>
      <div className="overflow-x-auto">
        <AdminEntriesClient />
      </div>
    </section>
  );
}