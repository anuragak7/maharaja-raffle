"use client";
import { useEffect, useState } from "react";
import AdminFilters from '@/components/AdminFilters';
import DataTable from '@/components/DataTable';

export default function AdminEntriesClient() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const fetchEntries = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/entries", { credentials: "include" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to load entries");
      setData(json);
    } catch (err: any) {
      setError(err?.message || "Failed to load entries");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchEntries(); }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    try {
      const res = await fetch("/api/admin/entries", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Delete failed");
      fetchEntries();
    } catch (err: any) {
      setError(err?.message || "Delete failed");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600 font-semibold mb-4">{error}</div>;

  return (
    <>
      <AdminFilters />
      <DataTable
        rows={data.items}
        total={data.total}
        page={data.page}
        pageSize={data.pageSize}
        onDelete={handleDelete}
      />
    </>
  );
}