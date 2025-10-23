import { NextResponse } from 'next/server';
import { issueCsrfToken } from '@/lib/csrf';

export async function GET() {
  try {
    const token = await issueCsrfToken();
    return NextResponse.json({ token });
  } catch (e: any) {
    console.error('CSRF issue error:', e);
    return NextResponse.json({ error: 'Failed to issue CSRF token' }, { status: 500 });
  }
}
