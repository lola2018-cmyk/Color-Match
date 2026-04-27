import { initTRPC, TRPCError } from '@trpc/server';
import { ZodError } from 'zod';
import { type NextApiRequest, type NextApiResponse } from 'next';

export interface CreateContextOptions {
  req?: NextApiRequest;
  res?: NextApiResponse;
}

export const createContext = async (opts: CreateContextOptions) => {
  const headers = opts.req?.headers;
  const userIdHeader = headers?.['x-user-id'];
  const sessionIdHeader = headers?.['x-session-id'];
  const userId = typeof userIdHeader === 'string' ? userIdHeader : undefined;
  const sessionId = typeof sessionIdHeader === 'string' ? sessionIdHeader : undefined;

  return {
    userId,
    sessionId,
  };
};

type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(async (opts) => {
  if (!opts.ctx.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return opts.next({
    ctx: {
      userId: opts.ctx.userId,
    },
  });
});
