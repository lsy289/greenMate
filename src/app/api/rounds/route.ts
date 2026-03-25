import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { parsePhotos } from '@/lib/utils';
import { updateUserProgressAfterRound } from '@/lib/badge-service';
import type { WeatherType } from '@/types';

const WEATHER_VALUES: WeatherType[] = ['sunny', 'cloudy', 'rainy', 'snowy', 'windy'];

/** GET /api/rounds?year=2024&month=3 */
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = session.user.id;

  const { searchParams } = req.nextUrl;
  const year = searchParams.get('year');
  const month = searchParams.get('month');

  const where: Record<string, unknown> = { userId };
  if (year && month) {
    const start = new Date(Number(year), Number(month) - 1, 1);
    const end = new Date(Number(year), Number(month), 1);
    where.date = { gte: start, lt: end };
  }

  const rounds = await prisma.round.findMany({ where, orderBy: { date: 'desc' } });
  return NextResponse.json(rounds.map((r) => ({ ...r, photos: parsePhotos(r.photos) })));
}

/** POST /api/rounds */
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = session.user.id;

  const { date, courseName, weather, score, memo, photos } = await req.json();

  if (!date || !courseName || !weather || score == null)
    return NextResponse.json({ error: '필수 항목이 누락되었습니다.' }, { status: 400 });
  if (!WEATHER_VALUES.includes(weather))
    return NextResponse.json({ error: '유효하지 않은 날씨 값입니다.' }, { status: 400 });
  if (typeof score !== 'number' || score < 1 || score > 300)
    return NextResponse.json({ error: '스코어는 1~300 사이여야 합니다.' }, { status: 400 });

  const round = await prisma.round.create({
    data: {
      userId,
      date: new Date(date),
      courseName,
      weather,
      score,
      memo: memo ?? null,
      photos: photos ? JSON.stringify(photos) : null,
    },
  });

  await updateUserProgressAfterRound(userId);
  return NextResponse.json({ ...round, photos: parsePhotos(round.photos) }, { status: 201 });
}
