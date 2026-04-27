import { NextResponse } from 'next/server';
import { z } from 'zod';
import { setPlayerReady } from '@/server/live-session-store';

const readySchema = z.object({
  playerId: z.string().min(1),
  ready: z.boolean(),
});

type Context = {
  params: Promise<{ sessionId: string }>;
};

export async function POST(request: Request, context: Context) {
  const parsed = readySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  try {
    const { sessionId } = await context.params;
    const session = setPlayerReady(sessionId, parsed.data.playerId, parsed.data.ready);
    return NextResponse.json({ session });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Ready update failed' },
      { status: 400 }
    );
  }
}
