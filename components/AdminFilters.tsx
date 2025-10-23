'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from './Button';

export default function AdminFilters() {
  const sp = useSearchParams();
  const router = useRouter();
  const [q, setQ] = useState(sp.get('q') || '');
  const [from, setFrom] = useState(sp.get('from') || '');
  const [to, setTo] = useState(sp.get('to') || '');

  useEffect(() => {
    setQ(sp.get('q') || '');
    setFrom(sp.get('from') || '');
    setTo(sp.get('to') || '');
  }, [sp]);

  function apply() {
    const params = new URLSearchParams(sp.toString());
    q ? params.set('q', q) : params.delete('q');
    from ? params.set('from', from) : params.delete('from');
    to ? params.set('to', to) : params.delete('to');
    params.delete('page');
    router.push(`/admin?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2 items-end">
      <div>
        <label className="block text-sm mb-1">Search</label>
        <input
          className="rounded-xl border border-gray-300 px-3 py-2"
          placeholder="Name or phone"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm mb-1">From</label>
        <input
          type="date"
          className="rounded-xl border border-gray-300 px-3 py-2"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm mb-1">To</label>
        <input
          type="date"
          className="rounded-xl border border-gray-300 px-3 py-2"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
      </div>
      <Button onClick={apply}>Apply</Button>
      <a className="ml-auto underline" href={`/api/admin/export.csv?${sp.toString()}`}>
        Export CSV
      </a>
      <a className="underline" href={`/api/admin/export.xlsx?${sp.toString()}`}>
        Export Excel
      </a>
    </div>
  );
}