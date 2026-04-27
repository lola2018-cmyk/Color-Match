import { NextResponse } from 'next/server';
import { z } from 'zod';
import { startSession } from '@/server/live-session-store';

const startSchema = z.object({
  ownerId: z.string().min(1),
});

type Context = {
  params: Promise<{ sessionId: string }>;
};

export async function POST(request: Request, context: Context) {
  const parsed = startSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  try {
    const { sessionId } = await context.params;
    const session = startSession(sessionId, parsed.data.ownerId);
    return NextResponse.json({ session });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Start failed' },
      { status: 400 }
    );
  }
}
