'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ResultCat } from '@/components/game/CatIllustrations';
import { GameCard } from '@/components/game/GameCard';
import { GameScoreboard } from '@/components/game/Scoreboard';
import { RULES_COPY, getCourseById, type ColorKey, type SavedPlayerProfile, type SavedSessionConfig } from '@/lib/game-content';
import { liveApi } from '@/lib/live-api';
import { clearPendingSession, getPendingSession, getPlayerProfile, saveMatchSummary } from '@/lib/storage';
import type { LiveStateResponse } from '@/types/live-game';

function getCountdownLabel(target?: number) {
  if (!target) {
    return null;
  }

  return Math.max(0, Math.ceil((target - Date.now()) / 1000));
}

export default function GamePage() {
  const params = useParams<{ sessionId: string }>();
  const router = useRouter();
  const sessionId = params.sessionId;
  const [profile, setProfile] = useState<SavedPlayerProfile | null>(null);
  const [pending, setPending] = useState<SavedSessionConfig | null>(null);

  const [state, setState] = useState<LiveStateResponse | null>(null);
  const [error, setError] = useState('');
  const [showRules, setShowRules] = useState(true);
  const [submittingReady, setSubmittingReady] = useState(false);
  const [submittingStart, setSubmittingStart] = useState(false);
  const [answerLocked, setAnswerLocked] = useState(false);
  const [nowTick, setNowTick] = useState(() => Date.now());
  const pollRef = useRef<number | null>(null);
  const roundStartSeenRef = useRef<number | undefined>(undefined);
  const answeredRoundRef = useRef<number | null>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setProfile(getPlayerProfile());
      setPending(getPendingSession());
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  const refreshState = useCallback(async () => {
    if (!profile || !pending || pending.id !== sessionId) {
      return;
    }

    try {
      const nextState = await liveApi.getState(sessionId);
      setState(nextState);
      setError('');
    } catch (stateError) {
      setError(stateError instanceof Error ? stateError.message : 'Не удалось получить состояние матча.');
    }
  }, [pending, profile, sessionId]);

  useEffect(() => {
    if (profile === null && pending === null) {
      return;
    }

    if (!profile || !pending || pending.id !== sessionId) {
      router.replace('/');
      return;
    }

    const bootTimeout = window.setTimeout(() => {
      setNowTick(Date.now());
      void refreshState();
    }, 0);

    pollRef.current = window.setInterval(() => {
      setNowTick(Date.now());
      void refreshState();
    }, 700);

    return () => {
      window.clearTimeout(bootTimeout);
      if (pollRef.current) {
        window.clearInterval(pollRef.current);
      }
    };
  }, [pending, profile, refreshState, router, sessionId]);

  const session = state?.session;
  const me = session?.players.find((player) => player.id === profile?.id);
  const currentCourse = getCourseById(session?.settings.courseId ?? 'pink-sprint');
  const countdown = getCountdownLabel(session?.countdownEndsAt);
  const readyToPlay = Boolean(session && me);
  const isOwner = Boolean(profile && session && session.ownerId === profile.id);

  useEffect(() => {
    const roundStartedAt = session?.roundStartedAt;
    if (!roundStartedAt) {
      return;
    }

    if (roundStartedAt !== roundStartSeenRef.current) {
      roundStartSeenRef.current = roundStartedAt;
      answeredRoundRef.current = null;
      setAnswerLocked(false);
    }
  }, [session?.roundStartedAt]);

  const handleReady = async (ready: boolean) => {
    if (!profile || !readyToPlay) {
      return;
    }

    setSubmittingReady(true);

    try {
      await liveApi.setReady(sessionId, profile.id, ready);
      await refreshState();
      window.setTimeout(() => setShowRules(false), 0);
    } catch (readyError) {
      setError(readyError instanceof Error ? readyError.message : 'Не удалось отметить готовность.');
    } finally {
      setSubmittingReady(false);
    }
  };

  const handleStart = async () => {
    if (!profile || !session || session.ownerId !== profile.id) {
      return;
    }

    setSubmittingStart(true);

    try {
      await liveApi.startSession(sessionId, profile.id);
      await refreshState();
      setError('');
    } catch (startError) {
      setError(startError instanceof Error ? startError.message : 'Не удалось запустить матч.');
    } finally {
      setSubmittingStart(false);
    }
  };

  const handleAnswer = async (answer: ColorKey) => {
    if (!profile || !session || !me || !session.currentCard || answerLocked) {
      return;
    }

    if (answeredRoundRef.current === session.roundIndex) {
      return;
    }

    setAnswerLocked(true);
    answeredRoundRef.current = session.roundIndex;

    const reactionTime = session.roundStartedAt ? Math.max(0, Date.now() - session.roundStartedAt) : 0;

    try {
      await liveApi.submitAnswer(sessionId, profile.id, answer, reactionTime);
      await refreshState();
    } catch (submitError) {
      setAnswerLocked(false);
      answeredRoundRef.current = null;
      setError(submitError instanceof Error ? submitError.message : 'Ответ не отправлен.');
    }
  };

  const handleBackToLobby = () => {
    clearPendingSession();
    setPending(null);
    router.push('/');
  };

  useEffect(() => {
    if (!session || session.status !== 'finished') {
      return;
    }

    const alreadySaved = sessionStorage.getItem(`match-saved:${session.id}`);
    if (alreadySaved) {
      return;
    }

    saveMatchSummary({
      id: session.id,
      courseId: session.settings.courseId,
      courseName: session.courseName,
      difficulty: session.difficulty,
      mode: session.settings.mode,
      playedAt: new Date(session.completedAt ?? Date.now()).toISOString(),
      totalCards: session.totalRounds,
      standings: session.players.map((player) => {
        const totalAnswers = player.correctAnswers + player.incorrectAnswers;
        return {
          playerId: player.id,
          playerName: player.name,
          score: player.score,
          averageReactionTime: player.averageReactionTime,
          accuracy: totalAnswers ? Math.round((player.correctAnswers / totalAnswers) * 100) : 0,
          isBot: player.isBot,
        };
      }),
    });

    sessionStorage.setItem(`match-saved:${session.id}`, '1');
    clearPendingSession();
  }, [session]);

  const finalMood = useMemo<'sad' | 'okay' | 'great'>(() => {
    if (!session || !me || session.status !== 'finished') {
      return 'okay';
    }

    const totalAnswers = me.correctAnswers + me.incorrectAnswers;
    const accuracy = totalAnswers ? (me.correctAnswers / totalAnswers) * 100 : 0;

    if (accuracy >= 85 && me.score >= (session.players[0]?.score ?? 0) * 0.9) {
      return 'great';
    }

    if (accuracy < 55) {
      return 'sad';
    }

    return 'okay';
  }, [me, session]);

  if (!profile || !pending || pending.id !== sessionId) {
    return null;
  }

  if (!session || !me) {
    return (
      <main className={`shell theme-${currentCourse.difficulty}`}>
        <div className="page">
          <div className="glass-panel hero-card">
            <div className="text-2xl font-extrabold">Подключаемся к сессии...</div>
            {error && <div className="mt-4 rounded-[20px] bg-rose-100 p-4 text-sm text-rose-700">{error}</div>}
          </div>
        </div>
      </main>
    );
  }

  if (session.status === 'finished') {
    return (
      <main className={`shell theme-${currentCourse.difficulty}`}>
        <div className="page">
          <div className="glass-panel hero-card">
            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
              <div>
                <div className="badge">Матч завершён</div>
                <h1 className="brand-title mt-4 text-5xl font-bold md:text-6xl">
                  {session.players[0]?.name} занимает первое место
                </h1>
                <p className="mt-4 text-lg leading-8 text-[var(--muted)]">
                  Если очки равны, победитель определяется по среднему времени реакции на правильные ответы.
                </p>

                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  {session.players.map((player, index) => {
                    const totalAnswers = player.correctAnswers + player.incorrectAnswers;
                    const accuracy = totalAnswers ? Math.round((player.correctAnswers / totalAnswers) * 100) : 0;

                    return (
                      <div key={player.id} className="metric-card">
                        <div className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--muted)]">
                          #{index + 1}
                        </div>
                        <div className="mt-2 text-2xl font-extrabold">{player.name}</div>
                        <div className="mt-3 space-y-2 text-sm text-[var(--muted)]">
                          <div>Очки: {player.score}</div>
                          <div>Точность: {accuracy}%</div>
                          <div>Средняя реакция: {player.averageReactionTime} мс</div>
                          <div>Самый быстрый ответ: {player.fastestReactionTime} мс</div>
                          <div>Первых ответов: {player.firstAnswers}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button onClick={handleBackToLobby} className="secondary-btn rounded-full px-6 py-4 font-bold">
                    В новое лобби
                  </button>
                  <Link href="/stats" className="primary-btn rounded-full px-6 py-4 font-bold">
                    Открыть статистику
                  </Link>
                </div>
              </div>

              <ResultCat mood={finalMood} />
            </div>
          </div>
        </div>
      </main>
    );
  }

  const timeRemaining =
    session.status === 'playing' && session.roundEndsAt
      ? Math.max(0, session.roundEndsAt - nowTick)
      : currentCourse.timePerCard;

  const isBeforeRoundStart = session.roundStartedAt ? nowTick < session.roundStartedAt : true;
  const isPenaltyActive = me.penaltyUntil > nowTick;
  const modalVisible = showRules && session.status === 'lobby' && !me.ready;

  return (
    <main className={`shell theme-${currentCourse.difficulty}`}>
      <div className="page">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <button onClick={handleBackToLobby} className="ghost-btn rounded-full px-5 py-3 text-sm font-bold">
            Выйти в лобби
          </button>
          <div className="badge">Сессия {session.id}</div>
        </div>

        <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="glass-panel rounded-[32px] p-5">
            <div className="text-sm font-bold uppercase tracking-[0.24em] text-[var(--muted)]">Статус матча</div>
            <div className="mt-2 text-2xl font-extrabold">
              {session.status === 'lobby' && 'Ожидание готовности игроков'}
              {session.status === 'countdown' && `Старт через ${countdown ?? 0}`}
              {session.status === 'playing' && (session.revealAt ? 'Переход к следующей карточке...' : 'Раунд активен')}
            </div>
            <div className="mt-3 text-sm text-[var(--muted)]">
              Код для друзей: <span className="font-extrabold text-[var(--text)]">{session.id}</span>
            </div>
            {session.status === 'lobby' && (
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => void handleReady(true)}
                  disabled={submittingReady || me.ready}
                  className="secondary-btn rounded-full px-5 py-3 text-sm font-bold disabled:opacity-50"
                >
                  {me.ready ? 'Готовность отмечена' : 'Я готов(а)'}
                </button>
                {isOwner && (
                  <button
                    onClick={() => void handleStart()}
                    disabled={!session.canOwnerStart || submittingStart}
                    className="primary-btn rounded-full px-5 py-3 text-sm font-bold disabled:opacity-50"
                  >
                    {submittingStart ? 'Запуск...' : 'Запустить игру'}
                  </button>
                )}
                <div className="basis-full text-xs text-[var(--muted)]">
                  {isOwner
                    ? 'Создатель запускает матч вручную после готовности всех игроков.'
                    : 'Ждём, когда создатель запустит матч после готовности всех игроков.'}
                </div>
              </div>
            )}
          </div>

          <div className="glass-panel rounded-[32px] p-5">
            <div className="text-sm font-bold uppercase tracking-[0.24em] text-[var(--muted)]">Настройки</div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-[var(--muted)]">
              <span className="badge">{session.settings.showColorLabels ? 'Текстовые ответы' : 'Текстовые ответы'}</span>
              <span className="badge">{(session.settings.cardDuration / 1000).toFixed(1)} c на карту</span>
              <span className="badge">{session.settings.withBots ? 'Есть боты' : 'Без ботов'}</span>
            </div>
          </div>
        </div>

        <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <GameCard
            word={session.currentCard?.word ?? '...'}
            inkColor={session.currentCard?.inkColor ?? currentCourse.colors[0]!}
            options={session.colors}
            timeRemaining={timeRemaining}
            timeLimit={session.settings.cardDuration}
            round={session.roundIndex + 1}
            totalRounds={session.totalRounds}
            disabled={
              session.status !== 'playing' ||
              !!session.revealAt ||
              answerLocked ||
              me.hasAnsweredCurrentRound ||
              isBeforeRoundStart
            }
            penaltyActive={isPenaltyActive}
            penaltyType={me.penaltyType}
            showColorLabels={session.settings.showColorLabels}
            onAnswer={handleAnswer}
          />

          <GameScoreboard players={session.players} courseName={session.courseName} />
        </section>

        {error && <div className="mt-5 rounded-[20px] bg-rose-100 p-4 text-sm text-rose-700">{error}</div>}

        {modalVisible && (
          <div className="fixed inset-0 z-20 flex items-center justify-center bg-[rgba(58,12,33,0.38)] p-4">
            <div className="glass-panel max-w-2xl rounded-[36px] p-7">
              <div className="badge">Перед стартом</div>
              <h2 className="brand-title mt-4 text-4xl font-bold">Подтверди готовность к игре</h2>
              <p className="mt-4 text-[var(--muted)]">
                Матч стартует только после того, как все участники подтвердят, что правила понятны, а
                создатель нажмёт кнопку запуска.
              </p>

              <div className="mt-6 rounded-[28px] bg-white/70 p-5">
                <div className="text-sm font-bold uppercase tracking-[0.22em] text-[var(--muted)]">Правила</div>
                <ul className="mt-3 space-y-2 text-sm leading-7 text-[var(--muted)]">
                  {RULES_COPY.map((rule) => (
                    <li key={rule}>{rule}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => void handleReady(true)}
                  disabled={submittingReady}
                  className="primary-btn rounded-full px-6 py-4 font-bold disabled:opacity-50"
                >
                  {me.ready ? 'Готовность подтверждена' : 'Я готов(а)'}
                </button>
                {isOwner && (
                  <button
                    onClick={() => void handleStart()}
                    disabled={!session.canOwnerStart || submittingStart}
                    className="secondary-btn rounded-full px-6 py-4 font-bold disabled:opacity-50"
                  >
                    {submittingStart ? 'Запуск...' : 'Старт от создателя'}
                  </button>
                )}
                <button
                  onClick={() => setShowRules(false)}
                  className="secondary-btn rounded-full px-6 py-4 font-bold"
                >
                  Свернуть правила
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
