'use client';

import { useEffect } from 'react';
import { useLevelStore } from '@/store/level-store';

export function useLevel() {
  const { level, isLoading, error, fetchLevel } = useLevelStore();

  useEffect(() => {
    fetchLevel();
  }, [fetchLevel]);

  return { level, isLoading, error };
}
