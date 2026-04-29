'use client';

interface ScoreboardPlayer {
  id: string;
  name: string;
  score: number;
  averageReactionTime: number;
  correctAnswers: number;
  incorrectAnswers: number;
  firstAnswers: number;
  hasAnsweredCurrentRound?: boolean;
  isBot?: boolean;
  ready?: boolean;
  status?: string;
}

interface GameScoreboardProps {
  players: ScoreboardPlayer[];
  courseName: string;
}

export function GameScoreboard({ players, courseName }: GameScoreboardProps) {
  return (
    <aside className="glass-panel rounded-[36px] p-6">
      <div className="text-sm font-bold uppercase tracking-[0.24em] text-[var(--muted)]">Live leaderboard</div>
      <div className="mt-2 text-2xl font-extrabold">{courseName}</div>

      <div className="mt-5 space-y-3">
        {players.map((player, index) => (
          <div key={player.id} className="rounded-[26px] bg-white/70 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--muted)]">
                  #{index + 1} {player.isBot ? 'bot' : 'player'}
                </div>
                <div className="mt-1 text-lg font-extrabold">{player.name}</div>
                {player.status && (
                  <div className="mt-1 text-sm text-[var(--muted)]">"{player.status}"</div>
                )}
              </div>
              <div className="text-right">
                <div className="text-2xl font-extrabold">{player.score}</div>
                <div className="text-xs text-[var(--muted)]">{player.averageReactionTime || 0} мс</div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2 text-xs text-[var(--muted)]">
              <span className="badge">Верно: {player.correctAnswers}</span>
              <span className="badge">Ошибки: {player.incorrectAnswers}</span>
              <span className="badge">Первые: {player.firstAnswers}</span>
              {player.hasAnsweredCurrentRound && <span className="badge">Ответил</span>}
              {player.ready && <span className="badge">Готов</span>}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
