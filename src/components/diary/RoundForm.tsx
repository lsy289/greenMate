'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import PhotoUploader from './PhotoUploader';
import CourseSearchInput from './CourseSearchInput';
import { WEATHER_OPTIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { Round, RoundFormData, WeatherType } from '@/types';

interface RoundFormProps {
  initialData?: Round;
  onSubmit: (data: RoundFormData) => Promise<void>;
}

export default function RoundForm({ initialData, onSubmit }: RoundFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];

  const [date, setDate] = useState(
    initialData ? initialData.date.toISOString().split('T')[0] : today
  );
  const [courseName, setCourseName] = useState(initialData?.courseName ?? '');
  const [courseAddress, setCourseAddress] = useState(initialData?.courseAddress ?? '');
  const [weather, setWeather] = useState<WeatherType>(initialData?.weather ?? 'sunny');
  const [score, setScore] = useState(initialData?.score?.toString() ?? '');
  const [memo, setMemo] = useState(initialData?.memo ?? '');
  const [photos, setPhotos] = useState<string[]>(initialData?.photos ?? []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const scoreNum = Number(score);

    if (!courseName.trim()) return setError('골프장 이름을 입력해주세요.');
    if (!score || isNaN(scoreNum) || scoreNum < 1 || scoreNum > 300) {
      return setError('스코어는 1~300 사이여야 합니다.');
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit({
        date: new Date(date),
        courseName: courseName.trim(),
        courseAddress: courseAddress || undefined,
        weather,
        score: scoreNum,
        memo: memo.trim() || undefined,
        photos: photos.length > 0 ? (photos as unknown as File[]) : undefined,
      });
    } catch (err) {
      setError((err as Error).message);
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-5 py-5">
      {/* 날짜 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[var(--gray-900)]">날짜</label>
        <input
          type="date"
          value={date}
          max={today}
          onChange={(e) => setDate(e.target.value)}
          className="h-12 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] bg-white"
          required
        />
      </div>

      {/* 골프장 이름 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[var(--gray-900)]">골프장</label>
        <CourseSearchInput
          value={courseName}
          onChange={(v) => { setCourseName(v); if (!v) setCourseAddress(''); }}
          onSelect={(name, address) => { setCourseName(name); setCourseAddress(address); }}
          className="h-12 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] bg-white w-full"
        />
      </div>

      {/* 날씨 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[var(--gray-900)]">날씨</label>
        <div className="flex gap-2">
          {WEATHER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setWeather(opt.value)}
              className={cn(
                'flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl border text-xs font-medium transition-colors',
                weather === opt.value
                  ? 'border-[var(--primary-500)] bg-[var(--primary-50)] text-[var(--primary-700)]'
                  : 'border-gray-200 bg-white text-[var(--gray-500)]'
              )}
            >
              <span className="text-xl">{opt.icon}</span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 스코어 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[var(--gray-900)]">총 스코어</label>
        <input
          type="number"
          placeholder="예: 96"
          value={score}
          min={1}
          max={300}
          onChange={(e) => setScore(e.target.value)}
          className="h-12 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] bg-white"
          required
        />
      </div>

      {/* 메모 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[var(--gray-900)]">
          메모 <span className="text-[var(--gray-500)] font-normal">(선택)</span>
        </label>
        <textarea
          placeholder="오늘 라운딩 메모를 남겨보세요..."
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          rows={4}
          className="px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] bg-white resize-none leading-relaxed"
        />
      </div>

      {/* 사진 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[var(--gray-900)]">
          사진 <span className="text-[var(--gray-500)] font-normal">(선택, 최대 10장)</span>
        </label>
        <PhotoUploader value={photos} onChange={setPhotos} />
      </div>

      {/* 에러 메시지 */}
      {error && (
        <p className="text-sm text-[var(--error)] bg-red-50 px-4 py-3 rounded-xl">{error}</p>
      )}

      {/* 버튼 */}
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          className="flex-1"
          onClick={() => router.back()}
        >
          취소
        </Button>
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {isSubmitting ? '저장 중...' : initialData ? '수정하기' : '기록하기'}
        </Button>
      </div>
    </form>
  );
}
