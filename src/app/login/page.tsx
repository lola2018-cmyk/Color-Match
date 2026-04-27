'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { savePlayerProfile } from '@/lib/storage';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

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
          <div className="badge">Demo auth</div>
          <h1 className="brand-title mt-4 text-5xl font-bold">Вход</h1>
          <p className="mt-4 text-[var(--muted)]">Для демо-сборки вход сохраняет локальный профиль игрока.</p>

          <div className="mt-8 space-y-4">
            <input className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Имя" />
            <input className="field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <button onClick={handleSubmit} className="primary-btn w-full rounded-[24px] px-6 py-4 font-extrabold">
              Войти
            </button>
            <Link href="/register" className="ghost-btn block rounded-[24px] px-6 py-4 text-center font-bold">
              Нет аккаунта? Регистрация
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
