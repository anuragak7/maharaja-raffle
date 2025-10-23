import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { toCsv } from '@/lib/csv';

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

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start: async (controller) => {
      const pageSize = 1000;
      let skip = 0;
      
      controller.enqueue(encoder.encode('createdAt,firstName,lastName,phone,marketingOptIn\n'));

      for (;;) {
        const rows = await prisma.raffleEntry.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip,
          take: pageSize,
          select: {
            createdAt: true,
            firstName: true,
            lastName: true,
            phone: true,
            marketingOptIn: true
          }
        });

        if (!rows.length) break;

        const csv = toCsv(
          rows.map((r: { createdAt: Date; firstName: string; lastName: string; phone: string; marketingOptIn: boolean }) => ({
            createdAt: r.createdAt.toISOString(),
            firstName: r.firstName,
            lastName: r.lastName,
            phone: r.phone,
            marketingOptIn: r.marketingOptIn ? 'true' : 'false'
          }))
        );

        const chunk = skip === 0 ? csv : csv.split('\n').slice(1).join('\n');
        controller.enqueue(encoder.encode(chunk + '\n'));
        skip += pageSize;
      }

      controller.close();
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="raffle-entries.csv"'
    }
  });
}