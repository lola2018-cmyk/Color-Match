'use client';

import type { SessionSettings } from '@/types/live-game';
import type { ColorKey } from '@/lib/game-content';

const parseJson = async <T,>(response: Response): Promise<T> => {
  const payload = (await response.json()) as T & { error?: string };
  if (!response.ok && 'error' in payload && payload.error) {
    throw new Error(payload.error);
  }
  return payload;
};

export const liveApi = {
  async listSessions() {
    return parseJson<{ sessions: Array<{ id: string; courseName: string; difficulty: string; playerCount: number; playersJoined: number; withBots: boolean }> }>(
      await fetch('/api/live/sessions', { cache: 'no-store' })
    );
  },
  async createSession(ownerId: string, ownerName: string, settings: SessionSettings) {
    return parseJson<{ session: { id: string; ownerId: string } }>(
      await fetch('/api/live/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ownerId, ownerName, settings }),
      })
    );
  },
  async joinSession(sessionId: string, playerId: string, playerName: string) {
    return parseJson<{ session: { id: string } }>(
      await fetch(`/api/live/sessions/${sessionId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, playerName }),
      })
    );
  },
  async getState(sessionId: string) {
    return parseJson<import('@/types/live-game').LiveStateResponse>(
      await fetch(`/api/live/sessions/${sessionId}`, { cache: 'no-store' })
    );
  },
  async setReady(sessionId: string, playerId: string, ready: boolean) {
    return parseJson<{ session: { id: string } }>(
      await fetch(`/api/live/sessions/${sessionId}/ready`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, ready }),
      })
    );
  },
  async startSession(sessionId: string, ownerId: string) {
    return parseJson<{ session: { id: string } }>(
      await fetch(`/api/live/sessions/${sessionId}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ownerId }),
      })
    );
  },
  async submitAnswer(sessionId: string, playerId: string, answer: ColorKey, reactionTime: number) {
    return parseJson<{ session: { id: string } }>(
      await fetch(`/api/live/sessions/${sessionId}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, answer, reactionTime }),
      })
    );
  },
};
