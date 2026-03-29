import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { parsePhotos } from '@/lib/utils';
import { updateUserProgressAfterRound } from '@/lib/badge-service';
import type { WeatherType } from '@/types';

const WEATHER_VALUES: WeatherType[] = ['sunny', 'cloudy', 'rainy', 'snowy', 'windy'];

async function getUserId() {
  const session = await auth();
  return session?.user?.id ?? null;
}

/** GET /api/rounds/[id] */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const round = await prisma.round.findUnique({ where: { id } });

  if (!round || round.userId !== userId)
    return NextResponse.json({ error: '라운딩을 찾을 수 없습니다.' }, { status: 404 });

  return NextResponse.json({ ...round, photos: parsePhotos(round.photos) });
}

/** PUT /api/rounds/[id] */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.round.findUnique({ where: { id } });
  if (!existing || existing.userId !== userId)
    return NextResponse.json({ error: '라운딩을 찾을 수 없습니다.' }, { status: 404 });

  const { date, courseName, courseAddress, weather, score, memo, photos } = await req.json();

  if (weather && !WEATHER_VALUES.includes(weather))
    return NextResponse.json({ error: '유효하지 않은 날씨 값입니다.' }, { status: 400 });
  if (score != null && (typeof score !== 'number' || score < 1 || score > 300))
    return NextResponse.json({ error: '스코어는 1~300 사이여야 합니다.' }, { status: 400 });

  const updated = await prisma.round.update({
    where: { id },
    data: {
      ...(date && { date: new Date(date) }),
      ...(courseName && { courseName }),
      ...(courseAddress !== undefined && { courseAddress: courseAddress || null }),
      ...(weather && { weather }),
      ...(score != null && { score }),
      ...(memo !== undefined && { memo }),
      ...(photos !== undefined && { photos: photos ? JSON.stringify(photos) : null }),
    },
  });

  await updateUserProgressAfterRound(userId);
  return NextResponse.json({ ...updated, photos: parsePhotos(updated.photos) });
}

/** DELETE /api/rounds/[id] */
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.round.findUnique({ where: { id } });
  if (!existing || existing.userId !== userId)
    return NextResponse.json({ error: '라운딩을 찾을 수 없습니다.' }, { status: 404 });

  await prisma.round.delete({ where: { id } });
  await updateUserProgressAfterRound(userId);
  return NextResponse.json({ success: true });
}
