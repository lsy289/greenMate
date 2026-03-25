export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full flex flex-col items-center justify-center bg-[var(--gray-50)] px-5 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-4xl">⛳</span>
          <h1 className="text-2xl font-bold text-[var(--gray-900)] mt-2">GreenMate</h1>
          <p className="text-sm text-[var(--gray-500)] mt-1">함께 치고, 함께 성장하는 골프 다이어리</p>
        </div>
        {children}
      </div>
    </div>
  );
}
