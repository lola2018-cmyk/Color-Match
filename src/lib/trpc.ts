import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@/server/trpc/root';

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/trpc`,
      async headers() {
        return {
          'x-trpc-source': 'nextjs-react',
        };
      },
    }),
  ],
});
