import type { ColorKey, Mode } from '@/lib/game-content';
import type { Difficulty } from '@/types/game';

export type LiveSessionStatus = 'lobby' | 'countdown' | 'playing' | 'finished';
export type PenaltyType = 'blur' | 'hide_buttons' | 'shake';

export interface SessionSettings {
  courseId: string;
  mode: Mode;
  playerCount: number;
  withBots: boolean;
  showColorLabels: boolean;
  cardDuration: number;
}

export interface LiveAnswerLog {
  roundIndex: number;
  answer: ColorKey;
  isCorrect: boolean;
  reactionTime: number;
  answerOrder: number;
  answeredAt: number;
}

export interface LivePlayer {
  id: string;
  name: string;
  isBot?: boolean;
  ready: boolean;
  score: number;
  answers: LiveAnswerLog[];
  penaltyUntil: number;
  penaltyType?: PenaltyType;
  status?: string;
}

export interface RoundAnswerState {
  playerId: string;
  answer: ColorKey;
  isCorrect: boolean;
  reactionTime: number;
  answerOrder: number;
  answeredAt: number;
}

export interface LiveSession {
  id: string;
  ownerId: string;
  createdAt: number;
  status: LiveSessionStatus;
  settings: SessionSettings;
  courseName: string;
  difficulty: Difficulty;
  colors: ColorKey[];
  cards: Array<{
    id: string;
    word: string;
    inkColor: ColorKey;
  }>;
  players: LivePlayer[];
  roundIndex: number;
  countdownEndsAt?: number;
  roundStartedAt?: number;
  roundEndsAt?: number;
  revealAt?: number;
  roundAnswers: RoundAnswerState[];
  completedAt?: number;
}

export interface LiveStateResponse {
  session: {
    id: string;
    ownerId: string;
    status: LiveSessionStatus;
    settings: SessionSettings;
    courseName: string;
    difficulty: Difficulty;
    roundIndex: number;
    totalRounds: number;
    countdownEndsAt?: number;
    roundStartedAt?: number;
    roundEndsAt?: number;
    revealAt?: number;
    currentCard?: {
      id: string;
      word: string;
      inkColor: ColorKey;
    };
    colors: ColorKey[];
    players: Array<{
      id: string;
      name: string;
      isBot?: boolean;
      ready: boolean;
      score: number;
      penaltyUntil: number;
      penaltyType?: PenaltyType;
      correctAnswers: number;
      incorrectAnswers: number;
      averageReactionTime: number;
      fastestReactionTime: number;
      firstAnswers: number;
      hasAnsweredCurrentRound: boolean;
      status?: string;
    }>;
    roundAnswers: RoundAnswerState[];
    completedAt?: number;
    canOwnerStart: boolean;
  };
}
