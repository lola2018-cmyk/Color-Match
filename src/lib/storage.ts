'use client';

import type { MatchSummary, SavedAccount, SavedPlayerProfile, SavedSessionConfig } from '@/lib/game-content';

const PLAYER_KEY = 'color-match.player';
const SESSION_KEY = 'color-match.pending-session';
const HISTORY_KEY = 'color-match.match-history';
const ACCOUNTS_KEY = 'color-match.accounts';

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

const readFromLocal = <T,>(key: string, fallback: T): T => {
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

export const getAccounts = () => readFromLocal<SavedAccount[]>(ACCOUNTS_KEY, []);

const saveAccounts = (accounts: SavedAccount[]) => {
  window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
};

export const registerAccount = (account: SavedAccount) => {
  const accounts = getAccounts();
  const exists = accounts.some((item) => item.email.toLowerCase() === account.email.toLowerCase());

  if (exists) {
    throw new Error('Пользователь с таким email уже существует.');
  }

  saveAccounts([...accounts, account]);
};

export const loginAccount = (email: string, password: string) => {
  const account = getAccounts().find((item) => item.email.toLowerCase() === email.toLowerCase());
  if (!account || account.password !== password) {
    throw new Error('Неверный email или пароль.');
  }

  return account;
};

export const savePlayerProfile = (profile: SavedPlayerProfile) => {
  window.sessionStorage.setItem(PLAYER_KEY, JSON.stringify(profile));
};

export const getPlayerProfile = () => readFromSession<SavedPlayerProfile | null>(PLAYER_KEY, null);

export const clearPlayerProfile = () => {
  window.sessionStorage.removeItem(PLAYER_KEY);
};

export const savePendingSession = (config: SavedSessionConfig) => {
  window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(config));
};

export const getPendingSession = () => readFromSession<SavedSessionConfig | null>(SESSION_KEY, null);

export const clearPendingSession = () => {
  window.sessionStorage.removeItem(SESSION_KEY);
};

export const logoutPlayer = () => {
  clearPendingSession();
  clearPlayerProfile();
};

export const updatePlayerStatus = (status: string) => {
  const profile = getPlayerProfile();
  if (!profile) {
    return;
  }

  const nextProfile = { ...profile, status };
  savePlayerProfile(nextProfile);

  const accounts = getAccounts();
  const nextAccounts = accounts.map((account) =>
    account.id === profile.id ? { ...account, status } : account
  );
  saveAccounts(nextAccounts);
};

export const getMatchHistory = () => readFromLocal<MatchSummary[]>(HISTORY_KEY, []);

export const saveMatchSummary = (summary: MatchSummary) => {
  const history = getMatchHistory();
  const nextHistory = [summary, ...history].slice(0, 20);
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));
};
