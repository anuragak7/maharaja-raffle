import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateCsrfToken, CSRF_HEADER_NAME } from '@/lib/csrf';
import { rateLimit } from '@/lib/rate-limit';
import { entrySchema } from '@/lib/validation';
import { normalizePhone } from '@/lib/phone';

export async function POST(req: Request) {
  const ip = (req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '0.0.0.0')
    .split(',')[0]
    .trim();

  const rl = rateLimit(ip);
  if (!rl.allowed) {
    return NextResponse.json(
      { message: 'Too many attempts. Try again later.' },
      {
        status: 429,
        headers: rl.retryAfter ? { 'Retry-After': String(rl.retryAfter) } : {}
      }
    );
  }

  if (!validateCsrfToken(req.headers.get(CSRF_HEADER_NAME))) {
    return NextResponse.json({ message: 'Invalid CSRF token' }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = entrySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: 'Validation failed', issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { firstName, lastName, phone, location, marketingOptIn } = parsed.data;
  const norm = normalizePhone(phone);

  try {
    const existing = await prisma.raffleEntry.findUnique({
      where: { phone: norm.e164 }
    });

    if (existing) {
      return NextResponse.json(
        { message: 'This phone number is already registered for the raffle.' },
        { status: 409 }
      );
    }

    await prisma.raffleEntry.create({
      data: {
        firstName,
        lastName,
        phone: norm.e164,
        location,
        marketingOptIn: !!marketingOptIn,
        sourceIp: ip,
        userAgent: req.headers.get('user-agent') || null
      }
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    if (e?.code === 'P2002') {
      return NextResponse.json(
        { message: 'This phone number is already registered for the raffle.' },
        { status: 409 }
      );
    }
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}