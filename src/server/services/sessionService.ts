import { db } from '@/server/db';
import {
  gameSessionsTable,
  gameAnswersTable,
  playerGameStatsTable,
  type InsertPlayerGameStats,
} from '@/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { type Answer } from '@/types/game';
import { sortPlayers } from './gameLogic';

export class GameSessionService {
  static async createSession(courseId: string, ownerUserId: string, playerCount: number) {
    const session = await db.insert(gameSessionsTable).values({
      courseId,
      ownerUserId,
      playerCount,
      currentCardIndex: 0,
      isActive: true,
    });

    return session;
  }

  static async getSession(sessionId: string) {
    const session = await db.query.gameSessionsTable.findFirst({
      where: eq(gameSessionsTable.id, sessionId),
    });

    return session;
  }

  static async updateSessionCard(sessionId: string, cardIndex: number) {
    return db
      .update(gameSessionsTable)
      .set({ currentCardIndex: cardIndex })
      .where(eq(gameSessionsTable.id, sessionId));
  }

  static async endSession(sessionId: string) {
    return db
      .update(gameSessionsTable)
      .set({ isActive: false, finishedAt: new Date() })
      .where(eq(gameSessionsTable.id, sessionId));
  }

  static async saveAnswer(answer: Answer) {
    return db.insert(gameAnswersTable).values({
      sessionId: answer.sessionId,
      playerId: answer.playerId,
      cardId: answer.cardId,
      playerAnswer: answer.playerAnswer,
      isCorrect: answer.isCorrect,
      reactionTime: answer.reactionTime,
      answerOrder: answer.answerOrder,
    });
  }

  static async getSessionAnswers(sessionId: string) {
    return db.query.gameAnswersTable.findMany({
      where: eq(gameAnswersTable.sessionId, sessionId),
    });
  }

  static async savePlayerStats(stats: InsertPlayerGameStats | InsertPlayerGameStats[]) {
    if (Array.isArray(stats)) {
      return db.insert(playerGameStatsTable).values(stats);
    }

    return db.insert(playerGameStatsTable).values(stats);
  }

  static async getPlayerSessionStats(sessionId: string, playerId: string) {
    return db.query.playerGameStatsTable.findFirst({
      where: and(
        eq(playerGameStatsTable.sessionId, sessionId),
        eq(playerGameStatsTable.playerId, playerId)
      ),
    });
  }

  static async finalizeGameSession(sessionId: string) {
    const session = await this.getSession(sessionId);
    if (!session) throw new Error('Session not found');

    const players = await db.query.playerGameStatsTable.findMany({
      where: eq(playerGameStatsTable.sessionId, sessionId),
    });

    const winner = [...players].sort(
      (a, b) => b.finalScore - a.finalScore || Number(a.averageReactionTime) - Number(b.averageReactionTime)
    )[0];

    await db.insert(playerGameStatsTable).values(players);
    await this.endSession(sessionId);

    return {
      sessionId,
      winner,
      players: sortPlayers(
        players.map((p) => ({
          playerId: p.playerId,
          playerName: 'Player',
          score: p.finalScore,
          correctAnswers: p.correctAnswers,
          incorrectAnswers: p.incorrectAnswers,
          totalReactionTime: Number(p.averageReactionTime) * p.correctAnswers,
          averageReactionTime: parseFloat(p.averageReactionTime.toString()),
          fastestReactionTime: p.fastestReactionTime,
          firstAnswers: p.firstAnswers,
        }))
      ),
    };
  }
}
