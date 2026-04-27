import type { MatchSummary } from '@/lib/game-content';

export const buildLeaderboard = (history: MatchSummary[]) => {
  const buckets = new Map<
    string,
    {
      playerName: string;
      rating: number;
      wins: number;
      games: number;
      totalScore: number;
      totalAccuracy: number;
      totalReaction: number;
      samples: number;
    }
  >();

  for (const match of history) {
    const winnerId = match.standings[0]?.playerId;

    for (const entry of match.standings) {
      const current = buckets.get(entry.playerId) ?? {
        playerName: entry.playerName,
        rating: 1000,
        wins: 0,
        games: 0,
        totalScore: 0,
        totalAccuracy: 0,
        totalReaction: 0,
        samples: 0,
      };

      current.games += 1;
      current.totalScore += entry.score;
      current.totalAccuracy += entry.accuracy;
      current.totalReaction += entry.averageReactionTime;
      current.samples += 1;
      current.rating += Math.round(entry.score / 8) + Math.round(entry.accuracy / 10);

      if (entry.playerId === winnerId) {
        current.wins += 1;
        current.rating += 18;
      }

      buckets.set(entry.playerId, current);
    }
  }

  return [...buckets.entries()]
    .map(([playerId, data]) => ({
      playerId,
      playerName: data.playerName,
      rating: data.rating,
      wins: data.wins,
      games: data.games,
      averageScore: data.games ? Math.round(data.totalScore / data.games) : 0,
      averageAccuracy: data.samples ? Math.round(data.totalAccuracy / data.samples) : 0,
      averageReactionTime: data.samples ? Math.round(data.totalReaction / data.samples) : 0,
    }))
    .sort((a, b) => b.rating - a.rating || b.wins - a.wins || a.averageReactionTime - b.averageReactionTime);
};

export const buildProfileStats = (history: MatchSummary[], playerId: string) => {
  const appearances = history
    .map((match) => ({
      match,
      standing: match.standings.find((entry) => entry.playerId === playerId),
    }))
    .filter((item) => item.standing);

  const samples = appearances.length;
  const wins = appearances.filter((item) => item.match.standings[0]?.playerId === playerId).length;
  const totalScore = appearances.reduce((sum, item) => sum + (item.standing?.score ?? 0), 0);
  const totalAccuracy = appearances.reduce((sum, item) => sum + (item.standing?.accuracy ?? 0), 0);
  const totalReaction = appearances.reduce(
    (sum, item) => sum + (item.standing?.averageReactionTime ?? 0),
    0
  );

  return {
    totalGames: samples,
    wins,
    losses: Math.max(0, samples - wins),
    totalScore,
    averageScore: samples ? Math.round(totalScore / samples) : 0,
    averageAccuracy: samples ? Math.round(totalAccuracy / samples) : 0,
    averageReactionTime: samples ? Math.round(totalReaction / samples) : 0,
    fastestReactionTime:
      appearances.reduce((best, item) => Math.min(best, item.standing?.averageReactionTime ?? Number.MAX_SAFE_INTEGER), Number.MAX_SAFE_INTEGER) ===
      Number.MAX_SAFE_INTEGER
        ? 0
        : appearances.reduce(
            (best, item) => Math.min(best, item.standing?.averageReactionTime ?? Number.MAX_SAFE_INTEGER),
            Number.MAX_SAFE_INTEGER
          ),
  };
};
