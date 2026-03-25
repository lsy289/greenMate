import type { ScoreBadgeColor, LevelInfo } from '@/types';
import { LEVELS, SCORE_BADGE_THRESHOLDS } from './constants';

/** 스코어에 따른 배지 색상 반환 */
export function getScoreBadgeColor(score: number): ScoreBadgeColor {
  if (score <= SCORE_BADGE_THRESHOLDS.green.max) return 'green';
  if (score <= SCORE_BADGE_THRESHOLDS.blue.max) return 'blue';
  return 'red';
}

/** 스코어에 따른 레벨 계산 */
export function calculateLevel(bestScore: number): number {
  if (bestScore <= 80) return 5;
  if (bestScore <= 90) return 4;
  if (bestScore <= 100) return 3;
  if (bestScore <= 120) return 2;
  return 1;
}

/** 현재 레벨 정보 반환 */
export function getLevelInfo(level: number): LevelInfo {
  return LEVELS[level - 1] ?? LEVELS[0];
}

/** 다음 레벨 정보와 진행률 반환 */
export function getNextLevelProgress(
  bestScore: number,
  currentLevel: number
): { nextLevel: LevelInfo | null; progressPercent: number } {
  const nextLevelData = LEVELS[currentLevel]; // LEVELS는 0-indexed, level은 1-indexed
  if (!nextLevelData) return { nextLevel: null, progressPercent: 100 };

  const targetScore = nextLevelData.maxScore ?? 80;
  const prevScore = currentLevel === 1 ? 150 : (LEVELS[currentLevel - 2]?.maxScore ?? 150);
  const range = prevScore - targetScore;
  const progress = Math.min(((prevScore - bestScore) / range) * 100, 100);

  return {
    nextLevel: nextLevelData,
    progressPercent: Math.max(0, progress),
  };
}

/** Round.photos JSON 문자열을 배열로 파싱 */
export function parsePhotos(photosJson: string | null | undefined): string[] {
  if (!photosJson) return [];
  try {
    return JSON.parse(photosJson) as string[];
  } catch {
    return [];
  }
}

/** 날짜를 "YYYY년 MM월" 형식으로 포맷 */
export function formatYearMonth(date: Date): string {
  return new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long' }).format(date);
}

/** 날짜를 "MM.DD (요일)" 형식으로 포맷 */
export function formatDateShort(date: Date): string {
  return new Intl.DateTimeFormat('ko-KR', {
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  }).format(date);
}

/** 클래스명 결합 유틸 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
