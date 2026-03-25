'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import RoundForm from '@/components/diary/RoundForm';
import { useRoundStore } from '@/store/round-store';
import type { RoundFormData } from '@/types';

export default function NewRoundPage() {
  const router = useRouter();
  const { createRound } = useRoundStore();

  async function handleSubmit(data: RoundFormData) {
    const round = await createRound(data);
    router.replace(`/diary/${round.id}`);
  }

  return (
    <div className="flex flex-col h-full bg-[var(--gray-50)]">
      <header className="flex items-center gap-3 px-4 pt-12 pb-4 bg-white border-b border-gray-100">
        <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft size={22} className="text-[var(--gray-900)]" />
        </button>
        <h1 className="font-semibold text-[var(--gray-900)]">라운딩 기록</h1>
      </header>

      <div className="flex-1 overflow-y-auto">
        <RoundForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
