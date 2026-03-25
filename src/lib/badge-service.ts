import { prisma } from './db';
import { calculateLevel } from './utils';
import { BADGES } from './constants';

/**
 * 라운딩 저장 후 배지 및 레벨을 자동 업데이트합니다.
 */
export async function updateUserProgressAfterRound(userId: string): Promise<void> {
  const rounds = await prisma.round.findMany({
    where: { userId },
    orderBy: { date: 'asc' },
  });

  if (rounds.length === 0) return;

  const totalRounds = rounds.length;
  const bestScore = Math.min(...rounds.map((r) => r.score));
  const newLevel = calculateLevel(bestScore);

  // 레벨/통계 upsert
  await prisma.userLevel.upsert({
    where: { userId },
    update: { currentLevel: newLevel, bestScore, totalRounds },
    create: { userId, currentLevel: newLevel, bestScore, totalRounds },
  });

  // 획득 가능한 배지 체크
  await checkAndAwardBadges(userId, rounds, bestScore, totalRounds);
}

type RoundRow = { score: number; memo: string | null; date: Date };

async function checkAndAwardBadges(
  userId: string,
  rounds: RoundRow[],
  bestScore: number,
  totalRounds: number
): Promise<void> {
  const earned = await prisma.userBadge.findMany({
    where: { userId },
    select: { badgeId: true },
  });
  const earnedIds = new Set(earned.map((b) => b.badgeId));

  const toAward: string[] = [];

  // 데뷔전: 첫 라운딩 기록
  if (totalRounds >= 1 && !earnedIds.has('debut')) {
    toAward.push('debut');
  }

  // 첫 홀: 메모에 "홀" 언급
  const hasHoleMemo = rounds.some((r) => r.memo?.includes('홀'));
  if (hasHoleMemo && !earnedIds.has('first_hole_in_one')) {
    toAward.push('first_hole_in_one');
  }

  // 연속 기록: 최근 3회 라운딩이 연속 주(week)인지 확인
  if (totalRounds >= 3 && !earnedIds.has('streak_3')) {
    const sorted = [...rounds].sort((a, b) => b.date.getTime() - a.date.getTime());
    const recent = sorted.slice(0, 3);
    const isStreak = isConsecutiveWeeks(recent.map((r) => r.date));
    if (isStreak) toAward.push('streak_3');
  }

  // 꾸준함의 신: 이번 달에 4회 이상
  const now = new Date();
  const thisMonthRounds = rounds.filter(
    (r) =>
      r.date.getFullYear() === now.getFullYear() && r.date.getMonth() === now.getMonth()
  );
  if (thisMonthRounds.length >= 4 && !earnedIds.has('monthly_4')) {
    toAward.push('monthly_4');
  }

  // 자기 최고: 베스트 스코어 갱신 (이전 기록과 비교)
  if (totalRounds >= 2) {
    const prevBest = Math.min(...rounds.slice(0, -1).map((r) => r.score));
    if (bestScore < prevBest && !earnedIds.has('best_score')) {
      toAward.push('best_score');
    }
  }

  if (toAward.length === 0) return;

  // DB에서 배지 ID 조회 후 upsert
  const badgeRecords = await prisma.badge.findMany({
    where: { name: { in: toAward.map((id) => BADGES.find((b) => b.id === id)!.name) } },
  });

  for (const b of badgeRecords) {
    await prisma.userBadge.upsert({
      where: { userId_badgeId: { userId, badgeId: b.id } },
      update: {},
      create: { userId, badgeId: b.id },
    });
  }
}

function isConsecutiveWeeks(dates: Date[]): boolean {
  const sorted = [...dates].sort((a, b) => a.getTime() - b.getTime());
  for (let i = 1; i < sorted.length; i++) {
    const diffDays = (sorted[i].getTime() - sorted[i - 1].getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays > 14) return false;
  }
  return true;
}
