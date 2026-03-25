import { create } from 'zustand';
import type { Round, RoundFormData } from '@/types';

interface RoundStore {
  rounds: Round[];
  isLoading: boolean;
  error: string | null;
  fetchRounds: (year: number, month: number) => Promise<void>;
  createRound: (data: RoundFormData) => Promise<Round>;
  updateRound: (id: string, data: Partial<RoundFormData>) => Promise<Round>;
  deleteRound: (id: string) => Promise<void>;
}

export const useRoundStore = create<RoundStore>((set) => ({
  rounds: [],
  isLoading: false,
  error: null,

  fetchRounds: async (year, month) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`/api/rounds?year=${year}&month=${month}`);
      if (!res.ok) throw new Error('라운딩 목록을 불러오지 못했습니다.');
      const data = await res.json();
      set({ rounds: data.map(deserializeRound) });
    } catch (e) {
      set({ error: (e as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  createRound: async (data) => {
    const res = await fetch('/api/rounds', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(serializeFormData(data)),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? '라운딩 저장에 실패했습니다.');
    }
    const created = deserializeRound(await res.json());
    set((state) => ({ rounds: [created, ...state.rounds] }));
    return created;
  },

  updateRound: async (id, data) => {
    const res = await fetch(`/api/rounds/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data.date ? { ...data, date: data.date.toISOString() } : data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? '라운딩 수정에 실패했습니다.');
    }
    const updated = deserializeRound(await res.json());
    set((state) => ({
      rounds: state.rounds.map((r) => (r.id === id ? updated : r)),
    }));
    return updated;
  },

  deleteRound: async (id) => {
    const res = await fetch(`/api/rounds/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? '라운딩 삭제에 실패했습니다.');
    }
    set((state) => ({ rounds: state.rounds.filter((r) => r.id !== id) }));
  },
}));

function serializeFormData(data: RoundFormData) {
  return {
    ...data,
    date: data.date.toISOString(),
    // photos가 string[]인 경우(이미 업로드된 URL) 그대로 전달
    photos: Array.isArray(data.photos) && data.photos.length > 0
      ? (data.photos as unknown as string[])
      : undefined,
  };
}

function deserializeRound(raw: Record<string, unknown>): Round {
  return {
    ...raw,
    date: new Date(raw.date as string),
    createdAt: new Date(raw.createdAt as string),
    updatedAt: new Date(raw.updatedAt as string),
  } as Round;
}
