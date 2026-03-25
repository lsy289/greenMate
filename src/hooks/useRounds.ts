'use client';

import { useEffect } from 'react';
import { useRoundStore } from '@/store/round-store';

export function useRounds(year: number, month: number) {
  const { rounds, isLoading, error, fetchRounds, createRound, updateRound, deleteRound } =
    useRoundStore();

  useEffect(() => {
    fetchRounds(year, month);
  }, [year, month, fetchRounds]);

  return { rounds, isLoading, error, createRound, updateRound, deleteRound };
}
