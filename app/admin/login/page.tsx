"use client";
import Button from '@/components/Button';

import { loginAction } from './actions';

import { useState } from 'react';

export default function LoginPage({ searchParams }: { searchParams?: { next?: string } }) {
  const [error, setError] = useState<string | null>(null);


  // Remove client-side fetch and handle errors via server action

  return (
    <div className="min-h-dvh flex items-center justify-center p-6">
  <form action={loginAction} className="w-full max-w-sm space-y-4 rounded-2xl border p-6">
        <h1 className="text-xl font-semibold">Admin Login</h1>
        <input
          name="password"
          type="password"
          className="w-full rounded-xl border px-3 py-2"
          placeholder="Admin password"
          required
        />
        <Button type="submit">Sign in</Button>
  {/* Server action errors will be displayed by Next.js automatically */}
      </form>
    </div>
  );
}