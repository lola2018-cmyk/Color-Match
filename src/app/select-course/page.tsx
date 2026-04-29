'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { COURSE_LIBRARY } from '@/lib/game-content';
import { liveApi } from '@/lib/live-api';
import { getPlayerProfile, savePendingSession } from '@/lib/storage';
import type { SessionSettings } from '@/types/live-game';

export default function SelectCoursePage() {
  const router = useRouter();
  const profile = useMemo(() => getPlayerProfile(), []);
  const [selectedCourseId, setSelectedCourseId] = useState(COURSE_LIBRARY[0].id);
  const [playerCount, setPlayerCount] = useState(1);
  const [withBots, setWithBots] = useState(false);
  const [cardDuration, setCardDuration] = useState(COURSE_LIBRARY[0].timePerCard);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const selectedCourse = COURSE_LIBRARY.find((course) => course.id === selectedCourseId) ?? COURSE_LIBRARY[0];

  const handleCreateSession = async () => {
    if (!profile) {
      router.push('/register');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const settings: SessionSettings = {
      courseId: selectedCourse.id,
      mode: playerCount === 1 || withBots ? 'solo' : 'versus',
      playerCount,
      withBots,
      showColorLabels: true,
      cardDuration,
    };

    try {
      const response = await liveApi.createSession(profile.id, profile.name, settings, profile.status);
      savePendingSession({
        id: response.session.id,
        joinedAsPlayerId: profile.id,
        ownerId: response.session.ownerId,
        createdAt: new Date().toISOString(),
      });
      router.push(`/game/${response.session.id}`);
    } catch (sessionError) {
      setError(sessionError instanceof Error ? sessionError.message : 'Не удалось создать матч.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={`shell theme-${selectedCourse.difficulty}`}>
      <div className="page">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Link href="/" className="ghost-btn rounded-full px-5 py-3 text-sm font-bold">
            Назад в лобби
          </Link>
          <div className="flex flex-col items-end gap-1">
            <div className="badge">{profile ? `${profile.avatar} ${profile.name}` : 'Нужна регистрация'}</div>
            {profile?.status && (
              <div className="text-xs text-[var(--muted)]">"{profile.status}"</div>
            )}
          </div>
        </div>

        <div className="mb-8 max-w-3xl">
          <div className="badge">Настройка матча</div>
          <h1 className="brand-title mt-4 text-5xl font-bold md:text-6xl">Собери лобби под своё ТЗ</h1>
          <p className="mt-4 text-lg leading-8 text-[var(--muted)]">
            Здесь задаётся курс, таймер на карточку, число игроков и формат текстовых ответов.
          </p>
        </div>

        <section className="grid gap-5 lg:grid-cols-[1fr_380px]">
          <div className="grid gap-5">
            {COURSE_LIBRARY.map((course) => (
              <button
                key={course.id}
                type="button"
                onClick={() => {
                  setSelectedCourseId(course.id);
                  setCardDuration(course.timePerCard);
                }}
                className="glass-panel rounded-[32px] p-6 text-left transition hover:-translate-y-1"
                style={{ outline: selectedCourseId === course.id ? `3px solid ${course.accent}` : 'none' }}
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold uppercase tracking-[0.22em] text-[var(--muted)]">{course.difficulty}</div>
                    <div className="mt-1 text-3xl font-extrabold">{course.name}</div>
                  </div>
                  <div className="badge">{course.vibe}</div>
                </div>
                <p className="text-[var(--muted)]">{course.description}</p>
              </button>
            ))}
          </div>

          <aside className="glass-panel rounded-[32px] p-6">
            <div className="text-sm font-bold uppercase tracking-[0.24em] text-[var(--muted)]">Параметры сессии</div>
            <h2 className="mt-3 text-3xl font-extrabold">{selectedCourse.name}</h2>

            <div className="mt-5 space-y-5">
              <label className="block">
                <div className="mb-2 text-sm font-semibold text-[var(--muted)]">Количество игроков</div>
                <select
                  className="select"
                  value={playerCount}
                  onChange={(event) => {
                    const nextCount = Number(event.target.value);
                    setPlayerCount(nextCount);
                    if (nextCount === 1) {
                      setWithBots(false);
                    }
                  }}
                >
                  <option value={1}>1 игрок</option>
                  <option value={2}>2 игрока</option>
                  <option value={3}>3 игрока</option>
                  <option value={4}>4 игрока</option>
                </select>
              </label>

              <label className="flex items-start gap-3 rounded-[24px] bg-white/65 p-4">
                <input
                  type="checkbox"
                  checked={withBots}
                  onChange={(event) => setWithBots(event.target.checked)}
                  disabled={playerCount === 1}
                  className="mt-1 h-5 w-5"
                />
                <span>
                  <div className="font-bold">Заполнить свободные места ботами</div>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-[var(--muted)]">
                    <span className="badge">👤 + 🤖 гибридный режим</span>
                    <span className="badge">👥👥 все живые</span>
                    <span className="badge">🤖🤖 только боты</span>
                  </div>
                  <div className="mt-2 text-sm text-[var(--muted)]">Если отключено, матч ждёт только живых игроков.</div>
                </span>
              </label>

              <label className="block rounded-[24px] bg-white/65 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-bold">Время на карточку</div>
                    <div className="text-sm text-[var(--muted)]">Можно ускорить или замедлить смену стимулов.</div>
                  </div>
                  <div className="badge">{(cardDuration / 1000).toFixed(1)} c</div>
                </div>
                <input
                  type="range"
                  min={2000}
                  max={9000}
                  step={500}
                  value={cardDuration}
                  onChange={(event) => setCardDuration(Number(event.target.value))}
                  className="mt-4 w-full"
                />
              </label>
            </div>

            {error && <div className="mt-5 rounded-[20px] bg-rose-100 p-4 text-sm text-rose-700">{error}</div>}

            <button
              onClick={handleCreateSession}
              disabled={isSubmitting}
              className="primary-btn mt-6 w-full rounded-[24px] px-6 py-4 font-extrabold disabled:opacity-50"
            >
              {isSubmitting ? 'Создаём матч...' : 'Создать матч и открыть лобби'}
            </button>
          </aside>
        </section>
      </div>
    </main>
  );
}
