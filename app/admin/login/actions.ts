"use server";


import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData, next?: string): Promise<void> {
  const pw = formData.get('password')?.toString() || '';
  if (pw !== process.env.ADMIN_PASSWORD) {
    throw new Error('Invalid password');
  }
  // Set admin cookie directly in server action
  const cookieStore = await cookies();
  cookieStore.set('admin_auth', '1', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  });
  redirect(next || '/admin');
}
