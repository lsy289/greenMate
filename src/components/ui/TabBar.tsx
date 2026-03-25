'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, BarChart2, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const TABS = [
  { href: '/diary', icon: BookOpen, label: '다이어리' },
  { href: '/stats', icon: BarChart2, label: '통계' },
  { href: '/profile', icon: User, label: '프로필' },
];

export default function TabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 safe-area-pb">
      <ul className="flex">
        {TABS.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={cn(
                  'flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors',
                  active ? 'text-[var(--primary-500)]' : 'text-[var(--gray-500)]'
                )}
              >
                <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
