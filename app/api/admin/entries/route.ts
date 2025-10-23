import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function isAuthed(cookieHeader?: string | null) {
  return !!cookieHeader && /(?:^|;\s*)admin_auth=1(?:;|$)/.test(cookieHeader);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url, 'http://localhost');
  
  if (!isAuthed(req.headers.get('cookie'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const q = (searchParams.get('q') || '').trim();
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '20', 10)));
  const sort = searchParams.get('sort') || 'createdAt_desc';

  const where: any = { deletedAt: null };
  if (q) {
    where.OR = [
      { firstName: { contains: q, mode: 'insensitive' } },
      { lastName: { contains: q, mode: 'insensitive' } },
      { phone: { contains: q } }
    ];
  }

  if (from) {
    where.createdAt = { ...(where.createdAt || {}), gte: new Date(from) };
  }
  if (to) {
    const d = new Date(to);
    d.setDate(d.getDate() + 1);
    where.createdAt = { ...(where.createdAt || {}), lt: d };
  }

  const orderBy = sort === 'createdAt_asc' ? { createdAt: 'asc' } : { createdAt: 'desc' };

  const [total, items] = await Promise.all([
    prisma.raffleEntry.count({ where }),
    prisma.raffleEntry.findMany({
      where,
  orderBy: { createdAt: "desc" as const },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        createdAt: true,
        firstName: true,
        lastName: true,
        phone: true,
        location: true,
        marketingOptIn: true
      }
    })
  ]);

  return NextResponse.json({ items, total, page, pageSize });
}