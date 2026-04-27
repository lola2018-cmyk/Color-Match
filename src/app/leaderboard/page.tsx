'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { buildLeaderboard } from '@/lib/stats';
import { getMatchHistory } from '@/lib/storage';

export default function LeaderboardPage() {
  const rows = useMemo(() => buildLeaderboard(getMatchHistory()), []);

  return (
    <main className="shell">
      <div className="page">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="ghost-btn rounded-full px-5 py-3 text-sm font-bold">
            Назад
          </Link>
          <div className="badge">Локальный рейтинг браузера</div>
        </div>

        <div className="glass-panel hero-card">
          <div className="badge">Global vibe</div>
          <h1 className="brand-title mt-4 text-5xl font-bold md:text-6xl">Рейтинг игроков</h1>
          <p className="mt-4 text-lg text-[var(--muted)]">
            Баланс строится на победах, очках за матчи и общей точности прохождения.
          </p>

          <div className="mt-8 space-y-3">
            {rows.length === 0 && (
              <div className="metric-card text-[var(--muted)]">Пока нет завершённых матчей для таблицы лидеров.</div>
            )}

            {rows.map((player, index) => (
              <div key={player.playerId} className="metric-card flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--muted)]">#{index + 1}</div>
                  <div className="mt-1 text-2xl font-extrabold">{player.playerName}</div>
                </div>

                <div className="flex flex-wrap gap-3 text-sm text-[var(--muted)]">
                  <span className="badge">Рейтинг {player.rating}</span>
                  <span className="badge">Побед {player.wins}</span>
                  <span className="badge">Матчей {player.games}</span>
                  <span className="badge">Точность {player.averageAccuracy}%</span>
                  <span className="badge">Реакция {player.averageReactionTime} мс</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
