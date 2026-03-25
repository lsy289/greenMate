import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = session.user.id;

  const level = await prisma.userLevel.findUnique({ where: { userId } });

  return NextResponse.json(
    level ?? { id: '', userId, currentLevel: 1, bestScore: 999, totalRounds: 0, updatedAt: new Date() }
  );
}
