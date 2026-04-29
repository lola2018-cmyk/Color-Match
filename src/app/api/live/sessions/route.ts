import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createSession, listOpenSessions } from '@/server/live-session-store';

const createSessionSchema = z.object({
  ownerId: z.string().min(1),
  ownerName: z.string().min(1),
  ownerStatus: z.string().optional(),
  settings: z.object({
    courseId: z.string().min(1),
    mode: z.enum(['solo', 'versus']),
    playerCount: z.number().min(1).max(4),
    withBots: z.boolean(),
    showColorLabels: z.boolean(),
    cardDuration: z.number().min(2000).max(9000),
  }),
});

export async function GET() {
  return NextResponse.json({ sessions: listOpenSessions() });
}

export async function POST(request: Request) {
  const parsed = createSessionSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const session = createSession(
    parsed.data.ownerId,
    parsed.data.ownerName,
    parsed.data.settings,
    parsed.data.ownerStatus
  );
  return NextResponse.json({ session });
}
