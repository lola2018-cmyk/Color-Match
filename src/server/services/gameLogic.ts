import { BONUS_MULTIPLIERS, DIFFICULTIES, INCORRECT_ANSWER_PENALTY, type Difficulty, type PlayerSession } from '@/types/game';

const ALL_COLORS = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

export const calculateScore = (
  basePoints: number,
  remainingTime: number,
  totalTime: number,
  answerOrder: number
): number => {
  const safeRemaining = Math.max(0, remainingTime);
  const safeTotal = Math.max(1, totalTime);
  const speedBonus = (safeRemaining / safeTotal) * basePoints;
  const multiplier = BONUS_MULTIPLIERS[Math.min(Math.max(answerOrder - 1, 0), BONUS_MULTIPLIERS.length - 1)];

  return Math.max(0, Math.floor(basePoints + speedBonus * multiplier));
};

export const applyIncorrectPenalty = (score: number) => Math.max(0, score - INCORRECT_ANSWER_PENALTY);

export const getBasePoints = (difficulty: Difficulty): number => DIFFICULTIES[difficulty].basePoints;

export const getColorCount = (difficulty: Difficulty): number => DIFFICULTIES[difficulty].colors;

export const calculateRating = (currentRating: number, opponentRating: number, won: boolean): number => {
  const k = 32;
  const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - currentRating) / 400));
  return Math.max(0, currentRating + Math.round(k * ((won ? 1 : 0) - expectedScore)));
};

export const generateAnswerOptions = (correctAnswer: string, difficulty: Difficulty): string[] => {
  const pool = ALL_COLORS.filter((color) => color !== correctAnswer)
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.max(0, getColorCount(difficulty) - 1));

  return [correctAnswer, ...pool].sort(() => Math.random() - 0.5);
};

export const sortPlayers = <T extends Pick<PlayerSession, 'score' | 'averageReactionTime'>>(players: T[]): T[] =>
  [...players].sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }

    return a.averageReactionTime - b.averageReactionTime;
  });

export const calculatePlayerStats = (
  answers: Array<{ isCorrect: boolean; reactionTime: number; answerOrder?: number }>
): Pick<PlayerSession, 'correctAnswers' | 'incorrectAnswers' | 'averageReactionTime' | 'fastestReactionTime' | 'firstAnswers' | 'totalReactionTime'> => {
  const correct = answers.filter((answer) => answer.isCorrect);
  const totalReactionTime = correct.reduce((sum, answer) => sum + answer.reactionTime, 0);

  return {
    correctAnswers: correct.length,
    incorrectAnswers: answers.length - correct.length,
    averageReactionTime: correct.length ? totalReactionTime / correct.length : 0,
    fastestReactionTime: correct.length ? Math.min(...correct.map((answer) => answer.reactionTime)) : 0,
    firstAnswers: answers.filter((answer) => answer.isCorrect && answer.answerOrder === 1).length,
    totalReactionTime,
  };
};

export const generateGameId = (): string => Math.random().toString(36).slice(2, 10).toUpperCase();
