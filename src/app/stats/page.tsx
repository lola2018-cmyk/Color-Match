'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { buildProfileStats } from '@/lib/stats';
import { getMatchHistory, getPlayerProfile } from '@/lib/storage';

export default function StatsPage() {
  const history = useMemo(() => getMatchHistory(), []);
  const profile = useMemo(() => getPlayerProfile(), []);
  const stats = buildProfileStats(history, profile?.id ?? '');

  return (
    <main className="shell">
      <div className="page">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="ghost-btn rounded-full px-5 py-3 text-sm font-bold">
            Назад
          </Link>
          <div className="badge">{profile?.name ?? 'Гость'}</div>
        </div>

        <div className="glass-panel hero-card">
          <div className="badge">Личный профиль</div>
          <h1 className="brand-title mt-4 text-5xl font-bold md:text-6xl">Статистика игрока</h1>
          <p className="mt-4 text-lg text-[var(--muted)]">
            Сводка формируется по завершённым матчам, сохранённым в истории этого браузера.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="metric-card">
              <div className="text-sm text-[var(--muted)]">Матчей</div>
              <div className="mt-2 text-3xl font-extrabold">{stats.totalGames}</div>
            </div>
            <div className="metric-card">
              <div className="text-sm text-[var(--muted)]">Побед</div>
              <div className="mt-2 text-3xl font-extrabold">{stats.wins}</div>
            </div>
            <div className="metric-card">
              <div className="text-sm text-[var(--muted)]">Средний счёт</div>
              <div className="mt-2 text-3xl font-extrabold">{stats.averageScore}</div>
            </div>
            <div className="metric-card">
              <div className="text-sm text-[var(--muted)]">Точность</div>
              <div className="mt-2 text-3xl font-extrabold">{stats.averageAccuracy}%</div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="metric-card">
              <div className="text-sm text-[var(--muted)]">Среднее время реакции</div>
              <div className="mt-2 text-2xl font-extrabold">{stats.averageReactionTime} мс</div>
            </div>
            <div className="metric-card">
              <div className="text-sm text-[var(--muted)]">Лучшее среднее</div>
              <div className="mt-2 text-2xl font-extrabold">{stats.fastestReactionTime} мс</div>
            </div>
            <div className="metric-card">
              <div className="text-sm text-[var(--muted)]">Общие очки</div>
              <div className="mt-2 text-2xl font-extrabold">{stats.totalScore}</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
