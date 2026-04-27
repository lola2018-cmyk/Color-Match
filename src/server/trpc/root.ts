import { router } from '@/server/trpc';
import { courseRouter } from './routes/courses';
import { gameRouter } from './routes/game';

export const appRouter = router({
  course: courseRouter,
  game: gameRouter,
});

export type AppRouter = typeof appRouter;
