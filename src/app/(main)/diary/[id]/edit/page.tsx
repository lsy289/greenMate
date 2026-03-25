'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import RoundForm from '@/components/diary/RoundForm';
import { useRoundStore } from '@/store/round-store';
import type { Round, RoundFormData } from '@/types';

export default function EditRoundPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { updateRound } = useRoundStore();

  const [round, setRound] = useState<Round | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/rounds/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setRound({ ...data, date: new Date(data.date) });
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [id]);

  async function handleSubmit(data: RoundFormData) {
    await updateRound(id, data);
    router.replace(`/diary/${id}`);
  }

  return (
    <div className="flex flex-col h-full bg-[var(--gray-50)]">
      <header className="flex items-center gap-3 px-4 pt-12 pb-4 bg-white border-b border-gray-100">
        <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft size={22} className="text-[var(--gray-900)]" />
        </button>
        <h1 className="font-semibold text-[var(--gray-900)]">라운딩 수정</h1>
      </header>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-5 flex flex-col gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : round ? (
          <RoundForm initialData={round} onSubmit={handleSubmit} />
        ) : (
          <p className="text-center text-[var(--gray-500)] mt-10">라운딩을 찾을 수 없습니다.</p>
        )}
      </div>
    </div>
  );
}
