import { cookies } from 'next/headers';

const ADMIN_COOKIE = 'admin_auth';

export async function isAdminAuthed() {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE)?.value === '1';
}

// adminLogin now does nothing; cookie should be set in server action or route handler
export function adminLogin() {
  // No-op
}

export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}