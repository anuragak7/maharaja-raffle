'use client';

import { useEffect, useState } from 'react';

let idCounter = 0;

export type Toast = {
  id: number;
  message: string;
  type?: 'success' | 'error';
};

export const toastBus: {
  push: (t: Omit<Toast, 'id'>) => void;
} = { push: () => {} };

export default function ToastRoot() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    toastBus.push = (t) => {
      const id = ++idCounter;
      setToasts((p) => [...p, { id, ...t }]);
      setTimeout(() => setToasts((p) => p.filter((x) => x.id !== id)), 4000);
    };
  }, []);

  return (
    <div id="toast-root" aria-live="polite" aria-atomic="true">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`mb-2 rounded-xl px-4 py-2 shadow text-white ${
            t.type === 'error' ? 'bg-red-600' : 'bg-green-600'
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}

export function toastSuccess(m: string) {
  toastBus.push({ message: m, type: 'success' });
}

export function toastError(m: string) {
  toastBus.push({ message: m, type: 'error' });
}