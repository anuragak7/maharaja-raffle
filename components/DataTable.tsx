
import clsx from 'clsx';
import { CalendarDaysIcon, UserIcon, PhoneIcon, MapPinIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';


type Entry = {
  id: string;
  createdAt: string;
  firstName: string;
  lastName: string;
  phone: string;
  location: string;
  marketingOptIn: boolean;
};

type Props = {
  rows: Entry[];
  total: number;
  page: number;
  pageSize: number;
};

export default function DataTable({ rows, total, page, pageSize }: Props) {
  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="mt-4">
      <div className="overflow-x-auto rounded-xl border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <Th><span className="inline-flex items-center gap-1"><CalendarDaysIcon className="w-4 h-4 text-blue-400" /> Created</span></Th>
              <Th><span className="inline-flex items-center gap-1"><UserIcon className="w-4 h-4 text-pink-400" /> First</span></Th>
              <Th><span className="inline-flex items-center gap-1"><UserIcon className="w-4 h-4 text-pink-400" /> Last</span></Th>
              <Th><span className="inline-flex items-center gap-1"><PhoneIcon className="w-4 h-4 text-blue-400" /> Phone</span></Th>
              <Th><span className="inline-flex items-center gap-1"><MapPinIcon className="w-4 h-4 text-pink-400" /> Location</span></Th>
              <Th><span className="inline-flex items-center gap-1"><CheckCircleIcon className="w-4 h-4 text-green-400" /> Promo Opt-In</span></Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="odd:bg-white even:bg-gray-50">
                <Td className="flex items-center gap-1"><CalendarDaysIcon className="w-4 h-4 text-blue-200" />{new Date(r.createdAt).toLocaleString()}</Td>
                <Td className="flex items-center gap-1"><UserIcon className="w-4 h-4 text-pink-200" />{r.firstName}</Td>
                <Td className="flex items-center gap-1"><UserIcon className="w-4 h-4 text-pink-200" />{r.lastName}</Td>
                <Td className="flex items-center gap-1"><PhoneIcon className="w-4 h-4 text-blue-200" />{r.phone}</Td>
                <Td className="flex items-center gap-1"><MapPinIcon className="w-4 h-4 text-pink-200" />{r.location}</Td>
                <Td>
                  <span
                    className={clsx(
                      'inline-flex items-center gap-1 px-2 py-1 rounded text-xs',
                      r.marketingOptIn ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    )}
                  >
                    {r.marketingOptIn ? (
                      <CheckCircleIcon className="w-4 h-4 text-green-400" />
                    ) : (
                      <XCircleIcon className="w-4 h-4 text-gray-400" />
                    )}
                    {r.marketingOptIn ? 'Yes' : 'No'}
                  </span>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex items-center justify-between text-sm">
        <p>
          Showing <b>{rows.length}</b> of <b>{total}</b>
        </p>
        <div className="flex gap-2">
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => {
            const sp = new URLSearchParams(
              typeof window === 'undefined' ? '' : window.location.search
            );
            sp.set('page', String(n));
            return (
              <a
                key={n}
                className={clsx('rounded px-2 py-1 border', n === page ? 'bg-blue-600 text-white' : 'bg-white')}
                href={`?${sp.toString()}`}
              >
                {n}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-left px-3 py-2 font-semibold">{children}</th>;
}

type TdProps = {
  children: React.ReactNode;
  className?: string;
};
function Td({ children, className }: TdProps) {
  return <td className={clsx("px-3 py-2 whitespace-nowrap", className)}>{children}</td>;
}