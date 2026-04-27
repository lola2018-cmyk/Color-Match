export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Card {
  id: string;
  word: string;
  inkColor: string;
  correctAnswer: string;
  difficulty: Difficulty;
  timeLimit: number;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  difficulty: Difficulty;
  cards: Card[];
  timePerCard: number;
}

export interface PlayerSession {
  playerId: string;
  playerName: string;
  score: number;
  correctAnswers: number;
  incorrectAnswers: number;
  totalReactionTime: number;
  averageReactionTime: number;
  fastestReactionTime: number;
  firstAnswers: number;
  isReady?: boolean;
  isAlive?: boolean;
  isBot?: boolean;
}

export interface GameSession {
  id: string;
  courseId: string;
  players: PlayerSession[];
  currentCardIndex: number;
  currentCard: Card | null;
  cardStartTime: Date;
  isActive: boolean;
  createdAt: Date;
  finishedAt?: Date;
  results?: GameResult;
}

export interface Answer {
  sessionId: string;
  playerId: string;
  cardId: string;
  playerAnswer: string;
  isCorrect: boolean;
  reactionTime: number;
  answerOrder: number;
  timestamp: Date;
}

export interface GameResult {
  sessionId: string;
  winner: PlayerSession;
  players: PlayerSession[];
}

export interface VisualPenalty {
  type: 'blur' | 'hide_buttons' | 'invert_colors';
  duration: number;
  intensity?: number;
}

export const DIFFICULTIES: Record<Difficulty, { colors: number; basePoints: number }> = {
  easy: { colors: 3, basePoints: 10 },
  medium: { colors: 5, basePoints: 20 },
  hard: { colors: 6, basePoints: 30 },
};

export const BONUS_MULTIPLIERS = [1, 0.5, 0.25, 0] as const;

export const INCORRECT_ANSWER_PENALTY = 5;
export const VISUAL_PENALTY_DURATION = 1800;
