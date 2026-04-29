'use client';

import { useEffect } from 'react';
import { initializeThemeWithSystemFallback } from '@/lib/theme';

export function ThemeInitializer() {
  useEffect(() => {
    initializeThemeWithSystemFallback();
  }, []);

  return null;
}