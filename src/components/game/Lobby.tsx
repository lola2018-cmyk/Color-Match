'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { HeroCatComputer } from '@/components/game/CatIllustrations';
import { liveApi } from '@/lib/live-api';
import { getPlayerProfile, savePendingSession } from '@/lib/storage';

type OpenSession = {
  id: string;
  courseName: string;
  difficulty: string;
  playerCount: number;
  playersJoined: number;
  withBots: boolean;
};

export default function GameLobby() {
  const router = useRouter();
  const profile = useMemo(() => getPlayerProfile(), []);
  const [joinCode, setJoinCode] = useState('');
  const [sessions, setSessions] = useState<OpenSession[]>([]);
  const [error, setError] = useState('');
  const [busyCode, setBusyCode] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadSessions = async () => {
      try {
        const response = await liveApi.listSessions();
        if (isMounted) {
          setSessions(response.sessions as OpenSession[]);
        }
      } catch {
        if (isMounted) {
          setSessions([]);
        }
      }
    };

    loadSessions();
    const interval = window.setInterval(loadSessions, 2500);

    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, []);

  const handleJoin = async (sessionId: string) => {
    if (!profile) {
      router.push('/register');
      return;
    }

    setBusyCode(sessionId);
    setError('');

    try {
      await liveApi.joinSession(sessionId, profile.id, profile.name);
      savePendingSession({
        id: sessionId,
        joinedAsPlayerId: profile.id,
        ownerId: undefined,
        createdAt: new Date().toISOString(),
      });
      router.push(`/game/${sessionId}`);
    } catch (joinError) {
      setError(joinError instanceof Error ? joinError.message : 'Не удалось войти в сессию.');
    } finally {
      setBusyCode('');
    }
  };

  return (
    <main className="shell">
      <div className="page">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="badge">Stroop effect • live lobby • pink stress lab</div>
          <div className="flex gap-3">
            <Link href="/stats" className="secondary-btn rounded-full px-5 py-3 text-sm font-bold">
              Моя статистика
            </Link>
            <Link href="/leaderboard" className="ghost-btn rounded-full px-5 py-3 text-sm font-bold">
              Рейтинг
            </Link>
          </div>
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="glass-panel hero-card">
            <div className="mb-5 flex flex-wrap gap-3">
              <div className="badge">2-4 игрока</div>
              <div className="badge">живые лобби + боты</div>
              <div className="badge">эффект Струпа</div>
            </div>

            <h1 className="brand-title text-5xl font-bold md:text-7xl">
              Соревновательный
              <br />
              Color Match
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">
              Тест Струпа проверяет, как мозг справляется с конфликтом между чтением слова и восприятием
              цвета. Когда написано «КРАСНЫЙ», но чернила синие, приходится подавлять автоматическое
              чтение и быстро выбирать правильный сенсорный сигнал.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="metric-card">
                <div className="text-sm text-[var(--muted)]">Что тренирует</div>
                <div className="mt-2 text-xl font-extrabold">Внимание и торможение</div>
              </div>
              <div className="metric-card">
                <div className="text-sm text-[var(--muted)]">Что решает</div>
                <div className="mt-2 text-xl font-extrabold">Реакция под стрессом</div>
              </div>
              <div className="metric-card">
                <div className="text-sm text-[var(--muted)]">Что опасно</div>
                <div className="mt-2 text-xl font-extrabold">Помехи и спешка</div>
              </div>
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_280px]">
              <div className="rounded-[32px] bg-white/65 p-5">
                <h2 className="text-xl font-extrabold">Как проходит матч</h2>
                <ul className="mt-4 space-y-2 text-sm leading-7 text-[var(--muted)]">
                  <li>Все игроки видят одну и ту же карточку одновременно.</li>
                  <li>Правильный ответ считается только по цвету чернил.</li>
                  <li>Первый верный ответ получает максимальный бонус за скорость.</li>
                  <li>Неверный ответ включает у остальных временную визуальную помеху.</li>
                </ul>
              </div>
              <HeroCatComputer />
            </div>
          </div>

          <div className="glass-panel hero-card">
            <div className="mb-4">
              <div className="text-sm font-bold uppercase tracking-[0.28em] text-[var(--muted)]">Лобби</div>
              <div className="mt-2 text-3xl font-extrabold">
                {profile ? `Привет, ${profile.name}` : 'Сначала регистрация'}
              </div>
            </div>

            {!profile && (
              <div className="rounded-[28px] bg-white/70 p-5 text-[var(--muted)]">
                Без регистрации в игру попасть нельзя. Сначала создай профиль, потом сможешь создавать матч
                или заходить в существующее лобби.
                <div className="mt-4 flex gap-3">
                  <Link href="/register" className="primary-btn rounded-full px-5 py-3 text-sm font-bold">
                    Регистрация
                  </Link>
                  <Link href="/login" className="secondary-btn rounded-full px-5 py-3 text-sm font-bold">
                    Вход
                  </Link>
                </div>
              </div>
            )}

            {profile && (
              <>
                <button
                  onClick={() => router.push('/select-course')}
                  className="primary-btn w-full rounded-[26px] px-6 py-4 font-extrabold"
                >
                  Создать новый матч
                </button>

                <div className="mt-6 rounded-[28px] bg-white/65 p-5">
                  <div className="text-sm font-bold uppercase tracking-[0.22em] text-[var(--muted)]">Войти по коду</div>
                  <div className="mt-3 flex gap-3">
                    <input
                      value={joinCode}
                      onChange={(event) => setJoinCode(event.target.value.toUpperCase())}
                      placeholder="Например ABC123"
                      className="field"
                    />
                    <button
                      onClick={() => handleJoin(joinCode)}
                      className="secondary-btn rounded-[20px] px-5 py-3 font-bold"
                    >
                      Войти
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className="mt-6">
              <div className="text-sm font-bold uppercase tracking-[0.22em] text-[var(--muted)]">Открытые сессии</div>
              <div className="mt-4 space-y-3">
                {sessions.length === 0 && (
                  <div className="rounded-[24px] bg-white/60 p-4 text-sm text-[var(--muted)]">
                    Пока нет открытых лобби. Можно создать своё.
                  </div>
                )}

                {sessions.map((session) => (
                  <div key={session.id} className="rounded-[24px] bg-white/70 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--muted)]">
                          {session.difficulty}
                        </div>
                        <div className="mt-1 text-lg font-extrabold">{session.courseName}</div>
                      </div>
                      <div className="badge">{session.id}</div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-[var(--muted)]">
                      <span className="badge">Игроков: {session.playersJoined}/{session.playerCount}</span>
                      <span className="badge">{session.withBots ? 'С ботами' : 'Только люди'}</span>
                    </div>
                    <button
                      onClick={() => handleJoin(session.id)}
                      disabled={!profile || busyCode === session.id}
                      className="secondary-btn mt-4 rounded-full px-5 py-3 text-sm font-bold disabled:opacity-50"
                    >
                      {busyCode === session.id ? 'Подключение...' : 'Присоединиться'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {error && <div className="mt-4 rounded-[20px] bg-rose-100 p-4 text-sm text-rose-700">{error}</div>}
          </div>
        </section>
      </div>
    </main>
  );
}
