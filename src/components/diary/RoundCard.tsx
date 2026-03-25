import Link from 'next/link';
import { MapPin } from 'lucide-react';
import Card from '@/components/ui/Card';
import ScoreBadge from '@/components/ui/ScoreBadge';
import { formatDateShort } from '@/lib/utils';
import { WEATHER_OPTIONS } from '@/lib/constants';
import type { Round } from '@/types';

interface RoundCardProps {
  round: Round;
}

export default function RoundCard({ round }: RoundCardProps) {
  const weather = WEATHER_OPTIONS.find((w) => w.value === round.weather);

  return (
    <Link href={`/diary/${round.id}`}>
      <Card className="p-4 flex items-start gap-3">
        {/* 날씨 아이콘 */}
        <div className="w-10 h-10 rounded-full bg-[var(--primary-50)] flex items-center justify-center text-xl shrink-0">
          {weather?.icon ?? '⛅'}
        </div>

        {/* 내용 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold text-[var(--gray-900)] truncate">{round.courseName}</span>
            <ScoreBadge score={round.score} size="sm" />
          </div>

          <div className="flex items-center gap-1.5 mt-1 text-xs text-[var(--gray-500)]">
            <MapPin size={12} />
            <span>{formatDateShort(round.date)}</span>
            {weather && <span>· {weather.label}</span>}
          </div>

          {round.memo && (
            <p className="mt-1.5 text-xs text-[var(--gray-500)] truncate">{round.memo}</p>
          )}
        </div>

        {/* 사진 썸네일 */}
        {round.photos && round.photos.length > 0 && (
          <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-gray-100">
            <img
              src={round.photos[0]}
              alt="라운딩 사진"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </Card>
    </Link>
  );
}
