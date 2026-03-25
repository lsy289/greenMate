'use client';

import { useSession } from 'next-auth/react';
import { useLevel } from '@/hooks/useLevel';
import { useBadges } from '@/hooks/useBadges';
import LevelCard from '@/components/roadmap/LevelCard';
import Timeline from '@/components/roadmap/Timeline';
import BadgeGrid from '@/components/roadmap/BadgeGrid';
import LogoutButton from '@/components/ui/LogoutButton';

const DEFAULT_LEVEL = {
  id: '', userId: '', currentLevel: 1, bestScore: 999, totalRounds: 0, updatedAt: new Date(),
};

export default function ProfilePage() {
  const { data: session } = useSession();
  const { level, isLoading: levelLoading } = useLevel();
  const { badges, isLoading: badgesLoading } = useBadges();

  const currentLevel = level ?? DEFAULT_LEVEL;

  return (
    <div className="flex flex-col h-full bg-[var(--gray-50)]">
      <header className="px-5 pt-12 pb-4 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-[var(--gray-900)]">프로필</h1>
          <LogoutButton />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4">
        {/* 사용자 정보 */}
        {session?.user && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[var(--primary-50)] flex items-center justify-center text-2xl shrink-0">
              🧑‍🦳
            </div>
            <div>
              <p className="font-semibold text-[var(--gray-900)]">{session.user.name}</p>
              <p className="text-xs text-[var(--gray-500)]">{session.user.email}</p>
            </div>
          </div>
        )}

        {levelLoading ? (
          <div className="h-44 bg-gray-200 rounded-2xl animate-pulse" />
        ) : (
          <LevelCard level={currentLevel} />
        )}

        {levelLoading ? (
          <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
        ) : (
          <Timeline level={currentLevel} />
        )}

        {badgesLoading ? (
          <div className="h-48 bg-gray-100 rounded-xl animate-pulse" />
        ) : (
          <BadgeGrid earnedBadges={badges} />
        )}
      </div>
    </div>
  );
}
