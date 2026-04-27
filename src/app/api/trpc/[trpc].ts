import { createNextApiHandler } from '@trpc/server/adapters/next';
import { appRouter } from '@/server/trpc/root';
import { createContext } from '@/server/trpc';

export default createNextApiHandler({
  router: appRouter,
  createContext,
  onError: ({ path, error }) => {
    console.error(`Error in tRPC handler on path "${path}":`, error);
  },
});
