'use client';

import { useState } from 'react';
import { BADGES } from '@/lib/constants';
import type { UserBadgeWithDetail } from '@/store/badge-store';

interface BadgeGridProps {
  earnedBadges: UserBadgeWithDetail[];
}

export default function BadgeGrid({ earnedBadges }: BadgeGridProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const earnedMap = new Map(earnedBadges.map((b) => [b.badge.name, b]));

  const selectedBadge = selected
    ? BADGES.find((b) => b.name === selected)
    : null;
  const isEarned = selected ? earnedMap.has(selected) : false;

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-[var(--gray-900)]">배지 컬렉션</h2>
        <span className="text-xs text-[var(--gray-500)]">
          {earnedBadges.length}/{BADGES.length} 획득
        </span>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {BADGES.map((badge) => {
          const earned = earnedMap.has(badge.name);
          const isSelected = selected === badge.name;

          return (
            <button
              key={badge.id}
              onClick={() => setSelected(isSelected ? null : badge.name)}
              className="flex flex-col items-center gap-1 group"
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all
                  ${earned ? 'bg-[var(--primary-50)] shadow-sm' : 'bg-gray-100 grayscale opacity-40'}
                  ${isSelected ? 'ring-2 ring-[var(--primary-500)] scale-105' : 'group-active:scale-95'}
                `}
              >
                {earned ? badge.icon : '🔒'}
              </div>
              <p
                className={`text-[10px] text-center leading-tight ${
                  earned ? 'text-[var(--gray-900)] font-medium' : 'text-gray-400'
                }`}
              >
                {badge.name}
              </p>
            </button>
          );
        })}
      </div>

      {/* 선택된 배지 상세 */}
      {selectedBadge && (
        <div
          className={`mt-4 p-3 rounded-xl text-sm ${
            isEarned
              ? 'bg-[var(--primary-50)] text-[var(--primary-700)]'
              : 'bg-gray-50 text-[var(--gray-500)]'
          }`}
        >
          <div className="flex items-center gap-2 font-semibold mb-1">
            <span>{selectedBadge.icon}</span>
            <span>{selectedBadge.name}</span>
            {isEarned && (
              <span className="text-[10px] bg-[var(--primary-500)] text-white px-2 py-0.5 rounded-full ml-auto">
                획득
              </span>
            )}
          </div>
          <p className="text-xs leading-relaxed">{selectedBadge.description}</p>
          {!isEarned && (
            <p className="text-xs mt-1 text-gray-400">조건: {selectedBadge.condition}</p>
          )}
        </div>
      )}
    </div>
  );
}
