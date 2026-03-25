import TabBar from '@/components/ui/TabBar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-full max-w-md mx-auto" suppressHydrationWarning>
      <main className="flex-1 overflow-y-auto pb-20">{children}</main>
      <TabBar />
    </div>
  );
}
