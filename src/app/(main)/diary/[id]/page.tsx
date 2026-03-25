'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Pencil, Trash2, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import ScoreBadge from '@/components/ui/ScoreBadge';
import Button from '@/components/ui/Button';
import { WEATHER_OPTIONS } from '@/lib/constants';
import { formatDateShort } from '@/lib/utils';
import { useRoundStore } from '@/store/round-store';
import type { Round } from '@/types';

export default function RoundDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { deleteRound } = useRoundStore();

  const [round, setRound] = useState<Round | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [shareToast, setShareToast] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/rounds/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setRound({ ...data, date: new Date(data.date) });
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [id]);

  async function handleShare() {
    const res = await fetch(`/api/rounds/${id}/share`, { method: 'POST' });
    const data = await res.json();
    if (!res.ok) return;
    const url = `${window.location.origin}/share/${data.token}`;
    if (navigator.share) {
      await navigator.share({ title: '내 라운딩 기록', url });
    } else {
      await navigator.clipboard.writeText(url);
      setShareToast('링크가 복사되었습니다!');
      setTimeout(() => setShareToast(null), 2500);
    }
  }

  async function handleDelete() {
    if (!round) return;
    await deleteRound(round.id);
    router.push('/diary');
  }

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="h-16 bg-white border-b border-gray-100 animate-pulse" />
        <div className="p-5 flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!round) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <span className="text-4xl">😢</span>
        <p className="text-[var(--gray-500)]">라운딩을 찾을 수 없습니다.</p>
        <Button variant="ghost" onClick={() => router.back()}>돌아가기</Button>
      </div>
    );
  }

  const weather = WEATHER_OPTIONS.find((w) => w.value === round.weather);
  const photos = round.photos ?? [];

  return (
    <div className="flex flex-col h-full bg-[var(--gray-50)]">
      {/* 상단 네비게이션 바 */}
      <header className="flex items-center justify-between px-4 pt-12 pb-4 bg-white border-b border-gray-100">
        <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft size={22} className="text-[var(--gray-900)]" />
        </button>
        <span className="font-semibold text-[var(--gray-900)]">라운딩 상세</span>
        <div className="flex items-center gap-1">
          <button onClick={handleShare} className="p-2 rounded-full hover:bg-gray-100">
            <Share2 size={18} className="text-[var(--primary-500)]" />
          </button>
          <button
            onClick={() => router.push(`/diary/${id}/edit`)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <Pencil size={18} className="text-[var(--gray-500)]" />
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <Trash2 size={18} className="text-[var(--error)]" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4">
        {/* 스코어 카드 */}
        <div className="bg-white rounded-xl p-5 flex items-center justify-between shadow-sm border border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-[var(--gray-900)]">{round.courseName}</h2>
            <div className="flex items-center gap-2 mt-1 text-sm text-[var(--gray-500)]">
              <span>{formatDateShort(round.date)}</span>
              <span>·</span>
              <span>{weather?.icon} {weather?.label}</span>
            </div>
          </div>
          <ScoreBadge score={round.score} size="lg" />
        </div>

        {/* 메모 */}
        {round.memo && (
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-xs font-semibold text-[var(--gray-500)] uppercase tracking-wider mb-2">메모</h3>
            <p className="text-sm text-[var(--gray-900)] leading-relaxed whitespace-pre-wrap">
              {round.memo}
            </p>
          </div>
        )}

        {/* 사진 갤러리 */}
        {photos.length > 0 && (
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-xs font-semibold text-[var(--gray-500)] uppercase tracking-wider mb-3">
              사진 ({photos.length})
            </h3>
            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={photos[photoIndex]}
                alt={`라운딩 사진 ${photoIndex + 1}`}
                className="w-full h-full object-cover"
              />
              {photos.length > 1 && (
                <>
                  <button
                    onClick={() => setPhotoIndex((i) => Math.max(0, i - 1))}
                    disabled={photoIndex === 0}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center disabled:opacity-30"
                  >
                    <ChevronLeft size={18} className="text-white" />
                  </button>
                  <button
                    onClick={() => setPhotoIndex((i) => Math.min(photos.length - 1, i + 1))}
                    disabled={photoIndex === photos.length - 1}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center disabled:opacity-30"
                  >
                    <ChevronRight size={18} className="text-white" />
                  </button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {photos.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPhotoIndex(i)}
                        className={`w-1.5 h-1.5 rounded-full transition-colors ${
                          i === photoIndex ? 'bg-white' : 'bg-white/40'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 공유 토스트 */}
      {shareToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 bg-[var(--gray-900)] text-white text-sm px-4 py-2.5 rounded-full shadow-lg z-50 animate-in fade-in">
          {shareToast}
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-t-2xl p-6 pb-8">
            <h3 className="text-base font-bold text-[var(--gray-900)] mb-2">라운딩 삭제</h3>
            <p className="text-sm text-[var(--gray-500)] mb-6">
              이 라운딩 기록을 삭제할까요? 삭제 후 복구할 수 없습니다.
            </p>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setShowDeleteConfirm(false)}
              >
                취소
              </Button>
              <Button variant="danger" className="flex-1" onClick={handleDelete}>
                삭제
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
