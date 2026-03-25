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

function resolveIsDark(theme: Theme): boolean {
  if (typeof window === 'undefined') return false;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return theme === 'dark' || (theme === 'system' && prefersDark);
}

function applyTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;
  const html = document.documentElement;
  html.classList.toggle('dark', resolveIsDark(theme));
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('system');
  // isDark is always false on the server; updated on the client after mount.
  // This avoids hydration mismatches caused by window.matchMedia being unavailable on the server.
  const [isDark, setIsDark] = useState(false);

  // Initialize from localStorage and apply class to <html>
  useEffect(() => {
    const saved = loadTheme();
    setThemeState(saved);
    applyTheme(saved);
    setIsDark(resolveIsDark(saved));

    // Listen for system preference changes when in 'system' mode
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (saved === 'system') {
        applyTheme('system');
        setIsDark(resolveIsDark('system'));
      }
    };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
    applyTheme(newTheme);
    setIsDark(resolveIsDark(newTheme));
  }, []);

  /** Toggle between light and dark (skips 'system') */
  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  return { theme, setTheme, toggleTheme, isDark };
}
