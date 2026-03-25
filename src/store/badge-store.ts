import { create } from 'zustand';
import type { Badge, UserBadge } from '@/types';

export interface UserBadgeWithDetail extends UserBadge {
  badge: Badge;
}

interface BadgeStore {
  badges: UserBadgeWithDetail[];
  isLoading: boolean;
  error: string | null;
  fetchBadges: () => Promise<void>;
}

export const useBadgeStore = create<BadgeStore>((set) => ({
  badges: [],
  isLoading: false,
  error: null,

  fetchBadges: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch('/api/user/badges');
      if (!res.ok) throw new Error('배지 정보를 불러오지 못했습니다.');
      const data = await res.json();
      set({
        badges: data.map((b: Record<string, unknown>) => ({
          ...b,
          earnedAt: new Date(b.earnedAt as string),
        })),
      });
    } catch (e) {
      set({ error: (e as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
