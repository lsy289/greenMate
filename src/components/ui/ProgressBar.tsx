import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number; // 0~100
  className?: string;
  color?: 'primary' | 'amber';
}

const colorStyles = {
  primary: 'bg-[var(--primary-500)]',
  amber: 'bg-[var(--amber-500)]',
};

export default function ProgressBar({ value, className, color = 'primary' }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn('w-full bg-[var(--gray-100)] rounded-full h-2 overflow-hidden', className)}>
      <div
        className={cn('h-full rounded-full transition-all duration-500', colorStyles[color])}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
