import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import ExcelJS from 'exceljs';

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

  const rows = await prisma.raffleEntry.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    select: {
      createdAt: true,
      firstName: true,
      lastName: true,
      phone: true,
      marketingOptIn: true
    }
  });

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Entries');

  ws.columns = [
    { header: 'Created At', key: 'createdAt', width: 24 },
    { header: 'First Name', key: 'firstName', width: 20 },
    { header: 'Last Name', key: 'lastName', width: 20 },
    { header: 'Phone', key: 'phone', width: 20 },
    { header: 'Marketing Opt-In', key: 'marketingOptIn', width: 18 }
  ];

  rows.forEach((r: { createdAt: Date; firstName: string; lastName: string; phone: string; marketingOptIn: boolean }) => ws.addRow({
    createdAt: r.createdAt,
    firstName: r.firstName,
    lastName: r.lastName,
    phone: r.phone,
    marketingOptIn: r.marketingOptIn ? 'Yes' : 'No'
  }));

  const buffer = await wb.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="raffle-entries.xlsx"'
    }
  });
}