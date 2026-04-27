import { NextResponse } from 'next/server';
import { z } from 'zod';
import { submitAnswer } from '@/server/live-session-store';

const answerSchema = z.object({
  playerId: z.string().min(1),
  answer: z.enum(['red', 'blue', 'green', 'yellow', 'purple', 'orange']),
  reactionTime: z.number().min(0).max(10000),
});

type Context = {
  params: Promise<{ sessionId: string }>;
};

export async function POST(request: Request, context: Context) {
  const parsed = answerSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  try {
    const { sessionId } = await context.params;
    const session = submitAnswer(sessionId, parsed.data.playerId, parsed.data.answer, parsed.data.reactionTime);
    return NextResponse.json({ session });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Answer failed' },
      { status: 400 }
    );
  }
}
