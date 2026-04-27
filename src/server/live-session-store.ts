import { BOT_NAMES, createSessionCode, getCourseById, type ColorKey } from '@/lib/game-content';
import { calculatePlayerStats, calculateScore, getBasePoints, sortPlayers } from '@/server/services/gameLogic';
import type { LivePlayer, LiveSession, LiveStateResponse, PenaltyType, SessionSettings } from '@/types/live-game';

declare global {
  var __colorMatchSessions__: Map<string, LiveSession> | undefined;
}

const sessions = globalThis.__colorMatchSessions__ ?? new Map<string, LiveSession>();

if (!globalThis.__colorMatchSessions__) {
  globalThis.__colorMatchSessions__ = sessions;
}

const RULES_MODAL_BUFFER_MS = 800;
const REVEAL_PHASE_MS = 1400;

const now = () => Date.now();

const randomPenalty = (): PenaltyType => {
  const penalties: PenaltyType[] = ['blur', 'hide_buttons', 'shake'];
  return penalties[Math.floor(Math.random() * penalties.length)] ?? 'blur';
};

const cloneSession = (session: LiveSession): LiveSession => structuredClone(session);

const getSessionInternal = (sessionId: string) => {
  const session = sessions.get(sessionId);
  if (!session) {
    throw new Error('Session not found');
  }
  return session;
};

const canOwnerStartSession = (session: LiveSession) =>
  session.status === 'lobby' &&
  session.players.length >= 1 &&
  session.players.every((player) => player.ready);

const startCountdown = (session: LiveSession) => {
  session.status = 'countdown';
  session.countdownEndsAt = now() + 4000;
};

const openRound = (session: LiveSession) => {
  session.status = 'playing';
  session.roundAnswers = [];
  session.roundStartedAt = now() + RULES_MODAL_BUFFER_MS;
  session.roundEndsAt = session.roundStartedAt + session.settings.cardDuration;
  session.revealAt = undefined;
  session.players.forEach((player) => {
    player.penaltyUntil = Math.max(0, player.penaltyUntil);
  });
};

const finishSession = (session: LiveSession) => {
  session.status = 'finished';
  session.completedAt = now();
  session.roundStartedAt = undefined;
  session.roundEndsAt = undefined;
  session.revealAt = undefined;
};

const moveToNextRound = (session: LiveSession) => {
  if (session.roundIndex >= session.cards.length - 1) {
    finishSession(session);
    return;
  }

  session.roundIndex += 1;
  openRound(session);
};

const closeRoundIfNeeded = (session: LiveSession) => {
  if (session.status !== 'playing') {
    return;
  }

  const timeIsUp = typeof session.roundEndsAt === 'number' && now() >= session.roundEndsAt;
  const everyoneAnswered = session.roundAnswers.length >= session.players.length;

  if (!timeIsUp && !everyoneAnswered) {
    return;
  }

  if (!session.revealAt) {
    session.revealAt = now() + REVEAL_PHASE_MS;
    return;
  }

  if (now() >= session.revealAt) {
    moveToNextRound(session);
  }
};

const runBots = (session: LiveSession) => {
  if (!session.settings.withBots || session.status !== 'playing' || !session.roundStartedAt || !session.roundEndsAt) {
    return;
  }

  const card = session.cards[session.roundIndex];
  if (!card) {
    return;
  }

  const elapsed = now() - session.roundStartedAt;
  if (elapsed < 0) {
    return;
  }

  const tuning =
    session.difficulty === 'easy'
      ? { min: 900, max: 2200, errorChance: 0.08 }
      : session.difficulty === 'medium'
      ? { min: 700, max: 1800, errorChance: 0.15 }
      : { min: 500, max: 1500, errorChance: 0.22 };

  for (const bot of session.players.filter((player) => player.isBot)) {
    const alreadyAnswered = session.roundAnswers.some((answer) => answer.playerId === bot.id);
    if (alreadyAnswered) {
      continue;
    }

    const targetReaction = tuning.min + Math.floor(Math.random() * (tuning.max - tuning.min));
    if (elapsed < targetReaction) {
      continue;
    }

    const mistake = Math.random() < tuning.errorChance;
    const answer = mistake
      ? session.colors.find((color) => color !== card.inkColor) ?? session.colors[0] ?? card.inkColor
      : card.inkColor;

    submitAnswerInternal(session, bot.id, answer, Math.min(targetReaction, session.settings.cardDuration));
  }
};

export const reconcileSession = (sessionId: string) => {
  const session = getSessionInternal(sessionId);

  if (session.status === 'countdown' && session.countdownEndsAt && now() >= session.countdownEndsAt) {
    openRound(session);
  }

  if (session.status === 'playing') {
    runBots(session);
    closeRoundIfNeeded(session);
  }

  return session;
};

export const createSession = (ownerId: string, ownerName: string, settings: SessionSettings) => {
  const course = getCourseById(settings.courseId);
  const id = createSessionCode();

  const players: LivePlayer[] = [
    {
      id: ownerId,
      name: ownerName,
      ready: false,
      score: 0,
      answers: [],
      penaltyUntil: 0,
    },
  ];

  if (settings.withBots) {
    const botCount = Math.max(0, settings.playerCount - 1);
    for (let index = 0; index < botCount; index += 1) {
      players.push({
        id: `bot-${id}-${index + 1}`,
        name: BOT_NAMES[index] ?? `Bot ${index + 1}`,
        ready: true,
        isBot: true,
        score: 0,
        answers: [],
        penaltyUntil: 0,
      });
    }
  }

  const session: LiveSession = {
    id,
    ownerId,
    createdAt: now(),
    status: 'lobby',
    settings,
    courseName: course.name,
    difficulty: course.difficulty,
    colors: course.colors,
    cards: course.cards.slice(0, course.cardsCount).map((card, index) => ({
      id: `${course.id}-${index + 1}`,
      word: card.word,
      inkColor: card.inkColor,
    })),
    players,
    roundIndex: 0,
    roundAnswers: [],
  };

  sessions.set(id, session);
  return cloneSession(session);
};

export const joinSession = (sessionId: string, playerId: string, playerName: string) => {
  const session = getSessionInternal(sessionId);
  reconcileSession(sessionId);

  if (session.status !== 'lobby') {
    throw new Error('Session already started');
  }

  const existingPlayer = session.players.find((player) => player.id === playerId);
  if (existingPlayer) {
    existingPlayer.name = playerName;
    return cloneSession(session);
  }

  const humanPlayers = session.players.filter((player) => !player.isBot);
  if (humanPlayers.length >= session.settings.playerCount) {
    throw new Error('Session is full');
  }

  session.players.push({
    id: playerId,
    name: playerName,
    ready: false,
    score: 0,
    answers: [],
    penaltyUntil: 0,
  });

  return cloneSession(session);
};

export const setPlayerReady = (sessionId: string, playerId: string, ready: boolean) => {
  const session = getSessionInternal(sessionId);
  const player = session.players.find((entry) => entry.id === playerId);
  if (!player) {
    throw new Error('Player not found');
  }

  player.ready = ready;
  return cloneSession(session);
};

export const startSession = (sessionId: string, ownerId: string) => {
  const session = getSessionInternal(sessionId);

  if (session.ownerId !== ownerId) {
    throw new Error('Only the lobby creator can start the game');
  }

  if (!canOwnerStartSession(session)) {
    throw new Error('All players must confirm readiness before start');
  }

  startCountdown(session);
  return cloneSession(session);
};

const submitAnswerInternal = (session: LiveSession, playerId: string, answer: ColorKey, reactionTime: number) => {
  const player = session.players.find((entry) => entry.id === playerId);
  const card = session.cards[session.roundIndex];
  if (!player || !card || session.status !== 'playing') {
    return;
  }

  const alreadyAnswered = session.roundAnswers.some((entry) => entry.playerId === playerId);
  if (alreadyAnswered) {
    return;
  }

  const isCorrect = answer === card.inkColor;
  const answerOrder = isCorrect
    ? session.roundAnswers.filter((entry) => entry.isCorrect).length + 1
    : 0;

  session.roundAnswers.push({
    playerId,
    answer,
    isCorrect,
    reactionTime,
    answerOrder,
    answeredAt: now(),
  });

  player.answers.push({
    roundIndex: session.roundIndex,
    answer,
    isCorrect,
    reactionTime,
    answerOrder,
    answeredAt: now(),
  });

  if (isCorrect) {
    player.score += calculateScore(
      getBasePoints(session.difficulty),
      Math.max(0, session.settings.cardDuration - reactionTime),
      session.settings.cardDuration,
      answerOrder
    );
  } else {
    player.score = Math.max(0, player.score - 5);

    for (const rival of session.players) {
      if (rival.id !== playerId) {
        rival.penaltyUntil = now() + 1500;
        rival.penaltyType = randomPenalty();
      }
    }
  }
};

export const submitAnswer = (sessionId: string, playerId: string, answer: ColorKey, reactionTime: number) => {
  const session = reconcileSession(sessionId);

  if (!session.roundStartedAt || now() < session.roundStartedAt) {
    throw new Error('Round has not started yet');
  }

  submitAnswerInternal(session, playerId, answer, reactionTime);
  closeRoundIfNeeded(session);
  return cloneSession(session);
};

export const getSessionState = (sessionId: string): LiveStateResponse => {
  const session = reconcileSession(sessionId);
  const currentCard = session.cards[session.roundIndex];

  return {
    session: {
      id: session.id,
      ownerId: session.ownerId,
      status: session.status,
      settings: session.settings,
      courseName: session.courseName,
      difficulty: session.difficulty,
      roundIndex: session.roundIndex,
      totalRounds: session.cards.length,
      countdownEndsAt: session.countdownEndsAt,
      roundStartedAt: session.roundStartedAt,
      roundEndsAt: session.roundEndsAt,
      revealAt: session.revealAt,
      currentCard,
      colors: session.colors,
      players: sortPlayers(
        session.players.map((player) => {
          const stats = calculatePlayerStats(player.answers);
          return {
            id: player.id,
            name: player.name,
            isBot: player.isBot,
            ready: player.ready,
            score: player.score,
            penaltyUntil: player.penaltyUntil,
            penaltyType: player.penaltyType,
            correctAnswers: stats.correctAnswers,
            incorrectAnswers: stats.incorrectAnswers,
            averageReactionTime: Math.round(stats.averageReactionTime),
            fastestReactionTime: stats.fastestReactionTime,
            firstAnswers: stats.firstAnswers,
            hasAnsweredCurrentRound: session.roundAnswers.some((entry) => entry.playerId === player.id),
          };
        })
      ),
      roundAnswers: session.roundAnswers,
      completedAt: session.completedAt,
      canOwnerStart: canOwnerStartSession(session),
    },
  };
};

export const listOpenSessions = () => {
  return [...sessions.values()]
    .filter((session) => session.status === 'lobby')
    .map((session) => ({
      id: session.id,
      courseName: session.courseName,
      difficulty: session.difficulty,
      playerCount: session.settings.playerCount,
      playersJoined: session.players.filter((player) => !player.isBot).length,
      withBots: session.settings.withBots,
    }));
};
