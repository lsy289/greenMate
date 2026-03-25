import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { randomUUID } from 'crypto';

type Params = { params: Promise<{ id: string }> };

/** POST /api/rounds/[id]/share  — 공유 토큰 생성 (없으면 신규, 있으면 기존 반환) */
export async function POST(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const round = await prisma.round.findUnique({ where: { id } });

  if (!round || round.userId !== session.user.id)
    return NextResponse.json({ error: '라운딩을 찾을 수 없습니다.' }, { status: 404 });

  if (round.shareToken) return NextResponse.json({ token: round.shareToken });

  const token = randomUUID();
  await prisma.round.update({ where: { id }, data: { shareToken: token } });
  return NextResponse.json({ token }, { status: 201 });
}

/** DELETE /api/rounds/[id]/share  — 공유 취소 */
export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const round = await prisma.round.findUnique({ where: { id } });

  if (!round || round.userId !== session.user.id)
    return NextResponse.json({ error: '라운딩을 찾을 수 없습니다.' }, { status: 404 });

  await prisma.round.update({ where: { id }, data: { shareToken: null } });
  return NextResponse.json({ success: true });
}
