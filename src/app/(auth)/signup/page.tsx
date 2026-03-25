'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import Button from '@/components/ui/Button';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', nickname: '', password: '', confirm: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirm) {
      return setError('비밀번호가 일치하지 않습니다.');
    }

    setLoading(true);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email, nickname: form.nickname, password: form.password }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? '회원가입에 실패했습니다.');
      setLoading(false);
    } else {
      router.replace('/login');
    }
  }

  const inputClass =
    'h-12 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] bg-white';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-bold text-[var(--gray-900)] mb-5">회원가입</h2>

      {/* 소셜 로그인 */}
      <div className="flex flex-col gap-3 mb-5">
        <button
          type="button"
          onClick={() => signIn('google', { callbackUrl: '/diary' })}
          className="flex items-center justify-center gap-3 h-12 rounded-xl border border-gray-200 text-sm font-medium text-[var(--gray-900)] hover:bg-gray-50 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Google로 시작하기
        </button>

        <button
          type="button"
          onClick={() => signIn('naver', { callbackUrl: '/diary' })}
          className="flex items-center justify-center gap-3 h-12 rounded-xl text-sm font-medium text-white transition-colors"
          style={{ backgroundColor: '#03C75A' }}
        >
          <span className="text-white font-bold text-lg leading-none">N</span>
          네이버로 시작하기
        </button>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-[var(--gray-400)]">또는 이메일로 가입</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--gray-900)]">이메일</label>
          <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)}
            placeholder="example@email.com" className={inputClass} required />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--gray-900)]">닉네임</label>
          <input type="text" value={form.nickname} onChange={(e) => update('nickname', e.target.value)}
            placeholder="골퍼 이름" className={inputClass} required />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--gray-900)]">비밀번호</label>
          <input type="password" value={form.password} onChange={(e) => update('password', e.target.value)}
            placeholder="6자 이상" className={inputClass} required />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--gray-900)]">비밀번호 확인</label>
          <input type="password" value={form.confirm} onChange={(e) => update('confirm', e.target.value)}
            placeholder="비밀번호 재입력" className={inputClass} required />
        </div>

        {error && (
          <p className="text-sm text-[var(--error)] bg-red-50 px-4 py-3 rounded-xl">{error}</p>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? '가입 중...' : '회원가입'}
        </Button>
      </form>

      <p className="text-center text-sm text-[var(--gray-500)] mt-5">
        이미 계정이 있으신가요?{' '}
        <Link href="/login" className="text-[var(--primary-500)] font-medium">
          로그인
        </Link>
      </p>
    </div>
  );
}
