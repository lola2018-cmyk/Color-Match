import { z } from 'zod';
import { publicProcedure, protectedProcedure, router } from '@/server/trpc';
import { GameSessionService } from '@/server/services/sessionService';

export const gameRouter = router({
  createSession: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
        playerCount: z.number().min(2).max(4),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.userId) throw new Error('Unauthorized');
      const session = await GameSessionService.createSession(
        input.courseId,
        ctx.userId,
        input.playerCount
      );
      return session;
    }),

  getSession: publicProcedure.input(z.object({ sessionId: z.string() })).query(async ({ input }) => {
    return GameSessionService.getSession(input.sessionId);
  }),

  submitAnswer: protectedProcedure
    .input(
      z.object({
        sessionId: z.string(),
        cardId: z.string(),
        playerAnswer: z.string(),
        isCorrect: z.boolean(),
        reactionTime: z.number(),
        answerOrder: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.userId) throw new Error('Unauthorized');

      await GameSessionService.saveAnswer({
        playerId: ctx.userId,
        sessionId: input.sessionId,
        cardId: input.cardId,
        playerAnswer: input.playerAnswer,
        isCorrect: input.isCorrect,
        reactionTime: input.reactionTime,
        answerOrder: input.answerOrder,
        timestamp: new Date(),
      });

      return { success: true };
    }),

  endSession: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ input }) => {
      await GameSessionService.endSession(input.sessionId);
      return { success: true };
    }),
});
