import type { Metadata } from 'next';
import './globals.css';
import SessionProvider from '@/components/ui/SessionProvider';

export const metadata: Metadata = {
  title: 'GreenMate',
  description: '함께 치고, 함께 성장하는 우리만의 골프 다이어리',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full">
      <body className="h-full bg-[var(--background)] text-[var(--foreground)] antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
