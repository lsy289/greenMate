'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', nickname: '', password: '', confirm: '' });
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
      body: JSON.stringify({ username: form.username, nickname: form.nickname, password: form.password }),
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

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--gray-900)]">아이디</label>
          <input type="text" value={form.username} onChange={(e) => update('username', e.target.value)}
            placeholder="4자 이상 영문/숫자" className={inputClass} required />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--gray-900)]">닉네임</label>
          <input type="text" value={form.nickname} onChange={(e) => update('nickname', e.target.value)}
            placeholder="표시될 이름" className={inputClass} required />
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
