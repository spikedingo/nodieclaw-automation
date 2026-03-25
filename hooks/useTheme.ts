'use client';

import { useState, useEffect, useCallback } from 'react';
import { Theme } from '@/types';

const STORAGE_KEY = 'checkmate_theme';

function loadTheme(): Theme {
  if (typeof window === 'undefined') return 'system';
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === 'light' || raw === 'dark' || raw === 'system') return raw;
  } catch {
    // ignore
  }
  return 'system';
}

function applyTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;
  const html = document.documentElement;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = theme === 'dark' || (theme === 'system' && prefersDark);
  html.classList.toggle('dark', isDark);
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('system');

  // Initialize from localStorage and apply class to <html>
  useEffect(() => {
    const saved = loadTheme();
    setThemeState(saved);
    applyTheme(saved);

    // Listen for system preference changes when in 'system' mode
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (saved === 'system') applyTheme('system');
    };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
    applyTheme(newTheme);
  }, []);

  /** Toggle between light and dark (skips 'system') */
  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  // Derive current effective mode for the icon
  const isDark =
    theme === 'dark' ||
    (theme === 'system' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  return { theme, setTheme, toggleTheme, isDark };
}
