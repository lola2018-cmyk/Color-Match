'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { savePlayerProfile } from '@/lib/storage';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    savePlayerProfile({
      id: `player-${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim() || 'Pink Player',
      email: email.trim() || 'player@color.match',
    });
    router.push('/');
  };

  return (
    <main className="shell">
      <div className="page max-w-2xl">
        <div className="glass-panel hero-card">
          <div className="badge">Create profile</div>
          <h1 className="brand-title mt-4 text-5xl font-bold">Регистрация</h1>
          <p className="mt-4 text-[var(--muted)]">
            Здесь создаётся локальный профиль игрока. Для курсовой это можно заменить на better-auth.
          </p>

          <div className="mt-8 space-y-4">
            <input className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Имя" />
            <input className="field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <button onClick={handleSubmit} className="primary-btn w-full rounded-[24px] px-6 py-4 font-extrabold">
              Создать профиль
            </button>
            <Link href="/login" className="ghost-btn block rounded-[24px] px-6 py-4 text-center font-bold">
              Уже есть профиль? Войти
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
