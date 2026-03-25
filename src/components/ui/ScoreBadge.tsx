import { getScoreBadgeColor } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

const colorStyles = {
  green: 'bg-[var(--primary-50)] text-[var(--primary-700)]',
  blue: 'bg-blue-50 text-blue-700',
  red: 'bg-red-50 text-[var(--error)]',
};

const sizeStyles = {
  sm: 'h-6 px-2.5 text-xs',
  md: 'h-8 px-3 text-sm',
  lg: 'h-10 px-4 text-base',
};

export default function ScoreBadge({ score, size = 'md' }: ScoreBadgeProps) {
  const color = getScoreBadgeColor(score);

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center font-bold rounded-[16px]',
        colorStyles[color],
        sizeStyles[size]
      )}
    >
      {score}타
    </span>
  );
}
