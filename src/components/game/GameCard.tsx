'use client';

import { COLOR_HEX, COLOR_LABELS, type ColorKey } from '@/lib/game-content';
import type { PenaltyType } from '@/types/live-game';

interface GameCardProps {
  word: string;
  inkColor: ColorKey;
  options: ColorKey[];
  timeRemaining: number;
  timeLimit: number;
  round: number;
  totalRounds: number;
  disabled?: boolean;
  penaltyActive?: boolean;
  penaltyType?: PenaltyType;
  showColorLabels: boolean;
  onAnswer: (answer: ColorKey) => void;
}

export function GameCard({
  word,
  inkColor,
  options,
  timeRemaining,
  timeLimit,
  round,
  totalRounds,
  disabled,
  penaltyActive,
  penaltyType,
  showColorLabels,
  onAnswer,
}: GameCardProps) {
  const progress = Math.max(0, Math.min(100, (timeRemaining / Math.max(1, timeLimit)) * 100));
  const hideButtons = penaltyActive && penaltyType === 'hide_buttons';
  const shake = penaltyActive && penaltyType === 'shake';
  const blur = penaltyActive && penaltyType === 'blur';

  return (
    <section className={`glass-panel rounded-[36px] p-6 md:p-8 ${shake ? 'animate-[wiggle_.4s_ease-in-out_2]' : ''}`}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm font-bold uppercase tracking-[0.24em] text-[var(--muted)]">Текущая карточка</div>
          <div className="mt-2 text-lg font-bold">
            Раунд {round} / {totalRounds}
          </div>
        </div>
        <div className="badge">{(timeRemaining / 1000).toFixed(1)} c</div>
      </div>

      <div className="progress-bar">
        <span style={{ width: `${progress}%` }} />
      </div>

      <div className={`my-10 rounded-[32px] bg-white/70 p-8 text-center transition ${blur ? 'blur-sm' : ''}`}>
        <div className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">Игнорируй слово</div>
        <div className="brand-title mt-6 select-none text-5xl font-extrabold md:text-7xl" style={{ color: COLOR_HEX[inkColor] }}>
          {word}
        </div>
      </div>

      <div className={`grid gap-4 sm:grid-cols-2 xl:grid-cols-3 ${hideButtons ? 'opacity-15 saturate-0' : ''}`}>
        {options.map((option, index) => (
          <button
            key={option}
            type="button"
            disabled={disabled || hideButtons}
            onClick={() => onAnswer(option)}
            className={`secondary-btn rounded-[28px] p-4 ${showColorLabels ? 'text-left' : 'min-h-[116px]'} disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {showColorLabels ? (
              <div className="flex items-center gap-4">
                <span className="h-12 w-12 rounded-2xl shadow-sm" style={{ background: COLOR_HEX[option] }} />
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--muted)]">Ответ {index + 1}</div>
                  <div className="mt-1 text-lg font-extrabold">{COLOR_LABELS[option]}</div>
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <span
                  className="h-16 w-16 rounded-[22px] shadow-sm md:h-20 md:w-20"
                  style={{ background: COLOR_HEX[option] }}
                  aria-label={COLOR_LABELS[option]}
                />
              </div>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
