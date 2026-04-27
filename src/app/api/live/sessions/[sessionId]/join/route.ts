import { NextResponse } from 'next/server';
import { z } from 'zod';
import { joinSession } from '@/server/live-session-store';

const joinSchema = z.object({
  playerId: z.string().min(1),
  playerName: z.string().min(1),
});

type Context = {
  params: Promise<{ sessionId: string }>;
};

export async function POST(request: Request, context: Context) {
  const parsed = joinSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  try {
    const { sessionId } = await context.params;
    const session = joinSession(sessionId, parsed.data.playerId, parsed.data.playerName);
    return NextResponse.json({ session });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Join failed' },
      { status: 400 }
    );
  }
}
