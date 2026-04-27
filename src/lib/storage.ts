'use client';

import type { MatchSummary, SavedPlayerProfile, SavedSessionConfig } from '@/lib/game-content';

const PLAYER_KEY = 'color-match.player';
const SESSION_KEY = 'color-match.pending-session';
const HISTORY_KEY = 'color-match.match-history';

const readFromSession = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') {
    return fallback;
  }

  const raw = window.sessionStorage.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const readJson = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') {
    return fallback;
  }

  const raw = window.localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

export const savePlayerProfile = (profile: SavedPlayerProfile) => {
  window.sessionStorage.setItem(PLAYER_KEY, JSON.stringify(profile));
};

export const getPlayerProfile = () =>
  readFromSession<SavedPlayerProfile | null>(PLAYER_KEY, null);

export const clearPlayerProfile = () => {
  window.sessionStorage.removeItem(PLAYER_KEY);
};

export const savePendingSession = (config: SavedSessionConfig) => {
  window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(config));
};

export const getPendingSession = () =>
  readFromSession<SavedSessionConfig | null>(SESSION_KEY, null);

export const clearPendingSession = () => {
  window.sessionStorage.removeItem(SESSION_KEY);
};

export const getMatchHistory = () => readJson<MatchSummary[]>(HISTORY_KEY, []);

export const saveMatchSummary = (summary: MatchSummary) => {
  const history = getMatchHistory();
  const nextHistory = [summary, ...history].slice(0, 20);
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));
};
