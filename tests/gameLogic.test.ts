import { describe, expect, it } from 'vitest';
import {
  applyIncorrectPenalty,
  calculatePlayerStats,
  calculateRating,
  calculateScore,
  generateAnswerOptions,
  getBasePoints,
  sortPlayers,
} from '@/server/services/gameLogic';

describe('gameLogic', () => {
  it('calculates score with full first-place speed bonus', () => {
    expect(calculateScore(20, 2000, 4000, 1)).toBe(30);
  });

  it('reduces only the bonus portion for slower answer order', () => {
    expect(calculateScore(20, 2000, 4000, 2)).toBe(25);
    expect(calculateScore(20, 2000, 4000, 3)).toBe(22);
    expect(calculateScore(20, 2000, 4000, 4)).toBe(20);
  });

  it('never lets incorrect penalty drop score below zero', () => {
    expect(applyIncorrectPenalty(3)).toBe(0);
    expect(applyIncorrectPenalty(19)).toBe(14);
  });

  it('returns base points by difficulty', () => {
    expect(getBasePoints('easy')).toBe(10);
    expect(getBasePoints('medium')).toBe(20);
    expect(getBasePoints('hard')).toBe(30);
  });

  it('generates answer options including the correct answer and difficulty count', () => {
    const options = generateAnswerOptions('green', 'medium');
    expect(options).toContain('green');
    expect(options).toHaveLength(5);
    expect(new Set(options).size).toBe(5);
  });

  it('sorts by score and then by average reaction time', () => {
    const sorted = sortPlayers([
      {
        playerId: '1',
        playerName: 'Alice',
        score: 100,
        correctAnswers: 5,
        incorrectAnswers: 2,
        totalReactionTime: 1800,
        averageReactionTime: 450,
        fastestReactionTime: 290,
        firstAnswers: 2,
      },
      {
        playerId: '2',
        playerName: 'Bella',
        score: 100,
        correctAnswers: 5,
        incorrectAnswers: 2,
        totalReactionTime: 1600,
        averageReactionTime: 400,
        fastestReactionTime: 260,
        firstAnswers: 1,
      },
    ]);

    expect(sorted[0]?.playerId).toBe('2');
  });

  it('summarises player stats from answer history', () => {
    const stats = calculatePlayerStats([
      { isCorrect: true, reactionTime: 420, answerOrder: 1 },
      { isCorrect: false, reactionTime: 900, answerOrder: 3 },
      { isCorrect: true, reactionTime: 360, answerOrder: 2 },
    ]);

    expect(stats.correctAnswers).toBe(2);
    expect(stats.incorrectAnswers).toBe(1);
    expect(stats.firstAnswers).toBe(1);
    expect(Math.round(stats.averageReactionTime)).toBe(390);
    expect(stats.fastestReactionTime).toBe(360);
  });

  it('updates rating upward on win and downward on loss', () => {
    expect(calculateRating(1000, 1000, true)).toBeGreaterThan(1000);
    expect(calculateRating(1000, 1000, false)).toBeLessThan(1000);
  });
});
