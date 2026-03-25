import type { NextAuthConfig } from 'next-auth';

// Edge Runtime 호환 설정 (DB 없음) — 미들웨어 전용
export const authConfig: NextAuthConfig = {
  providers: [],
  session: { strategy: 'jwt' },
  pages: { signIn: '/login', error: '/login' },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const PUBLIC_PATHS = ['/login', '/signup', '/share', '/api/auth', '/api/upload'];
      const isPublic = PUBLIC_PATHS.some((p) => nextUrl.pathname.startsWith(p));
      if (isPublic) return true;
      return isLoggedIn;
    },
  },
};
