import { cn } from '@/lib/utils';
import { type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const variantStyles = {
  primary: 'bg-[var(--primary-500)] text-white hover:bg-[var(--primary-700)] active:bg-[var(--primary-700)]',
  secondary: 'bg-[var(--gray-100)] text-[var(--gray-900)] hover:bg-gray-200',
  ghost: 'bg-transparent text-[var(--gray-500)] hover:bg-[var(--gray-100)]',
  danger: 'bg-[var(--error)] text-white hover:opacity-90',
};

const sizeStyles = {
  sm: 'h-8 px-4 text-sm',
  md: 'h-11 px-6 text-sm',
  lg: 'h-14 px-8 text-base',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-[20px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
