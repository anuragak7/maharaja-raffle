import { cookies } from 'next/headers';
import crypto from 'crypto';

const CSRF_COOKIE = 'csrf_token';
const CSRF_HEADER = 'x-csrf-token';

export async function issueCsrfToken() {
  const secret = process.env.CSRF_SECRET || 'dev-secret';
  const token = crypto.createHmac('sha256', secret)
    .update(crypto.randomBytes(32))
    .digest('hex');

  const cookieStore = await cookies();
  cookieStore.set(CSRF_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/'
  });

  return token;
}

export async function validateCsrfToken(headerToken?: string | null) {
  const c = await cookies();
  const cookieToken = c.get(CSRF_COOKIE)?.value;
  return Boolean(headerToken && cookieToken && cookieToken === headerToken);
}

export const CSRF_HEADER_NAME = CSRF_HEADER;