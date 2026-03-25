'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="flex items-center gap-2 text-sm text-[var(--error)] hover:opacity-80 transition-opacity"
    >
      <LogOut size={16} />
      로그아웃
    </button>
  );
}
