import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { parsePhotos, formatDateShort } from '@/lib/utils';
import { WEATHER_OPTIONS } from '@/lib/constants';
import ScoreBadge from '@/components/ui/ScoreBadge';

export default async function SharePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const round = await prisma.round.findUnique({
    where: { shareToken: token },
    include: { user: { select: { nickname: true } } },
  });

  if (!round) notFound();

  const photos = parsePhotos(round.photos);
  const weather = WEATHER_OPTIONS.find((w) => w.value === round.weather);

  return (
    <div className="min-h-full bg-[var(--gray-50)] flex flex-col items-center py-10 px-5">
      <div className="w-full max-w-sm flex flex-col gap-4">
        {/* 헤더 */}
        <div className="text-center">
          <span className="text-3xl">⛳</span>
          <p className="text-sm text-[var(--gray-500)] mt-1">
            <span className="font-medium text-[var(--primary-500)]">{round.user.nickname}</span>
            님의 라운딩 기록
          </p>
        </div>

        {/* 스코어 카드 */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
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
            <p className="text-sm text-[var(--gray-900)] leading-relaxed whitespace-pre-wrap">{round.memo}</p>
          </div>
        )}

        {/* 사진 */}
        {photos.length > 0 && (
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-xs font-semibold text-[var(--gray-500)] uppercase tracking-wider mb-3">
              사진 ({photos.length})
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {photos.map((url, i) => (
                <div key={i} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img src={url} alt={`사진 ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <Link
          href="/signup"
          className="flex items-center justify-center h-12 bg-[var(--primary-500)] text-white rounded-[20px] font-medium text-sm hover:bg-[var(--primary-700)] transition-colors"
        >
          나도 GreenMate에서 기록하기 🌱
        </Link>
      </div>
    </div>
  );
}
