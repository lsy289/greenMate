'use client';

import { useEffect } from 'react';
import { useBadgeStore } from '@/store/badge-store';

export function useBadges() {
  const { badges, isLoading, error, fetchBadges } = useBadgeStore();

  useEffect(() => {
    fetchBadges();
  }, [fetchBadges]);

  return { badges, isLoading, error };
}
