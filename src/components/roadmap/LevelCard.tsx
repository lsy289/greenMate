import ProgressBar from '@/components/ui/ProgressBar';
import { getLevelInfo, getNextLevelProgress } from '@/lib/utils';
import type { UserLevel } from '@/types';

interface LevelCardProps {
  level: UserLevel;
}

export default function LevelCard({ level }: LevelCardProps) {
  const info = getLevelInfo(level.currentLevel);
  const { nextLevel, progressPercent } = getNextLevelProgress(
    level.bestScore,
    level.currentLevel
  );

  return (
    <div className="bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-700)] rounded-2xl p-5 text-white shadow-md">
      {/* 레벨 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-white/70 text-xs font-medium uppercase tracking-wider">현재 레벨</p>
          <h2 className="text-xl font-bold mt-0.5">{info.name}</h2>
        </div>
        <span className="text-5xl">{info.icon}</span>
      </div>

      {/* 통계 */}
      <div className="flex gap-5 mb-4">
        <div>
          <p className="text-white/70 text-xs">총 라운딩</p>
          <p className="text-lg font-bold">{level.totalRounds}회</p>
        </div>
        <div className="w-px bg-white/20" />
        <div>
          <p className="text-white/70 text-xs">베스트 스코어</p>
          <p className="text-lg font-bold">
            {level.bestScore === 999 ? '-' : `${level.bestScore}타`}
          </p>
        </div>
      </div>

      {/* 다음 레벨 진행률 */}
      {nextLevel ? (
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-white/70">다음: {nextLevel.name} {nextLevel.icon}</span>
            <span className="text-white font-medium">{Math.round(progressPercent)}%</span>
          </div>
          <ProgressBar value={progressPercent} color="amber" />
          <p className="text-white/60 text-xs mt-1.5">{nextLevel.condition}</p>
        </div>
      ) : (
        <p className="text-white/90 text-sm font-semibold">🏆 최고 레벨 달성!</p>
      )}
    </div>
  );
}
