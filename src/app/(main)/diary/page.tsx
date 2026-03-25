'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import RoundCard from '@/components/diary/RoundCard';
import { useRounds } from '@/hooks/useRounds';
import { formatYearMonth } from '@/lib/utils';

export default function DiaryPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const { rounds, isLoading } = useRounds(year, month);

  function prevMonth() {
    if (month === 1) {
      setYear((y) => y - 1);
      setMonth(12);
    } else {
      setMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1;
    if (isCurrentMonth) return;
    if (month === 12) {
      setYear((y) => y + 1);
      setMonth(1);
    } else {
      setMonth((m) => m + 1);
    }
  }

  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1;
  const currentDate = new Date(year, month - 1, 1);

  return (
    <div className="flex flex-col h-full">
      {/* 헤더 */}
      <header className="px-5 pt-12 pb-4 bg-white border-b border-gray-100">
        <h1 className="text-xl font-bold text-[var(--gray-900)]">다이어리</h1>

        {/* 월 네비게이션 */}
        <div className="flex items-center justify-between mt-3">
          <button onClick={prevMonth} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
            <ChevronLeft size={20} className="text-[var(--gray-500)]" />
          </button>

          <span className="text-base font-semibold text-[var(--gray-900)]">
            {formatYearMonth(currentDate)}
          </span>

          <button
            onClick={nextMonth}
            disabled={isCurrentMonth}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-30"
          >
            <ChevronRight size={20} className="text-[var(--gray-500)]" />
          </button>
        </div>
      </header>

      {/* 목록 */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : rounds.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-20">
            <span className="text-5xl">⛳</span>
            <p className="text-[var(--gray-500)] text-sm">
              이번 달 라운딩 기록이 없어요.
              <br />첫 라운딩을 기록해보세요!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-[var(--gray-500)] font-medium">
              총 {rounds.length}회 라운딩
            </p>
            {rounds.map((round) => (
              <RoundCard key={round.id} round={round} />
            ))}
          </div>
        )}
      </div>

      {/* FAB - 라운딩 추가 버튼 */}
      <Link
        href="/diary/new"
        className="fixed bottom-24 right-5 w-14 h-14 bg-[var(--primary-500)] rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        aria-label="라운딩 추가"
      >
        <Plus size={26} className="text-white" strokeWidth={2.5} />
      </Link>
    </div>
  );
}
