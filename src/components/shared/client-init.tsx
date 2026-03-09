'use client';

import { useEffect } from 'react';
import { initSeedData } from '@/lib/store';

export function ClientInit() {
  useEffect(() => {
    initSeedData();
  }, []);
  return null;
}
