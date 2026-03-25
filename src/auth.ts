import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';

const NaverProvider = {
  id: 'naver',
  name: '네이버',
  type: 'oauth' as const,
  authorization: 'https://nid.naver.com/oauth2.0/authorize?response_type=code',
  token: 'https://nid.naver.com/oauth2.0/token',
  userinfo: {
    url: 'https://openapi.naver.com/v1/nid/me',
    async request({ tokens, provider }: { tokens: { access_token: string }; provider: { userinfo: { url: string } } }) {
      const res = await fetch(provider.userinfo.url, {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });
      const data = await res.json();
      return data.response;
    },
  },
  profile(profile: { id: string; email: string; nickname: string; name: string; profile_image: string }) {
    return {
      id: profile.id,
      email: profile.email,
      name: profile.nickname ?? profile.name,
      image: profile.profile_image,
    };
  },
  clientId: process.env.NAVER_CLIENT_ID,
  clientSecret: process.env.NAVER_CLIENT_SECRET,
  style: { logo: '', bg: '#03C75A', text: '#fff' },
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.password) return null;

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return null;

        return { id: user.id, email: user.email, name: user.nickname };
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    NaverProvider,
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async signIn({ user, account }) {
      // OAuth 로그인 시 DB에 사용자 자동 생성
      if (account?.provider === 'google' || account?.provider === 'naver') {
        if (!user.email) return false;
        const existing = await prisma.user.findUnique({ where: { email: user.email } });
        if (!existing) {
          await prisma.user.create({
            data: {
              email: user.email,
              nickname: user.name ?? user.email.split('@')[0],
            },
          });
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === 'credentials') {
          token.id = user.id;
        } else if (token.email) {
          const dbUser = await prisma.user.findUnique({ where: { email: token.email } });
          token.id = dbUser?.id;
        }
      }
      return token;
    },
    session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
});
