import { NextResponse } from 'next/server';
import { getSessionState } from '@/server/live-session-store';

type Context = {
  params: Promise<{ sessionId: string }>;
};

export async function GET(_: Request, context: Context) {
  try {
    const { sessionId } = await context.params;
    return NextResponse.json(getSessionState(sessionId));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Session error' },
      { status: 404 }
    );
  }
}
