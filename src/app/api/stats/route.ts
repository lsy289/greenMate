import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const rounds = await prisma.round.findMany({
    where: { userId: session.user.id },
    orderBy: { date: 'asc' },
  });

  if (rounds.length === 0) return NextResponse.json({ monthly: [], summary: null });

  const monthlyMap = new Map<string, number[]>();
  for (const r of rounds) {
    const key = `${r.date.getFullYear()}-${String(r.date.getMonth() + 1).padStart(2, '0')}`;
    if (!monthlyMap.has(key)) monthlyMap.set(key, []);
    monthlyMap.get(key)!.push(r.score);
  }

  const monthly = Array.from(monthlyMap.entries()).slice(-12).map(([month, scores]) => ({
    month,
    avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    best: Math.min(...scores),
    count: scores.length,
  }));

  const weatherMap = new Map<string, number[]>();
  for (const r of rounds) {
    if (!weatherMap.has(r.weather)) weatherMap.set(r.weather, []);
    weatherMap.get(r.weather)!.push(r.score);
  }
  const byWeather = Array.from(weatherMap.entries()).map(([weather, scores]) => ({
    weather,
    avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    count: scores.length,
  }));

  const scores = rounds.map((r) => r.score);
  const summary = {
    totalRounds: rounds.length,
    bestScore: Math.min(...scores),
    avgScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    recentTrend:
      monthly.length >= 2
        ? monthly[monthly.length - 1].avg - monthly[monthly.length - 2].avg
        : 0,
  };

  return NextResponse.json({ monthly, byWeather, summary });
}
