import type { ReactNode } from 'react';

function CatFrame({
  face,
  accessory,
  caption,
}: {
  face: ReactNode;
  accessory?: ReactNode;
  caption: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-[36px] bg-[linear-gradient(160deg,#fff3f8_0%,#ffdbe8_55%,#ffeef4_100%)] p-6 shadow-[0_28px_80px_rgba(255,112,161,0.18)]">
      <div className="absolute right-4 top-4 h-20 w-20 rounded-full bg-white/50 blur-2xl" />
      <div className="relative mx-auto max-w-[260px]">
        <svg viewBox="0 0 260 220" className="w-full">
          <rect x="45" y="132" width="170" height="48" rx="16" fill="#ffb3cf" />
          <rect x="30" y="82" width="126" height="78" rx="14" fill="#ff8bb7" />
          <rect x="36" y="88" width="114" height="58" rx="10" fill="#fff7fb" />
          <rect x="81" y="163" width="24" height="34" rx="10" fill="#c97d9b" />
          <rect x="156" y="163" width="24" height="34" rx="10" fill="#c97d9b" />
          <ellipse cx="186" cy="60" rx="44" ry="40" fill="#ffd1a9" />
          <path d="M150 40 166 14l14 28" fill="#ffd1a9" />
          <path d="M193 41 210 12l13 30" fill="#ffd1a9" />
          <ellipse cx="172" cy="60" rx="5" ry="8" fill="#60311c" />
          <ellipse cx="200" cy="60" rx="5" ry="8" fill="#60311c" />
          <path d="M182 76c8 8 15 8 23 0" stroke="#8a4b33" strokeWidth="5" strokeLinecap="round" fill="none" />
          <ellipse cx="186" cy="72" rx="8" ry="6" fill="#ff9bbd" />
          <path d="M152 95c-28 16-29 41-15 52" stroke="#ffd1a9" strokeWidth="12" strokeLinecap="round" fill="none" />
          <path d="M212 95c28 14 31 39 18 50" stroke="#ffd1a9" strokeWidth="12" strokeLinecap="round" fill="none" />
          {face}
          {accessory}
        </svg>
      </div>
      <p className="mt-3 text-center text-sm font-semibold text-[var(--muted)]">{caption}</p>
    </div>
  );
}

export function HeroCatComputer() {
  return (
    <CatFrame
      caption="Котик следит, чтобы ты не перепутала слово и цвет."
      accessory={
        <>
          <rect x="76" y="104" width="34" height="21" rx="8" fill="#fff" />
          <rect x="112" y="104" width="34" height="21" rx="8" fill="#fff" />
          <circle cx="94" cy="114" r="5" fill="#6f3a58" />
          <circle cx="129" cy="114" r="5" fill="#6f3a58" />
          <path d="M111 114h-5" stroke="#6f3a58" strokeWidth="3" strokeLinecap="round" />
        </>
      }
      face={
        <>
          <rect x="74" y="105" width="72" height="8" rx="4" fill="#ff7bac" opacity="0.45" />
          <circle cx="179" cy="147" r="8" fill="#ff7bac" />
          <circle cx="199" cy="147" r="8" fill="#7ec8ff" />
        </>
      }
    />
  );
}

export function ResultCat({ mood }: { mood: 'sad' | 'okay' | 'great' }) {
  if (mood === 'sad') {
    return (
      <CatFrame
        caption="Грустный котик верит, что следующая серия будет точнее."
        face={<path d="M182 84c8-6 16-6 24 0" stroke="#8a4b33" strokeWidth="5" strokeLinecap="round" fill="none" />}
      />
    );
  }

  if (mood === 'great') {
    return (
      <CatFrame
        caption="Весёлый котик в восторге от твоей реакции."
        face={
          <>
            <path d="M170 50c5-7 11-7 16 0" stroke="#60311c" strokeWidth="4" strokeLinecap="round" />
            <path d="M194 50c5-7 11-7 16 0" stroke="#60311c" strokeWidth="4" strokeLinecap="round" />
            <path d="M176 79c10 12 19 12 29 0" stroke="#8a4b33" strokeWidth="5" strokeLinecap="round" fill="none" />
            <circle cx="230" cy="52" r="10" fill="#ffb703" />
          </>
        }
      />
    );
  }

  return (
    <CatFrame
      caption="Обычный котик одобряет результат и ждёт реванш."
      face={<path d="M176 78c6 4 13 6 21 0" stroke="#8a4b33" strokeWidth="5" strokeLinecap="round" fill="none" />}
    />
  );
}
