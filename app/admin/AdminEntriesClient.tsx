"use client";
import { useEffect, useState } from "react";
import AdminFilters from '@/components/AdminFilters';
import DataTable from '@/components/DataTable';

export default function AdminEntriesClient() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEntries() {
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
    }
    fetchEntries();
  }, []);

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
      />
    </>
  );
}