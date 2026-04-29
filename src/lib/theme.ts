'use client';

const THEME_STORAGE_KEY = 'color-match-theme';
const THEME_LIGHT = 'light';
const THEME_DARK = 'dark';

export type Theme = typeof THEME_LIGHT | typeof THEME_DARK;

export function getStoredTheme(): Theme {
  if (typeof window === 'undefined') {
    return THEME_LIGHT;
  }

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === THEME_DARK) {
    return THEME_DARK;
  }
  return THEME_LIGHT;
}

export function saveTheme(theme: Theme) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
}

export function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') {
    return;
  }

  const root = document.documentElement;
  const body = document.body;

  // Удаляем предыдущие классы тем
  root.classList.remove(THEME_LIGHT, THEME_DARK);
  body.classList.remove('theme-dark');

  if (theme === THEME_DARK) {
    root.classList.add(THEME_DARK);
    body.classList.add('theme-dark');
  } else {
    root.classList.add(THEME_LIGHT);
  }
}

export function initializeTheme() {
  const theme = getStoredTheme();
  applyTheme(theme);
  return theme;
}

export function toggleTheme(): Theme {
  const current = getStoredTheme();
  const next = current === THEME_LIGHT ? THEME_DARK : THEME_LIGHT;
  saveTheme(next);
  applyTheme(next);
  return next;
}

// Определение системных предпочтений
export function getSystemTheme(): Theme {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return THEME_LIGHT;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? THEME_DARK : THEME_LIGHT;
}

// Инициализация с учетом системных предпочтений, если тема не сохранена
export function initializeThemeWithSystemFallback() {
  if (typeof window === 'undefined') {
    return THEME_LIGHT;
  }

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === null) {
    // Если тема не сохранена, используем системную
    const systemTheme = getSystemTheme();
    applyTheme(systemTheme);
    return systemTheme;
  }

  return initializeTheme();
}