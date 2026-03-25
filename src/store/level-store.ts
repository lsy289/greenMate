import { create } from 'zustand';
import type { UserLevel } from '@/types';

interface LevelStore {
  level: UserLevel | null;
  isLoading: boolean;
  error: string | null;
  fetchLevel: () => Promise<void>;
}

export const useLevelStore = create<LevelStore>((set) => ({
  level: null,
  isLoading: false,
  error: null,

  fetchLevel: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch('/api/user/level');
      if (!res.ok) throw new Error('레벨 정보를 불러오지 못했습니다.');
      const data = await res.json();
      set({
        level: {
          ...data,
          updatedAt: new Date(data.updatedAt),
        },
      });
    } catch (e) {
      set({ error: (e as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
